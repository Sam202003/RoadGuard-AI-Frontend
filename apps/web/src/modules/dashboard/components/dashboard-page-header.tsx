interface DashboardPageHeaderProps {
  title: string;
  description?: string;
}

export function DashboardPageHeader({ title, description }: DashboardPageHeaderProps) {
  return (
    <div className="space-y-1">
      <h1 className="hidden text-2xl font-bold tracking-tight md:block">{title}</h1>
      {description && (
        <p className="text-sm text-muted-foreground md:text-base">{description}</p>
      )}
    </div>
  );
}
