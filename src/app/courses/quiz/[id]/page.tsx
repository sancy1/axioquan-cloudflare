

// /src/app/courses/quiz/[id]/page.tsx - UPDATE TO REDIRECT PROPERLY

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { getAssessmentById } from '@/lib/db/queries/assessments';

export default async function QuizCoursePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const session = await getSession();
  
  console.log('🔍 [QuizRedirect] Old quiz route accessed:', {
    assessmentId: id,
    hasSession: !!session?.userId
  });
  
  if (!session || !session.userId) {
    redirect('/login');
  }

  try {
    // Get assessment to find the courseId
    const assessment = await getAssessmentById(id);
    
    console.log('🔍 [QuizRedirect] Assessment found:', {
      hasAssessment: !!assessment,
      courseId: assessment?.course_id,
      title: assessment?.title
    });
    
    if (assessment && assessment.course_id) {
      // Redirect to the correct URL with courseId
      const newUrl = `/courses/learn/${assessment.course_id}/quiz/${id}`;
      console.log('🔄 [QuizRedirect] Redirecting to:', newUrl);
      redirect(newUrl);
    } else {
      console.error('❌ [QuizRedirect] No assessment or courseId found');
      redirect('/dashboard/my-courses');
    }
  } catch (error) {
    console.error('❌ [QuizRedirect] Error:', error);
    redirect('/dashboard/my-courses');
  }
}