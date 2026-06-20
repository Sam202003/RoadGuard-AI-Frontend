import { type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface AdminStatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  variant?: 'default' | 'warning' | 'success';
  isLoading?: boolean;
}

const variantStyles = {
  default: 'text-foreground',
  warning: 'text-amber-600 dark:text-amber-400',
  success: 'text-primary',
};

export function AdminStatCard({
  label,
  value,
  icon: Icon,
  description,
  variant = 'default',
  isLoading,
}: AdminStatCardProps) {
  if (isLoading) {
    return (
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
        <CardContent className="p-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-8 w-16" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-sm transition-colors hover:bg-card/80">
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className={cn('mt-2 text-3xl font-bold tabular-nums', variantStyles[variant])}>
          {value}
        </p>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}
