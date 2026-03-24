

// File: /src/app/page.tsx

'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Loader2, Play, ArrowRight, Users, BookOpen, Star, 
  ChevronLeft, ChevronRight as ChevronRightIcon, Heart,
  Clock, Sparkles, Award, GraduationCap, Rocket, Layers, Target,
  Globe, Coffee, ShieldCheck, Shield, Search, BadgeCheck, Zap,
  Flame, Gift,
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import AnimatedStatsCounter from '@/components/home/animated-stats-counter';
import Image from 'next/image';
import BecomeInstructorSteps from '@/components/home/become-instructor-steps';
import AutoSlider from '@/components/home/AutoSlider';
import { getCoursesAction } from '@/lib/courses/actions';
import { motion, useInView } from 'framer-motion';
import CountUp from 'react-countup';

type CourseAny = any;
type CategoryAny = any;

interface SiteStats {
  activeLearners: number;
  expertInstructors: number;
  coursesAvailable: number;
  averageRating: number;
}


// ─────────────────────────────────────────
// Premium Course Card — Redesigned
// ─────────────────────────────────────────
function PremiumCourseCard({ course, index }: { course: CourseAny; index: number }) {
  const formatRating = (rating: number | undefined, reviewCount: number | undefined): string | null => {
    if (!rating || rating <= 0) return null;
    if (reviewCount !== undefined && reviewCount <= 0) return null;
    return rating.toFixed(1);
  };

  const formatNumber = (num: number | undefined): string => {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString();
  };

  const formatDuration = (minutes: number | undefined): string | null => {
    if (!minutes || minutes <= 0) return null;
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const rating = formatRating(course.average_rating, course.review_count);
  const duration = formatDuration(course.total_video_duration);

  const cardThemes = [
    {
      thumb: 'from-violet-500 via-purple-600 to-indigo-700',
      accent: '#7c3aed',
      glow: 'rgba(124,58,237,0.15)',
      tag: 'bg-violet-50 text-violet-600 border-violet-100',
      btn: 'bg-violet-600 hover:bg-violet-700',
    },
    {
      thumb: 'from-pink-500 via-rose-500 to-orange-500',
      accent: '#db2777',
      glow: 'rgba(219,39,119,0.15)',
      tag: 'bg-pink-50 text-pink-600 border-pink-100',
      btn: 'bg-pink-600 hover:bg-pink-700',
    },
    {
      thumb: 'from-emerald-500 via-teal-500 to-cyan-600',
      accent: '#059669',
      glow: 'rgba(5,150,105,0.15)',
      tag: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      btn: 'bg-emerald-600 hover:bg-emerald-700',
    },
    {
      thumb: 'from-amber-500 via-orange-500 to-red-500',
      accent: '#d97706',
      glow: 'rgba(217,119,6,0.15)',
      tag: 'bg-amber-50 text-amber-600 border-amber-100',
      btn: 'bg-amber-600 hover:bg-amber-700',
    },
  ];

  const theme = cardThemes[index % cardThemes.length];

  return (
    <Link
      href={`/courses/${course.slug || course.id}`}
      className="group block h-full cursor-pointer"
    >
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative h-full rounded-3xl overflow-hidden bg-white"
        style={{
          boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
        }}
      >
        {/* Hover glow border */}
        <div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
          style={{
            boxShadow: `inset 0 0 0 1.5px ${theme.accent}40, 0 20px 60px ${theme.glow}`,
          }}
        />

        {/* ── Thumbnail ── */}
        <div className={`relative h-48 bg-gradient-to-br ${theme.thumb} overflow-hidden`}>

          {/* Dot pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                                radial-gradient(circle at 80% 20%, white 1px, transparent 1px),
                                radial-gradient(circle at 60% 80%, white 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
            }}
          />

          {/* Course image */}
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2 opacity-90">
                  {course.category_name?.toLowerCase().includes('web')      ? '💻' :
                   course.category_name?.toLowerCase().includes('design')   ? '🎨' :
                   course.category_name?.toLowerCase().includes('data')     ? '📊' :
                   course.category_name?.toLowerCase().includes('business') ? '💼' :
                   course.category_name?.toLowerCase().includes('music')    ? '🎵' :
                   course.category_name?.toLowerCase().includes('photo')    ? '📷' :
                   course.category_name?.toLowerCase().includes('health')   ? '❤️' :
                   course.category_name?.toLowerCase().includes('language') ? '🌐' : '📚'}
                </div>
                <div className="text-white/60 text-xs font-medium tracking-wider uppercase">
                  {course.category_name || 'Course'}
                </div>
              </div>
            </div>
          )}

          {/* Bottom gradient overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 h-20"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}
          />

          {/* Badge top-left */}
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-800 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm">
              {course.is_featured ? (
                <><Star size={9} className="fill-amber-400 text-amber-400" /> Featured</>
              ) : course.is_trending ? (
                <><Flame size={9} className="text-orange-500" /> Trending</>
              ) : (
                <><Sparkles size={9} className="text-violet-500" /> New</>
              )}
            </span>
          </div>

          {/* Price badge top-right */}
          <div className="absolute top-3 right-3 z-10">
            <span
              className="inline-flex items-center bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-black shadow-sm"
              style={{ color: theme.accent }}
            >
              {course.price_cents === 0 ? (
                <><Gift size={9} className="mr-1" /> FREE</>
              ) : (
                `$${(course.price_cents / 100).toFixed(0)}`
              )}
            </span>
          </div>

          {/* Play button on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300"
              style={{ background: 'rgba(255,255,255,0.95)' }}
            >
              <Play
                size={20}
                style={{ color: theme.accent, fill: theme.accent, marginLeft: 2 }}
              />
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="p-5 flex flex-col gap-3">

          {/* Category tag */}
          {course.category_name && (
            <span className={`inline-flex items-center gap-1 w-fit text-[10px] font-bold px-2.5 py-1 rounded-full border ${theme.tag}`}>
              <Layers size={9} />
              {course.category_name}
            </span>
          )}

          {/* Title */}
          <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-gray-700 transition-colors">
            {course.title}
          </h3>

          {/* Instructor */}
          <div className="flex items-center gap-2">
            <div className="relative flex-shrink-0">
              {course.instructor_image ? (
                <img
                  src={course.instructor_image}
                  alt={course.instructor_name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-sm"
                />
              ) : (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-black shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}99)` }}
                >
                  {course.instructor_name?.charAt(0) || 'E'}
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-700 truncate">
                {course.instructor_name || 'Expert Instructor'}
              </p>
              <p className="text-[10px] text-gray-400">Course Instructor</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100" />

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-gray-800">{rating || '—'}</span>
              {course.review_count > 0 && (
                <span className="text-gray-400">({formatNumber(course.review_count)})</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-gray-400" />
              <span>{formatNumber(course.enrolled_students_count)}</span>
            </div>
            {duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-gray-400" />
                <span>{duration}</span>
              </div>
            )}
          </div>

          {/* CTA button */}
          <button
            className={`w-full mt-1 ${theme.btn} text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg cursor-pointer`}
          >
            Preview Course
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </motion.div>
    </Link>
  );
}

// ─────────────────────────────────────────
// Premium Course Grid — Redesigned
// ─────────────────────────────────────────
function PremiumCourseGrid({ courses, title, description, viewAllLink }: {
  courses: CourseAny[];
  title: string;
  description?: string;
  viewAllLink: string;
}) {
  const [visibleCourses, setVisibleCourses] = useState(8);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  if (!courses || courses.length === 0) return null;

  const filters = [
    { id: 'all',      label: 'All Courses', icon: <BookOpen size={13} /> },
    { id: 'featured', label: 'Featured',    icon: <Star size={13} /> },
    { id: 'trending', label: 'Trending',    icon: <Flame size={13} /> },
    { id: 'free',     label: 'Free',        icon: <Gift size={13} /> },
  ];

  const filteredCourses = courses.filter(c => {
    if (activeFilter === 'featured') return c.is_featured;
    if (activeFilter === 'trending') return c.is_trending;
    if (activeFilter === 'free')     return c.price_cents === 0;
    return true;
  });

  const displayedCourses = filteredCourses.slice(0, visibleCourses);
  const hasMore = visibleCourses < filteredCourses.length;

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCourses(prev => prev + 8);
      setLoadingMore(false);
    }, 500);
  };

  return (
    <section className="relative py-24 overflow-hidden">

      {/* ── Background ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #faf8ff 30%, #f0f4ff 60%, #fdf8ff 100%)',
        }}
      />
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
              style={{
                background: 'rgba(139,92,246,0.08)',
                border: '1px solid rgba(139,92,246,0.15)',
              }}
            >
              {/* <Sparkles size={13} style={{ color: '#7c3aed' }} /> */}
              <span
                className="text-xs font-bold tracking-[2px] uppercase"
                style={{ color: '#7c3aed' }}
              >
                Top Rated Courses
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-2">
              {title}
            </h2>
            <p className="text-gray-500 text-lg">
              {description || 'Hand-picked by our editorial team'}
            </p>
          </div>
          <Link
            href={viewAllLink}
            className="group inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-300 flex-shrink-0 cursor-pointer"
            style={{
              background: 'rgba(124,58,237,0.06)',
              border: '1.5px solid rgba(124,58,237,0.2)',
              color: '#7c3aed',
            }}
          >
            View all courses
            <ArrowRight
              size={15}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex gap-2 flex-wrap items-center mb-10">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => { setActiveFilter(f.id); setVisibleCourses(8); }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer"
              style={
                activeFilter === f.id
                  ? {
                      background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                      color: '#ffffff',
                      boxShadow: '0 4px 14px rgba(124,58,237,0.3)',
                    }
                  : {
                      background: 'rgba(0,0,0,0.04)',
                      color: '#6b7280',
                      border: '1px solid rgba(0,0,0,0.06)',
                    }
              }
            >
              {f.icon}
              {f.label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            {filteredCourses.length} courses available
          </div>
        </div>

        {/* ── Grid ── */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400 font-medium">No courses match this filter</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {displayedCourses.map((course, index) => (
              <PremiumCourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
        )}

        {/* ── Load more ── */}
        {hasMore && (
          <div className="text-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="inline-flex items-center gap-3 font-bold px-10 py-4 rounded-full text-sm transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{
                background: loadingMore
                  ? 'rgba(0,0,0,0.04)'
                  : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                color: loadingMore ? '#9ca3af' : '#ffffff',
                boxShadow: loadingMore
                  ? 'none'
                  : '0 8px 28px rgba(124,58,237,0.3)',
              }}
            >
              {loadingMore ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Loading...</>
              ) : (
                <><Rocket className="h-4 w-4" /> Show More Courses</>
              )}
            </button>
          </div>
        )}

        {/* ── All loaded ── */}
        {!hasMore && filteredCourses.length > 8 && (
          <div className="text-center py-6">
            <div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full"
              style={{
                background: 'rgba(16,185,129,0.06)',
                border: '1px solid rgba(16,185,129,0.15)',
              }}
            >
              <Award className="h-4 w-4 text-emerald-500" />
              <p className="text-emerald-700 text-sm font-medium">
                🎉 You've seen all {filteredCourses.length} courses!
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}




// // ─────────────────────────────────────────
// // Categories Section
// // ─────────────────────────────────────────
// function CategoriesSection({ categories }: { categories: CategoryAny[] }) {
//   const scrollContainerRef = useRef<HTMLDivElement>(null);
//   const [showLeftArrow, setShowLeftArrow] = useState(false);
//   const [showRightArrow, setShowRightArrow] = useState(true);

//   if (!categories || categories.length === 0) return null;

//   const categoryIcons: { [key: string]: { icon: string; gradient: string } } = {
//     'web-development': { icon: '💻', gradient: 'from-blue-500 to-cyan-500' },
//     'programming':     { icon: '👨‍💻', gradient: 'from-purple-500 to-pink-500' },
//     'design':          { icon: '🎨', gradient: 'from-orange-500 to-red-500' },
//     'data-science':    { icon: '📊', gradient: 'from-green-500 to-emerald-500' },
//     'business':        { icon: '💼', gradient: 'from-yellow-500 to-orange-500' },
//     'marketing':       { icon: '📈', gradient: 'from-indigo-500 to-purple-500' },
//     'photography':     { icon: '📷', gradient: 'from-gray-700 to-gray-900' },
//     'music':           { icon: '🎵', gradient: 'from-pink-500 to-rose-500' },
//     'health':          { icon: '🏥', gradient: 'from-teal-500 to-cyan-500' },
//     'language':        { icon: '🌐', gradient: 'from-blue-500 to-indigo-500' },
//     'default':         { icon: '📚', gradient: 'from-primary to-secondary' },
//   };

//   const getCategoryStyle = (slug: string, icon?: string) => {
//     const style = categoryIcons[slug] || categoryIcons.default;
//     return { icon: icon || style.icon, gradient: style.gradient };
//   };

//   const scroll = (direction: 'left' | 'right') => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.scrollTo({
//         left: scrollContainerRef.current.scrollLeft + (direction === 'right' ? 300 : -300),
//         behavior: 'smooth',
//       });
//       setTimeout(updateArrowVisibility, 300);
//     }
//   };

//   const updateArrowVisibility = () => {
//     if (scrollContainerRef.current) {
//       const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//       setShowLeftArrow(scrollLeft > 10);
//       setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
//     }
//   };

//   useEffect(() => {
//     updateArrowVisibility();
//     window.addEventListener('resize', updateArrowVisibility);
//     return () => window.removeEventListener('resize', updateArrowVisibility);
//   }, [categories]);

//   return (
//     <section className="py-24 bg-white relative overflow-hidden">
//       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 via-white to-gray-50 pointer-events-none" />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
//         <div className="text-center mb-16">
//           <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
//             <Target size={16} />
//             Explore Categories
//           </span>
//           <h2 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Course</h2>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             Browse through our diverse categories and start your learning journey today
//           </p>
//         </div>

//         <div className="relative">
//           {showLeftArrow && (
//             <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 rounded-full p-4 shadow-xl hover:shadow-2xl transition-all hover:scale-110 hover:bg-primary hover:text-white">
//               <ChevronLeft className="h-5 w-5" />
//             </button>
//           )}
//           {showRightArrow && (
//             <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 rounded-full p-4 shadow-xl hover:shadow-2xl transition-all hover:scale-110 hover:bg-primary hover:text-white">
//               <ChevronRightIcon className="h-5 w-5" />
//             </button>
//           )}
//           <div
//             ref={scrollContainerRef}
//             onScroll={updateArrowVisibility}
//             className="flex gap-6 overflow-x-auto scroll-smooth py-6 px-4"
//             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//           >
//             {categories.map((category) => {
//               const style = getCategoryStyle(category.slug, category.icon);
//               return (
//                 <Link key={category.id} href={`/categories/${category.slug}`} className="group flex-shrink-0">
//                   <div className="relative w-48 p-8 rounded-2xl text-center transition-all transform hover:-translate-y-2">
//                     <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500 pointer-events-none`} />
//                     <div className="relative z-10">
//                       <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-500">{style.icon}</div>
//                       <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-white transition-colors">{category.name}</h3>
//                       <p className="text-sm text-gray-500 group-hover:text-white/90 transition-colors">{category.course_count || 0}+ courses</p>
//                       <div className="w-0 h-0.5 bg-white mx-auto mt-4 group-hover:w-12 transition-all duration-500" />
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         </div>

//         <div className="text-center mt-12">
//           <Link href="/categories">
//             <Button className="cursor-pointer rounded-full bg-gray-900 hover:bg-primary text-white px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group">
//               Browse All Categories
//               <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }




// ─────────────────────────────────────────
// Categories Section — Redesigned
// ─────────────────────────────────────────
function CategoriesSection({ categories }: { categories: CategoryAny[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  if (!categories || categories.length === 0) return null;

  const categoryConfig: {
    [key: string]: {
      gradient: string;
      glow: string;
      bg: string;
      svg: React.ReactNode;
    };
  } = {
    'web-development': {
      gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
      glow: 'rgba(99,102,241,0.4)',
      bg: 'rgba(99,102,241,0.08)',
      svg: (
        <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
          <rect x="8" y="16" width="64" height="48" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <rect x="8" y="16" width="64" height="12" rx="6" fill="rgba(99,102,241,0.25)"/>
          <circle cx="18" cy="22" r="2.5" fill="#ef4444"/>
          <circle cx="26" cy="22" r="2.5" fill="#f59e0b"/>
          <circle cx="34" cy="22" r="2.5" fill="#22c55e"/>
          <path d="M16 38 L24 46 L16 54" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M32 54 L48 54" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M56 38 L48 46 L56 54" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    'programming': {
      gradient: 'from-violet-500 via-purple-600 to-pink-600',
      glow: 'rgba(139,92,246,0.4)',
      bg: 'rgba(139,92,246,0.08)',
      svg: (
        <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
          <rect x="10" y="10" width="60" height="60" rx="8" fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5"/>
          <path d="M20 30 L30 40 L20 50" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M38 52 L52 28" stroke="#f472b6" strokeWidth="2" strokeLinecap="round"/>
          <path d="M42 52 L56 52" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="62" cy="20" r="5" fill="rgba(167,139,250,0.2)" stroke="#a78bfa" strokeWidth="1.5"/>
          <path d="M60 20 L62 22 L65 18" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    'design': {
      gradient: 'from-orange-400 via-pink-500 to-rose-600',
      glow: 'rgba(244,114,182,0.4)',
      bg: 'rgba(244,114,182,0.08)',
      svg: (
        <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
          <circle cx="40" cy="40" r="28" fill="rgba(244,114,182,0.1)" stroke="rgba(244,114,182,0.3)" strokeWidth="1.5"/>
          <circle cx="40" cy="40" r="8" fill="rgba(244,114,182,0.2)" stroke="#f472b6" strokeWidth="1.5"/>
          <path d="M40 12 L40 20M40 60 L40 68M12 40 L20 40M60 40 L68 40" stroke="rgba(244,114,182,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="40" cy="24" r="4" fill="#fb923c"/>
          <circle cx="56" cy="40" r="4" fill="#f472b6"/>
          <circle cx="40" cy="56" r="4" fill="#a78bfa"/>
          <circle cx="24" cy="40" r="4" fill="#38bdf8"/>
        </svg>
      ),
    },
    'data-science': {
      gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
      glow: 'rgba(20,184,166,0.4)',
      bg: 'rgba(20,184,166,0.08)',
      svg: (
        <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
          <rect x="10" y="50" width="12" height="22" rx="3" fill="rgba(52,211,153,0.6)"/>
          <rect x="26" y="38" width="12" height="34" rx="3" fill="rgba(52,211,153,0.7)"/>
          <rect x="42" y="26" width="12" height="46" rx="3" fill="rgba(52,211,153,0.85)"/>
          <rect x="58" y="16" width="12" height="56" rx="3" fill="#34d399"/>
          <path d="M16 48 L32 36 L48 24 L64 14" stroke="#a7f3d0" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2"/>
          <circle cx="16" cy="48" r="3" fill="white"/>
          <circle cx="32" cy="36" r="3" fill="white"/>
          <circle cx="48" cy="24" r="3" fill="white"/>
          <circle cx="64" cy="14" r="3" fill="white"/>
        </svg>
      ),
    },
    'business': {
      gradient: 'from-amber-400 via-orange-500 to-yellow-500',
      glow: 'rgba(251,191,36,0.4)',
      bg: 'rgba(251,191,36,0.08)',
      svg: (
        <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
          <rect x="20" y="30" width="40" height="36" rx="4" fill="rgba(251,191,36,0.12)" stroke="rgba(251,191,36,0.35)" strokeWidth="1.5"/>
          <rect x="30" y="22" width="20" height="10" rx="3" fill="rgba(251,191,36,0.2)" stroke="rgba(251,191,36,0.4)" strokeWidth="1.5"/>
          <path d="M20 44 L60 44" stroke="rgba(251,191,36,0.3)" strokeWidth="1"/>
          <circle cx="40" cy="52" r="5" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth="1.5"/>
          <path d="M38 52 L39.5 53.5 L43 50" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M28 36 L28 38M40 36 L40 38M52 36 L52 38" stroke="rgba(251,191,36,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    'marketing': {
      gradient: 'from-indigo-400 via-blue-500 to-violet-600',
      glow: 'rgba(99,102,241,0.4)',
      bg: 'rgba(99,102,241,0.08)',
      svg: (
        <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
          <circle cx="40" cy="40" r="28" fill="rgba(99,102,241,0.1)" stroke="rgba(99,102,241,0.25)" strokeWidth="1" strokeDasharray="4 3"/>
          <circle cx="40" cy="40" r="18" fill="rgba(99,102,241,0.1)" stroke="rgba(99,102,241,0.35)" strokeWidth="1" strokeDasharray="3 2"/>
          <circle cx="40" cy="40" r="8" fill="rgba(99,102,241,0.2)" stroke="#818cf8" strokeWidth="1.5"/>
          <path d="M40 12 L44 38 L40 40" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="40" cy="40" r="2.5" fill="#818cf8"/>
          <circle cx="58" cy="24" r="4" fill="rgba(99,102,241,0.3)" stroke="#818cf8" strokeWidth="1"/>
          <circle cx="20" cy="56" r="3" fill="rgba(167,139,250,0.4)" stroke="#a78bfa" strokeWidth="1"/>
        </svg>
      ),
    },
    'photography': {
      gradient: 'from-slate-400 via-gray-600 to-zinc-700',
      glow: 'rgba(100,116,139,0.4)',
      bg: 'rgba(100,116,139,0.08)',
      svg: (
        <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
          <rect x="10" y="24" width="60" height="42" rx="6" fill="rgba(148,163,184,0.12)" stroke="rgba(148,163,184,0.3)" strokeWidth="1.5"/>
          <path d="M10 34 L24 24 L30 30 L70 24" stroke="rgba(148,163,184,0.3)" strokeWidth="1"/>
          <circle cx="40" cy="46" r="12" fill="rgba(148,163,184,0.1)" stroke="rgba(148,163,184,0.4)" strokeWidth="1.5"/>
          <circle cx="40" cy="46" r="7" fill="rgba(148,163,184,0.15)" stroke="#94a3b8" strokeWidth="1.5"/>
          <circle cx="40" cy="46" r="3" fill="#94a3b8"/>
          <rect x="54" y="28" width="10" height="7" rx="2" fill="rgba(148,163,184,0.3)"/>
          <circle cx="18" cy="32" r="3" fill="rgba(148,163,184,0.4)"/>
        </svg>
      ),
    },
    'music': {
      gradient: 'from-pink-400 via-rose-500 to-red-500',
      glow: 'rgba(244,63,94,0.4)',
      bg: 'rgba(244,63,94,0.08)',
      svg: (
        <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
          <path d="M30 56 L30 24 L62 18 L62 50" stroke="#fb7185" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M30 24 L62 18" stroke="#fb7185" strokeWidth="1.5"/>
          <circle cx="24" cy="58" r="8" fill="rgba(251,113,133,0.15)" stroke="#fb7185" strokeWidth="1.5"/>
          <circle cx="56" cy="52" r="8" fill="rgba(251,113,133,0.15)" stroke="#fb7185" strokeWidth="1.5"/>
          <path d="M36 36 L56 32" stroke="rgba(251,113,133,0.3)" strokeWidth="1" strokeDasharray="3 2"/>
          <path d="M36 42 L56 38" stroke="rgba(251,113,133,0.3)" strokeWidth="1" strokeDasharray="3 2"/>
        </svg>
      ),
    },
    'health': {
      gradient: 'from-teal-400 via-green-500 to-emerald-600',
      glow: 'rgba(16,185,129,0.4)',
      bg: 'rgba(16,185,129,0.08)',
      svg: (
        <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
          <path d="M40 64 C40 64 14 50 14 30 C14 22 20 16 28 16 C33 16 37 19 40 23 C43 19 47 16 52 16 C60 16 66 22 66 30 C66 50 40 64 40 64Z" fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth="1.5"/>
          <path d="M32 38 L37 43 L48 32" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    'language': {
      gradient: 'from-blue-400 via-sky-500 to-cyan-500',
      glow: 'rgba(14,165,233,0.4)',
      bg: 'rgba(14,165,233,0.08)',
      svg: (
        <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
          <circle cx="40" cy="40" r="28" fill="rgba(14,165,233,0.1)" stroke="rgba(14,165,233,0.3)" strokeWidth="1.5"/>
          <ellipse cx="40" cy="40" rx="12" ry="28" fill="none" stroke="rgba(14,165,233,0.25)" strokeWidth="1.5"/>
          <path d="M12 40 L68 40" stroke="rgba(14,165,233,0.25)" strokeWidth="1.5"/>
          <path d="M16 28 Q40 22 64 28" stroke="rgba(14,165,233,0.35)" strokeWidth="1" fill="none"/>
          <path d="M16 52 Q40 58 64 52" stroke="rgba(14,165,233,0.35)" strokeWidth="1" fill="none"/>
          <circle cx="40" cy="40" r="4" fill="rgba(14,165,233,0.3)" stroke="#0ea5e9" strokeWidth="1.5"/>
        </svg>
      ),
    },
    'default': {
      gradient: 'from-violet-400 via-purple-500 to-indigo-600',
      glow: 'rgba(139,92,246,0.4)',
      bg: 'rgba(139,92,246,0.08)',
      svg: (
        <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
          <rect x="14" y="20" width="24" height="32" rx="4" fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5"/>
          <rect x="18" y="28" width="16" height="2" rx="1" fill="rgba(139,92,246,0.5)"/>
          <rect x="18" y="33" width="12" height="2" rx="1" fill="rgba(139,92,246,0.4)"/>
          <rect x="18" y="38" width="14" height="2" rx="1" fill="rgba(139,92,246,0.3)"/>
          <rect x="42" y="14" width="24" height="32" rx="4" fill="rgba(139,92,246,0.2)" stroke="#a78bfa" strokeWidth="1.5"/>
          <rect x="46" y="22" width="16" height="2" rx="1" fill="rgba(167,139,250,0.6)"/>
          <rect x="46" y="27" width="12" height="2" rx="1" fill="rgba(167,139,250,0.5)"/>
          <rect x="46" y="32" width="14" height="2" rx="1" fill="rgba(167,139,250,0.4)"/>
          <rect x="28" y="48" width="24" height="16" rx="4" fill="rgba(139,92,246,0.1)" stroke="rgba(139,92,246,0.3)" strokeWidth="1"/>
        </svg>
      ),
    },
  };

  const getConfig = (slug: string) =>
    categoryConfig[slug] || categoryConfig.default;

  return (
    <section className="relative py-24 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0a14 0%, #0f0a1e 50%, #0a0a14 100%)' }}>

      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)' }}
        />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border mb-6"
            style={{ background: 'rgba(139,92,246,0.08)', borderColor: 'rgba(139,92,246,0.25)' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
            </span>
            <span className="text-xs font-bold tracking-[3px] uppercase text-violet-400">
              Explore Categories
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Find Your{' '}
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #a78bfa, #818cf8, #38bdf8)' }}>
              Perfect Path
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Explore our curated learning categories and start building skills that matter
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map((category, index) => {
            const config = getConfig(category.slug);
            const isActive = activeCategory === category.id;

            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
                className="group relative"
              >
                {/* Animated gradient border */}
                <div
                  className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${config.gradient.includes('cyan') ? '#22d3ee' : config.gradient.includes('violet') ? '#8b5cf6' : config.gradient.includes('pink') ? '#ec4899' : config.gradient.includes('emerald') ? '#10b981' : config.gradient.includes('amber') ? '#f59e0b' : config.gradient.includes('rose') ? '#f43f5e' : '#818cf8'}, transparent)`,
                    padding: '1px',
                  }}
                />

                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="relative rounded-2xl p-5 h-full flex flex-col items-center text-center gap-3 cursor-pointer overflow-hidden"
                  style={{
                    background: isActive
                      ? config.bg
                      : 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {/* Glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{
                      background: `radial-gradient(ellipse at 50% 0%, ${config.glow.replace('0.4', '0.12')} 0%, transparent 70%)`,
                    }}
                  />

                  {/* Top shimmer on hover */}
                  <div
                    className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${config.glow.replace('0.4', '0.8')}, transparent)`,
                    }}
                  />

                  {/* SVG illustration */}
                  <div
                    className="relative w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110"
                    style={{
                      background: config.bg,
                      border: `1px solid ${config.glow.replace('0.4', '0.2')}`,
                    }}
                  >
                    {config.svg}
                  </div>

                  {/* Category name */}
                  <div className="relative z-10">
                    <h3 className="font-bold text-sm text-white/80 group-hover:text-white transition-colors duration-300 leading-tight">
                      {category.name}
                    </h3>
                    <p className="text-xs mt-1 font-medium transition-colors duration-300"
                      style={{ color: config.glow.replace('0.4', '0.9') }}>
                      {category.course_count || 0}+ courses
                    </p>
                  </div>

                  {/* Bottom arrow on hover */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
                    <ArrowRight size={12} className="text-white/40" />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Browse all button */}
        <div className="text-center mt-14">
          <Link href="/categories">
            <button
              className="group inline-flex items-center gap-3 font-bold px-8 py-4 rounded-full text-base transition-all duration-300 hover:scale-105 cursor-pointer text-white"
              style={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.15))',
                border: '1px solid rgba(139,92,246,0.3)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 0 32px rgba(139,92,246,0.1)',
              }}
            >
              <Target size={18} className="text-violet-400" />
              Browse All Categories
              <ArrowRight
                size={18}
                className="text-violet-400 group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}



// ─────────────────────────────────────────
// Modern Stats Section (NEW)
// ─────────────────────────────────────────
function ModernStatsSection({ stats }: { stats: SiteStats | null }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const formatNumber = (n: number): string => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  const formatRating = (r: number): string => {
    if (!r || r <= 0) return '0.0';
    return r.toFixed(1);
  };

  const items = [
    {
      icon: Users,
      value: stats?.activeLearners || 0,
      label: 'Active Learners',
      suffix: '+',
      gradient: 'from-blue-600 to-cyan-400',
      bgGlow: 'bg-blue-500/20',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
      delay: 0,
      prefix: '',
    },
    {
      icon: GraduationCap,
      value: stats?.expertInstructors || 0,
      label: 'Expert Instructors',
      suffix: '+',
      gradient: 'from-purple-600 to-pink-400',
      bgGlow: 'bg-purple-500/20',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
      delay: 0.15,
      prefix: '',
    },
    {
      icon: BookOpen,
      value: stats?.coursesAvailable || 0,
      label: 'Courses Available',
      suffix: '+',
      gradient: 'from-emerald-600 to-teal-400',
      bgGlow: 'bg-emerald-500/20',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
      delay: 0.3,
      prefix: '',
    },
    {
      icon: Star,
      value: stats?.averageRating || 0,
      label: 'Average Rating',
      suffix: '',
      gradient: 'from-orange-600 to-red-400',
      bgGlow: 'bg-orange-500/20',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-400',
      delay: 0.45,
      prefix: '',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      
      className="relative py-8 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"

    >
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl"
        />
        
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header with animated reveal */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center mb-0"   
>
          
        </motion.div>

        {/* Stats grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8" 
        >
          {items.map((item, index) => {
            const Icon = item.icon;
            const displayValue = item.label === 'Average Rating' 
              ? formatRating(item.value)
              : formatNumber(item.value);

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                {/* Glow effect on hover */}
                <div 
                  className={`absolute -inset-0.5 bg-gradient-to-r ${item.gradient} rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500`}
                />
                
                {/* Card with glassmorphism */}
                {/* <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"> */}
                  <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300">

                  {/* Animated icon container */}
                  <div className="relative mb-6">
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: item.delay,
                      }}
                      className={`absolute inset-0 ${item.bgGlow} rounded-xl blur-md group-hover:blur-xl transition-all duration-500`}
                    />
                    <div className={`relative w-16 h-16 ${item.iconBg} rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-8 h-8 ${item.iconColor}`} />
                    </div>
                    
                    {/* Animated rings */}
                    {/* <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.1, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: item.delay,
                      }}
                      className={`absolute -inset-0 border border-${item.iconColor.split('-')[1]}-500/20 rounded-xl`}
                    /> */}


                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.1, 0.3],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: item.delay,
                          }}
                          className="absolute -inset-0 border border border-${item.iconColor.split('-')[1]}-500/20 rounded-xl"
                        />
                  </div>

                  {/* Value with count-up animation */}
                  <div className="mb-2">
                    <motion.div
                      key={displayValue}
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.2 + item.delay,
                      }}
                    >
                      <span className={`text-5xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                        {isInView ? (
                          <CountUp
                            end={item.value}
                            duration={2.5}
                            delay={0.5 + item.delay}
                            formattingFn={(value) => {
                              if (item.label === 'Average Rating') {
                                return value.toFixed(1);
                              }
                              return formatNumber(value);
                            }}
                          />
                        ) : displayValue}
                        {item.suffix}
                      </span>
                    </motion.div>
                  </div>

                  {/* Label */}
                  <p className="text-white/60 font-medium group-hover:text-white/80 transition-colors duration-300">
                    {item.label}
                  </p>

                  {/* Animated progress line */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "60px" } : { width: 0 }}
                    transition={{ duration: 1, delay: 0.6 + item.delay }}
                    className={`h-0.5 bg-gradient-to-r ${item.gradient} rounded-full mt-4`}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              suppressHydrationWarning={true}  // Add this line
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
              }}
              animate={{
                y: [null, -30, 30, -20, 0],
                x: [null, 20, -20, 10, 0],
              }}
              transition={{
                duration: 10 + Math.random() * 20,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
              className={`absolute w-1 h-1 rounded-full ${
                i % 4 === 0 ? 'bg-blue-400' :
                i % 4 === 1 ? 'bg-purple-400' :
                i % 4 === 2 ? 'bg-emerald-400' :
                'bg-orange-400'
              }`}
              style={{
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                opacity: 0.1 + Math.random() * 0.2,
              }}
            />
          ))}
        </div>

        {/* Bottom decorative gradient */}
        {/* <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" /> */}
      </div>
    </section>
  );
}

// ─── Certificate Verification Banner ──────────────────────────────────────
function CertificateVerifyBanner() {
  return (
    <section className="py-20 relative overflow-hidden" style={{ background: '#0d1b2e' }}>
      {/* Ambient gold glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,148,10,0.10) 0%, transparent 65%)'
        }} />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />

        {/* Gold border top & bottom */}
        {/* <div className="absolute top-0 left-0 right-0 h-px" style={{
          background: 'linear-gradient(90deg, transparent, rgba(201,148,10,0.4), rgba(240,192,64,0.6), rgba(201,148,10,0.4), transparent)'
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{
          background: 'linear-gradient(90deg, transparent, rgba(201,148,10,0.4), rgba(240,192,64,0.6), rgba(201,148,10,0.4), transparent)'
        }} /> */}

        {/* Floating shield large */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.04]">
          <ShieldCheck size={320} color="#f0c040" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

          {/* Left — text */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
                 style={{ background: 'rgba(240,192,64,0.08)', borderColor: 'rgba(240,192,64,0.25)', color: '#f0c040' }}>
              <ShieldCheck size={15} />
              <span className="text-xs font-bold tracking-[3px] uppercase">Official Verification Portal</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Is That Certificate{' '}
              <span style={{ color: '#f0c040' }}>Authentic?</span>
            </h2>

            <p className="text-white/50 text-lg leading-relaxed max-w-xl mb-8">
              Anyone — employers, universities, or hiring managers — can instantly verify the authenticity of an AxioQuan certificate in seconds. No account required.
            </p>

            {/* Trust points */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start mb-8">
              {[
                { icon: <Zap size={14} />, label: 'Instant Results' },
                { icon: <Shield size={14} />, label: 'Tamper-Proof' },
                { icon: <Globe size={14} />, label: 'Publicly Accessible' },
                { icon: <BadgeCheck size={14} />, label: 'Always Free' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  <span style={{ color: '#f0c040' }}>{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/verify">
                <button
                  className="inline-flex items-center gap-3 font-bold px-8 py-4 rounded-full text-base transition-all hover:scale-105 shadow-2xl cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #c9940a, #f0c040)',
                    color: '#0a0a0a',
                    boxShadow: '0 0 32px rgba(240,192,64,0.3)'
                  }}
                >
                  <ShieldCheck size={20} />
                  Verify a Certificate
                </button>
              </Link>
            </div>
          </div>

          {/* Right — decorative certificate mockup card */}
          <div className="flex-shrink-0 w-full max-w-sm lg:max-w-xs xl:max-w-sm">
            <div className="relative rounded-2xl overflow-hidden p-6"
                 style={{
                   background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
                   border: '1px solid rgba(201,148,10,0.25)',
                   boxShadow: '0 25px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
                 }}>
              {/* Mini cert header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center flex-shrink-0"
                     style={{ boxShadow: '0 0 0 1px rgba(201,148,10,0.3)' }}>
                  <span className="text-white font-black text-sm">A</span>
                </div>
                <div>
                  <div className="text-white font-bold text-sm tracking-[3px] uppercase">AxioQuan</div>
                  <div className="text-white/30 text-[10px] tracking-[2px] uppercase">Learning Excellence</div>
                </div>
                {/* Verified badge */}
                <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                     style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                  <span className="text-[#4ade80] text-[10px] font-bold">VERIFIED</span>
                </div>
              </div>

              {/* Gold rule */}
              <div className="h-px mb-5" style={{
                background: 'linear-gradient(90deg, transparent, rgba(201,148,10,0.5), rgba(240,192,64,0.7), rgba(201,148,10,0.5), transparent)'
              }} />

              {/* Cert label */}
              <div className="text-center mb-4">
                <div className="text-white/30 text-[9px] font-bold tracking-[4px] uppercase mb-2">Certificate of Completion</div>
                <div className="text-white/20 text-[9px] italic mb-3">This certifies that</div>
                <div className="font-bold text-white text-xl mb-1" style={{ fontFamily: 'Georgia, serif', color: '#f0c040' }}>
                  Jane Doe
                </div>
                <div className="text-white/30 text-[9px] uppercase tracking-[2px] mb-1">successfully completed</div>
                <div className="text-white font-bold text-sm tracking-wide">Advanced Web Development</div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[
                  { label: 'Score', value: '94%' },
                  { label: 'Grade', value: 'A+' },
                  { label: 'Status', value: 'PASS' },
                ].map((s, i) => (
                  <div key={i} className="text-center py-2 rounded-lg"
                       style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,148,10,0.15)' }}>
                    <div className="text-[9px] text-white/25 uppercase tracking-[1.5px] mb-1">{s.label}</div>
                    <div className="text-white font-bold text-xs" style={{ color: i === 2 ? '#4ade80' : 'rgba(255,255,255,0.85)' }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-4 text-center text-[9px] tracking-[2px] uppercase"
                   style={{ color: 'rgba(201,148,10,0.5)' }}>
                Certificate ID: AXQ-K3M7X2 · AxioQuan
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// Main HomePage
// ─────────────────────────────────────────
export default function HomePage() {
  const [courses, setCourses] = useState<CourseAny[]>([]);
  const [categories, setCategories] = useState<CategoryAny[]>([]);
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [coursesResult, categoriesRes, statsRes] = await Promise.all([
          getCoursesAction({ is_published: true, limit: 100, include_reviews: true }),
          fetch('/api/categories'),
          fetch('/api/stats'),
        ]);

        if (!categoriesRes.ok) throw new Error('Failed to load categories');

        const categoriesData = await categoriesRes.json();

        if (isMounted) {
          const coursesArray = (coursesResult.courses ?? []).map((course: any) => ({
            ...course,
            enrolled_students_count: parseInt(course.enrolled_students_count ?? '0', 10),
            average_rating: parseFloat(course.average_rating ?? '0'),
            review_count: parseInt(course.review_count ?? '0', 10),
            like_count: parseInt(course.like_count ?? '0', 10),
            price_cents: parseInt(course.price_cents ?? '0', 10),
          }));
          setCourses(coursesArray);
          setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.categories || []);

          // Stats are non-critical — don't throw if they fail
          if (statsRes.ok) {
            const statsData: SiteStats = await statsRes.json();
            setStats(statsData);
          }
        }
      } catch (err: any) {
        console.error('Homepage fetch error', err);
        if (isMounted) setError(err.message || 'Failed to load data');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, []);






function BecomeInstructorTeaser() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">

      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/3 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px]" />
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), rgba(99,102,241,0.8), rgba(139,92,246,0.5), transparent)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), rgba(99,102,241,0.5), rgba(139,92,246,0.3), transparent)' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT: Minimal text ── */}
          <div className="flex flex-col gap-8">

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 w-fit px-4 py-2 rounded-full border"
              style={{ background: 'rgba(139,92,246,0.08)', borderColor: 'rgba(139,92,246,0.25)' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
              </span>
              <span className="text-xs font-bold tracking-[3px] uppercase text-violet-400">
                Become an Instructor
              </span>
            </div>

            {/* Heading */}
            <div>
              <h2 className="text-4xl md:text-5xl font-black leading-[1.1] text-white mb-4">
                Transform Your{' '}
                <span className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(135deg, #a78bfa, #818cf8, #38bdf8)' }}>
                  Expertise
                </span>
              </h2>
              <p className="text-white/45 text-lg leading-relaxed">
                Share your knowledge and inspire learners worldwide.
              </p>
            </div>

            {/* CTA */}
            <Link href="/become-instructor">
              <button
                className="group inline-flex items-center gap-3 font-bold px-8 py-4 rounded-full text-base transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  color: '#ffffff',
                  boxShadow: '0 0 32px rgba(124,58,237,0.35)',
                }}
              >
                <GraduationCap size={20} />
                Start Your Application
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </Link>

          </div>


          {/* ── RIGHT: Floating card ── */}


{/* ── RIGHT: Floating image ── */}
<div className="relative flex items-center justify-center min-h-[500px]">

  {/* Layered glow orbs behind image */}
  <div
    className="absolute w-[480px] h-[480px] rounded-full"
    style={{
      background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(99,102,241,0.15) 40%, transparent 70%)',
      filter: 'blur(50px)',
    }}
  />
  <div
    className="absolute w-[320px] h-[320px] rounded-full top-10 right-10"
    style={{
      background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)',
      filter: 'blur(40px)',
    }}
  />
  <div
    className="absolute w-[280px] h-[280px] rounded-full bottom-10 left-10"
    style={{
      background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)',
      filter: 'blur(40px)',
    }}
  />

  {/* Decorative ring 1 */}
  <div
    className="absolute w-[440px] h-[440px] rounded-full"
    style={{
      border: '1px solid rgba(139,92,246,0.15)',
    }}
  />
  {/* Decorative ring 2 */}
  <div
    className="absolute w-[500px] h-[500px] rounded-full"
    style={{
      border: '1px dashed rgba(139,92,246,0.08)',
    }}
  />

  {/* Floating decorative bubbles */}
  <motion.div
    animate={{ y: [0, -14, 0], x: [0, 6, 0] }}
    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    className="absolute top-6 left-12 w-5 h-5 rounded-full"
    style={{ background: 'linear-gradient(135deg, #a78bfa, #818cf8)', opacity: 0.6 }}
  />
  <motion.div
    animate={{ y: [0, 12, 0], x: [0, -8, 0] }}
    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
    className="absolute top-20 right-8 w-3 h-3 rounded-full"
    style={{ background: 'linear-gradient(135deg, #38bdf8, #6366f1)', opacity: 0.5 }}
  />
  <motion.div
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
    className="absolute bottom-16 right-16 w-4 h-4 rounded-full"
    style={{ background: 'linear-gradient(135deg, #f472b6, #a78bfa)', opacity: 0.55 }}
  />
  <motion.div
    animate={{ y: [0, 16, 0], x: [0, 5, 0] }}
    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
    className="absolute bottom-8 left-20 w-6 h-6 rounded-full"
    style={{ background: 'linear-gradient(135deg, #818cf8, #38bdf8)', opacity: 0.4 }}
  />
  <motion.div
    animate={{ y: [0, -8, 0], x: [0, -5, 0] }}
    transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
    className="absolute top-1/2 right-4 w-2.5 h-2.5 rounded-full"
    style={{ background: '#a78bfa', opacity: 0.45 }}
  />
  <motion.div
    animate={{ y: [0, 10, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
    className="absolute top-1/3 left-4 w-2 h-2 rounded-full"
    style={{ background: '#38bdf8', opacity: 0.4 }}
  />

  {/* Main floating image */}
  <motion.div
    animate={{ y: [0, -18, 0] }}
    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    className="relative z-10 w-full max-w-lg"
  >
    {/* Image container with rounded edges + border glow */}
    <div
      className="relative rounded-3xl overflow-hidden"
      style={{
        border: '1.5px solid rgba(139,92,246,0.3)',
        boxShadow: `
          0 0 0 1px rgba(139,92,246,0.1),
          0 30px 80px rgba(0,0,0,0.45),
          0 0 60px rgba(139,92,246,0.2),
          inset 0 1px 0 rgba(255,255,255,0.08)
        `,
      }}
    >
      {/* Top shimmer line */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-10"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(139,92,246,0.7), rgba(99,102,241,0.9), transparent)',
        }}
      />
      <img
        src="images/Axio-Study.png"
        alt="Become an Instructor"
        className="w-full h-auto block"
        style={{
          filter: 'drop-shadow(0 10px 40px rgba(139,92,246,0.3))',
        }}
      />
      {/* Bottom fade overlay to blend into background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16"
        style={{
          background:
            'linear-gradient(to top, rgba(15,10,40,0.6), transparent)',
        }}
      />
    </div>
  </motion.div>

  {/* Floating badge — approved */}
  <motion.div
    animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
    className="absolute top-8 right-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white z-20"
    style={{
      background: 'rgba(16,185,129,0.15)',
      border: '1px solid rgba(16,185,129,0.3)',
      backdropFilter: 'blur(10px)',
    }}
  >
    <span className="text-emerald-400">✓</span> Application Approved!
  </motion.div>

  {/* Floating badge — course published */}
  <motion.div
    animate={{ y: [0, 10, 0], x: [0, -4, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
    className="absolute bottom-8 left-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white z-20"
    style={{
      background: 'rgba(139,92,246,0.15)',
      border: '1px solid rgba(139,92,246,0.3)',
      backdropFilter: 'blur(10px)',
    }}
  >
    🎓 &nbsp;New course published!
  </motion.div>

</div>

        </div>
      </div>
    </section>
  );
}




  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── Hero Slider ── */}
      <AutoSlider stats={stats}/>

      {/* ── Stats ── */}
      <ModernStatsSection stats={stats} />

      {/* ── Become Instructor Steps ── */}
      <BecomeInstructorTeaser  />

      {/* ── Certificate Verification Banner — placed after steps, before categories ── */}
      <CertificateVerifyBanner />

      {/* ── Categories ── */}
      {!loading && categories.length > 0 && (
        <CategoriesSection categories={categories} />
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="py-32 flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-primary/10 rounded-full animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-gray-600 text-lg">Loading amazing courses...</p>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="py-32 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <span className="text-4xl">😕</span>
          </div>
          <div className="text-red-600 text-xl mb-4">Error loading data: {error}</div>
          <Button onClick={() => window.location.reload()} className="rounded-full bg-primary hover:bg-primary/90 text-white px-8 py-6">
            Try Again
          </Button>
        </div>
      )}

      {/* ── Courses Grid ── */}
      {!loading && !error && courses.length > 0 && (
        <PremiumCourseGrid
          courses={courses}
          title="Popular Courses"
          description="Hand-picked courses loved by our students"
          viewAllLink="/courses"
        />
      )}

      <Footer />
    </div>
  );
}
















































