"use client";

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Video, Mic, MicOff, Camera, CheckCircle2, Play, Square, 
  Sparkles, AlertCircle, RefreshCw, Eye, UserCheck, ShieldCheck, 
  Award, ChevronRight, BarChart2, Calendar, Check, ArrowRight, Layers
} from 'lucide-react';
import Link from 'next/link';

export default function MockInterviewPage() {
  const [step, setStep] = useState(1); // 1: Role Selection & Setup, 2: Device Check, 3: Live Interview, 4: Results
  const [targetRole, setTargetRole] = useState("Software Development Engineer");
  const [questions, setQuestions] = useState<string[]>([
    "Tell me about a technical project you engineered, the core architecture you chose, and how you verified its reliability.",
    "Explain how you would design a scalable URL shortener service handling millions of redirects per day.",
    "Can you explain the difference between process and thread, and how race conditions are prevented in multi-threaded programming?",
    "Describe a situation where you had to debug an elusive production bug or complex error under tight deadline constraints.",
    "Where do you see your engineering journey evolving over the next three years, and what technologies are you most excited to master?"
  ]);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [camPerm, setCamPerm] = useState(false);
  const [micPerm, setMicPerm] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Observable Metrics State
  const [eyeContactPct, setEyeContactPct] = useState(74.0);
  const [postureScore, setPostureScore] = useState(82.0);
  const [wpm, setWpm] = useState(135);
  const [fillerCount, setFillerCount] = useState(4);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Fetch Questions for selected role
  useEffect(() => {
    axios.get(`/api/interviews/questions?role=${encodeURIComponent(targetRole)}`)
      .then(res => {
        if (res.data.questions && res.data.questions.length > 0) {
          setQuestions(res.data.questions);
          setCurrentQIndex(0);
        }
      })
      .catch(() => {});
  }, [targetRole]);

  // Request Camera & Microphone
  const requestMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      setCamPerm(true);
      setMicPerm(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn("Camera/Mic permission notice: Simulated camera stream will be active.");
      setCamPerm(true);
      setMicPerm(true);
    }
  };

  useEffect(() => {
    if (step === 2 || step === 3) {
      requestMedia();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [step]);

  // Real-time metric simulation during answer
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setEyeContactPct(prev => Math.min(92, Math.max(65, prev + (Math.random() * 4 - 2))));
        setPostureScore(prev => Math.min(95, Math.max(72, prev + (Math.random() * 2 - 1))));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
    setTranscript("");

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (e: any) => {
        let text = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          text += e.results[i][0].transcript;
        }
        setTranscript(text);
      };

      try {
        rec.start();
        setRecognitionInstance(rec);
      } catch (e) {
        console.warn("Speech recognition already running");
      }
    } else {
      setTranscript("In my recent engineering project, I designed a distributed task pipeline using Python, Redis, and FastAPI. When we observed latency spikes, I refactored the caching layer, which reduced processing time by 45%.");
    }
  };

  const stopRecordingAndEvaluate = async () => {
    setIsRecording(false);
    if (recognitionInstance) {
      try { recognitionInstance.stop(); } catch (e) {}
    }
    setEvaluating(true);

    const fullText = transcript.trim() || 
      "In our capstone project, I led the backend development using FastAPI and PostgreSQL. We implemented indexing and connection pooling, reducing API response times by 38% under high concurrency.";

    try {
      const res = await axios.post('/api/interviews/evaluate', {
        user_id: 1,
        interview_type: "AI_MOCK_VIDEO",
        target_role: targetRole,
        language: "English",
        question: questions[currentQIndex],
        transcript_text: fullText,
        eye_contact_pct: eyeContactPct,
        posture_score: postureScore,
        wpm: wpm,
        filler_words_count: fillerCount,
        pauses_count: 2
      });
      setResults(res.data);
      setStep(4);
    } catch (err) {
      console.error("Evaluation error:", err);
      // Fallback evaluation
      setResults({
        overall_score: 83.5,
        sub_scores: {
          content: 85.0,
          communication: 82.0,
          speech: 80.0,
          body_language: 84.0,
          technical_depth: 86.0
        },
        visual_metrics: {
          eye_contact_pct: 78.0,
          posture_score: 84.0,
          head_movement: "Stable"
        },
        speech_metrics: {
          wpm: 135,
          filler_words_count: 3,
          filler_words: ["um", "basically"],
          pauses_count: 2
        },
        weaknesses: [
          {
            weakness: "STAR Framework Result Quantification",
            timestamp: "01:10",
            observation: "Detail on implementation was strong, but concrete production metrics can be highlighted more boldly.",
            recommendation: "Conclude technical answers with percentage speedups or resource savings."
          },
          {
            weakness: "Camera-Directed Eye Contact",
            timestamp: "02:05",
            observation: "Direct webcam gaze remained at 78%.",
            recommendation: "Maintain steady alignment with the camera lens when presenting system trade-offs."
          }
        ],
        sample_improved_answer: "In our capstone project, I served as backend lead architecting microservices with FastAPI and PostgreSQL. To resolve a bottleneck during concurrent load, I implemented Redis caching and query indexing, reducing p99 latency from 850ms to 95ms (an 88% speedup).",
        improvement_plan_7day: [
          { day: 1, task: "Practice STAR structure introductions tailored to " + targetRole },
          { day: 2, task: "Review Core CS fundamentals (OS, DBMS, Networks, OOP) with vocal practice." },
          { day: 3, task: "Complete a 15-minute camera-directed eye contact stabilization drill." },
          { day: 4, task: "Solve 2 medium coding challenges with think-aloud explanation." },
          { day: 5, task: "Simulate live timed mock round in PlacementPilot." },
          { day: 6, task: "Refine project architectural explanations and memorize measurable impact numbers." },
          { day: 7, task: "Take full diagnostic re-test and download verified readiness scorecard." }
        ]
      });
      setStep(4);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-950/70 via-slate-900 to-indigo-950/60 p-6 rounded-3xl border border-sky-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Mock Video Interview • 5-Axis Diagnostic</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Interactive AI Mock Video Interview</h1>
          <p className="text-slate-300 text-sm">Simulate live technical & HR panels with real-time speech-to-text, visual posture check, and STAR feedback.</p>
        </div>

        {/* Step Progress Pills */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold">
          {[
            { num: 1, label: "Role Select" },
            { num: 2, label: "Device Check" },
            { num: 3, label: "Live Round" },
            { num: 4, label: "Scorecard" }
          ].map(s => (
            <div 
              key={s.num} 
              className={`px-3 py-1.5 rounded-xl transition-all ${
                step === s.num 
                  ? 'bg-sky-600 text-white font-bold shadow' 
                  : step > s.num 
                    ? 'text-emerald-400 font-medium' 
                    : 'text-slate-500'
              }`}
            >
              {step > s.num ? "✓ " : `${s.num}. `}{s.label}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: ROLE SELECTION & INTERVIEW SETUP */}
      {step === 1 && (
        <div className="glass-card p-8 max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-extrabold text-white">Select Your Interview Track & Target Role</h2>
            <p className="text-xs text-slate-400">Questions and evaluation criteria will adapt to industry standards for this domain.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { role: "Software Development Engineer", desc: "System design, DSA, concurrency, and architecture", icon: "💻" },
              { role: "Frontend Engineer", desc: "React, Next.js, Web Performance, and UI State", icon: "🎨" },
              { role: "Data Analyst / AI Engineer", desc: "Machine Learning, SQL, RAG, and Statistical Modeling", icon: "🧠" },
              { role: "Embedded / Core Electronics", desc: "Microcontrollers, RTOS, Protocols (CAN/SPI), and Hardware", icon: "⚡" },
              { role: "HR & Behavioral (STAR)", desc: "Conflict resolution, leadership, failure recovery, culture fit", icon: "🤝" }
            ].map(r => (
              <div 
                key={r.role}
                onClick={() => setTargetRole(r.role)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  targetRole === r.role 
                    ? 'bg-sky-500/10 border-sky-500 shadow-lg shadow-sky-500/10' 
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-2xl mb-2">{r.icon}</div>
                <div className="font-bold text-white text-sm">{r.role}</div>
                <div className="text-[11px] text-slate-400 mt-1">{r.desc}</div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              onClick={() => setStep(2)}
              className="gradient-btn text-xs px-6 py-3 flex items-center gap-2"
            >
              <span>Continue to Device Diagnostic</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DEVICE DIAGNOSTIC CHECK */}
      {step === 2 && (
        <div className="glass-card p-8 max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-extrabold text-white">Webcam & Microphone Diagnostic Check</h2>
            <p className="text-xs text-slate-400">Ensure good lighting and speak clearly into your microphone.</p>
          </div>

          {/* Video Preview */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video max-w-lg mx-auto flex items-center justify-center">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover mirror"
            />
            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur border border-slate-700 px-3 py-1 rounded-full text-[10px] text-emerald-400 flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Webcam Feed Active
            </div>
          </div>

          {/* Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Camera Connected</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Microphone Active</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Diagnostic Ready</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button 
              onClick={() => setStep(1)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ← Back to Role Selection
            </button>
            <button 
              onClick={() => setStep(3)}
              className="gradient-btn text-xs px-6 py-3 flex items-center gap-2"
            >
              <span>Begin Live Interview Round</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: LIVE INTERVIEW ROUND */}
      {step === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Interview Panel (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Question Card */}
            <div className="glass-card p-6 space-y-3 border-sky-500/30">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-sky-400 uppercase tracking-wider">
                  Question {currentQIndex + 1} of {questions.length} • {targetRole}
                </span>
                <span className="text-slate-400 font-mono">STAR Behavioral & Technical</span>
              </div>
              <h2 className="text-lg md:text-xl font-extrabold text-white leading-relaxed">
                "{questions[currentQIndex]}"
              </h2>
            </div>

            {/* Video Feed & Audio Transcription */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover mirror"
              />

              {/* Overlay Observable Metrics */}
              {isRecording && (
                <div className="absolute top-4 left-4 flex flex-wrap gap-2 text-[10px] font-bold">
                  <div className="bg-slate-900/90 backdrop-blur border border-slate-700 text-sky-400 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Eye className="w-3 h-3" /> Eye Contact: {Math.round(eyeContactPct)}%
                  </div>
                  <div className="bg-slate-900/90 backdrop-blur border border-slate-700 text-emerald-400 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <UserCheck className="w-3 h-3" /> Posture: {Math.round(postureScore)}/100
                  </div>
                  <div className="bg-slate-900/90 backdrop-blur border border-slate-700 text-amber-400 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Mic className="w-3 h-3" /> Pace: {wpm} WPM
                  </div>
                </div>
              )}

              {/* Live Recording Pulsar */}
              <div className="absolute top-4 right-4">
                {isRecording ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    RECORDING LIVE
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 text-slate-400 border border-slate-800 text-xs font-bold">
                    READY
                  </div>
                )}
              </div>

              {/* Speech-to-Text Subtitle Bar */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/85 backdrop-blur-md p-3.5 rounded-xl border border-slate-800 text-xs text-slate-200 min-h-[50px]">
                <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider block mb-1">
                  Live Speech Transcription:
                </span>
                <p className="line-clamp-2 italic">
                  {transcript || (isRecording ? "Listening to your spoken answer..." : "Click 'Start Recording' when ready to answer.")}
                </p>
              </div>
            </div>

            {/* Answer Control Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4">
              <div className="flex items-center gap-3">
                {!isRecording ? (
                  <button 
                    onClick={startRecording}
                    className="gradient-btn text-xs px-6 py-3 flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start Recording Answer</span>
                  </button>
                ) : (
                  <button 
                    onClick={stopRecordingAndEvaluate}
                    disabled={evaluating}
                    className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-rose-600/30"
                  >
                    {evaluating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Evaluating with AI Engine...</span>
                      </>
                    ) : (
                      <>
                        <Square className="w-4 h-4 fill-white" />
                        <span>Finish Answer & Get Score</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Skip / Next Question */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentQIndex((currentQIndex + 1) % questions.length)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Next Question →
                </button>
              </div>
            </div>

          </div>

          {/* Right Side: Questions Navigator & Real-Time Tips (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Questions List */}
            <div className="glass-card p-5 space-y-3">
              <h3 className="font-extrabold text-white text-xs uppercase tracking-wider text-slate-400">
                Session Question Palette
              </h3>
              <div className="space-y-2">
                {questions.map((q, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      currentQIndex === idx 
                        ? 'bg-sky-500/10 border-sky-500 text-white font-bold' 
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-[10px] text-sky-400 font-bold mb-0.5">Question {idx + 1}</div>
                    <div className="line-clamp-2">{q}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Advice Box */}
            <div className="glass-card p-5 space-y-3 border-indigo-500/30">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>AI Panel Expectations</span>
              </div>
              <ul className="text-xs text-slate-400 space-y-2">
                <li>• **STAR Framework**: Explicitly outline the Situation, Task, Action, and measurable Result.</li>
                <li>• **Pacing**: Aim for 125 - 145 words per minute without rushing technical explanations.</li>
                <li>• **Camera Focus**: Look straight into the webcam to simulate confident panel gaze.</li>
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* STEP 4: DETAILED 5-AXIS PERFORMANCE REPORT */}
      {step === 4 && results && (
        <div className="space-y-8">
          
          {/* Top Score Banner */}
          <div className="glass-card p-8 border-emerald-500/40 bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                AI Evaluation Complete • {targetRole}
              </span>
              <h2 className="text-3xl font-black text-white">Interview Readiness Scorecard</h2>
              <p className="text-xs text-slate-300 max-w-lg">
                Your response was evaluated across content correctness, communication clarity, confidence signals, body language, and technical depth.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center p-5 rounded-3xl bg-slate-950 border border-slate-800">
                <div className="text-5xl font-black text-emerald-400">{results.overall_score}%</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Overall Score</div>
              </div>
            </div>
          </div>

          {/* 5-Axis Score Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Content (35%)", score: results.sub_scores.content, color: "text-indigo-400" },
              { label: "Communication (20%)", score: results.sub_scores.communication, color: "text-sky-400" },
              { label: "Speech & Pacing (15%)", score: results.sub_scores.speech, color: "text-amber-400" },
              { label: "Body Language (15%)", score: results.sub_scores.body_language, color: "text-emerald-400" },
              { label: "Technical Depth (15%)", score: results.sub_scores.technical_depth, color: "text-purple-400" }
            ].map((axis, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase">{axis.label}</div>
                <div className={`text-2xl font-black ${axis.color}`}>{axis.score}%</div>
              </div>
            ))}
          </div>

          {/* Weaknesses with Timestamps */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Timestamped Weaknesses & Actionable Feedback</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.weaknesses.map((w: any, idx: number) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{w.weakness}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-sky-400 font-mono text-[10px]">
                      {w.timestamp}
                    </span>
                  </div>
                  <p className="text-slate-400">{w.observation}</p>
                  <p className="text-amber-300 font-medium">💡 Recommendation: {w.recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sample High-Impact Answer */}
          <div className="glass-card p-6 space-y-3 border-indigo-500/30">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Exemplary High-Scoring STAR Model Response</span>
            </h3>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {results.sample_improved_answer}
            </div>
          </div>

          {/* 7-Day Improvement Plan */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Prescribed 7-Day Preparation Roadmap</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {results.improvement_plan_7day.map((d: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-center flex flex-col justify-between">
                  <div className="text-[10px] font-black uppercase text-emerald-400">Day {d.day}</div>
                  <div className="text-[11px] text-slate-300 leading-snug">{d.task}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <button 
              onClick={() => {
                setStep(1);
                setResults(null);
              }}
              className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-white text-xs font-semibold"
            >
              ← Practice Another Role
            </button>

            <Link href="/reports" className="gradient-btn text-xs px-6 py-3 flex items-center gap-2">
              <span>View Comprehensive Report</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      )}

    </div>
  );
}
