
// src/app/api/messaging/users/route.ts
// Returns all axioquan users available to message
// Queries the axioquan NeonDB directly — Option A
// Excludes the current user from results
// Supports search by name, email, username

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.trim() ?? ''

    // Query users from axioquan database
    // Excludes current user, only active users
    const users = search
      ? await sql`
          SELECT
            u.id,
            u.name,
            u.email,
            u.username,
            u.image,
            r.name AS primary_role
          FROM users u
          LEFT JOIN user_roles ur ON ur.user_id = u.id AND ur.is_primary = true
          LEFT JOIN roles r ON r.id = ur.role_id
          WHERE u.is_active = true
            AND u.id != ${session.userId}
            AND (
              u.name     ILIKE ${'%' + search + '%'} OR
              u.email    ILIKE ${'%' + search + '%'} OR
              u.username ILIKE ${'%' + search + '%'}
            )
          ORDER BY u.name ASC
          LIMIT 20
        `
      : await sql`
          SELECT
            u.id,
            u.name,
            u.email,
            u.username,
            u.image,
            r.name AS primary_role
          FROM users u
          LEFT JOIN user_roles ur ON ur.user_id = u.id AND ur.is_primary = true
          LEFT JOIN roles r ON r.id = ur.role_id
          WHERE u.is_active = true
            AND u.id != ${session.userId}
          ORDER BY u.name ASC
          LIMIT 30
        `

    return NextResponse.json({ success: true, data: users })
  } catch (error) {
    console.error('❌ Failed to fetch messaging users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}