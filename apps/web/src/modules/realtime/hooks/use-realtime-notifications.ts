'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { ServerEvents } from '../events/server-events';
import type { NotificationNewPayload } from '../types/tracking.types';
import { useSocketConnection } from './use-socket-connection';

export function useRealtimeNotifications(enabled = true) {
  const { socket, isConnected } = useSocketConnection();

  useEffect(() => {
    if (!enabled || !socket || !isConnected) return;

    const onNotification = (payload: NotificationNewPayload) => {
      toast.info(payload.notification.title, {
        description: payload.notification.message,
      });
    };

    socket.on(ServerEvents.NOTIFICATION_NEW, onNotification);
    return () => {
      socket.off(ServerEvents.NOTIFICATION_NEW, onNotification);
    };
  }, [enabled, socket, isConnected]);
}
