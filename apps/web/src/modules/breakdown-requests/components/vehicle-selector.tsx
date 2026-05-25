'use client';

import Link from 'next/link';
import { Car, Loader2 } from 'lucide-react';
import { routes } from '@roadguard/config';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useListVehiclesQuery } from '@/store/api/vehicles.api';
import { DEFAULT_VEHICLE_LIST_QUERY } from '@/modules/vehicles/constants/vehicle-query';

interface VehicleSelectorProps {
  value?: string;
  onChange: (vehicleId: string) => void;
  error?: string;
}

export function VehicleSelector({ value, onChange, error }: VehicleSelectorProps) {
  const { data, isLoading } = useListVehiclesQuery(DEFAULT_VEHICLE_LIST_QUERY);
  const vehicles = data?.vehicles ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading vehicles…
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-4 text-sm">
        <p className="text-muted-foreground">Add a vehicle before requesting assistance.</p>
        <Button asChild variant="ghost" className="mt-2 h-auto px-0">
          <Link href={routes.customer.vehiclesAdd}>
            <Car className="mr-1 h-4 w-4" />
            Add vehicle
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select your vehicle" />
        </SelectTrigger>
        <SelectContent>
          {vehicles.map((v) => (
            <SelectItem key={v.id} value={v.id}>
              {v.brand} {v.model} · {v.registrationNumber}
              {v.isPrimaryVehicle ? ' (Primary)' : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
