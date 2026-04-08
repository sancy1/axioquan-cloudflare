// /lib/db/queries/unenrollment.ts - COMPREHENSIVE CASCADE DELETE
import { sql } from '../index';

interface DeleteStats {
  assessment_results: number;
  assessment_attempts: number;
  review_reactions: number;
  review_replies: number;
  course_reviews: number;
  user_progress: number;
  certificates: number;
  course_likes: number;
  course_shares: number;
  enrollments: number;
}

/**
 * COMPREHENSIVE CASCADE DELETE
 * Deletes all user data related to a course enrollment across all dependent tables.
 * This ensures when a student re-enrolls, they have a completely clean state.
 * Respects foreign key constraints through proper deletion order.
 */
async function cascadeDeleteEnrollmentData(
  userId: string,
  courseId: string,
  enrollmentId?: string
): Promise<{ stats: DeleteStats; errors: string[] }> {
  const stats: DeleteStats = {
    assessment_results: 0,
    assessment_attempts: 0,
    review_reactions: 0,
    review_replies: 0,
    course_reviews: 0,
    user_progress: 0,
    certificates: 0,
    course_likes: 0,
    course_shares: 0,
    enrollments: 0,
  };
  
  const errors: string[] = [];

  try {
    // ─────────────────────────────────────────────────────────────
    // Step 1: Get enrollment ID if not provided (needed for some FKs)
    // ─────────────────────────────────────────────────────────────
    let finalEnrollmentId = enrollmentId;
    
    if (!finalEnrollmentId) {
      try {
        const enrollment = await sql`
          SELECT id FROM enrollments 
          WHERE user_id = ${userId} AND course_id = ${courseId}
          LIMIT 1
        `;
        if (enrollment.length > 0) {
          finalEnrollmentId = enrollment[0].id;
        }
      } catch (e) {
        console.log('Note: Could not retrieve enrollment ID, proceeding with user_id/course_id');
      }
    }

    // ─────────────────────────────────────────────────────────────
    // Step 2: Delete assessment_results (depends on assessment_attempts)
    // Foreign Key: assessment_results.attempt_id → assessment_attempts.id
    // ─────────────────────────────────────────────────────────────
    try {
      const assessmentAttemptIds = await sql`
        SELECT id FROM assessment_attempts 
        WHERE user_id = ${userId} AND course_id = ${courseId}
      `;
      
      if (assessmentAttemptIds.length > 0) {
        const attemptIds = assessmentAttemptIds.map((row: any) => row.id);
        
        const deleteResults = await sql`
          DELETE FROM assessment_results 
          WHERE attempt_id = ANY(${attemptIds}::uuid[])
          RETURNING id
        `;
        
        stats.assessment_results = deleteResults.length;
        console.log(`✓ Deleted ${stats.assessment_results} assessment result records`);
      }
    } catch (error: any) {
      const msg = `Assessment results cleanup: ${error.message}`;
      console.log(`⚠ ${msg}`);
      errors.push(msg);
    }

    // ─────────────────────────────────────────────────────────────
    // Step 3: Delete assessment_attempts
    // Foreign Keys: 
    //   - assessment_attempts.enrollment_id → enrollments.id
    //   - assessment_attempts.user_id, course_id match
    // ─────────────────────────────────────────────────────────────
    try {
      const deleteResults = await sql`
        DELETE FROM assessment_attempts 
        WHERE user_id = ${userId} AND course_id = ${courseId}
        RETURNING id
      `;
      
      stats.assessment_attempts = deleteResults.length;
      console.log(`✓ Deleted ${stats.assessment_attempts} assessment attempt records`);
    } catch (error: any) {
      const msg = `Assessment attempts cleanup: ${error.message}`;
      console.log(`⚠ ${msg}`);
      errors.push(msg);
    }

    // ─────────────────────────────────────────────────────────────
    // Step 4: Delete review reactions for user's reviews
    // Foreign Key: review_reactions.review_id → course_reviews.id
    // ─────────────────────────────────────────────────────────────
    try {
      const userReviewIds = await sql`
        SELECT id FROM course_reviews 
        WHERE user_id = ${userId} AND course_id = ${courseId}
      `;
      
      if (userReviewIds.length > 0) {
        const reviewIds = userReviewIds.map((row: any) => row.id);
        
        const deleteResults = await sql`
          DELETE FROM review_reactions 
          WHERE review_id = ANY(${reviewIds}::uuid[])
          RETURNING id
        `;
        
        stats.review_reactions = deleteResults.length;
        console.log(`✓ Deleted ${stats.review_reactions} review reaction records`);
      }
    } catch (error: any) {
      const msg = `Review reactions cleanup: ${error.message}`;
      console.log(`⚠ ${msg}`);
      errors.push(msg);
    }

    // ─────────────────────────────────────────────────────────────
    // Step 5: Delete review replies for user's reviews
    // Foreign Key: review_replies.review_id → course_reviews.id
    // ─────────────────────────────────────────────────────────────
    try {
      const userReviewIds = await sql`
        SELECT id FROM course_reviews 
        WHERE user_id = ${userId} AND course_id = ${courseId}
      `;
      
      if (userReviewIds.length > 0) {
        const reviewIds = userReviewIds.map((row: any) => row.id);
        
        const deleteResults = await sql`
          DELETE FROM review_replies 
          WHERE review_id = ANY(${reviewIds}::uuid[])
          RETURNING id
        `;
        
        stats.review_replies = deleteResults.length;
        console.log(`✓ Deleted ${stats.review_replies} review reply records`);
      }
    } catch (error: any) {
      const msg = `Review replies cleanup: ${error.message}`;
      console.log(`⚠ ${msg}`);
      errors.push(msg);
    }

    // ─────────────────────────────────────────────────────────────
    // Step 6: Delete course reviews by this user for this course
    // ─────────────────────────────────────────────────────────────
    try {
      const deleteResults = await sql`
        DELETE FROM course_reviews 
        WHERE user_id = ${userId} AND course_id = ${courseId}
        RETURNING id
      `;
      
      stats.course_reviews = deleteResults.length;
      console.log(`✓ Deleted ${stats.course_reviews} course review records`);
    } catch (error: any) {
      const msg = `Course reviews cleanup: ${error.message}`;
      console.log(`⚠ ${msg}`);
      errors.push(msg);
    }

    // ─────────────────────────────────────────────────────────────
    // Step 7: Delete user progress
    // Foreign Key: user_progress.enrollment_id → enrollments.id (if exists)
    // ─────────────────────────────────────────────────────────────
    try {
      const deleteResults = await sql`
        DELETE FROM user_progress 
        WHERE user_id = ${userId} AND course_id = ${courseId}
        RETURNING id
      `;
      
      stats.user_progress = deleteResults.length;
      console.log(`✓ Deleted ${stats.user_progress} user progress records`);
    } catch (error: any) {
      const msg = `User progress cleanup: ${error.message}`;
      console.log(`⚠ ${msg}`);
      errors.push(msg);
    }

    // ─────────────────────────────────────────────────────────────
    // Step 8: Delete certificates
    // Foreign Key: certificates.enrollment_id → enrollments.id
    // ─────────────────────────────────────────────────────────────
    try {
      const deleteResults = await sql`
        DELETE FROM certificates 
        WHERE user_id = ${userId} AND course_id = ${courseId}
        RETURNING id
      `;
      
      stats.certificates = deleteResults.length;
      console.log(`✓ Deleted ${stats.certificates} certificate records`);
    } catch (error: any) {
      const msg = `Certificates cleanup: ${error.message}`;
      console.log(`⚠ ${msg}`);
      errors.push(msg);
    }

    // ─────────────────────────────────────────────────────────────
    // Step 9: Delete course likes by this user for this course
    // Unique constraint: (course_id, user_id)
    // ─────────────────────────────────────────────────────────────
    try {
      const deleteResults = await sql`
        DELETE FROM course_likes 
        WHERE user_id = ${userId} AND course_id = ${courseId}
        RETURNING id
      `;
      
      stats.course_likes = deleteResults.length;
      console.log(`✓ Deleted ${stats.course_likes} course like records`);
    } catch (error: any) {
      const msg = `Course likes cleanup: ${error.message}`;
      console.log(`⚠ ${msg}`);
      errors.push(msg);
    }

    // ─────────────────────────────────────────────────────────────
    // Step 10: Delete course shares by this user for this course
    // ─────────────────────────────────────────────────────────────
    try {
      const deleteResults = await sql`
        DELETE FROM course_shares 
        WHERE user_id = ${userId} AND course_id = ${courseId}
        RETURNING id
      `;
      
      stats.course_shares = deleteResults.length;
      console.log(`✓ Deleted ${stats.course_shares} course share records`);
    } catch (error: any) {
      const msg = `Course shares cleanup: ${error.message}`;
      console.log(`⚠ ${msg}`);
      errors.push(msg);
    }

    // ─────────────────────────────────────────────────────────────
    // Step 11: Finally delete the enrollment record
    // ─────────────────────────────────────────────────────────────
    try {
      const deleteResults = await sql`
        DELETE FROM enrollments 
        WHERE user_id = ${userId} AND course_id = ${courseId}
        RETURNING id
      `;
      
      stats.enrollments = deleteResults.length;
      console.log(`✓ Deleted ${stats.enrollments} enrollment record`);
    } catch (error: any) {
      const msg = `Enrollment deletion: ${error.message}`;
      console.error(`❌ ${msg}`);
      errors.push(msg);
      throw error; // This is critical, must not fail
    }

    return { stats, errors };
  } catch (error: any) {
    console.error('❌ Cascade delete failed at critical step:', error);
    throw error;
  }
}

/**
 * Unenroll/delete user from a course
 * Supports both soft delete (for paid courses) and hard delete with cascade (for free courses)
 */
export async function unenrollUserFromCourse(
  userId: string,
  courseId: string,
  method: 'soft_delete' | 'hard_delete' = 'hard_delete'
): Promise<{ 
  success: boolean; 
  message: string;
  errors?: string[];
  deletedRecords?: Partial<DeleteStats>;
}> {
  try {
    console.log(`[UNENROLL] Starting unenroll: user=${userId}, course=${courseId}, method=${method}`);
    
    // Verify enrollment exists
    const existingEnrollment = await sql`
      SELECT id, status FROM enrollments 
      WHERE user_id = ${userId} AND course_id = ${courseId}
      LIMIT 1
    `;

    if (existingEnrollment.length === 0) {
      return {
        success: false,
        message: 'Enrollment not found',
        errors: ['You are not enrolled in this course']
      };
    }

    const enrollmentId = existingEnrollment[0].id;
    const currentStatus = existingEnrollment[0].status;

    // ─────────────────────────────────────────────────────────────
    // SOFT DELETE: For paid courses (future use)
    // Keep enrollment record but mark as dropped
    // ─────────────────────────────────────────────────────────────
    if (method === 'soft_delete') {
      console.log(`[UNENROLL] Using SOFT DELETE for paid course`);
      
      const result = await sql`
        UPDATE enrollments 
        SET 
          status = 'dropped',
          last_accessed_at = NOW()
        WHERE user_id = ${userId} AND course_id = ${courseId}
        RETURNING id, status
      `;

      if (result.length > 0) {
        return {
          success: true,
          message: 'Successfully unenrolled from course (data archived)',
          deletedRecords: { enrollments: 0 }
        };
      }
    }
    
    // ─────────────────────────────────────────────────────────────
    // HARD DELETE: For free courses (complete data purge)
    // Delete all related records in proper FK order
    // ─────────────────────────────────────────────────────────────
    else {
      console.log(`[UNENROLL] Using HARD DELETE (CASCADE) for free course`);
      
      const { stats, errors } = await cascadeDeleteEnrollmentData(
        userId,
        courseId,
        enrollmentId
      );

      const allErrors = errors.filter(e => e.length > 0);
      const totalRecordsDeleted = Object.values(stats).reduce((sum, val) => sum + val, 0);

      console.log(`[UNENROLL] Cascade complete. Total records deleted: ${totalRecordsDeleted}`);
      console.log(`[UNENROLL] Deletion stats:`, stats);

      if (allErrors.length > 0) {
        console.warn(`[UNENROLL] Some non-critical tables had issues:`, allErrors);
      }

      return {
        success: true,
        message: 'Successfully unenrolled from course (all data purged)',
        deletedRecords: stats,
        errors: allErrors.length > 0 ? allErrors : undefined
      };
    }

    return {
      success: false,
      message: 'Failed to unenroll',
      errors: ['An unexpected error occurred']
    };
  } catch (error: any) {
    console.error('❌ Error in unenrollUserFromCourse:', error);
    return {
      success: false,
      message: 'Failed to unenroll from course',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Check if user can unenroll from a course
 * Note: For FREE courses, this is always true (if enrolled)
 * For PAID courses (future), may have restrictions
 */
export async function canUnenrollFromCourse(
  userId: string,
  courseId: string
): Promise<{
  canUnenroll: boolean;
  reason?: string;
}> {
  try {
    const enrollment = await sql`
      SELECT status, progress_percentage
      FROM enrollments 
      WHERE user_id = ${userId} AND course_id = ${courseId}
      LIMIT 1
    `;

    if (enrollment.length === 0) {
      return {
        canUnenroll: false,
        reason: 'Not enrolled in this course'
      };
    }

    const status = enrollment[0].status;

    // Only prevent if already dropped
    if (status === 'dropped') {
      return {
        canUnenroll: false,
        reason: 'Already unenrolled from this course'
      };
    }

    // For free courses, allow unenroll
    // For paid courses (future): add check for refund eligibility
    return {
      canUnenroll: true,
      reason: 'Can unenroll'
    };
  } catch (error: any) {
    console.error('❌ Error checking unenrollment eligibility:', error);
    return {
      canUnenroll: true, // Allow by default if check fails
      reason: 'Error checking eligibility, allowing unenrollment'
    };
  }
}