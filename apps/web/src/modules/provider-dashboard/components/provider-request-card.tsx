'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, MapPin, User } from 'lucide-react';
import { getProviderRequestDetailPath } from '@roadguard/config';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  PriorityBadge,
  StatusBadge,
} from '@/modules/breakdown-requests/components/status-badge';
import { issueTypeLabels } from '@/modules/breakdown-requests/constants/breakdown-labels';
import {
  formatEtaMinutes,
  formatRequestDate,
} from '@/modules/breakdown-requests/utils/breakdown-formatters';
import type { BreakdownRequest } from '@/modules/breakdown-requests/types/breakdown.types';
import { isEmergencyRequest, formatShortId } from '../utils/request-helpers';
import { cn } from '@/lib/utils';

interface ProviderRequestCardProps {
  request: BreakdownRequest;
  onOpenDetail?: (request: BreakdownRequest) => void;
}

export function ProviderRequestCard({ request, onOpenDetail }: ProviderRequestCardProps) {
  const emergency = isEmergencyRequest(request);
  const [lon, lat] = request.location.coordinates;

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card
        className={cn(
          'border-border/60 bg-card/70 p-5 backdrop-blur-sm transition-shadow hover:shadow-md',
          emergency && 'border-destructive/40 ring-1 ring-destructive/20',
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={request.status} />
              <PriorityBadge priority={request.priority} />
              {emergency && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-destructive">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Emergency
                </span>
              )}
            </div>
            <h3 className="font-semibold">{issueTypeLabels[request.issueType]}</h3>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {request.issueDescription}
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                Customer {formatShortId(request.customerId)}
              </span>
              <span className="inline-flex items-center gap-1">
                Vehicle {formatShortId(request.vehicleId)}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {lat.toFixed(4)}, {lon.toFixed(4)}
              </span>
              {request.estimatedArrivalTime != null && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  ETA {formatEtaMinutes(request.estimatedArrivalTime)}
                  {request.estimatedDistance != null && ` · ${request.estimatedDistance} km`}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatRequestDate(request.requestedAt)}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            {onOpenDetail && (
              <Button variant="outline" size="sm" onClick={() => onOpenDetail(request)}>
                Quick view
              </Button>
            )}
            <Button size="sm" asChild>
              <Link href={getProviderRequestDetailPath(request.id)}>Open</Link>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
