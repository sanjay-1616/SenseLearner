'use client';

// ============================================================
// SenseLearn — Application Header Bar
// ============================================================

import React from 'react';
import Link from 'next/link';
import { Bell, Accessibility, Volume2, Type, Sparkles, User, LogOut } from 'lucide-react';
import { useAccessibility } from '@/lib/hooks/use-accessibility';
import { notificationService } from '@/lib/services/notification-service';
import { authService, type AuthSession } from '@/lib/services/auth-service';
import { speakText } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  userSession?: AuthSession | null;
}

export function Header({ title, subtitle, userSession }: HeaderProps) {
  const { settings, updateSettings } = useAccessibility();
  const unreadCount = userSession?.user.id ? notificationService.getUnreadCount(userSession.user.id) : 0;

  const cycleTextSize = () => {
    if (settings.textSize === 'normal') updateSettings({ textSize: 'large' });
    else if (settings.textSize === 'large') updateSettings({ textSize: 'extra_large' });
    else updateSettings({ textSize: 'normal' });
  };

  const toggleAudio = () => {
    const next = !settings.audioAssistance;
    updateSettings({ audioAssistance: next });
    if (next) speakText('Audio assistance enabled.');
  };

  const toggleContrast = () => {
    updateSettings({ contrast: settings.contrast === 'normal' ? 'high' : 'normal' });
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Title / Subtitle */}
      <div>
        <h1 className="text-lg font-bold text-slate-900 leading-tight">
          {title || 'SenseLearn Adaptive Platform'}
        </h1>
        {subtitle && (
          <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Accessibility Bar */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={cycleTextSize}
            title={`Text Size: ${settings.textSize}`}
            className="p-1.5 rounded hover:bg-white text-slate-700 transition flex items-center gap-1 text-xs font-semibold"
          >
            <Type className="w-3.5 h-3.5" />
            <span className="text-[11px] uppercase">{settings.textSize === 'extra_large' ? 'XL' : settings.textSize === 'large' ? 'L' : 'M'}</span>
          </button>

          <button
            onClick={toggleAudio}
            title={`Audio Narration: ${settings.audioAssistance ? 'On' : 'Off'}`}
            className={`p-1.5 rounded transition ${
              settings.audioAssistance ? 'bg-teal-600 text-white' : 'hover:bg-white text-slate-700'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleContrast}
            title={`Contrast: ${settings.contrast}`}
            className={`p-1.5 rounded text-xs font-bold transition ${
              settings.contrast === 'high' ? 'bg-amber-500 text-black' : 'hover:bg-white text-slate-700'
            }`}
          >
            HC
          </button>

          <Link
            href="/learner/accessibility"
            title="Accessibility Center"
            className="p-1.5 rounded hover:bg-white text-slate-700 transition"
          >
            <Accessibility className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Notifications Icon */}
        <Link
          href="/learner/notifications"
          className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <img
            src={userSession?.user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
            alt="User"
            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300"
          />
          <div className="hidden md:block text-left leading-tight">
            <span className="text-xs font-bold text-slate-800 block">
              {userSession?.user.name || 'Alex Rivera'}
            </span>
            <span className="text-[10px] text-teal-600 font-semibold uppercase tracking-wider">
              {userSession?.user.role || 'Learner'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
