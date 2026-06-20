import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { DiagnosisSeverity } from '../constants/ai.enums';
import { severityLabels } from '../constants/ai-labels';

const variantStyles: Record<DiagnosisSeverity, string> = {
  [DiagnosisSeverity.LOW]: 'border-primary/30 bg-primary/10 text-brand-navy dark:text-primary',
  [DiagnosisSeverity.MEDIUM]:
    'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  [DiagnosisSeverity.HIGH]: 'border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-300',
  [DiagnosisSeverity.CRITICAL]:
    'border-destructive/30 bg-destructive/10 text-destructive',
};

interface SeverityBadgeProps {
  severity: DiagnosisSeverity;
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  return (
    <Badge variant="outline" className={cn(variantStyles[severity], className)}>
      {severityLabels[severity]} severity
    </Badge>
  );
}
