import type { GeoPoint, LatLng } from '../types/tracking.types';

export function geoPointToLatLng(point: GeoPoint): LatLng {
  const [lng, lat] = point.coordinates;
  return { lat, lng };
}

export function latLngToGeoPoint(latLng: LatLng): GeoPoint {
  return {
    type: 'Point',
    coordinates: [latLng.lng, latLng.lat],
  };
}

export function lerpLatLng(from: LatLng, to: LatLng, t: number): LatLng {
  return {
    lat: from.lat + (to.lat - from.lat) * t,
    lng: from.lng + (to.lng - from.lng) * t,
  };
}

export function appendRoutePoint(points: LatLng[], next: LatLng, minMeters = 8): LatLng[] {
  if (points.length === 0) return [next];
  const last = points[points.length - 1];
  const dist = haversineMeters(last, next);
  if (dist < minMeters) return points;
  return [...points, next];
}

function haversineMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function computeMapCenter(
  customer: LatLng | null,
  provider: LatLng | null,
): LatLng {
  if (customer && provider) {
    return {
      lat: (customer.lat + provider.lat) / 2,
      lng: (customer.lng + provider.lng) / 2,
    };
  }
  return customer ?? provider ?? { lat: 19.076, lng: 72.8777 };
}
