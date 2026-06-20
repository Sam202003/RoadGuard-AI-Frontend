'use client';

import { DashboardContent, DashboardPageHeader } from '@/modules/dashboard';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/get-error-message';
import { useGetAdminAnalyticsQuery } from '../api';
import { AnalyticsCharts } from '../components/analytics-charts';

export function AdminAnalyticsPage() {
  const { data, isLoading, isError, error, refetch } = useGetAdminAnalyticsQuery();

  return (
    <DashboardContent className="max-w-7xl">
      <DashboardPageHeader
        title="Analytics"
        description="Platform insights — request volume, status distribution, and provider activity."
      />

      {isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <p className="font-medium text-destructive">Failed to load analytics</p>
          <p className="mt-1 text-muted-foreground">
            {getErrorMessage(error, 'Something went wrong')}
          </p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      <AnalyticsCharts analytics={data} isLoading={isLoading} />
    </DashboardContent>
  );
}
