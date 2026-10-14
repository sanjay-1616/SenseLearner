'use client';

// ============================================================
// SenseLearn — Learner Profile Page
// Complete Learning Support Profile with strengths, developing areas,
// learning preferences, and support accommodations
// ============================================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User, Sparkles, Brain, CheckCircle2, TrendingUp,
  Sliders, Eye, Volume2, Lightbulb, Play, ArrowRight, Shield
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { SkillRadar } from '@/components/dashboard/skill-radar';
import { authService, type AuthSession } from '@/lib/services/auth-service';
import { learnerProfileService, type ComprehensiveLearnerProfile } from '@/lib/services/learner-profile-service';
import { recommendationService } from '@/lib/services/recommendation-service';
import { LEARNING_PREFERENCES, SUPPORT_PREFERENCES } from '@/lib/constants';
import { getSkillLevelLabel, getSkillLevelColor } from '@/lib/utils';
import type { LearningPreference, SupportPreference } from '@/lib/data/models';

export default function LearnerProfilePage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [profileData, setProfileData] = useState<ComprehensiveLearnerProfile | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isEditingPreferences, setIsEditingPreferences] = useState<boolean>(false);
  const [selectedPrefs, setSelectedPrefs] = useState<LearningPreference[]>([]);
  const [selectedSupports, setSelectedSupports] = useState<SupportPreference[]>([]);

  useEffect(() => {
    let active = authService.getCurrentSession();
    if (!active || active.user.role !== 'learner') {
      authService.switchDemoUser('learner');
      active = authService.getCurrentSession();
    }
    setSession(active);

    const learnerId = active?.user.id || 'usr-lrn-1';
    const profile = learnerProfileService.getComprehensiveProfile(learnerId);
    setProfileData(profile);
    if (profile) {
      setSelectedPrefs(profile.profile.learningPreferences);
      setSelectedSupports(profile.profile.supportPreferences);
    }

    const recs = recommendationService.getRecommendationsForLearner(learnerId);
    setRecommendations(recs);
  }, []);

  const handleSavePreferences = () => {
    if (!session) return;
    learnerProfileService.updatePreferences(session.user.id, {
      learningPreferences: selectedPrefs,
      supportPreferences: selectedSupports,
    });
    setIsEditingPreferences(false);
    const updated = learnerProfileService.getComprehensiveProfile(session.user.id);
    setProfileData(updated);
  };

  const togglePref = (id: LearningPreference) => {
    setSelectedPrefs(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleSupport = (id: SupportPreference) => {
    setSelectedSupports(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentRole="learner" userSession={session} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Learning Support Profile"
          subtitle="Non-Medical Diagnostic Profile, Strengths & Accommodations"
          userSession={session}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8 max-w-7xl">
          {/* Profile Identity Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <img
                src={session?.user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt="Profile Avatar"
                className="w-20 h-20 rounded-3xl object-cover ring-4 ring-teal-500/20 shadow-md shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-extrabold text-slate-900">{session?.user.name || 'Alex Rivera'}</h1>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    Level {profileData?.profile.currentLevel || 2} Learner
                  </span>
                </div>
                <p className="text-xs text-slate-500">{session?.user.email || 'learner@demo.com'}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-600 font-medium">
                  <span>{profileData?.profile.totalActivitiesCompleted || 14} Activities Done</span>
                  <span>•</span>
                  <span>{profileData?.profile.currentStreak || 5} Day Streak</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditingPreferences(!isEditingPreferences)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-2 shadow-2xs"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isEditingPreferences ? 'Close Preferences' : 'Edit Preferences'}</span>
            </button>
          </div>

          {/* Edit Preferences Modal / Dropdown Box */}
          {isEditingPreferences && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-200 shadow-md">
              <h2 className="text-base font-bold text-slate-900 mb-2">Adjust Learning & Support Preferences</h2>
              <p className="text-xs text-slate-500 mb-6">
                Your selections calibrate the activity generator and accessibility aids immediately.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Learning Modalities
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {LEARNING_PREFERENCES.map(pref => {
                      const isSel = selectedPrefs.includes(pref.id as LearningPreference);
                      return (
                        <button
                          key={pref.id}
                          onClick={() => togglePref(pref.id as LearningPreference)}
                          className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                            isSel ? 'border-teal-600 bg-teal-50 text-teal-900 ring-1 ring-teal-600' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{pref.label}</span>
                          {isSel && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Support Accommodations
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {SUPPORT_PREFERENCES.map(supp => {
                      const isSel = selectedSupports.includes(supp.id as SupportPreference);
                      return (
                        <button
                          key={supp.id}
                          onClick={() => toggleSupport(supp.id as SupportPreference)}
                          className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                            isSel ? 'border-teal-600 bg-teal-50 text-teal-900 ring-1 ring-teal-600' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="truncate">{supp.label}</span>
                          {isSel && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    onClick={handleSavePreferences}
                    className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Strength & Developing Areas Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strength Areas */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  ★
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Strength Areas</h2>
                  <p className="text-[11px] text-slate-500">Skills where you consistently excel (≥80%)</p>
                </div>
              </div>

              <div className="space-y-3">
                {profileData?.strengthAreas.map((skill) => (
                  <div key={skill.skillId} className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-950 block">{skill.skillName}</span>
                      <span className="text-[10px] text-emerald-700">{skill.domainName}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-emerald-800 block">{skill.score}%</span>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase">Strong</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Developing Areas */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  ▲
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Developing Areas</h2>
                  <p className="text-[11px] text-slate-500">Targeted areas where practice will unlock highest growth</p>
                </div>
              </div>

              <div className="space-y-3">
                {profileData?.developingAreas.map((skill) => (
                  <div key={skill.skillId} className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-amber-950 block">{skill.skillName}</span>
                      <span className="text-[10px] text-amber-700">{skill.domainName}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-amber-800 block">{skill.score}%</span>
                      <span className="text-[10px] font-bold text-amber-600 uppercase">Developing</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Full Skill Radar Profile */}
          <SkillRadar skillScores={profileData?.skillScores || []} title="Complete Skill Proficiency Map" />
        </main>
      </div>
    </div>
  );
}
