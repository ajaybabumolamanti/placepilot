import React from 'react';
import Link from 'next/link';
import { Rocket, Shield, Lock, EyeOff, Sparkles, CheckCircle2, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-10 px-4 lg:px-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
        
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Rocket className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-white text-lg tracking-tight">PLACEMENTPILOT <span className="text-sky-400">AI</span></span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            The next-generation continuous placement readiness ecosystem for engineering students, recruiters, and university placement cells.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              All Systems Operational
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-lg">
              <Shield className="w-3 h-3" />
              ATS Verifier 2.0
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">AI Career Suite</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/resume-builder" className="hover:text-indigo-400 transition-colors">AI Resume Builder (PDF)</Link></li>
            <li><Link href="/resume-analyzer" className="hover:text-indigo-400 transition-colors">AI Resume Analyzer (ATS)</Link></li>
            <li><Link href="/interview/mock" className="hover:text-indigo-400 transition-colors">AI Mock Video Interview</Link></li>
            <li><Link href="/career-assistant" className="hover:text-indigo-400 transition-colors">PilotAI Career Mentor</Link></li>
            <li><Link href="/assessment" className="hover:text-indigo-400 transition-colors">Timed Assessment Portal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Hiring & Placement</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/jobs" className="hover:text-indigo-400 transition-colors">Smart Job Recommendations</Link></li>
            <li><Link href="/eligibility" className="hover:text-indigo-400 transition-colors">Placement Eligibility Tracker</Link></li>
            <li><Link href="/applications" className="hover:text-indigo-400 transition-colors">Application Tracker (ATS)</Link></li>
            <li><Link href="/recruiter" className="hover:text-amber-400 transition-colors">Recruiter Dashboard</Link></li>
            <li><Link href="/analytics" className="hover:text-purple-400 transition-colors">Placement Cell Analytics</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Practice Rounds</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/practice/aptitude" className="hover:text-white transition-colors">Quantitative & Logical</Link></li>
            <li><Link href="/practice/coding" className="hover:text-white transition-colors">Monaco Coding Studio</Link></li>
            <li><Link href="/practice/technical" className="hover:text-white transition-colors">Department Core MCQs</Link></li>
            <li><Link href="/practice/hr" className="hover:text-white transition-colors">STAR Framework HR</Link></li>
            <li><Link href="/practice/retest" className="hover:text-white transition-colors">Weak-Spot Retest</Link></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 PLACEMENTPILOT AI. Designed for Campus Recruitment Excellence.</p>
        <p className="flex items-center gap-1">
          Practice • Analyze • Improve • Get Placement Ready
        </p>
      </div>
    </footer>
  );
}
