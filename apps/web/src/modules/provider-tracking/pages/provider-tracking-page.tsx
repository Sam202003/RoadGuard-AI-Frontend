'use client';

import Link from 'next/link';
import { getProviderRequestDetailPath } from '@roadguard/config';
import { DashboardContent, DashboardPageHeader } from '@/modules/dashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/modules/breakdown-requests/components/status-badge';
import { issueTypeLabels } from '@/modules/breakdown-requests/constants/breakdown-labels';
import { formatRequestDate } from '@/modules/breakdown-requests/utils/breakdown-formatters';
import { ProviderTrackingControls } from '@/modules/realtime/components/provider-tracking-controls';
import { PROVIDER_BREAKDOWN_LIST_QUERY } from '@/modules/provider-dashboard/constants/provider-query';
import {
  isActiveProviderRequest,
  sortRequestsByPriority,
} from '@/modules/provider-dashboard/utils/request-helpers';
import { useListBreakdownRequestsQuery } from '@/store/api/breakdown.api';

export function ProviderTrackingPage() {
  const { data, isLoading } = useListBreakdownRequestsQuery(PROVIDER_BREAKDOWN_LIST_QUERY);
  const active = sortRequestsByPriority(
    (data?.requests ?? []).filter(isActiveProviderRequest),
  );

  return (
    <DashboardContent>
      <DashboardPageHeader
        title="Live tracking"
        description="Broadcast GPS location for active assigned jobs."
      />

      {isLoading && <p className="text-sm text-muted-foreground">Loading jobs…</p>}

      {!isLoading && active.length === 0 && (
        <Card className="border-dashed border-border/70 bg-muted/20 p-6 text-sm text-muted-foreground">
          No active jobs to track. Accept assignments from your requests queue.
        </Card>
      )}

      <div className="space-y-8">
        {active.map((request) => (
          <section key={request.id} className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold">{issueTypeLabels[request.issueType]}</h2>
                <p className="text-xs text-muted-foreground">
                  Updated {formatRequestDate(request.updatedAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={request.status} />
                <Button variant="outline" size="sm" asChild>
                  <Link href={getProviderRequestDetailPath(request.id)}>Job detail</Link>
                </Button>
              </div>
            </div>
            <ProviderTrackingControls request={request} />
          </section>
        ))}
      </div>
    </DashboardContent>
  );
}
