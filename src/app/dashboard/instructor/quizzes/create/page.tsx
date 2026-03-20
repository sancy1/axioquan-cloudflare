

// /src/app/dashboard/instructor/quizzes/create/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AssessmentBuilder } from '@/components/assessments/assessment-builder';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
}

export default function CreateAssessmentPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructorCourses();
  }, []);

  const fetchInstructorCourses = async () => {
    try {
      const response = await fetch('/api/courses/instructor/my-courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssessmentSaved = (assessment: any) => {
    // Navigate to edit page to add questions
    router.push(`/dashboard/instructor/quizzes/${assessment.id}/edit?tab=questions`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/instructor/quizzes">
            <Button variant="outline" size="sm" className="cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-1 cursor-pointer" />
              Back to Assessments
            </Button>
          </Link>
        </div>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href="/dashboard/instructor/quizzes">
          <Button variant="outline" size="sm" className="cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-1 cursor-pointer" />
            Back to Assessments
          </Button>
        </Link>
      </div>

      {/* Create Form */}
      <AssessmentBuilder
        courses={courses}
        onSave={handleAssessmentSaved}
        onCancel={() => router.push('/dashboard/instructor/quizzes')}
      />

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Tips</CardTitle>
          <CardDescription>
            Best practices for creating effective assessments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">📝 Clear Instructions</h4>
            <p className="text-sm text-gray-600">
              Provide clear instructions so students know exactly what's expected of them.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">⏱️ Time Management</h4>
            <p className="text-sm text-gray-600">
              Set appropriate time limits based on the complexity and number of questions.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">🎯 Difficulty Levels</h4>
            <p className="text-sm text-gray-600">
              Mix easy, medium, and hard questions to properly assess student understanding.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">📊 Question Variety</h4>
            <p className="text-sm text-gray-600">
              Use different question types (multiple choice, true/false, short answer) to test various skills.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}