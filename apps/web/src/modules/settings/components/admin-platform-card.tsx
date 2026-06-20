'use client';

import { Card } from '@/components/ui/card';

export function AdminPlatformCard() {
  return (
    <Card className="border-border/60 bg-card/70 p-6 lg:col-span-2">
      <h2 className="text-lg font-semibold">Platform</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Road Guard admin console — live data from the backend API.
      </p>
      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">API docs</dt>
          <dd className="mt-1 text-sm">OpenAPI at <code className="rounded bg-muted px-1">/api-docs</code> on the backend</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Data source</dt>
          <dd className="mt-1 text-sm">Production MongoDB via REST API</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Realtime</dt>
          <dd className="mt-1 text-sm">Socket.IO for breakdown tracking & notifications</dd>
        </div>
      </dl>
    </Card>
  );
}
