
// // src/app/instructors/instructors-actions.ts

// 'use server';

// import { getInstructors, getInstructorCourses } from '@/lib/db/queries/instructors';

// export async function getInstructorsAction(filters?: {
//   search?: string;
//   sortBy?: 'name' | 'popular' | 'courses' | 'rating';
//   limit?: number;
//   offset?: number;
// }) {
//   try {
//     const result = await getInstructors(filters);
//     return { success: true, ...result };
//   } catch (error: any) {
//     return { success: false, instructors: [], total: 0, error: error.message };
//   }
// }

// export async function getInstructorCoursesAction(instructorId: string) {
//   try {
//     const courses = await getInstructorCourses(instructorId);
//     return { success: true, courses };
//   } catch (error: any) {
//     return { success: false, courses: [], error: error.message };
//   }
// }

























// src/app/instructors/instructors-actions.ts
'use server';

import { getInstructors } from '@/lib/db/queries/instructors';
import { getInstructorCourses } from '@/lib/db/queries/courses';  // ← real query

export async function getInstructorsAction(filters?: {
  search?: string;
  sortBy?: 'name' | 'popular' | 'courses' | 'rating';
  limit?: number;
  offset?: number;
}) {
  try {
    const result = await getInstructors(filters);
    return { success: true, ...result };
  } catch (error: any) {
    return { success: false, instructors: [], total: 0, error: error.message };
  }
}

export async function getInstructorCoursesAction(instructorId: string) {
  try {
    // Uses the full getInstructorCourses from courses.ts which returns
    // enrolled_students_count, average_rating, review_count, tags, etc.
    const courses = await getInstructorCourses(instructorId);
    return { success: true, courses };
  } catch (error: any) {
    return { success: false, courses: [], error: error.message };
  }
}
