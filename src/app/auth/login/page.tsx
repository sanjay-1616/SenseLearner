'use client';

// ============================================================
// SenseLearn — Sign In Page with Database Auth & Google Login
// ============================================================

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authService } from '@/lib/services/auth-service';
import { APP_NAME } from '@/lib/constants';
import type { UserRole } from '@/lib/data/models';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');

  useEffect(() => {
    const prefillEmail = searchParams.get('email');
    if (prefillEmail) {
      setEmail(prefillEmail);
    }
    const resetSuccess = searchParams.get('reset');
    if (resetSuccess) {
      setSuccessMessage('Your password has been reset successfully! Please log in with your new password.');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    const res = await authService.login(email, password);
    setLoading(false);

    if (res.success && res.session) {
      handleRedirect(res.session.user.role, res.isNewLearner);
    } else {
      setError(res.error || 'Login failed. Please check credentials.');
    }
  };

  const handleGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmailInput) return;
    setGoogleLoading(true);
    setError(null);

    const res = await authService.googleLogin({
      email: googleEmailInput,
      role: 'learner',
    });
    setGoogleLoading(false);
    setShowGoogleModal(false);

    if (res.success && res.session) {
      handleRedirect(res.session.user.role, res.isNewLearner);
    } else {
      setError(res.error || 'Google sign-in failed.');
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    setError(null);
    const session = authService.switchDemoUser(role);
    if (session) {
      handleRedirect(role, false);
    }
  };

  const handleRedirect = (userRole: UserRole, isNewLearner?: boolean) => {
    const redirectParam = searchParams.get('redirect');
    if (redirectParam && redirectParam.startsWith('/')) {
      // Validate role vs target path
      if (
        (userRole === 'learner' && redirectParam.startsWith('/learner')) ||
        (userRole === 'educator' && redirectParam.startsWith('/educator')) ||
        (userRole === 'admin' && redirectParam.startsWith('/admin'))
      ) {
        router.push(redirectParam);
        return;
      }
    }

    if (userRole === 'learner') {
      if (isNewLearner) {
        router.push('/onboarding');
      } else {
        router.push('/learner/dashboard');
      }
    } else if (userRole === 'educator') {
      router.push('/educator/dashboard');
    } else if (userRole === 'admin') {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-teal-500/20">
            S
          </div>
          <span className="font-extrabold text-2xl text-slate-900 tracking-tight">{APP_NAME}</span>
        </Link>
        <h2 className="mt-3 text-2xl font-bold text-slate-900">Sign in to your account</h2>
        <p className="mt-1 text-xs text-slate-500">
          Adaptive Multisensory Learning &amp; Real-Time Engagement Profiling
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-md rounded-3xl border border-slate-200 sm:px-10">
          {/* Quick 1-Click Demo Accounts */}
          <div className="mb-5 pb-5 border-b border-slate-100">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Quick 1-Click Demo Accounts</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('learner')}
                className="p-2.5 rounded-xl border border-teal-200 bg-teal-50/50 hover:bg-teal-50 text-teal-800 text-xs font-bold transition flex flex-col items-center gap-0.5 text-center"
              >
                <span className="text-[10px] text-teal-600 font-semibold uppercase">Learner</span>
                <span>Alex R.</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('educator')}
                className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-800 text-xs font-bold transition flex flex-col items-center gap-0.5 text-center"
              >
                <span className="text-[10px] text-blue-600 font-semibold uppercase">Educator</span>
                <span>Prof. Vance</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="p-2.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-50 text-purple-800 text-xs font-bold transition flex flex-col items-center gap-0.5 text-center"
              >
                <span className="text-[10px] text-purple-600 font-semibold uppercase">Admin</span>
                <span>Dr. Reed</span>
              </button>
            </div>
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            className="w-full py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs mb-5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-slate-400">
              <span className="bg-white px-2 font-medium">Or sign in with email</span>
            </div>
          </div>

          {/* Success / Error Messages */}
          {successMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="learner@demo.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
            Don&apos;t have an account yet?{' '}
            <Link href="/auth/register" className="font-bold text-teal-600 hover:text-teal-700">
              Create an account
            </Link>
          </div>
        </div>
      </div>

      {/* Google Account Selector Dialog */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-base text-slate-900">Sign in with Google</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select an account or enter your Google email
              </p>
            </div>

            <div className="space-y-2 mb-4">
              <button
                type="button"
                onClick={() => {
                  setGoogleEmailInput('alex.rivera@gmail.com');
                }}
                className="w-full p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center gap-3 text-left transition"
              >
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                  AR
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Alex Rivera</span>
                  <span className="text-[11px] text-slate-500 block">alex.rivera@gmail.com</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setGoogleEmailInput('marcus.vance@gmail.com');
                  setGoogleRoleInput('educator');
                }}
                className="w-full p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center gap-3 text-left transition"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                  MV
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Prof. Marcus Vance</span>
                  <span className="text-[11px] text-slate-500 block">marcus.vance@gmail.com</span>
                </div>
              </button>
            </div>

            <form onSubmit={handleGoogleLogin} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Google Email</label>
                <input
                  type="email"
                  required
                  placeholder="your.google@gmail.com"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Role (if creating new account)</label>
                <select
                  value={googleRoleInput}
                  onChange={(e) => setGoogleRoleInput(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  <option value="learner">Learner</option>
                  <option value="educator">Educator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="flex-1 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={googleLoading || !googleEmailInput}
                  className="flex-1 py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  {googleLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
