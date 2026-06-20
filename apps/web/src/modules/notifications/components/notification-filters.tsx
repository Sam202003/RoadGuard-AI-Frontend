'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { NotificationType } from '../constants/notification.enums';
import { notificationTypeLabels, notificationTypeOptions } from '../constants/notification-labels';

interface NotificationFiltersProps {
  typeFilter: NotificationType | 'ALL';
  unreadOnly: boolean;
  onTypeChange: (value: NotificationType | 'ALL') => void;
  onUnreadOnlyChange: (value: boolean) => void;
}

export function NotificationFilters({
  typeFilter,
  unreadOnly,
  onTypeChange,
  onUnreadOnlyChange,
}: NotificationFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Select
        value={typeFilter}
        onValueChange={(v) => onTypeChange(v as NotificationType | 'ALL')}
      >
        <SelectTrigger className="w-full sm:w-[220px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All types</SelectItem>
          {notificationTypeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {notificationTypeLabels[option.value]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={unreadOnly ? 'unread' : 'all'}
        onValueChange={(v) => onUnreadOnlyChange(v === 'unread')}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Read status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All notifications</SelectItem>
          <SelectItem value="unread">Unread only</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
