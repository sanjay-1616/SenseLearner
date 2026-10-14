// ============================================================
// SenseLearn — Route Protection & Role-Based Access Control
// Next.js 16 Proxy Convention (replaces deprecated middleware.ts)
// ============================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve auth cookies
  const sessionToken = request.cookies.get('senselearn_session')?.value;
  const userRole = request.cookies.get('senselearn_role')?.value;
  const userId = request.cookies.get('senselearn_uid')?.value;

  const isAuthenticated = Boolean(sessionToken && userId && userRole);

  // 1. Unauthenticated users cannot access protected areas
  if (!isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Role-based route enforcement
  if (pathname.startsWith('/learner')) {
    if (userRole !== 'learner') {
      const redirectPath = userRole === 'educator' ? '/educator/dashboard' : '/admin/dashboard';
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  if (pathname.startsWith('/educator')) {
    if (userRole !== 'educator') {
      const redirectPath = userRole === 'learner' ? '/learner/dashboard' : '/admin/dashboard';
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  if (pathname.startsWith('/admin')) {
    if (userRole !== 'admin') {
      const redirectPath = userRole === 'learner' ? '/learner/dashboard' : '/educator/dashboard';
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  if (pathname.startsWith('/onboarding')) {
    if (userRole !== 'learner') {
      const redirectPath = userRole === 'educator' ? '/educator/dashboard' : '/admin/dashboard';
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/learner/:path*',
    '/educator/:path*',
    '/admin/:path*',
    '/onboarding',
  ],
};
