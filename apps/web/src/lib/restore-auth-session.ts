import type { AuthTokens, AuthUser } from '@roadguard/types';
import { getMeRequest } from '@/modules/auth/services/auth.service';
import { ApiClientError } from './api-client';
import {
  ensureSessionCookie,
  getAccessToken,
  getRefreshToken,
} from './auth-storage';
import { refreshAccessTokenRequest } from './refresh-access-token';

export interface RestoredAuthSession {
  user: AuthUser;
  tokens: AuthTokens;
}

function readTokensFromStorage(): AuthTokens | null {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!accessToken || !refreshToken) {
    return null;
  }

  return { accessToken, refreshToken, expiresIn: '15m' };
}

async function fetchCurrentUser(): Promise<AuthUser> {
  const { user } = await getMeRequest();
  return user;
}

/**
 * Restores an authenticated session from localStorage tokens.
 * Refreshes expired access tokens, re-establishes the edge session cookie,
 * and returns the current user profile.
 */
export async function restoreAuthSession(): Promise<RestoredAuthSession | null> {
  const refreshToken = getRefreshToken();
  const accessToken = getAccessToken();

  if (!refreshToken && !accessToken) {
    return null;
  }

  try {
    const user = await fetchCurrentUser();
    const tokens = readTokensFromStorage();
    if (!tokens) return null;

    await ensureSessionCookie(tokens.accessToken);
    return { user, tokens };
  } catch (error) {
    if (!refreshToken) {
      return null;
    }

    if (error instanceof ApiClientError && error.statusCode !== 401) {
      throw error;
    }

    try {
      const tokens = await refreshAccessTokenRequest();
      const user = await fetchCurrentUser();
      await ensureSessionCookie(tokens.accessToken);
      return { user, tokens };
    } catch {
      return null;
    }
  }
}

export function isAuthFailure(error: unknown): boolean {
  return error instanceof ApiClientError && (error.statusCode === 401 || error.statusCode === 403);
}
