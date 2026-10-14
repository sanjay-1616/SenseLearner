'use client';

// ============================================================
// SenseLearn — Accessibility Context & Hook
// Directly modifies DOM classes and CSS variables across the platform
// ============================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AccessibilitySettings } from '../data/models';
import { db } from '../data/store';
import { authService } from '../services/auth-service';

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  userId: 'guest',
  textSize: 'normal',
  contrast: 'normal',
  audioAssistance: true,
  reducedMotion: false,
  readingAssistance: true,
  interactionGuidance: true,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Load user settings on mount
  useEffect(() => {
    const session = authService.getCurrentSession();
    if (session?.user.id) {
      const stored = db.accessibilitySettings.findByUser(session.user.id);
      if (stored) {
        setSettings(stored);
      } else {
        setSettings({ ...defaultSettings, userId: session.user.id });
      }
    }
  }, []);

  // Apply visual styling to document root whenever settings change
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // 1. Text Size
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-xl');
    if (settings.textSize === 'large') {
      root.classList.add('text-size-large');
      root.style.fontSize = '18px';
    } else if (settings.textSize === 'extra_large') {
      root.classList.add('text-size-xl');
      root.style.fontSize = '20px';
    } else {
      root.classList.add('text-size-normal');
      root.style.fontSize = '16px';
    }

    // 2. High Contrast
    if (settings.contrast === 'high') {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // 3. Reduced Motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // 4. Reading Assistance (Dyslexia-friendly guide and spacing)
    if (settings.readingAssistance) {
      root.classList.add('reading-assistance-active');
    } else {
      root.classList.remove('reading-assistance-active');
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      const session = authService.getCurrentSession();
      if (session?.user.id) {
        db.accessibilitySettings.upsert({ ...updated, userId: session.user.id });
      }
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    const session = authService.getCurrentSession();
    if (session?.user.id) {
      db.accessibilitySettings.upsert({ ...defaultSettings, userId: session.user.id });
    }
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
