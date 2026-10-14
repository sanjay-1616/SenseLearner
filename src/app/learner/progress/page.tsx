'use client';

// ============================================================
// SenseLearn — Learner Progress & Growth Analytics
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Award, Clock, Target, Sparkles, CheckCircle2,
  Calendar, Flame, Activity
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { authService, type AuthSession } from '@/lib/services/auth-service';
import { db } from '@/lib/data/store';
import { formatDate, formatDuration } from '@/lib/utils';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

export default function ProgressPage() {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    let active = authService.getCurrentSession();
    if (!active || active.user.role !== 'learner') {
      authService.switchDemoUser('learner');
      active = authService.getCurrentSession();
    }
    setSession(active);
  }, []);

  const learnerId = session?.user.id || 'usr-lrn-1';
  const profile = db.learnerProfiles.findByUserId(learnerId);
  const progressRecords = db.progressRecords.findByLearner(learnerId);
  const sessions = db.learningSessions.findByLearner(learnerId);

  const weeklyData = [
    { week: 'Week 1', activities: 4, accuracy: 78, engagement: 76 },
    { week: 'Week 2', activities: 9, accuracy: 82, engagement: 79 },
    { week: 'Week 3', activities: 14, accuracy: 86, engagement: 84 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentRole="learner" userSession={session} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Progress & Growth History"
          subtitle="Observable Learning Trajectory & Milestone Accomplishments"
          userSession={session}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8 max-w-7xl">
          {/* Top Milestones */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Total Completed</span>
                <span className="text-2xl font-black text-slate-900 block">
                  {profile?.totalActivitiesCompleted || 14} Activities
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Learning Streak</span>
                <span className="text-2xl font-black text-slate-900 block">
                  {profile?.currentStreak || 5} Days In A Row
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Average Accuracy</span>
                <span className="text-2xl font-black text-slate-900 block">
                  86% Observed
                </span>
              </div>
            </div>
          </div>

          {/* Historical Growth Chart */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Historical Accuracy & Engagement Trajectory</h2>
                <p className="text-xs text-slate-500">Progress tracked across successive practice cycles</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                +12% Uplift
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} domain={[60, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="accuracy" stroke="#0d9488" strokeWidth={3} name="Accuracy %" dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="engagement" stroke="#6366f1" strokeWidth={3} name="Engagement Score" dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Session History Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4">Recent Learning Sessions</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Activity</th>
                    <th className="pb-3 font-semibold">Duration</th>
                    <th className="pb-3 font-semibold">Accuracy</th>
                    <th className="pb-3 font-semibold">Score</th>
                    <th className="pb-3 font-semibold">Adaptive Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {sessions.map((ses) => {
                    const act = db.activities.findById(ses.activityId);
                    return (
                      <tr key={ses.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 font-bold text-slate-900">
                          {act?.title || 'Interactive Activity'}
                        </td>
                        <td className="py-3.5 text-slate-500">
                          {formatDuration(ses.totalTimeMs)}
                        </td>
                        <td className="py-3.5 font-extrabold text-teal-700">
                          {ses.accuracy}%
                        </td>
                        <td className="py-3.5 text-slate-600 font-semibold">
                          {ses.score} / {ses.maxScore} pts
                        </td>
                        <td className="py-3.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                            {ses.difficultyAtEnd}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
