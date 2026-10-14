'use client';

// ============================================================
// SenseLearn — Interactive Multisensory Activity Engine
// Combines Text + Visual + Audio + Interaction with real-time
// event tracking and transparent adaptive difficulty adjustment
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Play, Pause, RotateCcw, Volume2, Lightbulb, ArrowRight,
  CheckCircle2, XCircle, Sparkles, HelpCircle, Check, AlertCircle,
  Eye, Layers, ArrowLeft, Trophy, Zap
} from 'lucide-react';
import type { Activity, Question, LearningSession, AdaptationResult } from '@/lib/data/models';
import { activityService } from '@/lib/services/activity-service';
import { interactionTrackingService } from '@/lib/services/interaction-tracking-service';
import { speakText, stopSpeaking, formatDuration, getDifficultyColor } from '@/lib/utils';
import { useAccessibility } from '@/lib/hooks/use-accessibility';

interface ActivityEngineProps {
  activity: Activity;
  questions: Question[];
  learnerId: string;
  onExit?: () => void;
}

export function ActivityEngine({
  activity,
  questions,
  learnerId,
  onExit,
}: ActivityEngineProps) {
  const router = useRouter();
  const { settings } = useAccessibility();

  // Engine state
  const [session, setSession] = useState<LearningSession | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>('');
  const [matchingState, setMatchingState] = useState<Record<string, string>>({});
  const [orderState, setOrderState] = useState<string[]>([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation?: string } | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintsUsedCount, setHintsUsedCount] = useState<number>(0);
  const [retriesCount, setRetriesCount] = useState<number>(0);
  const [attemptsOnCurrent, setAttemptsOnCurrent] = useState<number>(1);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [adaptationSummary, setAdaptationSummary] = useState<AdaptationResult | null>(null);

  const sessionStartTimeRef = useRef<number>(Date.now());
  const questionStartTimeRef = useRef<number>(Date.now());

  const currentQuestion = questions[currentIndex];

  // Initialize session
  useEffect(() => {
    const newSession = activityService.startSession({
      learnerId,
      activityId: activity.id,
    });
    setSession(newSession);
    sessionStartTimeRef.current = Date.now();
    questionStartTimeRef.current = Date.now();

    return () => {
      stopSpeaking();
    };
  }, [activity.id, learnerId]);

  // Handle question changes
  useEffect(() => {
    questionStartTimeRef.current = Date.now();
    setSelectedAnswer('');
    setIsAnswerSubmitted(false);
    setFeedback(null);
    setShowHint(false);
    setAttemptsOnCurrent(1);

    if (currentQuestion && session) {
      if (currentQuestion.type === 'ordering' && currentQuestion.orderItems) {
        setOrderState([...currentQuestion.orderItems].sort(() => Math.random() - 0.5));
      } else {
        setOrderState([]);
      }

      setMatchingState({});

      // Track question_viewed event
      interactionTrackingService.logEvent({
        learnerId,
        sessionId: session.id,
        activityId: activity.id,
        questionId: currentQuestion.id,
        eventType: 'question_viewed',
      });

      // Multisensory Audio assistance
      if (settings.audioAssistance) {
        speakText(currentQuestion.audioText || currentQuestion.text);
      }
    }

    return () => {
      stopSpeaking();
    };
  }, [currentIndex, currentQuestion, session, activity.id, learnerId, settings.audioAssistance]);

  // Audio Play Button
  const handlePlayAudio = () => {
    if (currentQuestion) {
      speakText(currentQuestion.audioText || currentQuestion.text);
    }
  };

  // Pause / Resume
  const handleTogglePause = () => {
    if (!session) return;
    if (!isPaused) {
      activityService.pauseSession(session.id, learnerId, activity.id);
      setIsPaused(true);
      stopSpeaking();
    } else {
      activityService.resumeSession(session.id, learnerId, activity.id);
      setIsPaused(false);
    }
  };

  // Handle Answer Selection
  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted || isPaused) return;
    setSelectedAnswer(optionId);
  };

  // Move Ordering Item
  const handleMoveOrderItem = (fromIdx: number, toIdx: number) => {
    if (isAnswerSubmitted || fromIdx < 0 || toIdx < 0 || toIdx >= orderState.length) return;
    const updated = [...orderState];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setOrderState(updated);
    setSelectedAnswer(updated);
  };

  // Use Hint
  const handleUseHint = () => {
    if (!session || !currentQuestion) return;
    setShowHint(true);
    setHintsUsedCount(prev => prev + 1);

    // Track hint_used event
    interactionTrackingService.logEvent({
      learnerId,
      sessionId: session.id,
      activityId: activity.id,
      questionId: currentQuestion.id,
      eventType: 'hint_used',
      attemptNumber: attemptsOnCurrent,
    });

    if (currentQuestion.hint) {
      speakText(`Hint: ${currentQuestion.hint}`);
    }
  };

  // Submit Answer
  const handleSubmitAnswer = () => {
    if (!session || !currentQuestion || isAnswerSubmitted || isPaused) return;

    const responseTimeMs = Date.now() - questionStartTimeRef.current;
    let isCorrect = false;

    if (currentQuestion.type === 'ordering') {
      if (Array.isArray(orderState) && Array.isArray(currentQuestion.correctAnswer)) {
        isCorrect = JSON.stringify(orderState) === JSON.stringify(currentQuestion.correctAnswer);
      } else {
        isCorrect = true;
      }
    } else if (currentQuestion.type === 'matching') {
      isCorrect = true;
    } else {
      isCorrect = String(selectedAnswer).trim().toLowerCase() === String(currentQuestion.correctAnswer).trim().toLowerCase();
    }

    // Track answer_submitted event
    interactionTrackingService.logEvent({
      learnerId,
      sessionId: session.id,
      activityId: activity.id,
      questionId: currentQuestion.id,
      eventType: 'answer_submitted',
      responseTimeMs,
      attemptNumber: attemptsOnCurrent,
      success: isCorrect,
    });

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      speakText('Excellent! Correct answer.');
    } else {
      speakText('Not quite. Review the explanation or try again.');
    }

    setIsAnswerSubmitted(true);
    setFeedback({
      isCorrect,
      explanation: currentQuestion.explanation,
    });
  };

  // Retry Question
  const handleRetry = () => {
    if (!session || !currentQuestion) return;
    setRetriesCount(prev => prev + 1);
    setAttemptsOnCurrent(prev => prev + 1);
    setIsAnswerSubmitted(false);
    setFeedback(null);
    questionStartTimeRef.current = Date.now();

    // Track retry_attempt event
    interactionTrackingService.logEvent({
      learnerId,
      sessionId: session.id,
      activityId: activity.id,
      questionId: currentQuestion.id,
      eventType: 'retry_attempt',
      attemptNumber: attemptsOnCurrent + 1,
    });
  };

  // Next Question or Complete
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      if (!session) return;
      const totalTimeMs = Date.now() - sessionStartTimeRef.current;

      const completionResult = activityService.completeSession({
        sessionId: session.id,
        learnerId,
        activityId: activity.id,
        questionsAttempted: questions.length,
        questionsCorrect: correctCount + (feedback?.isCorrect ? 1 : 0),
        hintsUsed: hintsUsedCount,
        retryCount: retriesCount,
        totalTimeMs,
      });

      setIsCompleted(true);
      setAdaptationSummary(completionResult.adaptation);
    }
  };

  // ------------------------------------------------------------
  // COMPLETION VIEW (Adaptive Difficulty Adjustment Display)
  // ------------------------------------------------------------
  if (isCompleted && session) {
    const accuracy = Math.round(((correctCount) / Math.max(1, questions.length)) * 100);

    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md max-w-2xl mx-auto my-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-teal-50/50 shadow-inner">
          <Trophy className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Activity Completed!
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          {activity.title} • {activity.points} Points Earned
        </p>

        {/* Performance Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-semibold text-slate-500 block">Accuracy</span>
            <span className="text-xl font-extrabold text-teal-600 mt-0.5 block">{accuracy}%</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-semibold text-slate-500 block">Correct</span>
            <span className="text-xl font-extrabold text-blue-600 mt-0.5 block">
              {correctCount} / {questions.length}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-semibold text-slate-500 block">Hints Used</span>
            <span className="text-xl font-extrabold text-amber-600 mt-0.5 block">
              {hintsUsedCount}
            </span>
          </div>
        </div>

        {/* Adaptive Difficulty Explanation */}
        {adaptationSummary && (
          <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200/70 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-900">
                Adaptive Learning Engine Update
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-800 mb-1">
              Target Difficulty: <span className="uppercase text-teal-700 font-extrabold">{adaptationSummary.newDifficulty}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {adaptationSummary.explanation}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => router.push('/learner/learn')}
            className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-teal-600/20 flex items-center justify-center gap-2"
          >
            <span>Next Activity</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.push('/learner/dashboard')}
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------
  // PAUSED STATE VIEW
  // ------------------------------------------------------------
  if (isPaused) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md max-w-md mx-auto my-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <Pause className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Activity Paused</h3>
        <p className="text-xs text-slate-500 mb-6">Take a break whenever you need. Your progress is saved.</p>
        <button
          onClick={handleTogglePause}
          className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
        >
          Resume Activity
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-600 font-semibold">No questions configured for this activity.</p>
      </div>
    );
  }

  // ------------------------------------------------------------
  // ACTIVE MULTISENSORY QUESTION VIEW
  // ------------------------------------------------------------
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md max-w-3xl mx-auto overflow-hidden">
      {/* Top Activity Bar */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit || (() => router.push('/learner/learn'))}
            className="p-1.5 rounded-lg hover:bg-white text-slate-500 hover:text-slate-900 transition"
            title="Exit Activity"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-slate-900">{activity.title}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getDifficultyColor(activity.difficulty)}`}>
                {activity.difficulty}
              </span>
              <span className="text-[11px] text-slate-500">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Multisensory Badge Indicator */}
          <div className="hidden sm:flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
            <Eye className="w-3 h-3 text-teal-500" />
            <Volume2 className="w-3 h-3 text-blue-500" />
            <Zap className="w-3 h-3 text-amber-500" />
            <span>Multisensory</span>
          </div>

          <button
            onClick={handlePlayAudio}
            title="Hear instruction read aloud"
            className="p-2 rounded-xl bg-white border border-slate-200 text-teal-600 hover:bg-teal-50 transition shadow-2xs"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleTogglePause}
            title="Pause activity"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition shadow-2xs"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
        <div
          className="bg-teal-500 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Main Body */}
      <div className="p-6 sm:p-8">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed mb-6">
          {currentQuestion.text}
        </h3>

        {/* 1. Multiple Choice / Image Choice / Scenario / Memory */}
        {(currentQuestion.type === 'multiple_choice' ||
          currentQuestion.type === 'image_choice' ||
          currentQuestion.type === 'scenario' ||
          currentQuestion.type === 'memory' ||
          currentQuestion.type === 'true_false' ||
          currentQuestion.type === 'pattern_recognition') && currentQuestion.options && (
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedAnswer === opt.id;
              let borderStyle = 'border-slate-200 hover:border-slate-300 bg-slate-50/50';

              if (isSelected) {
                borderStyle = 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-600/20';
              }

              if (isAnswerSubmitted) {
                if (opt.isCorrect) {
                  borderStyle = 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/30';
                } else if (isSelected && !opt.isCorrect) {
                  borderStyle = 'border-red-500 bg-red-50 ring-2 ring-red-400/30';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={isAnswerSubmitted}
                  className={`w-full text-left p-4 rounded-2xl border font-medium text-sm transition flex items-center justify-between ${borderStyle}`}
                >
                  <span className="text-slate-800">{opt.text}</span>
                  {isSelected && !isAnswerSubmitted && (
                    <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 ml-2">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                  {isAnswerSubmitted && opt.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                  )}
                  {isAnswerSubmitted && isSelected && !opt.isCorrect && (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* 2. Ordering Drag/Swap Items */}
        {currentQuestion.type === 'ordering' && (
          <div className="space-y-2 mb-6">
            <p className="text-xs font-semibold text-slate-500 mb-2">
              Arrange items into the correct order:
            </p>
            {orderState.map((item, idx) => (
              <div
                key={item}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-sm font-medium text-slate-800"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-teal-600/10 text-teal-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </div>
                {!isAnswerSubmitted && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveOrderItem(idx, idx - 1)}
                      disabled={idx === 0}
                      className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 disabled:opacity-30 hover:bg-slate-100"
                    >
                      ▲ Up
                    </button>
                    <button
                      onClick={() => handleMoveOrderItem(idx, idx + 1)}
                      disabled={idx === orderState.length - 1}
                      className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 disabled:opacity-30 hover:bg-slate-100"
                    >
                      ▼ Down
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 3. Matching Pairs */}
        {currentQuestion.type === 'matching' && currentQuestion.matchingPairs && (
          <div className="space-y-3 mb-6">
            <p className="text-xs font-semibold text-slate-500 mb-2">
              Match items with their corresponding pairs:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestion.matchingPairs.map((pair, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-900 mb-1">{pair.left}</div>
                  <div className="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-1 rounded-lg border border-teal-200/50">
                    ➔ {pair.right}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hint Box */}
        {showHint && currentQuestion.hint && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Hint:</span>
              <p className="leading-relaxed">{currentQuestion.hint}</p>
            </div>
          </div>
        )}

        {/* Answer Feedback & Explanation */}
        {feedback && (
          <div
            className={`mb-6 p-4 rounded-2xl border text-xs leading-relaxed ${
              feedback.isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1">
              {feedback.isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Correct!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Explanation & Guided Strategy:</span>
                </>
              )}
            </div>
            <p>{feedback.explanation || 'Good attempt solving this activity.'}</p>
          </div>
        )}

        {/* Bottom Bar Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {!isAnswerSubmitted ? (
            <>
              {currentQuestion.hint ? (
                <button
                  onClick={handleUseHint}
                  disabled={showHint}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <span>{showHint ? 'Hint Active' : 'Need a Hint?'}</span>
                </button>
              ) : <div />}

              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer && currentQuestion.type !== 'ordering' && currentQuestion.type !== 'matching'}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition shadow-sm hover:shadow disabled:opacity-40 flex items-center gap-2"
              >
                <span>Check Solution</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              {!feedback?.isCorrect ? (
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Question</span>
                </button>
              ) : <div />}

              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-teal-600/20 flex items-center gap-2 ml-auto"
              >
                <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Activity'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
