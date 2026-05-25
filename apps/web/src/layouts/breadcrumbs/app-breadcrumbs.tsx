'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { Fragment, useMemo } from 'react';

interface AppBreadcrumbsProps {
  labels: Record<string, string>;
  homeHref: string;
}

export function AppBreadcrumbs({ labels, homeHref }: AppBreadcrumbsProps) {
  const pathname = usePathname();

  const segments = useMemo(() => {
    const parts = pathname.split('/').filter(Boolean);
    const crumbs: { href: string; label: string }[] = [];
    let path = '';

    for (const part of parts) {
      path += `/${part}`;
      const label = labels[path] ?? part.charAt(0).toUpperCase() + part.slice(1);
      crumbs.push({ href: path, label });
    }

    return crumbs;
  }, [pathname, labels]);

  if (segments.length <= 1) {
    return (
      <nav aria-label="Breadcrumb" className="flex items-center text-sm text-muted-foreground">
        <Link href={homeHref} className="flex items-center gap-1 hover:text-foreground">
          <Home className="h-3.5 w-3.5" />
          <span>{labels[homeHref] ?? 'Dashboard'}</span>
        </Link>
      </nav>
    );
  }

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm">
      <Link
        href={homeHref}
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {segments.map((crumb, index) => {
        const isLast = index === segments.length - 1;
        return (
          <Fragment key={crumb.href}>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            {isLast ? (
              <span className="font-medium text-foreground">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {crumb.label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
