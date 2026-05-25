'use client';

import { Building2, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { providerTypeLabels } from '../constants/provider-labels';
import type { ProviderProfile } from '../types/provider.types';

interface ProviderProfileCardProps {
  provider: ProviderProfile;
}

export function ProviderProfileCard({ provider }: ProviderProfileCardProps) {
  return (
    <Card className="border-border/60 bg-card/70 p-5 backdrop-blur-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
          <Building2 className="h-7 w-7 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold">{provider.businessName}</h3>
          <p className="text-sm text-muted-foreground">
            {providerTypeLabels[provider.providerType]} · {provider.email}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1">
              <Star className="h-3 w-3" />
              {provider.ratings.average.toFixed(1)} ({provider.ratings.count})
            </Badge>
            <Badge variant="secondary">KYC {provider.kycStatus}</Badge>
            <Badge variant="outline">{provider.serviceRadius} km radius</Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
