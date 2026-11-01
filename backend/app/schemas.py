from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

# ================= AUTH & USER SCHEMAS =================
class UserBase(BaseModel):
    email: str
    name: str
    role: Optional[str] = "STUDENT"
    department_code: Optional[str] = "CSE"
    phone: Optional[str] = None
    bio: Optional[str] = None
    cgpa: Optional[float] = 7.8
    backlogs: Optional[int] = 0
    tenth_pct: Optional[float] = 88.5
    twelfth_pct: Optional[float] = 86.0
    skills: Optional[List[str]] = ["Python", "JavaScript", "React", "SQL", "Data Structures"]
    company_name: Optional[str] = None

class UserCreate(UserBase):
    password: Optional[str] = "password123"

class UserUpdateAcademic(BaseModel):
    cgpa: float
    backlogs: int
    tenth_pct: Optional[float] = None
    twelfth_pct: Optional[float] = None
    skills: Optional[List[str]] = None
    department_code: Optional[str] = None

class UserResponse(UserBase):
    id: int
    is_placed: Optional[bool] = False
    placed_company: Optional[str] = None
    placed_package: Optional[float] = None
    created_at: datetime
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: str
    password: Optional[str] = "password123"
    role: Optional[str] = None # Optional role override for fast testing

class LoginResponse(BaseModel):
    user: UserResponse
    token: str

# ================= DEPARTMENTS & COMPANIES =================
class DepartmentResponse(BaseModel):
    id: int
    code: str
    name: str
    description: Optional[str] = None
    icon: Optional[str] = "code"
    class Config:
        from_attributes = True

class CompanyResponse(BaseModel):
    id: int
    name: str
    category: str
    logo: Optional[str] = None
    description: Optional[str] = None
    eligible_departments: List[str]
    round_count: int
    difficulty: str
    topics: List[str]
    package_range: str
    cutoffs_disclaimer: str
    min_cgpa: Optional[float] = 6.5
    max_backlogs: Optional[int] = 0
    required_skills: Optional[List[str]] = []
    location: Optional[str] = "Bangalore"
    website: Optional[str] = None
    class Config:
        from_attributes = True

# ================= JOBS & APPLICATIONS =================
class JobCreate(BaseModel):
    company_id: int
    title: str
    role_type: Optional[str] = "Full-Time"
    department_eligibility: Optional[List[str]] = ["CSE", "ECE", "EEE", "BIOTECH"]
    min_cgpa: Optional[float] = 6.5
    max_backlogs: Optional[int] = 0
    required_skills: Optional[List[str]] = ["Python", "SQL"]
    salary_package: Optional[str] = "6 - 10 LPA"
    location: Optional[str] = "Bangalore (Hybrid)"
    description: str
    openings: Optional[int] = 5
    deadline: Optional[str] = "2026-12-31"

class JobResponse(BaseModel):
    id: int
    company_id: int
    company_name: Optional[str] = None
    company_logo: Optional[str] = None
    recruiter_id: Optional[int] = None
    title: str
    role_type: str
    department_eligibility: List[str]
    min_cgpa: float
    max_backlogs: int
    required_skills: List[str]
    salary_package: str
    location: str
    description: str
    openings: int
    deadline: str
    status: str
    created_at: datetime
    match_percentage: Optional[float] = None
    is_eligible: Optional[bool] = None
    ineligibility_reasons: Optional[List[str]] = []
    class Config:
        from_attributes = True

class JobApplicationCreate(BaseModel):
    job_id: int
    user_id: int
    resume_id: Optional[int] = None

class JobApplicationStatusUpdate(BaseModel):
    status: str # Applied, Under Review, Shortlisted, Interview Scheduled, Selected, Rejected
    interview_date: Optional[str] = None
    interview_mode: Optional[str] = None
    recruiter_notes: Optional[str] = None

class JobApplicationResponse(BaseModel):
    id: int
    job_id: int
    user_id: int
    job_title: Optional[str] = None
    company_name: Optional[str] = None
    company_logo: Optional[str] = None
    salary_package: Optional[str] = None
    status: str
    match_percentage: float
    applied_at: datetime
    interview_date: Optional[str] = None
    interview_mode: Optional[str] = None
    recruiter_notes: Optional[str] = None
    applicant_name: Optional[str] = None
    applicant_email: Optional[str] = None
    applicant_cgpa: Optional[float] = None
    applicant_dept: Optional[str] = None
    applicant_skills: Optional[List[str]] = None
    class Config:
        from_attributes = True

# ================= RESUME BUILDER & ANALYZER =================
class ResumeProfileCreate(BaseModel):
    user_id: int
    title: Optional[str] = "Professional Tech Resume"
    template_name: Optional[str] = "modern"
    personal_info: Dict[str, Any]
    summary: str
    education: List[Dict[str, Any]]
    experience: List[Dict[str, Any]]
    projects: List[Dict[str, Any]]
    skills: Dict[str, Any]
    certifications: Optional[List[Dict[str, Any]]] = []

class ResumeSummaryGenerateRequest(BaseModel):
    role_focus: str
    years_of_exp: Optional[str] = "Fresher / Student"
    top_skills: List[str]
    key_achievements: Optional[str] = None

class ResumeAnalyzeRequest(BaseModel):
    user_id: Optional[int] = 1
    raw_text: Optional[str] = None
    target_role: Optional[str] = "Software Engineer"
    target_company: Optional[str] = "General Tech"

class ResumeAnalyzeResponse(BaseModel):
    ats_score: float
    extracted_skills: Dict[str, List[str]] # {technical: [], soft: []}
    missing_keywords: List[str]
    formatting_feedback: List[str]
    strengths: List[str]
    recommendations: List[str]
    job_match_pct: float
    target_role: str

# ================= QUESTIONS & PRACTICE =================
class QuestionResponse(BaseModel):
    id: int
    category: str
    department_code: str
    topic: str
    title: str
    prompt: str
    options: Optional[List[str]] = None
    correct_answer: Optional[str] = None
    explanation: Optional[str] = None
    difficulty: str
    target_role: Optional[str] = None
    code_starter: Optional[Dict[str, str]] = None
    test_cases: Optional[List[Dict[str, Any]]] = None
    class Config:
        from_attributes = True

class QuestionCreate(BaseModel):
    category: str
    department_code: str
    topic: str
    title: str
    prompt: str
    options: Optional[List[str]] = None
    correct_answer: Optional[str] = None
    explanation: Optional[str] = None
    difficulty: Optional[str] = "Medium"
    target_role: Optional[str] = None
    code_starter: Optional[Dict[str, str]] = None
    test_cases: Optional[List[Dict[str, Any]]] = None

class AttemptSubmit(BaseModel):
    user_id: int
    category: str
    department_code: str
    answers: Dict[str, str]
    time_spent_seconds: int

# ================= CODING & INTERVIEWS =================
class CodingExecuteRequest(BaseModel):
    user_id: int
    question_id: int
    language: str # python, cpp, java
    source_code: str

class AudioTextEvaluateRequest(BaseModel):
    user_id: int
    interview_type: Optional[str] = "AI_MOCK_VIDEO"
    target_role: Optional[str] = "Software Development Engineer"
    language: Optional[str] = "English"
    question: str
    transcript_text: str
    eye_contact_pct: Optional[float] = 72.0
    posture_score: Optional[float] = 80.0
    wpm: Optional[int] = 130
    filler_words_count: Optional[int] = 5
    pauses_count: Optional[int] = 2

# ================= ASSESSMENT ENGINE =================
class AssessmentSubmitRequest(BaseModel):
    user_id: int
    title: Optional[str] = "Campus Placement Assessment"
    quant_answers: Dict[str, str]
    logical_answers: Dict[str, str]
    verbal_answers: Dict[str, str]
    coding_submission: Optional[Dict[str, Any]] = None
    time_spent_seconds: int

class AssessmentReportResponse(BaseModel):
    assessment_id: int
    user_name: str
    total_score: float
    percentage: float
    passed: bool
    quant_score: float
    logical_score: float
    verbal_score: float
    coding_score: float
    topic_breakdown: Dict[str, Any]
    weak_topics: List[str]
    time_spent_seconds: int
    recommendations: List[str]
    performance_band: str

# ================= ELIGIBILITY =================
class EligibilityItem(BaseModel):
    company_id: int
    company_name: str
    logo: Optional[str] = None
    package_range: str
    eligible: bool
    reasons: List[str]
    min_cgpa: float
    max_backlogs: int
    required_skills: List[str]
    user_cgpa: float
    user_backlogs: int
    missing_skills: List[str]

class EligibilityResponse(BaseModel):
    user_id: int
    user_name: str
    department_code: str
    cgpa: float
    backlogs: int
    skills: List[str]
    eligible_count: int
    ineligible_count: int
    total_companies: int
    companies: List[EligibilityItem]

# ================= CAREER GUIDANCE =================
class CareerGuidanceChatRequest(BaseModel):
    user_id: Optional[int] = 1
    query: str
    interests: Optional[List[str]] = None
    current_skills: Optional[List[str]] = None

class CareerRoadmapRequest(BaseModel):
    user_id: Optional[int] = 1
    target_role: str

# ================= NOTIFICATIONS =================
class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    type: str
    is_read: bool
    link: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True
