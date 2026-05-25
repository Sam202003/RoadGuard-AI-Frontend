import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  getMyProviderRequest,
  updateAvailabilityRequest,
  updateLocationRequest,
} from '@/modules/provider-dashboard/services/provider.service';
import type {
  ProviderProfile,
  UpdateAvailabilityPayload,
  UpdateLocationPayload,
} from '@/modules/provider-dashboard/types/provider.types';

export const providerApi = createApi({
  reducerPath: 'providerApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['ProviderProfile'],
  endpoints: (builder) => ({
    getMyProvider: builder.query<ProviderProfile, void>({
      queryFn: async () => {
        try {
          const data = await getMyProviderRequest();
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to load provider profile',
            },
          };
        }
      },
      providesTags: [{ type: 'ProviderProfile', id: 'ME' }],
    }),
    updateAvailability: builder.mutation<ProviderProfile, UpdateAvailabilityPayload>({
      queryFn: async (body) => {
        try {
          const data = await updateAvailabilityRequest(body);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to update availability',
            },
          };
        }
      },
      invalidatesTags: [{ type: 'ProviderProfile', id: 'ME' }],
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          providerApi.util.updateQueryData('getMyProvider', undefined, (draft) => {
            if (body.availabilityStatus !== undefined) {
              draft.availabilityStatus = body.availabilityStatus;
            }
            if (body.onlineStatus !== undefined) {
              draft.onlineStatus = body.onlineStatus;
            }
          }),
        );
        try {
          const { data } = await queryFulfilled;
          dispatch(providerApi.util.updateQueryData('getMyProvider', undefined, () => data));
        } catch {
          patchResult.undo();
        }
      },
    }),
    updateLocation: builder.mutation<ProviderProfile, UpdateLocationPayload>({
      queryFn: async (body) => {
        try {
          const data = await updateLocationRequest(body);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to update location',
            },
          };
        }
      },
      invalidatesTags: [{ type: 'ProviderProfile', id: 'ME' }],
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          providerApi.util.updateQueryData('getMyProvider', undefined, (draft) => {
            draft.currentLocation = body.currentLocation;
            if (body.serviceRadius !== undefined) {
              draft.serviceRadius = body.serviceRadius;
            }
          }),
        );
        try {
          const { data } = await queryFulfilled;
          dispatch(providerApi.util.updateQueryData('getMyProvider', undefined, () => data));
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetMyProviderQuery,
  useUpdateAvailabilityMutation,
  useUpdateLocationMutation,
} = providerApi;
