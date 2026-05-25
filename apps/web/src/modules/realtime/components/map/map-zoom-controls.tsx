'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import { Minus, Plus, Locate } from 'lucide-react';
import { useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import type { LatLng } from '../../types/tracking.types';

interface MapZoomControlsProps {
  customerPosition: LatLng | null;
  providerPosition: LatLng | null;
  routePoints: LatLng[];
}

export function MapFitBounds({
  customerPosition,
  providerPosition,
  routePoints,
}: MapZoomControlsProps) {
  const map = useMap();

  useEffect(() => {
    const points: LatLng[] = [];
    if (customerPosition) points.push(customerPosition);
    if (providerPosition) points.push(providerPosition);
    routePoints.forEach((p) => points.push(p));
    if (points.length === 0) return;

    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 16, animate: true });
  }, [map, customerPosition, providerPosition, routePoints]);

  return null;
}

export function MapZoomControls({
  customerPosition,
  providerPosition,
  routePoints,
}: MapZoomControlsProps) {
  const map = useMap();

  const fitAll = () => {
    const points: LatLng[] = [];
    if (customerPosition) points.push(customerPosition);
    if (providerPosition) points.push(providerPosition);
    routePoints.forEach((p) => points.push(p));
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 16, animate: true });
  };

  return (
    <div className="absolute right-3 top-3 z-[1000] flex flex-col gap-1">
      <Button
        type="button"
        size="icon"
        variant="secondary"
        className="h-9 w-9 shadow-md"
        onClick={() => map.zoomIn()}
        aria-label="Zoom in"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="secondary"
        className="h-9 w-9 shadow-md"
        onClick={() => map.zoomOut()}
        aria-label="Zoom out"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="secondary"
        className="h-9 w-9 shadow-md"
        onClick={fitAll}
        aria-label="Fit route"
      >
        <Locate className="h-4 w-4" />
      </Button>
    </div>
  );
}
