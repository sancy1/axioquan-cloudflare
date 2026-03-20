
// // /src/app/api/certificates/student/route.ts
// // GET /api/certificates/student
// // Returns all active certificates + course completions count for the logged-in student.

// import { NextRequest } from 'next/server';
// import { getSession } from '@/lib/auth/session';
// import { getStudentCertificates } from '@/lib/db/queries/certificates';
// import { sql } from '@/lib/db/index';

// export async function GET(_request: NextRequest) {
//   try {
//     const session = await getSession();
//     if (!session?.userId) {
//       return Response.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     // Fetch raw certificates
//     const rawCerts = await getStudentCertificates(session.userId);

//     // Normalise: hoist JSONB sub-fields to top level for easy consumption
//     const certificates = rawCerts.map((cert: any) => ({
//       ...cert,
//       student_name:    cert.certificate_data?.student_name  ?? 'Student',
//       course_title:    cert.certificate_data?.course_title  ?? 'Unknown Course',
//       instructor_name: cert.certificate_data?.issued_by     ?? 'AxioQuan',
//       assessment_id:   cert.certificate_data?.assessment_id ?? null,
//     }));

//     // Course completions — enrollments with status 'completed' OR progress = 100
//     let courseCompletions = 0;
//     try {
//       const completions = await sql`
//         SELECT COUNT(*) as count
//         FROM enrollments
//         WHERE user_id = ${session.userId}
//           AND (status = 'completed' OR progress_percentage = 100)
//       `;
//       courseCompletions = parseInt(completions[0]?.count || '0');
//     } catch {
//       // fallback: use certificate count as proxy
//       courseCompletions = certificates.length;
//     }

//     // Achievements — graceful empty if table doesn't exist yet
//     let achievements: any[] = [];
//     try {
//       const rows = await sql`
//         SELECT id, title, description, icon, awarded_at, badge_color
//         FROM achievements
//         WHERE user_id = ${session.userId}
//         ORDER BY awarded_at DESC
//       `;
//       achievements = rows;
//     } catch {
//       // achievements table not yet created — return empty array
//       achievements = [];
//     }

//     return Response.json({
//       success: true,
//       certificates,
//       totalCertificates: certificates.length,
//       courseCompletions,
//       achievements,
//       totalAchievements: achievements.length,
//     });
//   } catch (error: any) {
//     console.error('❌ Error fetching student certificates:', error);
//     return Response.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }
























// // /src/app/api/certificates/student/route.ts

// import { NextRequest } from 'next/server';
// import { getSession } from '@/lib/auth/session';
// import { getStudentCertificates } from '@/lib/db/queries/certificates';
// import { sql } from '@/lib/db/index';

// export async function GET(_request: NextRequest) {
//   try {
//     const session = await getSession();
//     if (!session?.userId) {
//       return Response.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     // Step 1: fetch raw certificates (this works — Neon returns certificate_data as a JS object)
//     const rawCerts = await getStudentCertificates(session.userId);

//     if (rawCerts.length === 0) {
//       return Response.json({
//         success: true,
//         certificates: [],
//         totalCertificates: 0,
//         courseCompletions: 0,
//         achievements: [],
//         totalAchievements: 0,
//       });
//     }

//     // Step 2: collect unique instructor UUIDs and course IDs to resolve in one query each
//     const instructorIds = [...new Set(
//       rawCerts
//         .map((c: any) => c.certificate_data?.issued_by)
//         .filter(Boolean)
//     )] as string[];

//     const courseIds = [...new Set(
//       rawCerts.map((c: any) => c.course_id).filter(Boolean)
//     )] as string[];

//     // Step 3: resolve instructor UUIDs → names
//     const instructorMap: Record<string, string> = {};
//     if (instructorIds.length > 0) {
//       try {
//         const instructors = await sql`
//           SELECT id::text AS id, name
//           FROM users
//           WHERE id::text = ANY(${instructorIds})
//         `;
//         for (const row of instructors as any[]) {
//           instructorMap[row.id] = row.name;
//         }
//       } catch {
//         // leave map empty — will fall back to 'AxioQuan'
//       }
//     }

//     // Step 4: resolve course IDs → titles (fallback if JSONB title is empty)
//     const courseMap: Record<string, string> = {};
//     if (courseIds.length > 0) {
//       try {
//         const courses = await sql`
//           SELECT id::text AS id, title
//           FROM courses
//           WHERE id::text = ANY(${courseIds})
//         `;
//         for (const row of courses as any[]) {
//           courseMap[row.id] = row.title;
//         }
//       } catch {
//         // leave map empty
//       }
//     }

//     // Step 5: normalise — hoist JSONB fields, resolve instructor name and course title
//     const certificates = rawCerts.map((cert: any) => {
//       const data = cert.certificate_data ?? {};
//       const instructorUUID = data.issued_by ?? '';
//       const resolvedInstructor = instructorMap[instructorUUID] ?? null;
//       const resolvedCourseTitle = courseMap[cert.course_id] ?? null;

//       return {
//         ...cert,
//         student_name:    data.student_name  || session.name  || 'Student',
//         course_title:    data.course_title  || resolvedCourseTitle || 'Unknown Course',
//         instructor_name: resolvedInstructor || 'AxioQuan',
//         assessment_id:   data.assessment_id ?? null,
//       };
//     });

//     // Course completions
//     let courseCompletions = 0;
//     try {
//       const completions = await sql`
//         SELECT COUNT(*) as count
//         FROM enrollments
//         WHERE user_id = ${session.userId}
//           AND (status = 'completed' OR progress_percentage = 100)
//       `;
//       courseCompletions = parseInt(completions[0]?.count || '0');
//     } catch {
//       courseCompletions = certificates.length;
//     }

//     // Achievements — graceful empty if table doesn't exist yet
//     let achievements: any[] = [];
//     try {
//       const rows = await sql`
//         SELECT id, title, description, icon, awarded_at, badge_color
//         FROM achievements
//         WHERE user_id = ${session.userId}
//         ORDER BY awarded_at DESC
//       `;
//       achievements = rows;
//     } catch {
//       achievements = [];
//     }

//     return Response.json({
//       success: true,
//       certificates,
//       totalCertificates: certificates.length,
//       courseCompletions,
//       achievements,
//       totalAchievements: achievements.length,
//     });

//   } catch (error: any) {
//     console.error('❌ Error fetching student certificates:', error);
//     return Response.json({ error: 'Internal server error', details: error.message }, { status: 500 });
//   }
// }
























// // /src/app/api/certificates/student/route.ts

// import { NextRequest } from 'next/server';
// import { getSession } from '@/lib/auth/session';
// import { getStudentCertificates } from '@/lib/db/queries/certificates';
// import { sql } from '@/lib/db/index';

// export async function GET(_request: NextRequest) {
//   try {
//     const session = await getSession();
//     if (!session?.userId) {
//       return Response.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     // Step 1: fetch raw certificates (this works — Neon returns certificate_data as a JS object)
//     const rawCerts = await getStudentCertificates(session.userId);

//     if (rawCerts.length === 0) {
//       return Response.json({
//         success: true,
//         certificates: [],
//         totalCertificates: 0,
//         courseCompletions: 0,
//         achievements: [],
//         totalAchievements: 0,
//       });
//     }

//     // Step 2: collect unique instructor UUIDs and course IDs to resolve in one query each
//     const instructorIds = [...new Set(
//       rawCerts
//         .map((c: any) => c.certificate_data?.issued_by)
//         .filter(Boolean)
//     )] as string[];

//     const courseIds = [...new Set(
//       rawCerts.map((c: any) => c.course_id).filter(Boolean)
//     )] as string[];

//     // Step 3: resolve instructor UUIDs → names
//     const instructorMap: Record<string, string> = {};
//     if (instructorIds.length > 0) {
//       try {
//         const instructors = await sql`
//           SELECT id::text AS id, name
//           FROM users
//           WHERE id::text = ANY(${instructorIds})
//         `;
//         for (const row of instructors as any[]) {
//           instructorMap[row.id] = row.name;
//         }
//       } catch {
//         // leave map empty — will fall back to 'AxioQuan'
//       }
//     }

//     // Step 4: resolve course IDs → titles (fallback if JSONB title is empty)
//     const courseMap: Record<string, string> = {};
//     if (courseIds.length > 0) {
//       try {
//         const courses = await sql`
//           SELECT id::text AS id, title
//           FROM courses
//           WHERE id::text = ANY(${courseIds})
//         `;
//         for (const row of courses as any[]) {
//           courseMap[row.id] = row.title;
//         }
//       } catch {
//         // leave map empty
//       }
//     }

//     // Step 5: normalise — hoist JSONB fields, resolve instructor name and course title
//     const certificates = rawCerts.map((cert: any) => {
//       const data = cert.certificate_data ?? {};
//       const instructorUUID = data.issued_by ?? '';
//       const resolvedInstructor = instructorMap[instructorUUID] ?? null;
//       const resolvedCourseTitle = courseMap[cert.course_id] ?? null;

//       return {
//         ...cert,
//         student_name:    data.student_name  || session.name  || 'Student',
//         course_title:    resolvedCourseTitle || data.course_title  || 'Unknown Course',
//         instructor_name: resolvedInstructor || 'AxioQuan',
//         assessment_id:   data.assessment_id ?? null,
//       };
//     });

//     // Course completions
//     let courseCompletions = 0;
//     try {
//       const completions = await sql`
//         SELECT COUNT(*) as count
//         FROM enrollments
//         WHERE user_id = ${session.userId}
//           AND (status = 'completed' OR progress_percentage = 100)
//       `;
//       courseCompletions = parseInt(completions[0]?.count || '0');
//     } catch {
//       courseCompletions = certificates.length;
//     }

//     // Achievements — graceful empty if table doesn't exist yet
//     let achievements: any[] = [];
//     try {
//       const rows = await sql`
//         SELECT id, title, description, icon, awarded_at, badge_color
//         FROM achievements
//         WHERE user_id = ${session.userId}
//         ORDER BY awarded_at DESC
//       `;
//       achievements = rows;
//     } catch {
//       achievements = [];
//     }

//     return Response.json({
//       success: true,
//       certificates,
//       totalCertificates: certificates.length,
//       courseCompletions,
//       achievements,
//       totalAchievements: achievements.length,
//     });

//   } catch (error: any) {
//     console.error('❌ Error fetching student certificates:', error);
//     return Response.json({ error: 'Internal server error', details: error.message }, { status: 500 });
//   }
// }






























// src/app/api/certificates/student/route.ts
// Returns the authenticated student's certificates + achievements.
// course_title: prefers courses.title (DB) over JSONB stored value (may be stale)
// instructor_name: resolved from users table via certificate_data.issued_by UUID

import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { sql } from '@/lib/db/index';

function iconForCategory(category: string, badgeType: string): string {
  if (category === 'certificates') return '🎓'
  if (category === 'quizzes') return badgeType === 'gold' ? '🏆' : '⭐'
  if (category === 'persistence') return '💪'
  if (category === 'enrollment')  return '📚'
  if (category === 'completion')  return '🎯'
  if (category === 'streaks')     return '🔥'
  return '🏅'
}

function colorForBadge(badgeType: string): string {
  switch (badgeType) {
    case 'gold':     return '#f0c040'
    case 'silver':   return '#9ca3af'
    case 'bronze':   return '#cd7f32'
    default:         return '#6366f1'
  }
}

export async function GET(_request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── 1. Certificates ──────────────────────────────────────────────────────
    let certificates: any[] = [];
    try {
      const certRows = await sql`
        SELECT
          c.id,
          c.certificate_code,
          c.issued_at,
          c.final_grade,
          c.overall_score,
          c.completion_percentage,
          c.certificate_data,
          c.course_id,
          co.title AS db_course_title,
          u.name   AS instructor_name
        FROM certificates c
        LEFT JOIN courses co ON c.course_id = co.id
        LEFT JOIN users   u  ON u.id = (c.certificate_data->>'issued_by')::uuid
        WHERE c.user_id    = ${session.userId}
          AND c.is_revoked = false
        ORDER BY c.issued_at DESC
      `;

      certificates = certRows.map((r: any) => ({
        id:                   r.id,
        certificate_code:     r.certificate_code,
        issued_at:            r.issued_at,
        final_grade:          r.final_grade,
        overall_score:        r.overall_score ? parseFloat(r.overall_score) : 0,
        completion_percentage: r.completion_percentage ? parseFloat(r.completion_percentage) : 0,
        // Prefer live DB course title over potentially stale JSONB value
        course_title:         r.db_course_title || r.certificate_data?.course_title || 'Unknown Course',
        instructor_name:      r.instructor_name || 'AxioQuan Instructor',
        student_name:         r.certificate_data?.student_name || session.name || 'Student',
        assessment_id:        r.certificate_data?.assessment_id ?? null,
        course_id:            r.course_id,
      }));
    } catch (err) {
      console.error('❌ Error fetching student certificates:', err);
    }

    // ── 2. Achievements ──────────────────────────────────────────────────────
    let achievements: any[] = [];
    try {
      const achRows = await sql`
        SELECT
          ua.id,
          ua.earned_at,
          ua.xp_earned,
          ua.is_seen,
          a.name,
          a.description,
          a.icon_url,
          a.badge_type,
          a.difficulty,
          a.category,
          a.xp_reward
        FROM user_achievements ua
        JOIN achievements a ON ua.achievement_id = a.id
        WHERE ua.user_id  = ${session.userId}
          AND a.is_active = true
        ORDER BY ua.earned_at DESC
      `;

      achievements = achRows.map((r: any) => ({
        id:          r.id,
        title:       r.name,
        description: r.description,
        icon:        r.icon_url ?? iconForCategory(r.category, r.badge_type),
        badge_color: colorForBadge(r.badge_type),
        badge_type:  r.badge_type,
        difficulty:  r.difficulty,
        category:    r.category,
        xp_earned:   r.xp_earned ?? r.xp_reward ?? 10,
        awarded_at:  r.earned_at,
        is_seen:     r.is_seen ?? false,
      }));
    } catch (err) {
      console.error('❌ Error fetching achievements:', err);
    }

    // ── 3. Course completions count ──────────────────────────────────────────
    let courseCompletions = 0;
    try {
      const compRows = await sql`
        SELECT COUNT(*) as count FROM enrollments
        WHERE user_id = ${session.userId} AND progress_percentage = 100
      `;
      courseCompletions = parseInt(compRows[0]?.count ?? '0');
    } catch {}

    return Response.json({
      success:           true,
      certificates,
      achievements,
      totalCertificates: certificates.length,
      courseCompletions,
      totalAchievements: achievements.length,
    });
  } catch (error: any) {
    console.error('❌ Error in student certificates route:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
