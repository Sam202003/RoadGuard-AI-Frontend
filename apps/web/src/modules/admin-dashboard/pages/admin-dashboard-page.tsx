'use client';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Users,
  UserCheck,
  Wrench,
  Wifi,
} from 'lucide-react';
import { DashboardContent, DashboardPageHeader } from '@/modules/dashboard';
import { selectAuthUser } from '@/store/auth.selectors';
import { useGetAdminDashboardQuery } from '../api';
import { AdminStatCard } from '../components/admin-stat-card';
import { ActivityFeed } from '../components/activity-feed';
import { getErrorMessage } from '@/lib/get-error-message';
import { Button } from '@/components/ui/button';

export function AdminDashboardPage() {
  const user = useSelector(selectAuthUser);
  const { data, isLoading, isError, error, refetch } = useGetAdminDashboardQuery();

  const stats = useMemo(
    () => [
      { label: 'Total users', value: data?.stats.totalUsers ?? 0, icon: Users },
      { label: 'Total customers', value: data?.stats.totalCustomers ?? 0, icon: UserCheck },
      { label: 'Total providers', value: data?.stats.totalProviders ?? 0, icon: Wrench },
      {
        label: 'Active requests',
        value: data?.stats.activeBreakdownRequests ?? 0,
        icon: ClipboardList,
      },
      {
        label: 'Completed requests',
        value: data?.stats.completedRequests ?? 0,
        icon: CheckCircle2,
        variant: 'success' as const,
      },
      {
        label: 'Emergency requests',
        value: data?.stats.emergencyRequests ?? 0,
        icon: AlertTriangle,
        variant: 'warning' as const,
      },
      {
        label: 'Online providers',
        value: data?.stats.onlineProviders ?? 0,
        icon: Wifi,
      },
    ],
    [data?.stats],
  );

  return (
    <DashboardContent>
      <DashboardPageHeader
        title={`Admin — ${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()}
        description="Monitor platform activity, providers, and breakdown requests across Road Guard."
      />

      {isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <p className="font-medium text-destructive">Failed to load dashboard</p>
          <p className="mt-1 text-muted-foreground">
            {getErrorMessage(error, 'Something went wrong')}
          </p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <AdminStatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            variant={stat.variant}
            isLoading={isLoading}
          />
        ))}
      </div>

      <ActivityFeed items={data?.activity ?? []} isLoading={isLoading} />
    </DashboardContent>
  );
}
