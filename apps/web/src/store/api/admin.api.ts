import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { DEFAULT_ADMIN_PROVIDERS_QUERY, DEFAULT_ADMIN_USERS_QUERY } from '@/modules/admin-dashboard/constants/admin-query';
import {
  getAdminAnalyticsRequest,
  getAdminDashboardStatsRequest,
  getAdminProviderRequest,
  getAdminUserRequest,
  listAdminBreakdownRequestsRequest,
  listAdminProvidersRequest,
  listAdminUsersRequest,
  updateAdminProviderKycRequest,
  updateAdminUserStatusRequest,
} from '@/modules/admin-dashboard/services/admin.service';
import type {
  AdminAnalytics,
  AdminProvider,
  AdminUser,
  ListAdminProvidersParams,
  ListAdminUsersParams,
  ListAdminProvidersResult,
  ListAdminUsersResult,
  UpdateUserStatusPayload,
  AdminDashboardStats,
  AdminActivityItem,
} from '@/modules/admin-dashboard/types/admin.types';
import type { KycStatus } from '@/modules/provider-dashboard/constants/provider.enums';
import type { BreakdownRequest } from '@/modules/breakdown-requests/types/breakdown.types';

export interface AdminDashboardResult {
  stats: AdminDashboardStats;
  activity: AdminActivityItem[];
}

export type ListAdminUsersQueryArg = ListAdminUsersParams | void;
export type ListAdminProvidersQueryArg = ListAdminProvidersParams | void;

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['AdminDashboard', 'AdminUser', 'AdminUserList', 'AdminProvider', 'AdminProviderList', 'AdminAnalytics', 'AdminBreakdownList'],
  endpoints: (builder) => ({
    getAdminDashboard: builder.query<AdminDashboardResult, void>({
      queryFn: async () => {
        try {
          const data = await getAdminDashboardStatsRequest();
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to load dashboard',
            },
          };
        }
      },
      providesTags: [{ type: 'AdminDashboard', id: 'STATS' }],
    }),
    listAdminUsers: builder.query<ListAdminUsersResult, ListAdminUsersQueryArg>({
      queryFn: async (params) => {
        try {
          const data = await listAdminUsersRequest(params ?? DEFAULT_ADMIN_USERS_QUERY);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to load users',
            },
          };
        }
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'AdminUserList', id: 'LIST' },
              ...result.users.map((u) => ({ type: 'AdminUser' as const, id: u.id })),
            ]
          : [{ type: 'AdminUserList', id: 'LIST' }],
    }),
    getAdminUser: builder.query<AdminUser, string>({
      queryFn: async (id) => {
        try {
          const data = await getAdminUserRequest(id);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to load user',
            },
          };
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'AdminUser', id }],
    }),
    updateAdminUserStatus: builder.mutation<
      AdminUser,
      { id: string; body: UpdateUserStatusPayload }
    >({
      queryFn: async ({ id, body }) => {
        try {
          const data = await updateAdminUserStatusRequest(id, body);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to update user status',
            },
          };
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'AdminUser', id },
        { type: 'AdminUserList', id: 'LIST' },
        { type: 'AdminDashboard', id: 'STATS' },
      ],
      async onQueryStarted({ id, body }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          adminApi.util.updateQueryData('listAdminUsers', DEFAULT_ADMIN_USERS_QUERY, (draft) => {
            const user = draft.users.find((u) => u.id === id);
            if (user) user.isActive = body.isActive;
          }),
        );
        try {
          const { data } = await queryFulfilled;
          dispatch(
            adminApi.util.updateQueryData('listAdminUsers', DEFAULT_ADMIN_USERS_QUERY, (draft) => {
              const index = draft.users.findIndex((u) => u.id === id);
              if (index !== -1) draft.users[index] = data;
            }),
          );
        } catch {
          patch.undo();
        }
      },
    }),
    listAdminProviders: builder.query<ListAdminProvidersResult, ListAdminProvidersQueryArg>({
      queryFn: async (params) => {
        try {
          const data = await listAdminProvidersRequest(params ?? DEFAULT_ADMIN_PROVIDERS_QUERY);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to load providers',
            },
          };
        }
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'AdminProviderList', id: 'LIST' },
              ...result.providers.map((p) => ({ type: 'AdminProvider' as const, id: p.id })),
            ]
          : [{ type: 'AdminProviderList', id: 'LIST' }],
    }),
    getAdminProvider: builder.query<AdminProvider, string>({
      queryFn: async (id) => {
        try {
          const data = await getAdminProviderRequest(id);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to load provider',
            },
          };
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'AdminProvider', id }],
    }),
    updateAdminProviderKyc: builder.mutation<
      AdminProvider,
      { id: string; kycStatus: KycStatus }
    >({
      queryFn: async ({ id, kycStatus }) => {
        try {
          const data = await updateAdminProviderKycRequest(id, kycStatus);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to update KYC status',
            },
          };
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'AdminProvider', id },
        { type: 'AdminProviderList', id: 'LIST' },
        { type: 'AdminDashboard', id: 'STATS' },
      ],
    }),
    getAdminAnalytics: builder.query<AdminAnalytics, void>({
      queryFn: async () => {
        try {
          const data = await getAdminAnalyticsRequest();
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to load analytics',
            },
          };
        }
      },
      providesTags: [{ type: 'AdminAnalytics', id: 'SUMMARY' }],
    }),
    listAdminBreakdownRequests: builder.query<BreakdownRequest[], void>({
      queryFn: async () => {
        try {
          const data = await listAdminBreakdownRequestsRequest();
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to load breakdown requests',
            },
          };
        }
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'AdminBreakdownList', id: 'LIST' },
              ...result.map((r) => ({ type: 'AdminBreakdownList' as const, id: r.id })),
            ]
          : [{ type: 'AdminBreakdownList', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAdminDashboardQuery,
  useListAdminUsersQuery,
  useGetAdminUserQuery,
  useUpdateAdminUserStatusMutation,
  useListAdminProvidersQuery,
  useGetAdminProviderQuery,
  useUpdateAdminProviderKycMutation,
  useGetAdminAnalyticsQuery,
  useListAdminBreakdownRequestsQuery,
} = adminApi;
