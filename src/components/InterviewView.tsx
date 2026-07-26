import React, { useState, useEffect } from 'react';
import { AppStage } from '../types';
import {
  Mic,
  Brain,
  Volume2,
  Play,
  Square,
  Sparkles,
  BarChart2,
  Bot,
  Send,
  Award,
  Pause,
  Clock,
  Circle
} from 'lucide-react';

interface InterviewViewProps {
  onSelectTab: (tab: AppStage) => void;
  onUpdateXp: (amount: number) => void;
}

export const InterviewView: React.FC<InterviewViewProps> = ({ onSelectTab, onUpdateXp }) => {
  const [timerSeconds, setTimerSeconds] = useState(323); // 05:23 starting
  const [isRecording, setIsRecording] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Live real-time gauges matching reference image
  const [metrics, setMetrics] = useState({
    confidence: 82,
    clarity: 78,
    technical: 85,
    overall: 81,
  });

  const [promptQuestion, setPromptQuestion] = useState(
    'Tell me about yourself and why you are interested in this role.'
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndInterview = () => {
    onUpdateXp(150);
    onSelectTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              AI Interview
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
                <Circle className="w-2 h-2 fill-rose-500 text-rose-500 animate-pulse" />
                Recording
              </span>
            </h1>
            <p className="text-xs text-slate-400">Real-Time Voice Analysis & Feedback</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>

          <button
            onClick={handleEndInterview}
            className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 font-bold text-xs"
          >
            End Interview
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Mascot & Prompt Question */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0D111D] border border-slate-800/80 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Robot Mascot Artwork Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#12172A] to-[#0A0E1A] border border-indigo-500/20 text-center space-y-4">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-1 shadow-xl shadow-indigo-600/30 relative">
                <div className="w-full h-full bg-[#0D111D] rounded-full flex items-center justify-center">
                  <Bot className="w-12 h-12 text-indigo-400 animate-pulse" />
                </div>
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-indigo-600 border-2 border-[#0D111D] text-white">
                  <Volume2 className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Sound Wave Animation */}
              <div className="flex items-center justify-center gap-1.5 h-6">
                {[14, 28, 20, 32, 18, 30, 16, 24, 12].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-indigo-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.12}s`, height: `${h}px` }}
                  />
                ))}
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                Listening...
              </span>
            </div>

            {/* Prompt Question */}
            <div className="p-4 rounded-2xl bg-[#070A12] border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Interviewer Question</span>
              <p className="text-sm font-extrabold text-white leading-relaxed">
                "{promptQuestion}"
              </p>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-800/80">
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`p-3.5 rounded-2xl transition-all ${
                isRecording ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>

            <button className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white">
              <Pause className="w-5 h-5" />
            </button>

            <button onClick={handleEndInterview} className="p-3.5 rounded-2xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30">
              <Square className="w-5 h-5 fill-rose-400" />
            </button>
          </div>
        </div>

        {/* Right Column: Real-time Analysis Gauges */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0D111D] border border-slate-800/80 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <h3 className="font-extrabold text-white text-base">Real-time Analysis</h3>

            <div className="space-y-4 text-xs">
              {/* Confidence */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-300">Confidence</span>
                  <span className="text-indigo-400">{metrics.confidence}/100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${metrics.confidence}%` }} />
                </div>
              </div>

              {/* Clarity */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-300">Clarity</span>
                  <span className="text-purple-400">{metrics.clarity}/100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${metrics.clarity}%` }} />
                </div>
              </div>

              {/* Technical */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-300">Technical</span>
                  <span className="text-emerald-400">{metrics.technical}/100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${metrics.technical}%` }} />
                </div>
              </div>
            </div>

            {/* Overall Score Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-purple-950/30 border border-indigo-500/20 space-y-2 text-center">
              <span className="text-xs text-slate-400 font-semibold">Overall Score</span>
              <div className="text-3xl font-black text-white">{metrics.overall}/100</div>
              <p className="text-xs font-bold text-emerald-400">Good job! Keep going 💪</p>
            </div>
          </div>

          <button
            onClick={() => {
              setPromptQuestion('How do you optimize a database query with millions of records?');
            }}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all"
          >
            Next Interview Question →
          </button>
        </div>
      </div>
    </div>
  );
};
