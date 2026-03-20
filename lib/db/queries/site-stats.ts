// /lib/db/queries/site-stats.ts

import { sql } from '../index';

export interface SiteStats {
  activeLearners: number;
  expertInstructors: number;
  coursesAvailable: number;
  averageRating: number;
}

export async function getSiteStats(): Promise<SiteStats> {
  try {
    const [learnersResult, instructorsResult, coursesResult, ratingResult] = await Promise.all([
      // Count distinct users with active enrollments
      sql`
        SELECT COUNT(DISTINCT user_id) as count
        FROM enrollments
        WHERE status = 'active'
      `,
      // Count distinct instructors who have at least one published course
      sql`
        SELECT COUNT(DISTINCT instructor_id) as count
        FROM courses
        WHERE is_published = true
      `,
      // Count all published courses
      sql`
        SELECT COUNT(*) as count
        FROM courses
        WHERE is_published = true
      `,
      // Average rating across all active, public reviews
      sql`
        SELECT ROUND(AVG(rating)::numeric, 1) as avg_rating
        FROM course_reviews
        WHERE status = 'active'
          AND is_public = true
      `,
    ]);

    return {
      activeLearners:     parseInt(learnersResult[0]?.count ?? '0'),
      expertInstructors:  parseInt(instructorsResult[0]?.count ?? '0'),
      coursesAvailable:   parseInt(coursesResult[0]?.count ?? '0'),
      averageRating:      parseFloat(ratingResult[0]?.avg_rating ?? '0'),
    };
  } catch (error) {
    console.error('❌ Error fetching site stats:', error);
    // Return safe fallback values so the UI never crashes
    return {
      activeLearners:    0,
      expertInstructors: 0,
      coursesAvailable:  0,
      averageRating:     0,
    };
  }
}
