import React from 'react';
import { AppStage } from '../types';
import {
  LayoutDashboard,
  Target,
  Mic,
  Calendar,
  BarChart3,
  AlertTriangle,
  Bookmark,
  Trophy,
  User,
  Settings,
  LogOut,
  Smartphone,
  Globe,
  Brain
} from 'lucide-react';

interface SidebarProps {
  currentStage: AppStage;
  onSelectStage: (stage: AppStage) => void;
  userName: string;
  onResetProfile: () => void;
}

export function Sidebar({ currentStage, onSelectStage, userName, onResetProfile }: SidebarProps) {
  const menuItems: { stage: AppStage; label: string; icon: React.ReactNode; badge?: string }[] = [
    { stage: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { stage: 'practice-topic-hub', label: 'Practice Section', icon: <Target className="w-4 h-4" /> },
    { stage: 'interview', label: 'Interview', icon: <Mic className="w-4 h-4" />, badge: 'AI' },
    { stage: 'study-plan', label: 'Study Plan', icon: <Calendar className="w-4 h-4" /> },
    { stage: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { stage: 'weak-topics', label: 'Weak Topics', icon: <AlertTriangle className="w-4 h-4" />, badge: '3' },
    { stage: 'bookmarks', label: 'Bookmarks', icon: <Bookmark className="w-4 h-4" /> },
    { stage: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
    { stage: 'mobile-view', label: 'Mobile Preview', icon: <Smartphone className="w-4 h-4" /> },
    { stage: 'landing', label: 'Showcase / Hero', icon: <Globe className="w-4 h-4" /> },
    { stage: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { stage: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-[#0D111D] border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0D111D] rounded-[10px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg text-white tracking-tight">PrepPilot</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-indigo-500 text-white">AI</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Smart Interview Coach</p>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = currentStage === item.stage;
            return (
              <button
                key={item.stage}
                onClick={() => onSelectStage(item.stage)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/20 text-white border-l-4 border-indigo-500 shadow-md shadow-indigo-900/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md ${
                      item.badge === 'AI'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-md">
              {(userName || 'Adithya').substring(0, 2).toUpperCase()}
            </div>
            <div className="truncate max-w-[100px]">
              <p className="text-xs font-bold text-white truncate">{userName || 'Adithya'}</p>
              <p className="text-[10px] text-slate-400 truncate">Pro Member</p>
            </div>
          </div>
          <button
            onClick={onResetProfile}
            title="Logout / Switch Profile"
            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
