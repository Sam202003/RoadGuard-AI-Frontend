'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import type { AppDispatch } from '@/store';
import { breakdownApi } from '@/store/api/breakdown.api';
import { DEFAULT_BREAKDOWN_LIST_QUERY } from '@/modules/breakdown-requests/constants/breakdown-query';
import { PROVIDER_BREAKDOWN_LIST_QUERY } from '@/modules/provider-dashboard/constants/provider-query';
import type { BreakdownRequest } from '@/modules/breakdown-requests/types/breakdown.types';
import { ServerEvents } from '../events/server-events';
import { appendRoutePoint, geoPointToLatLng } from '../utils/geo';
import type {
  EtaUpdatedPayload,
  LiveTrackingState,
  ProviderAssignedPayload,
  ProviderLocationUpdatedPayload,
  RequestCancelledPayload,
  RequestStatusUpdatedPayload,
} from '../types/tracking.types';
import { useSocketConnection } from './use-socket-connection';
import { useRealtimeRequestRoom } from './use-realtime-request-room';

const initialTracking: LiveTrackingState = {
  providerPosition: null,
  customerPosition: null,
  routePoints: [],
  estimatedArrivalMinutes: null,
  estimatedDistanceKm: null,
  lastUpdatedAt: null,
};

function patchBreakdownCaches(dispatch: AppDispatch, request: BreakdownRequest) {
  dispatch(
    breakdownApi.util.updateQueryData('getBreakdownRequest', request.id, () => request),
  );
  for (const queryArg of [DEFAULT_BREAKDOWN_LIST_QUERY, PROVIDER_BREAKDOWN_LIST_QUERY]) {
    dispatch(
      breakdownApi.util.updateQueryData('listBreakdownRequests', queryArg, (draft) => {
        const index = draft.requests.findIndex((r) => r.id === request.id);
        if (index !== -1) draft.requests[index] = request;
      }),
    );
  }
}

export function useRealtimeBreakdownTracking(
  request: BreakdownRequest | undefined,
  enabled = true,
) {
  const dispatch = useDispatch<AppDispatch>();
  const { socket, isConnected } = useSocketConnection();
  const requestId = request?.id;
  const [tracking, setTracking] = useState<LiveTrackingState>(initialTracking);

  useRealtimeRequestRoom(requestId, enabled && !!request?.trackingEnabled);

  useEffect(() => {
    if (!request) return;
    const customerPosition = geoPointToLatLng(request.location);
    setTracking((prev) => ({
      ...prev,
      customerPosition,
      estimatedArrivalMinutes: request.estimatedArrivalTime ?? prev.estimatedArrivalMinutes,
      estimatedDistanceKm: request.estimatedDistance ?? prev.estimatedDistanceKm,
    }));
  }, [request]);

  const handleLocation = useCallback(
    (payload: ProviderLocationUpdatedPayload) => {
      if (payload.requestId !== requestId) return;
      const next = geoPointToLatLng(payload.location);
      setTracking((prev) => ({
        ...prev,
        providerPosition: next,
        routePoints: appendRoutePoint(prev.routePoints, next),
        estimatedDistanceKm: payload.distanceKm,
        lastUpdatedAt: payload.timestamp,
      }));
    },
    [requestId],
  );

  const handleEta = useCallback(
    (payload: EtaUpdatedPayload) => {
      if (payload.requestId !== requestId) return;
      setTracking((prev) => ({
        ...prev,
        estimatedArrivalMinutes: payload.estimatedArrivalMinutes,
        estimatedDistanceKm: payload.estimatedDistanceKm,
        lastUpdatedAt: payload.timestamp,
      }));
    },
    [requestId],
  );

  const handleStatus = useCallback(
    (payload: RequestStatusUpdatedPayload) => {
      if (payload.request.id !== requestId) return;
      patchBreakdownCaches(dispatch, payload.request);
    },
    [dispatch, requestId],
  );

  const handleAssigned = useCallback(
    (payload: ProviderAssignedPayload) => {
      if (payload.request.id !== requestId) return;
      patchBreakdownCaches(dispatch, payload.request);
    },
    [dispatch, requestId],
  );

  const handleCancelled = useCallback(
    (payload: RequestCancelledPayload) => {
      if (payload.request.id !== requestId) return;
      patchBreakdownCaches(dispatch, payload.request);
      toast.info('Request was cancelled');
    },
    [dispatch, requestId],
  );

  useEffect(() => {
    if (!enabled || !socket || !isConnected || !requestId) return;

    socket.on(ServerEvents.PROVIDER_LOCATION_UPDATED, handleLocation);
    socket.on(ServerEvents.TRACKING_ETA_UPDATED, handleEta);
    socket.on(ServerEvents.REQUEST_STATUS_UPDATED, handleStatus);
    socket.on(ServerEvents.PROVIDER_ASSIGNED, handleAssigned);
    socket.on(ServerEvents.REQUEST_CANCELLED, handleCancelled);

    return () => {
      socket.off(ServerEvents.PROVIDER_LOCATION_UPDATED, handleLocation);
      socket.off(ServerEvents.TRACKING_ETA_UPDATED, handleEta);
      socket.off(ServerEvents.REQUEST_STATUS_UPDATED, handleStatus);
      socket.off(ServerEvents.PROVIDER_ASSIGNED, handleAssigned);
      socket.off(ServerEvents.REQUEST_CANCELLED, handleCancelled);
    };
  }, [
    enabled,
    socket,
    isConnected,
    requestId,
    handleLocation,
    handleEta,
    handleStatus,
    handleAssigned,
    handleCancelled,
  ]);

  return { tracking, isConnected };
}
