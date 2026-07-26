import React from 'react';
import { AppStage } from '../types';
import {
  Brain,
  Sparkles,
  Play,
  CheckCircle2,
  Users,
  Target,
  Award,
  BookOpen,
  ArrowRight,
  Bot,
  Zap,
  Star,
  TrendingUp,
  ShieldCheck,
  User
} from 'lucide-react';

interface LandingViewProps {
  onStartLearning: () => void;
  onSelectStage: (stage: AppStage) => void;
  onLoginWithDetails?: (email: string, password?: string) => void;
}

export function LandingView({ onStartLearning, onSelectStage, onLoginWithDetails }: LandingViewProps) {
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [showAboutModal, setShowAboutModal] = React.useState(false);
  const [showContactModal, setShowContactModal] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<'login' | 'signup'>('login');
  const [loginEmail, setLoginEmail] = React.useState('');
  const [loginPassword, setLoginPassword] = React.useState('');

  const handleOpenLogin = (mode: 'login' | 'signup') => {
    setModalMode(mode);
    setLoginEmail('');
    setLoginPassword('');
    setShowLoginModal(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowLoginModal(false);
    if (modalMode === 'signup') {
      onStartLearning();
    } else if (onLoginWithDetails) {
      onLoginWithDetails(loginEmail, loginPassword);
    } else {
      onStartLearning();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-slate-100 flex flex-col justify-between overflow-x-hidden font-sans relative">
      {/* Top Header Navbar */}
      <header className="border-b border-slate-800/80 bg-[#0D111D]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/30">
              <div className="w-full h-full bg-[#0D111D] rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl text-white tracking-tight">PrepPilot</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-indigo-500 text-white">AI</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <button onClick={() => onSelectStage('dashboard')} className="hover:text-white transition-colors">Home Portal</button>
            <button onClick={() => setShowAboutModal(true)} className="hover:text-white transition-colors">About</button>
            <button onClick={() => setShowContactModal(true)} className="hover:text-white transition-colors">Contact</button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenLogin('login')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            >
              Log in
            </button>
            <button
              onClick={() => handleOpenLogin('signup')}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
            >
              Sign up
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Hero Copy */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>✨ Your Personal AI Study & Interview Coach</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-none tracking-tight">
            Learn Smarter. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300">
              Interview Better.
            </span> <br />
            Succeed Faster.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl font-normal">
            AI-powered platform that generates personalized practice questions, evaluates every test attempt, estimates weak topics exactly, and adapts learning for every student.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => handleOpenLogin('signup')}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleOpenLogin('login')}
              className="px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-bold text-sm flex items-center gap-2.5 transition-all"
            >
              <User className="w-4 h-4 text-indigo-400" />
              <span>Log In to Dashboard</span>
            </button>
          </div>

          {/* Key Advantage Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>AI Generated Questions</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Zap className="w-4 h-4 text-purple-400" />
              <span>Instant AI Evaluation</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Exact Weak Topic Analysis</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Track Test Performances</span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Brain Diagram & Process Flow Card */}
        <div className="lg:col-span-5 relative">
          <div className="relative p-6 rounded-3xl bg-gradient-to-b from-[#13182A] to-[#0D111D] border border-indigo-500/30 shadow-2xl shadow-indigo-950/80 overflow-hidden">
            {/* Glowing Backdrop Mesh */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />

            {/* AI Brain Visual Illustration Box */}
            <div className="relative z-10 flex flex-col items-center text-center p-6 mb-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="relative w-28 h-28 mb-3 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-600 to-cyan-400 animate-pulse blur-md opacity-60" />
                <div className="relative w-24 h-24 rounded-full bg-[#0D111D] border border-indigo-400/40 flex items-center justify-center shadow-xl">
                  <Brain className="w-12 h-12 text-indigo-400" />
                  <span className="absolute text-[11px] font-black tracking-widest text-white bg-indigo-600 px-2 py-0.5 rounded-full shadow-lg">AI</span>
                </div>
              </div>
              <p className="text-xs font-bold text-white">Adaptive Evaluation Engine</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Real-time AI evaluation for every test attempt</p>
            </div>

            {/* Process Steps Diagram */}
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs font-bold text-indigo-200 shadow-md">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs">1</div>
                <span>Select Subject & Practice Questions</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs font-bold text-purple-200 shadow-md">
                <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white text-xs">2</div>
                <span>AI Evaluation For Every Attempt</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs font-bold text-amber-200 shadow-md">
                <div className="w-7 h-7 rounded-lg bg-amber-600 flex items-center justify-center text-white text-xs">3</div>
                <span>Target Weak Topics & Master Concepts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Counter Section */}
      <div className="border-y border-slate-800/80 bg-[#0D111D]/80">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-white">10K+</p>
            <p className="text-xs font-medium text-slate-400">Active Learners</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-indigo-400">50K+</p>
            <p className="text-xs font-medium text-slate-400">Questions Evaluated</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-purple-400">95%</p>
            <p className="text-xs font-medium text-slate-400">Satisfaction Rate</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-cyan-400">100+</p>
            <p className="text-xs font-medium text-slate-400">Topics Covered</p>
          </div>
        </div>
      </div>

      {/* Bottom Feature Pill Row */}
      <footer className="bg-[#070A12] py-6 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-300">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
            <Brain className="w-4 h-4 text-purple-400" />
            <span>AI Powered Smart Learning</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Personalized Profile Setup</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
            <Target className="w-4 h-4 text-indigo-400" />
            <span>Exact Weak Topic Analysis</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Track Past Performances</span>
          </div>
        </div>
      </footer>

      {/* Login / Sign Up Details Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0D111D] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
                <Brain className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white">
                {modalMode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
              </h2>
              <p className="text-xs text-slate-400">
                {modalMode === 'login'
                  ? 'Enter your credentials to access your profile and past test evaluations.'
                  : 'Sign up to create your profile and start AI-evaluated practice.'}
              </p>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. student@example.com"
                  className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-300">Password</label>
                  {modalMode === 'login' && (
                    <span className="text-[11px] text-indigo-400 hover:underline cursor-pointer">
                      Forgot Password?
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end text-[11px]">
                <button
                  type="button"
                  onClick={() => setModalMode(modalMode === 'login' ? 'signup' : 'login')}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  {modalMode === 'login' ? "New user? Sign up & setup profile" : 'Already have an account? Log in'}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 transition-all"
              >
                {modalMode === 'login' ? 'Log In to Dashboard' : 'Continue to Profile Setup →'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* About PrepPilot AI Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-sans">
          <div className="w-full max-w-lg bg-[#0D111D] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setShowAboutModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 text-sm font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">About PrepPilot AI</h2>
                <p className="text-xs text-slate-400">Personalized AI Learning & Evaluation Platform</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">PrepPilot AI</strong> is an intelligent learning and evaluation assistant built to help engineering students, campus candidates, and job seekers master technical topics and excel in placement interviews.
              </p>

              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
                <h3 className="font-extrabold text-indigo-300 text-xs">✨ Key Core Pillars</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li><strong>Profile Setup First:</strong> Simple student profile onboarding without premature topic selection.</li>
                  <li><strong>Practice Section Topic Picker:</strong> Choose subject, topic & difficulty whenever you start a practice test.</li>
                  <li><strong>Instant AI Evaluation:</strong> Complete answer breakdowns, accuracy scoring & mathematical consistency.</li>
                  <li><strong>Weak Topic Estimation:</strong> Automatic identification of weak areas based on missed test questions.</li>
                </ul>
              </div>

              <p className="text-slate-400 text-[11px]">
                Powered by cutting-edge Gemini models to deliver real-time adaptive feedback on every attempt.
              </p>
            </div>

            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Contact & Support Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-sans">
          <div className="w-full max-w-lg bg-[#0D111D] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 text-sm font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Contact & Support</h2>
                <p className="text-xs text-slate-400">Get in touch with the PrepPilot AI Team</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <p className="font-extrabold text-white">📧 General Support & Inquiries</p>
                <p className="text-indigo-400 font-semibold">support@preppilot.ai</p>
                <p className="text-slate-400 text-[11px]">Responses within 24 hours for all active users.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <p className="font-extrabold text-white">🏫 College & Campus Partnerships</p>
                <p className="text-purple-400 font-semibold">campus@preppilot.ai</p>
                <p className="text-slate-400 text-[11px]">For university placement cell integrations & bulk student access.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <p className="font-extrabold text-white">💡 Feedback & Bug Reports</p>
                <p className="text-emerald-400 font-semibold">feedback@preppilot.ai</p>
                <p className="text-slate-400 text-[11px]">We continuously update our AI evaluation based on user input.</p>
              </div>
            </div>

            <button
              onClick={() => setShowContactModal(false)}
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
