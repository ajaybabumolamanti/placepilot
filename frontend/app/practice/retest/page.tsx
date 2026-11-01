"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  RefreshCw, TrendingUp, CheckCircle2, Award, 
  ArrowRight, Sparkles, BookOpen 
} from 'lucide-react';

export default function RetestPage() {
  const [activeQuiz, setActiveQuiz] = useState(false);
  const [retestCompleted, setRetestCompleted] = useState(false);

  const weakSpotTopics = [
    { topic: "DBMS Joins & Indexing", beforeAccuracy: 52, retestAccuracy: 78 },
    { topic: "STAR Framework Result Stage", beforeAccuracy: 60, retestAccuracy: 85 },
    { topic: "Speed, Distance & Time Quant", beforeAccuracy: 48, retestAccuracy: 75 }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-3 border-b border-slate-800 pb-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Continuous Learning Loop • Step 6</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">Weak-Spot Retest Engine</h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Auto-generated retest sets focusing exclusively on your past failed topics to verify measurable accuracy growth.
        </p>
      </div>

      {!retestCompleted ? (
        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-extrabold text-white text-base">Diagnosed Retest Targets</h3>
            <span className="text-xs text-purple-300 bg-purple-500/20 font-bold px-3 py-1 rounded-full">
              Auto-Generated Set
            </span>
          </div>

          <div className="space-y-4">
            {weakSpotTopics.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">{item.topic}</div>
                  <div className="text-xs text-slate-400 mt-0.5">Initial Diagnostic Score: <span className="text-amber-400 font-bold">{item.beforeAccuracy}%</span></div>
                </div>
                <div className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-lg">
                  Ready for Retest
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={() => setRetestCompleted(true)}
              className="gradient-btn text-xs px-8 py-3.5 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Complete Weak-Spot Retest Quiz</span>
            </button>
          </div>
        </div>
      ) : (
        /* RETEST COMPARISON RESULTS */
        <div className="glass-card p-6 space-y-6 border-emerald-500/40">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
              <Award className="w-6 h-6" />
              <span>Retest Accuracy Growth Verified!</span>
            </div>
            <div className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full">
              Average +25.3% Growth
            </div>
          </div>

          <div className="space-y-4">
            {weakSpotTopics.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{item.topic}</span>
                  <span className="text-xs font-bold text-emerald-400">+{item.retestAccuracy - item.beforeAccuracy}% Improvement</span>
                </div>
                <div className="text-xs text-slate-300">
                  "Your <strong className="text-sky-300">{item.topic}</strong> accuracy changed from <strong className="text-amber-400">{item.beforeAccuracy}%</strong> to <strong className="text-emerald-400">{item.retestAccuracy}%</strong>."
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <Link href="/dashboard" className="gradient-btn text-xs px-8 py-3.5 flex items-center gap-2">
              <span>View Updated Readiness Radar on Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
