'use client';

// ============================================================
// SenseLearn — Accessibility Center
// Controls settings that immediately modify UI layout and behavior
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  Accessibility, Type, Sun, Volume2, Sparkles, Sliders,
  CheckCircle2, RotateCcw, Eye, Play
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { useAccessibility } from '@/lib/hooks/use-accessibility';
import { authService, type AuthSession } from '@/lib/services/auth-service';
import { speakText } from '@/lib/utils';

export default function AccessibilityPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const { settings, updateSettings, resetSettings } = useAccessibility();

  useEffect(() => {
    let active = authService.getCurrentSession();
    if (!active || active.user.role !== 'learner') {
      authService.switchDemoUser('learner');
      active = authService.getCurrentSession();
    }
    setSession(active);
  }, []);

  const handleTestSpeech = () => {
    speakText('This is a test of the SenseLearn audio assistance system. Clear audio narration supports multimodal learning.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentRole="learner" userSession={session} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Accessibility Center"
          subtitle="Customize Display, Font Scaling, Audio Narration & Motion"
          userSession={session}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8 max-w-5xl">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2 border border-teal-200/60">
                <Accessibility className="w-3.5 h-3.5 text-teal-600" />
                <span>Universal Design For Learning</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Accessibility Preferences
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                Settings actively adapt all pages, text sizes, high-contrast themes, and speech assistance across the platform.
              </p>
            </div>

            <button
              onClick={resetSettings}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>

          {/* Settings Group 1: Typography & Scaling */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Type className="w-4 h-4 text-teal-600" />
              <span>Text Size & Typography</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Display Text Scale</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => updateSettings({ textSize: 'normal' })}
                  className={`p-4 rounded-2xl border text-center transition ${
                    settings.textSize === 'normal'
                      ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-600/20 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <span className="text-sm block mb-1">Standard (16px)</span>
                  <span className="text-[10px] text-slate-400 block">Default scaling</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateSettings({ textSize: 'large' })}
                  className={`p-4 rounded-2xl border text-center transition ${
                    settings.textSize === 'large'
                      ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-600/20 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <span className="text-base block mb-1">Large (18px)</span>
                  <span className="text-[10px] text-slate-400 block">Enhanced readability</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateSettings({ textSize: 'extra_large' })}
                  className={`p-4 rounded-2xl border text-center transition ${
                    settings.textSize === 'extra_large'
                      ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-600/20 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <span className="text-lg block mb-1">Extra Large (20px)</span>
                  <span className="text-[10px] text-slate-400 block">Maximum clarity</span>
                </button>
              </div>
            </div>

            {/* Reading Assistance Guide */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Enhanced Letter Spacing & Line Height</span>
                <span className="text-[11px] text-slate-500 block">Increases line spacing to ease visual tracking</span>
              </div>
              <button
                type="button"
                onClick={() => updateSettings({ readingAssistance: !settings.readingAssistance })}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                  settings.readingAssistance ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {settings.readingAssistance ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          {/* Settings Group 2: Contrast & Visual Themes */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Color Contrast & Visual Themes</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateSettings({ contrast: 'normal' })}
                className={`p-4 rounded-2xl border text-left transition ${
                  settings.contrast === 'normal'
                    ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-600/20 font-bold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs font-bold block mb-1">Normal Palette</span>
                <span className="text-[11px] text-slate-500 block">Clean soft slate palette</span>
              </button>

              <button
                type="button"
                onClick={() => updateSettings({ contrast: 'high' })}
                className={`p-4 rounded-2xl border text-left transition ${
                  settings.contrast === 'high'
                    ? 'border-amber-500 bg-amber-50 text-amber-950 ring-2 ring-amber-500/20 font-bold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs font-bold block mb-1">High Contrast Mode</span>
                <span className="text-[11px] text-slate-500 block">High-contrast black & yellow borders</span>
              </button>
            </div>
          </div>

          {/* Settings Group 3: Audio Assistance */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span>Multisensory Audio Narration</span>
            </h2>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Browser Speech Narration</span>
                <span className="text-[11px] text-slate-500 block">Reads questions, hints, and explanations aloud automatically</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleTestSpeech}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Test Voice</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateSettings({ audioAssistance: !settings.audioAssistance })}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                    settings.audioAssistance ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {settings.audioAssistance ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Reduced Motion</span>
                <span className="text-[11px] text-slate-500 block">Disables animations and transitions across the interface</span>
              </div>
              <button
                type="button"
                onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                  settings.reducedMotion ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {settings.reducedMotion ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
