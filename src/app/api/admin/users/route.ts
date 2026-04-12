// /src/app/api/admin/users/route.ts
// Admin-only: list all users with their roles and payment counts

import { getSession } from '@/lib/auth/session'
import { sql } from '@/lib/db/index'

async function requireAdmin() {
  const session = await getSession()
  if (!session?.userId) return null
  if (!session.roles?.includes('admin') && session.primaryRole !== 'admin') return null
  return session
}

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) {
    return Response.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    // Users with their roles and payment records
    const users = await sql`
      SELECT
        u.id,
        u.username,
        u.email,
        u.name,
        u.image,
        u.is_active,
        u.last_login,
        u.created_at,
        COALESCE(
          ARRAY_AGG(DISTINCT r.name) FILTER (WHERE r.name IS NOT NULL),
          '{}'
        ) AS roles,
        COALESCE(
          JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'paymentId',  p.id,
              'courseId',   p.course_id,
              'courseTitle', c.title,
              'status',     p.status,
              'amount',     p.amount_cents,
              'paidAt',     p.paid_at
            )
          ) FILTER (WHERE p.id IS NOT NULL),
          '[]'
        ) AS payments
      FROM users u
      LEFT JOIN user_roles ur ON ur.user_id = u.id
      LEFT JOIN roles r        ON r.id = ur.role_id
      LEFT JOIN payments p     ON p.user_id = u.id
      LEFT JOIN courses c      ON c.id = p.course_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `

    return Response.json({ success: true, users })
  } catch (error) {
    console.error('[ADMIN] List users error:', error)
    return Response.json({ success: false, message: 'Database error.' }, { status: 500 })
  }
}
