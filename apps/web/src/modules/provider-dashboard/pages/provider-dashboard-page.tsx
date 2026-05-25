'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { routes } from '@roadguard/config';
import { DashboardContent, DashboardPageHeader } from '@/modules/dashboard';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/get-error-message';
import { useListBreakdownRequestsQuery } from '@/store/api/breakdown.api';
import { useGetMyProviderQuery } from '@/store/api/provider.api';
import { PROVIDER_BREAKDOWN_LIST_QUERY } from '../constants/provider-query';
import { LocationUpdateForm } from '../components/location-update-form';
import { ProviderMetricsCards } from '../components/provider-metrics-cards';
import { ProviderProfileCard } from '../components/provider-profile-card';
import { ProviderRequestCard } from '../components/provider-request-card';
import { ProviderRequestsEmptyState } from '../components/provider-empty-state';
import { ProviderDashboardSkeleton } from '../components/provider-skeleton';
import { ProviderStatusToggles } from '../components/provider-status-toggles';
import { RequestDetailSheet } from '../components/request-detail-sheet';
import type { BreakdownRequest } from '@/modules/breakdown-requests/types/breakdown.types';
import {
  countActiveRequests,
  countCompletedInList,
  isActiveProviderRequest,
  sortRequestsByPriority,
} from '../utils/request-helpers';

export function ProviderDashboardPage() {
  const [sheetRequest, setSheetRequest] = useState<BreakdownRequest | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const {
    data: provider,
    isLoading: providerLoading,
    isError: providerError,
    error: providerErr,
  } = useGetMyProviderQuery();

  const {
    data: requestsData,
    isLoading: requestsLoading,
    isError: requestsError,
    error: requestsErr,
  } = useListBreakdownRequestsQuery(PROVIDER_BREAKDOWN_LIST_QUERY);

  const requests = requestsData?.requests ?? [];
  const activeRequests = sortRequestsByPriority(requests.filter(isActiveProviderRequest));

  if (providerLoading || requestsLoading) {
    return (
      <DashboardContent>
        <ProviderDashboardSkeleton />
      </DashboardContent>
    );
  }

  if (providerError || !provider) {
    return (
      <DashboardContent>
        <DashboardPageHeader
          title="Provider dashboard"
          description="Complete provider onboarding to access dispatch tools."
        />
        <p className="text-destructive">
          {getErrorMessage(providerErr, 'Provider profile not found. Please onboard via the API.')}
        </p>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <DashboardPageHeader
          title="Dispatch dashboard"
          description="Manage jobs, availability, and your live service area."
        />
        <Button variant="outline" asChild className="shrink-0 gap-2">
          <Link href={routes.provider.requests}>
            All requests
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <ProviderMetricsCards
        activeCount={countActiveRequests(requests)}
        completedCount={countCompletedInList(requests)}
        provider={provider}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ProviderProfileCard provider={provider} />
        <ProviderStatusToggles provider={provider} />
      </div>

      <LocationUpdateForm provider={provider} />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Active jobs</h2>
        {requestsError && (
          <p className="text-sm text-destructive">
            {getErrorMessage(requestsErr, 'Failed to load requests')}
          </p>
        )}
        {!requestsError && activeRequests.length === 0 && <ProviderRequestsEmptyState />}
        {!requestsError &&
          activeRequests.map((request) => (
            <ProviderRequestCard
              key={request.id}
              request={request}
              onOpenDetail={setSheetRequest}
            />
          ))}
      </section>

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
