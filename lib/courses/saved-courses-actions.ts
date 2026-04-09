'use server';

// /lib/courses/saved-courses-actions.ts

import { getSession } from '@/lib/auth/session';
import { saveCourse, unsaveCourse, isCourseSaved, getSavedCourses } from '@/lib/db/queries/saved-courses';

export async function toggleSaveCourseAction(courseId: string) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return { success: false, requiresAuth: true, message: 'Please sign in to save courses' };
    }

    const saved = await isCourseSaved(session.userId, courseId);

    if (saved) {
      const result = await unsaveCourse(session.userId, courseId);
      return { ...result, saved: false, message: 'Course removed from saved' };
    } else {
      const result = await saveCourse(session.userId, courseId);
      return { ...result, saved: true, message: 'Course saved successfully' };
    }
  } catch (error: any) {
    console.error('❌ toggleSaveCourseAction error:', error);
    return { success: false, message: 'Failed to update saved course' };
  }
}

export async function getIsCourseSavedAction(courseId: string): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session?.userId) return false;
    return isCourseSaved(session.userId, courseId);
  } catch {
    return false;
  }
}

export async function getSavedCoursesAction() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return { success: false, requiresAuth: true, courses: [] };
    }
    const courses = await getSavedCourses(session.userId);
    return { success: true, courses };
  } catch (error: any) {
    console.error('❌ getSavedCoursesAction error:', error);
    return { success: false, courses: [], message: error.message };
  }
}
