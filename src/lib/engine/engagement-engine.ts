// ============================================================
// SenseLearn — Engagement Engine (Decoupled Pure Logic)
// Computes the Engagement Indicator from observable interaction data
//
// FORMULA:
// Interaction Consistency = 30%
// Completion Rate         = 25%
// Accuracy                = 20%
// Persistence             = 15%
// Response Stability      = 10%
// Total                   = 0 - 100 Score
// ============================================================

import type {
  InteractionEvent, LearningSession, EngagementProfile,
  EngagementStatus, EngagementSnapshot
} from '../data/models';
import { ENGAGEMENT_WEIGHTS } from '../constants';

export interface EngagementCalculationInput {
  learnerId: string;
  sessions: LearningSession[];
  events: InteractionEvent[];
  previousProfile?: EngagementProfile;
}

export interface EngagementBreakdown {
  interactionConsistency: number;
  completionRate: number;
  accuracy: number;
  persistence: number;
  responseStability: number;
  overallScore: number;
  status: EngagementStatus;
}

/**
 * Pure function to calculate learning engagement scores without UI coupling
 */
export function calculateEngagementMetrics(input: EngagementCalculationInput): EngagementBreakdown {
  const { sessions, events } = input;

  if (sessions.length === 0 && events.length === 0) {
    return {
      interactionConsistency: 50,
      completionRate: 50,
      accuracy: 50,
      persistence: 50,
      responseStability: 50,
      overallScore: 50,
      status: 'moderately_engaged',
    };
  }

  // 1. Interaction Consistency (30%)
  // Based on event count frequency and non-abandoned interactions
  const consistencyScore = computeInteractionConsistency(events, sessions);

  // 2. Completion Rate (25%)
  // Ratio of completed activities to total started activities
  const completionScore = computeCompletionRate(sessions);

  // 3. Accuracy (20%)
  // Mean accuracy across all recorded sessions
  const accuracyScore = computeAccuracyScore(sessions);

  // 4. Persistence (15%)
  // Retry attempts, working through hints rather than quitting
  const persistenceScore = computePersistenceScore(events, sessions);

  // 5. Response Stability (10%)
  // Coefficient of variation in response times (stable pacing vs erratic bursts)
  const stabilityScore = computeResponseStability(events);

  // Calculate Weighted Total Score
  const rawTotal = (
    consistencyScore * ENGAGEMENT_WEIGHTS.interactionConsistency +
    completionScore * ENGAGEMENT_WEIGHTS.completion +
    accuracyScore * ENGAGEMENT_WEIGHTS.accuracy +
    persistenceScore * ENGAGEMENT_WEIGHTS.persistence +
    stabilityScore * ENGAGEMENT_WEIGHTS.responseStability
  );

  const overallScore = Math.min(100, Math.max(0, Math.round(rawTotal)));
  const status = determineEngagementStatus(overallScore);

  return {
    interactionConsistency: Math.round(consistencyScore),
    completionRate: Math.round(completionScore),
    accuracy: Math.round(accuracyScore),
    persistence: Math.round(persistenceScore),
    responseStability: Math.round(stabilityScore),
    overallScore,
    status,
  };
}

function computeInteractionConsistency(events: InteractionEvent[], sessions: LearningSession[]): number {
  if (events.length === 0) return 60;
  const activeEvents = events.filter(e => e.eventType === 'answer_submitted' || e.eventType === 'hint_used');
  const avgEventsPerSession = sessions.length > 0 ? activeEvents.length / sessions.length : activeEvents.length;
  // Standard benchmark: ~4-6 interactions per session is steady
  const ratio = Math.min(1, avgEventsPerSession / 4);
  return Math.min(100, 50 + ratio * 45);
}

function computeCompletionRate(sessions: LearningSession[]): number {
  if (sessions.length === 0) return 70;
  const completed = sessions.filter(s => s.status === 'completed').length;
  return Math.min(100, Math.round((completed / sessions.length) * 100));
}

function computeAccuracyScore(sessions: LearningSession[]): number {
  if (sessions.length === 0) return 65;
  const totalAcc = sessions.reduce((acc, s) => acc + s.accuracy, 0);
  return Math.min(100, Math.round(totalAcc / sessions.length));
}

function computePersistenceScore(events: InteractionEvent[], sessions: LearningSession[]): number {
  if (events.length === 0) return 60;
  const retries = events.filter(e => e.eventType === 'retry_attempt').length;
  const hintsUsed = events.filter(e => e.eventType === 'hint_used').length;
  const skips = events.filter(e => e.eventType === 'question_skipped').length;

  let base = 70;
  base += Math.min(20, hintsUsed * 4); // Hints show constructive help-seeking
  base += Math.min(15, retries * 5);   // Retrying shows grit
  base -= Math.min(25, skips * 8);     // Frequent skipping reduces persistence

  return Math.min(100, Math.max(10, base));
}

function computeResponseStability(events: InteractionEvent[]): number {
  const answeredEvents = events.filter(e => e.responseTimeMs && e.responseTimeMs > 0);
  if (answeredEvents.length < 2) return 75;

  const times = answeredEvents.map(e => e.responseTimeMs as number);
  const mean = times.reduce((a, b) => a + b, 0) / times.length;
  const variance = times.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / times.length;
  const stdDev = Math.sqrt(variance);
  const cv = mean > 0 ? stdDev / mean : 1; // Coefficient of variation

  // Lower CV (< 0.6) means steady thoughtful cadence -> higher stability score
  if (cv <= 0.4) return 92;
  if (cv <= 0.7) return 82;
  if (cv <= 1.0) return 70;
  if (cv <= 1.4) return 58;
  return 45;
}

export function determineEngagementStatus(score: number): EngagementStatus {
  if (score >= 80) return 'highly_engaged';
  if (score >= 60) return 'engaged';
  if (score >= 40) return 'moderately_engaged';
  return 'low_engagement';
}

export function buildEngagementProfileUpdate(
  currentProfile: EngagementProfile | undefined,
  metrics: EngagementBreakdown,
  learnerId: string,
  sessionCount: number
): EngagementProfile {
  const now = new Date().toISOString();
  const snapshot: EngagementSnapshot = {
    score: metrics.overallScore,
    status: metrics.status,
    calculatedAt: now,
  };

  const history = currentProfile?.history ? [...currentProfile.history, snapshot] : [snapshot];
  // Keep last 10 historical snapshots
  if (history.length > 10) history.shift();

  return {
    id: currentProfile?.id || `eng-prof-${learnerId}`,
    learnerId,
    overallScore: metrics.overallScore,
    status: metrics.status,
    interactionConsistency: metrics.interactionConsistency,
    completionRate: metrics.completionRate,
    accuracy: metrics.accuracy,
    persistence: metrics.persistence,
    responseStability: metrics.responseStability,
    calculatedAt: now,
    sessionCount,
    history,
  };
}
