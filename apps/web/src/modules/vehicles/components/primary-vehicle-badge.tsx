import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PrimaryVehicleBadgeProps {
  className?: string;
}

export function PrimaryVehicleBadge({ className }: PrimaryVehicleBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'gap-1 border-primary/20 bg-primary/10 text-primary hover:bg-primary/10',
        className,
      )}
    >
      <Star className="h-3 w-3 fill-current" />
      Primary
    </Badge>
  );
}
