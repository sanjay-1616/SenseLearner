'use client';

// ============================================================
// SenseLearn — Unified Role-Based Sidebar Navigation
// ============================================================

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, ClipboardList, User as UserIcon,
  TrendingUp, Sparkles, Accessibility, Bell, Users, Activity,
  BarChart3, Lightbulb, Puzzle, HelpCircle, Layers, Settings,
  LogOut, GraduationCap, ChevronRight
} from 'lucide-react';
import { NAV_ITEMS, APP_NAME } from '@/lib/constants';
import { authService, type AuthSession } from '@/lib/services/auth-service';
import type { UserRole } from '@/lib/data/models';

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  User: UserIcon,
  TrendingUp,
  Sparkles,
  Accessibility,
  Bell,
  Users,
  Activity,
  BarChart3,
  Lightbulb,
  Puzzle,
  HelpCircle,
  Layers,
  Settings,
};

interface SidebarProps {
  currentRole: UserRole;
  userSession?: AuthSession | null;
}

export function Sidebar({ currentRole, userSession }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const navList = NAV_ITEMS[currentRole] || NAV_ITEMS.learner;

  const handleLogout = () => {
    authService.logout();
    router.push('/auth/login');
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col min-h-screen border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 font-bold text-xl">
          S
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-white tracking-tight">{APP_NAME}</span>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              {currentRole}
            </span>
          </div>
          <p className="text-xs text-slate-400">Adaptive Learning</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Menu
        </div>
        {navList.map((item) => {
          const Icon = ICON_MAP[item.icon] || LayoutDashboard;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-white/70" />}
            </Link>
          );
        })}
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={userSession?.user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
            alt="User Avatar"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-teal-500/40 shrink-0"
          />
          <div className="truncate">
            <p className="text-sm font-semibold text-white truncate">
              {userSession?.user.name || 'Demo User'}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {userSession?.user.email || 'user@demo.com'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Log Out"
          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
