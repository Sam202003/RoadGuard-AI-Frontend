import { getApiBaseUrl } from '@roadguard/config';
import type { ApiErrorResponse, ApiSuccessResponse } from '@roadguard/types';
import { getAccessToken } from './auth-storage';
import { refreshAccessTokenRequest } from './refresh-access-token';

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

let refreshPromise: Promise<string> | null = null;

async function getValidAccessToken(retryRefresh: boolean): Promise<string | null> {
  const token = getAccessToken();
  if (token || !retryRefresh) return token;

  if (!refreshPromise) {
    refreshPromise = refreshAccessTokenRequest()
      .then((tokens) => tokens.accessToken)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

async function executeRequest<T>(
  path: string,
  options: RequestOptions,
  allowRefresh: boolean,
): Promise<{ response: Response; json: ApiSuccessResponse<T> | ApiErrorResponse }> {
  const { body, auth = false, headers: customHeaders, ...rest } = options;
  const headers = new Headers(customHeaders);

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  if (auth) {
    const token = await getValidAccessToken(allowRefresh);
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
  return { response, json };
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { auth = false } = options;
  let { response, json } = await executeRequest<T>(path, options, false);

  if (auth && response.status === 401) {
    const refreshed = await getValidAccessToken(true);
    if (refreshed) {
      ({ response, json } = await executeRequest<T>(path, options, false));
    }
  }

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
  const { auth = false } = options;
  let { response, json } = await executeRequest<T>(path, options, false);

  if (auth && response.status === 401) {
    const refreshed = await getValidAccessToken(true);
    if (refreshed) {
      ({ response, json } = await executeRequest<T>(path, options, false));
    }
  }

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
