// // /lib/db/queries/instructors.ts
// import { sql } from '../index';

// export interface Instructor {
//   id: string;
//   username: string;
//   name: string;
//   email: string;
//   image: string | null;
//   bio: string | null;
//   created_at: Date;
//   // from user_profiles
//   display_name: string | null;
//   headline: string | null;
//   location: string | null;
//   company: string | null;
//   website: string | null;
//   twitter_username: string | null;
//   github_username: string | null;
//   linkedin_url: string | null;
//   youtube_channel: string | null;
//   skills: string[] | null;
//   profile_image: string | null;
//   availability_status: string | null;
//   // computed
//   course_count: number;
//   total_students: number;
//   average_rating: number;
// }

// export async function getInstructors(filters?: {
//   search?: string;
//   category?: string;
//   sortBy?: 'name' | 'popular' | 'courses' | 'rating';
//   limit?: number;
//   offset?: number;
// }): Promise<{ instructors: Instructor[]; total: number }> {
//   try {
//     const limit = filters?.limit ?? 12;
//     const offset = filters?.offset ?? 0;
//     const search = filters?.search?.trim() || '';

//     const orderBy =
//       filters?.sortBy === 'popular' ? sql`total_students DESC` :
//       filters?.sortBy === 'courses'  ? sql`course_count DESC` :
//       filters?.sortBy === 'rating'   ? sql`average_rating DESC` :
//       sql`u.name ASC`;

//     const baseSelect = sql`
//       SELECT
//         u.id,
//         u.username,
//         u.name,
//         u.email,
//         u.image,
//         u.bio,
//         u.created_at,
//         up.display_name,
//         up.headline,
//         up.location,
//         up.company,
//         up.website,
//         up.twitter_username,
//         up.github_username,
//         up.linkedin_url,
//         up.youtube_channel,
//         up.skills,
//         up.profile_image,
//         up.availability_status,
//         COUNT(DISTINCT c.id)::int AS course_count,
//         COALESCE(SUM(
//           (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id AND e.status = 'active')
//         ), 0)::int AS total_students,
//         COALESCE(ROUND(AVG(
//           (SELECT AVG(cr.rating) FROM course_reviews cr WHERE cr.course_id = c.id AND cr.status = 'active')
//         )::numeric, 1), 0)::float AS average_rating,
//         COUNT(*) OVER()::int AS total_count
//       FROM users u
//       JOIN user_roles ur ON ur.user_id = u.id
//       JOIN roles r ON r.id = ur.role_id AND r.name = 'instructor'
//       LEFT JOIN user_profiles up ON up.user_id = u.id
//       LEFT JOIN courses c ON c.instructor_id = u.id AND c.is_published = true
//     `;

//     const groupAndOrder = sql`
//       GROUP BY
//         u.id, u.username, u.name, u.email, u.image, u.bio, u.created_at,
//         up.display_name, up.headline, up.location, up.company, up.website,
//         up.twitter_username, up.github_username, up.linkedin_url, up.youtube_channel,
//         up.skills, up.profile_image, up.availability_status
//       ORDER BY ${orderBy}
//       LIMIT ${limit} OFFSET ${offset}
//     `;

//     let rows;

//     if (search) {
//       const pattern = `%${search}%`;
//       rows = await sql`
//         ${baseSelect}
//         WHERE u.is_active = true
//           AND (
//             u.name ILIKE ${pattern}
//             OR u.username ILIKE ${pattern}
//             OR up.headline ILIKE ${pattern}
//             OR up.display_name ILIKE ${pattern}
//           )
//         ${groupAndOrder}
//       `;
//     } else {
//       rows = await sql`
//         ${baseSelect}
//         WHERE u.is_active = true
//         ${groupAndOrder}
//       `;
//     }

//     const total = rows[0]?.total_count ?? 0;
//     return {
//       instructors: rows as Instructor[],
//       total,
//     };
//   } catch (error) {
//     console.error('❌ Error fetching instructors:', error);
//     return { instructors: [], total: 0 };
//   }
// }

// export async function getInstructorCourses(instructorId: string) {
//   try {
//     const courses = await sql`
//       SELECT
//         c.id,
//         c.title,
//         c.slug,
//         c.description,
//         c.thumbnail_url,
//         c.price_cents,
//         c.level,
//         cat.name AS category_name,
//         (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id AND e.status = 'active')::int AS enrolled_count,
//         COALESCE(ROUND(AVG(cr.rating)::numeric, 1), 0)::float AS avg_rating,
//         COUNT(cr.id)::int AS review_count
//       FROM courses c
//       LEFT JOIN categories cat ON cat.id = c.category_id
//       LEFT JOIN course_reviews cr ON cr.course_id = c.id AND cr.status = 'active'
//       WHERE c.instructor_id = ${instructorId} AND c.is_published = true
//       GROUP BY c.id, c.title, c.slug, c.description, c.thumbnail_url, c.price_cents, c.level, cat.name
//       ORDER BY enrolled_count DESC
//       LIMIT 6
//     `;
//     return courses;
//   } catch (error) {
//     console.error('❌ Error fetching instructor courses:', error);
//     return [];
//   }
// }

































// /lib/db/queries/instructors.ts
import { sql } from '../index';

export interface Instructor {
  id: string;
  username: string;
  name: string;
  email: string;
  image: string | null;
  bio: string | null;
  created_at: Date;
  // from user_profiles
  display_name: string | null;
  headline: string | null;
  location: string | null;
  company: string | null;
  website: string | null;
  twitter_username: string | null;
  github_username: string | null;
  linkedin_url: string | null;
  youtube_channel: string | null;
  skills: string[] | null;
  learning_goals: string[] | null;    // ← ADDED
  preferred_topics: string[] | null;  // ← ADDED
  profile_image: string | null;
  availability_status: string | null;
  // computed
  course_count: number;
  total_students: number;
  average_rating: number;
}

export async function getInstructors(filters?: {
  search?: string;
  category?: string;
  sortBy?: 'name' | 'popular' | 'courses' | 'rating';
  limit?: number;
  offset?: number;
}): Promise<{ instructors: Instructor[]; total: number }> {
  try {
    const limit = filters?.limit ?? 12;
    const offset = filters?.offset ?? 0;
    const search = filters?.search?.trim() || '';

    const orderBy =
      filters?.sortBy === 'popular' ? sql`total_students DESC` :
      filters?.sortBy === 'courses'  ? sql`course_count DESC` :
      filters?.sortBy === 'rating'   ? sql`average_rating DESC` :
      sql`u.name ASC`;

    const baseSelect = sql`
      SELECT
        u.id,
        u.username,
        u.name,
        u.email,
        u.image,
        u.bio,
        u.created_at,
        up.display_name,
        up.headline,
        up.location,
        up.company,
        up.website,
        up.twitter_username,
        up.github_username,
        up.linkedin_url,
        up.youtube_channel,
        up.skills,
        up.learning_goals,
        up.preferred_topics,
        up.profile_image,
        up.availability_status,
        COUNT(DISTINCT c.id)::int AS course_count,
        COALESCE(SUM(
          (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id AND e.status = 'active')
        ), 0)::int AS total_students,
        COALESCE(ROUND(AVG(
          (SELECT AVG(cr.rating) FROM course_reviews cr WHERE cr.course_id = c.id AND cr.status = 'active')
        )::numeric, 1), 0)::float AS average_rating,
        COUNT(*) OVER()::int AS total_count
      FROM users u
      JOIN user_roles ur ON ur.user_id = u.id
      JOIN roles r ON r.id = ur.role_id AND r.name = 'instructor'
      LEFT JOIN user_profiles up ON up.user_id = u.id
      LEFT JOIN courses c ON c.instructor_id = u.id AND c.is_published = true
    `;

    const groupAndOrder = sql`
      GROUP BY
        u.id, u.username, u.name, u.email, u.image, u.bio, u.created_at,
        up.display_name, up.headline, up.location, up.company, up.website,
        up.twitter_username, up.github_username, up.linkedin_url, up.youtube_channel,
        up.skills, up.learning_goals, up.preferred_topics,
        up.profile_image, up.availability_status
      ORDER BY ${orderBy}
      LIMIT ${limit} OFFSET ${offset}
    `;

    let rows;

    if (search) {
      const pattern = `%${search}%`;
      rows = await sql`
        ${baseSelect}
        WHERE u.is_active = true
          AND (
            u.name ILIKE ${pattern}
            OR u.username ILIKE ${pattern}
            OR up.headline ILIKE ${pattern}
            OR up.display_name ILIKE ${pattern}
          )
        ${groupAndOrder}
      `;
    } else {
      rows = await sql`
        ${baseSelect}
        WHERE u.is_active = true
        ${groupAndOrder}
      `;
    }

    const total = rows[0]?.total_count ?? 0;
    return {
      instructors: rows as Instructor[],
      total,
    };
  } catch (error) {
    console.error('❌ Error fetching instructors:', error);
    return { instructors: [], total: 0 };
  }
}

export async function getInstructorCourses(instructorId: string) {
  try {
    const courses = await sql`
      SELECT
        c.id,
        c.title,
        c.slug,
        c.description,
        c.thumbnail_url,
        c.price_cents,
        c.level,
        cat.name AS category_name,
        (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id AND e.status = 'active')::int AS enrolled_count,
        COALESCE(ROUND(AVG(cr.rating)::numeric, 1), 0)::float AS avg_rating,
        COUNT(cr.id)::int AS review_count
      FROM courses c
      LEFT JOIN categories cat ON cat.id = c.category_id
      LEFT JOIN course_reviews cr ON cr.course_id = c.id AND cr.status = 'active'
      WHERE c.instructor_id = ${instructorId} AND c.is_published = true
      GROUP BY c.id, c.title, c.slug, c.description, c.thumbnail_url, c.price_cents, c.level, cat.name
      ORDER BY enrolled_count DESC
      LIMIT 6
    `;
    return courses;
  } catch (error) {
    console.error('❌ Error fetching instructor courses:', error);
    return [];
  }
}