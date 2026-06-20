import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  DEFAULT_NOTIFICATION_LIST_QUERY,
  DROPDOWN_NOTIFICATION_LIST_QUERY,
} from '@/modules/notifications/constants/notification-query';
import {
  getUnreadCountRequest,
  listNotificationsRequest,
  markAllNotificationsReadRequest,
  markNotificationReadRequest,
} from '@/modules/notifications/services/notification.service';
import type {
  ListNotificationsParams,
  ListNotificationsResult,
  MarkAllReadResult,
  Notification,
  UnreadCountResult,
} from '@/modules/notifications/types/notification.types';
import {
  adjustUnreadCount,
  applyMarkAllReadToLists,
  applyMarkReadToLists,
} from '@/modules/notifications/utils/cache-updates';
import { isNotificationUnread } from '@/modules/notifications/utils/notification-helpers';

export type ListNotificationsQueryArg = ListNotificationsParams | void;

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Notification', 'NotificationList', 'UnreadCount'],
  endpoints: (builder) => ({
    listNotifications: builder.query<ListNotificationsResult, ListNotificationsQueryArg>({
      queryFn: async (params) => {
        try {
          const data = await listNotificationsRequest(params ?? undefined);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to load notifications',
            },
          };
        }
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'NotificationList', id: 'LIST' },
              ...result.notifications.map((n) => ({ type: 'Notification' as const, id: n.id })),
            ]
          : [{ type: 'NotificationList', id: 'LIST' }],
    }),
    getUnreadCount: builder.query<UnreadCountResult, void>({
      queryFn: async () => {
        try {
          const data = await getUnreadCountRequest();
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to load unread count',
            },
          };
        }
      },
      providesTags: [{ type: 'UnreadCount', id: 'COUNT' }],
    }),
    markNotificationRead: builder.mutation<Notification, string>({
      queryFn: async (id) => {
        try {
          const data = await markNotificationReadRequest(id);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to mark notification as read',
            },
          };
        }
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'Notification', id },
        { type: 'NotificationList', id: 'LIST' },
        { type: 'UnreadCount', id: 'COUNT' },
      ],
      async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
        const patches: Array<{ undo: () => void }> = [];
        const cachedArgs = notificationsApi.util.selectCachedArgsForQuery(
          getState(),
          'listNotifications',
        );

        let wasUnread = false;
        for (const arg of cachedArgs) {
          const patch = dispatch(
            notificationsApi.util.updateQueryData('listNotifications', arg, (draft) => {
              const item = draft.notifications.find((n) => n.id === id);
              if (item && isNotificationUnread(item)) {
                wasUnread = true;
                applyMarkReadToLists([{ arg, draft }], id);
              }
            }),
          );
          patches.push(patch);
        }

        if (wasUnread) {
          patches.push(
            dispatch(
              notificationsApi.util.updateQueryData('getUnreadCount', undefined, (draft) => {
                adjustUnreadCount(draft, -1);
              }),
            ),
          );
        }

        try {
          const { data } = await queryFulfilled;
          for (const arg of cachedArgs) {
            dispatch(
              notificationsApi.util.updateQueryData('listNotifications', arg, (draft) => {
                applyMarkReadToLists([{ arg, draft }], id, data);
              }),
            );
          }
        } catch {
          patches.forEach((p) => p.undo());
        }
      },
    }),
    markAllNotificationsRead: builder.mutation<MarkAllReadResult, void>({
      queryFn: async () => {
        try {
          const data = await markAllNotificationsReadRequest();
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error:
                error instanceof Error ? error.message : 'Failed to mark all notifications as read',
            },
          };
        }
      },
      invalidatesTags: [
        { type: 'NotificationList', id: 'LIST' },
        { type: 'UnreadCount', id: 'COUNT' },
      ],
      async onQueryStarted(_arg, { dispatch, getState, queryFulfilled }) {
        const patches: Array<{ undo: () => void }> = [];
        const cachedArgs = notificationsApi.util.selectCachedArgsForQuery(
          getState(),
          'listNotifications',
        );

        for (const arg of cachedArgs) {
          patches.push(
            dispatch(
              notificationsApi.util.updateQueryData('listNotifications', arg, (draft) => {
                applyMarkAllReadToLists([{ draft }]);
              }),
            ),
          );
        }

        patches.push(
          dispatch(
            notificationsApi.util.updateQueryData('getUnreadCount', undefined, (draft) => {
              draft.unreadCount = 0;
            }),
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patches.forEach((p) => p.undo());
        }
      },
    }),
  }),
});

export const {
  useListNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationsApi;

export const notificationListQueryKeys = {
  default: DEFAULT_NOTIFICATION_LIST_QUERY,
  dropdown: DROPDOWN_NOTIFICATION_LIST_QUERY,
} as const;
