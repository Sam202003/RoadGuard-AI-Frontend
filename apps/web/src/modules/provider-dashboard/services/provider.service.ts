import { apiRequest } from '@/lib/api-client';
import type {
  ProviderProfile,
  UpdateAvailabilityPayload,
  UpdateLocationPayload,
} from '../types/provider.types';

export async function getMyProviderRequest(): Promise<ProviderProfile> {
  const data = await apiRequest<{ provider: ProviderProfile }>('/providers/me', {
    method: 'GET',
    auth: true,
  });
  return data.provider;
}

export async function updateAvailabilityRequest(
  payload: UpdateAvailabilityPayload,
): Promise<ProviderProfile> {
  const data = await apiRequest<{ provider: ProviderProfile }>('/providers/availability', {
    method: 'PATCH',
    auth: true,
    body: payload,
  });
  return data.provider;
}

export async function updateLocationRequest(
  payload: UpdateLocationPayload,
): Promise<ProviderProfile> {
  const data = await apiRequest<{ provider: ProviderProfile }>('/providers/location', {
    method: 'PATCH',
    auth: true,
    body: payload,
  });
  return data.provider;
}
