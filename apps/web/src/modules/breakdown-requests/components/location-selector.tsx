'use client';

import { useEffect } from 'react';
import { Loader2, MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGeolocation } from '../hooks/use-geolocation';

interface LocationSelectorProps {
  latitude?: number;
  longitude?: number;
  onLatitudeChange: (value: number | undefined) => void;
  onLongitudeChange: (value: number | undefined) => void;
  latError?: string;
  lonError?: string;
}

export function LocationSelector({
  latitude,
  longitude,
  onLatitudeChange,
  onLongitudeChange,
  latError,
  lonError,
}: LocationSelectorProps) {
  const {
    latitude: detectedLat,
    longitude: detectedLon,
    detectLocation,
    isLoading,
    error: geoError,
  } = useGeolocation();

  useEffect(() => {
    if (detectedLat != null && detectedLon != null) {
      onLatitudeChange(detectedLat);
      onLongitudeChange(detectedLon);
    }
  }, [detectedLat, detectedLon, onLatitudeChange, onLongitudeChange]);

  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-card/40 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">Current location</p>
            <p className="text-xs text-muted-foreground">
              We use your location to find the nearest available provider.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 gap-2"
          onClick={detectLocation}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
          Use my location
        </Button>
      </div>

      {geoError && <p className="text-sm text-destructive">{geoError}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            placeholder="e.g. 19.0760"
            value={latitude ?? ''}
            onChange={(e) =>
              onLatitudeChange(e.target.value === '' ? undefined : Number(e.target.value))
            }
          />
          {latError && <p className="text-sm text-destructive">{latError}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            placeholder="e.g. 72.8777"
            value={longitude ?? ''}
            onChange={(e) =>
              onLongitudeChange(e.target.value === '' ? undefined : Number(e.target.value))
            }
          />
          {lonError && <p className="text-sm text-destructive">{lonError}</p>}
        </div>
      </div>

      {latitude != null && longitude != null && (
        <p className="font-mono text-xs text-muted-foreground">
          Selected: {latitude.toFixed(5)}, {longitude.toFixed(5)}
        </p>
      )}
    </div>
  );
}
