import type { AuthResult, AuthUser, LoginRequest, RegisterRequest } from '@roadguard/types';
import { apiRequest } from '@/lib/api-client';

export async function loginRequest(payload: LoginRequest): Promise<AuthResult> {
  return apiRequest<AuthResult>('/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export async function registerRequest(payload: RegisterRequest): Promise<AuthResult> {
  return apiRequest<AuthResult>('/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export async function getMeRequest(): Promise<{ user: AuthUser }> {
  return apiRequest<{ user: AuthUser }>('/auth/me', {
    method: 'GET',
    auth: true,
  });
}

export async function logoutRequest(refreshToken?: string): Promise<void> {
  await apiRequest<unknown>('/auth/logout', {
    method: 'POST',
    auth: true,
    body: refreshToken ? { refreshToken } : {},
  });
}
