'use client';

import { useTheme } from 'next-themes';
import { TileLayer } from 'react-leaflet';
import { getLeafletTileConfig } from '@roadguard/config';

export function MapTileLayerThemed() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const { url, attribution } = getLeafletTileConfig(isDark);

  return <TileLayer attribution={attribution} url={url} />;
}
