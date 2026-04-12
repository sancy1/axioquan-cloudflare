
// // /src/app/api/assessments/[id]/attempts/[attemptId]/submit/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { getSession } from '@/lib/auth/session';
// import { submitAssessmentAttemptAction } from '@/lib/assessments/attempt-actions';

// export async function POST(
//   request: NextRequest,
//   { params }: { params: { id: string; attemptId: string } }
// ) {
//   try {
//     const session = await getSession();
    
//     if (!session || !session.userId) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     const attemptId = params.attemptId;
//     const body = await request.json();
//     const { answers, finalTimeRemaining } = body;

//     const result = await submitAssessmentAttemptAction(
//       attemptId, 
//       answers, 
//       finalTimeRemaining
//     );

//     if (!result.success) {
//       return NextResponse.json(
//         { error: result.message, errors: result.errors },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json({
//       attempt: result.attempt,
//       message: result.message
//     });
//   } catch (error) {
//     console.error('❌ Error submitting assessment attempt:', error);
//     return NextResponse.json(
//       { error: 'Failed to submit assessment attempt' },
//       { status: 500 }
//     );
//   }
// }



























// /src/app/api/assessments/[id]/attempts/[attemptId]/submit/route.ts - UPDATED VERSION

import { NextRequest, NextResponse } from 'next/server';
import { sendNotification } from '@/lib/notifications/send-notification';
import { getSession } from '@/lib/auth/session';
import { submitAssessmentAttemptAction } from '@/lib/assessments/attempt-actions';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; attemptId: string } }
) {
  try {
    const session = await getSession();
    
    if (!session || !session.userId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized',
          message: 'You must be logged in to submit an assessment',
          errors: ['Authentication required']
        },
        { status: 401 }
      );
    }

    const attemptId = params.attemptId;
    const body = await request.json();
    const { answers, finalTimeRemaining } = body;

    console.log('📦 Submit request body:', { 
      attemptId, 
      answersCount: answers?.length,
      finalTimeRemaining 
    });

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid request',
          message: 'Answers must be provided as an array',
          errors: ['Invalid answers format']
        },
        { status: 400 }
      );
    }

    const result = await submitAssessmentAttemptAction(
      attemptId, 
      answers, 
      finalTimeRemaining
    );

    console.log('📤 Submit action result:', result);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false,
          error: result.message,
          message: result.message,
          errors: result.errors || [result.message]
        },
        { status: 400 }
      );
    }

    // Fire quiz notification (fire-and-forget — never blocks the response)
    if (result.success && session) {
      const score  = (result as any).attempt?.score  ?? (result as any).score  ?? 0
      const passed = (result as any).attempt?.passed ?? (result as any).passed ?? false
      sendNotification({
        userId: session.userId,
        notificationType: passed ? 'quiz_passed' : 'quiz_failed',
        title: passed ? 'Quiz Passed! 🎉' : 'Quiz Attempt Complete',
        message: passed
          ? `You scored ${score}% on this quiz. Excellent work!`
          : `You scored ${score}% on this quiz. Keep practising!`,
        actionUrl: `/courses/assessment/${params.id}/results`,
        iconType: 'quiz',
        data: { assessmentId: params.id, attemptId: params.attemptId, score, passed },
      }).catch(() => {})
    }

    return NextResponse.json({
      success: true,
      attempt: result.attempt,
      message: result.message
    });
  } catch (error: any) {
    console.error('❌ Error submitting assessment attempt:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to submit assessment attempt',
        message: 'An unexpected error occurred',
        errors: [error.message || 'Internal server error']
      },
      { status: 500 }
    );
  }
}