import type { FuelType, TransmissionType, VehicleType } from '../constants/vehicle.enums';

export interface Vehicle {
  id: string;
  ownerId: string;
  vehicleType: VehicleType;
  brand: string;
  model: string;
  year: number;
  registrationNumber: string;
  fuelType: FuelType;
  transmissionType: TransmissionType;
  color?: string | null;
  insuranceExpiryDate?: string | null;
  pollutionExpiryDate?: string | null;
  serviceDueDate?: string | null;
  vehicleImages: string[];
  isPrimaryVehicle: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListVehiclesParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}

export interface ListVehiclesResult {
  vehicles: Vehicle[];
  meta?: Record<string, unknown>;
}

export interface CreateVehiclePayload {
  vehicleType: VehicleType;
  brand: string;
  model: string;
  year: number;
  registrationNumber: string;
  fuelType: FuelType;
  transmissionType: TransmissionType;
  color?: string | null;
  insuranceExpiryDate?: string | null;
  pollutionExpiryDate?: string | null;
  serviceDueDate?: string | null;
  isPrimaryVehicle?: boolean;
}

export type UpdateVehiclePayload = Partial<CreateVehiclePayload>;
