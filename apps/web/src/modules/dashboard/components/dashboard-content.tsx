import { cn } from '@/lib/utils';

interface DashboardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardContent({ children, className }: DashboardContentProps) {
  return (
    <div className={cn('mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6 lg:p-8', className)}>
      {children}
    </div>
  );
}
