import type { AuthTokens } from '@roadguard/types';
import { getApiBaseUrl } from '@roadguard/config';
import type { ApiErrorResponse, ApiSuccessResponse } from '@roadguard/types';
import { getRefreshToken, setTokens } from './auth-storage';
import { notifyTokensRefreshed } from './token-refresh-sync';

export async function refreshAccessTokenRequest(): Promise<AuthTokens> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${getApiBaseUrl()}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  const json = (await response.json()) as ApiSuccessResponse<{ tokens: AuthTokens }> | ApiErrorResponse;

  if (!response.ok || !json.success) {
    const message = json.success === false ? json.message : 'Token refresh failed';
    throw new Error(message);
  }

  const tokens = json.data!.tokens;
  setTokens(tokens.accessToken, tokens.refreshToken);
  notifyTokensRefreshed(tokens);
  return tokens;
}
