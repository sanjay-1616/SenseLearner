import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateTime(dateStr: string): string {
  return `${formatDate(dateStr)} ${formatTime(dateStr)}`;
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function getSkillLevel(score: number): 'strong' | 'good' | 'developing' | 'needs_practice' {
  if (score >= 80) return 'strong';
  if (score >= 65) return 'good';
  if (score >= 45) return 'developing';
  return 'needs_practice';
}

export function getSkillLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    strong: 'Strong',
    good: 'Good',
    developing: 'Developing',
    needs_practice: 'Needs Practice',
  };
  return labels[level] || level;
}

export function getSkillLevelColor(level: string): string {
  const colors: Record<string, string> = {
    strong: 'text-emerald-600',
    good: 'text-blue-600',
    developing: 'text-amber-600',
    needs_practice: 'text-red-500',
  };
  return colors[level] || 'text-gray-600';
}

export function getEngagementStatus(score: number): string {
  if (score >= 80) return 'Highly Engaged';
  if (score >= 60) return 'Engaged';
  if (score >= 40) return 'Moderately Engaged';
  return 'Low Engagement';
}

export function getEngagementColor(score: number): string {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-amber-600';
  return 'text-red-500';
}

export function getDifficultyLabel(d: string): string {
  return d.charAt(0).toUpperCase() + d.slice(1);
}

export function getDifficultyColor(d: string): string {
  const colors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-blue-100 text-blue-800',
    advanced: 'bg-purple-100 text-purple-800',
  };
  return colors[d] || 'bg-gray-100 text-gray-800';
}

export function hashPassword(password: string): string {
  // Simple hash for demo - in production use bcrypt
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `hashed_${Math.abs(hash).toString(36)}`;
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export function speakText(text: string): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
