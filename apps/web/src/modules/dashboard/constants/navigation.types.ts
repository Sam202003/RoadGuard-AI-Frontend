import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  badge?: string;
}

export interface NavGroup {
  id: string;
  label?: string;
  items: NavItem[];
}

export interface PortalNavigation {
  portalName: string;
  homeHref: string;
  groups: NavGroup[];
}
