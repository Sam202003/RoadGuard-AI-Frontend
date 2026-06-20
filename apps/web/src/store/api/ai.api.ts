import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { DEFAULT_DIAGNOSIS_HISTORY_QUERY } from '@/modules/ai-assistant/constants/ai-query';
import {
  diagnoseBreakdownRequest,
  getDiagnosisByIdRequest,
  listDiagnosisHistoryRequest,
} from '@/modules/ai-assistant/services/ai.service';
import type {
  AiDiagnosisRecord,
  DiagnosePayload,
  ListDiagnosisHistoryParams,
  ListDiagnosisHistoryResult,
} from '@/modules/ai-assistant/types/ai.types';

export type ListDiagnosisHistoryQueryArg = ListDiagnosisHistoryParams | void;

export const aiApi = createApi({
  reducerPath: 'aiApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['AiDiagnosis', 'AiDiagnosisList'],
  endpoints: (builder) => ({
    diagnoseBreakdown: builder.mutation<AiDiagnosisRecord, DiagnosePayload>({
      queryFn: async (body) => {
        try {
          const data = await diagnoseBreakdownRequest(body);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to generate diagnosis',
            },
          };
        }
      },
      invalidatesTags: [{ type: 'AiDiagnosisList', id: 'LIST' }],
    }),
    listDiagnosisHistory: builder.query<
      ListDiagnosisHistoryResult,
      ListDiagnosisHistoryQueryArg
    >({
      queryFn: async (params) => {
        try {
          const data = await listDiagnosisHistoryRequest(params ?? DEFAULT_DIAGNOSIS_HISTORY_QUERY);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error:
                error instanceof Error ? error.message : 'Failed to load diagnosis history',
            },
          };
        }
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'AiDiagnosisList', id: 'LIST' },
              ...result.diagnoses.map((d) => ({ type: 'AiDiagnosis' as const, id: d.id })),
            ]
          : [{ type: 'AiDiagnosisList', id: 'LIST' }],
    }),
    getDiagnosisById: builder.query<AiDiagnosisRecord, string>({
      queryFn: async (id) => {
        try {
          const data = await getDiagnosisByIdRequest(id);
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Failed to load diagnosis',
            },
          };
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'AiDiagnosis', id }],
    }),
  }),
});

export const {
  useDiagnoseBreakdownMutation,
  useListDiagnosisHistoryQuery,
  useGetDiagnosisByIdQuery,
} = aiApi;
