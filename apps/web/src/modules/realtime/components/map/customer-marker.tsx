'use client';

import { CircleMarker } from 'react-leaflet';
import type { LatLng } from '../../types/tracking.types';

interface CustomerMarkerProps {
  position: LatLng;
}

export function CustomerMarker({ position }: CustomerMarkerProps) {
  return (
    <CircleMarker
      center={[position.lat, position.lng]}
      radius={11}
      pathOptions={{
        color: '#dc2626',
        fillColor: '#ef4444',
        fillOpacity: 0.95,
        weight: 3,
      }}
    />
  );
}
