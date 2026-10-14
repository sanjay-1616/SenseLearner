// ============================================================
// SenseLearn — Authentication Service
// Database-backed auth service with API integration, session cookies,
// Google login, password reset, and role permission checks
// ============================================================

import { db } from '../data/store';
import type { User, UserRole } from '../data/models';
import { hashPassword, verifyPassword, generateId } from '../utils';

export interface AuthSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
  };
  token: string;
  expiresAt: string;
}

export interface AuthResult {
  success: boolean;
  session?: AuthSession;
  error?: string;
  exists?: boolean;
  isNewLearner?: boolean;
}

const SESSION_KEY = 'senselearn_session';

export const authService = {
  /**
   * Authenticate user with email and password via API (with store fallback)
   */
  async login(email: string, passwordPlain: string): Promise<AuthResult> {
    const normalizedEmail = email.toLowerCase().trim();

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: normalizedEmail,
          password: passwordPlain,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Authentication failed.' };
      }

      if (typeof window !== 'undefined' && data.session) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
        document.cookie = `senselearn_session=${data.session.token}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `senselearn_role=${data.session.user.role}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `senselearn_uid=${data.session.user.id}; path=/; max-age=604800; SameSite=Lax`;
      }

      return {
        success: true,
        session: data.session,
        isNewLearner: data.isNewLearner,
      };
    } catch (apiErr) {
      console.warn('API login failed, checking local database store:', apiErr);
      return this.localLogin(normalizedEmail, passwordPlain);
    }
  },

  /**
   * Local in-memory fallback login
   */
  localLogin(email: string, passwordPlain: string): AuthResult {
    const user = db.users.findByEmail(email.toLowerCase().trim());
    if (!user) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (user.status !== 'active') {
      return { success: false, error: 'This account has been deactivated. Please contact an administrator.' };
    }

    const isValid = verifyPassword(passwordPlain, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Invalid password. Please verify your credentials.' };
    }

    db.users.update(user.id, { lastLoginAt: new Date().toISOString() });

    const session: AuthSession = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      token: `tok-${generateId()}`,
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    };

    let isNewLearner = false;
    if (user.role === 'learner') {
      const prof = db.learnerProfiles.findByUserId(user.id);
      isNewLearner = !prof || !prof.baselineCompleted;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      document.cookie = `senselearn_session=${session.token}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `senselearn_role=${user.role}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `senselearn_uid=${user.id}; path=/; max-age=604800; SameSite=Lax`;
    }

    return { success: true, session, isNewLearner };
  },

  /**
   * Register a new user and create their role profile
   */
  async register(data: { name: string; email: string; password: string; role: UserRole }): Promise<AuthResult> {
    const normalizedEmail = data.email.toLowerCase().trim();

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          name: data.name,
          email: normalizedEmail,
          password: data.password,
          role: data.role,
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        return {
          success: false,
          error: resData.error || 'Registration failed.',
          exists: resData.exists,
        };
      }

      if (typeof window !== 'undefined' && resData.session) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(resData.session));
        document.cookie = `senselearn_session=${resData.session.token}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `senselearn_role=${resData.session.user.role}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `senselearn_uid=${resData.session.user.id}; path=/; max-age=604800; SameSite=Lax`;

        // Also update local store
        const newUser: User = {
          id: resData.session.user.id,
          name: resData.session.user.name,
          email: resData.session.user.email,
          passwordHash: hashPassword(data.password),
          role: resData.session.user.role,
          status: 'active',
          avatarUrl: resData.session.user.avatarUrl,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
        db.users.create(newUser);

        if (data.role === 'learner') {
          db.learnerProfiles.create({
            id: `lrn-prof-${generateId()}`,
            userId: newUser.id,
            currentLevel: 1,
            learningPreferences: ['visual', 'interactive'],
            supportPreferences: ['hints'],
            selectedDomains: ['dom-pat', 'dom-prob', 'dom-mem', 'dom-read'],
            onboardingCompleted: false,
            baselineCompleted: false,
            totalActivitiesCompleted: 0,
            totalAssessmentsCompleted: 0,
            currentStreak: 0,
            longestStreak: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }

      return {
        success: true,
        session: resData.session,
        isNewLearner: data.role === 'learner',
      };
    } catch (apiErr) {
      console.warn('API register failed, falling back to local database store:', apiErr);
      return this.localRegister(data);
    }
  },

  /**
   * Local in-memory fallback register
   */
  localRegister(data: { name: string; email: string; password: string; role: UserRole }): AuthResult {
    const existing = db.users.findByEmail(data.email.toLowerCase().trim());
    if (existing) {
      return {
        success: false,
        error: 'An account with this email already exists. Please sign in instead.',
        exists: true,
      };
    }

    const userId = `usr-${generateId()}`;
    const newUser: User = {
      id: userId,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      passwordHash: hashPassword(data.password),
      role: data.role,
      status: 'active',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    db.users.create(newUser);

    if (data.role === 'learner') {
      db.learnerProfiles.create({
        id: `lrn-prof-${generateId()}`,
        userId,
        currentLevel: 1,
        learningPreferences: ['visual', 'interactive'],
        supportPreferences: ['hints'],
        selectedDomains: ['dom-pat', 'dom-prob', 'dom-mem', 'dom-read'],
        onboardingCompleted: false,
        baselineCompleted: false,
        totalActivitiesCompleted: 0,
        totalAssessmentsCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else if (data.role === 'educator') {
      db.educatorProfiles.create({
        id: `edu-prof-${generateId()}`,
        userId,
        specialization: 'General Learning Support',
        assignedLearnerIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return this.localLogin(data.email, data.password);
  },

  /**
   * Google Sign-in handler
   */
  async googleLogin(data: { email: string; name?: string; role?: UserRole; avatarUrl?: string }): Promise<AuthResult> {
    const normalizedEmail = data.email.toLowerCase().trim();

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'google',
          email: normalizedEmail,
          name: data.name,
          role: data.role || 'learner',
          avatarUrl: data.avatarUrl,
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        return { success: false, error: resData.error || 'Google Sign-in failed.' };
      }

      if (typeof window !== 'undefined' && resData.session) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(resData.session));
        document.cookie = `senselearn_session=${resData.session.token}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `senselearn_role=${resData.session.user.role}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `senselearn_uid=${resData.session.user.id}; path=/; max-age=604800; SameSite=Lax`;
      }

      return {
        success: true,
        session: resData.session,
        isNewLearner: resData.isNewLearner,
      };
    } catch (err: any) {
      console.warn('API google sign-in failed, using local fallback:', err);
      // Fallback
      let user = db.users.findByEmail(normalizedEmail);
      let isNew = false;
      if (!user) {
        isNew = true;
        const assignedRole = data.role || 'learner';
        const userId = `usr-g-${generateId()}`;
        user = {
          id: userId,
          name: data.name || normalizedEmail.split('@')[0],
          email: normalizedEmail,
          passwordHash: hashPassword('GoogleOAuth'),
          role: assignedRole,
          status: 'active',
          avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name || normalizedEmail)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
        db.users.create(user);
        if (assignedRole === 'learner') {
          db.learnerProfiles.create({
            id: `lrn-prof-${generateId()}`,
            userId,
            currentLevel: 1,
            learningPreferences: ['visual', 'interactive'],
            supportPreferences: ['hints'],
            selectedDomains: ['dom-pat', 'dom-prob', 'dom-mem', 'dom-read'],
            onboardingCompleted: false,
            baselineCompleted: false,
            totalActivitiesCompleted: 0,
            totalAssessmentsCompleted: 0,
            currentStreak: 0,
            longestStreak: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }

      const session: AuthSession = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
        token: `tok-${generateId()}`,
        expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        document.cookie = `senselearn_session=${session.token}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `senselearn_role=${user.role}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `senselearn_uid=${user.id}; path=/; max-age=604800; SameSite=Lax`;
      }

      let isNewLearner = false;
      if (user.role === 'learner') {
        const prof = db.learnerProfiles.findByUserId(user.id);
        isNewLearner = !prof || !prof.baselineCompleted;
      }

      return { success: true, session, isNewLearner };
    }
  },

  /**
   * Verify email for password reset
   */
  async forgotPassword(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const normalizedEmail = email.toLowerCase().trim();
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'forgot-password', email: normalizedEmail }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Failed to verify email.' };
      return { success: true, message: data.message };
    } catch {
      const user = db.users.findByEmail(normalizedEmail);
      if (!user) return { success: false, error: 'No account found with this email.' };
      return { success: true, message: 'Account verified.' };
    }
  },

  /**
   * Reset user password in database
   */
  async resetPassword(email: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const normalizedEmail = email.toLowerCase().trim();
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset-password', email: normalizedEmail, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Failed to reset password.' };

      // Also update local store
      const localUser = db.users.findByEmail(normalizedEmail);
      if (localUser) {
        db.users.update(localUser.id, { passwordHash: hashPassword(newPassword) });
      }

      return { success: true, message: data.message };
    } catch {
      const localUser = db.users.findByEmail(normalizedEmail);
      if (!localUser) return { success: false, error: 'No account found with this email.' };
      db.users.update(localUser.id, { passwordHash: hashPassword(newPassword) });
      return { success: true, message: 'Password updated successfully.' };
    }
  },

  /**
   * Retrieve current active session
   */
  getCurrentSession(): AuthSession | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    try {
      const session = JSON.parse(stored) as AuthSession;
      if (new Date(session.expiresAt) < new Date()) {
        this.logout();
        return null;
      }
      return session;
    } catch {
      this.logout();
      return null;
    }
  },

  /**
   * Log out and clear session tokens and cookies
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_KEY);
      document.cookie = 'senselearn_session=; path=/; max-age=0; SameSite=Lax';
      document.cookie = 'senselearn_role=; path=/; max-age=0; SameSite=Lax';
      document.cookie = 'senselearn_uid=; path=/; max-age=0; SameSite=Lax';
      try {
        fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'logout' }),
        }).catch(() => {});
      } catch {}
    }
  },

  /**
   * Switch active demo user quickly
   */
  switchDemoUser(role: UserRole): AuthSession | null {
    const demoEmail = `${role}@demo.com`;
    const res = this.localLogin(demoEmail, 'Demo1234!');
    return res.session || null;
  },

  /**
   * Verify if user has authorized role for a given route path
   */
  hasRolePermission(userRole: UserRole, targetPath: string): boolean {
    if (targetPath.startsWith('/learner') && userRole !== 'learner') return false;
    if (targetPath.startsWith('/educator') && userRole !== 'educator' && userRole !== 'admin') return false;
    if (targetPath.startsWith('/admin') && userRole !== 'admin') return false;
    return true;
  }
};
