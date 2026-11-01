"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Layers, CheckCircle2, Clock, Calendar, Building2, 
  ArrowRight, Video, Sparkles, RefreshCw, AlertCircle, FileText, Check 
} from 'lucide-react';
import Link from 'next/link';

export default function ApplicationTrackingPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/applications/user/1')
      .then(res => {
        if (Array.isArray(res.data)) {
          setApplications(res.data);
        }
      })
      .catch(() => {
        // Fallback default
        setApplications([
          {
            id: 1,
            job_title: "Graduate Software Engineer (TCS Digital Track)",
            company_name: "TCS",
            salary_package: "7.5 - 9.0 LPA",
            status: "Interview Scheduled",
            match_percentage: 92.0,
            applied_at: "2026-10-25T10:00:00",
            interview_date: "Tomorrow at 10:30 AM",
            interview_mode: "Online Google Meet (Panel: Technical & HR)",
            recruiter_notes: "Candidate cleared online coding benchmark. Interview will focus on system design and Python internals."
          },
          {
            id: 2,
            job_title: "Product Development Engineer (Full Stack)",
            company_name: "Zoho",
            salary_package: "8.5 - 12.0 LPA",
            status: "Shortlisted",
            match_percentage: 88.5,
            applied_at: "2026-10-27T14:30:00",
            recruiter_notes: "Profile shortlisted for Technical Assessment Round 2."
          },
          {
            id: 3,
            job_title: "Frontend Engineering Intern",
            company_name: "Freshworks",
            salary_package: "35,000 / month",
            status: "Under Review",
            match_percentage: 94.0,
            applied_at: "2026-10-30T16:15:00",
            recruiter_notes: "Resume passed initial ATS screening."
          }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const pipelineStages = [
    "Applied",
    "Under Review",
    "Shortlisted",
    "Interview Scheduled",
    "Selected"
  ];

  const getStageIndex = (status: string) => {
    if (status === 'Rejected') return -1;
    const idx = pipelineStages.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-950/70 via-slate-900 to-indigo-950/60 p-6 rounded-3xl border border-pink-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Applicant Tracking System (ATS) Pipeline</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Student Job Application Tracker</h1>
          <p className="text-slate-300 text-sm">Monitor recruitment milestones from initial application submission to interview scheduling and final offer selection.</p>
        </div>

        <Link href="/jobs" className="gradient-btn text-xs px-5 py-3 flex items-center gap-2 self-start md:self-auto">
          <Building2 className="w-4 h-4" />
          <span>Explore More Jobs</span>
        </Link>
      </div>

      {/* Applications Pipeline List */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center text-slate-400 gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-pink-400" />
          <span>Loading Application Status Pipeline...</span>
        </div>
      ) : applications.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400 space-y-3">
          <p>You haven't submitted any campus job applications yet.</p>
          <Link href="/jobs" className="text-xs text-indigo-400 font-bold hover:underline">
            Browse Recommended Openings →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => {
            const currentStageIdx = getStageIndex(app.status);
            const isRejected = app.status === 'Rejected';

            return (
              <div 
                key={app.id} 
                className="glass-card p-6 md:p-8 space-y-6 border-slate-800 hover:border-pink-500/30 transition-all"
              >
                
                {/* Header Information */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-lg text-white">{app.company_name}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                        {app.match_percentage}% ATS Match
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-indigo-300">{app.job_title}</h3>
                    <div className="text-xs text-slate-400">
                      Package: <strong className="text-white">{app.salary_package}</strong> • Applied on: {new Date(app.applied_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span className={`px-3.5 py-1.5 rounded-xl text-xs font-bold ${
                      app.status === 'Selected' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                      app.status === 'Interview Scheduled' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                      app.status === 'Shortlisted' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' :
                      app.status === 'Rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                      'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      Current Status: {app.status}
                    </span>
                  </div>
                </div>

                {/* 5-Stage Stepper Pipeline */}
                {!isRejected ? (
                  <div className="pt-2">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {pipelineStages.map((stage, idx) => {
                        const isDone = idx <= currentStageIdx;
                        const isCurrent = idx === currentStageIdx;

                        return (
                          <div 
                            key={idx}
                            className={`p-3 rounded-xl border text-center transition-all ${
                              isCurrent
                                ? 'bg-pink-500/20 border-pink-500 text-white shadow-lg shadow-pink-500/10'
                                : isDone
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                  : 'bg-slate-950/40 border-slate-800 text-slate-500'
                            }`}
                          >
                            <div className="text-[10px] font-bold uppercase tracking-wider mb-1">
                              {isDone && !isCurrent ? "✓ Done" : isCurrent ? "Active Step" : `Step ${idx + 1}`}
                            </div>
                            <div className="text-xs font-bold leading-tight">{stage}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                    Application closed: Candidate was not selected in this drive. Review feedback below.
                  </div>
                )}

                {/* Interview Information Banner if scheduled */}
                {app.interview_date && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>Interview Round Scheduled!</span>
                    </div>
                    <div className="text-slate-300">
                      <strong>Date & Time:</strong> {app.interview_date}
                    </div>
                    <div className="text-slate-300">
                      <strong>Mode / Location:</strong> {app.interview_mode}
                    </div>
                    {app.recruiter_notes && (
                      <div className="text-slate-400 pt-1 border-t border-amber-500/20">
                        <strong>Recruiter Notes:</strong> {app.recruiter_notes}
                      </div>
                    )}
                    <div className="pt-2">
                      <Link 
                        href="/interview/mock" 
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Practice Mock Interview for {app.company_name}</span>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Recruiter Feedback / Notes if no interview */}
                {!app.interview_date && app.recruiter_notes && (
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400">
                    <strong className="text-slate-300">Recruiter Update:</strong> {app.recruiter_notes}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
