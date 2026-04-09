// /lib/db/queries/saved-courses.ts

import { sql } from '@/lib/db';

export async function isCourseSaved(userId: string, courseId: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT 1 FROM saved_courses
      WHERE user_id = ${userId} AND course_id = ${courseId}
      LIMIT 1
    `;
    return result.length > 0;
  } catch (error) {
    console.error('❌ Error checking saved course:', error);
    return false;
  }
}

export async function saveCourse(userId: string, courseId: string) {
  try {
    await sql`
      INSERT INTO saved_courses (user_id, course_id)
      VALUES (${userId}, ${courseId})
      ON CONFLICT (user_id, course_id) DO NOTHING
    `;
    return { success: true };
  } catch (error: any) {
    console.error('❌ Error saving course:', error);
    return { success: false, error: error.message };
  }
}

export async function unsaveCourse(userId: string, courseId: string) {
  try {
    await sql`
      DELETE FROM saved_courses
      WHERE user_id = ${userId} AND course_id = ${courseId}
    `;
    return { success: true };
  } catch (error: any) {
    console.error('❌ Error unsaving course:', error);
    return { success: false, error: error.message };
  }
}

export async function getSavedCourses(userId: string) {
  try {
    const courses = await sql`
      SELECT
        c.id,
        c.title,
        c.slug,
        c.short_description,
        c.thumbnail_url,
        c.price_cents,
        c.level,
        c.language,
        c.average_rating,
        c.review_count,
        c.enrolled_students_count,
        c.is_published,
        u.name AS instructor_name,
        u.image AS instructor_image,
        cat.name AS category_name,
        sc.created_at AS saved_at
      FROM saved_courses sc
      JOIN courses c ON c.id = sc.course_id
      LEFT JOIN users u ON u.id = c.instructor_id
      LEFT JOIN categories cat ON cat.id = c.category_id
      WHERE sc.user_id = ${userId}
        AND c.is_published = true
      ORDER BY sc.created_at DESC
    `;
    return courses;
  } catch (error) {
    console.error('❌ Error fetching saved courses:', error);
    return [];
  }
}
