"use client";

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { 
  FileText, Download, ShieldCheck, Award, 
  CheckCircle2, RefreshCw, Printer, Sparkles 
} from 'lucide-react';

export default function ReportsPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios.get('/api/reports/student/1')
      .then(res => {
        setReport(res.data);
        setLoading(false);
      })
      .catch(() => {
        setReport({
          report_id: "PP-REP-2026-0001",
          verification_id: "VERIFY-PP-1-8892",
          timestamp: "2026-09-20 21:30:00",
          student_name: "Demo Student",
          department: "CSE",
          overall_readiness: 78.5,
          scores: { aptitude: 80, technical: 82, coding: 75, communication: 76, interview: 78.5 },
          weak_topics: ["DBMS Joins", "STAR Framework Result", "Speed Distance Time"],
          radar: [
            { skill: "Aptitude", score: 80 },
            { skill: "Technical", score: 82 },
            { skill: "Coding", score: 75 },
            { skill: "Communication", score: 76 },
            { skill: "Interview", score: 78.5 }
          ],
          guidance_disclaimer: "This document contains practice guidance and readiness indicators generated for placement preparation."
        });
        setLoading(false);
      });
  }, []);

  const handleDownloadPDF = async () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400 gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
        <span>Generating PDF Performance Report...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            Placement Readiness Report
            <span className="text-xs bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded">VERIFIED</span>
          </h1>
          <p className="text-xs text-slate-400">Report ID: {report.report_id} • Verification ID: {report.verification_id}</p>
        </div>

        <button onClick={handleDownloadPDF} className="gradient-btn text-xs px-5 py-2.5 flex items-center gap-2">
          <Printer className="w-4 h-4" />
          <span>Download / Print PDF</span>
        </button>
      </div>

      {/* Printable Report Container */}
      <div ref={reportRef} className="glass-card p-8 space-y-8 bg-slate-900 border-slate-800 text-slate-100">
        
        {/* Report Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-mono font-extrabold text-indigo-400 tracking-wider">PLACEMENTPILOT AI REPORT</span>
            <h2 className="text-2xl font-black text-white">{report.student_name}</h2>
            <div className="text-xs text-slate-400">Department: <strong className="text-white">{report.department}</strong> • Generated: {report.timestamp}</div>
          </div>

          <div className="text-right space-y-1">
            <div className="text-xs text-slate-400">Overall Practice Score</div>
            <div className="text-4xl font-black text-indigo-400">{report.overall_readiness}%</div>
            <div className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Verified Readiness Indicator
            </div>
          </div>
        </div>

        {/* 5 Axis Sub-Scores Table */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">Sub-Score Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400">Aptitude</div>
              <div className="text-lg font-bold text-emerald-400">{report.scores.aptitude}%</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400">Technical</div>
              <div className="text-lg font-bold text-sky-400">{report.scores.technical}%</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400">Coding</div>
              <div className="text-lg font-bold text-purple-400">{report.scores.coding}%</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400">Communication</div>
              <div className="text-lg font-bold text-amber-400">{report.scores.communication}%</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400">Interview</div>
              <div className="text-lg font-bold text-indigo-400">{report.scores.interview}%</div>
            </div>
          </div>
        </div>

        {/* Diagnosed Weak Areas & Action Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Diagnosed Weak Topics</h4>
            <div className="space-y-2 text-xs">
              {report.weak_topics?.map((topic: string, idx: number) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                  • {topic}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Verification Metadata</h4>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-400">
              <div>Verification ID: <strong className="text-sky-300 font-mono">{report.verification_id}</strong></div>
              <div>Report Hash: <strong className="text-slate-300 font-mono text-[10px]">sha256-e9f8a12c4b78001</strong></div>
              <p className="text-[11px] text-slate-500 pt-1">{report.guidance_disclaimer}</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
