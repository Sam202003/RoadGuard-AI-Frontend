import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Car, ShieldAlert, Wrench } from 'lucide-react';
import type { AiDiagnosisResult } from '../types/ai.types';
import { providerTypeLabels } from '../constants/ai-labels';
import { SeverityBadge } from './severity-badge';
import { EmergencyBanner } from './emergency-banner';

interface DiagnosisCardProps {
  diagnosis: AiDiagnosisResult;
  source?: 'openai' | 'fallback';
  compact?: boolean;
}

export function DiagnosisCard({ diagnosis, source, compact }: DiagnosisCardProps) {
  return (
    <Card className="border-border/60 bg-card/80 shadow-sm">
      <CardHeader className={compact ? 'p-4 pb-2' : undefined}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className={compact ? 'text-base' : 'text-lg'}>
            {diagnosis.probableIssue}
          </CardTitle>
          <SeverityBadge severity={diagnosis.severity} />
        </div>
      </CardHeader>
      <CardContent className={compact ? 'p-4 pt-0' : undefined}>
        <EmergencyBanner emergencyLevel={diagnosis.emergencyLevel} className="mb-4" />

        <div className="flex flex-wrap gap-2">
          <Badge variant={diagnosis.safeToDrive ? 'secondary' : 'destructive'}>
            {diagnosis.safeToDrive ? 'May be safe to drive briefly' : 'Not safe to drive'}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Wrench className="h-3 w-3" />
            {providerTypeLabels[diagnosis.recommendedProvider]}
          </Badge>
          {source === 'fallback' && (
            <Badge variant="outline" className="text-xs">
              Rule-based estimate
            </Badge>
          )}
        </div>

        <Separator className="my-4" />

        <div className="space-y-3 text-sm">
          <div>
            <p className="mb-2 flex items-center gap-2 font-medium">
              <ShieldAlert className="h-4 w-4 text-muted-foreground" />
              Precautions
            </p>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              {diagnosis.precautions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-1 flex items-center gap-2 font-medium">
              <Car className="h-4 w-4 text-muted-foreground" />
              Temporary advice
            </p>
            <p className="text-muted-foreground">{diagnosis.temporaryAdvice}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
