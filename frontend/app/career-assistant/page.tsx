"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { 
  Compass, Send, Sparkles, Award, Code, CheckCircle2, 
  ArrowRight, BookOpen, Layers, RefreshCw, Terminal, User, Bot 
} from 'lucide-react';
import Link from 'next/link';

export default function CareerGuidancePage() {
  const [messages, setMessages] = useState<any[]>([
    {
      sender: 'bot',
      text: "Hello! I am PilotAI, your personal engineering career strategist. Tell me about your academic background, what domains excite you (e.g., Full Stack, AI & Data, Cloud DevOps, or Core Embedded Systems), and what company tiers you're targeting. I will craft a customized placement roadmap for you."
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [advisorData, setAdvisorData] = useState<any>(null);

  const handleSendMessage = async (queryText?: string) => {
    const text = queryText || inputQuery;
    if (!text.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text }];
    setMessages(newMsgs);
    setInputQuery("");
    setLoading(true);

    try {
      const res = await axios.post('/api/career/assistant/chat', {
        user_id: 1,
        query: text,
        interests: ["Web Development", "Distributed Systems", "Cloud"],
        current_skills: ["Python", "SQL", "React"]
      });

      setAdvisorData(res.data);
      setMessages([...newMsgs, { sender: 'bot', text: res.data.reply }]);
    } catch (err) {
      console.error("Career assistant error:", err);
      // Fallback response
      const fallbackData = {
        reply: "Based on your technical aspirations, the recommended high-growth track is **Full-Stack Software Engineer** with modern cloud microservice architecture. Focus on deepening your DSA foundations, building production-ready projects with measurable outcomes, and practicing timed mock interviews.",
        recommended_role: "Full-Stack Software Engineer",
        recommended_technologies: ["Next.js & React 18", "FastAPI / Node.js", "PostgreSQL & Redis", "Docker & CI/CD"],
        recommended_certifications: [
          "AWS Certified Cloud Practitioner",
          "Meta Front-End Developer Professional Certificate"
        ],
        recommended_projects: [
          { title: "Real-time SaaS Collaborative Portal", desc: "Full-stack dashboard with role-based auth, WebSockets for live sync, and PostgreSQL database." },
          { title: "High-Throughput Task Queue & Cache", desc: "Distributed job processing engine using Redis pub/sub and containerized background workers." }
        ],
        learning_roadmap: [
          { phase: "Phase 1: DSA Foundations", duration: "Weeks 1-4", focus: "Arrays, HashMaps, Trees, and Two Pointers on Monaco Sandbox." },
          { phase: "Phase 2: Modern Frontend", duration: "Weeks 5-8", focus: "TypeScript, React 18 hooks, Next.js App Router, and Tailwind CSS." },
          { phase: "Phase 3: Robust Backend", duration: "Weeks 9-12", focus: "REST/GraphQL APIs, indexing, joins, ORMs, JWT auth, and caching." },
          { phase: "Phase 4: Capstone & Mocks", duration: "Weeks 13-16", focus: "Full-stack deployment, ATS resume tuning, and AI mock video rounds." }
        ],
        interview_tips: [
          "Be prepared to code live on a clean whiteboard or Monaco editor without IDE autocompletion.",
          "Always state Time and Space complexity (Big-O) before writing code.",
          "Frame project explanations with the STAR framework (Situation, Task, Action, Result)."
        ]
      };
      setAdvisorData(fallbackData);
      setMessages([...newMsgs, { sender: 'bot', text: fallbackData.reply }]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "How can I prepare for Full-Stack SDE roles at Zoho and Freshworks?",
    "I am an ECE student wanting to transition into Cloud & DevOps.",
    "What are the highest-impact capstone projects for placement in 2026?",
    "Which certifications matter most for campus placements?"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/60 p-6 rounded-3xl border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PilotAI Career Advisor</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Interactive AI Career Guidance Assistant</h1>
          <p className="text-slate-300 text-sm">Personalized career pathway discovery, learning roadmap generation, project blueprints, and certification guidance.</p>
        </div>

        <Link href="/interview/mock" className="gradient-btn text-xs px-5 py-3 flex items-center gap-2 self-start md:self-auto">
          <span>Practice Mock Interview</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Chat Interface (7 cols) */}
        <div className="lg:col-span-7 glass-card p-6 flex flex-col h-[650px] justify-between space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="font-extrabold text-white text-xs">PilotAI Strategic Career Mentor</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Placement Guidance Mode
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {messages.map((m, idx) => (
              <div 
                key={idx}
                className={`flex gap-3 text-xs ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-purple-600/30 text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div 
                  className={`p-4 rounded-2xl max-w-lg leading-relaxed whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 text-xs items-center text-slate-400">
                <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                <span>PilotAI is analyzing industry hiring trends and formulating your roadmap...</span>
              </div>
            )}
          </div>

          {/* Sample Prompts Chips */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">Recommended Queries</div>
            <div className="flex flex-wrap gap-1.5">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors text-left"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <form 
            onSubmit={e => { e.preventDefault(); handleSendMessage(); }}
            className="flex items-center gap-2 pt-2"
          >
            <input 
              type="text"
              placeholder="Ask PilotAI anything about technologies, certs, projects, or placement roadmaps..."
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="gradient-btn text-xs px-5 py-3 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Structured Career Roadmap & Recommendations Output (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {!advisorData ? (
            <div className="glass-card p-10 text-center space-y-3 text-slate-400">
              <Compass className="w-10 h-10 text-purple-400 mx-auto" />
              <h3 className="font-bold text-white text-sm">Personalized Career Strategy</h3>
              <p className="text-xs text-slate-400">
                Send a question in the chat to see your step-by-step 4-phase learning roadmap, recommended certifications, and portfolio project blueprints.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Target Role & Recommended Tech */}
              <div className="glass-card p-5 space-y-3 border-purple-500/30">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider bg-purple-500/10 px-2 py-0.5 rounded">
                  Recommended Track
                </span>
                <h3 className="text-lg font-black text-white">{advisorData.recommended_role}</h3>
                
                <div>
                  <div className="text-[11px] text-slate-400 font-bold uppercase mb-1.5">Technologies to Learn:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {advisorData.recommended_technologies.map((t: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4-Phase Step Roadmap */}
              <div className="glass-card p-5 space-y-3">
                <h4 className="font-extrabold text-white text-xs uppercase tracking-wider text-slate-400">
                  Step-by-Step Learning Roadmap
                </h4>
                <div className="space-y-2">
                  {advisorData.learning_roadmap.map((step: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
                      <div className="flex justify-between items-baseline font-bold text-white">
                        <span className="text-purple-300">{step.phase}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{step.duration}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">{step.focus}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Certifications */}
              <div className="glass-card p-5 space-y-3">
                <h4 className="font-extrabold text-white text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>High-Value Certifications</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {advisorData.recommended_certifications.map((c: string, idx: number) => (
                    <li key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Capstone Projects */}
              <div className="glass-card p-5 space-y-3">
                <h4 className="font-extrabold text-white text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-sky-400" />
                  <span>Portfolio Project Blueprints</span>
                </h4>
                <div className="space-y-2">
                  {advisorData.recommended_projects.map((p: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                      <div className="font-bold text-sky-300">{p.title}</div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
