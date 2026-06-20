import { apiRequest, apiRequestWithMeta } from '@/lib/api-client';
import type {
  ListNotificationsParams,
  ListNotificationsResult,
  MarkAllReadResult,
  Notification,
  PaginationMeta,
  UnreadCountResult,
} from '../types/notification.types';

function buildQueryString(params?: ListNotificationsParams): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.unreadOnly) searchParams.set('unreadOnly', 'true');
  if (params.type) searchParams.set('type', params.type);
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

function parseMeta(meta?: Record<string, unknown>, fallback?: ListNotificationsParams): PaginationMeta {
  return {
    page: Number(meta?.page ?? fallback?.page ?? 1),
    limit: Number(meta?.limit ?? fallback?.limit ?? 20),
    total: Number(meta?.total ?? 0),
    totalPages: Number(meta?.totalPages ?? 1),
    hasNextPage: Boolean(meta?.hasNextPage),
    hasPrevPage: Boolean(meta?.hasPrevPage),
  };
}

export async function listNotificationsRequest(
  params?: ListNotificationsParams,
): Promise<ListNotificationsResult> {
  const { data, meta } = await apiRequestWithMeta<{ notifications: Notification[] }>(
    `/notifications${buildQueryString(params)}`,
    { method: 'GET', auth: true },
  );
  return {
    notifications: data.notifications,
    meta: parseMeta(meta, params),
  };
}

export async function getUnreadCountRequest(): Promise<UnreadCountResult> {
  const data = await apiRequest<UnreadCountResult>('/notifications/unread-count', {
    method: 'GET',
    auth: true,
  });
  return data;
}

export async function markNotificationReadRequest(id: string): Promise<Notification> {
  const data = await apiRequest<{ notification: Notification }>(`/notifications/${id}/read`, {
    method: 'PATCH',
    auth: true,
  });
  return data.notification;
}

export async function markAllNotificationsReadRequest(): Promise<MarkAllReadResult> {
  const data = await apiRequest<MarkAllReadResult>('/notifications/read-all', {
    method: 'PATCH',
    auth: true,
  });
  return data;
}
