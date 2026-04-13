// /src/app/api/auth/social/[provider]/route.ts
// Initiates OAuth flow — redirects user to Google or GitHub consent page

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const PROVIDERS = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    clientId: process.env.GOOGLE_CLIENT_ID ?? '',
    scope: 'openid email profile',
  },
  github: {
    authUrl: 'https://github.com/login/oauth/authorize',
    clientId: process.env.GH_CLIENT_ID ?? '',
    scope: 'read:user user:email',
  },
} as const;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  const mode =
    request.nextUrl.searchParams.get('mode') === 'signup' ? 'signup' : 'signin';

  const config = PROVIDERS[provider as keyof typeof PROVIDERS];
  if (!config || !config.clientId) {
    return NextResponse.redirect(new URL('/login?error=invalid_provider', request.url));
  }

  // CSRF state: encode mode so the callback knows which flow to run
  const state = `${mode}:${crypto.randomUUID()}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
  const callbackUrl = `${appUrl}/api/auth/social/${provider}/callback`;

  const authParams = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: callbackUrl,
    scope: config.scope,
    state,
    response_type: 'code',
  });

  if (provider === 'google') {
    authParams.set('access_type', 'online');
    authParams.set('prompt', 'select_account');
  }

  const cookieStore = await cookies();
  cookieStore.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  });

  return NextResponse.redirect(`${config.authUrl}?${authParams.toString()}`);
}
