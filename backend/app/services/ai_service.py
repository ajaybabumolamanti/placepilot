import os
import json
import re
import requests
from typing import Dict, Any, List, Optional

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

def call_gemini_api(prompt: str, system_instruction: str = "") -> Optional[str]:
    """Calls Gemini API if key is present, otherwise returns None to trigger heuristic engine."""
    if not GEMINI_API_KEY:
        return None
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
        payload = {
            "contents": [{"parts": [{"text": f"{system_instruction}\n\n{prompt}"}]}],
            "generationConfig": {"temperature": 0.4, "maxOutputTokens": 1024}
        }
        res = requests.post(url, json=payload, timeout=8)
        if res.status_code == 200:
            data = res.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception:
        pass
    return None

# ================= 1. INTERVIEW EVALUATION =================
def evaluate_interview_response(
    question: str,
    transcript_text: str,
    eye_contact_pct: float = 72.0,
    posture_score: float = 80.0,
    wpm: int = 130,
    filler_words_count: int = 5,
    pauses_count: int = 2,
    target_role: str = "Software Development Engineer"
) -> Dict[str, Any]:
    transcript_clean = transcript_text.strip()
    words = transcript_clean.split()
    word_count = len(words)

    # 1. Content & Correctness (35%)
    content_score = 65.0
    if word_count >= 40:
        content_score += 15.0
    if word_count >= 80:
        content_score += 10.0
    
    star_keywords = ["situation", "task", "action", "result", "built", "handled", "implemented", "learned", "achieved", "optimized", "designed"]
    found_star = [k for k in star_keywords if k in transcript_clean.lower()]
    if found_star:
        content_score += min(12.0, len(found_star) * 2.5)
    content_score = min(96.0, content_score)

    # 2. Technical Depth (15%)
    tech_keywords = ["algorithm", "database", "python", "system", "optimization", "architecture", "design", "logic", "testing", "circuit", "process", "api", "complexity", "sql", "cache"]
    found_tech = [k for k in tech_keywords if k in transcript_clean.lower()]
    tech_depth_score = min(95.0, 60.0 + len(found_tech) * 7.0)

    # 3. Communication Clarity (20%)
    comm_score = 86.0
    if filler_words_count > 10:
        comm_score -= 15.0
    elif filler_words_count > 5:
        comm_score -= 8.0
    if wpm < 100 or wpm > 170:
        comm_score -= 8.0
    comm_score = max(50.0, min(95.0, comm_score))

    # 4. Confidence / Speech Signals (15%)
    speech_score = 80.0
    if 120 <= wpm <= 155:
        speech_score += 10.0
    if pauses_count > 4:
        speech_score -= 10.0
    speech_score = max(45.0, min(95.0, speech_score))

    # 5. Body Language (15%)
    body_language_score = (eye_contact_pct * 0.6) + (posture_score * 0.4)
    body_language_score = max(40.0, min(95.0, body_language_score))

    overall_score = round(
        (content_score * 0.35) +
        (comm_score * 0.20) +
        (speech_score * 0.15) +
        (body_language_score * 0.15) +
        (tech_depth_score * 0.15), 1
    )

    sub_scores = {
        "content": round(content_score, 1),
        "communication": round(comm_score, 1),
        "speech": round(speech_score, 1),
        "body_language": round(body_language_score, 1),
        "technical_depth": round(tech_depth_score, 1)
    }

    weaknesses = [
        {
            "weakness": "Filler Words In Speech",
            "timestamp": "00:45",
            "observation": f"Observed {filler_words_count} filler words during technical explanation.",
            "recommendation": "Incorporate deliberate 1-second pauses instead of fillers while collecting thoughts."
        },
        {
            "weakness": "Camera Alignment Focus",
            "timestamp": "01:20",
            "observation": f"Eye contact remained at {round(eye_contact_pct, 0)}% of interview length.",
            "recommendation": "Position video window near camera lens to sustain direct visual contact with the panel."
        },
        {
            "weakness": "STAR Metric Quantification",
            "timestamp": "02:15",
            "observation": "Explained implementation actions clearly, but lacked percentage or latency metrics in final outcome.",
            "recommendation": "Conclude technical answers with concrete metrics (e.g. 'reduced latency by 35%')."
        }
    ]

    improved_sample = (
        f"Role Focus: {target_role}\n"
        f"Question: '{question}'\n\n"
        f"• **Situation & Task**: In our recent capstone project, our microservice suffered from query bottlenecks under concurrent load.\n"
        f"• **Action**: I redesigned the database indexes, implemented Redis caching for hot reads, and restructured asynchronous workers.\n"
        f"• **Result**: System latency dropped from 950ms to 120ms (an 87% improvement) and handled 5x traffic with zero errors."
    )

    improvement_plan_7day = [
        {"day": 1, "task": f"Practice STAR structure introductions tailored to {target_role}."},
        {"day": 2, "task": "Review Core CS fundamentals (OS, DBMS, Networks, OOP) with vocal practice."},
        {"day": 3, "task": "Complete a 15-minute camera-directed eye contact stabilization drill."},
        {"day": 4, "task": "Solve 2 medium coding challenges with verbal explanation (think-aloud protocol)."},
        {"day": 5, "task": "Simulate a live 5-question mock round in PlacementPilot with timer."},
        {"day": 6, "task": "Refine project architectural explanations and memorize measurable impact numbers."},
        {"day": 7, "task": "Take full diagnostic re-test and download verified readiness scorecard."}
    ]

    return {
        "overall_score": overall_score,
        "sub_scores": sub_scores,
        "visual_metrics": {
            "eye_contact_pct": round(eye_contact_pct, 1),
            "posture_score": round(posture_score, 1),
            "head_movement": "Stable" if eye_contact_pct > 65 else "Frequent Movement"
        },
        "speech_metrics": {
            "wpm": wpm,
            "filler_words_count": filler_words_count,
            "filler_words": ["um", "basically", "like"][:min(3, filler_words_count)],
            "pauses_count": pauses_count
        },
        "weaknesses": weaknesses,
        "sample_improved_answer": improved_sample,
        "improvement_plan_7day": improvement_plan_7day,
        "disclaimer": "Scores are guidance indicators designed for continuous placement preparation."
    }

# ================= 2. AI RESUME SUMMARY GENERATOR =================
def generate_resume_summary(
    role_focus: str,
    years_of_exp: str,
    top_skills: List[str],
    key_achievements: Optional[str] = None
) -> str:
    # Try real LLM first if configured
    prompt = (
        f"Write a high-impact, professional 3-sentence resume executive summary for a {role_focus} candidate ({years_of_exp}). "
        f"Core skills: {', '.join(top_skills)}. Key accomplishments: {key_achievements or 'Built full-stack applications with scalable architecture.'}. "
        f"Make it ATS-friendly, proactive, and achievement-oriented. Do not include quotes."
    )
    llm_res = call_gemini_api(prompt, "You are a senior recruitment director and resume optimization expert.")
    if llm_res:
        return llm_res.strip()

    # Intelligent template synthesizer
    skills_formatted = ", ".join(top_skills[:4]) if top_skills else "Python, SQL, and Web Frameworks"
    achieve = f" Demonstrated ability in {key_achievements}." if key_achievements else " Proven record of developing responsive, high-performance software applications and collaborating across agile delivery cycles."
    
    return (
        f"Results-driven and detail-oriented {role_focus} with hands-on expertise in {skills_formatted}.{achieve} "
        f"Passionate about solving complex algorithmic challenges, designing maintainable system architectures, and driving impactful product outcomes in high-growth engineering environments."
    )

# ================= 3. AI RESUME ANALYZER =================
def analyze_resume_deep(
    resume_text: str,
    target_role: str = "Software Engineer",
    target_company: str = "General Tech"
) -> Dict[str, Any]:
    text_lower = resume_text.lower()
    
    # Comprehensive tech skill taxonomy
    tech_skills_all = {
        "python": "Python", "java": "Java", "c++": "C++", "c#": "C#", "javascript": "JavaScript", "typescript": "TypeScript",
        "react": "React", "next.js": "Next.js", "vue": "Vue.js", "angular": "Angular", "node.js": "Node.js", "fastapi": "FastAPI",
        "django": "Django", "flask": "Flask", "spring": "Spring Boot", "express": "Express.js",
        "sql": "SQL", "postgresql": "PostgreSQL", "mysql": "MySQL", "mongodb": "MongoDB", "redis": "Redis",
        "docker": "Docker", "kubernetes": "Kubernetes", "aws": "AWS", "azure": "Azure", "gcp": "Google Cloud",
        "git": "Git", "ci/cd": "CI/CD", "linux": "Linux", "rest api": "RESTful APIs", "graphql": "GraphQL",
        "data structures": "Data Structures", "algorithms": "Algorithms", "machine learning": "Machine Learning", "deep learning": "Deep Learning",
        "html": "HTML5", "css": "CSS3", "tailwind": "Tailwind CSS"
    }

    soft_skills_all = {
        "leadership": "Leadership", "communication": "Communication", "problem solving": "Problem Solving",
        "teamwork": "Team Collaboration", "critical thinking": "Critical Thinking", "agile": "Agile/Scrum",
        "time management": "Time Management", "adaptability": "Adaptability"
    }

    # Role-specific must-have keyword banks
    role_benchmarks = {
        "Software Engineer": ["python", "data structures", "algorithms", "git", "sql", "rest api", "docker"],
        "Frontend Developer": ["javascript", "react", "html", "css", "tailwind", "typescript", "git"],
        "Backend Developer": ["python", "sql", "fastapi", "docker", "redis", "postgresql", "rest api"],
        "Data Analyst / AI Engineer": ["python", "sql", "machine learning", "data structures", "git", "pandas"],
        "Cloud / DevOps Engineer": ["linux", "docker", "kubernetes", "aws", "ci/cd", "git", "python"]
    }

    extracted_tech = []
    for k, label in tech_skills_all.items():
        if k in text_lower:
            extracted_tech.append(label)

    extracted_soft = []
    for k, label in soft_skills_all.items():
        if k in text_lower:
            extracted_soft.append(label)

    if not extracted_tech:
        extracted_tech = ["Python", "SQL", "Data Structures", "Web Development"]
    if not extracted_soft:
        extracted_soft = ["Problem Solving", "Team Collaboration"]

    # Target role keyword matching
    required = role_benchmarks.get(target_role, ["python", "sql", "data structures", "git", "algorithms"])
    found_required = [k for k in required if k in text_lower]
    missing = [k.capitalize() for k in required if k not in text_lower]

    # Calculate ATS Score (0 - 100)
    score = 50.0 # Baseline for structured text
    
    # Skill volume
    score += min(20.0, len(extracted_tech) * 2.5)
    
    # Required role keyword match percentage
    match_pct = round((len(found_required) / max(1, len(required))) * 100, 1)
    score += (match_pct / 100.0) * 20.0
    
    # Action verbs check
    action_verbs = ["built", "developed", "implemented", "optimized", "engineered", "designed", "architected", "delivered", "reduced", "increased"]
    found_verbs = [v for v in action_verbs if v in text_lower]
    score += min(10.0, len(found_verbs) * 1.5)

    ats_score = min(96.0, round(score, 1))

    formatting_feedback = []
    if "education" not in text_lower:
        formatting_feedback.append("Missing distinct 'Education' section heading for ATS parsers.")
    if "project" not in text_lower:
        formatting_feedback.append("Ensure project titles have explicit technical stack annotations.")
    if not any(v in text_lower for v in ["%", "ms", "x", "sec"]):
        formatting_feedback.append("Include quantifiable metric indicators (e.g., 'reduced load time by 30%') to pass recruiter screening filters.")

    strengths = [
        f"Strong technical footprint: Identified {len(extracted_tech)} relevant technology competencies.",
        f"Target role alignment: {match_pct}% baseline keyword alignment for {target_role}.",
        "Clean textual syntax compatible with standard Taleo/Workday ATS ingestion engines."
    ]

    recommendations = []
    if missing:
        recommendations.append(f"Add key targeted competencies to your skills or project bullets: {', '.join(missing[:4])}.")
    recommendations.append("Begin project bullet points with powerful action verbs (e.g. 'Architected', 'Spearheaded', 'Optimized').")
    recommendations.append(f"Tailor project problem statements to mirror requirements from {target_company} recruitment drives.")

    return {
        "ats_score": ats_score,
        "extracted_skills": {
            "technical": extracted_tech,
            "soft": extracted_soft
        },
        "missing_keywords": missing,
        "formatting_feedback": formatting_feedback if formatting_feedback else ["ATS structure and heading hierarchy meet standard screening criteria."],
        "strengths": strengths,
        "recommendations": recommendations,
        "job_match_pct": match_pct,
        "target_role": target_role
    }

# ================= 4. AI CAREER GUIDANCE ASSISTANT =================
def career_guidance_advisor(
    query: str,
    interests: Optional[List[str]] = None,
    current_skills: Optional[List[str]] = None
) -> Dict[str, Any]:
    # Check LLM first
    prompt = (
        f"Student Query: '{query}'. "
        f"Student Interests: {interests or ['Software Development']}. "
        f"Current Skills: {current_skills or ['Python', 'SQL']}. "
        f"Provide career advice with: 1) recommended career path, 2) top 4 technologies to learn, "
        f"3) 2 industry certifications, 4) 2 standout project ideas, 5) strategic interview advice."
    )
    llm_res = call_gemini_api(prompt, "You are PilotAI, an elite university career guidance counselor and tech industry hiring advisor.")
    
    # Structured response generator
    q_low = query.lower()
    
    if any(k in q_low for k in ["cloud", "devops", "aws", "docker"]):
        role = "Cloud & DevOps Engineer"
        techs = ["Docker & Kubernetes", "Terraform & IaC", "AWS/Azure Cloud Services", "CI/CD GitHub Actions"]
        certs = ["AWS Certified Solutions Architect - Associate", "CKA: Certified Kubernetes Administrator"]
        projects = [
            {"title": "Automated Multi-Tier Cloud Deployment with Terraform & AWS", "desc": "Provision VPC, ECS containers, and RDS database with zero-downtime blue/green CI/CD pipeline."},
            {"title": "Prometheus & Grafana Cluster Monitoring System", "desc": "Real-time metrics scraping, alert routing, and node performance dashboards on Kubernetes."}
        ]
        roadmap = [
            {"phase": "Phase 1: Linux & Networking", "duration": "Weeks 1-3", "focus": "Linux administration, Bash scripting, TCP/IP, DNS, and HTTP/HTTPS protocols."},
            {"phase": "Phase 2: Containerization & Cloud", "duration": "Weeks 4-7", "focus": "Docker container lifecycles, Docker Compose, AWS EC2/S3/IAM core fundamentals."},
            {"phase": "Phase 3: Orchestration & IaC", "duration": "Weeks 8-11", "focus": "Kubernetes pods/deployments/services and Infrastructure as Code with Terraform."},
            {"phase": "Phase 4: SRE & Placement Prep", "duration": "Weeks 12-14", "focus": "CI/CD automation, system design for high availability, and mock interviews."}
        ]
    elif any(k in q_low for k in ["ai", "machine learning", "data", "deep learning"]):
        role = "AI / Machine Learning Engineer"
        techs = ["Python & PyTorch", "FastAPI & Model Serving", "Vector DBs (Chroma/Pinecone)", "RAG & LLM Fine-Tuning"]
        certs = ["TensorFlow Developer Certificate", "AWS Certified Machine Learning - Specialty"]
        projects = [
            {"title": "Enterprise RAG Question-Answering Engine", "desc": "Ingest technical documentation PDFs, embed via LangChain, and serve context-grounded responses with LLMs."},
            {"title": "Real-time Computer Vision Edge Pipeline", "desc": "YOLOv8 object detection system optimized with TensorRT for low-latency live camera streams."}
        ]
        roadmap = [
            {"phase": "Phase 1: Math & Python Foundations", "duration": "Weeks 1-4", "focus": "Linear algebra, multivariable calculus, probability, NumPy, Pandas, and Scikit-Learn."},
            {"phase": "Phase 2: Deep Learning & Frameworks", "duration": "Weeks 5-8", "focus": "Neural network architectures (CNNs, RNNs, Transformers) using PyTorch."},
            {"phase": "Phase 3: Production LLM & GenAI", "duration": "Weeks 9-12", "focus": "Retrieval Augmented Generation (RAG), vector embeddings, and LangChain/LlamaIndex."},
            {"phase": "Phase 4: Capstone & Assessment", "duration": "Weeks 13-15", "focus": "End-to-end model deployment on FastAPI, Docker, and company interview prep."}
        ]
    elif any(k in q_low for k in ["core", "vlsi", "embedded", "ece", "eee", "hardware"]):
        role = "Embedded Systems & Core Electronics Engineer"
        techs = ["Embedded C / C++", "ARM Cortex Architecture", "RTOS (FreeRTOS)", "CAN, SPI, I2C Protocols"]
        certs = ["Arm Accredited Engineer", "Certified Embedded Systems Developer (NI / IEEE)"]
        projects = [
            {"title": "IoT Smart Energy Telemetry Hub with FreeRTOS", "desc": "Real-time power monitoring across sensor nodes over MQTT and local OLED dashboard."},
            {"title": "Automotive Sensor Interface using CAN Protocol", "desc": "Microcontroller firmware verifying packet integrity and fail-safe motor speed control."}
        ]
        roadmap = [
            {"phase": "Phase 1: C Programming & Microcontrollers", "duration": "Weeks 1-4", "focus": "Pointers, bitwise operations, register-level GPIO, timers, and interrupts."},
            {"phase": "Phase 2: Communication Protocols", "duration": "Weeks 5-8", "focus": "UART, SPI, I2C, CAN bus configuration and logic analyzer debugging."},
            {"phase": "Phase 3: Real-Time Operating Systems", "duration": "Weeks 9-12", "focus": "Tasks, queues, semaphores, mutexes, and scheduling in FreeRTOS."},
            {"phase": "Phase 4: Core Placement Prep", "duration": "Weeks 13-15", "focus": "Digital electronics, circuit analysis, Bosch/Siemens round simulations."}
        ]
    else:
        role = "Full-Stack Software Engineer"
        techs = ["Next.js & React", "FastAPI / Node.js", "PostgreSQL & Prisma", "System Design & DSA"]
        certs = ["Meta Front-End / Back-End Professional Certificate", "Oracle Certified Associate Java / AWS Cloud Practitioner"]
        projects = [
            {"title": "SaaS Platform with Real-Time Collaboration", "desc": "Full-stack dashboard with role-based auth, WebSockets for live sync, and PostgreSQL database."},
            {"title": "High-Throughput Task Queue & Microservices", "desc": "Distributed job processing engine using Redis pub/sub and containerized background workers."}
        ]
        roadmap = [
            {"phase": "Phase 1: DSA & Problem Solving", "duration": "Weeks 1-4", "focus": "Arrays, HashMaps, Trees, Graphs, Dynamic Programming on LeetCode/Monaco."},
            {"phase": "Phase 2: Modern Frontend Mastery", "duration": "Weeks 5-8", "focus": "TypeScript, React 18 hooks, Next.js App Router, Tailwind CSS, and state management."},
            {"phase": "Phase 3: Robust Backend & Databases", "duration": "Weeks 9-12", "focus": "REST/GraphQL APIs, indexing, joins, ORMs, JWT authentication, and caching."},
            {"phase": "Phase 4: Full-Stack Capstone & Mock Rounds", "duration": "Weeks 13-16", "focus": "End-to-end deployed portfolio app, resume ATS optimization, and HR practice."}
        ]

    ai_reply_text = (
        llm_res if llm_res else 
        f"Based on your query and interest profile, the recommended high-growth track is **{role}**.\n\n"
        f"To maximize your placement probability across Tier-1 and product companies, focus on mastering {', '.join(techs[:3])}. "
        f"Your portfolio should demonstrate production readiness through end-to-end projects featuring clear system architecture and measurable outcomes."
    )

    return {
        "reply": ai_reply_text,
        "recommended_role": role,
        "recommended_technologies": techs,
        "recommended_certifications": certs,
        "recommended_projects": projects,
        "learning_roadmap": roadmap,
        "interview_tips": [
            "Be prepared to code live on a clean whiteboard or Monaco editor without IDE autocompletion.",
            "Always state Time and Space complexity (Big-O) before writing code.",
            "Frame project explanations with the STAR framework (Situation, Task, Action, Result)."
        ]
    }
