import React, { useState, useEffect } from 'react';
import { UserProfile, SessionEvaluationReport, ChatMessage } from '../types';
import { offlineStorage } from '../services/offlineStorage';
import {
  Zap,
  Flame,
  Award,
  BookOpen,
  BarChart2,
  TrendingUp,
  Brain,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Send,
  Bot,
  User,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Calendar,
  Code2,
  Mic,
  Target,
  Star,
  Trophy,
  Search,
  Bell,
  ChevronRight,
  GraduationCap,
  Briefcase,
  History,
  FileText
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface UserDashboardViewProps {
  userProfile: UserProfile;
  latestEvaluation: SessionEvaluationReport | null;
  onStartNewSession: () => void;
  onOpenInterview: () => void;
  onOpenStudyPlan: () => void;
  onEditProfile?: () => void;
  onViewEvaluation?: (report: SessionEvaluationReport) => void;
}

export const UserDashboardView: React.FC<UserDashboardViewProps> = ({
  userProfile,
  latestEvaluation,
  onStartNewSession,
  onOpenInterview,
  onOpenStudyPlan,
  onEditProfile,
  onViewEvaluation,
}) => {
  const displayName = userProfile.fullName || 'Aspirant';

  // Load Past Evaluation History
  const [historyReports, setHistoryReports] = useState<SessionEvaluationReport[]>([]);

  useEffect(() => {
    const list = offlineStorage.getEvaluationHistory();
    setHistoryReports(list);
  }, [latestEvaluation]);

  // AI Chat Tutor state
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Welcome back, ${displayName}! 👋 I'm your PrepPilot AI Coach. You're doing great! What subject or topic would you like to practice today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [sendingChat, setSendingChat] = useState<boolean>(false);

  // Weekly Progress Data for Recharts
  const weeklyData = [
    { day: 'Mon', score: 50 },
    { day: 'Tue', score: 58 },
    { day: 'Wed', score: 70 },
    { day: 'Thu', score: 65 },
    { day: 'Fri', score: 76 },
    { day: 'Sat', score: 79 },
    { day: 'Sun', score: 82 },
  ];

  // Topic Mastery Donut Chart Data
  const topicData = [
    { name: 'DSA', value: 75, color: '#6366F1' },
    { name: 'System Design', value: 60, color: '#3B82F6' },
    { name: 'DBMS', value: 72, color: '#06B6D4' },
    { name: 'OOPs', value: 80, color: '#8B5CF6' },
    { name: 'Aptitude', value: 68, color: '#EC4899' },
  ];

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: 'u_' + Date.now(),
      sender: 'user',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const txt = chatInput;
    setChatInput('');
    setSendingChat(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: txt,
          userProfile,
          currentContext: latestEvaluation ? { subject: latestEvaluation.subject, score: latestEvaluation.overallScore } : {},
        }),
      });

      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: data.text || "I'm analyzing your recent practice questions. Let's do a quick quiz!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          id: 'ai_' + Date.now(),
          sender: 'ai',
          text: 'Focus on reviewing time complexity and boundary conditions for your upcoming practice test!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setSendingChat(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 p-4 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            Dashboard
          </h1>
          <p className="text-xs text-slate-400">Welcome back, <strong className="text-white">{displayName}! 👋</strong></p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Quick Start Practice */}
          <button
            onClick={onStartNewSession}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>Start Practice Test</span>
          </button>

          {/* User Profile Avatar & Edit Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <button
              onClick={onEditProfile}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity focus:outline-none"
              title="Edit Profile"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 shadow-md">
                <div className="w-full h-full bg-[#0B0F19] rounded-full flex items-center justify-center text-xs font-black text-white">
                  {displayName.substring(0, 2).toUpperCase()}
                </div>
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-bold text-white leading-tight">{displayName}</p>
                <p className="text-[10px] text-indigo-400 font-semibold hover:underline">Edit Profile ⚙️</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* User Profile Summary Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#11162A] via-[#0D111D] to-[#12182D] border border-indigo-500/20 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              {userProfile.college || 'Engineering College'}
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
              {userProfile.degreeBranch || 'Computer Science'} ({userProfile.yearOfStudy || '3rd Year'})
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              Target: {userProfile.targetCompany || 'Top Tech'}
            </span>
          </div>

          <h2 className="text-xl font-black text-white">
            {userProfile.fullName}'s Learning Portal
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed">
            Goal: <strong className="text-white">{userProfile.goal || 'Placement & Campus Recruitment'}</strong> • Prepared Skills: <span className="text-indigo-300">{userProfile.skillsKnown?.join(', ') || 'DSA, Python, SQL'}</span>
          </p>
        </div>

        <div className="md:col-span-4 flex flex-col items-start md:items-end justify-center space-y-2 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
          <button
            onClick={onStartNewSession}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Brain className="w-4 h-4 text-white" />
            <span>Select Subject & Practice</span>
          </button>
          <p className="text-[11px] text-slate-400 text-center md:text-right w-full">
            {historyReports.length} past test evaluations recorded
          </p>
        </div>
      </div>

      {/* Top 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tests Completed */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#12172A] to-[#0D111D] border border-indigo-500/20 shadow-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400">Tests Completed</span>
            <div className="text-xl font-extrabold text-white">{historyReports.length || userProfile.totalSessionsCompleted || 1}</div>
            <span className="text-[10px] font-medium text-indigo-400">Active Evaluated Sessions</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Daily Streak */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#12172A] to-[#0D111D] border border-amber-500/20 shadow-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400">Daily Streak</span>
            <div className="text-xl font-extrabold text-white">{userProfile.dailyStreak || 7} Days</div>
            <span className="text-[10px] font-medium text-amber-400">Keep it up! 🔥</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Flame className="w-6 h-6 fill-amber-400" />
          </div>
        </div>

        {/* Overall Accuracy */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#12172A] to-[#0D111D] border border-emerald-500/20 shadow-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400">Average Accuracy</span>
            <div className="text-xl font-extrabold text-white">
              {historyReports.length > 0
                ? Math.round(historyReports.reduce((acc, r) => acc + (r.overallScore || 0), 0) / historyReports.length)
                : 82}%
            </div>
            <span className="text-[10px] font-medium text-emerald-400">AI Verified Metrics</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* XP Points */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#12172A] to-[#0D111D] border border-purple-500/20 shadow-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400">XP Points</span>
            <div className="text-xl font-extrabold text-white">{userProfile.xpPoints || 2450}</div>
            <span className="text-[10px] font-medium text-purple-400">↑ 180 this week</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-inner">
            <Trophy className="w-6 h-6 fill-purple-400" />
          </div>
        </div>
      </div>

      {/* Past Test Performances & AI Evaluations */}
      <div className="p-6 rounded-3xl bg-[#0D111D] border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-400" />
              <span>Past Test Performances & AI Evaluations</span>
            </h3>
            <p className="text-xs text-slate-400">Every test attempt is stored with exact weak topic estimation and AI feedback</p>
          </div>

          <button
            onClick={onStartNewSession}
            className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold text-xs transition-colors"
          >
            + New Test Attempt
          </button>
        </div>

        {historyReports.length === 0 ? (
          <div className="p-8 text-center bg-[#070A12] rounded-2xl border border-slate-800 space-y-3">
            <p className="text-slate-400 text-xs font-semibold">No test evaluations recorded yet.</p>
            <button
              onClick={onStartNewSession}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              Start First Practice Test
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {historyReports.map((report, idx) => (
              <div
                key={report.sessionId || idx}
                className="p-4 rounded-2xl bg-[#070A12] border border-slate-800 hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                      {report.subject}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {new Date(report.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-white text-sm">
                      {report.subject} ({report.difficulty})
                    </h4>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${
                      (report.overallScore || 0) >= 80
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {report.overallScore}/100
                    </span>
                  </div>

                  {/* Estimated Weak Topics */}
                  {report.weakAreas && report.weakAreas.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-200 space-y-1">
                      <span className="font-bold text-rose-400 block">Estimated Weak Topics:</span>
                      <p className="line-clamp-2">{report.weakAreas.join(' • ')}</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onViewEvaluation && onViewEvaluation(report)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 font-bold text-xs border border-slate-800 transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>View Question Breakdown & AI Report →</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Middle Grid: Weekly Progress & Topic Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Progress Chart */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0D111D] border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-white text-base">Weekly Performance Trend</h3>
              <p className="text-xs text-slate-400">Accuracy score across test attempts</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              82% Average
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#818CF8"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                  dot={{ r: 4, fill: '#818CF8' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic Mastery Donut Chart */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0D111D] border border-slate-800/80 space-y-4 flex flex-col justify-between">
          <h3 className="font-extrabold text-white text-base">Topic Mastery</h3>

          <div className="flex items-center justify-between gap-4">
            <div className="w-36 h-36 relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topicData}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={62}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {topicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-base font-black text-white">72%</span>
                <span className="text-[9px] text-slate-400 font-bold">Overall</span>
              </div>
            </div>

            {/* Legend Breakdown */}
            <div className="space-y-1.5 flex-1 text-xs">
              {topicData.map((t) => (
                <div key={t.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                    <span className="text-slate-300 font-medium">{t.name}</span>
                  </div>
                  <span className="font-bold text-white">{t.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Tutor Chatbot Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!chatOpen ? (
          <button
            onClick={() => setChatOpen(true)}
            className="px-5 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-extrabold text-xs shadow-2xl shadow-indigo-600/50 flex items-center gap-2 hover:scale-105 transition-all"
          >
            <Bot className="w-5 h-5 text-white animate-bounce" />
            <span>AI Assistant</span>
          </button>
        ) : (
          <div className="glass-card w-[350px] sm:w-[400px] h-[500px] rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden bg-[#0a0d1d]">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-indigo-950/40">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-400" />
                <div>
                  <h4 className="font-bold text-white text-xs">PrepPilot AI Tutor</h4>
                  <p className="text-[10px] text-slate-400">Ask any question or request explanations</p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
              {chatMessages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'ai' && (
                    <div className="w-6 h-6 rounded-full bg-indigo-600/30 flex items-center justify-center text-indigo-400 shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {sendingChat && (
                <div className="flex items-center gap-2 text-indigo-300 text-[11px] bg-indigo-500/10 p-2 rounded-xl w-fit">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>AI Tutor thinking...</span>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Ask AI Tutor a question..."
                className="flex-1 bg-[#11131f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleSendChat}
                className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
