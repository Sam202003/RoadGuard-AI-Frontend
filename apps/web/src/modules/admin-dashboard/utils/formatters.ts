export function formatShortId(id: string): string {
  if (id.length <= 8) return id;
  return `…${id.slice(-6)}`;
}

export function formatAdminDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatRelativeTime(value: string): string {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatCoordinates(coords?: { coordinates: [number, number] } | null): string {
  if (!coords?.coordinates) return '—';
  const [lng, lat] = coords.coordinates;
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

export function formatRating(average: number, count: number): string {
  return `${average.toFixed(1)} (${count})`;
}
