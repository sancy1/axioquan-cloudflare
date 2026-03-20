
// // src/app/api/achievements/test/route.ts
// // TEMPORARY DEBUG ENDPOINT — remove after fixing
// // GET /api/achievements/test
// // Tests the achievement engine step by step and returns what failed

// import { NextRequest } from 'next/server';
// import { getSession } from '@/lib/auth/session';
// import { sql } from '@/lib/db/index';

// export async function GET(request: NextRequest) {
//   try {
//     const session = await getSession();
//     if (!session?.userId) {
//       return Response.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const userId = session.userId;
//     const results: Record<string, any> = { userId };

//     // Step 1: Can we query achievements table?
//     try {
//       const rows = await sql`SELECT id, name, is_active FROM achievements LIMIT 3`;
//       results.step1_achievements_table = { ok: true, count: rows.length, sample: rows[0]?.name };
//     } catch (e: any) {
//       results.step1_achievements_table = { ok: false, error: e.message };
//     }

//     // Step 2: Can we query user_achievements table?
//     try {
//       const rows = await sql`SELECT COUNT(*) as count FROM user_achievements`;
//       results.step2_user_achievements_table = { ok: true, total_rows: rows[0]?.count };
//     } catch (e: any) {
//       results.step2_user_achievements_table = { ok: false, error: e.message };
//     }

//     // Step 3: Check enrollment count for this user
//     try {
//       const rows = await sql`
//         SELECT COUNT(*) as count FROM enrollments
//         WHERE user_id = ${userId} AND status = 'active'
//       `;
//       results.step3_enrollment_count = { ok: true, count: rows[0]?.count };
//     } catch (e: any) {
//       results.step3_enrollment_count = { ok: false, error: e.message };
//     }

//     // Step 4: Look up "Course Collector" achievement id
//     try {
//       const rows = await sql`
//         SELECT id, name, is_active FROM achievements WHERE name = 'Course Collector' LIMIT 1
//       `;
//       results.step4_course_collector_achievement = {
//         ok: rows.length > 0,
//         found: rows.length > 0,
//         id: rows[0]?.id,
//         is_active: rows[0]?.is_active,
//       };
//     } catch (e: any) {
//       results.step4_course_collector_achievement = { ok: false, error: e.message };
//     }

//     // Step 5: Check if user already has any user_achievement rows
//     try {
//       const rows = await sql`
//         SELECT ua.id, a.name FROM user_achievements ua
//         JOIN achievements a ON ua.achievement_id = a.id
//         WHERE ua.user_id = ${userId}
//       `;
//       results.step5_existing_user_achievements = { ok: true, count: rows.length, rows };
//     } catch (e: any) {
//       results.step5_existing_user_achievements = { ok: false, error: e.message };
//     }

//     // Step 6: Try writing a test row directly to user_achievements
//     let testInsertId: string | null = null;
//     try {
//       const achievementRow = await sql`
//         SELECT id FROM achievements WHERE is_active = true LIMIT 1
//       `;
//       if (achievementRow.length > 0) {
//         const achId = achievementRow[0].id;

//         // Check if already exists first
//         const existing = await sql`
//           SELECT id FROM user_achievements
//           WHERE user_id = ${userId} AND achievement_id = ${achId}
//         `;

//         if (existing.length === 0) {
//           const inserted = await sql`
//             INSERT INTO user_achievements
//               (id, user_id, achievement_id, earned_at, xp_earned, is_seen, progress_percentage)
//             VALUES
//               (gen_random_uuid(), ${userId}, ${achId}, NOW(), 10, false, 100)
//             RETURNING id
//           `;
//           testInsertId = inserted[0]?.id;
//           results.step6_test_insert = { ok: true, inserted_id: testInsertId, achievement_id: achId };

//           // Clean it up immediately
//           if (testInsertId) {
//             await sql`DELETE FROM user_achievements WHERE id = ${testInsertId}`;
//             results.step6_test_insert.cleaned_up = true;
//           }
//         } else {
//           results.step6_test_insert = { ok: true, skipped: 'already exists for this achievement' };
//         }
//       } else {
//         results.step6_test_insert = { ok: false, error: 'No active achievements found' };
//       }
//     } catch (e: any) {
//       results.step6_test_insert = { ok: false, error: e.message };
//     }

//     // Step 7: Try calling the engine directly
//     try {
//       const { fireAchievementTrigger } = await import('@/lib/achievements/achievement-engine');
//       const { TRIGGERS } = await import('@/lib/achievements/triggers');
//       const awarded = await fireAchievementTrigger(userId, TRIGGERS.COURSE_ENROLLED, {});
//       results.step7_engine_direct_call = { ok: true, awarded };
//     } catch (e: any) {
//       results.step7_engine_direct_call = { ok: false, error: e.message };
//     }

//     // Step 8: Check user_achievements after engine call
//     try {
//       const rows = await sql`
//         SELECT ua.id, a.name, ua.earned_at FROM user_achievements ua
//         JOIN achievements a ON ua.achievement_id = a.id
//         WHERE ua.user_id = ${userId}
//         ORDER BY ua.earned_at DESC
//       `;
//       results.step8_user_achievements_after_engine = { ok: true, count: rows.length, rows };
//     } catch (e: any) {
//       results.step8_user_achievements_after_engine = { ok: false, error: e.message };
//     }

//     return Response.json(results, { status: 200 });
//   } catch (error: any) {
//     return Response.json({ error: error.message }, { status: 500 });
//   }
// }





























// src/app/api/achievements/test/route.ts
// TEMPORARY DEBUG ENDPOINT — remove after fixing
// GET /api/achievements/test
// Tests the achievement engine step by step and returns what failed

import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { sql } from '@/lib/db/index';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.userId;
    const results: Record<string, any> = { userId };

    // Step 1: Can we query achievements table?
    try {
      const rows = await sql`SELECT id, name, is_active FROM achievements LIMIT 3`;
      results.step1_achievements_table = { ok: true, count: rows.length, sample: rows[0]?.name };
    } catch (e: any) {
      results.step1_achievements_table = { ok: false, error: e.message };
    }

    // Step 2: Can we query user_achievements table?
    try {
      const rows = await sql`SELECT COUNT(*) as count FROM user_achievements`;
      results.step2_user_achievements_table = { ok: true, total_rows: rows[0]?.count };
    } catch (e: any) {
      results.step2_user_achievements_table = { ok: false, error: e.message };
    }

    // Step 3: Check enrollment count for this user
    try {
      const rows = await sql`
        SELECT COUNT(*) as count FROM enrollments
        WHERE user_id = ${userId} AND status = 'active'
      `;
      results.step3_enrollment_count = { ok: true, count: rows[0]?.count };
    } catch (e: any) {
      results.step3_enrollment_count = { ok: false, error: e.message };
    }

    // Step 4: Look up "Course Collector" achievement id
    try {
      const rows = await sql`
        SELECT id, name, is_active FROM achievements WHERE name = 'Course Collector' LIMIT 1
      `;
      results.step4_course_collector_achievement = {
        ok: rows.length > 0,
        found: rows.length > 0,
        id: rows[0]?.id,
        is_active: rows[0]?.is_active,
      };
    } catch (e: any) {
      results.step4_course_collector_achievement = { ok: false, error: e.message };
    }

    // Step 5: Check if user already has any user_achievement rows
    try {
      const rows = await sql`
        SELECT ua.id, a.name FROM user_achievements ua
        JOIN achievements a ON ua.achievement_id = a.id
        WHERE ua.user_id = ${userId}
      `;
      results.step5_existing_user_achievements = { ok: true, count: rows.length, rows };
    } catch (e: any) {
      results.step5_existing_user_achievements = { ok: false, error: e.message };
    }

    // Step 6: Try writing a test row directly to user_achievements
    let testInsertId: string | null = null;
    try {
      const achievementRow = await sql`
        SELECT id FROM achievements WHERE is_active = true LIMIT 1
      `;
      if (achievementRow.length > 0) {
        const achId = achievementRow[0].id;

        // Check if already exists first
        const existing = await sql`
          SELECT id FROM user_achievements
          WHERE user_id = ${userId} AND achievement_id = ${achId}
        `;

        if (existing.length === 0) {
          const inserted = await sql`
            INSERT INTO user_achievements
              (id, user_id, achievement_id, earned_at, xp_earned, is_seen, progress_percentage)
            VALUES
              (gen_random_uuid(), ${userId}, ${achId}, NOW(), 10, false, 100)
            RETURNING id
          `;
          testInsertId = inserted[0]?.id;
          results.step6_test_insert = { ok: true, inserted_id: testInsertId, achievement_id: achId };

          // Clean it up immediately
          if (testInsertId) {
            await sql`DELETE FROM user_achievements WHERE id = ${testInsertId}`;
            results.step6_test_insert.cleaned_up = true;
          }
        } else {
          results.step6_test_insert = { ok: true, skipped: 'already exists for this achievement' };
        }
      } else {
        results.step6_test_insert = { ok: false, error: 'No active achievements found' };
      }
    } catch (e: any) {
      results.step6_test_insert = { ok: false, error: e.message };
    }

    // Step 7: Try calling the engine directly
    try {
      const { fireAchievementTrigger } = await import('@/lib/achievements/achievement-engine');
      const { TRIGGERS } = await import('@/lib/achievements/triggers');
      const awarded = await fireAchievementTrigger(userId, TRIGGERS.COURSE_ENROLLED, {});
      results.step7_engine_direct_call = { ok: true, awarded };
    } catch (e: any) {
      results.step7_engine_direct_call = { ok: false, error: e.message };
    }

    // Step 8: Check user_achievements after engine call
    try {
      const rows = await sql`
        SELECT ua.id, a.name, ua.earned_at FROM user_achievements ua
        JOIN achievements a ON ua.achievement_id = a.id
        WHERE ua.user_id = ${userId}
        ORDER BY ua.earned_at DESC
      `;
      results.step8_user_achievements_after_engine = { ok: true, count: rows.length, rows };
    } catch (e: any) {
      results.step8_user_achievements_after_engine = { ok: false, error: e.message };
    }

    return Response.json(results, { status: 200 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}