import { Activity, AlertTriangle, ClipboardList, Wrench } from 'lucide-react';
import type { AdminActivityItem } from '../types/admin.types';
import { formatRelativeTime } from '../utils/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const activityIcons: Record<AdminActivityItem['type'], typeof Activity> = {
  request: ClipboardList,
  user: Activity,
  provider: Wrench,
  emergency: AlertTriangle,
  system: Activity,
};

interface ActivityFeedProps {
  items: AdminActivityItem[];
  isLoading?: boolean;
}

export function ActivityFeed({ items, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <Card className="border-border/60 bg-card/60">
        <CardHeader>
          <CardTitle className="text-base">Recent activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 bg-card/60">
      <CardHeader>
        <CardTitle className="text-base">Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => {
              const Icon = activityIcons[item.type];
              return (
                <li key={item.id} className="flex gap-3">
                  <div
                    className={cn(
                      'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border',
                      item.type === 'emergency'
                        ? 'border-destructive/30 bg-destructive/10 text-destructive'
                        : 'border-border/60 bg-muted/50 text-muted-foreground',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-tight">{item.title}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatRelativeTime(item.timestamp)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
