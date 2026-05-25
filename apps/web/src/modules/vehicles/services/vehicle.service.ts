import { apiRequest, apiRequestWithMeta } from '@/lib/api-client';
import type {
  CreateVehiclePayload,
  ListVehiclesParams,
  ListVehiclesResult,
  UpdateVehiclePayload,
  Vehicle,
} from '../types/vehicle.types';

function buildQueryString(params?: ListVehiclesParams): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.search) searchParams.set('search', params.search);
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export async function listVehiclesRequest(
  params?: ListVehiclesParams,
): Promise<ListVehiclesResult> {
  const { data, meta } = await apiRequestWithMeta<{ vehicles: Vehicle[] }>(
    `/vehicles${buildQueryString(params)}`,
    { method: 'GET', auth: true },
  );
  return { vehicles: data.vehicles, meta };
}

export async function getVehicleRequest(id: string): Promise<Vehicle> {
  const data = await apiRequest<{ vehicle: Vehicle }>(`/vehicles/${id}`, {
    method: 'GET',
    auth: true,
  });
  return data.vehicle;
}

export async function createVehicleRequest(payload: CreateVehiclePayload): Promise<Vehicle> {
  const data = await apiRequest<{ vehicle: Vehicle }>('/vehicles', {
    method: 'POST',
    auth: true,
    body: payload,
  });
  return data.vehicle;
}

export async function updateVehicleRequest(
  id: string,
  payload: UpdateVehiclePayload,
): Promise<Vehicle> {
  const data = await apiRequest<{ vehicle: Vehicle }>(`/vehicles/${id}`, {
    method: 'PATCH',
    auth: true,
    body: payload,
  });
  return data.vehicle;
}

export async function deleteVehicleRequest(id: string): Promise<void> {
  await apiRequest<unknown>(`/vehicles/${id}`, {
    method: 'DELETE',
    auth: true,
  });
}
