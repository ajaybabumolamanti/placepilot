# PLACEMENTPILOT AI — Full-Stack Placement Readiness & Recruitment Platform

> **"Practice. Analyze. Improve. Get Placement Ready."**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Online%20(HTTPS)-brightgreen?style=for-the-badge&logo=cloudflare)](https://organizational-marked-edmonton-laden.trycloudflare.com)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/ajaybabumolamanti13-cyber/placepilot)
[![Build Status](https://img.shields.io/badge/Build-Passing%20(25%2F25%20Routes)-success?style=for-the-badge)](https://github.com/ajaybabumolamanti13-cyber/placepilot)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)

---

### 🌐 Live Public Access & Repository
- **Live Website URL**: [https://organizational-marked-edmonton-laden.trycloudflare.com](https://organizational-marked-edmonton-laden.trycloudflare.com)
- **GitHub Repository**: [https://github.com/ajaybabumolamanti13-cyber/placepilot](https://github.com/ajaybabumolamanti13-cyber/placepilot)
- **API Swagger Documentation**: [https://organizational-marked-edmonton-laden.trycloudflare.com/docs](https://organizational-marked-edmonton-laden.trycloudflare.com/docs) (or `http://127.0.0.1:8000/docs` locally)

---

PlacementPilot AI is an enterprise-grade campus placement readiness and corporate recruitment SaaS platform. Built with **Next.js 14**, **FastAPI**, **SQLAlchemy**, and **Tailwind CSS**, it bridges the gap between engineering students (CSE, ECE, EEE, Biotech), corporate recruiters, and college placement cells.

---

## 🌟 The 10 Advanced Features

### 1. AI Resume Builder
- **Multiple ATS-Friendly Templates**: Switch between *Modern Tech*, *Clean Minimal*, *Classic Executive*, and *Sleek Two-Column* templates in real time.
- **Section Management**: Real-time form controls for personal details, education, internships, projects, technical/soft skills, tools, and certifications.
- **AI Professional Summary**: Generates proactive, achievement-oriented 3-sentence executive summaries customized to your target role with one click.
- **Live A4 Preview & High-Res PDF Export**: Instant client-side PDF generation using `jsPDF` and `html2canvas`.
- **Database Persistence**: Saves resume profiles directly to the user's database record.

### 2. AI Resume Analyzer
- **PDF & Text Ingestion**: Upload PDF resumes or paste text.
- **ATS Compatibility Score**: Calculates an objective ATS readiness rating (0–100%) against industry standards.
- **Skill Extraction**: Identifies and separates technical vs. soft skills.
- **Missing Keyword Audit**: Identifies high-priority keywords missing from your resume based on your target role.
- **Job-Specific Matching**: Cross-matches your resume against targeted roles (Software Engineer, Frontend Developer, Backend Developer, Data Analyst/AI, Cloud/DevOps) and target companies (TCS, Zoho, Infosys, Freshworks, Bosch).

### 3. Smart Job Recommendation System
- **Profile-Grounded Recommendations**: Algorithmic scoring that compares student skills, CGPA, and backlogs with open company positions.
- **Match Compatibility Percentage**: Displays real-time match ratings (e.g., 94% Match).
- **Opportunity Categorization**: Filter by Full-Time roles and Internships with salary package badges.
- **1-Click ATS Apply**: Directly submits candidate applications to the Application Tracking System.

### 4. AI Mock Video Interview System
- **Role-Based Question Bank**: Practice technical and HR questions tailored for SDE, Frontend, Data Analyst/AI, Embedded/Core Electronics, and STAR Behavioral rounds.
- **Hardware Diagnostic Check**: Automated webcam and microphone verification before starting.
- **Observable Metric Signals**: Real-time tracking of camera gaze/eye contact %, physical posture score, speech pacing (WPM), and vocal filler word count.
- **Speech-to-Text Transcription**: Live audio transcription using Web Speech API with seamless fallback.
- **5-Axis Evaluation Scorecard**: Content correctness (35%), Communication clarity (20%), Speech pacing (15%), Body language (15%), and Technical depth (15%).
- **Prescribed 7-Day Plan & Exemplary STAR Answer**: Generates timestamped weaknesses, concrete recommendations, and an actionable 7-day preparation schedule.

### 5. Timed Aptitude & Coding Assessment
- **Comprehensive 4-Section Exam**:
  1. *Quantitative Aptitude* (Speed Distance Time, Time & Work, Profit & Loss).
  2. *Logical Reasoning* (Blood Relations, Series Patterns, Syllogisms).
  3. *Verbal Ability* (Vocabulary, Synonyms, Grammar Correction).
  4. *Monaco Coding Challenge* (Interactive code editor with sandboxed execution in Python, C++, and Java).
- **Active Countdown Timer**: 45-minute countdown with automatic submission upon timeout.
- **Instant Automatic Evaluation**: Immediate scorecard with section breakdowns, weak-topic identification, and benchmark performance bands.

### 6. Placement Eligibility Tracker
- **Academic Profile Tracking**: Monitors student CGPA, active backlogs, verified skills, and branch.
- **Company Cutoff Comparator**: Compares student metrics against company criteria across all 9 visiting companies.
- **Eligibility Breakdown**: Explicitly details why a student is or is not eligible (e.g., *CGPA is 7.2, required 7.5; Missing mandatory skill: SQL*).
- **Interactive Simulator**: Inline "Simulate Academic Stats" modal allowing students to test gap-closure scenarios.

### 7. Company & Recruiter Dashboard
- **Recruiter Management**: Multi-role support with dedicated recruiter workflows.
- **Job Publishing Portal**: Recruiters can post new campus drives with cutoffs, required skills, package, and deadlines.
- **Applicant Review Pipeline**: Filter candidates by status, minimum CGPA, and required skills.
- **Candidate Actions**: Shortlist candidates, reject applications, and schedule interview rounds with customized dates, modes, and notes.

### 8. Application Tracking System (ATS)
- **Visual Milestones Pipeline**: Tracks application stages:
  `Applied` ➔ `Under Review` ➔ `Shortlisted` ➔ `Interview Scheduled` ➔ `Selected` / `Rejected`.
- **In-App Notification Center**: Unread alerts for status updates and interview invitations.
- **Interview Action Hub**: Direct links to launch tailored AI mock interviews for scheduled company rounds.

### 9. Live Placement Analytics Dashboard
- **Executive KPIs**: Total registered students, placed count, unplaced count, and placement percentage.
- **Interactive Data Visualizations**:
  - Department-wise placement rate bar chart (`CSE`, `ECE`, `EEE`, `Biotech`).
  - Salary package distribution pie chart.
  - Company-wise offers, average package, and highest CTC table.
- **Export Ready**: One-click downloadable/printable reports.

### 10. AI Career Guidance Assistant (PilotAI)
- **Interactive Chatbot Advisor**: Natural language guidance answering questions about industry roles, skill requirements, and preparation roadmaps.
- **Tailored Career Tracks**: Recommends high-growth tracks based on student interests (Full-Stack, Cloud & DevOps, AI/ML, Embedded Systems).
- **4-Phase Learning Roadmap**: Actionable week-by-week progression milestones.
- **High-Value Certifications & Portfolio Blueprints**: Concrete project architectures and recognized industry credentials to maximize placement odds.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Monaco Editor (`@monaco-editor/react`), Recharts, Lucide Icons, jsPDF, html2canvas |
| **Backend** | Python 3.11+, FastAPI, Uvicorn, Gunicorn, SQLAlchemy 2.0, Pydantic v2, pypdf, python-multipart, requests |
| **Database** | SQLite (Local Development) / PostgreSQL (Production Cloud) |
| **AI Integration** | Google Gemini API (1.5 Flash) with robust, deterministic intelligent fallback heuristics |

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+ (or Windows Python Launcher `py`)

### 1. Backend Setup
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI backend will run on `http://127.0.0.1:8000`.
Interactive API Documentation is available at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```
The Next.js frontend will run on `http://localhost:3000`.

---

## 🔑 Demo Logins & Role Access

| Role | Email / Access | Key Features |
|---|---|---|
| **Student** | `demo@placementpilot.ai` | Dashboard, Resume Builder, Analyzer, Jobs, Assessment, Eligibility, ATS |
| **Recruiter** | `recruiter@tcs.com` | Recruiter Dashboard (`/recruiter`), Job Publishing, Candidate Filtering |
| **Admin** | `admin@placementpilot.ai` | Placement Analytics (`/analytics`), Department Benchmarks (`/admin`) |

*Password for all demo accounts*: `password123` (One-click role switching is also available on the top-right navbar).

---

## ☁️ Cloud & Live Production Deployment

### 1. Instant 1-Click Cloud Deployment

#### Frontend on Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fajaybabumolamanti13-cyber%2Fplacepilot&project-name=placementpilot-ai&root-directory=frontend&env=BACKEND_API_URL)

1. Click the **Deploy with Vercel** button above or import `https://github.com/ajaybabumolamanti13-cyber/placepilot` into [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Set Framework Preset to **Next.js**.
4. Configure Environment Variable:
   - `BACKEND_API_URL`: Your backend URL (e.g., `https://placementpilot-backend.onrender.com` or your live API URL).
5. Click **Deploy**. Vercel will build and publish your Next.js application with automatic SSL and global CDN.

#### Backend on Render
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/ajaybabumolamanti13-cyber/placepilot)

1. Click the **Deploy to Render** button above or create a **New Web Service** from your GitHub repo on [Render](https://render.com).
2. Render detects `render.yaml` automatically for Infrastructure-as-Code setup, or set:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Configure Environment Variables:
   - `DATABASE_URL`: PostgreSQL connection string (or defaults to SQLite starter data)
   - `GEMINI_API_KEY`: *(Optional)* Your Gemini API Key for dynamic LLM generation
   - `SECRET_KEY`: Secure secret string

---

### 2. Instant Live HTTPS Tunnel Deployment
To expose the complete full-stack platform immediately on a public HTTPS URL without configuring DNS or cloud providers:

```powershell
powershell -ExecutionPolicy Bypass -File .\start_services.ps1
```
This script starts the FastAPI backend, compiles/runs the Next.js production server, establishes a secure Cloudflare Tunnel, and prints your public HTTPS URL.

---

## 🧪 Quality Assurance & Verification
- **Compilation**: Full Next.js static and dynamic route compilation across all 25 routes with 0 errors.
- **Database**: SQLite & PostgreSQL compatibility verified with SQLAlchemy ORM schemas.
- **Security**: No hardcoded API keys or credentials; secrets are isolated in environment variables; `.gitignore` protects cache and sensitive files.
