// // // File: /src/app/page.tsx

// 'use client';

// import React, { useEffect, useState, useRef } from 'react';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { 
//   Loader2, ChevronRight, Play, ArrowRight, Users, BookOpen, Star, 
//   ChevronLeft, ChevronRight as ChevronRightIcon, Heart, Share2, Eye, 
//   Clock, Sparkles, TrendingUp, Award, Zap, GraduationCap, 
//   Rocket, Shield, Globe, Coffee, Layers, Target
// } from 'lucide-react';
// import { Header } from '@/components/layout/header';
// import { Footer } from '@/components/layout/footer';
// import AnimatedStatsCounter from '@/components/home/animated-stats-counter';
// import Image from 'next/image';
// import BecomeInstructorSteps from '@/components/home/become-instructor-steps';

// type CourseAny = any;
// type CategoryAny = any;

// // Enhanced Premium Course Card Component with modern design
// function PremiumCourseCard({ course, index }: { course: CourseAny; index: number }) {
//   const formatRating = (rating: number | undefined, reviewCount: number | undefined): string | null => {
//     if (!rating || rating <= 0) return null;
//     if (reviewCount !== undefined && reviewCount <= 0) return null;
//     return rating.toFixed(1);
//   };

//   const formatNumber = (num: number | undefined): string => {
//     if (num === undefined || num === null) return '0';
//     return num.toLocaleString();
//   };

//   const formatDuration = (minutes: number | undefined): string | null => {
//     if (!minutes || minutes <= 0) return null;
//     if (minutes < 60) return `${minutes}m`;
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
//   };

//   const rating = formatRating(course.average_rating, course.review_count);
//   const duration = formatDuration(course.total_video_duration);
  
//   // Generate gradient based on index for visual variety
//   const gradients = [
//     'from-blue-600 to-indigo-600',
//     'from-purple-600 to-pink-600',
//     'from-emerald-600 to-teal-600',
//     'from-orange-600 to-red-600',
//   ];
  
//   const gradientClass = gradients[index % gradients.length];

//   return (
//     <Link href={`/courses/${course.slug || course.id}`} className="group">
//       <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] transition-all duration-500 h-full border border-gray-100/50 backdrop-blur-sm">
//         {/* Course Image with Modern Overlay */}
//         <div className="relative h-52 overflow-hidden">
//           <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-60 transition-opacity duration-500 z-10`} />
//           <img
//             src={course.thumbnail_url || "/placeholder-course.png"}
//             alt={course.title}
//             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
//           />
          
//           {/* Floating Play Button */}
//           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
//             <div className="bg-white/90 backdrop-blur rounded-full p-4 transform group-hover:scale-100 scale-0 transition-all duration-500 shadow-xl">
//               <Play size={24} className="text-gray-900 fill-gray-900" />
//             </div>
//           </div>
          
//           {/* Modern Badge */}
//           <span className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur text-gray-900 px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg">
//             {course.is_featured ? '⭐ FEATURED' : course.is_trending ? '🔥 TRENDING' : '✨ NEW'}
//           </span>
//         </div>

//         {/* Course Info - Enhanced Layout */}
//         <div className="p-6">
//           {/* Category with Icon */}
//           {course.category_name && (
//             <div className="mb-3">
//               <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full">
//                 <Layers size={12} />
//                 {course.category_name}
//               </span>
//             </div>
//           )}
          
//           <h3 className="font-bold text-xl mb-2 line-clamp-2 text-gray-900 leading-tight group-hover:text-primary transition-colors">
//             {course.title}
//           </h3>
          
//           {/* Short Description with subtle gradient */}
//           {course.short_description && (
//             <p className="text-gray-500 text-sm mb-4 line-clamp-2">
//               {course.short_description}
//             </p>
//           )}

//           {/* Instructor with Profile - Modern Layout */}
//           <div className="flex items-center gap-3 mb-5">
//             <div className="relative">
//               {course.instructor_image ? (
//                 <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-100">
//                   <img
//                     src={course.instructor_image}
//                     alt={course.instructor_name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               ) : (
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
//                   {course.instructor_name?.charAt(0) || 'E'}
//                 </div>
//               )}
//               <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-900">
//                 {course.instructor_name || 'Expert Instructor'}
//               </p>
//               <p className="text-xs text-gray-500">Course Instructor</p>
//             </div>
//           </div>

//           {/* Course Stats - Modern Grid */}
//           <div className="grid grid-cols-3 gap-3 mb-5">
//             {/* Rating */}
//             <div className="text-center">
//               {rating ? (
//                 <div className="flex flex-col items-center">
//                   <div className="flex items-center gap-0.5">
//                     <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
//                     <span className="font-bold text-gray-900 text-sm">{rating}</span>
//                   </div>
//                   <span className="text-xs text-gray-500">({course.review_count || 0})</span>
//                 </div>
//               ) : (
//                 <div className="flex flex-col items-center">
//                   <Star className="h-3.5 w-3.5 text-gray-300" />
//                   <span className="text-xs text-gray-500 mt-1">No ratings</span>
//                 </div>
//               )}
//             </div>
            
//             {/* Students */}
//             <div className="text-center">
//               <div className="flex flex-col items-center">
//                 <Users className="h-3.5 w-3.5 text-primary" />
//                 <span className="font-bold text-gray-900 text-sm mt-0.5">
//                   {formatNumber(course.enrolled_students_count)}
//                 </span>
//               </div>
//               <span className="text-xs text-gray-500">Students</span>
//             </div>
            
//             {/* Duration or Likes */}
//             <div className="text-center">
//               {duration ? (
//                 <div className="flex flex-col items-center">
//                   <Clock className="h-3.5 w-3.5 text-primary" />
//                   <span className="font-bold text-gray-900 text-sm mt-0.5">{duration}</span>
//                   <span className="text-xs text-gray-500">Duration</span>
//                 </div>
//               ) : (
//                 course.like_count > 0 && (
//                   <div className="flex flex-col items-center">
//                     <Heart className="h-3.5 w-3.5 text-red-500" />
//                     <span className="font-bold text-gray-900 text-sm mt-0.5">
//                       {formatNumber(course.like_count)}
//                     </span>
//                     <span className="text-xs text-gray-500">Likes</span>
//                   </div>
//                 )
//               )}
//             </div>
//           </div>

//           {/* Price and CTA - Modern Split Design */}
//           <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//             <div>
//               <span className="text-xs text-gray-500">Price</span>
//               <span className="block text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//                 {course.price_cents === 0 ? 'FREE' : `$${(course.price_cents / 100).toFixed(2)}`}
//               </span>
//             </div>
//             <Button className="rounded-full bg-gray-900 hover:bg-gray-800 text-white group-hover:bg-primary group-hover:shadow-lg transition-all duration-300 px-6">
//               <span>Preview</span>
//               <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }

// // Enhanced Course Grid with Modern Layout
// function PremiumCourseGrid({ courses, title, description, viewAllLink }: { 
//   courses: CourseAny[], 
//   title: string, 
//   description?: string,
//   viewAllLink: string 
// }) {
//   const [visibleCourses, setVisibleCourses] = useState(8);
//   const [loadingMore, setLoadingMore] = useState(false);

//   if (!courses || courses.length === 0) return null;

//   const displayedCourses = courses.slice(0, visibleCourses);
//   const hasMoreCourses = visibleCourses < courses.length;

//   const loadMore = () => {
//     setLoadingMore(true);
//     setTimeout(() => {
//       setVisibleCourses(prev => prev + 8);
//       setLoadingMore(false);
//     }, 500);
//   };

//   return (
//     <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
//       {/* Decorative Elements */}
//       <div className="absolute inset-0">
//         <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
//         {/* Section Header with Modern Design */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-16">
//           <div className="text-center md:text-left mb-6 md:mb-0">
//             <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
//               <Sparkles size={16} />
//               Top Rated Courses
//             </span>
//             <h2 className="text-4xl md:text-5xl font-bold mb-4">
//               {title}
//               <span className="block text-2xl md:text-3xl text-primary mt-2">
//                 {description || "Start learning today"}
//               </span>
//             </h2>
//           </div>
          
//           {/* Modern View All Button */}
//           <Link 
//             href={viewAllLink} 
//             className="group inline-flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-primary text-gray-700 hover:text-primary font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-sm hover:shadow-lg"
//           >
//             Explore All Courses
//             <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//           </Link>
//         </div>

//         {/* Courses Grid with Animation */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
//           {displayedCourses.map((course, index) => (
//             <div
//               key={course.id}
//               className="animate-fadeInUp"
//               style={{ animationDelay: `${index * 100}ms` }}
//             >
//               <PremiumCourseCard course={course} index={index} />
//             </div>
//           ))}
//         </div>

//         {/* Enhanced Load More Section */}
//         {hasMoreCourses && (
//           <div className="text-center">
//             <Button
//               onClick={loadMore}
//               disabled={loadingMore}
//               className="min-w-64 rounded-full bg-white hover:bg-primary text-gray-900 hover:text-white border-2 border-gray-200 hover:border-primary px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
//             >
//               {loadingMore ? (
//                 <>
//                   <Loader2 className="h-5 w-5 animate-spin mr-2" />
//                   Loading Amazing Courses...
//                 </>
//               ) : (
//                 <>
//                   Show More Courses
//                   <Rocket className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
//                 </>
//               )}
//             </Button>
//           </div>
//         )}

//         {/* Completion Message */}
//         {!hasMoreCourses && courses.length > 8 && (
//           <div className="text-center py-8">
//             <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full px-8 py-4">
//               <Award className="h-6 w-6 text-green-600" />
//               <p className="text-green-800 font-medium">
//                 🎉 You've explored all {courses.length} amazing courses!
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Animation Styles */}
//       <style jsx>{`
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fadeInUp {
//           animation: fadeInUp 0.6s ease-out forwards;
//         }
//       `}</style>
//     </section>
//   );
// }

// // Enhanced Categories Section with Modern Design
// function CategoriesSection({ categories }: { categories: CategoryAny[] }) {
//   const scrollContainerRef = useRef<HTMLDivElement>(null);
//   const [showLeftArrow, setShowLeftArrow] = useState(false);
//   const [showRightArrow, setShowRightArrow] = useState(true);

//   if (!categories || categories.length === 0) return null;

//   const categoryIcons: { [key: string]: { icon: string; gradient: string } } = {
//     'web-development': { icon: '💻', gradient: 'from-blue-500 to-cyan-500' },
//     'programming': { icon: '👨‍💻', gradient: 'from-purple-500 to-pink-500' },
//     'design': { icon: '🎨', gradient: 'from-orange-500 to-red-500' },
//     'data-science': { icon: '📊', gradient: 'from-green-500 to-emerald-500' },
//     'business': { icon: '💼', gradient: 'from-yellow-500 to-orange-500' },
//     'marketing': { icon: '📈', gradient: 'from-indigo-500 to-purple-500' },
//     'photography': { icon: '📷', gradient: 'from-gray-700 to-gray-900' },
//     'music': { icon: '🎵', gradient: 'from-pink-500 to-rose-500' },
//     'health': { icon: '🏥', gradient: 'from-teal-500 to-cyan-500' },
//     'language': { icon: '🌐', gradient: 'from-blue-500 to-indigo-500' },
//     'default': { icon: '📚', gradient: 'from-primary to-secondary' }
//   };

//   const getCategoryStyle = (slug: string, icon?: string) => {
//     const style = categoryIcons[slug] || categoryIcons.default;
//     return {
//       icon: icon || style.icon,
//       gradient: style.gradient
//     };
//   };

//   const scroll = (direction: 'left' | 'right') => {
//     if (scrollContainerRef.current) {
//       const scrollAmount = 300;
//       const newScrollLeft = scrollContainerRef.current.scrollLeft + 
//         (direction === 'right' ? scrollAmount : -scrollAmount);
      
//       scrollContainerRef.current.scrollTo({
//         left: newScrollLeft,
//         behavior: 'smooth'
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
//       {/* Decorative Background */}
//       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 via-white to-gray-50" />
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
//         <div className="text-center mb-16">
//           <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
//             <Target size={16} />
//             Explore Categories
//           </span>
//           <h2 className="text-4xl md:text-5xl font-bold mb-4">
//             Find Your Perfect Course
//           </h2>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             Browse through our diverse categories and start your learning journey today
//           </p>
//         </div>

//         {/* Categories with Horizontal Scroll - Modern Design */}
//         <div className="relative">
//           {/* Navigation Arrows */}
//           {showLeftArrow && (
//             <button
//               onClick={() => scroll('left')}
//               className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 rounded-full p-4 shadow-xl hover:shadow-2xl transition-all hover:scale-110 hover:bg-primary hover:text-white group"
//             >
//               <ChevronLeft className="h-5 w-5" />
//             </button>
//           )}

//           {showRightArrow && (
//             <button
//               onClick={() => scroll('right')}
//               className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 rounded-full p-4 shadow-xl hover:shadow-2xl transition-all hover:scale-110 hover:bg-primary hover:text-white group"
//             >
//               <ChevronRightIcon className="h-5 w-5" />
//             </button>
//           )}

//           {/* Scrollable Categories */}
//           <div
//             ref={scrollContainerRef}
//             onScroll={updateArrowVisibility}
//             className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-6 px-4"
//             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//           >
//             {categories.map((category, index) => {
//               const style = getCategoryStyle(category.slug, category.icon);
//               return (
//                 <Link
//                   key={category.id}
//                   href={`/categories/${category.slug}`}
//                   className="group flex-shrink-0"
//                 >
//                   <div className="relative w-48 p-8 rounded-2xl text-center transition-all transform hover:-translate-y-2">
//                     {/* Gradient Background */}
//                     <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500`} />
                    
//                     {/* Content */}
//                     <div className="relative z-10">
//                       <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-500">
//                         {style.icon}
//                       </div>
//                       <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-white transition-colors">
//                         {category.name}
//                       </h3>
//                       <p className="text-sm text-gray-500 group-hover:text-white/90 transition-colors">
//                         {category.course_count || 0}+ courses
//                       </p>
                      
//                       {/* Hover Effect Line */}
//                       <div className="w-0 h-0.5 bg-white mx-auto mt-4 group-hover:w-12 transition-all duration-500" />
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         </div>

//         {/* View All Button */}
//         <div className="text-center mt-12">
//           <Link href="/categories">
//             <Button className="rounded-full bg-gray-900 hover:bg-primary text-white px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group">
//               Browse All Categories
//               <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }

// // Enhanced Auto Slider with Modern Design
// // Enhanced Auto Slider with Modern Design
// function AutoSlider() {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const slides = [
//     {
//       id: 1,
//       title: 'Start Your Learning Journey',
//       description: 'Access 1000+ courses from industry experts',
//       cta: 'Explore Courses',
//       image: '/images/python-course.jpg',
//       link: '/courses',
//       gradient: 'from-blue-600/90 to-indigo-600/90'
//     },
//     {
//       id: 2,
//       title: 'Become an Instructor',
//       description: 'Share your knowledge and earn money teaching',
//       cta: 'Start Teaching',
//       image: '/images/react-course-hero.jpg',
//       link: '/admin-signup',
//       gradient: 'from-purple-600/90 to-pink-600/90'
//     },
//     // {
//     //   id: 3,
//     //   title: 'Premium Membership',
//     //   description: 'Unlimited access to all courses + certificates',
//     //   cta: 'Upgrade Now',
//     //   image: '/images/ios-swift-development.jpg',
//     //   link: '/premium',
//     //   gradient: 'from-emerald-600/90 to-teal-600/90'
//     // },
//     {
//       id: 5,
//       title: 'Expert Instructors',
//       description: 'Learn from industry professionals and thought leaders',
//       cta: 'Meet Instructors',
//       image: '/images/ios-development.png',
//       link: '/instructors',
//       gradient: 'from-orange-600/90 to-red-600/90'
//     },
//     {
//       id: 6,
//       title: 'Career Advancement',
//       description: 'Get certified and boost your career opportunities',
//       cta: 'View Certificates',
//       image: '/images/instructor-portrait.png',
//       link: '/certificates',
//       gradient: 'from-primary/90 to-secondary/90'
//     },
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [slides.length]);

//   const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
//   const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
//   const goToSlide = (index: number) => setCurrentSlide(index);

//   // Simplified pattern without complex SVG string
//   const patternStyle = {
//     backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
//     backgroundSize: '40px 40px'
//   };


//   return (
//   <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
//     {slides.map((slide, index) => (
//       <div
//         key={slide.id}
//         className={`absolute inset-0 transition-all duration-1000 ease-out ${
//           index === currentSlide 
//             ? 'opacity-100 scale-100 pointer-events-auto' 
//             : 'opacity-0 scale-105 pointer-events-none'
//         }`}
//       >
//         {/* Background Image with Parallax Effect */}
//         <div className="relative w-full h-full">
//           <Image
//             src={slide.image}
//             alt={slide.title}
//             fill
//             className="object-cover"
//             priority={index === 0}
//           />
          
//           {/* Modern Gradient Overlay */}
//           <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} mix-blend-multiply`} />
          
//           {/* Simplified Pattern Overlay - REMOVED pointer-events-none */}
//           <div 
//             className="absolute inset-0 opacity-20"
//             style={patternStyle}
//           />
          
//           {/* Content - Now clickable */}
//           <div className="absolute inset-0 flex items-center">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
//               <div className="max-w-3xl">
//                 {/* Animated Badge */}
//                 <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-fadeInUp">
//                   <Sparkles size={16} />
//                   {index === 0 ? 'New Courses Added' : index === 1 ? 'Join as Instructor' : 'Limited Time Offer'}
//                 </div>
                
//                 {/* Title with Animation */}
//                 <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fadeInUp animation-delay-200">
//                   {slide.title}
//                 </h2>
                
//                 {/* Description */}
//                 <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl animate-fadeInUp animation-delay-400">
//                   {slide.description}
//                 </p>
                
//                 {/* CTA Button with Modern Design - Now clickable! */}
//                 <div className="relative z-30">
//                   <Link
//                     href={slide.link || "/courses"}
//                     className="inline-flex items-center gap-3 bg-white text-gray-900 font-semibold px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 text-lg shadow-2xl hover:scale-105"
//                   >
//                     {slide.cta}
//                     <ArrowRight className="group-hover:translate-x-1 transition-transform" />
//                   </Link>
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     ))}

//     {/* Navigation Arrows - Keep these outside the slides mapping */}
//     <button
//       onClick={prevSlide}
//       className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur text-white p-3 rounded-full hover:bg-white/30 transition-all"
//     >
//       <ChevronLeft size={24} />
//     </button>
//     <button
//       onClick={nextSlide}
//       className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur text-white p-3 rounded-full hover:bg-white/30 transition-all"
//     >
//       <ChevronRightIcon size={24} />
//     </button>

//     {/* Slide Indicators */}
//     <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
//       {slides.map((_, index) => (
//         <button
//           key={index}
//           onClick={() => goToSlide(index)}
//           className={`w-3 h-3 rounded-full transition-all ${
//             index === currentSlide 
//               ? 'bg-white w-10' 
//               : 'bg-white/50 hover:bg-white/80'
//           }`}
//         />
//       ))}
//     </div>
//   </section>
// );
// }

// //   return (
// //     <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
// //       {slides.map((slide, index) => (
// //         <div
// //             className={`absolute inset-0 transition-all duration-1000 ease-out ${
// //               index === currentSlide 
// //                 ? 'opacity-100 scale-100 pointer-events-auto' 
// //                 : 'opacity-0 scale-105 pointer-events-none'
// //             }`}
// //           >
// //                     {/* Background Image with Parallax Effect */}
// //           <div className="relative w-full h-full">
// //             <Image
// //               src={slide.image}
// //               alt={slide.title}
// //               fill
// //               className="object-cover"
// //               priority={index === 0}
// //             />
            
// //             {/* Modern Gradient Overlay */}
// //             {/* <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} mix-blend-multiply`} /> */}
// //             <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} mix-blend-multiply pointer-events-none`} />
            
// //             {/* Simplified Pattern Overlay */}
// //             <div 
// //               className="absolute inset-0 opacity-20 pointer-events-none"
// //               style={patternStyle}
// //             />
// //             {/* <div 
// //               className="absolute inset-0 opacity-20"
// //               style={patternStyle}
// //             /> */}
            
// //             {/* Content */}
// //             <div className="absolute inset-0 flex items-center">
// //               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
// //                 <div className="max-w-3xl">
// //                   {/* Animated Badge */}
// //                   <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-fadeInUp">
// //                     <Sparkles size={16} />
// //                     {index === 0 ? 'New Courses Added' : index === 1 ? 'Join as Instructor' : 'Limited Time Offer'}
// //                   </div>
                  
// //                   {/* Title with Animation */}
// //                   <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fadeInUp animation-delay-200">
// //                     {slide.title}
// //                   </h2>
                  
// //                   {/* Description */}
// //                   <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl animate-fadeInUp animation-delay-400">
// //                     {slide.description}
// //                   </p>
                  
// //                   {/* CTA Button with Modern Design */}
// //                   <div className="animate-fadeInUp animation-delay-600 relative z-30">
                    
// //                     <Link
// //                       href={slide.link || "/courses"}
// //                       onClick={(e) => {
// //                         console.log('CLICKED', slide.link);
// //                         // temporarily force navigation
// //                         window.location.href = slide.link || '/courses';
// //                       }}
// //                       className="inline-flex items-center gap-3 bg-white text-gray-900 font-semibold px-8 py-4 rounded-full ..."
// //                     >
                    
// //                     {/* <Link
// //                       href={slide.link || "/courses"}
// //                       className="inline-flex items-center gap-3 bg-white text-gray-900 ..."
// //                     > */}


// //                   {/* <div className="animate-fadeInUp animation-delay-600">
// //                     <Link
// //                       href={slide.link || "/courses"}
// //                       className="inline-flex items-center gap-3 bg-white text-gray-900 font-semibold px-8 py-4 rounded-full hover:bg-opacity-90 transition-all duration-300 text-lg group shadow-2xl hover:shadow-3xl hover:scale-105"
// //                     > */}
// //                       {slide.cta}
// //                       <ArrowRight className="group-hover:translate-x-1 transition-transform" />
// //                     </Link>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       ))}

// //       {/* Modern Navigation Arrows */}
// //       <button
// //         onClick={prevSlide}
// //         className="absolute left-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur text-white p-4 rounded-full transition-all hover:scale-110 border border-white/30"
// //       >
// //         <ChevronLeft size={24} />
// //       </button>
// //       <button
// //         onClick={nextSlide}
// //         className="absolute right-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur text-white p-4 rounded-full transition-all hover:scale-110 border border-white/30"
// //       >
// //         <ChevronRightIcon size={24} />
// //       </button>

// //       {/* Modern Indicators */}
// //       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
// //         {slides.map((_, index) => (
// //           <button
// //             key={index}
// //             onClick={() => goToSlide(index)}
// //             className={`relative h-2 rounded-full transition-all duration-500 ${
// //               index === currentSlide 
// //                 ? 'w-12 bg-white' 
// //                 : 'w-2 bg-white/50 hover:bg-white/70'
// //             }`}
// //           >
// //             {index === currentSlide && (
// //               <span className="absolute inset-0 bg-white rounded-full animate-pulse" />
// //             )}
// //           </button>
// //         ))}
// //       </div>

// //       {/* Modern Slide Counter */}
// //       <div className="absolute bottom-8 right-8 z-30 bg-black/30 backdrop-blur rounded-full px-4 py-2 text-white text-sm border border-white/20">
// //         {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
// //       </div>

// //       {/* Animation Styles */}
// //       <style jsx>{`
// //         @keyframes slide {
// //           from { transform: translateX(0); }
// //           to { transform: translateX(40px); }
// //         }
// //         @keyframes fadeInUp {
// //           from {
// //             opacity: 0;
// //             transform: translateY(20px);
// //           }
// //           to {
// //             opacity: 1;
// //             transform: translateY(0);
// //           }
// //         }
// //         .animate-fadeInUp {
// //           animation: fadeInUp 0.6s ease-out forwards;
// //         }
// //         .animation-delay-200 {
// //           animation-delay: 200ms;
// //         }
// //         .animation-delay-400 {
// //           animation-delay: 400ms;
// //         }
// //         .animation-delay-600 {
// //           animation-delay: 600ms;
// //         }
// //       `}</style>
// //     </section>
// //   );
// // }

// // Modern Stats Section
// function ModernStatsSection() {
//   const stats = [
//     { icon: Users, value: '10K+', label: 'Active Learners', gradient: 'from-blue-500 to-cyan-500' },
//     { icon: GraduationCap, value: '500+', label: 'Expert Instructors', gradient: 'from-purple-500 to-pink-500' },
//     { icon: BookOpen, value: '1000+', label: 'Courses Available', gradient: 'from-emerald-500 to-teal-500' },
//     { icon: Star, value: '4.8★', label: 'Average Rating', gradient: 'from-orange-500 to-red-500' },
//   ];

//   return (
//     <section className="py-24 bg-gradient-to-br from-primary via-primary to-secondary relative overflow-hidden">
//       {/* Animated Background */}
//       <div className="absolute inset-0">
//         <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse animation-delay-1000" />
//       </div>
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
//         <div className="grid md:grid-cols-4 gap-8">
//           {stats.map((stat, index) => {
//             const Icon = stat.icon;
//             return (
//               <div
//                 key={index}
//                 className="text-center group hover:transform hover:-translate-y-2 transition-all duration-500"
//               >
//                 <div className={`inline-flex p-6 rounded-3xl bg-gradient-to-br ${stat.gradient} mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
//                   <Icon className="h-8 w-8 text-white" />
//                 </div>
//                 <div className="text-5xl font-bold text-white mb-2">{stat.value}</div>
//                 <p className="text-white/80 text-lg">{stat.label}</p>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }

// // Main HomePage Component
// export default function HomePage() {
//   const [courses, setCourses] = useState<CourseAny[]>([]);
//   const [categories, setCategories] = useState<CategoryAny[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     let isMounted = true;
    
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const [coursesRes, categoriesRes] = await Promise.all([
//           fetch('/api/courses?is_published=true&limit=100&include_reviews=true'),
//           fetch('/api/categories')
//         ]);

//         if (!coursesRes.ok) throw new Error('Failed to load courses');
//         if (!categoriesRes.ok) throw new Error('Failed to load categories');

//         const coursesData = await coursesRes.json();
//         const categoriesData = await categoriesRes.json();

//         if (isMounted) {
//           const coursesArray = Array.isArray(coursesData) ? coursesData : coursesData.courses || [];
          
//           console.log('=== HOMEPAGE COURSES DATA ===');
//           coursesArray.forEach((course: any, index: number) => {
//             console.log(`${index + 1}. ${course.title}`);
//             console.log(`   Rating: ${course.average_rating}`);
//             console.log(`   Review count: ${course.review_count}`);
//           });
          
//           setCourses(coursesArray);
//           setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.categories || []);
//         }
//       } catch (err: any) {
//         console.error('Homepage fetch error', err);
//         if (isMounted) setError(err.message || 'Failed to load data');
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     fetchData();

//     return () => { isMounted = false; };
//   }, []);

//   const allCourses = courses;

//   return (
//     <div className="min-h-screen bg-white">
//       <Header />
      
//       {/* Hero Slider */}
//       <AutoSlider />

//       {/* Modern Stats Section */}
//       <ModernStatsSection />

//       {/* Become Instructor Steps */}
//       <BecomeInstructorSteps />

//       {/* Categories Section */}
//       {!loading && categories.length > 0 && (
//         <CategoriesSection categories={categories} />
//       )}

//       {/* Loading State */}
//       {loading && (
//         <div className="py-32 flex flex-col items-center justify-center">
//           <div className="relative">
//             <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="w-10 h-10 bg-primary/10 rounded-full animate-pulse" />
//             </div>
//           </div>
//           <p className="mt-6 text-gray-600 text-lg">Loading amazing courses...</p>
//         </div>
//       )}

//       {/* Error State */}
//       {error && (
//         <div className="py-32 text-center">
//           <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
//             <span className="text-4xl">😕</span>
//           </div>
//           <div className="text-red-600 text-xl mb-4">Error loading data: {error}</div>
//           <Button 
//             onClick={() => window.location.reload()}
//             className="rounded-full bg-primary hover:bg-primary/90 text-white px-8 py-6"
//           >
//             Try Again
//           </Button>
//         </div>
//       )}

//       {/* Courses Section */}
//       {!loading && !error && allCourses.length > 0 && (
//         <PremiumCourseGrid
//           courses={allCourses}
//           title="Popular Courses"
//           description="Hand-picked courses loved by our students"
//           viewAllLink="/courses"
//         />
//       )}

//       <Footer />
//     </div>
//   );
// }

















































'use client';
// File: /src/app/page.tsx

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Loader2, ChevronRight, Play, ArrowRight, Users, BookOpen, Star, 
  ChevronLeft, ChevronRight as ChevronRightIcon, Heart, Share2, Eye, 
  Clock, Sparkles, TrendingUp, Award, Zap, GraduationCap, 
  Rocket, Shield, Globe, Coffee, Layers, Target, ShieldCheck, Search, BadgeCheck
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import AnimatedStatsCounter from '@/components/home/animated-stats-counter';
import Image from 'next/image';
import BecomeInstructorSteps from '@/components/home/become-instructor-steps';

type CourseAny = any;
type CategoryAny = any;

// ─── Premium Course Card ───────────────────────────────────────────────────────

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
  
  const gradients = [
    'from-blue-600 to-indigo-600',
    'from-purple-600 to-pink-600',
    'from-emerald-600 to-teal-600',
    'from-orange-600 to-red-600',
  ];
  
  const gradientClass = gradients[index % gradients.length];

  return (
    <Link href={`/courses/${course.slug || course.id}`} className="group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] transition-all duration-500 h-full border border-gray-100/50 backdrop-blur-sm">
        <div className="relative h-52 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-60 transition-opacity duration-500 z-10`} />
          <img
            src={course.thumbnail_url || "/placeholder-course.png"}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
            <div className="bg-white/90 backdrop-blur rounded-full p-4 transform group-hover:scale-100 scale-0 transition-all duration-500 shadow-xl">
              <Play size={24} className="text-gray-900 fill-gray-900" />
            </div>
          </div>
          <span className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur text-gray-900 px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg">
            {course.is_featured ? '⭐ FEATURED' : course.is_trending ? '🔥 TRENDING' : '✨ NEW'}
          </span>
        </div>

        <div className="p-6">
          {course.category_name && (
            <div className="mb-3">
              <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full">
                <Layers size={12} />
                {course.category_name}
              </span>
            </div>
          )}
          
          <h3 className="font-bold text-xl mb-2 line-clamp-2 text-gray-900 leading-tight group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          
          {course.short_description && (
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.short_description}</p>
          )}

          <div className="flex items-center gap-3 mb-5">
            <div className="relative">
              {course.instructor_image ? (
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-100">
                  <img src={course.instructor_image} alt={course.instructor_name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                  {course.instructor_name?.charAt(0) || 'E'}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{course.instructor_name || 'Expert Instructor'}</p>
              <p className="text-xs text-gray-500">Course Instructor</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="text-center">
              {rating ? (
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-0.5">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-gray-900 text-sm">{rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">({course.review_count || 0})</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Star className="h-3.5 w-3.5 text-gray-300" />
                  <span className="text-xs text-gray-500 mt-1">No ratings</span>
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="flex flex-col items-center">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span className="font-bold text-gray-900 text-sm mt-0.5">{formatNumber(course.enrolled_students_count)}</span>
              </div>
              <span className="text-xs text-gray-500">Students</span>
            </div>
            <div className="text-center">
              {duration ? (
                <div className="flex flex-col items-center">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span className="font-bold text-gray-900 text-sm mt-0.5">{duration}</span>
                  <span className="text-xs text-gray-500">Duration</span>
                </div>
              ) : (
                course.like_count > 0 && (
                  <div className="flex flex-col items-center">
                    <Heart className="h-3.5 w-3.5 text-red-500" />
                    <span className="font-bold text-gray-900 text-sm mt-0.5">{formatNumber(course.like_count)}</span>
                    <span className="text-xs text-gray-500">Likes</span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <span className="text-xs text-gray-500">Price</span>
              <span className="block text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {course.price_cents === 0 ? 'FREE' : `$${(course.price_cents / 100).toFixed(2)}`}
              </span>
            </div>
            <Button className="rounded-full bg-gray-900 hover:bg-gray-800 text-white group-hover:bg-primary group-hover:shadow-lg transition-all duration-300 px-6">
              <span>Preview</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Premium Course Grid ───────────────────────────────────────────────────────

function PremiumCourseGrid({ courses, title, description, viewAllLink }: { 
  courses: CourseAny[], 
  title: string, 
  description?: string,
  viewAllLink: string 
}) {
  const [visibleCourses, setVisibleCourses] = useState(8);
  const [loadingMore, setLoadingMore] = useState(false);

  if (!courses || courses.length === 0) return null;

  const displayedCourses = courses.slice(0, visibleCourses);
  const hasMoreCourses = visibleCourses < courses.length;

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCourses(prev => prev + 8);
      setLoadingMore(false);
    }, 500);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Sparkles size={16} />
              Top Rated Courses
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {title}
              <span className="block text-2xl md:text-3xl text-primary mt-2">
                {description || "Start learning today"}
              </span>
            </h2>
          </div>
          <Link 
            href={viewAllLink} 
            className="group inline-flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-primary text-gray-700 hover:text-primary font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-sm hover:shadow-lg"
          >
            Explore All Courses
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {displayedCourses.map((course, index) => (
            <div key={course.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
              <PremiumCourseCard course={course} index={index} />
            </div>
          ))}
        </div>

        {hasMoreCourses && (
          <div className="text-center">
            <Button
              onClick={loadMore}
              disabled={loadingMore}
              className="min-w-64 rounded-full bg-white hover:bg-primary text-gray-900 hover:text-white border-2 border-gray-200 hover:border-primary px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              {loadingMore ? (
                <><Loader2 className="h-5 w-5 animate-spin mr-2" />Loading Amazing Courses...</>
              ) : (
                <>Show More Courses<Rocket className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
              )}
            </Button>
          </div>
        )}

        {!hasMoreCourses && courses.length > 8 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full px-8 py-4">
              <Award className="h-6 w-6 text-green-600" />
              <p className="text-green-800 font-medium">🎉 You've explored all {courses.length} amazing courses!</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
      `}</style>
    </section>
  );
}

// ─── Categories Section ────────────────────────────────────────────────────────

function CategoriesSection({ categories }: { categories: CategoryAny[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  if (!categories || categories.length === 0) return null;

  const categoryIcons: { [key: string]: { icon: string; gradient: string } } = {
    'web-development': { icon: '💻', gradient: 'from-blue-500 to-cyan-500' },
    'programming': { icon: '👨‍💻', gradient: 'from-purple-500 to-pink-500' },
    'design': { icon: '🎨', gradient: 'from-orange-500 to-red-500' },
    'data-science': { icon: '📊', gradient: 'from-green-500 to-emerald-500' },
    'business': { icon: '💼', gradient: 'from-yellow-500 to-orange-500' },
    'marketing': { icon: '📈', gradient: 'from-indigo-500 to-purple-500' },
    'photography': { icon: '📷', gradient: 'from-gray-700 to-gray-900' },
    'music': { icon: '🎵', gradient: 'from-pink-500 to-rose-500' },
    'health': { icon: '🏥', gradient: 'from-teal-500 to-cyan-500' },
    'language': { icon: '🌐', gradient: 'from-blue-500 to-indigo-500' },
    'default': { icon: '📚', gradient: 'from-primary to-secondary' }
  };

  const getCategoryStyle = (slug: string, icon?: string) => {
    const style = categoryIcons[slug] || categoryIcons.default;
    return { icon: icon || style.icon, gradient: style.gradient };
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      scrollContainerRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
      setTimeout(updateArrowVisibility, 300);
    }
  };

  const updateArrowVisibility = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    updateArrowVisibility();
    window.addEventListener('resize', updateArrowVisibility);
    return () => window.removeEventListener('resize', updateArrowVisibility);
  }, [categories]);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 via-white to-gray-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Target size={16} />
            Explore Categories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Course</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Browse through our diverse categories and start your learning journey today</p>
        </div>

        <div className="relative">
          {showLeftArrow && (
            <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 rounded-full p-4 shadow-xl hover:shadow-2xl transition-all hover:scale-110 hover:bg-primary hover:text-white group">
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {showRightArrow && (
            <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 rounded-full p-4 shadow-xl hover:shadow-2xl transition-all hover:scale-110 hover:bg-primary hover:text-white group">
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          )}
          <div ref={scrollContainerRef} onScroll={updateArrowVisibility} className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-6 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {categories.map((category, index) => {
              const style = getCategoryStyle(category.slug, category.icon);
              return (
                <Link key={category.id} href={`/categories/${category.slug}`} className="group flex-shrink-0">
                  <div className="relative w-48 p-8 rounded-2xl text-center transition-all transform hover:-translate-y-2">
                    <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500`} />
                    <div className="relative z-10">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-500">{style.icon}</div>
                      <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-white transition-colors">{category.name}</h3>
                      <p className="text-sm text-gray-500 group-hover:text-white/90 transition-colors">{category.course_count || 0}+ courses</p>
                      <div className="w-0 h-0.5 bg-white mx-auto mt-4 group-hover:w-12 transition-all duration-500" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/categories">
            <Button className="rounded-full bg-gray-900 hover:bg-primary text-white px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group">
              Browse All Categories
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Auto Slider ───────────────────────────────────────────────────────────────

function AutoSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'Start Your Learning Journey',
      description: 'Access 1000+ courses from industry experts',
      cta: 'Explore Courses',
      image: '/images/python-course.jpg',
      link: '/courses',
      gradient: 'from-blue-600/90 to-indigo-600/90'
    },
    {
      id: 2,
      title: 'Become an Instructor',
      description: 'Share your knowledge and earn money teaching',
      cta: 'Start Teaching',
      image: '/images/react-course-hero.jpg',
      link: '/admin-signup',
      gradient: 'from-purple-600/90 to-pink-600/90'
    },
    {
      id: 3,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals and thought leaders',
      cta: 'Meet Instructors',
      image: '/images/ios-development.png',
      link: '/instructors',
      gradient: 'from-orange-600/90 to-red-600/90'
    },
    {
      // ── NEW: Verify Certificate slide ──────────────────────────────────
      id: 4,
      title: 'Verify a Certificate',
      description: 'Instantly confirm the authenticity of any AxioQuan certificate — trusted by employers worldwide',
      cta: 'Verify Now',
      image: '/images/instructor-portrait.png',
      link: '/verify',
      gradient: 'from-[#0d1b2e]/95 to-[#1a3a5c]/90',
      isVerify: true,
    },
    {
      id: 5,
      title: 'Career Advancement',
      description: 'Get certified and boost your career opportunities',
      cta: 'View Certificates',
      image: '/images/instructor-portrait.png',
      link: '/certificates',
      gradient: 'from-primary/90 to-secondary/90'
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index: number) => setCurrentSlide(index);

  const patternStyle = {
    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
    backgroundSize: '40px 40px'
  };

  return (
    <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-out ${
            index === currentSlide
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-105 pointer-events-none'
          }`}
        >
          <div className="relative w-full h-full">
            <Image src={slide.image} alt={slide.title} fill className="object-cover" priority={index === 0} />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} mix-blend-multiply`} />
            <div className="absolute inset-0 opacity-20" style={patternStyle} />

            {/* ── Verify slide gets special gold overlays ── */}
            {(slide as any).isVerify && (
              <>
                {/* Gold grid overlay */}
                <div className="absolute inset-0 opacity-[0.04]" style={{
                  backgroundImage: `linear-gradient(rgba(240,192,64,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(240,192,64,0.6) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px'
                }} />
                {/* Gold glow */}
                <div className="absolute inset-0" style={{
                  background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,148,10,0.12) 0%, transparent 70%)'
                }} />
                {/* Floating shield icons */}
                <div className="absolute top-16 right-24 opacity-10">
                  <ShieldCheck size={120} className="text-[#f0c040]" />
                </div>
                <div className="absolute bottom-16 right-48 opacity-[0.06]">
                  <ShieldCheck size={80} className="text-[#f0c040]" />
                </div>
              </>
            )}

            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-3xl">

                  {/* Badge */}
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-fadeInUp ${
                    (slide as any).isVerify
                      ? 'bg-[#f0c040]/20 text-[#f0c040] border border-[#f0c040]/30'
                      : 'bg-white/20 backdrop-blur text-white'
                  }`}>
                    {(slide as any).isVerify ? <ShieldCheck size={16} /> : <Sparkles size={16} />}
                    {(slide as any).isVerify
                      ? 'Official Certificate Verification'
                      : index === 0 ? 'New Courses Added' : index === 1 ? 'Join as Instructor' : 'Limited Time Offer'
                    }
                  </div>

                  {/* Title */}
                  <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fadeInUp animation-delay-200" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {(slide as any).isVerify ? (
                      <>
                        Verify a{' '}
                        <span style={{ color: '#f0c040' }}>Certificate</span>
                      </>
                    ) : slide.title}
                  </h2>

                  {/* Description */}
                  <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl animate-fadeInUp animation-delay-400">
                    {slide.description}
                  </p>

                  {/* CTA */}
                  <div className="relative z-30 flex items-center gap-4">
                    <Link
                      href={slide.link || '/courses'}
                      className={`inline-flex items-center gap-3 font-semibold px-8 py-4 rounded-full transition-all duration-300 text-lg shadow-2xl hover:scale-105 ${
                        (slide as any).isVerify
                          ? 'text-[#0a0a0a] hover:opacity-90'
                          : 'bg-white text-gray-900 hover:bg-gray-100'
                      }`}
                      style={(slide as any).isVerify ? {
                        background: 'linear-gradient(135deg, #c9940a, #f0c040)',
                        boxShadow: '0 0 30px rgba(240,192,64,0.35)'
                      } : {}}
                    >
                      {(slide as any).isVerify && <ShieldCheck size={20} />}
                      {slide.cta}
                      <ArrowRight className="transition-transform group-hover:translate-x-1" />
                    </Link>

                    {/* Secondary trust badge on verify slide */}
                    {(slide as any).isVerify && (
                      <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-3">
                        <BadgeCheck size={16} className="text-[#f0c040]" />
                        <span className="text-white/80 text-sm font-medium">Trusted · Instant · Free</span>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur text-white p-3 rounded-full hover:bg-white/30 transition-all">
        <ChevronLeft size={24} />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur text-white p-3 rounded-full hover:bg-white/30 transition-all">
        <ChevronRightIcon size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-10' : 'w-3 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Modern Stats Section ──────────────────────────────────────────────────────

function ModernStatsSection() {
  const stats = [
    { icon: Users, value: '10K+', label: 'Active Learners', gradient: 'from-blue-500 to-cyan-500' },
    { icon: GraduationCap, value: '500+', label: 'Expert Instructors', gradient: 'from-purple-500 to-pink-500' },
    { icon: BookOpen, value: '1000+', label: 'Courses Available', gradient: 'from-emerald-500 to-teal-500' },
    { icon: Star, value: '4.8★', label: 'Average Rating', gradient: 'from-orange-500 to-red-500' },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-primary via-primary to-secondary relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse animation-delay-1000" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center group hover:transform hover:-translate-y-2 transition-all duration-500">
                <div className={`inline-flex p-6 rounded-3xl bg-gradient-to-br ${stat.gradient} mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-5xl font-bold text-white mb-2">{stat.value}</div>
                <p className="text-white/80 text-lg">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── NEW: Certificate Verification Banner ──────────────────────────────────────

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
        <div className="absolute top-0 left-0 right-0 h-px" style={{
          background: 'linear-gradient(90deg, transparent, rgba(201,148,10,0.4), rgba(240,192,64,0.6), rgba(201,148,10,0.4), transparent)'
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{
          background: 'linear-gradient(90deg, transparent, rgba(201,148,10,0.4), rgba(240,192,64,0.6), rgba(201,148,10,0.4), transparent)'
        }} />
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
                  className="inline-flex items-center gap-3 font-bold px-8 py-4 rounded-full text-base transition-all hover:scale-105 shadow-2xl"
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
              <Link href="/verify">
                <button className="inline-flex items-center gap-3 font-semibold px-8 py-4 rounded-full text-base transition-all hover:bg-white/10 border text-white/70 hover:text-white"
                        style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
                  <Search size={18} />
                  Enter Certificate Code
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

// ─── Main HomePage ─────────────────────────────────────────────────────────────

export default function HomePage() {
  const [courses, setCourses]     = useState<CourseAny[]>([]);
  const [categories, setCategories] = useState<CategoryAny[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [coursesRes, categoriesRes] = await Promise.all([
          fetch('/api/courses?is_published=true&limit=100&include_reviews=true'),
          fetch('/api/categories')
        ]);

        if (!coursesRes.ok) throw new Error('Failed to load courses');
        if (!categoriesRes.ok) throw new Error('Failed to load categories');

        const coursesData    = await coursesRes.json();
        const categoriesData = await categoriesRes.json();

        if (isMounted) {
          const coursesArray = Array.isArray(coursesData) ? coursesData : coursesData.courses || [];
          setCourses(coursesArray);
          setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.categories || []);
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

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Slider — includes Verify Certificate slide */}
      <AutoSlider />

      {/* Stats */}
      <ModernStatsSection />

      {/* Become Instructor Steps */}
      <BecomeInstructorSteps />

      {/* ── Certificate Verification Banner — placed after steps, before categories ── */}
      <CertificateVerifyBanner />

      {/* Categories */}
      {!loading && categories.length > 0 && (
        <CategoriesSection categories={categories} />
      )}

      {/* Loading */}
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

      {/* Error */}
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

      {/* Courses */}
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
