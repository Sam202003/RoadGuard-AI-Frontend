'use client';

import { useSelector } from 'react-redux';
import { DashboardContent, DashboardPageHeader } from '@/modules/dashboard';
import { selectAuthUser } from '@/store/auth.selectors';

export default function AdminDashboardPage() {
  const user = useSelector(selectAuthUser);

  return (
    <DashboardContent>
      <DashboardPageHeader
        title={`Admin — ${user?.firstName ?? ''} ${user?.lastName ?? ''}`}
        description="Monitor platform activity, providers, and breakdown requests across Road Guard."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {['Live requests', 'Providers online', 'Customers', 'Emergencies'].map((label) => (
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
