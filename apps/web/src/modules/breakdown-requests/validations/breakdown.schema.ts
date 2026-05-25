import { z } from 'zod';
import { IssueType, RequestPriority } from '../constants/breakdown.enums';

export const breakdownRequestFormSchema = z.object({
  vehicleId: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Select a vehicle'),
  issueType: z.nativeEnum(IssueType, { required_error: 'Select an issue type' }),
  issueDescription: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000),
  isEmergency: z.boolean().default(false),
  latitude: z.coerce
    .number({ invalid_type_error: 'Latitude is required' })
    .min(-90)
    .max(90),
  longitude: z.coerce
    .number({ invalid_type_error: 'Longitude is required' })
    .min(-180)
    .max(180),
});

export type BreakdownRequestFormValues = z.infer<typeof breakdownRequestFormSchema>;

export const cancelBreakdownSchema = z.object({
  cancellationReason: z
    .string()
    .min(3, 'Reason must be at least 3 characters')
    .max(500),
});

export type CancelBreakdownFormValues = z.infer<typeof cancelBreakdownSchema>;

export function formValuesToCreatePayload(
  values: BreakdownRequestFormValues,
): import('../types/breakdown.types').CreateBreakdownRequestPayload {
  const priority =
    values.isEmergency || values.issueType === IssueType.ACCIDENT
      ? RequestPriority.EMERGENCY
      : RequestPriority.MEDIUM;

  return {
    vehicleId: values.vehicleId,
    issueType: values.issueType,
    issueDescription: values.issueDescription.trim(),
    priority,
    location: {
      type: 'Point',
      coordinates: [values.longitude, values.latitude],
    },
    trackingEnabled: true,
  };
}
