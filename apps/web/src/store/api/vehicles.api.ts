import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  createVehicleRequest,
  deleteVehicleRequest,
  getVehicleRequest,
  listVehiclesRequest,
  updateVehicleRequest,
} from '@/modules/vehicles/services/vehicle.service';
import { DEFAULT_VEHICLE_LIST_QUERY } from '@/modules/vehicles/constants/vehicle-query';
import type {
  CreateVehiclePayload,
  ListVehiclesParams,
  ListVehiclesResult,
  UpdateVehiclePayload,
  Vehicle,
} from '@/modules/vehicles/types/vehicle.types';

const listQueryArg = DEFAULT_VEHICLE_LIST_QUERY;

export type ListVehiclesQueryArg = ListVehiclesParams | void;

export const vehiclesApi = createApi({
  reducerPath: 'vehiclesApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Vehicle', 'VehicleList'],
  endpoints: (builder) => ({
    listVehicles: builder.query<ListVehiclesResult, ListVehiclesQueryArg>({
      queryFn: async (params) => {
        try {
          const data = await listVehiclesRequest(params ?? undefined);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to load vehicles',
            },
          };
        }
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'VehicleList', id: 'LIST' },
              ...result.vehicles.map((v) => ({ type: 'Vehicle' as const, id: v.id })),
            ]
          : [{ type: 'VehicleList', id: 'LIST' }],
    }),
    getVehicle: builder.query<Vehicle, string>({
      queryFn: async (id) => {
        try {
          const data = await getVehicleRequest(id);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to load vehicle',
            },
          };
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'Vehicle', id }],
    }),
    createVehicle: builder.mutation<Vehicle, CreateVehiclePayload>({
      queryFn: async (body) => {
        try {
          const data = await createVehicleRequest(body);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to create vehicle',
            },
          };
        }
      },
      invalidatesTags: [{ type: 'VehicleList', id: 'LIST' }],
    }),
    updateVehicle: builder.mutation<Vehicle, { id: string; body: UpdateVehiclePayload }>({
      queryFn: async ({ id, body }) => {
        try {
          const data = await updateVehicleRequest(id, body);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to update vehicle',
            },
          };
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Vehicle', id },
        { type: 'VehicleList', id: 'LIST' },
      ],
      async onQueryStarted({ id, body }, { dispatch, queryFulfilled }) {
        const patchList = dispatch(
          vehiclesApi.util.updateQueryData('listVehicles', listQueryArg, (draft) => {
            const index = draft.vehicles.findIndex((v) => v.id === id);
            if (index === -1) return;
            if (body.isPrimaryVehicle) {
              draft.vehicles.forEach((v) => {
                v.isPrimaryVehicle = v.id === id;
              });
            } else {
              Object.assign(draft.vehicles[index], body);
            }
          }),
        );
        const patchDetail = dispatch(
          vehiclesApi.util.updateQueryData('getVehicle', id, (draft) => {
            if (body.isPrimaryVehicle) {
              draft.isPrimaryVehicle = true;
            } else {
              Object.assign(draft, body);
            }
          }),
        );
        try {
          const { data } = await queryFulfilled;
          dispatch(
            vehiclesApi.util.updateQueryData('listVehicles', listQueryArg, (draft) => {
              const index = draft.vehicles.findIndex((v) => v.id === id);
              if (index !== -1) {
                if (data.isPrimaryVehicle) {
                  draft.vehicles.forEach((v) => {
                    v.isPrimaryVehicle = v.id === id;
                  });
                }
                draft.vehicles[index] = data;
              }
            }),
          );
        } catch {
          patchList.undo();
          patchDetail.undo();
        }
      },
    }),
    deleteVehicle: builder.mutation<void, string>({
      queryFn: async (id) => {
        try {
          await deleteVehicleRequest(id);
          return { data: undefined };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to delete vehicle',
            },
          };
        }
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'Vehicle', id },
        { type: 'VehicleList', id: 'LIST' },
      ],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          vehiclesApi.util.updateQueryData('listVehicles', listQueryArg, (draft) => {
            draft.vehicles = draft.vehicles.filter((v) => v.id !== id);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useListVehiclesQuery,
  useGetVehicleQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} = vehiclesApi;
