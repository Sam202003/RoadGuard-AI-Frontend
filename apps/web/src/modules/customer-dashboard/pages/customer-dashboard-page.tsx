'use client';

import Link from 'next/link';
import { ArrowRight, Car, Wrench } from 'lucide-react';
import { routes } from '@roadguard/config';
import { DashboardContent, DashboardPageHeader } from '@/modules/dashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BreakdownStatus } from '@/modules/breakdown-requests/constants/breakdown.enums';
import { DEFAULT_BREAKDOWN_LIST_QUERY } from '@/modules/breakdown-requests/constants/breakdown-query';
import { StatusBadge } from '@/modules/breakdown-requests/components/status-badge';
import { issueTypeLabels } from '@/modules/breakdown-requests/constants/breakdown-labels';
import {
  formatRequestDate,
  isTerminalBreakdownStatus,
} from '@/modules/breakdown-requests/utils/breakdown-formatters';
import { useListBreakdownRequestsQuery } from '@/store/api/breakdown.api';
import { useGetUnreadCountQuery } from '@/store/api/notifications.api';
import { useListVehiclesQuery } from '@/store/api/vehicles.api';
import { DEFAULT_VEHICLE_LIST_QUERY } from '@/modules/vehicles/constants/vehicle-query';

export function CustomerDashboardPage() {
  const { data: breakdownData, isLoading: breakdownLoading } =
    useListBreakdownRequestsQuery(DEFAULT_BREAKDOWN_LIST_QUERY);
  const { data: vehiclesData, isLoading: vehiclesLoading } =
    useListVehiclesQuery(DEFAULT_VEHICLE_LIST_QUERY);
  const { data: unreadData } = useGetUnreadCountQuery();

  const requests = breakdownData?.requests ?? [];
  const vehicles = vehiclesData?.vehicles ?? [];
  const activeRequests = requests.filter((r) => !isTerminalBreakdownStatus(r.status));
  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const isLoading = breakdownLoading || vehiclesLoading;

  return (
    <DashboardContent>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <DashboardPageHeader
          title="Dashboard"
          description="Overview of your vehicles, active requests, and recent activity."
        />
        <Button asChild className="shrink-0 gap-2 self-start">
          <Link href={routes.customer.breakdownNew}>
            <Wrench className="h-4 w-4" />
            Request help
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card className="border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-sm">
          <p className="text-sm font-medium text-muted-foreground">Active requests</p>
          <p className="mt-2 text-3xl font-bold">{isLoading ? '—' : activeRequests.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {activeRequests.length === 1 ? 'In progress' : 'In progress or awaiting provider'}
          </p>
        </Card>

        <Card className="border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-sm">
          <p className="text-sm font-medium text-muted-foreground">Saved vehicles</p>
          <p className="mt-2 text-3xl font-bold">{isLoading ? '—' : vehicles.length}</p>
          <Button variant="ghost" className="mt-1 h-auto p-0 text-xs" asChild>
            <Link href={routes.customer.vehicles}>Manage vehicles</Link>
          </Button>
        </Card>

        <Card className="border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-sm">
          <p className="text-sm font-medium text-muted-foreground">Unread notifications</p>
          <p className="mt-2 text-3xl font-bold">{unreadData?.unreadCount ?? 0}</p>
          <Button variant="ghost" className="mt-1 h-auto p-0 text-xs" asChild>
            <Link href={routes.customer.notifications}>View notifications</Link>
          </Button>
        </Card>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent activity</h2>
          <Button variant="ghost" size="sm" className="gap-1" asChild>
            <Link href={routes.customer.breakdown}>
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-muted/50" />
            ))}
          </div>
        ) : recentRequests.length === 0 ? (
          <Card className="border-dashed p-8 text-center">
            <Car className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No breakdown requests yet.</p>
            <Button className="mt-4" asChild>
              <Link href={routes.customer.breakdownNew}>Create your first request</Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentRequests.map((request) => (
              <Link
                key={request.id}
                href={`${routes.customer.breakdown}/${request.id}`}
                className="block rounded-xl border border-border/60 bg-card/60 p-4 transition hover:border-primary/30 hover:bg-card"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{issueTypeLabels[request.issueType]}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Updated {formatRequestDate(request.updatedAt)}
                    </p>
                  </div>
                  <StatusBadge status={request.status} />
                </div>
                {request.status === BreakdownStatus.PROVIDER_ASSIGNED && (
                  <p className="mt-2 text-xs text-primary">Provider assigned — track live</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </DashboardContent>
  );
}
