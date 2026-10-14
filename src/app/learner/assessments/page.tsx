'use client';

// ============================================================
// SenseLearn — Assessments & Continuous Reassessment Hub
// Demonstrates measurable growth (Previous vs Current Profile)
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  ClipboardList, Sparkles, TrendingUp, Play, CheckCircle2,
  Brain, ArrowRight, RotateCcw, Award, Check
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { AssessmentEngine } from '@/components/assessment/assessment-engine';
import { authService, type AuthSession } from '@/lib/services/auth-service';
import { assessmentService } from '@/lib/services/assessment-service';
import { db } from '@/lib/data/store';
import { formatDate, getSkillLevelLabel } from '@/lib/utils';
import type { Assessment } from '@/lib/data/models';

export default function AssessmentsPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);

  useEffect(() => {
    let active = authService.getCurrentSession();
    if (!active || active.user.role !== 'learner') {
      authService.switchDemoUser('learner');
      active = authService.getCurrentSession();
    }
    setSession(active);

    const learnerId = active?.user.id || 'usr-lrn-1';
    const list = assessmentService.getLearnerAssessments(learnerId);
    setAssessments(list);
  }, []);

  const handleStartPeriodic = () => {
    if (!session) return;
    const newAsm = assessmentService.startPeriodicReassessment(session.user.id);
    setActiveAssessment(newAsm);
  };

  const handleStartBaseline = () => {
    if (!session) return;
    const newAsm = assessmentService.startBaselineAssessment(session.user.id);
    setActiveAssessment(newAsm);
  };

  // Active Assessment View
  if (activeAssessment && session) {
    const questions = db.questions.findByIds(activeAssessment.questionIds);

    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar currentRole="learner" userSession={session} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            title="Diagnostic Assessment"
            subtitle="Evaluating Observable Problem-Solving Performance"
            userSession={session}
          />
          <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
            <AssessmentEngine
              assessment={activeAssessment}
              questions={questions}
              learnerId={session.user.id}
              onComplete={(completed) => {
                setAssessments(assessmentService.getLearnerAssessments(session.user.id));
              }}
            />
          </main>
        </div>
      </div>
    );
  }

  // Find baseline and latest reassessment for comparative demonstration
  const baseline = assessments.find(a => a.type === 'baseline' && a.status === 'completed');
  const latestReassessment = assessments.find(a => a.type === 'periodic' && a.status === 'completed');

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentRole="learner" userSession={session} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Diagnostic Assessments & Growth"
          subtitle="Continuous Reassessment & Comparative Skill Profiles"
          userSession={session}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8 max-w-7xl">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2 border border-teal-200/60">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Continuous Reassessment Loop</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Evaluate Your Growth Over Time
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                Diagnostic assessments measure your observable problem-solving, pattern recognition, and working memory to recalibrate your personalized learning path.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleStartPeriodic}
                className="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-teal-600/20 flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Take Periodic Reassessment</span>
              </button>
            </div>
          </div>

          {/* Continuous Reassessment Comparison (Previous Profile vs Current Profile) */}
          {baseline && latestReassessment && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Continuous Growth Profile Comparison</h2>
                  <p className="text-xs text-slate-500">
                    Baseline Assessment ({formatDate(baseline.completedAt || baseline.startedAt)}) vs Periodic Reassessment ({formatDate(latestReassessment.completedAt || latestReassessment.startedAt)})
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Demonstrated Growth</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {latestReassessment.skillScores.map((currentSkill) => {
                  const baseSkill = baseline.skillScores.find(b => b.skillId === currentSkill.skillId);
                  const baseScore = baseSkill?.score || 55;
                  const delta = currentSkill.score - baseScore;

                  return (
                    <div
                      key={currentSkill.skillId}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 transition hover:border-teal-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-900">{currentSkill.skillName}</span>
                          <span className="text-[10px] uppercase font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {currentSkill.domainName}
                          </span>
                        </div>

                        {/* Side by side comparison */}
                        <div className="flex items-center justify-between my-3 text-center">
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex-1 mr-2">
                            <span className="text-[10px] text-slate-400 font-semibold block">Previous</span>
                            <span className="text-base font-extrabold text-slate-700">{baseScore}%</span>
                          </div>
                          <span className="text-slate-400 font-bold">➔</span>
                          <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 flex-1 ml-2">
                            <span className="text-[10px] text-teal-600 font-semibold block">Current</span>
                            <span className="text-base font-extrabold text-teal-700">{currentSkill.score}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500">
                          {getSkillLevelLabel(currentSkill.level)}
                        </span>
                        <span className={`text-xs font-extrabold flex items-center gap-0.5 ${delta >= 0 ? 'text-emerald-600' : 'text-slate-600'}`}>
                          <TrendingUp className="w-3.5 h-3.5" />
                          +{delta}% Growth
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Assessment History Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4">Assessment History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Type</th>
                    <th className="pb-3 font-semibold">Date Completed</th>
                    <th className="pb-3 font-semibold">Accuracy</th>
                    <th className="pb-3 font-semibold">Correct / Total</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {assessments.map((asm) => (
                    <tr key={asm.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 font-bold text-slate-900 capitalize">
                        {asm.type} Assessment
                      </td>
                      <td className="py-3.5 text-slate-500">
                        {formatDate(asm.completedAt || asm.startedAt)}
                      </td>
                      <td className="py-3.5 font-extrabold text-teal-700">
                        {asm.accuracy}%
                      </td>
                      <td className="py-3.5 text-slate-600">
                        {asm.correctAnswers} / {asm.totalQuestions} questions
                      </td>
                      <td className="py-3.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
