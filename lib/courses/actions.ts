
// // // /lib/courses/actions.ts
// // # Server actions for course CRUD operations

// 'use server';

// import { 
//   getAllCourses, 
//   getCourseById, 
//   getCourseBySlug, 
//   getInstructorCourses,
//   createCourse, 
//   updateCourse, 
//   deleteCourse,
//   publishCourse,
//   unpublishCourse,

//   enrollUserInCourse, 
//   getUserEnrollments, 
//   checkEnrollmentStatus, 
//   getEnrollmentProgress,
//   updateEnrollmentProgress 

// } from '@/lib/db/queries/courses';
// import { getCourseCurriculum } from '@/lib/db/queries/curriculum';
// import { requireAuth } from '@/lib/auth/utils';
// import type { CreateCourseData, UpdateCourseData } from '@/types/courses';
// import { getCourseAnalyticsSummary } from '@/lib/db/queries/course-analytics';
// import { sql } from '@/lib/db';
// import { getSession } from '@/lib/auth/session';
// import { getTrendingCourses, getSimpleTrendingCourses } from '@/lib/db/queries/trending-courses';


// export async function getCoursesAction(filters?: {
//   category_slug?: string;
//   is_published?: boolean;
//   is_featured?: boolean;
//   limit?: number;
//   offset?: number;
//   include_reviews?: boolean;
// }): Promise<{
//   success: boolean;
//   courses?: any[];
//   errors?: string[];
// }> {
//   try {
//     let courses;
    
//     if (filters?.include_reviews) {
//       // Use direct SQL query with review ratings
//       let query = sql`
//         SELECT 
//           c.id,
//           c.slug,
//           c.title,
//           c.subtitle,
//           c.short_description,
//           c.description_html,
//           c.instructor_id,
//           c.category_id,
//           c.difficulty_level,
//           c.language,
//           c.content_type,
//           c.thumbnail_url,
//           c.promo_video_url,
//           c.price_cents,
//           c.currency,
//           c.discount_percent,
//           c.original_price_cents,
//           c.has_free_trial,
//           c.trial_duration_days,
//           c.is_published,
//           c.is_featured,
//           c.is_trending,
//           c.is_bestseller,
//           c.is_new,
//           c.certificate_available,
//           c.has_lifetime_access,
//           c.allow_downloads,
//           c.has_captions,
//           c.has_transcripts,
//           c.start_date,
//           c.end_date,
//           c.enrollment_capacity,
//           c.requires_approval,
//           c.approval_message,
//           c.access_type,
//           c.total_video_duration,
//           c.total_lessons,
//           c.total_quizzes,
//           c.total_assignments,
//           c.total_downloads,
//           c.total_articles,
          
//           -- Use live subquery for enrollment count
//           (
//             SELECT COUNT(*) 
//             FROM enrollments e 
//             WHERE e.course_id = c.id AND e.status = 'active'
//           ) as enrolled_students_count,
          
//           -- Include rating from reviews
//           COALESCE(
//             (SELECT AVG(rating) 
//              FROM course_reviews cr 
//              WHERE cr.course_id = c.id 
//              AND cr.rating > 0),
//             c.average_rating,
//             0
//           ) as average_rating,
          
//           -- Review count
//           COALESCE(
//             (SELECT COUNT(*) 
//              FROM course_reviews cr 
//              WHERE cr.course_id = c.id 
//              AND cr.rating > 0),
//             0
//           ) as review_count,
          
//           c.total_views,
//           c.completion_rate,
//           c.engagement_score,
//           COALESCE(c.like_count, 0) as like_count,
//           COALESCE(c.share_count, 0) as share_count,
//           c.favorite_count,
//           c.meta_title,
//           c.meta_description,
//           c.search_keywords,
//           c.published_at,
//           c.featured_at,
//           c.trending_at,
//           c.created_at,
//           c.updated_at,
//           u.name as instructor_name,
//           u.email as instructor_email,
//           u.image as instructor_image,
//           u.bio as instructor_bio,
//           cat.name as category_name,
//           cat.slug as category_slug
//         FROM courses c
//         LEFT JOIN users u ON c.instructor_id = u.id
//         LEFT JOIN categories cat ON c.category_id = cat.id
//         WHERE 1=1
//       `;

//       // Add filters
//       if (filters?.is_published) {
//         query = sql`${query} AND c.is_published = true`;
//       }
      
//       if (filters?.is_featured) {
//         query = sql`${query} AND c.is_featured = true`;
//       }
      
//       if (filters?.category_slug) {
//         query = sql`${query} AND cat.slug = ${filters.category_slug}`;
//       }

//       // Add ordering and limit
//       query = sql`${query} ORDER BY c.created_at DESC`;

//       if (filters?.limit) {
//         query = sql`${query} LIMIT ${filters.limit}`;
//       }
      
//       if (filters?.offset) {
//         query = sql`${query} OFFSET ${filters.offset}`;
//       }

//       const rawCourses = await query;
      
//       // Parse numbers
//       courses = rawCourses.map((course: any) => ({
//         ...course,
//         average_rating: parseFloat(course.average_rating),
//         review_count: parseInt(course.review_count),
//         like_count: parseInt(course.like_count),
//         share_count: parseInt(course.share_count),
//         enrolled_students_count: parseInt(course.enrolled_students_count),
//         total_views: parseInt(course.total_views),
//       }));
//     } else {
//       // Use getAllCourses function
//       courses = await getAllCourses(filters);
//     }
    
//     return {
//       success: true,
//       courses
//     };
//   } catch (error: any) {
//     console.error('❌ Error fetching courses:', error);
//     return {
//       success: false,
//       errors: [error.message || 'An unexpected error occurred']
//     };
//   }
// }



// // export async function getCoursesAction(filters?: {
// //   category_slug?: string;
// //   is_published?: boolean;
// //   is_featured?: boolean;
// //   limit?: number;
// //   offset?: number;
// //   include_reviews?: boolean; // Add this parameter
// // }): Promise<{
// //   success: boolean;
// //   courses?: any[];
// //   errors?: string[];
// // }> {
// //   try {
// //     let courses;
    
// //     if (filters?.include_reviews) {
// //       // Use direct SQL query with review ratings
// //       let query = sql`
// //         SELECT 
// //           c.id,
// //           c.slug,
// //           c.title,
// //           c.subtitle,
// //           c.short_description,
// //           c.description_html,
// //           c.instructor_id,
// //           c.category_id,
// //           c.difficulty_level,
// //           c.language,
// //           c.content_type,
// //           c.thumbnail_url,
// //           c.promo_video_url,
// //           c.price_cents,
// //           c.currency,
// //           c.discount_percent,
// //           c.original_price_cents,
// //           c.has_free_trial,
// //           c.trial_duration_days,
// //           c.is_published,
// //           c.is_featured,
// //           c.is_trending,
// //           c.is_bestseller,
// //           c.is_new,
// //           c.certificate_available,
// //           c.has_lifetime_access,
// //           c.allow_downloads,
// //           c.has_captions,
// //           c.has_transcripts,
// //           c.start_date,
// //           c.end_date,
// //           c.enrollment_capacity,
// //           c.requires_approval,
// //           c.approval_message,
// //           c.access_type,
// //           c.total_video_duration,
// //           c.total_lessons,
// //           c.total_quizzes,
// //           c.total_assignments,
// //           c.total_downloads,
// //           c.total_articles,
// //           c.enrolled_students_count,
// //           c.active_students_count,
// //           c.completed_students_count,
          
// //           -- Include rating from reviews
// //           COALESCE(
// //             (SELECT AVG(rating) 
// //              FROM course_reviews cr 
// //              WHERE cr.course_id = c.id 
// //              AND cr.rating > 0),
// //             c.average_rating,
// //             0
// //           ) as average_rating,
          
// //           -- Review count
// //           COALESCE(
// //             (SELECT COUNT(*) 
// //              FROM course_reviews cr 
// //              WHERE cr.course_id = c.id 
// //              AND cr.rating > 0),
// //             0
// //           ) as review_count,
          
// //           c.total_views,
// //           c.completion_rate,
// //           c.engagement_score,
// //           COALESCE(c.like_count, 0) as like_count,
// //           COALESCE(c.share_count, 0) as share_count,
// //           c.favorite_count,
// //           c.meta_title,
// //           c.meta_description,
// //           c.search_keywords,
// //           c.published_at,
// //           c.featured_at,
// //           c.trending_at,
// //           c.created_at,
// //           c.updated_at,
// //           u.name as instructor_name,
// //           u.email as instructor_email,
// //           u.image as instructor_image,
// //           u.bio as instructor_bio,
// //           cat.name as category_name,
// //           cat.slug as category_slug
// //         FROM courses c
// //         LEFT JOIN users u ON c.instructor_id = u.id
// //         LEFT JOIN categories cat ON c.category_id = cat.id
// //         WHERE 1=1
// //       `;

// //       // Add filters
// //       if (filters?.is_published) {
// //         query = sql`${query} AND c.is_published = true`;
// //       }
      
// //       if (filters?.is_featured) {
// //         query = sql`${query} AND c.is_featured = true`;
// //       }
      
// //       if (filters?.category_slug) {
// //         query = sql`${query} AND cat.slug = ${filters.category_slug}`;
// //       }

// //       // Add ordering and limit
// //       query = sql`${query} ORDER BY c.created_at DESC`;

// //       if (filters?.limit) {
// //         query = sql`${query} LIMIT ${filters.limit}`;
// //       }
      
// //       if (filters?.offset) {
// //         query = sql`${query} OFFSET ${filters.offset}`;
// //       }

// //       const rawCourses = await query;
      
// //       // Parse numbers
// //       courses = rawCourses.map((course: any) => ({
// //         ...course,
// //         average_rating: parseFloat(course.average_rating),
// //         review_count: parseInt(course.review_count),
// //         like_count: parseInt(course.like_count),
// //         share_count: parseInt(course.share_count),
// //         enrolled_students_count: parseInt(course.enrolled_students_count),
// //         total_views: parseInt(course.total_views),
// //       }));
// //     } else {
// //       // Original behavior
// //       courses = await getAllCourses(filters);
// //     }
    
// //     return {
// //       success: true,
// //       courses
// //     };
// //   } catch (error: any) {
// //     console.error('❌ Error fetching courses:', error);
// //     return {
// //       success: false,
// //       errors: [error.message || 'An unexpected error occurred']
// //     };
// //   }
// // }

// /**
//  * Get all courses (public)
//  */
// // export async function getCoursesAction(filters?: {
// //   category_slug?: string;
// //   is_published?: boolean;
// //   is_featured?: boolean;
// //   limit?: number;
// //   offset?: number;
// //   include_reviews?: boolean;
// // }): Promise<{
// //   success: boolean;
// //   courses?: any[];
// //   errors?: string[];
// // }> {
// //   try {
// //     const courses = await getAllCourses(filters);
    
// //     return {
// //       success: true,
// //       courses
// //     };
// //   } catch (error: any) {
// //     console.error('❌ Error fetching courses:', error);
// //     return {
// //       success: false,
// //       errors: [error.message || 'An unexpected error occurred']
// //     };
// //   }
// // }

// // /**
// //  * Get course by ID (public)
// //  */
// // export async function getCourseByIdAction(id: string): Promise<{
// //   success: boolean;
// //   course?: any;
// //   errors?: string[];
// // }> {
// //   try {
// //     const course = await getCourseById(id);
    
// //     if (!course) {
// //       return {
// //         success: false,
// //         errors: ['Course not found']
// //       };
// //     }

// //     return {
// //       success: true,
// //       course
// //     };
// //   } catch (error: any) {
// //     console.error('❌ Error fetching course:', error);
// //     return {
// //       success: false,
// //       errors: [error.message || 'An unexpected error occurred']
// //     };
// //   }
// // }


// /**
//  * Get course by slug (public)
//  */
// export async function getCourseBySlugAction(slug: string): Promise<{
//   success: boolean;
//   course?: any;
//   errors?: string[];
// }> {
//   try {
//     const course = await getCourseBySlug(slug);
    
//     if (!course) {
//       return {
//         success: false,
//         errors: ['Course not found']
//       };
//     }

//     return {
//       success: true,
//       course
//     };
//   } catch (error: any) {
//     console.error('❌ Error fetching course:', error);
//     return {
//       success: false,
//       errors: [error.message || 'An unexpected error occurred']
//     };
//   }
// }

// /**
//  * Get course curriculum (public)
//  */
// export async function getCourseCurriculumAction(courseId: string): Promise<{
//   success: boolean;
//   curriculum?: any[];
//   errors?: string[];
// }> {
//   try {
//     const curriculum = await getCourseCurriculum(courseId);
    
//     return {
//       success: true,
//       curriculum
//     };
//   } catch (error: any) {
//     console.error('❌ Error fetching course curriculum:', error);
//     return {
//       success: false,
//       errors: [error.message || 'An unexpected error occurred'],
//       curriculum: []
//     };
//   }
// }


// /**
//  * Get instructor's courses with optional analytics data
//  */
// export async function getInstructorCoursesAction(options?: {
//   includeAnalytics?: boolean;
// }): Promise<{
//   success: boolean;
//   courses?: any[];
//   errors?: string[];
// }> {
//   try {
//     const session = await requireAuth();
    
//     // Get instructor's courses from existing query function
//     const courses = await getInstructorCourses(session.userId); // Fixed function name
    
//     // If analytics are requested, add them to each course
//     if (options?.includeAnalytics) {
//       const coursesWithAnalytics = await Promise.all(
//         courses.map(async (course: any) => {
//           const analytics = await getCourseAnalyticsSummary(course.id, session.userId);
          
//           return {
//             ...course,
//             assessments_count: analytics?.assessments_count || 0,
//             average_quiz_score: analytics?.average_quiz_score || 0,
//             students_passed: analytics?.students_passed || 0,
//             recent_submissions: analytics?.recent_submissions || 0,
//             certificate_eligible: analytics?.certificate_eligible || 0,
//             total_quizzes: analytics?.total_quizzes || 0
//           };
//         })
//       );

//       return {
//         success: true,
//         courses: coursesWithAnalytics
//       };
//     }
    
//     // Return courses without analytics (existing behavior)
//     return {
//       success: true,
//       courses
//     };
//   } catch (error: any) {
//     console.error('❌ Error fetching instructor courses:', error);
//     return {
//       success: false,
//       errors: [error.message || 'An unexpected error occurred']
//     };
//   }
// }

// /**
//  * Alternative method using direct SQL (backward compatibility)
//  */
// export async function getInstructorCoursesActionLegacy(): Promise<{
//   success: boolean;
//   courses?: any[];
//   errors?: string[];
// }> {
//   try {
//     const session = await getSession();
    
//     if (!session || !session.userId) {
//       return { success: false, errors: ['Unauthorized'] };
//     }

//     // Get instructor's courses with analytics
//     const courses = await sql`
//       SELECT 
//         c.*,
//         COUNT(DISTINCT e.id) as students_count,
//         COUNT(DISTINCT m.id) as modules_count,
//         cat.name as category_name
//       FROM courses c
//       LEFT JOIN enrollments e ON c.id = e.course_id AND e.status = 'active'
//       LEFT JOIN modules m ON c.id = m.course_id
//       LEFT JOIN categories cat ON c.category_id = cat.id
//       WHERE c.instructor_id = ${session.userId}
//       GROUP BY c.id, cat.id
//       ORDER BY c.created_at DESC
//     `;

//     // Add analytics data to each course
//     const coursesWithAnalytics = await Promise.all(
//       courses.map(async (course: any) => {
//         const analytics = await getCourseAnalyticsSummary(course.id, session.userId);
        
//         return {
//           ...course,
//           assessments_count: analytics?.assessments_count || 0,
//           average_quiz_score: analytics?.average_quiz_score || 0,
//           students_passed: analytics?.students_passed || 0,
//           recent_submissions: analytics?.recent_submissions || 0,
//           certificate_eligible: analytics?.certificate_eligible || 0,
//           total_quizzes: analytics?.total_quizzes || 0
//         };
//       })
//     );

//     return {
//       success: true,
//       courses: coursesWithAnalytics
//     };
//   } catch (error: any) {
//     console.error('Error fetching instructor courses:', error);
//     return { success: false, errors: [error.message || 'Failed to fetch courses'] };
//   }
// }

// /**
//  * Get instructor's courses
//  */
// // export async function getInstructorCoursesAction(): Promise<{
// //   success: boolean;
// //   courses?: any[];
// //   errors?: string[];
// // }> {
// //   try {
// //     const session = await requireAuth();
    
// //     const courses = await getInstructorCourses(session.userId);
    
// //     return {
// //       success: true,
// //       courses
// //     };
// //   } catch (error: any) {
// //     console.error('❌ Error fetching instructor courses:', error);
// //     return {
// //       success: false,
// //       errors: [error.message || 'An unexpected error occurred']
// //     };
// //   }
// // }



// /**
//  * Create course (instructor only)
//  */
// export async function createCourseAction(courseData: CreateCourseData): Promise<{
//   success: boolean;
//   message: string;
//   course?: any;
//   errors?: string[];
// }> {
//   try {
//     const session = await requireAuth();
    
//     // Check if user is instructor or admin
//     if (!session.roles.includes('instructor') && !session.roles.includes('admin')) {
//       return {
//         success: false,
//         message: 'Access denied',
//         errors: ['Only instructors can create courses']
//       };
//     }

//     return await createCourse(courseData, session.userId);
//   } catch (error: any) {
//     console.error('❌ Error creating course:', error);
//     return {
//       success: false,
//       message: 'Failed to create course',
//       errors: [error.message || 'An unexpected error occurred']
//     };
//   }
// }

// /**
//  * Update course (instructor or admin)
//  */
// export async function updateCourseAction(id: string, courseData: UpdateCourseData): Promise<{
//   success: boolean;
//   message: string;
//   course?: any;
//   errors?: string[];
// }> {
//   try {
//     const session = await requireAuth();

//     // If user is admin, allow updating any course
//     // If user is instructor, only allow updating their own courses
//     const instructorId = session.roles.includes('admin') ? undefined : session.userId;

//     return await updateCourse(id, courseData, instructorId);
//   } catch (error: any) {
//     console.error('❌ Error updating course:', error);
//     return {
//       success: false,
//       message: 'Failed to update course',
//       errors: [error.message || 'An unexpected error occurred']
//     };
//   }
// }

// /**
//  * Delete course (instructor or admin)
//  */
// export async function deleteCourseAction(id: string): Promise<{
//   success: boolean;
//   message: string;
//   errors?: string[];
// }> {
//   try {
//     const session = await requireAuth();

//     // If user is admin, allow deleting any course
//     // If user is instructor, only allow deleting their own courses
//     const instructorId = session.roles.includes('admin') ? undefined : session.userId;

//     return await deleteCourse(id, instructorId);
//   } catch (error: any) {
//     console.error('❌ Error deleting course:', error);
//     return {
//       success: false,
//       message: 'Failed to delete course',
//       errors: [error.message || 'An unexpected error occurred']
//     };
//   }
// }

// /**
//  * Publish course (instructor only)
//  */
// export async function publishCourseAction(id: string): Promise<{
//   success: boolean;
//   message: string;
//   course?: any;
//   errors?: string[];
// }> {
//   try {
//     const session = await requireAuth();

//     // Only instructors can publish courses
//     if (!session.roles.includes('instructor') && !session.roles.includes('admin')) {
//       return {
//         success: false,
//         message: 'Access denied',
//         errors: ['Only instructors can publish courses']
//       };
//     }

//     return await publishCourse(id, session.userId);
//   } catch (error: any) {
//     console.error('❌ Error publishing course:', error);
//     return {
//       success: false,
//       message: 'Failed to publish course',
//       errors: [error.message || 'An unexpected error occurred']
//     };
//   }
// }

// /**
//  * Unpublish course (instructor only)
//  */
// export async function unpublishCourseAction(id: string): Promise<{
//   success: boolean;
//   message: string;
//   course?: any;
//   errors?: string[];
// }> {
//   try {
//     const session = await requireAuth();

//     // Only instructors can unpublish courses
//     if (!session.roles.includes('instructor') && !session.roles.includes('admin')) {
//       return {
//         success: false,
//         message: 'Access denied',
//         errors: ['Only instructors can unpublish courses']
//       };
//     }

//     return await unpublishCourse(id, session.userId);
//   } catch (error: any) {
//     console.error('❌ Error unpublishing course:', error);
//     return {
//       success: false,
//       message: 'Failed to unpublish course',
//       errors: [error.message || 'An unexpected error occurred']
//     };
//   }
// }



// /**
//  * Enroll in a course
//  */
// export async function enrollInCourse(courseId: string): Promise<{
//   success: boolean;
//   message: string;
//   enrollment?: any;
//   errors?: string[];
// }> {
//   try {
//     const session = await requireAuth();
    
//     const result = await enrollUserInCourse(session.userId, courseId);
    
//     if (result.success) {
//       return {
//         success: true,
//         message: 'Successfully enrolled in course',
//         enrollment: result.enrollment
//       };
//     } else {
//       return {
//         success: false,
//         message: 'Failed to enroll in course',
//         errors: result.errors
//       };
//     }
//   } catch (error: any) {
//     console.error('❌ Error enrolling in course:', error);
//     return {
//       success: false,
//       message: 'Failed to enroll in course',
//       errors: [error.message || 'An unexpected error occurred']
//     };
//   }
// }

// /**
//  * Get user's course enrollments
//  */
// export async function getUserCourseEnrollments(): Promise<{
//   success: boolean;
//   enrollments?: any[];
//   errors?: string[];
// }> {
//   try {
//     const session = await requireAuth();
    
//     const enrollments = await getUserEnrollments(session.userId);
    
//     return {
//       success: true,
//       enrollments
//     };
//   } catch (error: any) {
//     console.error('❌ Error fetching user enrollments:', error);
//     return {
//       success: false,
//       errors: [error.message || 'An unexpected error occurred']
//     };
//   }
// }

// /**
//  * Check if user is enrolled in a course
//  */
// export async function checkUserEnrollment(courseId: string): Promise<{
//   success: boolean;
//   isEnrolled?: boolean;
//   enrollment?: any;
//   errors?: string[];
// }> {
//   try {
//     const session = await requireAuth();
    
//     const enrollmentStatus = await checkEnrollmentStatus(session.userId, courseId);
    
//     return {
//       success: true,
//       isEnrolled: enrollmentStatus.isEnrolled,
//       enrollment: enrollmentStatus
//     };
//   } catch (error: any) {
//     console.error('❌ Error checking user enrollment:', error);
//     return {
//       success: false,
//       errors: [error.message || 'An unexpected error occurred']
//     };
//   }
// }

// /**
//  * Get user's progress in a course
//  */
// export async function getUserCourseProgress(courseId: string): Promise<{
//   success: boolean;
//   progress?: any;
//   errors?: string[];
// }> {
//   try {
//     const session = await requireAuth();
    
//     const progress = await getEnrollmentProgress(session.userId, courseId);
    
//     return {
//       success: true,
//       progress
//     };
//   } catch (error: any) {
//     console.error('❌ Error fetching user progress:', error);
//     return {
//       success: false,
//       errors: [error.message || 'An unexpected error occurred']
//     };
//   }
// }







// // /**
// //  * Get trending courses (server action)
// //  */
// // export async function getTrendingCoursesAction(options?: {
// //   limit?: number;
// //   useAlgorithm?: boolean;
// // }): Promise<{
// //   success: boolean;
// //   courses?: any[];
// //   errors?: string[];
// // }> {
// //   try {
// //     const limit = options?.limit || 5;
// //     const useAlgorithm = options?.useAlgorithm ?? true;
    
// //     let courses: any[];
    
// //     // Use the simple query to avoid GROUP BY issues
// //     courses = await getSimpleTrendingCourses(limit);
    
// //     // If no courses returned, fall back to featured courses
// //     if (courses.length === 0) {
// //       console.log('No trending courses found, falling back to featured courses');
// //       const featuredCourses = await sql`
// //         SELECT 
// //           c.id,
// //           c.slug,
// //           c.title,
// //           c.subtitle,
// //           c.short_description,
// //           c.thumbnail_url,
// //           c.price_cents,
// //           c.enrolled_students_count,
// //           c.average_rating,
// //           c.total_video_duration,
// //           u.name as instructor_name,
// //           u.image as instructor_image,
// //           cat.name as category_name
// //         FROM courses c
// //         LEFT JOIN users u ON c.instructor_id = u.id
// //         LEFT JOIN categories cat ON c.category_id = cat.id
// //         WHERE c.is_published = true 
// //           AND c.is_featured = true
// //         ORDER BY COALESCE(c.enrolled_students_count, 0) DESC
// //         LIMIT ${limit}
// //       `;
// //       courses = featuredCourses as any[];
// //     }
    
// //     return {
// //       success: true,
// //       courses
// //     };
// //   } catch (error: any) {
// //     console.error('❌ Error fetching trending courses:', error);
// //     return {
// //       success: false,
// //       errors: [error.message || 'An unexpected error occurred']
// //     };
// //   }
// // }









// /**
//  * Get trending courses (server action) - UPDATED with debug logging
//  */
// export async function getTrendingCoursesAction(options?: {
//   limit?: number;
//   useAlgorithm?: boolean;
// }): Promise<{
//   success: boolean;
//   courses?: any[];
//   errors?: string[];
// }> {
//   try {
//     const limit = options?.limit || 5;
//     const useAlgorithm = options?.useAlgorithm ?? true;
    
//     let courses: any[];
    
//     // Use the simple query to avoid GROUP BY issues
//     courses = await getSimpleTrendingCourses(limit);
    
//     // Debug: Log the courses with their ratings
//     console.log('=== TRENDING COURSES WITH RATINGS ===');
//     courses.forEach((course, index) => {
//       console.log(`${index + 1}. ${course.title}`);
//       console.log(`   Rating: ${course.average_rating} (from reviews)`);
//       console.log(`   Review Count: ${course.review_count}`);
//       console.log(`   Original avg_rating from courses table: ${course.original_avg_rating || 'N/A'}`);
//     });
    
//     // If no courses returned, fall back to featured courses
//     if (courses.length === 0) {
//       console.log('No trending courses found, falling back to featured courses');
//       const featuredCourses = await sql`
//         SELECT 
//           c.id,
//           c.slug,
//           c.title,
//           c.subtitle,
//           c.short_description,
//           c.thumbnail_url,
//           c.price_cents,
//           c.enrolled_students_count,
//           -- Calculate rating from reviews for featured courses too
//           COALESCE(
//             (SELECT AVG(rating) 
//              FROM course_reviews cr 
//              WHERE cr.course_id = c.id 
//              AND cr.status = 'approved'
//              AND cr.rating > 0),
//             c.average_rating,
//             0
//           ) as average_rating,
//           -- Get review count
//           (SELECT COUNT(*) 
//            FROM course_reviews cr 
//            WHERE cr.course_id = c.id 
//            AND cr.status = 'approved') as review_count,
//           c.total_video_duration,
//           u.name as instructor_name,
//           u.image as instructor_image,
//           cat.name as category_name
//         FROM courses c
//         LEFT JOIN users u ON c.instructor_id = u.id
//         LEFT JOIN categories cat ON c.category_id = cat.id
//         WHERE c.is_published = true 
//           AND c.is_featured = true
//         ORDER BY COALESCE(c.enrolled_students_count, 0) DESC
//         LIMIT ${limit}
//       `;
//       courses = featuredCourses as any[];
//     }
    
//     return {
//       success: true,
//       courses
//     };
//   } catch (error: any) {
//     console.error('❌ Error fetching trending courses:', error);
//     return {
//       success: false,
//       errors: [error.message || 'An unexpected error occurred']
//     };
//   }
// }























// // /lib/courses/actions.ts
// # Server actions for course CRUD operations

'use server';

import { 
  getAllCourses, 
  getCourseById, 
  getCourseBySlug, 
  getInstructorCourses,
  createCourse, 
  updateCourse, 
  deleteCourse,
  publishCourse,
  unpublishCourse,

  enrollUserInCourse, 
  getUserEnrollments, 
  checkEnrollmentStatus, 
  getEnrollmentProgress,
  updateEnrollmentProgress 

} from '@/lib/db/queries/courses';
import { getCourseCurriculum } from '@/lib/db/queries/curriculum';
import { requireAuth } from '@/lib/auth/utils';
import type { CreateCourseData, UpdateCourseData } from '@/types/courses';
import { getCourseAnalyticsSummary } from '@/lib/db/queries/course-analytics';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { getTrendingCourses, getSimpleTrendingCourses } from '@/lib/db/queries/trending-courses';


export async function getCoursesAction(filters?: {
  category_slug?: string;
  instructor_username?: string;   // ← ADDED: filter by instructor username from URL
  is_published?: boolean;
  is_featured?: boolean;
  limit?: number;
  offset?: number;
  include_reviews?: boolean;
}): Promise<{
  success: boolean;
  courses?: any[];
  errors?: string[];
}> {
  try {
    let courses;
    
    if (filters?.include_reviews) {
      // Use direct SQL query with review ratings
      let query = sql`
        SELECT 
          c.id,
          c.slug,
          c.title,
          c.subtitle,
          c.short_description,
          c.description_html,
          c.instructor_id,
          c.category_id,
          c.difficulty_level,
          c.language,
          c.content_type,
          c.thumbnail_url,
          c.promo_video_url,
          c.price_cents,
          c.currency,
          c.discount_percent,
          c.original_price_cents,
          c.has_free_trial,
          c.trial_duration_days,
          c.is_published,
          c.is_featured,
          c.is_trending,
          c.is_bestseller,
          c.is_new,
          c.certificate_available,
          c.has_lifetime_access,
          c.allow_downloads,
          c.has_captions,
          c.has_transcripts,
          c.start_date,
          c.end_date,
          c.enrollment_capacity,
          c.requires_approval,
          c.approval_message,
          c.access_type,
          c.total_video_duration,
          c.total_lessons,
          c.total_quizzes,
          c.total_assignments,
          c.total_downloads,
          c.total_articles,
          
          -- Use live subquery for enrollment count
          (
            SELECT COUNT(*) 
            FROM enrollments e 
            WHERE e.course_id = c.id AND e.status = 'active'
          ) as enrolled_students_count,
          
          -- Include rating from reviews
          COALESCE(
            (SELECT AVG(rating) 
             FROM course_reviews cr 
             WHERE cr.course_id = c.id 
             AND cr.rating > 0),
            c.average_rating,
            0
          ) as average_rating,
          
          -- Review count
          COALESCE(
            (SELECT COUNT(*) 
             FROM course_reviews cr 
             WHERE cr.course_id = c.id 
             AND cr.rating > 0),
            0
          ) as review_count,
          
          c.total_views,
          c.completion_rate,
          c.engagement_score,
          COALESCE(c.like_count, 0) as like_count,
          COALESCE(c.share_count, 0) as share_count,
          c.favorite_count,
          c.meta_title,
          c.meta_description,
          c.search_keywords,
          c.published_at,
          c.featured_at,
          c.trending_at,
          c.created_at,
          c.updated_at,
          u.name as instructor_name,
          u.username as instructor_username,
          u.email as instructor_email,
          u.image as instructor_image,
          u.bio as instructor_bio,
          cat.name as category_name,
          cat.slug as category_slug
        FROM courses c
        LEFT JOIN users u ON c.instructor_id = u.id
        LEFT JOIN categories cat ON c.category_id = cat.id
        WHERE 1=1
      `;

      // Add filters
      if (filters?.is_published) {
        query = sql`${query} AND c.is_published = true`;
      }
      
      if (filters?.is_featured) {
        query = sql`${query} AND c.is_featured = true`;
      }
      
      if (filters?.category_slug) {
        query = sql`${query} AND cat.slug = ${filters.category_slug}`;
      }

      // ← ADDED: filter by instructor username
      if (filters?.instructor_username) {
        query = sql`${query} AND u.username = ${filters.instructor_username}`;
      }

      // Add ordering and limit
      query = sql`${query} ORDER BY c.created_at DESC`;

      if (filters?.limit) {
        query = sql`${query} LIMIT ${filters.limit}`;
      }
      
      if (filters?.offset) {
        query = sql`${query} OFFSET ${filters.offset}`;
      }

      const rawCourses = await query;
      
      // Parse numbers
      courses = rawCourses.map((course: any) => ({
        ...course,
        average_rating: parseFloat(course.average_rating),
        review_count: parseInt(course.review_count),
        like_count: parseInt(course.like_count),
        share_count: parseInt(course.share_count),
        enrolled_students_count: parseInt(course.enrolled_students_count),
        total_views: parseInt(course.total_views),
      }));
    } else {
      // Use getAllCourses function
      courses = await getAllCourses(filters);
    }
    
    return {
      success: true,
      courses
    };
  } catch (error: any) {
    console.error('❌ Error fetching courses:', error);
    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}


/**
 * Get course by slug (public)
 */
export async function getCourseBySlugAction(slug: string): Promise<{
  success: boolean;
  course?: any;
  errors?: string[];
}> {
  try {
    const course = await getCourseBySlug(slug);
    
    if (!course) {
      return {
        success: false,
        errors: ['Course not found']
      };
    }

    return {
      success: true,
      course
    };
  } catch (error: any) {
    console.error('❌ Error fetching course:', error);
    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Get course curriculum (public)
 */
export async function getCourseCurriculumAction(courseId: string): Promise<{
  success: boolean;
  curriculum?: any[];
  errors?: string[];
}> {
  try {
    const curriculum = await getCourseCurriculum(courseId);
    
    return {
      success: true,
      curriculum
    };
  } catch (error: any) {
    console.error('❌ Error fetching course curriculum:', error);
    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred'],
      curriculum: []
    };
  }
}


/**
 * Get instructor's courses with optional analytics data
 */
export async function getInstructorCoursesAction(options?: {
  includeAnalytics?: boolean;
}): Promise<{
  success: boolean;
  courses?: any[];
  errors?: string[];
}> {
  try {
    const session = await requireAuth();
    
    // Get instructor's courses from existing query function
    const courses = await getInstructorCourses(session.userId);
    
    // If analytics are requested, add them to each course
    if (options?.includeAnalytics) {
      const coursesWithAnalytics = await Promise.all(
        courses.map(async (course: any) => {
          const analytics = await getCourseAnalyticsSummary(course.id, session.userId);
          
          return {
            ...course,
            assessments_count: analytics?.assessments_count || 0,
            average_quiz_score: analytics?.average_quiz_score || 0,
            students_passed: analytics?.students_passed || 0,
            recent_submissions: analytics?.recent_submissions || 0,
            certificate_eligible: analytics?.certificate_eligible || 0,
            total_quizzes: analytics?.total_quizzes || 0
          };
        })
      );

      return {
        success: true,
        courses: coursesWithAnalytics
      };
    }
    
    // Return courses without analytics (existing behavior)
    return {
      success: true,
      courses
    };
  } catch (error: any) {
    console.error('❌ Error fetching instructor courses:', error);
    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Alternative method using direct SQL (backward compatibility)
 */
export async function getInstructorCoursesActionLegacy(): Promise<{
  success: boolean;
  courses?: any[];
  errors?: string[];
}> {
  try {
    const session = await getSession();
    
    if (!session || !session.userId) {
      return { success: false, errors: ['Unauthorized'] };
    }

    // Get instructor's courses with analytics
    const courses = await sql`
      SELECT 
        c.*,
        COUNT(DISTINCT e.id) as students_count,
        COUNT(DISTINCT m.id) as modules_count,
        cat.name as category_name
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id AND e.status = 'active'
      LEFT JOIN modules m ON c.id = m.course_id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.instructor_id = ${session.userId}
      GROUP BY c.id, cat.id
      ORDER BY c.created_at DESC
    `;

    // Add analytics data to each course
    const coursesWithAnalytics = await Promise.all(
      courses.map(async (course: any) => {
        const analytics = await getCourseAnalyticsSummary(course.id, session.userId);
        
        return {
          ...course,
          assessments_count: analytics?.assessments_count || 0,
          average_quiz_score: analytics?.average_quiz_score || 0,
          students_passed: analytics?.students_passed || 0,
          recent_submissions: analytics?.recent_submissions || 0,
          certificate_eligible: analytics?.certificate_eligible || 0,
          total_quizzes: analytics?.total_quizzes || 0
        };
      })
    );

    return {
      success: true,
      courses: coursesWithAnalytics
    };
  } catch (error: any) {
    console.error('Error fetching instructor courses:', error);
    return { success: false, errors: [error.message || 'Failed to fetch courses'] };
  }
}


/**
 * Create course (instructor only)
 */
export async function createCourseAction(courseData: CreateCourseData): Promise<{
  success: boolean;
  message: string;
  course?: any;
  errors?: string[];
}> {
  try {
    const session = await requireAuth();
    
    // Check if user is instructor or admin
    if (!session.roles.includes('instructor') && !session.roles.includes('admin')) {
      return {
        success: false,
        message: 'Access denied',
        errors: ['Only instructors can create courses']
      };
    }

    return await createCourse(courseData, session.userId);
  } catch (error: any) {
    console.error('❌ Error creating course:', error);
    return {
      success: false,
      message: 'Failed to create course',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Update course (instructor or admin)
 */
export async function updateCourseAction(id: string, courseData: UpdateCourseData): Promise<{
  success: boolean;
  message: string;
  course?: any;
  errors?: string[];
}> {
  try {
    const session = await requireAuth();

    // If user is admin, allow updating any course
    // If user is instructor, only allow updating their own courses
    const instructorId = session.roles.includes('admin') ? undefined : session.userId;

    return await updateCourse(id, courseData, instructorId);
  } catch (error: any) {
    console.error('❌ Error updating course:', error);
    return {
      success: false,
      message: 'Failed to update course',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Delete course (instructor or admin)
 */
export async function deleteCourseAction(id: string): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    const session = await requireAuth();

    // If user is admin, allow deleting any course
    // If user is instructor, only allow deleting their own courses
    const instructorId = session.roles.includes('admin') ? undefined : session.userId;

    return await deleteCourse(id, instructorId);
  } catch (error: any) {
    console.error('❌ Error deleting course:', error);
    return {
      success: false,
      message: 'Failed to delete course',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Publish course (instructor only)
 */
export async function publishCourseAction(id: string): Promise<{
  success: boolean;
  message: string;
  course?: any;
  errors?: string[];
}> {
  try {
    const session = await requireAuth();

    // Only instructors can publish courses
    if (!session.roles.includes('instructor') && !session.roles.includes('admin')) {
      return {
        success: false,
        message: 'Access denied',
        errors: ['Only instructors can publish courses']
      };
    }

    return await publishCourse(id, session.userId);
  } catch (error: any) {
    console.error('❌ Error publishing course:', error);
    return {
      success: false,
      message: 'Failed to publish course',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Unpublish course (instructor only)
 */
export async function unpublishCourseAction(id: string): Promise<{
  success: boolean;
  message: string;
  course?: any;
  errors?: string[];
}> {
  try {
    const session = await requireAuth();

    // Only instructors can unpublish courses
    if (!session.roles.includes('instructor') && !session.roles.includes('admin')) {
      return {
        success: false,
        message: 'Access denied',
        errors: ['Only instructors can unpublish courses']
      };
    }

    return await unpublishCourse(id, session.userId);
  } catch (error: any) {
    console.error('❌ Error unpublishing course:', error);
    return {
      success: false,
      message: 'Failed to unpublish course',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}


/**
 * Enroll in a course
 */
export async function enrollInCourse(courseId: string): Promise<{
  success: boolean;
  message: string;
  enrollment?: any;
  errors?: string[];
}> {
  try {
    const session = await requireAuth();
    
    const result = await enrollUserInCourse(session.userId, courseId);
    
    if (result.success) {
      return {
        success: true,
        message: 'Successfully enrolled in course',
        enrollment: result.enrollment
      };
    } else {
      return {
        success: false,
        message: 'Failed to enroll in course',
        errors: result.errors
      };
    }
  } catch (error: any) {
    console.error('❌ Error enrolling in course:', error);
    return {
      success: false,
      message: 'Failed to enroll in course',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Get user's course enrollments
 */
export async function getUserCourseEnrollments(): Promise<{
  success: boolean;
  enrollments?: any[];
  errors?: string[];
}> {
  try {
    const session = await requireAuth();
    
    const enrollments = await getUserEnrollments(session.userId);
    
    return {
      success: true,
      enrollments
    };
  } catch (error: any) {
    console.error('❌ Error fetching user enrollments:', error);
    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Check if user is enrolled in a course
 */
export async function checkUserEnrollment(courseId: string): Promise<{
  success: boolean;
  isEnrolled?: boolean;
  enrollment?: any;
  errors?: string[];
}> {
  try {
    const session = await requireAuth();
    
    const enrollmentStatus = await checkEnrollmentStatus(session.userId, courseId);
    
    return {
      success: true,
      isEnrolled: enrollmentStatus.isEnrolled,
      enrollment: enrollmentStatus
    };
  } catch (error: any) {
    console.error('❌ Error checking user enrollment:', error);
    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Get user's progress in a course
 */
export async function getUserCourseProgress(courseId: string): Promise<{
  success: boolean;
  progress?: any;
  errors?: string[];
}> {
  try {
    const session = await requireAuth();
    
    const progress = await getEnrollmentProgress(session.userId, courseId);
    
    return {
      success: true,
      progress
    };
  } catch (error: any) {
    console.error('❌ Error fetching user progress:', error);
    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}


/**
 * Get trending courses (server action) - UPDATED with debug logging
 */
export async function getTrendingCoursesAction(options?: {
  limit?: number;
  useAlgorithm?: boolean;
}): Promise<{
  success: boolean;
  courses?: any[];
  errors?: string[];
}> {
  try {
    const limit = options?.limit || 5;
    const useAlgorithm = options?.useAlgorithm ?? true;
    
    let courses: any[];
    
    // Use the simple query to avoid GROUP BY issues
    courses = await getSimpleTrendingCourses(limit);
    
    // Debug: Log the courses with their ratings
    console.log('=== TRENDING COURSES WITH RATINGS ===');
    courses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.title}`);
      console.log(`   Rating: ${course.average_rating} (from reviews)`);
      console.log(`   Review Count: ${course.review_count}`);
      console.log(`   Original avg_rating from courses table: ${course.original_avg_rating || 'N/A'}`);
    });
    
    // If no courses returned, fall back to featured courses
    if (courses.length === 0) {
      console.log('No trending courses found, falling back to featured courses');
      const featuredCourses = await sql`
        SELECT 
          c.id,
          c.slug,
          c.title,
          c.subtitle,
          c.short_description,
          c.thumbnail_url,
          c.price_cents,
          c.enrolled_students_count,
          -- Calculate rating from reviews for featured courses too
          COALESCE(
            (SELECT AVG(rating) 
             FROM course_reviews cr 
             WHERE cr.course_id = c.id 
             AND cr.status = 'approved'
             AND cr.rating > 0),
            c.average_rating,
            0
          ) as average_rating,
          -- Get review count
          (SELECT COUNT(*) 
           FROM course_reviews cr 
           WHERE cr.course_id = c.id 
           AND cr.status = 'approved') as review_count,
          c.total_video_duration,
          u.name as instructor_name,
          u.image as instructor_image,
          cat.name as category_name
        FROM courses c
        LEFT JOIN users u ON c.instructor_id = u.id
        LEFT JOIN categories cat ON c.category_id = cat.id
        WHERE c.is_published = true 
          AND c.is_featured = true
        ORDER BY COALESCE(c.enrolled_students_count, 0) DESC
        LIMIT ${limit}
      `;
      courses = featuredCourses as any[];
    }
    
    return {
      success: true,
      courses
    };
  } catch (error: any) {
    console.error('❌ Error fetching trending courses:', error);
    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}
