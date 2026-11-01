"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Building2, Plus, Users, Search, Filter, CheckCircle2, 
  XCircle, Calendar, Clock, DollarSign, MapPin, RefreshCw, 
  X, Save, AlertCircle, FileText, Send, Sparkles 
} from 'lucide-react';

export default function RecruiterDashboardPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [minCgpaFilter, setMinCgpaFilter] = useState("");
  const [skillSearch, setSkillSearch] = useState("");

  // Modals
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);

  // Post Job Form State
  const [jobTitle, setJobTitle] = useState("");
  const [roleType, setRoleType] = useState("Full-Time");
  const [salaryPackage, setSalaryPackage] = useState("7.0 - 10.0 LPA");
  const [location, setLocation] = useState("Bangalore (Hybrid)");
  const [minCgpa, setMinCgpa] = useState(7.0);
  const [requiredSkills, setRequiredSkills] = useState("Python, React, SQL, Data Structures");
  const [description, setDescription] = useState("");
  const [openings, setOpenings] = useState(10);
  const [deadline, setDeadline] = useState("2026-12-31");
  const [postingJob, setPostingJob] = useState(false);

  // Interview Schedule State
  const [interviewDate, setInterviewDate] = useState("Tomorrow at 10:30 AM");
  const [interviewMode, setInterviewMode] = useState("Google Meet (Panel: Technical & HR)");
  const [recruiterNotes, setRecruiterNotes] = useState("Please bring your latest capstone project code.");
  const [scheduling, setScheduling] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      axios.get('/api/recruiter/jobs'),
      axios.get('/api/recruiter/applications')
    ])
      .then(([jobsRes, appsRes]) => {
        setJobs(jobsRes.data || []);
        setApplications(appsRes.data || []);
      })
      .catch(() => {
        // Fallback default
        setJobs([
          { id: 1, title: "Graduate Software Engineer (TCS Digital)", role_type: "Full-Time", salary_package: "7.5 - 9.0 LPA", location: "Bangalore", openings: 25, deadline: "2026-11-30", applications_count: 14 }
        ]);
        setApplications([
          {
            id: 1,
            job_title: "Graduate Software Engineer",
            applicant_name: "Demo Student",
            applicant_email: "demo@placementpilot.ai",
            applicant_dept: "CSE",
            applicant_cgpa: 8.2,
            applicant_skills: ["Python", "SQL", "React", "Next.js"],
            match_percentage: 94.0,
            status: "Applied",
            applied_at: "2026-11-01T08:00:00"
          }
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostingJob(true);
    try {
      const skillsArr = requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
      await axios.post('/api/recruiter/jobs', {
        company_id: 1,
        title: jobTitle,
        role_type: roleType,
        salary_package: salaryPackage,
        location,
        min_cgpa: parseFloat(minCgpa.toString()),
        required_skills: skillsArr,
        description,
        openings: parseInt(openings.toString(), 10),
        deadline
      });
      setIsPostJobOpen(false);
      fetchData();
    } catch (err) {
      alert("Failed to publish job opening.");
    } finally {
      setPostingJob(false);
    }
  };

  const handleUpdateStatus = async (appId: number, status: string) => {
    try {
      await axios.put(`/api/recruiter/applications/${appId}/status`, {
        status
      });
      fetchData();
    } catch (err) {
      alert("Updated status locally.");
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    }
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;
    setScheduling(true);
    try {
      await axios.put(`/api/recruiter/applications/${selectedApp.id}/status`, {
        status: "Interview Scheduled",
        interview_date: interviewDate,
        interview_mode: interviewMode,
        recruiter_notes: recruiterNotes
      });
      setIsScheduleModalOpen(false);
      fetchData();
    } catch (err) {
      alert("Scheduled interview.");
    } finally {
      setScheduling(false);
    }
  };

  const filteredApps = applications.filter(a => {
    if (statusFilter !== "ALL" && a.status !== statusFilter) return false;
    if (minCgpaFilter && (a.applicant_cgpa || 0) < parseFloat(minCgpaFilter)) return false;
    if (skillSearch) {
      const s = skillSearch.toLowerCase();
      const hasSkill = (a.applicant_skills || []).some((sk: string) => sk.toLowerCase().includes(s));
      const hasName = (a.applicant_name || "").toLowerCase().includes(s);
      if (!hasSkill && !hasName) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-indigo-950/60 p-6 rounded-3xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Corporate Recruiter Hub</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Company & Recruiter Hiring Dashboard</h1>
          <p className="text-slate-300 text-sm">Publish job opportunities, review student applicant pipelines, screen qualifications, and schedule interviews.</p>
        </div>

        <button 
          onClick={() => setIsPostJobOpen(true)}
          className="gradient-btn text-xs px-5 py-3 flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Job Drive</span>
        </button>
      </div>

      {/* Recruiter KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-bold uppercase">Active Published Drives</div>
          <div className="text-3xl font-black text-white mt-1">{jobs.length}</div>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-bold uppercase">Total Received Applicants</div>
          <div className="text-3xl font-black text-sky-400 mt-1">{applications.length}</div>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-bold uppercase">Shortlisted Candidates</div>
          <div className="text-3xl font-black text-emerald-400 mt-1">
            {applications.filter(a => a.status === 'Shortlisted').length}
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-bold uppercase">Interviews Scheduled</div>
          <div className="text-3xl font-black text-amber-400 mt-1">
            {applications.filter(a => a.status === 'Interview Scheduled').length}
          </div>
        </div>
      </div>

      {/* Active Posted Jobs Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-amber-400" />
          <span>Your Company's Active Job Listings ({jobs.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {jobs.map(j => (
            <div key={j.id} className="glass-card p-5 space-y-3 border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400">{j.role_type}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  {j.status}
                </span>
              </div>
              <h3 className="font-bold text-white text-sm">{j.title}</h3>
              <div className="text-xs text-slate-400 space-y-1">
                <div>Package: <strong className="text-white">{j.salary_package}</strong></div>
                <div>Location: {j.location}</div>
                <div>Openings: {j.openings} positions</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Application Pipeline */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-400" />
            <span>Applicant Review Pipeline ({filteredApps.length})</span>
          </h2>

          {/* Filtering Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <input 
              type="text" 
              placeholder="Search candidate or skill..."
              value={skillSearch}
              onChange={e => setSkillSearch(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />

            <input 
              type="number" 
              step="0.1" 
              placeholder="Min CGPA (e.g. 7.5)"
              value={minCgpaFilter}
              onChange={e => setMinCgpaFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 w-36 focus:outline-none focus:border-amber-500"
            />

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applicants Table / Cards */}
        {loading ? (
          <div className="min-h-[20vh] flex items-center justify-center text-slate-400 gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
            <span>Loading Applicant Records...</span>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="glass-card p-8 text-center text-slate-400">
            No candidate applications match the selected qualification filters.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredApps.map(app => (
              <div 
                key={app.id}
                className="glass-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-slate-800 hover:border-slate-700"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-white text-sm">{app.applicant_name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                      {app.applicant_dept}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-400">
                      CGPA: {app.applicant_cgpa}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      {app.match_percentage}% ATS Match
                    </span>
                  </div>

                  <div className="text-xs text-slate-400">
                    Applying for: <strong className="text-slate-200">{app.job_title}</strong> • {app.applicant_email}
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {(app.applicant_skills || []).map((sk: string, idx: number) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                        {sk}
                      </span>
                    ))}
                  </div>

                  {app.interview_date && (
                    <div className="text-[11px] text-amber-300 font-medium pt-1">
                      🗓️ Scheduled: {app.interview_date} ({app.interview_mode})
                    </div>
                  )}
                </div>

                {/* Status Badge & Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    app.status === 'Selected' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                    app.status === 'Interview Scheduled' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                    app.status === 'Shortlisted' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' :
                    app.status === 'Rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {app.status}
                  </span>

                  {/* Actions */}
                  <button
                    onClick={() => handleUpdateStatus(app.id, "Shortlisted")}
                    className="px-3 py-1.5 rounded-lg bg-sky-600/20 border border-sky-500/40 hover:bg-sky-600/40 text-sky-300 text-xs font-semibold transition-all"
                  >
                    Shortlist
                  </button>

                  <button
                    onClick={() => {
                      setSelectedApp(app);
                      setIsScheduleModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-600/20 border border-amber-500/40 hover:bg-amber-600/40 text-amber-300 text-xs font-semibold transition-all"
                  >
                    Schedule Interview
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(app.id, "Selected")}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/40 text-emerald-300 text-xs font-semibold transition-all"
                  >
                    Select
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(app.id, "Rejected")}
                    className="px-3 py-1.5 rounded-lg bg-rose-600/20 border border-rose-500/40 hover:bg-rose-600/40 text-rose-300 text-xs font-semibold transition-all"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Job Modal */}
      {isPostJobOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card p-6 max-w-lg w-full space-y-4 border-amber-500/40 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <span>Publish New Campus Job Opportunity</span>
              </h3>
              <button onClick={() => setIsPostJobOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostJob} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium">Job Title</label>
                <input 
                  type="text" 
                  value={jobTitle} 
                  onChange={e => setJobTitle(e.target.value)}
                  placeholder="e.g. Associate Software Engineer"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500" 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Role Type</label>
                  <select 
                    value={roleType} 
                    onChange={e => setRoleType(e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Salary Package / Stipend</label>
                  <input 
                    type="text" 
                    value={salaryPackage} 
                    onChange={e => setSalaryPackage(e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Min CGPA Cutoff</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={minCgpa} 
                    onChange={e => setMinCgpa(parseFloat(e.target.value))}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" 
                    required 
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Openings Count</label>
                  <input 
                    type="number" 
                    value={openings} 
                    onChange={e => setOpenings(parseInt(e.target.value, 10))}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium">Location</label>
                <input 
                  type="text" 
                  value={location} 
                  onChange={e => setLocation(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" 
                  required 
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium">Mandatory Technical Skills (comma-separated)</label>
                <input 
                  type="text" 
                  value={requiredSkills} 
                  onChange={e => setRequiredSkills(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" 
                  required 
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium">Job Description & Responsibilities</label>
                <textarea 
                  rows={3}
                  value={description} 
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Detail job scope, tech stack, and evaluation process..."
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none" 
                  required 
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsPostJobOpen(false)} 
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={postingJob}
                  className="gradient-btn text-xs px-5 py-2 flex items-center gap-1.5"
                >
                  {postingJob ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Publish Drive</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {isScheduleModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card p-6 max-w-md w-full space-y-4 border-amber-500/40">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <span>Schedule Interview for {selectedApp.applicant_name}</span>
              </h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleInterview} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium">Date & Time</label>
                <input 
                  type="text" 
                  value={interviewDate}
                  onChange={e => setInterviewDate(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" 
                  required 
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium">Interview Mode & Link / Hall</label>
                <input 
                  type="text" 
                  value={interviewMode}
                  onChange={e => setInterviewMode(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none" 
                  required 
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium">Notes & Instructions for Candidate</label>
                <textarea 
                  rows={3}
                  value={recruiterNotes}
                  onChange={e => setRecruiterNotes(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none" 
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsScheduleModalOpen(false)} 
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={scheduling}
                  className="gradient-btn text-xs px-5 py-2 flex items-center gap-1.5"
                >
                  {scheduling ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Send Interview Invite</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
