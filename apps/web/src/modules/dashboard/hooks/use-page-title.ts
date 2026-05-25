'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import type { PortalNavigation } from '../constants/navigation.types';
import { buildBreadcrumbLabels } from '../constants/navigation.config';

export function usePageTitle(navigation: PortalNavigation): string {
  const pathname = usePathname();
  const labels = useMemo(() => buildBreadcrumbLabels(navigation), [navigation]);

  return labels[pathname] ?? navigation.portalName;
}
