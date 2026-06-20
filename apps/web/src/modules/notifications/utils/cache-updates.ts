import type { Draft } from '@reduxjs/toolkit';
import { NotificationStatus } from '../constants/notification.enums';
import type {
  ListNotificationsParams,
  ListNotificationsResult,
  Notification,
  UnreadCountResult,
} from '../types/notification.types';
import { isNotificationUnread } from './notification-helpers';

export function markNotificationAsReadInDraft(notification: Draft<Notification>): void {
  notification.readAt = new Date().toISOString();
  notification.status = NotificationStatus.READ;
}

export function upsertNotificationInList(
  draft: Draft<ListNotificationsResult>,
  notification: Notification,
): void {
  const index = draft.notifications.findIndex((n) => n.id === notification.id);
  if (index === -1) {
    draft.notifications.unshift(notification);
    draft.meta.total += 1;
    return;
  }
  draft.notifications[index] = notification;
}

export function applyMarkReadToLists(
  drafts: Array<{ arg: ListNotificationsParams | void; draft: Draft<ListNotificationsResult> }>,
  notificationId: string,
  updated?: Notification,
): void {
  for (const { draft } of drafts) {
    const item = draft.notifications.find((n) => n.id === notificationId);
    if (item) {
      if (updated) {
        Object.assign(item, updated);
      } else {
        markNotificationAsReadInDraft(item);
      }
    }
  }
}

export function applyMarkAllReadToLists(
  drafts: Array<{ draft: Draft<ListNotificationsResult> }>,
): void {
  for (const { draft } of drafts) {
    for (const notification of draft.notifications) {
      if (isNotificationUnread(notification)) {
        markNotificationAsReadInDraft(notification);
      }
    }
  }
}

export function adjustUnreadCount(
  draft: Draft<UnreadCountResult>,
  delta: number,
): void {
  draft.unreadCount = Math.max(0, draft.unreadCount + delta);
}

export function setUnreadCount(
  draft: Draft<UnreadCountResult>,
  count: number,
): void {
  draft.unreadCount = Math.max(0, count);
}
