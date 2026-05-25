import { Bike, Car, Truck, Zap, Building2, type LucideIcon } from 'lucide-react';
import { VehicleType } from '../constants/vehicle.enums';

const iconMap: Record<VehicleType, LucideIcon> = {
  [VehicleType.BIKE]: Bike,
  [VehicleType.CAR]: Car,
  [VehicleType.TRUCK]: Truck,
  [VehicleType.EV]: Zap,
  [VehicleType.COMMERCIAL]: Building2,
};

export function getVehicleTypeIcon(type: VehicleType): LucideIcon {
  return iconMap[type] ?? Car;
}
