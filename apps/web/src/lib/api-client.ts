import { getApiBaseUrl } from '@roadguard/config';
import type { ApiErrorResponse, ApiSuccessResponse } from '@roadguard/types';
import { getAccessToken } from './auth-storage';

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly errors: unknown[] = [],
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  auth?: boolean;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, auth = false, headers: customHeaders, ...rest } = options;
  const headers = new Headers(customHeaders);

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  if (auth) {
    const token = getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = (await response.json()) as ApiSuccessResponse<T> | ApiErrorResponse;

  if (!response.ok || !json.success) {
    const message = json.success === false ? json.message : 'Request failed';
    const errors = json.success === false ? (json.errors ?? []) : [];
    throw new ApiClientError(message, response.status, errors);
  }

  return json.data as T;
}

export interface ApiRequestResult<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export async function apiRequestWithMeta<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiRequestResult<T>> {
  const { body, auth = false, headers: customHeaders, ...rest } = options;
  const headers = new Headers(customHeaders);

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  if (auth) {
    const token = getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = (await response.json()) as ApiSuccessResponse<T> | ApiErrorResponse;

  if (!response.ok || !json.success) {
    const message = json.success === false ? json.message : 'Request failed';
    const errors = json.success === false ? (json.errors ?? []) : [];
    throw new ApiClientError(message, response.status, errors);
  }

  return {
    data: json.data as T,
    meta: json.success ? json.meta : undefined,
  };
}
