'use client';

import dynamic from 'next/dynamic';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { LatLng } from '../types/tracking.types';
import { MapLoadingSkeleton } from './map-loading-skeleton';

const LiveTrackingMapInner = dynamic(
  () => import('./live-tracking-map-inner').then((m) => m.LiveTrackingMapInner),
  { ssr: false, loading: () => <MapLoadingSkeleton /> },
);

interface LiveTrackingMapProps {
  customerPosition: LatLng | null;
  providerPosition: LatLng | null;
  routePoints: LatLng[];
  className?: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export function LiveTrackingMap({
  customerPosition,
  providerPosition,
  routePoints,
  className,
  isFullscreen = false,
  onToggleFullscreen,
}: LiveTrackingMapProps) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-xl border border-border/60',
        isFullscreen
          ? 'fixed inset-0 z-[1000] h-[100dvh] rounded-none border-0'
          : 'h-[min(70vh,480px)]',
        className,
      )}
    >
      <LiveTrackingMapInner
        customerPosition={customerPosition}
        providerPosition={providerPosition}
        routePoints={routePoints}
      />

      {onToggleFullscreen && (
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="absolute left-3 top-3 z-[1000] h-9 w-9 shadow-md"
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? 'Exit fullscreen map' : 'Fullscreen map'}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      )}

      <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded-md bg-background/90 px-2 py-1 shadow backdrop-blur">
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-red-500" />
          Customer
        </span>
        <span className="rounded-md bg-background/90 px-2 py-1 shadow backdrop-blur">
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-blue-600" />
          Provider
        </span>
      </div>
    </div>
  );
}
