"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { 
  Award, TrendingUp, Target, AlertCircle, ArrowUpRight, 
  Code2, Video, FileText, CheckCircle2, ChevronRight, RefreshCw, Sparkles,
  Briefcase, FileCheck, CheckSquare, ShieldCheck, Layers, Compass, BarChart3, Building2 
} from 'lucide-react';

export default function StudentDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch analytics for demo user ID 1
    axios.get('/api/analytics/dashboard/1')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback default client data
        setData({
          user_name: "Demo Student",
          department_code: "CSE",
          overall_readiness: 78.5,
          previous_readiness: 68.0,
          improvement_pct: 10.5,
          scores: { aptitude: 80.0, technical: 82.0, coding: 75.0, communication: 76.0, interview: 78.5 },
          weak_topics: ["DBMS Joins", "STAR Framework Result", "Speed Distance Time"],
          improvement_trend: [
            { attempt: "Attempt 1", score: 62 },
            { attempt: "Attempt 2", score: 68 },
            { attempt: "Attempt 3", score: 74 },
            { attempt: "Attempt 4", score: 78.5 }
          ],
          skill_radar: [
            { skill: "Aptitude", score: 80, benchmark: 80 },
            { skill: "Technical", score: 82, benchmark: 75 },
            { skill: "Coding", score: 75, benchmark: 70 },
            { skill: "Communication", score: 76, benchmark: 85 },
            { skill: "Interview", score: 78.5, benchmark: 80 }
          ],
          company_readiness: [
            { company: "TCS", readiness: 86, gap: "Coding speed" },
            { company: "Infosys", readiness: 83, gap: "Pseudocode" },
            { company: "Zoho", readiness: 64, gap: "Advanced DSA" },
            { company: "Bosch", readiness: 80, gap: "Core subjects" }
          ]
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400 gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
        <span>Loading Placement Analytics...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-sky-900/40 p-6 rounded-3xl border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active Department: {data.department_code}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Welcome back, {data.user_name}</h1>
          <p className="text-slate-300 text-sm">Track your continuous preparation loop and placement readiness score.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/interview/mock" className="gradient-btn text-xs px-5 py-3 flex items-center gap-2">
            <Video className="w-4 h-4" />
            <span>AI Mock Interview</span>
          </Link>
          <Link href="/assessment" className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-amber-400" />
            <span>Timed Assessment</span>
          </Link>
        </div>
      </div>

      {/* QUICK LAUNCHPAD TO 10 ADVANCED FEATURES */}
      <div className="space-y-3">
        <h2 className="text-sm font-extrabold text-white uppercase tracking-wider text-slate-400">
          Placement Intelligence Launchpad
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          
          <Link href="/resume-builder" className="glass-card p-4 space-y-2 text-center hover:border-indigo-500/50 transition-all group">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">Resume Builder</div>
            <div className="text-[10px] text-slate-400">ATS PDF Export</div>
          </Link>

          <Link href="/resume-analyzer" className="glass-card p-4 space-y-2 text-center hover:border-sky-500/50 transition-all group">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <FileCheck className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">Resume Analyzer</div>
            <div className="text-[10px] text-slate-400">ATS Score & Match</div>
          </Link>

          <Link href="/jobs" className="glass-card p-4 space-y-2 text-center hover:border-emerald-500/50 transition-all group">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">Smart Jobs</div>
            <div className="text-[10px] text-slate-400">Match Percentage</div>
          </Link>

          <Link href="/eligibility" className="glass-card p-4 space-y-2 text-center hover:border-cyan-500/50 transition-all group">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">Eligibility</div>
            <div className="text-[10px] text-slate-400">Company Criteria</div>
          </Link>

          <Link href="/applications" className="glass-card p-4 space-y-2 text-center hover:border-pink-500/50 transition-all group">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">Applications</div>
            <div className="text-[10px] text-slate-400">ATS Pipeline</div>
          </Link>

          <Link href="/career-assistant" className="glass-card p-4 space-y-2 text-center hover:border-purple-500/50 transition-all group">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">PilotAI Mentor</div>
            <div className="text-[10px] text-slate-400">Roadmap & Certs</div>
          </Link>

        </div>
      </div>

      {/* OVERALL READINESS SCORE CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/40 col-span-2 sm:col-span-1 space-y-2 relative overflow-hidden">
          <div className="text-xs text-indigo-300 font-bold uppercase tracking-wider">Overall Readiness</div>
          <div className="text-4xl font-black text-white">{data.overall_readiness}%</div>
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{data.improvement_pct}% vs baseline</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Aptitude Score</div>
          <div className="text-2xl font-bold text-emerald-400">{data.scores.aptitude}%</div>
          <div className="text-[10px] text-slate-500">Quant & Logical</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Technical Score</div>
          <div className="text-2xl font-bold text-sky-400">{data.scores.technical}%</div>
          <div className="text-[10px] text-slate-500">{data.department_code} MCQs</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Coding Score</div>
          <div className="text-2xl font-bold text-purple-400">{data.scores.coding}%</div>
          <div className="text-[10px] text-slate-500">Monaco Sandbox</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Communication</div>
          <div className="text-2xl font-bold text-amber-400">{data.scores.communication}%</div>
          <div className="text-[10px] text-slate-500">WPM & Pacing</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">AI Interview</div>
          <div className="text-2xl font-bold text-indigo-400">{data.scores.interview}%</div>
          <div className="text-[10px] text-slate-500">STAR Evaluation</div>
        </div>

      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Improvement Line Graph */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Continuous Improvement Graph</h3>
              <p className="text-xs text-slate-400">Score progress across consecutive practice attempts</p>
            </div>
            <div className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
              Upward Trend
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.improvement_trend}>
                <XAxis dataKey="attempt" stroke="#64748b" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ r: 6, fill: '#818cf8' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5-Axis Skill Radar Chart */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">5-Axis Skill Radar</h3>
              <p className="text-xs text-slate-400">Your scores vs Placement Readiness Benchmark</p>
            </div>
            <div className="text-xs text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded-md">
              Benchmark Target: 80%
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data.skill_radar}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="skill" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={10} />
                <Radar name="Student Score" dataKey="score" stroke="#38bdf8" fill="#0284c7" fillOpacity={0.5} />
                <Radar name="Benchmark" dataKey="benchmark" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* WEAK TOPICS & COMPANY READINESS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weak Topics Callout */}
        <div className="glass-card p-6 space-y-4 lg:col-span-1">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Diagnosed Weak Topics</span>
            </div>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded">3 TOPICS</span>
          </div>

          <div className="space-y-3">
            {data.weak_topics.map((topic: string, idx: number) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-200">{topic}</span>
                <Link href="/practice/retest" className="text-[11px] text-indigo-400 font-bold hover:underline flex items-center gap-0.5">
                  Retest <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>

          <Link href="/practice/retest" className="w-full py-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold hover:bg-indigo-600/30 transition-all flex items-center justify-center gap-2">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Launch Retest Engine</span>
          </Link>
        </div>

        {/* Practice Readiness Indicators for Companies */}
        <div className="glass-card p-6 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-sm">Company Practice Readiness Indicators</h3>
              <p className="text-[11px] text-slate-400">Readiness breakdown across company cutoffs</p>
            </div>
            <Link href="/companies" className="text-xs text-sky-400 font-semibold hover:underline">
              Compare All Companies →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.company_readiness.map((comp: any, idx: number) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{comp.company}</span>
                  <span className="text-xs font-extrabold text-sky-400">{comp.readiness}% Readiness</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full" style={{ width: `${comp.readiness}%` }}></div>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Primary Gap: <strong className="text-amber-300">{comp.gap}</strong></span>
                  <Link href="/companies" className="text-indigo-400 hover:underline">View Rounds</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
