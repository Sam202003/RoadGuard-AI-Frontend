'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  authPaths,
  getDashboardPathForRole,
  isRedirectPathAllowedForRole,
} from '@roadguard/config';
import { AuthLoadingSpinner } from '@/components/auth-loading-spinner';
import { ensureSessionCookie, getAccessToken, getRefreshToken } from '@/lib/auth-storage';
import { isAuthFailure, restoreAuthSession } from '@/lib/restore-auth-session';
import { registerTokenSyncHandler, registerSocketReconnectHandler } from '@/lib/token-refresh-sync';
import { reconnectSocketWithToken } from '@/modules/realtime/socket/socket-client';
import { logout, setCredentials, setInitialized, updateTokens } from '@/store/auth.slice';
import { selectAuthInitialized, selectIsAuthenticated } from '@/store/auth.selectors';
import type { AppDispatch } from '@/store';

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const initialized = useSelector(selectAuthInitialized);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    registerTokenSyncHandler((tokens) => {
      dispatch(updateTokens(tokens));
    });
    registerSocketReconnectHandler(reconnectSocketWithToken);
  }, [dispatch]);

  useEffect(() => {
    const restore = async () => {
      const hasStoredTokens = Boolean(getAccessToken() || getRefreshToken());

      if (!hasStoredTokens) {
        dispatch(setInitialized());
        return;
      }

      try {
        const session = await restoreAuthSession();

        if (!session) {
          dispatch(logout());
          return;
        }

        dispatch(setCredentials({ user: session.user, tokens: session.tokens }));

        const onAuthPath = authPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
        if (onAuthPath) {
          const redirect = new URLSearchParams(window.location.search).get('redirect');
          if (redirect && isRedirectPathAllowedForRole(redirect, session.user.role)) {
            router.replace(redirect);
          } else {
            router.replace(getDashboardPathForRole(session.user.role));
          }
        }
      } catch (error) {
        if (isAuthFailure(error)) {
          dispatch(logout());
          return;
        }

        dispatch(setInitialized());
      }
    };

    if (!initialized) {
      void restore();
    }
  }, [dispatch, initialized, pathname, router]);

  useEffect(() => {
    if (!initialized || !isAuthenticated) return;

    const accessToken = getAccessToken();
    if (!accessToken) return;

    void ensureSessionCookie(accessToken).catch(() => {
      /* best-effort — keeps middleware in sync after tab restore */
    });
  }, [initialized, isAuthenticated, pathname]);

  if (!initialized) {
    return <AuthLoadingSpinner />;
  }

  return <>{children}</>;
}
