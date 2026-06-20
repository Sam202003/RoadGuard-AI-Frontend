'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { routes } from '@roadguard/config';
import { DashboardContent, DashboardPageHeader } from '@/modules/dashboard';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/get-error-message';
import { useGetMyProviderQuery } from '@/store/api/provider.api';
import { LocationUpdateForm } from '../components/location-update-form';
import { ProviderProfileCard } from '../components/provider-profile-card';
import { ProviderDashboardSkeleton } from '../components/provider-skeleton';
import { ProviderStatusToggles } from '../components/provider-status-toggles';

export function ProviderAvailabilityPage() {
  const {
    data: provider,
    isLoading,
    isError,
    error,
  } = useGetMyProviderQuery();

  if (isLoading) {
    return (
      <DashboardContent>
        <ProviderDashboardSkeleton />
      </DashboardContent>
    );
  }

  if (isError || !provider) {
    return (
      <DashboardContent>
        <DashboardPageHeader
          title="Availability"
          description="Control when you receive breakdown assignments."
        />
        <p className="text-destructive">
          {getErrorMessage(error, 'Provider profile not found. Please onboard via the API.')}
        </p>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <DashboardPageHeader
          title="Availability & service area"
          description="Go online, set availability, and update your location so customers can find you."
        />
        <Button variant="outline" asChild className="shrink-0 gap-2">
          <Link href={routes.provider.dashboard}>
            Dispatch dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <ProviderProfileCard provider={provider} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ProviderStatusToggles provider={provider} />
        <LocationUpdateForm provider={provider} />
      </div>
    </DashboardContent>
  );
}
