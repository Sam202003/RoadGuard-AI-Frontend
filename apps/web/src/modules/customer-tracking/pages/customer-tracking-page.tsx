'use client';

import Link from 'next/link';
import { routes, getCustomerBreakdownDetailPath } from '@roadguard/config';
import { DashboardContent, DashboardPageHeader } from '@/modules/dashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/modules/breakdown-requests/components/status-badge';
import { DEFAULT_BREAKDOWN_LIST_QUERY } from '@/modules/breakdown-requests/constants/breakdown-query';
import { issueTypeLabels } from '@/modules/breakdown-requests/constants/breakdown-labels';
import {
  formatRequestDate,
  isTerminalBreakdownStatus,
} from '@/modules/breakdown-requests/utils/breakdown-formatters';
import { CustomerLiveTrackingPanel } from '@/modules/realtime/components/customer-live-tracking-panel';
import { useListBreakdownRequestsQuery } from '@/store/api/breakdown.api';

export function CustomerTrackingPage() {
  const { data, isLoading } = useListBreakdownRequestsQuery(DEFAULT_BREAKDOWN_LIST_QUERY);
  const trackable = (data?.requests ?? []).filter(
    (r) => !isTerminalBreakdownStatus(r.status) && r.trackingEnabled && r.assignedProviderId,
  );

  return (
    <DashboardContent>
      <DashboardPageHeader
        title="Live tracking"
        description="Track providers assigned to your active breakdown requests."
      />

      {isLoading && <p className="text-sm text-muted-foreground">Loading requests…</p>}

      {!isLoading && trackable.length === 0 && (
        <Card className="border-dashed border-border/70 bg-muted/20 p-6 text-sm text-muted-foreground">
          No active tracked requests. Create a breakdown request and wait for provider assignment.
          <Button variant="ghost" className="mt-2 h-auto px-0" asChild>
            <Link href={routes.customer.breakdownNew}>Request help</Link>
          </Button>
        </Card>
      )}

      <div className="space-y-8">
        {trackable.map((request) => (
          <section key={request.id} className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold">{issueTypeLabels[request.issueType]}</h2>
                <p className="text-xs text-muted-foreground">
                  Requested {formatRequestDate(request.requestedAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={request.status} />
                <Button variant="outline" size="sm" asChild>
                  <Link href={getCustomerBreakdownDetailPath(request.id)}>Full detail</Link>
                </Button>
              </div>
            </div>
            <CustomerLiveTrackingPanel request={request} />
          </section>
        ))}
      </div>
    </DashboardContent>
  );
}
