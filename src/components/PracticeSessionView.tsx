import React, { useState, useEffect } from 'react';
import { DynamicQuestion, UserProfile, SubjectSelection } from '../types';
import {
  Clock,
  Mic,
  Sparkles,
  ArrowLeft,
  HelpCircle,
  Code2,
  Pause,
  Bookmark,
  CheckCircle,
  Save,
  ArrowRight,
  Send,
  RotateCcw
} from 'lucide-react';

interface PracticeSessionViewProps {
  userProfile: UserProfile;
  selection: SubjectSelection;
  questions: DynamicQuestion[];
  loadingQuestions: boolean;
  onSubmitSession: (answers: Record<string, string>) => void;
  onBackToOnboarding: () => void;
  onChangeTopicHub?: () => void;
}

function getCodeForQuestion(q: DynamicQuestion): string {
  if (q.codeSnippet) return q.codeSnippet;

  const title = (q.title || '').toLowerCase();
  const stmt = (q.problemStatement || '').toLowerCase();

  if (title.includes('pointer') || stmt.includes('pointer')) {
    return `def twoPointers(arr, target):\n    left, right = 0, len(arr) - 1\n    while left < right:\n        s = arr[left] + arr[right]\n        if s == target: return True\n        elif s < target: left += 1\n        else: right -= 1\n    return False`;
  }
  if (title.includes('binary search') || stmt.includes('binary search')) {
    return `int search(int[] nums, int target) {\n    int low = 0, high = nums.length - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`;
  }
  if (title.includes('list') || stmt.includes('node') || stmt.includes('head')) {
    return `ListNode* reverseList(ListNode* head) {\n    ListNode *prev = nullptr, *curr = head;\n    while (curr) {\n        ListNode* nextTemp = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = nextTemp;\n    }\n    return prev;\n}`;
  }
  if (title.includes('stack') || title.includes('queue')) {
    return `function checkBalanced(str) {\n    let stack = [];\n    for (let char of str) {\n        if (char === '(') stack.push(')');\n        else if (stack.pop() !== char) return false;\n    }\n    return stack.length === 0;\n}`;
  }
  if (title.includes('tree') || title.includes('depth')) {
    return `def maxDepth(root):\n    if not root: return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))`;
  }
  if (title.includes('knapsack') || title.includes('dp') || title.includes('dynamic')) {
    return `def fib(n, memo={}):\n    if n in memo: return memo[n]\n    if n <= 2: return 1\n    memo[n] = fib(n-1, memo) + fib(n-2, memo)\n    return memo[n]`;
  }

  return `// Question #${q.number || 1} [${q.title || 'Code Scenario'}]\nfunction evaluateQuestionScenario(qNum) {\n    let inputSet = [${q.number * 3}, ${q.number * 7}, ${q.number * 12}];\n    let processed = inputSet.filter(x => x % 2 === 0);\n    return processed;\n}`;
}

export const PracticeSessionView: React.FC<PracticeSessionViewProps> = ({
  userProfile,
  selection,
  questions,
  loadingQuestions,
  onSubmitSession,
  onBackToOnboarding,
  onChangeTopicHub,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [reviewedQuestions, setReviewedQuestions] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [answerMode, setAnswerMode] = useState<'text' | 'voice'>('text');
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const targetQuestionCount = selection?.difficulty === 'Easy' ? 20 : selection?.difficulty === 'Hard' ? 10 : 15;

  // Timer effect
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const currentQ = questions[currentIndex] || questions[0];
  const isLastQuestion = currentIndex === questions.length - 1;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, optionLetter: string, optionText: string) => {
    setSelectedOptions((prev) => ({ ...prev, [questionId]: optionLetter }));
    setUserAnswers((prev) => ({ ...prev, [questionId]: `Option ${optionLetter}: ${optionText}` }));
  };

  // Actions
  const handleSaveAndNext = () => {
    // Save current state, unmark review if user wants save&next directly
    setReviewedQuestions((prev) => ({ ...prev, [currentQ.id]: false }));
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleReviewAndNext = () => {
    // Mark as yellow reviewed question and move next
    setReviewedQuestions((prev) => ({ ...prev, [currentQ.id]: true }));
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSaveAndSubmit = () => {
    onSubmitSession(userAnswers);
  };

  const handleReviewAndSubmit = () => {
    setReviewedQuestions((prev) => ({ ...prev, [currentQ.id]: true }));
    onSubmitSession(userAnswers);
  };

  if (loadingQuestions || questions.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-6 font-sans">
        <div className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 relative">
          <Sparkles className="w-10 h-10 animate-spin text-indigo-400" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-2xl font-black text-white">
            Generating {targetQuestionCount} {selection?.difficulty || 'Easy'} Questions...
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Gemini AI is tailoring <strong>{targetQuestionCount} practice questions</strong> specifically for{' '}
            <strong className="text-indigo-300">{userProfile?.fullName || 'you'}</strong> in{' '}
            <strong className="text-purple-300">{selection?.subject || 'Data Structures'}</strong>.
          </p>
        </div>
      </div>
    );
  }

  const currentOptions = currentQ.options && currentQ.options.length > 0 ? currentQ.options : [
    { letter: 'A', text: 'Time Complexity O(N) with O(1) auxiliary space' },
    { letter: 'B', text: 'Time Complexity O(N log N) with O(N) space' },
    { letter: 'C', text: 'Time Complexity O(2^N) exponential recursion' },
    { letter: 'D', text: 'Compilation or Runtime error' },
  ];

  const codeSnippet = getCodeForQuestion(currentQ);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 p-4 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              {selection?.subject || 'Practice Mode'}
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                {selection?.difficulty || 'Easy'} Test • {questions.length} Questions
              </span>
            </h1>
            <p className="text-xs text-slate-400">Target Goal: {selection?.goal || 'Placement & Campus Prep'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onChangeTopicHub && (
            <button
              onClick={onChangeTopicHub}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change Topic / Difficulty</span>
            </button>
          )}

          {/* Timer */}
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            title="Pause Timer"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Question Navigation Palette */}
        <div className="lg:col-span-3 p-5 rounded-3xl bg-[#0D111D] border border-slate-800/80 space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-400 font-semibold">Question Palette</span>
              <div className="text-xl font-black text-white">{currentIndex + 1} / {questions.length}</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold">
              {selection?.difficulty || 'Easy'}
            </span>
          </div>

          {/* Question Numbers Grid with Yellow status for Reviewed */}
          <div className="grid grid-cols-5 gap-1.5 max-h-60 overflow-y-auto pr-1">
            {questions.map((q, idx) => {
              const isSelected = idx === currentIndex;
              const isReviewed = Boolean(reviewedQuestions[q.id]);
              const hasAnswer = Boolean(userAnswers[q.id]);

              let btnStyle = 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800';
              if (isReviewed) {
                // YELLOW icon for reviewed questions
                btnStyle = 'bg-amber-400 text-slate-950 font-black border-amber-300 shadow-md shadow-amber-500/20';
              } else if (hasAnswer) {
                btnStyle = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold';
              }

              if (isSelected) {
                btnStyle += ' ring-2 ring-indigo-400 font-black';
              }

              return (
                <button
                  key={q.id || idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-9 rounded-xl text-xs transition-all flex items-center justify-center relative ${btnStyle}`}
                  title={isReviewed ? 'Marked for Review' : hasAnswer ? 'Answered' : 'Unanswered'}
                >
                  {idx + 1}
                  {isReviewed && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-slate-950 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Color Legend */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2 text-[11px]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500/40 border border-emerald-400" />
              <span className="text-slate-300">Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-400 border border-amber-300" />
              <span className="text-amber-300 font-bold">Marked for Review (Yellow)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-slate-900 border border-slate-700" />
              <span className="text-slate-400">Unanswered</span>
            </div>
          </div>

          <button
            onClick={() => onSubmitSession(userAnswers)}
            className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all"
          >
            End Test & Submit
          </button>
        </div>

        {/* Center Main Question Panel */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0D111D] border border-slate-800/80 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">
                Question #{currentIndex + 1}
              </h3>
              {reviewedQuestions[currentQ.id] && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center gap-1">
                  <Bookmark className="w-3 h-3 fill-slate-950" />
                  Marked for Review
                </span>
              )}
            </div>
            <p className="text-sm font-extrabold text-white leading-relaxed">
              {currentQ?.problemStatement || 'What is the output or complexity of the following code?'}
            </p>

            {/* Distinct Code Snippet for EVERY Question */}
            <div className="p-4 rounded-2xl bg-[#070A12] border border-slate-800 font-mono text-xs text-indigo-300 leading-relaxed overflow-x-auto shadow-inner">
              <div className="text-[10px] text-slate-500 mb-2 font-sans font-bold border-b border-slate-800/80 pb-1">
                Code Snippet for Q#{currentIndex + 1}: {currentQ.title}
              </div>
              <pre>{codeSnippet}</pre>
            </div>
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-2.5">
            {currentOptions.map((opt) => {
              const isSelected = selectedOptions[currentQ.id] === opt.letter;
              return (
                <button
                  key={opt.letter}
                  onClick={() => handleSelectOption(currentQ.id, opt.letter, opt.text)}
                  className={`w-full p-3.5 rounded-2xl text-left text-xs font-bold transition-all flex items-center gap-3 border ${
                    isSelected
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                      isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {opt.letter}
                  </span>
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Answer & Control Navigation Panel */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#0D111D] border border-slate-800/80 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Answer Explanation</span>
              <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-bold">
                <button
                  onClick={() => setAnswerMode('text')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    answerMode === 'text' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Text
                </button>
                <button
                  onClick={() => setAnswerMode('voice')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    answerMode === 'voice' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Voice
                </button>
              </div>
            </div>

            {/* Answer Input */}
            {answerMode === 'text' ? (
              <textarea
                rows={6}
                value={userAnswers[currentQ.id] || ''}
                onChange={(e) => setUserAnswers((prev) => ({ ...prev, [currentQ.id]: e.target.value }))}
                placeholder="Type your explanation or reasoning here..."
                className="w-full bg-[#070A12] border border-slate-800 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            ) : (
              <div className="p-6 rounded-2xl bg-[#070A12] border border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto">
                  <Mic className="w-6 h-6 animate-pulse" />
                </div>
                <p className="text-xs text-slate-300 font-bold">Click below to record your voice answer</p>
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold ${
                    isRecording ? 'bg-rose-500 text-white' : 'bg-indigo-600 text-white'
                  }`}
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
              </div>
            )}

            {showHint && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs leading-relaxed">
                <strong className="block text-amber-300 font-bold mb-0.5">💡 Hint:</strong>
                {currentQ.hint || 'Focus on how loop invariants and pointer increments affect runtime bounds.'}
              </div>
            )}
          </div>

          {/* Question Navigation Options specified by user */}
          <div className="space-y-2.5 pt-3 border-t border-slate-800/80">
            {!isLastQuestion ? (
              /* Non-last question options: Save & Next, Review & Next, Previous */
              <div className="space-y-2">
                <button
                  onClick={handleSaveAndNext}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleReviewAndNext}
                  className="w-full py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-extrabold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Mark for Review & Next</span>
                </button>
              </div>
            ) : (
              /* Last question options: Save & Submit Test, Review & Submit */
              <div className="space-y-2">
                <button
                  onClick={handleSaveAndSubmit}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Save & Submit Test</span>
                </button>

                <button
                  onClick={handleReviewAndSubmit}
                  className="w-full py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Mark for Review & Submit</span>
                </button>
              </div>
            )}

            <div className="flex gap-2">
              {currentIndex > 0 && (
                <button
                  onClick={() => setCurrentIndex((prev) => prev - 1)}
                  className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 transition-all flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              )}

              <button
                onClick={() => setShowHint(!showHint)}
                className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 transition-all flex items-center justify-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
