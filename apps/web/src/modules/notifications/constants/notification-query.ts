import type { ListNotificationsParams } from '../types/notification.types';

export const DEFAULT_NOTIFICATION_LIST_QUERY: ListNotificationsParams = {
  page: 1,
  limit: 20,
  sort: '-createdAt',
};

export const DROPDOWN_NOTIFICATION_LIST_QUERY: ListNotificationsParams = {
  page: 1,
  limit: 8,
  sort: '-createdAt',
};
