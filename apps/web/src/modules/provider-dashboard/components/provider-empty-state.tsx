'use client';

import { motion } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProviderRequestsEmptyStateProps {
  filtered?: boolean;
  onClearFilter?: () => void;
}

export function ProviderRequestsEmptyState({
  filtered = false,
  onClearFilter,
}: ProviderRequestsEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card/40 px-6 py-16 text-center"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <ClipboardList className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold">
        {filtered ? 'No requests match this filter' : 'No assigned requests'}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {filtered
          ? 'Try a different status or clear the filter to see all jobs.'
          : 'Go online and set availability to available to receive breakdown jobs in your area.'}
      </p>
      {filtered && onClearFilter && (
        <Button variant="outline" className="mt-6" onClick={onClearFilter}>
          Clear filter
        </Button>
      )}
    </motion.div>
  );
}
