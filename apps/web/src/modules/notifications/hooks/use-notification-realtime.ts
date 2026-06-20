'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import type { AppDispatch } from '@/store';
import { useSocketConnection } from '@/modules/realtime';
import { ServerEvents } from '@/modules/realtime/events/server-events';
import { notificationsApi } from '@/store/api/notifications.api';
import {
  DEFAULT_NOTIFICATION_LIST_QUERY,
  DROPDOWN_NOTIFICATION_LIST_QUERY,
} from '../constants/notification-query';
import type {
  NotificationCountUpdatePayload,
  NotificationNewPayload,
  NotificationReadPayload,
} from '../types/notification.types';
import {
  adjustUnreadCount,
  applyMarkReadToLists,
  setUnreadCount,
  upsertNotificationInList,
} from '../utils/cache-updates';
import { isNotificationUnread } from '../utils/notification-helpers';

export function useNotificationRealtime(enabled = true) {
  const dispatch = useDispatch<AppDispatch>();
  const { socket, isConnected } = useSocketConnection();
  const pathname = usePathname();
  const lastToastAt = useRef(0);

  useEffect(() => {
    if (!enabled || !socket || !isConnected) return;

    const onNew = (payload: NotificationNewPayload) => {
      const { notification } = payload;

      dispatch(
        notificationsApi.util.updateQueryData(
          'listNotifications',
          DROPDOWN_NOTIFICATION_LIST_QUERY,
          (draft) => {
            upsertNotificationInList(draft, notification);
          },
        ),
      );

      dispatch(
        notificationsApi.util.updateQueryData(
          'listNotifications',
          DEFAULT_NOTIFICATION_LIST_QUERY,
          (draft) => {
            upsertNotificationInList(draft, notification);
          },
        ),
      );

      if (isNotificationUnread(notification)) {
        dispatch(
          notificationsApi.util.updateQueryData('getUnreadCount', undefined, (draft) => {
            adjustUnreadCount(draft, 1);
          }),
        );
      }

      const onNotificationsPage = pathname.includes('/notifications');
      const now = Date.now();
      if (!onNotificationsPage && now - lastToastAt.current > 3000) {
        lastToastAt.current = now;
        toast.info(notification.title, {
          description: notification.message,
          duration: 4000,
        });
      }
    };

    const onRead = (payload: NotificationReadPayload) => {
      const cachedArgs = [
        DROPDOWN_NOTIFICATION_LIST_QUERY,
        DEFAULT_NOTIFICATION_LIST_QUERY,
      ] as const;

      for (const arg of cachedArgs) {
        dispatch(
          notificationsApi.util.updateQueryData('listNotifications', arg, (draft) => {
            const item = draft.notifications.find((n) => n.id === payload.notificationId);
            if (item && isNotificationUnread(item)) {
              applyMarkReadToLists([{ arg, draft }], payload.notificationId);
            }
          }),
        );
      }
    };

    const onCountUpdate = (payload: NotificationCountUpdatePayload) => {
      dispatch(
        notificationsApi.util.updateQueryData('getUnreadCount', undefined, (draft) => {
          setUnreadCount(draft, payload.unreadCount);
        }),
      );
    };

    socket.on(ServerEvents.NOTIFICATION_NEW, onNew);
    socket.on(ServerEvents.NOTIFICATION_READ, onRead);
    socket.on(ServerEvents.NOTIFICATION_COUNT_UPDATE, onCountUpdate);

    return () => {
      socket.off(ServerEvents.NOTIFICATION_NEW, onNew);
      socket.off(ServerEvents.NOTIFICATION_READ, onRead);
      socket.off(ServerEvents.NOTIFICATION_COUNT_UPDATE, onCountUpdate);
    };
  }, [dispatch, enabled, pathname, socket, isConnected]);
}
