'use client';

import { Clock, MapPinned, UserCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { BreakdownStatus } from '../constants/breakdown.enums';
import { formatEtaMinutes, formatRequestDate } from '../utils/breakdown-formatters';
import type { BreakdownRequest } from '../types/breakdown.types';

interface AssignedProviderCardProps {
  request: BreakdownRequest;
}

export function AssignedProviderCard({ request }: AssignedProviderCardProps) {
  const hasProvider =
    request.assignedProviderId &&
    request.status !== BreakdownStatus.SEARCHING_PROVIDER &&
    request.status !== BreakdownStatus.CREATED;

  if (!hasProvider && request.status === BreakdownStatus.SEARCHING_PROVIDER) {
    return (
      <Card className="border-amber-500/20 bg-amber-500/5 p-5">
        <p className="font-medium text-amber-800 dark:text-amber-300">Searching for provider</p>
        <p className="mt-1 text-sm text-muted-foreground">
          We are matching you with the nearest available roadside assistance provider.
        </p>
      </Card>
    );
  }

  if (!hasProvider) return null;

  return (
    <Card className="border-primary/20 bg-primary/5 p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
          <UserCheck className="h-6 w-6 text-primary" />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <p className="font-semibold">Assigned provider</p>
            <p className="text-sm text-muted-foreground">
              Provider ID: {request.assignedProviderId!.slice(-8).toUpperCase()}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            {request.estimatedArrivalTime != null && (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                ETA {formatEtaMinutes(request.estimatedArrivalTime)}
              </span>
            )}
            {request.estimatedDistance != null && (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <MapPinned className="h-4 w-4 text-primary" />
                {request.estimatedDistance} km away
              </span>
            )}
          </div>
          {request.assignedAt && (
            <p className="text-xs text-muted-foreground">
              Assigned {formatRequestDate(request.assignedAt)}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Full provider profile will appear when the provider directory API is connected.
          </p>
        </div>
      </div>
    </Card>
  );
}
