import { z } from 'zod';
import { FuelType, TransmissionType, VehicleType } from '../constants/vehicle.enums';
// 

const optionalDateField = z
  .string()
  .optional()
  .transform((v) => (v && v.trim() !== '' ? v : undefined));

export const vehicleFormSchema = z.object({
  vehicleType: z.nativeEnum(VehicleType, {
    required_error: 'Vehicle type is required',
  }),
  brand: z.string().min(1, 'Brand is required').max(80),
  model: z.string().min(1, 'Model is required').max(80),
  year: z.coerce
    .number({ invalid_type_error: 'Year is required' })
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  registrationNumber: z
    .string()
    .min(4, 'Registration number must be at least 4 characters')
    .max(20)
    .transform((v) => v.toUpperCase().trim()),
  fuelType: z.nativeEnum(FuelType, { required_error: 'Fuel type is required' }),
  transmissionType: z.nativeEnum(TransmissionType, {
    required_error: 'Transmission is required',
  }),
  color: z.string().max(40).optional().or(z.literal('')),
  insuranceExpiryDate: optionalDateField,
  pollutionExpiryDate: optionalDateField,
  serviceDueDate: optionalDateField,
  isPrimaryVehicle: z.boolean().default(false),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;
