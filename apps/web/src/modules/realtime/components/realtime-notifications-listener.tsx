'use client';

import { useRealtimeNotifications } from '../hooks/use-realtime-notifications';

export function RealtimeNotificationsListener() {
  useRealtimeNotifications(true);
  return null;
}
