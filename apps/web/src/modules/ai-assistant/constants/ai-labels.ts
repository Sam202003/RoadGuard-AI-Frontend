import {
  DiagnosisSeverity,
  EmergencyLevel,
  RecommendedProviderType,
} from './ai.enums';

export const severityLabels: Record<DiagnosisSeverity, string> = {
  [DiagnosisSeverity.LOW]: 'Low',
  [DiagnosisSeverity.MEDIUM]: 'Medium',
  [DiagnosisSeverity.HIGH]: 'High',
  [DiagnosisSeverity.CRITICAL]: 'Critical',
};

export const emergencyLabels: Record<EmergencyLevel, string> = {
  [EmergencyLevel.NONE]: 'None',
  [EmergencyLevel.LOW]: 'Low',
  [EmergencyLevel.MEDIUM]: 'Medium',
  [EmergencyLevel.HIGH]: 'High',
  [EmergencyLevel.CRITICAL]: 'Critical',
};

export const providerTypeLabels: Record<RecommendedProviderType, string> = {
  [RecommendedProviderType.MECHANIC]: 'Mechanic',
  [RecommendedProviderType.TOWING]: 'Towing',
  [RecommendedProviderType.FUEL_DELIVERY]: 'Fuel delivery',
  [RecommendedProviderType.BATTERY_SUPPORT]: 'Battery support',
  [RecommendedProviderType.EV_SUPPORT]: 'EV support',
};

export const EMERGENCY_LEVELS: EmergencyLevel[] = [
  EmergencyLevel.HIGH,
  EmergencyLevel.CRITICAL,
];

export const CRITICAL_SEVERITIES: DiagnosisSeverity[] = [
  DiagnosisSeverity.HIGH,
  DiagnosisSeverity.CRITICAL,
];
