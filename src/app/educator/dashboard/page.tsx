'use client';

// ============================================================
// SenseLearn — Educator Dashboard
// Cohort monitoring, learner directory, and data-backed insights
// ============================================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users, Activity, TrendingUp, Lightbulb, ArrowRight,
  Sparkles, CheckCircle2, AlertCircle, Eye, Search, Filter
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { authService, type AuthSession } from '@/lib/services/auth-service';
import { analyticsService, type EducatorOverviewStats, type LearnerSummaryRow } from '@/lib/services/analytics-service';
import { formatDate, getEngagementStatus } from '@/lib/utils';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

export default function EducatorDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [stats, setStats] = useState<EducatorOverviewStats | null>(null);
  const [learners, setLearners] = useState<LearnerSummaryRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLearner, setSelectedLearner] = useState<LearnerSummaryRow | null>(null);

  useEffect(() => {
    const active = authService.getCurrentSession();
    if (!active) {
      router.push('/auth/login?redirect=/educator/dashboard');
      return;
    }
    if (active.user.role !== 'educator' && active.user.role !== 'admin') {
      router.push('/learner/dashboard');
      return;
    }
    setSession(active);

    const overview = analyticsService.getEducatorOverview();
    setStats(overview);

    const list = analyticsService.getLearnerSummaries();
    setLearners(list);
  }, [router]);

  const filteredLearners = learners.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.strengthSkill.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.supportArea.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cohortTrend = analyticsService.getProgressOverTime();
  const domainBreakdown = analyticsService.getDomainSkillBreakdown();
  const insights = analyticsService.generateEducatorInsights();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentRole="educator" userSession={session} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Educator Command Center"
          subtitle="Cohort Engagement, Diagnostic Profiles & Automated Insights"
          userSession={session}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8 max-w-7xl">
          {/* Top Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Total Enrolled</span>
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-3xl font-black text-slate-900 block">
                {stats?.totalLearners || 10} Learners
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                {stats?.activeLearners || 10} Active This Week
              </span>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Cohort Progress</span>
                <TrendingUp className="w-4 h-4 text-teal-500" />
              </div>
              <span className="text-3xl font-black text-slate-900 block">
                {stats?.averageProgress || 56}%
              </span>
              <span className="text-[11px] text-teal-600 font-semibold mt-1 block">
                Average Mastery Level
              </span>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Cohort Engagement</span>
                <Activity className="w-4 h-4 text-purple-500" />
              </div>
              <span className="text-3xl font-black text-slate-900 block">
                {stats?.averageEngagement || 78} / 100
              </span>
              <span className="text-[11px] text-purple-600 font-semibold mt-1 block">
                High Observable Persistence
              </span>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Completed Sessions</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-3xl font-black text-slate-900 block">
                {stats?.totalActivitiesCompleted || 134}
              </span>
              <span className="text-[11px] text-amber-600 font-semibold mt-1 block">
                Multisensory Tasks
              </span>
            </div>
          </div>

          {/* Top Automated Educational Insights Preview */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <h2 className="text-base font-bold text-slate-900">Data-Derived Educational Insights</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Automated pedagogical findings synthesized from observable telemetry</p>
              </div>
              <Link
                href="/educator/insights"
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <span>View All Insights</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.slice(0, 2).map((ins) => (
                <div key={ins.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900">{ins.title}</span>
                      {ins.learnerName && (
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {ins.learnerName}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">{ins.description}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500">
                    <strong className="text-slate-700">Action:</strong> {ins.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learner Directory Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Learner Cohort Directory</h2>
                <p className="text-xs text-slate-500">Select any student to inspect detailed diagnostics and recommendations</p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by student or skill..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Student</th>
                    <th className="pb-3 font-semibold">Level</th>
                    <th className="pb-3 font-semibold">Engagement</th>
                    <th className="pb-3 font-semibold">Top Strength</th>
                    <th className="pb-3 font-semibold">Support Focus Area</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredLearners.map((lrn) => (
                    <tr
                      key={lrn.id}
                      onClick={() => setSelectedLearner(lrn)}
                      className="hover:bg-slate-50 transition cursor-pointer"
                    >
                      <td className="py-3.5 flex items-center gap-3">
                        <img
                          src={lrn.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                          alt={lrn.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{lrn.name}</span>
                          <span className="text-[10px] text-slate-400">{lrn.email}</span>
                        </div>
                      </td>
                      <td className="py-3.5 font-bold text-slate-800">
                        Level {lrn.level}
                      </td>
                      <td className="py-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          lrn.engagementScore >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {lrn.engagementScore}/100 • {getEngagementStatus(lrn.engagementScore)}
                        </span>
                      </td>
                      <td className="py-3.5 font-semibold text-emerald-800">
                        {lrn.strengthSkill}
                      </td>
                      <td className="py-3.5 font-medium text-amber-800">
                        {lrn.supportArea}
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLearner(lrn);
                          }}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] rounded-lg transition"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Cohort Progress & Accuracy Trend</h3>
              <p className="text-xs text-slate-500 mb-4">Weekly cohort-wide performance curve</p>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cohortTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} domain={[60, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="avgAccuracy" stroke="#0d9488" strokeWidth={3} name="Accuracy %" />
                    <Line type="monotone" dataKey="avgEngagement" stroke="#6366f1" strokeWidth={3} name="Engagement" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Domain Proficiency Benchmarks</h3>
              <p className="text-xs text-slate-500 mb-4">Cohort skill scores compared to 75% benchmark</p>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={domainBreakdown} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={11} domain={[50, 100]} />
                    <YAxis dataKey="domain" type="category" stroke="#94a3b8" fontSize={10} width={110} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                    <Bar dataKey="averageScore" fill="#0d9488" radius={[0, 6, 6, 0]} name="Cohort Average" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Selected Learner Detailed Modal View */}
      {selectedLearner && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <img
                  src={selectedLearner.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={selectedLearner.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-teal-500/30"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedLearner.name}</h3>
                  <p className="text-xs text-slate-500">{selectedLearner.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLearner(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-0.5">Engagement Indicator</span>
                  <span className="text-sm font-extrabold text-teal-700 block">
                    {selectedLearner.engagementScore} / 100 ({getEngagementStatus(selectedLearner.engagementScore)})
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-0.5">Activities Completed</span>
                  <span className="text-sm font-extrabold text-blue-700 block">
                    {selectedLearner.activitiesCount} Activities
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <strong className="block mb-1">Strength Area:</strong>
                <p>{selectedLearner.strengthSkill} — Learner demonstrates rapid pattern deduction with above 80% accuracy.</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
                <strong className="block mb-1">Support Focus:</strong>
                <p>{selectedLearner.supportArea} — Practice with hints and audio assistance recommended to solidify sequence retention.</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedLearner(null)}
                className="px-5 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
