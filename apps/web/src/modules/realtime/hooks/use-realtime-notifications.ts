'use client';

import { useNotificationRealtime } from '@/modules/notifications/hooks/use-notification-realtime';

export function useRealtimeNotifications(enabled = true) {
  useNotificationRealtime(enabled);
}
