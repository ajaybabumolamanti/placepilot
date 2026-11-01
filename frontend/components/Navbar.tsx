"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { 
  Rocket, LayoutDashboard, Building2, Code2, 
  Video, FileText, BarChart3, ChevronDown, User, ShieldCheck,
  Briefcase, CheckSquare, Bell, Compass, FileCheck, Layers, Menu, X, Sparkles
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeRole, setActiveRole] = useState<'STUDENT' | 'RECRUITER' | 'ADMIN'>('STUDENT');

  useEffect(() => {
    // Load notifications for demo user 1
    axios.get('/api/notifications/user/1')
      .then(res => {
        if (Array.isArray(res.data)) {
          setNotifications(res.data);
        }
      })
      .catch(() => {
        setNotifications([
          { id: 1, title: "Interview Scheduled with TCS", message: "Tomorrow at 10:30 AM via Google Meet", type: "INTERVIEW_INVITE", is_read: false },
          { id: 2, title: "Application Shortlisted at Zoho", message: "Cleared resume screening", type: "APPLICATION_STATUS", is_read: false }
        ]);
      });
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
              PLACEMENTPILOT <span className="text-xs px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono border border-sky-500/30">AI</span>
            </span>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">PRACTICE • ANALYZE • IMPROVE</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden xl:flex items-center gap-5 text-xs font-semibold text-slate-300">
          
          <Link 
            href="/dashboard" 
            className={`flex items-center gap-1.5 transition-colors py-1 ${pathname === '/dashboard' ? 'text-indigo-400 font-bold' : 'hover:text-white'}`}
          >
            <LayoutDashboard className="w-4 h-4 text-indigo-400" />
            Dashboard
          </Link>

          {/* AI Tools Dropdown */}
          <div className="relative" onMouseEnter={() => setToolsOpen(true)} onMouseLeave={() => setToolsOpen(false)}>
            <button className="flex items-center gap-1 hover:text-white transition-colors py-1">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>AI Modules</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {toolsOpen && (
              <div className="absolute top-full left-0 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 flex flex-col gap-1 z-50">
                <Link href="/resume-builder" className="p-2.5 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2.5 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center"><FileText className="w-3.5 h-3.5" /></div>
                  <div>
                    <div className="font-bold">AI Resume Builder</div>
                    <div className="text-[10px] text-slate-400">ATS templates & PDF download</div>
                  </div>
                </Link>
                <Link href="/resume-analyzer" className="p-2.5 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2.5 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center"><FileCheck className="w-3.5 h-3.5" /></div>
                  <div>
                    <div className="font-bold">AI Resume Analyzer</div>
                    <div className="text-[10px] text-slate-400">ATS score & job matching</div>
                  </div>
                </Link>
                <Link href="/interview/mock" className="p-2.5 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2.5 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><Video className="w-3.5 h-3.5" /></div>
                  <div>
                    <div className="font-bold">AI Mock Interview</div>
                    <div className="text-[10px] text-slate-400">Speech & visual metrics</div>
                  </div>
                </Link>
                <Link href="/career-assistant" className="p-2.5 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2.5 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center"><Compass className="w-3.5 h-3.5" /></div>
                  <div>
                    <div className="font-bold">AI Career Guidance</div>
                    <div className="text-[10px] text-slate-400">Learning roadmaps & certs</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link 
            href="/jobs" 
            className={`flex items-center gap-1.5 transition-colors py-1 ${pathname === '/jobs' ? 'text-indigo-400 font-bold' : 'hover:text-white'}`}
          >
            <Briefcase className="w-4 h-4 text-emerald-400" />
            Jobs & Internships
          </Link>

          <Link 
            href="/assessment" 
            className={`flex items-center gap-1.5 transition-colors py-1 ${pathname === '/assessment' ? 'text-indigo-400 font-bold' : 'hover:text-white'}`}
          >
            <CheckSquare className="w-4 h-4 text-amber-400" />
            Timed Assessment
          </Link>

          <Link 
            href="/eligibility" 
            className={`flex items-center gap-1.5 transition-colors py-1 ${pathname === '/eligibility' ? 'text-indigo-400 font-bold' : 'hover:text-white'}`}
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Eligibility Tracker
          </Link>

          <Link 
            href="/applications" 
            className={`flex items-center gap-1.5 transition-colors py-1 ${pathname === '/applications' ? 'text-indigo-400 font-bold' : 'hover:text-white'}`}
          >
            <Layers className="w-4 h-4 text-pink-400" />
            Applications (ATS)
          </Link>

          {/* Practice Hub Dropdown */}
          <div className="relative" onMouseEnter={() => setPracticeOpen(true)} onMouseLeave={() => setPracticeOpen(false)}>
            <button className="flex items-center gap-1 hover:text-white transition-colors py-1">
              <span>Practice Rounds</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {practiceOpen && (
              <div className="absolute top-full left-0 w-60 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 flex flex-col gap-1 z-50">
                <Link href="/practice/aptitude" className="p-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Aptitude Round (Quant/Logic/Verbal)
                </Link>
                <Link href="/practice/technical" className="p-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span> Technical MCQs (CSE/ECE/EEE/Bio)
                </Link>
                <Link href="/practice/coding" className="p-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2 text-xs">
                  <Code2 className="w-3.5 h-3.5 text-indigo-400" /> Monaco Coding Sandbox
                </Link>
                <Link href="/practice/hr" className="p-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span> Behavioral HR (STAR Framework)
                </Link>
                <Link href="/companies" className="p-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2 text-xs">
                  <Building2 className="w-3.5 h-3.5 text-purple-400" /> Company Preparation Guides
                </Link>
                <Link href="/practice/retest" className="p-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-pink-400"></span> Weak-Spot Diagnostic Retest
                </Link>
              </div>
            )}
          </div>

          <Link 
            href="/analytics" 
            className={`flex items-center gap-1.5 transition-colors py-1 ${pathname === '/analytics' ? 'text-indigo-400 font-bold' : 'hover:text-white'}`}
          >
            <BarChart3 className="w-4 h-4 text-violet-400" />
            Analytics
          </Link>

          <Link 
            href="/recruiter" 
            className={`flex items-center gap-1.5 transition-colors py-1 ${pathname === '/recruiter' ? 'text-amber-400 font-bold' : 'hover:text-amber-300'}`}
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            Recruiter
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          
          {/* Notifications Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white">Notifications ({notifications.length})</span>
                  <Link href="/applications" onClick={() => setNotifOpen(false)} className="text-[10px] text-indigo-400 hover:underline">
                    View Pipeline
                  </Link>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                      <div className="text-xs font-semibold text-white">{n.title}</div>
                      <div className="text-[11px] text-slate-400">{n.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Role Portal Links */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <Link 
              href="/dashboard"
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${pathname === '/dashboard' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Student
            </Link>
            <Link 
              href="/recruiter"
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${pathname === '/recruiter' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Recruiter
            </Link>
            <Link 
              href="/analytics"
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${pathname === '/analytics' || pathname === '/admin' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="xl:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden mt-3 pt-3 border-t border-slate-800 space-y-2 text-sm max-h-[80vh] overflow-y-auto">
          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block p-2 rounded-lg hover:bg-slate-800 text-slate-200">
            Dashboard
          </Link>
          <Link href="/resume-builder" onClick={() => setMobileMenuOpen(false)} className="block p-2 rounded-lg hover:bg-slate-800 text-slate-200">
            AI Resume Builder (PDF)
          </Link>
          <Link href="/resume-analyzer" onClick={() => setMobileMenuOpen(false)} className="block p-2 rounded-lg hover:bg-slate-800 text-slate-200">
            AI Resume Analyzer (ATS)
          </Link>
          <Link href="/jobs" onClick={() => setMobileMenuOpen(false)} className="block p-2 rounded-lg hover:bg-slate-800 text-slate-200">
            Smart Jobs & Internships
          </Link>
          <Link href="/interview/mock" onClick={() => setMobileMenuOpen(false)} className="block p-2 rounded-lg hover:bg-slate-800 text-slate-200">
            AI Mock Interview
          </Link>
          <Link href="/assessment" onClick={() => setMobileMenuOpen(false)} className="block p-2 rounded-lg hover:bg-slate-800 text-slate-200">
            Timed Aptitude & Coding Assessment
          </Link>
          <Link href="/eligibility" onClick={() => setMobileMenuOpen(false)} className="block p-2 rounded-lg hover:bg-slate-800 text-slate-200">
            Placement Eligibility Tracker
          </Link>
          <Link href="/recruiter" onClick={() => setMobileMenuOpen(false)} className="block p-2 rounded-lg hover:bg-slate-800 text-amber-300">
            Recruiter & Company Dashboard
          </Link>
          <Link href="/applications" onClick={() => setMobileMenuOpen(false)} className="block p-2 rounded-lg hover:bg-slate-800 text-slate-200">
            Application Tracking (ATS)
          </Link>
          <Link href="/analytics" onClick={() => setMobileMenuOpen(false)} className="block p-2 rounded-lg hover:bg-slate-800 text-slate-200">
            Placement Analytics
          </Link>
          <Link href="/career-assistant" onClick={() => setMobileMenuOpen(false)} className="block p-2 rounded-lg hover:bg-slate-800 text-purple-300">
            AI Career Guidance Assistant
          </Link>
          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <Link href="/practice/coding" onClick={() => setMobileMenuOpen(false)} className="w-1/2 text-center p-2 rounded-lg bg-indigo-950 text-indigo-300 text-xs">
              Monaco Code
            </Link>
            <Link href="/reports" onClick={() => setMobileMenuOpen(false)} className="w-1/2 text-center p-2 rounded-lg bg-slate-900 text-slate-300 text-xs">
              Scorecard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
