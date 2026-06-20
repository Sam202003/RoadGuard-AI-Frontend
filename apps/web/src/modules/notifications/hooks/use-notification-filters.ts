'use client';

import { useCallback, useState } from 'react';
import { NotificationType } from '../constants/notification.enums';

export function useNotificationFilters() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'ALL'>('ALL');
  const [unreadOnly, setUnreadOnly] = useState(false);

  const clearFilters = useCallback(() => {
    setUnreadOnly(false);
    setTypeFilter('ALL');
    setPage(1);
  }, []);

  return {
    page,
    typeFilter,
    unreadOnly,
    setPage,
    setTypeFilter,
    setUnreadOnly,
    clearFilters,
  };
}
