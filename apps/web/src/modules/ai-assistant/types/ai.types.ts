import type {
  DiagnosisSeverity,
  EmergencyLevel,
  RecommendedProviderType,
} from '../constants/ai.enums';

export interface AiDiagnosisResult {
  probableIssue: string;
  severity: DiagnosisSeverity;
  safeToDrive: boolean;
  emergencyLevel: EmergencyLevel;
  recommendedProvider: RecommendedProviderType;
  precautions: string[];
  temporaryAdvice: string;
}

export interface AiDiagnosisRecord {
  id: string;
  userId: string;
  vehicleId?: string | null;
  userMessage: string;
  diagnosis: AiDiagnosisResult;
  model: string;
  source: 'openai' | 'fallback';
  createdAt: string;
  updatedAt: string;
}

export interface DiagnosePayload {
  message: string;
  vehicleId?: string;
  contextMessages?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface ListDiagnosisHistoryParams {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface ListDiagnosisHistoryResult {
  diagnoses: AiDiagnosisRecord[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
}

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  diagnosis?: AiDiagnosisResult;
  diagnosisId?: string;
  createdAt: string;
  source?: 'openai' | 'fallback';
  isError?: boolean;
}
