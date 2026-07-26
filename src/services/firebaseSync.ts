import { doc, setDoc, getDoc, collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile, SessionEvaluationReport } from '../types';

export const firebaseSync = {
  // Sync profile to Firestore
  syncUserProfile: async (profile: UserProfile): Promise<void> => {
    try {
      const uid = auth.currentUser?.uid || profile.email || 'guest_user';
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        userId: uid,
        fullName: profile.fullName || 'Student',
        email: profile.email || 'student@example.com',
        college: profile.college || 'Engineering Institute',
        degreeBranch: profile.degreeBranch || 'Computer Science',
        yearOfStudy: profile.yearOfStudy || '3rd Year',
        targetCompany: profile.targetCompany || 'Top Tech',
        goal: profile.goal || 'Placement',
        skillsKnown: profile.skillsKnown || [],
        xpPoints: profile.xpPoints || 2450,
        currentLevel: profile.currentLevel || 12,
        streakDays: profile.streakDays || 7,
        totalSessionsCompleted: profile.totalSessionsCompleted || 14,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users');
    }
  },

  // Save Evaluation Report to Firestore
  saveEvaluationReport: async (report: SessionEvaluationReport): Promise<void> => {
    try {
      const uid = auth.currentUser?.uid || 'guest_user';
      const evalRef = doc(db, 'evaluations', report.sessionId || `report_${Date.now()}`);
      await setDoc(evalRef, {
        reportId: report.sessionId || `report_${Date.now()}`,
        userId: uid,
        overallScore: report.overallScore || 90,
        accuracyPercentage: report.accuracyPercentage || 95,
        strengths: report.strengths || [],
        weakAreas: report.weakAreas || [],
        subject: report.subject || 'DSA',
        difficulty: report.difficulty || 'Easy',
        createdAt: report.timestamp || new Date().toISOString(),
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'evaluations');
    }
  },

  // Fetch user profile from Firestore
  fetchUserProfile: async (): Promise<UserProfile | null> => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return null;
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'users');
      return null;
    }
  }
};
