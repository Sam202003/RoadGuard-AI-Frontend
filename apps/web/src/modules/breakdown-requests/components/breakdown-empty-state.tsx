'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Wrench } from 'lucide-react';
import { routes } from '@roadguard/config';
import { Button } from '@/components/ui/button';

interface BreakdownEmptyStateProps {
  filtered?: boolean;
  onClearFilter?: () => void;
}

export function BreakdownEmptyState({ filtered = false, onClearFilter }: BreakdownEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card/40 px-6 py-16 text-center"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Wrench className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold">
        {filtered ? 'No requests match this filter' : 'No breakdown requests yet'}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {filtered
          ? 'Try a different status or clear the filter to see all requests.'
          : 'Request roadside assistance when you need help. We will find the nearest provider for you.'}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {filtered && onClearFilter && (
          <Button variant="outline" onClick={onClearFilter}>
            Clear filter
          </Button>
        )}
        {!filtered && (
          <Button asChild className="gap-2">
            <Link href={routes.customer.breakdownNew}>
              <Plus className="h-4 w-4" />
              New request
            </Link>
          </Button>
        )}
      </div>
    </motion.div>
  );
}
