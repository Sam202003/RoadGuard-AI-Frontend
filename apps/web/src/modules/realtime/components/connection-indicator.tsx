import { cn } from '@/lib/utils';
import type { SocketConnectionState } from '../types/tracking.types';

const labels: Record<SocketConnectionState, string> = {
  CONNECTING: 'Connecting…',
  CONNECTED: 'Live',
  RECONNECTING: 'Reconnecting…',
  DISCONNECTED: 'Offline',
};

const dotClass: Record<SocketConnectionState, string> = {
  CONNECTING: 'bg-amber-500 animate-pulse',
  CONNECTED: 'bg-emerald-500',
  RECONNECTING: 'bg-amber-500 animate-pulse',
  DISCONNECTED: 'bg-muted-foreground',
};

interface ConnectionIndicatorProps {
  state: SocketConnectionState;
  className?: string;
}

export function ConnectionIndicator({ state, className }: ConnectionIndicatorProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/90 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur',
        className,
      )}
    >
      <span className={cn('h-2 w-2 rounded-full', dotClass[state])} />
      {labels[state]}
    </div>
  );
}
