"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Code2, Cpu, Zap, Dna, CheckCircle2, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  const [selectedDept, setSelectedDept] = useState("CSE");
  const [saved, setSaved] = useState(false);

  const handleSave = async (deptCode: string) => {
    setSelectedDept(deptCode);
    try {
      await axios.put('/api/users/1/department?dept_code=' + deptCode);
      setSaved(true);
    } catch {
      setSaved(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
          Onboarding • Department Selection
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">Select Your Academic Department</h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Your department choice customizes your question bank, coding problems, technical rounds, and readiness cutoffs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
        
        {/* CSE */}
        <div 
          onClick={() => handleSave("CSE")}
          className={`p-6 rounded-2xl border transition-all cursor-pointer space-y-4 relative ${
            selectedDept === "CSE" 
              ? "bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/30 shadow-xl" 
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Code2 className="w-6 h-6" />
            </div>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded">
              MVP COMPLETE SUITE
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-white text-lg">CSE — Computer Science</h3>
            <p className="text-xs text-slate-400 mt-1">
              Data Structures, Algorithms, DBMS, OS, Computer Networks, Python, Java, C++, Systems & Web Dev.
            </p>
          </div>
          {selectedDept === "CSE" && (
            <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Active Department Selected
            </div>
          )}
        </div>

        {/* ECE */}
        <div 
          onClick={() => handleSave("ECE")}
          className={`p-6 rounded-2xl border transition-all cursor-pointer space-y-4 relative ${
            selectedDept === "ECE" 
              ? "bg-slate-900 border-sky-500 ring-2 ring-sky-500/30 shadow-xl" 
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-sky-600/20 text-sky-400 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="text-[10px] bg-sky-500/20 text-sky-300 font-bold px-2 py-0.5 rounded">VERIFIED SUITE</span>
          </div>
          <div>
            <h3 className="font-extrabold text-white text-lg">ECE — Electronics & Comm</h3>
            <p className="text-xs text-slate-400 mt-1">
              Digital Electronics, Signals & Systems, Microcontrollers (8051/ARM), & Analog Communication.
            </p>
          </div>
          {selectedDept === "ECE" && (
            <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Active Department Selected
            </div>
          )}
        </div>

        {/* EEE */}
        <div 
          onClick={() => handleSave("EEE")}
          className={`p-6 rounded-2xl border transition-all cursor-pointer space-y-4 relative ${
            selectedDept === "EEE" 
              ? "bg-slate-900 border-amber-500 ring-2 ring-amber-500/30 shadow-xl" 
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded">VERIFIED SUITE</span>
          </div>
          <div>
            <h3 className="font-extrabold text-white text-lg">EEE — Electrical & Electronics</h3>
            <p className="text-xs text-slate-400 mt-1">
              Electrical Machines, Power Systems, Circuit Theory & Control Systems Engineering.
            </p>
          </div>
          {selectedDept === "EEE" && (
            <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Active Department Selected
            </div>
          )}
        </div>

        {/* BIOTECH */}
        <div 
          onClick={() => handleSave("BIOTECH")}
          className={`p-6 rounded-2xl border transition-all cursor-pointer space-y-4 relative ${
            selectedDept === "BIOTECH" 
              ? "bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/30 shadow-xl" 
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <Dna className="w-6 h-6" />
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">VERIFIED SUITE</span>
          </div>
          <div>
            <h3 className="font-extrabold text-white text-lg">Biotechnology</h3>
            <p className="text-xs text-slate-400 mt-1">
              Biochemistry, Bioprocess Engineering, Molecular Biology, & Laboratory Concepts.
            </p>
          </div>
          {selectedDept === "BIOTECH" && (
            <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Active Department Selected
            </div>
          )}
        </div>

      </div>

      <div className="flex justify-center pt-6">
        <Link href="/dashboard" className="gradient-btn px-8 py-3.5 flex items-center gap-2 text-sm font-bold">
          <span>Continue to Student Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
