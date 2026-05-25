'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FuelType, VehicleType } from '../constants/vehicle.enums';
import {
  fuelTypeLabels,
  vehicleTypeLabels,
} from '../constants/vehicle-labels';

interface VehicleFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: VehicleType | 'ALL';
  onTypeFilterChange: (value: VehicleType | 'ALL') => void;
  fuelFilter: FuelType | 'ALL';
  onFuelFilterChange: (value: FuelType | 'ALL') => void;
}

export function VehicleFilters({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  fuelFilter,
  onFuelFilterChange,
}: VehicleFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative min-w-0 flex-1 sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search brand, model, registration…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={typeFilter} onValueChange={(v) => onTypeFilterChange(v as VehicleType | 'ALL')}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Vehicle type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All types</SelectItem>
          {Object.values(VehicleType).map((type) => (
            <SelectItem key={type} value={type}>
              {vehicleTypeLabels[type]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={fuelFilter} onValueChange={(v) => onFuelFilterChange(v as FuelType | 'ALL')}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Fuel type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All fuels</SelectItem>
          {Object.values(FuelType).map((fuel) => (
            <SelectItem key={fuel} value={fuel}>
              {fuelTypeLabels[fuel]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
