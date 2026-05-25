'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, MapPin, Navigation, Radio } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isTerminalBreakdownStatus } from '@/modules/breakdown-requests/utils/breakdown-formatters';
import type { BreakdownRequest } from '@/modules/breakdown-requests/types/breakdown.types';
import { useProviderLocationEmitter } from '../hooks/use-provider-location-emitter';
import { useSocketConnection } from '../hooks/use-socket-connection';
import { ConnectionIndicator } from './connection-indicator';

interface ProviderTrackingControlsProps {
  request: BreakdownRequest;
}

export function ProviderTrackingControls({ request }: ProviderTrackingControlsProps) {
  const { connectionState } = useSocketConnection();
  const canEmit =
    !!request.assignedProviderId &&
    request.trackingEnabled &&
    !isTerminalBreakdownStatus(request.status);

  const {
    isTracking,
    startTracking,
    stopTracking,
    emitManualLocation,
    lastPosition,
    error,
    isConnected,
  } = useProviderLocationEmitter({
    requestId: request.id,
    enabled: canEmit,
  });

  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  const handleManualEmit = () => {
    const lat = Number(manualLat);
    const lng = Number(manualLng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      toast.error('Enter valid coordinates');
      return;
    }
    emitManualLocation({ lat, lng });
    toast.success('Location sent');
  };

  if (!canEmit) {
    return (
      <Card className="border-border/60 bg-card/70 p-5">
        <p className="text-sm text-muted-foreground">
          Live tracking is available once you are assigned to this job.
        </p>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
    <Card className="border-border/60 bg-card/70 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Radio className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Live GPS tracking</h3>
        </div>
        <ConnectionIndicator state={connectionState} />
      </div>

      <p className="mt-2 text-sm text-muted-foreground">
        Broadcast your location every 5 seconds while tracking is active.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {!isTracking ? (
          <Button onClick={startTracking} disabled={!isConnected} className="gap-2">
            <Navigation className="h-4 w-4" />
            Start tracking
          </Button>
        ) : (
          <Button variant="destructive" onClick={stopTracking} className="gap-2">
            Stop tracking
          </Button>
        )}
      </div>

      {isTracking && (
        <p className="mt-3 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Emitting live location…
        </p>
      )}

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      {lastPosition && (
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          Last sent: {lastPosition.lat.toFixed(5)}, {lastPosition.lng.toFixed(5)}
        </p>
      )}

      <div className="mt-6 space-y-3 border-t border-border/60 pt-4">
        <p className="text-sm font-medium">Manual fallback</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="track-lat">Latitude</Label>
            <Input
              id="track-lat"
              type="number"
              step="any"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="track-lng">Longitude</Label>
            <Input
              id="track-lng"
              type="number"
              step="any"
              value={manualLng}
              onChange={(e) => setManualLng(e.target.value)}
            />
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleManualEmit}>
          <MapPin className="h-4 w-4" />
          Send location now
        </Button>
      </div>
    </Card>
    </motion.div>
  );
}
