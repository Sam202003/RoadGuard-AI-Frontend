'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { isTerminalBreakdownStatus } from '@/modules/breakdown-requests/utils/breakdown-formatters';
import type { BreakdownRequest } from '@/modules/breakdown-requests/types/breakdown.types';
import { BreakdownStatus } from '@/modules/breakdown-requests/constants/breakdown.enums';
import { useRealtimeBreakdownTracking } from '../hooks/use-realtime-breakdown-tracking';
import { useSocketConnection } from '../hooks/use-socket-connection';
import { ConnectionIndicator } from './connection-indicator';
import { DistanceRemainingCard } from './distance-remaining-card';
import { EtaInfoCard } from './eta-info-card';
import { LiveTrackingMap } from './live-tracking-map';
import { TrackingMobileSheet } from './tracking-mobile-sheet';
import { TrackingStatusCard } from './tracking-status-card';

interface CustomerLiveTrackingPanelProps {
  request: BreakdownRequest;
}

export function CustomerLiveTrackingPanel({ request }: CustomerLiveTrackingPanelProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(true);
  const { connectionState, isConnected } = useSocketConnection();

  const canTrack =
    request.trackingEnabled &&
    !!request.assignedProviderId &&
    !isTerminalBreakdownStatus(request.status);

  const { tracking } = useRealtimeBreakdownTracking(request, canTrack);

  if (!canTrack) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-6 text-sm text-muted-foreground">
        Live map appears once a provider is assigned and tracking is enabled.
      </div>
    );
  }

  const showMap =
    request.status !== BreakdownStatus.SEARCHING_PROVIDER &&
    request.status !== BreakdownStatus.CREATED;

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold">Live tracking</h2>
            <p className="text-xs text-muted-foreground">
              {isConnected
                ? 'Provider location updates in real time'
                : 'Reconnecting to live feed…'}
            </p>
          </div>
          <ConnectionIndicator state={connectionState} />
        </div>

        {showMap ? (
          <>
            <div className="relative hidden md:block">
              <LiveTrackingMap
                customerPosition={tracking.customerPosition}
                providerPosition={tracking.providerPosition}
                routePoints={tracking.routePoints}
                isFullscreen={isFullscreen}
                onToggleFullscreen={() => setIsFullscreen((v) => !v)}
              />
              <div className="pointer-events-none absolute inset-x-0 top-3 flex flex-col gap-2 px-3 lg:flex-row lg:items-start lg:justify-between">
                <TrackingStatusCard status={request.status} />
                <div className="flex flex-col gap-2 sm:flex-row">
                  <EtaInfoCard
                    estimatedArrivalMinutes={tracking.estimatedArrivalMinutes}
                    estimatedDistanceKm={tracking.estimatedDistanceKm}
                  />
                  <DistanceRemainingCard
                    estimatedDistanceKm={tracking.estimatedDistanceKm}
                  />
                </div>
              </div>
            </div>

            <div className="relative md:hidden">
              <LiveTrackingMap
                customerPosition={tracking.customerPosition}
                providerPosition={tracking.providerPosition}
                routePoints={tracking.routePoints}
                isFullscreen={isFullscreen}
                onToggleFullscreen={() => setIsFullscreen((v) => !v)}
                className="h-[min(55vh,420px)]"
              />
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-border/60 bg-card/50 p-6 text-sm text-muted-foreground">
            Waiting for provider assignment…
          </div>
        )}
      </motion.section>

      {showMap && !isFullscreen && (
        <TrackingMobileSheet
          open={mobileSheetOpen}
          onOpenChange={setMobileSheetOpen}
          status={request.status}
          connectionState={connectionState}
          estimatedArrivalMinutes={tracking.estimatedArrivalMinutes}
          estimatedDistanceKm={tracking.estimatedDistanceKm}
        />
      )}

      {showMap && !isFullscreen && !mobileSheetOpen && (
        <button
          type="button"
          className="fixed bottom-4 left-1/2 z-[1100] -translate-x-1/2 rounded-full border border-border/60 bg-background/95 px-4 py-2 text-sm font-medium shadow-lg backdrop-blur md:hidden"
          onClick={() => setMobileSheetOpen(true)}
        >
          Show tracking details
        </button>
      )}
    </>
  );
}
