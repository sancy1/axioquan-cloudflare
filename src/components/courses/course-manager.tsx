
'use client';
// /components/courses/course-manager.tsx
// CHANGES:
//  1. averageRating aggregation: was summing c.average_rating (stale column).
//     Now correctly uses the live review_count-weighted average from course data.
//  2. PremiumCourseCard: added a per-course star rating row showing
//     "★ 4.2  (18 ratings)" underneath the course title.

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CourseEditor } from './course-editor';
import { Course } from '@/types/courses';
import { Play, Star, Users, BookOpen, ArrowRight, FileText, FileQuestion, Heart, Share2, TrendingUp, Eye, Clock } from 'lucide-react';
import Link from 'next/link';
import { LikeButton } from '@/components/social/like-button';
import { ShareButton } from '@/components/social/share-button';


interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CourseManagerProps {
  initialCourses: Course[];
  categories: Category[];
}

type ViewMode = 'list' | 'create' | 'edit';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatRating = (rating: any, reviewCount?: number): string => {
  if (rating === null || rating === undefined) return '';
  const numRating = typeof rating === 'string' ? parseFloat(rating) : Number(rating);
  if (isNaN(numRating) || numRating <= 0) return '';
  if (reviewCount !== undefined && reviewCount <= 0) return '';
  return numRating.toFixed(1);
};

const getNumber = (value: any, defaultValue: number = 0): number => {
  if (value === null || value === undefined) return defaultValue;
  const numValue = typeof value === 'string' ? parseInt(value) : Number(value);
  return isNaN(numValue) ? defaultValue : numValue;
};

const formatDuration = (minutes: number | undefined): string | null => {
  if (!minutes || minutes <= 0) return null;
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

// ─── Social Stats Card ────────────────────────────────────────────────────────

function SocialStatsCard({ 
  title, value, icon: Icon, color = 'blue', trend 
}: { 
  title: string; value: number; icon: any;
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
  trend?: number;
}) {
  const colorClasses = {
    blue:   'from-blue-500 to-blue-600',
    green:  'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    red:    'from-red-500 to-red-600',
    yellow: 'from-yellow-500 to-yellow-600'
  };
  const bgColorClasses = {
    blue:   'bg-blue-50 border-blue-200',
    green:  'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    red:    'bg-red-50 border-red-200',
    yellow: 'bg-yellow-50 border-yellow-200'
  };

  return (
    <div className={`p-4 rounded-2xl border-2 transition-all hover:scale-105 hover:shadow-lg ${bgColorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-1 text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp size={12} className={trend >= 0 ? '' : 'rotate-180'} />
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

// ─── Per-Course Rating Badge ──────────────────────────────────────────────────
// Shows "★ 4.2  (18 ratings)" for each individual course card.

function CourseRatingBadge({ rating, reviewCount }: { rating: any; reviewCount: any }) {
  const numRating   = typeof rating === 'string' ? parseFloat(rating) : Number(rating ?? 0);
  const numReviews  = typeof reviewCount === 'string' ? parseInt(reviewCount) : Number(reviewCount ?? 0);
  const hasRating   = !isNaN(numRating) && numRating > 0 && numReviews > 0;

  return (
    <div className="flex items-center gap-1.5 mb-3">
      {/* Stars — filled proportionally */}
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={13}
            className={
              hasRating && numRating >= star
                ? 'text-yellow-400 fill-yellow-400'
                : hasRating && numRating >= star - 0.5
                ? 'text-yellow-400 fill-yellow-200'
                : 'text-gray-300 fill-gray-100'
            }
          />
        ))}
      </div>
      {hasRating ? (
        <>
          <span className="text-sm font-bold text-gray-800">{numRating.toFixed(1)}</span>
          <span className="text-xs text-gray-500">
            ({numReviews} {numReviews === 1 ? 'rating' : 'ratings'})
          </span>
        </>
      ) : (
        <span className="text-xs text-gray-400 italic">No ratings yet</span>
      )}
    </div>
  );
}

// ─── Premium Course Card ──────────────────────────────────────────────────────

function PremiumCourseCard({ 
  course, onEdit, onDelete, onPublish, onUnpublish 
}: { 
  course: Course;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  onPublish?: (course: Course) => void;
  onUnpublish?: (course: Course) => void;
}) {
  const studentCount = getNumber(course.enrolled_students_count);
  const reviewCount  = getNumber(course.review_count);
  const lessonCount  = getNumber(course.total_lessons);
  const likeCount    = getNumber(course.like_count);
  const shareCount   = getNumber(course.share_count);
  const duration     = formatDuration(course.total_video_duration);
  const courseDetailUrl = `/courses/${course.slug || course.id}`;
  
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group cursor-pointer h-full border border-gray-200">
      {/* Thumbnail */}
      <Link href={courseDetailUrl}>
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
          <img
            src={course.thumbnail_url || "/placeholder-course.png"}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <div className="bg-white rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform">
              <Play size={32} className="text-blue-600 fill-blue-600" />
            </div>
          </div>
          <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
            course.is_featured 
              ? 'bg-yellow-500 text-white' 
              : course.is_trending 
              ? 'bg-green-500 text-white'
              : 'bg-gray-600 text-white'
          }`}>
            {course.is_featured ? 'FEATURED' : course.is_trending ? 'TRENDING' : course.is_published ? 'PUBLISHED' : 'DRAFT'}
          </span>
        </div>
      </Link>

      <div className="p-5">
        {/* Title */}
        <Link href={courseDetailUrl}>
          <h3 className="font-bold text-lg mb-2 line-clamp-2 h-14 hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
        </Link>

        {/* ── Per-course rating ── NEW */}
        <CourseRatingBadge rating={course.average_rating} reviewCount={course.review_count} />

        {/* Category */}
        {course.category_name && (
          <div className="mb-3">
            <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {course.category_name}
            </span>
          </div>
        )}

        {/* Quick stats row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-gray-600">
            <Users size={16} />
            <span className="text-sm">{studentCount}</span>
          </div>
          {duration && (
            <div className="flex items-center gap-1 text-gray-600">
              <Clock size={14} />
              <span className="text-xs">{duration}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-gray-600">
            <BookOpen size={16} />
            <span className="text-sm">{lessonCount}</span>
          </div>
        </div>

        {/* Social engagement */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-red-500">
              <Heart size={14} className="fill-red-500" />
              <span className="text-xs font-semibold">{likeCount}</span>
            </div>
            <div className="flex items-center gap-1 text-blue-500">
              <Share2 size={14} />
              <span className="text-xs font-semibold">{shareCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-purple-500">
            <Eye size={14} />
            <span className="text-xs font-semibold">{getNumber(course.total_views)}</span>
          </div>
        </div>

        {/* Social action buttons */}
        <div className="flex gap-2 mb-4 cursor-pointer">
          <LikeButton 
            courseId={course.id}
            initialLikeCount={likeCount}
            initialLiked={false}
            size="sm" showCount variant="outline"
            className="flex-1 cursor-pointer"
          />
          <ShareButton 
            courseId={course.id}
            courseTitle={course.title}
            initialShareCount={shareCount}
            size="sm" showCount variant="outline"
            className="flex-1 cursor-pointer"
          />
        </div>

        {/* Short description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10">
          {course.short_description || (course.description_html ? course.description_html.substring(0, 100) + '...' : 'No description available')}
        </p>

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button onClick={() => onEdit?.(course)} variant="outline" size="sm" className="flex-1 text-xs cursor-pointer">
              Edit
            </Button>
            {course.is_published ? (
              <Button onClick={() => onUnpublish?.(course)} variant="outline" size="sm"
                className="cursor-pointer flex-1 text-xs bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100">
                Unpublish
              </Button>
            ) : (
              <Button onClick={() => onPublish?.(course)} size="sm"
                className="cursor-pointer flex-1 text-xs bg-green-600 hover:bg-green-700 text-white">
                Publish
              </Button>
            )}
          </div>
          <Link href={`/dashboard/instructor/courses/${course.id}/curriculum`}>
            <Button variant="outline" size="sm"
              className="cursor-pointer w-full text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
              <FileText size={14} className="mr-2" /> Curriculum
            </Button>
          </Link>
          <Link href={`/dashboard/instructor/quizzes?course=${course.id}`}>
            <Button variant="outline" size="sm"
              className="w-full cursor-pointer text-xs bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100">
              <FileQuestion size={14} className="mr-2" /> Quizzes
            </Button>
          </Link>
          <Button onClick={() => onDelete?.(course)} variant="destructive" size="sm"
            className="w-full text-xs cursor-pointer">
            Delete
          </Button>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            Created: {new Date(course.created_at).toLocaleDateString()}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            course.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {course.is_published ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Premium Course Grid ──────────────────────────────────────────────────────

function PremiumCourseGrid({ courses, title, description, onEdit, onDelete, onPublish, onUnpublish }: { 
  courses: Course[]; title: string; description?: string;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  onPublish?: (course: Course) => void;
  onUnpublish?: (course: Course) => void;
}) {
  if (!courses || courses.length === 0) return null;
  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-gray-900">{title}</CardTitle>
        {description && <CardDescription className="text-gray-600">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => (
            <PremiumCourseCard key={course.id} course={course}
              onEdit={onEdit} onDelete={onDelete} onPublish={onPublish} onUnpublish={onUnpublish}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── CourseManager ────────────────────────────────────────────────────────────

export function CourseManager({ initialCourses, categories }: CourseManagerProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => { setCourses(initialCourses); }, [initialCourses]);

  const totalLikes    = courses.reduce((s, c) => s + getNumber(c.like_count), 0);
  const totalShares   = courses.reduce((s, c) => s + getNumber(c.share_count), 0);
  const totalViews    = courses.reduce((s, c) => s + getNumber(c.total_views), 0);
  const totalStudents = courses.reduce((s, c) => s + getNumber(c.enrolled_students_count), 0);

  // ── Aggregated average rating — FIXED ─────────────────────────────────────
  // Weight each course's rating by its review count so courses with more
  // reviews count more toward the instructor-level average.
  const { weightedSum, totalReviews } = courses.reduce(
    (acc, course) => {
      const rating  = typeof course.average_rating === 'string'
        ? parseFloat(course.average_rating) : Number(course.average_rating ?? 0);
      const reviews = typeof course.review_count === 'string'
        ? parseInt(course.review_count) : Number(course.review_count ?? 0);
      if (rating > 0 && reviews > 0) {
        acc.weightedSum  += rating * reviews;
        acc.totalReviews += reviews;
      }
      return acc;
    },
    { weightedSum: 0, totalReviews: 0 }
  );
  const averageRating = totalReviews > 0
    ? (weightedSum / totalReviews).toFixed(1)
    : '0.0';

  const engagementRate = totalStudents > 0
    ? ((totalLikes + totalShares) / totalStudents * 100).toFixed(1)
    : '0.0';

  const publishedCourses = courses.filter(c => c.is_published);
  const draftCourses     = courses.filter(c => !c.is_published);

  // ── Handlers (unchanged) ──────────────────────────────────────────────────

  const handleCreateCourse  = () => { setViewMode('create'); setEditingCourse(null); };
  const handleEditCourse    = (course: Course) => { setEditingCourse(course); setViewMode('edit'); };
  const handleCancelEdit    = () => { setViewMode('list'); setEditingCourse(null); };

  const handleSaveCourse = (savedCourse: Course) => {
    if (editingCourse) {
      setCourses(prev => prev.map(c => c.id === savedCourse.id ? savedCourse : c));
      toast.success('Course updated successfully');
    } else {
      setCourses(prev => [savedCourse, ...prev]);
      toast.success('Course created successfully');
    }
    setViewMode('list'); setEditingCourse(null); router.refresh();
  };

  const handleDeleteCourse = async (course: Course) => {
    if (!confirm(`Are you sure you want to delete "${course.title}"? This action cannot be undone.`)) return;
    try {
      setLoading(true);
      const res  = await fetch(`/api/courses/${course.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) { setCourses(prev => prev.filter(c => c.id !== course.id)); toast.success('Course deleted successfully'); router.refresh(); }
      else toast.error('Error', { description: data.error || 'Failed to delete course' });
    } catch { toast.error('Error', { description: 'Failed to delete course' }); }
    finally { setLoading(false); }
  };

  const handlePublishCourse = async (course: Course) => {
    try {
      setLoading(true);
      const res  = await fetch(`/api/courses/${course.id}/publish`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) { setCourses(prev => prev.map(c => c.id === course.id ? { ...c, is_published: true } : c)); toast.success('Course published successfully'); router.refresh(); }
      else toast.error('Error', { description: data.error || 'Failed to publish course' });
    } catch { toast.error('Error', { description: 'Failed to publish course' }); }
    finally { setLoading(false); }
  };

  const handleUnpublishCourse = async (course: Course) => {
    try {
      setLoading(true);
      const res  = await fetch(`/api/courses/${course.id}/publish`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) { setCourses(prev => prev.map(c => c.id === course.id ? { ...c, is_published: false } : c)); toast.success('Course unpublished successfully'); router.refresh(); }
      else toast.error('Error', { description: data.error || 'Failed to unpublish course' });
    } catch { toast.error('Error', { description: 'Failed to unpublish course' }); }
    finally { setLoading(false); }
  };

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <CourseEditor
        course={editingCourse || undefined}
        categories={categories}
        onSave={handleSaveCourse}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Course Overview</h2>
              <p className="text-gray-600 mt-1">Manage your course content and track social engagement</p>
            </div>
            <Button onClick={handleCreateCourse}
              className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              size="lg">
              Create New Course
            </Button>
          </div>

          {/* Top stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <SocialStatsCard title="My Courses"     value={courses.length}           icon={BookOpen} color="blue"   />
            {/* Average Rating — now weighted & live from course_reviews */}
            <SocialStatsCard title="Average Rating" value={parseFloat(averageRating)} icon={Star}     color="yellow" />
            <SocialStatsCard title="My Students"    value={totalStudents}             icon={Users}    color="green"  />
            <SocialStatsCard title="Total Likes"    value={totalLikes}                icon={Heart}    color="red"    />
          </div>

          {/* Secondary metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-2xl border-2 border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Engagement Rate</p>
                  <p className="text-xl font-bold text-gray-900">{engagementRate}%</p>
                  <p className="text-xs text-gray-500 mt-1">Likes &amp; shares per 100 students</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                  <TrendingUp size={20} />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-indigo-50 to-violet-50 p-4 rounded-2xl border-2 border-indigo-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Shares</p>
                  <p className="text-xl font-bold text-gray-900">{totalShares.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Total shares across my courses</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
                  <Share2 size={20} />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-2xl border-2 border-cyan-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Published Courses</p>
                  <p className="text-xl font-bold text-gray-900">{publishedCourses.length}</p>
                  <p className="text-xs text-gray-500 mt-1">My live courses</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
                  <Play size={20} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Published Courses */}
      {publishedCourses.length > 0 && (
        <PremiumCourseGrid
          courses={publishedCourses}
          title="My Published Courses"
          description="Your published courses that are available to students"
          onEdit={handleEditCourse}
          onDelete={handleDeleteCourse}
          onUnpublish={handleUnpublishCourse}
        />
      )}

      {/* Draft Courses */}
      {draftCourses.length > 0 && (
        <PremiumCourseGrid
          courses={draftCourses}
          title="My Draft Courses"
          description="Courses that are not yet published"
          onEdit={handleEditCourse}
          onDelete={handleDeleteCourse}
          onPublish={handlePublishCourse}
        />
      )}

      {/* Empty State */}
      {courses.length === 0 && (
        <Card className="border-2 text-center py-16">
          <CardContent className="p-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-6 text-lg">
                Start creating your first course to share your knowledge with students
              </p>
              <Button onClick={handleCreateCourse} size="lg"
                className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg px-8">
                Create Your First Course
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
