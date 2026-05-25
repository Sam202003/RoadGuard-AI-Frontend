import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { BreakdownStatus } from '@/modules/breakdown-requests/constants/breakdown.enums';
import { DEFAULT_BREAKDOWN_LIST_QUERY } from '@/modules/breakdown-requests/constants/breakdown-query';
import {
  cancelBreakdownRequestRequest,
  createBreakdownRequestRequest,
  getBreakdownRequestRequest,
  listBreakdownRequestsRequest,
  updateBreakdownStatusRequest,
} from '@/modules/breakdown-requests/services/breakdown.service';
import type { UpdateBreakdownStatusPayload } from '@/modules/breakdown-requests/services/breakdown.service';
import type {
  CancelBreakdownRequestPayload,
  CreateBreakdownRequestPayload,
  ListBreakdownRequestsParams,
  ListBreakdownRequestsResult,
  BreakdownRequest,
} from '@/modules/breakdown-requests/types/breakdown.types';

const listQueryArg = DEFAULT_BREAKDOWN_LIST_QUERY;

export type ListBreakdownQueryArg = ListBreakdownRequestsParams | void;

export const breakdownApi = createApi({
  reducerPath: 'breakdownApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Breakdown', 'BreakdownList'],
  endpoints: (builder) => ({
    listBreakdownRequests: builder.query<ListBreakdownRequestsResult, ListBreakdownQueryArg>({
      queryFn: async (params) => {
        try {
          const data = await listBreakdownRequestsRequest(params ?? undefined);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error:
                error instanceof Error ? error.message : 'Failed to load breakdown requests',
            },
          };
        }
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'BreakdownList', id: 'LIST' },
              ...result.requests.map((r) => ({ type: 'Breakdown' as const, id: r.id })),
            ]
          : [{ type: 'BreakdownList', id: 'LIST' }],
    }),
    getBreakdownRequest: builder.query<BreakdownRequest, string>({
      queryFn: async (id) => {
        try {
          const data = await getBreakdownRequestRequest(id);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error:
                error instanceof Error ? error.message : 'Failed to load breakdown request',
            },
          };
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'Breakdown', id }],
    }),
    createBreakdownRequest: builder.mutation<BreakdownRequest, CreateBreakdownRequestPayload>({
      queryFn: async (body) => {
        try {
          const data = await createBreakdownRequestRequest(body);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error:
                error instanceof Error ? error.message : 'Failed to create breakdown request',
            },
          };
        }
      },
      invalidatesTags: [{ type: 'BreakdownList', id: 'LIST' }],
    }),
    updateBreakdownStatus: builder.mutation<
      BreakdownRequest,
      { id: string; body: UpdateBreakdownStatusPayload }
    >({
      queryFn: async ({ id, body }) => {
        try {
          const data = await updateBreakdownStatusRequest(id, body);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error:
                error instanceof Error ? error.message : 'Failed to update request status',
            },
          };
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Breakdown', id },
        { type: 'BreakdownList', id: 'LIST' },
      ],
      async onQueryStarted({ id, body }, { dispatch, queryFulfilled }) {
        const patchList = dispatch(
          breakdownApi.util.updateQueryData('listBreakdownRequests', listQueryArg, (draft) => {
            const item = draft.requests.find((r) => r.id === id);
            if (item) item.status = body.status;
          }),
        );
        const patchDetail = dispatch(
          breakdownApi.util.updateQueryData('getBreakdownRequest', id, (draft) => {
            draft.status = body.status;
          }),
        );
        try {
          const { data } = await queryFulfilled;
          dispatch(
            breakdownApi.util.updateQueryData('listBreakdownRequests', listQueryArg, (draft) => {
              const index = draft.requests.findIndex((r) => r.id === id);
              if (index !== -1) draft.requests[index] = data;
            }),
          );
          dispatch(breakdownApi.util.updateQueryData('getBreakdownRequest', id, () => data));
        } catch {
          patchList.undo();
          patchDetail.undo();
        }
      },
    }),
    cancelBreakdownRequest: builder.mutation<
      BreakdownRequest,
      { id: string; body: CancelBreakdownRequestPayload }
    >({
      queryFn: async ({ id, body }) => {
        try {
          const data = await cancelBreakdownRequestRequest(id, body);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error:
                error instanceof Error ? error.message : 'Failed to cancel breakdown request',
            },
          };
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Breakdown', id },
        { type: 'BreakdownList', id: 'LIST' },
      ],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchList = dispatch(
          breakdownApi.util.updateQueryData('listBreakdownRequests', listQueryArg, (draft) => {
            const item = draft.requests.find((r) => r.id === id);
            if (item) item.status = BreakdownStatus.CANCELLED;
          }),
        );
        const patchDetail = dispatch(
          breakdownApi.util.updateQueryData('getBreakdownRequest', id, (draft) => {
            draft.status = BreakdownStatus.CANCELLED;
          }),
        );
        try {
          const { data } = await queryFulfilled;
          dispatch(
            breakdownApi.util.updateQueryData('listBreakdownRequests', listQueryArg, (draft) => {
              const index = draft.requests.findIndex((r) => r.id === id);
              if (index !== -1) draft.requests[index] = data;
            }),
          );
          dispatch(breakdownApi.util.updateQueryData('getBreakdownRequest', id, () => data));
        } catch {
          patchList.undo();
          patchDetail.undo();
        }
      },
    }),
  }),
});

export const {
  useListBreakdownRequestsQuery,
  useGetBreakdownRequestQuery,
  useCreateBreakdownRequestMutation,
  useUpdateBreakdownStatusMutation,
  useCancelBreakdownRequestMutation,
} = breakdownApi;
