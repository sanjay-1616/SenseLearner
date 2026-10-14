'use client';

// ============================================================
// SenseLearn — Administrator Command Dashboard
// ============================================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield, Users, Puzzle, HelpCircle, Layers, Settings,
  Sparkles, ArrowRight, CheckCircle2, Activity, Database
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { authService, type AuthSession } from '@/lib/services/auth-service';
import { db } from '@/lib/data/store';

export default function AdminDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    const active = authService.getCurrentSession();
    if (!active) {
      router.push('/auth/login?redirect=/admin/dashboard');
      return;
    }
    if (active.user.role !== 'admin') {
      router.push(active.user.role === 'educator' ? '/educator/dashboard' : '/learner/dashboard');
      return;
    }
    setSession(active);
  }, [router]);

  const totalUsers = db.users.findAll().length;
  const totalLearners = db.users.findByRole('learner').length;
  const totalEducators = db.users.findByRole('educator').length;
  const totalActivities = db.activities.findAll().length;
  const totalQuestions = db.questions.findAll().length;
  const totalDomains = db.domains.findAll().length;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentRole="admin" userSession={session} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Platform Administration"
          subtitle="System Governance, Activity Banks, Question Repository & Configuration"
          userSession={session}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8 max-w-7xl">
          {/* Top Admin Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Registered Users</span>
                <Users className="w-4 h-4 text-purple-500" />
              </div>
              <span className="text-3xl font-black text-slate-900 block">{totalUsers}</span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {totalLearners} Learners • {totalEducators} Educators
              </span>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Learning Activities</span>
                <Puzzle className="w-4 h-4 text-teal-500" />
              </div>
              <span className="text-3xl font-black text-slate-900 block">{totalActivities}</span>
              <span className="text-[11px] text-teal-600 font-semibold mt-1 block">
                30 Active Interactive Modules
              </span>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Question Bank</span>
                <HelpCircle className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-3xl font-black text-slate-900 block">{totalQuestions}</span>
              <span className="text-[11px] text-blue-600 font-semibold mt-1 block">
                100+ Multi-Type Items
              </span>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Learning Domains</span>
                <Layers className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-3xl font-black text-slate-900 block">{totalDomains}</span>
              <span className="text-[11px] text-amber-600 font-semibold mt-1 block">
                20+ Skill Dimensions
              </span>
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/users"
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">User Management</h3>
                <p className="text-xs text-slate-500">Manage learners, educators, and administrator access privileges</p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-teal-600">
                <span>Manage Users</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/admin/activities"
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold mb-4">
                  <Puzzle className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Activity Modules</h3>
                <p className="text-xs text-slate-500">Curate interactive multisensory tasks and learning paths</p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-teal-600">
                <span>Manage Activities</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/admin/questions"
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Question Repository</h3>
                <p className="text-xs text-slate-500">Maintain 100+ diagnostic assessment & activity questions</p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-teal-600">
                <span>Manage Questions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/admin/settings"
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4">
                  <Settings className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Platform Settings</h3>
                <p className="text-xs text-slate-500">Configure adaptive algorithms and engagement weights</p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-teal-600">
                <span>Configure Platform</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
