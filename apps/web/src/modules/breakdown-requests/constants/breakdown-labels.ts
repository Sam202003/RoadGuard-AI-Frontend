import {
  AlertTriangle,
  Battery,
  Car,
  CircleDot,
  Fuel,
  KeyRound,
  Thermometer,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { BreakdownStatus, IssueType, RequestPriority } from './breakdown.enums';

export const issueTypeLabels: Record<IssueType, string> = {
  [IssueType.FLAT_TIRE]: 'Flat tire',
  [IssueType.BATTERY_FAILURE]: 'Battery failure',
  [IssueType.FUEL_EMPTY]: 'Out of fuel',
  [IssueType.ENGINE_FAILURE]: 'Engine failure',
  [IssueType.ACCIDENT]: 'Accident',
  [IssueType.BRAKE_FAILURE]: 'Brake failure',
  [IssueType.OVERHEATING]: 'Overheating',
  [IssueType.LOCKOUT]: 'Lockout',
  [IssueType.EV_BATTERY_LOW]: 'EV battery low',
};

export const issueTypeIcons: Record<IssueType, LucideIcon> = {
  [IssueType.FLAT_TIRE]: CircleDot,
  [IssueType.BATTERY_FAILURE]: Battery,
  [IssueType.FUEL_EMPTY]: Fuel,
  [IssueType.ENGINE_FAILURE]: Wrench,
  [IssueType.ACCIDENT]: AlertTriangle,
  [IssueType.BRAKE_FAILURE]: Car,
  [IssueType.OVERHEATING]: Thermometer,
  [IssueType.LOCKOUT]: KeyRound,
  [IssueType.EV_BATTERY_LOW]: Zap,
};

export const issueTypeOptions = Object.values(IssueType).map((value) => ({
  value,
  label: issueTypeLabels[value],
  icon: issueTypeIcons[value],
}));

export const statusLabels: Record<BreakdownStatus, string> = {
  [BreakdownStatus.CREATED]: 'Created',
  [BreakdownStatus.SEARCHING_PROVIDER]: 'Searching provider',
  [BreakdownStatus.PROVIDER_ASSIGNED]: 'Provider assigned',
  [BreakdownStatus.ON_THE_WAY]: 'On the way',
  [BreakdownStatus.ARRIVED]: 'Arrived',
  [BreakdownStatus.IN_PROGRESS]: 'In progress',
  [BreakdownStatus.COMPLETED]: 'Completed',
  [BreakdownStatus.CANCELLED]: 'Cancelled',
};

export const priorityLabels: Record<RequestPriority, string> = {
  [RequestPriority.LOW]: 'Low',
  [RequestPriority.MEDIUM]: 'Standard',
  [RequestPriority.HIGH]: 'High',
  [RequestPriority.EMERGENCY]: 'Emergency',
};

export const TIMELINE_STATUSES: BreakdownStatus[] = [
  BreakdownStatus.CREATED,
  BreakdownStatus.SEARCHING_PROVIDER,
  BreakdownStatus.PROVIDER_ASSIGNED,
  BreakdownStatus.ON_THE_WAY,
  BreakdownStatus.ARRIVED,
  BreakdownStatus.IN_PROGRESS,
  BreakdownStatus.COMPLETED,
];
