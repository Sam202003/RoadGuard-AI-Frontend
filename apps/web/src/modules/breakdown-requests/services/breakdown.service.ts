import { apiRequest, apiRequestWithMeta } from '@/lib/api-client';
import type { BreakdownStatus } from '../constants/breakdown.enums';
import type {
  BreakdownRequest,
  CancelBreakdownRequestPayload,
  CreateBreakdownRequestPayload,
  ListBreakdownRequestsParams,
  ListBreakdownRequestsResult,
} from '../types/breakdown.types';

export interface UpdateBreakdownStatusPayload {
  status: BreakdownStatus;
  notes?: string | null;
}

function buildQueryString(params?: ListBreakdownRequestsParams): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export async function listBreakdownRequestsRequest(
  params?: ListBreakdownRequestsParams,
): Promise<ListBreakdownRequestsResult> {
  const { data, meta } = await apiRequestWithMeta<{ requests: BreakdownRequest[] }>(
    `/breakdown-requests${buildQueryString(params)}`,
    { method: 'GET', auth: true },
  );
  return { requests: data.requests, meta };
}

export async function getBreakdownRequestRequest(id: string): Promise<BreakdownRequest> {
  const data = await apiRequest<{ request: BreakdownRequest }>(`/breakdown-requests/${id}`, {
    method: 'GET',
    auth: true,
  });
  return data.request;
}

export async function createBreakdownRequestRequest(
  payload: CreateBreakdownRequestPayload,
): Promise<BreakdownRequest> {
  const data = await apiRequest<{ request: BreakdownRequest }>('/breakdown-requests', {
    method: 'POST',
    auth: true,
    body: payload,
  });
  return data.request;
}

export async function updateBreakdownStatusRequest(
  id: string,
  payload: UpdateBreakdownStatusPayload,
): Promise<BreakdownRequest> {
  const data = await apiRequest<{ request: BreakdownRequest }>(
    `/breakdown-requests/${id}/status`,
    {
      method: 'PATCH',
      auth: true,
      body: payload,
    },
  );
  return data.request;
}

export async function cancelBreakdownRequestRequest(
  id: string,
  payload: CancelBreakdownRequestPayload,
): Promise<BreakdownRequest> {
  const data = await apiRequest<{ request: BreakdownRequest }>(
    `/breakdown-requests/${id}/cancel`,
    {
      method: 'PATCH',
      auth: true,
      body: payload,
    },
  );
  return data.request;
}
