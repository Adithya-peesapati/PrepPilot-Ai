import { UserProfile, SessionEvaluationReport } from "../types";
import { firebaseSync } from "./firebaseSync";

const STORAGE_KEYS = {
  USER_PROFILE: "preppilot_user_profile",
  EVALUATION_HISTORY: "preppilot_eval_history",
  THEME: "preppilot_theme",
};

/**
 * Local offline storage helper using localStorage with fallback handling.
 */
export const offlineStorage = {
  // Theme
  getTheme: (): "dark" | "light" => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as "dark" | "light") || "dark";
  },
  setTheme: (theme: "dark" | "light") => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  // Default profile matching reference design
  getDefaultProfile: (): UserProfile => ({
    fullName: 'Adithya',
    email: 'adithya@preppilot.ai',
    college: 'Institute of Technology',
    educationLevel: 'Undergraduate',
    degreeBranch: 'Computer Science Engineering',
    yearOfStudy: '3rd Year',
    skillsKnown: ['Data Structures', 'System Design', 'DBMS', 'OOPs', 'Operating Systems'],
    preferredLanguage: 'Python / C++',
    targetCompany: 'Top Tech / Product Companies',
    xpPoints: 2450,
    dailyStreak: 7,
    totalSessionsCompleted: 15,
    overallAccuracy: 82,
    estimatedReadiness: 88,
    createdAt: new Date().toISOString(),
  }),

  // User Profile
  getUserProfile: (): UserProfile => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (!data) {
        const defaultProfile = offlineStorage.getDefaultProfile();
        offlineStorage.saveUserProfile(defaultProfile);
        return defaultProfile;
      }
      const parsed = JSON.parse(data);
      if (parsed) {
        if (!parsed.fullName) {
          parsed.fullName = parsed.name || 'Adithya';
        }
        if (!parsed.skillsKnown || !Array.isArray(parsed.skillsKnown)) {
          parsed.skillsKnown = ['Data Structures', 'Python', 'SQL', 'System Design'];
        }
        if (typeof parsed.xpPoints !== 'number') {
          parsed.xpPoints = 2450;
        }
        if (typeof parsed.dailyStreak !== 'number') {
          parsed.dailyStreak = 7;
        }
        return parsed as UserProfile;
      }
      return offlineStorage.getDefaultProfile();
    } catch {
      return offlineStorage.getDefaultProfile();
    }
  },
  saveUserProfile: (profile: UserProfile) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
      firebaseSync.syncUserProfile(profile).catch((err) => {
        console.warn("Background Firebase profile sync:", err);
      });
    } catch (err) {
      console.warn("Failed to cache user profile locally", err);
    }
  },
  clearUserProfile: () => {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.EVALUATION_HISTORY);
  },

  // Session Evaluations
  getEvaluationHistory: (): SessionEvaluationReport[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVALUATION_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveSessionEvaluation: (report: SessionEvaluationReport) => {
    try {
      const history = offlineStorage.getEvaluationHistory();
      history.unshift(report);
      localStorage.setItem(STORAGE_KEYS.EVALUATION_HISTORY, JSON.stringify(history));
      firebaseSync.saveEvaluationReport(report).catch((err) => {
        console.warn("Background Firebase evaluation sync:", err);
      });
    } catch (err) {
      console.warn("Failed to save evaluation report", err);
    }
  },
  getLatestEvaluation: (): SessionEvaluationReport | null => {
    const history = offlineStorage.getEvaluationHistory();
    return history.length > 0 ? history[0] : null;
  },
  getLastSessionEvaluation: (): SessionEvaluationReport | null => {
    return offlineStorage.getLatestEvaluation();
  },
};

