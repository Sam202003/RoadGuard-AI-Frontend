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
  formatRequestDate,
} from '@/modules/breakdown-requests/utils/breakdown-formatters';
import type { BreakdownRequest } from '@/modules/breakdown-requests/types/breakdown.types';
import { RequestTimeline } from './request-timeline';
import { formatShortId } from '../utils/formatters';
import { isEmergencyRequest } from '../utils/breakdown-helpers';

interface BreakdownDetailSheetProps {
  request: BreakdownRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BreakdownDetailSheet({ request, open, onOpenChange }: BreakdownDetailSheetProps) {
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

        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={request.status} />
            <PriorityBadge priority={request.priority} />
          </div>

          <p className="text-sm">{request.issueDescription}</p>

          <Separator />

          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Customer</dt>
              <dd className="font-mono text-xs">{formatShortId(request.customerId)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Assigned provider</dt>
              <dd className="font-mono text-xs">
                {request.assignedProviderId
                  ? formatShortId(request.assignedProviderId)
                  : 'Unassigned'}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Vehicle</dt>
              <dd className="font-mono text-xs">{formatShortId(request.vehicleId)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Location</dt>
              <dd className="font-mono text-xs">{formatCoordinates(request.location)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Requested</dt>
              <dd>{formatRequestDate(request.requestedAt)}</dd>
            </div>
          </dl>

          <Separator />

          <div>
            <p className="mb-4 text-sm font-medium">Request timeline</p>
            <RequestTimeline request={request} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
