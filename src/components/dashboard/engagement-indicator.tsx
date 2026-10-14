'use client';

// ============================================================
// SenseLearn — Engagement Indicator Component
// Visual representation of observable educational interaction data
// ============================================================

import React from 'react';
import { Activity, Zap, CheckCircle2, Target, ShieldAlert, Clock, Info } from 'lucide-react';
import type { EngagementProfile } from '@/lib/data/models';
import { getEngagementStatus, getEngagementColor } from '@/lib/utils';

interface EngagementIndicatorProps {
  profile?: EngagementProfile | null;
  compact?: boolean;
}

export function EngagementIndicator({ profile, compact = false }: EngagementIndicatorProps) {
  const score = profile?.overallScore ?? 84;
  const statusLabel = getEngagementStatus(score);

  const consistency = profile?.interactionConsistency ?? 88;
  const completion = profile?.completionRate ?? 92;
  const accuracy = profile?.accuracy ?? 82;
  const persistence = profile?.persistence ?? 84;
  const stability = profile?.responseStability ?? 76;

  if (compact) {
    return (
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Learning Engagement Score</div>
            <div className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>{score} / 100</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                score >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
              }`}>
                {statusLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-600">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Engagement Indicator</h3>
            <p className="text-[11px] text-slate-500">Real-time educational interaction analysis</p>
          </div>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
          score >= 80 ? 'bg-emerald-100 text-emerald-800' :
          score >= 60 ? 'bg-blue-100 text-blue-800' :
          score >= 40 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
        }`}>
          {statusLabel}
        </span>
      </div>

      {/* Main Big Score */}
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{score}</span>
        <span className="text-sm text-slate-400 font-medium">/ 100 points</span>
      </div>

      {/* 5-Component Breakdown */}
      <div className="space-y-3.5 pt-2 border-t border-slate-100">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Interaction Metric Breakdown
        </div>

        {/* 1. Consistency (30%) */}
        <div>
          <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-teal-500" />
              Interaction Consistency (30%)
            </span>
            <span className="font-bold text-slate-900">{consistency}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-teal-500 h-full rounded-full transition-all duration-500" style={{ width: `${consistency}%` }} />
          </div>
        </div>

        {/* 2. Completion (25%) */}
        <div>
          <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              Activity Completion (25%)
            </span>
            <span className="font-bold text-slate-900">{completion}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${completion}%` }} />
          </div>
        </div>

        {/* 3. Accuracy (20%) */}
        <div>
          <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
            <span className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-500" />
              Observed Accuracy (20%)
            </span>
            <span className="font-bold text-slate-900">{accuracy}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${accuracy}%` }} />
          </div>
        </div>

        {/* 4. Persistence (15%) */}
        <div>
          <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              Task Persistence & Hint Use (15%)
            </span>
            <span className="font-bold text-slate-900">{persistence}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${persistence}%` }} />
          </div>
        </div>

        {/* 5. Stability (10%) */}
        <div>
          <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-500" />
              Response Stability (10%)
            </span>
            <span className="font-bold text-slate-900">{stability}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${stability}%` }} />
          </div>
        </div>
      </div>

      {/* Compliance Disclaimer */}
      <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>
          Calculated purely from observable educational interaction frequency, task completion rates, and response pacing. Does not perform psychological or medical diagnosis.
        </span>
      </div>
    </div>
  );
}
