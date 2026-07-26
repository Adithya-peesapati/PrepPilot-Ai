import React, { useState } from 'react';
import { SessionEvaluationReport } from '../types';
import {
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Share2,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Zap,
  Star,
  RefreshCw,
  BookOpen,
  Check,
  HelpCircle
} from 'lucide-react';

interface EvaluationReportViewProps {
  evaluation: SessionEvaluationReport | null;
  onProceedToDashboard: () => void;
  onStartNewSession: () => void;
}

export const EvaluationReportView: React.FC<EvaluationReportViewProps> = ({
  evaluation,
  onProceedToDashboard,
  onStartNewSession,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'correct' | 'incorrect'>('all');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const overallScore = evaluation?.overallScore ?? 85;
  const accuracy = evaluation?.accuracyPercentage ?? 80;
  const individualFeedbacks = evaluation?.individualFeedbacks || [];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My PrepPilot AI Test Evaluation',
        text: `I scored ${overallScore}/100 on my ${evaluation?.subject || 'Practice'} test with PrepPilot AI!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert('Copied test evaluation link to clipboard!');
    }
  };

  const filteredFeedbacks = individualFeedbacks.filter((fb) => {
    if (filterMode === 'correct') return fb.isCorrect || fb.score >= 70;
    if (filterMode === 'incorrect') return !fb.isCorrect || fb.score < 70;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 p-4 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
              {evaluation?.subject || 'Practice Session'}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
              {evaluation?.difficulty || 'Medium'} Difficulty
            </span>
            <span className="text-slate-500 text-xs">
              {evaluation?.timestamp ? new Date(evaluation.timestamp).toLocaleDateString() : 'Just Now'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            AI Test Performance Evaluation
          </h1>
          <p className="text-xs text-slate-400">Detailed question-by-question breakdown, explanations & weak topic estimation</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all flex-1 sm:flex-initial"
          >
            <Share2 className="w-4 h-4 text-indigo-400" />
            <span>Share Report</span>
          </button>
          <button
            onClick={onProceedToDashboard}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 flex-1 sm:flex-initial"
          >
            <span>Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Score Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Overall Score Ring & Grade */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-[#12172A] to-[#0D111D] border border-indigo-500/30 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Overall Evaluation Grade</span>
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              overallScore >= 80
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : overallScore >= 60
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
            }`}>
              {overallScore >= 80 ? 'Excellent! 🌟' : overallScore >= 60 ? 'Good Effort 👍' : 'Needs Review ⚠️'}
            </span>
          </div>

          <div className="flex items-center gap-6 p-4 rounded-2xl bg-[#070A12]/80 border border-slate-800">
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-600 to-cyan-400 p-1 flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0">
              <div className="w-full h-full bg-[#0D111D] rounded-full flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-white leading-none">{overallScore}</span>
                <span className="text-[10px] font-bold text-slate-400">/ 100</span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-black text-white text-lg">{overallScore}/100 Score</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Accuracy: <strong className="text-indigo-400">{accuracy}%</strong>. Solved {individualFeedbacks.filter(f => f.isCorrect || f.score >= 70).length} of {individualFeedbacks.length} questions correctly.
              </p>
            </div>
          </div>

          {/* Submetrics */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Technical</span>
              <span className="font-black text-indigo-400 text-sm">{evaluation?.technicalAccuracy ?? 88}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Clarity</span>
              <span className="font-black text-purple-400 text-sm">{evaluation?.grammarCommunication ?? 85}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Confidence</span>
              <span className="font-black text-cyan-400 text-sm">{evaluation?.confidenceLevel ?? 90}%</span>
            </div>
          </div>
        </div>

        {/* Strengths & Estimated Weak Topics */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0D111D] border border-slate-800/80 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-extrabold text-white text-base">Key Performance Insights</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Strong Topics & Concepts
                </span>
                <ul className="space-y-1 text-xs text-emerald-200">
                  {(evaluation?.strengths || ['Good core understanding', 'Accurate logical deductions']).map((st, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exact Weak Topics Estimated */}
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                <span className="font-bold text-rose-400 text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Estimated Weak Topics
                </span>
                <ul className="space-y-1 text-xs text-rose-200">
                  {(evaluation?.weakAreas || ['Edge cases & corner cases', 'Asymptotic space complexity']).map((wk, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-400 mt-0.5">•</span>
                      <span>{wk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onStartNewSession}
              className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4 text-indigo-400" />
              <span>Take Another Test</span>
            </button>
            <button
              onClick={onProceedToDashboard}
              className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Itemized Question-by-Question Review for EVERY Question */}
      <div className="p-6 rounded-3xl bg-[#0D111D] border border-slate-800/80 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Full Test Review ({individualFeedbacks.length} Questions)</span>
            </h3>
            <p className="text-xs text-slate-400">Detailed answers, correct solutions, and AI explanations for every question</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                filterMode === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({individualFeedbacks.length})
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                filterMode === 'correct' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Correct ({individualFeedbacks.filter((f) => f.isCorrect || f.score >= 70).length})
            </button>
            <button
              onClick={() => setFilterMode('incorrect')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                filterMode === 'incorrect' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Missed ({individualFeedbacks.filter((f) => !f.isCorrect && f.score < 70).length})
            </button>
          </div>
        </div>

        {/* Question Cards List */}
        <div className="space-y-4">
          {filteredFeedbacks.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-semibold">
              No questions matched the selected filter mode.
            </div>
          ) : (
            filteredFeedbacks.map((fb, idx) => {
              const isPassed = fb.isCorrect || fb.score >= 70;
              const isExpanded = expandedQuestion === fb.questionId || expandedQuestion === null;

              return (
                <div
                  key={fb.questionId || idx}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isPassed
                      ? 'bg-slate-900/60 border-slate-800/80 hover:border-emerald-500/40'
                      : 'bg-rose-950/10 border-rose-500/30 hover:border-rose-500/60'
                  }`}
                >
                  {/* Card Header Bar */}
                  <div
                    onClick={() => setExpandedQuestion(expandedQuestion === fb.questionId ? '' : fb.questionId)}
                    className="p-4 flex items-center justify-between cursor-pointer select-none bg-slate-900/40 hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                        isPassed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        Q{fb.questionNumber || idx + 1}
                      </div>

                      <div>
                        <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                          <span>{fb.questionTitle || `Question #${idx + 1}`}</span>
                          {isPassed ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" /> Correct
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                              <XCircle className="w-3 h-3" /> Missed
                            </span>
                          )}
                        </h4>
                        <p className="text-[11px] text-slate-400">Score: <strong className={isPassed ? 'text-emerald-400' : 'text-rose-400'}>{fb.score}/100</strong></p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-indigo-400 font-bold hidden sm:inline">
                        {expandedQuestion === fb.questionId ? 'Hide Details' : 'View Explanation'}
                      </span>
                      {expandedQuestion === fb.questionId ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Card Details */}
                  {isExpanded && (
                    <div className="p-5 border-t border-slate-800/80 space-y-4 text-xs font-sans">
                      {/* Your Answer vs Correct Answer Comparison */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Student Submitted Answer */}
                        <div className="p-3.5 rounded-xl bg-[#070A12] border border-slate-800 space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" /> Your Submitted Response:
                          </span>
                          <div className={`p-2.5 rounded-lg font-mono text-xs leading-relaxed ${
                            isPassed ? 'bg-emerald-950/20 text-emerald-200 border border-emerald-500/20' : 'bg-rose-950/20 text-rose-200 border border-rose-500/20'
                          }`}>
                            {fb.userAnswer || 'No response recorded.'}
                          </div>
                        </div>

                        {/* Model / Textbook Solution */}
                        <div className="p-3.5 rounded-xl bg-[#070A12] border border-slate-800 space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Ideal Model Solution:
                          </span>
                          <div className="p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-500/20 text-indigo-100 font-mono text-xs leading-relaxed">
                            {fb.correctAnswer || 'Optimal solution addresses fundamental constraints and edge cases accurately.'}
                          </div>
                        </div>
                      </div>

                      {/* AI Detailed Explanation */}
                      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                        <span className="font-bold text-indigo-300 flex items-center gap-1.5 text-xs">
                          <Sparkles className="w-4 h-4 text-indigo-400" /> AI Conceptual Breakdown & Explanation:
                        </span>
                        <p className="text-slate-200 leading-relaxed text-xs">
                          {fb.detailedExplanation}
                        </p>
                      </div>

                      {/* Actionable Improvement Tip */}
                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                        <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                          <Zap className="w-3.5 h-3.5 text-amber-400" /> Actionable Improvement Tip:
                        </span>
                        <p className="text-amber-100 text-xs">
                          {fb.improvementSuggestion || 'Focus on explicitly verifying array boundary conditions and edge cases.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
