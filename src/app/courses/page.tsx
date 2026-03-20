
// // // /app/courses/page.tsx

// 'use client';

// import React, { useEffect, useState, useCallback } from 'react';
// import Link from 'next/link';
// import { getCoursesAction } from '@/lib/courses/actions';
// import { getCategoriesAction } from '@/lib/categories/actions';
// import { getTagsAction } from '@/lib/tags/actions';
// import { CategoryNavigation } from '@/components/categories/category-navigation';
// import { CourseFilters } from '@/components/courses/course-filters';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { 
//   Search, 
//   Filter, 
//   Loader2, 
//   Sparkles, 
//   TrendingUp, 
//   Users, 
//   Star, 
//   Zap,
//   Grid3X3,
//   List,
//   Play,
//   ArrowRight,
//   Rocket,
//   Brain,
//   Code,
//   Palette,
//   Heart,
//   Share2,
//   Eye,
//   Clock,
//   BookOpen
// } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import { Course } from '@/types/courses';
// import { Header } from '@/components/layout/header';
// import { Footer } from '@/components/layout/footer';
// import { CourseCard } from '@/components/courses/shared-course-card';

// interface CoursesPageProps {
//   searchParams: Promise<{
//     category?: string;
//     search?: string;
//     difficulty?: string;
//     content_type?: string;
//     price_range?: string;
//     min_rating?: string;
//     sort_by?: string;
//   }>;
// }

// // View Toggle Component
// function ViewToggle({ view, onViewChange }: { view: 'grid' | 'list'; onViewChange: (view: 'grid' | 'list') => void }) {
//   return (
//     <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
//       <Button
//         variant={view === 'grid' ? 'default' : 'ghost'}
//         size="sm"
//         onClick={() => onViewChange('grid')}
//         className={`flex items-center gap-2 cursor-pointer ${view === 'grid' ? 'bg-gray-900 text-white shadow-sm hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900'}`}
//       >
//         <Grid3X3 className="h-4 w-4" />
//         <span className="hidden sm:inline">Grid</span>
//       </Button>
//       <Button
//         variant={view === 'list' ? 'default' : 'ghost'}
//         size="sm"
//         onClick={() => onViewChange('list')}
//         className={`flex items-center gap-2 cursor-pointer ${view === 'list' ? 'bg-gray-900 text-white shadow-sm hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900'}`}
//       >
//         <List className="h-4 w-4" />
//         <span className="hidden sm:inline">List</span>
//       </Button>
//     </div>
//   );
// }

// // Animated Text Slider Component
// function TextSlider() {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const slides = [
//     {
//       icon: <Code className="h-12 w-12 text-blue-400" />,
//       title: "Master Modern Tech",
//       description: "Learn cutting-edge technologies from industry experts",
//       gradient: "from-blue-500 to-cyan-500"
//     },
//     {
//       icon: <Brain className="h-12 w-12 text-purple-400" />,
//       title: "Boost Your Career",
//       description: "Gain skills that companies are hiring for right now",
//       gradient: "from-purple-500 to-pink-500"
//     },
//     {
//       icon: <Rocket className="h-12 w-12 text-orange-400" />,
//       title: "Learn at Light Speed",
//       description: "Accelerate your learning with project-based courses",
//       gradient: "from-orange-500 to-red-500"
//     },
//     {
//       icon: <Palette className="h-12 w-12 text-green-400" />,
//       title: "Unlock Creativity",
//       description: "Transform your ideas into reality with practical skills",
//       gradient: "from-green-500 to-teal-500"
//     }
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [slides.length]);

//   return (
//     <div className="relative h-48 md:h-56 lg:h-64 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm p-8 border border-white/20">
//       <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
//       <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-xl"></div>
      
//       <div className="relative z-10 h-full flex items-center">
//         <div className="flex-1">
//           <div className="relative h-24 overflow-hidden">
//             {slides.map((slide, index) => (
//               <div
//                 key={index}
//                 className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
//                   index === currentSlide
//                     ? 'opacity-100 translate-x-0'
//                     : index < currentSlide
//                     ? 'opacity-0 -translate-x-full'
//                     : 'opacity-0 translate-x-full'
//                 }`}
//               >
//                 <div className="flex items-center space-x-6">
//                   <div className="flex-shrink-0">
//                     {slide.icon}
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
//                       {slide.title}
//                     </h3>
//                     <p className="text-blue-100 text-lg">
//                       {slide.description}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="absolute bottom-6 left-8 flex space-x-2 z-10">
//         {slides.map((_, index) => (
//           <button
//             key={index}
//             className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
//               index === currentSlide
//                 ? 'bg-white w-6'
//                 : 'bg-white/40'
//             }`}
//             onClick={() => setCurrentSlide(index)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// // Enhanced Stats Cards for Dark Background
// function StatsCards({ stats }: { stats: { courses: number; categories: number; featured: number; skills: number } }) {
//   return (
//     <div className="grid grid-cols-2 gap-4">
//       <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/40 transition-all group hover:scale-105">
//         <div className="flex items-center justify-between">
//           <div>
//             <div className="text-3xl font-bold text-white mb-1">{stats.courses}</div>
//             <div className="text-blue-200 text-sm">Courses</div>
//           </div>
//           <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
//             <TrendingUp className="h-6 w-6 text-blue-300" />
//           </div>
//         </div>
//       </div>

//       <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-400/40 transition-all group hover:scale-105">
//         <div className="flex items-center justify-between">
//           <div>
//             <div className="text-3xl font-bold text-white mb-1">{stats.categories}</div>
//             <div className="text-green-200 text-sm">Categories</div>
//           </div>
//           <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
//             <Users className="h-6 w-6 text-green-300" />
//           </div>
//         </div>
//       </div>

//       <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-yellow-400/40 transition-all group hover:scale-105">
//         <div className="flex items-center justify-between">
//           <div>
//             <div className="text-3xl font-bold text-white mb-1">{stats.featured}</div>
//             <div className="text-yellow-200 text-sm">Featured</div>
//           </div>
//           <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
//             <Star className="h-6 w-6 text-yellow-300" />
//           </div>
//         </div>
//       </div>

//       <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-purple-400/40 transition-all group hover:scale-105">
//         <div className="flex items-center justify-between">
//           <div>
//             <div className="text-3xl font-bold text-white mb-1">{stats.skills}</div>
//             <div className="text-purple-200 text-sm">Skills</div>
//           </div>
//           <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
//             <Zap className="h-6 w-6 text-purple-300" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Animated Gradient Background Component
// function AnimatedGradientBackground({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="relative w-full overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>
//         <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1500"></div>
        
//         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
//       </div>
      
//       <div className="relative z-10">
//         {children}
//       </div>
//     </div>
//   );
// }

// // Helper function to convert Course type to compatible type for CourseCard
// const convertToCourseData = (course: Course) => {
//   return {
//     id: course.id,
//     slug: course.slug,
//     title: course.title,
//     thumbnail_url: course.thumbnail_url || undefined,
//     short_description: course.short_description || undefined,
//     category_name: course.category_name || undefined,
//     instructor_name: course.instructor_name || undefined,
//     instructor_image: course.instructor_image || undefined,
//     price_cents: course.price_cents || 0,
//     average_rating: typeof course.average_rating === 'number' ? course.average_rating : 0,
//     review_count: course.review_count || 0,
//     like_count: course.like_count || undefined,
//     share_count: course.share_count || undefined,
//     total_views: course.total_views || undefined,
//     enrolled_students_count: course.enrolled_students_count || undefined,
//     total_video_duration: course.total_video_duration || undefined,
//     total_lessons: course.total_lessons || undefined,
//     is_featured: course.is_featured || false,
//     is_trending: course.is_trending || false
//   };
// };

// // Helper function to check active filters
// function hasActiveFilters(filters: any): boolean {
//   return Object.keys(filters).some(key => {
//     if (key === 'searchQuery') return filters[key] !== '';
//     if (key === 'min_rating') return filters[key] > 0;
//     if (key === 'tags') return filters[key].length > 0;
//     if (key === 'is_featured' || key === 'is_trending') return filters[key];
//     return filters[key] !== '';
//   });
// }

// // Helper function to count active filters
// function getActiveFilterCount(filters: any): number {
//   return Object.keys(filters).filter(key => {
//     if (key === 'searchQuery') return filters[key] !== '';
//     if (key === 'min_rating') return filters[key] > 0;
//     if (key === 'tags') return filters[key].length > 0;
//     if (key === 'is_featured' || key === 'is_trending') return filters[key];
//     return filters[key] !== '';
//   }).length;
// }

// // Interface for filter state - COMPATIBLE with SearchFilters
// interface FilterState {
//   searchQuery: string;
//   category_slug: string;
//   difficulty: string;
//   content_type: string;
//   price_range: string;
//   min_rating: number;
//   language: string;  // Added missing property
//   tags: string[];
//   is_featured: boolean;
//   is_trending: boolean;
//   sort_by: string;
// }

// // Default filters - COMPATIBLE with SearchFilters
// const defaultFilters: FilterState = {
//   searchQuery: '',
//   category_slug: '',
//   difficulty: '',
//   content_type: '',
//   price_range: '',
//   min_rating: 0,
//   language: '',  // Added missing property
//   tags: [],
//   is_featured: false,
//   is_trending: false,
//   sort_by: 'relevance'
// };

// // Enhanced formatRating function
// const formatRating = (rating: number | undefined | null, reviewCount: number | undefined | null) => {
//   const numericRating = typeof rating === 'number' ? rating : 0;
//   const numericReviewCount = typeof reviewCount === 'number' ? reviewCount : 0;
  
//   if (numericRating === 0) {
//     return {
//       display: "No ratings yet",
//       value: 0,
//       hasReviews: false,
//       showRating: true
//     };
//   }
  
//   if (numericRating > 0) {
//     return {
//       display: `${numericRating.toFixed(1)}`,
//       value: numericRating,
//       hasReviews: numericReviewCount > 0,
//       showRating: true
//     };
//   }
  
//   return {
//     display: "No ratings yet",
//     value: 0,
//     hasReviews: false,
//     showRating: true
//   };
// };

// // Enhanced filterCourses function with proper typing
// const filterCourses = (
//   courses: Course[],
//   filters: FilterState
// ): Course[] => {
//   let filtered = [...courses];
  
//   // Search by title, description, category, or instructor
//   if (filters.searchQuery) {
//     const query = filters.searchQuery.toLowerCase().trim();
//     filtered = filtered.filter(course => 
//       course.title.toLowerCase().includes(query) ||
//       (course.short_description || '').toLowerCase().includes(query) ||
//       (course.category_name || '').toLowerCase().includes(query) ||
//       (course.instructor_name || '').toLowerCase().includes(query)
//     );
//   }
  
//   // Filter by category
//   if (filters.category_slug) {
//     filtered = filtered.filter(course => 
//       course.category_slug === filters.category_slug
//     );
//   }
  
//   // Filter by minimum rating
//   if (filters.min_rating > 0) {
//     filtered = filtered.filter(course => 
//       (course.average_rating || 0) >= filters.min_rating
//     );
//   }
  
//   // Filter by difficulty if the field exists
//   if (filters.difficulty) {
//     filtered = filtered.filter(course => 
//       (course as any).difficulty === filters.difficulty
//     );
//   }
  
//   // Filter by content type if the field exists
//   if (filters.content_type) {
//     filtered = filtered.filter(course => 
//       (course as any).content_type === filters.content_type
//     );
//   }
  
//   // Filter by language if the field exists
//   if (filters.language) {
//     filtered = filtered.filter(course => 
//       (course as any).language === filters.language
//     );
//   }
  
//   // Filter by price range
//   if (filters.price_range) {
//     const priceRanges: Record<string, (price: number) => boolean> = {
//       'free': (price) => price === 0,
//       '0-100': (price) => price > 0 && price <= 10000, // 10000 cents = $100
//       '100-500': (price) => price > 10000 && price <= 50000, // 50000 cents = $500
//       '500+': (price) => price > 50000,
//     };
    
//     const priceCheck = priceRanges[filters.price_range];
//     if (priceCheck) {
//       filtered = filtered.filter(course => {
//         const priceInDollars = (course.price_cents || 0) / 100;
//         return priceCheck(priceInDollars);
//       });
//     }
//   }
  
//   // Filter by featured/trending
//   if (filters.is_featured) {
//     filtered = filtered.filter(course => course.is_featured);
//   }
  
//   if (filters.is_trending) {
//     filtered = filtered.filter(course => course.is_trending);
//   }
  
//   // Filter by tags
//   if (filters.tags.length > 0) {
//     filtered = filtered.filter(course => {
//       if (!course.tags) return false;
      
//       let courseTagValues: string[] = [];
      
//       if (Array.isArray(course.tags)) {
//         courseTagValues = course.tags.map((tag: any) => {
//           if (typeof tag === 'string') return tag.toLowerCase();
//           if (tag && typeof tag === 'object') {
//             return tag.name?.toLowerCase() || tag.slug?.toLowerCase() || '';
//           }
//           return '';
//         }).filter(Boolean);
//       }
      
//       return filters.tags.some(filterTag => 
//         courseTagValues.includes(filterTag.toLowerCase())
//       );
//     });
//   }
  
//   // Sort courses
//   if (filtered.length > 0) {
//     switch (filters.sort_by) {
//       case 'rating':
//         filtered.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
//         break;
//       case 'price_low':
//         filtered.sort((a, b) => (a.price_cents || 0) - (b.price_cents || 0));
//         break;
//       case 'price_high':
//         filtered.sort((a, b) => (b.price_cents || 0) - (a.price_cents || 0));
//         break;
//       case 'newest':
//         filtered.sort((a, b) => {
//           const dateA = new Date((a as any).created_at || 0).getTime();
//           const dateB = new Date((b as any).created_at || 0).getTime();
//           return dateB - dateA;
//         });
//         break;
//       case 'popular':
//         filtered.sort((a, b) => (b.enrolled_students_count || 0) - (a.enrolled_students_count || 0));
//         break;
//       default:
//         // Default relevance sorting (by featured, then rating)
//         filtered.sort((a, b) => {
//           if (a.is_featured && !b.is_featured) return -1;
//           if (!a.is_featured && b.is_featured) return 1;
//           return (b.average_rating || 0) - (a.average_rating || 0);
//         });
//         break;
//     }
//   }
  
//   return filtered;
// };

// // Main Component
// export default function CoursesPage({ searchParams }: CoursesPageProps) {
//   const resolvedSearchParams = React.use(searchParams);
  
//   const [initialCourses, setInitialCourses] = useState<Course[]>([]);
//   const [categories, setCategories] = useState<any[]>([]);
//   const [availableTags, setAvailableTags] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showFilters, setShowFilters] = useState(false);
//   const [view, setView] = useState<'grid' | 'list'>('grid');
  
//   // Local filter state - COMPATIBLE with SearchFilters
//   const [filters, setFilters] = useState<FilterState>(defaultFilters);
//   const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
//   const [pagination, setPagination] = useState({
//     total: 0,
//     limit: 12,
//     offset: 0,
//     hasMore: false
//   });

//   // Update filters function
//   const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
//     setFilters(prev => ({ ...prev, ...newFilters }));
//     // Reset pagination when filters change
//     setPagination(prev => ({ ...prev, offset: 0 }));
//   }, []);

//   // Reset filters function
//   const resetFilters = useCallback(() => {
//     setFilters(defaultFilters);
//     setSearchQuery('');
//     setPagination(prev => ({ ...prev, offset: 0 }));
//   }, []);



//   // Fetch initial data
//   useEffect(() => {
//   async function fetchInitialData() {
//     try {
//       setIsLoading(true);
      
//       console.log('🚀 Fetching initial data for homepage...');
      
//       const [coursesResult, categoriesResult, tagsResult] = await Promise.all([
//         getCoursesAction({
//           is_published: true,
//           category_slug: resolvedSearchParams.category,
//           limit: 100,
//           include_reviews: true
//         }),
//         getCategoriesAction(),
//         getTagsAction()
//       ]);

//       console.log('📦 Courses result:', {
//         success: coursesResult.success,
//         count: coursesResult.courses?.length,
//         firstCourse: coursesResult.courses?.[0]
//       });

//       const coursesData = coursesResult.courses || [];
      
//       // DEBUG: Log what we're getting
//       console.log('🔍 Raw course data check:');
//       coursesData.slice(0, 3).forEach((course, index) => {
//         console.log(`Course ${index + 1}:`, {
//           title: course.title,
//           enrolled_students_count: course.enrolled_students_count,
//           type: typeof course.enrolled_students_count,
//           allKeys: Object.keys(course).filter(k => k.includes('enroll') || k.includes('student'))
//         });
//       });

//       // Ensure all courses have valid rating data
//       const coursesWithValidRatings = coursesData.map((course: any) => {
//         const enhancedCourse = {
//           ...course,
//           average_rating: typeof course.average_rating === 'number' ? course.average_rating : 0,
//           review_count: course.review_count || 0,
//           // Force check enrollment count
//           enrolled_students_count: course.enrolled_students_count || 0
//         };
        
//         console.log(`📊 Course "${course.title}" enrollment:`, enhancedCourse.enrolled_students_count);
//         return enhancedCourse;
//       });

//       setInitialCourses(coursesWithValidRatings);
//       setCategories(categoriesResult.categories || []);
//       setAvailableTags(tagsResult.tags || []);
      
//       console.log('✅ Data loaded successfully');
      
//     } catch (error) {
//       console.error('❌ Error fetching initial data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   fetchInitialData();
// }, [resolvedSearchParams.category]);
// //   useEffect(() => {
// //     async function fetchInitialData() {
// //       try {
// //         setIsLoading(true);
        
// //         const [coursesResult, categoriesResult, tagsResult] = await Promise.all([
// //           getCoursesAction({
// //             is_published: true,
// //             category_slug: resolvedSearchParams.category,
// //             limit: 100,
// //             include_reviews: true
// //           }),
// //           getCategoriesAction(),
// //           getTagsAction()
// //         ]);

// //         const coursesData = coursesResult.courses || [];
        
// //         // Ensure all courses have valid rating data
// //         const coursesWithValidRatings = coursesData.map((course: any) => ({
// //           ...course,
// //           average_rating: typeof course.average_rating === 'number' ? course.average_rating : 0,
// //           review_count: course.review_count || 0
// //         }));

// //         setInitialCourses(coursesWithValidRatings);
// //         setCategories(categoriesResult.categories || []);
// //         setAvailableTags(tagsResult.tags || []);
        
// //       } catch (error) {
// //         console.error('Error fetching initial data:', error);
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     }

// //     fetchInitialData();
// //   }, [resolvedSearchParams.category]);



//   // Apply filters to courses whenever filters or initialCourses change
//   useEffect(() => {
//     if (initialCourses.length > 0) {
//       console.log('🔍 Applying filters:', filters);
      
//       try {
//         // Apply filters
//         const filtered = filterCourses(initialCourses, filters);
        
//         console.log('✅ Filtered courses count:', filtered.length);
        
//         // Apply pagination
//         const paginated = filtered.slice(
//           pagination.offset,
//           pagination.offset + pagination.limit
//         );
        
//         setFilteredCourses(paginated);
//         setPagination(prev => ({
//           ...prev,
//           total: filtered.length,
//           hasMore: filtered.length > prev.offset + prev.limit
//         }));
//       } catch (error) {
//         console.error('❌ Error filtering courses:', error);
//         // Fallback to showing all courses if filtering fails
//         const fallbackCourses = initialCourses.slice(
//           pagination.offset,
//           pagination.offset + pagination.limit
//         );
//         setFilteredCourses(fallbackCourses);
//         setPagination(prev => ({
//           ...prev,
//           total: initialCourses.length,
//           hasMore: initialCourses.length > prev.offset + prev.limit
//         }));
//       }
//     }
//   }, [filters, initialCourses, pagination.offset]);

//   // Initialize with URL params
//   useEffect(() => {
//     const urlFilters: Partial<FilterState> = {
//       searchQuery: resolvedSearchParams.search || '',
//       category_slug: resolvedSearchParams.category || '',
//       difficulty: resolvedSearchParams.difficulty || '',
//       content_type: resolvedSearchParams.content_type || '',
//       price_range: resolvedSearchParams.price_range || '',
//       min_rating: parseFloat(resolvedSearchParams.min_rating || '0'),
//       language: '', // Initialize language from URL if available
//       sort_by: resolvedSearchParams.sort_by || 'relevance'
//     };
    
//     if (Object.values(urlFilters).some(value => 
//       value !== '' && value !== 0 && value !== 'relevance'
//     )) {
//       updateFilters(urlFilters);
//       if (urlFilters.searchQuery) {
//         setSearchQuery(urlFilters.searchQuery);
//       }
//     }
//   }, [resolvedSearchParams, updateFilters]);

//   const handleSearchSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     updateFilters({ searchQuery: searchQuery });
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       updateFilters({ searchQuery: searchQuery });
//     }
//   };

//   const handleLoadMore = () => {
//     setPagination(prev => {
//       const newOffset = prev.offset + prev.limit;
//       return {
//         ...prev,
//         offset: newOffset,
//         hasMore: prev.total > newOffset
//       };
//     });
//   };

//   // Calculate stats from initial courses
//   const totalCourses = initialCourses.length;
//   const totalCategories = categories.length;
//   const totalTags = availableTags.length;
//   const featuredCourses = initialCourses.filter(course => course.is_featured).length;

//   const stats = {
//     courses: totalCourses,
//     categories: totalCategories,
//     featured: featuredCourses,
//     skills: totalTags
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Header />
//         <div className="container mx-auto px-4 py-8">
//           <div className="max-w-7xl mx-auto text-center py-20">
//             <div className="relative inline-block">
//               <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-blue-600" />
//               <Sparkles className="h-6 w-6 text-blue-400 absolute -top-1 -right-1 animate-pulse" />
//             </div>
//             <p className="text-gray-600 text-lg font-medium">Loading amazing courses...</p>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Header />
      
//       {/* Hero Section */}
//       <AnimatedGradientBackground>
//         <div className="w-full px-4 py-16">
//           <div className="w-full mx-auto">
//             <div className="mb-12">
//               <div className="text-center mb-8">
//                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
//                   Explore Courses
//                 </h1>
//                 <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
//                   Discover your next learning adventure in our comprehensive learning platform
//                 </p>
//               </div>

//               <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
//                 <div className="lg:col-span-1">
//                   <TextSlider />
//                 </div>

//                 <div className="lg:col-span-1">
//                   <StatsCards stats={stats} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </AnimatedGradientBackground>

//       {/* Search Bar */}
//       <div className="w-full bg-white border-b border-gray-200 py-8 px-4">
//         <div className="w-full max-w-7xl mx-auto">
//           <div className="text-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Perfect Course</h2>
//             <p className="text-gray-600">Search from thousands of courses with detailed ratings and reviews</p>
//           </div>
          
//           <form onSubmit={handleSearchSubmit} className="relative max-w-4xl mx-auto">
//             <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
//             <Input
//               type="text"
//               placeholder="Search courses by title, instructor, or technology... (Press Enter to search)"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               onKeyPress={handleKeyPress}
//               className="w-full pl-16 pr-6 py-6 text-lg bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 transition text-gray-900 placeholder-gray-500 shadow-lg hover:shadow-xl"
//             />
//             <Button 
//               type="submit"
//               className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-5 rounded-xl font-semibold"
//             >
//               Search
//             </Button>
//           </form>
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div className="w-full bg-gray-50 min-h-screen">
//         <div className="w-full px-4 py-8">
//           <div className="w-full mx-auto">
//             {/* Mobile Filter Toggle */}
//             <div className="lg:hidden mb-6">
//               <Button
//                 onClick={() => setShowFilters(!showFilters)}
//                 variant="outline"
//                 className="w-full cursor-pointer flex items-center justify-center gap-2 py-3 text-lg"
//               >
//                 <Filter size={20} />
//                 {showFilters ? 'Hide Filters' : 'Show Filters'}
//                 {hasActiveFilters(filters) && (
//                   <Badge variant="secondary" className="ml-2">
//                     {getActiveFilterCount(filters)}
//                   </Badge>
//                 )}
//               </Button>
//             </div>

//             {/* Full Width Grid Layout */}
//             <div className="w-full">
//               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//                 {/* Sidebar Filters */}
//                 <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:col-span-3 space-y-6`}>
//                   {/* Categories Card */}
//                   <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden border border-gray-200">
//                     <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
//                       <CardTitle className="flex items-center gap-2 text-gray-900">
//                         <Sparkles className="h-5 w-5 text-blue-600" />
//                         Categories
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="p-0">
//                       <div className="max-h-96 overflow-y-auto">
//                         <CategoryNavigation 
//                           showCourseCounts={true}
//                           className="p-4"
//                           currentCategory={filters.category_slug}
//                         />
//                       </div>
//                     </CardContent>
//                   </Card>

//                   {/* Advanced Filters */}
//                   <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden border border-gray-200">
//                     <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
//                       <CardTitle className="flex items-center gap-2 text-gray-900">
//                         <Filter className="h-5 w-5 text-purple-600" />
//                         Advanced Filters
//                       </CardTitle>
//                       <CardDescription>
//                         Filter by rating, social metrics, and more
//                       </CardDescription>
//                     </CardHeader>
//                     <CardContent className="p-4">
//                       {/* Cast filters to SearchFilters type to satisfy TypeScript */}
//                       <CourseFilters
//                         filters={filters as any} // Type assertion to bypass TypeScript check
//                         onFiltersChange={updateFilters}
//                         onReset={resetFilters}
//                         availableTags={availableTags}
//                       />
//                     </CardContent>
//                   </Card>

//                   {/* Social Metrics Info */}
//                   <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden border border-gray-200">
//                     <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
//                       <CardTitle className="flex items-center gap-2 text-gray-900">
//                         <Heart className="h-5 w-5 text-green-600" />
//                         Social Engagement
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="p-4">
//                       <div className="space-y-3">
//                         <div className="flex items-center justify-between text-sm">
//                           <div className="flex items-center gap-2">
//                             <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                             <span>Rating & Reviews</span>
//                           </div>
//                           <Badge variant="outline" className="text-xs">
//                             Real user feedback
//                           </Badge>
//                         </div>
//                         <div className="flex items-center justify-between text-sm">
//                           <div className="flex items-center gap-2">
//                             <Heart className="h-4 w-4 text-red-500 fill-red-500" />
//                             <span>Likes</span>
//                           </div>
//                           <span className="text-xs text-gray-500">Course popularity</span>
//                         </div>
//                         <div className="flex items-center justify-between text-sm">
//                           <div className="flex items-center gap-2">
//                             <Share2 className="h-4 w-4 text-blue-500" />
//                             <span>Shares</span>
//                           </div>
//                           <span className="text-xs text-gray-500">Social sharing</span>
//                         </div>
//                         <div className="flex items-center justify-between text-sm">
//                           <div className="flex items-center gap-2">
//                             <Eye className="h-4 w-4 text-purple-500" />
//                             <span>Views</span>
//                           </div>
//                           <span className="text-xs text-gray-500">Course visibility</span>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>

//                 {/* Main Courses Area */}
//                 <div className="lg:col-span-9">
//                   {/* Results Header */}
//                   <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
//                     <div className="flex-1">
//                       <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent mb-2">
//                         {filters.category_slug ? (
//                           <>
//                             <Sparkles className="h-6 w-6 text-blue-600 inline mr-2" />
//                             {categories.find(cat => cat.slug === filters.category_slug)?.name}
//                           </>
//                         ) : filters.searchQuery ? (
//                           <>Search: "{filters.searchQuery}"</>
//                         ) : (
//                           <>All Courses</>
//                         )}
//                       </h2>
//                       <p className="text-gray-600 flex items-center gap-2">
//                         <span className="font-semibold text-gray-900">{filteredCourses.length}</span>
//                         {filteredCourses.length === 1 ? ' course' : ' courses'} found
//                         {hasActiveFilters(filters) && (
//                           <span className="text-blue-600 ml-2">• Filtered</span>
//                         )}
//                       </p>
//                     </div>

//                     <div className="flex items-center gap-4">
//                       <ViewToggle view={view} onViewChange={setView} />
                      
//                       {hasActiveFilters(filters) && (
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={resetFilters}
//                           className="cursor-pointer rounded-lg border-gray-300 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
//                         >
//                           Clear All
//                         </Button>
//                       )}
//                     </div>
//                   </div>

//                   {/* Courses Grid/List */}
//                   {filteredCourses.length > 0 ? (
//                     <>
//                       {view === 'grid' ? (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//                           {filteredCourses.map((course) => {
//                             const enhancedCourse = {
//                               ...convertToCourseData(course),
//                               average_rating: typeof course.average_rating === 'number' ? course.average_rating : 0,
//                               review_count: course.review_count || 0
//                             };
                            
//                             return (
//                               <CourseCard 
//                                 key={course.id} 
//                                 course={enhancedCourse} 
//                                 variant="grid" 
//                               />
//                             );
//                           })}
//                         </div>
//                       ) : (
//                         <div className="space-y-4">
//                           {filteredCourses.map((course) => {
//                             const enhancedCourse = {
//                               ...convertToCourseData(course),
//                               average_rating: typeof course.average_rating === 'number' ? course.average_rating : 0,
//                               review_count: course.review_count || 0
//                             };
                            
//                             return (
//                               <CourseCard 
//                                 key={course.id} 
//                                 course={enhancedCourse} 
//                                 variant="list" 
//                               />
//                             );
//                           })}
//                         </div>
//                       )}

//                       {/* Load More Button */}
//                       {pagination.hasMore && (
//                         <div className="text-center mt-12">
//                           <Button
//                             onClick={handleLoadMore}
//                             className="cursor-pointer min-w-48 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border-0 px-8 py-3 font-semibold"
//                           >
//                             <Rocket className="h-4 w-4 mr-2" />
//                             Load More Courses
//                           </Button>
//                         </div>
//                       )}
//                     </>
//                   ) : (
//                     /* No Results */
//                     <div className="text-center py-16 rounded-2xl bg-gray-50 border border-gray-200">
//                       <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <Search className="h-10 w-10 text-gray-400" />
//                       </div>
//                       <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
//                       <p className="text-gray-600 max-w-md mx-auto mb-6">
//                         {filters.searchQuery || hasActiveFilters(filters)
//                           ? "Try adjusting your search criteria or browse all courses."
//                           : "No courses available at the moment. Check back soon!"}
//                       </p>
//                       {(filters.searchQuery || hasActiveFilters(filters)) && (
//                         <Button
//                           onClick={resetFilters}
//                           variant="outline"
//                           className="cursor-pointer rounded-lg"
//                         >
//                           Reset Filters
//                         </Button>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }


































// // /app/courses/page.tsx

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getCoursesAction } from '@/lib/courses/actions';
import { getCategoriesAction } from '@/lib/categories/actions';
import { getTagsAction } from '@/lib/tags/actions';
import { CategoryNavigation } from '@/components/categories/category-navigation';
import { CourseFilters } from '@/components/courses/course-filters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Loader2, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Star, 
  Zap,
  Grid3X3,
  List,
  Play,
  ArrowRight,
  Rocket,
  Brain,
  Code,
  Palette,
  Heart,
  Share2,
  Eye,
  Clock,
  BookOpen
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Course } from '@/types/courses';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CourseCard } from '@/components/courses/shared-course-card';

interface CoursesPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    difficulty?: string;
    content_type?: string;
    price_range?: string;
    min_rating?: string;
    sort_by?: string;
    instructor?: string;
  }>;
}

// View Toggle Component
function ViewToggle({ view, onViewChange }: { view: 'grid' | 'list'; onViewChange: (view: 'grid' | 'list') => void }) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
      <Button
        variant={view === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        className={`flex items-center gap-2 cursor-pointer ${view === 'grid' ? 'bg-gray-900 text-white shadow-sm hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900'}`}
      >
        <Grid3X3 className="h-4 w-4" />
        <span className="hidden sm:inline">Grid</span>
      </Button>
      <Button
        variant={view === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className={`flex items-center gap-2 cursor-pointer ${view === 'list' ? 'bg-gray-900 text-white shadow-sm hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900'}`}
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline">List</span>
      </Button>
    </div>
  );
}

// Animated Text Slider Component
function TextSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: <Code className="h-12 w-12 text-blue-400" />,
      title: "Master Modern Tech",
      description: "Learn cutting-edge technologies from industry experts",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Brain className="h-12 w-12 text-purple-400" />,
      title: "Boost Your Career",
      description: "Gain skills that companies are hiring for right now",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Rocket className="h-12 w-12 text-orange-400" />,
      title: "Learn at Light Speed",
      description: "Accelerate your learning with project-based courses",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Palette className="h-12 w-12 text-green-400" />,
      title: "Unlock Creativity",
      description: "Transform your ideas into reality with practical skills",
      gradient: "from-green-500 to-teal-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative h-48 md:h-56 lg:h-64 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm p-8 border border-white/20">
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-xl"></div>
      
      <div className="relative z-10 h-full flex items-center">
        <div className="flex-1">
          <div className="relative h-24 overflow-hidden">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentSlide
                    ? 'opacity-100 translate-x-0'
                    : index < currentSlide
                    ? 'opacity-0 -translate-x-full'
                    : 'opacity-0 translate-x-full'
                }`}
              >
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    {slide.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {slide.title}
                    </h3>
                    <p className="text-blue-100 text-lg">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-8 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
              index === currentSlide
                ? 'bg-white w-6'
                : 'bg-white/40'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

// Enhanced Stats Cards for Dark Background
function StatsCards({ stats }: { stats: { courses: number; categories: number; featured: number; skills: number } }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/40 transition-all group hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-white mb-1">{stats.courses}</div>
            <div className="text-blue-200 text-sm">Courses</div>
          </div>
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp className="h-6 w-6 text-blue-300" />
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-400/40 transition-all group hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-white mb-1">{stats.categories}</div>
            <div className="text-green-200 text-sm">Categories</div>
          </div>
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="h-6 w-6 text-green-300" />
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-yellow-400/40 transition-all group hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-white mb-1">{stats.featured}</div>
            <div className="text-yellow-200 text-sm">Featured</div>
          </div>
          <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Star className="h-6 w-6 text-yellow-300" />
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-purple-400/40 transition-all group hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-white mb-1">{stats.skills}</div>
            <div className="text-purple-200 text-sm">Skills</div>
          </div>
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Zap className="h-6 w-6 text-purple-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Animated Gradient Background Component
function AnimatedGradientBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full overflow-hidden bg-[#0d0d0d]">

      {/* Violet grid — identical to login/signup form panel */}
      <div
        className="absolute inset-0 opacity-[0.14] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139,92,246,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Dark purple gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/60 via-purple-950/40 to-[#0d0d0d]/80 pointer-events-none" />

      {/* Glow orbs — purple/violet tones */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-600/12 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-600/12 rounded-full blur-3xl animate-pulse delay-500 pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-violet-800/15 rounded-full blur-3xl animate-pulse delay-1500 pointer-events-none" />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}


// Helper function to convert Course type to compatible type for CourseCard
const convertToCourseData = (course: Course) => {
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    thumbnail_url: course.thumbnail_url || undefined,
    short_description: course.short_description || undefined,
    category_name: course.category_name || undefined,
    instructor_name: course.instructor_name || undefined,
    instructor_image: course.instructor_image || undefined,
    price_cents: course.price_cents || 0,
    average_rating: typeof course.average_rating === 'number' ? course.average_rating : 0,
    review_count: course.review_count || 0,
    like_count: course.like_count || undefined,
    share_count: course.share_count || undefined,
    total_views: course.total_views || undefined,
    enrolled_students_count: course.enrolled_students_count || undefined,
    total_video_duration: course.total_video_duration || undefined,
    total_lessons: course.total_lessons || undefined,
    is_featured: course.is_featured || false,
    is_trending: course.is_trending || false
  };
};

// Helper function to check active filters
function hasActiveFilters(filters: any): boolean {
  return Object.keys(filters).some(key => {
    if (key === 'searchQuery') return filters[key] !== '';
    if (key === 'min_rating') return filters[key] > 0;
    if (key === 'tags') return filters[key].length > 0;
    if (key === 'is_featured' || key === 'is_trending') return filters[key];
    if (key === 'instructor') return filters[key] !== '';
    return filters[key] !== '';
  });
}

// Helper function to count active filters
function getActiveFilterCount(filters: any): number {
  return Object.keys(filters).filter(key => {
    if (key === 'searchQuery') return filters[key] !== '';
    if (key === 'min_rating') return filters[key] > 0;
    if (key === 'tags') return filters[key].length > 0;
    if (key === 'is_featured' || key === 'is_trending') return filters[key];
    if (key === 'instructor') return filters[key] !== '';
    return filters[key] !== '';
  }).length;
}

// Interface for filter state
interface FilterState {
  searchQuery: string;
  category_slug: string;
  difficulty: string;
  content_type: string;
  price_range: string;
  min_rating: number;
  language: string;
  tags: string[];
  is_featured: boolean;
  is_trending: boolean;
  sort_by: string;
  instructor: string;
}

// Default filters
const defaultFilters: FilterState = {
  searchQuery: '',
  category_slug: '',
  difficulty: '',
  content_type: '',
  price_range: '',
  min_rating: 0,
  language: '',
  tags: [],
  is_featured: false,
  is_trending: false,
  sort_by: 'relevance',
  instructor: '',
};

// Enhanced formatRating function
const formatRating = (rating: number | undefined | null, reviewCount: number | undefined | null) => {
  const numericRating = typeof rating === 'number' ? rating : 0;
  const numericReviewCount = typeof reviewCount === 'number' ? reviewCount : 0;
  
  if (numericRating === 0) {
    return {
      display: "No ratings yet",
      value: 0,
      hasReviews: false,
      showRating: true
    };
  }
  
  if (numericRating > 0) {
    return {
      display: `${numericRating.toFixed(1)}`,
      value: numericRating,
      hasReviews: numericReviewCount > 0,
      showRating: true
    };
  }
  
  return {
    display: "No ratings yet",
    value: 0,
    hasReviews: false,
    showRating: true
  };
};

// Enhanced filterCourses function with proper typing
const filterCourses = (
  courses: Course[],
  filters: FilterState
): Course[] => {
  let filtered = [...courses];
  
  // Search by title, description, category, or instructor
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(course => 
      course.title.toLowerCase().includes(query) ||
      (course.short_description || '').toLowerCase().includes(query) ||
      (course.category_name || '').toLowerCase().includes(query) ||
      (course.instructor_name || '').toLowerCase().includes(query)
    );
  }
  
  // Filter by category
  if (filters.category_slug) {
    filtered = filtered.filter(course => 
      course.category_slug === filters.category_slug
    );
  }

  // Filter by instructor username (matches URL param ?instructor=username)
  if (filters.instructor) {
    filtered = filtered.filter(course =>
      (course as any).instructor_username === filters.instructor
    );
  }
  
  // Filter by minimum rating
  if (filters.min_rating > 0) {
    filtered = filtered.filter(course => 
      (course.average_rating || 0) >= filters.min_rating
    );
  }
  
  // Filter by difficulty if the field exists
  if (filters.difficulty) {
    filtered = filtered.filter(course => 
      (course as any).difficulty === filters.difficulty
    );
  }
  
  // Filter by content type if the field exists
  if (filters.content_type) {
    filtered = filtered.filter(course => 
      (course as any).content_type === filters.content_type
    );
  }
  
  // Filter by language if the field exists
  if (filters.language) {
    filtered = filtered.filter(course => 
      (course as any).language === filters.language
    );
  }
  
  // Filter by price range
  if (filters.price_range) {
    const priceRanges: Record<string, (price: number) => boolean> = {
      'free': (price) => price === 0,
      '0-100': (price) => price > 0 && price <= 10000,
      '100-500': (price) => price > 10000 && price <= 50000,
      '500+': (price) => price > 50000,
    };
    
    const priceCheck = priceRanges[filters.price_range];
    if (priceCheck) {
      filtered = filtered.filter(course => {
        const priceInDollars = (course.price_cents || 0) / 100;
        return priceCheck(priceInDollars);
      });
    }
  }
  
  // Filter by featured/trending
  if (filters.is_featured) {
    filtered = filtered.filter(course => course.is_featured);
  }
  
  if (filters.is_trending) {
    filtered = filtered.filter(course => course.is_trending);
  }
  
  // Filter by tags
  if (filters.tags.length > 0) {
    filtered = filtered.filter(course => {
      if (!course.tags) return false;
      
      let courseTagValues: string[] = [];
      
      if (Array.isArray(course.tags)) {
        courseTagValues = course.tags.map((tag: any) => {
          if (typeof tag === 'string') return tag.toLowerCase();
          if (tag && typeof tag === 'object') {
            return tag.name?.toLowerCase() || tag.slug?.toLowerCase() || '';
          }
          return '';
        }).filter(Boolean);
      }
      
      return filters.tags.some(filterTag => 
        courseTagValues.includes(filterTag.toLowerCase())
      );
    });
  }
  
  // Sort courses
  if (filtered.length > 0) {
    switch (filters.sort_by) {
      case 'rating':
        filtered.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
        break;
      case 'price_low':
        filtered.sort((a, b) => (a.price_cents || 0) - (b.price_cents || 0));
        break;
      case 'price_high':
        filtered.sort((a, b) => (b.price_cents || 0) - (a.price_cents || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => {
          const dateA = new Date((a as any).created_at || 0).getTime();
          const dateB = new Date((b as any).created_at || 0).getTime();
          return dateB - dateA;
        });
        break;
      case 'popular':
        filtered.sort((a, b) => (b.enrolled_students_count || 0) - (a.enrolled_students_count || 0));
        break;
      default:
        filtered.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return (b.average_rating || 0) - (a.average_rating || 0);
        });
        break;
    }
  }
  
  return filtered;
};

// Main Component
export default function CoursesPage({ searchParams }: CoursesPageProps) {
  const resolvedSearchParams = React.use(searchParams);
  
  const [initialCourses, setInitialCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [availableTags, setAvailableTags] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 12,
    offset: 0,
    hasMore: false
  });

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, offset: 0 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setSearchQuery('');
    setPagination(prev => ({ ...prev, offset: 0 }));
  }, []);

  // Fetch initial data — passes instructor_username to DB so only that instructor's courses are returned
  useEffect(() => {
    async function fetchInitialData() {
      try {
        setIsLoading(true);
        
        console.log('🚀 Fetching initial data for courses page...');
        
        const [coursesResult, categoriesResult, tagsResult] = await Promise.all([
          getCoursesAction({
            is_published: true,
            category_slug: resolvedSearchParams.category,
            instructor_username: resolvedSearchParams.instructor,
            limit: 100,
            include_reviews: true
          }),
          getCategoriesAction(),
          getTagsAction()
        ]);

        console.log('📦 Courses result:', {
          success: coursesResult.success,
          count: coursesResult.courses?.length,
          firstCourse: coursesResult.courses?.[0]
        });

        const coursesData = coursesResult.courses || [];

        const coursesWithValidRatings = coursesData.map((course: any) => ({
          ...course,
          average_rating: typeof course.average_rating === 'number' ? course.average_rating : 0,
          review_count: course.review_count || 0,
          enrolled_students_count: course.enrolled_students_count || 0
        }));

        setInitialCourses(coursesWithValidRatings);
        setCategories(categoriesResult.categories || []);
        setAvailableTags(tagsResult.tags || []);
        
        console.log('✅ Data loaded successfully');
        
      } catch (error) {
        console.error('❌ Error fetching initial data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInitialData();
  }, [resolvedSearchParams.category, resolvedSearchParams.instructor]);

  // Apply filters whenever filters or initialCourses change
  useEffect(() => {
    if (initialCourses.length > 0) {
      try {
        const filtered = filterCourses(initialCourses, filters);
        const paginated = filtered.slice(
          pagination.offset,
          pagination.offset + pagination.limit
        );
        
        setFilteredCourses(paginated);
        setPagination(prev => ({
          ...prev,
          total: filtered.length,
          hasMore: filtered.length > prev.offset + prev.limit
        }));
      } catch (error) {
        console.error('❌ Error filtering courses:', error);
        const fallbackCourses = initialCourses.slice(
          pagination.offset,
          pagination.offset + pagination.limit
        );
        setFilteredCourses(fallbackCourses);
        setPagination(prev => ({
          ...prev,
          total: initialCourses.length,
          hasMore: initialCourses.length > prev.offset + prev.limit
        }));
      }
    }
  }, [filters, initialCourses, pagination.offset]);

  // Sync filters from URL params every time the URL changes.
  // Always called unconditionally so navigating back to /courses (no params)
  // correctly resets all filters including instructor back to defaults.
  useEffect(() => {
    const urlFilters: FilterState = {
      searchQuery: resolvedSearchParams.search || '',
      category_slug: resolvedSearchParams.category || '',
      difficulty: resolvedSearchParams.difficulty || '',
      content_type: resolvedSearchParams.content_type || '',
      price_range: resolvedSearchParams.price_range || '',
      min_rating: parseFloat(resolvedSearchParams.min_rating || '0'),
      language: '',
      tags: [],
      is_featured: false,
      is_trending: false,
      sort_by: resolvedSearchParams.sort_by || 'relevance',
      instructor: resolvedSearchParams.instructor || '',
    };

    // Always sync — this resets instructor (and all filters) when URL has no params
    setFilters(urlFilters);
    setSearchQuery(urlFilters.searchQuery);
    setPagination(prev => ({ ...prev, offset: 0 }));
  }, [resolvedSearchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ searchQuery: searchQuery });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      updateFilters({ searchQuery: searchQuery });
    }
  };

  const handleLoadMore = () => {
    setPagination(prev => {
      const newOffset = prev.offset + prev.limit;
      return {
        ...prev,
        offset: newOffset,
        hasMore: prev.total > newOffset
      };
    });
  };

  const totalCourses = initialCourses.length;
  const totalCategories = categories.length;
  const totalTags = availableTags.length;
  const featuredCourses = initialCourses.filter(course => course.is_featured).length;

  const stats = {
    courses: totalCourses,
    categories: totalCategories,
    featured: featuredCourses,
    skills: totalTags
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto text-center py-20">
            <div className="relative inline-block">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-blue-600" />
              <Sparkles className="h-6 w-6 text-blue-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <p className="text-gray-600 text-lg font-medium">Loading amazing courses...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <AnimatedGradientBackground>
        <div className="w-full px-4 py-16">
          <div className="w-full mx-auto">
            <div className="mb-12">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  {filters.instructor ? 'Instructor Courses' : 'Explore Courses'}
                </h1>
                <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                  {filters.instructor
                    ? `Browse all published courses from this instructor`
                    : 'Discover your next learning adventure in our comprehensive learning platform'}
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                <div className="lg:col-span-1">
                  <TextSlider />
                </div>

                <div className="lg:col-span-1">
                  <StatsCards stats={stats} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedGradientBackground>

      {/* Search Bar */}
      <div className="w-full bg-white border-b border-gray-200 py-8 px-4">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Perfect Course</h2>
            <p className="text-gray-600">Search from thousands of courses with detailed ratings and reviews</p>
          </div>
          
          <form onSubmit={handleSearchSubmit} className="relative max-w-4xl mx-auto">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            <Input
              type="text"
              placeholder="Search courses by title, instructor, or technology... (Press Enter to search)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-16 pr-6 py-6 text-lg bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 transition text-gray-900 placeholder-gray-500 shadow-lg hover:shadow-xl"
            />
            <Button 
              type="submit"
              className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-5 rounded-xl font-semibold"
            >
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full bg-gray-50 min-h-screen">
        <div className="w-full px-4 py-8">
          <div className="w-full mx-auto">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="w-full cursor-pointer flex items-center justify-center gap-2 py-3 text-lg"
              >
                <Filter size={20} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
                {hasActiveFilters(filters) && (
                  <Badge variant="secondary" className="ml-2">
                    {getActiveFilterCount(filters)}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Full Width Grid Layout */}
            <div className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar Filters */}
                <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:col-span-3 space-y-6`}>
                  {/* Categories Card */}
                  <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden border border-gray-200">
                    <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                      <CardTitle className="flex items-center gap-2 text-gray-900">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                        Categories
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="max-h-96 overflow-y-auto">
                        <CategoryNavigation 
                          showCourseCounts={true}
                          className="p-4"
                          currentCategory={filters.category_slug}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Advanced Filters */}
                  <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden border border-gray-200">
                    <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                      <CardTitle className="flex items-center gap-2 text-gray-900">
                        <Filter className="h-5 w-5 text-purple-600" />
                        Advanced Filters
                      </CardTitle>
                      <CardDescription>
                        Filter by rating, social metrics, and more
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <CourseFilters
                        filters={filters as any}
                        onFiltersChange={updateFilters}
                        onReset={resetFilters}
                        availableTags={availableTags}
                      />
                    </CardContent>
                  </Card>

                  {/* Social Metrics Info */}
                  <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden border border-gray-200">
                    <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                      <CardTitle className="flex items-center gap-2 text-gray-900">
                        <Heart className="h-5 w-5 text-green-600" />
                        Social Engagement
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>Rating & Reviews</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Real user feedback
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                            <span>Likes</span>
                          </div>
                          <span className="text-xs text-gray-500">Course popularity</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Share2 className="h-4 w-4 text-blue-500" />
                            <span>Shares</span>
                          </div>
                          <span className="text-xs text-gray-500">Social sharing</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-purple-500" />
                            <span>Views</span>
                          </div>
                          <span className="text-xs text-gray-500">Course visibility</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Main Courses Area */}
                <div className="lg:col-span-9">
                  {/* Results Header */}
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent mb-2">
                        {filters.instructor ? (
                          <>
                            <BookOpen className="h-6 w-6 text-blue-600 inline mr-2" />
                            Courses by {
                              filteredCourses.length > 0
                                ? (filteredCourses[0] as any).instructor_name
                                : filters.instructor
                            }
                          </>
                        ) : filters.category_slug ? (
                          <>
                            <Sparkles className="h-6 w-6 text-blue-600 inline mr-2" />
                            {categories.find(cat => cat.slug === filters.category_slug)?.name}
                          </>
                        ) : filters.searchQuery ? (
                          <>Search: "{filters.searchQuery}"</>
                        ) : (
                          <>All Courses</>
                        )}
                      </h2>
                      <p className="text-gray-600 flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{filteredCourses.length}</span>
                        {filteredCourses.length === 1 ? ' course' : ' courses'} found
                        {hasActiveFilters(filters) && (
                          <span className="text-blue-600 ml-2">• Filtered</span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <ViewToggle view={view} onViewChange={setView} />
                      
                      {hasActiveFilters(filters) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={resetFilters}
                          className="cursor-pointer rounded-lg border-gray-300 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                        >
                          Clear All
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Courses Grid/List */}
                  {filteredCourses.length > 0 ? (
                    <>
                      {view === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                          {filteredCourses.map((course) => {
                            const enhancedCourse = {
                              ...convertToCourseData(course),
                              average_rating: typeof course.average_rating === 'number' ? course.average_rating : 0,
                              review_count: course.review_count || 0
                            };
                            
                            return (
                              <CourseCard 
                                key={course.id} 
                                course={enhancedCourse} 
                                variant="grid" 
                              />
                            );
                          })}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredCourses.map((course) => {
                            const enhancedCourse = {
                              ...convertToCourseData(course),
                              average_rating: typeof course.average_rating === 'number' ? course.average_rating : 0,
                              review_count: course.review_count || 0
                            };
                            
                            return (
                              <CourseCard 
                                key={course.id} 
                                course={enhancedCourse} 
                                variant="list" 
                              />
                            );
                          })}
                        </div>
                      )}

                      {/* Load More Button */}
                      {pagination.hasMore && (
                        <div className="text-center mt-12">
                          <Button
                            onClick={handleLoadMore}
                            className="cursor-pointer min-w-48 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border-0 px-8 py-3 font-semibold"
                          >
                            <Rocket className="h-4 w-4 mr-2" />
                            Load More Courses
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    /* No Results */
                    <div className="text-center py-16 rounded-2xl bg-gray-50 border border-gray-200">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
                      <p className="text-gray-600 max-w-md mx-auto mb-6">
                        {filters.instructor
                          ? `This instructor hasn't published any courses yet.`
                          : filters.searchQuery || hasActiveFilters(filters)
                          ? "Try adjusting your search criteria or browse all courses."
                          : "No courses available at the moment. Check back soon!"}
                      </p>
                      {(filters.searchQuery || hasActiveFilters(filters)) && (
                        <Button
                          onClick={resetFilters}
                          variant="outline"
                          className="cursor-pointer rounded-lg"
                        >
                          Reset Filters
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
