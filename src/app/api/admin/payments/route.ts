// /src/app/api/admin/payments/route.ts
// Admin-only: delete a payment record AND fully cascade-delete the enrollment

import { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { sql } from '@/lib/db/index'
import { cascadeDeleteForCourse } from '@/lib/db/queries/users'

interface DeletePaymentBody {
  userId: string
  courseId: string
}

async function requireAdmin() {
  const session = await getSession()
  if (!session?.userId) return null
  if (!session.roles?.includes('admin') && session.primaryRole !== 'admin') return null
  return session
}

// ─── DELETE  /api/admin/payments  →  remove payment + full cascade ──────────
export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) {
    return Response.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  const body = (await req.json()) as DeletePaymentBody
  const { userId, courseId } = body

  if (!userId || !courseId) {
    return Response.json(
      { success: false, message: 'userId and courseId are required.' },
      { status: 400 }
    )
  }

  try {
    // 1. Delete the payment record first (no FK deps on it from enrollment side)
    await sql`DELETE FROM payments WHERE user_id = ${userId} AND course_id = ${courseId}`

    // 2. Full cascade: wipes assessment_results, assessment_attempts,
    //    review_reactions, review_replies, course_reviews, user_progress,
    //    certificates, course_likes, course_shares, then finally enrollments.
    await cascadeDeleteForCourse(userId, courseId)

    return Response.json({ success: true, message: 'Payment and all enrollment data removed.' })
  } catch (error) {
    console.error('[ADMIN] Delete payment error:', error)
    return Response.json({ success: false, message: 'Database error.' }, { status: 500 })
  }
}
