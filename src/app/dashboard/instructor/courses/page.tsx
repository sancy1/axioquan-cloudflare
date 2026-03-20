
// /app/dashboard/instructor/courses/page.tsx

import { withSessionRefresh } from '@/lib/auth/utils';
import { requireRole } from '@/lib/auth/utils';
import { getInstructorCoursesAction } from '@/lib/courses/actions';
import { getCategoriesAction } from '@/lib/categories/actions';
import { CourseManager } from '@/components/courses/course-manager';
import { InstructorQuickStats } from '@/components/dashboard/instructor-quick-stats';

export default async function InstructorCoursesPage() {
  const session = await withSessionRefresh();
  await requireRole(['instructor', 'admin']);

  const [coursesResult, categoriesResult] = await Promise.all([
    // Fetch courses with analytics data
    getInstructorCoursesAction({ includeAnalytics: true }),
    getCategoriesAction()
  ]);

  const courses = coursesResult.success ? coursesResult.courses || [] : [];
  const categories = categoriesResult.categories || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600 mt-2">
          Manage your courses and track student performance
        </p>
      </div>

      {/* Quick Stats Overview */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quiz Analytics Overview</h2>
        <InstructorQuickStats />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">All Courses</h2>
        <CourseManager 
          initialCourses={courses}
          categories={categories}
        />
      </div>
    </div>
  );
}