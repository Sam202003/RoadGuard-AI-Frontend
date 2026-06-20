import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Megaphone,
  Truck,
  UserCheck,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { NotificationPriority, NotificationType } from './notification.enums';

export const notificationTypeLabels: Record<NotificationType, string> = {
  [NotificationType.BREAKDOWN_CREATED]: 'Breakdown created',
  [NotificationType.PROVIDER_ASSIGNED]: 'Provider assigned',
  [NotificationType.PROVIDER_ARRIVED]: 'Provider arrived',
  [NotificationType.REQUEST_COMPLETED]: 'Request completed',
  [NotificationType.REQUEST_CANCELLED]: 'Request cancelled',
  [NotificationType.EMERGENCY_ALERT]: 'Emergency alert',
  [NotificationType.SYSTEM_NOTIFICATION]: 'System',
  [NotificationType.ADMIN_BROADCAST]: 'Admin broadcast',
};

export const notificationPriorityLabels: Record<NotificationPriority, string> = {
  [NotificationPriority.LOW]: 'Low',
  [NotificationPriority.MEDIUM]: 'Medium',
  [NotificationPriority.HIGH]: 'High',
  [NotificationPriority.EMERGENCY]: 'Emergency',
};

export const notificationTypeIcons: Record<NotificationType, LucideIcon> = {
  [NotificationType.BREAKDOWN_CREATED]: Wrench,
  [NotificationType.PROVIDER_ASSIGNED]: UserCheck,
  [NotificationType.PROVIDER_ARRIVED]: Truck,
  [NotificationType.REQUEST_COMPLETED]: CheckCircle2,
  [NotificationType.REQUEST_CANCELLED]: Bell,
  [NotificationType.EMERGENCY_ALERT]: AlertTriangle,
  [NotificationType.SYSTEM_NOTIFICATION]: Bell,
  [NotificationType.ADMIN_BROADCAST]: Megaphone,
};

export const notificationTypeOptions = Object.values(NotificationType).map((value) => ({
  value,
  label: notificationTypeLabels[value],
}));
