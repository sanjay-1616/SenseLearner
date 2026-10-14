'use client';

// ============================================================
// SenseLearn — Educator Learners Directory & Profiles
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  Users, Search, Filter, Brain, Activity, TrendingUp,
  ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Play
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { authService, type AuthSession } from '@/lib/services/auth-service';
import { analyticsService, type LearnerSummaryRow } from '@/lib/services/analytics-service';
import { db } from '@/lib/data/store';
import { formatDate, getEngagementStatus } from '@/lib/utils';

export default function EducatorLearnersPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [learners, setLearners] = useState<LearnerSummaryRow[]>([]);
  const [search, setSearch] = useState('');
  const [activeLearnerId, setActiveLearnerId] = useState<string | null>(null);

  useEffect(() => {
    let active = authService.getCurrentSession();
    if (!active || (active.user.role !== 'educator' && active.user.role !== 'admin')) {
      authService.switchDemoUser('educator');
      active = authService.getCurrentSession();
    }
    setSession(active);

    const list = analyticsService.getLearnerSummaries();
    setLearners(list);
    if (list.length > 0) setActiveLearnerId(list[0].id);
  }, []);

  const filtered = learners.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLearner = learners.find(l => l.id === activeLearnerId) || learners[0];
  const learnerProfile = selectedLearner ? db.learnerProfiles.findByUserId(selectedLearner.id) : null;
  const skillScores = selectedLearner ? db.getSkillScores(selectedLearner.id) : [];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentRole="educator" userSession={session} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Learner Cohort Directory"
          subtitle="Detailed Individual Profiles & Diagnostic Data"
          userSession={session}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Learner Roster */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col h-[750px]">
              <div className="mb-4">
                <h2 className="text-base font-bold text-slate-900 mb-2">Cohort Roster ({filtered.length})</h2>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search student..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {filtered.map((lrn) => {
                  const isSelected = lrn.id === activeLearnerId;

                  return (
                    <div
                      key={lrn.id}
                      onClick={() => setActiveLearnerId(lrn.id)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-600/20'
                          : 'border-slate-200 bg-slate-50/40 hover:bg-slate-100/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={lrn.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                          alt={lrn.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block truncate max-w-[130px]">{lrn.name}</span>
                          <span className="text-[10px] text-slate-500 block">Level {lrn.level}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-teal-700 block">{lrn.engagementScore}/100</span>
                        <span className="text-[10px] text-slate-400">Engagement</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Detailed Selected Learner Profile */}
            <div className="lg:col-span-2 space-y-6">
              {selectedLearner && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                  {/* Top Profile Bar */}
                  <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <img
                        src={selectedLearner.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                        alt={selectedLearner.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-teal-500/20"
                      />
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">{selectedLearner.name}</h2>
                        <p className="text-xs text-slate-500">{selectedLearner.email}</p>
                        <div className="flex items-center gap-3 mt-1 text-[11px] font-semibold text-slate-600">
                          <span>Level {selectedLearner.level} Learner</span>
                          <span>•</span>
                          <span>{selectedLearner.activitiesCount} Activities Completed</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {selectedLearner.engagementScore}/100 • {getEngagementStatus(selectedLearner.engagementScore)}
                    </span>
                  </div>

                  {/* Diagnostic Skills */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3">Diagnostic Skill Proficiencies</h3>
                    <div className="space-y-3">
                      {skillScores.map((s) => (
                        <div key={s.skillId} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{s.skillName}</span>
                            <span className="text-[10px] text-slate-400">{s.domainName}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-slate-900">{s.score}%</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              s.level === 'strong' ? 'bg-emerald-100 text-emerald-800' :
                              s.level === 'good' ? 'bg-blue-100 text-blue-800' :
                              s.level === 'developing' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {s.level}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preferences & Accommodations */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <h4 className="text-xs font-bold text-slate-900 mb-2">Learning Style Preferences</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {learnerProfile?.learningPreferences.map(p => (
                          <span key={p} className="text-[11px] font-semibold bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 uppercase">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <h4 className="text-xs font-bold text-slate-900 mb-2">Active Support Accommodations</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {learnerProfile?.supportPreferences.map(s => (
                          <span key={s} className="text-[11px] font-semibold bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-teal-800">
                            {s.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
