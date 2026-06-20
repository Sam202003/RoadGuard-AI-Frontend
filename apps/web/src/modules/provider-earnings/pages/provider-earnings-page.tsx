'use client';

import Link from 'next/link';
import { ArrowRight, IndianRupee, TrendingUp } from 'lucide-react';
import { routes, getProviderRequestDetailPath } from '@roadguard/config';
import { DashboardContent, DashboardPageHeader } from '@/modules/dashboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BreakdownStatus } from '@/modules/breakdown-requests/constants/breakdown.enums';
import { issueTypeLabels } from '@/modules/breakdown-requests/constants/breakdown-labels';
import { formatRequestDate } from '@/modules/breakdown-requests/utils/breakdown-formatters';
import { useListBreakdownRequestsQuery } from '@/store/api/breakdown.api';
import { PROVIDER_BREAKDOWN_LIST_QUERY } from '@/modules/provider-dashboard/constants/provider-query';
import { useGetMyProviderQuery } from '@/store/api/provider.api';

const DEFAULT_JOB_PAYOUT = 499;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ProviderEarningsPage() {
  const { data: provider } = useGetMyProviderQuery();
  const { data, isLoading } = useListBreakdownRequestsQuery(PROVIDER_BREAKDOWN_LIST_QUERY);

  const completed = (data?.requests ?? []).filter((r) => r.status === BreakdownStatus.COMPLETED);
  const earnings = completed.map((r) => ({
    id: r.id,
    issueType: r.issueType,
    completedAt: r.completedAt ?? r.updatedAt,
    amount: r.serviceCost ?? DEFAULT_JOB_PAYOUT,
  }));

  const totalEarnings = earnings.reduce((sum, row) => sum + row.amount, 0);
  const avgPayout = earnings.length ? Math.round(totalEarnings / earnings.length) : 0;

  return (
    <DashboardContent>
      <DashboardPageHeader
        title="Earnings"
        description="Completed job payouts derived from breakdown request service costs."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/60 bg-card/70 p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IndianRupee className="h-4 w-4" />
            <span className="text-sm">Total earned</span>
          </div>
          <p className="mt-2 text-2xl font-semibold">
            {isLoading ? '…' : formatCurrency(totalEarnings)}
          </p>
        </Card>
        <Card className="border-border/60 bg-card/70 p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Completed jobs</span>
          </div>
          <p className="mt-2 text-2xl font-semibold">{isLoading ? '…' : earnings.length}</p>
        </Card>
        <Card className="border-border/60 bg-card/70 p-5">
          <p className="text-sm text-muted-foreground">Average payout</p>
          <p className="mt-2 text-2xl font-semibold">
            {isLoading ? '…' : formatCurrency(avgPayout)}
          </p>
        </Card>
      </div>

      {provider && (
        <p className="text-sm text-muted-foreground">
          Profile: {provider.businessName} · {provider.totalCompletedRequests} lifetime completions
        </p>
      )}

      <Card className="border-border/60 bg-card/70">
        <div className="border-b border-border/60 px-5 py-4">
          <h2 className="font-semibold">Payout history</h2>
        </div>
        {earnings.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">
            No completed jobs yet. Earnings appear when you finish assigned breakdown requests.
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {earnings.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="font-medium">{issueTypeLabels[row.issueType]}</p>
                  <p className="text-xs text-muted-foreground">
                    Completed {formatRequestDate(row.completedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{formatCurrency(row.amount)}</span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={getProviderRequestDetailPath(row.id)}>
                      View
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Button variant="outline" asChild>
        <Link href={routes.provider.requests}>View all requests</Link>
      </Button>
    </DashboardContent>
  );
}
