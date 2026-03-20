

// src/app/api/activity/track/route.ts
// Records a user activity into user_activities table.
// Called fire-and-forget from dashboard layout on every visit.
// Also usable from lesson/quiz/enrollment flows.

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { sql } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const activityType = body.activity_type || 'dashboard_visit';
    const activityData = body.activity_data || {};

    // Upsert-style: only insert once per user per activity_type per day.
    // This prevents hundreds of duplicate dashboard_visit rows on a single day.
    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

    const existing = await sql`
      SELECT id FROM user_activities
      WHERE user_id       = ${session.userId}
        AND activity_type = ${activityType}
        AND created_at::date = ${today}::date
      LIMIT 1
    `;

    if (existing.length === 0) {
      await sql`
        INSERT INTO user_activities (user_id, activity_type, activity_data, created_at)
        VALUES (
          ${session.userId},
          ${activityType},
          ${JSON.stringify(activityData)},
          NOW()
        )
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Never crash the dashboard over a tracking failure
    console.error('❌ Activity track error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

















