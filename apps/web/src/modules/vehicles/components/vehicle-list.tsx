'use client';

import { AnimatePresence } from 'framer-motion';
import type { Vehicle } from '../types/vehicle.types';
import { VehicleCard } from './vehicle-card';

interface VehicleListProps {
  vehicles: Vehicle[];
  onDelete: (vehicle: Vehicle) => void;
  onSetPrimary: (vehicle: Vehicle) => void;
  settingPrimaryId: string | null;
}

export function VehicleList({
  vehicles,
  onDelete,
  onSetPrimary,
  settingPrimaryId,
}: VehicleListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onDelete={onDelete}
            onSetPrimary={onSetPrimary}
            isSettingPrimary={settingPrimaryId === vehicle.id}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
