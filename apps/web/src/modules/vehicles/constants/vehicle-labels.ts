import { FuelType, TransmissionType, VehicleType } from './vehicle.enums';

export const vehicleTypeLabels: Record<VehicleType, string> = {
  [VehicleType.BIKE]: 'Bike',
  [VehicleType.CAR]: 'Car',
  [VehicleType.TRUCK]: 'Truck',
  [VehicleType.EV]: 'Electric Vehicle',
  [VehicleType.COMMERCIAL]: 'Commercial',
};

export const fuelTypeLabels: Record<FuelType, string> = {
  [FuelType.PETROL]: 'Petrol',
  [FuelType.DIESEL]: 'Diesel',
  [FuelType.ELECTRIC]: 'Electric',
  [FuelType.CNG]: 'CNG',
  [FuelType.HYBRID]: 'Hybrid',
};

export const transmissionTypeLabels: Record<TransmissionType, string> = {
  [TransmissionType.MANUAL]: 'Manual',
  [TransmissionType.AUTOMATIC]: 'Automatic',
};

export const vehicleTypeOptions = Object.values(VehicleType).map((value) => ({
  value,
  label: vehicleTypeLabels[value],
}));

export const fuelTypeOptions = Object.values(FuelType).map((value) => ({
  value,
  label: fuelTypeLabels[value],
}));

export const transmissionTypeOptions = Object.values(TransmissionType).map((value) => ({
  value,
  label: transmissionTypeLabels[value],
}));
