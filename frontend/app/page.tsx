"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Rocket, ArrowRight, CheckCircle2, Cpu, Zap, Code2, 
  Dna, ShieldCheck, Target, BarChart3, Video, FileText, 
  Sparkles, RefreshCw, Layers, Lock, Award, Briefcase, 
  FileCheck, Compass, CheckSquare, Building2, Users 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-28 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-4 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-600/25 via-sky-500/15 to-emerald-500/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="text-center space-y-6 relative z-10 max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-sky-400 font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>AI-Driven Placement Readiness & Campus Hiring Ecosystem</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
            PLACEMENTPILOT <span className="gradient-text">AI</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
            "Your AI-powered placement preparation and recruitment partner."
            <br />
            <span className="text-slate-400 text-base">Practice. Analyze. Improve. Get Placement Ready.</span>
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/dashboard" className="gradient-btn flex items-center gap-2 text-sm font-bold shadow-indigo-500/30">
              <span>Enter Student Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link href="/resume-builder" className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-semibold text-sm transition-all hover:bg-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>AI Resume Builder</span>
            </Link>

            <Link href="/interview/mock" className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-semibold text-sm transition-all hover:bg-slate-800 flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-400" />
              <span>AI Mock Interview</span>
            </Link>

            <Link href="/recruiter" className="px-6 py-3 rounded-xl bg-amber-950/40 border border-amber-800/50 hover:bg-amber-900/40 text-amber-300 font-semibold text-sm transition-all flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Recruiter Portal</span>
            </Link>
          </div>

          {/* Platform Metrics Bar */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-3xl font-black text-indigo-400">10 Features</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Full End-to-End Suite</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-3xl font-black text-sky-400">9 Companies</div>
              <div className="text-xs text-slate-400 font-medium mt-1">TCS, Zoho, Infosys, Bosch</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-3xl font-black text-emerald-400">ATS Verifier</div>
              <div className="text-xs text-slate-400 font-medium mt-1">PDF Engine & Keyword Audit</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-3xl font-black text-amber-400">Live Monaco</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Python, C++, Java Sandbox</div>
            </div>
          </div>

        </div>
      </section>

      {/* THREE USER ROLES SHOWCASE SECTION */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Multi-Role Architecture</span>
          <h2 className="text-3xl font-extrabold text-white">Built for Students, Recruiters & Universities</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Student Role */}
          <div className="glass-card p-6 space-y-4 border-indigo-500/30">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Student Placement Candidate</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Build ATS resumes, test your skills in Monaco code sandboxes, simulate speech and posture in AI video mock interviews, and track job applications in real time.
            </p>
            <div className="pt-2">
              <Link href="/dashboard" className="text-xs text-indigo-400 font-bold flex items-center gap-1.5 hover:underline">
                Enter Student Dashboard →
              </Link>
            </div>
          </div>

          {/* Recruiter Role */}
          <div className="glass-card p-6 space-y-4 border-amber-500/30">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Corporate Recruiter</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Publish hiring drives, filter candidate pools by CGPA cutoffs, verified skills, and ATS match %, shortlist top candidates, and schedule interview rounds.
            </p>
            <div className="pt-2">
              <Link href="/recruiter" className="text-xs text-amber-400 font-bold flex items-center gap-1.5 hover:underline">
                Launch Recruiter Portal →
              </Link>
            </div>
          </div>

          {/* Admin Role */}
          <div className="glass-card p-6 space-y-4 border-purple-500/30">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Placement Cell Officer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track university-wide placement percentages, department-wise recruitment averages, company hiring statistics, and common skill gap diagnostics.
            </p>
            <div className="pt-2">
              <Link href="/analytics" className="text-xs text-purple-400 font-bold flex items-center gap-1.5 hover:underline">
                View Placement Analytics →
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* THE 10 ADVANCED FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Comprehensive Capability Matrix</span>
          <h2 className="text-3xl md:text-5xl font-black text-white">10 Advanced Features Powering PlacementPilot</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">Every module is connected to live database records with responsive interfaces and real-time computation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {[
            {
              title: "1. AI Resume Builder",
              desc: "ATS-friendly templates, AI summary generation, and high-res PDF export.",
              link: "/resume-builder",
              color: "text-indigo-400",
              icon: FileText
            },
            {
              title: "2. AI Resume Analyzer",
              desc: "PDF upload, ATS score calculation, missing keyword audit, and job matching.",
              link: "/resume-analyzer",
              color: "text-sky-400",
              icon: FileCheck
            },
            {
              title: "3. Smart Job Matching",
              desc: "Skill compatibility percentage, internship recommendations, and 1-click apply.",
              link: "/jobs",
              color: "text-emerald-400",
              icon: Briefcase
            },
            {
              title: "4. AI Mock Interview",
              desc: "Multi-role questions, speech pacing, gaze deviation, and 5-axis reports.",
              link: "/interview/mock",
              color: "text-rose-400",
              icon: Video
            },
            {
              title: "5. Timed Assessment",
              desc: "Quantitative, Logical, Verbal, and Monaco Coding with live countdown timer.",
              link: "/assessment",
              color: "text-amber-400",
              icon: CheckSquare
            },
            {
              title: "6. Eligibility Tracker",
              desc: "CGPA cutoffs, backlog tracking, branch verification, and gap closure advice.",
              link: "/eligibility",
              color: "text-cyan-400",
              icon: ShieldCheck
            },
            {
              title: "7. Recruiter Dashboard",
              desc: "Post openings, filter candidates by qualifications, and schedule interviews.",
              link: "/recruiter",
              color: "text-amber-300",
              icon: Building2
            },
            {
              title: "8. Application ATS",
              desc: "Real-time pipeline tracker: Applied ➔ Shortlisted ➔ Interview ➔ Selected.",
              link: "/applications",
              color: "text-pink-400",
              icon: Layers
            },
            {
              title: "9. Placement Analytics",
              desc: "Placed/unplaced counts, placement %, CTC distribution, and reports.",
              link: "/analytics",
              color: "text-violet-400",
              icon: BarChart3
            },
            {
              title: "10. PilotAI Career Mentor",
              desc: "Interactive AI advisor, 4-phase learning roadmaps, certs, and project blueprints.",
              link: "/career-assistant",
              color: "text-purple-400",
              icon: Compass
            }
          ].map((f, idx) => {
            const Icon = f.icon;
            return (
              <Link 
                key={idx}
                href={f.link}
                className="glass-card p-5 space-y-3 flex flex-col justify-between hover:scale-[1.02] transition-transform group"
              >
                <div className="space-y-2">
                  <div className={`w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 ${f.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
                <div className="text-[11px] text-indigo-400 font-bold flex items-center gap-1 pt-1">
                  Launch Module →
                </div>
              </Link>
            );
          })}

        </div>
      </section>

      {/* 7-STEP CONTINUOUS IMPROVEMENT LOOP */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">7-Step Systematic Placement Prep Cycle</h2>
          <p className="text-slate-400 text-xs">Diagnostic progression built into every student journey.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-7 gap-3 text-center">
          {[
            { step: "1. DIAGNOSE", desc: "Diagnostic test identifies weak areas" },
            { step: "2. PRACTICE", desc: "Targeted Aptitude, Tech & Coding rounds" },
            { step: "3. GET SCORED", desc: "Transparent 100-pt scoring across 5 axes" },
            { step: "4. FEEDBACK", desc: "Timestamped weaknesses & concrete evidence" },
            { step: "5. 7-DAY PLAN", desc: "Actionable daily preparation tasks" },
            { step: "6. RETEST", desc: "Auto-generated weak spot retakes" },
            { step: "7. APPLY", desc: "Sit for eligible company drives" },
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-center space-y-1">
              <div className="font-extrabold text-[10px] tracking-wider text-sky-400">{item.step}</div>
              <div className="text-[11px] text-slate-300 leading-snug">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
