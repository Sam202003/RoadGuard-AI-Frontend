'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { BreakdownStatus } from '@/modules/breakdown-requests/constants/breakdown.enums';
import type { SocketConnectionState } from '../types/tracking.types';
import { ConnectionIndicator } from './connection-indicator';
import { DistanceRemainingCard } from './distance-remaining-card';
import { EtaInfoCard } from './eta-info-card';
import { TrackingStatusCard } from './tracking-status-card';

interface TrackingMobileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: BreakdownStatus;
  connectionState: SocketConnectionState;
  estimatedArrivalMinutes: number | null;
  estimatedDistanceKm: number | null;
}

export function TrackingMobileSheet({
  open,
  onOpenChange,
  status,
  connectionState,
  estimatedArrivalMinutes,
  estimatedDistanceKm,
}: TrackingMobileSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="pointer-events-auto fixed inset-x-0 bottom-0 z-[1100] md:hidden"
        >
          <div className="mx-2 mb-2 max-h-[45vh] overflow-y-auto rounded-t-2xl border border-border/60 bg-background/95 p-4 shadow-2xl backdrop-blur-xl">
            <button
              type="button"
              aria-label="Close tracking panel"
              className="mx-auto mb-3 flex h-6 w-full items-center justify-center"
              onClick={() => onOpenChange(false)}
            >
              <span className="h-1 w-10 rounded-full bg-muted" />
            </button>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold">Live tracking</span>
              <ConnectionIndicator state={connectionState} />
            </div>
            <div className="space-y-3">
              <TrackingStatusCard status={status} />
              <EtaInfoCard
                estimatedArrivalMinutes={estimatedArrivalMinutes}
                estimatedDistanceKm={estimatedDistanceKm}
              />
              <DistanceRemainingCard estimatedDistanceKm={estimatedDistanceKm} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
