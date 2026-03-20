// src/app/api/certificates/verify/route.ts
// Public endpoint — no auth required.
// GET /api/certificates/verify?code=AXQ-XXXXXX

import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')?.trim().toUpperCase()

  if (!code) {
    return NextResponse.json({ success: false, error: 'Certificate code is required.' }, { status: 400 })
  }

  // Basic format check — AXQ- prefix
  if (!code.startsWith('AXQ-') || code.length < 8) {
    return NextResponse.json({
      success: false,
      error: 'Invalid certificate code format. Codes begin with AXQ- followed by letters and numbers.',
    }, { status: 400 })
  }

  try {
    // Fetch certificate + student name + course title
    const rows = await sql`
      SELECT
        cert.id,
        cert.certificate_code,
        cert.issued_at,
        cert.final_grade,
        cert.overall_score,
        cert.is_revoked,
        cert.revoked_reason,
        cert.certificate_data,
        cert.course_id,
        cert.user_id,
        u.name  AS student_name,
        co.title AS course_title
      FROM certificates cert
      LEFT JOIN users   u  ON cert.user_id   = u.id
      LEFT JOIN courses co ON cert.course_id = co.id
      WHERE cert.certificate_code = ${code}
      LIMIT 1
    `

    if (!rows || rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No certificate found with that code. Please check the code and try again.',
      }, { status: 404 })
    }

    const cert = rows[0]

    if (cert.is_revoked) {
      return NextResponse.json({
        success: false,
        revoked: true,
        error: 'This certificate has been revoked.',
        revokedReason: cert.revoked_reason || 'No reason provided.',
      }, { status: 200 })
    }

    // Resolve names — prefer live DB values over stored JSONB
    const data = cert.certificate_data ?? {}
    const studentName  = u_name(cert.student_name)  || data.student_name  || 'Student'
    const courseTitle  = cert.course_title           || data.course_title  || 'Course'
    const overallScore = parseFloat(cert.overall_score) || 0
    const finalGrade   = cert.final_grade || gradeFromScore(overallScore)
    const issuedAt     = cert.issued_at
      ? new Date(cert.issued_at).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric',
        })
      : 'Unknown'

    return NextResponse.json({
      success: true,
      certificate: {
        code:         cert.certificate_code,
        studentName,
        courseTitle,
        overallScore,
        finalGrade,
        issuedAt,
        courseId:     cert.course_id,
        studentId:    cert.user_id,
        assessmentId: data.assessment_id ?? null,
        issuedBy:     data.issued_by ?? null,
      },
    })

  } catch (err) {
    console.error('[verify] DB error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}

// ── helpers ────────────────────────────────────────────────────────────────────

function u_name(v: any): string {
  return typeof v === 'string' ? v : ''
}

function gradeFromScore(score: number): string {
  if (score >= 90) return 'DISTINCTION'
  if (score >= 80) return 'MERIT'
  if (score >= 70) return 'PASS'
  return 'FAIL'
}
