
// // /src/app/about/components/values-section.tsx

// 'use client';

// import { motion } from 'framer-motion';
// import { Heart, Shield, Users, Zap, Globe, Target } from 'lucide-react';

// export default function ValuesSection() {
//   const values = [
//     {
//       icon: <Heart className="h-8 w-8" />,
//       title: "Learner First",
//       description: "Every decision we make centers around enhancing the student experience and outcomes.",
//       color: "text-red-500",
//       bgColor: "bg-red-50",
//     },
//     {
//       icon: <Shield className="h-8 w-8" />,
//       title: "Quality First",
//       description: "We maintain the highest standards in course content, instruction, and platform performance.",
//       color: "text-blue-500",
//       bgColor: "bg-blue-50",
//     },
//     {
//       icon: <Users className="h-8 w-8" />,
//       title: "Community Driven",
//       description: "Learning thrives in collaboration. We build spaces where students support each other's growth.",
//       color: "text-green-500",
//       bgColor: "bg-green-50",
//     },
//     {
//       icon: <Zap className="h-8 w-8" />,
//       title: "Innovation Focused",
//       description: "Continuously evolving our platform with cutting-edge technology and teaching methods.",
//       color: "text-yellow-500",
//       bgColor: "bg-yellow-50",
//     },
//     {
//       icon: <Globe className="h-8 w-8" />,
//       title: "Global Access",
//       description: "Breaking geographical barriers to make quality education available to all.",
//       color: "text-purple-500",
//       bgColor: "bg-purple-50",
//     },
//     {
//       icon: <Target className="h-8 w-8" />,
//       title: "Results Oriented",
//       description: "Focusing on tangible outcomes that translate to real-world success.",
//       color: "text-orange-500",
//       bgColor: "bg-orange-50",
//     },
//   ];

//   return (
//     <section className="px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-12"
//         >
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//             Our Core <span className="text-blue-600">Values</span>
//           </h2>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             The principles that guide every aspect of our platform and community
//           </p>
//         </motion.div>

//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {values.map((value, index) => (
//             <motion.div
//               key={value.title}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//               className="group"
//             >
//               <div className={`${value.bgColor} rounded-2xl p-8 transition-all duration-300 group-hover:shadow-2xl border border-transparent group-hover:border-gray-200`}>
//                 <div className={`${value.color} mb-6`}>
//                   <div className="inline-flex p-3 rounded-xl bg-white shadow-lg">
//                     {value.icon}
//                   </div>
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
//                 <p className="text-gray-600 leading-relaxed">{value.description}</p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }


























// // /src/app/about/components/values-section.tsx

// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { motion, useInView } from 'framer-motion';
// import { Heart, Shield, Users, Zap, Globe, Target, Sparkles, Award, Star, Cpu } from 'lucide-react';

// export default function ValuesSection() {
//   const [particles, setParticles] = useState<Array<{left: string, top: string, delay: number, duration: number}>>([]);
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

//   // Generate particles only on client side
//   useEffect(() => {
//     const newParticles = [...Array(30)].map(() => ({
//       left: `${Math.random() * 100}%`,
//       top: `${Math.random() * 100}%`,
//       delay: Math.random() * 5,
//       duration: 8 + Math.random() * 12,
//     }));
//     setParticles(newParticles);
//   }, []);

//   const values = [
//     {
//       icon: <Heart className="h-8 w-8" />,
//       title: "Learner First",
//       description: "Every decision we make centers around enhancing the student experience and outcomes.",
//       gradient: "from-rose-500 to-pink-500",
//       bgGradient: "from-rose-50 to-pink-50",
//       iconBg: "from-rose-500 to-pink-500",
//       glow: "rose-500",
//     },
//     {
//       icon: <Shield className="h-8 w-8" />,
//       title: "Quality First",
//       description: "We maintain the highest standards in course content, instruction, and platform performance.",
//       gradient: "from-blue-500 to-cyan-500",
//       bgGradient: "from-blue-50 to-cyan-50",
//       iconBg: "from-blue-500 to-cyan-500",
//       glow: "blue-500",
//     },
//     {
//       icon: <Users className="h-8 w-8" />,
//       title: "Community Driven",
//       description: "Learning thrives in collaboration. We build spaces where students support each other's growth.",
//       gradient: "from-emerald-500 to-teal-500",
//       bgGradient: "from-emerald-50 to-teal-50",
//       iconBg: "from-emerald-500 to-teal-500",
//       glow: "emerald-500",
//     },
//     {
//       icon: <Zap className="h-8 w-8" />,
//       title: "Innovation Focused",
//       description: "Continuously evolving our platform with cutting-edge technology and teaching methods.",
//       gradient: "from-amber-500 to-orange-500",
//       bgGradient: "from-amber-50 to-orange-50",
//       iconBg: "from-amber-500 to-orange-500",
//       glow: "amber-500",
//     },
//     {
//       icon: <Globe className="h-8 w-8" />,
//       title: "Global Access",
//       description: "Breaking geographical barriers to make quality education available to all.",
//       gradient: "from-purple-500 to-indigo-500",
//       bgGradient: "from-purple-50 to-indigo-50",
//       iconBg: "from-purple-500 to-indigo-500",
//       glow: "purple-500",
//     },
//     {
//       icon: <Target className="h-8 w-8" />,
//       title: "Results Oriented",
//       description: "Focusing on tangible outcomes that translate to real-world success.",
//       gradient: "from-orange-500 to-red-500",
//       bgGradient: "from-orange-50 to-red-50",
//       iconBg: "from-orange-500 to-red-500",
//       glow: "orange-500",
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
//     hidden: { y: 30, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: "spring" as const,
//         stiffness: 100,
//         damping: 15,
//       },
//     },
//   };

//   // Floating decorative icons
//   const floatingIcons = [
//     { Icon: Award, delay: 0, duration: 20, left: '2%', top: '10%', size: 24 },
//     { Icon: Star, delay: 2, duration: 25, left: '95%', top: '20%', size: 32 },
//     { Icon: Cpu, delay: 4, duration: 22, left: '8%', top: '85%', size: 28 },
//     { Icon: Sparkles, delay: 1, duration: 18, left: '92%', top: '75%', size: 20 },
//   ];

//   return (
//     <section ref={sectionRef} className="relative px-4 sm:px-6 lg:px-8 py-24 overflow-hidden">
//       {/* Animated Background */}
//       <div className="absolute inset-0 -z-10">
//         {/* Base gradient */}
//         <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
        
//         {/* Subtle pattern overlay */}
//         <div 
//           className="absolute inset-0 opacity-20"
//           style={{
//             backgroundImage: `
//               radial-gradient(circle at 20% 30%, rgba(59,130,246,0.05) 0%, transparent 50%),
//               radial-gradient(circle at 80% 70%, rgba(168,85,247,0.05) 0%, transparent 50%)
//             `,
//           }}
//         />
        
//         {/* Animated gradient orbs */}
//         <motion.div
//           animate={{
//             scale: [1, 1.2, 1],
//             opacity: [0.1, 0.15, 0.1],
//             x: [0, 50, 0],
//             y: [0, -30, 0],
//           }}
//           transition={{
//             duration: 15,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//           className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-r from-blue-200/30 via-purple-200/30 to-pink-200/30 rounded-full blur-3xl"
//         />
        
//         <motion.div
//           animate={{
//             scale: [1, 1.3, 1],
//             opacity: [0.1, 0.15, 0.1],
//             x: [0, -50, 0],
//             y: [0, 40, 0],
//           }}
//           transition={{
//             duration: 18,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//           className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-l from-emerald-200/30 via-teal-200/30 to-cyan-200/30 rounded-full blur-3xl"
//         />

//         {/* Floating icons */}
//         {floatingIcons.map((item, i) => (
//           <motion.div
//             key={i}
//             className="absolute"
//             style={{
//               left: item.left,
//               top: item.top,
//             }}
//             animate={{
//               y: [0, -30, 0],
//               x: [0, 20, 0],
//               rotate: [0, 360],
//               scale: [1, 1.2, 1],
//             }}
//             transition={{
//               duration: item.duration,
//               repeat: Infinity,
//               delay: item.delay,
//               ease: "easeInOut",
//             }}
//           >
//             <item.Icon className="w-8 h-8 text-gray-200/40" />
//           </motion.div>
//         ))}

//         {/* Floating particles */}
//         {particles.map((particle, i) => (
//           <motion.div
//             key={i}
//             className="absolute w-1 h-1 rounded-full bg-gray-300/30"
//             style={{
//               left: particle.left,
//               top: particle.top,
//             }}
//             animate={{
//               y: [0, -20, 0],
//               opacity: [0.2, 0.5, 0.2],
//             }}
//             transition={{
//               duration: particle.duration,
//               repeat: Infinity,
//               delay: particle.delay,
//               ease: "easeInOut",
//             }}
//           />
//         ))}

//         {/* Subtle grid pattern */}
//         <div 
//           className="absolute inset-0 opacity-[0.02]"
//           style={{
//             backgroundImage: `
//               linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
//               linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
//             `,
//             backgroundSize: '40px 40px',
//           }}
//         />
//       </div>

//       <div className="max-w-7xl mx-auto relative z-10">
//         {/* Section Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-16"
//         >
//           {/* Animated badge */}
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             whileInView={{ scale: 1, opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             // className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6"
//           >
//             {/* <Sparkles className="h-4 w-4 text-blue-600" />
//             <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//               Our Guiding Principles
//             </span> */}
//           </motion.div>

//           <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
//             <span className="text-gray-800">Our Core</span>
//             <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
//               {" "}Values
//             </span>
//           </h2>
          
//           <motion.p 
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             transition={{ delay: 0.3 }}
//             className="text-lg text-gray-600 max-w-3xl mx-auto"
//           >
//             The principles that guide every aspect of our platform and community
//           </motion.p>
//         </motion.div>

//         {/* Values Grid */}
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate={isInView ? "visible" : "hidden"}
//           className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
//         >
//           {values.map((value, index) => (
//             <motion.div
//               key={value.title}
//               variants={itemVariants}
//               whileHover={{ y: -10, scale: 1.02 }}
//               className="group relative"
//             >
//               {/* Glow effect on hover */}
//               <div 
//                 className={`absolute -inset-0.5 bg-gradient-to-r ${value.gradient} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-all duration-500`}
//               />
              
//               {/* Card */}
//               <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
//                 {/* Background gradient pattern */}
//                 <div className={`absolute inset-0 bg-gradient-to-br ${value.bgGradient} opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
                
//                 {/* Animated icon container */}
//                 <div className="relative mb-6">
//                   {/* Rotating ring */}
//                   <motion.div
//                     animate={{
//                       rotate: [0, 360],
//                     }}
//                     transition={{
//                       duration: 20,
//                       repeat: Infinity,
//                       ease: "linear",
//                     }}
//                     className={`absolute inset-0 bg-gradient-to-r ${value.gradient} rounded-xl blur-md opacity-20`}
//                   />
                  
//                   {/* Icon */}
//                   <div className={`relative w-16 h-16 rounded-xl bg-gradient-to-r ${value.iconBg} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
//                     {value.icon}
//                   </div>

//                   {/* Floating particles on hover */}
//                   {[...Array(3)].map((_, i) => (
//                     <motion.div
//                       key={i}
//                       initial={{ scale: 0 }}
//                       whileHover={{
//                         scale: [0, 1, 0],
//                         x: [0, (i - 1) * 15],
//                         y: [0, -20 - i * 5],
//                       }}
//                       transition={{ duration: 0.8, delay: i * 0.1 }}
//                       className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${value.gradient}`}
//                       style={{
//                         left: '50%',
//                         top: '50%',
//                       }}
//                     />
//                   ))}
//                 </div>

//                 {/* Title */}
//                 <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300">
//                   {value.title}
//                 </h3>
                
//                 {/* Description */}
//                 <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
//                   {value.description}
//                 </p>

//                 {/* Decorative progress bar */}
//                 <motion.div
//                   initial={{ width: 0 }}
//                   whileInView={{ width: "60px" }}
//                   transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
//                   className={`h-0.5 bg-gradient-to-r ${value.gradient} rounded-full mt-6`}
//                 />
//               </div>
//             </motion.div>
//           ))}
//         </motion.div>

//         {/* Bottom decorative element */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.8 }}
//           className="flex justify-center items-center gap-4 mt-16"
//         >
//           {values.slice(0, 3).map((value, i) => (
//             <motion.div
//               key={i}
//               animate={{
//                 scale: [1, 1.2, 1],
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 delay: i * 0.3,
//               }}
//               className={`w-2 h-2 rounded-full bg-gradient-to-r ${value.gradient}`}
//             />
//           ))}
//           <span className="text-sm text-gray-400 mx-2">driven by purpose</span>
//           {values.slice(3, 6).map((value, i) => (
//             <motion.div
//               key={i + 3}
//               animate={{
//                 scale: [1, 1.2, 1],
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 delay: i * 0.3 + 1,
//               }}
//               className={`w-2 h-2 rounded-full bg-gradient-to-r ${value.gradient}`}
//             />
//           ))}
//         </motion.div>
//       </div>
//     </section>
//   );
// }









































'use client';

// /src/app/about/components/values-section.tsx

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart, Shield, Users, Zap, Globe, Target, Award, Star, Cpu, Sparkles } from 'lucide-react';

export default function ValuesSection() {
  const [particles, setParticles] = useState<Array<{ left: string; top: string; delay: number; duration: number }>>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    setParticles([...Array(30)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 12,
    })));
  }, []);

  const values = [
    { icon: <Heart className="h-8 w-8" />, title: 'Learner First', description: "Every decision we make centers around enhancing the student experience and outcomes.", gradient: 'from-rose-500 to-pink-500', iconBg: 'from-rose-500 to-pink-500' },
    { icon: <Shield className="h-8 w-8" />, title: 'Quality First', description: 'We maintain the highest standards in course content, instruction, and platform performance.', gradient: 'from-blue-500 to-cyan-500', iconBg: 'from-blue-500 to-cyan-500' },
    { icon: <Users className="h-8 w-8" />, title: 'Community Driven', description: "Learning thrives in collaboration. We build spaces where students support each other's growth.", gradient: 'from-emerald-500 to-teal-500', iconBg: 'from-emerald-500 to-teal-500' },
    { icon: <Zap className="h-8 w-8" />, title: 'Innovation Focused', description: 'Continuously evolving our platform with cutting-edge technology and teaching methods.', gradient: 'from-amber-500 to-orange-500', iconBg: 'from-amber-500 to-orange-500' },
    { icon: <Globe className="h-8 w-8" />, title: 'Global Access', description: 'Breaking geographical barriers to make quality education available to all.', gradient: 'from-violet-500 to-indigo-500', iconBg: 'from-violet-500 to-indigo-500' },
    { icon: <Target className="h-8 w-8" />, title: 'Results Oriented', description: 'Focusing on tangible outcomes that translate to real-world success.', gradient: 'from-orange-500 to-red-500', iconBg: 'from-orange-500 to-red-500' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } },
  };

  const floatingIcons = [
    { Icon: Award, delay: 0, duration: 20, left: '2%', top: '10%' },
    { Icon: Star, delay: 2, duration: 25, left: '95%', top: '20%' },
    { Icon: Cpu, delay: 4, duration: 22, left: '8%', top: '85%' },
    { Icon: Sparkles, delay: 1, duration: 18, left: '92%', top: '75%' },
  ];

  return (
    <section ref={sectionRef} className="relative px-4 sm:px-6 lg:px-8 py-24 overflow-hidden bg-[#0f0a0f]">

      {/* ── VALUES: diagonal diamond grid — purple tint, warmest dark base ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 45° diagonal lines */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              rgba(168,85,247,1) 0px,
              rgba(168,85,247,1) 1px,
              transparent 1px,
              transparent 32px
            )`,
          }}
        />
        {/* -45° counter-diagonal — creates diamond/checker weave */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              rgba(168,85,247,1) 0px,
              rgba(168,85,247,1) 1px,
              transparent 1px,
              transparent 32px
            )`,
          }}
        />
        {/* Purple glow orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-700/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-700/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl" />
        {/* Floating icons */}
        {floatingIcons.map((item, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: item.left, top: item.top }}
            animate={{ y: [0, -30, 0], x: [0, 20, 0], rotate: [0, 360], scale: [1, 1.2, 1] }}
            transition={{ duration: item.duration, repeat: Infinity, delay: item.delay, ease: 'easeInOut' }}
          >
            <item.Icon className="w-8 h-8 text-purple-400/10" />
          </motion.div>
        ))}
        {/* Particles */}
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-purple-400/20"
            style={{ left: p.left, top: p.top }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Our Core</span>
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"> Values</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            The principles that guide every aspect of our platform and community
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {values.map((value, index) => (
            <motion.div key={value.title} variants={itemVariants} whileHover={{ y: -10, scale: 1.02 }} className="group relative">
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${value.gradient} opacity-0 group-hover:opacity-25 rounded-2xl blur-xl transition-all duration-500`} />
              <div className="relative bg-white/5 border border-white/8 rounded-2xl p-8 hover:bg-white/8 transition-all duration-300 overflow-hidden backdrop-blur-sm">
                <div className="relative mb-6">
                  <div className={`relative w-16 h-16 rounded-xl bg-gradient-to-r ${value.iconBg} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{value.description}</p>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '60px' }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  className={`h-0.5 bg-gradient-to-r ${value.gradient} rounded-full mt-6`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center items-center gap-4 mt-16"
        >
          {values.slice(0, 3).map((value, i) => (
            <motion.div key={i} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              className={`w-2 h-2 rounded-full bg-gradient-to-r ${value.gradient}`} />
          ))}
          <span className="text-sm text-gray-600 mx-2">driven by purpose</span>
          {values.slice(3, 6).map((value, i) => (
            <motion.div key={i + 3} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 + 1 }}
              className={`w-2 h-2 rounded-full bg-gradient-to-r ${value.gradient}`} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
