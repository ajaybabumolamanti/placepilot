"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Code2, Cpu, Zap, Dna, CheckCircle2, XCircle, 
  HelpCircle, Filter, RefreshCw, BookOpen, Sparkles 
} from 'lucide-react';

export default function TechnicalPage() {
  const [department, setDepartment] = useState("CSE");
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions(department);
  }, [department]);

  const fetchQuestions = (dept: string) => {
    setLoading(true);
    axios.get(`/api/questions?category=TECHNICAL&department_code=${dept}`)
      .then(res => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback department technical questions
        if (dept === "CSE") {
          setQuestions([
            { id: 101, topic: "DBMS", title: "SQL Joins", prompt: "Which SQL clause returns all records when there is a match in either left or right table records?", options: ["INNER JOIN", "LEFT JOIN", "FULL OUTER JOIN", "CROSS JOIN"], correct_answer: "FULL OUTER JOIN", explanation: "FULL OUTER JOIN combines the results of both LEFT and RIGHT joins.", difficulty: "Easy" },
            { id: 102, topic: "Operating Systems", title: "Virtual Memory", prompt: "What occurs when a program attempts to access a block of memory that is not currently mapped in RAM?", options: ["Segmentation Fault", "Page Fault", "Deadlock", "Cache Miss"], correct_answer: "Page Fault", explanation: "A Page Fault is raised by MMU hardware when a page table entry is invalid.", difficulty: "Medium" },
            { id: 103, topic: "Data Structures", title: "Tree Traversal", prompt: "Which tree traversal visits the root node AFTER visiting both its left and right subtrees?", options: ["Pre-order", "In-order", "Post-order", "Level-order"], correct_answer: "Post-order", explanation: "Post-order follows Left -> Right -> Root.", difficulty: "Easy" }
          ]);
        } else if (dept === "ECE") {
          setQuestions([
            { id: 104, topic: "Digital Electronics", title: "Logic Gates", prompt: "Which logic gate outputs HIGH (1) only when all of its inputs are LOW (0)?", options: ["AND", "NAND", "NOR", "XOR"], correct_answer: "NOR", explanation: "NOR is negation of OR. It outputs 1 only when all inputs are 0.", difficulty: "Easy" },
            { id: 105, topic: "Microcontrollers", title: "8051 Interrupts", prompt: "In 8051 Microcontroller architecture, how many total interrupt sources are present?", options: ["3", "5", "8", "12"], correct_answer: "5", explanation: "8051 has 5 interrupts: 2 external, 2 timer interrupts, 1 serial interrupt.", difficulty: "Medium" }
          ]);
        } else if (dept === "EEE") {
          setQuestions([
            { id: 106, topic: "Electrical Machines", title: "Transformer Losses", prompt: "Lamination of a transformer core is done primarily to reduce which type of loss?", options: ["Copper Loss", "Eddy Current Loss", "Hysteresis Loss", "Friction Loss"], correct_answer: "Eddy Current Loss", explanation: "Laminations increase core resistance to circulating currents.", difficulty: "Easy" }
          ]);
        } else {
          setQuestions([
            { id: 107, topic: "Biochemistry", title: "Enzyme Kinetics", prompt: "What does the Michaelis constant (Km) represent in enzyme kinetics?", options: ["Maximum velocity", "Substrate concentration at half Vmax", "Turnover number", "Inhibition constant"], correct_answer: "Substrate concentration at half Vmax", explanation: "Km is defined as substrate concentration where rate equals 1/2 Vmax.", difficulty: "Medium" }
          ]);
        }
        setLoading(false);
      });
  };

  const handleSelectOption = (qId: number, opt: string) => {
    setSelectedAnswers(prev => ({ ...prev, [qId.toString()]: opt }));
    setShowExplanations(prev => ({ ...prev, [qId.toString()]: true }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-3 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Department Technical MCQs</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">Technical Domain Round</h1>
        <p className="text-slate-400 text-sm max-w-xl">
          Practice department-specific technical MCQs with instant explanations and topic accuracy breakdowns.
        </p>
      </div>

      {/* Department Chooser Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {[
          { code: "CSE", label: "CSE (MVP Suite)", icon: Code2, color: "text-indigo-400" },
          { code: "ECE", label: "ECE Electronics", icon: Cpu, color: "text-sky-400" },
          { code: "EEE", label: "EEE Electrical", icon: Zap, color: "text-amber-400" },
          { code: "BIOTECH", label: "Biotechnology", icon: Dna, color: "text-emerald-400" }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = department === item.code;
          return (
            <button
              key={item.code}
              onClick={() => setDepartment(item.code)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isActive 
                  ? "bg-slate-900 border-indigo-500 text-white ring-2 ring-indigo-500/30 shadow-lg" 
                  : "bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 ${item.color}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="py-12 flex items-center justify-center text-slate-400 gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
          <span>Loading {department} Technical Questions...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((q, idx) => {
            const selected = selectedAnswers[q.id.toString()];
            const isRevealed = showExplanations[q.id.toString()];

            return (
              <div key={q.id} className="glass-card p-6 space-y-4 border-slate-800 hover:border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">{q.topic}</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-300 font-semibold px-2.5 py-0.5 rounded">
                    Difficulty: {q.difficulty}
                  </span>
                </div>

                <div className="text-base font-semibold text-white leading-relaxed">
                  {q.prompt}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {q.options?.map((opt: string, oIdx: number) => {
                    const isSelected = selected === opt;
                    const isCorrect = isRevealed && opt === q.correct_answer;
                    const isWrong = isRevealed && isSelected && !isCorrect;

                    let btnStyle = "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200";
                    if (isSelected) btnStyle = "bg-indigo-950 border-indigo-500 text-white font-bold";
                    if (isCorrect) btnStyle = "bg-emerald-950 border-emerald-500 text-emerald-300 font-bold";
                    if (isWrong) btnStyle = "bg-red-950 border-red-500 text-red-300";

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(q.id, opt)}
                        className={`p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-slate-400">{String.fromCharCode(65 + oIdx)}.</span>
                          <span>{opt}</span>
                        </div>
                        {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {isWrong && <XCircle className="w-4 h-4 text-red-400" />}
                      </button>
                    );
                  })}
                </div>

                {isRevealed && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                    <div className="font-bold text-emerald-400">Correct Answer: {q.correct_answer}</div>
                    <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
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
