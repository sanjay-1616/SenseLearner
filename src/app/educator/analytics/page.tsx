'use client';

// ============================================================
// SenseLearn — Educator Analytics & Multi-Dimensional Charts
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, Filter, Calendar, Users,
  Activity, Target, Clock, RefreshCw
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { authService, type AuthSession } from '@/lib/services/auth-service';
import { analyticsService } from '@/lib/services/analytics-service';
import { LEARNING_DOMAINS } from '@/lib/constants';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area
} from 'recharts';

export default function EducatorAnalyticsPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  useEffect(() => {
    let active = authService.getCurrentSession();
    if (!active || (active.user.role !== 'educator' && active.user.role !== 'admin')) {
      authService.switchDemoUser('educator');
      active = authService.getCurrentSession();
    }
    setSession(active);
  }, []);

  const progressOverTime = analyticsService.getProgressOverTime();
  const domainSkills = analyticsService.getDomainSkillBreakdown();
  const responseTimeVsAcc = analyticsService.getAccuracyVsResponseTime();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentRole="educator" userSession={session} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Multi-Dimensional Cohort Analytics"
          subtitle="Interactive Charts, Filterable Performance & Response Latency"
          userSession={session}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8 max-w-7xl">
          {/* Filter Bar Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Analytics Filtering Controls</h2>
              <p className="text-xs text-slate-500">Filter cohort data across domains, difficulty, and timeframe</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="all">All Domains</option>
                {LEARNING_DOMAINS.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Chart 1: Progress & Engagement Over Time */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Cohort Accuracy & Engagement Over Time</h3>
                <p className="text-xs text-slate-500">Weekly progression showing consistent +18% accuracy growth</p>
              </div>
              <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                Active Cohort Curve
              </span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressOverTime}>
                  <defs>
                    <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} domain={[50, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="avgAccuracy" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" name="Accuracy %" />
                  <Area type="monotone" dataKey="avgEngagement" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorEng)" name="Engagement Score" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row: Domain Skills & Response Latency Correlation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Domain Proficiency Comparison</h3>
              <p className="text-xs text-slate-500 mb-4">Average score across 8 learning domains</p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={domainSkills}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="domain" stroke="#94a3b8" fontSize={10} interval={0} angle={-25} textAnchor="end" height={50} />
                    <YAxis stroke="#94a3b8" fontSize={11} domain={[50, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                    <Bar dataKey="averageScore" fill="#0d9488" radius={[6, 6, 0, 0]} name="Domain Score %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Difficulty vs Response Latency</h3>
              <p className="text-xs text-slate-500 mb-4">Observed processing duration per question</p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={responseTimeVsAcc}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="difficulty" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                    <Bar dataKey="avgResponseSeconds" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Avg Seconds" />
                    <Bar dataKey="accuracy" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Accuracy %" />
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
