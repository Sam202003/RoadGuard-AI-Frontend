'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  PriorityBadge,
  StatusBadge,
} from '@/modules/breakdown-requests/components/status-badge';
import { issueTypeLabels } from '@/modules/breakdown-requests/constants/breakdown-labels';
import {
  formatCoordinates,
  formatEtaMinutes,
  formatRequestDate,
} from '@/modules/breakdown-requests/utils/breakdown-formatters';
import type { BreakdownRequest } from '@/modules/breakdown-requests/types/breakdown.types';
import { formatShortId, isEmergencyRequest } from '../utils/request-helpers';
import { StatusUpdateActions } from './status-update-actions';

interface RequestDetailSheetProps {
  request: BreakdownRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  updatingId?: string | null;
  onUpdatingChange?: (id: string | null) => void;
}

export function RequestDetailSheet({
  request,
  open,
  onOpenChange,
  updatingId,
  onUpdatingChange,
}: RequestDetailSheetProps) {
  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{issueTypeLabels[request.issueType]}</DialogTitle>
          <DialogDescription>
            Request {formatShortId(request.id)}
            {isEmergencyRequest(request) ? ' · Emergency' : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={request.status} />
            <PriorityBadge priority={request.priority} />
          </div>

          <p className="text-sm">{request.issueDescription}</p>

          <Separator />

          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Customer</dt>
              <dd>{formatShortId(request.customerId)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Vehicle</dt>
              <dd>{formatShortId(request.vehicleId)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Location</dt>
              <dd className="font-mono text-xs">{formatCoordinates(request.location)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Requested</dt>
              <dd>{formatRequestDate(request.requestedAt)}</dd>
            </div>
            {request.estimatedArrivalTime != null && (
              <div>
                <dt className="text-muted-foreground">ETA</dt>
                <dd>
                  {formatEtaMinutes(request.estimatedArrivalTime)}
                  {request.estimatedDistance != null && ` (${request.estimatedDistance} km)`}
                </dd>
              </div>
            )}
          </dl>

          <Separator />

          <StatusUpdateActions
            request={request}
            updatingId={updatingId}
            onUpdatingChange={onUpdatingChange}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
