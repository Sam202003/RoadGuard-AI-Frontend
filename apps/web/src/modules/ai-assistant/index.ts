export { AiAssistantPage } from './pages/ai-assistant-page';

export {
  useDiagnoseBreakdownMutation,
  useListDiagnosisHistoryQuery,
  useGetDiagnosisByIdQuery,
} from './api';

export type {
  AiDiagnosisResult,
  AiDiagnosisRecord,
  ChatMessage,
  DiagnosePayload,
} from './types/ai.types';

export {
  DiagnosisSeverity,
  EmergencyLevel,
  RecommendedProviderType,
} from './constants/ai.enums';

export { DiagnosisCard } from './components/diagnosis-card';
export { SeverityBadge } from './components/severity-badge';
export { EmergencyBanner, isEmergencyLevel } from './components/emergency-banner';
