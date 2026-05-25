'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { routes } from '@roadguard/config';
import { DashboardContent, DashboardPageHeader } from '@/modules/dashboard';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/get-error-message';
import {
  useDeleteVehicleMutation,
  useListVehiclesQuery,
  useUpdateVehicleMutation,
} from '@/store/api/vehicles.api';
import { DeleteVehicleDialog } from '../components/delete-vehicle-dialog';
import { VehicleEmptyState } from '../components/vehicle-empty-state';
import { VehicleFilters } from '../components/vehicle-filters';
import { VehicleList } from '../components/vehicle-list';
import { VehicleListSkeleton } from '../components/vehicle-skeleton';
import { useVehicleFilters } from '../hooks/use-vehicle-filters';
import { DEFAULT_VEHICLE_LIST_QUERY } from '../constants/vehicle-query';
import type { Vehicle } from '../types/vehicle.types';

export function VehiclesListPage() {
  const { data, isLoading, isError, error, refetch } =
    useListVehiclesQuery(DEFAULT_VEHICLE_LIST_QUERY);
  const [deleteVehicle, { isLoading: isDeleting }] = useDeleteVehicleMutation();
  const [updateVehicle] = useUpdateVehicleMutation();

  const vehicles = data?.vehicles ?? [];
  const {
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    fuelFilter,
    setFuelFilter,
    filteredVehicles,
  } = useVehicleFilters(vehicles);

  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [settingPrimaryId, setSettingPrimaryId] = useState<string | null>(null);

  const handleSetPrimary = async (vehicle: Vehicle) => {
    setSettingPrimaryId(vehicle.id);
    try {
      await updateVehicle({
        id: vehicle.id,
        body: { isPrimaryVehicle: true },
      }).unwrap();
      toast.success('Primary vehicle updated');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to set primary vehicle'));
    } finally {
      setSettingPrimaryId(null);
    }
  };

  const handleDelete = async () => {
    if (!vehicleToDelete) return;
    try {
      await deleteVehicle(vehicleToDelete.id).unwrap();
      toast.success('Vehicle deleted');
      setVehicleToDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to delete vehicle'));
    }
  };

  return (
    <DashboardContent>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <DashboardPageHeader
          title="My Vehicles"
          description="Manage your registered vehicles for faster breakdown assistance."
        />
        <Button asChild className="shrink-0 gap-2 self-start">
          <Link href={routes.customer.vehiclesAdd}>
            <Plus className="h-4 w-4" />
            Add vehicle
          </Link>
        </Button>
      </div>

      {isLoading && <VehicleListSkeleton />}

      {isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <p className="font-medium text-destructive">Failed to load vehicles</p>
          <p className="mt-1 text-muted-foreground">
            {getErrorMessage(error, 'Something went wrong')}
          </p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && vehicles.length === 0 && <VehicleEmptyState />}

      {!isLoading && !isError && vehicles.length > 0 && (
        <div className="space-y-6">
          <VehicleFilters
            search={search}
            onSearchChange={setSearch}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            fuelFilter={fuelFilter}
            onFuelFilterChange={setFuelFilter}
          />

          {filteredVehicles.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-12">
              No vehicles match your filters.
            </p>
          ) : (
            <VehicleList
              vehicles={filteredVehicles}
              onDelete={setVehicleToDelete}
              onSetPrimary={handleSetPrimary}
              settingPrimaryId={settingPrimaryId}
            />
          )}
        </div>
      )}

      <DeleteVehicleDialog
        vehicle={vehicleToDelete}
        open={!!vehicleToDelete}
        onOpenChange={(open) => !open && setVehicleToDelete(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </DashboardContent>
  );
}
