import { Clock, MapPinned } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatEtaMinutes } from '@/modules/breakdown-requests/utils/breakdown-formatters';

interface EtaInfoCardProps {
  estimatedArrivalMinutes: number | null;
  estimatedDistanceKm: number | null;
}

export function EtaInfoCard({
  estimatedArrivalMinutes,
  estimatedDistanceKm,
}: EtaInfoCardProps) {
  return (
    <Card className="border-border/60 bg-background/95 p-4 shadow-lg backdrop-blur">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">ETA</p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-6">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-lg font-semibold">
            {estimatedArrivalMinutes != null
              ? formatEtaMinutes(estimatedArrivalMinutes)
              : 'Calculating…'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPinned className="h-4 w-4" />
          {estimatedDistanceKm != null ? `${estimatedDistanceKm.toFixed(1)} km away` : '—'}
        </div>
      </div>
    </Card>
  );
}
