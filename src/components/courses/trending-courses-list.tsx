
// // /components/courses/trending-courses-list.tsx

// 'use client';

// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { TrendingUp, Users, Star, Eye, Clock, ArrowRight } from 'lucide-react';
// import Link from 'next/link';
// import Image from 'next/image';

// interface Course {
//   id: string;
//   slug: string;
//   title: string;
//   subtitle?: string;
//   short_description?: string;
//   thumbnail_url?: string;
//   instructor_name?: string;
//   category_name?: string;
//   price_cents: number;
//   enrolled_students_count?: number;
//   average_rating?: number | string | null;
//   total_views?: number;
//   total_video_duration?: number;
//   tags?: Array<{
//     id: string;
//     name: string;
//     slug: string;
//     color: string;
//   }>;
// }

// interface TrendingCoursesListProps {
//   courses: Course[];
//   title?: string;
//   description?: string;
//   limit?: number;
//   showViewAll?: boolean;
//   variant?: 'default' | 'compact' | 'grid';
// }

// export function TrendingCoursesList({ 
//   courses, 
//   title = "Trending Courses", 
//   description = "Most popular courses based on student engagement",
//   limit,
//   showViewAll = true,
//   variant = 'default'
// }: TrendingCoursesListProps) {
//   // Apply limit if specified
//   const displayedCourses = limit ? courses.slice(0, limit) : courses;
  
//   if (displayedCourses.length === 0) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>{title}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-gray-500 text-center py-8">
//             No trending courses available at the moment.
//           </p>
//         </CardContent>
//       </Card>
//     );
//   }

//   // Format price
//   const formatPrice = (priceCents: number) => {
//     return priceCents === 0 ? 'Free' : `$${(priceCents / 100).toFixed(2)}`;
//   };

//   // Safely format rating
//   const formatRating = (rating: number | string | null | undefined): string => {
//     if (rating === null || rating === undefined) return '0.0';
    
//     const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
//     if (isNaN(numRating)) return '0.0';
    
//     return numRating.toFixed(1);
//   };

//   // Safely format numbers with commas
//   const formatNumber = (num: number | string | null | undefined): string => {
//     if (num === null || num === undefined) return '0';
    
//     const numValue = typeof num === 'string' ? parseFloat(num) : num;
//     if (isNaN(numValue)) return '0';
    
//     return numValue.toLocaleString();
//   };

//   // Get category badge color
//   const getCategoryColor = (category?: string) => {
//     if (!category) return 'bg-gray-100 text-gray-800';
    
//     const colors: Record<string, string> = {
//       'Programming': 'bg-orange-100 text-orange-800',
//       'Web Development': 'bg-blue-100 text-blue-800',
//       'Data Science': 'bg-green-100 text-green-800',
//       'Design': 'bg-purple-100 text-purple-800',
//       'Business': 'bg-red-100 text-red-800',
//       'default': 'bg-gray-100 text-gray-800'
//     };
//     return colors[category] || colors.default;
//   };

//   if (variant === 'compact') {
//     return (
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <h3 className="text-lg font-semibold">{title}</h3>
//             {description && <p className="text-sm text-gray-500">{description}</p>}
//           </div>
//           {showViewAll && (
//             <Button variant="ghost" size="sm" asChild>
//               <Link href="/courses?sort=trending">
//                 View All
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Link>
//             </Button>
//           )}
//         </div>
        
//         <div className="space-y-3">
//           {displayedCourses.map((course, index) => (
//             <Link 
//               key={course.id} 
//               href={`/courses/${course.slug}`}
//               className="flex items-center gap-3 p-3 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-all group"
//             >
//               <div className="flex-shrink-0">
//                 <div className="w-12 h-12 rounded-md bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
//                   {index < 3 ? (
//                     <span className="text-blue-700 font-bold text-lg">#{index + 1}</span>
//                   ) : (
//                     <TrendingUp className="h-6 w-6 text-blue-600" />
//                   )}
//                 </div>
//               </div>
              
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 mb-1">
//                   <span className="text-sm font-medium text-gray-900 truncate">
//                     {course.title}
//                   </span>
//                   {index < 3 && (
//                     <Badge variant="outline" className="text-xs">
//                       #{index + 1}
//                     </Badge>
//                   )}
//                 </div>
                
//                 <div className="flex items-center gap-4 text-xs text-gray-500">
//                   <div className="flex items-center gap-1">
//                     <Users className="h-3 w-3" />
//                     <span>{formatNumber(course.enrolled_students_count)}</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
//                     <span>{formatRating(course.average_rating)}</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Eye className="h-3 w-3" />
//                     <span>{formatNumber(course.total_views)}</span>
//                   </div>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (variant === 'grid') {
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold">{title}</h2>
//             {description && <p className="text-gray-600 mt-1">{description}</p>}
//           </div>
//           {showViewAll && (
//             <Button asChild>
//               <Link href="/courses?sort=trending">
//                 Browse All Courses
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Link>
//             </Button>
//           )}
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {displayedCourses.map((course, index) => (
//             <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
//               <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100">
//                 {course.thumbnail_url ? (
//                   <div className="relative w-full h-full">
//                     <Image
//                       src={course.thumbnail_url}
//                       alt={course.title}
//                       fill
//                       className="object-cover"
//                       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                     />
//                   </div>
//                 ) : (
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <TrendingUp className="h-16 w-16 text-blue-300" />
//                   </div>
//                 )}
//                 {index < 3 && (
//                   <div className="absolute top-3 left-3">
//                     <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//                       Trending #{index + 1}
//                     </Badge>
//                   </div>
//                 )}
//                 <div className="absolute bottom-3 right-3">
//                   <Badge variant="secondary">
//                     {formatPrice(course.price_cents)}
//                   </Badge>
//                 </div>
//               </div>
              
//               <CardContent className="p-5">
//                 <div className="flex items-start justify-between mb-3">
//                   <h3 className="font-bold text-lg line-clamp-2">
//                     {course.title}
//                   </h3>
//                 </div>
                
//                 <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                   {course.short_description || course.subtitle || ''}
//                 </p>
                
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center gap-4 text-sm text-gray-500">
//                     <div className="flex items-center gap-1">
//                       <Users className="h-4 w-4" />
//                       <span>{formatNumber(course.enrolled_students_count)}</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                       <span>{formatRating(course.average_rating)}</span>
//                     </div>
//                   </div>
                  
//                   {course.category_name && (
//                     <Badge variant="outline" className={getCategoryColor(course.category_name)}>
//                       {course.category_name}
//                     </Badge>
//                   )}
//                 </div>
                
//                 <Button className="w-full" asChild>
//                   <Link href={`/courses/${course.slug}`}>
//                     View Course
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </Link>
//                 </Button>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // Default variant (list)
//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <div>
//             <CardTitle className="flex items-center gap-2">
//               <TrendingUp className="h-5 w-5 text-blue-600" />
//               {title}
//             </CardTitle>
//             {description && (
//               <p className="text-sm text-gray-500 mt-1">{description}</p>
//             )}
//           </div>
//           {showViewAll && (
//             <Button variant="ghost" size="sm" asChild>
//               <Link href="/courses?sort=trending">
//                 View All
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Link>
//             </Button>
//           )}
//         </div>
//       </CardHeader>
      
//       <CardContent>
//         <div className="space-y-4">
//           {displayedCourses.map((course, index) => (
//             <Link
//               key={course.id}
//               href={`/courses/${course.slug}`}
//               className="flex items-start gap-4 p-4 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-all group"
//             >
//               <div className="flex-shrink-0 relative">
//                 <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
//                   {index < 3 ? (
//                     <div className="text-blue-700 font-bold text-lg">#{index + 1}</div>
//                   ) : (
//                     <TrendingUp className="h-6 w-6 text-blue-600" />
//                   )}
//                 </div>
//               </div>
              
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-start justify-between mb-2">
//                   <div>
//                     <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 truncate">
//                       {course.title}
//                     </h4>
//                     <p className="text-sm text-gray-500 truncate">
//                       {course.instructor_name || 'Instructor'}
//                     </p>
//                   </div>
                  
//                   <div className="flex items-center gap-2">
//                     {course.category_name && (
//                       <Badge variant="outline" className={getCategoryColor(course.category_name)}>
//                         {course.category_name}
//                       </Badge>
//                     )}
//                     <Badge variant="secondary" className="whitespace-nowrap">
//                       {formatPrice(course.price_cents)}
//                     </Badge>
//                   </div>
//                 </div>
                
//                 <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//                   {course.short_description || course.subtitle || ''}
//                 </p>
                
//                 <div className="flex items-center gap-4 text-xs text-gray-500">
//                   <div className="flex items-center gap-1">
//                     <Users className="h-3 w-3" />
//                     <span>{formatNumber(course.enrolled_students_count)} students</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
//                     <span>{formatRating(course.average_rating)} rating</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Clock className="h-3 w-3" />
//                     <span>{course.total_video_duration || 0} min</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Eye className="h-3 w-3" />
//                     <span>{formatNumber(course.total_views)} views</span>
//                   </div>
//                 </div>
                
//                 {/* Course tags */}
//                 {course.tags && course.tags.length > 0 && (
//                   <div className="flex flex-wrap gap-1 mt-3">
//                     {course.tags.slice(0, 3).map((tag) => (
//                       <Badge key={tag.id} variant="outline" className="text-xs">
//                         {tag.name}
//                       </Badge>
//                     ))}
//                     {course.tags.length > 3 && (
//                       <span className="text-xs text-gray-500">+{course.tags.length - 3} more</span>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </Link>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }























// 'use client';

// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { TrendingUp, Users, Star, Eye, Clock, ArrowRight } from 'lucide-react';
// import Link from 'next/link';

// interface Course {
//   id: string;
//   slug: string;
//   title: string;
//   subtitle?: string;
//   short_description?: string;
//   thumbnail_url?: string;
//   instructor_name?: string;
//   category_name?: string;
//   price_cents: number;
//   enrolled_students_count?: number;
//   average_rating?: number | string | null;
//   total_views?: number;
//   total_video_duration?: number;
//   tags?: Array<{
//     id: string;
//     name: string;
//     slug: string;
//     color: string;
//   }>;
// }

// interface TrendingCoursesListProps {
//   courses: Course[];
//   title?: string;
//   description?: string;
//   limit?: number;
//   showViewAll?: boolean;
//   variant?: 'default' | 'compact' | 'grid';
// }

// export function TrendingCoursesList({ 
//   courses, 
//   title = "Trending Courses", 
//   description = "Most popular courses based on student engagement",
//   limit,
//   showViewAll = true,
//   variant = 'default'
// }: TrendingCoursesListProps) {
//   // Apply limit if specified
//   const displayedCourses = limit ? courses.slice(0, limit) : courses;
  
//   if (displayedCourses.length === 0) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>{title}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-gray-500 text-center py-8">
//             No trending courses available at the moment.
//           </p>
//         </CardContent>
//       </Card>
//     );
//   }

//   // Format price
//   const formatPrice = (priceCents: number) => {
//     return priceCents === 0 ? 'Free' : `$${(priceCents / 100).toFixed(2)}`;
//   };

//   // Safely format rating
//   const formatRating = (rating: number | string | null | undefined): string => {
//     if (rating === null || rating === undefined) return '0.0';
    
//     const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
//     if (isNaN(numRating)) return '0.0';
    
//     return numRating.toFixed(1);
//   };

//   // Safely format numbers with commas
//   const formatNumber = (num: number | string | null | undefined): string => {
//     if (num === null || num === undefined) return '0';
    
//     const numValue = typeof num === 'string' ? parseFloat(num) : num;
//     if (isNaN(numValue)) return '0';
    
//     return numValue.toLocaleString();
//   };

//   // Get category badge color
//   const getCategoryColor = (category?: string) => {
//     if (!category) return 'bg-gray-100 text-gray-800';
    
//     const colors: Record<string, string> = {
//       'Programming': 'bg-orange-100 text-orange-800',
//       'Web Development': 'bg-blue-100 text-blue-800',
//       'Data Science': 'bg-green-100 text-green-800',
//       'Design': 'bg-purple-100 text-purple-800',
//       'Business': 'bg-red-100 text-red-800',
//       'default': 'bg-gray-100 text-gray-800'
//     };
//     return colors[category] || colors.default;
//   };

//   // Get default thumbnail if none provided
//   const getThumbnailUrl = (url?: string) => {
//     if (url) return url;
//     return '/placeholder-course.png';
//   };

//   if (variant === 'compact') {
//     return (
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <h3 className="text-lg font-semibold">{title}</h3>
//             {description && <p className="text-sm text-gray-500">{description}</p>}
//           </div>
//           {showViewAll && (
//             <Button variant="ghost" size="sm" asChild>
//               <Link href="/courses?sort=trending">
//                 View All
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Link>
//             </Button>
//           )}
//         </div>
        
//         <div className="space-y-3">
//           {displayedCourses.map((course, index) => (
//             <Link 
//               key={course.id} 
//               href={`/courses/${course.slug}`}
//               className="flex items-center gap-3 p-3 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-all group"
//             >
//               <div className="flex-shrink-0">
//                 <div className="w-12 h-12 rounded-md bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
//                   {index < 3 ? (
//                     <span className="text-blue-700 font-bold text-lg">#{index + 1}</span>
//                   ) : (
//                     <TrendingUp className="h-6 w-6 text-blue-600" />
//                   )}
//                 </div>
//               </div>
              
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 mb-1">
//                   <span className="text-sm font-medium text-gray-900 truncate">
//                     {course.title}
//                   </span>
//                   {index < 3 && (
//                     <Badge variant="outline" className="text-xs">
//                       #{index + 1}
//                     </Badge>
//                   )}
//                 </div>
                
//                 <div className="flex items-center gap-4 text-xs text-gray-500">
//                   <div className="flex items-center gap-1">
//                     <Users className="h-3 w-3" />
//                     <span>{formatNumber(course.enrolled_students_count)}</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
//                     <span>{formatRating(course.average_rating)}</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Eye className="h-3 w-3" />
//                     <span>{formatNumber(course.total_views)}</span>
//                   </div>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (variant === 'grid') {
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold">{title}</h2>
//             {description && <p className="text-gray-600 mt-1">{description}</p>}
//           </div>
//           {showViewAll && (
//             <Button asChild>
//               <Link href="/courses?sort=trending">
//                 Browse All Courses
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Link>
//             </Button>
//           )}
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {displayedCourses.map((course, index) => (
//             <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
//               <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
//                 <img
//                   src={getThumbnailUrl(course.thumbnail_url)}
//                   alt={course.title}
//                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                   onError={(e) => {
//                     // Fallback if image fails to load
//                     const target = e.target as HTMLImageElement;
//                     target.src = '/placeholder-course.png';
//                   }}
//                 />
//                 {index < 3 && (
//                   <div className="absolute top-3 left-3">
//                     <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//                       Trending #{index + 1}
//                     </Badge>
//                   </div>
//                 )}
//                 <div className="absolute bottom-3 right-3">
//                   <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
//                     {formatPrice(course.price_cents)}
//                   </Badge>
//                 </div>
//               </div>
              
//               <CardContent className="p-5">
//                 <div className="flex items-start justify-between mb-3">
//                   <h3 className="font-bold text-lg line-clamp-2 group-hover:text-blue-700 transition-colors">
//                     {course.title}
//                   </h3>
//                 </div>
                
//                 <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                   {course.short_description || course.subtitle || ''}
//                 </p>
                
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center gap-4 text-sm text-gray-500">
//                     <div className="flex items-center gap-1">
//                       <Users className="h-4 w-4" />
//                       <span>{formatNumber(course.enrolled_students_count)}</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                       <span>{formatRating(course.average_rating)}</span>
//                     </div>
//                   </div>
                  
//                   {course.category_name && (
//                     <Badge variant="outline" className={getCategoryColor(course.category_name)}>
//                       {course.category_name}
//                     </Badge>
//                   )}
//                 </div>
                
//                 <Button className="w-full group/btn" asChild>
//                   <Link href={`/courses/${course.slug}`}>
//                     View Course
//                     <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
//                   </Link>
//                 </Button>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // Default variant (list)
//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <div>
//             <CardTitle className="flex items-center gap-2">
//               <TrendingUp className="h-5 w-5 text-blue-600" />
//               {title}
//             </CardTitle>
//             {description && (
//               <p className="text-sm text-gray-500 mt-1">{description}</p>
//             )}
//           </div>
//           {showViewAll && (
//             <Button variant="ghost" size="sm" asChild>
//               <Link href="/courses?sort=trending">
//                 View All
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Link>
//             </Button>
//           )}
//         </div>
//       </CardHeader>
      
//       <CardContent>
//         <div className="space-y-4">
//           {displayedCourses.map((course, index) => (
//             <Link
//               key={course.id}
//               href={`/courses/${course.slug}`}
//               className="flex items-start gap-4 p-4 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-all group"
//             >
//               {/* Course Image */}
//               <div className="flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
//                 <img
//                   src={getThumbnailUrl(course.thumbnail_url)}
//                   alt={course.title}
//                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                   onError={(e) => {
//                     // Fallback if image fails to load
//                     const target = e.target as HTMLImageElement;
//                     target.src = '/placeholder-course.png';
//                   }}
//                 />
//                 <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
//                   {index < 9 ? `#${index + 1}` : '★'}
//                 </div>
//               </div>
              
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-start justify-between mb-2">
//                   <div>
//                     <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 truncate">
//                       {course.title}
//                     </h4>
//                     <p className="text-sm text-gray-500 truncate">
//                       {course.instructor_name || 'Instructor'}
//                     </p>
//                   </div>
                  
//                   <div className="flex items-center gap-2">
//                     {course.category_name && (
//                       <Badge variant="outline" className={getCategoryColor(course.category_name)}>
//                         {course.category_name}
//                       </Badge>
//                     )}
//                     <Badge variant="secondary" className="whitespace-nowrap">
//                       {formatPrice(course.price_cents)}
//                     </Badge>
//                   </div>
//                 </div>
                
//                 <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//                   {course.short_description || course.subtitle || ''}
//                 </p>
                
//                 <div className="flex items-center gap-4 text-xs text-gray-500">
//                   <div className="flex items-center gap-1">
//                     <Users className="h-3 w-3" />
//                     <span>{formatNumber(course.enrolled_students_count)} students</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
//                     <span>{formatRating(course.average_rating)} rating</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Clock className="h-3 w-3" />
//                     <span>{course.total_video_duration || 0} min</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Eye className="h-3 w-3" />
//                     <span>{formatNumber(course.total_views)} views</span>
//                   </div>
//                 </div>
                
//                 {/* Course tags */}
//                 {course.tags && course.tags.length > 0 && (
//                   <div className="flex flex-wrap gap-1 mt-3">
//                     {course.tags.slice(0, 3).map((tag) => (
//                       <Badge key={tag.id} variant="outline" className="text-xs">
//                         {tag.name}
//                       </Badge>
//                     ))}
//                     {course.tags.length > 3 && (
//                       <span className="text-xs text-gray-500">+{course.tags.length - 3} more</span>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </Link>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


























// /components/courses/trending-courses-list.tsx

// 'use client';

// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { TrendingUp, Users, Star, Eye, Clock, ArrowRight } from 'lucide-react';
// import Link from 'next/link';

// interface Course {
//   id: string;
//   slug: string;
//   title: string;
//   subtitle?: string;
//   short_description?: string;
//   thumbnail_url?: string;
//   instructor_name?: string;
//   category_name?: string;
//   price_cents: number;
//   enrolled_students_count?: number;
//   average_rating?: number | string | null;
//   total_views?: number;
//   total_video_duration?: number;
//   tags?: Array<{
//     id: string;
//     name: string;
//     slug: string;
//     color: string;
//   }>;
// }

// interface TrendingCoursesListProps {
//   courses: Course[];
//   title?: string;
//   description?: string;
//   limit?: number;
//   showViewAll?: boolean;
//   variant?: 'default' | 'compact' | 'grid';
// }

// export function TrendingCoursesList({ 
//   courses, 
//   title = "Trending Courses", 
//   description = "Most popular courses based on student engagement",
//   limit,
//   showViewAll = true,
//   variant = 'default'
// }: TrendingCoursesListProps) {
//   // Apply limit if specified
//   const displayedCourses = limit ? courses.slice(0, limit) : courses;
  
//   if (displayedCourses.length === 0) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>{title}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-gray-500 text-center py-8">
//             No trending courses available at the moment.
//           </p>
//         </CardContent>
//       </Card>
//     );
//   }

//   // Format price
//   const formatPrice = (priceCents: number) => {
//     return priceCents === 0 ? 'Free' : `$${(priceCents / 100).toFixed(2)}`;
//   };

//   // Safely format rating (same as course-manager.tsx)
//   const formatRating = (rating: any): string => {
//     if (rating === null || rating === undefined) return '0.0';
    
//     const numRating = typeof rating === 'string' ? parseFloat(rating) : Number(rating);
    
//     if (isNaN(numRating)) return '0.0';
    
//     return numRating.toFixed(1);
//   };

//   // Safely format numbers with commas
//   const formatNumber = (num: number | string | null | undefined): string => {
//     if (num === null || num === undefined) return '0';
    
//     const numValue = typeof num === 'string' ? parseFloat(num) : num;
//     if (isNaN(numValue)) return '0';
    
//     return numValue.toLocaleString();
//   };

//   // Get category badge color
//   const getCategoryColor = (category?: string) => {
//     if (!category) return 'bg-gray-100 text-gray-800';
    
//     const colors: Record<string, string> = {
//       'Programming': 'bg-orange-100 text-orange-800',
//       'Web Development': 'bg-blue-100 text-blue-800',
//       'Data Science': 'bg-green-100 text-green-800',
//       'Design': 'bg-purple-100 text-purple-800',
//       'Business': 'bg-red-100 text-red-800',
//       'default': 'bg-gray-100 text-gray-800'
//     };
//     return colors[category] || colors.default;
//   };

//   if (variant === 'compact') {
//     return (
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <h3 className="text-lg font-semibold">{title}</h3>
//             {description && <p className="text-sm text-gray-500">{description}</p>}
//           </div>
//           {showViewAll && (
//             <Button variant="ghost" size="sm" asChild>
//               <Link href="/courses?sort=trending">
//                 View All
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Link>
//             </Button>
//           )}
//         </div>
        
//         <div className="space-y-3">
//           {displayedCourses.map((course, index) => (
//             <Link 
//               key={course.id} 
//               href={`/courses/${course.slug}`}
//               className="flex items-center gap-3 p-3 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-all group"
//             >
//               <div className="flex-shrink-0">
//                 <div className="w-12 h-12 rounded-md bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
//                   {index < 3 ? (
//                     <span className="text-blue-700 font-bold text-lg">#{index + 1}</span>
//                   ) : (
//                     <TrendingUp className="h-6 w-6 text-blue-600" />
//                   )}
//                 </div>
//               </div>
              
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 mb-1">
//                   <span className="text-sm font-medium text-gray-900 truncate">
//                     {course.title}
//                   </span>
//                   {index < 3 && (
//                     <Badge variant="outline" className="text-xs">
//                       #{index + 1}
//                     </Badge>
//                   )}
//                 </div>
                
//                 <div className="flex items-center gap-4 text-xs text-gray-500">
//                   <div className="flex items-center gap-1">
//                     <Users className="h-3 w-3" />
//                     <span>{formatNumber(course.enrolled_students_count)}</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
//                     <span>{formatRating(course.average_rating)}</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Eye className="h-3 w-3" />
//                     <span>{formatNumber(course.total_views)}</span>
//                   </div>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (variant === 'grid') {
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold">{title}</h2>
//             {description && <p className="text-gray-600 mt-1">{description}</p>}
//           </div>
//           {showViewAll && (
//             <Button asChild>
//               <Link href="/courses?sort=trending">
//                 Browse All Courses
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Link>
//             </Button>
//           )}
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {displayedCourses.map((course, index) => (
//             <div key={course.id} className="group">
//               <Link href={`/courses/${course.slug}`}>
//                 <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer h-full border border-gray-100">
//                   {/* Course Image with Play Button - EXACTLY LIKE OTHER COMPONENTS */}
//                   <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
//                     <img
//                       src={course.thumbnail_url || "/placeholder-course.png"}
//                       alt={course.title}
//                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                     />
//                     {index < 3 && (
//                       <div className="absolute top-3 left-3">
//                         <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//                           Trending #{index + 1}
//                         </Badge>
//                       </div>
//                     )}
//                     <div className="absolute bottom-3 right-3">
//                       <Badge className="bg-white text-gray-900 font-bold border-0 shadow-sm">
//                         {formatPrice(course.price_cents)}
//                       </Badge>
//                     </div>
//                   </div>
                  
//                   {/* Course Info */}
//                   <div className="p-5">
//                     {/* Category */}
//                     {course.category_name && (
//                       <Badge variant="outline" className="text-xs mb-2">
//                         {course.category_name}
//                       </Badge>
//                     )}
                    
//                     <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 leading-tight">
//                       {course.title}
//                     </h3>
                    
//                     <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                       {course.short_description || course.subtitle || ''}
//                     </p>
                    
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center gap-4 text-sm text-gray-500">
//                         <div className="flex items-center gap-1">
//                           <Users className="h-4 w-4" />
//                           <span>{formatNumber(course.enrolled_students_count)}</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                           <span>{formatRating(course.average_rating)}</span>
//                         </div>
//                       </div>
                      
//                       {course.category_name && (
//                         <Badge variant="outline" className={getCategoryColor(course.category_name)}>
//                           {course.category_name}
//                         </Badge>
//                       )}
//                     </div>
                    
//                     <Button className="w-full group/btn" asChild>
//                       <Link href={`/courses/${course.slug}`}>
//                         View Course
//                         <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
//                       </Link>
//                     </Button>
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // Default variant (list)
//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <div>
//             <CardTitle className="flex items-center gap-2">
//               <TrendingUp className="h-5 w-5 text-blue-600" />
//               {title}
//             </CardTitle>
//             {description && (
//               <p className="text-sm text-gray-500 mt-1">{description}</p>
//             )}
//           </div>
//           {showViewAll && (
//             <Button variant="ghost" size="sm" asChild>
//               <Link href="/courses?sort=trending">
//                 View All
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Link>
//             </Button>
//           )}
//         </div>
//       </CardHeader>
      
//       <CardContent>
//         <div className="space-y-4">
//           {displayedCourses.map((course, index) => (
//             <Link
//               key={course.id}
//               href={`/courses/${course.slug}`}
//               className="flex items-start gap-4 p-4 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-all group"
//             >
//               {/* Course Image - EXACTLY LIKE OTHER COMPONENTS */}
//               <div className="flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
//                 <img
//                   src={course.thumbnail_url || "/placeholder-course.png"}
//                   alt={course.title}
//                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                 />
//                 <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
//                   {index < 9 ? `#${index + 1}` : '★'}
//                 </div>
//               </div>
              
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-start justify-between mb-2">
//                   <div>
//                     <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 truncate">
//                       {course.title}
//                     </h4>
//                     <p className="text-sm text-gray-500 truncate">
//                       {course.instructor_name || 'Instructor'}
//                     </p>
//                   </div>
                  
//                   <div className="flex items-center gap-2">
//                     {course.category_name && (
//                       <Badge variant="outline" className={getCategoryColor(course.category_name)}>
//                         {course.category_name}
//                       </Badge>
//                     )}
//                     <Badge variant="secondary" className="whitespace-nowrap">
//                       {formatPrice(course.price_cents)}
//                     </Badge>
//                   </div>
//                 </div>
                
//                 <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//                   {course.short_description || course.subtitle || ''}
//                 </p>
                
//                 <div className="flex items-center gap-4 text-xs text-gray-500">
//                   <div className="flex items-center gap-1">
//                     <Users className="h-3 w-3" />
//                     <span>{formatNumber(course.enrolled_students_count)} students</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
//                     <span>{formatRating(course.average_rating)} rating</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Clock className="h-3 w-3" />
//                     <span>{course.total_video_duration || 0} min</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Eye className="h-3 w-3" />
//                     <span>{formatNumber(course.total_views)} views</span>
//                   </div>
//                 </div>
                
//                 {/* Course tags */}
//                 {course.tags && course.tags.length > 0 && (
//                   <div className="flex flex-wrap gap-1 mt-3">
//                     {course.tags.slice(0, 3).map((tag) => (
//                       <Badge key={tag.id} variant="outline" className="text-xs">
//                         {tag.name}
//                       </Badge>
//                     ))}
//                     {course.tags.length > 3 && (
//                       <span className="text-xs text-gray-500">+{course.tags.length - 3} more</span>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </Link>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


















// // /components/courses/trending-courses-list.tsx

// 'use client';

// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { TrendingUp, Users, Star, Eye, Clock, ArrowRight } from 'lucide-react';
// import Link from 'next/link';

// interface Course {
//   id: string;
//   slug: string;
//   title: string;
//   subtitle?: string;
//   short_description?: string;
//   thumbnail_url?: string;
//   instructor_name?: string;
//   category_name?: string;
//   price_cents: number;
//   enrolled_students_count?: number;
//   average_rating?: number | string | null;
//   total_views?: number;
//   total_video_duration?: number;
//   tags?: Array<{
//     id: string;
//     name: string;
//     slug: string;
//     color: string;
//   }>;
// }

// interface TrendingCoursesListProps {
//   courses: Course[];
//   title?: string;
//   description?: string;
//   limit?: number;
//   showViewAll?: boolean;
//   variant?: 'default' | 'compact' | 'grid';
// }

// export function TrendingCoursesList({ 
//   courses, 
//   title = "Trending Courses", 
//   description = "Most popular courses based on student engagement",
//   limit,
//   showViewAll = true,
//   variant = 'default'
// }: TrendingCoursesListProps) {
//   // Apply limit if specified
//   const displayedCourses = limit ? courses.slice(0, limit) : courses;
  
//   if (displayedCourses.length === 0) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>{title}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-gray-500 text-center py-8">
//             No trending courses available at the moment.
//           </p>
//         </CardContent>
//       </Card>
//     );
//   }

//   // Format price
//   const formatPrice = (priceCents: number) => {
//     return priceCents === 0 ? 'Free' : `$${(priceCents / 100).toFixed(2)}`;
//   };

//   // Safely format rating
//   const formatRating = (rating: any): string => {
//     if (rating === null || rating === undefined) return '0.0';
    
//     const numRating = typeof rating === 'string' ? parseFloat(rating) : Number(rating);
    
//     if (isNaN(numRating)) return '0.0';
    
//     return numRating.toFixed(1);
//   };

//   // Safely format numbers with commas
//   const formatNumber = (num: number | string | null | undefined): string => {
//     if (num === null || num === undefined) return '0';
    
//     const numValue = typeof num === 'string' ? parseFloat(num) : num;
//     if (isNaN(numValue)) return '0';
    
//     return numValue.toLocaleString();
//   };

//   // Get category badge color
//   const getCategoryColor = (category?: string) => {
//     if (!category) return 'bg-gray-100 text-gray-800';
    
//     const colors: Record<string, string> = {
//       'Programming': 'bg-orange-100 text-orange-800',
//       'Web Development': 'bg-blue-100 text-blue-800',
//       'Data Science': 'bg-green-100 text-green-800',
//       'Design': 'bg-purple-100 text-purple-800',
//       'Business': 'bg-red-100 text-red-800',
//       'default': 'bg-gray-100 text-gray-800'
//     };
//     return colors[category] || colors.default;
//   };

//   if (variant === 'compact') {
//     return (
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <h3 className="text-lg font-semibold">{title}</h3>
//             {description && <p className="text-sm text-gray-500">{description}</p>}
//           </div>
//           {showViewAll && (
//             <Button variant="ghost" size="sm" asChild>
//               <Link href="/courses?sort=trending">
//                 View All
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Link>
//             </Button>
//           )}
//         </div>
        
//         <div className="space-y-3">
//           {displayedCourses.map((course, index) => (
//             <Link 
//               key={course.id} 
//               href={`/courses/${course.slug}`}
//               className="flex items-center gap-3 p-3 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-all group"
//             >
//               {/* Course Image - SHOW ACTUAL THUMBNAIL */}
//               <div className="flex-shrink-0">
//                 <div className="w-12 h-12 rounded-md overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
//                   <img
//                     src={course.thumbnail_url || "/placeholder-course.png"}
//                     alt={course.title}
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                   />
//                 </div>
//               </div>
              
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 mb-1">
//                   <span className="text-sm font-medium text-gray-900 truncate">
//                     {course.title}
//                   </span>
//                   {index < 3 && (
//                     <Badge variant="outline" className="text-xs">
//                       #{index + 1}
//                     </Badge>
//                   )}
//                 </div>
                
//                 <div className="flex items-center gap-4 text-xs text-gray-500">
//                   <div className="flex items-center gap-1">
//                     <Users className="h-3 w-3" />
//                     <span>{formatNumber(course.enrolled_students_count)}</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
//                     <span>{formatRating(course.average_rating)}</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Eye className="h-3 w-3" />
//                     <span>{formatNumber(course.total_views)}</span>
//                   </div>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (variant === 'grid') {
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold">{title}</h2>
//             {description && <p className="text-gray-600 mt-1">{description}</p>}
//           </div>
//           {showViewAll && (
//             <Button asChild>
//               <Link href="/courses?sort=trending">
//                 Browse All Courses
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Link>
//             </Button>
//           )}
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {displayedCourses.map((course, index) => (
//             <div key={course.id} className="group">
//               <Link href={`/courses/${course.slug}`}>
//                 <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer h-full border border-gray-100">
//                   {/* Course Image */}
//                   <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
//                     <img
//                       src={course.thumbnail_url || "/placeholder-course.png"}
//                       alt={course.title}
//                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                     />
//                     {index < 3 && (
//                       <div className="absolute top-3 left-3">
//                         <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//                           Trending #{index + 1}
//                         </Badge>
//                       </div>
//                     )}
//                     <div className="absolute bottom-3 right-3">
//                       <Badge className="bg-white text-gray-900 font-bold border-0 shadow-sm">
//                         {formatPrice(course.price_cents)}
//                       </Badge>
//                     </div>
//                   </div>
                  
//                   {/* Course Info */}
//                   <div className="p-5">
//                     {/* Category */}
//                     {course.category_name && (
//                       <Badge variant="outline" className="text-xs mb-2">
//                         {course.category_name}
//                       </Badge>
//                     )}
                    
//                     <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 leading-tight">
//                       {course.title}
//                     </h3>
                    
//                     <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                       {course.short_description || course.subtitle || ''}
//                     </p>
                    
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center gap-4 text-sm text-gray-500">
//                         <div className="flex items-center gap-1">
//                           <Users className="h-4 w-4" />
//                           <span>{formatNumber(course.enrolled_students_count)}</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                           <span>{formatRating(course.average_rating)}</span>
//                         </div>
//                       </div>
                      
//                       {course.category_name && (
//                         <Badge variant="outline" className={getCategoryColor(course.category_name)}>
//                           {course.category_name}
//                         </Badge>
//                       )}
//                     </div>
                    
//                     <Button className="w-full group/btn" asChild>
//                       <Link href={`/courses/${course.slug}`}>
//                         View Course
//                         <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
//                       </Link>
//                     </Button>
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // Default variant (list)
//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <div>
//             <CardTitle className="flex items-center gap-2">
//               <TrendingUp className="h-5 w-5 text-blue-600" />
//               {title}
//             </CardTitle>
//             {description && (
//               <p className="text-sm text-gray-500 mt-1">{description}</p>
//             )}
//           </div>
//           {showViewAll && (
//             <Button variant="ghost" size="sm" asChild>
//               <Link href="/courses?sort=trending">
//                 View All
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Link>
//             </Button>
//           )}
//         </div>
//       </CardHeader>
      
//       <CardContent>
//         <div className="space-y-4">
//           {displayedCourses.map((course, index) => (
//             <Link
//               key={course.id}
//               href={`/courses/${course.slug}`}
//               className="flex items-start gap-4 p-4 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-all group"
//             >
//               {/* Course Image */}
//               <div className="flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
//                 <img
//                   src={course.thumbnail_url || "/placeholder-course.png"}
//                   alt={course.title}
//                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                 />
//                 <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
//                   {index < 9 ? `#${index + 1}` : '★'}
//                 </div>
//               </div>
              
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-start justify-between mb-2">
//                   <div>
//                     <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 truncate">
//                       {course.title}
//                     </h4>
//                     <p className="text-sm text-gray-500 truncate">
//                       {course.instructor_name || 'Instructor'}
//                     </p>
//                   </div>
                  
//                   <div className="flex items-center gap-2">
//                     {course.category_name && (
//                       <Badge variant="outline" className={getCategoryColor(course.category_name)}>
//                         {course.category_name}
//                       </Badge>
//                     )}
//                     <Badge variant="secondary" className="whitespace-nowrap">
//                       {formatPrice(course.price_cents)}
//                     </Badge>
//                   </div>
//                 </div>
                
//                 <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//                   {course.short_description || course.subtitle || ''}
//                 </p>
                
//                 <div className="flex items-center gap-4 text-xs text-gray-500">
//                   <div className="flex items-center gap-1">
//                     <Users className="h-3 w-3" />
//                     <span>{formatNumber(course.enrolled_students_count)} students</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
//                     <span>{formatRating(course.average_rating)} rating</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Clock className="h-3 w-3" />
//                     <span>{course.total_video_duration || 0} min</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Eye className="h-3 w-3" />
//                     <span>{formatNumber(course.total_views)} views</span>
//                   </div>
//                 </div>
                
//                 {/* Course tags */}
//                 {course.tags && course.tags.length > 0 && (
//                   <div className="flex flex-wrap gap-1 mt-3">
//                     {course.tags.slice(0, 3).map((tag) => (
//                       <Badge key={tag.id} variant="outline" className="text-xs">
//                         {tag.name}
//                       </Badge>
//                     ))}
//                     {course.tags.length > 3 && (
//                       <span className="text-xs text-gray-500">+{course.tags.length - 3} more</span>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </Link>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }























// // /components/courses/trending-courses-list.tsx

// // /components/courses/trending-courses-list.tsx

// 'use client';

// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { TrendingUp, Users, Star, Eye, Clock, ArrowRight, Heart, Share2 } from 'lucide-react';
// import Link from 'next/link';

// interface Course {
//   id: string;
//   slug: string;
//   title: string;
//   subtitle?: string;
//   short_description?: string;
//   thumbnail_url?: string;
//   instructor_name?: string;
//   category_name?: string;
//   price_cents: number;
//   enrolled_students_count?: number;
//   average_rating?: number | string | null;
//   total_views?: number;
//   total_video_duration?: number;
//   review_count?: number; // Added review count from database queries
//   like_count?: number; // Added like count
//   share_count?: number; // Added share count
//   tags?: Array<{
//     id: string;
//     name: string;
//     slug: string;
//     color: string;
//   }>;
// }

// interface TrendingCoursesListProps {
//   courses: Course[];
//   title?: string;
//   description?: string;
//   limit?: number;
//   showViewAll?: boolean;
//   variant?: 'default' | 'compact' | 'grid';
// }

// export function TrendingCoursesList({ 
//   courses, 
//   title = "Trending Courses", 
//   description = "Most popular courses based on student engagement",
//   limit,
//   showViewAll = true,
//   variant = 'default'
// }: TrendingCoursesListProps) {
//   // Apply limit if specified
//   const displayedCourses = limit ? courses.slice(0, limit) : courses;
  
//   if (displayedCourses.length === 0) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>{title}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-gray-500 text-center py-8">
//             No trending courses available at the moment.
//           </p>
//         </CardContent>
//       </Card>
//     );
//   }

//   // Format price
//   const formatPrice = (priceCents: number) => {
//     return priceCents === 0 ? 'Free' : `$${(priceCents / 100).toFixed(2)}`;
//   };

//   // Safely format rating - EXACTLY LIKE COURSE PAGE
//   const formatRating = (rating: any): string | null => {
//     if (rating === null || rating === undefined) return null;
    
//     // Convert to number if it's a string
//     const numRating = typeof rating === 'string' ? parseFloat(rating) : Number(rating);
    
//     // Check if it's a valid number and greater than 0
//     if (isNaN(numRating) || numRating <= 0) return null;
    
//     return numRating.toFixed(1);
//   };

//   // Safely format numbers with commas
//   const formatNumber = (num: number | string | null | undefined): string => {
//     if (num === null || num === undefined) return '0';
    
//     const numValue = typeof num === 'string' ? parseFloat(num) : num;
//     if (isNaN(numValue)) return '0';
    
//     return numValue.toLocaleString();
//   };

//   // Format review count with "reviews" suffix
//   const formatReviewCount = (count: number | string | null | undefined): string => {
//     const num = formatNumber(count);
//     return `${num} review${parseInt(num) !== 1 ? 's' : ''}`;
//   };

//   // Get category badge color
//   const getCategoryColor = (category?: string) => {
//     if (!category) return 'bg-gray-100 text-gray-800';
    
//     const colors: Record<string, string> = {
//       'Programming': 'bg-orange-100 text-orange-800',
//       'Web Development': 'bg-blue-100 text-blue-800',
//       'Data Science': 'bg-green-100 text-green-800',
//       'Design': 'bg-purple-100 text-purple-800',
//       'Business': 'bg-red-100 text-red-800',
//       'default': 'bg-gray-100 text-gray-800'
//     };
//     return colors[category] || colors.default;
//   };

//   if (variant === 'compact') {
//     return (
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <h3 className="text-lg font-semibold">{title}</h3>
//             {description && <p className="text-sm text-gray-500">{description}</p>}
//           </div>
//           {showViewAll && (
//             <Button variant="ghost" size="sm" asChild>
//               <Link href="/courses?sort=trending">
//                 View All
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Link>
//             </Button>
//           )}
//         </div>
        
//         <div className="space-y-3">
//           {displayedCourses.map((course, index) => {
//             const rating = formatRating(course.average_rating);
//             const reviewCount = course.review_count || 0;
            
//             return (
//               <Link 
//                 key={course.id} 
//                 href={`/courses/${course.slug}`}
//                 className="flex items-center gap-3 p-3 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-all group"
//               >
//                 {/* Course Image */}
//                 <div className="flex-shrink-0">
//                   <div className="w-12 h-12 rounded-md overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
//                     <img
//                       src={course.thumbnail_url || "/placeholder-course.png"}
//                       alt={course.title}
//                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                     />
//                   </div>
//                 </div>
                
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 mb-1">
//                     <span className="text-sm font-medium text-gray-900 truncate">
//                       {course.title}
//                     </span>
//                     {index < 3 && (
//                       <Badge variant="outline" className="text-xs">
//                         #{index + 1}
//                       </Badge>
//                     )}
//                   </div>
                  
//                   <div className="flex items-center gap-4 text-xs text-gray-500">
//                     <div className="flex items-center gap-1">
//                       <Users className="h-3 w-3" />
//                       <span>{formatNumber(course.enrolled_students_count)}</span>
//                     </div>
//                     {rating ? (
//                       <div className="flex items-center gap-1">
//                         <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
//                         <span className="font-medium">{rating}</span>
//                         {reviewCount > 0 && (
//                           <span className="text-gray-500">({formatNumber(reviewCount)})</span>
//                         )}
//                       </div>
//                     ) : null}
//                     <div className="flex items-center gap-1">
//                       <Eye className="h-3 w-3" />
//                       <span>{formatNumber(course.total_views)}</span>
//                     </div>
//                     {/* Social Metrics for Compact View */}
//                     {(course.like_count || course.share_count) && (
//                       <div className="flex items-center gap-3 ml-2">
//                         {course.like_count && course.like_count > 0 && (
//                           <div className="flex items-center gap-1">
//                             <Heart className="h-3 w-3 text-red-500" />
//                             <span>{formatNumber(course.like_count)}</span>
//                           </div>
//                         )}
//                         {course.share_count && course.share_count > 0 && (
//                           <div className="flex items-center gap-1">
//                             <Share2 className="h-3 w-3 text-blue-500" />
//                             <span>{formatNumber(course.share_count)}</span>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     );
//   }

//   if (variant === 'grid') {
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold">{title}</h2>
//             {description && <p className="text-gray-600 mt-1">{description}</p>}
//           </div>
//           {showViewAll && (
//             <Button asChild>
//               <Link href="/courses?sort=trending">
//                 Browse All Courses
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Link>
//             </Button>
//           )}
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {displayedCourses.map((course, index) => {
//             const rating = formatRating(course.average_rating);
//             const reviewCount = course.review_count || 0;
            
//             return (
//               <div key={course.id} className="group">
//                 <Link href={`/courses/${course.slug}`}>
//                   <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer h-full border border-gray-100">
//                     {/* Course Image */}
//                     <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
//                       <img
//                         src={course.thumbnail_url || "/placeholder-course.png"}
//                         alt={course.title}
//                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                       />
//                       {index < 3 && (
//                         <div className="absolute top-3 left-3">
//                           <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//                             Trending #{index + 1}
//                           </Badge>
//                         </div>
//                       )}
//                       <div className="absolute bottom-3 right-3">
//                         <Badge className="bg-white text-gray-900 font-bold border-0 shadow-sm">
//                           {formatPrice(course.price_cents)}
//                         </Badge>
//                       </div>
//                     </div>
                    
//                     {/* Course Info */}
//                     <div className="p-5">
//                       {/* Category */}
//                       {course.category_name && (
//                         <Badge variant="outline" className="text-xs mb-2">
//                           {course.category_name}
//                         </Badge>
//                       )}
                      
//                       <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 leading-tight">
//                         {course.title}
//                       </h3>
                      
//                       <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                         {course.short_description || course.subtitle || ''}
//                       </p>
                      
//                       {/* Rating, Students, and Social Metrics */}
//                       <div className="flex flex-col gap-3 mb-4">
//                         <div className="flex items-center gap-4 text-sm text-gray-500">
//                           <div className="flex items-center gap-1">
//                             <Users className="h-4 w-4" />
//                             <span>{formatNumber(course.enrolled_students_count)}</span>
//                           </div>
//                           {rating ? (
//                             <div className="flex items-center gap-1">
//                               <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                               <span className="font-medium">{rating}</span>
//                               {reviewCount > 0 && (
//                                 <span className="text-gray-500">({formatNumber(reviewCount)})</span>
//                               )}
//                             </div>
//                           ) : (
//                             <div className="flex items-center gap-1 text-gray-400">
//                               <Star className="h-4 w-4" />
                          
//                             </div>
//                           )}
//                         </div>
                        
//                         {/* Social Engagement Metrics */}
//                         {(course.like_count || course.share_count) && (
//                           <div className="flex items-center gap-4 text-sm text-gray-500">
//                             {course.like_count && course.like_count > 0 && (
//                               <div className="flex items-center gap-1">
//                                 <Heart className="h-3 w-3 text-red-500" />
//                                 <span>{formatNumber(course.like_count)} likes</span>
//                               </div>
//                             )}
//                             {course.share_count && course.share_count > 0 && (
//                               <div className="flex items-center gap-1">
//                                 <Share2 className="h-3 w-3 text-blue-500" />
//                                 <span>{formatNumber(course.share_count)} shares</span>
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
                      
//                       <Button className="w-full group/btn" asChild>
//                         <Link href={`/courses/${course.slug}`}>
//                           View Course
//                           <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
//                         </Link>
//                       </Button>
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   }

//   // Default variant (list)
//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <div>
//             <CardTitle className="flex items-center gap-2">
//               <TrendingUp className="h-5 w-5 text-blue-600" />
//               {title}
//             </CardTitle>
//             {description && (
//               <p className="text-sm text-gray-500 mt-1">{description}</p>
//             )}
//           </div>
//           {showViewAll && (
//             <Button variant="ghost" size="sm" asChild>
//               <Link href="/courses?sort=trending">
//                 View All
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Link>
//             </Button>
//           )}
//         </div>
//       </CardHeader>
      
//       <CardContent>
//         <div className="space-y-4">
//           {displayedCourses.map((course, index) => {
//             const rating = formatRating(course.average_rating);
//             const reviewCount = course.review_count || 0;
            
//             return (
//               <Link
//                 key={course.id}
//                 href={`/courses/${course.slug}`}
//                 className="flex items-start gap-4 p-4 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-all group"
//               >
//                 {/* Course Image */}
//                 <div className="flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
//                   <img
//                     src={course.thumbnail_url || "/placeholder-course.png"}
//                     alt={course.title}
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                   />
//                   <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
//                     {index < 9 ? `#${index + 1}` : 'вҳ…'}
//                   </div>
//                 </div>
                
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-start justify-between mb-2">
//                     <div>
//                       <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 truncate">
//                         {course.title}
//                       </h4>
//                       <p className="text-sm text-gray-500 truncate">
//                         {course.instructor_name || 'Instructor'}
//                       </p>
//                     </div>
                    
//                     <div className="flex items-center gap-2">
//                       {course.category_name && (
//                         <Badge variant="outline" className={getCategoryColor(course.category_name)}>
//                           {course.category_name}
//                         </Badge>
//                       )}
//                       <Badge variant="secondary" className="whitespace-nowrap">
//                         {formatPrice(course.price_cents)}
//                       </Badge>
//                     </div>
//                   </div>
                  
//                   <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//                     {course.short_description || course.subtitle || ''}
//                   </p>
                  
//                   {/* Course Stats Row */}
//                   <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-3">
//                     <div className="flex items-center gap-1">
//                       <Users className="h-3 w-3" />
//                       <span>{formatNumber(course.enrolled_students_count)} students</span>
//                     </div>
                    
//                     {/* Rating with Review Count */}
//                     {rating ? (
//                       <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
//                         <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
//                         <span className="font-medium">{rating}</span>
//                         <span className="text-gray-600">
//                           ({reviewCount > 0 ? formatReviewCount(reviewCount) : 'No reviews'})
//                         </span>
//                       </div>
//                     ) : (
//                       <div className="flex items-center gap-1 text-gray-400 px-2 py-1 rounded-md">
//                         <Star className="h-3 w-3" />
                        
//                       </div>
//                     )}
                    
//                     <div className="flex items-center gap-1">
//                       <Clock className="h-3 w-3" />
//                       <span>{course.total_video_duration || 0} min</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Eye className="h-3 w-3" />
//                       <span>{formatNumber(course.total_views)} views</span>
//                     </div>
//                   </div>
                  
//                   {/* Social Engagement Metrics */}
//                   {(course.like_count || course.share_count) && (
//                     <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
//                       {course.like_count && course.like_count > 0 && (
//                         <div className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded-md">
//                           <Heart className="h-3 w-3 text-red-500" />
//                           <span className="font-medium">{formatNumber(course.like_count)} likes</span>
//                         </div>
//                       )}
//                       {course.share_count && course.share_count > 0 && (
//                         <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md">
//                           <Share2 className="h-3 w-3 text-blue-500" />
//                           <span className="font-medium">{formatNumber(course.share_count)} shares</span>
//                         </div>
//                       )}
//                     </div>
//                   )}
                  
//                   {/* Course tags */}
//                   {course.tags && course.tags.length > 0 && (
//                     <div className="flex flex-wrap gap-1 mt-3">
//                       {course.tags.slice(0, 3).map((tag) => (
//                         <Badge key={tag.id} variant="outline" className="text-xs">
//                           {tag.name}
//                         </Badge>
//                       ))}
//                       {course.tags.length > 3 && (
//                         <span className="text-xs text-gray-500">+{course.tags.length - 3} more</span>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
























'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Star, Eye, Clock, ArrowRight, Heart, Share2 } from 'lucide-react';
import Link from 'next/link';

interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  short_description?: string;
  thumbnail_url?: string;
  instructor_name?: string;
  category_name?: string;
  price_cents: number;
  enrolled_students_count?: number;
  average_rating?: number | string | null;
  total_views?: number;
  total_video_duration?: number;
  review_count?: number; // Added review count from database queries
  like_count?: number; // Added like count
  share_count?: number; // Added share count
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
    color: string;
  }>;
}

interface TrendingCoursesListProps {
  courses: Course[];
  title?: string;
  description?: string;
  limit?: number;
  showViewAll?: boolean;
  variant?: 'default' | 'compact' | 'grid';
}

export function TrendingCoursesList({ 
  courses, 
  title = "Trending Courses", 
  description = "Most popular courses based on student engagement",
  limit,
  showViewAll = true,
  variant = 'default'
}: TrendingCoursesListProps) {
  // Apply limit if specified
  const displayedCourses = limit ? courses.slice(0, limit) : courses;
  
  if (displayedCourses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            No trending courses available at the moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Format price
  const formatPrice = (priceCents: number) => {
    return priceCents === 0 ? 'Free' : `₦${(priceCents).toLocaleString('en-NG')}`;
  };

  // Safely format rating - EXACTLY LIKE COURSE PAGE
  const formatRating = (rating: any): string | null => {
    if (rating === null || rating === undefined) return null;
    
    // Convert to number if it's a string
    const numRating = typeof rating === 'string' ? parseFloat(rating) : Number(rating);
    
    // Check if it's a valid number and greater than 0
    if (isNaN(numRating) || numRating <= 0) return null;
    
    return numRating.toFixed(1);
  };

  // Safely format numbers with commas
  const formatNumber = (num: number | string | null | undefined): string => {
    if (num === null || num === undefined) return '0';
    
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(numValue)) return '0';
    
    return numValue.toLocaleString();
  };

  // Format duration - only show if exists and > 0
  const formatDuration = (minutes: number | undefined): string | null => {
    if (!minutes || minutes <= 0) return null;
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Format review count with "reviews" suffix
  const formatReviewCount = (count: number | string | null | undefined): string => {
    const num = formatNumber(count);
    return `${num} review${parseInt(num) !== 1 ? 's' : ''}`;
  };

  // Get category badge color
  const getCategoryColor = (category?: string) => {
    if (!category) return 'bg-gray-100 text-gray-800';
    
    const colors: Record<string, string> = {
      'Programming': 'bg-orange-100 text-orange-800',
      'Web Development': 'bg-blue-100 text-blue-800',
      'Data Science': 'bg-green-100 text-green-800',
      'Design': 'bg-purple-100 text-purple-800',
      'Business': 'bg-red-100 text-red-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.default;
  };

  if (variant === 'compact') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
          {showViewAll && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/courses?sort=trending">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
        
        <div className="space-y-3">
          {displayedCourses.map((course, index) => {
            const rating = formatRating(course.average_rating);
            const reviewCount = course.review_count || 0;
            
            return (
              <Link 
                key={course.id} 
                href={`/courses/${course.slug}`}
                className="flex items-center gap-3 p-3 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                {/* Course Image */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                    <img
                      src={course.thumbnail_url || "/placeholder-course.png"}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {course.title}
                    </span>
                    {index < 3 && (
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{formatNumber(course.enrolled_students_count)}</span>
                    </div>
                    {rating ? (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{rating}</span>
                        {reviewCount > 0 && (
                          <span className="text-gray-500">({formatNumber(reviewCount)})</span>
                        )}
                      </div>
                    ) : null}
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{formatNumber(course.total_views)}</span>
                    </div>
                    {/* Social Metrics for Compact View */}
                    {(course.like_count || course.share_count) && (
                      <div className="flex items-center gap-3 ml-2">
                        {course.like_count && course.like_count > 0 && (
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3 text-red-500" />
                            <span>{formatNumber(course.like_count)}</span>
                          </div>
                        )}
                        {course.share_count && course.share_count > 0 && (
                          <div className="flex items-center gap-1">
                            <Share2 className="h-3 w-3 text-blue-500" />
                            <span>{formatNumber(course.share_count)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            {description && <p className="text-gray-600 mt-1">{description}</p>}
          </div>
          {showViewAll && (
            <Button asChild>
              <Link href="/courses?sort=trending">
                Browse All Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCourses.map((course, index) => {
            const rating = formatRating(course.average_rating);
            const reviewCount = course.review_count || 0;
            
            return (
              <div key={course.id} className="group">
                <Link href={`/courses/${course.slug}`}>
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer h-full border border-gray-100">
                    {/* Course Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                      <img
                        src={course.thumbnail_url || "/placeholder-course.png"}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {index < 3 && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                            Trending #{index + 1}
                          </Badge>
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3">
                        <Badge className="bg-white text-gray-900 font-bold border-0 shadow-sm">
                          {formatPrice(course.price_cents)}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Course Info */}
                    <div className="p-5">
                      {/* Category */}
                      {course.category_name && (
                        <Badge variant="outline" className="text-xs mb-2">
                          {course.category_name}
                        </Badge>
                      )}
                      
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 leading-tight">
                        {course.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {course.short_description || course.subtitle || ''}
                      </p>
                      
                      {/* Rating, Students, and Social Metrics */}
                      <div className="flex flex-col gap-3 mb-4">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{formatNumber(course.enrolled_students_count)}</span>
                          </div>
                          {rating ? (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{rating}</span>
                              {reviewCount > 0 && (
                                <span className="text-gray-500">({formatNumber(reviewCount)})</span>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-gray-400">
                              <Star className="h-4 w-4" />
                              <span>No ratings</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Social Engagement Metrics */}
                        {(course.like_count || course.share_count) && (
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {course.like_count && course.like_count > 0 && (
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3 text-red-500" />
                                <span>{formatNumber(course.like_count)} likes</span>
                              </div>
                            )}
                            {course.share_count && course.share_count > 0 && (
                              <div className="flex items-center gap-1">
                                <Share2 className="h-3 w-3 text-blue-500" />
                                <span>{formatNumber(course.share_count)} shares</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <Button className="w-full group/btn" asChild>
                        <Link href={`/courses/${course.slug}`}>
                          View Course
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Default variant (list)
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              {title}
            </CardTitle>
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
          </div>
          {showViewAll && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/courses?sort=trending">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {displayedCourses.map((course, index) => {
            const rating = formatRating(course.average_rating);
            const reviewCount = course.review_count || 0;
            const duration = formatDuration(course.total_video_duration);
            
            return (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="flex items-start gap-4 p-4 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                {/* Course Image */}
                <div className="flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                  <img
                    src={course.thumbnail_url || "/placeholder-course.png"}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {index < 9 ? `#${index + 1}` : 'вҳ…'}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 truncate">
                        {course.title}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">
                        {course.instructor_name || 'Instructor'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {course.category_name && (
                        <Badge variant="outline" className={getCategoryColor(course.category_name)}>
                          {course.category_name}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="whitespace-nowrap">
                        {formatPrice(course.price_cents)}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {course.short_description || course.subtitle || ''}
                  </p>
                  
                  {/* Course Stats Row */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{formatNumber(course.enrolled_students_count)} students</span>
                    </div>
                    
                    {/* Rating with Review Count */}
                    {rating ? (
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{rating}</span>
                        <span className="text-gray-600">
                          ({reviewCount > 0 ? formatReviewCount(reviewCount) : 'No reviews'})
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-400 px-2 py-1 rounded-md">
                        <Star className="h-3 w-3" />
                        <span>No ratings</span>
                      </div>
                    )}
                    
                    {/* Duration - Only show if exists */}
                    {duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{duration}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{formatNumber(course.total_views)} views</span>
                    </div>
                  </div>
                  
                  {/* Social Engagement Metrics */}
                  {(course.like_count || course.share_count) && (
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      {course.like_count && course.like_count > 0 && (
                        <div className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded-md">
                          <Heart className="h-3 w-3 text-red-500" />
                          <span className="font-medium">{formatNumber(course.like_count)} likes</span>
                        </div>
                      )}
                      {course.share_count && course.share_count > 0 && (
                        <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md">
                          <Share2 className="h-3 w-3 text-blue-500" />
                          <span className="font-medium">{formatNumber(course.share_count)} shares</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Course tags */}
                  {course.tags && course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {course.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag.id} variant="outline" className="text-xs">
                          {tag.name}
                        </Badge>
                      ))}
                      {course.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{course.tags.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}