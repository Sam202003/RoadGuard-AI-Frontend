export type MapProvider = 'leaflet' | 'google';

export function getMapProvider(): MapProvider {
  const value = process.env.NEXT_PUBLIC_MAP_PROVIDER?.toLowerCase();
  if (value === 'google' && getGoogleMapsApiKey()) return 'google';
  return 'leaflet';
}

export function getGoogleMapsApiKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  return key || undefined;
}

export interface MapTileConfig {
  url: string;
  attribution: string;
}

/** Carto/OSM tiles — light and dark variants for Leaflet */
export function getLeafletTileConfig(isDark: boolean): MapTileConfig {
  if (isDark) {
    return {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    };
  }
  return {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  };
}
