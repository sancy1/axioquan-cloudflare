
// /src/app/courses/learn/[courseId]/quiz/[assessmentId]/page.tsx
// Fix the server component API call

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { getAssessmentById } from '@/lib/db/queries/assessments';
import { getAssessmentQuestions } from '@/lib/db/queries/questions';
import { checkEnrollmentStatus } from '@/lib/db/queries/courses';
import { canUserTakeAssessmentAction, getCurrentActiveAttempt } from '@/lib/assessments/attempt-actions';
import { startAssessmentAttempt } from '@/lib/assessments/attempt-actions';
import { QuizPlayer } from '@/components/assessments/quiz-player';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle, Clock, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';

// FIX: In Next.js 13+, params is a Promise
interface QuizPageProps {
  params: Promise<{
    courseId: string;
    assessmentId: string;
  }>;
}

// Helper function to convert database questions to component questions
function convertToQuizQuestions(dbQuestions: any[]) {
  return dbQuestions.map((q: any) => ({
    id: q.id,
    question_text: q.question_text,
    question_type: q.question_type,
    options: q.options,
    points: q.points,
    image_url: q.image_url,
    video_url: q.video_url,
    explanation: q.explanation,
    hints: q.hints,
    order_index: q.order_index,
    possible_answers: q.possible_answers,
    code_template: q.code_template,
    allowed_file_types: q.allowed_file_types
  }));
}

export default async function QuizPage({ params }: QuizPageProps) {
  // FIX: await the params Promise
  const { courseId, assessmentId } = await params;
  
  console.log('🔍 [Quiz Page] Extracted params:', { 
    courseId, 
    assessmentId,
    isCourseIdValid: !!courseId && courseId !== 'undefined',
    isAssessmentIdValid: !!assessmentId && assessmentId !== 'undefined'
  });
  
  // Validate courseId
  if (!courseId || courseId === 'undefined') {
    console.error('❌ [Quiz Page] Invalid courseId:', courseId);
    redirect('/dashboard/my-courses');
  }

  // Get session
  const session = await getSession();
  if (!session || !session.userId) {
    console.log('❌ [Quiz Page] No session found');
    redirect('/login');
  }

  console.log('🔍 [Quiz Page] User session:', { userId: session.userId });

  // Check enrollment
  const enrollment = await checkEnrollmentStatus(session.userId, courseId);
  if (!enrollment.isEnrolled) {
    console.log('❌ [Quiz Page] User not enrolled, redirecting');
    redirect(`/courses/learn/${courseId}`);
  }

  console.log('✅ [Quiz Page] User is enrolled');

  // Check assessment access
  const accessCheck = await canUserTakeAssessmentAction(assessmentId);
  if (!accessCheck.success || !accessCheck.canTake) {
    console.log('❌ [Quiz Page] Assessment access denied:', accessCheck.message);
    return (
      <div className="container max-w-4xl py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {accessCheck.message || 'You cannot access this assessment.'}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link href={`/courses/learn/${courseId}`}>
            <Button variant="outline" className="gap-2 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              Back to Course
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  console.log('✅ [Quiz Page] Assessment access granted:', {
    nextAttemptNumber: accessCheck.nextAttemptNumber,
    maxAttempts: accessCheck.maxAttempts
  });

  // Get assessment details
  const assessmentResult = await getAssessmentById(assessmentId);
  if (!assessmentResult || assessmentResult.course_id !== courseId) {
    console.log('❌ [Quiz Page] Assessment not found or course mismatch');
    redirect(`/courses/learn/${courseId}`);
  }

  console.log('✅ [Quiz Page] Assessment found:', assessmentResult.title);

  // Get questions
  const dbQuestions = await getAssessmentQuestions(assessmentId);
  const questions = convertToQuizQuestions(dbQuestions);
  
  if (questions.length === 0) {
    console.log('❌ [Quiz Page] No questions found for assessment');
    return (
      <div className="container max-w-4xl py-8">
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertDescription>
            This assessment has no questions yet. Please check back later.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link href={`/courses/learn/${courseId}`}>
            <Button variant="outline" className="gap-2 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              Back to Course
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  console.log(`✅ [Quiz Page] Found ${questions.length} questions`);

  // Check for active attempt
  const activeAttemptResult = await getCurrentActiveAttempt(assessmentId);
  let attemptId = activeAttemptResult.attempt?.id;
  let initialAnswers: any[] = [];
  let initialTimeRemaining: number | null = null;

  console.log('🔍 [Quiz Page] Active attempt check:', { 
    hasActiveAttempt: !!attemptId,
    attemptId: attemptId || 'None'
  });

  // If no active attempt, create one using server action instead of API call
  if (!attemptId) {
    console.log('🔄 [Quiz Page] Creating new attempt using server action...');
    try {
      // Use the server action directly instead of API call
      const startResult = await startAssessmentAttempt(assessmentId);
      
      console.log('📥 [Quiz Page] Server action response:', startResult);
      
      if (!startResult.success) {
        console.error('❌ [Quiz Page] Failed to start assessment:', startResult.message);
        
        return (
          <div className="container max-w-4xl py-8">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {startResult.message || 'Failed to start assessment. Please try again.'}
                {startResult.errors && startResult.errors.length > 0 && (
                  <ul className="mt-2 text-sm">
                    {startResult.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                )}
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Link href={`/courses/learn/${courseId}`}>
                <Button variant="outline" className="gap-2 cursor-pointer">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Course
                </Button>
              </Link>
            </div>
          </div>
        );
      }

      attemptId = startResult.attempt?.id;
      
      if (!attemptId) {
        console.error('❌ [Quiz Page] No attempt ID in server action response:', startResult);
        throw new Error('Failed to get attempt ID from server');
      }
      
      console.log('✅ [Quiz Page] New attempt created:', attemptId);
    } catch (error: any) {
      console.error('❌ [Quiz Page] Error creating attempt:', error);
      return (
        <div className="container max-w-4xl py-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to start assessment. Please try again.
              {error.message && (
                <div className="mt-2 text-sm font-mono bg-black/10 p-2 rounded">
                  Error: {error.message}
                </div>
              )}
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Link href={`/courses/learn/${courseId}`}>
              <Button variant="outline" className="gap-2 cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                Back to Course
              </Button>
            </Link>
          </div>
        </div>
      );
    }
  } else {
    // Load existing attempt data
    console.log('🔄 [Quiz Page] Loading existing attempt data...');
    initialAnswers = activeAttemptResult.attempt?.answers_json || [];
    initialTimeRemaining = activeAttemptResult.attempt?.time_remaining || null;
    console.log('✅ [Quiz Page] Loaded existing attempt data:', {
      answersCount: initialAnswers.length,
      timeRemaining: initialTimeRemaining
    });
  }

  // Prepare assessment data
  const assessment = {
    id: assessmentResult.id,
    title: assessmentResult.title,
    description: assessmentResult.description,
    instructions: assessmentResult.instructions,
    time_limit: assessmentResult.time_limit,
    passing_score: assessmentResult.passing_score,
    max_attempts: assessmentResult.max_attempts,
    show_correct_answers: assessmentResult.show_correct_answers,
    show_results_immediately: assessmentResult.show_results_immediately,
    total_points: assessmentResult.total_points,
  };

  console.log('🎯 [Quiz Page] Final data passing to QuizPlayer:', {
    courseId,
    assessmentId,
    attemptId,
    questionsCount: questions.length,
    showResultsImmediately: assessment.show_results_immediately,
    courseIdValid: !!courseId && courseId !== 'undefined'
  });

  // ========== ADD DEBUG CODE HERE ==========
  console.log('🎯 [Page-DEBUG] === FINAL CHECK BEFORE RENDERING ===');
  console.log('🎯 [Page-DEBUG] Passing to QuizPlayer:', {
    courseId, // THIS MUST BE DEFINED
    assessmentId: assessment.id,
    attemptId,
    questionsCount: questions.length,
    courseIdValid: !!courseId && courseId !== 'undefined' && courseId.length > 10,
    courseIdLength: courseId?.length,
    courseIdValue: courseId,
    showResultsImmediately: assessment.show_results_immediately
  });

  // Double-check by simulating URL extraction
  console.log('🎯 [Page-DEBUG] Simulating URL extraction:');
  const mockUrl = `/courses/learn/${courseId}/quiz/${assessment.id}`;
  console.log('🎯 [Page-DEBUG] Expected URL pattern:', mockUrl);
  
  // Log if we're server-side or client-side
  console.log('🎯 [Page-DEBUG] Environment:', {
    isServer: typeof window === 'undefined',
    hasWindow: typeof window !== 'undefined',
  });

  // CRITICAL: Validate courseId one more time
  if (!courseId || courseId === 'undefined') {
    console.error('❌❌❌ [Page-DEBUG] CRITICAL ERROR: courseId is still undefined/null!');
    console.error('❌ [Page-DEBUG] Raw values:', {
      courseId,
      assessmentId,
    });
    
    // Don't render QuizPlayer if courseId is invalid
    return (
      <div className="container max-w-4xl py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Configuration Error</AlertTitle>
          <AlertDescription>
            Unable to load quiz configuration. Please go back to the course and try again.
            <div className="mt-2 text-xs font-mono bg-black/10 p-2 rounded">
              Debug: courseId = {courseId || 'NULL'}
            </div>
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link href="/dashboard/my-courses">
            <Button variant="outline" className="gap-2 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  // ========== END DEBUG CODE ==========

  // CRITICAL: Double-check courseId is valid before rendering
  if (!courseId || courseId === 'undefined') {
    console.error('❌❌❌ [Quiz Page] COURSE ID IS STILL UNDEFINED! Cannot render QuizPlayer');
    return (
      <div className="container max-w-4xl py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Technical error: Unable to determine course. Please go back and try again.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link href="/dashboard/my-courses">
            <Button variant="outline" className="gap-2 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/courses/learn/${courseId}`}>
                <Button variant="ghost" size="sm" className="gap-2 cursor-pointer">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Course
                </Button>
              </Link>
              
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold">{assessment.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {questions.length} questions • {assessment.passing_score}% to pass
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {assessment.time_limit && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Time limit: {assessment.time_limit} minutes</span>
                </div>
              )}
              
              <div className="text-sm text-muted-foreground">
                Attempt {accessCheck.nextAttemptNumber || 1}/{assessment.max_attempts}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Player */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <QuizPlayer
          assessment={assessment}
          questions={questions}
          attemptId={attemptId || ''}
          initialAnswers={initialAnswers}
          initialTimeRemaining={initialTimeRemaining}
          courseId={courseId} // This should now be properly defined
        />
      </div>
    </div>
  );
}