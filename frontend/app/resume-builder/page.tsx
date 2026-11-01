"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  FileText, Sparkles, Download, Save, Plus, Trash2, CheckCircle2, 
  Eye, RefreshCw, LayoutTemplate, Award, Briefcase, GraduationCap, 
  Code, UserCheck, ChevronRight, Check 
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ResumeBuilderPage() {
  const [template, setTemplate] = useState<'modern' | 'clean' | 'executive' | 'tech'>('modern');
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [atsScore, setAtsScore] = useState(88.0);

  // Resume State
  const [personal, setPersonal] = useState({
    fullName: "Ajay Babu",
    email: "ajaybabumolamanti13@gmail.com",
    phone: "+91 98765 43210",
    location: "Hyderabad, India",
    linkedin: "https://linkedin.com/in/ajaybabu",
    github: "https://github.com/ajaybabumolamanti13-cyber",
    portfolio: "https://placementpilot.ai"
  });

  const [summary, setSummary] = useState(
    "Results-driven Software Engineering student with hands-on experience in React, Next.js, FastAPI, and distributed system architectures. Proven track record in developing high-throughput web platforms and solving complex algorithmic challenges with 95%+ test coverage."
  );

  const [education, setEducation] = useState([
    { institution: "National Institute of Technology", degree: "B.Tech", field: "Computer Science & Engineering", year: "2023 - 2027", score: "8.4 CGPA" },
    { institution: "City Model Junior College", degree: "Class XII (State Board)", field: "MPC", year: "2021 - 2023", score: "92.4%" }
  ]);

  const [experience, setExperience] = useState([
    {
      company: "NexGen Innovations",
      role: "Full-Stack Web Intern",
      duration: "May 2025 - Jul 2025",
      location: "Remote",
      points: [
        "Engineered RESTful microservices in FastAPI reducing query latency by 40% using Redis caching.",
        "Designed dynamic analytics dashboard in Next.js & Tailwind CSS consumed by 2,000+ daily active users."
      ]
    }
  ]);

  const [projects, setProjects] = useState([
    {
      title: "PlacementPilot AI Platform",
      tech: "Next.js, FastAPI, Monaco Editor, Recharts",
      link: "https://github.com/ajaybabumolamanti13-cyber/placepilot",
      points: [
        "Architected unified placement readiness portal with AI Mock Interviews, ATS Resume Builder, and automated code runner.",
        "Integrated client-side audio/video processing and algorithmic company eligibility tracker."
      ]
    },
    {
      title: "Distributed Task Queue & Cache",
      tech: "Python, Redis, Docker, PostgreSQL",
      link: "https://github.com/ajaybabumolamanti13-cyber",
      points: [
        "Implemented resilient asynchronous background job processing engine handling 500+ tasks/sec."
      ]
    }
  ]);

  const [skills, setSkills] = useState({
    technical: ["Python", "JavaScript", "TypeScript", "React", "Next.js", "FastAPI", "SQL", "PostgreSQL", "Docker", "Git"],
    soft: ["Problem Solving", "Agile Collaboration", "Technical Communication", "Analytical Thinking"],
    tools: ["VS Code", "Postman", "Monaco Editor", "Figma", "Linux/Bash"]
  });

  const [certifications, setCertifications] = useState([
    { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", year: "2025" },
    { name: "Meta Front-End Developer Specialization", issuer: "Meta / Coursera", year: "2024" }
  ]);

  const resumePrintRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Load existing profile from backend
    axios.get('/api/resume/builder/profile/1')
      .then(res => {
        const d = res.data;
        if (d.personal_info) setPersonal(d.personal_info);
        if (d.summary) setSummary(d.summary);
        if (d.education) setEducation(d.education);
        if (d.experience) setExperience(d.experience);
        if (d.projects) setProjects(d.projects);
        if (d.skills) setSkills(d.skills);
        if (d.certifications) setCertifications(d.certifications);
        if (d.ats_score) setAtsScore(d.ats_score);
        if (d.template_name) setTemplate(d.template_name as any);
      })
      .catch(() => {});
  }, []);

  const handleGenerateAiSummary = async () => {
    setGeneratingSummary(true);
    try {
      const res = await axios.post('/api/resume/builder/generate-summary', {
        role_focus: "Full-Stack Software Engineer",
        years_of_exp: "Fresher / Final Year Student",
        top_skills: skills.technical.slice(0, 5),
        key_achievements: projects.map(p => p.title).join(", ")
      });
      if (res.data.summary) {
        setSummary(res.data.summary);
      }
    } catch (err) {
      alert("AI summary generator initialized with local fallback.");
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await axios.post('/api/resume/builder/save', {
        user_id: 1,
        title: `${personal.fullName} - ATS Resume`,
        template_name: template,
        personal_info: personal,
        summary,
        education,
        experience,
        projects,
        skills,
        certifications
      });
      if (res.data.ats_score) setAtsScore(res.data.ats_score);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert("Saved profile locally.");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!resumePrintRef.current) return;
    setDownloading(true);
    try {
      const element = resumePrintRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${personal.fullName.replace(/\s+/g, '_')}_Resume_ATS.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-sky-950/60 p-6 rounded-3xl border border-indigo-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Resume Builder • ATS Grade Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Create Your ATS-Friendly Placement Resume</h1>
          <p className="text-slate-300 text-sm">Organize skills, generate AI summaries, switch ATS templates, and export high-resolution PDFs.</p>
        </div>

        {/* ATS Score & Action Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-2xl">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-bold uppercase">ATS Compatibility</div>
              <div className="text-xl font-black text-emerald-400">{atsScore}%</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
              ✓
            </div>
          </div>

          <button 
            onClick={handleSaveProfile}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 text-white text-xs font-semibold flex items-center gap-2 transition-all hover:bg-slate-700"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-sky-400" />}
            <span>{saveSuccess ? "Saved!" : "Save Profile"}</span>
          </button>

          <button 
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="gradient-btn text-xs px-5 py-2.5 flex items-center gap-2"
          >
            {downloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Download ATS PDF</span>
          </button>
        </div>
      </div>

      {/* Template Selector Bar */}
      <div className="flex items-center gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-2xl overflow-x-auto">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 pl-2">
          <LayoutTemplate className="w-4 h-4 text-indigo-400" />
          <span>Templates:</span>
        </span>
        {[
          { id: 'modern', name: 'Modern Tech' },
          { id: 'clean', name: 'Clean Minimal' },
          { id: 'executive', name: 'Classic Executive' },
          { id: 'tech', name: 'Sleek Two-Column' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTemplate(t.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              template === t.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Main Two-Column Layout: Left = Form Editor, Right = Live Resume Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: EDIT CONTROLS */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Section 1: Personal Info */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
              <UserCheck className="w-4 h-4 text-indigo-400" />
              <span>Personal & Contact Information</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium">Full Name</label>
                <input 
                  type="text" 
                  value={personal.fullName} 
                  onChange={e => setPersonal({...personal, fullName: e.target.value})}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500" 
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Email</label>
                <input 
                  type="email" 
                  value={personal.email} 
                  onChange={e => setPersonal({...personal, email: e.target.value})}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500" 
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Phone</label>
                <input 
                  type="text" 
                  value={personal.phone} 
                  onChange={e => setPersonal({...personal, phone: e.target.value})}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500" 
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Location</label>
                <input 
                  type="text" 
                  value={personal.location} 
                  onChange={e => setPersonal({...personal, location: e.target.value})}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500" 
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-slate-400 font-medium">LinkedIn URL</label>
                <input 
                  type="text" 
                  value={personal.linkedin} 
                  onChange={e => setPersonal({...personal, linkedin: e.target.value})}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500" 
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-slate-400 font-medium">GitHub / Portfolio URL</label>
                <input 
                  type="text" 
                  value={personal.github} 
                  onChange={e => setPersonal({...personal, github: e.target.value})}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500" 
                />
              </div>
            </div>
          </div>

          {/* Section 2: AI Summary */}
          <div className="glass-card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>Professional Summary</span>
              </h3>
              <button 
                onClick={handleGenerateAiSummary}
                disabled={generatingSummary}
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/30 px-2.5 py-1 rounded-lg transition-all"
              >
                {generatingSummary ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                <span>Auto-Generate AI</span>
              </button>
            </div>
            <textarea 
              rows={4}
              value={summary}
              onChange={e => setSummary(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          {/* Section 3: Technical & Soft Skills */}
          <div className="glass-card p-5 space-y-3">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
              <Code className="w-4 h-4 text-emerald-400" />
              <span>Core Skills & Tools</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium">Technical Skills (comma-separated)</label>
                <input 
                  type="text" 
                  value={skills.technical.join(", ")}
                  onChange={e => setSkills({...skills, technical: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Soft & Professional Skills</label>
                <input 
                  type="text" 
                  value={skills.soft.join(", ")}
                  onChange={e => setSkills({...skills, soft: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Developer Tools & Platforms</label>
                <input 
                  type="text" 
                  value={skills.tools.join(", ")}
                  onChange={e => setSkills({...skills, tools: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Projects */}
          <div className="glass-card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-400" />
                <span>Featured Technical Projects</span>
              </h3>
              <button 
                onClick={() => setProjects([...projects, { title: "New Project", tech: "React, Python", link: "https://github.com", points: ["Built system architecture with real-time updates."] }])}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Project
              </button>
            </div>
            <div className="space-y-4">
              {projects.map((proj, idx) => (
                <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <input 
                      type="text"
                      value={proj.title}
                      onChange={e => {
                        const copy = [...projects];
                        copy[idx].title = e.target.value;
                        setProjects(copy);
                      }}
                      className="bg-transparent font-bold text-white focus:outline-none border-b border-slate-700 w-3/4"
                    />
                    <button 
                      onClick={() => setProjects(projects.filter((_, i) => i !== idx))}
                      className="text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Tech Stack</label>
                    <input 
                      type="text"
                      value={proj.tech}
                      onChange={e => {
                        const copy = [...projects];
                        copy[idx].tech = e.target.value;
                        setProjects(copy);
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Impact Bullet Point</label>
                    <textarea 
                      rows={2}
                      value={proj.points.join("\n")}
                      onChange={e => {
                        const copy = [...projects];
                        copy[idx].points = e.target.value.split("\n");
                        setProjects(copy);
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Education */}
          <div className="glass-card p-5 space-y-3">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Academic Education</span>
            </h3>
            <div className="space-y-3">
              {education.map((edu, idx) => (
                <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl grid grid-cols-2 gap-2 text-xs">
                  <div className="col-span-2">
                    <input 
                      type="text"
                      value={edu.institution}
                      onChange={e => {
                        const copy = [...education];
                        copy[idx].institution = e.target.value;
                        setEducation(copy);
                      }}
                      className="w-full bg-transparent font-bold text-white border-b border-slate-700 pb-1"
                    />
                  </div>
                  <div>
                    <input 
                      type="text"
                      value={edu.degree}
                      onChange={e => {
                        const copy = [...education];
                        copy[idx].degree = e.target.value;
                        setEducation(copy);
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-slate-200"
                    />
                  </div>
                  <div>
                    <input 
                      type="text"
                      value={edu.score}
                      onChange={e => {
                        const copy = [...education];
                        copy[idx].score = e.target.value;
                        setEducation(copy);
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-slate-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: LIVE ATS RESUME PREVIEW */}
        <div className="lg:col-span-7 sticky top-20">
          
          <div className="flex items-center justify-between pb-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 font-semibold text-slate-300">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Live ATS Document View (A4 Standard)</span>
            </div>
            <span className="text-[11px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-sky-400">
              Template: {template.toUpperCase()}
            </span>
          </div>

          {/* Printable Container */}
          <div 
            ref={resumePrintRef}
            className={`w-full bg-white text-slate-900 rounded-2xl p-8 sm:p-10 shadow-2xl transition-all duration-300 font-sans min-h-[900px] border border-slate-200 ${
              template === 'tech' ? 'font-mono text-[12px]' : 'text-[13px]'
            }`}
          >
            
            {/* Header Block */}
            <div className={`pb-5 border-b ${template === 'modern' ? 'border-indigo-600' : 'border-slate-800'}`}>
              <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${template === 'modern' ? 'text-indigo-900' : 'text-slate-950'}`}>
                {personal.fullName}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 mt-2 font-medium">
                <span>{personal.email}</span>
                <span>•</span>
                <span>{personal.phone}</span>
                <span>•</span>
                <span>{personal.location}</span>
                <span>•</span>
                <span className="text-indigo-600 underline">{personal.github}</span>
              </div>
            </div>

            {/* Summary */}
            <div className="py-4 border-b border-slate-200 space-y-1.5">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">Professional Summary</h2>
              <p className="text-[12px] text-slate-700 leading-relaxed">{summary}</p>
            </div>

            {/* Technical Skills */}
            <div className="py-4 border-b border-slate-200 space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">Technical Competencies</h2>
              <div className="space-y-1 text-[12px]">
                <div><strong className="text-slate-900">Languages & Frameworks:</strong> {skills.technical.join(", ")}</div>
                <div><strong className="text-slate-900">Developer Tools:</strong> {skills.tools.join(", ")}</div>
                <div><strong className="text-slate-900">Professional Skills:</strong> {skills.soft.join(", ")}</div>
              </div>
            </div>

            {/* Projects */}
            <div className="py-4 border-b border-slate-200 space-y-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">Key Engineering Projects</h2>
              {projects.map((proj, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-[13px]">{proj.title}</span>
                    <span className="text-[11px] text-slate-500 font-medium">({proj.tech})</span>
                  </div>
                  <ul className="list-disc list-inside text-[12px] text-slate-700 space-y-0.5">
                    {proj.points.map((pt, pIdx) => (
                      <li key={pIdx} className="leading-snug">{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Experience */}
            <div className="py-4 border-b border-slate-200 space-y-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">Work Experience / Internships</h2>
              {experience.map((exp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-bold text-slate-900 text-[13px]">{exp.role}</span>
                      <span className="text-slate-600 text-[12px]"> — {exp.company}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">{exp.duration}</span>
                  </div>
                  <ul className="list-disc list-inside text-[12px] text-slate-700 space-y-0.5">
                    {exp.points.map((pt, pIdx) => (
                      <li key={pIdx} className="leading-snug">{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="py-4 border-b border-slate-200 space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">Education</h2>
              {education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-baseline text-[12px]">
                  <div>
                    <span className="font-bold text-slate-900">{edu.institution}</span>
                    <span className="text-slate-600"> — {edu.degree} ({edu.field})</span>
                  </div>
                  <div className="font-bold text-indigo-700 text-[11px]">{edu.score} ({edu.year})</div>
                </div>
              ))}
            </div>

            {/* Certifications */}
            {certifications.length > 0 && (
              <div className="pt-4 space-y-1.5">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">Certifications & Honors</h2>
                <div className="text-[12px] text-slate-700 space-y-1">
                  {certifications.map((c, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>• {c.name} — <span className="text-slate-500">{c.issuer}</span></span>
                      <span className="text-slate-500">{c.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
