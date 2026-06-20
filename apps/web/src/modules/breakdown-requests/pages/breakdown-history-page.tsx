'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { routes } from '@roadguard/config';
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
import { BreakdownRequestCard } from '../components/breakdown-request-card';
import { BreakdownEmptyState } from '../components/breakdown-empty-state';
import { BreakdownListSkeleton } from '../components/breakdown-skeleton';
import { BreakdownStatus } from '../constants/breakdown.enums';
import { statusLabels } from '../constants/breakdown-labels';
import { DEFAULT_BREAKDOWN_LIST_QUERY } from '../constants/breakdown-query';

export function BreakdownHistoryPage() {
  const [statusFilter, setStatusFilter] = useState<BreakdownStatus | 'ALL'>('ALL');
  const queryArg = useMemo(
    () =>
      statusFilter === 'ALL'
        ? DEFAULT_BREAKDOWN_LIST_QUERY
        : { ...DEFAULT_BREAKDOWN_LIST_QUERY, status: statusFilter },
    [statusFilter],
  );

  const { data, isLoading, isError, error, refetch } = useListBreakdownRequestsQuery(queryArg);
  const requests = data?.requests ?? [];
  const hasFilter = statusFilter !== 'ALL';

  return (
    <DashboardContent>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <DashboardPageHeader
          title="Breakdown requests"
          description="Track active assistance requests and view your roadside history."
        />
        <Button asChild className="shrink-0 gap-2 self-start">
          <Link href={routes.customer.breakdownNew}>
            <Plus className="h-4 w-4" />
            New request
          </Link>
        </Button>
      </div>

      <Select
        value={statusFilter}
        onValueChange={(v) => setStatusFilter(v as BreakdownStatus | 'ALL')}
      >
        <SelectTrigger className="w-full sm:w-[220px]">
          <SelectValue placeholder="Filter by status" />
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

      {isLoading && <BreakdownListSkeleton />}

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

      {!isLoading && !isError && requests.length === 0 && (
        <BreakdownEmptyState
          filtered={hasFilter}
          onClearFilter={hasFilter ? () => setStatusFilter('ALL') : undefined}
        />
      )}

      {!isLoading && !isError && requests.length > 0 && (
        <div className="space-y-4">
          {requests.map((request) => (
            <BreakdownRequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </DashboardContent>
  );
}
