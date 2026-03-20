
// /src/app/api/certificates/route.ts
//
// GET /api/certificates
// Returns all certificates for courses owned by the logged-in instructor,
// plus aggregate stats. Used by InstructorCertificatesPage.

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // ── 1. Fetch all non-revoked certificates for this instructor's courses ──
    const certificates = await sql`
      SELECT
        cert.id,
        cert.user_id,
        cert.course_id,
        cert.certificate_code,
        cert.issued_at,
        cert.final_grade,
        cert.overall_score,
        cert.is_revoked,

        -- Pull assessment_id out of certificate_data JSONB if present
        cert.certificate_data->>'assessment_id'  AS assessment_id,

        -- Student info
        u.name   AS student_name,
        u.email  AS student_email,

        -- Course info
        c.title  AS course_title,

        -- Instructor info (for display)
        inst.name AS instructor_name

      FROM certificates cert
      JOIN users    u    ON u.id    = cert.user_id
      JOIN courses  c    ON c.id    = cert.course_id
      JOIN users    inst ON inst.id = c.instructor_id

      WHERE c.instructor_id = ${session.userId}
        AND cert.is_revoked  = false

      ORDER BY cert.issued_at DESC
    `;

    // ── 2. Aggregate stats ────────────────────────────────────────────────────
    const statsRow = await sql`
      SELECT
        COUNT(*)                                        AS total_issued,
        COUNT(DISTINCT cert.user_id)                    AS unique_students,
        COUNT(DISTINCT cert.course_id)                  AS courses_with_certs,
        COALESCE(AVG(cert.overall_score::numeric), 0)   AS avg_score
      FROM certificates cert
      JOIN courses c ON c.id = cert.course_id
      WHERE c.instructor_id = ${session.userId}
        AND cert.is_revoked  = false
    `;

    const raw = statsRow[0] ?? {};

    const stats = {
      total_issued:       parseInt(raw.total_issued)       || 0,
      unique_students:    parseInt(raw.unique_students)    || 0,
      courses_with_certs: parseInt(raw.courses_with_certs) || 0,
      avg_score:          parseFloat(raw.avg_score)        || 0,
    };

    return NextResponse.json({
      success:      true,
      certificates: certificates ?? [],
      total:        stats.total_issued,
      stats,
    });

  } catch (error: any) {
    console.error('❌ GET /api/certificates error:', error);
    return NextResponse.json(
      { success: false, error: error.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}