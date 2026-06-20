'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { AiDiagnosisRecord } from '../types/ai.types';
import { formatDiagnosisTime } from '../utils/formatters';

interface DiagnosisHistoryPanelProps {
  diagnoses: AiDiagnosisRecord[];
  isLoading?: boolean;
  selectedId?: string | null;
  onSelect: (record: AiDiagnosisRecord) => void;
  className?: string;
}

export function DiagnosisHistoryPanel({
  diagnoses,
  isLoading,
  selectedId,
  onSelect,
  className,
}: DiagnosisHistoryPanelProps) {
  return (
    <aside
      className={cn(
        'flex flex-col rounded-xl border border-border/60 bg-card/60',
        className,
      )}
    >
      <div className="border-b border-border/60 px-4 py-3">
        <h2 className="text-sm font-semibold">Diagnosis history</h2>
        <p className="text-xs text-muted-foreground">Past AI assessments</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="mb-2 h-16 w-full rounded-lg" />
            ))}

          {!isLoading && diagnoses.length === 0 && (
            <p className="px-2 py-8 text-center text-sm text-muted-foreground">
              No diagnoses yet. Start a conversation below.
            </p>
          )}

          {!isLoading &&
            diagnoses.map((record) => (
              <button
                key={record.id}
                type="button"
                onClick={() => onSelect(record)}
                className={cn(
                  'mb-2 w-full rounded-lg border px-3 py-2.5 text-left transition-colors hover:bg-accent',
                  selectedId === record.id
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-transparent',
                )}
              >
                <p className="line-clamp-1 text-sm font-medium">
                  {record.diagnosis.probableIssue}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {record.userMessage}
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {formatDiagnosisTime(record.createdAt)}
                </p>
              </button>
            ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
