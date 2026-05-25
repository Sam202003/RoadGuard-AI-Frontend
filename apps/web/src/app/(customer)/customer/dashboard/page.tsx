'use client';

import { useSelector } from 'react-redux';
import { DashboardContent, DashboardPageHeader } from '@/modules/dashboard';
import { selectAuthUser } from '@/store/auth.selectors';

export default function CustomerDashboardPage() {
  const user = useSelector(selectAuthUser);

  return (
    <DashboardContent>
      <DashboardPageHeader
        title={`Welcome back, ${user?.firstName ?? 'there'}`}
        description="Your roadside assistance hub. Request help, track providers, and manage vehicles from here."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {['Active requests', 'Saved vehicles', 'Recent activity'].map((label) => (
          <div
            key={label}
            className="rounded-xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-sm"
          >
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-bold">—</p>
            <p className="mt-1 text-xs text-muted-foreground">Coming in next release</p>
          </div>
        ))}
      </div>
    </DashboardContent>
  );
}
