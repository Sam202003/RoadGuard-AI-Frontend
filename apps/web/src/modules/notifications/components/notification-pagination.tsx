'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationMeta } from '../types/notification.types';

interface NotificationPaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function NotificationPagination({
  meta,
  onPageChange,
  isLoading,
}: NotificationPaginationProps) {
  if (meta.totalPages <= 1) return null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing page {meta.page} of {meta.totalPages} ({meta.total} total)
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading || meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading || meta.page >= meta.totalPages}
          onClick={() => onPageChange(meta.page + 1)}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
