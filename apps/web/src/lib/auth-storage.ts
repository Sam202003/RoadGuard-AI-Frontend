const ACCESS_TOKEN_KEY = 'rg_access_token';
const REFRESH_TOKEN_KEY = 'rg_refresh_token';

/** @deprecated Legacy cookies — cleared on logout; no longer set. */
const LEGACY_AUTH_COOKIE = 'rg-auth';
const LEGACY_ROLE_COOKIE = 'rg-auth-role';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/** Sets the signed HttpOnly session cookie required by edge middleware. */
export async function ensureSessionCookie(accessToken: string): Promise<void> {
  const response = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessToken }),
    credentials: 'same-origin',
  });

  if (!response.ok) {
    throw new Error('Failed to establish session');
  }
}

function syncSessionCookie(accessToken: string): void {
  void ensureSessionCookie(accessToken).catch(() => {
    /* Session sync is best-effort; client auth still works via localStorage */
  });
}

function clearSessionCookie(): void {
  void fetch('/api/auth/session', {
    method: 'DELETE',
    credentials: 'same-origin',
  }).catch(() => {
    /* ignore */
  });
}

function clearLegacyCookies(): void {
  document.cookie = `${LEGACY_AUTH_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${LEGACY_ROLE_COOKIE}=; path=/; max-age=0`;
}

export function setTokens(
  accessToken: string,
  refreshToken: string,
  _role?: string,
): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  clearLegacyCookies();
  syncSessionCookie(accessToken);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  clearLegacyCookies();
  clearSessionCookie();
}

export function hasAuthCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return Boolean(getAccessToken());
}
