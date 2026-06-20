import { isValidUserRole } from '@roadguard/config';
import type { UserRole } from '@roadguard/types';

export const SESSION_COOKIE_NAME = 'rg-session';
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;

export interface SessionPayload {
  sub: string;
  role: UserRole;
  exp: number;
}

function getSessionSecret(): string {
  const secret = process.env.RG_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('RG_SESSION_SECRET must be set (32+ chars) in production');
    }
    return 'dev-session-secret-min-32-characters!!';
  }
  return secret;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (padded.length % 4)) % 4;
  const base64 = padded + '='.repeat(padLen);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

async function signPayload(payloadJson: string, secret: string): Promise<string> {
  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadJson));
  return toBase64Url(new Uint8Array(signature));
}

export async function createSessionToken(
  payload: Omit<SessionPayload, 'exp'>,
): Promise<string> {
  const secret = getSessionSecret();
  const fullPayload: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC,
  };
  const payloadJson = JSON.stringify(fullPayload);
  const payloadB64 = toBase64Url(new TextEncoder().encode(payloadJson));
  const signature = await signPayload(payloadJson, secret);
  return `${payloadB64}.${signature}`;
}

export async function verifySessionToken(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;

  const [payloadB64, signature] = token.split('.');
  if (!payloadB64 || !signature) return null;

  try {
    const secret = getSessionSecret();
    const payloadJson = new TextDecoder().decode(fromBase64Url(payloadB64));
    const key = await importHmacKey(secret);
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      fromBase64Url(signature) as BufferSource,
      new TextEncoder().encode(payloadJson),
    );

    if (!valid) return null;

    const payload = JSON.parse(payloadJson) as SessionPayload;
    if (!payload.sub || !isValidUserRole(payload.role)) return null;
    if (payload.exp <= Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

export function sessionCookieOptions(): {
  httpOnly: true;
  secure: boolean;
  sameSite: 'lax';
  path: string;
  maxAge: number;
} {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SEC,
  };
}
