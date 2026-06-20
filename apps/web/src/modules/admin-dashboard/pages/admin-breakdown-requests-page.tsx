'use client';

import { useMemo, useState } from 'react';
import { DashboardContent, DashboardPageHeader } from '@/modules/dashboard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/get-error-message';
import { BreakdownStatus } from '@/modules/breakdown-requests/constants/breakdown.enums';
import { statusLabels } from '@/modules/breakdown-requests/constants/breakdown-labels';
import type { BreakdownRequest } from '@/modules/breakdown-requests/types/breakdown.types';
import { useListAdminBreakdownRequestsQuery } from '../api';
import { DataTable } from '../components/data-table';
import { BreakdownDetailSheet } from '../components/breakdown-detail-sheet';
import { useAdminBreakdownColumns } from '../hooks/use-admin-breakdown-columns';
import { isEmergencyRequest } from '../utils/breakdown-helpers';

export function AdminBreakdownRequestsPage() {
  const [statusFilter, setStatusFilter] = useState<BreakdownStatus | 'ALL'>('ALL');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BreakdownRequest | null>(null);

  const { data, isLoading, isError, error, refetch } = useListAdminBreakdownRequestsQuery();

  const filteredRequests = useMemo(() => {
    let result = data ?? [];
    if (statusFilter !== 'ALL') {
      result = result.filter((r) => r.status === statusFilter);
    }
    if (emergencyOnly) {
      result = result.filter(isEmergencyRequest);
    }
    return [...result].sort(
      (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime(),
    );
  }, [data, statusFilter, emergencyOnly]);

  const columns = useAdminBreakdownColumns(setSelectedRequest);

  return (
    <DashboardContent>
      <DashboardPageHeader
        title="Breakdown monitoring"
        description="View all roadside assistance requests, assignments, and timelines."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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

        <Select
          value={emergencyOnly ? 'emergency' : 'all'}
          onValueChange={(v) => setEmergencyOnly(v === 'emergency')}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Emergency filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="emergency">Emergency only</SelectItem>
          </SelectContent>
        </Select>
      </div>

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

      <DataTable
        columns={columns}
        data={filteredRequests}
        isLoading={isLoading}
        emptyMessage="No breakdown requests match your filters."
        onRowClick={setSelectedRequest}
      />

      <BreakdownDetailSheet
        request={selectedRequest}
        open={!!selectedRequest}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
      />
    </DashboardContent>
  );
}
