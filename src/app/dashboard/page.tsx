

// /src/app/dashboard/page.tsx
// FIX: certificates query for instructor now uses is_revoked = false
// instead of status = 'issued' (certificates table has no status column)
// ADDED: currentStreak fetch for students only from /api/activity/streak

import { withSessionRefresh } from '@/lib/auth/utils';
import { checkAuthStatus } from '@/lib/auth/actions';
import { getInstructorCourses } from '@/lib/db/queries/courses';
import { getRoleRequests } from '@/lib/db/queries/roles';
import { sql } from '@/lib/db/index';
import DashboardOverview from '@/components/dashboard/dashboard-overview';
import ContinueLearning from '@/components/dashboard/continue-learning';
import RecentAchievements from '@/components/dashboard/recent-achievements';
import { TrendingCoursesServer } from '@/components/dashboard/trending-courses-server';
import QuickActions from '@/components/dashboard/quick-actions';
import RecentActivity from '@/components/dashboard/recent-activity';

export default async function DashboardPage() {
  const session = await withSessionRefresh();
  const authStatus = await checkAuthStatus();

  const sessionExpiry = session.expires
    ? Math.round((new Date(session.expires).getTime() - Date.now()) / (60 * 1000))
    : 0;

  let roleSpecificData = {
    enrolledCourses:     0,
    learningProgress:    0,
    instructorCourses:   0,
    totalStudents:       0,
    pendingRoleRequests: 0,
    totalUsers:          0,
    certificatesEarned:  0,
    certificatesIssued:  0,
    currentStreak:       0, // ← student only
  };

  let enrolledCoursesList: any[] = [];

  try {
    // ── STUDENT ──────────────────────────────────────────────────────────────
    if (session.primaryRole === 'student') {
      // Auto-cleanup: delete enrollments for paid courses whose payment was removed
      try {
        await sql`
          DELETE FROM enrollments
          WHERE user_id = ${session.userId}
            AND status  = 'active'
            AND course_id IN (
              SELECT e2.course_id
              FROM   enrollments e2
              JOIN   courses c
                ON   c.id = e2.course_id
              LEFT JOIN payments p
                ON   p.user_id   = e2.user_id
               AND   p.course_id = e2.course_id
               AND   p.status    = 'SUCCESS'
              WHERE  e2.user_id        = ${session.userId}
                AND  e2.status         = 'active'
                AND  COALESCE(c.price_cents, 0) > 0
                AND  p.id IS NULL
            )
        `;
      } catch {
        // cleanup failed — stale paid enrollments may appear until next load
      }

      const enrolledCourses = await sql`
        SELECT COUNT(*) as count FROM enrollments
        WHERE user_id = ${session.userId} AND status = 'active'
      `;
      roleSpecificData.enrolledCourses = parseInt(enrolledCourses[0]?.count || '0');

      const progress = await sql`
        SELECT COALESCE(AVG(progress_percentage), 0) as average_progress
        FROM enrollments
        WHERE user_id = ${session.userId} AND status = 'active'
      `;
      roleSpecificData.learningProgress = Math.round(
        parseFloat(progress[0]?.average_progress || '0')
      );

      try {
        const certificatesCount = await sql`
          SELECT COUNT(*) as count
          FROM certificates
          WHERE user_id  = ${session.userId}
            AND is_revoked = false
        `;
        roleSpecificData.certificatesEarned = parseInt(certificatesCount[0]?.count || '0');
      } catch {
        roleSpecificData.certificatesEarned = 0;
      }

      // ── Streak: calculate directly in DB (no HTTP call needed server-side) ──
      try {
        const activityDates = await sql`
          SELECT DISTINCT created_at::date AS active_date
          FROM user_activities
          WHERE user_id = ${session.userId}
            AND activity_type IN (
              'dashboard_visit',
              'lesson_completed',
              'quiz_submitted',
              'course_enrolled'
            )
          ORDER BY active_date DESC
        `;

        if (activityDates.length > 0) {
          const oneDayMs  = 86400 * 1000;
          const today     = new Date();
          today.setHours(0, 0, 0, 0);
          const yesterday = today.getTime() - oneDayMs;

          const dates = activityDates.map((r: any) => {
            const d = new Date(r.active_date);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
          });

          const mostRecent = dates[0];

          // Streak resets if last activity was more than 1 day ago
          if (mostRecent >= yesterday) {
            let streak   = 1;
            let expected = mostRecent - oneDayMs;

            for (let i = 1; i < dates.length; i++) {
              if (dates[i] === expected) {
                streak++;
                expected -= oneDayMs;
              } else if (dates[i] < expected) {
                break; // gap found
              }
            }
            roleSpecificData.currentStreak = streak;
          }
        }
      } catch {
        roleSpecificData.currentStreak = 0;
      }

      try {
        const enrolledCoursesData = await sql`
          SELECT
            c.*,
            e.progress_percentage as progress,
            e.id as enrollment_id,
            e.last_accessed_at,
            cat.name as category_name,
            u.name   as instructor_name
          FROM enrollments e
          JOIN courses     c   ON e.course_id    = c.id
          LEFT JOIN categories cat ON c.category_id  = cat.id
          LEFT JOIN users      u   ON c.instructor_id = u.id
          WHERE e.user_id = ${session.userId} AND e.status = 'active'
          ORDER BY e.last_accessed_at DESC
          LIMIT 6
        `;
        enrolledCoursesList = enrolledCoursesData;
      } catch {
        enrolledCoursesList = [];
      }

    // ── INSTRUCTOR ────────────────────────────────────────────────────────────
    } else if (session.primaryRole === 'instructor') {
      try {
        const instructorCourses = await getInstructorCourses(session.userId);
        roleSpecificData.instructorCourses = instructorCourses.length;

        roleSpecificData.totalStudents = instructorCourses.reduce(
          (total, course) => total + (course.enrolled_students_count || 0),
          0
        );

        const publishedCourses = instructorCourses.filter(c => c.is_published);
        roleSpecificData.learningProgress = publishedCourses.length > 0
          ? Math.round((publishedCourses.length / instructorCourses.length) * 100)
          : 0;
      } catch {
        // instructor courses unavailable — defaults stay at 0
      }

      try {
        const certificatesCount = await sql`
          SELECT COUNT(*) as count
          FROM certificates cert
          JOIN courses co ON cert.course_id = co.id
          WHERE co.instructor_id = ${session.userId}
            AND cert.is_revoked  = false
        `;
        roleSpecificData.certificatesIssued = parseInt(certificatesCount[0]?.count || '0');
      } catch {
        roleSpecificData.certificatesIssued = 0;
      }

    // ── ADMIN ─────────────────────────────────────────────────────────────────
    } else if (session.primaryRole === 'admin') {
      try {
        const totalUsers = await sql`
          SELECT COUNT(*) as count FROM users WHERE is_active = true
        `;
        roleSpecificData.totalUsers = parseInt(totalUsers[0]?.count || '0');

        const pendingRequests = await getRoleRequests({ status: 'pending' });
        roleSpecificData.pendingRoleRequests = pendingRequests.length;

        const totalCourses = await sql`
          SELECT COUNT(*) as count FROM courses WHERE is_published = true
        `;
        roleSpecificData.enrolledCourses = parseInt(totalCourses[0]?.count || '0');
      } catch {
        // admin data unavailable — defaults stay at 0
      }
    }
  } catch (error) {
    console.error('Error fetching role-specific data:', error);
    roleSpecificData.certificatesEarned = 0;
    roleSpecificData.certificatesIssued = 0;
    roleSpecificData.currentStreak      = 0;
  }

  const getWelcomeMessage = () => {
    const name = session.name || 'there';
    switch (session.primaryRole) {
      case 'student':    return `Ready to continue your learning journey, ${name}?`;
      case 'instructor': return `Welcome back, Instructor ${name}! Ready to inspire some learners today?`;
      case 'admin':      return `Welcome back, Admin ${name}. Here's your platform overview.`;
      default:           return `Welcome back, ${name}!`;
    }
  };

  const getRoleBadgeColor = () => {
    switch (session.primaryRole) {
      case 'student':    return 'bg-blue-100 text-blue-800';
      case 'instructor': return 'bg-green-100 text-green-800';
      case 'admin':      return 'bg-purple-100 text-purple-800';
      default:           return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {session.name}!
            </h1>
            <p className="text-gray-600 mt-1">{getWelcomeMessage()}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor()}`}>
            {session.primaryRole?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <DashboardOverview
            roleSpecificData={roleSpecificData}
            userRole={session.primaryRole}
          />

          {session.primaryRole === 'student' ? (
            <ContinueLearning courses={enrolledCoursesList} />
          ) : null}

          <QuickActions
            roleSpecificData={roleSpecificData}
            userRole={session.primaryRole}
          />

          <RecentActivity />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {session.primaryRole !== 'admin' && session.primaryRole !== 'instructor' && (
            <RecentAchievements />
          )}

          <TrendingCoursesServer
            limit={5}
            variant="compact"
            title="Trending Courses"
            description="Most popular courses this week"
          />

          {/* Session Info */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Session Information</h4>
            <p className="text-sm text-blue-700">
              Session expires in: {sessionExpiry > 0 ? `${sessionExpiry} minutes` : 'Expired'}
            </p>
            <p className="text-sm text-blue-700">
              Roles: {session.roles?.join(', ') || 'No roles assigned'}
            </p>
            <p className="text-sm text-blue-700">
              Auth Status: {authStatus.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
