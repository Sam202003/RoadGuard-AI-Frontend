import { NextResponse, type NextRequest } from 'next/server';
import {
  authPaths,
  getDashboardPathForRole,
  getRolePathPrefix,
  isValidUserRole,
  protectedPrefixes,
  routes,
} from '@roadguard/config';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/session-cookie';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(sessionToken);

  const hasSession = Boolean(session);
  const roleCookie = session?.role;

  const isAuthPath = authPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (isProtected && !hasSession) {
    const loginUrl = new URL(routes.auth.login, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isProtected && hasSession && isValidUserRole(roleCookie)) {
    const rolePrefix = getRolePathPrefix(roleCookie);
    const onWrongPortal = protectedPrefixes.some(
      (prefix) => pathname.startsWith(prefix) && !pathname.startsWith(rolePrefix),
    );

    if (onWrongPortal) {
      return NextResponse.redirect(
        new URL(getDashboardPathForRole(roleCookie), request.url),
      );
    }
  }

  if (isAuthPath && hasSession && isValidUserRole(roleCookie)) {
    return NextResponse.redirect(
      new URL(getDashboardPathForRole(roleCookie), request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/customer/:path*', '/provider/:path*', '/admin/:path*'],
};
