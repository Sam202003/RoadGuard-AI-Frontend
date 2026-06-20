export { NotificationsPage } from './pages/notifications-page';

export {
  useListNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  notificationListQueryKeys,
} from './api';

export { NotificationItem } from './components/notification-item';
export { NotificationListSkeleton } from './components/notification-list-skeleton';

export type {
  Notification,
  ListNotificationsParams,
  ListNotificationsResult,
  UnreadCountResult,
  NotificationNewPayload,
  NotificationReadPayload,
  NotificationCountUpdatePayload,
} from './types/notification.types';

export {
  NotificationType,
  NotificationPriority,
  NotificationStatus,
} from './constants/notification.enums';

export { isNotificationUnread, formatNotificationTime, formatUnreadBadge } from './utils/notification-helpers';
