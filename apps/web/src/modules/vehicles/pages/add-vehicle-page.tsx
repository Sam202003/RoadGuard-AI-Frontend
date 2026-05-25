'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { routes } from '@roadguard/config';
import { DashboardContent, DashboardPageHeader } from '@/modules/dashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getErrorMessage } from '@/lib/get-error-message';
import { useCreateVehicleMutation } from '@/store/api/vehicles.api';
import { VehicleForm } from '../forms/vehicle-form';
import { formValuesToCreatePayload } from '../utils/vehicle-formatters';
import type { VehicleFormValues } from '../validations/vehicle.schema';

export function AddVehiclePage() {
  const router = useRouter();
  const [createVehicle, { isLoading }] = useCreateVehicleMutation();

  const onSubmit = async (values: VehicleFormValues) => {
    try {
      await createVehicle(formValuesToCreatePayload(values)).unwrap();
      toast.success('Vehicle added successfully');
      router.push(routes.customer.vehicles);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to add vehicle'));
    }
  };

  return (
    <DashboardContent>
      <Button variant="ghost" size="sm" className="mb-2 -ml-2 gap-1 w-fit" asChild>
        <Link href={routes.customer.vehicles}>
          <ArrowLeft className="h-4 w-4" />
          Back to vehicles
        </Link>
      </Button>
      <DashboardPageHeader
        title="Add vehicle"
        description="Register a vehicle to use for breakdown requests and service reminders."
      />
      <Card className="mt-6 max-w-3xl border-border/60 bg-card/70 p-6 backdrop-blur-sm">
        <VehicleForm onSubmit={onSubmit} submitLabel="Save vehicle" isSubmitting={isLoading} />
      </Card>
    </DashboardContent>
  );
}
