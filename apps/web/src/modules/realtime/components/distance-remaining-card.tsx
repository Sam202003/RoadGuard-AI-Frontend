'use client';

import { Navigation } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface DistanceRemainingCardProps {
  estimatedDistanceKm: number | null;
  className?: string;
}

export function DistanceRemainingCard({
  estimatedDistanceKm,
  className,
}: DistanceRemainingCardProps) {
  return (
    <Card
      className={`border-border/60 bg-background/95 p-4 shadow-lg backdrop-blur ${className ?? ''}`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Distance
      </p>
      <div className="mt-2 flex items-center gap-2">
        <Navigation className="h-4 w-4 text-primary" />
        <span className="text-lg font-semibold">
          {estimatedDistanceKm != null
            ? `${estimatedDistanceKm.toFixed(1)} km remaining`
            : 'Calculating…'}
        </span>
      </div>
    </Card>
  );
}
