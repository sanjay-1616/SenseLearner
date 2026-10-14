'use client';

// ============================================================
// SenseLearn — Recommendations Center
// Transparent data-backed recommendations with clear rationale
// ============================================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles, Brain, ArrowRight, Play, CheckCircle2,
  Lightbulb, Target, RefreshCw
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { authService, type AuthSession } from '@/lib/services/auth-service';
import { recommendationService } from '@/lib/services/recommendation-service';
import { getDifficultyColor } from '@/lib/utils';

export default function RecommendationsPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    let active = authService.getCurrentSession();
    if (!active || active.user.role !== 'learner') {
      authService.switchDemoUser('learner');
      active = authService.getCurrentSession();
    }
    setSession(active);

    const learnerId = active?.user.id || 'usr-lrn-1';
    const list = recommendationService.getRecommendationsForLearner(learnerId);
    setRecommendations(list);
  }, []);

  const handleRefresh = () => {
    if (!session) return;
    const refreshed = recommendationService.refreshRecommendations(session.user.id);
    const updated = recommendationService.getRecommendationsForLearner(session.user.id);
    setRecommendations(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentRole="learner" userSession={session} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Recommended For You"
          subtitle="Algorithmic Recommendations Backed by Observable Assessment Data"
          userSession={session}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8 max-w-7xl">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2 border border-teal-200/60">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Explainable AI Recommendation Engine</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Curated Next Steps For Your Profile
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                Every suggestion explains the exact reason why it was selected — whether to reinforce a developing skill, advance a strength, or match your sensory preferences.
              </p>
            </div>

            <button
              onClick={handleRefresh}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Recalculate Suggestions</span>
            </button>
          </div>

          {/* Recommendations Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-teal-400 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getDifficultyColor(rec.difficulty)}`}>
                      {rec.difficulty}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {rec.domainName}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {rec.activityTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                    {rec.activityDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  {/* Transparent Recommendation Reason */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200/60 text-xs text-teal-950 font-medium mb-4 flex items-start gap-2.5">
                    <Brain className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-0.5">Recommendation Reason:</span>
                      <p className="text-[11px] text-teal-900 leading-relaxed">{rec.reason}</p>
                    </div>
                  </div>

                  <Link
                    href={`/learner/learn?activityId=${rec.activityId}`}
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch Activity</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
