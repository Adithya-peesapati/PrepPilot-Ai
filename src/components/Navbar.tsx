import React, { useState } from 'react';
import { AppStage, Theme } from '../types';
import {
  Rocket,
  Moon,
  Sun,
  Zap,
  Menu,
  X,
  User,
  BarChart3,
  BookOpen,
  Target,
  Brain,
  PlusCircle,
  RefreshCw
} from 'lucide-react';

interface NavbarProps {
  currentStage: AppStage;
  onSelectStage: (stage: AppStage) => void;
  theme: Theme;
  onToggleTheme: () => void;
  userXp: number;
  userName?: string;
  onResetProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStage,
  onSelectStage,
  theme,
  onToggleTheme,
  userXp,
  userName,
  onResetProfile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: AppStage; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'practice-session', label: 'Practice Test', icon: <Target className="w-4 h-4" /> },
    { id: 'interview', label: 'AI Interview', icon: <Brain className="w-4 h-4" /> },
    { id: 'study-plan', label: 'Study Plan', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#050816]/80 backdrop-blur-xl border-b border-white/10 transition-colors">
      <nav className="max-w-[1440px] mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onSelectStage(userName ? 'dashboard' : 'onboarding-profile')}
          className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-indigo-300 hover:opacity-90 transition-opacity"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Rocket className="w-5 h-5" />
          </div>
          <span>PrepPilot AI</span>
        </button>

        {/* Desktop Nav Items (When Profile Exists) */}
        {userName && (
          <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1.5 rounded-full border border-white/10">
            {navItems.map((item) => {
              const isActive = currentStage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectStage(item.id)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Right Utility Bar */}
        <div className="flex items-center gap-3">
          {/* User XP Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-bold shadow-sm">
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{userXp.toLocaleString()} XP</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* User Badge or New Profile Reset */}
          {userName ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onResetProfile}
                title="Create New Profile / Reset Goal"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-semibold"
              >
                <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>New Goal</span>
              </button>

              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-extrabold text-white border border-white/20">
                {(userName || 'User').substring(0, 2).toUpperCase()}
              </div>
            </div>
          ) : (
            <button
              onClick={() => onSelectStage('onboarding-profile')}
              className="px-4 py-1.5 rounded-full bg-indigo-600 text-white font-bold text-xs"
            >
              Get Started
            </button>
          )}

          {/* Mobile Menu Toggle */}
          {userName && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && userName && (
        <div className="lg:hidden bg-[#0a0d1d] border-b border-white/10 px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectStage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  currentStage === item.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onResetProfile();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Profile & Set New Goal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

