'use client';

import { useMemo, useState } from 'react';
import type { Vehicle } from '../types/vehicle.types';
import { FuelType, VehicleType } from '../constants/vehicle.enums';

export function useVehicleFilters(vehicles: Vehicle[]) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<VehicleType | 'ALL'>('ALL');
  const [fuelFilter, setFuelFilter] = useState<FuelType | 'ALL'>('ALL');

  const filteredVehicles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return vehicles.filter((vehicle) => {
      if (typeFilter !== 'ALL' && vehicle.vehicleType !== typeFilter) return false;
      if (fuelFilter !== 'ALL' && vehicle.fuelType !== fuelFilter) return false;
      if (!query) return true;
      const haystack = [
        vehicle.brand,
        vehicle.model,
        vehicle.registrationNumber,
        vehicle.color ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [vehicles, search, typeFilter, fuelFilter]);

  return {
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    fuelFilter,
    setFuelFilter,
    filteredVehicles,
  };
}
