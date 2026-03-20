
// // /src/app/about/components/about-hero.tsx

// 'use client';

// import { motion } from 'framer-motion';
// import { Sparkles, BookOpen, Users, Globe, ArrowRight } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// export default function AboutHero() {
//   return (
//     <section className="relative px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-24">
//       <div className="max-w-7xl mx-auto">
//         <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
//           {/* Left Column - Content */}
//           <div className="relative z-10">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 mb-6"
//             >
//               <Sparkles className="h-4 w-4 text-blue-500" />
//               <span className="text-sm font-medium text-blue-700">Transforming Education Since 2023</span>
//             </motion.div>

//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.1 }}
//               className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6"
//             >
//               Redefining
//               <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 Learning Experiences
//               </span>
//             </motion.h1>

//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
//             >
//               At AxioQuan, we're building the future of education — a platform where knowledge meets innovation,
//               and learning becomes an immersive journey of discovery and growth.
//             </motion.p>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.3 }}
//               className="flex flex-col sm:flex-row gap-4"
//             >
//               <Button className="px-8 py-3 text-lg rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all">
//                 Explore Courses
//                 <ArrowRight className="ml-2 h-5 w-5" />
//               </Button>
//               <Button variant="outline" className="px-8 py-3 text-lg rounded-xl border-2 hover:border-blue-300">
//                 Join Our Community
//               </Button>
//             </motion.div>
//           </div>

//           {/* Right Column - Visual Elements */}
//           <div className="relative">
//             <div className="relative grid grid-cols-2 gap-4">
//               {/* Animated stats cards */}
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5, delay: 0.4 }}
//                 className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl shadow-lg border border-blue-100"
//               >
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
//                     <Users className="h-6 w-6 text-blue-600" />
//                   </div>
//                   <div className="text-3xl font-bold text-gray-900">50K+</div>
//                 </div>
//                 <p className="text-gray-600">Active Learners</p>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5, delay: 0.5 }}
//                 className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl shadow-lg border border-purple-100 mt-8"
//               >
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
//                     <BookOpen className="h-6 w-6 text-purple-600" />
//                   </div>
//                   <div className="text-3xl font-bold text-gray-900">500+</div>
//                 </div>
//                 <p className="text-gray-600">Expert Courses</p>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5, delay: 0.6 }}
//                 className="bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl shadow-lg border border-green-100"
//               >
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
//                     <Globe className="h-6 w-6 text-green-600" />
//                   </div>
//                   <div className="text-3xl font-bold text-gray-900">120+</div>
//                 </div>
//                 <p className="text-gray-600">Countries Reached</p>
//               </motion.div>

//               {/* Floating element */}
//               <motion.div
//                 animate={{ y: [-10, 10, -10] }}
//                 transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
//                 className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-xl opacity-20"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

























// // /src/components/about/about-hero.tsx

// 'use client';

// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { Sparkles, BookOpen, Users, Globe, ArrowRight } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';

// interface SiteStats {
//   activeLearners: number;
//   expertInstructors: number;
//   coursesAvailable: number;
//   averageRating: number;
// }

// function formatCount(n: number): string {
//   if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
//   if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K+`;
//   return n > 0 ? `${n}+` : '—';
// }

// export default function AboutHero() {
//   const [stats, setStats] = useState<SiteStats | null>(null);

//   useEffect(() => {
//     fetch('/api/stats')
//       .then((r) => r.json())
//       .then((data) => setStats(data))
//       .catch(() => null);
//   }, []);

//   const statCards = [
//     {
//       icon: <Users className="h-6 w-6 text-blue-600" />,
//       iconBg: 'bg-blue-100',
//       cardBg: 'from-blue-50 to-white',
//       border: 'border-blue-100',
//       value: stats ? formatCount(stats.activeLearners) : '—',
//       label: 'Active Learners',
//       delay: 0.4,
//       offset: false,
//     },
//     {
//       icon: <BookOpen className="h-6 w-6 text-purple-600" />,
//       iconBg: 'bg-purple-100',
//       cardBg: 'from-purple-50 to-white',
//       border: 'border-purple-100',
//       value: stats ? formatCount(stats.coursesAvailable) : '—',
//       label: 'Expert Courses',
//       delay: 0.5,
//       offset: true,
//     },
//     {
//       icon: <Globe className="h-6 w-6 text-green-600" />,
//       iconBg: 'bg-green-100',
//       cardBg: 'from-green-50 to-white',
//       border: 'border-green-100',
//       value: stats ? formatCount(stats.expertInstructors) : '—',
//       label: 'Expert Instructors',
//       delay: 0.6,
//       offset: false,
//     },
//   ];

//   return (
//     <section className="relative px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-24">
//       <div className="max-w-7xl mx-auto">
//         <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
//           {/* Left Column */}
//           <div className="relative z-10">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 mb-6"
//             >
//               <Sparkles className="h-4 w-4 text-blue-500" />
//               <span className="text-sm font-medium text-blue-700">Transforming Education Since 2023</span>
//             </motion.div>

//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.1 }}
//               className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6"
//             >
//               Redefining
//               <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 Learning Experiences
//               </span>
//             </motion.h1>

//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
//             >
//               At AxioQuan, we're building the future of education — a platform where knowledge meets innovation,
//               and learning becomes an immersive journey of discovery and growth.
//             </motion.p>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.3 }}
//               className="flex flex-col sm:flex-row gap-4"
//             >
//               <Link href="/courses">
//                 <Button className="px-8 py-3 text-lg rounded-xl cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all">
//                   Explore Courses
//                   <ArrowRight className="ml-2 h-5 w-5" />
//                 </Button>
//               </Link>
//               <Link href="/instructors">
//                 <Button variant="outline" className="px-8 py-3 text-lg rounded-xl border-2 hover:border-blue-300 cursor-pointer">
//                   Join Our Community
//                 </Button>
//               </Link>
//             </motion.div>
//           </div>

//           {/* Right Column — Live Stats */}
//           <div className="relative">
//             <div className="relative grid grid-cols-2 gap-4">
//               {statCards.map((card) => (
//                 <motion.div
//                   key={card.label}
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.5, delay: card.delay }}
//                   className={`bg-gradient-to-br ${card.cardBg} p-6 rounded-2xl shadow-lg border ${card.border} ${card.offset ? 'mt-8' : ''}`}
//                 >
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center`}>
//                       {card.icon}
//                     </div>
//                     <div className="text-3xl font-bold text-gray-900 min-w-[3rem]">
//                       {stats ? (
//                         card.value
//                       ) : (
//                         <span className="inline-block w-16 h-8 bg-gray-200 animate-pulse rounded" />
//                       )}
//                     </div>
//                   </div>
//                   <p className="text-gray-600">{card.label}</p>
//                 </motion.div>
//               ))}

//               {/* Floating glow element */}
//               <motion.div
//                 animate={{ y: [-10, 10, -10] }}
//                 transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
//                 className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-xl opacity-20 pointer-events-none"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
























// /src/components/about/about-hero.tsx

// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { motion, useInView } from 'framer-motion';
// import { Sparkles, BookOpen, Users, Globe, ArrowRight, Star, Award, Zap } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';
// import CountUp from 'react-countup';

// interface SiteStats {
//   activeLearners: number;
//   expertInstructors: number;
//   coursesAvailable: number;
//   averageRating: number;
// }

// function formatCount(n: number): string {
//   if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
//   if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K+`;
//   return n > 0 ? `${n}+` : '—';
// }

// export default function AboutHero() {
//   const [stats, setStats] = useState<SiteStats | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [particles, setParticles] = useState<Array<{left: string, top: string}>>([]);
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

//   useEffect(() => {
//     fetch('/api/stats')
//       .then((r) => r.json())
//       .then((data) => {
//         setStats(data);
//         setIsLoading(false);
//       })
//       .catch(() => {
//         setIsLoading(false);
//       });
//   }, []);

//   // Generate particles only on client side to avoid hydration mismatch
//   useEffect(() => {
//     const newParticles = [...Array(8)].map(() => ({
//       left: `${Math.random() * 100}%`,
//       top: `${Math.random() * 100}%`,
//     }));
//     setParticles(newParticles);
//   }, []);

//   const statCards = [
//     {
//       icon: <Users className="h-6 w-6" />,
//       iconBg: 'from-blue-500 to-cyan-500',
//       cardBg: 'from-blue-500/10 via-transparent to-transparent',
//       value: stats?.activeLearners || 0,
//       label: 'Active Learners',
//       suffix: '+',
//       delay: 0.4,
//       color: 'blue',
//     },
//     {
//       icon: <BookOpen className="h-6 w-6" />,
//       iconBg: 'from-purple-500 to-pink-500',
//       cardBg: 'from-purple-500/10 via-transparent to-transparent',
//       value: stats?.coursesAvailable || 0,
//       label: 'Expert Courses',
//       suffix: '+',
//       delay: 0.5,
//       color: 'purple',
//     },
//     {
//       icon: <Globe className="h-6 w-6" />,
//       iconBg: 'from-emerald-500 to-teal-500',
//       cardBg: 'from-emerald-500/10 via-transparent to-transparent',
//       value: stats?.expertInstructors || 0,
//       label: 'Expert Instructors',
//       suffix: '+',
//       delay: 0.6,
//       color: 'emerald',
//     },
//     {
//       icon: <Star className="h-6 w-6" />,
//       iconBg: 'from-amber-500 to-orange-500',
//       cardBg: 'from-amber-500/10 via-transparent to-transparent',
//       value: stats?.averageRating || 0,
//       label: 'Average Rating',
//       suffix: '★',
//       delay: 0.7,
//       color: 'amber',
//       isRating: true,
//     },
//   ];

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.2,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 15,
//       },
//     },
//   };

//   return (
//     <section ref={sectionRef} className="relative px-4 sm:px-6 lg:px-8 pt-32 pb-24 overflow-hidden">
//       {/* Animated Background */}
//       <div className="absolute inset-0 -z-10">
//         {/* Gradient Orbs */}
//         <motion.div
//           animate={{
//             scale: [1, 1.2, 1],
//             opacity: [0.3, 0.5, 0.3],
//             x: [0, 50, 0],
//             y: [0, -30, 0],
//           }}
//           transition={{
//             duration: 15,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//           className="absolute top-20 -left-20 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl"
//         />
//         <motion.div
//           animate={{
//             scale: [1, 1.3, 1],
//             opacity: [0.2, 0.4, 0.2],
//             x: [0, -50, 0],
//             y: [0, 40, 0],
//           }}
//           transition={{
//             duration: 18,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//           className="absolute bottom-20 -right-20 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl"
//         />
        
//         {/* Grid Pattern */}
//         <div 
//           className="absolute inset-0 opacity-20"
//           style={{
//             backgroundImage: `
//               linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
//               linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
//             `,
//             backgroundSize: '60px 60px',
//           }}
//         />
//       </div>

//       <div className="max-w-7xl mx-auto">
//         <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
//           {/* Left Column - Content */}
//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             animate={isInView ? "visible" : "hidden"}
//             className="relative z-10"
//           >
//             {/* Animated Badge */}
//             <motion.div
//               variants={itemVariants}
//               className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6 group cursor-default"
//             >
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//               >
//                 <Sparkles className="h-4 w-4 text-blue-500" />
//               </motion.div>
//               <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 Transforming Education Since 2023
//               </span>
//             </motion.div>

//             {/* Main Heading - Uniform black color */}
//             <motion.h1
//               variants={itemVariants}
//               className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8"
//             >
//               <span className="text-gray-900">Redefining</span>
//               <br />
//               <span className="text-gray-900 relative">
//                 Learning Experiences
//                 {/* Animated underline with bottom margin space */}
//                 <motion.span
//                   initial={{ width: 0 }}
//                   animate={isInView ? { width: "100%" } : { width: 0 }}
//                   transition={{ duration: 1, delay: 1 }}
//                   className="absolute -bottom-3 left-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full"
//                 />
//               </span>
//             </motion.h1>

//             {/* Description - with top margin for space after underline */}
//             <motion.p
//               variants={itemVariants}
//               className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl mt-4"
//             >
//               At AxioQuan, we're building the future of education — a platform where knowledge meets innovation,
//               and learning becomes an immersive journey of discovery and growth.
//             </motion.p>

//             {/* Single CTA Button - removed community button */}
//             <motion.div
//               variants={itemVariants}
//               className="flex flex-col sm:flex-row gap-4"
//             >
//               <Link href="/courses">
//                 <motion.div
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <Button className="relative group px-8 py-4 text-lg rounded-full overflow-hidden cursor-pointer">
//                     <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-100 group-hover:opacity-90 transition-opacity" />
//                     <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />
//                     <span className="relative flex items-center gap-2 text-white">
//                       Explore Courses
//                       <motion.span
//                         animate={{ x: [0, 5, 0] }}
//                         transition={{ duration: 1.5, repeat: Infinity }}
//                       >
//                         <ArrowRight className="h-5 w-5" />
//                       </motion.span>
//                     </span>
//                   </Button>
//                 </motion.div>
//               </Link>
//             </motion.div>

//             {/* Trust Indicators - REMOVED as requested */}
//           </motion.div>

//           {/* Right Column - Stats Grid */}
//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             animate={isInView ? "visible" : "hidden"}
//             className="relative"
//           >
//             {/* Main Stats Grid */}
//             <div className="grid grid-cols-2 gap-4">
//               {statCards.map((card, index) => (
//                 <motion.div
//                   key={card.label}
//                   variants={itemVariants}
//                   whileHover={{ y: -5, scale: 1.02 }}
//                   className={`relative group ${index % 2 === 1 ? 'mt-8' : ''}`}
//                 >
//                   {/* Glow Effect */}
//                   <div className={`absolute inset-0 bg-gradient-to-br ${card.iconBg} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-all duration-500`} />
                  
//                   {/* Card */}
//                   <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
//                     {/* Background Pattern */}
//                     <div className={`absolute inset-0 bg-gradient-to-br ${card.cardBg} opacity-50`} />
                    
//                     {/* Animated Icon */}
//                     <div className="relative mb-4">
//                       <motion.div
//                         animate={{
//                           rotate: [0, 360],
//                         }}
//                         transition={{
//                           duration: 20,
//                           repeat: Infinity,
//                           ease: "linear",
//                         }}
//                         className={`absolute inset-0 bg-gradient-to-br ${card.iconBg} rounded-xl blur-md opacity-20`}
//                       />
//                       <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${card.iconBg} flex items-center justify-center text-white shadow-lg`}>
//                         {card.icon}
//                       </div>
//                     </div>

//                     {/* Value */}
//                     <div className="mb-1">
//                       <motion.div
//                         key={card.value}
//                         initial={{ scale: 0.5 }}
//                         animate={{ scale: 1 }}
//                         transition={{
//                           type: "spring",
//                           stiffness: 200,
//                           damping: 15,
//                           delay: 0.2 + card.delay,
//                         }}
//                       >
//                         <span className={`text-3xl font-bold bg-gradient-to-br ${card.iconBg} bg-clip-text text-transparent`}>
//                           {isLoading ? (
//                             <span className="inline-block w-16 h-8 bg-gray-200 animate-pulse rounded" />
//                           ) : (
//                             <CountUp
//                               end={card.isRating ? card.value : card.value}
//                               duration={2.5}
//                               delay={0.5 + card.delay}
//                               decimals={card.isRating ? 1 : 0}
//                               suffix={card.suffix}
//                             />
//                           )}
//                         </span>
//                       </motion.div>
//                     </div>

//                     {/* Label */}
//                     <p className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
//                       {card.label}
//                     </p>

//                     {/* Decorative Progress Bar */}
//                     <motion.div
//                       initial={{ width: 0 }}
//                       animate={isInView ? { width: "60px" } : { width: 0 }}
//                       transition={{ duration: 1, delay: 0.8 + card.delay }}
//                       className={`h-0.5 bg-gradient-to-r ${card.iconBg} rounded-full mt-3`}
//                     />
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Floating Decorative Elements */}
//             <motion.div
//               animate={{
//                 y: [0, -20, 0],
//                 rotate: [0, 10, 0],
//               }}
//               transition={{
//                 duration: 5,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//               }}
//               className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl shadow-xl flex items-center justify-center text-white text-2xl font-bold"
//             >
//               <Award className="h-8 w-8" />
//             </motion.div>

//             <motion.div
//               animate={{
//                 y: [0, 20, 0],
//                 rotate: [0, -10, 0],
//               }}
//               transition={{
//                 duration: 6,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//                 delay: 1,
//               }}
//               className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-pink-400 to-orange-400 rounded-xl shadow-xl flex items-center justify-center text-white text-xl font-bold"
//             >
//               <Zap className="h-6 w-6" />
//             </motion.div>

//             {/* Floating Particles - Fixed hydration issue */}
//             {particles.map((particle, i) => (
//               <motion.div
//                 key={i}
//                 suppressHydrationWarning
//                 className="absolute w-1 h-1 rounded-full bg-blue-400/30"
//                 style={{
//                   left: particle.left,
//                   top: particle.top,
//                 }}
//                 animate={{
//                   y: [0, -30, 0],
//                   x: [0, 20, 0],
//                   scale: [1, 1.5, 1],
//                   opacity: [0.3, 0.8, 0.3],
//                 }}
//                 transition={{
//                   duration: 5 + Math.random() * 5,
//                   repeat: Infinity,
//                   delay: Math.random() * 2,
//                 }}
//               />
//             ))}
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }














































// /src/components/about/about-hero.tsx

'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { Sparkles, BookOpen, Users, Globe, ArrowRight, Star, Award, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import CountUp from 'react-countup';

interface SiteStats {
  activeLearners: number;
  expertInstructors: number;
  coursesAvailable: number;
  averageRating: number;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K+`;
  return n > 0 ? `${n}+` : '—';
}

export default function AboutHero() {
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [particles, setParticles] = useState<Array<{left: string, top: string, delay: number, duration: number}>>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  // Generate particles only on client side to avoid hydration mismatch
  useEffect(() => {
    const newParticles = [...Array(30)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 15,
    }));
    setParticles(newParticles);
  }, []);

  const statCards = [
    {
      icon: <Users className="h-6 w-6" />,
      iconBg: 'from-blue-500 to-cyan-500',
      cardBg: 'from-blue-500/10 via-transparent to-transparent',
      value: stats?.activeLearners || 0,
      label: 'Active Learners',
      suffix: '+',
      delay: 0.4,
      color: 'blue',
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      iconBg: 'from-purple-500 to-pink-500',
      cardBg: 'from-purple-500/10 via-transparent to-transparent',
      value: stats?.coursesAvailable || 0,
      label: 'Expert Courses',
      suffix: '+',
      delay: 0.5,
      color: 'purple',
    },
    {
      icon: <Globe className="h-6 w-6" />,
      iconBg: 'from-emerald-500 to-teal-500',
      cardBg: 'from-emerald-500/10 via-transparent to-transparent',
      value: stats?.expertInstructors || 0,
      label: 'Expert Instructors',
      suffix: '+',
      delay: 0.6,
      color: 'emerald',
    },
    {
      icon: <Star className="h-6 w-6" />,
      iconBg: 'from-amber-500 to-orange-500',
      cardBg: 'from-amber-500/10 via-transparent to-transparent',
      value: stats?.averageRating || 0,
      label: 'Average Rating',
      suffix: '★',
      delay: 0.7,
      color: 'amber',
      isRating: true,
    },
  ];

  // Fixed variants with proper typing
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { 
      y: 20, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring" as const, 
        stiffness: 100, 
        damping: 15 
      }
    },
  };

  return (
    <section ref={sectionRef} className="relative px-4 sm:px-6 lg:px-8 pt-32 pb-24 overflow-hidden">
      {/* Beautiful Theme Background */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient with warm tones */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50" />
        
        {/* Soft organic shapes */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-r from-blue-200/40 via-purple-200/40 to-pink-200/40 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-gradient-to-l from-emerald-200/30 via-teal-200/30 to-cyan-200/30 rounded-full blur-3xl"
        />

        {/* Decorative pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 30 L30 55 L5 30 Z' fill='none' stroke='%23000' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Soft gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-1/4 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl"
        />

        {/* Floating particles */}
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gray-400/20"
            style={{
              left: particle.left,
              top: particle.top,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Soft radial gradient for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.3),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,255,255,0.3),_transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Column - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative z-10"
          >
            {/* Animated Badge */}
            <motion.div
              variants={itemVariants}
              // className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6 group cursor-default"
            >
              {/* <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-4 w-4 text-blue-600" />
              </motion.div>
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Transforming Education Since 2023
              </span> */}
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8"
            >
              <span className="text-gray-800">Redefining</span>
              <br />
              <span className="text-gray-800 relative">
                Learning Experiences
                <motion.span
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "100%" } : { width: 0 }}
                  transition={{ duration: 1, delay: 1 }}
                  className="absolute -bottom-3 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                />
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl mt-4"
            >
              At AxioQuan, we're building the future of education — a platform where knowledge meets innovation,
              and learning becomes an immersive journey of discovery and growth.
            </motion.p>

            {/* Dark Button */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/courses">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="relative group px-8 py-4 text-lg rounded-full overflow-hidden cursor-pointer bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <span className="relative flex items-center gap-2">
                      Explore Courses
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.span>
                    </span>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column - Stats Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {statCards.map((card, index) => (
                <motion.div
                  key={card.label}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`relative group ${index % 2 === 1 ? 'mt-8' : ''}`}
                >
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.iconBg} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-all duration-500`} />
                  
                  {/* Card */}
                  <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    {/* Background Pattern */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.cardBg} opacity-50`} />
                    
                    {/* Animated Icon */}
                    <div className="relative mb-4">
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className={`absolute inset-0 bg-gradient-to-br ${card.iconBg} rounded-xl blur-md opacity-20`}
                      />
                      <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${card.iconBg} flex items-center justify-center text-white shadow-lg`}>
                        {card.icon}
                      </div>
                    </div>

                    {/* Value */}
                    <div className="mb-1">
                      <motion.div
                        key={card.value}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                          delay: 0.2 + card.delay,
                        }}
                      >
                        <span className={`text-3xl font-bold bg-gradient-to-br ${card.iconBg} bg-clip-text text-transparent`}>
                          {isLoading ? (
                            <span className="inline-block w-16 h-8 bg-gray-200 animate-pulse rounded" />
                          ) : (
                            <CountUp
                              end={card.isRating ? card.value : card.value}
                              duration={2.5}
                              delay={0.5 + card.delay}
                              decimals={card.isRating ? 1 : 0}
                              suffix={card.suffix}
                            />
                          )}
                        </span>
                      </motion.div>
                    </div>

                    {/* Label */}
                    <p className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                      {card.label}
                    </p>

                    {/* Decorative Progress Bar */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: "60px" } : { width: 0 }}
                      transition={{ duration: 1, delay: 0.8 + card.delay }}
                      className={`h-0.5 bg-gradient-to-r ${card.iconBg} rounded-full mt-3`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Floating Decorative Elements */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-xl flex items-center justify-center text-white text-2xl font-bold"
            >
              <Award className="h-8 w-8" />
            </motion.div>

            <motion.div
              animate={{
                y: [0, 20, 0],
                rotate: [0, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl shadow-xl flex items-center justify-center text-white text-xl font-bold"
            >
              <Zap className="h-6 w-6" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}