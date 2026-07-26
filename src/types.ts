export type Theme = 'dark' | 'light';

export type AppStage =
  | 'landing'
  | 'dashboard'
  | 'practice-topic-hub'
  | 'practice-session'
  | 'session-evaluation'
  | 'interview'
  | 'study-plan'
  | 'analytics'
  | 'weak-topics'
  | 'bookmarks'
  | 'leaderboard'
  | 'profile'
  | 'settings'
  | 'mobile-view'
  | 'onboarding-profile'
  | 'onboarding-goal'
  | 'onboarding-topic';

export type EducationLevel = 'School' | 'Diploma' | 'Undergraduate' | 'Postgraduate';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface UserProfile {
  fullName: string;
  email: string;
  college?: string;
  educationLevel: EducationLevel;
  degreeBranch: string;
  yearOfStudy: string;
  skillsKnown: string[];
  preferredLanguage: string;
  targetCompany?: string;
  goal?: string;
  currentLevel?: number;
  streakDays?: number;
  xpPoints: number;
  dailyStreak: number;
  totalSessionsCompleted: number;
  overallAccuracy: number;
  estimatedReadiness: number;
  createdAt: string;
}

export type PreparationGoal =
  | 'Semester Exams'
  | 'Placement Interviews'
  | 'Coding Interviews'
  | 'Aptitude Tests'
  | 'Competitive Exams'
  | 'HR Interviews'
  | 'Communication Skills';

export interface SubjectSelection {
  goal: PreparationGoal;
  subject: string;
  unit?: string;
  difficulty: Difficulty;
}

export interface DynamicQuestion {
  id: string;
  number: number;
  title: string;
  category: string;
  difficulty: Difficulty;
  problemStatement: string;
  codeSnippet?: string;
  options?: { letter: string; text: string }[];
  correctOptionLetter?: string;
  constraints: string[];
  hint: string;
  expectedKeyConcepts: string[];
}

export interface SessionAnswer {
  questionId: string;
  questionNumber: number;
  userText: string;
  timeSpentSeconds: number;
}

export interface IndividualQuestionFeedback {
  questionId: string;
  questionNumber: number;
  questionTitle: string;
  userAnswer: string;
  score: number;
  isCorrect: boolean;
  technicalAccuracy: number;
  grammarCommunication: number;
  correctAnswer: string;
  detailedExplanation: string;
  improvementSuggestion: string;
}

export interface SessionEvaluationReport {
  sessionId: string;
  timestamp: string;
  subject: string;
  goal: PreparationGoal;
  difficulty: Difficulty;
  overallScore: number;
  accuracyPercentage: number;
  technicalAccuracy: number;
  grammarCommunication: number;
  confidenceLevel: number;
  strengths: string[];
  weakAreas: string[];
  individualFeedbacks: IndividualQuestionFeedback[];
  nextLearningPath: {
    topicsToRevise: string[];
    recommendedPractice: string[];
    recommendedResources: string[];
    weeklyStudyPlan: { day: string; task: string; topic: string }[];
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

