'use client';

import { BreakdownStatus } from '@/modules/breakdown-requests/constants/breakdown.enums';
import { statusLabels, TIMELINE_STATUSES } from '@/modules/breakdown-requests/constants/breakdown-labels';
import type { BreakdownRequest } from '@/modules/breakdown-requests/types/breakdown.types';
import { formatAdminDate } from '../utils/formatters';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface RequestTimelineProps {
  request: BreakdownRequest;
}

function getStatusTimestamp(request: BreakdownRequest, status: BreakdownStatus): string | null {
  switch (status) {
    case BreakdownStatus.CREATED:
      return request.requestedAt ?? request.createdAt;
    case BreakdownStatus.PROVIDER_ASSIGNED:
      return request.assignedAt ?? null;
    case BreakdownStatus.ARRIVED:
      return request.arrivedAt ?? null;
    case BreakdownStatus.COMPLETED:
      return request.completedAt ?? null;
    case BreakdownStatus.CANCELLED:
      return request.cancelledAt ?? null;
    default:
      return null;
  }
}

function getStatusIndex(status: BreakdownStatus): number {
  if (status === BreakdownStatus.CANCELLED) return -1;
  return TIMELINE_STATUSES.indexOf(status);
}

export function RequestTimeline({ request }: RequestTimelineProps) {
  const currentIndex = getStatusIndex(request.status);
  const isCancelled = request.status === BreakdownStatus.CANCELLED;

  if (isCancelled) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
        <p className="font-medium text-destructive">Request cancelled</p>
        {request.cancelledAt && (
          <p className="mt-1 text-muted-foreground">{formatAdminDate(request.cancelledAt)}</p>
        )}
        {request.cancellationReason && (
          <p className="mt-2 text-muted-foreground">{request.cancellationReason}</p>
        )}
      </div>
    );
  }

  return (
    <ol className="space-y-0">
      {TIMELINE_STATUSES.map((status, index) => {
        const isComplete = currentIndex >= index;
        const isCurrent = request.status === status;
        const timestamp = getStatusTimestamp(request, status);

        return (
          <li key={status} className="relative flex gap-3 pb-6 last:pb-0">
            {index < TIMELINE_STATUSES.length - 1 && (
              <span
                className={cn(
                  'absolute left-[11px] top-6 h-full w-px',
                  isComplete ? 'bg-primary/40' : 'bg-border',
                )}
              />
            )}
            <div
              className={cn(
                'relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2',
                isComplete
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground',
                isCurrent && 'ring-2 ring-primary/30',
              )}
            >
              {isComplete ? <Check className="h-3 w-3" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className={cn('text-sm font-medium', isComplete ? 'text-foreground' : 'text-muted-foreground')}>
                {statusLabels[status]}
              </p>
              {timestamp && (
                <p className="text-xs text-muted-foreground">{formatAdminDate(timestamp)}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
