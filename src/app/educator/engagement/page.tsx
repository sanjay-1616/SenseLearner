'use client';

// ============================================================
// SenseLearn — Educator Engagement Telemetry Hub
// Cohort engagement breakdown across the 5-component formula
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  Activity, Zap, CheckCircle2, Target, ShieldAlert, Clock,
  Info, TrendingUp, Users, ArrowUpRight
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { authService, type AuthSession } from '@/lib/services/auth-service';
import { engagementService } from '@/lib/services/engagement-service';
import { analyticsService } from '@/lib/services/analytics-service';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar,
  XAxis, YAxis, CartesianGrid
} from 'recharts';

export default function EducatorEngagementPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [engagementStats, setEngagementStats] = useState<any | null>(null);

  useEffect(() => {
    let active = authService.getCurrentSession();
    if (!active || (active.user.role !== 'educator' && active.user.role !== 'admin')) {
      authService.switchDemoUser('educator');
      active = authService.getCurrentSession();
    }
    setSession(active);

    const stats = engagementService.getCohortEngagementStats();
    setEngagementStats(stats);
  }, []);

  const distributionData = [
    { name: 'Highly Engaged (80-100)', value: engagementStats?.distribution?.highly_engaged || 5, color: '#10b981' },
    { name: 'Engaged (60-79)', value: engagementStats?.distribution?.engaged || 4, color: '#3b82f6' },
    { name: 'Moderately Engaged (40-59)', value: engagementStats?.distribution?.moderately_engaged || 1, color: '#f59e0b' },
    { name: 'Low Engagement (<40)', value: engagementStats?.distribution?.low_engagement || 0, color: '#ef4444' },
  ];

  const componentData = [
    { name: 'Consistency (30%)', value: engagementStats?.componentAverages?.consistency || 86 },
    { name: 'Completion (25%)', value: engagementStats?.componentAverages?.completion || 90 },
    { name: 'Accuracy (20%)', value: engagementStats?.componentAverages?.accuracy || 81 },
    { name: 'Persistence (15%)', value: engagementStats?.componentAverages?.persistence || 83 },
    { name: 'Stability (10%)', value: engagementStats?.componentAverages?.stability || 76 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentRole="educator" userSession={session} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Engagement Telemetry Analytics"
          subtitle="Cohort Interaction Metrics & 5-Component Formula Analysis"
          userSession={session}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8 max-w-7xl">
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2 border border-teal-200/60">
                <Activity className="w-3.5 h-3.5 text-teal-600" />
                <span>Observable Interaction Science</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Cohort Learning Engagement Score: {engagementStats?.averageScore || 78} / 100
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                Calculated strictly from non-medical interaction telemetry: interaction consistency, completion rates, observed accuracy, hint persistence, and response stability.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-center shrink-0">
              <span className="text-[10px] uppercase font-bold text-teal-700 block">Cohort Average</span>
              <span className="text-2xl font-black text-teal-900 block mt-0.5">{engagementStats?.averageScore || 78}</span>
              <span className="text-[10px] text-teal-600 font-semibold block">Highly Engaged</span>
            </div>
          </div>

          {/* Charts Row: Distribution & 5-Part Formula */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribution Pie */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Cohort Engagement Distribution</h3>
              <p className="text-xs text-slate-500 mb-4">Learner count partitioned by engagement tiers</p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }) => `${value} students`}
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 5-Component Formula Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Formula Component Averages</h3>
              <p className="text-xs text-slate-500 mb-4">Cohort performance across the 5 mathematical dimensions</p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={componentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} interval={0} />
                    <YAxis stroke="#94a3b8" fontSize={11} domain={[50, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                    <Bar dataKey="value" fill="#0d9488" radius={[6, 6, 0, 0]} name="Component Average %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Educational Telemetry Compliance Clarification */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white">Scientific Telemetry Integrity</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  SenseLearn strictly observes interaction cadence, task completion, hint requests, and response stability. The system does not diagnose medical conditions, detect psychological disorders, or infer emotions. All telemetry is educational and pedagogical.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
