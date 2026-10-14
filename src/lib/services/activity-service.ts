// ============================================================
// SenseLearn — Activity Service
// Manages activity lifecycles, session creation, performance evaluation,
// and adaptive difficulty adjustments
// ============================================================

import { db } from '../data/store';
import type {
  Activity, LearningSession, Question, Difficulty, AdaptationResult
} from '../data/models';
import { generateId } from '../utils';
import { evaluateAdaptiveRules } from '../engine/adaptive-engine';
import { interactionTrackingService } from './interaction-tracking-service';
import { recommendationService } from './recommendation-service';

export interface StartSessionParams {
  learnerId: string;
  activityId: string;
}

export interface CompleteSessionParams {
  sessionId: string;
  learnerId: string;
  activityId: string;
  questionsAttempted: number;
  questionsCorrect: number;
  hintsUsed: number;
  retryCount: number;
  totalTimeMs: number;
}

export const activityService = {
  /**
   * Get all active activities with optional domain / difficulty filtering
   */
  getActivities(filters?: { domainId?: string; difficulty?: string; type?: string }): Activity[] {
    let list = db.activities.findActive();
    if (filters?.domainId) {
      list = list.filter(a => a.domainId === filters.domainId);
    }
    if (filters?.difficulty) {
      list = list.filter(a => a.difficulty === filters.difficulty);
    }
    if (filters?.type) {
      list = list.filter(a => a.activityType === filters.type);
    }
    return list;
  },

  /**
   * Get specific activity by ID
   */
  getActivityById(activityId: string): Activity | undefined {
    return db.activities.findById(activityId);
  },

  /**
   * Get questions for an activity
   */
  getActivityQuestions(activityId: string): Question[] {
    const activity = db.activities.findById(activityId);
    if (!activity) return [];
    return db.questions.findByIds(activity.questionIds);
  },

  /**
   * Start a new learning activity session
   */
  startSession(params: StartSessionParams): LearningSession {
    const activity = db.activities.findById(params.activityId);
    if (!activity) throw new Error('Activity not found');

    const session: LearningSession = {
      id: `ses-${generateId()}`,
      learnerId: params.learnerId,
      activityId: params.activityId,
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      totalTimeMs: 0,
      questionsAttempted: 0,
      questionsCorrect: 0,
      hintsUsed: 0,
      retryCount: 0,
      accuracy: 0,
      difficultyAtStart: activity.difficulty,
      difficultyAtEnd: activity.difficulty,
      score: 0,
      maxScore: activity.points,
    };

    db.learningSessions.create(session);

    // Track activity_started event
    interactionTrackingService.logEvent({
      learnerId: params.learnerId,
      sessionId: session.id,
      activityId: params.activityId,
      eventType: 'activity_started',
    });

    return session;
  },

  /**
   * Complete an activity session, evaluate adaptive rules, and update learner stats
   */
  completeSession(params: CompleteSessionParams): {
    session: LearningSession;
    adaptation: AdaptationResult;
  } {
    const session = db.learningSessions.findById(params.sessionId);
    if (!session) throw new Error('Session not found');

    const accuracy = params.questionsAttempted > 0
      ? Math.round((params.questionsCorrect / params.questionsAttempted) * 100)
      : 0;

    const activity = db.activities.findById(params.activityId);
    const score = Math.round(((params.questionsCorrect * (activity?.points || 50)) / Math.max(1, params.questionsAttempted)));

    // Evaluate adaptive learning rules
    const adaptation = evaluateAdaptiveRules({
      currentDifficulty: session.difficultyAtStart,
      sessionAccuracy: accuracy,
      consecutiveMistakes: params.questionsAttempted - params.questionsCorrect,
      consecutiveSuccesses: params.questionsCorrect,
      averageResponseTimeMs: params.questionsAttempted > 0 ? Math.round(params.totalTimeMs / params.questionsAttempted) : 10000,
      hintsUsedCount: params.hintsUsed,
    });

    const updatedSession = db.learningSessions.update(params.sessionId, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      totalTimeMs: params.totalTimeMs,
      questionsAttempted: params.questionsAttempted,
      questionsCorrect: params.questionsCorrect,
      hintsUsed: params.hintsUsed,
      retryCount: params.retryCount,
      accuracy,
      difficultyAtEnd: adaptation.newDifficulty,
      score,
    });

    // Track activity_completed event
    interactionTrackingService.logEvent({
      learnerId: params.learnerId,
      sessionId: params.sessionId,
      activityId: params.activityId,
      eventType: 'activity_completed',
      responseTimeMs: params.totalTimeMs,
      success: accuracy >= 70,
    });

    // Update Learner Profile
    const profile = db.learnerProfiles.findByUserId(params.learnerId);
    if (profile) {
      const newTotalActivities = profile.totalActivitiesCompleted + 1;
      // Level progression rule: advance level every 5 completed activities
      const newLevel = Math.min(5, Math.floor(newTotalActivities / 5) + 1);

      db.learnerProfiles.update(profile.id, {
        totalActivitiesCompleted: newTotalActivities,
        currentLevel: newLevel,
        currentStreak: profile.currentStreak + 1,
        longestStreak: Math.max(profile.longestStreak, profile.currentStreak + 1),
        lastActivityAt: new Date().toISOString(),
      });
    }

    // Refresh recommendations based on new performance
    recommendationService.refreshRecommendations(params.learnerId);

    return {
      session: updatedSession!,
      adaptation,
    };
  },

  /**
   * Pause learning session
   */
  pauseSession(sessionId: string, learnerId: string, activityId: string): void {
    db.learningSessions.update(sessionId, {
      status: 'paused',
      pausedAt: new Date().toISOString(),
    });

    interactionTrackingService.logEvent({
      learnerId,
      sessionId,
      activityId,
      eventType: 'activity_paused',
    });
  },

  /**
   * Resume learning session
   */
  resumeSession(sessionId: string, learnerId: string, activityId: string): void {
    db.learningSessions.update(sessionId, {
      status: 'in_progress',
    });

    interactionTrackingService.logEvent({
      learnerId,
      sessionId,
      activityId,
      eventType: 'activity_resumed',
    });
  },
};
