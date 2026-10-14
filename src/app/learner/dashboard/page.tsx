'use client';

// ============================================================
// SenseLearn — Learner Dashboard
// ============================================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles, BookOpen, Trophy, Flame, ArrowRight, Play,
  CheckCircle2, Clock, Brain, Activity, TrendingUp, AlertCircle
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { EngagementIndicator } from '@/components/dashboard/engagement-indicator';
import { SkillRadar } from '@/components/dashboard/skill-radar';
import { authService, type AuthSession } from '@/lib/services/auth-service';
import { learnerProfileService, type ComprehensiveLearnerProfile } from '@/lib/services/learner-profile-service';
import { recommendationService } from '@/lib/services/recommendation-service';
import { activityService } from '@/lib/services/activity-service';
import { getDifficultyColor, formatDuration } from '@/lib/utils';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

export default function LearnerDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [profileData, setProfileData] = useState<ComprehensiveLearnerProfile | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    const active = authService.getCurrentSession();
    if (!active) {
      router.push('/auth/login?redirect=/learner/dashboard');
      return;
    }

    if (active.user.role !== 'learner') {
      router.push(active.user.role === 'educator' ? '/educator/dashboard' : '/admin/dashboard');
      return;
    }

    const learnerId = active.user.id;
    const profile = learnerProfileService.getComprehensiveProfile(learnerId);

    // If new learner has not completed baseline assessment, redirect to onboarding initial assessment
    if (profile && !profile.profile.baselineCompleted) {
      router.push('/onboarding');
      return;
    }

    setSession(active);
    setProfileData(profile);

    const recs = recommendationService.getRecommendationsForLearner(learnerId);
    setRecommendations(recs);
  }, [router]);

  const progressChartData = [
    { day: 'Mon', accuracy: 74, engagement: 78 },
    { day: 'Tue', accuracy: 80, engagement: 81 },
    { day: 'Wed', accuracy: 78, engagement: 82 },
    { day: 'Thu', accuracy: 85, engagement: 84 },
    { day: 'Fri', accuracy: 88, engagement: 86 },
    { day: 'Sat', accuracy: 92, engagement: 89 },
    { day: 'Sun', accuracy: 94, engagement: 91 },
  ];

  const continueActivity = profileData?.learningPath[0]?.activities[0] || activityService.getActivities()[0];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar currentRole="learner" userSession={session} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Learner Dashboard"
          subtitle="Adaptive Multisensory Learning & Real-Time Engagement"
          userSession={session}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8 max-w-7xl">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg shadow-slate-900/10">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider mb-3 border border-teal-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Level {profileData?.profile.currentLevel || 2} Explorer</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
                Welcome back, {session?.user.name || 'Alex Rivera'}!
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                Your activities are continuously calibrated to your learning preferences (Visual + Interactive) and developing memory recall.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={`/learner/learn`}
                  className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs rounded-xl transition shadow-md shadow-teal-500/20 flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Continue Learning</span>
                </Link>
                <Link
                  href="/learner/assessments"
                  className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs rounded-xl transition"
                >
                  Take Periodic Reassessment
                </Link>
              </div>
            </div>
          </div>

          {/* Top Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-lg">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">Completed</span>
                <span className="text-xl font-extrabold text-slate-900 block">
                  {profileData?.profile.totalActivitiesCompleted || 14} Activities
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">Active Streak</span>
                <span className="text-xl font-extrabold text-slate-900 block">
                  {profileData?.profile.currentStreak || 5} Days
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">Top Strength</span>
                <span className="text-xl font-extrabold text-slate-900 block truncate max-w-[140px]">
                  {profileData?.strengthAreas[0]?.skillName || 'Pattern Recognition'}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">Engagement</span>
                <span className="text-xl font-extrabold text-slate-900 block">
                  {profileData?.engagementScore || 84} / 100
                </span>
              </div>
            </div>
          </div>

          {/* Core 2-Column Section: Engagement Engine & Skill Profile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real-Time Engagement Indicator with 5-part breakdown */}
            <EngagementIndicator profile={null} />

            {/* Diagnostic Skill Radar */}
            <SkillRadar skillScores={profileData?.skillScores || []} />
          </div>

          {/* Recommended For You Section (Data-Driven with Reasons) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <h2 className="text-base font-bold text-slate-900">Recommended For You</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Algorithmic recommendations generated from your diagnostic accuracy and learning preferences
                </p>
              </div>
              <Link
                href="/learner/recommendations"
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.slice(0, 2).map((rec) => (
                <div
                  key={rec.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 hover:border-teal-300 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getDifficultyColor(rec.difficulty)}`}>
                        {rec.difficulty}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {rec.domainName}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      {rec.activityTitle}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                      {rec.activityDescription}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80">
                    <div className="p-2.5 rounded-xl bg-teal-50/80 border border-teal-200/60 text-[11px] text-teal-900 font-medium mb-3 flex items-start gap-2">
                      <Brain className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span>{rec.reason}</span>
                    </div>

                    <Link
                      href={`/learner/learn?activityId=${rec.activityId}`}
                      className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Start Practice</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance & Engagement Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Accuracy Over Time */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Accuracy & Performance Trend</h3>
                  <p className="text-[11px] text-slate-500">Weekly progression across activities</p>
                </div>
                <span className="text-xs font-bold text-teal-600">+14% Growth</span>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} domain={[50, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                    />
                    <Line type="monotone" dataKey="accuracy" stroke="#0d9488" strokeWidth={3} dot={{ fill: '#0d9488', r: 4 }} name="Accuracy %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Engagement Score Over Time */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Daily Engagement Index</h3>
                  <p className="text-[11px] text-slate-500">Observable interaction stability score</p>
                </div>
                <span className="text-xs font-bold text-indigo-600">84/100 Avg</span>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} domain={[50, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                    />
                    <Bar dataKey="engagement" fill="#6366f1" radius={[6, 6, 0, 0]} name="Engagement Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
