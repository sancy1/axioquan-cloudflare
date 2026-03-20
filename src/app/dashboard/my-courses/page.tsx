

// // app/dashboard/my-courses/page.tsx

// import { getSession } from '@/lib/auth/session'
// import Sidebar from '@/components/dashboard/sidebar'
// import MyCoursesPage from '@/components/dashboard/my-courses'
// import { sql } from '@/lib/db'

// // Define the course interface for type safety
// interface Course {
//   id: string;
//   title: string;
//   short_description: string;
//   description: string;
//   level: string;
//   difficulty_level: string;
//   duration: string;
//   category: string;
//   status: 'in-progress' | 'completed';
//   progress: number;
//   slug?: string;
//   thumbnail_url?: string;
//   total_lessons?: number;
//   instructor_name?: string;
//   enrolled_at?: Date;
//   completed_lessons?: number;
//   total_lessons_count?: number;
//   last_accessed_at?: Date;
//   total_time_spent?: number;
//   progress_percentage: number;
// }

// export default async function MyCourses() {
//   const session = await getSession()
  
//   // UPDATED: Use actual session data instead of hardcoded values
//   const user = session ? {
//     id: session.userId,
//     name: session.name || 'User',  // ← Use session.name instead of hardcoded
//     email: session.email || 'user@example.com',  // ← Use session.email
//     primaryRole: session.primaryRole || 'student',
//     roles: session.roles || [],  // ← Added roles array
//     image: session.image || undefined
//   } : null

// // export default async function MyCourses() {
// //   const session = await getSession()
  
// //   // Create user object from session
// //   const user = session ? {
// //     id: session.userId,
// //     name: 'User',
// //     email: 'user@example.com',  
// //     primaryRole: session.primaryRole || 'student',
// //     image: undefined
// //   } : null

//   // Fetch enrolled courses from database with proper typing
//   let enrolledCourses: Course[] = [];
  
//   try {
//     if (session?.userId) {
//       // Enhanced query to get comprehensive course data with progress
//       const enrollments = await sql`
//         SELECT 
//           e.id as enrollment_id,
//           e.course_id,
//           e.enrolled_at,
//           e.last_accessed_at,
//           e.progress_percentage,
//           e.completed_lessons,
//           e.total_lessons,
//           e.total_time_spent,
//           e.status as enrollment_status,
//           e.completed_at,
//           c.title,
//           c.short_description,
//           c.description_html,
//           c.difficulty_level,
//           c.thumbnail_url,
//           c.total_video_duration,
//           c.total_lessons as course_total_lessons,
//           c.slug,
//           u.name as instructor_name,
//           cat.name as category_name
//         FROM enrollments e
//         JOIN courses c ON e.course_id = c.id
//         LEFT JOIN users u ON c.instructor_id = u.id
//         LEFT JOIN categories cat ON c.category_id = cat.id
//         WHERE e.user_id = ${session.userId} AND e.status IN ('active', 'completed')
//         ORDER BY 
//           CASE 
//             WHEN e.progress_percentage > 0 AND e.progress_percentage < 100 THEN 1
//             WHEN e.progress_percentage = 100 THEN 2
//             ELSE 3
//           END,
//           e.last_accessed_at DESC NULLS LAST,
//           e.enrolled_at DESC
//       `;

//       // Format the courses data with proper typing and progress calculation
//       enrolledCourses = enrollments.map((enrollment: any): Course => {
//         const progressPercentage = enrollment.progress_percentage || 0;
//         const isCompleted = progressPercentage === 100;
        
//         return {
//           id: enrollment.course_id,
//           title: enrollment.title,
//           short_description: enrollment.short_description || 'Master this course through interactive lessons and real-world projects.',
//           description: enrollment.description_html || enrollment.short_description || 'Master this course through interactive lessons and real-world projects.',
//           level: enrollment.difficulty_level || 'beginner',
//           difficulty_level: enrollment.difficulty_level || 'beginner',
//           duration: enrollment.total_video_duration ? `${Math.ceil(enrollment.total_video_duration / 3600)}h ${Math.ceil((enrollment.total_video_duration % 3600) / 60)}m` : 'Self-paced',
//           category: enrollment.category_name || 'General',
//           status: isCompleted ? 'completed' : 'in-progress',
//           progress: progressPercentage,
//           progress_percentage: progressPercentage,
//           slug: enrollment.slug,
//           thumbnail_url: enrollment.thumbnail_url,
//           total_lessons: enrollment.course_total_lessons || enrollment.total_lessons || 0,
//           instructor_name: enrollment.instructor_name || 'Instructor',
//           enrolled_at: enrollment.enrolled_at,
//           completed_lessons: enrollment.completed_lessons || 0,
//           total_lessons_count: enrollment.total_lessons || enrollment.course_total_lessons || 0,
//           last_accessed_at: enrollment.last_accessed_at,
//           total_time_spent: enrollment.total_time_spent || 0
//         };
//       });
//     }
//   } catch (error: any) {
//     console.error('Error fetching enrolled courses:', error);
    
//     // If enrollments table doesn't exist yet, provide mock data for testing
//     if (error.message?.includes('relation "enrollments" does not exist')) {
//       console.log('Enrollments table not found, using mock data for testing');
//       enrolledCourses = [
//         {
//           id: "1",
//           title: "Introduction to Python Programming",
//           short_description: "Master the fundamentals of Python through interactive coding challenges and real-world projects.",
//           description: "Master the fundamentals of Python through interactive coding challenges and real-world projects.",
//           level: "beginner",
//           difficulty_level: "beginner",
//           duration: "6h 30m",
//           category: "Programming",
//           status: "in-progress",
//           progress: 65,
//           progress_percentage: 65,
//           slug: "introduction-to-python-programming",
//           thumbnail_url: "/api/placeholder/300/200",
//           total_lessons: 24,
//           instructor_name: "John Doe",
//           enrolled_at: new Date('2024-01-15'),
//           completed_lessons: 15,
//           total_lessons_count: 24,
//           last_accessed_at: new Date('2024-01-20'),
//           total_time_spent: 32400 // 9 hours in seconds
//         },
//         {
//           id: "2", 
//           title: "Modern Web Design Principles",
//           short_description: "Learn to create beautiful, user-friendly websites using modern design techniques and best practices.",
//           description: "Learn to create beautiful, user-friendly websites using modern design techniques and best practices.",
//           level: "intermediate",
//           difficulty_level: "intermediate",
//           duration: "4h 15m", 
//           category: "Design",
//           status: "in-progress",
//           progress: 40,
//           progress_percentage: 40,
//           slug: "modern-web-design-principles",
//           thumbnail_url: "/api/placeholder/300/200",
//           total_lessons: 18,
//           instructor_name: "Jane Smith",
//           enrolled_at: new Date('2024-01-10'),
//           completed_lessons: 7,
//           total_lessons_count: 18,
//           last_accessed_at: new Date('2024-01-18'),
//           total_time_spent: 21600 // 6 hours in seconds
//         },
//         {
//           id: "3",
//           title: "Advanced JavaScript Patterns",
//           short_description: "Deep dive into advanced JavaScript patterns and modern ES6+ features.",
//           description: "Deep dive into advanced JavaScript patterns and modern ES6+ features.",
//           level: "advanced",
//           difficulty_level: "advanced",
//           duration: "8h 0m",
//           category: "Programming",
//           status: "completed",
//           progress: 100,
//           progress_percentage: 100,
//           slug: "advanced-javascript-patterns",
//           thumbnail_url: "/api/placeholder/300/200",
//           total_lessons: 32,
//           instructor_name: "Mike Johnson",
//           enrolled_at: new Date('2023-12-01'),
//           completed_lessons: 32,
//           total_lessons_count: 32,
//           last_accessed_at: new Date('2024-01-05'),
//           total_time_spent: 57600 // 16 hours in seconds
//         }
//       ];
//     } else {
//       // Fallback to empty array for other errors
//       enrolledCourses = [];
//     }
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar user={user} />
//       <main className="flex-1 overflow-auto">
//         <MyCoursesPage initialCourses={enrolledCourses} />
//       </main>
//     </div>
//   )
// }





















// /app/dashboard/my-courses/page.tsx

import { getSession } from '@/lib/auth/session'
import Sidebar from '@/components/dashboard/sidebar'
import MyCoursesPage from '@/components/dashboard/my-courses'
import { sql } from '@/lib/db'

interface Course {
  id: string;
  title: string;
  short_description: string;
  description: string;
  level: string;
  difficulty_level: string;
  duration: string;
  category: string;
  status: 'in-progress' | 'completed';
  progress: number;
  slug?: string;
  thumbnail_url?: string;
  total_lessons?: number;
  instructor_name?: string;
  enrolled_at?: Date;
  completed_lessons?: number;
  total_lessons_count?: number;
  last_accessed_at?: Date;
  total_time_spent?: number;
  progress_percentage: number;
}

export default async function MyCourses() {
  const session = await getSession()

  const user = session ? {
    id: session.userId,
    name: session.name || 'User',
    email: session.email || 'user@example.com',
    primaryRole: session.primaryRole || 'student',
    roles: session.roles || [],
    image: session.image || undefined,
  } : null

  let enrolledCourses: Course[] = []
  let certificatesEarned = 0

  try {
    if (session?.userId) {
      // ── Enrolled courses ──────────────────────────────────────────────────
      const enrollments = await sql`
        SELECT
          e.id as enrollment_id,
          e.course_id,
          e.enrolled_at,
          e.last_accessed_at,
          e.progress_percentage,
          e.completed_lessons,
          e.total_lessons,
          e.total_time_spent,
          e.status as enrollment_status,
          e.completed_at,
          c.title,
          c.short_description,
          c.description_html,
          c.difficulty_level,
          c.thumbnail_url,
          c.total_video_duration,
          c.total_lessons as course_total_lessons,
          c.slug,
          u.name as instructor_name,
          cat.name as category_name
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        LEFT JOIN users u ON c.instructor_id = u.id
        LEFT JOIN categories cat ON c.category_id = cat.id
        WHERE e.user_id = ${session.userId} AND e.status IN ('active', 'completed')
        ORDER BY
          CASE
            WHEN e.progress_percentage > 0 AND e.progress_percentage < 100 THEN 1
            WHEN e.progress_percentage = 100 THEN 2
            ELSE 3
          END,
          e.last_accessed_at DESC NULLS LAST,
          e.enrolled_at DESC
      `

      enrolledCourses = enrollments.map((enrollment: any): Course => {
        const progressPercentage = enrollment.progress_percentage || 0
        const isCompleted = progressPercentage === 100
        return {
          id: enrollment.course_id,
          title: enrollment.title,
          short_description: enrollment.short_description || 'Master this course through interactive lessons and real-world projects.',
          description: enrollment.description_html || enrollment.short_description || 'Master this course through interactive lessons and real-world projects.',
          level: enrollment.difficulty_level || 'beginner',
          difficulty_level: enrollment.difficulty_level || 'beginner',
          duration: enrollment.total_video_duration
            ? `${Math.ceil(enrollment.total_video_duration / 3600)}h ${Math.ceil((enrollment.total_video_duration % 3600) / 60)}m`
            : 'Self-paced',
          category: enrollment.category_name || 'General',
          status: isCompleted ? 'completed' : 'in-progress',
          progress: progressPercentage,
          progress_percentage: progressPercentage,
          slug: enrollment.slug,
          thumbnail_url: enrollment.thumbnail_url,
          total_lessons: enrollment.course_total_lessons || enrollment.total_lessons || 0,
          instructor_name: enrollment.instructor_name || 'Instructor',
          enrolled_at: enrollment.enrolled_at,
          completed_lessons: enrollment.completed_lessons || 0,
          total_lessons_count: enrollment.total_lessons || enrollment.course_total_lessons || 0,
          last_accessed_at: enrollment.last_accessed_at,
          total_time_spent: enrollment.total_time_spent || 0,
        }
      })

      // ── Certificates earned — same pattern used across all pages ──────────
      try {
        const certResult = await sql`
          SELECT COUNT(*) as count
          FROM certificates
          WHERE user_id = ${session.userId}
            AND is_revoked = false
        `
        certificatesEarned = parseInt(certResult[0]?.count || '0')
      } catch {
        certificatesEarned = 0
      }
    }
  } catch (error: any) {
    console.error('Error fetching enrolled courses:', error)
    if (error.message?.includes('relation "enrollments" does not exist')) {
      enrolledCourses = []
    } else {
      enrolledCourses = []
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} />
      <main className="flex-1 overflow-auto">
        <MyCoursesPage
          initialCourses={enrolledCourses}
          certificatesEarned={certificatesEarned}
        />
      </main>
    </div>
  )
}
