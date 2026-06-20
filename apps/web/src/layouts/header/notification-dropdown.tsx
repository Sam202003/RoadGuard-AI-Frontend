'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { UserRole } from '@roadguard/types';
import { getNotificationsPathForRole } from '@roadguard/config';
import { Bell, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getErrorMessage } from '@/lib/get-error-message';
import { useSocketConnection } from '@/modules/realtime';
import {
  notificationListQueryKeys,
  NotificationItem,
  NotificationListSkeleton,
  useGetUnreadCountQuery,
  useListNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from '@/modules/notifications';
import { formatUnreadBadge } from '@/modules/notifications/utils/notification-helpers';
import { selectAuthUser } from '@/store/auth.selectors';
import { cn } from '@/lib/utils';

function getNotificationsPath(role?: UserRole): string {
  if (!role) return getNotificationsPathForRole(UserRole.CUSTOMER);
  return getNotificationsPathForRole(role);
}

export function NotificationDropdown({ triggerClassName }: { triggerClassName?: string }) {
  const user = useSelector(selectAuthUser);
  const { isConnected } = useSocketConnection();
  const notificationsPath = getNotificationsPath(user?.role);

  const { data: unreadData, refetch: refetchUnread } = useGetUnreadCountQuery(undefined, {
    skip: !user,
    pollingInterval: isConnected ? 0 : 60_000,
  });
  const { data, isLoading, isError, refetch } = useListNotificationsQuery(
    notificationListQueryKeys.dropdown,
    { skip: !user },
  );
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsReadMutation();

  const unreadCount = unreadData?.unreadCount ?? 0;
  const notifications = data?.notifications ?? [];

  const handleMarkRead = async (id: string) => {
    try {
      await markRead(id).unwrap();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to mark as read'));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead().unwrap();
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to mark all as read'));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('relative', triggerClassName)}
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {formatUnreadBadge(unreadCount)}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 sm:w-96">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs"
              disabled={isMarkingAll}
              onClick={handleMarkAllRead}
            >
              <CheckCheck className="h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[280px]">
          {isLoading && (
            <div className="p-2">
              <NotificationListSkeleton count={3} />
            </div>
          )}

          {isError && (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              <p>Could not load notifications</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => {
                  void refetch();
                  void refetchUnread();
                }}
              >
                Retry
              </Button>
            </div>
          )}

          {!isLoading && !isError && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-sm text-muted-foreground">
              <Bell className="h-8 w-8 opacity-40" />
              <p>No notifications yet</p>
            </div>
          )}

          {!isLoading && !isError && notifications.length > 0 && (
            <ul className="space-y-1 p-1">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <NotificationItem
                    notification={notification}
                    compact
                    onClick={(item) => {
                      if (item.readAt == null) {
                        void handleMarkRead(item.id);
                      }
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href={notificationsPath}>View all notifications</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
