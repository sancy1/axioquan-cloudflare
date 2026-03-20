
// // /lib/assessments/attempt-actions.ts

// 'use server'

// import { getSession } from '@/lib/auth/session';
// import { 
//   getAssessmentAttemptById,
//   getUserAssessmentAttempts,
//   getActiveAttempt,
//   createAssessmentAttempt as dbCreateAssessmentAttempt,
//   updateAssessmentAttempt as dbUpdateAssessmentAttempt,
//   submitAssessmentAttempt as dbSubmitAssessmentAttempt,
//   getUserCourseAttempts,
//   canUserTakeAssessment as dbCanUserTakeAssessment,
//   getNextAttemptNumber
// } from '@/lib/db/queries/assessment-attempts';
// import { UserAnswer } from '@/types/assessment-attempts';

// /**
//  * Start a new assessment attempt
//  */
// export async function startAssessmentAttempt(assessmentId: string) {
//   try {
//     const session = await getSession();
    
//     if (!session || !session.userId) {
//       return {
//         success: false,
//         message: 'Unauthorized',
//         errors: ['You must be logged in to start an assessment']
//       };
//     }

//     // Check if user can take assessment
//     const accessCheck = await dbCanUserTakeAssessment(session.userId, assessmentId);
//     if (!accessCheck.canTake) {
//       return {
//         success: false,
//         message: 'Cannot start assessment',
//         errors: [accessCheck.reason || 'Unable to start assessment']
//       };
//     }

//     const result = await dbCreateAssessmentAttempt({
//       user_id: session.userId,
//       assessment_id: assessmentId
//     });

//     return result;
//   } catch (error) {
//     console.error('❌ Error starting assessment attempt:', error);
//     return {
//       success: false,
//       message: 'Failed to start assessment attempt',
//       errors: ['An unexpected error occurred']
//     };
//   }
// }

// /**
//  * Get active attempt for current user
//  */
// export async function getCurrentActiveAttempt(assessmentId: string) {
//   try {
//     const session = await getSession();
    
//     if (!session || !session.userId) {
//       return {
//         success: false,
//         message: 'Unauthorized',
//         attempt: null
//       };
//     }

//     const attempt = await getActiveAttempt(session.userId, assessmentId);
    
//     if (!attempt) {
//       return {
//         success: false,
//         message: 'No active attempt found',
//         attempt: null
//       };
//     }

//     return {
//       success: true,
//       message: 'Active attempt retrieved',
//       attempt
//     };
//   } catch (error) {
//     console.error('❌ Error getting active attempt:', error);
//     return {
//       success: false,
//       message: 'Failed to retrieve active attempt',
//       attempt: null
//     };
//   }
// }

// /**
//  * Save attempt progress
//  */
// export async function saveAttemptProgress(
//   attemptId: string, 
//   answers: UserAnswer[], 
//   timeRemaining?: number
// ) {
//   try {
//     const session = await getSession();
    
//     if (!session || !session.userId) {
//       return {
//         success: false,
//         message: 'Unauthorized',
//         errors: ['You must be logged in to save progress']
//       };
//     }

//     // Verify user owns the attempt
//     const attempt = await getAssessmentAttemptById(attemptId);
//     if (!attempt || attempt.user_id !== session.userId) {
//       return {
//         success: false,
//         message: 'Access denied',
//         errors: ['You do not have permission to update this attempt']
//       };
//     }

//     const result = await dbUpdateAssessmentAttempt(attemptId, {
//       answers_json: answers,
//       time_remaining: timeRemaining
//     });

//     return result;
//   } catch (error) {
//     console.error('❌ Error saving attempt progress:', error);
//     return {
//       success: false,
//       message: 'Failed to save progress',
//       errors: ['An unexpected error occurred']
//     };
//   }
// }

// /**
//  * Submit assessment attempt
//  */
// export async function submitAssessmentAttemptAction(
//   attemptId: string, 
//   answers: UserAnswer[], 
//   finalTimeRemaining?: number
// ) {
//   try {
//     const session = await getSession();
    
//     if (!session || !session.userId) {
//       return {
//         success: false,
//         message: 'Unauthorized',
//         errors: ['You must be logged in to submit an assessment']
//       };
//     }

//     // Verify user owns the attempt
//     const attempt = await getAssessmentAttemptById(attemptId);
//     if (!attempt || attempt.user_id !== session.userId) {
//       return {
//         success: false,
//         message: 'Access denied',
//         errors: ['You do not have permission to submit this attempt']
//       };
//     }

//     const result = await dbSubmitAssessmentAttempt(
//       attemptId, 
//       answers, 
//       finalTimeRemaining
//     );

//     return result;
//   } catch (error) {
//     console.error('❌ Error submitting assessment attempt:', error);
//     return {
//       success: false,
//       message: 'Failed to submit assessment',
//       errors: ['An unexpected error occurred']
//     };
//   }
// }

// /**
//  * Get user's attempts for an assessment
//  */
// export async function getUserAttempts(assessmentId: string) {
//   try {
//     const session = await getSession();
    
//     if (!session || !session.userId) {
//       return {
//         success: false,
//         message: 'Unauthorized',
//         attempts: []
//       };
//     }

//     const attempts = await getUserAssessmentAttempts(session.userId, assessmentId);
    
//     return {
//       success: true,
//       message: 'Attempts retrieved successfully',
//       attempts
//     };
//   } catch (error) {
//     console.error('❌ Error getting user attempts:', error);
//     return {
//       success: false,
//       message: 'Failed to retrieve attempts',
//       attempts: []
//     };
//   }
// }

// /**
//  * Get user's recent course attempts
//  */
// export async function getCourseAttempts(courseId: string, limit: number = 10) {
//   try {
//     const session = await getSession();
    
//     if (!session || !session.userId) {
//       return {
//         success: false,
//         message: 'Unauthorized',
//         attempts: []
//       };
//     }

//     const attempts = await getUserCourseAttempts(session.userId, courseId, limit);
    
//     return {
//       success: true,
//       message: 'Course attempts retrieved successfully',
//       attempts
//     };
//   } catch (error) {
//     console.error('❌ Error getting course attempts:', error);
//     return {
//       success: false,
//       message: 'Failed to retrieve course attempts',
//       attempts: []
//     };
//   }
// }

// /**
//  * Check if user can take assessment
//  */
// export async function canUserTakeAssessmentAction(assessmentId: string) {
//   try {
//     const session = await getSession();
    
//     if (!session || !session.userId) {
//       return {
//         success: false,
//         message: 'Unauthorized',
//         canTake: false,
//         reason: 'Not authenticated'
//       };
//     }

//     const result = await dbCanUserTakeAssessment(session.userId, assessmentId);
    
//     return {
//       success: true,
//       message: result.canTake ? 'Assessment accessible' : result.reason || 'Not accessible',
//       ...result
//     };
//   } catch (error) {
//     console.error('❌ Error checking assessment access:', error);
//     return {
//       success: false,
//       message: 'Error checking access',
//       canTake: false,
//       reason: 'Error checking access'
//     };
//   }
// }



































// // /lib/assessments/attempt-actions.ts

// 'use server'

// import { getSession } from '@/lib/auth/session';
// import { 
//   getAssessmentAttemptById,
//   getUserAssessmentAttempts,
//   getActiveAttempt,
//   createAssessmentAttempt as dbCreateAssessmentAttempt,
//   updateAssessmentAttempt as dbUpdateAssessmentAttempt,
//   submitAssessmentAttempt as dbSubmitAssessmentAttempt,
//   getUserCourseAttempts,
//   canUserTakeAssessment as dbCanUserTakeAssessment,
//   getNextAttemptNumber
// } from '@/lib/db/queries/assessment-attempts';
// import { UserAnswer } from '@/types/assessment-attempts';

// /**
//  * Start a new assessment attempt
//  */
// export async function startAssessmentAttempt(assessmentId: string) {
//   try {
//     const session = await getSession();
    
//     if (!session || !session.userId) {
//       return {
//         success: false,
//         message: 'Unauthorized',
//         errors: ['You must be logged in to start an assessment']
//       };
//     }

//     // Check if user can take assessment
//     const accessCheck = await dbCanUserTakeAssessment(session.userId, assessmentId);
//     if (!accessCheck.canTake) {
//       return {
//         success: false,
//         message: 'Cannot start assessment',
//         errors: [accessCheck.reason || 'Unable to start assessment']
//       };
//     }

//     const result = await dbCreateAssessmentAttempt({
//       user_id: session.userId,
//       assessment_id: assessmentId
//     });

//     return result;
//   } catch (error) {
//     console.error('❌ Error starting assessment attempt:', error);
//     return {
//       success: false,
//       message: 'Failed to start assessment attempt',
//       errors: ['An unexpected error occurred']
//     };
//   }
// }

// /**
//  * Get active attempt for current user
//  */
// export async function getCurrentActiveAttempt(assessmentId: string) {
//   try {
//     const session = await getSession();
    
//     if (!session || !session.userId) {
//       return {
//         success: false,
//         message: 'Unauthorized',
//         attempt: null
//       };
//     }

//     const attempt = await getActiveAttempt(session.userId, assessmentId);
    
//     if (!attempt) {
//       return {
//         success: false,
//         message: 'No active attempt found',
//         attempt: null
//       };
//     }

//     return {
//       success: true,
//       message: 'Active attempt retrieved',
//       attempt
//     };
//   } catch (error) {
//     console.error('❌ Error getting active attempt:', error);
//     return {
//       success: false,
//       message: 'Failed to retrieve active attempt',
//       attempt: null
//     };
//   }
// }


// /**
//  * Save attempt progress
//  */
// export async function saveAttemptProgress(
//   attemptId: string, 
//   answers: UserAnswer[], 
//   timeRemaining?: number
// ) {
//   try {
//     const session = await getSession();
    
//     if (!session || !session.userId) {
//       return {
//         success: false,
//         message: 'Unauthorized',
//         errors: ['You must be logged in to save progress']
//       };
//     }

//     // Verify user owns the attempt
//     const attempt = await getAssessmentAttemptById(attemptId);
//     if (!attempt || attempt.user_id !== session.userId) {
//       return {
//         success: false,
//         message: 'Access denied',
//         errors: ['You do not have permission to update this attempt']
//       };
//     }

//     const result = await dbUpdateAssessmentAttempt(attemptId, {
//       answers_json: answers,
//       time_remaining: timeRemaining
//     });

//     return result;
//   } catch (error) {
//     console.error('❌ Error saving attempt progress:', error);
//     return {
//       success: false,
//       message: 'Failed to save progress',
//       errors: ['An unexpected error occurred']
//     };
//   }
// }



// /**
//  * Submit assessment attempt
//  */
// export async function submitAssessmentAttemptAction(
//   attemptId: string, 
//   answers: UserAnswer[], 
//   finalTimeRemaining?: number
// ) {
//   try {
//     const session = await getSession();
    
//     if (!session || !session.userId) {
//       return {
//         success: false,
//         message: 'Unauthorized',
//         errors: ['You must be logged in to submit an assessment']
//       };
//     }

//     // Verify user owns the attempt
//     const attempt = await getAssessmentAttemptById(attemptId);
//     if (!attempt || attempt.user_id !== session.userId) {
//       return {
//         success: false,
//         message: 'Access denied',
//         errors: ['You do not have permission to submit this attempt']
//       };
//     }

//     const result = await dbSubmitAssessmentAttempt(
//       attemptId, 
//       answers, 
//       finalTimeRemaining
//     );

//     return result;
//   } catch (error) {
//     console.error('❌ Error submitting assessment attempt:', error);
//     return {
//       success: false,
//       message: 'Failed to submit assessment',
//       errors: ['An unexpected error occurred']
//     };
//   }
// }

// /**
//  * Get user's attempts for an assessment
//  */
// export async function getUserAttempts(assessmentId: string) {
//   try {
//     const session = await getSession();
    
//     if (!session || !session.userId) {
//       return {
//         success: false,
//         message: 'Unauthorized',
//         attempts: []
//       };
//     }

//     const attempts = await getUserAssessmentAttempts(session.userId, assessmentId);
    
//     return {
//       success: true,
//       message: 'Attempts retrieved successfully',
//       attempts
//     };
//   } catch (error) {
//     console.error('❌ Error getting user attempts:', error);
//     return {
//       success: false,
//       message: 'Failed to retrieve attempts',
//       attempts: []
//     };
//   }
// }

// /**
//  * Get user's recent course attempts
//  */
// export async function getCourseAttempts(courseId: string, limit: number = 10) {
//   try {
//     const session = await getSession();
    
//     if (!session || !session.userId) {
//       return {
//         success: false,
//         message: 'Unauthorized',
//         attempts: []
//       };
//     }

//     const attempts = await getUserCourseAttempts(session.userId, courseId, limit);
    
//     return {
//       success: true,
//       message: 'Course attempts retrieved successfully',
//       attempts
//     };
//   } catch (error) {
//     console.error('❌ Error getting course attempts:', error);
//     return {
//       success: false,
//       message: 'Failed to retrieve course attempts',
//       attempts: []
//     };
//   }
// }

// /**
//  * Check if user can take assessment
//  */
// export async function canUserTakeAssessmentAction(assessmentId: string) {
//   try {
//     const session = await getSession();
    
//     if (!session || !session.userId) {
//       return {
//         success: false,
//         message: 'Unauthorized',
//         canTake: false,
//         reason: 'Not authenticated'
//       };
//     }

//     const result = await dbCanUserTakeAssessment(session.userId, assessmentId);
    
//     return {
//       success: true,
//       message: result.canTake ? 'Assessment accessible' : result.reason || 'Not accessible',
//       ...result
//     };
//   } catch (error) {
//     console.error('❌ Error checking assessment access:', error);
//     return {
//       success: false,
//       message: 'Error checking access',
//       canTake: false,
//       reason: 'Error checking access'
//     };
//   }
// }
































'use server'
// lib/assessments/attempt-actions.ts
// v2: fires achievement triggers after quiz submission

import { getSession } from '@/lib/auth/session';
import {
  getAssessmentAttemptById,
  getUserAssessmentAttempts,
  getActiveAttempt,
  createAssessmentAttempt as dbCreateAssessmentAttempt,
  updateAssessmentAttempt as dbUpdateAssessmentAttempt,
  submitAssessmentAttempt as dbSubmitAssessmentAttempt,
  getUserCourseAttempts,
  canUserTakeAssessment as dbCanUserTakeAssessment,
} from '@/lib/db/queries/assessment-attempts';
import { UserAnswer } from '@/types/assessment-attempts';
import { fireAchievementTrigger } from '@/lib/achievements/achievement-engine';
import { TRIGGERS } from '@/lib/achievements/triggers';

/** Start a new assessment attempt */
export async function startAssessmentAttempt(assessmentId: string) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return { success: false, message: 'Unauthorized', errors: ['You must be logged in to start an assessment'] };
    }

    const accessCheck = await dbCanUserTakeAssessment(session.userId, assessmentId);
    if (!accessCheck.canTake) {
      return { success: false, message: 'Cannot start assessment', errors: [accessCheck.reason || 'Unable to start assessment'] };
    }

    return await dbCreateAssessmentAttempt({ user_id: session.userId, assessment_id: assessmentId });
  } catch (error) {
    console.error('❌ Error starting assessment attempt:', error);
    return { success: false, message: 'Failed to start assessment attempt', errors: ['An unexpected error occurred'] };
  }
}

/** Get active attempt for current user */
export async function getCurrentActiveAttempt(assessmentId: string) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return { success: false, message: 'Unauthorized', attempt: null };
    }

    const attempt = await getActiveAttempt(session.userId, assessmentId);
    if (!attempt) {
      return { success: false, message: 'No active attempt found', attempt: null };
    }
    return { success: true, message: 'Active attempt retrieved', attempt };
  } catch (error) {
    console.error('❌ Error getting active attempt:', error);
    return { success: false, message: 'Failed to retrieve active attempt', attempt: null };
  }
}

/** Save attempt progress */
export async function saveAttemptProgress(
  attemptId: string,
  answers: UserAnswer[],
  timeRemaining?: number
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return { success: false, message: 'Unauthorized', errors: ['You must be logged in to save progress'] };
    }

    const attempt = await getAssessmentAttemptById(attemptId);
    if (!attempt || attempt.user_id !== session.userId) {
      return { success: false, message: 'Access denied', errors: ['You do not have permission to update this attempt'] };
    }

    return await dbUpdateAssessmentAttempt(attemptId, { answers_json: answers, time_remaining: timeRemaining });
  } catch (error) {
    console.error('❌ Error saving attempt progress:', error);
    return { success: false, message: 'Failed to save progress', errors: ['An unexpected error occurred'] };
  }
}

/** Submit assessment attempt — fires achievement triggers automatically */
export async function submitAssessmentAttemptAction(
  attemptId: string,
  answers: UserAnswer[],
  finalTimeRemaining?: number
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return { success: false, message: 'Unauthorized', errors: ['You must be logged in to submit an assessment'] };
    }

    const attempt = await getAssessmentAttemptById(attemptId);
    if (!attempt || attempt.user_id !== session.userId) {
      return { success: false, message: 'Access denied', errors: ['You do not have permission to submit this attempt'] };
    }

    const result = await dbSubmitAssessmentAttempt(attemptId, answers, finalTimeRemaining);

    // 🏆 Fire quiz achievement triggers — non-blocking, never fails the response
    if (result.success) {
      const score  = (result as any).attempt?.score ?? (result as any).score ?? 0
      const passed = (result as any).attempt?.passed ?? (result as any).passed ?? false

      fireAchievementTrigger(session.userId, TRIGGERS.QUIZ_SUBMITTED, {
        score,
        passed,
        assessmentId: attempt.assessment_id,
        courseId:     (attempt as any).course_id,
      }).catch(() => {})
    }

    return result;
  } catch (error) {
    console.error('❌ Error submitting assessment attempt:', error);
    return { success: false, message: 'Failed to submit assessment', errors: ['An unexpected error occurred'] };
  }
}

/** Get user's attempts for an assessment */
export async function getUserAttempts(assessmentId: string) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return { success: false, message: 'Unauthorized', attempts: [] };
    }
    const attempts = await getUserAssessmentAttempts(session.userId, assessmentId);
    return { success: true, message: 'Attempts retrieved successfully', attempts };
  } catch (error) {
    console.error('❌ Error getting user attempts:', error);
    return { success: false, message: 'Failed to retrieve attempts', attempts: [] };
  }
}

/** Get user's recent course attempts */
export async function getCourseAttempts(courseId: string, limit = 10) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return { success: false, message: 'Unauthorized', attempts: [] };
    }
    const attempts = await getUserCourseAttempts(session.userId, courseId, limit);
    return { success: true, message: 'Course attempts retrieved successfully', attempts };
  } catch (error) {
    console.error('❌ Error getting course attempts:', error);
    return { success: false, message: 'Failed to retrieve course attempts', attempts: [] };
  }
}

/** Check if user can take assessment */
export async function canUserTakeAssessmentAction(assessmentId: string) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return { success: false, message: 'Unauthorized', canTake: false, reason: 'Not authenticated' };
    }
    const result = await dbCanUserTakeAssessment(session.userId, assessmentId);
    return { success: true, message: result.canTake ? 'Assessment accessible' : result.reason || 'Not accessible', ...result };
  } catch (error) {
    console.error('❌ Error checking assessment access:', error);
    return { success: false, message: 'Error checking access', canTake: false, reason: 'Error checking access' };
  }
}
