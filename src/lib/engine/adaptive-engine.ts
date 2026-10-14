// ============================================================
// SenseLearn — Adaptive Learning Engine (Decoupled Pure Logic)
// Transparent rule-based adaptation with explainable rationale
// ============================================================

import type { Difficulty, AdaptationResult, PerformanceSnapshot } from '../data/models';
import { ADAPTIVE_RULES, DIFFICULTY_ORDER } from '../constants';

export interface AdaptationEvaluationInput {
  currentDifficulty: Difficulty;
  sessionAccuracy: number;
  consecutiveMistakes: number;
  consecutiveSuccesses: number;
  averageResponseTimeMs: number;
  hintsUsedCount: number;
  historicalAccuracyAverage?: number;
}

/**
 * Pure function evaluating performance and generating transparent adaptation actions
 */
export function evaluateAdaptiveRules(input: AdaptationEvaluationInput): AdaptationResult {
  const {
    currentDifficulty,
    sessionAccuracy,
    consecutiveMistakes,
    consecutiveSuccesses,
    averageResponseTimeMs,
  } = input;

  let newDifficulty = currentDifficulty;
  let showHint = false;
  let explanation = '';
  let recommendationType: 'next_level' | 'additional_practice' | 'guided_activity' | undefined;

  const currentIdx = DIFFICULTY_ORDER.indexOf(currentDifficulty);

  // RULE 4: If repeated mistakes >= 2 -> Show hint immediately
  if (consecutiveMistakes >= ADAPTIVE_RULES.HINT_AFTER_MISTAKES) {
    showHint = true;
    explanation = 'Hint provided automatically because consecutive attempts required support.';
  }

  // RULE 5: If response time is consistently high (>30s) -> Provide guided support
  if (averageResponseTimeMs >= ADAPTIVE_RULES.HIGH_RESPONSE_TIME_MS) {
    recommendationType = 'guided_activity';
    explanation = explanation
      ? `${explanation} Extended response duration detected; step-by-step guidance suggested.`
      : 'Step-by-step guidance suggested due to extended processing duration.';
  }

  // RULE 6: If learner repeatedly succeeds (>=3 in a row) -> Recommend next level
  if (consecutiveSuccesses >= ADAPTIVE_RULES.CONSECUTIVE_SUCCESS_FOR_ADVANCE) {
    recommendationType = 'next_level';
    if (currentIdx < DIFFICULTY_ORDER.length - 1) {
      newDifficulty = DIFFICULTY_ORDER[currentIdx + 1];
      explanation = `Difficulty increased to ${newDifficulty.toUpperCase()} because you achieved ${consecutiveSuccesses} consecutive successful solutions!`;
      return { newDifficulty, showHint, explanation, recommendationType };
    }
  }

  // RULE 7: If learner struggles repeatedly (>=3 mistakes) -> Recommend additional practice
  if (consecutiveMistakes >= ADAPTIVE_RULES.CONSECUTIVE_FAIL_FOR_SUPPORT) {
    recommendationType = 'additional_practice';
    if (currentIdx > 0) {
      newDifficulty = DIFFICULTY_ORDER[currentIdx - 1];
      explanation = `Difficulty adjusted to ${newDifficulty.toUpperCase()} to reinforce foundational concepts with guided practice.`;
      return { newDifficulty, showHint, explanation, recommendationType };
    }
  }

  // RULE 1: If score >= 80% -> Increase difficulty
  if (sessionAccuracy >= ADAPTIVE_RULES.INCREASE_THRESHOLD) {
    if (currentIdx < DIFFICULTY_ORDER.length - 1) {
      newDifficulty = DIFFICULTY_ORDER[currentIdx + 1];
      explanation = `Difficulty increased to ${newDifficulty.toUpperCase()} because your recent accuracy was ${sessionAccuracy}% (above the 80% threshold).`;
    } else {
      newDifficulty = 'advanced';
      explanation = `Mastery confirmed at ${sessionAccuracy}%! Maintaining Advanced level challenges.`;
    }
  }
  // RULE 2: If score 50–79% -> Maintain difficulty
  else if (sessionAccuracy >= ADAPTIVE_RULES.MAINTAIN_MIN && sessionAccuracy < ADAPTIVE_RULES.INCREASE_THRESHOLD) {
    newDifficulty = currentDifficulty;
    explanation = `Difficulty maintained at ${currentDifficulty.toUpperCase()} to stabilize concepts (recent accuracy: ${sessionAccuracy}%).`;
  }
  // RULE 3: If score < 50% -> Reduce difficulty and provide support
  else if (sessionAccuracy < ADAPTIVE_RULES.DECREASE_THRESHOLD) {
    if (currentIdx > 0) {
      newDifficulty = DIFFICULTY_ORDER[currentIdx - 1];
      explanation = `Difficulty reduced to ${newDifficulty.toUpperCase()} to provide foundational scaffolding (recent accuracy: ${sessionAccuracy}%).`;
    } else {
      newDifficulty = 'beginner';
      explanation = `Scaffolding and step-by-step assistance activated at Beginner level (recent accuracy: ${sessionAccuracy}%).`;
    }
    showHint = true;
    recommendationType = 'additional_practice';
  }

  return {
    newDifficulty,
    showHint,
    explanation,
    recommendationType,
  };
}

/**
 * Evaluates performance snapshot after each answer submission
 */
export function evaluateRealtimeItemSubmission(
  isCorrect: boolean,
  currentSnapshot: PerformanceSnapshot
): {
  updatedSnapshot: PerformanceSnapshot;
  shouldTriggerHint: boolean;
  adaptationNotice?: string;
} {
  const consecutiveCorrect = isCorrect ? currentSnapshot.consecutiveCorrect + 1 : 0;
  const consecutiveIncorrect = isCorrect ? 0 : currentSnapshot.consecutiveIncorrect + 1;

  const shouldTriggerHint = consecutiveIncorrect >= ADAPTIVE_RULES.HINT_AFTER_MISTAKES;

  let adaptationNotice: string | undefined;
  if (shouldTriggerHint) {
    adaptationNotice = 'Hint unlocked to support your thinking on this question.';
  } else if (consecutiveCorrect >= ADAPTIVE_RULES.CONSECUTIVE_SUCCESS_FOR_ADVANCE) {
    adaptationNotice = 'Excellent streak! Keep going for higher difficulty challenges.';
  }

  return {
    updatedSnapshot: {
      ...currentSnapshot,
      consecutiveCorrect,
      consecutiveIncorrect,
    },
    shouldTriggerHint,
    adaptationNotice,
  };
}
