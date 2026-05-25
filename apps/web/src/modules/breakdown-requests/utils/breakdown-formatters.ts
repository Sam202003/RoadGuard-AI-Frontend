import { BreakdownStatus } from '../constants/breakdown.enums';
import { statusLabels } from '../constants/breakdown-labels';
import type { BreakdownRequest } from '../types/breakdown.types';

export function isTerminalBreakdownStatus(status: BreakdownStatus): boolean {
  return status === BreakdownStatus.COMPLETED || status === BreakdownStatus.CANCELLED;
}

export function formatRequestDate(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCoordinates(location: BreakdownRequest['location']): string {
  const [lon, lat] = location.coordinates;
  return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
}

export function formatEtaMinutes(minutes?: number | null): string {
  if (minutes == null) return '—';
  if (minutes < 60) return `~${Math.round(minutes)} min`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `~${hours}h ${mins}m` : `~${hours}h`;
}

export function getStatusLabel(status: BreakdownStatus): string {
  return statusLabels[status] ?? status;
}

export function getActiveStepIndex(status: BreakdownStatus, timeline: BreakdownStatus[]): number {
  if (status === BreakdownStatus.CANCELLED) return -1;
  const index = timeline.indexOf(status);
  return index >= 0 ? index : timeline.length - 1;
}
