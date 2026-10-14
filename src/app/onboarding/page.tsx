'use client';

// ============================================================
// SenseLearn — 5-Step Learner Onboarding Wizard
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles, CheckCircle2, ArrowRight, ArrowLeft, Eye,
  Headphones, BookOpen, MousePointerClick, Layers, Type,
  Volume2, ListChecks, Lightbulb, Repeat, Minimize2, Clock,
  GraduationCap, Brain, MessageSquare, Puzzle, Database,
  Grid3x3, Heart, Palette, Wrench, Check
  , Camera, CameraOff, ShieldCheck
} from 'lucide-react';
import {
  LEARNING_PREFERENCES,
  SUPPORT_PREFERENCES,
  LEARNING_DOMAINS,
  ONBOARDING_STEPS,
  APP_NAME
} from '@/lib/constants';
import type { LearningPreference, SupportPreference, AssessmentSnapshot, CameraConsent, EventType } from '@/lib/data/models';
import { generateId } from '@/lib/utils';
import { learnerProfileService } from '@/lib/services/learner-profile-service';
import { assessmentService } from '@/lib/services/assessment-service';
import { authService, type AuthSession } from '@/lib/services/auth-service';
import { AssessmentEngine } from '@/components/assessment/assessment-engine';
import { db } from '@/lib/data/store';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [session, setSession] = useState<AuthSession | null>(null);

  // Form State
  const [displayName, setDisplayName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Intermediate');
  const [learningPreferences, setLearningPreferences] = useState<LearningPreference[]>(['visual', 'interactive']);
  const [selectedDomains, setSelectedDomains] = useState<string[]>(['dom-pat', 'dom-prob', 'dom-mem', 'dom-read']);
  const [supportPreferences, setSupportPreferences] = useState<SupportPreference[]>(['hints', 'step_by_step', 'audio_assistance']);
  const [baselineAssessment, setBaselineAssessment] = useState<any | null>(null);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraMessage, setCameraMessage] = useState('Camera is off. You can complete the assessment without it.');
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const active = authService.getCurrentSession();
    if (!active) {
      router.push('/auth/login?redirect=/onboarding');
      return;
    }

    if (active.user.role !== 'learner') {
      router.push(active.user.role === 'educator' ? '/educator/dashboard' : '/admin/dashboard');
      return;
    }

    // Check if existing learner already completed baseline assessment
    const profile = db.learnerProfiles.findByUserId(active.user.id);
    if (profile && profile.baselineCompleted) {
      // Existing learner: do NOT show initial onboarding flow again
      router.push('/learner/dashboard');
      return;
    }

    setSession(active);
    setDisplayName(active.user.name);
    return () => cameraStreamRef.current?.getTracks().forEach(track => track.stop());
  }, [router]);

  useEffect(() => {
    if (cameraEnabled && videoRef.current && cameraStreamRef.current) {
      videoRef.current.srcObject = cameraStreamRef.current;
    }
  }, [cameraEnabled, assessmentStarted]);

  // Toggle selection helpers
  const toggleLearningPref = (id: LearningPreference) => {
    setLearningPreferences(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleDomain = (id: string) => {
    setSelectedDomains(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const toggleSupportPref = (id: SupportPreference) => {
    setSupportPreferences(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleNextStep = () => {
    if (currentStep === 4) {
      // Complete profile and initialize baseline assessment
      const learnerId = session?.user.id || 'usr-lrn-1';
      learnerProfileService.completeOnboarding(learnerId, {
        learningPreferences,
        supportPreferences,
        selectedDomains,
      });

      const newAsm = assessmentService.startBaselineAssessment(learnerId);
      setBaselineAssessment(newAsm);
      setCurrentStep(5);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const startAssessmentWithCamera = async () => {
    const stream = await navigator.mediaDevices?.getUserMedia({ video: true, audio: false }).catch(() => null);
    if (!stream) {
      setCameraMessage('Camera permission was not available. You can continue without camera analysis.');
      return;
    }
    cameraStreamRef.current = stream;
    if (videoRef.current) videoRef.current.srcObject = stream;
    setCameraEnabled(true);
    setCameraMessage('Camera is active. Only selected assessment-event snapshots may be captured.');
    if (baselineAssessment && session?.user.id) {
      const consent: CameraConsent = { id: `consent-${generateId()}`, learnerId: session.user.id, assessmentId: baselineAssessment.id, granted: true, grantedAt: new Date().toISOString(), snapshotCollectionEnabled: true };
      db.cameraConsents.create(consent);
    }
    setAssessmentStarted(true);
  };

  const startAssessmentWithoutCamera = () => {
    if (baselineAssessment && session?.user.id) {
      const consent: CameraConsent = { id: `consent-${generateId()}`, learnerId: session.user.id, assessmentId: baselineAssessment.id, granted: false, grantedAt: new Date().toISOString(), snapshotCollectionEnabled: false };
      db.cameraConsents.create(consent);
    }
    setCameraMessage('Continuing without camera analysis. Your answers and test interactions are still recorded.');
    setAssessmentStarted(true);
  };

  const captureAssessmentSnapshot = (event: { eventType: EventType; questionId: string; responseTimeMs?: number; attemptNumber?: number }) => {
    if (!cameraEnabled || !videoRef.current || !baselineAssessment || !session?.user.id) return;
    const video = videoRef.current;
    if (video.readyState < 2 || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const snapshot: AssessmentSnapshot = { id: `snapshot-${generateId()}`, learnerId: session.user.id, assessmentId: baselineAssessment.id, questionId: event.questionId, timestamp: new Date().toISOString(), questionState: event.eventType === 'question_viewed' ? 'question_viewed' : 'question_completed', responseTimeMs: event.responseTimeMs, attemptNumber: event.attemptNumber, cameraConsent: true, interactionEvent: event.eventType, imageData: canvas.toDataURL('image/jpeg', 0.65) };
    db.assessmentSnapshots.create(snapshot);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2 border border-teal-200/60">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Learner Setup & Calibration</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome to {APP_NAME}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Let&apos;s personalize your interactive multisensory learning experience
          </p>
        </div>

        {/* 5-Step Progress Tabs */}
        {currentStep < 5 && (
          <div className="grid grid-cols-5 gap-2 mb-8">
            {ONBOARDING_STEPS.map((step) => {
              const isActive = step.id === currentStep;
              const isPast = step.id < currentStep;

              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isActive
                      ? 'bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-600/20'
                      : isPast
                      ? 'bg-white border-teal-200 text-teal-700'
                      : 'bg-white/60 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider">
                    Step {step.id}
                  </div>
                  <div className="text-xs font-bold truncate mt-0.5">
                    {step.title}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 1: Basic Information */}
        {/* ============================================================ */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Step 1: Tell Us About Yourself</h2>
            <p className="text-xs text-slate-500 mb-6">This information helps us address you and calibrate starting difficulty.</p>

            <div className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Preferred Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Current Learning Stage</label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                >
                  <option value="Foundational">Foundational / Primary Skills</option>
                  <option value="Intermediate">Intermediate Skills</option>
                  <option value="Advanced">Advanced / Secondary Skills</option>
                  <option value="LifeSkills">Practical & Life Skills Focus</option>
                </select>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleNextStep}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-teal-600/20 flex items-center gap-2"
              >
                <span>Continue to Learning Style</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 2: Learning Preferences (Visual, Audio, Text, Interactive, Mixed) */}
        {/* ============================================================ */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Step 2: How Do You Prefer to Learn?</h2>
            <p className="text-xs text-slate-500 mb-6">Select all modalities that feel most comfortable for you.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {LEARNING_PREFERENCES.map((pref) => {
                const isSelected = learningPreferences.includes(pref.id as LearningPreference);

                return (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => toggleLearningPref(pref.id as LearningPreference)}
                    className={`p-4 rounded-2xl border text-left transition flex items-start justify-between ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-600/20'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <span>{pref.label}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{pref.description}</p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 ml-2">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={handlePrevStep}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={handleNextStep}
                disabled={learningPreferences.length === 0}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-teal-600/20 flex items-center gap-2 disabled:opacity-50"
              >
                <span>Continue to Learning Areas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 3: Learning Domains Selection */}
        {/* ============================================================ */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Step 3: What Would You Like to Practice?</h2>
            <p className="text-xs text-slate-500 mb-6">Choose the domain areas you want included in your personalized learning path.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {LEARNING_DOMAINS.map((domain) => {
                const isSelected = selectedDomains.includes(domain.id);

                return (
                  <button
                    key={domain.id}
                    type="button"
                    onClick={() => toggleDomain(domain.id)}
                    className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-600/20'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 text-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold truncate">{domain.name}</span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={handlePrevStep}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={handleNextStep}
                disabled={selectedDomains.length === 0}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-teal-600/20 flex items-center gap-2 disabled:opacity-50"
              >
                <span>Continue to Support Needs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 4: Support Preferences (Hints, Guidance, Audio, Extra Time) */}
        {/* ============================================================ */}
        {currentStep === 4 && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Step 4: How Can We Best Support You?</h2>
            <p className="text-xs text-slate-500 mb-6">Choose helpful features you want active during activities.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {SUPPORT_PREFERENCES.map((support) => {
                const isSelected = supportPreferences.includes(support.id as SupportPreference);

                return (
                  <button
                    key={support.id}
                    type="button"
                    onClick={() => toggleSupportPref(support.id as SupportPreference)}
                    className={`p-4 rounded-2xl border text-left transition flex items-start justify-between ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-600/20'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 mb-1">{support.label}</div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{support.description}</p>
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 ml-2">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={handlePrevStep}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={handleNextStep}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-teal-600/20 flex items-center gap-2"
              >
                <span>Start Baseline Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 5: Baseline Assessment Engine */}
        {/* ============================================================ */}
        {currentStep === 5 && baselineAssessment && (
          <div>
            <div className="mb-4 text-center">
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                Step 5 of 5 • Initial Diagnostic Calibration
              </span>
            </div>
            {!assessmentStarted ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md max-w-3xl mx-auto">
                <div className="flex items-start gap-3"><ShieldCheck className="w-6 h-6 text-teal-600 shrink-0" /><div><h2 className="text-xl font-bold text-slate-900">Before you begin</h2><p className="text-sm text-slate-600 mt-2">This baseline test uses different question formats to understand your current learning level across pattern recognition, memory, problem solving, reading, comprehension, numerical reasoning, and academic skills.</p></div></div>
                <div className="grid sm:grid-cols-2 gap-3 mt-6 text-xs text-slate-600"><div className="p-4 rounded-2xl bg-slate-50 border border-slate-200"><strong className="block text-slate-900 mb-1">What we record</strong>Answers, response time, answer changes, hints, skipped questions, retries, revisits, and completion.</div><div className="p-4 rounded-2xl bg-slate-50 border border-slate-200"><strong className="block text-slate-900 mb-1">How results are used</strong>To identify academic strengths, developing areas, observable response patterns, and a personalized learning path. This is not a medical or psychological diagnosis.</div></div>
                <div className="mt-6 p-4 rounded-2xl border border-teal-200 bg-teal-50/60"><div className="flex items-center justify-between"><div><strong className="block text-sm text-slate-900">Optional camera snapshots</strong><p className="text-xs text-slate-600 mt-1">With your permission, temporary snapshots may be captured when a question is viewed or completed. Raw video is not continuously stored.</p></div>{cameraEnabled ? <Camera className="w-6 h-6 text-teal-600" /> : <CameraOff className="w-6 h-6 text-slate-400" />}</div>{cameraEnabled && <video ref={videoRef} autoPlay muted playsInline className="mt-4 w-full max-w-xs h-40 object-cover rounded-xl border border-teal-300" />}</div>
                <p className="text-xs text-slate-500 mt-4">{cameraMessage}</p>
                <div className="flex flex-col sm:flex-row gap-3 mt-6"><button onClick={startAssessmentWithCamera} className="flex-1 px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"><Camera className="w-4 h-4" /> Allow Camera &amp; Begin</button><button onClick={startAssessmentWithoutCamera} className="flex-1 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2"><CameraOff className="w-4 h-4" /> Continue Without Camera</button></div>
              </div>
            ) : (
              <>
                {cameraEnabled && <div className="mb-3 flex items-center justify-end gap-2 text-xs font-semibold text-teal-700"><Camera className="w-4 h-4" /> Camera Active <button onClick={() => { cameraStreamRef.current?.getTracks().forEach(track => track.stop()); cameraStreamRef.current = null; setCameraEnabled(false); setCameraMessage('Camera turned off. The assessment continues without camera analysis.'); }} className="underline">Turn off</button></div>}
                <div className="flex flex-col lg:flex-row items-start gap-4">
                  <div className="min-w-0 flex-1 w-full">
                    <AssessmentEngine assessment={baselineAssessment} questions={db.questions.findByIds(baselineAssessment.questionIds)} learnerId={session?.user.id || 'usr-lrn-1'} onInteraction={captureAssessmentSnapshot} onComplete={() => { captureAssessmentSnapshot({ eventType: 'assessment_completed', questionId: baselineAssessment.questionIds[baselineAssessment.questionIds.length - 1] }); }} />
                  </div>
                  {cameraEnabled && <aside className="w-full lg:w-56 lg:sticky lg:top-6 bg-white rounded-2xl border border-teal-200 p-3 shadow-sm"><div className="flex items-center gap-2 text-xs font-bold text-teal-700 mb-2"><Camera className="w-4 h-4" /> Live camera preview</div><video ref={videoRef} autoPlay muted playsInline className="w-full aspect-video object-cover rounded-xl border border-teal-100 bg-slate-900" /><p className="text-[10px] leading-relaxed text-slate-500 mt-2">Preview is shown only after permission. Selected event snapshots may be captured; continuous video is not stored.</p></aside>}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
