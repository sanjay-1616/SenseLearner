'use client';

// ============================================================
// SenseLearn — Baseline & Periodic Assessment Engine
// Handles 8 question types, timer recording, hint tracking,
// and real-time skill profile generation
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Volume2, Lightbulb, CheckCircle2, XCircle, ArrowRight,
  RotateCcw, Sparkles, HelpCircle, Eye, Check, AlertCircle, Play
} from 'lucide-react';
import type { Question, Assessment, EventType } from '@/lib/data/models';
import { db } from '@/lib/data/store';
import { assessmentService } from '@/lib/services/assessment-service';
import { speakText, stopSpeaking, formatDuration, generateId } from '@/lib/utils';
import { useAccessibility } from '@/lib/hooks/use-accessibility';
import { SkillRadar } from '../dashboard/skill-radar';

interface AssessmentEngineProps {
  assessment: Assessment;
  questions: Question[];
  learnerId: string;
  onComplete?: (completedAssessment: Assessment) => void;
  onInteraction?: (event: { eventType: EventType; questionId: string; responseTimeMs?: number; attemptNumber?: number }) => void;
}

export function AssessmentEngine({
  assessment: initialAssessment,
  questions,
  learnerId,
  onComplete,
  onInteraction,
}: AssessmentEngineProps) {
  const router = useRouter();
  const { settings } = useAccessibility();

  const [assessment, setAssessment] = useState<Assessment>(initialAssessment);
  const [currentIndex, setCurrentIndex] = useState<number>(initialAssessment.currentQuestionIndex || 0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>('');
  const [matchingState, setMatchingState] = useState<Record<string, string>>({});
  const [orderState, setOrderState] = useState<string[]>([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation?: string } | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintUsedCount, setHintUsedCount] = useState<number>(0);
  const [answerChanges, setAnswerChanges] = useState<number>(0);
  const [attemptsOnCurrent, setAttemptsOnCurrent] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(initialAssessment.status === 'completed');
  const [completedAssessmentData, setCompletedAssessmentData] = useState<Assessment | null>(
    initialAssessment.status === 'completed' ? initialAssessment : null
  );

  const questionStartTimeRef = useRef<number>(Date.now());
  const currentQuestion = questions[currentIndex];

  // Initialize question state on step change
  useEffect(() => {
    questionStartTimeRef.current = Date.now();
    setSelectedAnswer('');
    setAnswerChanges(0);
    setIsAnswerSubmitted(false);
    setFeedback(null);
    setShowHint(false);
    setAttemptsOnCurrent(1);

    if (currentQuestion) {
      if (currentQuestion.type === 'ordering' && currentQuestion.orderItems) {
        // Shuffle order items initially
        setOrderState([...currentQuestion.orderItems].sort(() => Math.random() - 0.5));
      } else {
        setOrderState([]);
      }

      setMatchingState({});
      db.interactionEvents.create({ id: `evt-${generateId()}`, learnerId, sessionId: assessment.id, activityId: assessment.id, questionId: currentQuestion.id, eventType: 'question_viewed', timestamp: new Date().toISOString() });
      onInteraction?.({ eventType: 'question_viewed', questionId: currentQuestion.id });

      // Auto audio narration if enabled in accessibility settings
      if (settings.audioAssistance) {
        speakText(currentQuestion.audioText || currentQuestion.text);
      }
    }

    return () => {
      stopSpeaking();
    };
  }, [currentIndex, currentQuestion, settings.audioAssistance, onInteraction]);

  if (!currentQuestion && !isCompleted) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-600 font-semibold">No questions loaded for this assessment.</p>
      </div>
    );
  }

  // Handle Play Audio Prompt
  const handlePlayAudio = () => {
    if (currentQuestion) {
      speakText(currentQuestion.audioText || currentQuestion.text);
    }
  };

  // Handle Answer Selection
  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted) return;
    if (selectedAnswer && selectedAnswer !== optionId) setAnswerChanges(prev => prev + 1);
    setSelectedAnswer(optionId);
  };

  // Handle Matching Select
  const handleMatchPair = (leftItem: string, rightItem: string) => {
    if (isAnswerSubmitted) return;
    const updated = { ...matchingState, [leftItem]: rightItem };
    setMatchingState(updated);
    setSelectedAnswer('matched_all');
  };

  // Handle Ordering Item Swap
  const handleMoveOrderItem = (fromIdx: number, toIdx: number) => {
    if (isAnswerSubmitted || fromIdx < 0 || toIdx < 0 || toIdx >= orderState.length) return;
    const updated = [...orderState];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setOrderState(updated);
    setSelectedAnswer(updated);
  };

  // Handle Hint Request
  const handleUseHint = () => {
    setShowHint(true);
    setHintUsedCount(prev => prev + 1);
    if (currentQuestion?.hint) {
      speakText(`Hint: ${currentQuestion.hint}`);
    }
  };

  // Submit Answer for Evaluation
  const handleSubmitAnswer = (skipped = false) => {
    if (!currentQuestion || isAnswerSubmitted) return;

    const responseTimeMs = Date.now() - questionStartTimeRef.current;
    let finalAnswer = skipped ? '' : selectedAnswer;

    if (currentQuestion.type === 'ordering') {
      finalAnswer = orderState;
    }

    const res = assessmentService.submitResponse({
      assessmentId: assessment.id,
      questionId: currentQuestion.id,
      learnerId,
      answer: finalAnswer,
      responseTimeMs,
      attemptNumber: attemptsOnCurrent,
      hintUsed: showHint,
      answerChanges,
      revisited: attemptsOnCurrent > 1,
      skipped,
    });

    db.interactionEvents.create({ id: `evt-${generateId()}`, learnerId, sessionId: assessment.id, activityId: assessment.id, questionId: currentQuestion.id, eventType: skipped ? 'question_skipped' : 'answer_submitted', timestamp: new Date().toISOString(), responseTimeMs, attemptNumber: attemptsOnCurrent, success: res.isCorrect });

    onInteraction?.({
      eventType: skipped ? 'question_skipped' : 'answer_submitted',
      questionId: currentQuestion.id,
      responseTimeMs,
      attemptNumber: attemptsOnCurrent,
    });

    setIsAnswerSubmitted(true);
    setFeedback(res);

    if (res.isCorrect) {
      speakText('Correct! Excellent reasoning.');
    } else {
      speakText('Try again or review the explanation.');
    }
  };

  // Next Question or Complete Assessment
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Complete assessment
      const completed = assessmentService.completeAssessment(assessment.id);
      setIsCompleted(true);
      setCompletedAssessmentData(completed);
      if (onComplete) onComplete(completed);
    }
  };

  // Retry Question
  const handleRetry = () => {
    setIsAnswerSubmitted(false);
    setFeedback(null);
    setAttemptsOnCurrent(prev => prev + 1);
    questionStartTimeRef.current = Date.now();
  };

  // ------------------------------------------------------------
  // COMPLETION VIEW (Learning Support Profile Generation)
  // ------------------------------------------------------------
  if (isCompleted && completedAssessmentData) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md max-w-3xl mx-auto my-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50/50 shadow-inner">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Assessment Completed Successfully
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Your observable educational interaction data has generated your updated Learning Support Profile.
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <span className="text-xs font-semibold text-slate-500 block">Overall Accuracy</span>
            <span className="text-2xl font-extrabold text-teal-600 mt-1 block">
              {completedAssessmentData.accuracy}%
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <span className="text-xs font-semibold text-slate-500 block">Correct Solutions</span>
            <span className="text-2xl font-extrabold text-blue-600 mt-1 block">
              {completedAssessmentData.correctAnswers} / {completedAssessmentData.totalQuestions}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <span className="text-xs font-semibold text-slate-500 block">Assessed Areas</span>
            <span className="text-2xl font-extrabold text-indigo-600 mt-1 block">
              {completedAssessmentData.skillScores.length} Skills
            </span>
          </div>
        </div>

        {/* Generated Learning Support Profile */}
        <div className="mb-8">
          <SkillRadar skillScores={completedAssessmentData.skillScores} title="Your Learning Support Profile" />
        </div>

        {/* Next Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => router.push('/learner/learn')}
            className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-teal-600/20 flex items-center justify-center gap-2"
          >
            <span>Explore Personalized Activities</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.push('/learner/dashboard')}
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------
  // ACTIVE QUESTION VIEW
  // ------------------------------------------------------------
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md max-w-3xl mx-auto overflow-hidden">
      {/* Top Header & Progress */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
            Assessment {currentIndex + 1} of {questions.length}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 capitalize">
              {currentQuestion.difficulty} Level
            </span>
            <button
              onClick={handlePlayAudio}
              title="Hear question read aloud"
              className="p-2 rounded-xl bg-white border border-slate-200 text-teal-600 hover:bg-teal-50 transition shadow-2xs"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Linear Step Indicator */}
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-teal-500 to-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Content Area */}
      <div className="p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed mb-6">
          {currentQuestion.text}
        </h2>

        {/* 1. Multiple Choice / Image Choice / Scenario / Memory / True-False */}
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

        {/* 2. Ordering Question Type */}
        {currentQuestion.type === 'ordering' && (
          <div className="space-y-2 mb-6">
            <p className="text-xs font-semibold text-slate-500 mb-2">
              Use the arrow buttons to arrange items into the correct sequence:
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

        {/* 3. Matching Question Type */}
        {currentQuestion.type === 'matching' && currentQuestion.matchingPairs && (
          <div className="space-y-3 mb-6">
            <p className="text-xs font-semibold text-slate-500 mb-2">
              Match each item with its correct pair:
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

        {/* Hint Disclosure */}
        {showHint && currentQuestion.hint && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Hint:</span>
              <p className="leading-relaxed">{currentQuestion.hint}</p>
            </div>
          </div>
        )}

        {/* Answer Feedback / Explanation */}
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
                  <span>Correct Answer!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Explanation & Learning Support:</span>
                </>
              )}
            </div>
            <p>{feedback.explanation || 'Great effort analyzing this question.'}</p>
          </div>
        )}

        {/* Action Controls */}
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
                  <span>{showHint ? 'Hint Revealed' : 'Get Hint'}</span>
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
              <button
                onClick={() => handleSubmitAnswer(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
              >
                Skip Question
              </button>
              <button
                onClick={() => handleSubmitAnswer()}
                disabled={!selectedAnswer && currentQuestion.type !== 'ordering' && currentQuestion.type !== 'matching'}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition shadow-sm hover:shadow disabled:opacity-40 flex items-center gap-2"
              >
                <span>Submit Answer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              </div>
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
                <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Assessment'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
