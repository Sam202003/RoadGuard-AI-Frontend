'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  notificationTypeIcons,
  notificationTypeLabels,
} from '../constants/notification-labels';
import type { Notification } from '../types/notification.types';
import { formatNotificationTime, isNotificationUnread } from '../utils/notification-helpers';
import { NotificationPriority } from '../constants/notification.enums';

interface NotificationItemProps {
  notification: Notification;
  compact?: boolean;
  onClick?: (notification: Notification) => void;
}

export function NotificationItem({ notification, compact, onClick }: NotificationItemProps) {
  const unread = isNotificationUnread(notification);
  const Icon = notificationTypeIcons[notification.type];
  const isEmergency = notification.priority === NotificationPriority.EMERGENCY;

  return (
    <button
      type="button"
      onClick={() => onClick?.(notification)}
      className={cn(
        'flex w-full gap-3 rounded-xl border text-left transition-colors',
        compact ? 'border-transparent px-2 py-2.5 hover:bg-accent' : 'border-border/60 p-4 hover:bg-card/80',
        unread && (compact ? 'bg-primary/5' : 'border-primary/20 bg-primary/5'),
      )}
    >
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-lg border',
          compact ? 'h-8 w-8' : 'h-10 w-10',
          isEmergency
            ? 'border-destructive/30 bg-destructive/10 text-destructive'
            : 'border-border/60 bg-muted/50 text-muted-foreground',
        )}
      >
        <Icon className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('font-medium leading-tight', compact ? 'text-sm' : 'text-base')}>
            {notification.title}
          </p>
          {unread && (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
          )}
        </div>
        <p
          className={cn(
            'mt-1 text-muted-foreground',
            compact ? 'line-clamp-2 text-xs' : 'line-clamp-3 text-sm',
          )}
        >
          {notification.message}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className={cn('text-muted-foreground', compact ? 'text-[10px]' : 'text-xs')}>
            {formatNotificationTime(notification.createdAt)}
          </span>
          {!compact && (
            <Badge variant="outline" className="text-[10px]">
              {notificationTypeLabels[notification.type]}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}
