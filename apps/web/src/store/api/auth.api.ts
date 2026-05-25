import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AuthResult, AuthUser, LoginRequest, RegisterRequest } from '@roadguard/types';
import {
  getMeRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
} from '@/modules/auth/services/auth.service';
import { getRefreshToken } from '@/lib/auth-storage';
import { logout, setCredentials, setUser } from '../auth.slice';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResult, LoginRequest>({
      queryFn: async (body) => {
        try {
          const data = await loginRequest(body);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Login failed',
            },
          };
        }
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setCredentials({ user: data.user, tokens: data.tokens }));
      },
    }),
    register: builder.mutation<AuthResult, RegisterRequest>({
      queryFn: async (body) => {
        try {
          const data = await registerRequest(body);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Registration failed',
            },
          };
        }
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setCredentials({ user: data.user, tokens: data.tokens }));
      },
    }),
    getMe: builder.query<AuthUser, void>({
      queryFn: async () => {
        try {
          const data = await getMeRequest();
          return { data: data.user };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Session invalid',
            },
          };
        }
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setUser(data));
      },
    }),
    logout: builder.mutation<void, void>({
      queryFn: async () => {
        try {
          const refreshToken = getRefreshToken() ?? undefined;
          await logoutRequest(refreshToken);
          return { data: undefined };
        } catch {
          return { data: undefined };
        }
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(logout());
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useLogoutMutation,
} = authApi;
