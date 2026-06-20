import { AlertTriangle } from 'lucide-react';
import { EmergencyLevel } from '../constants/ai.enums';
import { emergencyLabels, EMERGENCY_LEVELS } from '../constants/ai-labels';
import { cn } from '@/lib/utils';

interface EmergencyBannerProps {
  emergencyLevel: EmergencyLevel;
  className?: string;
}

export function isEmergencyLevel(level: EmergencyLevel): boolean {
  return EMERGENCY_LEVELS.includes(level);
}

export function EmergencyBanner({ emergencyLevel, className }: EmergencyBannerProps) {
  if (!isEmergencyLevel(emergencyLevel)) return null;

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive',
        className,
      )}
      role="alert"
    >
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="font-semibold">
          {emergencyLevel === EmergencyLevel.CRITICAL
            ? 'Critical emergency — seek immediate help'
            : 'High-priority emergency'}
        </p>
        <p className="mt-1 text-destructive/90">
          Emergency level: {emergencyLabels[emergencyLevel]}. Consider calling emergency services if
          anyone is injured or the situation is unsafe.
        </p>
      </div>
    </div>
  );
}
