'use client';

// ============================================================
// SenseLearn — Learning Support Profile Widget
// Displays skill proficiencies classified into non-medical bands
// ============================================================

import React from 'react';
import { Brain, ArrowUpRight, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import type { SkillScore } from '@/lib/data/models';
import { getSkillLevelLabel, getSkillLevelColor } from '@/lib/utils';

interface SkillRadarProps {
  skillScores: SkillScore[];
  title?: string;
}

export function SkillRadar({ skillScores, title = 'Learning Support Profile' }: SkillRadarProps) {
  if (skillScores.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs text-center">
        <Brain className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-700">No Assessment Profile Yet</p>
        <p className="text-xs text-slate-400 mt-1">Complete your baseline assessment to generate your skill profile.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
            <p className="text-[11px] text-slate-500">Diagnostic skill classification</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {skillScores.map((s) => {
          const levelLabel = getSkillLevelLabel(s.level);
          const colorClass = getSkillLevelColor(s.level);
          const hasGrowth = s.previousScore !== undefined && s.score > s.previousScore;
          const growthDelta = hasGrowth ? s.score - (s.previousScore as number) : 0;

          return (
            <div key={s.skillId} className="p-3 rounded-xl bg-slate-50 border border-slate-100 transition hover:border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <span className="text-xs font-bold text-slate-800">{s.skillName}</span>
                  <span className="text-[10px] text-slate-400 block">{s.domainName}</span>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="text-xs font-extrabold text-slate-900">{s.score}%</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      s.level === 'strong' ? 'bg-emerald-100 text-emerald-800' :
                      s.level === 'good' ? 'bg-blue-100 text-blue-800' :
                      s.level === 'developing' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {levelLabel}
                    </span>
                  </div>

                  {hasGrowth && (
                    <span className="text-[10px] font-semibold text-emerald-600 flex items-center justify-end gap-0.5 mt-0.5">
                      <TrendingUp className="w-3 h-3" />
                      +{growthDelta}% from baseline ({s.previousScore}% → {s.score}%)
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    s.level === 'strong' ? 'bg-emerald-500' :
                    s.level === 'good' ? 'bg-blue-500' :
                    s.level === 'developing' ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${s.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
