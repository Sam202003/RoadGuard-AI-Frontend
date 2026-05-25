'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ClientEvents } from '../events/client-events';
import { latLngToGeoPoint } from '../utils/geo';
import type { LatLng } from '../types/tracking.types';
import { useSocketConnection } from './use-socket-connection';
import { useRealtimeRequestRoom } from './use-realtime-request-room';

const EMIT_INTERVAL_MS = 5000;

interface UseProviderLocationEmitterOptions {
  requestId: string;
  enabled: boolean;
}

export function useProviderLocationEmitter({
  requestId,
  enabled,
}: UseProviderLocationEmitterOptions) {
  const { socket, isConnected } = useSocketConnection();
  const [isTracking, setIsTracking] = useState(false);
  const [lastPosition, setLastPosition] = useState<LatLng | null>(null);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const manualPositionRef = useRef<LatLng | null>(null);

  useRealtimeRequestRoom(requestId, enabled);

  const emitLocation = useCallback(
    (position: LatLng) => {
      if (!socket?.connected) return;
      socket.emit(ClientEvents.PROVIDER_LOCATION_UPDATE, {
        requestId,
        location: latLngToGeoPoint(position),
        timestamp: new Date().toISOString(),
      });
      setLastPosition(position);
    },
    [requestId, socket],
  );

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }
    setError(null);
    setIsTracking(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        manualPositionRef.current = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );
  }, []);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const emitManualLocation = useCallback(
    (position: LatLng) => {
      manualPositionRef.current = position;
      emitLocation(position);
    },
    [emitLocation],
  );

  useEffect(() => {
    if (!enabled || !isTracking || !isConnected) return;

    const interval = setInterval(() => {
      const pos = manualPositionRef.current;
      if (pos) emitLocation(pos);
    }, EMIT_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [enabled, isTracking, isConnected, emitLocation]);

  useEffect(() => () => stopTracking(), [stopTracking]);

  return {
    isTracking,
    startTracking,
    stopTracking,
    emitManualLocation,
    lastPosition,
    error,
    isConnected,
  };
}
