import React from 'react';
import { AppStage } from '../types';
import {
  Smartphone,
  Target,
  Mic,
  Calendar,
  BookOpen,
  TrendingUp,
  BarChart2,
  ChevronRight,
  Flame,
  Zap,
  Star
} from 'lucide-react';

interface MobileViewMockupProps {
  userName?: string;
  onSelectStage: (stage: AppStage) => void;
}

export function MobileViewMockup({ userName = 'Adithya', onSelectStage }: MobileViewMockupProps) {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            Mobile View Preview
          </h1>
          <p className="text-xs text-slate-400">Responsive Native iOS / Android Experience</p>
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
          Mobile App Mockup
        </span>
      </div>

      {/* Side-by-side Dual Phone Mockup Frame */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
        {/* Phone Mockup 1: Home Dashboard View */}
        <div className="w-[320px] sm:w-[350px] h-[640px] bg-[#0A0E1A] rounded-[48px] border-[10px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between p-5 space-y-4 font-sans select-none ring-1 ring-slate-700">
          {/* Top Speaker Notch */}
          <div className="w-28 h-4 bg-slate-800 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-20" />

          <div className="pt-4 space-y-4 overflow-y-auto pr-1">
            {/* Header Greeting */}
            <div className="space-y-1">
              <p className="text-xs font-extrabold text-white">Hi, {userName} 👋</p>
              <p className="text-[11px] text-slate-400">Let's learn something new today!</p>
            </div>

            {/* Today's Goal Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900/60 to-purple-900/40 border border-indigo-500/30 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">Today's Goal</span>
                <span className="text-indigo-300 font-black">8 / 15</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '53%' }} />
              </div>
            </div>

            {/* Continue Learning */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400">Continue Learning</span>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white">Data Structures</div>
                    <div className="text-[10px] text-slate-400">Arrays & Linked Lists</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400">Quick Actions</span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <button
                  onClick={() => onSelectStage('practice-session')}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500 space-y-1"
                >
                  <Target className="w-5 h-5 text-indigo-400 mx-auto" />
                  <span className="block font-bold text-slate-200 text-[10px]">Practice</span>
                </button>

                <button
                  onClick={() => onSelectStage('interview')}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500 space-y-1"
                >
                  <Mic className="w-5 h-5 text-purple-400 mx-auto" />
                  <span className="block font-bold text-slate-200 text-[10px]">Interview</span>
                </button>

                <button
                  onClick={() => onSelectStage('study-plan')}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500 space-y-1"
                >
                  <Calendar className="w-5 h-5 text-cyan-400 mx-auto" />
                  <span className="block font-bold text-slate-200 text-[10px]">Study Plan</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Mobile Tab Bar */}
          <div className="border-t border-slate-800/80 pt-2 flex items-center justify-around text-[10px] font-bold text-slate-400">
            <button onClick={() => onSelectStage('dashboard')} className="text-indigo-400 flex flex-col items-center">
              <BarChart2 className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button onClick={() => onSelectStage('practice-session')} className="hover:text-white flex flex-col items-center">
              <Target className="w-4 h-4" />
              <span>Practice</span>
            </button>
            <button onClick={() => onSelectStage('interview')} className="hover:text-white flex flex-col items-center">
              <Mic className="w-4 h-4" />
              <span>Interview</span>
            </button>
            <button onClick={() => onSelectStage('profile')} className="hover:text-white flex flex-col items-center">
              <Star className="w-4 h-4" />
              <span>Profile</span>
            </button>
          </div>
        </div>

        {/* Phone Mockup 2: Analytics & Topic Wise Accuracy */}
        <div className="w-[320px] sm:w-[350px] h-[640px] bg-[#0A0E1A] rounded-[48px] border-[10px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between p-5 space-y-4 font-sans select-none ring-1 ring-slate-700">
          {/* Top Speaker Notch */}
          <div className="w-28 h-4 bg-slate-800 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-20" />

          <div className="pt-4 space-y-4 overflow-y-auto pr-1">
            <div className="space-y-1">
              <p className="text-xs font-extrabold text-white">Performance Analytics</p>
              <p className="text-[11px] text-slate-400">Overall Accuracy: <strong className="text-emerald-400">82%</strong></p>
            </div>

            {/* Overall Accuracy Card */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">Topic Wise Accuracy</span>
                <span className="text-emerald-400 text-[10px] font-bold">↑ 12%</span>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-300">DSA</span>
                    <span className="text-indigo-400 font-bold">75%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: '75%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-300">System Design</span>
                    <span className="text-blue-400 font-bold">60%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '60%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-300">DBMS</span>
                    <span className="text-cyan-400 font-bold">72%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-cyan-500" style={{ width: '72%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-300">OOPs</span>
                    <span className="text-purple-400 font-bold">80%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: '80%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-300">Computer Networks</span>
                    <span className="text-pink-400 font-bold">65%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-pink-500" style={{ width: '65%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Mobile Tab Bar */}
          <div className="border-t border-slate-800/80 pt-2 flex items-center justify-around text-[10px] font-bold text-slate-400">
            <button onClick={() => onSelectStage('dashboard')} className="hover:text-white flex flex-col items-center">
              <BarChart2 className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button onClick={() => onSelectStage('practice-session')} className="hover:text-white flex flex-col items-center">
              <Target className="w-4 h-4" />
              <span>Practice</span>
            </button>

            <button onClick={() => onSelectStage('interview')} className="hover:text-white flex flex-col items-center">
              <Mic className="w-4 h-4" />
              <span>Interview</span>
            </button>
            <button onClick={() => onSelectStage('profile')} className="text-indigo-400 flex flex-col items-center">
              <Star className="w-4 h-4" />
              <span>Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
