

// // =======================================================================================

// /src/app/courses/[slug]/page.tsx

'use client'

import { getCourseBySlugAction, getCourseCurriculumAction } from '@/lib/courses/actions';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Users, BookOpen, Play, Check, Award, Globe, Calendar, Heart, Share2, Eye } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CourseReviewsSection } from '@/components/courses/course-reviews-section';
import { CourseCurriculum } from '@/components/courses/course-curriculum';
import { LikeButton } from '@/components/social/like-button';
import { ShareButton } from '@/components/social/share-button';
import { CourseEnrollment } from '@/components/courses/course-enrollment';
import { PromoVideoPlayer } from '@/components/courses/promo-video-player';

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export default function CoursePage({ params }: CoursePageProps) {
  const [course, setCourse] = useState<any>(null);
  const [curriculum, setCurriculum] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState<number>(0);

  // ✅ Guard: ensure recordCourseView is only called once per page mount
  const viewRecorded = useRef(false);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        const { slug } = await params;
        const courseResult = await getCourseBySlugAction(slug);

        if (!courseResult.success || !courseResult.course) {
          setError('Course not found');
          return;
        }

        setCourse(courseResult.course);
        setViewCount(courseResult.course.total_views || 0);

        if (courseResult.course.id) {
          const curriculumResult = await getCourseCurriculumAction(courseResult.course.id);
          if (curriculumResult.success) {
            setCurriculum(curriculumResult.curriculum || []);
          }

          // ✅ Only record view once, regardless of re-renders
          if (!viewRecorded.current) {
            viewRecorded.current = true;
            recordCourseView(courseResult.course.id);
          }
        }
      } catch (err) {
        setError('Failed to load course');
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCourseData();
  }, [params]);

  const recordCourseView = async (courseId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) setViewCount(data.total_views);
      }
    } catch {
      // View counting is non-critical — fail silently
    }
  };

  const formatDuration = (minutes: number | null | undefined) => {
    if (!minutes || minutes === 0) return 'Duration not specified';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading course...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !course) notFound();

  return (
    <CourseClientContent
      course={course}
      curriculum={curriculum}
      viewCount={viewCount}
      formatDuration={formatDuration}
    />
  );
}

// ── Inner client component ────────────────────────────────────────────────────

function CourseClientContent({
  course,
  curriculum,
  viewCount,
  formatDuration,
}: {
  course: any;
  curriculum: any[];
  viewCount: number;
  formatDuration: (m: number | null | undefined) => string;
}) {
  // Single status check shared by both CourseEnrollment instances
  const [hasAccess, setHasAccess] = useState(false);
  // isEnrolled alias used by CourseCurriculum
  const isEnrolled = hasAccess;

  useEffect(() => {
    async function checkAccess() {
      try {
        const response = await fetch(`/api/payment/status?courseId=${course.id}`);
        if (response.ok) {
          const data = await response.json();
          setHasAccess(data.data?.hasAccess === true);
        }
      } catch {}
    }
    checkAccess();
  }, [course.id]);

  const totalLessons = curriculum.reduce(
    (total: number, module: any) => total + (module.lessons?.length || 0), 0
  );
  const totalDuration = curriculum.reduce((total: number, module: any) => {
    return total + (module.lessons?.reduce((t: number, l: any) => t + (l.video_duration || 0), 0) || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />


  {/* Hero */}
<section
  className="text-white relative overflow-hidden"
  style={{ background: 'linear-gradient(180deg, #0a0a14 0%, #0f0a1e 50%, #0a0a14 100%)' }}
>
  {/* ── Checky grid background ── */}
  <div className="absolute inset-0 pointer-events-none">
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        
        // backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
        //                   linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
        
        backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,

        backgroundSize: '40px 40px',
      }}
    />
    <div
      className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px]"
      style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)' }}
    />
    <div
      className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[100px]"
      style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)' }}
    />
  </div>

  {/* Content */}
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="grid md:grid-cols-3 gap-12 items-end">
      <div className="md:col-span-2">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="bg-white/20 text-white border-0 capitalize">
            {course.difficulty_level}
          </Badge>
          {course.category_name && (
            <Badge variant="outline" className="bg-transparent text-white border-white/30">
              {course.category_name}
            </Badge>
          )}
          {course.is_featured && (
            <Badge className="bg-yellow-500 text-black border-0">Featured</Badge>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{course.title}</h1>
        {course.subtitle && (
          <p className="text-xl opacity-90 mb-6 text-gray-200">{course.subtitle}</p>
        )}
        <p className="text-lg opacity-90 mb-6 text-gray-300">{course.short_description}</p>

        <div className="flex flex-wrap gap-6 mb-6">
          {course.average_rating > 0 && (
            <div className="flex items-center gap-2">
              <Star className="fill-yellow-400 text-yellow-400" size={20} />
              <span className="font-semibold">{course.average_rating.toFixed(1)}</span>
              <span className="opacity-80">({course.review_count || 0} reviews)</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Users size={20} />
            <span>{course.enrolled_students_count?.toLocaleString() || 0} students</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={20} />
            <span>{formatDuration(course.total_video_duration)}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen size={20} />
            <span>{course.total_lessons || 0} lessons</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 mb-6 p-4 bg-white/10 rounded-lg">
          <div className="flex items-center gap-2">
            <Heart size={18} className="fill-red-500 text-red-500" />
            <span className="font-semibold">{course.like_count || 0} likes</span>
          </div>
          <div className="flex items-center gap-2">
            <Share2 size={18} />
            <span className="font-semibold">{course.share_count || 0} shares</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye size={18} />
            <span className="font-semibold">{viewCount.toLocaleString()} views</span>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <LikeButton
            courseId={course.id}
            initialLikeCount={course.like_count || 0}
            size="lg"
            showCount={true}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          />
          <ShareButton
            courseId={course.id}
            courseTitle={course.title}
            initialShareCount={course.share_count || 0}
            size="lg"
            showCount={true}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          />
        </div>

        <div>
          <p className="opacity-80 mb-2">Instructor</p>
          <p className="font-bold text-white">{course.instructor_name}</p>
        </div>
      </div>

      {/* Enrollment Card */}
      <div
        className="rounded-2xl p-8 shadow-2xl h-fit relative overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Card inner top shimmer */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(139,92,246,0.6), rgba(99,102,241,0.8), transparent)',
          }}
        />



        {/* <div className="w-full h-48 rounded-lg overflow-hidden mb-6 bg-white/5 relative">
          {course.thumbnail_url ? (
            <div className="relative w-full h-full">
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              {course.promo_video_url && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity cursor-pointer shadow-lg">
                    <Play className="text-white ml-1" size={24} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
              <span className="text-6xl">
                {course.content_type === 'video' ? '🎬' : '📚'}
              </span>
            </div>
          )}
        </div> */}



    

    {course.promo_video_url ? (
    <PromoVideoPlayer
      promoVideoUrl={course.promo_video_url}
      thumbnailUrl={course.thumbnail_url}
      courseTitle={course.title}
    />
  ) : course.thumbnail_url ? (
    <div className="w-full h-48 rounded-lg overflow-hidden mb-6 bg-white/5 relative">
      <img
        src={course.thumbnail_url}
        alt={course.title}
        className="w-full h-full object-cover"
      />
    </div>
  ) : (
    <div className="w-full h-48 rounded-lg overflow-hidden mb-6 bg-white/5 relative">
      <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
        <span className="text-6xl">
          {course.content_type === 'video' ? '🎬' : '📚'}
        </span>
      </div>
    </div>
  )}




        <div className="mb-6">
          <div className="text-4xl font-bold text-white mb-2">
            {course.price_cents === 0
              ? 'Free'
              : `₦${(course.price_cents).toLocaleString('en-NG')}`}
          </div>
          <p className="text-white/40">Full lifetime access</p>
        </div>

        <CourseEnrollment
          courseId={course.id}
          courseSlug={course.slug}
          priceCents={course.price_cents}
          initialHasAccess={hasAccess}
        />

        <div className="text-xs text-white/30 text-center mt-4 space-y-2">
          {/* <p>30-day money-back guarantee</p> */}
          {course.certificate_available && (
            <p className="flex items-center justify-center gap-1">
              <Award size={14} /> Certificate included
            </p>
          )}
        </div>
      </div>

    </div>
  </div>
</section>


      {/* Instructor */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">About the Instructor</h2>
          <div className="flex gap-8 items-start">
            {course.instructor_image ? (
              <img src={course.instructor_image} alt={course.instructor_name || 'Instructor'}
                className="w-24 h-24 rounded-full object-cover flex-shrink-0 border-4 border-white shadow-lg" />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-lg">
                {course.instructor_name?.charAt(0).toUpperCase() || 'I'}
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold mb-1 text-gray-900">{course.instructor_name}</h3>
              <p className="text-gray-600 mb-3">{course.instructor_bio || 'Experienced instructor'}</p>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{course.enrolled_students_count?.toLocaleString() || 0}</span> students enrolled
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            {course.description_html && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">About This Course</h2>
                <div className="prose prose-lg max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: course.description_html }} />
              </div>
            )}

            {course.learning_objectives?.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">What You'll Learn</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {course.learning_objectives.map((obj: string, i: number) => (
                    <div key={i} className="flex gap-3">
                      <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                      <p className="text-gray-700">{obj}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {course.prerequisites?.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Prerequisites</h2>
                <ul className="space-y-3">
                  {course.prerequisites.map((p: string, i: number) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-blue-600 font-bold mt-1">•</span>
                      <span className="text-gray-700">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {course.target_audience?.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Target Audience</h2>
                <ul className="space-y-3">
                  {course.target_audience.map((a: string, i: number) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-purple-600 font-bold mt-1">🎯</span>
                      <span className="text-gray-700">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-12">
              <CourseCurriculum curriculum={curriculum} courseId={course.id} isEnrolled={isEnrolled} />
            </div>

            <div>
              <CourseReviewsSection courseId={course.id} courseSlug={course.slug} />
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg sticky top-20">
              <div className="mb-6 space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-gray-700" size={20} />
                  <span className="font-semibold text-gray-900">{totalLessons} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-gray-700" size={20} />
                  <span className="font-semibold text-gray-900">{formatDuration(totalDuration)} total</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="text-gray-700" size={20} />
                  <span className="font-semibold text-gray-900">{course.language || 'English'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="text-gray-700" size={20} />
                  <span className="font-semibold text-gray-900">
                    Last updated: {new Date(course.updated_at).toLocaleDateString()}
                  </span>
                </div>
                {course.average_rating > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="fill-yellow-400 text-yellow-400" size={20} />
                    <span className="font-semibold text-gray-900">{course.average_rating.toFixed(1)} Rating</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Eye className="text-gray-700" size={20} />
                  <span className="font-semibold text-gray-900">{viewCount.toLocaleString()} views</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                <p className="text-sm text-blue-800 font-semibold">
                  {course.price_cents === 0
                    ? 'Free course! Enroll today and start learning'
                    : `Special offer! Enroll today for ₦${(course.price_cents).toLocaleString('en-NG')}`}
                </p>
              </div>

              <div className="bg-black rounded-lg p-1">
                <CourseEnrollment courseId={course.id} courseSlug={course.slug} priceCents={course.price_cents} initialHasAccess={hasAccess} />
              </div>

              {/* <p className="text-xs text-gray-500 text-center mt-4">
                30-day money-back guarantee. No questions asked.
              </p> */}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

