// ============================================================
// SenseLearn — Unified Authentication API Route
// Handles Registration, Login, Google Auth, Password Reset,
// Session Management, and Role Redirection
// ============================================================

import { NextResponse } from 'next/server';
import { sqliteDb } from '@/lib/server/sqlite-db';
import { db } from '@/lib/data/store';
import { hashPassword, verifyPassword, generateId } from '@/lib/utils';
import type { User, UserRole } from '@/lib/data/models';

function setAuthCookies(response: NextResponse, user: { id: string; role: string }, token: string) {
  const maxAge = 7 * 24 * 60 * 60; // 7 days

  response.cookies.set('senselearn_session', token, {
    path: '/',
    maxAge,
    sameSite: 'lax',
    httpOnly: false, // accessible to client scripts as well
  });

  response.cookies.set('senselearn_role', user.role, {
    path: '/',
    maxAge,
    sameSite: 'lax',
    httpOnly: false,
  });

  response.cookies.set('senselearn_uid', user.id, {
    path: '/',
    maxAge,
    sameSite: 'lax',
    httpOnly: false,
  });
}

function clearAuthCookies(response: NextResponse) {
  response.cookies.set('senselearn_session', '', { path: '/', maxAge: 0 });
  response.cookies.set('senselearn_role', '', { path: '/', maxAge: 0 });
  response.cookies.set('senselearn_uid', '', { path: '/', maxAge: 0 });
}

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const uidMatch = cookieHeader.match(/senselearn_uid=([^;]+)/);
    const roleMatch = cookieHeader.match(/senselearn_role=([^;]+)/);

    if (!uidMatch || !uidMatch[1]) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const userId = decodeURIComponent(uidMatch[1]);
    const user = sqliteDb.findUserById(userId) || db.users.findById(userId);

    if (!user) {
      const response = NextResponse.json({ authenticated: false });
      clearAuthCookies(response);
      return response;
    }

    let isNewLearner = false;
    if (user.role === 'learner') {
      const profile = sqliteDb.findLearnerProfileByUserId(user.id) || db.learnerProfiles.findByUserId(user.id);
      isNewLearner = !profile || !profile.baselineCompleted;
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      isNewLearner,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to check session' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, name, role, newPassword, avatarUrl } = body;

    const normalizedEmail = (email || '').toLowerCase().trim();

    // ------------------------------------------------------------
    // 1. REGISTER
    // ------------------------------------------------------------
    if (action === 'register') {
      if (!normalizedEmail || !password || !name) {
        return NextResponse.json({ success: false, error: 'Name, email, and password are required.' }, { status: 400 });
      }

      // Check if user already exists in database
      const existingUser = sqliteDb.findUserByEmail(normalizedEmail) || db.users.findByEmail(normalizedEmail);
      if (existingUser) {
        return NextResponse.json(
          {
            success: false,
            exists: true,
            email: normalizedEmail,
            error: 'An account with this email already exists. Please sign in instead.',
          },
          { status: 409 }
        );
      }

      const assignedRole: UserRole = (role as UserRole) || 'learner';
      const userId = `usr-${generateId()}`;
      const now = new Date().toISOString();

      const newUser: User = {
        id: userId,
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: hashPassword(password),
        role: assignedRole,
        status: 'active',
        avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
      };

      // Persist in SQLite
      sqliteDb.createUser(newUser);
      // Persist in Memory Store
      db.users.create(newUser);

      // Initialize role-specific profile
      if (assignedRole === 'learner') {
        const learnerProf = {
          id: `lrn-prof-${generateId()}`,
          userId,
          currentLevel: 1,
          learningPreferences: ['visual', 'interactive'] as any,
          supportPreferences: ['hints', 'step_by_step'] as any,
          selectedDomains: ['dom-pat', 'dom-prob', 'dom-mem', 'dom-read'],
          onboardingCompleted: false,
          baselineCompleted: false,
          totalActivitiesCompleted: 0,
          totalAssessmentsCompleted: 0,
          currentStreak: 0,
          longestStreak: 0,
          createdAt: now,
          updatedAt: now,
        };
        sqliteDb.createLearnerProfile(learnerProf);
        db.learnerProfiles.create(learnerProf);
      } else if (assignedRole === 'educator') {
        const eduProf = {
          id: `edu-prof-${generateId()}`,
          userId,
          specialization: 'General Learning Support',
          assignedLearnerIds: [],
          createdAt: now,
          updatedAt: now,
        };
        sqliteDb.createEducatorProfile(eduProf);
        db.educatorProfiles.create(eduProf);
      }

      const session = {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          avatarUrl: newUser.avatarUrl,
        },
        token: `tok-${generateId()}`,
        expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      };

      const response = NextResponse.json({
        success: true,
        session,
        isNewLearner: assignedRole === 'learner',
      });

      setAuthCookies(response, newUser, session.token);
      return response;
    }

    // ------------------------------------------------------------
    // 2. LOGIN
    // ------------------------------------------------------------
    if (action === 'login') {
      if (!normalizedEmail || !password) {
        return NextResponse.json({ success: false, error: 'Email and password are required.' }, { status: 400 });
      }

      const user = sqliteDb.findUserByEmail(normalizedEmail) || db.users.findByEmail(normalizedEmail);
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'No account found with this email address. Please check your credentials or register.' },
          { status: 401 }
        );
      }

      if (user.status !== 'active') {
        return NextResponse.json(
          { success: false, error: 'This account has been deactivated. Please contact an administrator.' },
          { status: 403 }
        );
      }

      const isValid = verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: 'Invalid password. Please verify your credentials.' },
          { status: 401 }
        );
      }

      // Update last login
      const now = new Date().toISOString();
      sqliteDb.updateUser(user.id, { lastLoginAt: now });
      db.users.update(user.id, { lastLoginAt: now });

      // Determine if new learner
      let isNewLearner = false;
      if (user.role === 'learner') {
        const profile = sqliteDb.findLearnerProfileByUserId(user.id) || db.learnerProfiles.findByUserId(user.id);
        isNewLearner = !profile || !profile.baselineCompleted;
      }

      const session = {
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

      const response = NextResponse.json({
        success: true,
        session,
        isNewLearner,
      });

      setAuthCookies(response, user, session.token);
      return response;
    }

    // ------------------------------------------------------------
    // 3. GOOGLE SIGN IN / UP
    // ------------------------------------------------------------
    if (action === 'google') {
      if (!normalizedEmail) {
        return NextResponse.json({ success: false, error: 'Google email is required.' }, { status: 400 });
      }

      let user = sqliteDb.findUserByEmail(normalizedEmail) || db.users.findByEmail(normalizedEmail);
      let isNewAccount = false;
      let isNewLearner = false;

      if (user) {
        // Existing user - log in
        const now = new Date().toISOString();
        sqliteDb.updateUser(user.id, { lastLoginAt: now });
        db.users.update(user.id, { lastLoginAt: now });

        if (user.role === 'learner') {
          const profile = sqliteDb.findLearnerProfileByUserId(user.id) || db.learnerProfiles.findByUserId(user.id);
          isNewLearner = !profile || !profile.baselineCompleted;
        }
      } else {
        // New user - create account
        isNewAccount = true;
        const assignedRole: UserRole = (role as UserRole) || 'learner';
        const userId = `usr-g-${generateId()}`;
        const now = new Date().toISOString();
        const displayName = name ? name.trim() : normalizedEmail.split('@')[0].replace(/[._]/g, ' ');

        user = {
          id: userId,
          name: displayName,
          email: normalizedEmail,
          passwordHash: hashPassword(`GoogleOAuth_${generateId()}`),
          role: assignedRole,
          status: 'active',
          avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName)}`,
          createdAt: now,
          updatedAt: now,
          lastLoginAt: now,
        };

        sqliteDb.createUser(user);
        db.users.create(user);

        if (assignedRole === 'learner') {
          isNewLearner = true;
          const learnerProf = {
            id: `lrn-prof-${generateId()}`,
            userId,
            currentLevel: 1,
            learningPreferences: ['visual', 'interactive'] as any,
            supportPreferences: ['hints', 'step_by_step'] as any,
            selectedDomains: ['dom-pat', 'dom-prob', 'dom-mem', 'dom-read'],
            onboardingCompleted: false,
            baselineCompleted: false,
            totalActivitiesCompleted: 0,
            totalAssessmentsCompleted: 0,
            currentStreak: 0,
            longestStreak: 0,
            createdAt: now,
            updatedAt: now,
          };
          sqliteDb.createLearnerProfile(learnerProf);
          db.learnerProfiles.create(learnerProf);
        } else if (assignedRole === 'educator') {
          const eduProf = {
            id: `edu-prof-${generateId()}`,
            userId,
            specialization: 'General Learning Support',
            assignedLearnerIds: [],
            createdAt: now,
            updatedAt: now,
          };
          sqliteDb.createEducatorProfile(eduProf);
          db.educatorProfiles.create(eduProf);
        }
      }

      const session = {
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

      const response = NextResponse.json({
        success: true,
        session,
        isNewAccount,
        isNewLearner,
      });

      setAuthCookies(response, user, session.token);
      return response;
    }

    // ------------------------------------------------------------
    // 4. FORGOT PASSWORD (VERIFY EMAIL)
    // ------------------------------------------------------------
    if (action === 'forgot-password') {
      if (!normalizedEmail) {
        return NextResponse.json({ success: false, error: 'Email address is required.' }, { status: 400 });
      }

      const user = sqliteDb.findUserByEmail(normalizedEmail) || db.users.findByEmail(normalizedEmail);
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'No account was found with this email address.' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Account verified. You can now set your new password.',
        email: normalizedEmail,
        name: user.name,
      });
    }

    // ------------------------------------------------------------
    // 5. RESET PASSWORD
    // ------------------------------------------------------------
    if (action === 'reset-password') {
      if (!normalizedEmail || !newPassword) {
        return NextResponse.json({ success: false, error: 'Email and new password are required.' }, { status: 400 });
      }

      if (newPassword.length < 6) {
        return NextResponse.json({ success: false, error: 'Password must be at least 6 characters.' }, { status: 400 });
      }

      const user = sqliteDb.findUserByEmail(normalizedEmail) || db.users.findByEmail(normalizedEmail);
      if (!user) {
        return NextResponse.json({ success: false, error: 'No account found with this email.' }, { status: 404 });
      }

      const newHash = hashPassword(newPassword);
      sqliteDb.updateUserPassword(normalizedEmail, newHash);
      db.users.update(user.id, { passwordHash: newHash });

      return NextResponse.json({
        success: true,
        message: 'Your password has been successfully reset! You can now sign in with your new password.',
      });
    }

    // ------------------------------------------------------------
    // 6. LOGOUT
    // ------------------------------------------------------------
    if (action === 'logout') {
      const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
      clearAuthCookies(response);
      return response;
    }

    return NextResponse.json({ error: 'Invalid authentication action.' }, { status: 400 });
  } catch (error: any) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: error.message || 'Internal authentication error' }, { status: 500 });
  }
}
