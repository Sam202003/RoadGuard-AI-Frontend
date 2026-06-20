import { NextResponse, type NextRequest } from 'next/server';
import { UserRole } from '@roadguard/types';
import {
  SESSION_COOKIE_NAME,
  createSessionToken,
  sessionCookieOptions,
} from '@/lib/session-cookie';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api/v1';

interface MeResponse {
  user: {
    id: string;
    role: UserRole;
  };
}

async function verifyAccessToken(accessToken: string): Promise<MeResponse['user'] | null> {
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const body = (await response.json()) as { data?: { user?: MeResponse['user'] } };
    return body.data?.user ?? null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let accessToken: string | undefined;

  try {
    const body = (await request.json()) as { accessToken?: string };
    accessToken = body.accessToken;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!accessToken) {
    return NextResponse.json({ error: 'accessToken is required' }, { status: 400 });
  }

  const user = await verifyAccessToken(accessToken);
  if (!user) {
    return NextResponse.json({ error: 'Invalid or expired access token' }, { status: 401 });
  }

  const token = await createSessionToken({ sub: user.id, role: user.role });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions());
  return response;
}

export async function DELETE(): Promise<NextResponse> {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    ...sessionCookieOptions(),
    maxAge: 0,
  });
  return response;
}
