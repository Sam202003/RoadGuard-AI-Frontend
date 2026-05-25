'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { routes } from '@roadguard/config';
import { DashboardContent, DashboardPageHeader } from '@/modules/dashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getErrorMessage } from '@/lib/get-error-message';
import {
  useCancelBreakdownRequestMutation,
  useGetBreakdownRequestQuery,
} from '@/store/api/breakdown.api';
import { useListVehiclesQuery } from '@/store/api/vehicles.api';
import { DEFAULT_VEHICLE_LIST_QUERY } from '@/modules/vehicles/constants/vehicle-query';
import { AssignedProviderCard } from '../components/assigned-provider-card';
import { CancelRequestDialog } from '../components/cancel-request-dialog';
import { BreakdownDetailSkeleton } from '../components/breakdown-skeleton';
import { StatusTimeline } from '../components/status-timeline';
import { PriorityBadge, StatusBadge } from '../components/status-badge';
import { issueTypeLabels } from '../constants/breakdown-labels';
import {
  formatCoordinates,
  formatRequestDate,
  isTerminalBreakdownStatus,
} from '../utils/breakdown-formatters';
import { CustomerLiveTrackingPanel } from '@/modules/realtime';
import type { CancelBreakdownFormValues } from '../validations/breakdown.schema';

interface BreakdownDetailPageProps {
  requestId: string;
}

export function BreakdownDetailPage({ requestId }: BreakdownDetailPageProps) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const { data: vehiclesData } = useListVehiclesQuery(DEFAULT_VEHICLE_LIST_QUERY);

  const { data: request, isLoading, isError, error, refetch } =
    useGetBreakdownRequestQuery(requestId);

  useEffect(() => {
    if (!request || isTerminalBreakdownStatus(request.status)) return;
    const timer = setInterval(() => {
      void refetch();
    }, 10_000);
    return () => clearInterval(timer);
  }, [request, requestId, refetch]);

  const [cancelRequest, { isLoading: isCancelling }] = useCancelBreakdownRequestMutation();

  const vehicle = vehiclesData?.vehicles.find((v) => v.id === request?.vehicleId);

  const handleCancel = async (values: CancelBreakdownFormValues) => {
    try {
      await cancelRequest({
        id: requestId,
        body: { cancellationReason: values.cancellationReason.trim() },
      }).unwrap();
      toast.success('Request cancelled');
      setCancelOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to cancel request'));
    }
  };

  if (isLoading) {
    return (
      <DashboardContent>
        <BreakdownDetailSkeleton />
      </DashboardContent>
    );
  }

  if (isError || !request) {
    return (
      <DashboardContent>
        <p className="text-destructive">{getErrorMessage(error, 'Request not found')}</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href={routes.customer.breakdown}>Back to requests</Link>
        </Button>
      </DashboardContent>
    );
  }

  const canCancel = !isTerminalBreakdownStatus(request.status);

  return (
    <DashboardContent>
      <Button variant="ghost" size="sm" className="mb-2 -ml-2 w-fit gap-1" asChild>
        <Link href={routes.customer.breakdown}>
          <ArrowLeft className="h-4 w-4" />
          Back to requests
        </Link>
      </Button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <DashboardPageHeader
          title={issueTypeLabels[request.issueType]}
          description={`Requested ${formatRequestDate(request.requestedAt)}`}
        />
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={request.status} />
          <PriorityBadge priority={request.priority} />
        </div>
      </div>

      <CustomerLiveTrackingPanel request={request} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <AssignedProviderCard request={request} />

          <Card className="border-border/60 bg-card/70 p-5">
            <h3 className="font-semibold">Request details</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Description</dt>
                <dd className="mt-1">{request.issueDescription}</dd>
              </div>
              {vehicle && (
                <div>
                  <dt className="text-muted-foreground">Vehicle</dt>
                  <dd className="mt-1">
                    {vehicle.brand} {vehicle.model} · {vehicle.registrationNumber}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-muted-foreground">Location</dt>
                <dd className="mt-1 flex items-center gap-1 font-mono text-xs">
                  <MapPin className="h-3.5 w-3.5" />
                  {formatCoordinates(request.location)}
                </dd>
              </div>
            </dl>
          </Card>

          {canCancel && (
            <Button variant="destructive" onClick={() => setCancelOpen(true)}>
              Cancel request
            </Button>
          )}
        </div>

        <Card className="border-border/60 bg-card/70 p-5">
          <h3 className="mb-4 font-semibold">Status timeline</h3>
          <StatusTimeline request={request} />
        </Card>
      </div>

      <CancelRequestDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        onConfirm={handleCancel}
        isLoading={isCancelling}
      />
    </DashboardContent>
  );
}
