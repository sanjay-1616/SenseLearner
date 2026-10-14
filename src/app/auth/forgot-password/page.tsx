'use client';

// ============================================================
// SenseLearn — Forgot & Reset Password Page
// End-to-End Database Password Reset Flow
// ============================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, CheckCircle2, ArrowLeft, AlertCircle, KeyRound } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { authService } from '@/lib/services/auth-service';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'verify' | 'reset' | 'completed'>('verify');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await authService.forgotPassword(email);
    setLoading(false);

    if (res.success) {
      setStep('reset');
    } else {
      setError(res.error || 'No account was found with this email.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await authService.resetPassword(email, newPassword);
    setLoading(false);

    if (res.success) {
      setStep('completed');
    } else {
      setError(res.error || 'Failed to update password.');
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
        <h2 className="mt-3 text-2xl font-bold text-slate-900">
          {step === 'verify' && 'Reset your password'}
          {step === 'reset' && 'Set new password'}
          {step === 'completed' && 'Password updated'}
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          {step === 'verify' && 'Enter your registered email address to verify your account'}
          {step === 'reset' && `Enter your new secure password for ${email}`}
          {step === 'completed' && 'Your account security credentials have been updated'}
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-md rounded-3xl border border-slate-200 sm:px-10">
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Verify Email */}
          {step === 'verify' && (
            <form className="space-y-4" onSubmit={handleVerifyEmail}>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 mt-2"
              >
                <span>{loading ? 'Verifying Account...' : 'Continue to Reset Password'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Set New Password */}
          {step === 'reset' && (
            <form className="space-y-4" onSubmit={handleResetPassword}>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 mb-2 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-teal-600 shrink-0" />
                <span>
                  Verified account: <strong className="text-slate-800">{email}</strong>
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 mt-2"
              >
                <span>{loading ? 'Updating Password...' : 'Save & Update Password'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 3: Completed */}
          {step === 'completed' && (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 ring-8 ring-emerald-50/50">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Password reset successful!</h3>
              <p className="text-xs text-slate-500 mb-6">
                Your password has been updated in the database. You can now log into your SenseLearn account with your new credentials.
              </p>
              <button
                type="button"
                onClick={() => router.push(`/auth/login?email=${encodeURIComponent(email)}&reset=1`)}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-teal-600/20 flex items-center justify-center gap-2"
              >
                <span>Sign in with new password</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
            Remembered your password?{' '}
            <Link href="/auth/login" className="font-bold text-teal-600 hover:text-teal-700">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
