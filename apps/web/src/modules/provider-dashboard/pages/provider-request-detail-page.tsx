'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, MapPin, User } from 'lucide-react';
import { routes } from '@roadguard/config';
import { DashboardContent, DashboardPageHeader } from '@/modules/dashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getErrorMessage } from '@/lib/get-error-message';
import { useGetBreakdownRequestQuery } from '@/store/api/breakdown.api';
import {
  PriorityBadge,
  StatusBadge,
} from '@/modules/breakdown-requests/components/status-badge';
import { issueTypeLabels } from '@/modules/breakdown-requests/constants/breakdown-labels';
import { isTerminalBreakdownStatus } from '@/modules/breakdown-requests/utils/breakdown-formatters';
import {
  formatCoordinates,
  formatEtaMinutes,
  formatRequestDate,
} from '@/modules/breakdown-requests/utils/breakdown-formatters';
import { ProviderDashboardSkeleton } from '../components/provider-skeleton';
import { StatusUpdateActions } from '../components/status-update-actions';
import { ProviderRoutePreview, ProviderTrackingControls } from '@/modules/realtime';
import { formatShortId, isEmergencyRequest } from '../utils/request-helpers';

interface ProviderRequestDetailPageProps {
  requestId: string;
}

export function ProviderRequestDetailPage({ requestId }: ProviderRequestDetailPageProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { data: request, isLoading, isError, error, refetch } =
    useGetBreakdownRequestQuery(requestId);

  useEffect(() => {
    if (!request || isTerminalBreakdownStatus(request.status)) return;
    const timer = setInterval(() => void refetch(), 10_000);
    return () => clearInterval(timer);
  }, [request, requestId, refetch]);

  if (isLoading) {
    return (
      <DashboardContent>
        <ProviderDashboardSkeleton />
      </DashboardContent>
    );
  }

  if (isError || !request) {
    return (
      <DashboardContent>
        <p className="text-destructive">{getErrorMessage(error, 'Request not found')}</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href={routes.provider.requests}>Back to requests</Link>
        </Button>
      </DashboardContent>
    );
  }

  const emergency = isEmergencyRequest(request);

  return (
    <DashboardContent>
      <Button variant="ghost" size="sm" className="mb-2 -ml-2 w-fit gap-1" asChild>
        <Link href={routes.provider.requests}>
          <ArrowLeft className="h-4 w-4" />
          Back to requests
        </Link>
      </Button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <DashboardPageHeader
          title={issueTypeLabels[request.issueType]}
          description={`Job ${formatShortId(request.id)} · ${formatRequestDate(request.requestedAt)}`}
        />
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={request.status} />
          <PriorityBadge priority={request.priority} />
          {emergency && (
            <span className="inline-flex items-center gap-1 rounded-full border border-destructive/40 bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
              <AlertTriangle className="h-3.5 w-3.5" />
              Emergency
            </span>
          )}
        </div>
      </div>

      <ProviderTrackingControls request={request} />
      <ProviderRoutePreview request={request} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/60 bg-card/70 p-5 lg:col-span-2">
          <h3 className="font-semibold">Job details</h3>
          <p className="mt-3 text-sm leading-relaxed">{request.issueDescription}</p>
          <Separator className="my-4" />
          <dl className="grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Customer</dt>
              <dd className="mt-1 flex items-center gap-1 font-medium">
                <User className="h-4 w-4" />
                {formatShortId(request.customerId)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Vehicle</dt>
              <dd className="mt-1 font-medium">{formatShortId(request.vehicleId)}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Pickup location</dt>
              <dd className="mt-1 flex items-center gap-1 font-mono text-xs">
                <MapPin className="h-4 w-4 shrink-0" />
                {formatCoordinates(request.location)}
              </dd>
            </div>
            {request.estimatedArrivalTime != null && (
              <div>
                <dt className="text-muted-foreground">Estimated arrival</dt>
                <dd className="mt-1">{formatEtaMinutes(request.estimatedArrivalTime)}</dd>
              </div>
            )}
            {request.estimatedDistance != null && (
              <div>
                <dt className="text-muted-foreground">Distance</dt>
                <dd className="mt-1">{request.estimatedDistance} km</dd>
              </div>
            )}
            {request.assignedAt && (
              <div>
                <dt className="text-muted-foreground">Assigned at</dt>
                <dd className="mt-1">{formatRequestDate(request.assignedAt)}</dd>
              </div>
            )}
            {request.arrivedAt && (
              <div>
                <dt className="text-muted-foreground">Arrived at</dt>
                <dd className="mt-1">{formatRequestDate(request.arrivedAt)}</dd>
              </div>
            )}
            {request.completedAt && (
              <div>
                <dt className="text-muted-foreground">Completed at</dt>
                <dd className="mt-1">{formatRequestDate(request.completedAt)}</dd>
              </div>
            )}
          </dl>
        </Card>

        <Card className="border-border/60 bg-card/70 p-5">
          <h3 className="font-semibold">Update status</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Advance the job through each service stage.
          </p>
          <div className="mt-4">
            <StatusUpdateActions
              request={request}
              updatingId={updatingId}
              onUpdatingChange={setUpdatingId}
            />
          </div>
        </Card>
      </div>
    </DashboardContent>
  );
}
