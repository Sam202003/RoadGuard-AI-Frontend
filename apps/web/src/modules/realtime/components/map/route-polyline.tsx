'use client';

import { Polyline } from 'react-leaflet';
import type { LatLng } from '../../types/tracking.types';

interface RoutePolylineProps {
  points: LatLng[];
}

export function RoutePolyline({ points }: RoutePolylineProps) {
  if (points.length < 2) return null;

  const positions = points.map((p) => [p.lat, p.lng] as [number, number]);

  return (
    <Polyline
      positions={positions}
      pathOptions={{
        color: '#2563eb',
        weight: 5,
        opacity: 0.75,
        lineCap: 'round',
        lineJoin: 'round',
      }}
    />
  );
}
