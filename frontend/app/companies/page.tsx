"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Building2, CheckCircle2, ChevronRight, Info, Layers, 
  Target, BarChart2, ShieldCheck, ArrowRightLeft 
} from 'lucide-react';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [compareList, setCompareList] = useState<string[]>(["TCS", "Zoho", "Bosch"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/companies')
      .then(res => {
        setCompanies(res.data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback demo dataset
        setCompanies([
          { id: 1, name: "TCS", category: "SERVICE", round_count: 4, difficulty: "Moderate", package_range: "3.6 - 7.0 LPA", eligible_departments: ["CSE", "ECE", "EEE", "BIOTECH"], topics: ["NQT Quant", "Pseudocode", "Python/C Coding", "Tech HR"], cutoffs_disclaimer: "Practice guidance indicators." },
          { id: 2, name: "Infosys", category: "SERVICE", round_count: 4, difficulty: "Moderate", package_range: "3.6 - 9.5 LPA", eligible_departments: ["CSE", "ECE", "EEE", "BIOTECH"], topics: ["Aptitude", "Pseudocode", "DBMS & OOP", "HR"], cutoffs_disclaimer: "Practice guidance indicators." },
          { id: 3, name: "Zoho", category: "PRODUCT", round_count: 5, difficulty: "High", package_range: "6.0 - 12.0 LPA", eligible_departments: ["CSE", "ECE"], topics: ["Complex Aptitude", "Advanced C/Java", "System Design", "HR"], cutoffs_disclaimer: "Practice guidance indicators." },
          { id: 4, name: "Freshworks", category: "PRODUCT", round_count: 4, difficulty: "High", package_range: "8.0 - 15.0 LPA", eligible_departments: ["CSE", "ECE"], topics: ["DSA", "OO Design", "Live Coding", "Culture Fit"], cutoffs_disclaimer: "Practice guidance indicators." },
          { id: 5, name: "Bosch", category: "CORE", round_count: 4, difficulty: "High", package_range: "6.0 - 10.0 LPA", eligible_departments: ["ECE", "EEE", "CSE"], topics: ["Core Electronics", "Microcontrollers", "Control Systems", "Tech HR"], cutoffs_disclaimer: "Practice guidance indicators." },
          { id: 6, name: "Siemens", category: "CORE", round_count: 4, difficulty: "High", package_range: "6.5 - 11.0 LPA", eligible_departments: ["ECE", "EEE", "CSE", "BIOTECH"], topics: ["Automation", "Embedded C", "Signal Processing", "Panel HR"], cutoffs_disclaimer: "Practice guidance indicators." }
        ]);
        setLoading(false);
      });
  }, []);

  const toggleCompare = (name: string) => {
    if (compareList.includes(name)) {
      if (compareList.length > 1) setCompareList(compareList.filter(c => c !== name));
    } else {
      if (compareList.length < 3) setCompareList([...compareList, name]);
    }
  };

  const filteredCompanies = companies.filter(c => selectedCategory === "ALL" || c.category === selectedCategory);
  const comparedCompanies = companies.filter(c => compareList.includes(c.name));

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-12">
      
      {/* Page Header */}
      <div className="space-y-3 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-semibold text-sky-300">
          <Building2 className="w-3.5 h-3.5" />
          <span>Company Preparation Hub & Round Comparator</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">Company-Specific Pathways</h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Explore structured hiring round pathways and side-by-side comparator data for Service, Product, and Core IT recruiters.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-3">
        {["ALL", "SERVICE", "PRODUCT", "CORE"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {cat === "ALL" ? "All Pathways" : `${cat} IT & Core`}
          </button>
        ))}
      </div>

      {/* SIDE-BY-SIDE COMPANY COMPARATOR TABLE */}
      <div className="glass-card p-6 space-y-6 border-indigo-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-extrabold text-white text-base">Side-by-Side Round Comparator</h3>
              <p className="text-xs text-slate-400">Select up to 3 companies to compare technical focus & round breakdown</p>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Comparing: <strong className="text-sky-300">{compareList.join(" vs ")}</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Attribute</th>
                {comparedCompanies.map(c => (
                  <th key={c.id} className="p-3 font-bold text-white text-sm">{c.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="p-3 font-bold text-slate-400">Category</td>
                {comparedCompanies.map(c => (
                  <td key={c.id} className="p-3 font-medium text-sky-400">{c.category}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-400">Number of Rounds</td>
                {comparedCompanies.map(c => (
                  <td key={c.id} className="p-3 font-bold text-white">{c.round_count} Rounds</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-400">Difficulty Level</td>
                {comparedCompanies.map(c => (
                  <td key={c.id} className="p-3 font-medium text-amber-300">{c.difficulty}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-400">Package Range</td>
                {comparedCompanies.map(c => (
                  <td key={c.id} className="p-3 font-medium text-emerald-400">{c.package_range}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-400">Eligible Depts</td>
                {comparedCompanies.map(c => (
                  <td key={c.id} className="p-3 text-slate-300">{c.eligible_departments?.join(", ")}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-400">Key Topics & Focus</td>
                {comparedCompanies.map(c => (
                  <td key={c.id} className="p-3 space-y-1">
                    {c.topics?.map((t: string, i: number) => (
                      <span key={i} className="inline-block bg-slate-800 text-slate-200 text-[10px] px-2 py-0.5 rounded mr-1 mb-1">
                        {t}
                      </span>
                    ))}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPANY CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((comp) => {
          const isComparing = compareList.includes(comp.name);
          return (
            <div key={comp.id} className={`glass-card p-6 space-y-4 relative ${isComparing ? "border-sky-500" : ""}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-800 text-sky-400 border border-slate-700">
                  {comp.category}
                </span>
                <button
                  onClick={() => toggleCompare(comp.name)}
                  className={`text-xs px-3 py-1 rounded-lg border font-semibold transition-all ${
                    isComparing 
                      ? "bg-sky-500/20 text-sky-300 border-sky-500/40" 
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {isComparing ? "Selected for Compare ✓" : "+ Compare"}
                </button>
              </div>

              <div>
                <h3 className="font-black text-2xl text-white">{comp.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{comp.description || `${comp.name} hiring pathway.`}</p>
              </div>

              <div className="space-y-2 text-xs border-t border-b border-slate-800/80 py-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Rounds:</span>
                  <span className="font-bold text-white">{comp.round_count} Rounds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Package Range:</span>
                  <span className="font-bold text-emerald-400">{comp.package_range}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Eligible Departments:</span>
                  <span className="font-medium text-slate-200">{comp.eligible_departments?.join(", ")}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Round Focus:</div>
                <div className="flex flex-wrap gap-1">
                  {comp.topics?.map((topic: string, idx: number) => (
                    <span key={idx} className="text-[10px] bg-slate-900 text-indigo-300 border border-slate-800 px-2 py-0.5 rounded">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
