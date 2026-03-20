
// src/app/api/achievements/route.ts
// GET /api/achievements
// Returns the authenticated student's earned achievements with full details.
// Also supports ?unseen=true to fetch only unseen achievements (for notifications).
// Marks achievements as seen when fetched normally.

import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { sql } from '@/lib/db/index';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only students have achievements
    if (session.primaryRole !== 'student') {
      return Response.json({ achievements: [], total: 0 });
    }

    const { searchParams } = new URL(request.url);
    const unseenOnly = searchParams.get('unseen') === 'true';

    // Fetch user's earned achievements joined with achievement definitions
    const rows = await sql`
      SELECT
        ua.id,
        ua.achievement_id,
        ua.earned_at,
        ua.xp_earned,
        ua.is_seen,
        ua.progress_data,
        ua.progress_percentage,
        a.name,
        a.description,
        a.icon_url,
        a.badge_type,
        a.difficulty,
        a.category,
        a.xp_reward,
        a.is_secret,
        a.sort_order
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.id
      WHERE ua.user_id = ${session.userId}
        AND a.is_active = true
        ${unseenOnly ? sql`AND ua.is_seen = false` : sql``}
      ORDER BY ua.earned_at DESC
    `;

    // Map to clean shape
    const achievements = rows.map((r: any) => ({
      id:                   r.id,
      achievement_id:       r.achievement_id,
      name:                 r.name,
      description:          r.description,
      icon:                 r.icon_url ?? iconForBadgeType(r.badge_type, r.category),
      badge_type:           r.badge_type,
      badge_color:          colorForBadgeType(r.badge_type),
      difficulty:           r.difficulty,
      category:             r.category,
      xp_earned:            r.xp_earned ?? r.xp_reward ?? 10,
      earned_at:            r.earned_at,
      is_seen:              r.is_seen ?? false,
      progress_percentage:  r.progress_percentage ?? 100,
    }))

    // Mark fetched achievements as seen (unless ?unseen=true — caller handles that)
    if (!unseenOnly && rows.length > 0) {
      const ids = rows.map((r: any) => r.id)
      sql`
        UPDATE user_achievements
        SET is_seen = true
        WHERE user_id = ${session.userId}
          AND id = ANY(${ids}::uuid[])
          AND is_seen = false
      `.catch(() => {}) // non-blocking
    }

    const totalXp = achievements.reduce((sum: number, a: any) => sum + (a.xp_earned ?? 0), 0)

    return Response.json({
      success:      true,
      achievements,
      total:        achievements.length,
      totalXp,
      unseen:       achievements.filter((a: any) => !a.is_seen).length,
    });
  } catch (error: any) {
    console.error('❌ Error fetching achievements:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function iconForBadgeType(badgeType: string, category: string): string {
  if (category === 'certificates') return '🎓'
  if (category === 'quizzes') {
    if (badgeType === 'gold') return '🏆'
    if (badgeType === 'silver') return '⭐'
    return '✅'
  }
  if (category === 'persistence') return '💪'
  if (category === 'enrollment')  return '📚'
  if (category === 'completion')  return '🎯'
  if (category === 'streaks')     return '🔥'
  return '🏅'
}

function colorForBadgeType(badgeType: string): string {
  switch (badgeType) {
    case 'gold':     return '#f0c040'
    case 'silver':   return '#9ca3af'
    case 'bronze':   return '#cd7f32'
    case 'platinum': return '#e5e4e2'
    default:         return '#6366f1'
  }
}
