'use client';

import { BreakdownStatus } from '../constants/breakdown.enums';
import { isTerminalBreakdownStatus } from '../utils/breakdown-formatters';
import type { BreakdownRequest } from '../types/breakdown.types';

const POLL_INTERVAL_MS = 10_000;

export function getBreakdownPollingInterval(request?: BreakdownRequest): number {
  if (!request) return 0;
  if (isTerminalBreakdownStatus(request.status)) return 0;
  if (request.status === BreakdownStatus.CANCELLED) return 0;
  return POLL_INTERVAL_MS;
}
