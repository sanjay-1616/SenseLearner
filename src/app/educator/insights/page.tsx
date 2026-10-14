'use client';

// ============================================================
// SenseLearn — Educator Insights Center
// Data-backed pedagogical recommendations synthesized from telemetry
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  Lightbulb, Sparkles, TrendingUp, AlertCircle, Eye,
  CheckCircle2, Users, ArrowRight, ShieldCheck
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { authService, type AuthSession } from '@/lib/services/auth-service';
import { analyticsService, type EducationalInsight } from '@/lib/services/analytics-service';

export default function EducatorInsightsPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [insights, setInsights] = useState<EducationalInsight[]>([]);

  useEffect(() => {
    let active = authService.getCurrentSession();
    if (!active || (active.user.role !== 'educator' && active.user.role !== 'admin')) {
      authService.switchDemoUser('educator');
      active = authService.getCurrentSession();
    }
    setSession(active);

    const list = analyticsService.generateEducatorInsights();
    setInsights(list);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentRole="educator" userSession={session} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Automated Pedagogical Insights"
          subtitle="Data-Derived Observations, Evidence & Concrete Educational Interventions"
          userSession={session}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8 max-w-5xl">
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2 border border-teal-200/60">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Pedagogical Evidence Synthesizer</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Data-Derived Educational Insights
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                Every insight is synthesized from observable interaction telemetry — never randomized claims. Review empirical evidence and suggested interventions.
              </p>
            </div>
          </div>

          {/* Insights List */}
          <div className="space-y-4">
            {insights.map((ins) => (
              <div
                key={ins.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4 hover:border-teal-300 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                      ins.type === 'positive_trend' ? 'bg-emerald-50 text-emerald-600' :
                      ins.type === 'modality_insight' ? 'bg-teal-50 text-teal-600' :
                      ins.type === 'support_needed' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {ins.type === 'positive_trend' && <TrendingUp className="w-5 h-5" />}
                      {ins.type === 'modality_insight' && <Eye className="w-5 h-5" />}
                      {ins.type === 'support_needed' && <AlertCircle className="w-5 h-5" />}
                      {ins.type === 'streak_alert' && <Sparkles className="w-5 h-5" />}
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-slate-900">{ins.title}</h2>
                      {ins.learnerName && (
                        <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60 mt-0.5 inline-block">
                          Student: {ins.learnerName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {ins.description}
                </p>

                {/* Evidence Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Observable Telemetry Evidence:
                  </span>
                  <p className="text-slate-800 font-semibold">{ins.evidence}</p>
                </div>

                {/* Recommended Pedagogical Action */}
                <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200/60 text-xs text-teal-950">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block mb-1">
                    Recommended Pedagogical Action:
                  </span>
                  <p className="font-semibold">{ins.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
