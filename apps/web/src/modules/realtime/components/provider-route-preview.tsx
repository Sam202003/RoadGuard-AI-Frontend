'use client';

import { isTerminalBreakdownStatus } from '@/modules/breakdown-requests/utils/breakdown-formatters';
import type { BreakdownRequest } from '@/modules/breakdown-requests/types/breakdown.types';
import { geoPointToLatLng } from '../utils/geo';
import { useRealtimeBreakdownTracking } from '../hooks/use-realtime-breakdown-tracking';
import { LiveTrackingMap } from './live-tracking-map';

interface ProviderRoutePreviewProps {
  request: BreakdownRequest;
}

/** Compact map for provider job detail — customer + live route. */
export function ProviderRoutePreview({ request }: ProviderRoutePreviewProps) {
  const canTrack =
    request.trackingEnabled &&
    !!request.assignedProviderId &&
    !isTerminalBreakdownStatus(request.status);

  const { tracking } = useRealtimeBreakdownTracking(request, canTrack);

  if (!canTrack) return null;

  const customer = tracking.customerPosition ?? geoPointToLatLng(request.location);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Route preview</h3>
      <LiveTrackingMap
        customerPosition={customer}
        providerPosition={tracking.providerPosition}
        routePoints={tracking.routePoints}
        className="h-[240px]"
      />
    </div>
  );
}
