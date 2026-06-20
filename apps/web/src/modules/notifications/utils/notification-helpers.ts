import { NotificationStatus } from '../constants/notification.enums';
import type { Notification } from '../types/notification.types';

export function isNotificationUnread(notification: Notification): boolean {
  return notification.readAt == null && notification.status !== NotificationStatus.READ;
}

export function formatNotificationTime(value: string): string {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatUnreadBadge(count: number): string {
  if (count <= 0) return '';
  return count > 99 ? '99+' : String(count);
}
