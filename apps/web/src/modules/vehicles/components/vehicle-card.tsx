'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, Pencil, Star, Trash2 } from 'lucide-react';
import { getCustomerVehicleEditPath } from '@roadguard/config';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  fuelTypeLabels,
  transmissionTypeLabels,
  vehicleTypeLabels,
} from '../constants/vehicle-labels';
import type { Vehicle } from '../types/vehicle.types';
import { formatDisplayDate, getVehicleDisplayName } from '../utils/vehicle-formatters';
import { getVehicleTypeIcon } from '../utils/vehicle-icons';
import { PrimaryVehicleBadge } from './primary-vehicle-badge';

interface VehicleCardProps {
  vehicle: Vehicle;
  onDelete: (vehicle: Vehicle) => void;
  onSetPrimary: (vehicle: Vehicle) => void;
  isSettingPrimary: boolean;
}

export function VehicleCard({
  vehicle,
  onDelete,
  onSetPrimary,
  isSettingPrimary,
}: VehicleCardProps) {
  const Icon = getVehicleTypeIcon(vehicle.vehicleType);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
    >
      <Card className="flex h-full flex-col border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          {vehicle.isPrimaryVehicle && <PrimaryVehicleBadge />}
        </div>

        <div className="mt-4 space-y-1">
          <h3 className="font-semibold leading-tight">{getVehicleDisplayName(vehicle)}</h3>
          <p className="font-mono text-sm text-muted-foreground">{vehicle.registrationNumber}</p>
          <p className="text-xs text-muted-foreground">
            {vehicleTypeLabels[vehicle.vehicleType]} · {vehicle.year} ·{' '}
            {fuelTypeLabels[vehicle.fuelType]} · {transmissionTypeLabels[vehicle.transmissionType]}
          </p>
          {vehicle.color && (
            <p className="text-xs text-muted-foreground">Color: {vehicle.color}</p>
          )}
        </div>

        <dl className="mt-4 grid grid-cols-1 gap-1 text-xs text-muted-foreground sm:grid-cols-3 sm:gap-2">
          <div>
            <dt className="font-medium text-foreground/80">Insurance</dt>
            <dd>{formatDisplayDate(vehicle.insuranceExpiryDate)}</dd>
          </div>
          <div>
            <dt className="font-medium text-foreground/80">Pollution</dt>
            <dd>{formatDisplayDate(vehicle.pollutionExpiryDate)}</dd>
          </div>
          <div>
            <dt className="font-medium text-foreground/80">Service due</dt>
            <dd>{formatDisplayDate(vehicle.serviceDueDate)}</dd>
          </div>
        </dl>

        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          {!vehicle.isPrimaryVehicle && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              disabled={isSettingPrimary}
              onClick={() => onSetPrimary(vehicle)}
            >
              {isSettingPrimary ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Star className="h-3.5 w-3.5" />
              )}
              Set primary
            </Button>
          )}
          <Button variant="outline" size="sm" className="gap-1" asChild>
            <Link href={getCustomerVehicleEditPath(vehicle.id)}>
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(vehicle)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
