'use client';

// ============================================================
// SenseLearn — Interactive Learning Studio & Dynamic Pathways
// ============================================================

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  BookOpen, Sparkles, Filter, Play, CheckCircle2,
  Clock, Award, Layers, Volume2, Eye, Zap, ArrowLeft
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { ActivityEngine } from '@/components/activity/activity-engine';
import { authService, type AuthSession } from '@/lib/services/auth-service';
import { activityService } from '@/lib/services/activity-service';
import { learnerProfileService } from '@/lib/services/learner-profile-service';
import { LEARNING_DOMAINS } from '@/lib/constants';
import { getDifficultyColor } from '@/lib/utils';
import type { Activity } from '@/lib/data/models';

function LearnContent() {
  const searchParams = useSearchParams();
  const directActivityId = searchParams.get('activityId');

  const [session, setSession] = useState<AuthSession | null>(null);
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [learningPath, setLearningPath] = useState<any[]>([]);

  useEffect(() => {
    let active = authService.getCurrentSession();
    if (!active || active.user.role !== 'learner') {
      authService.switchDemoUser('learner');
      active = authService.getCurrentSession();
    }
    setSession(active);

    const learnerId = active?.user.id || 'usr-lrn-1';
    const path = learnerProfileService.getPersonalizedLearningPath(learnerId);
    setLearningPath(path);

    if (directActivityId) {
      const target = activityService.getActivityById(directActivityId);
      if (target) setActiveActivity(target);
    }
  }, [directActivityId]);

  const allActivities = activityService.getActivities({
    domainId: selectedDomain !== 'all' ? selectedDomain : undefined,
    difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
  });

  const filteredActivities = selectedMode !== 'all'
    ? allActivities.filter(a => a.learningMode === selectedMode || a.learningMode === 'multisensory')
    : allActivities;

  // Active activity view
  if (activeActivity && session) {
    const questions = activityService.getActivityQuestions(activeActivity.id);

    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar currentRole="learner" userSession={session} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            title={activeActivity.title}
            subtitle="Interactive Multisensory Activity Studio"
            userSession={session}
          />
          <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
            <ActivityEngine
              activity={activeActivity}
              questions={questions}
              learnerId={session.user.id}
              onExit={() => setActiveActivity(null)}
            />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentRole="learner" userSession={session} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Learning Studio & Pathways"
          subtitle="4-Tier Dynamic Pathways Tailored to Your Profile"
          userSession={session}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8 max-w-7xl">
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2 border border-teal-200/60">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Personalized Activity Hub</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Your Interactive Learning Path
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                Activities automatically adjust in difficulty based on your observed response times, hint requests, and accuracy.
              </p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="all">All Domains</option>
                {LEARNING_DOMAINS.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="all">All Learning Modes</option>
                <option value="multisensory">Multisensory</option>
                <option value="interactive">Interactive</option>
                <option value="visual">Visual</option>
                <option value="text">Text-Based</option>
              </select>
            </div>
          </div>

          {/* 4-Tier Learning Path Accordion/Grid */}
          <div className="space-y-6">
            {learningPath.map((tier) => (
              <div key={tier.level} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-teal-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                      L{tier.level}
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">{tier.title}</h2>
                      <p className="text-xs text-slate-500">{tier.description}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    {tier.activities.length} Activities
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {tier.activities.map((act: Activity) => (
                    <div
                      key={act.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-teal-400 transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getDifficultyColor(act.difficulty)}`}>
                            {act.difficulty}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {act.estimatedMinutes}m
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">{act.title}</h3>
                        <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-2">
                          {act.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">
                          {act.points} pts
                        </span>
                        <button
                          onClick={() => setActiveActivity(act)}
                          className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Start</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Full Filtered Activities Catalog */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4">Complete Activity Bank ({filteredActivities.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-teal-400 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getDifficultyColor(act.difficulty)}`}>
                        {act.difficulty}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                        {act.learningMode}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{act.title}</h3>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-2">
                      {act.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">{act.points} pts</span>
                    <button
                      onClick={() => setActiveActivity(act)}
                      className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Start</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function LearnPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs font-semibold text-slate-400">Loading Learning Studio...</div>}>
      <LearnContent />
    </React.Suspense>
  );
}
