'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { IssueType } from '../constants/breakdown.enums';
import { issueTypeOptions } from '../constants/breakdown-labels';

interface IssueTypeCardsProps {
  value?: IssueType;
  onChange: (value: IssueType) => void;
  error?: string;
}

export function IssueTypeCards({ value, onChange, error }: IssueTypeCardsProps) {
  return (
    <div className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {issueTypeOptions.map((option) => {
          const Icon = option.icon;
          const selected = value === option.value;
          return (
            <motion.button
              key={option.value}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(option.value)}
              className={cn(
                'flex items-center gap-3 rounded-xl border p-3 text-left transition-colors',
                selected
                  ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                  : 'border-border/60 bg-card/50 hover:border-primary/40 hover:bg-card/80',
              )}
            >
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                  selected ? 'bg-primary text-primary-foreground' : 'bg-muted',
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">{option.label}</span>
            </motion.button>
          );
        })}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
