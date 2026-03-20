// src/app/api/certificates/summary/route.ts
//
// GET /api/certificates/summary?assessment_id=XXX
//
// Returns real counts from the certificates table for a given assessment.
// Used by the quiz analytics page to show accurate issued/eligible counts
// that survive page refresh (since the analytics API doesn't query certs).
//
// Response shape:
// {
//   success: true,
//   issuedCount: number,           // total non-revoked certs for this assessment
//   issuedStudentIds: string[],    // user_ids that already have a cert
// }

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('assessment_id');

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'assessment_id query param is required' },
        { status: 400 }
      );
    }

    // Query certificates table directly — check certificate_data->>'assessment_id'
    const rows = await sql`
      SELECT user_id
      FROM certificates
      WHERE certificate_data->>'assessment_id' = ${assessmentId}
        AND is_revoked = false
    `;

    const issuedStudentIds = rows.map((r: { user_id: string }) => r.user_id);

    return NextResponse.json({
      success: true,
      issuedCount: issuedStudentIds.length,
      issuedStudentIds,
    });
  } catch (error) {
    console.error('[GET /api/certificates/summary]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}