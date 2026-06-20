'use client';

import Link from 'next/link';
import { routes } from '@roadguard/config';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { ProviderProfile } from '@/modules/provider-dashboard/types/provider.types';

interface ProviderAccountCardProps {
  provider: ProviderProfile;
}

export function ProviderAccountCard({ provider }: ProviderAccountCardProps) {
  return (
    <Card className="border-border/60 bg-card/70 p-6 lg:col-span-2">
      <h2 className="text-lg font-semibold">Provider account</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Business profile and verification status for dispatch.
      </p>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Business</dt>
          <dd className="mt-1 font-medium">{provider.businessName}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">KYC</dt>
          <dd className="mt-1">
            <Badge variant="outline">{provider.kycStatus}</Badge>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Service radius</dt>
          <dd className="mt-1">{provider.serviceRadius} km</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Completed jobs</dt>
          <dd className="mt-1">{provider.totalCompletedRequests}</dd>
        </div>
      </dl>
      <Button variant="outline" className="mt-4" asChild>
        <Link href={routes.provider.availability}>Manage availability</Link>
      </Button>
    </Card>
  );
}
