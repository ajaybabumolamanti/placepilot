import os
import json
import time
import datetime
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import engine, Base, get_db, check_db_health
from app.models import (
    User, Department, Company, Question, Attempt, 
    InterviewSession, Resume, CodingSubmission, GuidanceVideo,
    Job, JobApplication, Notification, ResumeProfile, AssessmentSession, CareerPlan
)
from app.schemas import (
    UserCreate, UserResponse, LoginRequest, LoginResponse, UserUpdateAcademic,
    DepartmentResponse, CompanyResponse, QuestionResponse,
    AttemptSubmit, CodingExecuteRequest, AudioTextEvaluateRequest,
    JobCreate, JobResponse, JobApplicationCreate, JobApplicationResponse, JobApplicationStatusUpdate,
    ResumeProfileCreate, ResumeSummaryGenerateRequest, ResumeAnalyzeRequest, ResumeAnalyzeResponse,
    AssessmentSubmitRequest, AssessmentReportResponse,
    EligibilityResponse, EligibilityItem,
    CareerGuidanceChatRequest, CareerRoadmapRequest,
    NotificationResponse
)
from app.services.code_runner import run_code_sandbox
from app.services.ai_service import (
    evaluate_interview_response, generate_resume_summary,
    analyze_resume_deep, career_guidance_advisor
)
from app.services.resume_parser import parse_resume_text, extract_text_from_pdf
from app.seed_data import seed_database

app = FastAPI(
    title="PLACEMENTPILOT AI PLATFORM API",
    description="Comprehensive End-to-End Placement Preparation, Assessment, Recruiter, and Analytics Engine",
    version="2.0.0"
)

cors_origins_raw = os.getenv("CORS_ORIGINS", "*")
cors_origins = [o.strip() for o in cors_origins_raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if cors_origins != ["*"] else ["*"],
    allow_origin_regex=r"^https?://.*" if cors_origins == ["*"] else None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    # Resilient database connection and migration with retry mechanism
    max_retries = 3
    for attempt in range(1, max_retries + 1):
        try:
            Base.metadata.create_all(bind=engine)
            db = next(get_db())
            seed_database(db)
            print("[Startup] Database initialized and seeded successfully.")
            break
        except Exception as e:
            print(f"[Startup Warning] Database initialization attempt {attempt}/{max_retries} failed: {e}")
            if attempt < max_retries:
                time.sleep(2)

@app.on_event("shutdown")
def shutdown_event():
    try:
        engine.dispose()
        print("[Shutdown] Database engine connections disposed gracefully.")
    except Exception as e:
        print(f"[Shutdown Warning] Error disposing engine connections: {e}")

@app.get("/health")
def health_check():
    db_health = check_db_health()
    is_healthy = db_health.get("status") == "connected"
    return {
        "status": "healthy" if is_healthy else "degraded",
        "app": "PLACEMENTPILOT AI",
        "version": "2.0.0",
        "uptime": "24/7 Production Ready",
        "database": db_health,
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
    }

@app.get("/")
def read_root():
    return {
        "app": "PLACEMENTPILOT AI",
        "tagline": "Practice. Analyze. Improve. Get Placement Ready.",
        "version": "2.0.0",
        "features": [
            "AI Resume Builder with ATS Templates",
            "AI Resume Analyzer & Job Matcher",
            "Smart Job Recommendation System",
            "AI Mock Video Interview System",
            "Timed Aptitude & Coding Assessment Portal",
            "Placement Eligibility Tracker",
            "Recruiter & Company Dashboard",
            "Application Tracking System (ATS)",
            "Live Placement Analytics Dashboard",
            "AI Career Guidance Assistant"
        ],
        "status": "online",
        "docs": "/docs"
    }

# ================= 1. AUTHENTICATION & AUTHORIZATION =================
@app.post("/api/auth/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        return existing
    user = User(
        email=user_in.email,
        name=user_in.name,
        password_hash=user_in.password or "password123",
        role=user_in.role or "STUDENT",
        department_code=user_in.department_code or "CSE",
        company_name=user_in.company_name,
        cgpa=user_in.cgpa or 7.8,
        backlogs=user_in.backlogs or 0,
        skills=user_in.skills or ["Python", "SQL", "React"]
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@app.post("/api/auth/login", response_model=LoginResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        # Create user automatically for fast role testing
        role = req.role or ("RECRUITER" if "recruiter" in req.email.lower() else "STUDENT")
        if "admin" in req.email.lower():
            role = "ADMIN"
        user = User(
            email=req.email,
            name=req.email.split("@")[0].replace(".", " ").title(),
            password_hash=req.password or "password123",
            role=role,
            department_code="CSE",
            company_name="TCS" if role == "RECRUITER" else None,
            cgpa=8.2,
            backlogs=0
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    elif req.role and user.role != req.role:
        user.role = req.role
        db.commit()
        db.refresh(user)
        
    return {
        "user": user,
        "token": f"bearer-token-{user.id}-{user.role.lower()}"
    }

@app.get("/api/users/demo", response_model=UserResponse)
def get_demo_user(role: str = "STUDENT", db: Session = Depends(get_db)):
    if role.upper() == "RECRUITER":
        user = db.query(User).filter(User.role == "RECRUITER").first()
    elif role.upper() == "ADMIN":
        user = db.query(User).filter(User.role == "ADMIN").first()
    else:
        user = db.query(User).filter(User.email == "demo@placementpilot.ai").first()
    if not user:
        user = db.query(User).first()
    return user

@app.get("/api/users/{user_id}", response_model=UserResponse)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/api/users/{user_id}/academic-profile", response_model=UserResponse)
def update_user_academic_profile(user_id: int, req: UserUpdateAcademic, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.cgpa = req.cgpa
    user.backlogs = req.backlogs
    if req.tenth_pct is not None:
        user.tenth_pct = req.tenth_pct
    if req.twelfth_pct is not None:
        user.twelfth_pct = req.twelfth_pct
    if req.skills is not None:
        user.skills = req.skills
    if req.department_code is not None:
        user.department_code = req.department_code
    db.commit()
    db.refresh(user)
    return user

@app.put("/api/users/{user_id}/department")
def update_user_department(user_id: int, dept_code: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.department_code = dept_code
    db.commit()
    return {"status": "success", "department_code": dept_code}

# ================= 2. DEPARTMENTS & COMPANIES =================
@app.get("/api/departments", response_model=List[DepartmentResponse])
def get_departments(db: Session = Depends(get_db)):
    return db.query(Department).all()

@app.get("/api/companies", response_model=List[CompanyResponse])
def get_companies(db: Session = Depends(get_db)):
    return db.query(Company).all()

# ================= 3. FEATURE 1: AI RESUME BUILDER =================
@app.get("/api/resume/builder/profile/{user_id}")
def get_resume_profile(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(ResumeProfile).filter(ResumeProfile.user_id == user_id).first()
    if not profile:
        user = db.query(User).filter(User.id == user_id).first()
        return {
            "user_id": user_id,
            "title": "Software Engineering Resume",
            "template_name": "modern",
            "personal_info": {
                "fullName": user.name if user else "Demo Student",
                "email": user.email if user else "demo@placementpilot.ai",
                "phone": user.phone or "+91 98765 43210",
                "location": "Hyderabad, India",
                "linkedin": "https://linkedin.com",
                "github": "https://github.com",
                "portfolio": "https://placementpilot.ai"
            },
            "summary": "Enthusiastic and results-oriented Software Engineer with a solid background in data structures, algorithms, and full-stack development. Proven ability to build performant web applications and collaborate effectively.",
            "education": [
                {"institution": "National Institute of Technology", "degree": "B.Tech", "field": user.department_code if user else "CSE", "year": "2023 - 2027", "score": f"{user.cgpa if user else 8.2} CGPA"},
                {"institution": "Higher Secondary School", "degree": "Class XII", "field": "Science", "year": "2021 - 2023", "score": "91.5%"}
            ],
            "experience": [
                {"company": "Tech Innovations Inc.", "role": "Software Engineering Intern", "duration": "May 2025 - Jul 2025", "location": "Remote", "points": [
                    "Engineered RESTful APIs with FastAPI and Python, improving response times by 35%.",
                    "Collaborated on responsive UI components using React and Tailwind CSS."
                ]}
            ],
            "projects": [
                {"title": "PlacementPilot AI Platform", "tech": "React, Next.js, FastAPI, Python", "link": "https://github.com", "points": [
                    "Built full-stack placement readiness engine with Monaco code execution and video speech analytics.",
                    "Implemented real-time ATS resume parser and algorithmic candidate eligibility tracking."
                ]}
            ],
            "skills": {
                "technical": user.skills if (user and user.skills) else ["Python", "React", "SQL", "Data Structures", "FastAPI"],
                "soft": ["Problem Solving", "Team Leadership", "Effective Communication"],
                "tools": ["Git", "VS Code", "Postman", "Docker", "Linux"]
            },
            "certifications": [
                {"name": "AWS Certified Cloud Practitioner", "issuer": "Amazon Web Services", "year": "2025"}
            ],
            "ats_score": 88.0
        }
    return profile

@app.post("/api/resume/builder/save")
def save_resume_profile(req: ResumeProfileCreate, db: Session = Depends(get_db)):
    profile = db.query(ResumeProfile).filter(ResumeProfile.user_id == req.user_id).first()
    
    # Calculate ATS score based on completeness
    tech_count = len(req.skills.get("technical", [])) if isinstance(req.skills, dict) else 5
    proj_count = len(req.projects)
    edu_count = len(req.education)
    ats = min(96.0, 60.0 + (tech_count * 2.5) + (proj_count * 4.0) + (edu_count * 3.0))

    if not profile:
        profile = ResumeProfile(
            user_id=req.user_id,
            title=req.title,
            template_name=req.template_name,
            personal_info=req.personal_info,
            summary=req.summary,
            education=req.education,
            experience=req.experience,
            projects=req.projects,
            skills=req.skills,
            certifications=req.certifications,
            ats_score=round(ats, 1)
        )
        db.add(profile)
    else:
        profile.title = req.title
        profile.template_name = req.template_name
        profile.personal_info = req.personal_info
        profile.summary = req.summary
        profile.education = req.education
        profile.experience = req.experience
        profile.projects = req.projects
        profile.skills = req.skills
        profile.certifications = req.certifications
        profile.ats_score = round(ats, 1)
    
    db.commit()
    db.refresh(profile)
    return {"status": "saved", "ats_score": profile.ats_score, "profile_id": profile.id}

@app.post("/api/resume/builder/generate-summary")
def ai_generate_summary(req: ResumeSummaryGenerateRequest):
    summary = generate_resume_summary(
        role_focus=req.role_focus,
        years_of_exp=req.years_of_exp,
        top_skills=req.top_skills,
        key_achievements=req.key_achievements
    )
    return {"summary": summary}

# ================= 4. FEATURE 2: AI RESUME ANALYZER =================
@app.post("/api/resume/analyze", response_model=ResumeAnalyzeResponse)
async def analyze_resume_file(
    file: Optional[UploadFile] = File(None),
    raw_text: Optional[str] = Form(None),
    target_role: str = Form("Software Engineer"),
    target_company: str = Form("General Tech"),
    user_id: int = Form(1),
    db: Session = Depends(get_db)
):
    content = ""
    if file:
        file_bytes = await file.read()
        if file.filename.lower().endswith(".pdf"):
            content = extract_text_from_pdf(file_bytes)
        else:
            try:
                content = file_bytes.decode("utf-8", errors="ignore")
            except Exception:
                content = ""
    if not content and raw_text:
        content = raw_text
    if not content:
        content = "Python developer with experience in React, SQL, FastAPI, Data Structures, and Git. Built web applications and machine learning models."

    result = analyze_resume_deep(content, target_role=target_role, target_company=target_company)

    # Save to user resumes
    resume = Resume(
        user_id=user_id,
        filename=file.filename if file else "Text_Resume.txt",
        parsed_skills=result["extracted_skills"]["technical"],
        parsed_projects=[f"Targeted for {target_role}"],
        parsed_education=["B.Tech Candidate"],
        parsed_experience=["Extracted from Analyzer"],
        ats_score=result["ats_score"],
        ats_feedback=result
    )
    db.add(resume)
    db.commit()

    return result

# ================= 5. FEATURE 3: SMART JOB RECOMMENDATION SYSTEM =================
@app.get("/api/jobs")
def get_jobs(
    role_type: Optional[str] = None,
    department: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Job).filter(Job.status == "OPEN")
    if role_type and role_type != "ALL":
        query = query.filter(Job.role_type == role_type)
    
    jobs = query.all()
    results = []
    for j in jobs:
        comp = j.company
        # Filter department if passed
        if department and department != "ALL":
            if department not in (j.department_eligibility or []):
                continue
        if search:
            s = search.lower()
            if s not in j.title.lower() and s not in (comp.name.lower() if comp else "") and not any(s in sk.lower() for sk in (j.required_skills or [])):
                continue

        results.append({
            "id": j.id,
            "company_id": j.company_id,
            "company_name": comp.name if comp else "Tech Enterprise",
            "company_logo": comp.logo if comp else None,
            "recruiter_id": j.recruiter_id,
            "title": j.title,
            "role_type": j.role_type,
            "department_eligibility": j.department_eligibility or ["CSE", "ECE", "EEE", "BIOTECH"],
            "min_cgpa": j.min_cgpa,
            "max_backlogs": j.max_backlogs,
            "required_skills": j.required_skills or ["Python", "SQL"],
            "salary_package": j.salary_package,
            "location": j.location,
            "description": j.description,
            "openings": j.openings,
            "deadline": j.deadline,
            "status": j.status,
            "created_at": j.created_at
        })
    return results

@app.get("/api/jobs/recommendations/{user_id}")
def get_recommended_jobs(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    jobs = db.query(Job).filter(Job.status == "OPEN").all()
    user_skills = [s.lower() for s in (user.skills or ["python", "sql", "react", "data structures"])] if user else []
    user_cgpa = user.cgpa if user else 7.5
    user_backlogs = user.backlogs if user else 0
    user_dept = user.department_code if user else "CSE"

    recommendations = []
    for j in jobs:
        comp = j.company
        req_skills = [s.lower() for s in (j.required_skills or [])]
        matched_skills = [s for s in req_skills if any(us in s or s in us for us in user_skills)]
        
        # Calculate compatibility percentage
        skill_match_ratio = (len(matched_skills) / max(1, len(req_skills)))
        base_match = skill_match_ratio * 70.0
        
        # CGPA bonus
        if user_cgpa >= j.min_cgpa:
            base_match += 20.0
        else:
            base_match -= 15.0

        # Backlog check
        if user_backlogs <= j.max_backlogs:
            base_match += 10.0
        else:
            base_match -= 20.0

        match_pct = max(35.0, min(98.0, round(base_match, 1)))

        # Ineligibility reasons
        ineligibility_reasons = []
        if user_dept not in (j.department_eligibility or []):
            ineligibility_reasons.append(f"Department {user_dept} not in eligible list {j.department_eligibility}")
        if user_cgpa < j.min_cgpa:
            ineligibility_reasons.append(f"Requires CGPA >= {j.min_cgpa} (Your CGPA: {user_cgpa})")
        if user_backlogs > j.max_backlogs:
            ineligibility_reasons.append(f"Requires <= {j.max_backlogs} backlogs (You have {user_backlogs})")
        
        missing_skills = [s.title() for s in req_skills if not any(us in s or s in us for us in user_skills)]
        if missing_skills:
            ineligibility_reasons.append(f"Missing required skills: {', '.join(missing_skills[:3])}")

        is_eligible = len(ineligibility_reasons) == 0

        # Check if already applied
        existing_app = db.query(JobApplication).filter(
            JobApplication.job_id == j.id,
            JobApplication.user_id == user_id
        ).first()

        recommendations.append({
            "id": j.id,
            "company_id": j.company_id,
            "company_name": comp.name if comp else "Tech Enterprise",
            "company_logo": comp.logo if comp else None,
            "title": j.title,
            "role_type": j.role_type,
            "department_eligibility": j.department_eligibility or ["CSE", "ECE", "EEE", "BIOTECH"],
            "min_cgpa": j.min_cgpa,
            "max_backlogs": j.max_backlogs,
            "required_skills": j.required_skills or [],
            "salary_package": j.salary_package,
            "location": j.location,
            "description": j.description,
            "openings": j.openings,
            "deadline": j.deadline,
            "status": j.status,
            "match_percentage": match_pct,
            "is_eligible": is_eligible,
            "ineligibility_reasons": ineligibility_reasons,
            "has_applied": existing_app is not None,
            "application_status": existing_app.status if existing_app else None
        })

    # Sort by match percentage descending
    recommendations.sort(key=lambda x: x["match_percentage"], reverse=True)
    return recommendations

# ================= 6. FEATURE 4: AI MOCK INTERVIEW SYSTEM =================
@app.get("/api/interviews/questions")
def get_interview_questions(role: str = "Software Development Engineer", db: Session = Depends(get_db)):
    role_questions = {
        "Software Development Engineer": [
            "Tell me about a technical project you engineered, the core architecture you chose, and how you verified its reliability.",
            "Explain how you would design a scalable URL shortener service handling millions of redirects per day.",
            "Can you explain the difference between process and thread, and how race conditions are prevented in multi-threaded programming?",
            "Describe a situation where you had to debug an elusive production bug or complex error under tight deadline constraints.",
            "Where do you see your engineering journey evolving over the next three years, and what technologies are you most excited to master?"
        ],
        "Frontend Engineer": [
            "Explain how the Virtual DOM and React fiber reconciliation algorithm work under the hood.",
            "How do you optimize Core Web Vitals (LCP, FID, CLS) in a Next.js application?",
            "Describe how you structure global state management versus component-level state across complex UI trees.",
            "Walk me through a time when a UI design presented severe performance or responsive layout challenges.",
            "How do you approach web accessibility (a11y) and keyboard navigation in modern web applications?"
        ],
        "Data Analyst / AI Engineer": [
            "Explain the difference between overfitting and underfitting in machine learning models and your favorite regularization techniques.",
            "How would you handle a production dataset where 35% of the values in key feature columns are missing?",
            "Describe the architecture of Retrieval Augmented Generation (RAG) and why vector embeddings are used.",
            "Tell me about an insightful data discovery you made during a project that altered the engineering direction.",
            "Explain SQL window functions and give an example of when you would use DENSE_RANK over ROW_NUMBER."
        ],
        "Embedded / Core Electronics": [
            "Explain interrupt latency in microcontrollers and how interrupt service routines (ISRs) should be structured.",
            "Compare the SPI, I2C, and CAN bus protocols in terms of speed, pin count, and fault tolerance.",
            "How do you debug timing bottlenecks and race conditions in FreeRTOS tasks?",
            "Describe a hardware-software interfacing project you developed and the signal integrity issues you solved.",
            "Explain how power consumption is minimized in battery-powered IoT edge sensors."
        ],
        "HR & Behavioral (STAR)": [
            "Tell me about yourself, your academic achievements, and why our company culture resonates with you.",
            "Describe a conflict you had with a team member during a technical group project and how you resolved it.",
            "Tell me about a time you failed to meet a goal or deadline. What did you learn from the experience?",
            "Why should we hire you over other candidates with similar CGPAs and technical backgrounds?",
            "Where do you see yourself in five years, and how does this entry-level role fit into your long-term goals?"
        ]
    }
    questions = role_questions.get(role, role_questions["Software Development Engineer"])
    return {"role": role, "questions": questions}

@app.post("/api/interviews/evaluate")
def evaluate_interview(req: AudioTextEvaluateRequest, db: Session = Depends(get_db)):
    res = evaluate_interview_response(
        question=req.question,
        transcript_text=req.transcript_text,
        eye_contact_pct=req.eye_contact_pct or 74.0,
        posture_score=req.posture_score or 82.0,
        wpm=req.wpm or 132,
        filler_words_count=req.filler_words_count or 4,
        pauses_count=req.pauses_count or 2,
        target_role=req.target_role or "Software Development Engineer"
    )

    session = InterviewSession(
        user_id=req.user_id,
        interview_type=req.interview_type,
        target_role=req.target_role,
        language=req.language,
        overall_score=res["overall_score"],
        sub_scores=res["sub_scores"],
        visual_metrics=res["visual_metrics"],
        speech_metrics=res["speech_metrics"],
        transcript=[{"question": req.question, "answer": req.transcript_text}],
        weaknesses=res["weaknesses"],
        improvement_plan_7day=res["improvement_plan_7day"],
        sample_improved_answer=res["sample_improved_answer"]
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    res["session_id"] = session.id
    return res

@app.get("/api/interviews/user/{user_id}")
def get_user_interviews(user_id: int, db: Session = Depends(get_db)):
    return db.query(InterviewSession).filter(InterviewSession.user_id == user_id).order_by(InterviewSession.created_at.desc()).all()

# ================= 7. FEATURE 5: APTITUDE & CODING ASSESSMENT =================
@app.get("/api/assessment/questions")
def get_assessment_questions(db: Session = Depends(get_db)):
    quant = db.query(Question).filter(Question.category == "APTITUDE", Question.topic == "Quantitative Aptitude").all()
    logical = db.query(Question).filter(Question.category == "APTITUDE", Question.topic == "Logical Reasoning").all()
    verbal = db.query(Question).filter(Question.category == "APTITUDE", Question.topic == "Verbal Ability").all()
    coding = db.query(Question).filter(Question.category == "CODING").all()

    return {
        "assessment_title": "All-India Placement Aptitude & Coding Assessment (National Benchmark)",
        "duration_minutes": 45,
        "sections": {
            "quantitative": quant,
            "logical": logical,
            "verbal": verbal,
            "coding": coding
        }
    }

@app.post("/api/assessment/submit", response_model=AssessmentReportResponse)
def submit_assessment(req: AssessmentSubmitRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == req.user_id).first()
    
    # 1. Evaluate Quant
    q_correct = 0
    q_total = len(req.quant_answers)
    for q_id, ans in req.quant_answers.items():
        q = db.query(Question).filter(Question.id == int(q_id)).first()
        if q and q.correct_answer and ans.strip().lower() == q.correct_answer.strip().lower():
            q_correct += 1
    quant_score = round((q_correct / max(1, q_total)) * 100, 1) if q_total > 0 else 80.0

    # 2. Evaluate Logical
    l_correct = 0
    l_total = len(req.logical_answers)
    for q_id, ans in req.logical_answers.items():
        q = db.query(Question).filter(Question.id == int(q_id)).first()
        if q and q.correct_answer and ans.strip().lower() == q.correct_answer.strip().lower():
            l_correct += 1
    logical_score = round((l_correct / max(1, l_total)) * 100, 1) if l_total > 0 else 85.0

    # 3. Evaluate Verbal
    v_correct = 0
    v_total = len(req.verbal_answers)
    for q_id, ans in req.verbal_answers.items():
        q = db.query(Question).filter(Question.id == int(q_id)).first()
        if q and q.correct_answer and ans.strip().lower() == q.correct_answer.strip().lower():
            v_correct += 1
    verbal_score = round((v_correct / max(1, v_total)) * 100, 1) if v_total > 0 else 75.0

    # 4. Coding Score
    coding_score = 80.0
    if req.coding_submission:
        passed = req.coding_submission.get("passed_cases", 2)
        total = req.coding_submission.get("total_cases", 2)
        coding_score = round((passed / max(1, total)) * 100, 1)

    # Total Overall Score
    total_score = round(
        (quant_score * 0.25) +
        (logical_score * 0.25) +
        (verbal_score * 0.20) +
        (coding_score * 0.30), 1
    )
    passed = total_score >= 65.0

    weak_topics = []
    if quant_score < 70:
        weak_topics.append("Quantitative Aptitude (Speed Distance & Time, Work Efficiency)")
    if logical_score < 70:
        weak_topics.append("Logical Reasoning (Blood Relations, Series Patterns)")
    if verbal_score < 70:
        weak_topics.append("Verbal Ability (Grammar & Sentence Correction)")
    if coding_score < 70:
        weak_topics.append("Algorithmic Edge Cases & Time Complexity")

    session = AssessmentSession(
        user_id=req.user_id,
        title=req.title or "Campus Placement Assessment",
        quant_score=quant_score,
        logical_score=logical_score,
        verbal_score=verbal_score,
        coding_score=coding_score,
        total_score=total_score,
        percentage=total_score,
        passed=passed,
        time_spent_seconds=req.time_spent_seconds,
        topic_breakdown={
            "Quantitative": {"score": quant_score, "correct": q_correct, "total": q_total},
            "Logical": {"score": logical_score, "correct": l_correct, "total": l_total},
            "Verbal": {"score": verbal_score, "correct": v_correct, "total": v_total},
            "Coding": {"score": coding_score}
        },
        weak_topics=weak_topics,
        coding_details=req.coding_submission
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    # Determine performance band
    if total_score >= 85:
        band = "Tier-1 Product Ready (Eligible for Zoho, Freshworks, Microsoft, Amazon)"
    elif total_score >= 70:
        band = "Top Tier Service / Tech Specialist Ready (Eligible for TCS Digital, Infosys SP, Bosch)"
    else:
        band = "Foundation Stage (Needs focused practice on identified weak spots)"

    recommendations = [
        "Review detailed explanations for every missed multiple-choice question in the report.",
        "Take a timed Weak-Spot Retest on flagged conceptual modules.",
        "Practice coding problems with strict O(N) or O(N log N) complexity constraints."
    ]

    return {
        "assessment_id": session.id,
        "user_name": user.name if user else "Demo Student",
        "total_score": total_score,
        "percentage": total_score,
        "passed": passed,
        "quant_score": quant_score,
        "logical_score": logical_score,
        "verbal_score": verbal_score,
        "coding_score": coding_score,
        "topic_breakdown": session.topic_breakdown,
        "weak_topics": weak_topics if weak_topics else ["None - Outstanding Performance across all sections!"],
        "time_spent_seconds": req.time_spent_seconds,
        "recommendations": recommendations,
        "performance_band": band
    }

# ================= 8. FEATURE 6: PLACEMENT ELIGIBILITY TRACKER =================
@app.get("/api/eligibility/{user_id}", response_model=EligibilityResponse)
def get_user_eligibility(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    companies = db.query(Company).all()
    user_skills_clean = [s.lower() for s in (user.skills or [])]
    
    company_evaluations = []
    eligible_count = 0

    for c in companies:
        reasons = []
        missing_skills = []
        
        # Check Department
        if user.department_code not in (c.eligible_departments or []):
            reasons.append(f"Department mismatch: {user.department_code} is not among eligible branches ({', '.join(c.eligible_departments or [])}).")
        
        # Check CGPA
        if user.cgpa < (c.min_cgpa or 6.5):
            reasons.append(f"CGPA requirement not met: Company requires {c.min_cgpa} CGPA (Your CGPA: {user.cgpa}).")
            
        # Check Backlogs
        if user.backlogs > (c.max_backlogs or 0):
            reasons.append(f"Backlogs limit exceeded: Company permits max {c.max_backlogs} backlogs (You have {user.backlogs} active backlog).")

        # Check Required Skills
        req_skills = c.required_skills or []
        for sk in req_skills:
            if not any(us in sk.lower() or sk.lower() in us for us in user_skills_clean):
                missing_skills.append(sk)
        
        if missing_skills:
            reasons.append(f"Missing mandatory skills: {', '.join(missing_skills)}.")

        is_eligible = len(reasons) == 0
        if is_eligible:
            eligible_count += 1

        company_evaluations.append(EligibilityItem(
            company_id=c.id,
            company_name=c.name,
            logo=c.logo,
            package_range=c.package_range,
            eligible=is_eligible,
            reasons=reasons if reasons else ["Meets all academic CGPA, backlog, department, and technical skill requirements."],
            min_cgpa=c.min_cgpa or 6.5,
            max_backlogs=c.max_backlogs or 0,
            required_skills=c.required_skills or [],
            user_cgpa=user.cgpa,
            user_backlogs=user.backlogs,
            missing_skills=missing_skills
        ))

    return EligibilityResponse(
        user_id=user.id,
        user_name=user.name,
        department_code=user.department_code,
        cgpa=user.cgpa,
        backlogs=user.backlogs,
        skills=user.skills or [],
        eligible_count=eligible_count,
        ineligible_count=len(companies) - eligible_count,
        total_companies=len(companies),
        companies=company_evaluations
    )

# ================= 9. FEATURE 7: COMPANY & RECRUITER DASHBOARD =================
@app.get("/api/recruiter/jobs")
def get_recruiter_jobs(recruiter_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(Job)
    if recruiter_id:
        query = query.filter(Job.recruiter_id == recruiter_id)
    jobs = query.order_by(Job.created_at.desc()).all()
    results = []
    for j in jobs:
        results.append({
            "id": j.id,
            "title": j.title,
            "company_name": j.company.name if j.company else "Enterprise",
            "role_type": j.role_type,
            "salary_package": j.salary_package,
            "location": j.location,
            "openings": j.openings,
            "deadline": j.deadline,
            "status": j.status,
            "applications_count": len(j.applications),
            "created_at": j.created_at
        })
    return results

@app.post("/api/recruiter/jobs")
def create_recruiter_job(req: JobCreate, recruiter_id: Optional[int] = 2, db: Session = Depends(get_db)):
    job = Job(
        company_id=req.company_id,
        recruiter_id=recruiter_id,
        title=req.title,
        role_type=req.role_type,
        department_eligibility=req.department_eligibility,
        min_cgpa=req.min_cgpa,
        max_backlogs=req.max_backlogs,
        required_skills=req.required_skills,
        salary_package=req.salary_package,
        location=req.location,
        description=req.description,
        openings=req.openings,
        deadline=req.deadline,
        status="OPEN"
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return {"status": "created", "job_id": job.id}

@app.get("/api/recruiter/applications")
def get_recruiter_applications(
    job_id: Optional[int] = None,
    status_filter: Optional[str] = None,
    min_cgpa: Optional[float] = None,
    skill_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(JobApplication)
    if job_id:
        query = query.filter(JobApplication.job_id == job_id)
    if status_filter and status_filter != "ALL":
        query = query.filter(JobApplication.status == status_filter)

    apps = query.order_by(JobApplication.applied_at.desc()).all()
    results = []
    for a in apps:
        student = a.user
        job = a.job
        if min_cgpa and (student.cgpa or 0) < min_cgpa:
            continue
        if skill_filter and skill_filter.lower() not in [s.lower() for s in (student.skills or [])]:
            continue

        results.append({
            "id": a.id,
            "job_id": a.job_id,
            "job_title": job.title if job else "Software Engineer",
            "company_name": job.company.name if (job and job.company) else "Enterprise",
            "user_id": a.user_id,
            "applicant_name": student.name if student else "Candidate",
            "applicant_email": student.email if student else "",
            "applicant_dept": student.department_code if student else "CSE",
            "applicant_cgpa": student.cgpa if student else 7.5,
            "applicant_skills": student.skills if student else [],
            "status": a.status,
            "match_percentage": a.match_percentage,
            "applied_at": a.applied_at,
            "interview_date": a.interview_date,
            "interview_mode": a.interview_mode,
            "recruiter_notes": a.recruiter_notes
        })
    return results

@app.put("/api/recruiter/applications/{app_id}/status")
def update_application_status(app_id: int, req: JobApplicationStatusUpdate, db: Session = Depends(get_db)):
    app_record = db.query(JobApplication).filter(JobApplication.id == app_id).first()
    if not app_record:
        raise HTTPException(status_code=404, detail="Application not found")
    
    app_record.status = req.status
    if req.interview_date:
        app_record.interview_date = req.interview_date
    if req.interview_mode:
        app_record.interview_mode = req.interview_mode
    if req.recruiter_notes:
        app_record.recruiter_notes = req.recruiter_notes

    # Send Notification to Student
    notif = Notification(
        user_id=app_record.user_id,
        title=f"Application Update: {req.status}",
        message=f"Your application status for '{app_record.job.title if app_record.job else 'Job'}' has been updated to: {req.status}." + 
                (f" Interview details: {req.interview_date} ({req.interview_mode})." if req.interview_date else ""),
        type="APPLICATION_STATUS",
        link="/applications"
    )
    db.add(notif)
    db.commit()
    return {"status": "success", "new_status": req.status}

# ================= 10. FEATURE 8: APPLICATION TRACKING SYSTEM =================
@app.get("/api/applications/user/{user_id}")
def get_student_applications(user_id: int, db: Session = Depends(get_db)):
    apps = db.query(JobApplication).filter(JobApplication.user_id == user_id).order_by(JobApplication.applied_at.desc()).all()
    results = []
    for a in apps:
        job = a.job
        comp = job.company if job else None
        results.append({
            "id": a.id,
            "job_id": a.job_id,
            "job_title": job.title if job else "Graduate Engineer",
            "company_name": comp.name if comp else "Enterprise",
            "company_logo": comp.logo if comp else None,
            "salary_package": job.salary_package if job else "6 - 10 LPA",
            "status": a.status,
            "match_percentage": a.match_percentage,
            "applied_at": a.applied_at,
            "interview_date": a.interview_date,
            "interview_mode": a.interview_mode,
            "recruiter_notes": a.recruiter_notes
        })
    return results

@app.post("/api/applications/apply")
def apply_to_job(req: JobApplicationCreate, db: Session = Depends(get_db)):
    existing = db.query(JobApplication).filter(
        JobApplication.job_id == req.job_id,
        JobApplication.user_id == req.user_id
    ).first()
    if existing:
        return {"status": "already_applied", "application_id": existing.id}

    user = db.query(User).filter(User.id == req.user_id).first()
    job = db.query(Job).filter(Job.id == req.job_id).first()

    # Calculate match percentage
    match_pct = 85.0
    if user and job and job.required_skills and user.skills:
        req_skills = [s.lower() for s in job.required_skills]
        u_skills = [s.lower() for s in user.skills]
        matched = [s for s in req_skills if any(us in s or s in us for us in u_skills)]
        match_pct = round((len(matched) / max(1, len(req_skills))) * 80 + (15 if user.cgpa >= job.min_cgpa else 0), 1)
        match_pct = max(40.0, min(98.0, match_pct))

    application = JobApplication(
        job_id=req.job_id,
        user_id=req.user_id,
        resume_id=req.resume_id,
        status="Applied",
        match_percentage=match_pct
    )
    db.add(application)

    # Notification
    notif = Notification(
        user_id=req.user_id,
        title=f"Application Submitted: {job.title if job else 'Job'}",
        message=f"You successfully applied to {job.company.name if (job and job.company) else 'the company'}. Your profile is currently Under Review.",
        type="APPLICATION_STATUS",
        link="/applications"
    )
    db.add(notif)
    db.commit()
    db.refresh(application)
    return {"status": "applied", "application_id": application.id, "match_percentage": match_pct}

@app.get("/api/notifications/user/{user_id}", response_model=List[NotificationResponse])
def get_user_notifications(user_id: int, db: Session = Depends(get_db)):
    return db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc()).all()

@app.put("/api/notifications/{notif_id}/read")
def mark_notification_read(notif_id: int, db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(Notification.id == notif_id).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {"status": "success"}

# ================= 11. FEATURE 9: PLACEMENT ANALYTICS DASHBOARD =================
@app.get("/api/analytics/placement-cell/comprehensive")
def get_comprehensive_placement_analytics(db: Session = Depends(get_db)):
    total_students = db.query(User).filter(User.role == "STUDENT").count()
    if total_students < 10:
        total_students = 428 # Realistic college cohort

    placed_count = int(total_students * 0.785) # 78.5% placement rate
    unplaced_count = total_students - placed_count
    placement_rate = round((placed_count / total_students) * 100, 1)

    # Company-wise recruitment distribution
    company_stats = [
        {"company": "TCS", "offers": 84, "avg_package": 6.8, "highest_package": 9.0},
        {"company": "Infosys", "offers": 62, "avg_package": 6.2, "highest_package": 9.5},
        {"company": "Zoho", "offers": 28, "avg_package": 9.2, "highest_package": 12.0},
        {"company": "Freshworks", "offers": 18, "avg_package": 11.5, "highest_package": 15.0},
        {"company": "Bosch", "offers": 32, "avg_package": 8.0, "highest_package": 10.0},
        {"company": "Siemens", "offers": 22, "avg_package": 8.5, "highest_package": 11.0},
        {"company": "Cognizant", "offers": 54, "avg_package": 5.8, "highest_package": 6.7},
        {"company": "Wipro", "offers": 36, "avg_package": 5.2, "highest_package": 6.5}
    ]

    # Department-wise statistics
    dept_stats = [
        {"department": "CSE", "registered": 180, "placed": 156, "rate": 86.7, "avg_package": 9.2, "highest": 15.0},
        {"department": "ECE", "registered": 120, "placed": 96, "rate": 80.0, "avg_package": 7.8, "highest": 11.0},
        {"department": "EEE", "registered": 78, "placed": 54, "rate": 69.2, "avg_package": 6.9, "highest": 8.5},
        {"department": "BIOTECH", "registered": 50, "placed": 30, "rate": 60.0, "avg_package": 6.5, "highest": 8.0}
    ]

    # Package brackets distribution
    package_distribution = [
        {"bracket": "< 4 LPA", "count": 25},
        {"bracket": "4 - 7 LPA", "count": 142},
        {"bracket": "7 - 10 LPA", "count": 115},
        {"bracket": "10 - 15 LPA", "count": 46},
        {"bracket": "> 15 LPA", "count": 8}
    ]

    return {
        "kpis": {
            "total_registered_students": total_students,
            "placed_students": placed_count,
            "unplaced_students": unplaced_count,
            "placement_percentage": placement_rate,
            "highest_package_lpa": 15.0,
            "average_package_lpa": 7.85,
            "median_package_lpa": 7.0,
            "total_companies_visited": 26,
            "active_drives": 6
        },
        "company_recruitment": company_stats,
        "department_performance": dept_stats,
        "salary_package_distribution": package_distribution,
        "timestamp": datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
    }

# ================= 12. FEATURE 10: AI CAREER GUIDANCE ASSISTANT =================
@app.post("/api/career/assistant/chat")
def career_assistant_chat(req: CareerGuidanceChatRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == req.user_id).first()
    skills = user.skills if user else req.current_skills
    advisor_result = career_guidance_advisor(
        query=req.query,
        interests=req.interests,
        current_skills=skills
    )
    
    # Save plan
    if user:
        plan = CareerPlan(
            user_id=user.id,
            target_role=advisor_result["recommended_role"],
            current_level="Student / Pre-Placement",
            recommended_skills=advisor_result["recommended_technologies"],
            certifications=advisor_result["recommended_certifications"],
            roadmap_steps=advisor_result["learning_roadmap"],
            recommended_projects=advisor_result["recommended_projects"],
            interview_tips=advisor_result["interview_tips"]
        )
        db.add(plan)
        db.commit()

    return advisor_result

# ================= 13. PRESERVED EXISTING ENDPOINTS =================
@app.get("/api/questions", response_model=List[QuestionResponse])
def get_questions(
    category: Optional[str] = None,
    department_code: Optional[str] = None,
    topic: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Question)
    if category:
        query = query.filter(Question.category == category.upper())
    if department_code and department_code != "ALL":
        query = query.filter((Question.department_code == department_code) | (Question.department_code == "ALL"))
    if topic:
        query = query.filter(Question.topic == topic)
    return query.all()

@app.post("/api/attempts/submit")
def submit_attempt(req: AttemptSubmit, db: Session = Depends(get_db)):
    correct = 0
    total = len(req.answers)
    topic_map = {}
    weak_topics = []

    for q_id_str, selected in req.answers.items():
        q = db.query(Question).filter(Question.id == int(q_id_str)).first()
        if q:
            is_correct = (selected.strip().lower() == q.correct_answer.strip().lower()) if q.correct_answer else False
            if is_correct:
                correct += 1
            else:
                weak_topics.append(q.topic)
            
            if q.topic not in topic_map:
                topic_map[q.topic] = {"total": 0, "correct": 0}
            topic_map[q.topic]["total"] += 1
            if is_correct:
                topic_map[q.topic]["correct"] += 1

    score_pct = round((correct / max(1, total)) * 100, 1)

    attempt = Attempt(
        user_id=req.user_id,
        category=req.category,
        department_code=req.department_code,
        total_questions=total,
        correct_count=correct,
        score_percentage=score_pct,
        time_spent_seconds=req.time_spent_seconds,
        topic_breakdown=topic_map,
        weak_topics=list(set(weak_topics))
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    return {
        "attempt_id": attempt.id,
        "score_percentage": score_pct,
        "correct_count": correct,
        "total_questions": total,
        "topic_breakdown": topic_map,
        "weak_topics": list(set(weak_topics)),
        "retest_recommended": len(weak_topics) > 0
    }

@app.post("/api/coding/execute")
def execute_coding(req: CodingExecuteRequest, db: Session = Depends(get_db)):
    question = db.query(Question).filter(Question.id == req.question_id).first()
    test_cases = question.test_cases if (question and question.test_cases) else [
        {"input": "Sample", "expected": "Sample"}
    ]
    res = run_code_sandbox(req.language, req.source_code, test_cases)
    submission = CodingSubmission(
        user_id=req.user_id,
        question_id=req.question_id,
        language=req.language,
        source_code=req.source_code,
        status=res["status"],
        passed_cases=res["passed_cases"],
        total_cases=res["total_cases"],
        runtime_ms=res["runtime_ms"],
        memory_kb=res["memory_kb"],
        complexity_guidance=res["complexity_guidance"]
    )
    db.add(submission)
    db.commit()
    return res

@app.post("/api/resume/upload")
async def upload_resume(user_id: int = Form(...), file: UploadFile = File(None), text_content: Optional[str] = Form(None), db: Session = Depends(get_db)):
    content = ""
    if file:
        file_bytes = await file.read()
        if file.filename.lower().endswith(".pdf"):
            content = extract_text_from_pdf(file_bytes)
        else:
            try:
                content = file_bytes.decode("utf-8", errors="ignore")
            except Exception:
                content = "Built Smart Traffic System in Python. Skills: Python, SQL, React."
    elif text_content:
        content = text_content
    else:
        content = "Built Placement Readiness Platform using Python, FastAPI, and React."

    parsed = parse_resume_text(content)

    resume = Resume(
        user_id=user_id,
        filename=file.filename if file else "Pasted_Resume.txt",
        parsed_skills=parsed["parsed_skills"],
        parsed_projects=parsed["parsed_projects"],
        parsed_experience=parsed["parsed_experience"],
        parsed_education=parsed["parsed_education"],
        generated_questions=parsed["generated_questions"],
        ats_score=parsed["ats_score"]
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    return {
        "resume_id": resume.id,
        "parsed_skills": parsed["parsed_skills"],
        "parsed_projects": parsed["parsed_projects"],
        "generated_questions": parsed["generated_questions"],
        "ats_score": parsed["ats_score"]
    }

@app.get("/api/analytics/dashboard/{user_id}")
def get_student_dashboard_analytics(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    attempts = db.query(Attempt).filter(Attempt.user_id == user_id).all()
    interviews = db.query(InterviewSession).filter(InterviewSession.user_id == user_id).all()
    assessments = db.query(AssessmentSession).filter(AssessmentSession.user_id == user_id).all()

    latest_interview = interviews[-1] if interviews else None
    latest_attempt = attempts[-1] if attempts else None
    latest_assessment = assessments[-1] if assessments else None

    aptitude_score = round(latest_attempt.score_percentage, 1) if latest_attempt else 80.0
    technical_score = 82.0
    coding_score = latest_assessment.coding_score if latest_assessment else 78.0
    communication_score = latest_interview.sub_scores.get("communication", 76.0) if latest_interview else 76.0
    interview_score = latest_interview.overall_score if latest_interview else 78.5

    overall_readiness = round(
        (aptitude_score * 0.20) +
        (technical_score * 0.20) +
        (coding_score * 0.20) +
        (communication_score * 0.20) +
        (interview_score * 0.20), 1
    )

    trend = [
        {"attempt": "Attempt 1", "score": 62},
        {"attempt": "Attempt 2", "score": 68},
        {"attempt": "Attempt 3", "score": 74},
        {"attempt": "Attempt 4", "score": overall_readiness}
    ]

    radar = [
        {"skill": "Aptitude", "score": aptitude_score, "benchmark": 80},
        {"skill": "Technical", "score": technical_score, "benchmark": 75},
        {"skill": "Coding", "score": coding_score, "benchmark": 70},
        {"skill": "Communication", "score": communication_score, "benchmark": 85},
        {"skill": "Interview", "score": interview_score, "benchmark": 80}
    ]

    company_readiness = [
        {"company": "TCS", "readiness": min(95, int(overall_readiness + 8)), "gap": "Coding speed"},
        {"company": "Infosys", "readiness": min(95, int(overall_readiness + 5)), "gap": "Pseudocode"},
        {"company": "Zoho", "readiness": max(45, int(overall_readiness - 12)), "gap": "Advanced DSA"},
        {"company": "Bosch", "readiness": min(95, int(overall_readiness + 2)), "gap": "Core subjects"}
    ]

    return {
        "user_name": user.name if user else "Demo Student",
        "department_code": user.department_code if user else "CSE",
        "overall_readiness": overall_readiness,
        "previous_readiness": 68.0,
        "improvement_pct": round(overall_readiness - 68.0, 1),
        "scores": {
            "aptitude": aptitude_score,
            "technical": technical_score,
            "coding": coding_score,
            "communication": communication_score,
            "interview": interview_score
        },
        "weak_topics": ["DBMS Joins", "STAR Framework Result", "Speed Distance Time"],
        "improvement_trend": trend,
        "skill_radar": radar,
        "company_readiness": company_readiness
    }

@app.get("/api/admin/placement-cell-analytics")
def get_placement_cell_analytics(db: Session = Depends(get_db)):
    return {
        "total_students": 340,
        "active_participants": 285,
        "department_averages": {
            "CSE": {"aptitude": 82, "technical": 79, "coding": 74, "interview": 76},
            "ECE": {"aptitude": 78, "technical": 81, "coding": 62, "interview": 72},
            "EEE": {"aptitude": 75, "technical": 77, "coding": 58, "interview": 70},
            "BIOTECH": {"aptitude": 76, "technical": 83, "coding": 52, "interview": 74}
        },
        "common_weak_skills": [
            {"skill": "DBMS Joins & Indexing", "affected_students_pct": 42},
            {"skill": "STAR Framework Result Stage", "affected_students_pct": 38},
            {"skill": "Speed & Distance Quant", "affected_students_pct": 31},
            {"skill": "Digital Circuit Logic Gates", "affected_students_pct": 28}
        ]
    }

@app.get("/api/reports/student/{user_id}")
def generate_report_data(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    analytics = get_student_dashboard_analytics(user_id, db)
    
    return {
        "report_id": f"PP-REP-2026-{user_id:04d}",
        "verification_id": f"VERIFY-PP-{user_id}-8892",
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "student_name": user.name if user else "Demo Student",
        "department": user.department_code if user else "CSE",
        "overall_readiness": analytics["overall_readiness"],
        "scores": analytics["scores"],
        "weak_topics": analytics["weak_topics"],
        "radar": analytics["skill_radar"],
        "guidance_disclaimer": "This document contains practice guidance and readiness indicators generated for placement preparation."
    }
