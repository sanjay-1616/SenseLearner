'use client';

// ============================================================
// SenseLearn — Notifications Center
// ============================================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell, CheckCircle2, Sparkles, MessageSquare, Award,
  ArrowRight, CheckCheck, Clock
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { authService, type AuthSession } from '@/lib/services/auth-service';
import { notificationService } from '@/lib/services/notification-service';
import { formatDate } from '@/lib/utils';
import type { Notification } from '@/lib/data/models';

export default function NotificationsPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    let active = authService.getCurrentSession();
    if (!active || active.user.role !== 'learner') {
      authService.switchDemoUser('learner');
      active = authService.getCurrentSession();
    }
    setSession(active);

    const list = notificationService.getUserNotifications(active?.user.id || 'usr-lrn-1');
    setNotifications(list);
  }, []);

  const handleMarkAllRead = () => {
    if (!session) return;
    notificationService.markAllAsRead(session.user.id);
    setNotifications(notificationService.getUserNotifications(session.user.id));
  };

  const handleMarkRead = (id: string) => {
    notificationService.markAsRead(id);
    if (session) {
      setNotifications(notificationService.getUserNotifications(session.user.id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentRole="learner" userSession={session} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Notifications"
          subtitle="Learning Alerts, Recommendations & Educator Feedback"
          userSession={session}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6 max-w-4xl">
          {/* Top Action Bar */}
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-slate-900">Your Notifications</h1>
            <button
              onClick={handleMarkAllRead}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All as Read</span>
            </button>
          </div>

          {/* Notification List */}
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleMarkRead(notif.id)}
                className={`p-5 rounded-2xl border transition flex items-start justify-between gap-4 cursor-pointer ${
                  notif.isRead
                    ? 'bg-white border-slate-200 opacity-80'
                    : 'bg-white border-teal-300 ring-1 ring-teal-500/20 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    notif.type === 'progress_milestone' ? 'bg-emerald-50 text-emerald-600' :
                    notif.type === 'recommendation' ? 'bg-teal-50 text-teal-600' :
                    notif.type === 'educator_feedback' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                  }`}>
                    {notif.type === 'progress_milestone' && <Award className="w-4 h-4" />}
                    {notif.type === 'recommendation' && <Sparkles className="w-4 h-4" />}
                    {notif.type === 'educator_feedback' && <MessageSquare className="w-4 h-4" />}
                    {notif.type === 'learning_reminder' && <Clock className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-sm font-bold text-slate-900">{notif.title}</h2>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2">{notif.message}</p>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {formatDate(notif.createdAt)}
                    </span>
                  </div>
                </div>

                {notif.actionUrl && (
                  <Link
                    href={notif.actionUrl}
                    className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs shrink-0 flex items-center gap-1 transition"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
