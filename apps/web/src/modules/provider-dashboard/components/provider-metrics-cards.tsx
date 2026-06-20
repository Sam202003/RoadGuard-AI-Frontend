'use client';

import { CheckCircle2, ClipboardList, Radio, Wifi } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  availabilityLabels,
  onlineStatusLabels,
} from '../constants/provider-labels';
import type { ProviderProfile } from '../types/provider.types';
import { AvailabilityStatus, OnlineStatus } from '../constants/provider.enums';

interface ProviderMetricsCardsProps {
  activeCount: number;
  completedCount: number;
  provider?: ProviderProfile;
}

export function ProviderMetricsCards({
  activeCount,
  completedCount,
  provider,
}: ProviderMetricsCardsProps) {
  const availability = provider?.availabilityStatus ?? AvailabilityStatus.OFFLINE;
  const online = provider?.onlineStatus ?? OnlineStatus.OFFLINE;

  const metrics = [
    {
      label: 'Active jobs',
      value: String(activeCount),
      icon: ClipboardList,
      accent: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Completed (profile)',
      value: String(provider?.totalCompletedRequests ?? completedCount),
      icon: CheckCircle2,
      accent: 'text-primary',
    },
    {
      label: 'Availability',
      value: availabilityLabels[availability],
      icon: Radio,
      accent:
        availability === AvailabilityStatus.AVAILABLE
          ? 'text-primary'
          : availability === AvailabilityStatus.BUSY
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-muted-foreground',
    },
    {
      label: 'Online status',
      value: onlineStatusLabels[online],
      icon: Wifi,
      accent:
        online === OnlineStatus.ONLINE
          ? 'text-primary'
          : 'text-muted-foreground',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card
            key={metric.label}
            className="border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="mt-2 text-2xl font-bold tracking-tight">{metric.value}</p>
              </div>
              <Icon className={cn('h-5 w-5', metric.accent)} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
