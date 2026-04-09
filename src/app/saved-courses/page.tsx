'use client';

// /src/app/saved-courses/page.tsx

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getSavedCoursesAction } from '@/lib/courses/saved-courses-actions';
import { toggleSaveCourseAction } from '@/lib/courses/saved-courses-actions';
import {
  Bookmark,
  BookmarkX,
  Star,
  Users,
  ArrowRight,
  Loader2,
  BookOpen,
  Sparkles,
} from 'lucide-react';

interface SavedCourse {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  thumbnail_url: string | null;
  price_cents: number;
  level: string | null;
  language: string | null;
  average_rating: number;
  review_count: number;
  enrolled_students_count: number;
  instructor_name: string | null;
  instructor_image: string | null;
  category_name: string | null;
  saved_at: string;
}

function SavedCourseCard({
  course,
  onRemove,
}: {
  course: SavedCourse;
  onRemove: (courseId: string) => void;
}) {
  const [removing, setRemoving] = useState(false);
  const { toast } = useToast();

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRemoving(true);
    try {
      const result = await toggleSaveCourseAction(course.id);
      if (result.success) {
        onRemove(course.id);
        toast({ title: 'Removed', description: 'Course removed from saved list' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to remove course', variant: 'destructive' });
    } finally {
      setRemoving(false);
    }
  };

  const levelColor: Record<string, string> = {
    beginner: 'bg-emerald-100 text-emerald-700',
    intermediate: 'bg-amber-100 text-amber-700',
    advanced: 'bg-rose-100 text-rose-700',
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Thumbnail */}
      <Link href={`/courses/${course.slug}`} className="block relative overflow-hidden aspect-video bg-gray-100">
        {course.thumbnail_url ? (
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
            <BookOpen size={40} className="text-white/70" />
          </div>
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white font-semibold flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
            View Course <ArrowRight size={16} />
          </span>
        </div>

        {/* Free badge */}
        {course.price_cents === 0 && (
          <div className="absolute top-3 left-3">
            <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">FREE</span>
          </div>
        )}

        {/* Level badge */}
        {course.level && (
          <div className="absolute top-3 right-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${levelColor[course.level] || 'bg-gray-100 text-gray-700'}`}>
              {course.level}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {course.category_name && (
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">
            {course.category_name}
          </p>
        )}

        <Link href={`/courses/${course.slug}`}>
          <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 line-clamp-2 hover:text-indigo-600 transition-colors">
            {course.title}
          </h3>
        </Link>

        {course.short_description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">
            {course.short_description}
          </p>
        )}

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-3">
          {course.instructor_image ? (
            <Image src={course.instructor_image} alt={course.instructor_name || 'Instructor'}
              width={24} height={24} className="rounded-full object-cover" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-white text-[10px] font-bold">
              {course.instructor_name?.charAt(0).toUpperCase() || 'I'}
            </div>
          )}
          <span className="text-xs text-gray-600 truncate">{course.instructor_name || 'Instructor'}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {course.average_rating > 0 && (
              <span className="flex items-center gap-1">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="font-semibold text-gray-700">{course.average_rating.toFixed(1)}</span>
                <span>({course.review_count})</span>
              </span>
            )}
            {course.enrolled_students_count > 0 && (
              <span className="flex items-center gap-1">
                <Users size={12} />
                {course.enrolled_students_count.toLocaleString()}
              </span>
            )}
          </div>

          <p className="font-bold text-gray-900 text-sm">
            {course.price_cents === 0 ? (
              <span className="text-emerald-600">Free</span>
            ) : (
              `₦${course.price_cents.toLocaleString('en-NG')}`
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <Link href={`/courses/${course.slug}`} className="flex-1">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold" size="sm">
              Go to Course
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemove}
            disabled={removing}
            className="border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 rounded-xl"
            title="Remove from saved"
          >
            {removing ? <Loader2 size={14} className="animate-spin" /> : <BookmarkX size={14} />}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SavedCoursesPage() {
  const [courses, setCourses] = useState<SavedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [requiresAuth, setRequiresAuth] = useState(false);

  useEffect(() => {
    getSavedCoursesAction().then((result) => {
      if (result.requiresAuth) {
        setRequiresAuth(true);
      } else {
        setCourses(result.courses as SavedCourse[]);
      }
      setLoading(false);
    });
  }, []);

  const handleRemove = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero banner */}
        <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white py-14 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                <Bookmark size={22} className="text-amber-400 fill-amber-400" />
              </div>
              <span className="text-amber-400 font-semibold text-sm uppercase tracking-widest">My Library</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight">
              Saved Courses
            </h1>
            <p className="text-white/70 text-lg max-w-xl">
              Your curated list of courses saved for future learning. Pick up where you left off.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 size={40} className="animate-spin text-indigo-500" />
              <p className="text-gray-500">Loading your saved courses…</p>
            </div>
          ) : requiresAuth ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
              <div className="p-5 bg-indigo-50 rounded-full border border-indigo-100">
                <Bookmark size={48} className="text-indigo-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view saved courses</h2>
                <p className="text-gray-500 max-w-sm mx-auto">You need to be signed in to access your saved courses.</p>
              </div>
              <Link href="/login">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-xl font-semibold">
                  Sign In
                </Button>
              </Link>
            </div>
          ) : courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
              <div className="relative">
                <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100">
                  <Bookmark size={52} className="text-indigo-300" />
                </div>
                <div className="absolute -top-1 -right-1 p-1.5 bg-amber-400 rounded-full">
                  <Sparkles size={14} className="text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No saved courses yet</h2>
                <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                  Browse courses and click the{' '}
                  <strong className="text-indigo-600">Save</strong> button to bookmark them here for later.
                </p>
              </div>
              <Link href="/courses">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-xl font-semibold gap-2">
                  Browse Courses <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-gray-600">
                  <span className="font-bold text-gray-900 text-lg">{courses.length}</span>{' '}
                  {courses.length === 1 ? 'course' : 'courses'} saved
                </p>
                <Link href="/courses">
                  <Button variant="outline" className="gap-2 rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                    Browse More <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <SavedCourseCard key={course.id} course={course} onRemove={handleRemove} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
