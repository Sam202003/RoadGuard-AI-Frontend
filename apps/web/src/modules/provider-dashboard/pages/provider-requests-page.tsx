'use client';

import { useMemo, useState } from 'react';
import { DashboardContent, DashboardPageHeader } from '@/modules/dashboard';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getErrorMessage } from '@/lib/get-error-message';
import { useListBreakdownRequestsQuery } from '@/store/api/breakdown.api';
import { BreakdownStatus } from '@/modules/breakdown-requests/constants/breakdown.enums';
import { statusLabels } from '@/modules/breakdown-requests/constants/breakdown-labels';
import { PROVIDER_BREAKDOWN_LIST_QUERY } from '../constants/provider-query';
import { ProviderRequestCard } from '../components/provider-request-card';
import { ProviderRequestsEmptyState } from '../components/provider-empty-state';
import { ProviderRequestListSkeleton } from '../components/provider-skeleton';
import { RequestDetailSheet } from '../components/request-detail-sheet';
import type { BreakdownRequest } from '@/modules/breakdown-requests/types/breakdown.types';
import { sortRequestsByPriority } from '../utils/request-helpers';

export function ProviderRequestsPage() {
  const [statusFilter, setStatusFilter] = useState<BreakdownStatus | 'ALL'>('ALL');
  const [sheetRequest, setSheetRequest] = useState<BreakdownRequest | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const queryArg = useMemo(
    () =>
      statusFilter === 'ALL'
        ? PROVIDER_BREAKDOWN_LIST_QUERY
        : { ...PROVIDER_BREAKDOWN_LIST_QUERY, status: statusFilter },
    [statusFilter],
  );

  const { data, isLoading, isError, error, refetch } = useListBreakdownRequestsQuery(queryArg);
  const requests = sortRequestsByPriority(data?.requests ?? []);

  return (
    <DashboardContent>
      <DashboardPageHeader
        title="Assigned requests"
        description="Your full job queue — active, completed, and cancelled."
      />

      {requests.length > 0 && (
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as BreakdownStatus | 'ALL')}
        >
          <SelectTrigger className="w-full sm:w-[240px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            {Object.values(BreakdownStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {statusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {isLoading && <ProviderRequestListSkeleton />}

      {isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <p className="font-medium text-destructive">Failed to load requests</p>
          <p className="mt-1 text-muted-foreground">
            {getErrorMessage(error, 'Something went wrong')}
          </p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && requests.length === 0 && <ProviderRequestsEmptyState />}

      {!isLoading && !isError && requests.length > 0 && (
        <div className="space-y-4">
          {requests.map((request) => (
            <ProviderRequestCard
              key={request.id}
              request={request}
              onOpenDetail={setSheetRequest}
            />
          ))}
        </div>
      )}

      <RequestDetailSheet
        request={sheetRequest}
        open={!!sheetRequest}
        onOpenChange={(open) => !open && setSheetRequest(null)}
        updatingId={updatingId}
        onUpdatingChange={setUpdatingId}
      />
    </DashboardContent>
  );
}
