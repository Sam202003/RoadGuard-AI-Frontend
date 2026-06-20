import type {
  NotificationChannel,
  NotificationPriority,
  NotificationStatus,
  NotificationType,
} from '../constants/notification.enums';

export interface NotificationDeliveryLog {
  channel: NotificationChannel;
  status: NotificationStatus;
  attemptedAt: string;
  deliveredAt?: string | null;
  error?: string | null;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  channels: NotificationChannel[];
  status: NotificationStatus;
  metadata: Record<string, unknown>;
  readAt?: string | null;
  deliveredAt?: string | null;
  createdBy?: string | null;
  priority: NotificationPriority;
  deliveryLog: NotificationDeliveryLog[];
  createdAt: string;
  updatedAt: string;
}

export interface ListNotificationsParams {
  page?: number;
  limit?: number;
  sort?: string;
  unreadOnly?: boolean;
  type?: NotificationType;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface ListNotificationsResult {
  notifications: Notification[];
  meta: PaginationMeta;
}

export interface UnreadCountResult {
  unreadCount: number;
}

export interface MarkAllReadResult {
  updatedCount: number;
}

export interface NotificationNewPayload {
  notification: Notification;
  timestamp: string;
}

export interface NotificationReadPayload {
  notificationId: string;
  userId: string;
  timestamp: string;
}

export interface NotificationCountUpdatePayload {
  userId: string;
  unreadCount: number;
  timestamp: string;
}
