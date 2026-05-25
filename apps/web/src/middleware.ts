import { NextResponse, type NextRequest } from 'next/server';
import { UserRole } from '@roadguard/types';
import {
  authPaths,
  getDashboardPathForRole,
  protectedPrefixes,
  routes,
} from '@roadguard/config';

const AUTH_COOKIE = 'rg-auth';
const ROLE_COOKIE = 'rg-auth-role';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(AUTH_COOKIE);
  const roleCookie = request.cookies.get(ROLE_COOKIE)?.value as UserRole | undefined;

  const isAuthPath = authPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (isProtected && !hasSession) {
    const loginUrl = new URL(routes.auth.login, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath && hasSession && roleCookie) {
    return NextResponse.redirect(
      new URL(getDashboardPathForRole(roleCookie), request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/customer/:path*', '/provider/:path*', '/admin/:path*'],
};
