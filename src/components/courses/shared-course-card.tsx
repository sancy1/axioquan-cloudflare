
// // /src/components/courses/shared-course-card.tsx

// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { 
//   Play, 
//   ArrowRight, 
//   Users, 
//   Star, 
//   Heart, 
//   Share2, 
//   Eye, 
//   Clock,
//   BookOpen 
// } from 'lucide-react';

// export interface CourseData {
//   id: string | number;
//   slug?: string;
//   title: string;
//   thumbnail_url?: string;
//   short_description?: string;
//   category_name?: string;
//   instructor_name?: string;
//   instructor_image?: string;
//   price_cents?: number;
//   average_rating?: number | null;
//   review_count?: number;
//   like_count?: number;
//   share_count?: number;
//   total_views?: number;
//   enrolled_students_count?: number;
//   total_video_duration?: number;
//   total_lessons?: number;
//   is_featured?: boolean;
//   is_trending?: boolean;
// }

// // Shared helper functions
// export const formatRating = (rating: number | undefined | null, reviewCount?: number): string | null => {
//   if (rating === null || rating === undefined || rating === 0) return null;
  
//   const numRating = typeof rating === 'string' ? parseFloat(rating) : Number(rating);
  
//   if (isNaN(numRating) || numRating <= 0) return null;
  
//   // If we have review count and it's 0 or negative, return null
//   if (reviewCount !== undefined && reviewCount <= 0) return null;
  
//   return numRating.toFixed(1);
// };

// export const formatNumber = (num: any): string => {
//   if (num === null || num === undefined || num === '' || num === 0) return '0';
  
//   const numValue = typeof num === 'string' ? parseInt(num) : Number(num);
  
//   return isNaN(numValue) ? '0' : numValue.toLocaleString();
// };

// export const formatDuration = (minutes: number | undefined): string | null => {
//   if (!minutes || minutes === 0) return null;
//   if (minutes < 60) return `${minutes}m`;
//   const hours = Math.floor(minutes / 60);
//   const mins = minutes % 60;
//   return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
// };

// interface CourseCardProps {
//   course: CourseData;
//   variant?: 'grid' | 'list';
// }

// // Grid Card Component
// export function CourseCard({ course, variant = 'grid' }: CourseCardProps) {
//   const rating = formatRating(course.average_rating, course.review_count);
//   const duration = formatDuration(course.total_video_duration);
//   const likeCount = course.like_count || 0;
//   const shareCount = course.share_count || 0;
//   const viewCount = course.total_views || 0;
  
//   if (variant === 'list') {
//     return <CourseListCard course={course} />;
//   }
  
//   return (
//     <Link href={`/courses/${course.slug || course.id}`}>
//       <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group cursor-pointer h-full border border-gray-100">
//         {/* Course Image with Play Button */}
//         <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
//           <img
//             src={course.thumbnail_url || "/placeholder-course.png"}
//             alt={course.title}
//             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//           />
//           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
//             <div className="bg-white rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform">
//               <Play size={32} className="text-blue-600 fill-blue-600" />
//             </div>
//           </div>
//           <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
//             course.is_featured 
//               ? 'bg-yellow-500 text-white' 
//               : course.is_trending 
//               ? 'bg-green-500 text-white'
//               : 'bg-blue-500 text-white'
//           }`}>
//             {course.is_featured ? 'FEATURED' : course.is_trending ? 'TRENDING' : 'NEW'}
//           </span>
//         </div>

//         {/* Course Info */}
//         <div className="p-5">
//           {/* Category Badge */}
//           {course.category_name && (
//             <div className="mb-2">
//               <Badge variant="outline" className="text-xs">
//                 {course.category_name}
//               </Badge>
//             </div>
//           )}
          
//           <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 leading-tight">
//             {course.title}
//           </h3>
          
//           {/* Short Description */}
//           {course.short_description && (
//             <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//               {course.short_description}
//             </p>
//           )}

//           {/* Instructor */}
//           <div className="flex items-center gap-2 mb-4">
//             {course.instructor_image && (
//               <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
//                 <img
//                   src={course.instructor_image}
//                   alt={course.instructor_name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             )}
//             <p className="text-sm text-gray-600 truncate">
//               {course.instructor_name || 'Expert Instructor'}
//             </p>
//           </div>

//           {/* Social Engagement Metrics */}
//           <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
//             <div className="flex items-center gap-3">
//               {/* Likes - Only show if > 0 */}
//               {likeCount > 0 && (
//                 <div className="flex items-center gap-1 text-red-500">
//                   <Heart size={14} className="fill-red-500" />
//                   <span className="text-xs font-semibold">{formatNumber(likeCount)}</span>
//                 </div>
//               )}
              
//               {/* Shares - Only show if > 0 */}
//               {shareCount > 0 && (
//                 <div className="flex items-center gap-1 text-blue-500">
//                   <Share2 size={14} />
//                   <span className="text-xs font-semibold">{formatNumber(shareCount)}</span>
//                 </div>
//               )}
              
//               {/* Views - Only show if > 0 */}
//               {viewCount > 0 && (
//                 <div className="flex items-center gap-1 text-purple-500">
//                   <Eye size={14} />
//                   <span className="text-xs font-semibold">{formatNumber(viewCount)}</span>
//                 </div>
//               )}
//             </div>
            
//             {/* Rating and Reviews - Only show if rating exists */}
//             {rating ? (
//               <div className="flex items-center gap-1">
//                 <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
//                 <span className="text-xs font-semibold text-gray-900">{rating}</span>
//                 {(course.review_count || 0) > 0 && (
//                   <span className="text-xs text-gray-500">({formatNumber(course.review_count)})</span>
//                 )}
//               </div>
//             ) : null}
//           </div>

//           {/* Course Stats */}
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-4 text-sm text-gray-500">
//               {/* Rating - Only show if rating exists */}
//               {rating ? (
//                 <div className="flex items-center gap-1">
//                   <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                   <span className="font-semibold text-gray-900">{rating}</span>
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-1 text-gray-400">
//                   <Star className="h-4 w-4" />
//                   <span className="text-xs">No ratings</span>
//                 </div>
//               )}
              
//               {/* Students */}
//               <div className="flex items-center gap-1">
//                 <Users className="h-4 w-4" />
//                 <span>{formatNumber(course.enrolled_students_count)}</span>
//               </div>
              
//               {/* Duration - Only show if exists */}
//               {duration && (
//                 <div className="flex items-center gap-1">
//                   <Clock className="h-4 w-4 text-gray-500" />
//                   <span>{duration}</span>
//                 </div>
//               )}
//             </div>
            
//             {/* Price */}
//             <span className="text-blue-600 font-bold text-lg">
//               {course.price_cents === 0 ? 'FREE' : `$${((course.price_cents || 0) / 100).toFixed(2)}`}
//             </span>
//           </div>

//           {/* Additional Stats - Lessons */}
//           {course.total_lessons && (
//             <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
//               <BookOpen className="h-4 w-4" />
//               <span>{course.total_lessons} lessons</span>
//             </div>
//           )}

//           {/* View Course Button */}
//           <Button className="w-full group/btn bg-gray-900 hover:bg-gray-800 text-white" asChild>
//             <div>
//               View Course
//               <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
//             </div>
//           </Button>
//         </div>
//       </div>
//     </Link>
//   );
// }

// // List Card Component
// function CourseListCard({ course }: { course: CourseData }) {
//   const rating = formatRating(course.average_rating, course.review_count);
//   const reviewCount = course.review_count || 0;
//   const likeCount = course.like_count || 0;
//   const shareCount = course.share_count || 0;
//   const viewCount = course.total_views || 0;
//   const duration = formatDuration(course.total_video_duration);
  
//   const formatPrice = (priceCents: number) => {
//     if (priceCents === 0) return 'FREE';
//     return `$${((priceCents || 0) / 100).toFixed(2)}`;
//   };
  
//   return (
//     <Link href={`/courses/${course.slug || course.id}`}>
//       <div className="flex flex-col lg:flex-row gap-6 p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group cursor-pointer">
//         {/* Course Thumbnail */}
//         <div className="relative w-full lg:w-64 h-48 rounded-lg overflow-hidden flex-shrink-0">
//           <img
//             src={course.thumbnail_url || "/placeholder-course.png"}
//             alt={course.title}
//             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//           />
//           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
//             <div className="bg-white rounded-full p-2 transform scale-0 group-hover:scale-100 transition-transform">
//               <Play size={20} className="text-blue-600 fill-blue-600" />
//             </div>
//           </div>
//         </div>

//         {/* Course Info */}
//         <div className="flex-1 min-w-0">
//           <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-3 gap-4">
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2 mb-2 flex-wrap">
//                 {course.category_name && (
//                   <Badge variant="outline" className="text-xs">
//                     {course.category_name}
//                   </Badge>
//                 )}
//                 {course.is_featured && (
//                   <Badge className="bg-yellow-500 text-white border-0 text-xs">
//                     FEATURED
//                   </Badge>
//                 )}
//                 {course.is_trending && (
//                   <Badge className="bg-green-500 text-white border-0 text-xs">
//                     TRENDING
//                   </Badge>
//                 )}
//               </div>
//               <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
//                 {course.title}
//               </h3>
//               {course.short_description && (
//                 <p className="text-gray-600 text-sm mb-3 line-clamp-2">
//                   {course.short_description}
//                 </p>
//               )}
              
//               {/* Social Engagement Metrics - Row 1 */}
//               <div className="flex items-center gap-4 mb-3 flex-wrap">
//                 {/* Rating and Reviews - Only show if rating exists */}
//                 {rating ? (
//                   <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
//                     <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
//                     <span className="text-xs font-semibold text-gray-900">{rating}</span>
//                     {reviewCount > 0 && (
//                       <span className="text-xs text-gray-600">({formatNumber(reviewCount)})</span>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-1 text-gray-400 px-2 py-1 rounded-md bg-gray-50">
//                     <Star className="h-3 w-3" />
//                     <span className="text-xs">No ratings</span>
//                   </div>
//                 )}
                
//                 {/* Students */}
//                 {course.enrolled_students_count && (
//                   <div className="flex items-center gap-1 text-gray-600">
//                     <Users size={14} />
//                     <span className="text-xs">{formatNumber(course.enrolled_students_count)} students</span>
//                   </div>
//                 )}
                
//                 {/* Duration - Only show if exists */}
//                 {duration && (
//                   <div className="flex items-center gap-1 text-gray-600">
//                     <Clock size={14} className="text-gray-500" />
//                     <span className="text-xs">{duration}</span>
//                   </div>
//                 )}
                
//                 {/* Lessons */}
//                 {course.total_lessons && (
//                   <div className="flex items-center gap-1 text-gray-600">
//                     <BookOpen size={14} className="text-gray-500" />
//                     <span className="text-xs">{course.total_lessons} lessons</span>
//                   </div>
//                 )}
//               </div>
              
//               {/* Social Engagement Metrics - Row 2 */}
//               <div className="flex items-center gap-4 flex-wrap">
//                 {/* Likes - Only show if > 0 */}
//                 {likeCount > 0 && (
//                   <div className="flex items-center gap-1 text-red-500">
//                     <Heart size={12} className="fill-red-500" />
//                     <span className="text-xs">{formatNumber(likeCount)} likes</span>
//                   </div>
//                 )}
                
//                 {/* Shares - Only show if > 0 */}
//                 {shareCount > 0 && (
//                   <div className="flex items-center gap-1 text-blue-500">
//                     <Share2 size={12} />
//                     <span className="text-xs">{formatNumber(shareCount)} shares</span>
//                   </div>
//                 )}
                
//                 {/* Views - Only show if > 0 */}
//                 {viewCount > 0 && (
//                   <div className="flex items-center gap-1 text-purple-500">
//                     <Eye size={12} />
//                     <span className="text-xs">{formatNumber(viewCount)} views</span>
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             {/* Price and Instructor */}
//             <div className="flex-shrink-0 lg:text-right">
//               <div className="text-blue-600 font-bold text-lg mb-2">
//                 {formatPrice(course.price_cents || 0)}
//               </div>
//               <div className="text-sm text-gray-600">
//                 {course.instructor_name || 'Expert Instructor'}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }































// // /src/components/courses/shared-course-card.tsx - FIXED VERSION

// 'use client';

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { 
//   Play, 
//   ArrowRight, 
//   Users, 
//   Star, 
//   Heart, 
//   Share2, 
//   Eye, 
//   Clock,
//   BookOpen 
// } from 'lucide-react';

// export interface CourseData {
//   id: string | number;
//   slug?: string;
//   title: string;
//   thumbnail_url?: string;
//   short_description?: string;
//   category_name?: string;
//   instructor_name?: string;
//   instructor_image?: string;
//   price_cents?: number;
//   average_rating?: number | null;
//   review_count?: number;
//   like_count?: number;
//   share_count?: number;
//   total_views?: number;
//   enrolled_students_count?: number;
//   total_video_duration?: number;
//   total_lessons?: number;
//   is_featured?: boolean;
//   is_trending?: boolean;
// }

// // FIXED: Better formatRating that handles 0 ratings properly
// export const formatRating = (rating: number | undefined | null, reviewCount?: number): string | null => {
//   // If rating is null/undefined, return null
//   if (rating === null || rating === undefined) return null;
  
//   // Convert to number
//   const numRating = typeof rating === 'string' ? parseFloat(rating) : Number(rating);
  
//   // If it's NaN or negative, return null
//   if (isNaN(numRating) || numRating < 0) return null;
  
//   // If rating is 0, we should still show something (not null)
//   // But only if we want to show "0.0" - or we could return null for 0
//   if (numRating === 0) return null; // Return null for 0 ratings to show "No ratings"
  
//   // If we have review count and it's 0 or negative, still show the rating if it exists
//   // Remove this check: if (reviewCount !== undefined && reviewCount <= 0) return null;
  
//   return numRating.toFixed(1);
// };

// export const formatNumber = (num: any): string => {
//   if (num === null || num === undefined || num === '' || num === 0) return '0';
  
//   const numValue = typeof num === 'string' ? parseInt(num) : Number(num);
  
//   return isNaN(numValue) ? '0' : numValue.toLocaleString();
// };

// export const formatDuration = (minutes: number | undefined): string | null => {
//   if (!minutes || minutes === 0) return null;
//   if (minutes < 60) return `${minutes}m`;
//   const hours = Math.floor(minutes / 60);
//   const mins = minutes % 60;
//   return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
// };

// interface CourseCardProps {
//   course: CourseData;
//   variant?: 'grid' | 'list';
// }

// // Grid Card Component with hydration fix
// export function CourseCard({ course, variant = 'grid' }: CourseCardProps) {
//   const [mounted, setMounted] = useState(false);
//   const [rating, setRating] = useState<string | null>(null);
  
//   useEffect(() => {
//     setMounted(true);
//     // Calculate rating on client side only to avoid hydration mismatch
//     setRating(formatRating(course.average_rating, course.review_count));
//   }, [course.average_rating, course.review_count]);
  
//   const duration = formatDuration(course.total_video_duration);
//   const likeCount = course.like_count || 0;
//   const shareCount = course.share_count || 0;
//   const viewCount = course.total_views || 0;
  
//   if (variant === 'list') {
//     return <CourseListCard course={course} />;
//   }
  
//   return (
//     <Link href={`/courses/${course.slug || course.id}`}>
//       <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group cursor-pointer h-full border border-gray-100">
//         {/* Course Image with Play Button */}
//         <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
//           <img
//             src={course.thumbnail_url || "/placeholder-course.png"}
//             alt={course.title}
//             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//           />
//           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
//             <div className="bg-white rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform">
//               <Play size={32} className="text-blue-600 fill-blue-600" />
//             </div>
//           </div>
//           <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
//             course.is_featured 
//               ? 'bg-yellow-500 text-white' 
//               : course.is_trending 
//               ? 'bg-green-500 text-white'
//               : 'bg-blue-500 text-white'
//           }`}>
//             {course.is_featured ? 'FEATURED' : course.is_trending ? 'TRENDING' : 'NEW'}
//           </span>
//         </div>

//         {/* Course Info */}
//         <div className="p-5">
//           {/* Category Badge */}
//           {course.category_name && (
//             <div className="mb-2">
//               <Badge variant="outline" className="text-xs">
//                 {course.category_name}
//               </Badge>
//             </div>
//           )}
          
//           <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 leading-tight">
//             {course.title}
//           </h3>
          
//           {/* Short Description */}
//           {course.short_description && (
//             <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//               {course.short_description}
//             </p>
//           )}

//           {/* Instructor */}
//           <div className="flex items-center gap-2 mb-4">
//             {course.instructor_image && (
//               <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
//                 <img
//                   src={course.instructor_image}
//                   alt={course.instructor_name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             )}
//             <p className="text-sm text-gray-600 truncate">
//               {course.instructor_name || 'Expert Instructor'}
//             </p>
//           </div>

//           {/* Social Engagement Metrics */}
//           <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
//             <div className="flex items-center gap-3">
//               {/* Likes - Only show if > 0 */}
//               {likeCount > 0 && (
//                 <div className="flex items-center gap-1 text-red-500">
//                   <Heart size={14} className="fill-red-500" />
//                   <span className="text-xs font-semibold">{formatNumber(likeCount)}</span>
//                 </div>
//               )}
              
//               {/* Shares - Only show if > 0 */}
//               {shareCount > 0 && (
//                 <div className="flex items-center gap-1 text-blue-500">
//                   <Share2 size={14} />
//                   <span className="text-xs font-semibold">{formatNumber(shareCount)}</span>
//                 </div>
//               )}
              
//               {/* Views - Only show if > 0 */}
//               {viewCount > 0 && (
//                 <div className="flex items-center gap-1 text-purple-500">
//                   <Eye size={14} />
//                   <span className="text-xs font-semibold">{formatNumber(viewCount)}</span>
//                 </div>
//               )}
//             </div>
            
//             {/* Rating and Reviews - Only show if rating exists */}
//             {mounted && rating ? (
//               <div className="flex items-center gap-1">
//                 <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
//                 <span className="text-xs font-semibold text-gray-900">{rating}</span>
//                 {(course.review_count || 0) > 0 && (
//                   <span className="text-xs text-gray-500">({formatNumber(course.review_count)})</span>
//                 )}
//               </div>
//             ) : null}
//           </div>

//           {/* Course Stats */}
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-4 text-sm text-gray-500">
//               {/* Rating - Only show if rating exists */}
//               {mounted && rating ? (
//                 <div className="flex items-center gap-1">
//                   <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                   <span className="font-semibold text-gray-900">{rating}</span>
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-1 text-gray-400">
//                   <Star className="h-4 w-4" />
//                   <span className="text-xs">No ratings</span>
//                 </div>
//               )}
              
//               {/* Students */}
//               <div className="flex items-center gap-1">
//                 <Users className="h-4 w-4" />
//                 <span>{formatNumber(course.enrolled_students_count)}</span>
//               </div>
              
//               {/* Duration - Only show if exists */}
//               {duration && (
//                 <div className="flex items-center gap-1">
//                   <Clock className="h-4 w-4 text-gray-500" />
//                   <span>{duration}</span>
//                 </div>
//               )}
//             </div>
            
//             {/* Price */}
//             <span className="text-blue-600 font-bold text-lg">
//               {course.price_cents === 0 ? 'FREE' : `$${((course.price_cents || 0) / 100).toFixed(2)}`}
//             </span>
//           </div>

//           {/* Additional Stats - Lessons */}
//           {course.total_lessons && (
//             <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
//               <BookOpen className="h-4 w-4" />
//               <span>{course.total_lessons} lessons</span>
//             </div>
//           )}

//           {/* View Course Button */}
//           <Button className="w-full group/btn bg-gray-900 hover:bg-gray-800 text-white" asChild>
//             <div>
//               View Course
//               <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
//             </div>
//           </Button>
//         </div>
//       </div>
//     </Link>
//   );
// }

// // List Card Component with hydration fix
// function CourseListCard({ course }: { course: CourseData }) {
//   const [mounted, setMounted] = useState(false);
//   const [rating, setRating] = useState<string | null>(null);
  
//   useEffect(() => {
//     setMounted(true);
//     // Calculate rating on client side only to avoid hydration mismatch
//     setRating(formatRating(course.average_rating, course.review_count));
//   }, [course.average_rating, course.review_count]);
  
//   const reviewCount = course.review_count || 0;
//   const likeCount = course.like_count || 0;
//   const shareCount = course.share_count || 0;
//   const viewCount = course.total_views || 0;
//   const duration = formatDuration(course.total_video_duration);
  
//   const formatPrice = (priceCents: number) => {
//     if (priceCents === 0) return 'FREE';
//     return `$${((priceCents || 0) / 100).toFixed(2)}`;
//   };
  
//   return (
//     <Link href={`/courses/${course.slug || course.id}`}>
//       <div className="flex flex-col lg:flex-row gap-6 p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group cursor-pointer">
//         {/* Course Thumbnail */}
//         <div className="relative w-full lg:w-64 h-48 rounded-lg overflow-hidden flex-shrink-0">
//           <img
//             src={course.thumbnail_url || "/placeholder-course.png"}
//             alt={course.title}
//             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//           />
//           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
//             <div className="bg-white rounded-full p-2 transform scale-0 group-hover:scale-100 transition-transform">
//               <Play size={20} className="text-blue-600 fill-blue-600" />
//             </div>
//           </div>
//         </div>

//         {/* Course Info */}
//         <div className="flex-1 min-w-0">
//           <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-3 gap-4">
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2 mb-2 flex-wrap">
//                 {course.category_name && (
//                   <Badge variant="outline" className="text-xs">
//                     {course.category_name}
//                   </Badge>
//                 )}
//                 {course.is_featured && (
//                   <Badge className="bg-yellow-500 text-white border-0 text-xs">
//                     FEATURED
//                   </Badge>
//                 )}
//                 {course.is_trending && (
//                   <Badge className="bg-green-500 text-white border-0 text-xs">
//                     TRENDING
//                   </Badge>
//                 )}
//               </div>
//               <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
//                 {course.title}
//               </h3>
//               {course.short_description && (
//                 <p className="text-gray-600 text-sm mb-3 line-clamp-2">
//                   {course.short_description}
//                 </p>
//               )}
              
//               {/* Social Engagement Metrics - Row 1 */}
//               <div className="flex items-center gap-4 mb-3 flex-wrap">
//                 {/* Rating and Reviews - Only show if rating exists */}
//                 {mounted && rating ? (
//                   <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
//                     <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
//                     <span className="text-xs font-semibold text-gray-900">{rating}</span>
//                     {reviewCount > 0 && (
//                       <span className="text-xs text-gray-600">({formatNumber(reviewCount)})</span>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-1 text-gray-400 px-2 py-1 rounded-md bg-gray-50">
//                     <Star className="h-3 w-3" />
//                     <span className="text-xs">No ratings</span>
//                   </div>
//                 )}
                
//                 {/* Students */}
//                 {course.enrolled_students_count && (
//                   <div className="flex items-center gap-1 text-gray-600">
//                     <Users size={14} />
//                     <span className="text-xs">{formatNumber(course.enrolled_students_count)} students</span>
//                   </div>
//                 )}
                
//                 {/* Duration - Only show if exists */}
//                 {duration && (
//                   <div className="flex items-center gap-1 text-gray-600">
//                     <Clock size={14} className="text-gray-500" />
//                     <span className="text-xs">{duration}</span>
//                   </div>
//                 )}
                
//                 {/* Lessons */}
//                 {course.total_lessons && (
//                   <div className="flex items-center gap-1 text-gray-600">
//                     <BookOpen size={14} className="text-gray-500" />
//                     <span className="text-xs">{course.total_lessons} lessons</span>
//                   </div>
//                 )}
//               </div>
              
//               {/* Social Engagement Metrics - Row 2 */}
//               <div className="flex items-center gap-4 flex-wrap">
//                 {/* Likes - Only show if > 0 */}
//                 {likeCount > 0 && (
//                   <div className="flex items-center gap-1 text-red-500">
//                     <Heart size={12} className="fill-red-500" />
//                     <span className="text-xs">{formatNumber(likeCount)} likes</span>
//                   </div>
//                 )}
                
//                 {/* Shares - Only show if > 0 */}
//                 {shareCount > 0 && (
//                   <div className="flex items-center gap-1 text-blue-500">
//                     <Share2 size={12} />
//                     <span className="text-xs">{formatNumber(shareCount)} shares</span>
//                   </div>
//                 )}
                
//                 {/* Views - Only show if > 0 */}
//                 {viewCount > 0 && (
//                   <div className="flex items-center gap-1 text-purple-500">
//                     <Eye size={12} />
//                     <span className="text-xs">{formatNumber(viewCount)} views</span>
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             {/* Price and Instructor */}
//             <div className="flex-shrink-0 lg:text-right">
//               <div className="text-blue-600 font-bold text-lg mb-2">
//                 {formatPrice(course.price_cents || 0)}
//               </div>
//               <div className="text-sm text-gray-600">
//                 {course.instructor_name || 'Expert Instructor'}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }























// // /src/components/courses/shared-course-card.tsx

// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { 
//   Play, 
//   ArrowRight, 
//   Users, 
//   Star, 
//   Heart, 
//   Share2, 
//   Eye, 
//   Clock,
//   BookOpen 
// } from 'lucide-react';

// export interface CourseData {
//   id: string | number;
//   slug?: string;
//   title: string;
//   thumbnail_url?: string;
//   short_description?: string;
//   category_name?: string;
//   instructor_name?: string;
//   instructor_image?: string;
//   price_cents?: number;
//   average_rating?: number | null;
//   review_count?: number;
//   like_count?: number;
//   share_count?: number;
//   total_views?: number;
//   enrolled_students_count?: number;
//   total_video_duration?: number;
//   total_lessons?: number;
//   is_featured?: boolean;
//   is_trending?: boolean;
// }

// // Shared helper functions
// export const formatRating = (rating: number | undefined | null, reviewCount?: number): { display: string; value: number; hasReviews: boolean } => {
//   // Ensure rating is a valid number, default to 0
//   const numericRating = typeof rating === 'number' && !isNaN(rating) ? rating : 0;
  
//   // Ensure reviewCount is a valid number
//   const numericReviewCount = typeof reviewCount === 'number' && reviewCount > 0 ? reviewCount : 0;
  
//   // If rating exists and is > 0, format it with decimal
//   if (numericRating > 0) {
//     return {
//       value: numericRating,
//       display: numericRating.toFixed(1),
//       hasReviews: numericReviewCount > 0
//     };
//   }
  
//   // Otherwise, show "No ratings yet"
//   return {
//     value: 0,
//     display: "No ratings yet",
//     hasReviews: false
//   };
// };

// export const formatNumber = (num: any): string => {
//   if (num === null || num === undefined || num === '' || num === 0) return '0';
  
//   const numValue = typeof num === 'string' ? parseInt(num) : Number(num);
  
//   return isNaN(numValue) ? '0' : numValue.toLocaleString();
// };

// export const formatDuration = (minutes: number | undefined): string | null => {
//   if (!minutes || minutes === 0) return null;
//   if (minutes < 60) return `${minutes}m`;
//   const hours = Math.floor(minutes / 60);
//   const mins = minutes % 60;
//   return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
// };

// interface CourseCardProps {
//   course: CourseData;
//   variant?: 'grid' | 'list';
// }

// // Grid Card Component
// export function CourseCard({ course, variant = 'grid' }: CourseCardProps) {
//   const rating = formatRating(course.average_rating, course.review_count);
//   const duration = formatDuration(course.total_video_duration);
//   const likeCount = course.like_count || 0;
//   const shareCount = course.share_count || 0;
//   const viewCount = course.total_views || 0;
  
//   if (variant === 'list') {
//     return <CourseListCard course={course} />;
//   }
  
//   return (
//     <Link href={`/courses/${course.slug || course.id}`}>
//       <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group cursor-pointer h-full border border-gray-100">
//         {/* Course Image with Play Button */}
//         <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
//           <img
//             src={course.thumbnail_url || "/placeholder-course.png"}
//             alt={course.title}
//             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//           />
//           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
//             <div className="bg-white rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform">
//               <Play size={32} className="text-blue-600 fill-blue-600" />
//             </div>
//           </div>
//           <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
//             course.is_featured 
//               ? 'bg-yellow-500 text-white' 
//               : course.is_trending 
//               ? 'bg-green-500 text-white'
//               : 'bg-blue-500 text-white'
//           }`}>
//             {course.is_featured ? 'FEATURED' : course.is_trending ? 'TRENDING' : 'NEW'}
//           </span>
//         </div>

//         {/* Course Info */}
//         <div className="p-5">
//           {/* Category Badge */}
//           {course.category_name && (
//             <div className="mb-2">
//               <Badge variant="outline" className="text-xs">
//                 {course.category_name}
//               </Badge>
//             </div>
//           )}
          
//           <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 leading-tight">
//             {course.title}
//           </h3>
          
//           {/* Short Description */}
//           {course.short_description && (
//             <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//               {course.short_description}
//             </p>
//           )}

//           {/* Instructor */}
//           <div className="flex items-center gap-2 mb-4">
//             {course.instructor_image && (
//               <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
//                 <img
//                   src={course.instructor_image}
//                   alt={course.instructor_name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             )}
//             <p className="text-sm text-gray-600 truncate">
//               {course.instructor_name || 'Expert Instructor'}
//             </p>
//           </div>

//           {/* Social Engagement Metrics */}
//           <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
//             <div className="flex items-center gap-3">
//               {/* Likes - Only show if > 0 */}
//               {likeCount > 0 && (
//                 <div className="flex items-center gap-1 text-red-500">
//                   <Heart size={14} className="fill-red-500" />
//                   <span className="text-xs font-semibold">{formatNumber(likeCount)}</span>
//                 </div>
//               )}
              
//               {/* Shares - Only show if > 0 */}
//               {shareCount > 0 && (
//                 <div className="flex items-center gap-1 text-blue-500">
//                   <Share2 size={14} />
//                   <span className="text-xs font-semibold">{formatNumber(shareCount)}</span>
//                 </div>
//               )}
              
//               {/* Views - Only show if > 0 */}
//               {viewCount > 0 && (
//                 <div className="flex items-center gap-1 text-purple-500">
//                   <Eye size={14} />
//                   <span className="text-xs font-semibold">{formatNumber(viewCount)}</span>
//                 </div>
//               )}
//             </div>
            
//             {/* Rating and Reviews - ALWAYS show now */}
//             <div className="flex items-center gap-1">
//               <Star className={`h-3 w-3 ${rating.value > 0 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
//               <span className="text-xs font-semibold text-gray-900">{rating.display}</span>
//               {rating.hasReviews && (
//                 <span className="text-xs text-gray-500">({formatNumber(course.review_count)})</span>
//               )}
//             </div>
//           </div>

//           {/* Course Stats */}
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-4 text-sm text-gray-500">
//               {/* Rating - ALWAYS show now */}
//               <div className="flex items-center gap-1">
//                 <Star className={`h-4 w-4 ${rating.value > 0 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
//                 <span className={`font-semibold ${rating.value > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
//                   {rating.display}
//                 </span>
//               </div>
              
//               {/* Students */}
//               <div className="flex items-center gap-1">
//                 <Users className="h-4 w-4" />
//                 <span>{formatNumber(course.enrolled_students_count)}</span>
//               </div>
              
//               {/* Duration - Only show if exists */}
//               {duration && (
//                 <div className="flex items-center gap-1">
//                   <Clock className="h-4 w-4 text-gray-500" />
//                   <span>{duration}</span>
//                 </div>
//               )}
//             </div>
            
//             {/* Price */}
//             <span className="text-blue-600 font-bold text-lg">
//               {course.price_cents === 0 ? 'FREE' : `$${((course.price_cents || 0) / 100).toFixed(2)}`}
//             </span>
//           </div>

//           {/* Additional Stats - Lessons */}
//           {course.total_lessons && (
//             <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
//               <BookOpen className="h-4 w-4" />
//               <span>{course.total_lessons} lessons</span>
//             </div>
//           )}

//           {/* View Course Button */}
//           <Button className="w-full group/btn bg-gray-900 hover:bg-gray-800 text-white" asChild>
//             <div>
//               View Course
//               <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
//             </div>
//           </Button>
//         </div>
//       </div>
//     </Link>
//   );
// }

// // List Card Component
// function CourseListCard({ course }: { course: CourseData }) {
//   const rating = formatRating(course.average_rating, course.review_count);
//   const reviewCount = course.review_count || 0;
//   const likeCount = course.like_count || 0;
//   const shareCount = course.share_count || 0;
//   const viewCount = course.total_views || 0;
//   const duration = formatDuration(course.total_video_duration);
  
//   const formatPrice = (priceCents: number) => {
//     if (priceCents === 0) return 'FREE';
//     return `$${((priceCents || 0) / 100).toFixed(2)}`;
//   };
  
//   return (
//     <Link href={`/courses/${course.slug || course.id}`}>
//       <div className="flex flex-col lg:flex-row gap-6 p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group cursor-pointer">
//         {/* Course Thumbnail */}
//         <div className="relative w-full lg:w-64 h-48 rounded-lg overflow-hidden flex-shrink-0">
//           <img
//             src={course.thumbnail_url || "/placeholder-course.png"}
//             alt={course.title}
//             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//           />
//           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
//             <div className="bg-white rounded-full p-2 transform scale-0 group-hover:scale-100 transition-transform">
//               <Play size={20} className="text-blue-600 fill-blue-600" />
//             </div>
//           </div>
//         </div>

//         {/* Course Info */}
//         <div className="flex-1 min-w-0">
//           <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-3 gap-4">
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2 mb-2 flex-wrap">
//                 {course.category_name && (
//                   <Badge variant="outline" className="text-xs">
//                     {course.category_name}
//                   </Badge>
//                 )}
//                 {course.is_featured && (
//                   <Badge className="bg-yellow-500 text-white border-0 text-xs">
//                     FEATURED
//                   </Badge>
//                 )}
//                 {course.is_trending && (
//                   <Badge className="bg-green-500 text-white border-0 text-xs">
//                     TRENDING
//                   </Badge>
//                 )}
//               </div>
//               <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
//                 {course.title}
//               </h3>
//               {course.short_description && (
//                 <p className="text-gray-600 text-sm mb-3 line-clamp-2">
//                   {course.short_description}
//                 </p>
//               )}
              
//               {/* Social Engagement Metrics - Row 1 */}
//               <div className="flex items-center gap-4 mb-3 flex-wrap">
//                 {/* Rating and Reviews - ALWAYS show now */}
//                 <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${rating.value > 0 ? 'bg-yellow-50' : 'bg-gray-50'}`}>
//                   <Star className={`h-3 w-3 ${rating.value > 0 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
//                   <span className={`text-xs font-semibold ${rating.value > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
//                     {rating.display}
//                   </span>
//                   {rating.hasReviews && (
//                     <span className="text-xs text-gray-600">({formatNumber(reviewCount)})</span>
//                   )}
//                 </div>
                
//                 {/* Students */}
//                 {course.enrolled_students_count && (
//                   <div className="flex items-center gap-1 text-gray-600">
//                     <Users size={14} />
//                     <span className="text-xs">{formatNumber(course.enrolled_students_count)} students</span>
//                   </div>
//                 )}
                
//                 {/* Duration - Only show if exists */}
//                 {duration && (
//                   <div className="flex items-center gap-1 text-gray-600">
//                     <Clock size={14} className="text-gray-500" />
//                     <span className="text-xs">{duration}</span>
//                   </div>
//                 )}
                
//                 {/* Lessons */}
//                 {course.total_lessons && (
//                   <div className="flex items-center gap-1 text-gray-600">
//                     <BookOpen size={14} className="text-gray-500" />
//                     <span className="text-xs">{course.total_lessons} lessons</span>
//                   </div>
//                 )}
//               </div>
              
//               {/* Social Engagement Metrics - Row 2 */}
//               <div className="flex items-center gap-4 flex-wrap">
//                 {/* Likes - Only show if > 0 */}
//                 {likeCount > 0 && (
//                   <div className="flex items-center gap-1 text-red-500">
//                     <Heart size={12} className="fill-red-500" />
//                     <span className="text-xs">{formatNumber(likeCount)} likes</span>
//                   </div>
//                 )}
                
//                 {/* Shares - Only show if > 0 */}
//                 {shareCount > 0 && (
//                   <div className="flex items-center gap-1 text-blue-500">
//                     <Share2 size={12} />
//                     <span className="text-xs">{formatNumber(shareCount)} shares</span>
//                   </div>
//                 )}
                
//                 {/* Views - Only show if > 0 */}
//                 {viewCount > 0 && (
//                   <div className="flex items-center gap-1 text-purple-500">
//                     <Eye size={12} />
//                     <span className="text-xs">{formatNumber(viewCount)} views</span>
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             {/* Price and Instructor */}
//             <div className="flex-shrink-0 lg:text-right">
//               <div className="text-blue-600 font-bold text-lg mb-2">
//                 {formatPrice(course.price_cents || 0)}
//               </div>
//               <div className="text-sm text-gray-600">
//                 {course.instructor_name || 'Expert Instructor'}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }


























// // /src/components/courses/shared-course-card.tsx

// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { 
//   Play, 
//   ArrowRight, 
//   Users, 
//   Star, 
//   Heart, 
//   Share2, 
//   Eye, 
//   Clock,
//   BookOpen 
// } from 'lucide-react';

// export interface CourseData {
//   id: string | number;
//   slug?: string;
//   title: string;
//   thumbnail_url?: string;
//   short_description?: string;
//   category_name?: string;
//   instructor_name?: string;
//   instructor_image?: string;
//   price_cents?: number;
//   average_rating?: number | null;
//   review_count?: number;
//   like_count?: number;
//   share_count?: number;
//   total_views?: number;
//   enrolled_students_count?: number;
//   total_video_duration?: number;
//   total_lessons?: number;
//   is_featured?: boolean;
//   is_trending?: boolean;
// }

// // Shared helper functions
// export const formatRating = (rating: number | undefined | null, reviewCount?: number): { display: string; value: number; hasReviews: boolean } => {
//   // Ensure rating is a valid number, default to 0
//   const numericRating = typeof rating === 'number' && !isNaN(rating) ? rating : 0;
  
//   // Ensure reviewCount is a valid number
//   const numericReviewCount = typeof reviewCount === 'number' && reviewCount > 0 ? reviewCount : 0;
  
//   // If rating exists and is > 0, format it with decimal
//   if (numericRating > 0) {
//     return {
//       value: numericRating,
//       display: numericRating.toFixed(1),
//       hasReviews: numericReviewCount > 0
//     };
//   }
  
//   // Otherwise, show "No ratings yet"
//   return {
//     value: 0,
//     display: "No ratings yet",
//     hasReviews: false
//   };
// };

// export const formatNumber = (num: any): string => {
//   if (num === null || num === undefined || num === '' || num === 0) return '0';
  
//   const numValue = typeof num === 'string' ? parseInt(num) : Number(num);
  
//   return isNaN(numValue) ? '0' : numValue.toLocaleString();
// };

// export const formatDuration = (minutes: number | undefined): string | null => {
//   if (!minutes || minutes === 0) return null;
//   if (minutes < 60) return `${minutes}m`;
//   const hours = Math.floor(minutes / 60);
//   const mins = minutes % 60;
//   return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
// };

// interface CourseCardProps {
//   course: CourseData;
//   variant?: 'grid' | 'list';
// }

// // Grid Card Component
// export function CourseCard({ course, variant = 'grid' }: CourseCardProps) {
//   const rating = formatRating(course.average_rating, course.review_count);
//   const duration = formatDuration(course.total_video_duration);
//   const likeCount = course.like_count || 0;
//   const shareCount = course.share_count || 0;
//   const viewCount = course.total_views || 0;
  
//   if (variant === 'list') {
//     return <CourseListCard course={course} />;
//   }
  
//   return (
//     <Link href={`/courses/${course.slug || course.id}`}>
//       <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group cursor-pointer h-full border border-gray-100">
//         {/* Course Image with Play Button */}
//         <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
//           <img
//             src={course.thumbnail_url || "/placeholder-course.png"}
//             alt={course.title}
//             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//           />
//           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
//             <div className="bg-white rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform">
//               <Play size={32} className="text-blue-600 fill-blue-600" />
//             </div>
//           </div>
//           <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
//             course.is_featured 
//               ? 'bg-yellow-500 text-white' 
//               : course.is_trending 
//               ? 'bg-green-500 text-white'
//               : 'bg-blue-500 text-white'
//           }`}>
//             {course.is_featured ? 'FEATURED' : course.is_trending ? 'TRENDING' : 'NEW'}
//           </span>
//         </div>

//         {/* Course Info */}
//         <div className="p-5">
//           {/* Category Badge */}
//           {course.category_name && (
//             <div className="mb-2">
//               <Badge variant="outline" className="text-xs">
//                 {course.category_name}
//               </Badge>
//             </div>
//           )}
          
//           <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 leading-tight">
//             {course.title}
//           </h3>
          
//           {/* Short Description */}
//           {course.short_description && (
//             <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//               {course.short_description}
//             </p>
//           )}

//           {/* Instructor */}
//           <div className="flex items-center gap-2 mb-4">
//             {course.instructor_image && (
//               <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
//                 <img
//                   src={course.instructor_image}
//                   alt={course.instructor_name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             )}
//             <p className="text-sm text-gray-600 truncate">
//               {course.instructor_name || 'Expert Instructor'}
//             </p>
//           </div>

//           {/* Social Engagement Metrics */}
//           <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
//             <div className="flex items-center gap-3">
//               {/* Likes - Only show if > 0 */}
//               {likeCount > 0 && (
//                 <div className="flex items-center gap-1 text-red-500">
//                   <Heart size={14} className="fill-red-500" />
//                   <span className="text-xs font-semibold">{formatNumber(likeCount)}</span>
//                 </div>
//               )}
              
//               {/* Shares - Only show if > 0 */}
//               {shareCount > 0 && (
//                 <div className="flex items-center gap-1 text-blue-500">
//                   <Share2 size={14} />
//                   <span className="text-xs font-semibold">{formatNumber(shareCount)}</span>
//                 </div>
//               )}
              
//               {/* Views - Only show if > 0 */}
//               {viewCount > 0 && (
//                 <div className="flex items-center gap-1 text-purple-500">
//                   <Eye size={14} />
//                   <span className="text-xs font-semibold">{formatNumber(viewCount)}</span>
//                 </div>
//               )}
//             </div>
            
//             {/* Rating and Reviews - ALWAYS show now */}
//             <div className="flex items-center gap-1">
//               <Star className={`h-3 w-3 ${rating.value > 0 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
//               <span className="text-xs font-semibold text-gray-900">{rating.display}</span>
//               {rating.hasReviews && (
//                 <span className="text-xs text-gray-500">({formatNumber(course.review_count)})</span>
//               )}
//             </div>
//           </div>

//           {/* Course Stats */}
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-4 text-sm text-gray-500">
//               {/* Rating - ALWAYS show now */}
//               <div className="flex items-center gap-1">
//                 <Star className={`h-4 w-4 ${rating.value > 0 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
//                 <span className={`font-semibold ${rating.value > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
//                   {rating.display}
//                 </span>
//               </div>
              
//               {/* Students */}
//               <div className="flex items-center gap-1">
//                 <Users className="h-4 w-4" />
//                 <span>{formatNumber(course.enrolled_students_count)}</span>
//               </div>
              
//               {/* Duration - Only show if exists */}
//               {duration && (
//                 <div className="flex items-center gap-1">
//                   <Clock className="h-4 w-4 text-gray-500" />
//                   <span>{duration}</span>
//                 </div>
//               )}
//             </div>
            
//             {/* Price */}
//             <span className="text-blue-600 font-bold text-lg">
//               {course.price_cents === 0 ? 'FREE' : `$${((course.price_cents || 0) / 100).toFixed(2)}`}
//             </span>
//           </div>

//           {/* Additional Stats - Lessons */}
//           {course.total_lessons && (
//             <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
//               <BookOpen className="h-4 w-4" />
//               <span>{course.total_lessons} lessons</span>
//             </div>
//           )}

//           {/* View Course Button */}
//           <Button className="w-full group/btn bg-gray-900 hover:bg-gray-800 text-white" asChild>
//             <div>
//               View Course
//               <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
//             </div>
//           </Button>
//         </div>
//       </div>
//     </Link>
//   );
// }

// // List Card Component
// function CourseListCard({ course }: { course: CourseData }) {
//   const rating = formatRating(course.average_rating, course.review_count);
//   const reviewCount = course.review_count || 0;
//   const likeCount = course.like_count || 0;
//   const shareCount = course.share_count || 0;
//   const viewCount = course.total_views || 0;
//   const duration = formatDuration(course.total_video_duration);
  
//   const formatPrice = (priceCents: number) => {
//     if (priceCents === 0) return 'FREE';
//     return `$${((priceCents || 0) / 100).toFixed(2)}`;
//   };
  
//   return (
//     <Link href={`/courses/${course.slug || course.id}`}>
//       <div className="flex flex-col lg:flex-row gap-6 p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group cursor-pointer">
//         {/* Course Thumbnail */}
//         <div className="relative w-full lg:w-64 h-48 rounded-lg overflow-hidden flex-shrink-0">
//           <img
//             src={course.thumbnail_url || "/placeholder-course.png"}
//             alt={course.title}
//             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//           />
//           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
//             <div className="bg-white rounded-full p-2 transform scale-0 group-hover:scale-100 transition-transform">
//               <Play size={20} className="text-blue-600 fill-blue-600" />
//             </div>
//           </div>
//         </div>

//         {/* Course Info */}
//         <div className="flex-1 min-w-0">
//           <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-3 gap-4">
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2 mb-2 flex-wrap">
//                 {course.category_name && (
//                   <Badge variant="outline" className="text-xs">
//                     {course.category_name}
//                   </Badge>
//                 )}
//                 {course.is_featured && (
//                   <Badge className="bg-yellow-500 text-white border-0 text-xs">
//                     FEATURED
//                   </Badge>
//                 )}
//                 {course.is_trending && (
//                   <Badge className="bg-green-500 text-white border-0 text-xs">
//                     TRENDING
//                   </Badge>
//                 )}
//               </div>
//               <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
//                 {course.title}
//               </h3>
//               {course.short_description && (
//                 <p className="text-gray-600 text-sm mb-3 line-clamp-2">
//                   {course.short_description}
//                 </p>
//               )}
              
//               {/* Social Engagement Metrics - Row 1 */}
//               <div className="flex items-center gap-4 mb-3 flex-wrap">
//                 {/* Rating and Reviews - ALWAYS show now */}
//                 <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${rating.value > 0 ? 'bg-yellow-50' : 'bg-gray-50'}`}>
//                   <Star className={`h-3 w-3 ${rating.value > 0 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
//                   <span className={`text-xs font-semibold ${rating.value > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
//                     {rating.display}
//                   </span>
//                   {rating.hasReviews && (
//                     <span className="text-xs text-gray-600">({formatNumber(reviewCount)})</span>
//                   )}
//                 </div>
                
//                 {/* Students */}
//                 {course.enrolled_students_count && (
//                   <div className="flex items-center gap-1 text-gray-600">
//                     <Users size={14} />
//                     <span className="text-xs">{formatNumber(course.enrolled_students_count)} students</span>
//                   </div>
//                 )}
                
//                 {/* Duration - Only show if exists */}
//                 {duration && (
//                   <div className="flex items-center gap-1 text-gray-600">
//                     <Clock size={14} className="text-gray-500" />
//                     <span className="text-xs">{duration}</span>
//                   </div>
//                 )}
                
//                 {/* Lessons */}
//                 {course.total_lessons && (
//                   <div className="flex items-center gap-1 text-gray-600">
//                     <BookOpen size={14} className="text-gray-500" />
//                     <span className="text-xs">{course.total_lessons} lessons</span>
//                   </div>
//                 )}
//               </div>
              
//               {/* Social Engagement Metrics - Row 2 */}
//               <div className="flex items-center gap-4 flex-wrap">
//                 {/* Likes - Only show if > 0 */}
//                 {likeCount > 0 && (
//                   <div className="flex items-center gap-1 text-red-500">
//                     <Heart size={12} className="fill-red-500" />
//                     <span className="text-xs">{formatNumber(likeCount)} likes</span>
//                   </div>
//                 )}
                
//                 {/* Shares - Only show if > 0 */}
//                 {shareCount > 0 && (
//                   <div className="flex items-center gap-1 text-blue-500">
//                     <Share2 size={12} />
//                     <span className="text-xs">{formatNumber(shareCount)} shares</span>
//                   </div>
//                 )}
                
//                 {/* Views - Only show if > 0 */}
//                 {viewCount > 0 && (
//                   <div className="flex items-center gap-1 text-purple-500">
//                     <Eye size={12} />
//                     <span className="text-xs">{formatNumber(viewCount)} views</span>
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             {/* Price and Instructor */}
//             <div className="flex-shrink-0 lg:text-right">
//               <div className="text-blue-600 font-bold text-lg mb-2">
//                 {formatPrice(course.price_cents || 0)}
//               </div>
//               <div className="text-sm text-gray-600">
//                 {course.instructor_name || 'Expert Instructor'}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }





















// /src/components/courses/shared-course-card.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  ArrowRight, 
  Users, 
  Star, 
  Heart, 
  Share2, 
  Eye, 
  Clock,
  BookOpen 
} from 'lucide-react';

export interface CourseData {
  id: string | number;
  slug?: string;
  title: string;
  thumbnail_url?: string;
  short_description?: string;
  category_name?: string;
  instructor_name?: string;
  instructor_image?: string;
  price_cents?: number;
  average_rating?: number | null;
  review_count?: number;
  like_count?: number;
  share_count?: number;
  total_views?: number;
  enrolled_students_count?: number;
  total_video_duration?: number;
  total_lessons?: number;
  is_featured?: boolean;
  is_trending?: boolean;
}

// Shared helper functions - UPDATED: Never returns null
export const formatRating = (
  rating: number | undefined | null,
  reviewCount?: number
): { value: number; display: string; hasReviews: boolean } => {
  // Ensure rating is a valid number
  const numericRating =
    typeof rating === 'number' && !isNaN(rating) ? rating : 0;
  
  // Ensure review count is valid
  const numericReviewCount =
    typeof reviewCount === 'number' && reviewCount > 0 ? reviewCount : 0;
  
  // If we have a positive rating
  if (numericRating > 0) {
    return {
      value: numericRating,
      display: numericRating.toFixed(1),
      hasReviews: numericReviewCount > 0,
    };
  }
  
  // Default case: no ratings yet
  return {
    value: 0,
    display: '',
    hasReviews: false,
  };
};

export const formatNumber = (num: any): string => {
  if (num === null || num === undefined || num === '' || num === 0) return '0';
  
  const numValue = typeof num === 'string' ? parseInt(num) : Number(num);
  
  return isNaN(numValue) ? '0' : numValue.toLocaleString();
};

export const formatDuration = (minutes: number | undefined): string | null => {
  if (!minutes || minutes === 0) return null;
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

interface CourseCardProps {
  course: CourseData;
  variant?: 'grid' | 'list';
}

// Grid Card Component
export function CourseCard({ course, variant = 'grid' }: CourseCardProps) {
  const rating = formatRating(course.average_rating, course.review_count);
  const duration = formatDuration(course.total_video_duration);
  const likeCount = course.like_count || 0;
  const shareCount = course.share_count || 0;
  const viewCount = course.total_views || 0;
  
  if (variant === 'list') {
    return <CourseListCard course={course} />;
  }
  
  return (
    <Link href={`/courses/${course.slug || course.id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group cursor-pointer h-full border border-gray-100">
        {/* Course Image with Play Button */}
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
              : 'bg-blue-500 text-white'
          }`}>
            {course.is_featured ? 'FEATURED' : course.is_trending ? 'TRENDING' : 'NEW'}
          </span>
        </div>

        {/* Course Info */}
        <div className="p-5">
          {/* Category Badge */}
          {course.category_name && (
            <div className="mb-2">
              <Badge variant="outline" className="text-xs">
                {course.category_name}
              </Badge>
            </div>
          )}
          
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 leading-tight">
            {course.title}
          </h3>
          
          {/* Short Description */}
          {course.short_description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {course.short_description}
            </p>
          )}

          {/* Instructor */}
          <div className="flex items-center gap-2 mb-4">
            {course.instructor_image && (
              <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={course.instructor_image}
                  alt={course.instructor_name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <p className="text-sm text-gray-600 truncate">
              {course.instructor_name || 'Expert Instructor'}
            </p>
          </div>

          {/* Social Engagement Metrics */}
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              {/* Likes - Only show if > 0 */}
              {likeCount > 0 && (
                <div className="flex items-center gap-1 text-red-500">
                  <Heart size={14} className="fill-red-500" />
                  <span className="text-xs font-semibold">{formatNumber(likeCount)}</span>
                </div>
              )}
              
              {/* Shares - Only show if > 0 */}
              {shareCount > 0 && (
                <div className="flex items-center gap-1 text-blue-500">
                  <Share2 size={14} />
                  <span className="text-xs font-semibold">{formatNumber(shareCount)}</span>
                </div>
              )}
              
              {/* Views - Only show if > 0 */}
              {viewCount > 0 && (
                <div className="flex items-center gap-1 text-purple-500">
                  <Eye size={14} />
                  <span className="text-xs font-semibold">{formatNumber(viewCount)}</span>
                </div>
              )}
            </div>
            
            {/* Rating and Reviews - ALWAYS SHOW NOW */}
            <div className="flex items-center gap-1">
              <Star
                className={`h-3 w-3 ${
                  rating.value > 0
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-400'
                }`}
              />
              <span className="text-xs font-semibold text-gray-900">
                {rating.display}
              </span>
              {rating.hasReviews && (
                <span className="text-xs text-gray-500">
                  ({formatNumber(course.review_count)})
                </span>
              )}
            </div>
          </div>

          {/* Course Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {/* Rating - ALWAYS SHOW NOW */}
              <div className="flex items-center gap-1">
                <Star
                  className={`h-4 w-4 ${
                    rating.value > 0
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-400'
                  }`}
                />
                <span className={`font-semibold ${rating.value > 0 ? 'text-gray-900' : 'text-gray-400 text-xs'}`}>
                  {rating.display}
                </span>
              </div>
              
              {/* Students */}
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{formatNumber(course.enrolled_students_count)}</span>
              </div>
              
              {/* Duration - Only show if exists */}
              {duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{duration}</span>
                </div>
              )}
            </div>
            
            {/* Price */}
            <span className="text-blue-600 font-bold text-lg">
              {course.price_cents === 0 ? 'FREE' : `₦${((course.price_cents || 0) / 100).toLocaleString('en-NG')}`}
            </span>
          </div>

          {/* Additional Stats - Lessons */}
          {course.total_lessons && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
              <BookOpen className="h-4 w-4" />
              <span>{course.total_lessons} lessons</span>
            </div>
          )}

          {/* View Course Button */}
          <Button className="w-full group/btn bg-gray-900 hover:bg-gray-800 text-white" asChild>
            <div>
              View Course
              <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </div>
          </Button>
        </div>
      </div>
    </Link>
  );
}

// List Card Component
function CourseListCard({ course }: { course: CourseData }) {
  const rating = formatRating(course.average_rating, course.review_count);
  const reviewCount = course.review_count || 0;
  const likeCount = course.like_count || 0;
  const shareCount = course.share_count || 0;
  const viewCount = course.total_views || 0;
  const duration = formatDuration(course.total_video_duration);
  
  const formatPrice = (priceCents: number) => {
    if (priceCents === 0) return 'FREE';
    return `₦${((priceCents || 0) / 100).toLocaleString('en-NG')}`;
  };
  
  return (
    <Link href={`/courses/${course.slug || course.id}`}>
      <div className="flex flex-col lg:flex-row gap-6 p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group cursor-pointer">
        {/* Course Thumbnail */}
        <div className="relative w-full lg:w-64 h-48 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={course.thumbnail_url || "/placeholder-course.png"}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <div className="bg-white rounded-full p-2 transform scale-0 group-hover:scale-100 transition-transform">
              <Play size={20} className="text-blue-600 fill-blue-600" />
            </div>
          </div>
        </div>

        {/* Course Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-3 gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {course.category_name && (
                  <Badge variant="outline" className="text-xs">
                    {course.category_name}
                  </Badge>
                )}
                {course.is_featured && (
                  <Badge className="bg-yellow-500 text-white border-0 text-xs">
                    FEATURED
                  </Badge>
                )}
                {course.is_trending && (
                  <Badge className="bg-green-500 text-white border-0 text-xs">
                    TRENDING
                  </Badge>
                )}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                {course.title}
              </h3>
              {course.short_description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {course.short_description}
                </p>
              )}
              
              {/* Social Engagement Metrics - Row 1 */}
              <div className="flex items-center gap-4 mb-3 flex-wrap">
                {/* Rating and Reviews - ALWAYS SHOW NOW */}
                <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                  rating.value > 0 ? 'bg-yellow-50' : 'bg-gray-50'
                }`}>
                  <Star
                    className={`h-3 w-3 ${
                      rating.value > 0
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-400'
                    }`}
                  />
                  <span className={`text-xs font-semibold ${
                    rating.value > 0 ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {rating.display}
                  </span>
                  {rating.hasReviews && (
                    <span className="text-xs text-gray-600">
                      ({formatNumber(reviewCount)})
                    </span>
                  )}
                </div>
                
                {/* Students */}
                {course.enrolled_students_count && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <Users size={14} />
                    <span className="text-xs">{formatNumber(course.enrolled_students_count)} students</span>
                  </div>
                )}
                
                {/* Duration - Only show if exists */}
                {duration && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock size={14} className="text-gray-500" />
                    <span className="text-xs">{duration}</span>
                  </div>
                )}
                
                {/* Lessons */}
                {course.total_lessons && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <BookOpen size={14} className="text-gray-500" />
                    <span className="text-xs">{course.total_lessons} lessons</span>
                  </div>
                )}
              </div>
              
              {/* Social Engagement Metrics - Row 2 */}
              <div className="flex items-center gap-4 flex-wrap">
                {/* Likes - Only show if > 0 */}
                {likeCount > 0 && (
                  <div className="flex items-center gap-1 text-red-500">
                    <Heart size={12} className="fill-red-500" />
                    <span className="text-xs">{formatNumber(likeCount)} likes</span>
                  </div>
                )}
                
                {/* Shares - Only show if > 0 */}
                {shareCount > 0 && (
                  <div className="flex items-center gap-1 text-blue-500">
                    <Share2 size={12} />
                    <span className="text-xs">{formatNumber(shareCount)} shares</span>
                  </div>
                )}
                
                {/* Views - Only show if > 0 */}
                {viewCount > 0 && (
                  <div className="flex items-center gap-1 text-purple-500">
                    <Eye size={12} />
                    <span className="text-xs">{formatNumber(viewCount)} views</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Price and Instructor */}
            <div className="flex-shrink-0 lg:text-right">
              <div className="text-blue-600 font-bold text-lg mb-2">
                {formatPrice(course.price_cents || 0)}
              </div>
              <div className="text-sm text-gray-600">
                {course.instructor_name || 'Expert Instructor'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}