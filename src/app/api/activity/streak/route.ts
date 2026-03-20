

// src/app/api/activity/streak/route.ts
// Returns the current consecutive-day streak for the logged-in user.
// Counts distinct calendar days with ANY activity, walking backwards from today.

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Get all distinct active dates for this user, newest first
    // Only count activity types that are meaningful for streak
    const rows = await sql`
      SELECT DISTINCT created_at::date AS active_date
      FROM user_activities
      WHERE user_id = ${session.userId}
        AND activity_type IN (
          'dashboard_visit',
          'lesson_completed',
          'quiz_submitted',
          'course_enrolled'
        )
      ORDER BY active_date DESC
    `;

    if (rows.length === 0) {
      return NextResponse.json({
        success:    true,
        streak:     0,
        lastActive: null,
      });
    }

    // Walk backwards from today counting consecutive days
    const today     = new Date();
    today.setHours(0, 0, 0, 0);

    const activeDates = rows.map((r: any) => {
      const d = new Date(r.active_date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    });

    // If the user hasn't been active today OR yesterday, streak is broken
    const oneDayMs   = 86400 * 1000;
    const yesterday  = today.getTime() - oneDayMs;
    const mostRecent = activeDates[0];

    // Streak is 0 if last activity was more than 1 day ago
    if (mostRecent < yesterday) {
      return NextResponse.json({
        success:    true,
        streak:     0,
        lastActive: rows[0].active_date,
      });
    }

    // Count consecutive days walking backwards
    let streak    = 1;
    let expected  = mostRecent - oneDayMs;

    for (let i = 1; i < activeDates.length; i++) {
      if (activeDates[i] === expected) {
        streak++;
        expected -= oneDayMs;
      } else if (activeDates[i] < expected) {
        // Gap found — stop counting
        break;
      }
      // activeDates[i] > expected means duplicate date — skip
    }

    return NextResponse.json({
      success:    true,
      streak,
      lastActive: rows[0].active_date,
    });

  } catch (error: any) {
    console.error('❌ Streak calculation error:', error);
    return NextResponse.json({ success: false, streak: 0 }, { status: 500 });
  }
}
