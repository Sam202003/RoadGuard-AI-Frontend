'use client';

import { CircleMarker } from 'react-leaflet';
import type { LatLng } from '../../types/tracking.types';
import { useAnimatedPosition } from '../../hooks/use-animated-position';

interface ProviderMarkerProps {
  position: LatLng | null;
}

export function ProviderMarker({ position }: ProviderMarkerProps) {
  const animated = useAnimatedPosition(position);
  if (!animated) return null;

  return (
    <CircleMarker
      center={[animated.lat, animated.lng]}
      radius={12}
      pathOptions={{
        color: '#1d4ed8',
        fillColor: '#2563eb',
        fillOpacity: 0.95,
        weight: 3,
      }}
    />
  );
}
