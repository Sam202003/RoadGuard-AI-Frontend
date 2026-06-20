'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { DashboardContent, DashboardPageHeader } from '@/modules/dashboard';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/get-error-message';
import {
  AvailabilityStatus,
  OnlineStatus,
} from '@/modules/provider-dashboard/constants/provider.enums';
import { useListAdminProvidersQuery } from '../api';
import { DataTable } from '../components/data-table';
import { ProviderDetailSheet } from '../components/provider-detail-sheet';
import { availabilityLabels, onlineStatusLabels } from '../constants/admin-labels';
import { useAdminProviderColumns } from '../hooks/use-admin-provider-columns';
import type { AdminProvider } from '../types/admin.types';

export function AdminProvidersPage() {
  const [search, setSearch] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityStatus | 'ALL'>('ALL');
  const [onlineFilter, setOnlineFilter] = useState<OnlineStatus | 'ALL'>('ALL');
  const [selectedProvider, setSelectedProvider] = useState<AdminProvider | null>(null);

  const queryArg = useMemo(
    () => ({
      page: 1,
      limit: 50,
      search: search.trim() || undefined,
      availabilityStatus: availabilityFilter === 'ALL' ? undefined : availabilityFilter,
      onlineStatus: onlineFilter === 'ALL' ? undefined : onlineFilter,
    }),
    [search, availabilityFilter, onlineFilter],
  );

  const { data, isLoading, isError, error, refetch } = useListAdminProvidersQuery(queryArg);
  const columns = useAdminProviderColumns(setSelectedProvider);

  return (
    <DashboardContent>
      <DashboardPageHeader
        title="Provider management"
        description="Monitor provider availability, ratings, and service coverage."
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search providers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={availabilityFilter}
          onValueChange={(v) => setAvailabilityFilter(v as AvailabilityStatus | 'ALL')}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All availability</SelectItem>
            {Object.values(AvailabilityStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {availabilityLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={onlineFilter}
          onValueChange={(v) => setOnlineFilter(v as OnlineStatus | 'ALL')}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Online status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All online</SelectItem>
            {Object.values(OnlineStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {onlineStatusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <p className="font-medium text-destructive">Failed to load providers</p>
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
        data={data?.providers ?? []}
        isLoading={isLoading}
        emptyMessage="No providers match your filters."
        onRowClick={setSelectedProvider}
      />

      <ProviderDetailSheet
        provider={selectedProvider}
        open={!!selectedProvider}
        onOpenChange={(open) => !open && setSelectedProvider(null)}
      />
    </DashboardContent>
  );
}
