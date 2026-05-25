export function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url) {
    return 'http://localhost:3000/api/v1';
  }
  return url.replace(/\/$/, '');
}

/** HTTP origin for Socket.IO (without /api/v1) */
export function getSocketBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const api = getApiBaseUrl();
  return api.replace(/\/api\/v\d+\/?$/, '') || 'http://localhost:3000';
}

export function getSocketPath(): string {
  return process.env.NEXT_PUBLIC_SOCKET_PATH ?? '/socket.io';
}
