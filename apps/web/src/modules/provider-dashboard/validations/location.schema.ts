import { z } from 'zod';

export const providerLocationSchema = z.object({
  latitude: z.coerce
    .number({ invalid_type_error: 'Latitude is required' })
    .min(-90)
    .max(90),
  longitude: z.coerce
    .number({ invalid_type_error: 'Longitude is required' })
    .min(-180)
    .max(180),
});

export type ProviderLocationFormValues = z.infer<typeof providerLocationSchema>;
