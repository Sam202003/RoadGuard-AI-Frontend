'use client';

import { memo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, MapPin } from 'lucide-react';
import { getCustomerBreakdownDetailPath } from '@roadguard/config';
import { Card } from '@/components/ui/card';
import { issueTypeLabels } from '../constants/breakdown-labels';
import { RequestPriority } from '../constants/breakdown.enums';
import { formatCoordinates, formatRequestDate } from '../utils/breakdown-formatters';
import type { BreakdownRequest } from '../types/breakdown.types';
import { PriorityBadge, StatusBadge } from './status-badge';

interface BreakdownRequestCardProps {
  request: BreakdownRequest;
}

export const BreakdownRequestCard = memo(function BreakdownRequestCard({
  request,
}: BreakdownRequestCardProps) {
  const isEmergency = request.priority === RequestPriority.EMERGENCY;

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Link href={getCustomerBreakdownDetailPath(request.id)}>
        <Card
          className={`group p-5 transition-shadow hover:shadow-md ${
            isEmergency
              ? 'border-destructive/40 bg-destructive/5 ring-1 ring-destructive/20'
              : 'border-border/60 bg-card/70'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={request.status} />
                <PriorityBadge priority={request.priority} />
              </div>
              <p className="font-semibold">{issueTypeLabels[request.issueType]}</p>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {request.issueDescription}
              </p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {formatCoordinates(request.location)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatRequestDate(request.requestedAt)}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </div>
        </Card>
      </Link>
    </motion.div>
  );
});
