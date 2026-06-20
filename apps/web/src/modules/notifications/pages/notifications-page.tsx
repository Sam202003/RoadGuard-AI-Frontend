'use client';

import { useMemo } from 'react';
import { CheckCheck } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardContent, DashboardPageHeader } from '@/modules/dashboard';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/get-error-message';
import { NotificationType } from '../constants/notification.enums';
import {
  useListNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from '../api';
import { NotificationEmptyState } from '../components/notification-empty-state';
import { NotificationFilters } from '../components/notification-filters';
import { NotificationItem } from '../components/notification-item';
import { NotificationListSkeleton } from '../components/notification-list-skeleton';
import { NotificationPagination } from '../components/notification-pagination';
import { formatUnreadBadge, isNotificationUnread } from '../utils/notification-helpers';
import { useNotificationFilters } from '../hooks/use-notification-filters';

export function NotificationsPage() {
  const { page, typeFilter, unreadOnly, setPage, setTypeFilter, setUnreadOnly, clearFilters } =
    useNotificationFilters();

  const queryArg = useMemo(
    () => ({
      page,
      limit: 20,
      sort: '-createdAt',
      unreadOnly: unreadOnly || undefined,
      type: typeFilter === 'ALL' ? undefined : typeFilter,
    }),
    [page, typeFilter, unreadOnly],
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useListNotificationsQuery(queryArg);
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsReadMutation();

  const notifications = data?.notifications ?? [];
  const meta = data?.meta;
  const hasUnread = notifications.some(isNotificationUnread);

  const handleMarkRead = async (id: string) => {
    try {
      await markRead(id).unwrap();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to mark notification as read'));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const result = await markAllRead().unwrap();
      toast.success(
        result.updatedCount > 0
          ? `${result.updatedCount} notification${result.updatedCount === 1 ? '' : 's'} marked as read`
          : 'All caught up',
      );
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to mark all as read'));
    }
  };

  return (
    <DashboardContent>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <DashboardPageHeader
          title="Notifications"
          description="Stay updated on breakdown requests, provider activity, and platform alerts."
        />
        {hasUnread && (
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 gap-2 self-start"
            disabled={isMarkingAll}
            onClick={handleMarkAllRead}
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      <NotificationFilters
        typeFilter={typeFilter}
        unreadOnly={unreadOnly}
        onTypeChange={(value) => {
          setTypeFilter(value);
          setPage(1);
        }}
        onUnreadOnlyChange={(value) => {
          setUnreadOnly(value);
          setPage(1);
        }}
      />

      {isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <p className="font-medium text-destructive">Failed to load notifications</p>
          <p className="mt-1 text-muted-foreground">
            {getErrorMessage(error, 'Something went wrong')}
          </p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {isLoading && <NotificationListSkeleton />}

      {!isLoading && !isError && notifications.length === 0 && (
        <NotificationEmptyState
          unreadOnly={unreadOnly}
          onClearFilters={unreadOnly ? clearFilters : undefined}
        />
      )}

      {!isLoading && !isError && notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={(item) => {
                if (isNotificationUnread(item)) {
                  void handleMarkRead(item.id);
                }
              }}
            />
          ))}
        </div>
      )}

      {meta && (
        <NotificationPagination
          meta={meta}
          onPageChange={setPage}
          isLoading={isFetching}
        />
      )}
    </DashboardContent>
  );
}
