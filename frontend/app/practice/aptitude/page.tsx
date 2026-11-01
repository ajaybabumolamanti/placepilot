"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Clock, CheckCircle2, Bookmark, ChevronLeft, ChevronRight, 
  Send, AlertTriangle, RefreshCw, BarChart2, Award, Sparkles 
} from 'lucide-react';

export default function AptitudePage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes timer
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/questions?category=APTITUDE')
      .then(res => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback default sample questions
        setQuestions([
          {
            id: 1, topic: "Quantitative Aptitude", title: "Speed, Distance & Time",
            prompt: "A train running at a speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train in meters?",
            options: ["120 m", "150 m", "180 m", "324 m"], correct_answer: "150 m",
            explanation: "Speed = 60 * (5/18) m/sec = 50/3 m/sec. Length = Speed * Time = (50/3) * 9 = 150 meters."
          },
          {
            id: 2, topic: "Logical Reasoning", title: "Blood Relations",
            prompt: "Pointing to a photograph, a man said, 'I have no brother or sister but that man's father is my father's son.' Whose photograph was it?",
            options: ["His own", "His son's", "His father's", "His nephew's"], correct_answer: "His son's",
            explanation: "Since the speaker has no brother or sister, 'my father's son' means the speaker himself. So 'that man's father is myself' -> photo is of his son."
          },
          {
            id: 3, topic: "Verbal Ability", title: "Synonyms & Context",
            prompt: "Choose the word that is most nearly SIMILAR in meaning to 'METICULOUS'.",
            options: ["Careless", "Painstaking", "Rapid", "Negligent"], correct_answer: "Painstaking",
            explanation: "'Meticulous' means showing great attention to detail or carefulness, which matches 'Painstaking'."
          },
          {
            id: 4, topic: "Data Interpretation", title: "Percentage Growth",
            prompt: "If Company X produced 450 units in 2024 and 585 units in 2025, what is the percentage growth in production?",
            options: ["25%", "30%", "35%", "20%"], correct_answer: "30%",
            explanation: "Growth = ((585 - 450) / 450) * 100 = (135 / 450) * 100 = 30%."
          }
        ]);
        setLoading(false);
      });
  }, []);

  // Timer Countdown
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, timeLeft]);

  const handleSelectOption = (qId: number, option: string) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId.toString()]: option }));
  };

  const toggleMarkReview = (qId: number) => {
    setMarkedForReview(prev => ({ ...prev, [qId.toString()]: !prev[qId.toString()] }));
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    
    try {
      const res = await axios.post('/api/attempts/submit', {
        user_id: 1,
        category: "APTITUDE",
        department_code: "CSE",
        answers: selectedAnswers,
        time_spent_seconds: 600 - timeLeft
      });
      setResult(res.data);
    } catch {
      // Local fallback calculation
      let correct = 0;
      questions.forEach(q => {
        if (selectedAnswers[q.id.toString()] === q.correct_answer) correct++;
      });
      setResult({
        score_percentage: Math.round((correct / questions.length) * 100),
        correct_count: correct,
        total_questions: questions.length,
        weak_topics: ["Speed Distance Time"]
      });
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400 gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
        <span>Loading Aptitude Round Questions...</span>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            Timed Aptitude Assessment
            <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded font-mono">QUANT & LOGICAL</span>
          </h1>
          <p className="text-xs text-slate-400">Question {currentIdx + 1} of {questions.length}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-mono font-bold ${
            timeLeft < 120 ? "bg-red-500/20 border-red-500/40 text-red-400 animate-pulse" : "bg-slate-950 border-slate-800 text-sky-400"
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTimer(timeLeft)}</span>
          </div>

          {!isSubmitted && (
            <button onClick={handleSubmit} className="gradient-btn text-xs px-5 py-2 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" />
              <span>Submit Assessment</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Question & Answer Column */}
        <div className="lg:col-span-3 space-y-6">
          
          {currentQ && (
            <div className="glass-card p-6 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs text-sky-400 font-bold uppercase tracking-wider">{currentQ.topic} • {currentQ.title}</span>
                <button 
                  onClick={() => toggleMarkReview(currentQ.id)}
                  className={`text-xs px-3 py-1 rounded-lg border flex items-center gap-1 font-semibold ${
                    markedForReview[currentQ.id.toString()] 
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40" 
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  {markedForReview[currentQ.id.toString()] ? "Marked for Review" : "Mark for Review"}
                </button>
              </div>

              <div className="text-base md:text-lg font-medium text-white leading-relaxed">
                {currentQ.prompt}
              </div>

              {/* Options list */}
              <div className="space-y-3 pt-2">
                {currentQ.options?.map((opt: string, idx: number) => {
                  const isSelected = selectedAnswers[currentQ.id.toString()] === opt;
                  const isCorrect = isSubmitted && opt === currentQ.correct_answer;
                  const isWrong = isSubmitted && isSelected && !isCorrect;

                  let optStyle = "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200";
                  if (isSelected) optStyle = "bg-indigo-950/80 border-indigo-500 text-white shadow-md shadow-indigo-500/10";
                  if (isCorrect) optStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold";
                  if (isWrong) optStyle = "bg-red-950/80 border-red-500 text-red-200";

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(currentQ.id, opt)}
                      className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-center justify-between ${optStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-mono font-bold text-slate-400">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submit */}
              {isSubmitted && currentQ.explanation && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                  <div className="font-bold text-indigo-400">Detailed Explanation:</div>
                  <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-50 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <button
                  disabled={currentIdx === questions.length - 1}
                  onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-50 flex items-center gap-1"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Question Palette Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">Question Navigation Palette</h3>
            <div className="grid grid-cols-4 gap-2">
              {questions.map((q, idx) => {
                const isAns = !!selectedAnswers[q.id.toString()];
                const isRev = !!markedForReview[q.id.toString()];
                const isCurr = idx === currentIdx;

                let btnStyle = "bg-slate-900 border-slate-800 text-slate-400";
                if (isAns) btnStyle = "bg-emerald-600 text-white font-bold";
                if (isRev) btnStyle = "bg-amber-500 text-slate-950 font-bold";
                if (isCurr) btnStyle += " ring-2 ring-indigo-400";

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-10 rounded-lg text-xs font-mono transition-all flex items-center justify-center ${btnStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600"></span> Answered
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span> Marked for Review
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700"></span> Unanswered
              </div>
            </div>
          </div>

          {/* Test Results Summary Card */}
          {result && (
            <div className="glass-card p-5 space-y-3 border-emerald-500/40">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Award className="w-5 h-5" />
                <span>Assessment Completed</span>
              </div>
              <div className="text-3xl font-black text-white">{result.score_percentage}%</div>
              <div className="text-xs text-slate-300">
                Correct: {result.correct_count} / {result.total_questions}
              </div>
              {result.weak_topics?.length > 0 && (
                <div className="text-xs text-amber-300 pt-2 border-t border-slate-800">
                  Retest recommended for: {result.weak_topics.join(", ")}
                </div>
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
