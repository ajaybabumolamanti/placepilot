import datetime
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=True) # hashed password with fallback
    role = Column(String(50), default="STUDENT") # STUDENT, RECRUITER, ADMIN, MENTOR
    department_code = Column(String(50), default="CSE") # CSE, ECE, EEE, BIOTECH
    phone = Column(String(50), nullable=True)
    bio = Column(Text, nullable=True)
    
    # Academic & Eligibility profile
    cgpa = Column(Float, default=7.8)
    backlogs = Column(Integer, default=0)
    tenth_pct = Column(Float, default=88.5)
    twelfth_pct = Column(Float, default=86.0)
    skills = Column(JSON, default=lambda: ["Python", "JavaScript", "React", "SQL", "Data Structures"])
    company_name = Column(String(255), nullable=True) # If recruiter
    
    # Placement status
    is_placed = Column(Boolean, default=False)
    placed_company = Column(String(255), nullable=True)
    placed_package = Column(Float, nullable=True) # in LPA
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    attempts = relationship("Attempt", back_populates="user", cascade="all, delete-orphan")
    interview_sessions = relationship("InterviewSession", back_populates="user", cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    coding_submissions = relationship("CodingSubmission", back_populates="user", cascade="all, delete-orphan")
    applications = relationship("JobApplication", back_populates="user", cascade="all, delete-orphan")
    resume_profiles = relationship("ResumeProfile", back_populates="user", cascade="all, delete-orphan")
    assessment_sessions = relationship("AssessmentSession", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    career_plans = relationship("CareerPlan", back_populates="user", cascade="all, delete-orphan")


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False) # CSE, ECE, EEE, BIOTECH
    name = Column(String(255), nullable=False)
    description = Column(Text)
    icon = Column(String(50), default="code")


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    category = Column(String(50)) # SERVICE, PRODUCT, CORE
    logo = Column(String(255))
    description = Column(Text)
    eligible_departments = Column(JSON) # ["CSE", "ECE", ...]
    round_count = Column(Integer, default=4)
    difficulty = Column(String(50), default="Moderate") # Easy, Moderate, High, Hard
    topics = Column(JSON)
    package_range = Column(String(100), default="4 - 12 LPA")
    cutoffs_disclaimer = Column(Text, default="Practicing readiness scores are guidance indicators, not official company cutoffs.")
    
    # Eligibility rules
    min_cgpa = Column(Float, default=6.5)
    max_backlogs = Column(Integer, default=0)
    required_skills = Column(JSON, default=lambda: ["Python", "SQL", "Data Structures"])
    location = Column(String(100), default="Bangalore / Hyderabad")
    website = Column(String(255), default="https://careers.company.com")
    recruiter_id = Column(Integer, nullable=True)

    jobs = relationship("Job", back_populates="company", cascade="all, delete-orphan")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    recruiter_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String(255), nullable=False)
    role_type = Column(String(50), default="Full-Time") # Full-Time, Internship, Graduate Trainee
    department_eligibility = Column(JSON, default=lambda: ["CSE", "ECE", "EEE", "BIOTECH"])
    min_cgpa = Column(Float, default=6.5)
    max_backlogs = Column(Integer, default=0)
    required_skills = Column(JSON, default=lambda: ["Python", "SQL"])
    salary_package = Column(String(100), default="6 - 10 LPA")
    location = Column(String(150), default="Bangalore (Hybrid)")
    description = Column(Text)
    openings = Column(Integer, default=5)
    deadline = Column(String(50), default="2026-12-31")
    status = Column(String(50), default="OPEN") # OPEN, CLOSED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    company = relationship("Company", back_populates="jobs")
    recruiter = relationship("User")
    applications = relationship("JobApplication", back_populates="job", cascade="all, delete-orphan")


class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=True)
    status = Column(String(50), default="Applied") # Applied, Under Review, Shortlisted, Interview Scheduled, Selected, Rejected
    match_percentage = Column(Float, default=85.0)
    applied_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    interview_date = Column(String(100), nullable=True)
    interview_mode = Column(String(100), nullable=True) # Online Google Meet / In-person
    recruiter_notes = Column(Text, nullable=True)

    job = relationship("Job", back_populates="applications")
    user = relationship("User", back_populates="applications")


class Round(Base):
    __tablename__ = "rounds"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    round_name = Column(String(255), nullable=False)
    round_type = Column(String(50)) # Aptitude, Technical, Coding, HR, AI Mock
    description = Column(Text)
    duration_minutes = Column(Integer, default=30)
    order_index = Column(Integer, default=1)


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50), index=True) # APTITUDE, TECHNICAL, CODING, HR
    department_code = Column(String(50), default="ALL") # CSE, ECE, EEE, BIOTECH, ALL
    topic = Column(String(100), index=True) # Quant, Logical, Verbal, DBMS, Signals, STAR HR, etc.
    title = Column(String(500), nullable=False)
    prompt = Column(Text, nullable=False)
    options = Column(JSON, nullable=True) # List of options for MCQs
    correct_answer = Column(Text, nullable=True)
    explanation = Column(Text, nullable=True)
    difficulty = Column(String(50), default="Medium")
    target_role = Column(String(100), nullable=True) # Software Engineer, Data Analyst, Cloud, etc.
    code_starter = Column(JSON, nullable=True) # {"python": "...", "cpp": "..."}
    test_cases = Column(JSON, nullable=True) # [{"input": "...", "expected": "..."}]


class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    category = Column(String(50)) # APTITUDE, TECHNICAL, RETEST
    department_code = Column(String(50))
    total_questions = Column(Integer)
    correct_count = Column(Integer)
    score_percentage = Column(Float)
    time_spent_seconds = Column(Integer)
    topic_breakdown = Column(JSON) # {"DBMS": {"total": 5, "correct": 3}}
    weak_topics = Column(JSON) # ["DBMS joins", "OOP"]
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="attempts")


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    interview_type = Column(String(50), default="AI_MOCK_VIDEO") # AI_MOCK_VIDEO, HR, RESUME, REGIONAL
    target_role = Column(String(100), default="Software Development Engineer")
    language = Column(String(50), default="English") # English, Tamil, Telugu, Hindi
    overall_score = Column(Float, default=0.0)
    sub_scores = Column(JSON) # {"content": 78, "communication": 82, "speech": 75, "body_language": 80, "technical_depth": 70}
    visual_metrics = Column(JSON) # {"eye_contact_pct": 74, "posture_score": 85, "head_movement": "Normal"}
    speech_metrics = Column(JSON) # {"wpm": 135, "filler_words_count": 8, "filler_words": ["um", "basically"], "pauses_count": 3}
    transcript = Column(JSON) # [{"question": "...", "answer": "...", "duration": 45}]
    weaknesses = Column(JSON) # Top 3 weaknesses with timestamps & evidence
    improvement_plan_7day = Column(JSON) # Day 1 to Day 7 tasks
    sample_improved_answer = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="interview_sessions")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    filename = Column(String(255))
    parsed_skills = Column(JSON) # ["Python", "React", "SQL"]
    parsed_projects = Column(JSON) # ["Traffic Management System", "PlacementPilot AI"]
    parsed_experience = Column(JSON)
    parsed_education = Column(JSON)
    generated_questions = Column(JSON)
    ats_score = Column(Float, default=78.0)
    ats_feedback = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="resumes")


class ResumeProfile(Base):
    __tablename__ = "resume_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), default="Full Stack Developer Resume")
    template_name = Column(String(50), default="modern") # modern, clean, executive, tech
    personal_info = Column(JSON) # {fullName, email, phone, location, linkedin, github, portfolio}
    summary = Column(Text)
    education = Column(JSON) # [{institution, degree, field, year, score}]
    experience = Column(JSON) # [{company, role, duration, location, points}]
    projects = Column(JSON) # [{title, tech, link, points}]
    skills = Column(JSON) # {technical: [], soft: [], tools: []}
    certifications = Column(JSON) # [{name, issuer, year}]
    ats_score = Column(Float, default=85.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="resume_profiles")


class AssessmentSession(Base):
    __tablename__ = "assessment_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), default="Campus Placement Aptitude & Coding Assessment")
    quant_score = Column(Float, default=0.0)
    logical_score = Column(Float, default=0.0)
    verbal_score = Column(Float, default=0.0)
    coding_score = Column(Float, default=0.0)
    total_score = Column(Float, default=0.0)
    percentage = Column(Float, default=0.0)
    passed = Column(Boolean, default=False)
    time_spent_seconds = Column(Integer, default=0)
    topic_breakdown = Column(JSON)
    weak_topics = Column(JSON)
    coding_details = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="assessment_sessions")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="INFO") # APPLICATION_STATUS, INTERVIEW_INVITE, ELIGIBILITY, SYSTEM
    is_read = Column(Boolean, default=False)
    link = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")


class CareerPlan(Base):
    __tablename__ = "career_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_role = Column(String(100), nullable=False)
    current_level = Column(String(50), default="Beginner / Fresher")
    recommended_skills = Column(JSON)
    certifications = Column(JSON)
    roadmap_steps = Column(JSON)
    recommended_projects = Column(JSON)
    interview_tips = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="career_plans")


class CodingSubmission(Base):
    __tablename__ = "coding_submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    language = Column(String(50)) # python, cpp, java
    source_code = Column(Text)
    status = Column(String(50)) # Accepted, Wrong Answer, Compilation Error, Runtime Error
    passed_cases = Column(Integer, default=0)
    total_cases = Column(Integer, default=0)
    runtime_ms = Column(Float, default=0.0)
    memory_kb = Column(Float, default=0.0)
    complexity_guidance = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="coding_submissions")


class GuidanceVideo(Base):
    __tablename__ = "guidance_videos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100)) # STAR Framework, Tell Me About Yourself, Technical Prep, Communication
    duration = Column(String(50), default="5:30")
    thumbnail = Column(String(255))
    url = Column(String(255))
    recommended_for_weakness = Column(String(100))


class MentorReview(Base):
    __tablename__ = "mentor_reviews"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("interview_sessions.id"))
    mentor_name = Column(String(255))
    rating = Column(Integer, default=4)
    feedback_text = Column(Text)
    timestamped_notes = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    action = Column(String(255))
    details = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
