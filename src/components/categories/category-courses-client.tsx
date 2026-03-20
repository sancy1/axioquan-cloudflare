

// // /components/categories/category-courses-client.tsx

// 'use client';

// import React, { useEffect } from 'react';
// import Link from 'next/link';
// import { CourseFilters } from '@/components/courses/course-filters';
// import { useCourseSearch } from '@/hooks/use-course-search';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Loader2, ArrowLeft, Home, Filter, Search, Star, Users, BookOpen, TrendingUp } from 'lucide-react';
// import { Category } from '@/types/categories';
// import { CourseCard } from '@/components/courses/shared-course-card';

// interface CategoryCoursesClientProps {
//   category: Category;
//   initialCourses: any[];
//   availableTags: any[];
//   searchParams: {
//     search?: string;
//     difficulty?: string;
//     content_type?: string;
//     price_range?: string;
//     min_rating?: string;
//     sort_by?: string;
//   };
// }

// // Use the EXACT SAME formatRating function from the course listing page
// const formatRating = (rating: number | undefined | null, reviewCount: number | undefined | null) => {
//   const numericRating = typeof rating === 'number' ? rating : 0;
//   const numericReviewCount = typeof reviewCount === 'number' ? reviewCount : 0;
  
//   if (numericRating === 0) {
//     return {
//       display: "",
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
//     display: "",
//     value: 0,
//     hasReviews: false,
//     showRating: true
//   };
// };

// // Enhanced helper function to convert course data to CourseCard format - FIXED
// const convertToCourseData = (course: any) => {
//   // Debug the incoming data
//   console.log('Original course data:', {
//     id: course.id,
//     title: course.title,
//     average_rating: course.average_rating,
//     review_count: course.review_count,
//     type_of_rating: typeof course.average_rating,
//     type_of_review_count: typeof course.review_count
//   });

//   // Use the SAME logic as course listing page
//   let averageRating = 0;
//   let reviewCount = 0;
  
//   // Parse average_rating - same as course listing page
//   if (typeof course.average_rating === 'number') {
//     averageRating = course.average_rating;
//   } else if (course.average_rating !== null && course.average_rating !== undefined) {
//     const parsed = parseFloat(course.average_rating);
//     averageRating = isNaN(parsed) ? 0 : parsed;
//   }
  
//   // Parse review_count - same as course listing page
//   if (typeof course.review_count === 'number') {
//     reviewCount = course.review_count;
//   } else if (course.review_count !== null && course.review_count !== undefined) {
//     const parsed = parseInt(course.review_count);
//     reviewCount = isNaN(parsed) ? 0 : parsed;
//   }
  
//   // Test the formatRating with our parsed values
//   const ratingInfo = formatRating(averageRating, reviewCount);
//   console.log('Rating info for card:', {
//     id: course.id,
//     averageRating,
//     reviewCount,
//     display: ratingInfo.display,
//     value: ratingInfo.value,
//     hasReviews: ratingInfo.hasReviews
//   });

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
//     average_rating: averageRating, // Ensure it's a number
//     review_count: reviewCount, // Ensure it's a number
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

// // Custom Course Grid using EXACT SAME CourseCard from shared-course-card.tsx
// function CourseGrid({ courses, variant = 'grid' }: { courses: any[]; variant?: 'grid' | 'list' }) {
//   if (!courses || courses.length === 0) return null;

//   return (
//     <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//       {courses.map((course) => {
//         // Convert each course with proper data handling
//         const courseData = convertToCourseData(course);
        
//         return (
//           <CourseCard 
//             key={course.id} 
//             course={courseData} 
//             variant={variant}
//           />
//         );
//       })}
//     </div>
//   );
// }

// export function CategoryCoursesClient({ 
//   category, 
//   initialCourses, 
//   availableTags, 
//   searchParams 
// }: CategoryCoursesClientProps) {
//   const {
//     courses,
//     loading,
//     error,
//     filters,
//     pagination,
//     updateFilters,
//     resetFilters,
//     loadMore,
//     searchCourses
//   } = useCourseSearch(initialCourses);

//   // Initialize with URL params and category filter
//   useEffect(() => {
//     const urlFilters = {
//       searchQuery: searchParams.search || '',
//       category_slug: category.slug, // Always filter by this category
//       difficulty: searchParams.difficulty || '',
//       content_type: searchParams.content_type || '',
//       price_range: searchParams.price_range || '',
//       min_rating: parseFloat(searchParams.min_rating || '0'),
//       sort_by: searchParams.sort_by || 'relevance'
//     };
    
//     updateFilters(urlFilters);
//   }, [searchParams, category.slug]);

//   const handleSearch = (query: string) => {
//     updateFilters({ searchQuery: query });
//   };

//   const handleResetCategoryFilters = () => {
//     const filtersToReset = {
//       searchQuery: '',
//       difficulty: '',
//       content_type: '',
//       price_range: '',
//       min_rating: 0,
//       sort_by: 'relevance',
//       tags: [],
//       is_featured: false,
//       is_trending: false
//     };
    
//     updateFilters(filtersToReset);
//   };

//   // Calculate category stats
//   const featuredCourses = courses.filter(course => course.is_featured);
//   const trendingCourses = courses.filter(course => course.is_trending);
//   const freeCourses = courses.filter(course => course.price_cents === 0);

//   // Create empty state components
//   const EmptyState = () => {
//     if (filters.searchQuery || hasActiveFilters(filters)) {
//       return (
//         <div className="text-center py-12 sm:py-16">
//           <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Search className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
//           </div>
//           <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
//           <p className="text-gray-600 max-w-md mx-auto mb-6 text-sm sm:text-base">
//             No courses found in {category.name} matching your criteria. Try adjusting your filters or search terms.
//           </p>
//           <Button onClick={handleResetCategoryFilters} size="sm" className="sm:text-base">
//             Clear All Filters
//           </Button>
//         </div>
//       );
//     } else {
//       return (
//         <div className="text-center py-12 sm:py-16">
//           <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
//           </div>
//           <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No courses available yet</h3>
//           <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base">
//             We're working on adding amazing courses to {category.name}. Check back soon for new content!
//           </p>
//         </div>
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Hero Section */}
//       <section className="bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white py-12 sm:py-16">
//         <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
//           <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-8">
//             <div className="flex-1">
//               {/* Breadcrumb */}
//               <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-300 mb-4 sm:mb-6 flex-wrap">
//                 <Link href="/" className="hover:text-white flex items-center transition-colors">
//                   <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
//                   Home
//                 </Link>
//                 <span>/</span>
//                 <Link href="/courses" className="hover:text-white transition-colors">
//                   Courses
//                 </Link>
//                 <span>/</span>
//                 <Link href="/categories" className="hover:text-white transition-colors">
//                   Categories
//                 </Link>
//                 <span>/</span>
//                 <span className="text-white font-medium">{category.name}</span>
//               </nav>

//               {/* Category Header */}
//               <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
//                 {category.icon && (
//                   <span className="text-2xl sm:text-3xl lg:text-4xl bg-white/10 p-2 sm:p-3 rounded-xl sm:rounded-2xl flex-shrink-0">
//                     {category.icon}
//                   </span>
//                 )}
//                 <div className="flex-1 min-w-0">
//                   <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 break-words">
//                     {category.name}
//                   </h1>
//                   <div className="flex flex-wrap gap-2 sm:gap-4">
//                     <Badge 
//                       variant="secondary" 
//                       className="bg-white/20 text-white border-0 text-xs sm:text-sm"
//                     >
//                       {category.course_count} course{category.course_count !== 1 ? 's' : ''}
//                     </Badge>
//                     {category.is_featured && (
//                       <Badge className="bg-yellow-500 text-black border-0 text-xs sm:text-sm">
//                         <Star className="h-3 w-3 mr-1" />
//                         Featured
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Category Description */}
//               {category.description && (
//                 <p className="text-base sm:text-lg lg:text-xl text-gray-200 max-w-3xl leading-relaxed">
//                   {category.description}
//                 </p>
//               )}
//             </div>

//             {/* Quick Stats - Responsive Grid */}
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
//               <div className="bg-white/10 rounded-lg p-3 sm:p-4 text-center backdrop-blur-sm">
//                 <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{courses.length}</div>
//                 <div className="text-xs sm:text-sm text-gray-300">Showing</div>
//               </div>
//               <div className="bg-white/10 rounded-lg p-3 sm:p-4 text-center backdrop-blur-sm">
//                 <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{featuredCourses.length}</div>
//                 <div className="text-xs sm:text-sm text-gray-300">Featured</div>
//               </div>
//               <div className="bg-white/10 rounded-lg p-3 sm:p-4 text-center backdrop-blur-sm">
//                 <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{freeCourses.length}</div>
//                 <div className="text-xs sm:text-sm text-gray-300">Free</div>
//               </div>
//               <div className="bg-white/10 rounded-lg p-3 sm:p-4 text-center backdrop-blur-sm">
//                 <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{trendingCourses.length}</div>
//                 <div className="text-xs sm:text-sm text-gray-300">Trending</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Search Section */}
//       <section className="bg-white border-b border-gray-200 py-6 sm:py-8">
//         <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
//           {/* Full Width Search Input - Top Level */}
//           <div className="w-full mb-4 sm:mb-6">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <input
//                 type="text"
//                 placeholder={`Search ${category.name} courses...`}
//                 value={filters.searchQuery}
//                 onChange={(e) => updateFilters({ searchQuery: e.target.value })}
//                 onKeyPress={(e) => {
//                   if (e.key === 'Enter') {
//                     handleSearch(filters.searchQuery);
//                   }
//                 }}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
//               />
//             </div>
//             <p className="text-xs sm:text-sm text-gray-500 mt-2">
//               Press Enter to search
//             </p>
//           </div>
          
//           {/* Action Buttons */}
//           <div className="flex items-center justify-between">
//             <Link href="/courses">
//               <Button variant="outline" className="flex items-center space-x-2 whitespace-nowrap text-sm sm:text-base">
//                 <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
//                 <span>All Courses</span>
//               </Button>
//             </Link>
            
//             {hasActiveFilters(filters) && (
//               <Button
//                 variant="outline"
//                 onClick={handleResetCategoryFilters}
//                 className="whitespace-nowrap border-gray-300 text-sm sm:text-base"
//               >
//                 Clear Filters
//               </Button>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Main Content */}
//       <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-8 sm:py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
//           {/* Sidebar */}
//           <div className="lg:col-span-1 space-y-4 sm:space-y-6">
//             {/* Category Info Card */}
//             <Card className="bg-white border border-gray-200 sm:border-2 sm:border-gray-100 shadow-sm">
//               <CardHeader className="pb-3 sm:pb-4">
//                 <CardTitle className="flex items-center space-x-2 text-gray-900 text-base sm:text-lg">
//                   <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
//                   <span>Category Info</span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3 sm:space-y-4">
//                 <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//                   {category.icon && (
//                     <span 
//                       className="text-xl sm:text-2xl p-2 rounded-lg bg-white shadow-sm"
//                       style={{ color: category.color }}
//                     >
//                       {category.icon}
//                     </span>
//                   )}
//                   <div className="min-w-0">
//                     <div className="font-semibold text-gray-900 text-sm sm:text-base">{category.name}</div>
//                     <div className="text-xs sm:text-sm text-gray-600">
//                       {category.course_count} course{category.course_count !== 1 ? 's' : ''}
//                     </div>
//                   </div>
//                 </div>
                
//                 {category.description && (
//                   <p className="text-xs sm:text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
//                     {category.description}
//                   </p>
//                 )}
                
//                 {category.parent && (
//                   <div className="text-xs sm:text-sm p-3 bg-gray-50 rounded-lg">
//                     <span className="text-gray-500">Parent Category: </span>
//                     <Link 
//                       href={`/categories/${category.parent.slug}`}
//                       className="text-blue-600 hover:underline font-medium"
//                     >
//                       {category.parent.name}
//                     </Link>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Advanced Filters */}
//             <Card className="bg-white border border-gray-200 sm:border-2 sm:border-gray-100 shadow-sm lg:sticky lg:top-24">
//               <CardHeader className="pb-3 sm:pb-4">
//                 <CardTitle className="flex items-center space-x-2 text-gray-900 text-base sm:text-lg">
//                   <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
//                   <span>Filters</span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <CourseFilters
//                   filters={filters}
//                   onFiltersChange={updateFilters}
//                   onReset={handleResetCategoryFilters}
//                   availableTags={availableTags}
//                 />
//               </CardContent>
//             </Card>

//             {/* Quick Stats */}
//             <Card className="bg-white border border-gray-200 sm:border-2 sm:border-gray-100 shadow-sm">
//               <CardHeader className="pb-3 sm:pb-4">
//                 <CardTitle className="flex items-center space-x-2 text-gray-900 text-base sm:text-lg">
//                   <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
//                   <span>Category Stats</span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
//                 <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                   <span className="text-gray-600">Showing:</span>
//                   <span className="font-semibold text-gray-900">{courses.length} of {pagination.total}</span>
//                 </div>
//                 <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                   <span className="text-gray-600">Total Courses:</span>
//                   <span className="font-semibold text-gray-900">{category.course_count}</span>
//                 </div>
//                 <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                   <span className="text-gray-600">Featured:</span>
//                   <span className="font-semibold text-gray-900">{featuredCourses.length}</span>
//                 </div>
//                 <div className="flex justify-between items-center py-2">
//                   <span className="text-gray-600">Available Tags:</span>
//                   <span className="font-semibold text-gray-900">{availableTags.length}</span>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Courses Grid */}
//           <div className="lg:col-span-3">
//             {/* Results Header */}
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
//               <div className="flex-1 min-w-0">
//                 <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 break-words">
//                   {filters.searchQuery ? (
//                     <>
//                       Search Results for "<span className="text-blue-600 break-words">{filters.searchQuery}</span>" in {category.name}
//                     </>
//                   ) : (
//                     <>All Courses in {category.name}</>
//                   )}
//                 </h2>
//                 <p className="text-gray-600 text-sm sm:text-base">
//                   {loading ? (
//                     <span className="flex items-center">
//                       <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin mr-2" />
//                       Searching courses...
//                     </span>
//                   ) : (
//                     <>
//                       <span className="font-semibold text-gray-900">{pagination.total}</span> course{pagination.total !== 1 ? 's' : ''} found
//                       {hasActiveFilters(filters) && (
//                         <span className="text-blue-600"> (filtered)</span>
//                       )}
//                     </>
//                   )}
//                 </p>
//               </div>

//               {/* Active Filters Badge */}
//               {hasActiveFilters(filters) && (
//                 <div className="flex items-center space-x-2 self-start sm:self-auto">
//                   <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs sm:text-sm">
//                     <Filter className="h-3 w-3 mr-1" />
//                     Filters Active
//                   </Badge>
//                 </div>
//               )}
//             </div>

//             {/* Error State */}
//             {error && (
//               <Card className="mb-4 sm:mb-6 border-red-200 bg-red-50">
//                 <CardContent className="p-4 sm:p-6">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
//                       <span className="text-red-600 text-base sm:text-lg">⚠️</span>
//                     </div>
//                     <div className="min-w-0">
//                       <h3 className="font-semibold text-red-800 text-sm sm:text-base">Error Loading Courses</h3>
//                       <p className="text-red-700 text-xs sm:text-sm truncate">{error}</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Loading State */}
//             {loading && courses.length === 0 && (
//               <div className="text-center py-12 sm:py-16">
//                 <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-600" />
//                 </div>
//                 <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Searching Courses</h3>
//                 <p className="text-gray-600 text-sm sm:text-base">Finding the best courses in {category.name} for you...</p>
//               </div>
//             )}

//             {/* Courses Grid or Empty State */}
//             {courses.length > 0 ? (
//               <>
//                 <CourseGrid courses={courses} />
                
//                 {/* Load More Button */}
//                 {pagination.hasMore && (
//                   <div className="text-center mt-8 sm:mt-12">
//                     <Button
//                       onClick={loadMore}
//                       disabled={loading}
//                       variant="outline"
//                       className="min-w-32 px-6 sm:px-8 py-2 sm:py-3 border border-gray-300 sm:border-2 hover:border-gray-400 transition-colors text-sm sm:text-base"
//                     >
//                       {loading ? (
//                         <>
//                           <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin mr-2" />
//                           Loading...
//                         </>
//                       ) : (
//                         'Load More Courses'
//                       )}
//                     </Button>
//                     <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">
//                       Showing {courses.length} of {pagination.total} courses
//                     </p>
//                   </div>
//                 )}
//               </>
//             ) : (
//               !loading && <EmptyState />
//             )}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// // Helper function to check if any filters are active (excluding category)
// function hasActiveFilters(filters: any): boolean {
//   return Object.keys(filters).some(key => {
//     if (key === 'category_slug') return false;
//     if (key === 'searchQuery') return filters[key] !== '';
//     if (key === 'min_rating') return filters[key] > 0;
//     if (key === 'tags') return filters[key].length > 0;
//     if (key === 'is_featured' || key === 'is_trending') return filters[key];
//     return filters[key] !== '';
//   });
// }







































// // /components/categories/category-courses-client.tsx

// 'use client';

// import React, { useEffect, useState, useRef } from 'react';
// import Link from 'next/link';
// import { CourseFilters } from '@/components/courses/course-filters';
// import { useCourseSearch } from '@/hooks/use-course-search';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Loader2, ArrowLeft, Home, Filter, Search, Star, Users, BookOpen, TrendingUp, X } from 'lucide-react';
// import { Category } from '@/types/categories';
// import { CourseCard } from '@/components/courses/shared-course-card';

// interface CategoryCoursesClientProps {
//   category: Category;
//   initialCourses: any[];
//   availableTags: any[];
//   searchParams: {
//     search?: string;
//     difficulty?: string;
//     content_type?: string;
//     price_range?: string;
//     min_rating?: string;
//     sort_by?: string;
//   };
// }

// const formatRating = (rating: number | undefined | null, reviewCount: number | undefined | null) => {
//   const numericRating = typeof rating === 'number' ? rating : 0;
//   const numericReviewCount = typeof reviewCount === 'number' ? reviewCount : 0;
//   if (numericRating === 0) return { display: "", value: 0, hasReviews: false, showRating: true };
//   if (numericRating > 0) return { display: `${numericRating.toFixed(1)}`, value: numericRating, hasReviews: numericReviewCount > 0, showRating: true };
//   return { display: "", value: 0, hasReviews: false, showRating: true };
// };

// const convertToCourseData = (course: any) => {
//   let averageRating = 0;
//   let reviewCount = 0;

//   if (typeof course.average_rating === 'number') {
//     averageRating = course.average_rating;
//   } else if (course.average_rating !== null && course.average_rating !== undefined) {
//     const parsed = parseFloat(course.average_rating);
//     averageRating = isNaN(parsed) ? 0 : parsed;
//   }

//   if (typeof course.review_count === 'number') {
//     reviewCount = course.review_count;
//   } else if (course.review_count !== null && course.review_count !== undefined) {
//     const parsed = parseInt(course.review_count);
//     reviewCount = isNaN(parsed) ? 0 : parsed;
//   }

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
//     average_rating: averageRating,
//     review_count: reviewCount,
//     like_count: course.like_count || undefined,
//     share_count: course.share_count || undefined,
//     total_views: course.total_views || undefined,
//     enrolled_students_count: course.enrolled_students_count || undefined,
//     total_video_duration: course.total_video_duration || undefined,
//     total_lessons: course.total_lessons || undefined,
//     is_featured: course.is_featured || false,
//     is_trending: course.is_trending || false,
//   };
// };

// function CourseGrid({ courses, variant = 'grid' }: { courses: any[]; variant?: 'grid' | 'list' }) {
//   if (!courses || courses.length === 0) return null;
//   return (
//     <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//       {courses.map((course) => (
//         <CourseCard key={course.id} course={convertToCourseData(course)} variant={variant} />
//       ))}
//     </div>
//   );
// }

// export function CategoryCoursesClient({
//   category,
//   initialCourses,
//   availableTags,
//   searchParams,
// }: CategoryCoursesClientProps) {
//   const {
//     courses,
//     loading,
//     error,
//     filters,
//     pagination,
//     updateFilters,
//     resetFilters,
//     loadMore,
//     searchCourses,
//   } = useCourseSearch(initialCourses);

//   // ── LOCAL search input state (decoupled from filter state) ──
//   const [searchInput, setSearchInput] = useState(searchParams.search || '');
//   const debounceRef = useRef<NodeJS.Timeout | null>(null);
//   const isFirstMount = useRef(true);

//   // Initialize filters from URL params once on mount
//   useEffect(() => {
//     updateFilters({
//       searchQuery: searchParams.search || '',
//       category_slug: category.slug,
//       difficulty: searchParams.difficulty || '',
//       content_type: searchParams.content_type || '',
//       price_range: searchParams.price_range || '',
//       min_rating: parseFloat(searchParams.min_rating || '0'),
//       sort_by: searchParams.sort_by || 'relevance',
//     });
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Debounce: update filters 400ms after user stops typing
//   useEffect(() => {
//     if (isFirstMount.current) {
//       isFirstMount.current = false;
//       return;
//     }
//     if (debounceRef.current) clearTimeout(debounceRef.current);
//     debounceRef.current = setTimeout(() => {
//       updateFilters({ searchQuery: searchInput });
//     }, 400);
//     return () => {
//       if (debounceRef.current) clearTimeout(debounceRef.current);
//     };
//   }, [searchInput]);

//   const handleResetCategoryFilters = () => {
//     setSearchInput('');
//     updateFilters({
//       searchQuery: '',
//       difficulty: '',
//       content_type: '',
//       price_range: '',
//       min_rating: 0,
//       sort_by: 'relevance',
//       tags: [],
//       is_featured: false,
//       is_trending: false,
//     });
//   };

//   const featuredCourses = courses.filter((c) => c.is_featured);
//   const trendingCourses = courses.filter((c) => c.is_trending);
//   const freeCourses = courses.filter((c) => c.price_cents === 0);

//   const EmptyState = () => {
//     if (searchInput || hasActiveFilters(filters)) {
//       return (
//         <div className="text-center py-12 sm:py-16">
//           <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Search className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
//           </div>
//           <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
//           <p className="text-gray-600 max-w-md mx-auto mb-6 text-sm sm:text-base">
//             No courses found in {category.name} matching your criteria. Try adjusting your filters or search terms.
//           </p>
//           <Button onClick={handleResetCategoryFilters} size="sm">Clear All Filters</Button>
//         </div>
//       );
//     }
//     return (
//       <div className="text-center py-12 sm:py-16">
//         <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//           <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
//         </div>
//         <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No courses available yet</h3>
//         <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base">
//           We're working on adding amazing courses to {category.name}. Check back soon!
//         </p>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Hero */}
//       <section className="bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white py-12 sm:py-16">
//         <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
//           <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-8">
//             <div className="flex-1">
//               <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-300 mb-4 sm:mb-6 flex-wrap">
//                 <Link href="/" className="hover:text-white flex items-center transition-colors">
//                   <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />Home
//                 </Link>
//                 <span>/</span>
//                 <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
//                 <span>/</span>
//                 <Link href="/categories" className="hover:text-white transition-colors">Categories</Link>
//                 <span>/</span>
//                 <span className="text-white font-medium">{category.name}</span>
//               </nav>

//               <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
//                 {category.icon && (
//                   <span className="text-2xl sm:text-3xl lg:text-4xl bg-white/10 p-2 sm:p-3 rounded-xl sm:rounded-2xl flex-shrink-0">
//                     {category.icon}
//                   </span>
//                 )}
//                 <div className="flex-1 min-w-0">
//                   <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 break-words">
//                     {category.name}
//                   </h1>
//                   <div className="flex flex-wrap gap-2 sm:gap-4">
//                     <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs sm:text-sm">
//                       {category.course_count} course{category.course_count !== 1 ? 's' : ''}
//                     </Badge>
//                     {category.is_featured && (
//                       <Badge className="bg-yellow-500 text-black border-0 text-xs sm:text-sm">
//                         <Star className="h-3 w-3 mr-1" />Featured
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {category.description && (
//                 <p className="text-base sm:text-lg lg:text-xl text-gray-200 max-w-3xl leading-relaxed">
//                   {category.description}
//                 </p>
//               )}
//             </div>

//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
//               {[
//                 { value: courses.length, label: 'Showing' },
//                 { value: featuredCourses.length, label: 'Featured' },
//                 { value: freeCourses.length, label: 'Free' },
//                 { value: trendingCourses.length, label: 'Trending' },
//               ].map(({ value, label }) => (
//                 <div key={label} className="bg-white/10 rounded-lg p-3 sm:p-4 text-center backdrop-blur-sm">
//                   <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{value}</div>
//                   <div className="text-xs sm:text-sm text-gray-300">{label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Search bar — uses LOCAL state, NOT filters.searchQuery */}
//       <section className="bg-white border-b border-gray-200 py-6 sm:py-8">
//         <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
//           <div className="w-full mb-4 sm:mb-6">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
//               <input
//                 type="text"
//                 placeholder={`Search ${category.name} courses...`}
//                 value={searchInput}
//                 onChange={(e) => setSearchInput(e.target.value)}
//                 className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base cursor-text"
//               />
//               {searchInput && (
//                 <button
//                   onClick={() => setSearchInput('')}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                   aria-label="Clear search"
//                 >
//                   <X className="h-4 w-4" />
//                 </button>
//               )}
//             </div>
//             <p className="text-xs sm:text-sm text-gray-500 mt-2">
//               {loading && searchInput ? (
//                 <span className="flex items-center gap-1">
//                   <Loader2 className="h-3 w-3 animate-spin" />
//                   Searching…
//                 </span>
//               ) : (
//                 'Results update automatically as you type'
//               )}
//             </p>
//           </div>

//           <div className="flex items-center justify-between">
//             <Link href="/courses">
//               <Button variant="outline" className="flex items-center space-x-2 whitespace-nowrap text-sm sm:text-base">
//                 <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
//                 <span>All Courses</span>
//               </Button>
//             </Link>
//             {(searchInput || hasActiveFilters(filters)) && (
//               <Button
//                 variant="outline"
//                 onClick={handleResetCategoryFilters}
//                 className="whitespace-nowrap border-gray-300 text-sm sm:text-base"
//               >
//                 Clear Filters
//               </Button>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Main Content */}
//       <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-8 sm:py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
//           {/* Sidebar */}
//           <div className="lg:col-span-1 space-y-4 sm:space-y-6">
//             <Card className="bg-white border border-gray-200 shadow-sm">
//               <CardHeader className="pb-3 sm:pb-4">
//                 <CardTitle className="flex items-center space-x-2 text-gray-900 text-base sm:text-lg">
//                   <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
//                   <span>Category Info</span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3 sm:space-y-4">
//                 <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//                   {category.icon && (
//                     <span className="text-xl sm:text-2xl p-2 rounded-lg bg-white shadow-sm" style={{ color: category.color }}>
//                       {category.icon}
//                     </span>
//                   )}
//                   <div className="min-w-0">
//                     <div className="font-semibold text-gray-900 text-sm sm:text-base">{category.name}</div>
//                     <div className="text-xs sm:text-sm text-gray-600">{category.course_count} course{category.course_count !== 1 ? 's' : ''}</div>
//                   </div>
//                 </div>
//                 {category.description && (
//                   <p className="text-xs sm:text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">{category.description}</p>
//                 )}
//                 {category.parent && (
//                   <div className="text-xs sm:text-sm p-3 bg-gray-50 rounded-lg">
//                     <span className="text-gray-500">Parent Category: </span>
//                     <Link href={`/categories/${category.parent.slug}`} className="text-blue-600 hover:underline font-medium">
//                       {category.parent.name}
//                     </Link>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             <Card className="bg-white border border-gray-200 shadow-sm lg:sticky lg:top-24">
//               <CardHeader className="pb-3 sm:pb-4">
//                 <CardTitle className="flex items-center space-x-2 text-gray-900 text-base sm:text-lg">
//                   <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
//                   <span>Filters</span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <CourseFilters
//                   filters={filters}
//                   onFiltersChange={updateFilters}
//                   onReset={handleResetCategoryFilters}
//                   availableTags={availableTags}
//                 />
//               </CardContent>
//             </Card>

//             <Card className="bg-white border border-gray-200 shadow-sm">
//               <CardHeader className="pb-3 sm:pb-4">
//                 <CardTitle className="flex items-center space-x-2 text-gray-900 text-base sm:text-lg">
//                   <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
//                   <span>Category Stats</span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
//                 {[
//                   { label: 'Showing:', value: `${courses.length} of ${pagination.total}` },
//                   { label: 'Total Courses:', value: category.course_count },
//                   { label: 'Featured:', value: featuredCourses.length },
//                   { label: 'Available Tags:', value: availableTags.length },
//                 ].map(({ label, value }, i, arr) => (
//                   <div key={label} className={`flex justify-between items-center py-2 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
//                     <span className="text-gray-600">{label}</span>
//                     <span className="font-semibold text-gray-900">{value}</span>
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Courses */}
//           <div className="lg:col-span-3">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
//               <div className="flex-1 min-w-0">
//                 <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 break-words">
//                   {searchInput ? (
//                     <>Search Results for "<span className="text-blue-600">{searchInput}</span>" in {category.name}</>
//                   ) : (
//                     <>All Courses in {category.name}</>
//                   )}
//                 </h2>
//                 <p className="text-gray-600 text-sm sm:text-base">
//                   {loading ? (
//                     <span className="flex items-center">
//                       <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin mr-2" />
//                       Searching courses...
//                     </span>
//                   ) : (
//                     <>
//                       <span className="font-semibold text-gray-900">{pagination.total}</span> course{pagination.total !== 1 ? 's' : ''} found
//                       {hasActiveFilters(filters) && <span className="text-blue-600"> (filtered)</span>}
//                     </>
//                   )}
//                 </p>
//               </div>
//               {(searchInput || hasActiveFilters(filters)) && (
//                 <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs sm:text-sm self-start sm:self-auto">
//                   <Filter className="h-3 w-3 mr-1" />Filters Active
//                 </Badge>
//               )}
//             </div>

//             {error && (
//               <Card className="mb-4 sm:mb-6 border-red-200 bg-red-50">
//                 <CardContent className="p-4 sm:p-6">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
//                       <span className="text-red-600">⚠️</span>
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-red-800 text-sm">Error Loading Courses</h3>
//                       <p className="text-red-700 text-xs">{error}</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {loading && courses.length === 0 && (
//               <div className="text-center py-12 sm:py-16">
//                 <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Searching Courses</h3>
//                 <p className="text-gray-600 text-sm">Finding the best courses in {category.name} for you...</p>
//               </div>
//             )}

//             {courses.length > 0 ? (
//               <>
//                 <CourseGrid courses={courses} />
//                 {pagination.hasMore && (
//                   <div className="text-center mt-8 sm:mt-12">
//                     <Button
//                       onClick={loadMore}
//                       disabled={loading}
//                       variant="outline"
//                       className="min-w-32 px-6 sm:px-8 py-2 sm:py-3 border border-gray-300 hover:border-gray-400 transition-colors text-sm sm:text-base"
//                     >
//                       {loading ? (
//                         <><Loader2 className="h-3 w-3 animate-spin mr-2" />Loading...</>
//                       ) : (
//                         'Load More Courses'
//                       )}
//                     </Button>
//                     <p className="text-xs text-gray-500 mt-2">
//                       Showing {courses.length} of {pagination.total} courses
//                     </p>
//                   </div>
//                 )}
//               </>
//             ) : (
//               !loading && <EmptyState />
//             )}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// function hasActiveFilters(filters: any): boolean {
//   return Object.keys(filters).some((key) => {
//     if (key === 'category_slug') return false;
//     if (key === 'searchQuery') return filters[key] !== '';
//     if (key === 'min_rating') return filters[key] > 0;
//     if (key === 'tags') return filters[key].length > 0;
//     if (key === 'is_featured' || key === 'is_trending') return filters[key];
//     return filters[key] !== '';
//   });
// }























'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { CourseFilters } from '@/components/courses/course-filters';
import { useCourseSearch } from '@/hooks/use-course-search';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Loader2, ArrowLeft, Home, Filter, Search, Star, Users,
  BookOpen, TrendingUp, X, Clock, Heart, Play, ArrowRight,
  Sparkles, Flame, Gift,
} from 'lucide-react';
import { Category } from '@/types/categories';

interface CategoryCoursesClientProps {
  category: Category;
  initialCourses: any[];
  availableTags: any[];
  searchParams: {
    search?: string;
    difficulty?: string;
    content_type?: string;
    price_range?: string;
    min_rating?: string;
    sort_by?: string;
  };
}

// ── Formatters ────────────────────────────────────────────────────────────────
const formatNumber = (num: number | undefined): string => {
  if (num === undefined || num === null) return '0';
  return num.toLocaleString();
};

const formatRatingVal = (
  rating: number | undefined | null,
  reviewCount: number | undefined | null
): string | null => {
  const r = typeof rating === 'number' ? rating : parseFloat(String(rating ?? '0'));
  const rc = typeof reviewCount === 'number' ? reviewCount : parseInt(String(reviewCount ?? '0'));
  if (!r || r <= 0) return null;
  if (rc !== undefined && rc <= 0) return null;
  return r.toFixed(1);
};

const formatDuration = (minutes: number | undefined): string | null => {
  if (!minutes || minutes <= 0) return null;
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

// ── Course Card — matches homepage PremiumCourseCard exactly ──────────────────
function CategoryCourseCard({ course, index }: { course: any; index: number }) {
  const rating = formatRatingVal(course.average_rating, course.review_count);
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
      <div
        className="relative h-full rounded-3xl overflow-hidden bg-white transition-all duration-300"
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

        {/* Thumbnail */}
        <div className={`relative h-48 bg-gradient-to-br ${theme.thumb} overflow-hidden`}>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                                radial-gradient(circle at 80% 20%, white 1px, transparent 1px),
                                radial-gradient(circle at 60% 80%, white 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
            }}
          />

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

          {/* Bottom gradient */}
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
                <><Gift size={9} className="mr-1" />FREE</>
              ) : (
                `$${(course.price_cents / 100).toFixed(0)}`
              )}
            </span>
          </div>

          {/* Play on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300"
              style={{ background: 'rgba(255,255,255,0.95)' }}
            >
              <Play size={20} style={{ color: theme.accent, fill: theme.accent, marginLeft: 2 }} />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-3">

          {/* Category tag */}
          {course.category_name && (
            <span className={`inline-flex items-center gap-1 w-fit text-[10px] font-bold px-2.5 py-1 rounded-full border ${theme.tag}`}>
              <BookOpen size={9} />
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

          {/* Stats row — rating, students, duration */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-gray-800">{rating || '—'}</span>
              {course.review_count > 0 && (
                <span className="text-gray-400">({formatNumber(course.review_count)})</span>
              )}
            </div>
            {/* Students */}
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-gray-400" />
              <span>{formatNumber(course.enrolled_students_count)}</span>
            </div>
            {/* Duration or likes */}
            {duration ? (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-gray-400" />
                <span>{duration}</span>
              </div>
            ) : course.like_count > 0 ? (
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3 text-red-400" />
                <span>{formatNumber(course.like_count)}</span>
              </div>
            ) : null}
          </div>

          {/* CTA button */}
          <button
            className={`w-full mt-1 ${theme.btn} text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg cursor-pointer`}
          >
            Preview Course
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </Link>
  );
}

// ── Course Grid ───────────────────────────────────────────────────────────────
function CourseGrid({ courses }: { courses: any[] }) {
  if (!courses || courses.length === 0) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course, index) => (
        <CategoryCourseCard key={course.id} course={course} index={index} />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function CategoryCoursesClient({
  category,
  initialCourses,
  availableTags,
  searchParams,
}: CategoryCoursesClientProps) {
  const {
    courses,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    resetFilters,
    loadMore,
  } = useCourseSearch(initialCourses);

  const [searchInput, setSearchInput] = useState(searchParams.search || '');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstMount = useRef(true);

  useEffect(() => {
    updateFilters({
      searchQuery: searchParams.search || '',
      category_slug: category.slug,
      difficulty: searchParams.difficulty || '',
      content_type: searchParams.content_type || '',
      price_range: searchParams.price_range || '',
      min_rating: parseFloat(searchParams.min_rating || '0'),
      sort_by: searchParams.sort_by || 'relevance',
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFirstMount.current) { isFirstMount.current = false; return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateFilters({ searchQuery: searchInput });
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchInput]);

  const handleResetCategoryFilters = () => {
    setSearchInput('');
    updateFilters({
      searchQuery: '', difficulty: '', content_type: '',
      price_range: '', min_rating: 0, sort_by: 'relevance',
      tags: [], is_featured: false, is_trending: false,
    });
  };

  const featuredCourses  = courses.filter(c => c.is_featured);
  const trendingCourses  = courses.filter(c => c.is_trending);
  const freeCourses      = courses.filter(c => c.price_cents === 0);

  const EmptyState = () => {
    if (searchInput || hasActiveFilters(filters)) {
      return (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6 text-sm">
            No courses found in {category.name} matching your criteria.
          </p>
          <Button onClick={handleResetCategoryFilters} size="sm">Clear All Filters</Button>
        </div>
      );
    }
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
        <p className="text-gray-600 max-w-md mx-auto text-sm">
          We're working on adding amazing courses to {category.name}. Check back soon!
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero with checky dark purple background ── */}
      <section
        className="text-white py-12 sm:py-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0a0a14 0%, #0f0a1e 50%, #0a0a14 100%)' }}
      >
        {/* Checky grid */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
          <div
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px]"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-8">
            <div className="flex-1">
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 flex-wrap">
                <Link href="/" className="hover:text-white flex items-center transition-colors">
                  <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />Home
                </Link>
                <span>/</span>
                <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
                <span>/</span>
                <Link href="/categories" className="hover:text-white transition-colors">Categories</Link>
                <span>/</span>
                <span className="text-white font-medium">{category.name}</span>
              </nav>

              {/* Title row */}
              <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                {category.icon && (
                  <span className="text-2xl sm:text-3xl lg:text-4xl bg-white/10 p-2 sm:p-3 rounded-xl sm:rounded-2xl flex-shrink-0 border border-white/10">
                    {category.icon}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2">
                    {category.name}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{
                        background: 'rgba(139,92,246,0.15)',
                        border: '1px solid rgba(139,92,246,0.3)',
                        color: '#a78bfa',
                      }}
                    >
                      {category.course_count} course{category.course_count !== 1 ? 's' : ''}
                    </span>
                    {category.is_featured && (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-500/90 text-black">
                        <Star className="h-3 w-3 inline mr-1 fill-black" />Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {category.description && (
                <p className="text-base sm:text-lg text-white/60 max-w-3xl leading-relaxed">
                  {category.description}
                </p>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {[
                { value: courses.length,          label: 'Showing' },
                { value: featuredCourses.length,  label: 'Featured' },
                { value: freeCourses.length,       label: 'Free' },
                { value: trendingCourses.length,   label: 'Trending' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-xl p-3 sm:p-4 text-center"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div className="text-lg sm:text-2xl font-bold text-white">{value}</div>
                  <div className="text-xs text-white/40">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Search bar ── */}
      <section className="bg-white border-b border-gray-200 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="w-full mb-4 sm:mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              <input
                type="text"
                placeholder={`Search ${category.name} courses...`}
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm sm:text-base cursor-text"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              {loading && searchInput ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />Searching…
                </span>
              ) : 'Results update automatically as you type'}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <Link href="/courses">
              <Button variant="outline" className="flex items-center space-x-2 text-sm">
                <ArrowLeft className="h-4 w-4" /><span>All Courses</span>
              </Button>
            </Link>
            {(searchInput || hasActiveFilters(filters)) && (
              <Button variant="outline" onClick={handleResetCategoryFilters} className="text-sm border-gray-300">
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center space-x-2 text-gray-900 text-base">
                  <BookOpen className="h-4 w-4" /><span>Category Info</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {category.icon && (
                    <span className="text-xl p-2 rounded-lg bg-white shadow-sm" style={{ color: category.color }}>
                      {category.icon}
                    </span>
                  )}
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 text-sm">{category.name}</div>
                    <div className="text-xs text-gray-600">{category.course_count} course{category.course_count !== 1 ? 's' : ''}</div>
                  </div>
                </div>
                {category.description && (
                  <p className="text-xs text-gray-600 p-3 bg-gray-50 rounded-lg">{category.description}</p>
                )}
                {category.parent && (
                  <div className="text-xs p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500">Parent: </span>
                    <Link href={`/categories/${category.parent.slug}`} className="text-purple-600 hover:underline font-medium">
                      {category.parent.name}
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm lg:sticky lg:top-24">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-gray-900 text-base">
                  <Filter className="h-4 w-4" /><span>Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CourseFilters
                  filters={filters}
                  onFiltersChange={updateFilters}
                  onReset={handleResetCategoryFilters}
                  availableTags={availableTags}
                />
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-gray-900 text-base">
                  <TrendingUp className="h-4 w-4" /><span>Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {[
                  { label: 'Showing:',        value: `${courses.length} of ${pagination.total}` },
                  { label: 'Total Courses:',  value: category.course_count },
                  { label: 'Featured:',       value: featuredCourses.length },
                  { label: 'Tags:',           value: availableTags.length },
                ].map(({ label, value }, i, arr) => (
                  <div key={label} className={`flex justify-between py-2 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <span className="text-gray-600">{label}</span>
                    <span className="font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Courses */}
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  {searchInput
                    ? <>Results for "<span className="text-purple-600">{searchInput}</span>"</>
                    : <>All Courses in {category.name}</>
                  }
                </h2>
                <p className="text-gray-600 text-sm">
                  {loading ? (
                    <span className="flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />Searching...
                    </span>
                  ) : (
                    <>
                      <span className="font-semibold text-gray-900">{pagination.total}</span> course{pagination.total !== 1 ? 's' : ''} found
                      {hasActiveFilters(filters) && <span className="text-purple-600"> (filtered)</span>}
                    </>
                  )}
                </p>
              </div>
              {(searchInput || hasActiveFilters(filters)) && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs self-start">
                  <Filter className="h-3 w-3 mr-1" />Filters Active
                </Badge>
              )}
            </div>

            {error && (
              <Card className="mb-6 border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-red-600">⚠️</span>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {loading && courses.length === 0 && (
              <div className="text-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
                <p className="text-gray-600 text-sm">Finding courses in {category.name}...</p>
              </div>
            )}

            {courses.length > 0 ? (
              <>
                <CourseGrid courses={courses} />
                {pagination.hasMore && (
                  <div className="text-center mt-10">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="inline-flex items-center gap-3 font-bold px-10 py-4 rounded-full text-sm transition-all duration-300 hover:scale-105 cursor-pointer text-white"
                      style={{
                        background: loading ? 'rgba(0,0,0,0.04)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                        color: loading ? '#9ca3af' : '#ffffff',
                        boxShadow: loading ? 'none' : '0 8px 28px rgba(124,58,237,0.3)',
                      }}
                    >
                      {loading
                        ? <><Loader2 className="h-4 w-4 animate-spin" />Loading...</>
                        : <>Load More Courses</>
                      }
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      Showing {courses.length} of {pagination.total} courses
                    </p>
                  </div>
                )}
              </>
            ) : (
              !loading && <EmptyState />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function hasActiveFilters(filters: any): boolean {
  return Object.keys(filters).some(key => {
    if (key === 'category_slug') return false;
    if (key === 'searchQuery') return filters[key] !== '';
    if (key === 'min_rating') return filters[key] > 0;
    if (key === 'tags') return filters[key].length > 0;
    if (key === 'is_featured' || key === 'is_trending') return filters[key];
    return filters[key] !== '';
  });
}

























