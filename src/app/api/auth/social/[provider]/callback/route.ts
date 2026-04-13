// /src/app/api/auth/social/[provider]/callback/route.ts
// Handles OAuth callback — exchanges code, fetches profile, creates session

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { socialSignIn, socialSignUp, OAuthProfile } from '@/lib/auth/oauth-actions';

// ─── Provider profile fetchers ───────────────────────────────────────────────

async function getGoogleProfile(
  code: string,
  callbackUrl: string,
): Promise<OAuthProfile> {
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: callbackUrl,
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenRes.ok) {
    throw new Error(`Google token exchange failed: ${tokenRes.status}`);
  }

  const tokenData = await tokenRes.json();

  const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  if (!userRes.ok) {
    throw new Error(`Google userinfo fetch failed: ${userRes.status}`);
  }

  const user = await userRes.json();

  return {
    provider: 'google',
    providerAccountId: String(user.id),
    email: user.email,
    name: user.name,
    image: user.picture,
    providerData: user,
  };
}

async function getGitHubProfile(
  code: string,
  callbackUrl: string,
): Promise<OAuthProfile> {
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.GH_CLIENT_ID,
      client_secret: process.env.GH_CLIENT_SECRET,
      code,
      redirect_uri: callbackUrl,
    }),
  });

  if (!tokenRes.ok) {
    throw new Error(`GitHub token exchange failed: ${tokenRes.status}`);
  }

  const tokenData = await tokenRes.json();
  const accessToken: string = tokenData.access_token;

  if (!accessToken) {
    throw new Error('GitHub access token missing in response');
  }

  const [userRes, emailsRes] = await Promise.all([
    fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
      },
    }),
    fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
      },
    }),
  ]);

  if (!userRes.ok) throw new Error(`GitHub user fetch failed: ${userRes.status}`);

  const user = await userRes.json();
  const emails: { email: string; primary: boolean; verified: boolean }[] = emailsRes.ok
    ? await emailsRes.json()
    : [];

  const primaryEmail =
    emails.find((e) => e.primary && e.verified)?.email ??
    emails.find((e) => e.verified)?.email ??
    (user.email as string | null) ??
    '';

  return {
    provider: 'github',
    providerAccountId: String(user.id),
    email: primaryEmail,
    name: (user.name as string | null) || (user.login as string),
    image: user.avatar_url,
    providerData: user,
  };
}

// ─── Callback handler ────────────────────────────────────────────────────────

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');

  const cookieStore = await cookies();
  const storedState = cookieStore.get('oauth_state')?.value;

  // ── CSRF validation ──
  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.redirect(
      new URL('/login?error=oauth_state_mismatch', request.url),
    );
  }

  // Clear CSRF state cookie
  cookieStore.delete('oauth_state');

  const mode = storedState.startsWith('signup:') ? 'signup' : 'signin';
  const errorBase = mode === 'signup' ? '/signup' : '/login';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
  const callbackUrl = `${appUrl}/api/auth/social/${provider}/callback`;

  // ── Fetch provider profile ──
  let profile: OAuthProfile;
  try {
    if (provider === 'google') {
      profile = await getGoogleProfile(code, callbackUrl);
    } else if (provider === 'github') {
      profile = await getGitHubProfile(code, callbackUrl);
    } else {
      return NextResponse.redirect(
        new URL('/login?error=invalid_provider', request.url),
      );
    }

    if (!profile.email) {
      return NextResponse.redirect(
        new URL(`${errorBase}?error=no_email`, request.url),
      );
    }
  } catch (err) {
    console.error('❌ OAuth profile fetch error:', err);
    return NextResponse.redirect(
      new URL(`${errorBase}?error=oauth_failed`, request.url),
    );
  }

  // ── Run the appropriate auth action ──
  let result: { success: boolean; error?: string };
  try {
    result = mode === 'signup'
      ? await socialSignUp(profile)
      : await socialSignIn(profile);
  } catch (err) {
    console.error('❌ OAuth action threw unexpectedly:', err);
    return NextResponse.redirect(
      new URL(`${errorBase}?error=server_error`, request.url),
    );
  }

  if (!result.success) {
    console.error(`❌ OAuth ${mode} failed: error=${result.error}, provider=${provider}, email=${profile.email}`);
    return NextResponse.redirect(
      new URL(`${errorBase}?error=${result.error}`, request.url),
    );
  }

  return NextResponse.redirect(new URL('/dashboard', request.url));
}
