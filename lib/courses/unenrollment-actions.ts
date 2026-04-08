// /lib/courses/unenrollment-actions.ts - CASCADE DELETE FOR FREE COURSES
'use server';

import { 
  unenrollUserFromCourse, 
  canUnenrollFromCourse
} from '@/lib/db/queries/unenrollment';
import { getSession } from '@/lib/auth/session';

/**
 * Unenroll user from a course (server action)
 * 
 * For FREE COURSES:
 *   - Uses HARD DELETE (cascade) - completely purges all user data
 *   - Upon re-enrollment, student has clean state (as if never took course)
 *   - Deletes: assessments, progress, certificates, reviews, likes, shares, etc.
 * 
 * For PAID COURSES (future):
 *   - Uses SOFT DELETE - keeps enrollment record but marks as 'dropped'
 *   - Preserves payment/refund history
 *   - Prevents fraud/double-payment
 */
export async function unenrollFromCourseAction(
  courseId: string,
  isFreeCourse: boolean = true
): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
  deletedRecords?: any;
}> {
  try {
    const session = await getSession();
    
    if (!session || !session.userId) {
      return {
        success: false,
        message: 'Unauthorized',
        errors: ['You must be logged in']
      };
    }

    console.log(`[UNENROLL ACTION] User ${session.userId} unenrolling from course ${courseId}`);
    
    // For FREE courses: use hard delete (cascade all data)
    // For PAID courses: use soft delete (keep enrollment record for refund history)
    const method = isFreeCourse ? 'hard_delete' : 'soft_delete';

    // Perform unenrollment
    const result = await unenrollUserFromCourse(session.userId, courseId, method);
    
    return result;
  } catch (error: any) {
    console.error('❌ Error in unenroll action:', error);
    return {
      success: false,
      message: 'Failed to unenroll',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}