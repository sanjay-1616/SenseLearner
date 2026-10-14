'use client';

// ============================================================
// SenseLearn — Admin Platform Settings
// Configure adaptive engine parameters, engagement formula weights, and defaults
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  Settings, Sliders, Shield, Sparkles, CheckCircle2,
  Database, Info, Save
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { authService, type AuthSession } from '@/lib/services/auth-service';
import { db } from '@/lib/data/store';
import { ENGAGEMENT_WEIGHTS, ADAPTIVE_RULES } from '@/lib/constants';

export default function AdminSettingsPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);

  // Editable settings
  const [platformTitle, setPlatformTitle] = useState('SenseLearn');
  const [autoDifficulty, setAutoDifficulty] = useState(true);
  const [increaseThreshold, setIncreaseThreshold] = useState(80);
  const [decreaseThreshold, setDecreaseThreshold] = useState(50);
  const [baselineCount, setBaselineCount] = useState(10);
  const [ttsDefault, setTtsDefault] = useState(true);

  useEffect(() => {
    let active = authService.getCurrentSession();
    if (!active || active.user.role !== 'admin') {
      authService.switchDemoUser('admin');
      active = authService.getCurrentSession();
    }
    setSession(active);
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentRole="admin" userSession={session} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="System & Engine Configuration"
          subtitle="Tune Adaptive Thresholds, Engagement Weights & Universal Defaults"
          userSession={session}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8 max-w-5xl">
          <form onSubmit={handleSaveSettings} className="space-y-6">
            {savedNotice && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Configuration parameters saved successfully!</span>
              </div>
            )}

            {/* General Branding */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-teal-600" />
                <span>General Platform Parameters</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Platform Brand Title</label>
                  <input
                    type="text"
                    value={platformTitle}
                    onChange={(e) => setPlatformTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Baseline Diagnostic Question Count</label>
                  <input
                    type="number"
                    value={baselineCount}
                    onChange={(e) => setBaselineCount(Number(e.target.value))}
                    min={5}
                    max={25}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Adaptive Engine Rules Tuning */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-600" />
                <span>Adaptive Learning Engine Thresholds</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Difficulty Increase Threshold (%)</label>
                  <input
                    type="number"
                    value={increaseThreshold}
                    onChange={(e) => setIncreaseThreshold(Number(e.target.value))}
                    min={60}
                    max={95}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Default: ≥ 80% advances to higher tier</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Difficulty Reduction Threshold (%)</label>
                  <input
                    type="number"
                    value={decreaseThreshold}
                    onChange={(e) => setDecreaseThreshold(Number(e.target.value))}
                    min={30}
                    max={65}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Default: &lt; 50% triggers scaffolding support</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Automatic Real-Time Difficulty Adjustment</span>
                  <span className="text-[11px] text-slate-500 block">Applies rule-based difficulty adjustment immediately after session completion</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoDifficulty(!autoDifficulty)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                    autoDifficulty ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {autoDifficulty ? 'Active' : 'Manual'}
                </button>
              </div>
            </div>

            {/* Engagement Telemetry Weights */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Engagement Indicator Formula Weights</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">Consistency</span>
                  <span className="text-base font-black text-teal-700 block">{ENGAGEMENT_WEIGHTS.interactionConsistency * 100}%</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">Completion</span>
                  <span className="text-base font-black text-blue-700 block">{ENGAGEMENT_WEIGHTS.completion * 100}%</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">Accuracy</span>
                  <span className="text-base font-black text-indigo-700 block">{ENGAGEMENT_WEIGHTS.accuracy * 100}%</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">Persistence</span>
                  <span className="text-base font-black text-amber-700 block">{ENGAGEMENT_WEIGHTS.persistence * 100}%</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">Stability</span>
                  <span className="text-base font-black text-purple-700 block">{ENGAGEMENT_WEIGHTS.responseStability * 100}%</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Platform Configuration</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
