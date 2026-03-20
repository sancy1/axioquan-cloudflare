
// // src/app/instructors/instructors-client.tsx

// 'use client';

// import { useState, useTransition, useCallback } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import {
//   Search, BookOpen, Users, Star, MapPin, Building2,
//   Globe, Twitter, Github, Linkedin, Youtube, ChevronDown,
//   ChevronUp, X, SortAsc, Loader2, ExternalLink, Award
// } from 'lucide-react';
// import { getInstructorsAction, getInstructorCoursesAction } from './instructors-actions';
// import type { Instructor } from '@/lib/db/queries/instructors';

// /* ─────────────────────────────────────────
//    Types
// ───────────────────────────────────────── */
// interface Course {
//   id: string;
//   title: string;
//   slug: string;
//   thumbnail_url?: string;
//   price_cents: number;
//   level?: string;
//   category_name?: string;
//   enrolled_count: number;
//   avg_rating: number;
//   review_count: number;
// }

// interface Props {
//   initialInstructors: Instructor[];
//   initialTotal: number;
//   initialSearch: string;
//   initialSort: string;
// }

// const SORT_OPTIONS = [
//   { value: 'popular', label: 'Most Popular' },
//   { value: 'rating',  label: 'Top Rated' },
//   { value: 'courses', label: 'Most Courses' },
//   { value: 'name',    label: 'A–Z' },
// ];

// /* ─────────────────────────────────────────
//    Avatar helper
// ───────────────────────────────────────── */
// function InstructorAvatar({ instructor, size = 'md' }: { instructor: Instructor; size?: 'sm' | 'md' | 'lg' }) {
//   const src = instructor.profile_image || instructor.image;
//   const initials = (instructor.display_name || instructor.name || instructor.username || '?')
//     .split(' ')
//     .map((w) => w[0])
//     .join('')
//     .toUpperCase()
//     .slice(0, 2);

//   const sizeClass = {
//     sm: 'w-12 h-12 text-sm',
//     md: 'w-20 h-20 text-lg',
//     lg: 'w-28 h-28 text-2xl',
//   }[size];

//   if (src) {
//     return (
//       <div className={`${sizeClass} relative rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-blue-100`}>
//         <Image src={src} alt={instructor.name} fill className="object-cover" unoptimized />
//       </div>
//     );
//   }

//   const colors = ['from-blue-500 to-indigo-600', 'from-violet-500 to-purple-600',
//     'from-emerald-500 to-teal-600', 'from-rose-500 to-pink-600', 'from-amber-500 to-orange-600'];
//   const color = colors[instructor.username.charCodeAt(0) % colors.length];

//   return (
//     <div className={`${sizeClass} rounded-xl flex-shrink-0 bg-gradient-to-br ${color} flex items-center justify-center ring-2 ring-blue-100`}>
//       <span className="font-bold text-white">{initials}</span>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Star rating display
// ───────────────────────────────────────── */
// function StarRating({ rating }: { rating: number }) {
//   return (
//     <div className="flex items-center gap-1">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <Star
//           key={star}
//           className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
//         />
//       ))}
//       <span className="text-xs text-gray-500 ml-1">{rating > 0 ? rating.toFixed(1) : 'New'}</span>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Course mini-card
// ───────────────────────────────────────── */
// function CourseMiniCard({ course }: { course: Course }) {
//   return (
//     <Link
//       href={`/courses/${course.slug}`}
//       className="group flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all duration-200"
//     >
//       <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex-shrink-0 overflow-hidden relative">
//         {course.thumbnail_url ? (
//           <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover" unoptimized />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center">
//             <BookOpen className="w-5 h-5 text-blue-400" />
//           </div>
//         )}
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-medium text-gray-800 line-clamp-1 group-hover:text-blue-700 transition-colors">
//           {course.title}
//         </p>
//         <div className="flex items-center gap-2 mt-1">
//           <StarRating rating={course.avg_rating} />
//           <span className="text-xs text-gray-400">·</span>
//           <span className="text-xs text-gray-500">{course.enrolled_count.toLocaleString()} students</span>
//         </div>
//         {course.level && (
//           <span className="inline-block mt-1 text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
//             {course.level}
//           </span>
//         )}
//       </div>
//       <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400 mt-0.5 flex-shrink-0 transition-colors" />
//     </Link>
//   );
// }

// /* ─────────────────────────────────────────
//    Expanded profile panel
// ───────────────────────────────────────── */
// function ExpandedProfile({
//   instructor,
//   courses,
//   loadingCourses,
// }: {
//   instructor: Instructor;
//   courses: Course[];
//   loadingCourses: boolean;
// }) {
//   const socials = [
//     { icon: Twitter,  href: instructor.twitter_username ? `https://twitter.com/${instructor.twitter_username}` : null, label: 'Twitter' },
//     { icon: Github,   href: instructor.github_username  ? `https://github.com/${instructor.github_username}`  : null, label: 'GitHub' },
//     { icon: Linkedin, href: instructor.linkedin_url,       label: 'LinkedIn' },
//     { icon: Youtube,  href: instructor.youtube_channel,    label: 'YouTube' },
//     { icon: Globe,    href: instructor.website,            label: 'Website' },
//   ].filter((s) => s.href);

//   return (
//     <div className="border-t border-blue-50 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-b-2xl overflow-hidden">
//       <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Left: bio + meta */}
//         <div className="space-y-4">
//           {instructor.bio && (
//             <div>
//               <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">About</h4>
//               <p className="text-sm text-gray-600 leading-relaxed">{instructor.bio}</p>
//             </div>
//           )}

//           <div className="flex flex-wrap gap-3">
//             {instructor.location && (
//               <span className="flex items-center gap-1.5 text-xs text-gray-500">
//                 <MapPin className="w-3.5 h-3.5 text-blue-400" />
//                 {instructor.location}
//               </span>
//             )}
//             {instructor.company && (
//               <span className="flex items-center gap-1.5 text-xs text-gray-500">
//                 <Building2 className="w-3.5 h-3.5 text-blue-400" />
//                 {instructor.company}
//               </span>
//             )}
//           </div>

//           {/* Skills */}
//           {instructor.skills && instructor.skills.length > 0 && (
//             <div>
//               <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Skills</h4>
//               <div className="flex flex-wrap gap-1.5">
//                 {instructor.skills.slice(0, 8).map((skill) => (
//                   <span
//                     key={skill}
//                     className="px-2.5 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium"
//                   >
//                     {skill}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Social links */}
//           {socials.length > 0 && (
//             <div>
//               <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Links</h4>
//               <div className="flex gap-2">
//                 {socials.map(({ icon: Icon, href, label }) => (
//                   <a
//                     key={label}
//                     href={href!}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     title={label}
//                     className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
//                   >
//                     <Icon className="w-4 h-4" />
//                   </a>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Right: courses */}
//         <div>
//           <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
//             Published Courses
//           </h4>
//           {loadingCourses ? (
//             <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
//               <Loader2 className="w-4 h-4 animate-spin" />
//               Loading courses…
//             </div>
//           ) : courses.length === 0 ? (
//             <p className="text-sm text-gray-400 py-4">No published courses yet.</p>
//           ) : (
//             <div className="space-y-2">
//               {courses.map((course) => (
//                 <CourseMiniCard key={course.id} course={course} />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Instructor card (horizontal, Image 1 style)
// ───────────────────────────────────────── */
// function InstructorCard({ instructor }: { instructor: Instructor }) {
//   const [expanded, setExpanded] = useState(false);
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loadingCourses, setLoadingCourses] = useState(false);
//   const [coursesLoaded, setCoursesLoaded] = useState(false);

//   const displayName = instructor.display_name || instructor.name || instructor.username;

//   const toggleExpand = async () => {
//     if (!expanded && !coursesLoaded) {
//       setLoadingCourses(true);
//       const result = await getInstructorCoursesAction(instructor.id);
//       setCourses((result.courses as Course[]) || []);
//       setCoursesLoaded(true);
//       setLoadingCourses(false);
//     }
//     setExpanded((prev) => !prev);
//   };

//   return (
//     <div
//       className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden
//         ${expanded ? 'border-blue-200 shadow-lg shadow-blue-50' : 'border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100'}`}
//     >
//       {/* Main card row */}
//       <div className="p-5 flex items-start gap-5">
//         {/* Avatar */}
//         <InstructorAvatar instructor={instructor} size="lg" />

//         {/* Info */}
//         <div className="flex-1 min-w-0">
//           <div className="flex items-start justify-between gap-2">
//             <div>
//               <h3 className="font-semibold text-gray-900 text-base leading-tight">{displayName}</h3>
//               {instructor.headline && (
//                 <p className="text-sm text-blue-600 font-medium mt-0.5">{instructor.headline}</p>
//               )}
//             </div>
//             {instructor.availability_status === 'available' && (
//               <span className="flex-shrink-0 flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
//                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
//                 Available
//               </span>
//             )}
//           </div>

//           {/* Stats row */}
//           <div className="mt-3 flex flex-wrap items-center gap-4">
//             <span className="flex items-center gap-1.5 text-sm text-gray-600">
//               <BookOpen className="w-4 h-4 text-blue-400" />
//               <span className="font-semibold text-gray-800">{instructor.course_count}</span>
//               <span className="text-gray-400">{instructor.course_count === 1 ? 'Course' : 'Courses'}</span>
//             </span>
//             <span className="flex items-center gap-1.5 text-sm text-gray-600">
//               <Users className="w-4 h-4 text-blue-400" />
//               <span className="font-semibold text-gray-800">{instructor.total_students.toLocaleString()}</span>
//               <span className="text-gray-400">Students</span>
//             </span>
//             {instructor.average_rating > 0 && (
//               <span className="flex items-center gap-1.5 text-sm text-gray-600">
//                 <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
//                 <span className="font-semibold text-gray-800">{instructor.average_rating.toFixed(1)}</span>
//                 <span className="text-gray-400">Rating</span>
//               </span>
//             )}
//           </div>

//           {/* Location / company quick info */}
//           {(instructor.location || instructor.company) && (
//             <div className="mt-2 flex items-center gap-3">
//               {instructor.location && (
//                 <span className="flex items-center gap-1 text-xs text-gray-400">
//                   <MapPin className="w-3 h-3" /> {instructor.location}
//                 </span>
//               )}
//               {instructor.company && (
//                 <span className="flex items-center gap-1 text-xs text-gray-400">
//                   <Building2 className="w-3 h-3" /> {instructor.company}
//                 </span>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Actions */}
//         <div className="flex flex-col items-end gap-2 flex-shrink-0">
//           <button
//             onClick={toggleExpand}
//             className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200
//               ${expanded
//                 ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
//                 : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
//           >
//             {expanded ? (
//               <><ChevronUp className="w-4 h-4" /> Less</>
//             ) : (
//               <><ChevronDown className="w-4 h-4" /> View Profile</>
//             )}
//           </button>
//           <Link
//             href={`/courses?instructor=${instructor.username}`}
//             className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all duration-200"
//           >
//             <BookOpen className="w-4 h-4" /> Courses
//           </Link>
//         </div>
//       </div>

//       {/* Expandable section */}
//       {expanded && (
//         <ExpandedProfile
//           instructor={instructor}
//           courses={courses}
//           loadingCourses={loadingCourses}
//         />
//       )}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Empty state
// ───────────────────────────────────────── */
// function EmptyState({ search }: { search: string }) {
//   return (
//     <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
//       <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
//         <Award className="w-8 h-8 text-blue-300" />
//       </div>
//       <h3 className="text-lg font-semibold text-gray-700 mb-1">No instructors found</h3>
//       <p className="text-sm text-gray-400 max-w-xs">
//         {search ? `No instructors match "${search}". Try a different search term.` : 'No instructors are available yet.'}
//       </p>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Main client component
// ───────────────────────────────────────── */
// export default function InstructorsClient({
//   initialInstructors,
//   initialTotal,
//   initialSearch,
//   initialSort,
// }: Props) {
//   const [instructors, setInstructors] = useState<Instructor[]>(initialInstructors);
//   const [total, setTotal] = useState(initialTotal);
//   const [search, setSearch] = useState(initialSearch);
//   const [sort, setSort] = useState(initialSort);
//   const [page, setPage] = useState(1);
//   const [isPending, startTransition] = useTransition();

//   const LIMIT = 12;

//   const fetchInstructors = useCallback(
//     (newSearch: string, newSort: string, newPage: number) => {
//       startTransition(async () => {
//         const result = await getInstructorsAction({
//           search: newSearch || undefined,
//           sortBy: newSort as any,
//           limit: LIMIT,
//           offset: (newPage - 1) * LIMIT,
//         });
//         setInstructors(result.instructors || []);
//         setTotal(result.total || 0);
//       });
//     },
//     []
//   );

//   const handleSearch = (value: string) => {
//     setSearch(value);
//     setPage(1);
//     fetchInstructors(value, sort, 1);
//   };

//   const handleSort = (value: string) => {
//     setSort(value);
//     setPage(1);
//     fetchInstructors(search, value, 1);
//   };

//   const handlePage = (newPage: number) => {
//     setPage(newPage);
//     fetchInstructors(search, sort, newPage);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const totalPages = Math.ceil(total / LIMIT);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-white">
//       {/* ── Hero header ── */}
//       <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 py-16 px-4">
//         {/* Decorative circles */}
//         <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
//         <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-indigo-400/10 blur-xl" />

//         <div className="max-w-5xl mx-auto relative z-10 text-center">
//           <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-medium px-3 py-1.5 rounded-full mb-4 border border-white/20">
//             <Award className="w-3.5 h-3.5" />
//             Expert Instructors
//           </div>
//           <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
//             Learn from the Best
//           </h1>
//           <p className="text-blue-100 text-lg max-w-xl mx-auto">
//             Industry leaders and skilled professionals guiding your learning journey.
//           </p>
//           <p className="mt-3 text-blue-200 text-sm font-medium">
//             {total.toLocaleString()} expert{total !== 1 ? 's' : ''} ready to teach
//           </p>
//         </div>
//       </div>

//       {/* ── Filters bar ── */}
//       <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
//         <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3">
//           {/* Search */}
//           <div className="relative flex-1">
//             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search instructors by name or specialty…"
//               value={search}
//               onChange={(e) => handleSearch(e.target.value)}
//               className="w-full pl-10 pr-9 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
//             />
//             {search && (
//               <button
//                 onClick={() => handleSearch('')}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             )}
//           </div>

//           {/* Sort */}
//           <div className="relative">
//             <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//             <select
//               value={sort}
//               onChange={(e) => handleSort(e.target.value)}
//               className="pl-9 pr-8 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none cursor-pointer min-w-[160px]"
//             >
//               {SORT_OPTIONS.map((opt) => (
//                 <option key={opt.value} value={opt.value}>{opt.label}</option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* ── Content ── */}
//       <div className="max-w-5xl mx-auto px-4 py-8">
//         {isPending ? (
//           <div className="flex items-center justify-center py-24">
//             <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
//           </div>
//         ) : instructors.length === 0 ? (
//           <EmptyState search={search} />
//         ) : (
//           <>
//             <div className="mb-5 flex items-center justify-between">
//               <p className="text-sm text-gray-500">
//                 Showing <span className="font-medium text-gray-700">{instructors.length}</span> of{' '}
//                 <span className="font-medium text-gray-700">{total.toLocaleString()}</span> instructors
//               </p>
//             </div>

//             <div className="space-y-4">
//               {instructors.map((instructor) => (
//                 <InstructorCard key={instructor.id} instructor={instructor} />
//               ))}
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="mt-10 flex items-center justify-center gap-2">
//                 <button
//                   onClick={() => handlePage(page - 1)}
//                   disabled={page === 1}
//                   className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
//                 >
//                   ← Previous
//                 </button>

//                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                   let pageNum: number;
//                   if (totalPages <= 5) pageNum = i + 1;
//                   else if (page <= 3) pageNum = i + 1;
//                   else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
//                   else pageNum = page - 2 + i;

//                   return (
//                     <button
//                       key={pageNum}
//                       onClick={() => handlePage(pageNum)}
//                       className={`w-9 h-9 text-sm rounded-xl border transition-all font-medium
//                         ${pageNum === page
//                           ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
//                           : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
//                     >
//                       {pageNum}
//                     </button>
//                   );
//                 })}

//                 <button
//                   onClick={() => handlePage(page + 1)}
//                   disabled={page === totalPages}
//                   className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
//                 >
//                   Next →
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* ── Become an instructor CTA ── */}
//       <div className="max-w-5xl mx-auto px-4 pb-16">
//         <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
//           <div>
//             <h3 className="text-xl font-bold mb-1">Become an Instructor Today</h3>
//             <p className="text-blue-100 text-sm">Share your knowledge and earn by teaching online.</p>
//           </div>
//           <Link
//             href="/dashboard/request-upgrade"
//             className="flex-shrink-0 bg-white text-blue-700 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
//           >
//             Get Started →
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }






































// // src/app/instructors/instructors-client.tsx

// 'use client';

// import { useState, useTransition, useCallback } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import {
//   Search, BookOpen, Users, Star, MapPin, Building2,
//   Globe, Twitter, Github, Linkedin, Youtube, ChevronDown,
//   ChevronUp, X, SortAsc, Loader2, ExternalLink, Award,
//   Target, Lightbulb, Tag, Mail, Calendar, TrendingUp,
//   GraduationCap, Briefcase, Heart, Zap, CheckCircle2,
// } from 'lucide-react';
// import { getInstructorsAction, getInstructorCoursesAction } from './instructors-actions';
// import type { Instructor } from '@/lib/db/queries/instructors';

// /* ─────────────────────────────────────────
//    Types
// ───────────────────────────────────────── */
// interface Course {
//   id: string;
//   title: string;
//   slug: string;
//   thumbnail_url?: string;
//   price_cents: number;
//   level?: string;
//   category_name?: string;
//   enrolled_count: number;
//   avg_rating: number;
//   review_count: number;
// }

// interface Props {
//   initialInstructors: Instructor[];
//   initialTotal: number;
//   initialSearch: string;
//   initialSort: string;
// }

// const SORT_OPTIONS = [
//   { value: 'popular', label: 'Most Popular' },
//   { value: 'rating',  label: 'Top Rated' },
//   { value: 'courses', label: 'Most Courses' },
//   { value: 'name',    label: 'A–Z' },
// ];

// /* ─────────────────────────────────────────
//    Avatar helper
// ───────────────────────────────────────── */
// function InstructorAvatar({ instructor, size = 'md' }: { instructor: Instructor; size?: 'sm' | 'md' | 'lg' }) {
//   const src = instructor.profile_image || instructor.image;
//   const initials = (instructor.display_name || instructor.name || instructor.username || '?')
//     .split(' ')
//     .map((w) => w[0])
//     .join('')
//     .toUpperCase()
//     .slice(0, 2);

//   const sizeClass = {
//     sm: 'w-12 h-12 text-sm',
//     md: 'w-20 h-20 text-lg',
//     lg: 'w-28 h-28 text-2xl',
//   }[size];

//   if (src) {
//     return (
//       <div className={`${sizeClass} relative rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-blue-100`}>
//         <Image src={src} alt={instructor.name} fill className="object-cover" unoptimized />
//       </div>
//     );
//   }

//   const colors = ['from-blue-500 to-indigo-600', 'from-violet-500 to-purple-600',
//     'from-emerald-500 to-teal-600', 'from-rose-500 to-pink-600', 'from-amber-500 to-orange-600'];
//   const color = colors[instructor.username.charCodeAt(0) % colors.length];

//   return (
//     <div className={`${sizeClass} rounded-xl flex-shrink-0 bg-gradient-to-br ${color} flex items-center justify-center ring-2 ring-blue-100`}>
//       <span className="font-bold text-white">{initials}</span>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Star rating display
// ───────────────────────────────────────── */
// function StarRating({ rating }: { rating: number }) {
//   return (
//     <div className="flex items-center gap-1">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <Star
//           key={star}
//           className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
//         />
//       ))}
//       <span className="text-xs text-gray-500 ml-1">{rating > 0 ? rating.toFixed(1) : 'New'}</span>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Course mini-card
// ───────────────────────────────────────── */
// function CourseMiniCard({ course }: { course: Course }) {
//   return (
//     <Link
//       href={`/courses/${course.slug}`}
//       className="group flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all duration-200"
//     >
//       <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex-shrink-0 overflow-hidden relative">
//         {course.thumbnail_url ? (
//           <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover" unoptimized />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center">
//             <BookOpen className="w-5 h-5 text-blue-400" />
//           </div>
//         )}
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-medium text-gray-800 line-clamp-1 group-hover:text-blue-700 transition-colors">
//           {course.title}
//         </p>
//         <div className="flex items-center gap-2 mt-1">
//           <StarRating rating={course.avg_rating} />
//           <span className="text-xs text-gray-400">·</span>
//           <span className="text-xs text-gray-500">{course.enrolled_count.toLocaleString()} students</span>
//         </div>
//         {course.level && (
//           <span className="inline-block mt-1 text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
//             {course.level}
//           </span>
//         )}
//       </div>
//       <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400 mt-0.5 flex-shrink-0 transition-colors" />
//     </Link>
//   );
// }

// /* ─────────────────────────────────────────
//    Tag pill helper
// ───────────────────────────────────────── */
// function TagPill({
//   label,
//   color = 'blue',
// }: {
//   label: string;
//   color?: 'blue' | 'emerald' | 'violet' | 'amber' | 'rose';
// }) {
//   const colorMap = {
//     blue:    'bg-blue-50 text-blue-700 border-blue-100',
//     emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
//     violet:  'bg-violet-50 text-violet-700 border-violet-100',
//     amber:   'bg-amber-50 text-amber-700 border-amber-100',
//     rose:    'bg-rose-50 text-rose-700 border-rose-100',
//   };
//   return (
//     <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colorMap[color]}`}>
//       {label}
//     </span>
//   );
// }

// /* ─────────────────────────────────────────
//    Section header helper
// ───────────────────────────────────────── */
// function SectionHeader({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
//   return (
//     <div className="flex items-center gap-2 mb-3">
//       <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
//         <Icon className="w-3.5 h-3.5 text-blue-600" />
//       </div>
//       <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</h4>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Social link button
// ───────────────────────────────────────── */
// function SocialButton({
//   icon: Icon,
//   href,
//   label,
//   color,
// }: {
//   icon: React.ElementType;
//   href: string;
//   label: string;
//   color: string;
// }) {
//   return (
//     <a
//       href={href}
//       target="_blank"
//       rel="noopener noreferrer"
//       className={`group flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${color}`}
//     >
//       <Icon className="w-4 h-4 flex-shrink-0" />
//       <span className="truncate max-w-[120px]">{label}</span>
//       <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-auto" />
//     </a>
//   );
// }

// /* ─────────────────────────────────────────
//    Stat badge
// ───────────────────────────────────────── */
// function StatBadge({
//   icon: Icon,
//   value,
//   label,
//   color,
// }: {
//   icon: React.ElementType;
//   value: string | number;
//   label: string;
//   color: string;
// }) {
//   return (
//     <div className={`flex flex-col items-center justify-center px-4 py-3 rounded-2xl border ${color} text-center min-w-[80px]`}>
//       <Icon className="w-4 h-4 mb-1 opacity-70" />
//       <span className="text-lg font-bold leading-none">{value}</span>
//       <span className="text-xs opacity-60 mt-0.5">{label}</span>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Expanded profile panel — FULLY POPULATED
// ───────────────────────────────────────── */
// function ExpandedProfile({
//   instructor,
//   courses,
//   loadingCourses,
// }: {
//   instructor: Instructor;
//   courses: Course[];
//   loadingCourses: boolean;
// }) {
//   const displayName = instructor.display_name || instructor.name || instructor.username;

//   // Normalise arrays that might come as strings or arrays
//   const skills         = Array.isArray(instructor.skills)         ? instructor.skills         : [];
//   const learningGoals  = Array.isArray(instructor.learning_goals)  ? instructor.learning_goals  : [];
//   const preferredTopics = Array.isArray(instructor.preferred_topics) ? instructor.preferred_topics : [];

//   // Social links
//   const socials = [
//     {
//       icon: Twitter,
//       href: instructor.twitter_username ? `https://twitter.com/${instructor.twitter_username}` : null,
//       label: `@${instructor.twitter_username}`,
//       color: 'bg-sky-50 text-sky-700 border-sky-100 hover:bg-sky-100',
//     },
//     {
//       icon: Github,
//       href: instructor.github_username ? `https://github.com/${instructor.github_username}` : null,
//       label: instructor.github_username ?? '',
//       color: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100',
//     },
//     {
//       icon: Linkedin,
//       href: instructor.linkedin_url ?? null,
//       label: 'LinkedIn',
//       color: 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100',
//     },
//     {
//       icon: Youtube,
//       href: instructor.youtube_channel ?? null,
//       label: instructor.youtube_channel ? 'YouTube Channel' : '',
//       color: 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100',
//     },
//     {
//       icon: Globe,
//       href: instructor.website ?? null,
//       label: instructor.website ? instructor.website.replace(/^https?:\/\//, '') : '',
//       color: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100',
//     },
//   ].filter((s) => s.href && s.label);

//   const hasAbout   = instructor.bio || instructor.location || instructor.company || instructor.headline;
//   const hasContact = socials.length > 0 || instructor.website;
//   const hasSkills  = skills.length > 0 || learningGoals.length > 0 || preferredTopics.length > 0;

//   return (
//     <div className="border-t border-blue-100 overflow-hidden">

//       {/* ── Profile hero strip ── */}
//       <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
//         {/* Large avatar */}
//         <div className="w-16 h-16 relative rounded-2xl overflow-hidden flex-shrink-0 ring-4 ring-white/30 shadow-xl">
//           {(instructor.profile_image || instructor.image) ? (
//             <Image src={instructor.profile_image || instructor.image!} alt={displayName} fill className="object-cover" unoptimized />
//           ) : (
//             <div className="w-full h-full bg-white/20 flex items-center justify-center">
//               <span className="text-white font-bold text-xl">
//                 {displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
//               </span>
//             </div>
//           )}
//         </div>

//         {/* Name + headline */}
//         <div className="flex-1 min-w-0">
//           <h3 className="text-xl font-bold text-white leading-tight">{displayName}</h3>
//           {instructor.headline && (
//             <p className="text-blue-100 text-sm mt-0.5 font-medium">{instructor.headline}</p>
//           )}
//           <div className="flex flex-wrap items-center gap-3 mt-2">
//             {instructor.location && (
//               <span className="flex items-center gap-1 text-blue-200 text-xs">
//                 <MapPin className="w-3 h-3" /> {instructor.location}
//               </span>
//             )}
//             {instructor.company && (
//               <span className="flex items-center gap-1 text-blue-200 text-xs">
//                 <Briefcase className="w-3 h-3" /> {instructor.company}
//               </span>
//             )}
//             {instructor.availability_status === 'available' && (
//               <span className="flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
//                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
//                 Available for hire
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Stats row */}
//         <div className="flex items-center gap-2 flex-shrink-0">
//           <StatBadge icon={BookOpen} value={instructor.course_count} label="Courses" color="bg-white/10 text-white border-white/20" />
//           <StatBadge icon={Users} value={instructor.total_students.toLocaleString()} label="Students" color="bg-white/10 text-white border-white/20" />
//           {instructor.average_rating > 0 && (
//             <StatBadge icon={Star} value={instructor.average_rating.toFixed(1)} label="Rating" color="bg-amber-400/20 text-amber-100 border-amber-400/30" />
//           )}
//         </div>
//       </div>

//       {/* ── Main content grid ── */}
//       <div className="bg-gradient-to-br from-slate-50 to-blue-50/20 p-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//           {/* ── LEFT: About + Contact ── */}
//           <div className="lg:col-span-1 space-y-5">

//             {/* Bio */}
//             {instructor.bio && (
//               <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
//                 <SectionHeader icon={GraduationCap} label="About" />
//                 <p className="text-sm text-gray-600 leading-relaxed">{instructor.bio}</p>
//               </div>
//             )}

//             {/* Location & Company detail */}
//             {(instructor.location || instructor.company || instructor.website) && (
//               <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
//                 <SectionHeader icon={Briefcase} label="Details" />
//                 <div className="space-y-2.5">
//                   {instructor.location && (
//                     <div className="flex items-center gap-2.5 text-sm text-gray-600">
//                       <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
//                         <MapPin className="w-3.5 h-3.5 text-rose-500" />
//                       </div>
//                       <span>{instructor.location}</span>
//                     </div>
//                   )}
//                   {instructor.company && (
//                     <div className="flex items-center gap-2.5 text-sm text-gray-600">
//                       <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
//                         <Building2 className="w-3.5 h-3.5 text-indigo-500" />
//                       </div>
//                       <span>{instructor.company}</span>
//                     </div>
//                   )}
//                   {instructor.website && (
//                     <div className="flex items-center gap-2.5 text-sm">
//                       <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
//                         <Globe className="w-3.5 h-3.5 text-emerald-500" />
//                       </div>
//                       <a
//                         href={instructor.website}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 hover:text-blue-800 hover:underline truncate transition-colors"
//                       >
//                         {instructor.website.replace(/^https?:\/\//, '')}
//                       </a>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Social links */}
//             {socials.length > 0 && (
//               <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
//                 <SectionHeader icon={Globe} label="Connect" />
//                 <div className="flex flex-col gap-2">
//                   {socials.map(({ icon, href, label, color }) => (
//                     <SocialButton key={label} icon={icon} href={href!} label={label} color={color} />
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* ── MIDDLE: Skills, Goals, Topics ── */}
//           <div className="lg:col-span-1 space-y-5">

//             {/* Skills */}
//             {skills.length > 0 && (
//               <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
//                 <SectionHeader icon={Zap} label="Skills" />
//                 <div className="flex flex-wrap gap-1.5">
//                   {skills.map((skill) => (
//                     <TagPill key={skill} label={skill} color="blue" />
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Learning Goals */}
//             {learningGoals.length > 0 && (
//               <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
//                 <SectionHeader icon={Target} label="Learning Goals" />
//                 <ul className="space-y-2">
//                   {learningGoals.map((goal) => (
//                     <li key={goal} className="flex items-start gap-2 text-sm text-gray-600">
//                       <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
//                       <span>{goal}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {/* Preferred Topics */}
//             {preferredTopics.length > 0 && (
//               <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
//                 <SectionHeader icon={Heart} label="Preferred Topics" />
//                 <div className="flex flex-wrap gap-1.5">
//                   {preferredTopics.map((topic) => (
//                     <TagPill key={topic} label={topic} color="violet" />
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* No profile data fallback */}
//             {!hasAbout && !hasSkills && !hasContact && (
//               <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-6 text-center">
//                 <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
//                   <GraduationCap className="w-5 h-5 text-gray-300" />
//                 </div>
//                 <p className="text-sm text-gray-400">Profile details not yet added.</p>
//               </div>
//             )}
//           </div>

//           {/* ── RIGHT: Courses ── */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm h-full">
//               <SectionHeader icon={BookOpen} label="Published Courses" />
//               {loadingCourses ? (
//                 <div className="flex items-center gap-2 text-sm text-gray-400 py-6 justify-center">
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                   Loading courses…
//                 </div>
//               ) : courses.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-8 text-center">
//                   <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
//                     <BookOpen className="w-5 h-5 text-blue-200" />
//                   </div>
//                   <p className="text-sm text-gray-400">No published courses yet.</p>
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   {courses.map((course) => (
//                     <CourseMiniCard key={course.id} course={course} />
//                   ))}
//                   {courses.length > 0 && (
//                     <Link
//                       href={`/courses?instructor=${instructor.username}`}
//                       className="flex items-center justify-center gap-1.5 mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 py-2 rounded-xl hover:bg-blue-50 transition-colors"
//                     >
//                       View all courses <ExternalLink className="w-3 h-3" />
//                     </Link>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Instructor card (horizontal)
// ───────────────────────────────────────── */
// function InstructorCard({ instructor }: { instructor: Instructor }) {
//   const [expanded, setExpanded] = useState(false);
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loadingCourses, setLoadingCourses] = useState(false);
//   const [coursesLoaded, setCoursesLoaded] = useState(false);

//   const displayName = instructor.display_name || instructor.name || instructor.username;

//   const toggleExpand = async () => {
//     if (!expanded && !coursesLoaded) {
//       setLoadingCourses(true);
//       const result = await getInstructorCoursesAction(instructor.id);
//       setCourses((result.courses as Course[]) || []);
//       setCoursesLoaded(true);
//       setLoadingCourses(false);
//     }
//     setExpanded((prev) => !prev);
//   };

//   return (
//     <div
//       className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden
//         ${expanded ? 'border-blue-200 shadow-lg shadow-blue-50' : 'border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100'}`}
//     >
//       {/* Main card row */}
//       <div className="p-5 flex items-start gap-5">
//         {/* Avatar */}
//         <InstructorAvatar instructor={instructor} size="lg" />

//         {/* Info */}
//         <div className="flex-1 min-w-0">
//           <div className="flex items-start justify-between gap-2">
//             <div>
//               <h3 className="font-semibold text-gray-900 text-base leading-tight">{displayName}</h3>
//               {instructor.headline && (
//                 <p className="text-sm text-blue-600 font-medium mt-0.5">{instructor.headline}</p>
//               )}
//             </div>
//             {instructor.availability_status === 'available' && (
//               <span className="flex-shrink-0 flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
//                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
//                 Available
//               </span>
//             )}
//           </div>

//           {/* Stats row */}
//           <div className="mt-3 flex flex-wrap items-center gap-4">
//             <span className="flex items-center gap-1.5 text-sm text-gray-600">
//               <BookOpen className="w-4 h-4 text-blue-400" />
//               <span className="font-semibold text-gray-800">{instructor.course_count}</span>
//               <span className="text-gray-400">{instructor.course_count === 1 ? 'Course' : 'Courses'}</span>
//             </span>
//             <span className="flex items-center gap-1.5 text-sm text-gray-600">
//               <Users className="w-4 h-4 text-blue-400" />
//               <span className="font-semibold text-gray-800">{instructor.total_students.toLocaleString()}</span>
//               <span className="text-gray-400">Students</span>
//             </span>
//             {instructor.average_rating > 0 && (
//               <span className="flex items-center gap-1.5 text-sm text-gray-600">
//                 <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
//                 <span className="font-semibold text-gray-800">{instructor.average_rating.toFixed(1)}</span>
//                 <span className="text-gray-400">Rating</span>
//               </span>
//             )}
//           </div>

//           {/* Location / company quick info */}
//           {(instructor.location || instructor.company) && (
//             <div className="mt-2 flex items-center gap-3">
//               {instructor.location && (
//                 <span className="flex items-center gap-1 text-xs text-gray-400">
//                   <MapPin className="w-3 h-3" /> {instructor.location}
//                 </span>
//               )}
//               {instructor.company && (
//                 <span className="flex items-center gap-1 text-xs text-gray-400">
//                   <Building2 className="w-3 h-3" /> {instructor.company}
//                 </span>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Actions */}
//         <div className="flex flex-col items-end gap-2 flex-shrink-0">
//           <button
//             onClick={toggleExpand}
//             className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200
//               ${expanded
//                 ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
//                 : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
//           >
//             {expanded ? (
//               <><ChevronUp className="w-4 h-4" /> Less</>
//             ) : (
//               <><ChevronDown className="w-4 h-4" /> View Profile</>
//             )}
//           </button>
//           <Link
//             href={`/courses?instructor=${instructor.username}`}
//             className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all duration-200"
//           >
//             <BookOpen className="w-4 h-4" /> Courses
//           </Link>
//         </div>
//       </div>

//       {/* Expandable section */}
//       {expanded && (
//         <ExpandedProfile
//           instructor={instructor}
//           courses={courses}
//           loadingCourses={loadingCourses}
//         />
//       )}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Empty state
// ───────────────────────────────────────── */
// function EmptyState({ search }: { search: string }) {
//   return (
//     <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
//       <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
//         <Award className="w-8 h-8 text-blue-300" />
//       </div>
//       <h3 className="text-lg font-semibold text-gray-700 mb-1">No instructors found</h3>
//       <p className="text-sm text-gray-400 max-w-xs">
//         {search ? `No instructors match "${search}". Try a different search term.` : 'No instructors are available yet.'}
//       </p>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Main client component
// ───────────────────────────────────────── */
// export default function InstructorsClient({
//   initialInstructors,
//   initialTotal,
//   initialSearch,
//   initialSort,
// }: Props) {
//   const [instructors, setInstructors] = useState<Instructor[]>(initialInstructors);
//   const [total, setTotal] = useState(initialTotal);
//   const [search, setSearch] = useState(initialSearch);
//   const [sort, setSort] = useState(initialSort);
//   const [page, setPage] = useState(1);
//   const [isPending, startTransition] = useTransition();

//   const LIMIT = 12;

//   const fetchInstructors = useCallback(
//     (newSearch: string, newSort: string, newPage: number) => {
//       startTransition(async () => {
//         const result = await getInstructorsAction({
//           search: newSearch || undefined,
//           sortBy: newSort as any,
//           limit: LIMIT,
//           offset: (newPage - 1) * LIMIT,
//         });
//         setInstructors(result.instructors || []);
//         setTotal(result.total || 0);
//       });
//     },
//     []
//   );

//   const handleSearch = (value: string) => {
//     setSearch(value);
//     setPage(1);
//     fetchInstructors(value, sort, 1);
//   };

//   const handleSort = (value: string) => {
//     setSort(value);
//     setPage(1);
//     fetchInstructors(search, value, 1);
//   };

//   const handlePage = (newPage: number) => {
//     setPage(newPage);
//     fetchInstructors(search, sort, newPage);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const totalPages = Math.ceil(total / LIMIT);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-white">
//       {/* ── Hero header ── */}
//       <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 py-16 px-4">
//         <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
//         <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-indigo-400/10 blur-xl" />

//         <div className="max-w-5xl mx-auto relative z-10 text-center">
//           <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-medium px-3 py-1.5 rounded-full mb-4 border border-white/20">
//             <Award className="w-3.5 h-3.5" />
//             Expert Instructors
//           </div>
//           <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
//             Learn from the Best
//           </h1>
//           <p className="text-blue-100 text-lg max-w-xl mx-auto">
//             Industry leaders and skilled professionals guiding your learning journey.
//           </p>
//           <p className="mt-3 text-blue-200 text-sm font-medium">
//             {total.toLocaleString()} expert{total !== 1 ? 's' : ''} ready to teach
//           </p>
//         </div>
//       </div>

//       {/* ── Filters bar ── */}
//       <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
//         <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3">
//           <div className="relative flex-1">
//             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search instructors by name or specialty…"
//               value={search}
//               onChange={(e) => handleSearch(e.target.value)}
//               className="w-full pl-10 pr-9 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
//             />
//             {search && (
//               <button
//                 onClick={() => handleSearch('')}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             )}
//           </div>

//           <div className="relative">
//             <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//             <select
//               value={sort}
//               onChange={(e) => handleSort(e.target.value)}
//               className="pl-9 pr-8 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none cursor-pointer min-w-[160px]"
//             >
//               {SORT_OPTIONS.map((opt) => (
//                 <option key={opt.value} value={opt.value}>{opt.label}</option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* ── Content ── */}
//       <div className="max-w-5xl mx-auto px-4 py-8">
//         {isPending ? (
//           <div className="flex items-center justify-center py-24">
//             <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
//           </div>
//         ) : instructors.length === 0 ? (
//           <EmptyState search={search} />
//         ) : (
//           <>
//             <div className="mb-5 flex items-center justify-between">
//               <p className="text-sm text-gray-500">
//                 Showing <span className="font-medium text-gray-700">{instructors.length}</span> of{' '}
//                 <span className="font-medium text-gray-700">{total.toLocaleString()}</span> instructors
//               </p>
//             </div>

//             <div className="space-y-4">
//               {instructors.map((instructor) => (
//                 <InstructorCard key={instructor.id} instructor={instructor} />
//               ))}
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="mt-10 flex items-center justify-center gap-2">
//                 <button
//                   onClick={() => handlePage(page - 1)}
//                   disabled={page === 1}
//                   className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
//                 >
//                   ← Previous
//                 </button>

//                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                   let pageNum: number;
//                   if (totalPages <= 5) pageNum = i + 1;
//                   else if (page <= 3) pageNum = i + 1;
//                   else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
//                   else pageNum = page - 2 + i;

//                   return (
//                     <button
//                       key={pageNum}
//                       onClick={() => handlePage(pageNum)}
//                       className={`w-9 h-9 text-sm rounded-xl border transition-all font-medium
//                         ${pageNum === page
//                           ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
//                           : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
//                     >
//                       {pageNum}
//                     </button>
//                   );
//                 })}

//                 <button
//                   onClick={() => handlePage(page + 1)}
//                   disabled={page === totalPages}
//                   className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
//                 >
//                   Next →
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* ── Become an instructor CTA ── */}
//       <div className="max-w-5xl mx-auto px-4 pb-16">
//         <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
//           <div>
//             <h3 className="text-xl font-bold mb-1">Become an Instructor Today</h3>
//             <p className="text-blue-100 text-sm">Share your knowledge and earn by teaching online.</p>
//           </div>
//           <Link
//             href="/dashboard/request-upgrade"
//             className="flex-shrink-0 bg-white text-blue-700 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
//           >
//             Get Started →
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }











































// // src/app/instructors/instructors-client.tsx
// 'use client';

// import { useState, useTransition, useCallback } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import {
//   Search, BookOpen, Users, Star, MapPin, Building2,
//   Globe, Twitter, Github, Linkedin, Youtube, ChevronDown,
//   ChevronUp, X, SortAsc, Loader2, ExternalLink, Award,
//   Target, Heart, Zap, CheckCircle2, GraduationCap,
//   Briefcase, Mail, User, AlignLeft, Tag,
// } from 'lucide-react';
// import { getInstructorsAction, getInstructorCoursesAction } from './instructors-actions';
// import type { Instructor } from '@/lib/db/queries/instructors';

// /* ─────────────────────────────────────────
//    Types
// ───────────────────────────────────────── */
// interface Course {
//   id: string;
//   title: string;
//   slug: string;
//   thumbnail_url?: string;
//   price_cents: number;
//   level?: string;
//   category_name?: string;
//   enrolled_count: number;
//   avg_rating: number;
//   review_count: number;
// }

// interface Props {
//   initialInstructors: Instructor[];
//   initialTotal: number;
//   initialSearch: string;
//   initialSort: string;
// }

// const SORT_OPTIONS = [
//   { value: 'popular', label: 'Most Popular' },
//   { value: 'rating',  label: 'Top Rated'    },
//   { value: 'courses', label: 'Most Courses' },
//   { value: 'name',    label: 'A–Z'          },
// ];

// /* ─────────────────────────────────────────
//    Helpers
// ───────────────────────────────────────── */
// function toArray(val: unknown): string[] {
//   if (!val) return [];
//   if (Array.isArray(val)) return val.filter(Boolean);
//   if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
//   return [];
// }

// /* ─────────────────────────────────────────
//    Avatar
// ───────────────────────────────────────── */
// function InstructorAvatar({
//   instructor,
//   size = 'md',
// }: {
//   instructor: Instructor;
//   size?: 'sm' | 'md' | 'lg' | 'xl';
// }) {
//   const src = instructor.profile_image || instructor.image;
//   const displayName = instructor.display_name || instructor.name || instructor.username || '?';
//   const initials = displayName
//     .split(' ')
//     .map((w: string) => w[0])
//     .join('')
//     .toUpperCase()
//     .slice(0, 2);

//   const sizeClass = {
//     sm: 'w-10 h-10 text-xs',
//     md: 'w-20 h-20 text-lg',
//     lg: 'w-28 h-28 text-2xl',
//     xl: 'w-20 h-20 text-xl',
//   }[size];

//   const colors = [
//     'from-blue-500 to-indigo-600',
//     'from-violet-500 to-purple-600',
//     'from-emerald-500 to-teal-600',
//     'from-rose-500 to-pink-600',
//     'from-amber-500 to-orange-600',
//   ];
//   const color = colors[(instructor.username || 'a').charCodeAt(0) % colors.length];

//   if (src) {
//     return (
//       <div className={`${sizeClass} relative rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-blue-100`}>
//         <Image src={src} alt={displayName} fill className="object-cover" unoptimized />
//       </div>
//     );
//   }

//   return (
//     <div className={`${sizeClass} rounded-xl flex-shrink-0 bg-gradient-to-br ${color} flex items-center justify-center ring-2 ring-blue-100`}>
//       <span className="font-bold text-white">{initials}</span>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Star rating
// ───────────────────────────────────────── */
// function StarRating({ rating }: { rating: number }) {
//   return (
//     <div className="flex items-center gap-1">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <Star
//           key={star}
//           className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
//         />
//       ))}
//       <span className="text-xs text-gray-500 ml-1">{rating > 0 ? rating.toFixed(1) : 'New'}</span>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Course mini-card
// ───────────────────────────────────────── */
// function CourseMiniCard({ course }: { course: Course }) {
//   return (
//     <Link
//       href={`/courses/${course.slug}`}
//       className="group flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all duration-200"
//     >
//       <div className="w-14 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex-shrink-0 overflow-hidden relative">
//         {course.thumbnail_url ? (
//           <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover" unoptimized />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center">
//             <BookOpen className="w-4 h-4 text-blue-400" />
//           </div>
//         )}
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-medium text-gray-800 line-clamp-1 group-hover:text-blue-700 transition-colors">
//           {course.title}
//         </p>
//         <div className="flex items-center gap-2 mt-0.5">
//           <StarRating rating={course.avg_rating} />
//           <span className="text-xs text-gray-400 hidden sm:inline">·</span>
//           <span className="text-xs text-gray-500 hidden sm:inline">{course.enrolled_count.toLocaleString()} students</span>
//         </div>
//       </div>
//       <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400 mt-0.5 flex-shrink-0" />
//     </Link>
//   );
// }

// /* ─────────────────────────────────────────
//    Profile field row
// ───────────────────────────────────────── */
// function ProfileField({
//   icon: Icon,
//   label,
//   value,
//   href,
//   iconBg = 'bg-blue-50',
//   iconColor = 'text-blue-500',
// }: {
//   icon: React.ElementType;
//   label: string;
//   value: string;
//   href?: string;
//   iconBg?: string;
//   iconColor?: string;
// }) {
//   return (
//     <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
//       <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
//         <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
//         {href ? (
//           <a
//             href={href}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all leading-snug flex items-center gap-1"
//           >
//             {value}
//             <ExternalLink className="w-3 h-3 flex-shrink-0" />
//           </a>
//         ) : (
//           <p className="text-sm text-gray-800 leading-snug break-words">{value}</p>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Tag chip
// ───────────────────────────────────────── */
// function Chip({
//   label,
//   variant = 'blue',
// }: {
//   label: string;
//   variant?: 'blue' | 'violet' | 'emerald' | 'amber';
// }) {
//   const cls = {
//     blue:    'bg-blue-50   text-blue-700   border-blue-100',
//     violet:  'bg-violet-50 text-violet-700 border-violet-100',
//     emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
//     amber:   'bg-amber-50  text-amber-700  border-amber-100',
//   }[variant];
//   return (
//     <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${cls}`}>
//       {label}
//     </span>
//   );
// }

// /* ─────────────────────────────────────────
//    Section card wrapper
// ───────────────────────────────────────── */
// function SectionCard({
//   icon: Icon,
//   title,
//   children,
// }: {
//   icon: React.ElementType;
//   title: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//       {/* Card header */}
//       <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-50 bg-gray-50/60">
//         <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
//           <Icon className="w-3.5 h-3.5 text-blue-600" />
//         </div>
//         <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</h4>
//       </div>
//       <div className="px-4 py-1">{children}</div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Expanded profile — FULL DATA
// ───────────────────────────────────────── */
// function ExpandedProfile({
//   instructor,
//   courses,
//   loadingCourses,
// }: {
//   instructor: Instructor;
//   courses: Course[];
//   loadingCourses: boolean;
// }) {
//   const displayName     = instructor.display_name || instructor.name || instructor.username;
//   const skills          = toArray(instructor.skills);
//   const learningGoals   = toArray(instructor.learning_goals);
//   const preferredTopics = toArray(instructor.preferred_topics);

//   // Stat mini-block
//   const StatBlock = ({
//     icon: Icon,
//     value,
//     label,
//   }: {
//     icon: React.ElementType;
//     value: string | number;
//     label: string;
//   }) => (
//     <div className="flex flex-col items-center justify-center px-4 py-3 bg-white/15 rounded-xl text-white text-center min-w-[72px]">
//       <Icon className="w-4 h-4 mb-1 opacity-80" />
//       <span className="text-base font-bold leading-none">{value}</span>
//       <span className="text-[10px] opacity-70 mt-0.5">{label}</span>
//     </div>
//   );

//   return (
//     <div className="border-t border-blue-100 overflow-hidden">

//       {/* ── Banner ───────────────────────────────────── */}
//       <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-5">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//           {/* Avatar */}
//           <div className="w-16 h-16 relative rounded-2xl overflow-hidden flex-shrink-0 ring-4 ring-white/25 shadow-xl">
//             {(instructor.profile_image || instructor.image) ? (
//               <Image
//                 src={instructor.profile_image || instructor.image!}
//                 alt={displayName}
//                 fill
//                 className="object-cover"
//                 unoptimized
//               />
//             ) : (
//               <div className="w-full h-full bg-white/20 flex items-center justify-center">
//                 <span className="text-white font-bold text-xl">
//                   {displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* Name + headline */}
//           <div className="flex-1 min-w-0">
//             <h3 className="text-lg font-bold text-white leading-tight">{displayName}</h3>
//             {instructor.headline && (
//               <p className="text-blue-100 text-sm mt-0.5">{instructor.headline}</p>
//             )}
//             <div className="flex flex-wrap gap-2 mt-2">
//               {instructor.location && (
//                 <span className="flex items-center gap-1 text-blue-200 text-xs">
//                   <MapPin className="w-3 h-3" />{instructor.location}
//                 </span>
//               )}
//               {instructor.company && (
//                 <span className="flex items-center gap-1 text-blue-200 text-xs">
//                   <Briefcase className="w-3 h-3" />{instructor.company}
//                 </span>
//               )}
//               {instructor.availability_status === 'available' && (
//                 <span className="flex items-center gap-1 text-emerald-300 text-xs bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
//                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
//                   Available
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Stats */}
//           <div className="flex items-center gap-2 flex-shrink-0">
//             <StatBlock icon={BookOpen} value={instructor.course_count} label="Courses" />
//             <StatBlock icon={Users}    value={instructor.total_students.toLocaleString()} label="Students" />
//             {instructor.average_rating > 0 && (
//               <StatBlock icon={Star} value={instructor.average_rating.toFixed(1)} label="Rating" />
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ── Body ─────────────────────────────────────── */}
//       <div className="bg-slate-50/60 p-5">
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

//           {/* ── COL 1: Personal Info ── */}
//           <div className="space-y-4">

//             {/* Basic info card */}
//             <SectionCard icon={User} title="Personal Info">
//               {/* Full Name */}
//               <ProfileField
//                 icon={User}
//                 label="Full Name"
//                 value={instructor.name || displayName}
//                 iconBg="bg-blue-50"
//                 iconColor="text-blue-500"
//               />

//               {/* Email */}
//               {instructor.email && (
//                 <ProfileField
//                   icon={Mail}
//                   label="Email"
//                   value={instructor.email}
//                   href={`mailto:${instructor.email}`}
//                   iconBg="bg-indigo-50"
//                   iconColor="text-indigo-500"
//                 />
//               )}

//               {/* Headline */}
//               {instructor.headline && (
//                 <ProfileField
//                   icon={Briefcase}
//                   label="Professional Headline"
//                   value={instructor.headline}
//                   iconBg="bg-violet-50"
//                   iconColor="text-violet-500"
//                 />
//               )}

//               {/* Location */}
//               {instructor.location && (
//                 <ProfileField
//                   icon={MapPin}
//                   label="Location"
//                   value={instructor.location}
//                   iconBg="bg-rose-50"
//                   iconColor="text-rose-500"
//                 />
//               )}

//               {/* Company */}
//               {instructor.company && (
//                 <ProfileField
//                   icon={Building2}
//                   label="Company"
//                   value={instructor.company}
//                   iconBg="bg-amber-50"
//                   iconColor="text-amber-500"
//                 />
//               )}

//               {/* Website */}
//               {instructor.website && (
//                 <ProfileField
//                   icon={Globe}
//                   label="Website"
//                   value={instructor.website.replace(/^https?:\/\//, '')}
//                   href={instructor.website}
//                   iconBg="bg-emerald-50"
//                   iconColor="text-emerald-500"
//                 />
//               )}
//             </SectionCard>

//             {/* Bio */}
//             {instructor.bio && (
//               <SectionCard icon={AlignLeft} title="Bio">
//                 <div className="py-2">
//                   <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
//                     {instructor.bio}
//                   </p>
//                 </div>
//               </SectionCard>
//             )}
//           </div>

//           {/* ── COL 2: Social + Skills ── */}
//           <div className="space-y-4">

//             {/* Social Profiles */}
//             {(instructor.twitter_username || instructor.github_username || instructor.linkedin_url || instructor.youtube_channel) && (
//               <SectionCard icon={Globe} title="Social Profiles">

//                 {instructor.twitter_username && (
//                   <ProfileField
//                     icon={Twitter}
//                     label="Twitter"
//                     value={`@${instructor.twitter_username}`}
//                     href={`https://twitter.com/${instructor.twitter_username}`}
//                     iconBg="bg-sky-50"
//                     iconColor="text-sky-500"
//                   />
//                 )}

//                 {instructor.github_username && (
//                   <ProfileField
//                     icon={Github}
//                     label="GitHub"
//                     value={instructor.github_username}
//                     href={`https://github.com/${instructor.github_username}`}
//                     iconBg="bg-gray-100"
//                     iconColor="text-gray-700"
//                   />
//                 )}

//                 {instructor.linkedin_url && (
//                   <ProfileField
//                     icon={Linkedin}
//                     label="LinkedIn"
//                     value={instructor.linkedin_url.replace(/^https?:\/\/(www\.)?/, '')}
//                     href={instructor.linkedin_url}
//                     iconBg="bg-blue-50"
//                     iconColor="text-blue-600"
//                   />
//                 )}

//                 {instructor.youtube_channel && (
//                   <ProfileField
//                     icon={Youtube}
//                     label="YouTube Channel"
//                     value={instructor.youtube_channel.replace(/^https?:\/\/(www\.)?/, '')}
//                     href={instructor.youtube_channel.startsWith('http')
//                       ? instructor.youtube_channel
//                       : `https://youtube.com/${instructor.youtube_channel}`}
//                     iconBg="bg-red-50"
//                     iconColor="text-red-500"
//                   />
//                 )}
//               </SectionCard>
//             )}

//             {/* Skills */}
//             {skills.length > 0 && (
//               <SectionCard icon={Zap} title="Skills">
//                 <div className="flex flex-wrap gap-1.5 py-2">
//                   {skills.map((s) => (
//                     <Chip key={s} label={s} variant="blue" />
//                   ))}
//                 </div>
//               </SectionCard>
//             )}

//             {/* Learning Goals */}
//             {learningGoals.length > 0 && (
//               <SectionCard icon={Target} title="Learning Goals">
//                 <ul className="py-1 space-y-2">
//                   {learningGoals.map((goal) => (
//                     <li key={goal} className="flex items-start gap-2 py-1 text-sm text-gray-700">
//                       <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
//                       {goal}
//                     </li>
//                   ))}
//                 </ul>
//               </SectionCard>
//             )}

//             {/* Preferred Topics */}
//             {preferredTopics.length > 0 && (
//               <SectionCard icon={Heart} title="Preferred Topics">
//                 <div className="flex flex-wrap gap-1.5 py-2">
//                   {preferredTopics.map((t) => (
//                     <Chip key={t} label={t} variant="violet" />
//                   ))}
//                 </div>
//               </SectionCard>
//             )}
//           </div>

//           {/* ── COL 3: Courses ── */}
//           <div className="md:col-span-2 xl:col-span-1">
//             <SectionCard icon={BookOpen} title="Published Courses">
//               {loadingCourses ? (
//                 <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-400">
//                   <Loader2 className="w-4 h-4 animate-spin" /> Loading…
//                 </div>
//               ) : courses.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-8 text-center">
//                   <BookOpen className="w-8 h-8 text-gray-200 mb-2" />
//                   <p className="text-sm text-gray-400">No published courses yet.</p>
//                 </div>
//               ) : (
//                 <div className="py-2 space-y-1.5">
//                   {courses.map((c) => <CourseMiniCard key={c.id} course={c} />)}
//                   <Link
//                     href={`/courses?instructor=${instructor.username}`}
//                     className="flex items-center justify-center gap-1.5 mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800 py-2 rounded-xl hover:bg-blue-50 transition-colors"
//                   >
//                     View all courses <ExternalLink className="w-3 h-3" />
//                   </Link>
//                 </div>
//               )}
//             </SectionCard>
//           </div>

//         </div>

//         {/* Empty fallback */}
//         {!instructor.bio && !instructor.email && !instructor.headline &&
//          !instructor.location && !instructor.company && !instructor.website &&
//          !instructor.twitter_username && !instructor.github_username &&
//          !instructor.linkedin_url && !instructor.youtube_channel &&
//          skills.length === 0 && learningGoals.length === 0 && preferredTopics.length === 0 && (
//           <div className="text-center py-8 text-sm text-gray-400">
//             This instructor hasn't filled in their profile details yet.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Instructor card
// ───────────────────────────────────────── */
// function InstructorCard({ instructor }: { instructor: Instructor }) {
//   const [expanded,      setExpanded]      = useState(false);
//   const [courses,       setCourses]       = useState<Course[]>([]);
//   const [loadingCourses, setLoadingCourses] = useState(false);
//   const [coursesLoaded, setCoursesLoaded] = useState(false);

//   const displayName = instructor.display_name || instructor.name || instructor.username;

//   const toggleExpand = async () => {
//     if (!expanded && !coursesLoaded) {
//       setLoadingCourses(true);
//       const result = await getInstructorCoursesAction(instructor.id);
//       setCourses((result.courses as Course[]) || []);
//       setCoursesLoaded(true);
//       setLoadingCourses(false);
//     }
//     setExpanded((prev) => !prev);
//   };

//   return (
//     <div className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden
//       ${expanded
//         ? 'border-blue-200 shadow-lg shadow-blue-50'
//         : 'border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100'}`}
//     >
//       <div className="p-5 flex items-start gap-5">
//         <InstructorAvatar instructor={instructor} size="lg" />

//         <div className="flex-1 min-w-0">
//           <div className="flex items-start justify-between gap-2">
//             <div>
//               <h3 className="font-semibold text-gray-900 text-base leading-tight">{displayName}</h3>
//               {instructor.headline && (
//                 <p className="text-sm text-blue-600 font-medium mt-0.5">{instructor.headline}</p>
//               )}
//             </div>
//             {instructor.availability_status === 'available' && (
//               <span className="flex-shrink-0 flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
//                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
//                 Available
//               </span>
//             )}
//           </div>

//           <div className="mt-3 flex flex-wrap items-center gap-4">
//             <span className="flex items-center gap-1.5 text-sm text-gray-600">
//               <BookOpen className="w-4 h-4 text-blue-400" />
//               <span className="font-semibold text-gray-800">{instructor.course_count}</span>
//               <span className="text-gray-400">{instructor.course_count === 1 ? 'Course' : 'Courses'}</span>
//             </span>
//             <span className="flex items-center gap-1.5 text-sm text-gray-600">
//               <Users className="w-4 h-4 text-blue-400" />
//               <span className="font-semibold text-gray-800">{instructor.total_students.toLocaleString()}</span>
//               <span className="text-gray-400">Students</span>
//             </span>
//             {instructor.average_rating > 0 && (
//               <span className="flex items-center gap-1.5 text-sm text-gray-600">
//                 <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
//                 <span className="font-semibold text-gray-800">{instructor.average_rating.toFixed(1)}</span>
//                 <span className="text-gray-400">Rating</span>
//               </span>
//             )}
//           </div>

//           {(instructor.location || instructor.company) && (
//             <div className="mt-2 flex items-center gap-3">
//               {instructor.location && (
//                 <span className="flex items-center gap-1 text-xs text-gray-400">
//                   <MapPin className="w-3 h-3" /> {instructor.location}
//                 </span>
//               )}
//               {instructor.company && (
//                 <span className="flex items-center gap-1 text-xs text-gray-400">
//                   <Building2 className="w-3 h-3" /> {instructor.company}
//                 </span>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="flex flex-col items-end gap-2 flex-shrink-0">
//           <button
//             onClick={toggleExpand}
//             className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200
//               ${expanded
//                 ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
//                 : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
//           >
//             {expanded
//               ? <><ChevronUp   className="w-4 h-4" /> Less</>
//               : <><ChevronDown className="w-4 h-4" /> View Profile</>}
//           </button>
//           <Link
//             href={`/courses?instructor=${instructor.username}`}
//             className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all"
//           >
//             <BookOpen className="w-4 h-4" /> Courses
//           </Link>
//         </div>
//       </div>

//       {expanded && (
//         <ExpandedProfile
//           instructor={instructor}
//           courses={courses}
//           loadingCourses={loadingCourses}
//         />
//       )}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Empty state
// ───────────────────────────────────────── */
// function EmptyState({ search }: { search: string }) {
//   return (
//     <div className="flex flex-col items-center justify-center py-24 text-center">
//       <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
//         <Award className="w-8 h-8 text-blue-300" />
//       </div>
//       <h3 className="text-lg font-semibold text-gray-700 mb-1">No instructors found</h3>
//       <p className="text-sm text-gray-400 max-w-xs">
//         {search
//           ? `No instructors match "${search}". Try a different search term.`
//           : 'No instructors are available yet.'}
//       </p>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Main
// ───────────────────────────────────────── */
// export default function InstructorsClient({
//   initialInstructors,
//   initialTotal,
//   initialSearch,
//   initialSort,
// }: Props) {
//   const [instructors, setInstructors] = useState<Instructor[]>(initialInstructors);
//   const [total,       setTotal]       = useState(initialTotal);
//   const [search,      setSearch]      = useState(initialSearch);
//   const [sort,        setSort]        = useState(initialSort);
//   const [page,        setPage]        = useState(1);
//   const [isPending,   startTransition] = useTransition();
//   const LIMIT = 12;

//   const fetchInstructors = useCallback(
//     (newSearch: string, newSort: string, newPage: number) => {
//       startTransition(async () => {
//         const result = await getInstructorsAction({
//           search: newSearch || undefined,
//           sortBy: newSort as any,
//           limit: LIMIT,
//           offset: (newPage - 1) * LIMIT,
//         });
//         setInstructors(result.instructors || []);
//         setTotal(result.total || 0);
//       });
//     },
//     []
//   );

//   const handleSearch = (v: string) => { setSearch(v); setPage(1); fetchInstructors(v, sort, 1); };
//   const handleSort   = (v: string) => { setSort(v);   setPage(1); fetchInstructors(search, v, 1); };
//   const handlePage   = (n: number) => {
//     setPage(n);
//     fetchInstructors(search, sort, n);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const totalPages = Math.ceil(total / LIMIT);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-white">

//       {/* Hero */}
//       <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 py-16 px-4">
//         <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
//         <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-indigo-400/10 blur-xl" />
//         <div className="max-w-5xl mx-auto relative z-10 text-center">
//           <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-medium px-3 py-1.5 rounded-full mb-4 border border-white/20">
//             <Award className="w-3.5 h-3.5" /> Expert Instructors
//           </div>
//           <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">Learn from the Best</h1>
//           <p className="text-blue-100 text-lg max-w-xl mx-auto">
//             Industry leaders and skilled professionals guiding your learning journey.
//           </p>
//           <p className="mt-3 text-blue-200 text-sm font-medium">
//             {total.toLocaleString()} expert{total !== 1 ? 's' : ''} ready to teach
//           </p>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
//         <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3">
//           <div className="relative flex-1">
//             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search instructors by name or specialty…"
//               value={search}
//               onChange={(e) => handleSearch(e.target.value)}
//               className="w-full pl-10 pr-9 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
//             />
//             {search && (
//               <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
//                 <X className="w-4 h-4" />
//               </button>
//             )}
//           </div>
//           <div className="relative">
//             <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//             <select
//               value={sort}
//               onChange={(e) => handleSort(e.target.value)}
//               className="pl-9 pr-8 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none cursor-pointer min-w-[160px]"
//             >
//               {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="max-w-5xl mx-auto px-4 py-8">
//         {isPending ? (
//           <div className="flex items-center justify-center py-24">
//             <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
//           </div>
//         ) : instructors.length === 0 ? (
//           <EmptyState search={search} />
//         ) : (
//           <>
//             <div className="mb-5">
//               <p className="text-sm text-gray-500">
//                 Showing <span className="font-medium text-gray-700">{instructors.length}</span> of{' '}
//                 <span className="font-medium text-gray-700">{total.toLocaleString()}</span> instructors
//               </p>
//             </div>

//             <div className="space-y-4">
//               {instructors.map((i) => <InstructorCard key={i.id} instructor={i} />)}
//             </div>

//             {totalPages > 1 && (
//               <div className="mt-10 flex items-center justify-center gap-2">
//                 <button
//                   onClick={() => handlePage(page - 1)}
//                   disabled={page === 1}
//                   className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
//                 >
//                   ← Previous
//                 </button>
//                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                   let n: number;
//                   if (totalPages <= 5) n = i + 1;
//                   else if (page <= 3) n = i + 1;
//                   else if (page >= totalPages - 2) n = totalPages - 4 + i;
//                   else n = page - 2 + i;
//                   return (
//                     <button
//                       key={n}
//                       onClick={() => handlePage(n)}
//                       className={`w-9 h-9 text-sm rounded-xl border transition-all font-medium
//                         ${n === page ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
//                     >
//                       {n}
//                     </button>
//                   );
//                 })}
//                 <button
//                   onClick={() => handlePage(page + 1)}
//                   disabled={page === totalPages}
//                   className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
//                 >
//                   Next →
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* CTA */}
//       <div className="max-w-5xl mx-auto px-4 pb-16">
//         <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
//           <div>
//             <h3 className="text-xl font-bold mb-1">Become an Instructor Today</h3>
//             <p className="text-blue-100 text-sm">Share your knowledge and earn by teaching online.</p>
//           </div>
//           <Link
//             href="/dashboard/request-upgrade"
//             className="flex-shrink-0 bg-white text-blue-700 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
//           >
//             Get Started →
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }




























// // src/app/instructors/instructors-client.tsx
// 'use client';

// import { useState, useTransition, useCallback } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import {
//   Search, BookOpen, Users, Star, MapPin, Building2,
//   Globe, Twitter, Github, Linkedin, Youtube, ChevronDown,
//   ChevronUp, X, SortAsc, Loader2, ExternalLink, Award,
//   Target, Heart, Zap, CheckCircle2, Briefcase, Mail,
//   User, AlignLeft, Clock, GraduationCap, Play, BadgeCheck,
// } from 'lucide-react';
// import { getInstructorsAction, getInstructorCoursesAction } from './instructors-actions';
// import type { Instructor } from '@/lib/db/queries/instructors';

// /* ─────────────────────────────────────────
//    Types — mirrors what getInstructorCourses returns
// ───────────────────────────────────────── */
// interface Course {
//   id: string;
//   slug: string;
//   title: string;
//   subtitle?: string | null;
//   short_description?: string | null;
//   thumbnail_url?: string | null;
//   promo_video_url?: string | null;
//   price_cents: number;
//   difficulty_level?: string | null;
//   category_name?: string | null;
//   enrolled_students_count: number;
//   average_rating: number;
//   review_count: number;
//   total_lessons?: number | null;
//   total_video_duration?: number | null;
//   is_published: boolean;
//   is_featured?: boolean;
//   is_bestseller?: boolean;
//   certificate_available?: boolean;
// }

// interface Props {
//   initialInstructors: Instructor[];
//   initialTotal: number;
//   initialSearch: string;
//   initialSort: string;
// }

// const SORT_OPTIONS = [
//   { value: 'popular', label: 'Most Popular' },
//   { value: 'rating',  label: 'Top Rated'    },
//   { value: 'courses', label: 'Most Courses' },
//   { value: 'name',    label: 'A–Z'          },
// ];

// /* ─────────────────────────────────────────
//    Helpers
// ───────────────────────────────────────── */
// function toArray(val: unknown): string[] {
//   if (!val) return [];
//   if (Array.isArray(val)) return val.filter(Boolean);
//   if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
//   return [];
// }

// function formatPrice(cents: number) {
//   if (!cents || cents === 0) return 'Free';
//   return `$${(cents / 100).toFixed(2)}`;
// }

// function formatDuration(minutes?: number | null) {
//   if (!minutes) return null;
//   const h = Math.floor(minutes / 60);
//   const m = minutes % 60;
//   if (h === 0) return `${m}m`;
//   return m > 0 ? `${h}h ${m}m` : `${h}h`;
// }

// const LEVEL_COLORS: Record<string, string> = {
//   beginner:     'bg-emerald-50 text-emerald-700 border-emerald-100',
//   intermediate: 'bg-amber-50   text-amber-700   border-amber-100',
//   advanced:     'bg-rose-50    text-rose-700    border-rose-100',
// };

// /* ─────────────────────────────────────────
//    Avatar
// ───────────────────────────────────────── */
// function InstructorAvatar({
//   instructor,
//   size = 'md',
// }: {
//   instructor: Instructor;
//   size?: 'md' | 'lg';
// }) {
//   const src = instructor.profile_image || instructor.image;
//   const displayName = instructor.display_name || instructor.name || instructor.username || '?';
//   const initials = displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
//   const colors = [
//     'from-blue-500 to-indigo-600', 'from-violet-500 to-purple-600',
//     'from-emerald-500 to-teal-600', 'from-rose-500 to-pink-600', 'from-amber-500 to-orange-600',
//   ];
//   const color = colors[(instructor.username || 'a').charCodeAt(0) % colors.length];
//   const sizeClass = size === 'lg' ? 'w-28 h-28 text-2xl' : 'w-20 h-20 text-lg';

//   if (src) {
//     return (
//       <div className={`${sizeClass} relative rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-blue-100`}>
//         <Image src={src} alt={displayName} fill className="object-cover" unoptimized />
//       </div>
//     );
//   }
//   return (
//     <div className={`${sizeClass} rounded-xl flex-shrink-0 bg-gradient-to-br ${color} flex items-center justify-center ring-2 ring-blue-100`}>
//       <span className="font-bold text-white">{initials}</span>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Star rating
// ───────────────────────────────────────── */
// function StarRating({ rating, count }: { rating: number; count?: number }) {
//   return (
//     <div className="flex items-center gap-1">
//       {[1,2,3,4,5].map(s => (
//         <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
//       ))}
//       <span className="text-xs text-gray-500 ml-0.5">{rating > 0 ? rating.toFixed(1) : 'New'}</span>
//       {count && count > 0 && <span className="text-xs text-gray-400">({count})</span>}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Course card — 2-per-row, rich display
// ───────────────────────────────────────── */
// function InstructorCourseCard({ course }: { course: Course }) {
//   const level = (course.difficulty_level || '').toLowerCase();

//   return (
//     <Link
//       href={`/courses/${course.slug}`}
//       className="group flex flex-col bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
//     >
//       {/* Thumbnail */}
//       <div className="relative aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden flex-shrink-0">
//         {course.thumbnail_url ? (
//           <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center">
//             <BookOpen className="w-10 h-10 text-blue-300" />
//           </div>
//         )}

//         {/* Play overlay if promo video */}
//         {course.promo_video_url && (
//           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
//             <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
//               <Play className="w-5 h-5 text-blue-600 ml-0.5" />
//             </div>
//           </div>
//         )}

//         {/* Badges top-left */}
//         <div className="absolute top-2 left-2 flex flex-wrap gap-1">
//           {course.is_bestseller && (
//             <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-white">BESTSELLER</span>
//           )}
//           {course.is_featured && !course.is_bestseller && (
//             <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500 text-white">FEATURED</span>
//           )}
//           {level && LEVEL_COLORS[level] && (
//             <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${LEVEL_COLORS[level]}`}>
//               {level.charAt(0).toUpperCase() + level.slice(1)}
//             </span>
//           )}
//         </div>

//         {/* Price top-right */}
//         <div className="absolute top-2 right-2">
//           <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-white/90 text-gray-800 shadow-sm">
//             {formatPrice(course.price_cents)}
//           </span>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="flex flex-col flex-1 p-4">
//         {/* Category */}
//         {course.category_name && (
//           <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-500 mb-1">
//             {course.category_name}
//           </span>
//         )}

//         {/* Title */}
//         <h4 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors mb-1">
//           {course.title}
//         </h4>

//         {/* Subtitle */}
//         {course.subtitle && (
//           <p className="text-xs text-gray-500 line-clamp-1 mb-2">{course.subtitle}</p>
//         )}

//         {/* Rating */}
//         <div className="mb-3">
//           <StarRating rating={course.average_rating} count={course.review_count} />
//         </div>

//         {/* Stats row */}
//         <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-500 mt-auto pt-3 border-t border-gray-50">
//           <span className="flex items-center gap-1">
//             <Users className="w-3.5 h-3.5 text-blue-400" />
//             {(course.enrolled_students_count || 0).toLocaleString()} students
//           </span>
//           {course.total_lessons && course.total_lessons > 0 && (
//             <span className="flex items-center gap-1">
//               <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
//               {course.total_lessons} lessons
//             </span>
//           )}
//           {formatDuration(course.total_video_duration) && (
//             <span className="flex items-center gap-1">
//               <Clock className="w-3.5 h-3.5 text-violet-400" />
//               {formatDuration(course.total_video_duration)}
//             </span>
//           )}
//           {course.certificate_available && (
//             <span className="flex items-center gap-1 text-emerald-600">
//               <BadgeCheck className="w-3.5 h-3.5" />
//               Certificate
//             </span>
//           )}
//         </div>
//       </div>
//     </Link>
//   );
// }

// /* ─────────────────────────────────────────
//    Profile field row
// ───────────────────────────────────────── */
// function ProfileField({
//   icon: Icon, label, value, href, iconBg = 'bg-blue-50', iconColor = 'text-blue-500',
// }: {
//   icon: React.ElementType; label: string; value: string;
//   href?: string; iconBg?: string; iconColor?: string;
// }) {
//   return (
//     <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
//       <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
//         <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
//         {href ? (
//           <a href={href} target="_blank" rel="noopener noreferrer"
//             className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all leading-snug flex items-center gap-1">
//             {value} <ExternalLink className="w-3 h-3 flex-shrink-0" />
//           </a>
//         ) : (
//           <p className="text-sm text-gray-800 leading-snug break-words">{value}</p>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Chip
// ───────────────────────────────────────── */
// function Chip({ label, variant = 'blue' }: { label: string; variant?: 'blue' | 'violet' | 'emerald' }) {
//   const cls = {
//     blue:    'bg-blue-50   text-blue-700   border-blue-100',
//     violet:  'bg-violet-50 text-violet-700 border-violet-100',
//     emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
//   }[variant];
//   return (
//     <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${cls}`}>
//       {label}
//     </span>
//   );
// }

// /* ─────────────────────────────────────────
//    Section card
// ───────────────────────────────────────── */
// function SectionCard({ icon: Icon, title, children }: {
//   icon: React.ElementType; title: string; children: React.ReactNode;
// }) {
//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full">
//       <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-50 bg-gray-50/60">
//         <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
//           <Icon className="w-3.5 h-3.5 text-blue-600" />
//         </div>
//         <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</h4>
//       </div>
//       <div className="px-4 py-1">{children}</div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Expanded profile
// ───────────────────────────────────────── */
// function ExpandedProfile({
//   instructor, courses, loadingCourses,
// }: {
//   instructor: Instructor; courses: Course[]; loadingCourses: boolean;
// }) {
//   const displayName     = instructor.display_name || instructor.name || instructor.username;
//   const skills          = toArray(instructor.skills);
//   const learningGoals   = toArray(instructor.learning_goals);
//   const preferredTopics = toArray(instructor.preferred_topics);

//   const StatBlock = ({ icon: Icon, value, label }: { icon: React.ElementType; value: string | number; label: string }) => (
//     <div className="flex flex-col items-center justify-center px-4 py-3 bg-white/15 rounded-xl text-white text-center min-w-[72px]">
//       <Icon className="w-4 h-4 mb-1 opacity-80" />
//       <span className="text-base font-bold leading-none">{value}</span>
//       <span className="text-[10px] opacity-70 mt-0.5">{label}</span>
//     </div>
//   );

//   return (
//     <div className="border-t border-blue-100 overflow-hidden">

//       {/* ── Banner ── */}
//       <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-5">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//           <div className="w-16 h-16 relative rounded-2xl overflow-hidden flex-shrink-0 ring-4 ring-white/25 shadow-xl">
//             {(instructor.profile_image || instructor.image) ? (
//               <Image src={instructor.profile_image || instructor.image!} alt={displayName} fill className="object-cover" unoptimized />
//             ) : (
//               <div className="w-full h-full bg-white/20 flex items-center justify-center">
//                 <span className="text-white font-bold text-xl">
//                   {displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}
//                 </span>
//               </div>
//             )}
//           </div>
//           <div className="flex-1 min-w-0">
//             <h3 className="text-lg font-bold text-white leading-tight">{displayName}</h3>
//             {instructor.headline && <p className="text-blue-100 text-sm mt-0.5">{instructor.headline}</p>}
//             <div className="flex flex-wrap gap-2 mt-2">
//               {instructor.location && (
//                 <span className="flex items-center gap-1 text-blue-200 text-xs">
//                   <MapPin className="w-3 h-3" />{instructor.location}
//                 </span>
//               )}
//               {instructor.company && (
//                 <span className="flex items-center gap-1 text-blue-200 text-xs">
//                   <Briefcase className="w-3 h-3" />{instructor.company}
//                 </span>
//               )}
//               {instructor.availability_status === 'available' && (
//                 <span className="flex items-center gap-1 text-emerald-300 text-xs bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
//                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Available
//                 </span>
//               )}
//             </div>
//           </div>
//           <div className="flex items-center gap-2 flex-shrink-0">
//             <StatBlock icon={BookOpen} value={instructor.course_count} label="Courses" />
//             <StatBlock icon={Users} value={instructor.total_students.toLocaleString()} label="Students" />
//             {instructor.average_rating > 0 && (
//               <StatBlock icon={Star} value={instructor.average_rating.toFixed(1)} label="Rating" />
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ── Body ── */}
//       <div className="bg-slate-50/60 p-5 space-y-5">

//         {/* ── ROW 1: Personal Info + Bio side by side (lg+), stacked (sm) ── */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

//           {/* Personal Info */}
//           <SectionCard icon={User} title="Personal Info">
//             <ProfileField icon={User} label="Full Name" value={instructor.name || displayName}
//               iconBg="bg-blue-50" iconColor="text-blue-500" />
//             {instructor.email && (
//               <ProfileField icon={Mail} label="Email" value={instructor.email}
//                 href={`mailto:${instructor.email}`} iconBg="bg-indigo-50" iconColor="text-indigo-500" />
//             )}
//             {instructor.headline && (
//               <ProfileField icon={Briefcase} label="Professional Headline" value={instructor.headline}
//                 iconBg="bg-violet-50" iconColor="text-violet-500" />
//             )}
//             {instructor.location && (
//               <ProfileField icon={MapPin} label="Location" value={instructor.location}
//                 iconBg="bg-rose-50" iconColor="text-rose-500" />
//             )}
//             {instructor.company && (
//               <ProfileField icon={Building2} label="Company" value={instructor.company}
//                 iconBg="bg-amber-50" iconColor="text-amber-500" />
//             )}
//             {instructor.website && (
//               <ProfileField icon={Globe} label="Website"
//                 value={instructor.website.replace(/^https?:\/\//, '')}
//                 href={instructor.website} iconBg="bg-emerald-50" iconColor="text-emerald-500" />
//             )}
//           </SectionCard>

//           {/* Bio */}
//           {instructor.bio ? (
//             <SectionCard icon={AlignLeft} title="Bio">
//               <div className="py-3">
//                 <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{instructor.bio}</p>
//               </div>
//             </SectionCard>
//           ) : (
//             /* If no bio, show social profiles here instead */
//             (instructor.twitter_username || instructor.github_username || instructor.linkedin_url || instructor.youtube_channel) && (
//               <SectionCard icon={Globe} title="Social Profiles">
//                 {instructor.twitter_username && (
//                   <ProfileField icon={Twitter} label="Twitter" value={`@${instructor.twitter_username}`}
//                     href={`https://twitter.com/${instructor.twitter_username}`} iconBg="bg-sky-50" iconColor="text-sky-500" />
//                 )}
//                 {instructor.github_username && (
//                   <ProfileField icon={Github} label="GitHub" value={instructor.github_username}
//                     href={`https://github.com/${instructor.github_username}`} iconBg="bg-gray-100" iconColor="text-gray-700" />
//                 )}
//                 {instructor.linkedin_url && (
//                   <ProfileField icon={Linkedin} label="LinkedIn"
//                     value={instructor.linkedin_url.replace(/^https?:\/\/(www\.)?/, '')}
//                     href={instructor.linkedin_url} iconBg="bg-blue-50" iconColor="text-blue-600" />
//                 )}
//                 {instructor.youtube_channel && (
//                   <ProfileField icon={Youtube} label="YouTube"
//                     value={instructor.youtube_channel.replace(/^https?:\/\/(www\.)?/, '')}
//                     href={instructor.youtube_channel.startsWith('http') ? instructor.youtube_channel : `https://youtube.com/${instructor.youtube_channel}`}
//                     iconBg="bg-red-50" iconColor="text-red-500" />
//                 )}
//               </SectionCard>
//             )
//           )}
//         </div>

//         {/* ── ROW 2: Social + Skills/Goals/Topics (3 cols on lg) ── */}
//         {/* Only show social separately if we already showed bio above */}
//         {instructor.bio && (instructor.twitter_username || instructor.github_username || instructor.linkedin_url || instructor.youtube_channel) && (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//             <SectionCard icon={Globe} title="Social Profiles">
//               {instructor.twitter_username && (
//                 <ProfileField icon={Twitter} label="Twitter" value={`@${instructor.twitter_username}`}
//                   href={`https://twitter.com/${instructor.twitter_username}`} iconBg="bg-sky-50" iconColor="text-sky-500" />
//               )}
//               {instructor.github_username && (
//                 <ProfileField icon={Github} label="GitHub" value={instructor.github_username}
//                   href={`https://github.com/${instructor.github_username}`} iconBg="bg-gray-100" iconColor="text-gray-700" />
//               )}
//               {instructor.linkedin_url && (
//                 <ProfileField icon={Linkedin} label="LinkedIn"
//                   value={instructor.linkedin_url.replace(/^https?:\/\/(www\.)?/, '')}
//                   href={instructor.linkedin_url} iconBg="bg-blue-50" iconColor="text-blue-600" />
//               )}
//               {instructor.youtube_channel && (
//                 <ProfileField icon={Youtube} label="YouTube"
//                   value={instructor.youtube_channel.replace(/^https?:\/\/(www\.)?/, '')}
//                   href={instructor.youtube_channel.startsWith('http') ? instructor.youtube_channel : `https://youtube.com/${instructor.youtube_channel}`}
//                   iconBg="bg-red-50" iconColor="text-red-500" />
//               )}
//             </SectionCard>

//             {skills.length > 0 && (
//               <SectionCard icon={Zap} title="Skills">
//                 <div className="flex flex-wrap gap-1.5 py-2">
//                   {skills.map(s => <Chip key={s} label={s} variant="blue" />)}
//                 </div>
//               </SectionCard>
//             )}

//             {(learningGoals.length > 0 || preferredTopics.length > 0) && (
//               <div className="space-y-4">
//                 {learningGoals.length > 0 && (
//                   <SectionCard icon={Target} title="Learning Goals">
//                     <ul className="py-1 space-y-1.5">
//                       {learningGoals.map(g => (
//                         <li key={g} className="flex items-start gap-2 py-1 text-sm text-gray-700">
//                           <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />{g}
//                         </li>
//                       ))}
//                     </ul>
//                   </SectionCard>
//                 )}
//                 {preferredTopics.length > 0 && (
//                   <SectionCard icon={Heart} title="Preferred Topics">
//                     <div className="flex flex-wrap gap-1.5 py-2">
//                       {preferredTopics.map(t => <Chip key={t} label={t} variant="violet" />)}
//                     </div>
//                   </SectionCard>
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Skills / Goals / Topics when no bio (simpler layout) */}
//         {!instructor.bio && (skills.length > 0 || learningGoals.length > 0 || preferredTopics.length > 0) && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {skills.length > 0 && (
//               <SectionCard icon={Zap} title="Skills">
//                 <div className="flex flex-wrap gap-1.5 py-2">
//                   {skills.map(s => <Chip key={s} label={s} variant="blue" />)}
//                 </div>
//               </SectionCard>
//             )}
//             {learningGoals.length > 0 && (
//               <SectionCard icon={Target} title="Learning Goals">
//                 <ul className="py-1 space-y-1.5">
//                   {learningGoals.map(g => (
//                     <li key={g} className="flex items-start gap-2 py-1 text-sm text-gray-700">
//                       <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />{g}
//                     </li>
//                   ))}
//                 </ul>
//               </SectionCard>
//             )}
//             {preferredTopics.length > 0 && (
//               <SectionCard icon={Heart} title="Preferred Topics">
//                 <div className="flex flex-wrap gap-1.5 py-2">
//                   {preferredTopics.map(t => <Chip key={t} label={t} variant="violet" />)}
//                 </div>
//               </SectionCard>
//             )}
//           </div>
//         )}

//         {/* ── ROW 3: Published Courses ── */}
//         <div>
//           <div className="flex items-center gap-2 mb-3">
//             <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
//               <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
//             </div>
//             <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Published Courses</h4>
//             {courses.length > 0 && (
//               <span className="ml-auto text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
//                 {courses.length} course{courses.length !== 1 ? 's' : ''}
//               </span>
//             )}
//           </div>

//           {loadingCourses ? (
//             <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-400 bg-white rounded-2xl border border-gray-100">
//               <Loader2 className="w-5 h-5 animate-spin text-blue-400" /> Loading courses…
//             </div>
//           ) : courses.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
//               <BookOpen className="w-10 h-10 text-gray-200 mb-3" />
//               <p className="text-sm font-medium text-gray-400">No published courses yet</p>
//               <p className="text-xs text-gray-300 mt-1">Check back soon</p>
//             </div>
//           ) : (
//             <>
//               {/* 2-per-row grid */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {courses.map(c => <InstructorCourseCard key={c.id} course={c} />)}
//               </div>
//               <div className="mt-4 text-center">
//                 <Link
//                   href={`/courses?instructor=${instructor.username}`}
//                   className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors"
//                 >
//                   View all courses by {instructor.display_name || instructor.name} <ExternalLink className="w-3.5 h-3.5" />
//                 </Link>
//               </div>
//             </>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Instructor card
// ───────────────────────────────────────── */
// function InstructorCard({ instructor }: { instructor: Instructor }) {
//   const [expanded,       setExpanded]       = useState(false);
//   const [courses,        setCourses]        = useState<Course[]>([]);
//   const [loadingCourses, setLoadingCourses] = useState(false);
//   const [coursesLoaded,  setCoursesLoaded]  = useState(false);

//   const displayName = instructor.display_name || instructor.name || instructor.username;

//   const toggleExpand = async () => {
//     if (!expanded && !coursesLoaded) {
//       setLoadingCourses(true);
//       const result = await getInstructorCoursesAction(instructor.id);
//       setCourses((result.courses as Course[]) || []);
//       setCoursesLoaded(true);
//       setLoadingCourses(false);
//     }
//     setExpanded(p => !p);
//   };

//   return (
//     <div className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden
//       ${expanded ? 'border-blue-200 shadow-lg shadow-blue-50' : 'border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100'}`}>
//       <div className="p-5 flex items-start gap-5">
//         <InstructorAvatar instructor={instructor} size="lg" />
//         <div className="flex-1 min-w-0">
//           <div className="flex items-start justify-between gap-2">
//             <div>
//               <h3 className="font-semibold text-gray-900 text-base leading-tight">{displayName}</h3>
//               {instructor.headline && <p className="text-sm text-blue-600 font-medium mt-0.5">{instructor.headline}</p>}
//             </div>
//             {instructor.availability_status === 'available' && (
//               <span className="flex-shrink-0 flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
//                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Available
//               </span>
//             )}
//           </div>
//           <div className="mt-3 flex flex-wrap items-center gap-4">
//             <span className="flex items-center gap-1.5 text-sm text-gray-600">
//               <BookOpen className="w-4 h-4 text-blue-400" />
//               <span className="font-semibold text-gray-800">{instructor.course_count}</span>
//               <span className="text-gray-400">{instructor.course_count === 1 ? 'Course' : 'Courses'}</span>
//             </span>
//             <span className="flex items-center gap-1.5 text-sm text-gray-600">
//               <Users className="w-4 h-4 text-blue-400" />
//               <span className="font-semibold text-gray-800">{instructor.total_students.toLocaleString()}</span>
//               <span className="text-gray-400">Students</span>
//             </span>
//             {instructor.average_rating > 0 && (
//               <span className="flex items-center gap-1.5 text-sm text-gray-600">
//                 <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
//                 <span className="font-semibold text-gray-800">{instructor.average_rating.toFixed(1)}</span>
//                 <span className="text-gray-400">Rating</span>
//               </span>
//             )}
//           </div>
//           {(instructor.location || instructor.company) && (
//             <div className="mt-2 flex items-center gap-3">
//               {instructor.location && <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin className="w-3 h-3" />{instructor.location}</span>}
//               {instructor.company && <span className="flex items-center gap-1 text-xs text-gray-400"><Building2 className="w-3 h-3" />{instructor.company}</span>}
//             </div>
//           )}
//         </div>
//         <div className="flex flex-col items-end gap-2 flex-shrink-0">
//           <button onClick={toggleExpand}
//             className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200
//               ${expanded ? 'bg-blue-600 text-white shadow-sm shadow-blue-200' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
//             {expanded ? <><ChevronUp className="w-4 h-4" />Less</> : <><ChevronDown className="w-4 h-4" />View Profile</>}
//           </button>
//           <Link href={`/courses?instructor=${instructor.username}`}
//             className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all">
//             <BookOpen className="w-4 h-4" />Courses
//           </Link>
//         </div>
//       </div>
//       {expanded && <ExpandedProfile instructor={instructor} courses={courses} loadingCourses={loadingCourses} />}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Empty state
// ───────────────────────────────────────── */
// function EmptyState({ search }: { search: string }) {
//   return (
//     <div className="flex flex-col items-center justify-center py-24 text-center">
//       <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
//         <Award className="w-8 h-8 text-blue-300" />
//       </div>
//       <h3 className="text-lg font-semibold text-gray-700 mb-1">No instructors found</h3>
//       <p className="text-sm text-gray-400 max-w-xs">
//         {search ? `No instructors match "${search}". Try a different search term.` : 'No instructors are available yet.'}
//       </p>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    Main
// ───────────────────────────────────────── */
// export default function InstructorsClient({ initialInstructors, initialTotal, initialSearch, initialSort }: Props) {
//   const [instructors, setInstructors] = useState<Instructor[]>(initialInstructors);
//   const [total,       setTotal]       = useState(initialTotal);
//   const [search,      setSearch]      = useState(initialSearch);
//   const [sort,        setSort]        = useState(initialSort);
//   const [page,        setPage]        = useState(1);
//   const [isPending,   startTransition] = useTransition();
//   const LIMIT = 12;

//   const fetchInstructors = useCallback((newSearch: string, newSort: string, newPage: number) => {
//     startTransition(async () => {
//       const result = await getInstructorsAction({
//         search: newSearch || undefined,
//         sortBy: newSort as any,
//         limit: LIMIT,
//         offset: (newPage - 1) * LIMIT,
//       });
//       setInstructors(result.instructors || []);
//       setTotal(result.total || 0);
//     });
//   }, []);

//   const handleSearch = (v: string) => { setSearch(v); setPage(1); fetchInstructors(v, sort, 1); };
//   const handleSort   = (v: string) => { setSort(v);   setPage(1); fetchInstructors(search, v, 1); };
//   const handlePage   = (n: number) => { setPage(n); fetchInstructors(search, sort, n); window.scrollTo({ top: 0, behavior: 'smooth' }); };
//   const totalPages = Math.ceil(total / LIMIT);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-white">
//       {/* Hero */}
//       <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 py-16 px-4">
//         <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
//         <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-indigo-400/10 blur-xl" />
//         <div className="max-w-5xl mx-auto relative z-10 text-center">
//           <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-medium px-3 py-1.5 rounded-full mb-4 border border-white/20">
//             <Award className="w-3.5 h-3.5" />Expert Instructors
//           </div>
//           <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">Learn from the Best</h1>
//           <p className="text-blue-100 text-lg max-w-xl mx-auto">Industry leaders and skilled professionals guiding your learning journey.</p>
//           <p className="mt-3 text-blue-200 text-sm font-medium">{total.toLocaleString()} expert{total !== 1 ? 's' : ''} ready to teach</p>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
//         <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3">
//           <div className="relative flex-1">
//             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input type="text" placeholder="Search instructors by name or specialty…" value={search}
//               onChange={e => handleSearch(e.target.value)}
//               className="w-full pl-10 pr-9 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" />
//             {search && (
//               <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
//                 <X className="w-4 h-4" />
//               </button>
//             )}
//           </div>
//           <div className="relative">
//             <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//             <select value={sort} onChange={e => handleSort(e.target.value)}
//               className="pl-9 pr-8 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none cursor-pointer min-w-[160px]">
//               {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="max-w-5xl mx-auto px-4 py-8">
//         {isPending ? (
//           <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
//         ) : instructors.length === 0 ? (
//           <EmptyState search={search} />
//         ) : (
//           <>
//             <div className="mb-5">
//               <p className="text-sm text-gray-500">
//                 Showing <span className="font-medium text-gray-700">{instructors.length}</span> of{' '}
//                 <span className="font-medium text-gray-700">{total.toLocaleString()}</span> instructors
//               </p>
//             </div>
//             <div className="space-y-4">
//               {instructors.map(i => <InstructorCard key={i.id} instructor={i} />)}
//             </div>
//             {totalPages > 1 && (
//               <div className="mt-10 flex items-center justify-center gap-2">
//                 <button onClick={() => handlePage(page - 1)} disabled={page === 1}
//                   className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
//                   ← Previous
//                 </button>
//                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                   let n: number;
//                   if (totalPages <= 5) n = i + 1;
//                   else if (page <= 3) n = i + 1;
//                   else if (page >= totalPages - 2) n = totalPages - 4 + i;
//                   else n = page - 2 + i;
//                   return (
//                     <button key={n} onClick={() => handlePage(n)}
//                       className={`w-9 h-9 text-sm rounded-xl border transition-all font-medium
//                         ${n === page ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
//                       {n}
//                     </button>
//                   );
//                 })}
//                 <button onClick={() => handlePage(page + 1)} disabled={page === totalPages}
//                   className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
//                   Next →
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* CTA */}
//       <div className="max-w-5xl mx-auto px-4 pb-16">
//         <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
//           <div>
//             <h3 className="text-xl font-bold mb-1">Become an Instructor Today</h3>
//             <p className="text-blue-100 text-sm">Share your knowledge and earn by teaching online.</p>
//           </div>
//           <Link href="/dashboard/request-upgrade"
//             className="flex-shrink-0 bg-white text-blue-700 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
//             Get Started →
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }























// src/app/instructors/instructors-client.tsx
'use client';

import { useState, useTransition, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search, BookOpen, Users, Star, MapPin, Building2,
  Globe, Twitter, Github, Linkedin, Youtube, ChevronDown,
  ChevronUp, X, SortAsc, Loader2, ExternalLink, Award,
  Target, Heart, Zap, CheckCircle2, Briefcase, Mail,
  User, AlignLeft, Clock, GraduationCap, Play, BadgeCheck,
} from 'lucide-react';
import { getInstructorsAction, getInstructorCoursesAction } from './instructors-actions';
import type { Instructor } from '@/lib/db/queries/instructors';

/* ─────────────────────────────────────────
   Types — mirrors what getInstructorCourses returns
───────────────────────────────────────── */
interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  short_description?: string | null;
  thumbnail_url?: string | null;
  promo_video_url?: string | null;
  price_cents: number;
  difficulty_level?: string | null;
  category_name?: string | null;
  enrolled_students_count: number;
  average_rating: number;
  review_count: number;
  total_lessons?: number | null;
  total_video_duration?: number | null;
  is_published: boolean;
  is_featured?: boolean;
  is_bestseller?: boolean;
  certificate_available?: boolean;
}

interface Props {
  initialInstructors: Instructor[];
  initialTotal: number;
  initialSearch: string;
  initialSort: string;
}

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating',  label: 'Top Rated'    },
  { value: 'courses', label: 'Most Courses' },
  { value: 'name',    label: 'A–Z'          },
];

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function toArray(val: unknown): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
  return [];
}

function formatPrice(cents: number) {
  if (!cents || cents === 0) return 'Free';
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDuration(minutes?: number | null) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

const LEVEL_COLORS: Record<string, string> = {
  beginner:     'bg-emerald-50 text-emerald-700 border-emerald-100',
  intermediate: 'bg-amber-50   text-amber-700   border-amber-100',
  advanced:     'bg-rose-50    text-rose-700    border-rose-100',
};

/* ─────────────────────────────────────────
   Avatar
───────────────────────────────────────── */
function InstructorAvatar({
  instructor,
  size = 'md',
}: {
  instructor: Instructor;
  size?: 'md' | 'lg';
}) {
  const src = instructor.profile_image || instructor.image;
  const displayName = instructor.display_name || instructor.name || instructor.username || '?';
  const initials = displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
  const colors = [
    'from-blue-500 to-indigo-600', 'from-violet-500 to-purple-600',
    'from-emerald-500 to-teal-600', 'from-rose-500 to-pink-600', 'from-amber-500 to-orange-600',
  ];
  const color = colors[(instructor.username || 'a').charCodeAt(0) % colors.length];
  const sizeClass = size === 'lg' ? 'w-28 h-28 text-2xl' : 'w-20 h-20 text-lg';

  if (src) {
    return (
      <div className={`${sizeClass} relative rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-blue-100`}>
        <Image src={src} alt={displayName} fill className="object-cover" unoptimized />
      </div>
    );
  }
  return (
    <div className={`${sizeClass} rounded-xl flex-shrink-0 bg-gradient-to-br ${color} flex items-center justify-center ring-2 ring-blue-100`}>
      <span className="font-bold text-white">{initials}</span>
    </div>
  );
}

/* ─────────────────────────────────────────
   Star rating
───────────────────────────────────────── */
function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
      ))}
      <span className="text-xs text-gray-500 ml-0.5">{rating > 0 ? rating.toFixed(1) : 'New'}</span>
      {count && count > 0 && <span className="text-xs text-gray-400">({count})</span>}
    </div>
  );
}

/* ─────────────────────────────────────────
   Course card — 2-per-row, rich display
───────────────────────────────────────── */
function InstructorCourseCard({ course }: { course: Course }) {
  const level = (course.difficulty_level || '').toLowerCase();

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col rounded-2xl border-2 border-blue-100 hover:border-blue-400 bg-gradient-to-b from-white to-blue-50/30 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative"
    >
      {/* Left accent stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-indigo-500 to-violet-500 rounded-l-2xl z-10" />

      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-indigo-200 overflow-hidden flex-shrink-0">
        {course.thumbnail_url ? (
          <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-blue-300" />
          </div>
        )}

        {/* Play overlay if promo video */}
        {course.promo_video_url && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <Play className="w-5 h-5 text-blue-600 ml-0.5" />
            </div>
          </div>
        )}

        {/* Badges top-left */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {course.is_bestseller && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-white">BESTSELLER</span>
          )}
          {course.is_featured && !course.is_bestseller && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500 text-white">FEATURED</span>
          )}
          {level && LEVEL_COLORS[level] && (
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${LEVEL_COLORS[level]}`}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </span>
          )}
        </div>

        {/* Price top-right */}
        <div className="absolute top-2 right-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-white/90 text-gray-800 shadow-sm">
            {formatPrice(course.price_cents)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 pl-5">
        {/* Category */}
        {course.category_name && (
          <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-500 mb-1">
            {course.category_name}
          </span>
        )}

        {/* Title */}
        <h4 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors mb-1">
          {course.title}
        </h4>

        {/* Subtitle */}
        {course.subtitle && (
          <p className="text-xs text-gray-500 line-clamp-1 mb-2">{course.subtitle}</p>
        )}

        {/* Rating */}
        <div className="mb-3">
          <StarRating rating={course.average_rating} count={course.review_count} />
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-500 mt-auto pt-3 border-t border-blue-100/60 bg-blue-50/20 -mx-4 -mb-0 px-4 pb-1 rounded-b-xl">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            {(course.enrolled_students_count || 0).toLocaleString()} students
          </span>
          {course.total_lessons && course.total_lessons > 0 && (
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              {course.total_lessons} lessons
            </span>
          )}
          {formatDuration(course.total_video_duration) && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-violet-400" />
              {formatDuration(course.total_video_duration)}
            </span>
          )}
          {course.certificate_available && (
            <span className="flex items-center gap-1 text-emerald-600">
              <BadgeCheck className="w-3.5 h-3.5" />
              Certificate
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────
   Profile field row
───────────────────────────────────────── */
function ProfileField({
  icon: Icon, label, value, href, iconBg = 'bg-blue-50', iconColor = 'text-blue-500',
}: {
  icon: React.ElementType; label: string; value: string;
  href?: string; iconBg?: string; iconColor?: string;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-blue-50 last:border-0">
      <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
        <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all leading-snug flex items-center gap-1">
            {value} <ExternalLink className="w-3 h-3 flex-shrink-0" />
          </a>
        ) : (
          <p className="text-sm text-gray-800 leading-snug break-words">{value}</p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Chip
───────────────────────────────────────── */
function Chip({ label, variant = 'blue' }: { label: string; variant?: 'blue' | 'violet' | 'emerald' }) {
  const cls = {
    blue:    'bg-blue-50   text-blue-700   border-blue-100',
    violet:  'bg-violet-50 text-violet-700 border-violet-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  }[variant];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${cls}`}>
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────
   Section card
───────────────────────────────────────── */
function SectionCard({ icon: Icon, title, children }: {
  icon: React.ElementType; title: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border-2 border-indigo-100 shadow-sm overflow-hidden h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-blue-50/40">
        <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-blue-600" />
        </div>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</h4>
      </div>
      <div className="px-4 py-1">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Expanded profile
───────────────────────────────────────── */
function ExpandedProfile({
  instructor, courses, loadingCourses,
}: {
  instructor: Instructor; courses: Course[]; loadingCourses: boolean;
}) {
  const displayName     = instructor.display_name || instructor.name || instructor.username;
  const skills          = toArray(instructor.skills);
  const learningGoals   = toArray(instructor.learning_goals);
  const preferredTopics = toArray(instructor.preferred_topics);

  const StatBlock = ({ icon: Icon, value, label }: { icon: React.ElementType; value: string | number; label: string }) => (
    <div className="flex flex-col items-center justify-center px-4 py-3 bg-white/15 rounded-xl text-white text-center min-w-[72px]">
      <Icon className="w-4 h-4 mb-1 opacity-80" />
      <span className="text-base font-bold leading-none">{value}</span>
      <span className="text-[10px] opacity-70 mt-0.5">{label}</span>
    </div>
  );

  return (
    <div className="border-t border-blue-100 overflow-hidden">

      {/* ── Banner ── */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 relative rounded-2xl overflow-hidden flex-shrink-0 ring-4 ring-white/25 shadow-xl">
            {(instructor.profile_image || instructor.image) ? (
              <Image src={instructor.profile_image || instructor.image!} alt={displayName} fill className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full bg-white/20 flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white leading-tight">{displayName}</h3>
            {instructor.headline && <p className="text-blue-100 text-sm mt-0.5">{instructor.headline}</p>}
            <div className="flex flex-wrap gap-2 mt-2">
              {instructor.location && (
                <span className="flex items-center gap-1 text-blue-200 text-xs">
                  <MapPin className="w-3 h-3" />{instructor.location}
                </span>
              )}
              {instructor.company && (
                <span className="flex items-center gap-1 text-blue-200 text-xs">
                  <Briefcase className="w-3 h-3" />{instructor.company}
                </span>
              )}
              {instructor.availability_status === 'available' && (
                <span className="flex items-center gap-1 text-emerald-300 text-xs bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Available
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <StatBlock icon={BookOpen} value={instructor.course_count} label="Courses" />
            <StatBlock icon={Users} value={instructor.total_students.toLocaleString()} label="Students" />
            {instructor.average_rating > 0 && (
              <StatBlock icon={Star} value={instructor.average_rating.toFixed(1)} label="Rating" />
            )}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="bg-slate-50/60 p-5 space-y-5">

        {/* ── ROW 1: Personal Info + Bio side by side (lg+), stacked (sm) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Personal Info */}
          <SectionCard icon={User} title="Personal Info">
            <ProfileField icon={User} label="Full Name" value={instructor.name || displayName}
              iconBg="bg-blue-50" iconColor="text-blue-500" />
            {instructor.email && (
              <ProfileField icon={Mail} label="Email" value={instructor.email}
                href={`mailto:${instructor.email}`} iconBg="bg-indigo-50" iconColor="text-indigo-500" />
            )}
            {instructor.headline && (
              <ProfileField icon={Briefcase} label="Professional Headline" value={instructor.headline}
                iconBg="bg-violet-50" iconColor="text-violet-500" />
            )}
            {instructor.location && (
              <ProfileField icon={MapPin} label="Location" value={instructor.location}
                iconBg="bg-rose-50" iconColor="text-rose-500" />
            )}
            {instructor.company && (
              <ProfileField icon={Building2} label="Company" value={instructor.company}
                iconBg="bg-amber-50" iconColor="text-amber-500" />
            )}
            {instructor.website && (
              <ProfileField icon={Globe} label="Website"
                value={instructor.website.replace(/^https?:\/\//, '')}
                href={instructor.website} iconBg="bg-emerald-50" iconColor="text-emerald-500" />
            )}
          </SectionCard>

          {/* Bio */}
          {instructor.bio ? (
            <SectionCard icon={AlignLeft} title="Bio">
              <div className="py-3">
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{instructor.bio}</p>
              </div>
            </SectionCard>
          ) : (
            /* If no bio, show social profiles here instead */
            (instructor.twitter_username || instructor.github_username || instructor.linkedin_url || instructor.youtube_channel) && (
              <SectionCard icon={Globe} title="Social Profiles">
                {instructor.twitter_username && (
                  <ProfileField icon={Twitter} label="Twitter" value={`@${instructor.twitter_username}`}
                    href={`https://twitter.com/${instructor.twitter_username}`} iconBg="bg-sky-50" iconColor="text-sky-500" />
                )}
                {instructor.github_username && (
                  <ProfileField icon={Github} label="GitHub" value={instructor.github_username}
                    href={`https://github.com/${instructor.github_username}`} iconBg="bg-gray-100" iconColor="text-gray-700" />
                )}
                {instructor.linkedin_url && (
                  <ProfileField icon={Linkedin} label="LinkedIn"
                    value={instructor.linkedin_url.replace(/^https?:\/\/(www\.)?/, '')}
                    href={instructor.linkedin_url} iconBg="bg-blue-50" iconColor="text-blue-600" />
                )}
                {instructor.youtube_channel && (
                  <ProfileField icon={Youtube} label="YouTube"
                    value={instructor.youtube_channel.replace(/^https?:\/\/(www\.)?/, '')}
                    href={instructor.youtube_channel.startsWith('http') ? instructor.youtube_channel : `https://youtube.com/${instructor.youtube_channel}`}
                    iconBg="bg-red-50" iconColor="text-red-500" />
                )}
              </SectionCard>
            )
          )}
        </div>

        {/* ── ROW 2: Social + Skills/Goals/Topics (3 cols on lg) ── */}
        {/* Only show social separately if we already showed bio above */}
        {instructor.bio && (instructor.twitter_username || instructor.github_username || instructor.linkedin_url || instructor.youtube_channel) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <SectionCard icon={Globe} title="Social Profiles">
              {instructor.twitter_username && (
                <ProfileField icon={Twitter} label="Twitter" value={`@${instructor.twitter_username}`}
                  href={`https://twitter.com/${instructor.twitter_username}`} iconBg="bg-sky-50" iconColor="text-sky-500" />
              )}
              {instructor.github_username && (
                <ProfileField icon={Github} label="GitHub" value={instructor.github_username}
                  href={`https://github.com/${instructor.github_username}`} iconBg="bg-gray-100" iconColor="text-gray-700" />
              )}
              {instructor.linkedin_url && (
                <ProfileField icon={Linkedin} label="LinkedIn"
                  value={instructor.linkedin_url.replace(/^https?:\/\/(www\.)?/, '')}
                  href={instructor.linkedin_url} iconBg="bg-blue-50" iconColor="text-blue-600" />
              )}
              {instructor.youtube_channel && (
                <ProfileField icon={Youtube} label="YouTube"
                  value={instructor.youtube_channel.replace(/^https?:\/\/(www\.)?/, '')}
                  href={instructor.youtube_channel.startsWith('http') ? instructor.youtube_channel : `https://youtube.com/${instructor.youtube_channel}`}
                  iconBg="bg-red-50" iconColor="text-red-500" />
              )}
            </SectionCard>

            {skills.length > 0 && (
              <SectionCard icon={Zap} title="Skills">
                <div className="flex flex-wrap gap-1.5 py-2">
                  {skills.map(s => <Chip key={s} label={s} variant="blue" />)}
                </div>
              </SectionCard>
            )}

            {(learningGoals.length > 0 || preferredTopics.length > 0) && (
              <div className="space-y-4">
                {learningGoals.length > 0 && (
                  <SectionCard icon={Target} title="Learning Goals">
                    <ul className="py-1 space-y-1.5">
                      {learningGoals.map(g => (
                        <li key={g} className="flex items-start gap-2 py-1 text-sm text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />{g}
                        </li>
                      ))}
                    </ul>
                  </SectionCard>
                )}
                {preferredTopics.length > 0 && (
                  <SectionCard icon={Heart} title="Preferred Topics">
                    <div className="flex flex-wrap gap-1.5 py-2">
                      {preferredTopics.map(t => <Chip key={t} label={t} variant="violet" />)}
                    </div>
                  </SectionCard>
                )}
              </div>
            )}
          </div>
        )}

        {/* Skills / Goals / Topics when no bio (simpler layout) */}
        {!instructor.bio && (skills.length > 0 || learningGoals.length > 0 || preferredTopics.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.length > 0 && (
              <SectionCard icon={Zap} title="Skills">
                <div className="flex flex-wrap gap-1.5 py-2">
                  {skills.map(s => <Chip key={s} label={s} variant="blue" />)}
                </div>
              </SectionCard>
            )}
            {learningGoals.length > 0 && (
              <SectionCard icon={Target} title="Learning Goals">
                <ul className="py-1 space-y-1.5">
                  {learningGoals.map(g => (
                    <li key={g} className="flex items-start gap-2 py-1 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />{g}
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )}
            {preferredTopics.length > 0 && (
              <SectionCard icon={Heart} title="Preferred Topics">
                <div className="flex flex-wrap gap-1.5 py-2">
                  {preferredTopics.map(t => <Chip key={t} label={t} variant="violet" />)}
                </div>
              </SectionCard>
            )}
          </div>
        )}

        {/* ── ROW 3: Published Courses ── */}
        <div className="bg-white/70 rounded-2xl border-2 border-indigo-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Published Courses</h4>
            {courses.length > 0 && (
              <span className="ml-auto text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
                {courses.length} course{courses.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {loadingCourses ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-400 bg-white rounded-2xl border border-gray-100">
              <Loader2 className="w-5 h-5 animate-spin text-blue-400" /> Loading courses…
            </div>
          ) : courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
              <BookOpen className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm font-medium text-gray-400">No published courses yet</p>
              <p className="text-xs text-gray-300 mt-1">Check back soon</p>
            </div>
          ) : (
            <>
              {/* 2-per-row grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {courses.map(c => <InstructorCourseCard key={c.id} course={c} />)}
              </div>
              <div className="mt-4 text-center">
                <Link
                  href={`/courses?instructor=${instructor.username}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  View all courses by {instructor.display_name || instructor.name} <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Instructor card
───────────────────────────────────────── */
function InstructorCard({ instructor }: { instructor: Instructor }) {
  const [expanded,       setExpanded]       = useState(false);
  const [courses,        setCourses]        = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [coursesLoaded,  setCoursesLoaded]  = useState(false);

  const displayName = instructor.display_name || instructor.name || instructor.username;

  const toggleExpand = async () => {
    if (!expanded && !coursesLoaded) {
      setLoadingCourses(true);
      const result = await getInstructorCoursesAction(instructor.id);
      setCourses((result.courses as Course[]) || []);
      setCoursesLoaded(true);
      setLoadingCourses(false);
    }
    setExpanded(p => !p);
  };

  return (
    <div className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden
      ${expanded
        ? 'border-blue-400 shadow-xl shadow-blue-100 bg-white'
        : 'border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 bg-white'}`}>
      <div className="p-5 flex items-start gap-5">
        <InstructorAvatar instructor={instructor} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 text-base leading-tight">{displayName}</h3>
              {instructor.headline && <p className="text-sm text-blue-600 font-medium mt-0.5">{instructor.headline}</p>}
            </div>
            {instructor.availability_status === 'available' && (
              <span className="flex-shrink-0 flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Available
              </span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-sm text-gray-600">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-gray-800">{instructor.course_count}</span>
              <span className="text-gray-400">{instructor.course_count === 1 ? 'Course' : 'Courses'}</span>
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-600">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-gray-800">{instructor.total_students.toLocaleString()}</span>
              <span className="text-gray-400">Students</span>
            </span>
            {instructor.average_rating > 0 && (
              <span className="flex items-center gap-1.5 text-sm text-gray-600">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-gray-800">{instructor.average_rating.toFixed(1)}</span>
                <span className="text-gray-400">Rating</span>
              </span>
            )}
          </div>
          {(instructor.location || instructor.company) && (
            <div className="mt-2 flex items-center gap-3">
              {instructor.location && <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin className="w-3 h-3" />{instructor.location}</span>}
              {instructor.company && <span className="flex items-center gap-1 text-xs text-gray-400"><Building2 className="w-3 h-3" />{instructor.company}</span>}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <button onClick={toggleExpand}
            className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200
              ${expanded ? 'bg-blue-600 text-white shadow-sm shadow-blue-200' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
            {expanded ? <><ChevronUp className="w-4 h-4" />Less</> : <><ChevronDown className="w-4 h-4" />View Profile</>}
          </button>
          <Link href={`/courses?instructor=${instructor.username}`}
            className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all">
            <BookOpen className="w-4 h-4" />Courses
          </Link>
        </div>
      </div>
      {expanded && <ExpandedProfile instructor={instructor} courses={courses} loadingCourses={loadingCourses} />}
    </div>
  );
}

/* ─────────────────────────────────────────
   Empty state
───────────────────────────────────────── */
function EmptyState({ search }: { search: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
        <Award className="w-8 h-8 text-blue-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-1">No instructors found</h3>
      <p className="text-sm text-gray-400 max-w-xs">
        {search ? `No instructors match "${search}". Try a different search term.` : 'No instructors are available yet.'}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main
───────────────────────────────────────── */
export default function InstructorsClient({ initialInstructors, initialTotal, initialSearch, initialSort }: Props) {
  const [instructors, setInstructors] = useState<Instructor[]>(initialInstructors);
  const [total,       setTotal]       = useState(initialTotal);
  const [search,      setSearch]      = useState(initialSearch);
  const [sort,        setSort]        = useState(initialSort);
  const [page,        setPage]        = useState(1);
  const [isPending,   startTransition] = useTransition();
  const LIMIT = 12;

  const fetchInstructors = useCallback((newSearch: string, newSort: string, newPage: number) => {
    startTransition(async () => {
      const result = await getInstructorsAction({
        search: newSearch || undefined,
        sortBy: newSort as any,
        limit: LIMIT,
        offset: (newPage - 1) * LIMIT,
      });
      setInstructors(result.instructors || []);
      setTotal(result.total || 0);
    });
  }, []);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); fetchInstructors(v, sort, 1); };
  const handleSort   = (v: string) => { setSort(v);   setPage(1); fetchInstructors(search, v, 1); };
  const handlePage   = (n: number) => { setPage(n); fetchInstructors(search, sort, n); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 py-16 px-4">
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-indigo-400/10 blur-xl" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-medium px-3 py-1.5 rounded-full mb-4 border border-white/20">
            <Award className="w-3.5 h-3.5" />Expert Instructors
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">Learn from the Best</h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">Industry leaders and skilled professionals guiding your learning journey.</p>
          <p className="mt-3 text-blue-200 text-sm font-medium">{total.toLocaleString()} expert{total !== 1 ? 's' : ''} ready to teach</p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search instructors by name or specialty…" value={search}
              onChange={e => handleSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" />
            {search && (
              <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="relative">
            <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select value={sort} onChange={e => handleSort(e.target.value)}
              className="pl-9 pr-8 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none cursor-pointer min-w-[160px]">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {isPending ? (
          <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
        ) : instructors.length === 0 ? (
          <EmptyState search={search} />
        ) : (
          <>
            <div className="mb-5">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-700">{instructors.length}</span> of{' '}
                <span className="font-medium text-gray-700">{total.toLocaleString()}</span> instructors
              </p>
            </div>
            <div className="space-y-4">
              {instructors.map(i => <InstructorCard key={i.id} instructor={i} />)}
            </div>
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button onClick={() => handlePage(page - 1)} disabled={page === 1}
                  className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                  ← Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let n: number;
                  if (totalPages <= 5) n = i + 1;
                  else if (page <= 3) n = i + 1;
                  else if (page >= totalPages - 2) n = totalPages - 4 + i;
                  else n = page - 2 + i;
                  return (
                    <button key={n} onClick={() => handlePage(n)}
                      className={`w-9 h-9 text-sm rounded-xl border transition-all font-medium
                        ${n === page ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {n}
                    </button>
                  );
                })}
                <button onClick={() => handlePage(page + 1)} disabled={page === totalPages}
                  className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
          <div>
            <h3 className="text-xl font-bold mb-1">Become an Instructor Today</h3>
            <p className="text-blue-100 text-sm">Share your knowledge and earn by teaching online.</p>
          </div>
          <Link href="/dashboard/request-upgrade"
            className="flex-shrink-0 bg-white text-blue-700 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
            Get Started →
          </Link>
        </div>
      </div>
    </div>
  );
}
