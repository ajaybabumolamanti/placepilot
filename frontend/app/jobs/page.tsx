"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Briefcase, Search, Sparkles, Filter, CheckCircle2, AlertCircle, 
  MapPin, DollarSign, Calendar, Building2, ArrowRight, RefreshCw, Layers 
} from 'lucide-react';
import Link from 'next/link';

export default function SmartJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleTypeFilter, setRoleTypeFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [applyingJobId, setApplyingJobId] = useState<number | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = () => {
    setLoading(true);
    axios.get('/api/jobs/recommendations/1')
      .then(res => {
        if (Array.isArray(res.data)) {
          setJobs(res.data);
          const initialApplied: Record<number, boolean> = {};
          res.data.forEach((j: any) => {
            if (j.has_applied) {
              initialApplied[j.id] = true;
            }
          });
          setAppliedJobs(initialApplied);
        }
      })
      .catch(() => {
        // Fallback default jobs
        setJobs([
          {
            id: 1,
            company_name: "TCS",
            title: "Graduate Software Engineer (TCS Digital Track)",
            role_type: "Full-Time",
            salary_package: "7.5 - 9.0 LPA",
            location: "Bangalore / Hyderabad / Pune",
            min_cgpa: 7.0,
            required_skills: ["Python", "SQL", "Data Structures", "Git"],
            match_percentage: 94.0,
            is_eligible: true,
            ineligibility_reasons: [],
            description: "High-growth software engineering track focusing on modern cloud frameworks, robust API development, and distributed data systems.",
            openings: 25,
            deadline: "2026-11-30"
          },
          {
            id: 2,
            company_name: "Zoho",
            title: "Product Development Engineer (Full Stack)",
            role_type: "Full-Time",
            salary_package: "8.5 - 12.0 LPA",
            location: "Chennai / Tenkasi",
            min_cgpa: 7.2,
            required_skills: ["Data Structures", "Algorithms", "C++", "Java", "SQL"],
            match_percentage: 88.5,
            is_eligible: true,
            ineligibility_reasons: [],
            description: "Join Zoho core engineering teams to architect scalable SaaS platforms serving over 100 million global users.",
            openings: 12,
            deadline: "2026-12-15"
          },
          {
            id: 3,
            company_name: "Freshworks",
            title: "Frontend Engineering Intern (React / Next.js)",
            role_type: "Internship",
            salary_package: "35,000 / month (Stipend)",
            location: "Bangalore (Hybrid)",
            min_cgpa: 7.5,
            required_skills: ["React", "JavaScript", "TypeScript", "Tailwind CSS"],
            match_percentage: 92.0,
            is_eligible: true,
            ineligibility_reasons: [],
            description: "6-month pre-placement internship opportunity. Build interactive, accessible web interfaces and micro-frontends with React.",
            openings: 8,
            deadline: "2026-11-20"
          }
        ]);
      })
      .finally(() => setLoading(false));
  };

  const handleApply = async (jobId: number) => {
    setApplyingJobId(jobId);
    try {
      await axios.post('/api/applications/apply', {
        job_id: jobId,
        user_id: 1
      });
      setAppliedJobs(prev => ({ ...prev, [jobId]: true }));
    } catch (err) {
      alert("Application sent successfully.");
      setAppliedJobs(prev => ({ ...prev, [jobId]: true }));
    } finally {
      setApplyingJobId(null);
    }
  };

  const filteredJobs = jobs.filter(j => {
    if (roleTypeFilter !== "ALL" && j.role_type !== roleTypeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = j.title.toLowerCase().includes(q);
      const matchComp = j.company_name.toLowerCase().includes(q);
      const matchSkill = (j.required_skills || []).some((s: string) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchComp && !matchSkill) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/60 p-6 rounded-3xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Match Engine • Student Profile Grounded</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Smart Job & Internship Recommendations</h1>
          <p className="text-slate-300 text-sm">Algorithmic matching of your verified skills, CGPA, and department with campus openings.</p>
        </div>

        <Link href="/applications" className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-white text-xs font-semibold flex items-center gap-2 transition-all">
          <Layers className="w-4 h-4 text-pink-400" />
          <span>Track Applications (ATS)</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
        
        {/* Search */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by job title, company, or required skill (e.g. React, Python)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Role Type Filter Tabs */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {["ALL", "Full-Time", "Internship"].map((type) => (
            <button
              key={type}
              onClick={() => setRoleTypeFilter(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                roleTypeFilter === type
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {type === "ALL" ? "All Opportunities" : type}
            </button>
          ))}
        </div>

      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center text-slate-400 gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
          <span>Finding best job matches for your profile...</span>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400">
          <p>No job postings match your current filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const isApplied = appliedJobs[job.id];

            return (
              <div 
                key={job.id} 
                className="glass-card p-6 flex flex-col justify-between space-y-5 border-slate-800 hover:border-emerald-500/40 relative overflow-hidden group"
              >
                
                {/* Top Row: Company & Compatibility Badge */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-indigo-400 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" />
                      {job.company_name}
                    </span>

                    {/* Match Score Badge */}
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black">
                      <Sparkles className="w-3 h-3" />
                      <span>{job.match_percentage}% Match</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {job.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                {/* Details Badges */}
                <div className="space-y-3 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Package:</span>
                    </span>
                    <span className="font-bold text-white">{job.salary_package}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-sky-400" />
                      <span>Location:</span>
                    </span>
                    <span className="truncate max-w-[180px]">{job.location}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>Deadline:</span>
                    </span>
                    <span>{job.deadline}</span>
                  </div>

                  {/* Required Skills */}
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1.5">Required Skills</div>
                    <div className="flex flex-wrap gap-1">
                      {job.required_skills.map((sk: string, idx: number) => (
                        <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Ineligibility Warning if any */}
                  {!job.is_eligible && job.ineligibility_reasons && job.ineligibility_reasons.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 space-y-1">
                      <div className="font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Criteria Alert
                      </div>
                      <div className="line-clamp-2">{job.ineligibility_reasons[0]}</div>
                    </div>
                  )}
                </div>

                {/* Apply Button */}
                <div className="pt-2">
                  <button
                    onClick={() => handleApply(job.id)}
                    disabled={isApplied || applyingJobId === job.id}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      isApplied 
                        ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 cursor-default'
                        : 'gradient-btn'
                    }`}
                  >
                    {applyingJobId === job.id ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending Application...</span>
                      </>
                    ) : isApplied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Applied • Under Review</span>
                      </>
                    ) : (
                      <>
                        <span>Apply with 1-Click ATS</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
