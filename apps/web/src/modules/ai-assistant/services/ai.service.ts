import { apiRequest, apiRequestWithMeta } from '@/lib/api-client';
import type {
  AiDiagnosisRecord,
  DiagnosePayload,
  ListDiagnosisHistoryParams,
  ListDiagnosisHistoryResult,
} from '../types/ai.types';

function buildQueryString(params?: ListDiagnosisHistoryParams): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.sort) searchParams.set('sort', params.sort);
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export async function diagnoseBreakdownRequest(
  payload: DiagnosePayload,
): Promise<AiDiagnosisRecord> {
  const data = await apiRequest<{ diagnosis: AiDiagnosisRecord }>('/ai/diagnose', {
    method: 'POST',
    auth: true,
    body: payload,
  });
  return data.diagnosis;
}

export async function listDiagnosisHistoryRequest(
  params?: ListDiagnosisHistoryParams,
): Promise<ListDiagnosisHistoryResult> {
  const { data, meta } = await apiRequestWithMeta<{ diagnoses: AiDiagnosisRecord[] }>(
    `/ai/diagnosis-history${buildQueryString(params)}`,
    { method: 'GET', auth: true },
  );

  return {
    diagnoses: data.diagnoses,
    meta: {
      page: Number(meta?.page ?? params?.page ?? 1),
      limit: Number(meta?.limit ?? params?.limit ?? 20),
      total: Number(meta?.total ?? data.diagnoses.length),
      totalPages: Number(meta?.totalPages ?? 1),
      hasNextPage: Boolean(meta?.hasNextPage),
      hasPrevPage: Boolean(meta?.hasPrevPage),
    },
  };
}

export async function getDiagnosisByIdRequest(id: string): Promise<AiDiagnosisRecord> {
  const data = await apiRequest<{ diagnosis: AiDiagnosisRecord }>(
    `/ai/diagnosis-history/${id}`,
    { method: 'GET', auth: true },
  );
  return data.diagnosis;
}
