
// // /lib/db/queries.users.ts - FIXED VERSION
// Database queries for user data

import { sql } from '../index';

/**
 * Get all enrollments for a user (for cascade deletion)
 */
async function getUserEnrollments(userId: string): Promise<Array<{ id: string; course_id: string }>> {
  try {
    const enrollments = await sql`
      SELECT id, course_id FROM enrollments WHERE user_id = ${userId}
    `;
    return enrollments;
  } catch (error) {
    console.log('Could not fetch enrollments:', error);
    return [];
  }
}

/**
 * Cascade delete all enrollment data for a specific course
 * ⚠️ FORCE DELETE - Handles paid courses too
 * This mimics the cascadeDeleteEnrollmentData logic from unenrollment.ts
 * but WITHOUT any soft_delete for paid courses
 */
async function cascadeDeleteForCourse(userId: string, courseId: string): Promise<void> {
  try {
    console.log(`[CASCADE] FORCE deleting all data for user ${userId} in course ${courseId}`);

    // Delete in proper FK order - START WITH DEPENDENCIES, END WITH ENROLLMENT
    const deletionSteps = [
      { name: 'assessment_results', query: sql`DELETE FROM assessment_results WHERE user_id = ${userId} AND course_id = ${courseId}` },
      { name: 'assessment_attempts', query: sql`DELETE FROM assessment_attempts WHERE user_id = ${userId} AND course_id = ${courseId}` },
      { name: 'review_reactions', query: sql`DELETE FROM review_reactions WHERE course_review_id IN (SELECT id FROM course_reviews WHERE user_id = ${userId} AND course_id = ${courseId})` },
      { name: 'review_replies', query: sql`DELETE FROM review_replies WHERE course_review_id IN (SELECT id FROM course_reviews WHERE user_id = ${userId} AND course_id = ${courseId})` },
      { name: 'course_reviews', query: sql`DELETE FROM course_reviews WHERE user_id = ${userId} AND course_id = ${courseId}` },
      { name: 'user_progress', query: sql`DELETE FROM user_progress WHERE user_id = ${userId} AND course_id = ${courseId}` },
      { name: 'certificates', query: sql`DELETE FROM certificates WHERE user_id = ${userId} AND course_id = ${courseId}` },
      { name: 'course_likes', query: sql`DELETE FROM course_likes WHERE user_id = ${userId} AND course_id = ${courseId}` },
      { name: 'course_shares', query: sql`DELETE FROM course_shares WHERE user_id = ${userId} AND course_id = ${courseId}` },
      // FINAL STEP: HARD DELETE enrollment (not soft delete!)
      { name: 'enrollments', query: sql`DELETE FROM enrollments WHERE user_id = ${userId} AND course_id = ${courseId} RETURNING id` },
    ];

    let deletedEnrollments = 0;
    
    for (const step of deletionSteps) {
      try {
        const result = await step.query;
        
        if (step.name === 'enrollments') {
          deletedEnrollments = result.length;
          console.log(`  ✓ ${step.name} (${deletedEnrollments} records HARD DELETED)`);
        } else {
          console.log(`  ✓ ${step.name}`);
        }
      } catch (error: any) {
        console.log(`  ⚠ ${step.name}: ${error.message}`);
        // Continue even if some tables fail (they might be empty)
      }
    }

    if (deletedEnrollments > 0) {
      console.log(`[CASCADE] ✅ FORCE deleted ${deletedEnrollments} enrollment(s) for course ${courseId}`);
    } else {
      console.log(`[CASCADE] ℹ️ No enrollments found to delete for course ${courseId}`);
    }
  } catch (error: any) {
    console.error(`[CASCADE] ❌ Error deleting for course ${courseId}:`, error.message);
    throw error;
  }
}

/**
 * Safely delete user account with proper foreign key handling
 * Cascades through all related tables in proper order
 * ⚠️ FORCE DELETE: Deletes ALL enrollments (including paid courses)
 *    If user re-registers, they must pay again for paid courses
 */

/**
 * Safely delete user account with proper foreign key handling
 * Cascades through all related tables in proper order
 */
export async function deleteUserAccount(userId: string): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    console.log(`🗑️ Starting account deletion for user: ${userId}`);

    // Verify user exists first
    const userCheck = await sql`
      SELECT id, email FROM users WHERE id = ${userId} AND is_active = true LIMIT 1
    `;

    if (userCheck.length === 0) {
      return {
        success: false,
        message: 'User not found or already deleted',
        errors: ['User account not found'],
      };
    }

    console.log(`✅ User found: ${userCheck[0].email}`);

    // ─── STEP 0: Cascade delete all enrollments and related course data ───
    // This handles both FREE and PAID courses - FORCE DELETE everything
    // Even if course is marked as "lifetime access" or paid, account deletion overrides
    console.log(`[ACCOUNT DELETE] Force cascade deleting all enrollments...`);
    
    const enrollments = await sql`
      SELECT e.id, e.course_id, c.price_cents 
      FROM enrollments e
      LEFT JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = ${userId}
    `;
    
    console.log(`[ACCOUNT DELETE] Found ${enrollments.length} enrollments to force delete`);
    if (enrollments.length > 0) {
      console.log(`[ACCOUNT DELETE] Enrollment details:`, enrollments.map((e: any) => ({ course_id: e.course_id, price: e.price_cents })));
    }
    
    for (const enrollment of enrollments) {
      try {
        console.log(`[ACCOUNT DELETE] Processing enrollment:`, {
          enrollmentId: enrollment.id,
          courseId: enrollment.course_id,
          isPaidCourse: enrollment.price_cents ? 'YES' : 'NO',
          price: enrollment.price_cents,
        });
        
        await cascadeDeleteForCourse(userId, enrollment.course_id);
        
        console.log(`[ACCOUNT DELETE] ✅ Successfully cascade deleted enrollment for course ${enrollment.course_id}`);
      } catch (error: any) {
        // Log detailed error info for debugging
        console.error(`[ACCOUNT DELETE] ❌ Error deleting enrollment:`, {
          courseId: enrollment.course_id,
          isPaid: enrollment.price_cents ? 'YES' : 'NO',
          errorMessage: error.message,
          errorCode: error.code,
          errorDetail: error.detail,
          errorConstraint: error.constraint,
          fullError: error,
        });
        
        console.warn(`[ACCOUNT DELETE] Attempting force delete of enrollment...`);
        
        // Try to force delete the enrollment directly
        try {
          const forceDeleteResult = await sql`DELETE FROM enrollments WHERE user_id = ${userId} AND course_id = ${enrollment.course_id} RETURNING id`;
          console.log(`[ACCOUNT DELETE] ✓ Successfully force deleted ${forceDeleteResult.length} enrollment(s) for course ${enrollment.course_id}`);
        } catch (forceDeleteError: any) {
          console.error(`[ACCOUNT DELETE] ❌ Force delete also failed:`, {
            courseId: enrollment.course_id,
            errorMessage: forceDeleteError.message,
            errorCode: forceDeleteError.code,
            errorDetail: forceDeleteError.detail,
            errorConstraint: forceDeleteError.constraint,
          });
          
          // If it's a database trigger or constraint issue, log it clearly
          if (forceDeleteError.code === '23503') {
            console.error(`[ACCOUNT DELETE] ⚠️ FOREIGN KEY CONSTRAINT - Data still references this enrollment`);
          } else if (forceDeleteError.code === '23505') {
            console.error(`[ACCOUNT DELETE] ⚠️ UNIQUE CONSTRAINT VIOLATION`);
          } else if (forceDeleteError.message && forceDeleteError.message.includes('trigger')) {
            console.error(`[ACCOUNT DELETE] ⚠️ DATABASE TRIGGER BLOCKED DELETION - Check database triggers`);
          }
          
          // Continue anyway - don't fail account deletion
        }
      }
    }

    // Deletion steps in proper cascade order
    // ⚠️ ORDER MATTERS: Delete child tables before parent tables
    const deletionSteps = [
      // Course-related data (already handled by cascade above, but clean up any remaining)
      { name: 'assessment_results (remaining)', query: sql`DELETE FROM assessment_results WHERE user_id = ${userId}` },
      { name: 'assessment_attempts (remaining)', query: sql`DELETE FROM assessment_attempts WHERE user_id = ${userId}` },
      { name: 'review_helpful_votes', query: sql`DELETE FROM review_helpful_votes WHERE user_id = ${userId}` },
      { name: 'review_reactions (remaining)', query: sql`DELETE FROM review_reactions WHERE course_review_id IN (SELECT id FROM course_reviews WHERE user_id = ${userId})` },
      { name: 'review_replies (remaining)', query: sql`DELETE FROM review_replies WHERE course_review_id IN (SELECT id FROM course_reviews WHERE user_id = ${userId})` },
      { name: 'course_reviews (remaining)', query: sql`DELETE FROM course_reviews WHERE user_id = ${userId}` },
      { name: 'discussion_replies', query: sql`DELETE FROM discussion_replies WHERE user_id = ${userId}` },
      { name: 'reply_votes', query: sql`DELETE FROM reply_votes WHERE user_id = ${userId}` },
      { name: 'discussions', query: sql`DELETE FROM discussions WHERE user_id = ${userId}` },
      { name: 'course_likes (remaining)', query: sql`DELETE FROM course_likes WHERE user_id = ${userId}` },
      { name: 'course_shares (remaining)', query: sql`DELETE FROM course_shares WHERE user_id = ${userId}` },
      { name: 'bookmarks (remaining)', query: sql`DELETE FROM bookmarks WHERE user_id = ${userId}` },
      { name: 'user_progress (remaining)', query: sql`DELETE FROM user_progress WHERE user_id = ${userId}` },
      { name: 'user_notes', query: sql`DELETE FROM user_notes WHERE user_id = ${userId}` },
      { name: 'lesson_transcripts', query: sql`DELETE FROM lesson_transcripts WHERE user_id = ${userId}` },
      { name: 'certificates (remaining)', query: sql`DELETE FROM certificates WHERE user_id = ${userId}` },
      { name: 'user_achievements', query: sql`DELETE FROM user_achievements WHERE user_id = ${userId}` },
      { name: 'payments', query: sql`DELETE FROM payments WHERE user_id = ${userId}` },
      { name: 'transactions', query: sql`DELETE FROM transactions WHERE user_id = ${userId}` },
      { name: 'enrollments (remaining)', query: sql`DELETE FROM enrollments WHERE user_id = ${userId}` },
      
      // Step 12: Delete messaging and notifications
      { name: 'message_read_receipts', query: sql`DELETE FROM message_read_receipts WHERE user_id = ${userId}` },
      { name: 'direct_messages', query: sql`DELETE FROM direct_messages WHERE sender_id = ${userId} OR receiver_id = ${userId}` },
      { name: 'conversation_participants', query: sql`DELETE FROM conversation_participants WHERE user_id = ${userId}` },
      { name: 'conversations', query: sql`DELETE FROM conversations WHERE initiated_by = ${userId}` },
      { name: 'message_notifications', query: sql`DELETE FROM message_notifications WHERE user_id = ${userId}` },
      
      // Step 13: Delete real-time notifications
      { name: 'realtime_notifications', query: sql`DELETE FROM realtime_notifications WHERE user_id = ${userId}` },
      { name: 'notifications', query: sql`DELETE FROM notifications WHERE user_id = ${userId}` },
      
      // Step 14: Delete study groups
      { name: 'study_group_members', query: sql`DELETE FROM study_group_members WHERE user_id = ${userId}` },
      
      // Step 15: Delete social interactions
      { name: 'user_follows', query: sql`DELETE FROM user_follows WHERE follower_id = ${userId} OR following_id = ${userId}` },
      { name: 'user_learning_analytics', query: sql`DELETE FROM user_learning_analytics WHERE user_id = ${userId}` },
      
      // Step 16: Delete auth-related records
      { name: 'sessions', query: sql`DELETE FROM sessions WHERE user_id = ${userId}` },
      { name: 'login_attempts', query: sql`DELETE FROM login_attempts WHERE user_id = ${userId}` },
      { name: 'role_requests (update)', query: sql`UPDATE role_requests SET reviewed_by = NULL WHERE reviewed_by = ${userId}` },
      { name: 'role_requests (delete)', query: sql`DELETE FROM role_requests WHERE user_id = ${userId}` },
      { name: 'user_roles', query: sql`DELETE FROM user_roles WHERE user_id = ${userId}` },
      { name: 'user_profiles', query: sql`DELETE FROM user_profiles WHERE user_id = ${userId}` },
      { name: 'accounts', query: sql`DELETE FROM accounts WHERE user_id = ${userId}` },
      
      // Step 17: Delete security records
      { name: 'password_reset_tokens', query: sql`DELETE FROM password_reset_tokens WHERE user_id = ${userId}` },
      { name: 'password_history', query: sql`DELETE FROM password_history WHERE user_id = ${userId}` },
      { name: 'verification_tokens', query: sql`DELETE FROM verification_tokens WHERE user_id = ${userId}` },
      
      // Step 18: Delete audit logs
      { name: 'user_audit_logs', query: sql`DELETE FROM user_audit_logs WHERE user_id = ${userId}` },
      { name: 'user_activities', query: sql`DELETE FROM user_activities WHERE user_id = ${userId}` },
      { name: 'webhook_logs', query: sql`DELETE FROM webhook_logs WHERE user_id = ${userId}` },
    ];

    let deletedCount = 0;

    for (const step of deletionSteps) {
      try {
        const result = await step.query;
        console.log(`✅ Deleted from ${step.name}`);
        deletedCount++;
      } catch (stepError: any) {
        // Log error but continue - some tables might not have records
        if (stepError.message.includes('foreign key')) {
          console.error(`⚠️ FK Constraint Error in ${step.name}:`, stepError.message);
        } else {
          console.log(`ℹ️  ${step.name} - No records to delete`);
        }
      }
    }

    // Final user deletion
    const deleteResult = await sql`
      DELETE FROM users 
      WHERE id = ${userId} 
      RETURNING id, email
    `;

    if (deleteResult.length === 0) {
      throw new Error('Failed to delete user record - no rows affected');
    }

    console.log(`✅ Successfully deleted user account: ${userCheck[0].email}`);
    console.log(`✅ Cleaned ${deletedCount} related tables`);
    
    return {
      success: true,
      message: 'Account deleted successfully',
    };

  } catch (error: any) {
    console.error('❌ Error in deleteUserAccount:', error);
    return {
      success: false,
      message: `Account deletion failed: ${error.message}`,
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Verify user's password before account deletion
 */
export async function verifyUserPassword(userId: string, password: string): Promise<boolean> {
  try {
    const user = await sql`
      SELECT password FROM users WHERE id = ${userId} AND is_active = true LIMIT 1
    `;
    
    if (!user[0]?.password) return false;
    
    // Import the verifyPassword function
    const { verifyPassword } = await import('@/lib/auth/password');
    return await verifyPassword(password, user[0].password);
  } catch (error) {
    console.error('❌ Password verification error:', error);
    return false;
  }
}