import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationEmptyStateProps {
  unreadOnly?: boolean;
  onClearFilters?: () => void;
}

export function NotificationEmptyState({
  unreadOnly,
  onClearFilters,
}: NotificationEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/60 bg-card/40 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Bell className="h-6 w-6 text-muted-foreground" />
      </div>
      <div>
        <p className="font-medium">
          {unreadOnly ? 'No unread notifications' : 'No notifications yet'}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {unreadOnly
            ? 'You are all caught up.'
            : 'Updates about your requests and account will appear here.'}
        </p>
      </div>
      {unreadOnly && onClearFilters && (
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          Show all notifications
        </Button>
      )}
    </div>
  );
}
