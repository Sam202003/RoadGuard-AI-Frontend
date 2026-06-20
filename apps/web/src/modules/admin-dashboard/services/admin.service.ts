import { apiRequest, apiRequestWithMeta } from '@/lib/api-client';
import { listBreakdownRequestsRequest } from '@/modules/breakdown-requests/services/breakdown.service';
import type { BreakdownRequest } from '@/modules/breakdown-requests/types/breakdown.types';
import { ADMIN_BREAKDOWN_LIST_QUERY } from '../constants/admin-query';
import type {
  AdminActivityItem,
  AdminAnalytics,
  AdminDashboardStats,
  AdminProvider,
  AdminUser,
  ListAdminProvidersParams,
  ListAdminProvidersResult,
  ListAdminUsersParams,
  ListAdminUsersResult,
  UpdateUserStatusPayload,
} from '../types/admin.types';

function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export async function getAdminDashboardStatsRequest(): Promise<{
  stats: AdminDashboardStats;
  activity: AdminActivityItem[];
}> {
  return apiRequest<{
    stats: AdminDashboardStats;
    activity: AdminActivityItem[];
  }>('/admin/dashboard', { method: 'GET', auth: true });
}

export async function listAdminUsersRequest(
  params?: ListAdminUsersParams,
): Promise<ListAdminUsersResult> {
  const query = buildQueryString({
    page: params?.page,
    limit: params?.limit,
    search: params?.search,
    role: params?.role,
  });

  const { data, meta } = await apiRequestWithMeta<{ users: AdminUser[] }>(
    `/admin/users${query}`,
    { method: 'GET', auth: true },
  );

  return {
    users: data.users,
    meta: {
      page: Number(meta?.page ?? params?.page ?? 1),
      limit: Number(meta?.limit ?? params?.limit ?? 10),
      total: Number(meta?.total ?? data.users.length),
      totalPages: Number(meta?.totalPages ?? 1),
    },
  };
}

export async function getAdminUserRequest(id: string): Promise<AdminUser> {
  const data = await apiRequest<{ user: AdminUser }>(`/admin/users/${id}`, {
    method: 'GET',
    auth: true,
  });
  return data.user;
}

export async function updateAdminUserStatusRequest(
  id: string,
  payload: UpdateUserStatusPayload,
): Promise<AdminUser> {
  const data = await apiRequest<{ user: AdminUser }>(`/admin/users/${id}/status`, {
    method: 'PATCH',
    auth: true,
    body: payload,
  });
  return data.user;
}

export async function listAdminProvidersRequest(
  params?: ListAdminProvidersParams,
): Promise<ListAdminProvidersResult> {
  const query = buildQueryString({
    page: params?.page,
    limit: params?.limit,
    search: params?.search,
    availabilityStatus: params?.availabilityStatus,
    onlineStatus: params?.onlineStatus,
  });

  const { data, meta } = await apiRequestWithMeta<{ providers: AdminProvider[] }>(
    `/admin/providers${query}`,
    { method: 'GET', auth: true },
  );

  return {
    providers: data.providers,
    meta: {
      page: Number(meta?.page ?? params?.page ?? 1),
      limit: Number(meta?.limit ?? params?.limit ?? 10),
      total: Number(meta?.total ?? data.providers.length),
      totalPages: Number(meta?.totalPages ?? 1),
    },
  };
}

export async function getAdminProviderRequest(id: string): Promise<AdminProvider> {
  const data = await apiRequest<{ provider: AdminProvider }>(`/admin/providers/${id}`, {
    method: 'GET',
    auth: true,
  });
  return data.provider;
}

export async function updateAdminProviderKycRequest(
  id: string,
  kycStatus: AdminProvider['kycStatus'],
): Promise<AdminProvider> {
  const data = await apiRequest<{ provider: AdminProvider }>(`/admin/providers/${id}/kyc-status`, {
    method: 'PATCH',
    auth: true,
    body: { kycStatus },
  });
  return data.provider;
}

export async function getAdminAnalyticsRequest(): Promise<AdminAnalytics> {
  return apiRequest<AdminAnalytics>('/admin/analytics', {
    method: 'GET',
    auth: true,
  });
}

export async function listAdminBreakdownRequestsRequest(): Promise<BreakdownRequest[]> {
  const { requests } = await listBreakdownRequestsRequest(ADMIN_BREAKDOWN_LIST_QUERY);
  return requests;
}
