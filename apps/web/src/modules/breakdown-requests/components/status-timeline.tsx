'use client';

import { Check, Circle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BreakdownStatus } from '../constants/breakdown.enums';
import { TIMELINE_STATUSES, statusLabels } from '../constants/breakdown-labels';
import { getActiveStepIndex } from '../utils/breakdown-formatters';
import type { BreakdownRequest } from '../types/breakdown.types';

interface StatusTimelineProps {
  request: BreakdownRequest;
}

export function StatusTimeline({ request }: StatusTimelineProps) {
  const isCancelled = request.status === BreakdownStatus.CANCELLED;
  const activeIndex = getActiveStepIndex(request.status, TIMELINE_STATUSES);

  if (isCancelled) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
        <div className="flex items-center gap-2 text-destructive">
          <X className="h-5 w-5" />
          <span className="font-medium">Request cancelled</span>
        </div>
        {request.cancellationReason && (
          <p className="mt-2 text-sm text-muted-foreground">{request.cancellationReason}</p>
        )}
        {request.cancelledAt && (
          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(request.cancelledAt).toLocaleString()}
          </p>
        )}
      </div>
    );
  }

  return (
    <ol className="relative space-y-0">
      {TIMELINE_STATUSES.map((step, index) => {
        const isComplete = index < activeIndex;
        const isCurrent = index === activeIndex;
        const isLast = index === TIMELINE_STATUSES.length - 1;

        return (
          <li key={step} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <span
                className={cn(
                  'absolute left-[15px] top-8 h-full w-0.5',
                  isComplete ? 'bg-primary' : 'bg-border',
                )}
              />
            )}
            <div
              className={cn(
                'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2',
                isComplete && 'border-primary bg-primary text-primary-foreground',
                isCurrent && 'border-primary bg-primary/10 text-primary',
                !isComplete && !isCurrent && 'border-muted bg-muted text-muted-foreground',
              )}
            >
              {isComplete ? (
                <Check className="h-4 w-4" />
              ) : (
                <Circle className={cn('h-3 w-3', isCurrent && 'fill-primary')} />
              )}
            </div>
            <div className="min-w-0 pt-0.5">
              <p
                className={cn(
                  'text-sm font-medium',
                  isCurrent && 'text-foreground',
                  !isCurrent && !isComplete && 'text-muted-foreground',
                )}
              >
                {statusLabels[step]}
              </p>
              {isCurrent && (
                <p className="text-xs text-muted-foreground">Current status</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
