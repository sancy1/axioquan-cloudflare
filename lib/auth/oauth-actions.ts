// /lib/auth/oauth-actions.ts
// Server-side OAuth DB operations — sign-in / sign-up via social providers

'use server';

import { sql } from '@/lib/db';
import { createSession } from './session';

export interface OAuthProfile {
  provider: 'google' | 'github';
  providerAccountId: string;
  email: string;
  name: string;
  image?: string;
  providerData: Record<string, unknown>;
}

// ─── Internal helpers ────────────────────────────────────────────────────────

async function findUserByEmail(email: string) {
  const rows = await sql`
    SELECT
      u.*,
      ARRAY_AGG(r.name) FILTER (WHERE r.name IS NOT NULL) AS roles,
      (
        SELECT r2.name
        FROM user_roles ur2
        JOIN roles r2 ON ur2.role_id = r2.id
        WHERE ur2.user_id = u.id AND ur2.is_primary = true
        LIMIT 1
      ) AS primary_role
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
    WHERE u.email = ${email} AND u.is_active = true
    GROUP BY u.id
    LIMIT 1
  `;
  return (rows[0] as any) ?? null;
}

async function ensureUniqueUsername(base: string): Promise<string> {
  let candidate = base;
  let attempt = 0;
  while (true) {
    const existing = await sql`SELECT id FROM users WHERE username = ${candidate} LIMIT 1`;
    if (existing.length === 0) return candidate;
    attempt++;
    candidate = `${base}${attempt}`;
  }
}

async function upsertOAuthAccount(
  profile: OAuthProfile,
  userId: string,
) {
  // accounts table is the real underlying table (oauth_users is just a view)
  const existing = await sql`
    SELECT id FROM accounts
    WHERE provider = ${profile.provider}
      AND provider_account_id = ${profile.providerAccountId}
    LIMIT 1
  `;

  if (existing.length > 0) {
    await sql`
      UPDATE accounts SET
        user_id      = ${userId},
        provider_data = ${JSON.stringify(profile.providerData)},
        updated_at   = NOW()
      WHERE provider = ${profile.provider}
        AND provider_account_id = ${profile.providerAccountId}
    `;
  } else {
    await sql`
      INSERT INTO accounts (
        id, user_id, type,
        provider, provider_account_id,
        provider_data, created_at, updated_at
      )
      VALUES (
        gen_random_uuid(), ${userId}, 'oauth',
        ${profile.provider}, ${profile.providerAccountId},
        ${JSON.stringify(profile.providerData)}, NOW(), NOW()
      )
    `;
  }
}

async function syncProfileImage(
  userId: string,
  existingImage: string | null,
  providerImage: string | undefined,
) {
  if (!providerImage || existingImage) return;
  await sql`UPDATE users SET image = ${providerImage}, updated_at = NOW() WHERE id = ${userId}`;
  await sql`
    UPDATE user_profiles
    SET profile_image = ${providerImage}, updated_at = NOW()
    WHERE user_id = ${userId} AND (profile_image IS NULL OR profile_image = '')
  `;
}

// ─── Public actions ──────────────────────────────────────────────────────────

/**
 * Sign in with a social provider.
 * The user MUST already have an account (matched by email).
 * If not found → returns error 'no_account' so the UI can tell them to sign up first.
 */
export async function socialSignIn(profile: OAuthProfile): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const user = await findUserByEmail(profile.email);
    if (!user) return { success: false, error: 'no_account' };

    await upsertOAuthAccount(profile, user.id);
    await syncProfileImage(user.id, user.image, profile.image);
    await sql`UPDATE users SET last_login = NOW() WHERE id = ${user.id}`;

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      image: user.image || profile.image,
      roles: (user.roles as string[])?.filter(Boolean) ?? ['student'],
      primaryRole: (user.primary_role as string) ?? 'student',
    });

    return { success: true };
  } catch (error: any) {
    console.error('❌ socialSignIn error:', error);
    return { success: false, error: 'server_error' };
  }
}

/**
 * Sign up with a social provider.
 * If the email already exists → auto sign in and link the social account.
 * If the email is new → create the user, assign student role, create profile, then sign in.
 */
export async function socialSignUp(profile: OAuthProfile): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Already registered → just link and sign in
    const existing = await findUserByEmail(profile.email);
    if (existing) {
      await upsertOAuthAccount(profile, existing.id);
      await syncProfileImage(existing.id, existing.image, profile.image);
      await sql`UPDATE users SET last_login = NOW() WHERE id = ${existing.id}`;

      await createSession({
        userId: existing.id,
        email: existing.email,
        name: existing.name,
        image: existing.image || profile.image,
        roles: (existing.roles as string[])?.filter(Boolean) ?? ['student'],
        primaryRole: (existing.primary_role as string) ?? 'student',
      });
      return { success: true };
    }

    // New user
    const baseUsername = profile.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20) || profile.email.split('@')[0].substring(0, 20);
    const username = await ensureUniqueUsername(baseUsername);

    const newUserRows = await sql`
      INSERT INTO users (username, email, password, name, image)
      VALUES (${username}, ${profile.email}, NULL, ${profile.name}, ${profile.image ?? null})
      RETURNING id, username, email, name, image, is_active, locale, timezone
    `;
    const newUser = newUserRows[0] as any;
    if (!newUser) throw new Error('User creation failed');

    const roleRows = await sql`SELECT id FROM roles WHERE name = 'student' LIMIT 1`;
    if (roleRows.length === 0) throw new Error('Role "student" not found');

    await sql`
      INSERT INTO user_roles (user_id, role_id, is_primary, assigned_at)
      VALUES (${newUser.id}, ${roleRows[0].id}, true, NOW())
    `;

    await sql`
      INSERT INTO user_profiles (
        user_id, display_name, profile_image,
        skills, portfolio_urls, learning_goals, preferred_topics,
        expertise_levels, achievements, social_links
      )
      VALUES (
        ${newUser.id}, ${profile.name}, ${profile.image ?? null},
        ARRAY[]::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY[]::text[],
        '{}'::jsonb, '{}'::jsonb, '{}'::jsonb
      )
    `;

    await upsertOAuthAccount(profile, newUser.id);

    await createSession({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      image: newUser.image,
      roles: ['student'],
      primaryRole: 'student',
    });

    return { success: true };
  } catch (error: any) {
    console.error('❌ socialSignUp error:', error);
    return { success: false, error: 'server_error' };
  }
}
