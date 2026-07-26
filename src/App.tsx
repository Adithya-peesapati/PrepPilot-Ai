import React, { useState, useEffect } from 'react';
import { AppStage, Theme, UserProfile, SubjectSelection, DynamicQuestion, SessionEvaluationReport } from './types';
import { offlineStorage } from './services/offlineStorage';
import { Sidebar } from './components/Sidebar';
import { LandingView } from './components/LandingView';
import { OnboardingFlow } from './components/OnboardingFlow';
import { PracticeSessionView } from './components/PracticeSessionView';
import { PracticeTopicSelection } from './components/PracticeTopicSelection';
import { EditProfileModal } from './components/EditProfileModal';
import { EvaluationReportView } from './components/EvaluationReportView';
import { UserDashboardView } from './components/UserDashboardView';
import { InterviewView } from './components/InterviewView';
import { StudyPlanView } from './components/StudyPlanView';
import { MobileViewMockup } from './components/MobileViewMockup';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart3,
  AlertTriangle,
  Bookmark,
  Trophy,
  User,
  Settings,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Edit3
} from 'lucide-react';

export function App() {
  // Theme State
  const [theme, setTheme] = useState<Theme>(() => offlineStorage.getTheme());

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() =>
    offlineStorage.getUserProfile()
  );

  // Edit Profile Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);

  // App Stage State - Showcase / Hero is ALWAYS the opening page of web or app
  const [appStage, setAppStage] = useState<AppStage>('landing');

  // Subject & Topic Selection
  const [subjectSelection, setSubjectSelection] = useState<SubjectSelection>({
    goal: 'Placement Interviews',
    subject: 'Data Structures & Algorithms',
    unit: 'Arrays & Dynamic Programming',
    difficulty: 'Easy',
  });

  // Questions & Loading
  const [questions, setQuestions] = useState<DynamicQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false);

  // Evaluation Report
  const [evaluationReport, setEvaluationReport] = useState<SessionEvaluationReport | null>(() =>
    offlineStorage.getLastSessionEvaluation()
  );

  // Theme Toggle Effect
  useEffect(() => {
    offlineStorage.setTheme(theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  // Handle Login From Landing Page Hero
  const handleLoginWithDetails = (email: string) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const savedProfile = offlineStorage.getUserProfile();

    if (cleanEmail && savedProfile && savedProfile.email && savedProfile.email.trim().toLowerCase() === cleanEmail && savedProfile.fullName) {
      // Existing User: load their saved profile & past test history
      setUserProfile(savedProfile);
      setAppStage('dashboard');
    } else {
      // New User: create new clean profile & direct to profile setup
      const newProfile: UserProfile = {
        fullName: '',
        email: email || '',
        college: '',
        educationLevel: 'Undergraduate',
        degreeBranch: '',
        yearOfStudy: '3rd Year',
        targetCompany: '',
        goal: 'Placement Interviews',
        skillsKnown: [],
        preferredLanguage: 'English',
        xpPoints: 0,
        currentLevel: 1,
        streakDays: 1,
        dailyStreak: 1,
        totalSessionsCompleted: 0,
        overallAccuracy: 0,
        estimatedReadiness: 0,
        createdAt: new Date().toISOString()
      };
      setUserProfile(newProfile);
      setAppStage('onboarding-profile');
    }
  };

  // Save Edit Profile Modal
  const handleSaveProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    offlineStorage.saveUserProfile(updated);
  };

  // Launch Practice Test from Topic Hub
  const handleStartTopicPractice = async (subject: string, difficulty: 'Easy' | 'Medium' | 'Hard') => {
    const newSelection: SubjectSelection = {
      goal: userProfile?.goal || 'Placement & Campus Prep',
      subject,
      unit: 'Core Practice',
      difficulty,
    };
    setSubjectSelection(newSelection);
    setAppStage('practice-session');
    setLoadingQuestions(true);

    const currentProfile = userProfile || {
      fullName: 'Peesapati Adithya',
      email: 'peesapatiadithya@gmail.com',
      college: 'Engineering Institute',
      degreeBranch: 'Computer Science & Engineering',
      yearOfStudy: '3rd Year',
      targetCompany: 'Google',
      goal: 'Placement',
      skillsKnown: ['DSA'],
      xpPoints: 2450,
      currentLevel: 12,
      streakDays: 7,
      totalSessionsCompleted: 14,
    };

    try {
      const res = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: currentProfile,
          selection: newSelection,
          requestTime: Date.now(),
          randomNonce: Math.random().toString(36).substring(2, 9),
        }),
      });

      const data = await res.json();
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        throw new Error('Fallback needed');
      }
    } catch {
      // Dynamic randomized fallback generator strictly tailored to subject
      const count = difficulty === 'Easy' ? 20 : difficulty === 'Medium' ? 15 : 10;
      const lowerSub = (subject || '').toLowerCase();

      let fallbackList: DynamicQuestion[] = [];

      if (lowerSub.includes('logical') || lowerSub.includes('reasoning')) {
        const logicalTopics = [
          {
            title: 'Number Series Pattern',
            snippet: 'Sequence: 2, 6, 12, 20, 30, ?',
            problem: 'Identify the missing term in the sequence.',
            options: [
              { letter: 'A', text: '42 (Pattern: +4, +6, +8, +10, +12)' },
              { letter: 'B', text: '40' },
              { letter: 'C', text: '36' },
              { letter: 'D', text: '44' }
            ]
          },
          {
            title: 'Syllogism Deduction',
            snippet: 'Statements:\n1. All A are B.\n2. Some B are C.\nConclusions:\nI. Some A are C.\nII. Some B are A.',
            problem: 'Which conclusion(s) logically follow from the given statements?',
            options: [
              { letter: 'A', text: 'Only Conclusion II follows' },
              { letter: 'B', text: 'Only Conclusion I follows' },
              { letter: 'C', text: 'Both I and II follow' },
              { letter: 'D', text: 'Neither I nor II follows' }
            ]
          },
          {
            title: 'Blood Relations',
            snippet: 'Premise: A is the brother of B. B is the daughter of C. C is married to D.',
            problem: 'How is A related to D?',
            options: [
              { letter: 'A', text: 'Son' },
              { letter: 'B', text: 'Brother' },
              { letter: 'C', text: 'Father' },
              { letter: 'D', text: 'Nephew' }
            ]
          },
          {
            title: 'Coding-Decoding Pattern',
            snippet: 'Rule: If "LEADER" is coded as "MDIEFS" under a shift cipher pattern.',
            problem: 'How is "STRIKE" coded under the identical transformation pattern?',
            options: [
              { letter: 'A', text: 'TUSJLF' },
              { letter: 'B', text: 'TUSJLD' },
              { letter: 'C', text: 'SVRJLF' },
              { letter: 'D', text: 'TTSJLF' }
            ]
          },
          {
            title: 'Seating Arrangement',
            snippet: 'Condition: 5 people (P, Q, R, S, T) sit in a row. P is adjacent to Q. R is at the extreme right.',
            problem: 'If S is immediately to the left of R, who sits in the exact middle?',
            options: [
              { letter: 'A', text: 'Q' },
              { letter: 'B', text: 'P' },
              { letter: 'C', text: 'T' },
              { letter: 'D', text: 'S' }
            ]
          }
        ];

        fallbackList = Array.from({ length: count }, (_, i) => {
          const item = logicalTopics[i % logicalTopics.length];
          return {
            id: `q_logic_${Date.now()}_${i + 1}`,
            number: i + 1,
            title: `${item.title} #${i + 1}`,
            category: subject,
            difficulty: difficulty,
            problemStatement: `[Logical Reasoning ${difficulty} Q#${i + 1}]: ${item.problem}`,
            codeSnippet: item.snippet,
            options: item.options,
            correctOptionLetter: item.title.includes('Seating') ? 'C' : 'A',
            constraints: ['Direct Logical Inference', 'No External Assumptions'],
            hint: 'Analyze the given premise or pattern step by step.',
            expectedKeyConcepts: ['Logical Deduction', 'Pattern Recognition', 'Inference'],
          };
        });
      } else if (lowerSub.includes('aptitude') || lowerSub.includes('quantitative') || lowerSub.includes('math')) {
        const quantTopics = [
          {
            title: 'Percentage & Ratio Drill',
            snippet: 'Given: A salary is increased by 20% and then decreased by 20%.',
            problem: 'What is the net percentage change in the salary?',
            options: [
              { letter: 'A', text: '4% decrease (Net = 100 * 1.2 * 0.8 = 96)' },
              { letter: 'B', text: '0% change' },
              { letter: 'C', text: '2% decrease' },
              { letter: 'D', text: '4% increase' }
            ]
          },
          {
            title: 'Speed, Distance & Time',
            snippet: 'Data: A train travelling at 72 km/h crosses a 200m pole.',
            problem: 'How many seconds does the train take to pass the pole if length is 100m?',
            options: [
              { letter: 'A', text: '5 seconds (Speed = 72 * 5/18 = 20 m/s)' },
              { letter: 'B', text: '10 seconds' },
              { letter: 'C', text: '15 seconds' },
              { letter: 'D', text: '8 seconds' }
            ]
          },
          {
            title: 'Time & Work',
            snippet: 'Premise: Worker A completes a task in 10 days. Worker B in 15 days.',
            problem: 'How many days will A and B together take to finish the task?',
            options: [
              { letter: 'A', text: '6 days (Combined rate = 1/10 + 1/15 = 1/6)' },
              { letter: 'B', text: '8 days' },
              { letter: 'C', text: '12.5 days' },
              { letter: 'D', text: '5 days' }
            ]
          },
          {
            title: 'Probability & Combinations',
            snippet: 'Trial: Two fair 6-sided dice are rolled simultaneously.',
            problem: 'What is the probability that the sum of numbers on top faces equals 7?',
            options: [
              { letter: 'A', text: '1/6 (Outcomes: 6/36)' },
              { letter: 'B', text: '1/12' },
              { letter: 'C', text: '5/36' },
              { letter: 'D', text: '1/4' }
            ]
          }
        ];

        fallbackList = Array.from({ length: count }, (_, i) => {
          const item = quantTopics[i % quantTopics.length];
          return {
            id: `q_quant_${Date.now()}_${i + 1}`,
            number: i + 1,
            title: `${item.title} #${i + 1}`,
            category: subject,
            difficulty: difficulty,
            problemStatement: `[Quantitative Aptitude ${difficulty} Q#${i + 1}]: ${item.problem}`,
            codeSnippet: item.snippet,
            options: item.options,
            correctOptionLetter: 'A',
            constraints: ['Apply standard formulas', 'Precision calculation'],
            hint: 'Use the standard mathematical formula for rate or ratio.',
            expectedKeyConcepts: ['Numerical Problem Solving', 'Aptitude Formula', 'Quantitative Analysis'],
          };
        });
      } else {
        const subtopics = [
          'Array Two-Pointers & In-Place Swaps',
          'Binary Search on Solution Space',
          'Linked List Cycle Fast/Slow Pointer',
          'Monotonic Stack Next Greater Element',
          'Sliding Window Max/Min Subarrays',
          'Tree Lowest Common Ancestor & Traversal',
          'Graph Topological Sorting (Kahn\'s)',
          'Dynamic Programming Subproblem Memoization',
          'Min-Heap Top-K Elements Processing',
          'Trie Fast Prefix Auto-Complete',
        ];
        const shuffled = [...subtopics].sort(() => Math.random() - 0.5);

        fallbackList = Array.from({ length: count }, (_, i) => {
          const topic = shuffled[i % shuffled.length];
          return {
            id: `q_${Date.now()}_${i + 1}`,
            number: i + 1,
            title: topic,
            category: subject,
            difficulty: difficulty,
            problemStatement: `[Attempt #${Math.floor(Math.random() * 900) + 100}] ${topic}: Explain how to implement ${topic.toLowerCase()} efficiently under ${difficulty} constraints. Detail the logic, step-by-step algorithm, time complexity, and edge cases.`,
            codeSnippet: `// ${topic} Execution Trace\nfunction processData(data, n) {\n    let result = [];\n    for (let i = 0; i < n; i++) {\n        if (i % 2 === 0) result.push(data[i] * 2);\n    }\n    return result;\n}`,
            options: [
              { letter: 'A', text: 'Time Complexity O(N) with O(1) auxiliary space' },
              { letter: 'B', text: 'Time Complexity O(N log N) with O(N) space' },
              { letter: 'C', text: 'Time Complexity O(2^N) due to exponential recursion' },
              { letter: 'D', text: 'Runtime exception due to unbounded index access' },
            ],
            correctOptionLetter: 'A',
            constraints: [`Time Complexity O(N)`, `Space Overhead O(1)`, `Address boundary/null cases`],
            hint: `Focus on fundamental principles and standard optimizations for ${topic.toLowerCase()}.`,
            expectedKeyConcepts: [topic, 'Time Complexity', 'Space Overhead'],
          };
        });
      }

      setQuestions(fallbackList);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Complete Profile Setup & Enter Dashboard
  const handleCompleteProfileAndSelection = async (
    profile: UserProfile
  ) => {
    setUserProfile(profile);
    offlineStorage.saveUserProfile(profile);
    setAppStage('dashboard');
  };

  // Submit Session Answers
  const handleSubmitSession = async (answers: Record<string, string>) => {
    if (!userProfile) return;

    setAppStage('session-evaluation');
    setEvaluationReport(null);

    let report: SessionEvaluationReport;

    try {
      const res = await fetch('/api/ai/evaluate-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          selection: subjectSelection,
          questions,
          userAnswers: answers,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to evaluate test session (status ${res.status})`);
      }

      report = await res.json();
    } catch (err) {
      console.error('Error evaluating test session via API, using client fallback evaluator:', err);
      const totalCount = questions.length || 1;
      let correctCount = 0;
      let attemptedCount = 0;

      const individualFeedbacks = questions.map((q, idx) => {
        const ans = (answers[q.id] || '').trim();
        const isAttempted = ans.length > 0 && !ans.toLowerCase().includes('not attempted');
        if (isAttempted) attemptedCount++;

        let isCorrect = false;
        const correctLetter = (q.correctOptionLetter || 'A').toUpperCase();

        if (isAttempted) {
          const optionMatch = ans.match(/Option ([A-D])/i);
          if (optionMatch && optionMatch[1].toUpperCase() === correctLetter) {
            isCorrect = true;
          } else if (ans.toUpperCase() === correctLetter || ans.startsWith(`Option ${correctLetter}`)) {
            isCorrect = true;
          } else if (q.options) {
            const correctObj = q.options.find((o) => o.letter.toUpperCase() === correctLetter);
            if (correctObj && correctObj.text && ans.includes(correctObj.text)) {
              isCorrect = true;
            }
          }
        }

        if (isCorrect) correctCount++;

        const correctObj = q.options?.find((o) => o.letter.toUpperCase() === correctLetter);
        const correctText = correctObj ? `Option ${correctLetter}: ${correctObj.text}` : `Option ${correctLetter}`;

        return {
          questionId: q.id,
          questionNumber: idx + 1,
          questionTitle: q.title || `Question #${idx + 1}`,
          userAnswer: isAttempted ? ans : 'Not Attempted',
          score: isCorrect ? 100 : 0,
          isCorrect,
          technicalAccuracy: isCorrect ? 100 : (isAttempted ? 30 : 0),
          grammarCommunication: isAttempted ? 85 : 0,
          correctAnswer: correctText,
          detailedExplanation: isCorrect
            ? `Correct! Your selected answer matches ${correctText}.`
            : isAttempted
            ? `Incorrect. You selected "${ans}". The correct solution is ${correctText}.`
            : `Question was skipped or unattempted.`,
          improvementSuggestion: isCorrect
            ? `Excellent work! Review advanced variations of ${q.title}.`
            : `Review fundamental concepts in ${q.title}.`,
        };
      });

      const exactScore = Math.round((correctCount / totalCount) * 100);

      const missedTopics: string[] = individualFeedbacks
        .filter((f) => !f.isCorrect)
        .map((f) => f.questionTitle);

      const uniqueMissedTopics: string[] = missedTopics.filter((v, i, a) => a.indexOf(v) === i);

      report = {
        sessionId: 'sess_' + Date.now(),
        timestamp: new Date().toISOString(),
        subject: subjectSelection.subject,
        goal: subjectSelection.goal,
        difficulty: subjectSelection.difficulty,
        overallScore: exactScore,
        accuracyPercentage: exactScore,
        technicalAccuracy: exactScore,
        grammarCommunication: Math.round((attemptedCount / totalCount) * 100),
        confidenceLevel: Math.min(100, exactScore + 10),
        strengths: individualFeedbacks.filter((f) => f.isCorrect).map((f) => f.questionTitle).slice(0, 4),
        weakAreas: uniqueMissedTopics.slice(0, 4),
        individualFeedbacks,
        nextLearningPath: {
          topicsToRevise: uniqueMissedTopics.slice(0, 3),
          recommendedPractice: ['Daily 20-min topic drills', 'Mock practice test', 'Formula review'],
          recommendedResources: ['GeeksforGeeks Track', 'LeetCode Curated Sheet', 'Official Docs'],
          weeklyStudyPlan: [
            { day: 'Day 1', task: 'Review Missed Questions', topic: subjectSelection.subject },
            { day: 'Day 2', task: 'Targeted Practice Drills', topic: missedTopics[0] || subjectSelection.subject },
          ],
        },
      };
    }

    setEvaluationReport(report);
    offlineStorage.saveSessionEvaluation(report);

    const updatedProfile: UserProfile = {
      ...userProfile,
      xpPoints: userProfile.xpPoints + Math.max(20, report.overallScore * 2),
      totalSessionsCompleted: (userProfile.totalSessionsCompleted || 0) + 1,
      overallAccuracy: report.accuracyPercentage,
    };
    setUserProfile(updatedProfile);
    offlineStorage.saveUserProfile(updatedProfile);
  };

  // Reset User Profile
  const handleResetProfile = () => {
    offlineStorage.clearUserProfile();
    setUserProfile(null);
    setAppStage('landing');
  };

  return (
    <div className={`min-h-screen bg-[#070A12] text-slate-100 flex ${theme === 'light' ? 'light' : ''}`}>
      {/* Edit Profile Modal */}
      {userProfile && (
        <EditProfileModal
          userProfile={userProfile}
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          onSave={handleSaveProfile}
        />
      )}

      {/* Show Sidebar if profile exists and not in onboarding or landing */}
      {userProfile && !appStage.startsWith('onboarding') && appStage !== 'landing' && (
        <Sidebar
          currentStage={appStage}
          onSelectStage={setAppStage}
          userName={userProfile.fullName}
          onResetProfile={handleResetProfile}
        />
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 min-w-0 overflow-y-auto min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={appStage}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {/* Landing / Showcase Screen */}
            {appStage === 'landing' && (
              <LandingView
                onStartLearning={() => setAppStage(userProfile ? 'dashboard' : 'onboarding-profile')}
                onSelectStage={setAppStage}
                onLoginWithDetails={handleLoginWithDetails}
              />
            )}

            {/* Onboarding Flow */}
            {(appStage === 'onboarding-profile' || appStage === 'onboarding-goal' || appStage === 'onboarding-topic') && (
              <OnboardingFlow
                initialProfile={userProfile}
                onCompleteProfile={handleCompleteProfileAndSelection}
              />
            )}

            {/* User Dashboard View */}
            {appStage === 'dashboard' && userProfile && (
              <UserDashboardView
                userProfile={userProfile}
                latestEvaluation={evaluationReport}
                onStartNewSession={() => setAppStage('practice-topic-hub')}
                onOpenInterview={() => setAppStage('interview')}
                onOpenStudyPlan={() => setAppStage('study-plan')}
                onEditProfile={() => setIsEditProfileOpen(true)}
                onViewEvaluation={(report) => {
                  setEvaluationReport(report);
                  setAppStage('session-evaluation');
                }}
              />
            )}

            {/* Practice Topic & Difficulty Hub */}
            {appStage === 'practice-topic-hub' && (
              <PracticeTopicSelection
                currentSubject={subjectSelection.subject}
                currentDifficulty={subjectSelection.difficulty}
                onStartTest={handleStartTopicPractice}
              />
            )}

            {/* Practice Session */}
            {appStage === 'practice-session' && (
              <PracticeSessionView
                userProfile={userProfile || {
                  fullName: 'Adithya',
                  email: 'adithya@example.com',
                  college: 'BITS',
                  degreeBranch: 'CSE',
                  yearOfStudy: '3rd Year',
                  targetCompany: 'Google',
                  goal: 'Placement',
                  skillsKnown: ['DSA'],
                  xpPoints: 2450,
                  currentLevel: 12,
                  streakDays: 7,
                  totalSessionsCompleted: 14,
                }}
                selection={subjectSelection}
                questions={questions}
                loadingQuestions={loadingQuestions}
                onSubmitSession={handleSubmitSession}
                onBackToOnboarding={() => setAppStage('practice-topic-hub')}
                onChangeTopicHub={() => setAppStage('practice-topic-hub')}
              />
            )}

            {/* Evaluation Report */}
            {appStage === 'session-evaluation' && (
              <EvaluationReportView
                evaluation={evaluationReport}
                onProceedToDashboard={() => setAppStage('dashboard')}
                onStartNewSession={() => setAppStage('practice-topic-hub')}
              />
            )}

            {/* AI Interview */}
            {appStage === 'interview' && (
              <InterviewView
                onSelectTab={(stg) => setAppStage(stg)}
                onUpdateXp={(amt) => {
                  if (userProfile) {
                    const up = { ...userProfile, xpPoints: userProfile.xpPoints + amt };
                    setUserProfile(up);
                    offlineStorage.saveUserProfile(up);
                  }
                }}
              />
            )}

            {/* Mobile View Preview */}
            {appStage === 'mobile-view' && (
              <MobileViewMockup
                userName={userProfile?.fullName}
                onSelectStage={setAppStage}
              />
            )}

            {/* Adaptive Study Plan */}
            {appStage === 'study-plan' && <StudyPlanView />}

            {/* Analytics View */}
            {appStage === 'analytics' && userProfile && (
              <UserDashboardView
                userProfile={userProfile}
                latestEvaluation={evaluationReport}
                onStartNewSession={() => setAppStage('practice-topic-hub')}
                onOpenInterview={() => setAppStage('interview')}
                onOpenStudyPlan={() => setAppStage('study-plan')}
                onEditProfile={() => setIsEditProfileOpen(true)}
              />
            )}

            {/* Weak Topics View */}
            {appStage === 'weak-topics' && (
              <div className="p-8 max-w-5xl mx-auto space-y-6 font-sans">
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-amber-400" />
                  <span>Weak Topics Focus</span>
                </h1>
                <div className="p-6 rounded-3xl bg-[#0D111D] border border-slate-800 space-y-4">
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200">
                    <strong className="block text-rose-300 font-bold mb-1">Dynamic Programming (28% Accuracy)</strong>
                    Focus on 0/1 Knapsack, Subtree Sum, and Longest Common Subsequence.
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                    <strong className="block text-amber-300 font-bold mb-1">Operating Systems (43% Accuracy)</strong>
                    Review Virtual Memory, Page Faults, and Deadlock Prevention.
                  </div>
                  <button
                    onClick={() => setAppStage('practice-topic-hub')}
                    className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
                  >
                    Select Weak Topic Practice Drill
                  </button>
                </div>
              </div>
            )}

            {/* Bookmarks View */}
            {appStage === 'bookmarks' && (
              <div className="p-8 max-w-5xl mx-auto space-y-6 font-sans">
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Bookmark className="w-6 h-6 text-indigo-400" />
                  <span>Bookmarked Questions & Notes</span>
                </h1>
                <div className="p-6 rounded-3xl bg-[#0D111D] border border-slate-800 text-xs text-slate-300 space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="font-bold text-white block mb-1">#1 Python List Mutability & Shared References</span>
                    <p className="text-slate-400">Remember: y = x copies memory reference, not values.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Leaderboard View */}
            {appStage === 'leaderboard' && (
              <div className="p-8 max-w-5xl mx-auto space-y-6 font-sans">
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-amber-400" />
                  <span>Global Student Leaderboard</span>
                </h1>
                <div className="p-6 rounded-3xl bg-[#0D111D] border border-slate-800 space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-between font-bold text-white">
                    <span>🥇 1. {userProfile?.fullName || 'Peesapati Adithya'} (You)</span>
                    <span className="text-amber-400">{userProfile?.xpPoints || 2450} XP</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-300">
                    <span>🥈 2. Rahul Sharma</span>
                    <span>2,320 XP</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-300">
                    <span>🥉 3. Priya Patel</span>
                    <span>2,180 XP</span>
                  </div>
                </div>
              </div>
            )}

            {/* Profile View */}
            {appStage === 'profile' && userProfile && (
              <div className="p-8 max-w-5xl mx-auto space-y-6 font-sans">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-black text-white flex items-center gap-2">
                    <User className="w-6 h-6 text-indigo-400" />
                    <span>Student Profile</span>
                  </h1>
                  <button
                    onClick={() => setIsEditProfileOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile Details</span>
                  </button>
                </div>

                <div className="p-6 sm:p-8 rounded-3xl bg-[#0D111D] border border-slate-800 space-y-6 text-xs">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-cyan-400 flex items-center justify-center text-white font-black text-2xl shadow-xl">
                      {(userProfile.fullName || 'P').substring(0, 2).toUpperCase()}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-black text-white text-xl">{userProfile.fullName}</h3>
                      <p className="text-slate-400 font-medium">{userProfile.email} • {userProfile.college}</p>
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold text-[11px] border border-indigo-500/30">
                        {userProfile.yearOfStudy || '3rd Year'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                      <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider block">Degree & Branch</span>
                      <span className="text-white font-bold text-sm">{userProfile.degreeBranch}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                      <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider block">Target Company</span>
                      <span className="text-indigo-400 font-bold text-sm">{userProfile.targetCompany || 'Google, Microsoft'}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                      <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider block">Primary Goal</span>
                      <span className="text-emerald-400 font-bold text-sm">{userProfile.goal}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                      <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider block">Known Skills</span>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {(userProfile.skillsKnown || []).map((sk, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings View */}
            {appStage === 'settings' && (
              <div className="p-8 max-w-5xl mx-auto space-y-6 font-sans">
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Settings className="w-6 h-6 text-slate-400" />
                  <span>Application Settings</span>
                </h1>
                <div className="p-6 rounded-3xl bg-[#0D111D] border border-slate-800 space-y-4 text-xs">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <div>
                      <h4 className="font-bold text-white text-sm">Edit Profile Information</h4>
                      <p className="text-slate-400 text-xs">Update your name, target company, skills, or degree.</p>
                    </div>
                    <button
                      onClick={() => setIsEditProfileOpen(true)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 shadow-md"
                    >
                      Edit Profile
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <div>
                      <h4 className="font-bold text-white text-sm">Reset Profile & Data</h4>
                      <p className="text-slate-400 text-xs">Clear local progress and return to showcase.</p>
                    </div>
                    <button
                      onClick={handleResetProfile}
                      className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 font-bold hover:bg-rose-500/30 border border-rose-500/30"
                    >
                      Reset Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;

