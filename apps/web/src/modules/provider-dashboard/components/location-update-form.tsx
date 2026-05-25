'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, MapPin, Navigation } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getErrorMessage } from '@/lib/get-error-message';
import { useUpdateLocationMutation } from '@/store/api/provider.api';
import { useGeolocation } from '@/modules/breakdown-requests/hooks/use-geolocation';
import {
  providerLocationSchema,
  type ProviderLocationFormValues,
} from '../validations/location.schema';
import type { ProviderProfile } from '../types/provider.types';

interface LocationUpdateFormProps {
  provider: ProviderProfile;
}

export function LocationUpdateForm({ provider }: LocationUpdateFormProps) {
  const [updateLocation, { isLoading }] = useUpdateLocationMutation();
  const { latitude: detectedLat, longitude: detectedLon, detectLocation, isLoading: geoLoading } =
    useGeolocation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProviderLocationFormValues>({
    resolver: zodResolver(providerLocationSchema),
    defaultValues: {
      latitude: provider.currentLocation?.coordinates[1] ?? undefined,
      longitude: provider.currentLocation?.coordinates[0] ?? undefined,
    },
  });

  const latitude = watch('latitude');
  const longitude = watch('longitude');

  useEffect(() => {
    if (detectedLat != null && detectedLon != null) {
      setValue('latitude', detectedLat);
      setValue('longitude', detectedLon);
    }
  }, [detectedLat, detectedLon, setValue]);

  const onSubmit = async (values: ProviderLocationFormValues) => {
    try {
      await updateLocation({
        currentLocation: {
          type: 'Point',
          coordinates: [values.longitude, values.latitude],
        },
      }).unwrap();
      toast.success('Location updated');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update location'));
    }
  };

  return (
    <Card className="border-border/60 bg-card/70 p-5 backdrop-blur-sm">
      <div className="flex items-start gap-2">
        <MapPin className="mt-0.5 h-5 w-5 text-primary" />
        <div>
          <h3 className="font-semibold">Live location (MVP)</h3>
          <p className="text-sm text-muted-foreground">
            Update coordinates manually. GPS streaming can plug in here later.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={detectLocation}
          disabled={geoLoading}
        >
          {geoLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
          Use current GPS
        </Button>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="prov-lat">Latitude</Label>
            <Input id="prov-lat" type="number" step="any" {...register('latitude')} />
            {errors.latitude && (
              <p className="text-sm text-destructive">{errors.latitude.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="prov-lng">Longitude</Label>
            <Input id="prov-lng" type="number" step="any" {...register('longitude')} />
            {errors.longitude && (
              <p className="text-sm text-destructive">{errors.longitude.message}</p>
            )}
          </div>
        </div>

        {latitude != null && longitude != null && (
          <p className="font-mono text-xs text-muted-foreground">
            Current: {latitude.toFixed(5)}, {longitude.toFixed(5)}
          </p>
        )}

        <Button type="submit" disabled={isLoading} className="gap-2">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          Update location
        </Button>
      </form>
    </Card>
  );
}
