
// // /lib/db/queries/courses.ts

// import { sql } from '../index';
// import { Course, CourseTag, CreateCourseData, UpdateCourseData } from '@/types/courses';
// import { CourseEnrollment, EnrollmentStatus, CourseProgress } from '@/types/courses';


// /**
//  * Get all courses with filters
//  */
// export async function getAllCourses(filters?: {
//   category_slug?: string;
//   instructor_id?: string;
//   is_published?: boolean;
//   is_featured?: boolean;
//   limit?: number;
//   offset?: number;
// }): Promise<Course[]> {
//   try {
//     let query = sql`
//       SELECT 
//         c.*,
//         u.name as instructor_name,
//         u.email as instructor_email,
//         u.image as instructor_image,
//         u.bio as instructor_bio,
//         cat.name as category_name,
//         cat.slug as category_slug,
//         -- Get the actual enrollment count from enrollments table
//         (
//           SELECT COUNT(*) 
//           FROM enrollments e 
//           WHERE e.course_id = c.id AND e.status = 'active'
//         ) as enrolled_students_count

//       FROM courses c
//       LEFT JOIN users u ON c.instructor_id = u.id
//       LEFT JOIN categories cat ON c.category_id = cat.id
//       WHERE 1=1
//     `;

//     if (filters?.category_slug) {
//       query = sql`${query} AND cat.slug = ${filters.category_slug}`;
//     }

//     if (filters?.instructor_id) {
//       query = sql`${query} AND c.instructor_id = ${filters.instructor_id}`;
//     }

//     if (filters?.is_published !== undefined) {
//       query = sql`${query} AND c.is_published = ${filters.is_published}`;
//     }

//     if (filters?.is_featured) {
//       query = sql`${query} AND c.is_featured = true`;
//     }

//     query = sql`${query} ORDER BY c.created_at DESC`;

//     if (filters?.limit) {
//       query = sql`${query} LIMIT ${filters.limit}`;
//     }

//     if (filters?.offset) {
//       query = sql`${query} OFFSET ${filters.offset}`;
//     }

//     const courses = await query;
    
//     // Get tags for each course
//     for (const course of courses) {
//       const tags = await sql`
//         SELECT t.* 
//         FROM tags t
//         JOIN course_tags ct ON t.id = ct.tag_id
//         WHERE ct.course_id = ${course.id}
//       `;
//       course.tags = tags as CourseTag[];
//     }

//     return courses as Course[];
//   } catch (error) {
//     console.error('❌ Error fetching courses:', error);
//     return [];
//   }
// }

// // /**
// //  * Get all courses with filters
// //  */
// // export async function getAllCourses(filters?: {
// //   category_slug?: string;
// //   instructor_id?: string;
// //   is_published?: boolean;
// //   is_featured?: boolean;
// //   limit?: number;
// //   offset?: number;
// // }): Promise<Course[]> {
// //   try {
// //     let query = sql`
// //       SELECT 
// //         c.*,
// //         u.name as instructor_name,
// //         u.email as instructor_email,
// //         u.image as instructor_image,
// //         u.bio as instructor_bio,
// //         cat.name as category_name,
// //         cat.slug as category_slug

// //       FROM courses c
// //       LEFT JOIN users u ON c.instructor_id = u.id
// //       LEFT JOIN categories cat ON c.category_id = cat.id
// //       WHERE 1=1
// //     `;

// //     if (filters?.category_slug) {
// //       query = sql`${query} AND cat.slug = ${filters.category_slug}`;
// //     }

// //     if (filters?.instructor_id) {
// //       query = sql`${query} AND c.instructor_id = ${filters.instructor_id}`;
// //     }

// //     if (filters?.is_published !== undefined) {
// //       query = sql`${query} AND c.is_published = ${filters.is_published}`;
// //     }

// //     if (filters?.is_featured) {
// //       query = sql`${query} AND c.is_featured = true`;
// //     }

// //     query = sql`${query} ORDER BY c.created_at DESC`;

// //     if (filters?.limit) {
// //       query = sql`${query} LIMIT ${filters.limit}`;
// //     }

// //     if (filters?.offset) {
// //       query = sql`${query} OFFSET ${filters.offset}`;
// //     }

// //     const courses = await query;
    
// //     // Get tags for each course
// //     for (const course of courses) {
// //       const tags = await sql`
// //         SELECT t.* 
// //         FROM tags t
// //         JOIN course_tags ct ON t.id = ct.tag_id
// //         WHERE ct.course_id = ${course.id}
// //       `;
// //       course.tags = tags as CourseTag[];
// //     }

// //     return courses as Course[];
// //   } catch (error) {
// //     console.error('❌ Error fetching courses:', error);
// //     return [];
// //   }
// // }



// /**
//  * Get course by ID
//  */
// export async function getCourseById(id: string): Promise<Course | null> {
//   try {
//     const courses = await sql`
//       SELECT 
//         c.*,
//         u.name as instructor_name,
//         u.email as instructor_email,
//         u.image as instructor_image,
//         u.bio as instructor_bio,
//         cat.name as category_name,
//         cat.slug as category_slug,
//         -- Get the actual enrollment count from enrollments table
//         (
//           SELECT COUNT(*) 
//           FROM enrollments e 
//           WHERE e.course_id = c.id AND e.status = 'active'
//         ) as enrolled_students_count
//       FROM courses c
//       LEFT JOIN users u ON c.instructor_id = u.id
//       LEFT JOIN categories cat ON c.category_id = cat.id
//       WHERE c.id = ${id}
//       LIMIT 1
//     `;

//     if (courses.length === 0) return null;

//     const course = courses[0];
    
//     // Get tags for the course
//     const tags = await sql`
//       SELECT t.* 
//       FROM tags t
//       JOIN course_tags ct ON t.id = ct.tag_id
//       WHERE ct.course_id = ${course.id}
//     `;
    
//     return {
//       ...course,
//       tags: tags as CourseTag[]
//     } as Course;
//   } catch (error) {
//     console.error('❌ Error fetching course by ID:', error);
//     return null;
//   }
// }

// // /**
// //  * Get course by ID
// //  */
// // export async function getCourseById(id: string): Promise<Course | null> {
// //   try {
// //     const courses = await sql`
// //       SELECT 
// //         c.*,
// //         u.name as instructor_name,
// //         u.email as instructor_email,
// //         u.image as instructor_image,
// //         u.bio as instructor_bio,
// //         cat.name as category_name,
// //         cat.slug as category_slug

// //       FROM courses c
// //       LEFT JOIN users u ON c.instructor_id = u.id
// //       LEFT JOIN categories cat ON c.category_id = cat.id
// //       WHERE c.id = ${id}
// //       LIMIT 1
// //     `;

// //     if (courses.length === 0) return null;

// //     const course = courses[0];
    
// //     // Get tags for the course
// //     const tags = await sql`
// //       SELECT t.* 
// //       FROM tags t
// //       JOIN course_tags ct ON t.id = ct.tag_id
// //       WHERE ct.course_id = ${course.id}
// //     `;
    
// //     return {
// //       ...course,
// //       tags: tags as CourseTag[]
// //     } as Course;
// //   } catch (error) {
// //     console.error('❌ Error fetching course by ID:', error);
// //     return null;
// //   }
// // }


// // Update your getCourseBySlug function in /lib/db/queries/courses.ts

// /**
//  * Get course by slug
//  */
// export async function getCourseBySlug(slug: string): Promise<Course | null> {
//   try {
//     const courses = await sql`
//       SELECT 
//         c.*,
//         u.name as instructor_name,
//         u.email as instructor_email,
//         u.image as instructor_image,
//         u.bio as instructor_bio,
//         cat.name as category_name,
//         cat.slug as category_slug,
//         -- Get the actual enrollment count from enrollments table
//         (
//           SELECT COUNT(*) 
//           FROM enrollments e 
//           WHERE e.course_id = c.id AND e.status = 'active'
//         ) as enrolled_students_count
//       FROM courses c
//       LEFT JOIN users u ON c.instructor_id = u.id
//       LEFT JOIN categories cat ON c.category_id = cat.id
//       WHERE c.slug = ${slug} AND c.is_published = true
//       LIMIT 1
//     `;

//     if (courses.length === 0) return null;

//     const course = courses[0];
    
//     // Get tags for the course
//     const tags = await sql`
//       SELECT t.* 
//       FROM tags t
//       JOIN course_tags ct ON t.id = ct.tag_id
//       WHERE ct.course_id = ${course.id}
//     `;
    
//     return {
//       ...course,
//       tags: tags as CourseTag[]
//     } as Course;
//   } catch (error) {
//     console.error('❌ Error fetching course by slug:', error);
//     return null;
//   }
// }

// // /**
// //  * Get course by slug
// //  */
// // export async function getCourseBySlug(slug: string): Promise<Course | null> {
// //   try {
// //     const courses = await sql`
// //       SELECT 
// //         c.*,
// //         u.name as instructor_name,
// //         u.email as instructor_email,
// //         u.image as instructor_image,
// //         u.bio as instructor_bio,
// //         cat.name as category_name,
// //         cat.slug as category_slug
// //       FROM courses c
// //       LEFT JOIN users u ON c.instructor_id = u.id
// //       LEFT JOIN categories cat ON c.category_id = cat.id
// //       WHERE c.slug = ${slug} AND c.is_published = true
// //       LIMIT 1
// //     `;

// //     if (courses.length === 0) return null;

// //     const course = courses[0];
    
// //     // Get tags for the course
// //     const tags = await sql`
// //       SELECT t.* 
// //       FROM tags t
// //       JOIN course_tags ct ON t.id = ct.tag_id
// //       WHERE ct.course_id = ${course.id}
// //     `;
    
// //     return {
// //       ...course,
// //       tags: tags as CourseTag[]
// //     } as Course;
// //   } catch (error) {
// //     console.error('❌ Error fetching course by slug:', error);
// //     return null;
// //   }
// // }



// /**
//  * Get instructor's courses
//  */
// export async function getInstructorCourses(instructorId: string): Promise<Course[]> {
//   try {
//     const courses = await sql`
//       SELECT 
//         c.*,
//         u.name as instructor_name,
//         u.email as instructor_email,
//         u.image as instructor_image,
//         u.bio as instructor_bio,
//         cat.name as category_name,
//         cat.slug as category_slug,
//         -- Get the actual enrollment count from enrollments table
//         (
//           SELECT COUNT(*) 
//           FROM enrollments e 
//           WHERE e.course_id = c.id AND e.status = 'active'
//         ) as enrolled_students_count

//       FROM courses c
//       LEFT JOIN users u ON c.instructor_id = u.id
//       LEFT JOIN categories cat ON c.category_id = cat.id
//       WHERE c.instructor_id = ${instructorId}
//       ORDER BY c.created_at DESC
//     `;

//     // Get tags for each course
//     for (const course of courses) {
//       const tags = await sql`
//         SELECT t.* 
//         FROM tags t
//         JOIN course_tags ct ON t.id = ct.tag_id
//         WHERE ct.course_id = ${course.id}
//       `;
//       course.tags = tags as CourseTag[];
//     }

//     return courses as Course[];
//   } catch (error) {
//     console.error('❌ Error fetching instructor courses:', error);
//     return [];
//   }
// }

// // /**
// //  * Get instructor's courses
// //  */
// // export async function getInstructorCourses(instructorId: string): Promise<Course[]> {
// //   try {
// //     const courses = await sql`
// //       SELECT 
// //         c.*,
// //         u.name as instructor_name,
// //         u.email as instructor_email,
// //         u.image as instructor_image,
// //         u.bio as instructor_bio,
// //         cat.name as category_name,
// //         cat.slug as category_slug

// //       FROM courses c
// //       LEFT JOIN users u ON c.instructor_id = u.id
// //       LEFT JOIN categories cat ON c.category_id = cat.id
// //       WHERE c.instructor_id = ${instructorId}
// //       ORDER BY c.created_at DESC
// //     `;

// //     // Get tags for each course
// //     for (const course of courses) {
// //       const tags = await sql`
// //         SELECT t.* 
// //         FROM tags t
// //         JOIN course_tags ct ON t.id = ct.tag_id
// //         WHERE ct.course_id = ${course.id}
// //       `;
// //       course.tags = tags as CourseTag[];
// //     }

// //     return courses as Course[];
// //   } catch (error) {
// //     console.error('❌ Error fetching instructor courses:', error);
// //     return [];
// //   }
// // }



// /**
//  * Create a new course
//  */
// export async function createCourse(courseData: CreateCourseData, instructorId: string): Promise<{
//   success: boolean;
//   message: string;
//   course?: Course;
//   errors?: string[];
// }> {
//   try {
//     // Generate slug from title
//     const slug = courseData.title
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, '-')
//       .replace(/(^-|-$)+/g, '');

//     // Check if slug already exists
//     const existing = await sql`
//       SELECT id FROM courses WHERE slug = ${slug} LIMIT 1
//     `;

//     if (existing.length > 0) {
//       return {
//         success: false,
//         message: 'Course creation failed',
//         errors: ['A course with this title already exists']
//       };
//     }


//         const newCourse = await sql`
//       INSERT INTO courses (
//         slug,
//         instructor_id,
//         title,
//         subtitle,
//         description_html,
//         short_description,
//         learning_objectives,
//         prerequisites,
//         target_audience,
//         category_id,
//         difficulty_level,
//         language,
//         content_type,
//         thumbnail_url,
//         promo_video_url,
//         materials_url,               -- ADDED
//         price_cents,
//         certificate_available,
//         has_lifetime_access,
//         allow_downloads,
//         access_type,
//         total_video_duration        -- ✅ ADDED: store duration (minutes)
//       ) VALUES (
//         ${slug},
//         ${instructorId},
//         ${courseData.title},
//         ${courseData.subtitle},
//         ${courseData.description_html},
//         ${courseData.short_description},
//         ${courseData.learning_objectives || []},
//         ${courseData.prerequisites || []},
//         ${courseData.target_audience || []},
//         ${courseData.category_id},
//         ${courseData.difficulty_level || 'beginner'},
//         ${courseData.language || 'English'},
//         ${courseData.content_type || 'video'},
//         ${courseData.thumbnail_url},
//         ${courseData.promo_video_url},
//         ${courseData.materials_url},  -- ADDED
//         ${courseData.price_cents || 0},
//         ${courseData.certificate_available || false},
//         ${courseData.has_lifetime_access || true},
//         ${courseData.allow_downloads || false},
//         ${courseData.access_type || 'open'},
//         ${courseData.total_video_duration || 0}  -- ADDED
//       )
//       RETURNING *
//     `;


//     // const newCourse = await sql`
//     //   INSERT INTO courses (
//     //     slug,
//     //     instructor_id,
//     //     title,
//     //     subtitle,
//     //     description_html,
//     //     short_description,
//     //     learning_objectives,
//     //     prerequisites,
//     //     target_audience,
//     //     category_id,
//     //     difficulty_level,
//     //     language,
//     //     content_type,
//     //     thumbnail_url,
//     //     promo_video_url,
//     //     price_cents,
//     //     certificate_available,
//     //     has_lifetime_access,
//     //     allow_downloads,
//     //     access_type
//     //   ) VALUES (
//     //     ${slug},
//     //     ${instructorId},
//     //     ${courseData.title},
//     //     ${courseData.subtitle},
//     //     ${courseData.description_html},
//     //     ${courseData.short_description},
//     //     ${courseData.learning_objectives || []},
//     //     ${courseData.prerequisites || []},
//     //     ${courseData.target_audience || []},
//     //     ${courseData.category_id},
//     //     ${courseData.difficulty_level || 'beginner'},
//     //     ${courseData.language || 'English'},
//     //     ${courseData.content_type || 'video'},
//     //     ${courseData.thumbnail_url},
//     //     ${courseData.promo_video_url},
//     //     ${courseData.price_cents || 0},
//     //     ${courseData.certificate_available || false},
//     //     ${courseData.has_lifetime_access || true},
//     //     ${courseData.allow_downloads || false},
//     //     ${courseData.access_type || 'open'}
//     //   )
//     //   RETURNING *
//     // `;

//     const course = newCourse[0] as Course;

//     // Add tags if provided
//     if (courseData.tag_ids && courseData.tag_ids.length > 0) {
//       for (const tagId of courseData.tag_ids) {
//         await sql`
//           INSERT INTO course_tags (course_id, tag_id)
//           VALUES (${course.id}, ${tagId})
//         `;
//       }
//     }

//     return {
//       success: true,
//       message: 'Course created successfully',
//       course
//     };
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
//  * Update course
//  */
// export async function updateCourse(id: string, courseData: UpdateCourseData, instructorId?: string): Promise<{
//   success: boolean;
//   message: string;
//   course?: Course;
//   errors?: string[];
// }> {
//   try {
//     // Check if course exists and belongs to instructor (if instructorId provided)
//     let courseCheck;
//     if (instructorId) {
//       courseCheck = await sql`
//         SELECT id FROM courses WHERE id = ${id} AND instructor_id = ${instructorId} LIMIT 1
//       `;
//     } else {
//       courseCheck = await sql`
//         SELECT id FROM courses WHERE id = ${id} LIMIT 1
//       `;
//     }

//     if (courseCheck.length === 0) {
//       return {
//         success: false,
//         message: 'Course update failed',
//         errors: ['Course not found or access denied']
//       };
//     }

//     // Generate new slug if title is being updated
//     let slug;
//     if (courseData.title) {
//       slug = courseData.title
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, '-')
//         .replace(/(^-|-$)+/g, '');

//       // Check if new slug already exists (excluding current course)
//       const existing = await sql`
//         SELECT id FROM courses WHERE slug = ${slug} AND id != ${id} LIMIT 1
//       `;

//       if (existing.length > 0) {
//         return {
//           success: false,
//           message: 'Course update failed',
//           errors: ['A course with this title already exists']
//         };
//       }
//     }

//     const updatedCourse = await sql`
//       UPDATE courses 
//       SET 
//         title = COALESCE(${courseData.title}, title),
//         subtitle = COALESCE(${courseData.subtitle}, subtitle),
//         description_html = COALESCE(${courseData.description_html}, description_html),
//         short_description = COALESCE(${courseData.short_description}, short_description),
//         learning_objectives = COALESCE(${courseData.learning_objectives}, learning_objectives),
//         prerequisites = COALESCE(${courseData.prerequisites}, prerequisites),
//         target_audience = COALESCE(${courseData.target_audience}, target_audience),
//         category_id = ${courseData.category_id},
//         difficulty_level = COALESCE(${courseData.difficulty_level}, difficulty_level),
//         language = COALESCE(${courseData.language}, language),
//         content_type = COALESCE(${courseData.content_type}, content_type),
//         thumbnail_url = COALESCE(${courseData.thumbnail_url}, thumbnail_url),
//         promo_video_url = COALESCE(${courseData.promo_video_url}, promo_video_url),
//         materials_url = COALESCE(${courseData.materials_url}, materials_url), 
//         price_cents = COALESCE(${courseData.price_cents}, price_cents),
//         certificate_available = COALESCE(${courseData.certificate_available}, certificate_available),
//         has_lifetime_access = COALESCE(${courseData.has_lifetime_access}, has_lifetime_access),
//         allow_downloads = COALESCE(${courseData.allow_downloads}, allow_downloads),
//         access_type = COALESCE(${courseData.access_type}, access_type),
//         is_published = COALESCE(${courseData.is_published}, is_published),
//         total_video_duration = COALESCE(${courseData.total_video_duration}, total_video_duration), -- ✅ ADDED
//         slug = COALESCE(${slug}, slug),
//         updated_at = NOW()
//       WHERE id = ${id}
//       RETURNING *
//     `;

//     if (updatedCourse.length === 0) {
//       return {
//         success: false,
//         message: 'Course not found',
//         errors: ['Course not found']
//       };
//     }

//     // Update tags if provided
//     if (courseData.tag_ids) {
//       // Remove existing tags
//       await sql`DELETE FROM course_tags WHERE course_id = ${id}`;
      
//       // Add new tags
//       if (courseData.tag_ids.length > 0) {
//         for (const tagId of courseData.tag_ids) {
//           await sql`
//             INSERT INTO course_tags (course_id, tag_id)
//             VALUES (${id}, ${tagId})
//           `;
//         }
//       }
//     }

//     return {
//       success: true,
//       message: 'Course updated successfully',
//       course: updatedCourse[0] as Course
//     };
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
//  * Delete course
//  */
// export async function deleteCourse(id: string, instructorId?: string): Promise<{
//   success: boolean;
//   message: string;
//   errors?: string[];
// }> {
//   try {
//     // Check if course exists and belongs to instructor (if instructorId provided)
//     let courseCheck;
//     if (instructorId) {
//       courseCheck = await sql`
//         SELECT id FROM courses WHERE id = ${id} AND instructor_id = ${instructorId} LIMIT 1
//       `;
//     } else {
//       courseCheck = await sql`
//         SELECT id FROM courses WHERE id = ${id} LIMIT 1
//       `;
//     }

//     if (courseCheck.length === 0) {
//       return {
//         success: false,
//         message: 'Course deletion failed',
//         errors: ['Course not found or access denied']
//       };
//     }

//     // Delete course tags first
//     await sql`DELETE FROM course_tags WHERE course_id = ${id}`;

//     // Delete course
//     const result = await sql`
//       DELETE FROM courses WHERE id = ${id}
//       RETURNING id
//     `;

//     if (result.length === 0) {
//       return {
//         success: false,
//         message: 'Course not found',
//         errors: ['Course not found']
//       };
//     }

//     return {
//       success: true,
//       message: 'Course deleted successfully'
//     };
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
//  * Publish course
//  */
// export async function publishCourse(id: string, instructorId: string): Promise<{
//   success: boolean;
//   message: string;
//   course?: Course;
//   errors?: string[];
// }> {
//   try {
//     const result = await sql`
//       UPDATE courses 
//       SET 
//         is_published = true,
//         published_at = NOW(),
//         updated_at = NOW()
//       WHERE id = ${id} AND instructor_id = ${instructorId}
//       RETURNING *
//     `;

//     if (result.length === 0) {
//       return {
//         success: false,
//         message: 'Course not found or access denied',
//         errors: ['Course not found or access denied']
//       };
//     }

//     return {
//       success: true,
//       message: 'Course published successfully',
//       course: result[0] as Course
//     };
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
//  * Unpublish course
//  */
// export async function unpublishCourse(id: string, instructorId: string): Promise<{
//   success: boolean;
//   message: string;
//   course?: Course;
//   errors?: string[];
// }> {
//   try {
//     const result = await sql`
//       UPDATE courses 
//       SET 
//         is_published = false,
//         updated_at = NOW()
//       WHERE id = ${id} AND instructor_id = ${instructorId}
//       RETURNING *
//     `;

//     if (result.length === 0) {
//       return {
//         success: false,
//         message: 'Course not found or access denied',
//         errors: ['Course not found or access denied']
//       };
//     }

//     return {
//       success: true,
//       message: 'Course unpublished successfully',
//       course: result[0] as Course
//     };
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
//  * Enroll user in a course - UPDATED to handle re-enrollment after unenrollment
//  */
// export async function enrollUserInCourse(
//   userId: string, 
//   courseId: string, 
//   accessType: string = 'full'
// ): Promise<{ success: boolean; enrollment?: CourseEnrollment; errors?: string[] }> {
//   try {
//     // First, check if user has ANY enrollment for this course
//     const existingEnrollment = await sql`
//       SELECT id, status FROM enrollments 
//       WHERE user_id = ${userId} AND course_id = ${courseId}
//       LIMIT 1
//     `;

//     // If user has a dropped enrollment, reactivate it
//     if (existingEnrollment.length > 0) {
//       const enrollment = existingEnrollment[0];
      
//       // If already active or completed, return error
//       if (enrollment.status === 'active' || enrollment.status === 'completed') {
//         return {
//           success: false,
//           errors: ['You are already enrolled in this course']
//         };
//       }
      
//       // If status is 'dropped', reactivate it
//       if (enrollment.status === 'dropped') {
//         console.log(`Reactivating dropped enrollment for user ${userId}, course ${courseId}`);
        
//         const reactivatedEnrollment = await sql`
//           UPDATE enrollments 
//           SET 
//             status = 'active',
//             last_accessed_at = NOW(),
//             -- Reset progress if you want fresh start
//             progress_percentage = 0,
//             completed_lessons = 0,
//             total_time_spent = 0
//           WHERE id = ${enrollment.id}
//           RETURNING *
//         `;
        
//         return {
//           success: true,
//           enrollment: reactivatedEnrollment[0] as CourseEnrollment
//         };
//       }
//     }

//     // If no existing enrollment, create new one
//     // Get course details for new enrollment
//     const course = await sql`
//       SELECT price_cents, total_lessons FROM courses WHERE id = ${courseId} LIMIT 1
//     `;

//     if (course.length === 0) {
//       return {
//         success: false,
//         errors: ['Course not found']
//       };
//     }

//     // Create new enrollment
//     const enrollment = await sql`
//       INSERT INTO enrollments (
//         user_id,
//         course_id,
//         enrolled_price_cents,
//         access_type,
//         status,
//         total_lessons,
//         enrolled_at,
//         last_accessed_at
//       ) VALUES (
//         ${userId},
//         ${courseId},
//         ${course[0].price_cents},
//         ${accessType},
//         'active',
//         ${course[0].total_lessons || 0},
//         NOW(),
//         NOW()
//       )
//       RETURNING *
//     `;

//     return {
//       success: true,
//       enrollment: enrollment[0] as CourseEnrollment
//     };
//   } catch (error: any) {
//     console.error('❌ Error enrolling user in course:', error);
//     return {
//       success: false,
//       errors: [error.message || 'An unexpected error occurred']
//     };
//   }
// }

// // /**
// //  * Enroll user in a course
// //  */
// // export async function enrollUserInCourse(
// //   userId: string, 
// //   courseId: string, 
// //   accessType: string = 'full'
// // ): Promise<{ success: boolean; enrollment?: CourseEnrollment; errors?: string[] }> {
// //   try {
// //     // Check if user is already enrolled
// //     const existingEnrollment = await sql`
// //       SELECT id FROM enrollments 
// //       WHERE user_id = ${userId} AND course_id = ${courseId} AND status = 'active'
// //       LIMIT 1
// //     `;

// //     if (existingEnrollment.length > 0) {
// //       return {
// //         success: false,
// //         errors: ['User is already enrolled in this course']
// //       };
// //     }

// //     // Get course details for enrollment
// //     const course = await sql`
// //       SELECT price_cents, total_lessons FROM courses WHERE id = ${courseId} LIMIT 1
// //     `;

// //     if (course.length === 0) {
// //       return {
// //         success: false,
// //         errors: ['Course not found']
// //       };
// //     }

// //     const enrollment = await sql`
// //       INSERT INTO enrollments (
// //         user_id,
// //         course_id,
// //         enrolled_price_cents,
// //         access_type,
// //         status,
// //         total_lessons,
// //         enrolled_at,
// //         last_accessed_at
// //       ) VALUES (
// //         ${userId},
// //         ${courseId},
// //         ${course[0].price_cents},
// //         ${accessType},
// //         'active',
// //         ${course[0].total_lessons || 0},
// //         NOW(),
// //         NOW()
// //       )
// //       RETURNING *
// //     `;

// //     return {
// //       success: true,
// //       enrollment: enrollment[0] as CourseEnrollment
// //     };
// //   } catch (error: any) {
// //     console.error('❌ Error enrolling user in course:', error);
// //     return {
// //       success: false,
// //       errors: [error.message || 'An unexpected error occurred']
// //     };
// //   }
// // }


// /**
//  * Get user's course enrollments
//  */
// export async function getUserEnrollments(userId: string): Promise<CourseEnrollment[]> {
//   try {
//     const enrollments = await sql`
//       SELECT e.*, c.title as course_title, c.slug as course_slug
//       FROM enrollments e
//       JOIN courses c ON e.course_id = c.id
//       WHERE e.user_id = ${userId} AND e.status = 'active'
//       ORDER BY e.last_accessed_at DESC
//     `;

//     return enrollments as CourseEnrollment[];
//   } catch (error: any) {
//     console.error('❌ Error fetching user enrollments:', error);
//     return [];
//   }
// }

// /**
//  * Check if user is enrolled in a course
//  */
// export async function checkEnrollmentStatus(
//   userId: string, 
//   courseId: string
// ): Promise<EnrollmentStatus> {
//   try {
//     const enrollment = await sql`
//       SELECT id, status, enrolled_at, progress_percentage
//       FROM enrollments 
//       WHERE user_id = ${userId} AND course_id = ${courseId} AND status = 'active'
//       LIMIT 1
//     `;

//     if (enrollment.length === 0) {
//       return { isEnrolled: false };
//     }

//     return {
//       isEnrolled: true,
//       enrollmentId: enrollment[0].id,
//       enrolledAt: enrollment[0].enrolled_at,
//       status: enrollment[0].status,
//       progressPercentage: enrollment[0].progress_percentage
//     };
//   } catch (error: any) {
//     console.error('❌ Error checking enrollment status:', error);
//     return { isEnrolled: false };
//   }
// }

// /**
//  * Get enrollment progress for a user in a course
//  */
// export async function getEnrollmentProgress(
//   userId: string, 
//   courseId: string
// ): Promise<CourseProgress | null> {
//   try {
//     const progress = await sql`
//       SELECT 
//         e.course_id,
//         c.title as course_title,
//         e.progress_percentage,
//         e.completed_lessons,
//         e.total_lessons,
//         e.last_accessed_at,
//         e.current_lesson_id,
//         e.current_module_id,
//         e.total_time_spent
//       FROM enrollments e
//       JOIN courses c ON e.course_id = c.id
//       WHERE e.user_id = ${userId} AND e.course_id = ${courseId} AND e.status = 'active'
//       LIMIT 1
//     `;

//     if (progress.length === 0) {
//       return null;
//     }

//     return {
//       courseId: progress[0].course_id,
//       courseTitle: progress[0].course_title,
//       progressPercentage: progress[0].progress_percentage,
//       completedLessons: progress[0].completed_lessons,
//       totalLessons: progress[0].total_lessons,
//       lastAccessedAt: progress[0].last_accessed_at,
//       currentLessonId: progress[0].current_lesson_id,
//       currentModuleId: progress[0].current_module_id,
//       timeSpent: progress[0].total_time_spent
//     };
//   } catch (error: any) {
//     console.error('❌ Error fetching enrollment progress:', error);
//     return null;
//   }
// }

// /**
//  * Update enrollment progress
//  */
// export async function updateEnrollmentProgress(
//   enrollmentId: string,
//   progressData: {
//     progressPercentage?: number;
//     completedLessons?: number;
//     currentLessonId?: string;
//     currentModuleId?: string;
//     timeSpent?: number;
//   }
// ): Promise<{ success: boolean; errors?: string[] }> {
//   try {
//     await sql`
//       UPDATE enrollments 
//       SET 
//         progress_percentage = COALESCE(${progressData.progressPercentage}, progress_percentage),
//         completed_lessons = COALESCE(${progressData.completedLessons}, completed_lessons),
//         current_lesson_id = COALESCE(${progressData.currentLessonId}, current_lesson_id),
//         current_module_id = COALESCE(${progressData.currentModuleId}, current_module_id),
//         total_time_spent = COALESCE(${progressData.timeSpent}, total_time_spent),
//         last_accessed_at = NOW(),
//         last_activity_at = NOW()
//       WHERE id = ${enrollmentId}
//     `;

//     return { success: true };
//   } catch (error: any) {
//     console.error('❌ Error updating enrollment progress:', error);
//     return {
//       success: false,
//       errors: [error.message || 'An unexpected error occurred']
//     };
//   }
// }














// // Add this function to /lib/db/queries/courses.ts
// export async function getUserCourseProgress(userId: string, courseId: string): Promise<any> {
//   try {
//     const progress = await sql`
//       SELECT 
//         e.progress_percentage as course_progress,
//         e.completed_lessons,
//         e.total_lessons,
//         lp.lesson_id,
//         lp.progress_percentage as lesson_progress,
//         lp.completed as lesson_completed,
//         lp.time_spent,
//         lp.last_position,
//         lp.last_accessed_at
//       FROM enrollments e
//       LEFT JOIN lesson_progress lp ON e.id = lp.enrollment_id
//       WHERE e.user_id = ${userId} 
//         AND e.course_id = ${courseId}
//         AND e.status = 'active'
//     `;

//     return progress;
//   } catch (error) {
//     console.error('❌ Error fetching user course progress:', error);
//     return null;
//   }
// }






































// /lib/db/queries/courses.ts

import { sql } from '../index';
import { Course, CourseTag, CreateCourseData, UpdateCourseData } from '@/types/courses';
import { CourseEnrollment, EnrollmentStatus, CourseProgress } from '@/types/courses';


/**
 * Get all courses with filters
 */
export async function getAllCourses(filters?: {
  category_slug?: string;
  instructor_id?: string;
  is_published?: boolean;
  is_featured?: boolean;
  limit?: number;
  offset?: number;
}): Promise<Course[]> {
  try {
    let query = sql`
      SELECT 
        c.*,
        u.name as instructor_name,
        u.email as instructor_email,
        u.image as instructor_image,
        u.bio as instructor_bio,
        cat.name as category_name,
        cat.slug as category_slug,
        -- Get the actual enrollment count from enrollments table
        (
          SELECT COUNT(*) 
          FROM enrollments e 
          WHERE e.course_id = c.id AND e.status = 'active'
        ) as enrolled_students_count

      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE 1=1
    `;

    if (filters?.category_slug) {
      query = sql`${query} AND cat.slug = ${filters.category_slug}`;
    }

    if (filters?.instructor_id) {
      query = sql`${query} AND c.instructor_id = ${filters.instructor_id}`;
    }

    if (filters?.is_published !== undefined) {
      query = sql`${query} AND c.is_published = ${filters.is_published}`;
    }

    if (filters?.is_featured) {
      query = sql`${query} AND c.is_featured = true`;
    }

    query = sql`${query} ORDER BY c.created_at DESC`;

    if (filters?.limit) {
      query = sql`${query} LIMIT ${filters.limit}`;
    }

    if (filters?.offset) {
      query = sql`${query} OFFSET ${filters.offset}`;
    }

    const courses = await query;
    
    // Get tags for each course
    for (const course of courses) {
      const tags = await sql`
        SELECT t.* 
        FROM tags t
        JOIN course_tags ct ON t.id = ct.tag_id
        WHERE ct.course_id = ${course.id}
      `;
      course.tags = tags as CourseTag[];
    }

    return courses as Course[];
  } catch (error) {
    console.error('❌ Error fetching courses:', error);
    return [];
  }
}

/**
 * Get course details by ID (alias for getCourseById)
 * Used by payment system to fetch course pricing info
 * CRITICAL: Returns course.price_cents which determines if paid or free
 */
export async function getCourseDetails(id: string): Promise<Course | null> {
  return getCourseById(id)
}

/**
 * Get course by ID
 */
export async function getCourseById(id: string): Promise<Course | null> {
  try {
    const courses = await sql`
      SELECT 
        c.*,
        u.name as instructor_name,
        u.email as instructor_email,
        u.image as instructor_image,
        u.bio as instructor_bio,
        cat.name as category_name,
        cat.slug as category_slug,
        -- Get the actual enrollment count from enrollments table
        (
          SELECT COUNT(*) 
          FROM enrollments e 
          WHERE e.course_id = c.id AND e.status = 'active'
        ) as enrolled_students_count
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.id = ${id}
      LIMIT 1
    `;

    if (courses.length === 0) return null;

    const course = courses[0];
    
    // Get tags for the course
    const tags = await sql`
      SELECT t.* 
      FROM tags t
      JOIN course_tags ct ON t.id = ct.tag_id
      WHERE ct.course_id = ${course.id}
    `;
    
    return {
      ...course,
      tags: tags as CourseTag[]
    } as Course;
  } catch (error) {
    console.error('❌ Error fetching course by ID:', error);
    return null;
  }
}

/**
 * Get course by slug
 */
export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const courses = await sql`
      SELECT 
        c.*,
        u.name as instructor_name,
        u.email as instructor_email,
        u.image as instructor_image,
        u.bio as instructor_bio,
        cat.name as category_name,
        cat.slug as category_slug,
        -- Get the actual enrollment count from enrollments table
        (
          SELECT COUNT(*) 
          FROM enrollments e 
          WHERE e.course_id = c.id AND e.status = 'active'
        ) as enrolled_students_count
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.slug = ${slug} AND c.is_published = true
      LIMIT 1
    `;

    if (courses.length === 0) return null;

    const course = courses[0];
    
    // Get tags for the course
    const tags = await sql`
      SELECT t.* 
      FROM tags t
      JOIN course_tags ct ON t.id = ct.tag_id
      WHERE ct.course_id = ${course.id}
    `;
    
    return {
      ...course,
      tags: tags as CourseTag[]
    } as Course;
  } catch (error) {
    console.error('❌ Error fetching course by slug:', error);
    return null;
  }
}




export async function getInstructorCourses(instructorId: string): Promise<Course[]> {
  try {
    const courses = await sql`
      SELECT
        c.id,
        c.slug,
        c.instructor_id,
        c.category_id,
        c.title,
        c.subtitle,
        c.description_html,
        c.short_description,
        c.learning_objectives,
        c.prerequisites,
        c.target_audience,
        c.difficulty_level,
        c.language,
        c.content_type,
        c.thumbnail_url,
        c.promo_video_url,
        c.materials_url,
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
        c.total_views,
        c.completion_rate,
        c.engagement_score,
        COALESCE(c.like_count, 0)   AS like_count,
        COALESCE(c.share_count, 0)  AS share_count,
        c.favorite_count,
        c.meta_title,
        c.meta_description,
        c.search_keywords,
        c.published_at,
        c.featured_at,
        c.trending_at,
        c.created_at,
        c.updated_at,

        -- ── Instructor info ────────────────────────────────────────────
        u.name  AS instructor_name,
        u.email AS instructor_email,
        u.image AS instructor_image,
        u.bio   AS instructor_bio,

        -- ── Category info ──────────────────────────────────────────────
        cat.name AS category_name,
        cat.slug AS category_slug,

        -- ── Live enrollment count ─────────────────────────────────────
        (
          SELECT COUNT(*)
          FROM enrollments e
          WHERE e.course_id = c.id AND e.status = 'active'
        ) AS enrolled_students_count,

        -- ── Live average rating from course_reviews ───────────────────
        COALESCE(
          (
            SELECT ROUND(AVG(cr.rating)::numeric, 1)
            FROM course_reviews cr
            WHERE cr.course_id = c.id
              AND cr.status    = 'active'
              AND cr.is_public = true
              AND cr.rating    > 0
          ),
          0
        ) AS average_rating,

        -- ── Live review count ─────────────────────────────────────────
        COALESCE(
          (
            SELECT COUNT(*)
            FROM course_reviews cr
            WHERE cr.course_id = c.id
              AND cr.status    = 'active'
              AND cr.is_public = true
              AND cr.rating    > 0
          ),
          0
        ) AS review_count

      FROM courses c
      LEFT JOIN users      u   ON c.instructor_id = u.id
      LEFT JOIN categories cat ON c.category_id   = cat.id
      WHERE c.instructor_id = ${instructorId}
      ORDER BY c.created_at DESC
    `;

    // Parse numeric fields that Neon returns as strings
    const parsed = courses.map((course: any) => ({
      ...course,
      average_rating:          parseFloat(course.average_rating)          || 0,
      review_count:            parseInt(course.review_count)              || 0,
      enrolled_students_count: parseInt(course.enrolled_students_count)   || 0,
      like_count:              parseInt(course.like_count)                || 0,
      share_count:             parseInt(course.share_count)               || 0,
      total_views:             parseInt(course.total_views)               || 0,
    }));

    // Get tags for each course (unchanged)
    for (const course of parsed) {
      const tags = await sql`
        SELECT t.*
        FROM tags t
        JOIN course_tags ct ON t.id = ct.tag_id
        WHERE ct.course_id = ${course.id}
      `;
      course.tags = tags as CourseTag[];
    }

    return parsed as Course[];
  } catch (error) {
    console.error('❌ Error fetching instructor courses:', error);
    return [];
  }
}


/**
 * Get instructor's courses
 */
// export async function getInstructorCourses(instructorId: string): Promise<Course[]> {
//   try {
//     const courses = await sql`
//       SELECT 
//         c.*,
//         u.name as instructor_name,
//         u.email as instructor_email,
//         u.image as instructor_image,
//         u.bio as instructor_bio,
//         cat.name as category_name,
//         cat.slug as category_slug,
//         -- Get the actual enrollment count from enrollments table
//         (
//           SELECT COUNT(*) 
//           FROM enrollments e 
//           WHERE e.course_id = c.id AND e.status = 'active'
//         ) as enrolled_students_count

//       FROM courses c
//       LEFT JOIN users u ON c.instructor_id = u.id
//       LEFT JOIN categories cat ON c.category_id = cat.id
//       WHERE c.instructor_id = ${instructorId}
//       ORDER BY c.created_at DESC
//     `;

//     // Get tags for each course
//     for (const course of courses) {
//       const tags = await sql`
//         SELECT t.* 
//         FROM tags t
//         JOIN course_tags ct ON t.id = ct.tag_id
//         WHERE ct.course_id = ${course.id}
//       `;
//       course.tags = tags as CourseTag[];
//     }

//     return courses as Course[];
//   } catch (error) {
//     console.error('❌ Error fetching instructor courses:', error);
//     return [];
//   }
// }


/**
 * Create a new course
 */
export async function createCourse(courseData: CreateCourseData, instructorId: string): Promise<{
  success: boolean;
  message: string;
  course?: Course;
  errors?: string[];
}> {
  try {
    // Generate slug from title
    const slug = courseData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Check if slug already exists
    const existing = await sql`
      SELECT id FROM courses WHERE slug = ${slug} LIMIT 1
    `;

    if (existing.length > 0) {
      return {
        success: false,
        message: 'Course creation failed',
        errors: ['A course with this title already exists']
      };
    }


        const newCourse = await sql`
      INSERT INTO courses (
        slug,
        instructor_id,
        title,
        subtitle,
        description_html,
        short_description,
        learning_objectives,
        prerequisites,
        target_audience,
        category_id,
        difficulty_level,
        language,
        content_type,
        thumbnail_url,
        promo_video_url,
        materials_url,               -- ADDED
        price_cents,
        certificate_available,
        has_lifetime_access,
        allow_downloads,
        access_type,
        total_video_duration        -- ✅ ADDED: store duration (minutes)
      ) VALUES (
        ${slug},
        ${instructorId},
        ${courseData.title},
        ${courseData.subtitle},
        ${courseData.description_html},
        ${courseData.short_description},
        ${courseData.learning_objectives || []},
        ${courseData.prerequisites || []},
        ${courseData.target_audience || []},
        ${courseData.category_id},
        ${courseData.difficulty_level || 'beginner'},
        ${courseData.language || 'English'},
        ${courseData.content_type || 'video'},
        ${courseData.thumbnail_url},
        ${courseData.promo_video_url},
        ${courseData.materials_url},  -- ADDED
        ${courseData.price_cents || 0},
        ${courseData.certificate_available || false},
        ${courseData.has_lifetime_access || true},
        ${courseData.allow_downloads || false},
        ${courseData.access_type || 'open'},
        ${courseData.total_video_duration || 0}  -- ADDED
      )
      RETURNING *
    `;


    const course = newCourse[0] as Course;

    // Add tags if provided
    if (courseData.tag_ids && courseData.tag_ids.length > 0) {
      for (const tagId of courseData.tag_ids) {
        await sql`
          INSERT INTO course_tags (course_id, tag_id)
          VALUES (${course.id}, ${tagId})
        `;
      }
    }

    return {
      success: true,
      message: 'Course created successfully',
      course
    };
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
 * Update course
 */
export async function updateCourse(id: string, courseData: UpdateCourseData, instructorId?: string): Promise<{
  success: boolean;
  message: string;
  course?: Course;
  errors?: string[];
}> {
  try {
    // Check if course exists and belongs to instructor (if instructorId provided)
    let courseCheck;
    if (instructorId) {
      courseCheck = await sql`
        SELECT id FROM courses WHERE id = ${id} AND instructor_id = ${instructorId} LIMIT 1
      `;
    } else {
      courseCheck = await sql`
        SELECT id FROM courses WHERE id = ${id} LIMIT 1
      `;
    }

    if (courseCheck.length === 0) {
      return {
        success: false,
        message: 'Course update failed',
        errors: ['Course not found or access denied']
      };
    }

    // Generate new slug if title is being updated
    let slug;
    if (courseData.title) {
      slug = courseData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      // Check if new slug already exists (excluding current course)
      const existing = await sql`
        SELECT id FROM courses WHERE slug = ${slug} AND id != ${id} LIMIT 1
      `;

      if (existing.length > 0) {
        return {
          success: false,
          message: 'Course update failed',
          errors: ['A course with this title already exists']
        };
      }
    }

    const updatedCourse = await sql`
      UPDATE courses 
      SET 
        title = COALESCE(${courseData.title}, title),
        subtitle = COALESCE(${courseData.subtitle}, subtitle),
        description_html = COALESCE(${courseData.description_html}, description_html),
        short_description = COALESCE(${courseData.short_description}, short_description),
        learning_objectives = COALESCE(${courseData.learning_objectives}, learning_objectives),
        prerequisites = COALESCE(${courseData.prerequisites}, prerequisites),
        target_audience = COALESCE(${courseData.target_audience}, target_audience),
        category_id = ${courseData.category_id},
        difficulty_level = COALESCE(${courseData.difficulty_level}, difficulty_level),
        language = COALESCE(${courseData.language}, language),
        content_type = COALESCE(${courseData.content_type}, content_type),
        thumbnail_url = COALESCE(${courseData.thumbnail_url}, thumbnail_url),
        promo_video_url = COALESCE(${courseData.promo_video_url}, promo_video_url),
        materials_url = COALESCE(${courseData.materials_url}, materials_url), 
        price_cents = COALESCE(${courseData.price_cents}, price_cents),
        certificate_available = COALESCE(${courseData.certificate_available}, certificate_available),
        has_lifetime_access = COALESCE(${courseData.has_lifetime_access}, has_lifetime_access),
        allow_downloads = COALESCE(${courseData.allow_downloads}, allow_downloads),
        access_type = COALESCE(${courseData.access_type}, access_type),
        is_published = COALESCE(${courseData.is_published}, is_published),
        total_video_duration = COALESCE(${courseData.total_video_duration}, total_video_duration), -- ✅ ADDED
        slug = COALESCE(${slug}, slug),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedCourse.length === 0) {
      return {
        success: false,
        message: 'Course not found',
        errors: ['Course not found']
      };
    }

    // Update tags if provided
    if (courseData.tag_ids) {
      // Remove existing tags
      await sql`DELETE FROM course_tags WHERE course_id = ${id}`;
      
      // Add new tags
      if (courseData.tag_ids.length > 0) {
        for (const tagId of courseData.tag_ids) {
          await sql`
            INSERT INTO course_tags (course_id, tag_id)
            VALUES (${id}, ${tagId})
          `;
        }
      }
    }

    return {
      success: true,
      message: 'Course updated successfully',
      course: updatedCourse[0] as Course
    };
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
 * Delete course
 */
export async function deleteCourse(id: string, instructorId?: string): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    // Check if course exists and belongs to instructor (if instructorId provided)
    let courseCheck;
    if (instructorId) {
      courseCheck = await sql`
        SELECT id FROM courses WHERE id = ${id} AND instructor_id = ${instructorId} LIMIT 1
      `;
    } else {
      courseCheck = await sql`
        SELECT id FROM courses WHERE id = ${id} LIMIT 1
      `;
    }

    if (courseCheck.length === 0) {
      return {
        success: false,
        message: 'Course deletion failed',
        errors: ['Course not found or access denied']
      };
    }

    // Delete course tags first
    await sql`DELETE FROM course_tags WHERE course_id = ${id}`;

    // Delete course
    const result = await sql`
      DELETE FROM courses WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return {
        success: false,
        message: 'Course not found',
        errors: ['Course not found']
      };
    }

    return {
      success: true,
      message: 'Course deleted successfully'
    };
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
 * Publish course
 */
export async function publishCourse(id: string, instructorId: string): Promise<{
  success: boolean;
  message: string;
  course?: Course;
  errors?: string[];
}> {
  try {
    const result = await sql`
      UPDATE courses 
      SET 
        is_published = true,
        published_at = NOW(),
        updated_at = NOW()
      WHERE id = ${id} AND instructor_id = ${instructorId}
      RETURNING *
    `;

    if (result.length === 0) {
      return {
        success: false,
        message: 'Course not found or access denied',
        errors: ['Course not found or access denied']
      };
    }

    return {
      success: true,
      message: 'Course published successfully',
      course: result[0] as Course
    };
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
 * Unpublish course
 */
export async function unpublishCourse(id: string, instructorId: string): Promise<{
  success: boolean;
  message: string;
  course?: Course;
  errors?: string[];
}> {
  try {
    const result = await sql`
      UPDATE courses 
      SET 
        is_published = false,
        updated_at = NOW()
      WHERE id = ${id} AND instructor_id = ${instructorId}
      RETURNING *
    `;

    if (result.length === 0) {
      return {
        success: false,
        message: 'Course not found or access denied',
        errors: ['Course not found or access denied']
      };
    }

    return {
      success: true,
      message: 'Course unpublished successfully',
      course: result[0] as Course
    };
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
 * Enroll user in a course - UPDATED to handle re-enrollment after unenrollment
 */
export async function enrollUserInCourse(
  userId: string, 
  courseId: string, 
  accessType: string = 'full'
): Promise<{ success: boolean; enrollment?: CourseEnrollment; errors?: string[] }> {
  try {
    // First, check if user has ANY enrollment for this course
    const existingEnrollment = await sql`
      SELECT id, status FROM enrollments 
      WHERE user_id = ${userId} AND course_id = ${courseId}
      LIMIT 1
    `;

    // If user has a dropped enrollment, reactivate it
    if (existingEnrollment.length > 0) {
      const enrollment = existingEnrollment[0];
      
      // If already active or completed, return error
      if (enrollment.status === 'active' || enrollment.status === 'completed') {
        return {
          success: false,
          errors: ['You are already enrolled in this course']
        };
      }
      
      // If status is 'dropped', reactivate it
      if (enrollment.status === 'dropped') {
        console.log(`Reactivating dropped enrollment for user ${userId}, course ${courseId}`);
        
        const reactivatedEnrollment = await sql`
          UPDATE enrollments 
          SET 
            status = 'active',
            last_accessed_at = NOW(),
            -- Reset progress if you want fresh start
            progress_percentage = 0,
            completed_lessons = 0,
            total_time_spent = 0
          WHERE id = ${enrollment.id}
          RETURNING *
        `;
        
        return {
          success: true,
          enrollment: reactivatedEnrollment[0] as CourseEnrollment
        };
      }
    }

    // If no existing enrollment, create new one
    // Get course details for new enrollment
    const course = await sql`
      SELECT price_cents, total_lessons FROM courses WHERE id = ${courseId} LIMIT 1
    `;

    if (course.length === 0) {
      return {
        success: false,
        errors: ['Course not found']
      };
    }

    // Create new enrollment
    const enrollment = await sql`
      INSERT INTO enrollments (
        user_id,
        course_id,
        enrolled_price_cents,
        access_type,
        status,
        total_lessons,
        enrolled_at,
        last_accessed_at
      ) VALUES (
        ${userId},
        ${courseId},
        ${course[0].price_cents},
        ${accessType},
        'active',
        ${course[0].total_lessons || 0},
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    return {
      success: true,
      enrollment: enrollment[0] as CourseEnrollment
    };
  } catch (error: any) {
    console.error('❌ Error enrolling user in course:', error);
    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}


/**
 * Get user's course enrollments
 */
export async function getUserEnrollments(userId: string): Promise<CourseEnrollment[]> {
  try {
    const enrollments = await sql`
      SELECT e.*, c.title as course_title, c.slug as course_slug
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = ${userId} AND e.status = 'active'
      ORDER BY e.last_accessed_at DESC
    `;

    return enrollments as CourseEnrollment[];
  } catch (error: any) {
    console.error('❌ Error fetching user enrollments:', error);
    return [];
  }
}

/**
 * Check if user is enrolled in a course
 */
export async function checkEnrollmentStatus(
  userId: string, 
  courseId: string
): Promise<EnrollmentStatus> {
  try {
    const enrollment = await sql`
      SELECT id, status, enrolled_at, progress_percentage
      FROM enrollments 
      WHERE user_id = ${userId} AND course_id = ${courseId} AND status = 'active'
      LIMIT 1
    `;

    if (enrollment.length === 0) {
      return { isEnrolled: false };
    }

    return {
      isEnrolled: true,
      enrollmentId: enrollment[0].id,
      enrolledAt: enrollment[0].enrolled_at,
      status: enrollment[0].status,
      progressPercentage: enrollment[0].progress_percentage
    };
  } catch (error: any) {
    console.error('❌ Error checking enrollment status:', error);
    return { isEnrolled: false };
  }
}

/**
 * Get enrollment progress for a user in a course
 */
export async function getEnrollmentProgress(
  userId: string, 
  courseId: string
): Promise<CourseProgress | null> {
  try {
    const progress = await sql`
      SELECT 
        e.course_id,
        c.title as course_title,
        e.progress_percentage,
        e.completed_lessons,
        e.total_lessons,
        e.last_accessed_at,
        e.current_lesson_id,
        e.current_module_id,
        e.total_time_spent
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = ${userId} AND e.course_id = ${courseId} AND e.status = 'active'
      LIMIT 1
    `;

    if (progress.length === 0) {
      return null;
    }

    return {
      courseId: progress[0].course_id,
      courseTitle: progress[0].course_title,
      progressPercentage: progress[0].progress_percentage,
      completedLessons: progress[0].completed_lessons,
      totalLessons: progress[0].total_lessons,
      lastAccessedAt: progress[0].last_accessed_at,
      currentLessonId: progress[0].current_lesson_id,
      currentModuleId: progress[0].current_module_id,
      timeSpent: progress[0].total_time_spent
    };
  } catch (error: any) {
    console.error('❌ Error fetching enrollment progress:', error);
    return null;
  }
}

/**
 * Update enrollment progress
 */
export async function updateEnrollmentProgress(
  enrollmentId: string,
  progressData: {
    progressPercentage?: number;
    completedLessons?: number;
    currentLessonId?: string;
    currentModuleId?: string;
    timeSpent?: number;
  }
): Promise<{ success: boolean; errors?: string[] }> {
  try {
    await sql`
      UPDATE enrollments 
      SET 
        progress_percentage = COALESCE(${progressData.progressPercentage}, progress_percentage),
        completed_lessons = COALESCE(${progressData.completedLessons}, completed_lessons),
        current_lesson_id = COALESCE(${progressData.currentLessonId}, current_lesson_id),
        current_module_id = COALESCE(${progressData.currentModuleId}, current_module_id),
        total_time_spent = COALESCE(${progressData.timeSpent}, total_time_spent),
        last_accessed_at = NOW(),
        last_activity_at = NOW()
      WHERE id = ${enrollmentId}
    `;

    return { success: true };
  } catch (error: any) {
    console.error('❌ Error updating enrollment progress:', error);
    return {
      success: false,
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}


// Add this function to /lib/db/queries/courses.ts
export async function getUserCourseProgress(userId: string, courseId: string): Promise<any> {
  try {
    const progress = await sql`
      SELECT 
        e.progress_percentage as course_progress,
        e.completed_lessons,
        e.total_lessons,
        lp.lesson_id,
        lp.progress_percentage as lesson_progress,
        lp.completed as lesson_completed,
        lp.time_spent,
        lp.last_position,
        lp.last_accessed_at
      FROM enrollments e
      LEFT JOIN lesson_progress lp ON e.id = lp.enrollment_id
      WHERE e.user_id = ${userId} 
        AND e.course_id = ${courseId}
        AND e.status = 'active'
    `;

    return progress;
  } catch (error) {
    console.error('❌ Error fetching user course progress:', error);
    return null;
  }
}




























