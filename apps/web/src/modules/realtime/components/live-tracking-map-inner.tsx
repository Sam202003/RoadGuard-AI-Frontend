'use client';

import { useEffect, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, useMap } from 'react-leaflet';
import type { LatLng } from '../types/tracking.types';
import { computeMapCenter } from '../utils/geo';
import { CustomerMarker } from './map/customer-marker';
import { ProviderMarker } from './map/provider-marker';
import { RoutePolyline } from './map/route-polyline';
import { MapTileLayerThemed } from './map/map-tile-layer-themed';
import { MapFitBounds, MapZoomControls } from './map/map-zoom-controls';

interface LiveTrackingMapInnerProps {
  customerPosition: LatLng | null;
  providerPosition: LatLng | null;
  routePoints: LatLng[];
}

function MapViewportSync({
  customerPosition,
  providerPosition,
}: {
  customerPosition: LatLng | null;
  providerPosition: LatLng | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (providerPosition || !customerPosition) return;
    map.setView([customerPosition.lat, customerPosition.lng], 14, { animate: true });
  }, [map, customerPosition, providerPosition]);

  return null;
}

export function LiveTrackingMapInner({
  customerPosition,
  providerPosition,
  routePoints,
}: LiveTrackingMapInnerProps) {
  const center = useMemo(
    () => computeMapCenter(customerPosition, providerPosition),
    [customerPosition, providerPosition],
  );

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      scrollWheelZoom
      className="h-full w-full rounded-xl z-0"
    >
      <MapTileLayerThemed />
      <MapViewportSync
        customerPosition={customerPosition}
        providerPosition={providerPosition}
      />
      <MapFitBounds
        customerPosition={customerPosition}
        providerPosition={providerPosition}
        routePoints={routePoints}
      />
      <MapZoomControls
        customerPosition={customerPosition}
        providerPosition={providerPosition}
        routePoints={routePoints}
      />

      {customerPosition && <CustomerMarker position={customerPosition} />}
      <ProviderMarker position={providerPosition} />
      <RoutePolyline points={routePoints} />
    </MapContainer>
  );
}
