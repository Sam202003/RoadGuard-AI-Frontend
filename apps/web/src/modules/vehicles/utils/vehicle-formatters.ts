import type { Vehicle } from '../types/vehicle.types';
import type { VehicleFormValues } from '../validations/vehicle.schema';
import type { CreateVehiclePayload, UpdateVehiclePayload } from '../types/vehicle.types';

function toIsoDateOrNull(value?: string): string | null | undefined {
  if (value === undefined) return undefined;
  if (!value || value.trim() === '') return null;
  return new Date(value).toISOString();
}

function formatDateInput(value?: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

export function vehicleToFormValues(vehicle: Vehicle): VehicleFormValues {
  return {
    vehicleType: vehicle.vehicleType,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    registrationNumber: vehicle.registrationNumber,
    fuelType: vehicle.fuelType,
    transmissionType: vehicle.transmissionType,
    color: vehicle.color ?? '',
    insuranceExpiryDate: formatDateInput(vehicle.insuranceExpiryDate),
    pollutionExpiryDate: formatDateInput(vehicle.pollutionExpiryDate),
    serviceDueDate: formatDateInput(vehicle.serviceDueDate),
    isPrimaryVehicle: vehicle.isPrimaryVehicle,
  };
}

export function formValuesToCreatePayload(values: VehicleFormValues): CreateVehiclePayload {
  return {
    vehicleType: values.vehicleType,
    brand: values.brand.trim(),
    model: values.model.trim(),
    year: values.year,
    registrationNumber: values.registrationNumber,
    fuelType: values.fuelType,
    transmissionType: values.transmissionType,
    color: values.color?.trim() ? values.color.trim() : null,
    insuranceExpiryDate: toIsoDateOrNull(values.insuranceExpiryDate) ?? null,
    pollutionExpiryDate: toIsoDateOrNull(values.pollutionExpiryDate) ?? null,
    serviceDueDate: toIsoDateOrNull(values.serviceDueDate) ?? null,
    isPrimaryVehicle: values.isPrimaryVehicle,
  };
}

export function formValuesToUpdatePayload(values: VehicleFormValues): UpdateVehiclePayload {
  return formValuesToCreatePayload(values);
}

export function formatDisplayDate(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getVehicleDisplayName(vehicle: Vehicle): string {
  return `${vehicle.brand} ${vehicle.model}`;
}
