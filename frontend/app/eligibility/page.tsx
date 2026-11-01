"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShieldCheck, CheckCircle2, XCircle, AlertTriangle, 
  Sparkles, RefreshCw, Edit3, Save, X, Building2, 
  GraduationCap, BookOpen, Code, ArrowRight 
} from 'lucide-react';
import Link from 'next/link';

export default function EligibilityTrackerPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'ELIGIBLE' | 'INELIGIBLE'>('ALL');
  
  // Edit Profile Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [cgpa, setCgpa] = useState(8.2);
  const [backlogs, setBacklogs] = useState(0);
  const [skillsStr, setSkillsStr] = useState("Python, JavaScript, React, SQL, Data Structures");
  const [updating, setUpdating] = useState(false);

  const fetchEligibility = () => {
    setLoading(true);
    axios.get('/api/eligibility/1')
      .then(res => {
        setData(res.data);
        setCgpa(res.data.cgpa);
        setBacklogs(res.data.backlogs);
        setSkillsStr(res.data.skills.join(", "));
      })
      .catch(() => {
        setData({
          user_id: 1,
          user_name: "Demo Student",
          department_code: "CSE",
          cgpa: 8.2,
          backlogs: 0,
          skills: ["Python", "JavaScript", "React", "SQL", "Data Structures"],
          eligible_count: 6,
          ineligible_count: 3,
          total_companies: 9,
          companies: [
            {
              company_id: 1,
              company_name: "TCS",
              package_range: "3.6 - 7.0 LPA",
              eligible: true,
              reasons: ["Meets all academic CGPA, backlog, and department requirements."],
              min_cgpa: 6.0,
              max_backlogs: 1,
              required_skills: ["Python", "SQL"]
            },
            {
              company_id: 5,
              company_name: "Zoho",
              package_range: "6.0 - 12.0 LPA",
              eligible: true,
              reasons: ["Meets all academic CGPA, backlog, and department requirements."],
              min_cgpa: 7.0,
              max_backlogs: 0,
              required_skills: ["Data Structures", "C++", "Java"]
            },
            {
              company_id: 8,
              company_name: "L&T",
              package_range: "5.5 - 8.5 LPA",
              eligible: false,
              reasons: [
                "Department mismatch: CSE is not among eligible branches (EEE, ECE).",
                "Missing mandatory skills: Power Systems, Circuit Analysis."
              ],
              min_cgpa: 6.8,
              max_backlogs: 0,
              required_skills: ["Power Systems", "Circuit Analysis"]
            }
          ]
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEligibility();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const skillsArray = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
      await axios.put('/api/users/1/academic-profile', {
        cgpa: parseFloat(cgpa.toString()),
        backlogs: parseInt(backlogs.toString(), 10),
        skills: skillsArray
      });
      setIsEditOpen(false);
      fetchEligibility();
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  const filteredCompanies = (data?.companies || []).filter((c: any) => {
    if (filter === 'ELIGIBLE') return c.eligible;
    if (filter === 'INELIGIBLE') return !c.eligible;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400 gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
        <span>Evaluating Campus Eligibility Criteria...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/60 p-6 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Placement Cell Cutoffs & Skill Verification</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Campus Placement Eligibility Tracker</h1>
          <p className="text-slate-300 text-sm">Real-time verification of company CGPA cutoffs, backlog limits, department branch policies, and skill prerequisites.</p>
        </div>

        <button 
          onClick={() => setIsEditOpen(true)}
          className="gradient-btn text-xs px-5 py-3 flex items-center gap-2 self-start md:self-auto"
        >
          <Edit3 className="w-4 h-4" />
          <span>Simulate Academic Stats</span>
        </button>
      </div>

      {/* Student Profile Card & Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Candidate Profile Details */}
        <div className="glass-card p-5 space-y-3 md:col-span-1">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-extrabold text-white text-xs uppercase tracking-wider text-slate-400">Your Academic Stats</span>
            <button onClick={() => setIsEditOpen(true)} className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1">
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Student:</span>
              <span className="font-bold text-white">{data.user_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Department:</span>
              <span className="font-bold text-indigo-400">{data.department_code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Current CGPA:</span>
              <span className="font-black text-emerald-400 text-sm">{data.cgpa} / 10.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Active Backlogs:</span>
              <span className={`font-bold ${data.backlogs === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {data.backlogs} {data.backlogs === 0 ? "(Clean Record)" : "Backlog"}
              </span>
            </div>
          </div>
        </div>

        {/* Total Companies */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="text-xs text-slate-400 font-bold uppercase">Total Visiting Companies</div>
          <div className="text-3xl font-black text-white">{data.total_companies}</div>
          <div className="text-[11px] text-slate-500">Service, Product & Core Drives</div>
        </div>

        {/* Eligible Count */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 flex flex-col justify-between">
          <div className="text-xs text-emerald-400 font-bold uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Fully Eligible
          </div>
          <div className="text-3xl font-black text-emerald-400">{data.eligible_count} Companies</div>
          <div className="text-[11px] text-slate-400">Ready to sit for campus drives</div>
        </div>

        {/* Ineligible Count */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-rose-500/40 flex flex-col justify-between">
          <div className="text-xs text-rose-400 font-bold uppercase flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Action Required
          </div>
          <div className="text-3xl font-black text-rose-400">{data.ineligible_count} Companies</div>
          <div className="text-[11px] text-slate-400">Gap closure guidance below</div>
        </div>

      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/60 border border-slate-800 rounded-2xl w-fit">
        {[
          { id: 'ALL', label: `All Companies (${data.companies.length})` },
          { id: 'ELIGIBLE', label: `Eligible Only (${data.eligible_count})` },
          { id: 'INELIGIBLE', label: `Ineligible / Action Needed (${data.ineligible_count})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === tab.id 
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Companies Eligibility Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((c: any) => (
          <div 
            key={c.company_id}
            className={`glass-card p-6 flex flex-col justify-between space-y-4 border-2 transition-all ${
              c.eligible 
                ? 'border-emerald-500/30 hover:border-emerald-500/60 bg-gradient-to-b from-slate-900 to-emerald-950/10' 
                : 'border-slate-800 hover:border-rose-500/30 bg-gradient-to-b from-slate-900 to-rose-950/10'
            }`}
          >
            
            {/* Header: Company Name & Eligibility Badge */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-base text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                  {c.company_name}
                </span>

                {c.eligible ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Eligible
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Ineligible
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Package: <strong className="text-white">{c.package_range}</strong></span>
                <span>Cutoff: <strong className="text-sky-400">{c.min_cgpa} CGPA</strong></span>
              </div>
            </div>

            {/* Checklist Reasons */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div className="font-bold text-[11px] text-slate-400 uppercase">
                {c.eligible ? "Verification Summary:" : "Disqualification Reasons:"}
              </div>
              <ul className="space-y-1.5">
                {c.reasons.map((r: string, rIdx: number) => (
                  <li 
                    key={rIdx} 
                    className={`p-2 rounded-xl text-xs leading-relaxed ${
                      c.eligible 
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                    }`}
                  >
                    {c.eligible ? "✓ " : "✗ "}{r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Skills Warning if applicable */}
            {c.missing_skills && c.missing_skills.length > 0 && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1 text-amber-300">
                <span className="font-bold text-[10px] uppercase">Recommended Action:</span>
                <p className="text-[11px]">Learn & add to profile: {c.missing_skills.join(", ")}</p>
              </div>
            )}

            {/* Bottom Button */}
            <div className="pt-2">
              {c.eligible ? (
                <Link 
                  href="/jobs" 
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-600/20"
                >
                  <span>View Openings & Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <button 
                  onClick={() => setIsEditOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-semibold transition-all"
                >
                  Simulate Closing Gaps
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Edit Academic Stats Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card p-6 max-w-md w-full space-y-5 border-cyan-500/40">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-cyan-400" />
                <span>Simulate / Update Academic Stats</span>
              </h3>
              <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-medium">Cumulative CGPA (out of 10.0)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="10"
                  value={cgpa}
                  onChange={e => setCgpa(parseFloat(e.target.value))}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-cyan-500" 
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium">Active Academic Backlogs</label>
                <input 
                  type="number" 
                  min="0" 
                  max="10"
                  value={backlogs}
                  onChange={e => setBacklogs(parseInt(e.target.value, 10))}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-cyan-500" 
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium">Verified Technical Skills (comma-separated)</label>
                <textarea 
                  rows={3}
                  value={skillsStr}
                  onChange={e => setSkillsStr(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed" 
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsEditOpen(false)} 
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={updating}
                  className="gradient-btn text-xs px-5 py-2 flex items-center gap-1.5"
                >
                  {updating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save & Recalculate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
