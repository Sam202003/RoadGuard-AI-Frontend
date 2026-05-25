'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { routes } from '@roadguard/config';
import { DashboardContent, DashboardPageHeader } from '@/modules/dashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getErrorMessage } from '@/lib/get-error-message';
import { useGetVehicleQuery, useUpdateVehicleMutation } from '@/store/api/vehicles.api';
import { VehicleForm } from '../forms/vehicle-form';
import { VehicleListSkeleton } from '../components/vehicle-skeleton';
import {
  formValuesToUpdatePayload,
  vehicleToFormValues,
} from '../utils/vehicle-formatters';
import type { VehicleFormValues } from '../validations/vehicle.schema';

interface EditVehiclePageProps {
  vehicleId: string;
}

export function EditVehiclePage({ vehicleId }: EditVehiclePageProps) {
  const router = useRouter();
  const { data: vehicle, isLoading, isError, error } = useGetVehicleQuery(vehicleId);
  const [updateVehicle, { isLoading: isSaving }] = useUpdateVehicleMutation();

  const onSubmit = async (values: VehicleFormValues) => {
    try {
      await updateVehicle({
        id: vehicleId,
        body: formValuesToUpdatePayload(values),
      }).unwrap();
      toast.success('Vehicle updated');
      router.push(routes.customer.vehicles);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update vehicle'));
    }
  };

  if (isLoading) {
    return (
      <DashboardContent>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading vehicle…
        </div>
        <div className="mt-6">
          <VehicleListSkeleton />
        </div>
      </DashboardContent>
    );
  }

  if (isError || !vehicle) {
    return (
      <DashboardContent>
        <p className="text-destructive">{getErrorMessage(error, 'Vehicle not found')}</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href={routes.customer.vehicles}>Back to vehicles</Link>
        </Button>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Button variant="ghost" size="sm" className="mb-2 -ml-2 gap-1 w-fit" asChild>
        <Link href={routes.customer.vehicles}>
          <ArrowLeft className="h-4 w-4" />
          Back to vehicles
        </Link>
      </Button>
      <DashboardPageHeader
        title="Edit vehicle"
        description={`${vehicle.brand} ${vehicle.model} · ${vehicle.registrationNumber}`}
      />
      <Card className="mt-6 max-w-3xl border-border/60 bg-card/70 p-6 backdrop-blur-sm">
        <VehicleForm
          key={vehicle.id}
          defaultValues={vehicleToFormValues(vehicle)}
          onSubmit={onSubmit}
          submitLabel="Save changes"
          isSubmitting={isSaving}
        />
      </Card>
    </DashboardContent>
  );
}
