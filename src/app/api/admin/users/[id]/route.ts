// /src/app/api/admin/users/[id]/route.ts
// Admin-only: delete or suspend/unsuspend a user

import { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { deleteUserAccount } from '@/lib/db/queries/users'
import { sql } from '@/lib/db/index'

interface RouteParams {
  params: Promise<{ id: string }>
}

// ─── Guard helper ───────────────────────────────────────────────────────────
async function requireAdmin() {
  const session = await getSession()
  if (!session?.userId) return null
  if (!session.roles?.includes('admin') && session.primaryRole !== 'admin') return null
  return session
}

// ─── DELETE  /api/admin/users/[id]  →  hard-delete user ────────────────────
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const admin = await requireAdmin()
  if (!admin) {
    return Response.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params

  // Prevent admin from deleting themselves
  if (id === admin.userId) {
    return Response.json(
      { success: false, message: 'You cannot delete your own account from here.' },
      { status: 400 }
    )
  }

  const result = await deleteUserAccount(id)
  if (result.success) {
    return Response.json({ success: true, message: 'User deleted successfully.' })
  }
  return Response.json(
    { success: false, message: result.error || 'Failed to delete user.' },
    { status: 500 }
  )
}

// ─── PATCH  /api/admin/users/[id]  →  suspend or unsuspend user ─────────────
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const admin = await requireAdmin()
  if (!admin) {
    return Response.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = (await req.json()) as { action: 'suspend' | 'unsuspend' }

  if (body.action !== 'suspend' && body.action !== 'unsuspend') {
    return Response.json({ success: false, message: 'Invalid action.' }, { status: 400 })
  }

  const isActive = body.action === 'unsuspend'

  try {
    await sql`UPDATE users SET is_active = ${isActive}, updated_at = NOW() WHERE id = ${id}`
    return Response.json({
      success: true,
      message: isActive ? 'User unsuspended.' : 'User suspended.',
    })
  } catch (error) {
    console.error('[ADMIN] Suspend/unsuspend error:', error)
    return Response.json({ success: false, message: 'Database error.' }, { status: 500 })
  }
}
