
// // /src/app/about/components/mission-vision.tsx

// 'use client';

// import { motion } from 'framer-motion';
// import { Target, Eye, Brain, Zap } from 'lucide-react';

// export default function MissionVision() {
//   const items = [
//     {
//       icon: <Target className="h-8 w-8 text-blue-600" />,
//       title: "Our Mission",
//       description: "To democratize quality education by making it accessible, engaging, and effective for everyone, everywhere.",
//       color: "from-blue-50 to-blue-100/50",
//       border: "border-blue-200",
//     },
//     {
//       icon: <Eye className="h-8 w-8 text-purple-600" />,
//       title: "Our Vision",
//       description: "A world where anyone can learn anything, anytime, with personalized guidance and community support.",
//       color: "from-purple-50 to-purple-100/50",
//       border: "border-purple-200",
//     },
//     {
//       icon: <Brain className="h-8 w-8 text-green-600" />,
//       title: "Our Approach",
//       description: "Blending cutting-edge technology with pedagogical excellence to create transformative learning experiences.",
//       color: "from-green-50 to-green-100/50",
//       border: "border-green-200",
//     },
//     {
//       icon: <Zap className="h-8 w-8 text-orange-600" />,
//       title: "Our Promise",
//       description: "Delivering measurable skill development and career advancement through practical, project-based learning.",
//       color: "from-orange-50 to-orange-100/50",
//       border: "border-orange-200",
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
//             What Drives <span className="text-blue-600">AxioQuan</span>
//           </h2>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             We're more than just an e-learning platform. We're a movement dedicated to transforming
//             how the world learns and grows.
//           </p>
//         </motion.div>

//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {items.map((item, index) => (
//             <motion.div
//               key={item.title}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//               className={`bg-gradient-to-br ${item.color} border ${item.border} rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
//             >
//               <div className="flex items-center gap-4 mb-4">
//                 <div className="p-3 bg-white rounded-xl shadow-sm">
//                   {item.icon}
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
//               </div>
//               <p className="text-gray-600 leading-relaxed">{item.description}</p>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }























// /src/app/about/components/mission-vision.tsx

'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Target, Eye, Brain, Zap, Sparkles, Cpu, CircuitBoard, Globe, Rocket, Shield } from 'lucide-react';

export default function MissionVision() {
  const [particles, setParticles] = useState<Array<{left: string, top: string, delay: number, duration: number, size: number}>>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Generate particles only on client side
  useEffect(() => {
    const newParticles = [...Array(50)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 20,
      size: Math.random() * 3 + 1,
    }));
    setParticles(newParticles);
  }, []);

  const items = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Our Mission",
      description: "To democratize quality education by making it accessible, engaging, and effective for everyone, everywhere.",
      gradient: "from-blue-600 to-cyan-600",
      glow: "blue-500",
      iconBg: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Our Vision",
      description: "A world where anyone can learn anything, anytime, with personalized guidance and community support.",
      gradient: "from-purple-600 to-pink-600",
      glow: "purple-500",
      iconBg: "from-purple-500 to-pink-500",
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Our Approach",
      description: "Blending cutting-edge technology with pedagogical excellence to create transformative learning experiences.",
      gradient: "from-emerald-600 to-teal-600",
      glow: "emerald-500",
      iconBg: "from-emerald-500 to-teal-500",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Our Promise",
      description: "Delivering measurable skill development and career advancement through practical, project-based learning.",
      gradient: "from-amber-600 to-orange-600",
      glow: "amber-500",
      iconBg: "from-amber-500 to-orange-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const floatingIcons = [
    { Icon: Cpu, delay: 0, duration: 20, left: '5%', top: '10%', size: 24, color: 'blue-500/10' },
    { Icon: CircuitBoard, delay: 2, duration: 25, left: '90%', top: '15%', size: 32, color: 'purple-500/10' },
    { Icon: Globe, delay: 4, duration: 22, left: '10%', top: '80%', size: 40, color: 'emerald-500/10' },
    { Icon: Rocket, delay: 1, duration: 18, left: '85%', top: '70%', size: 28, color: 'amber-500/10' },
    { Icon: Shield, delay: 3, duration: 24, left: '45%', top: '20%', size: 20, color: 'pink-500/10' },
  ];

  return (
    <section ref={sectionRef} className="relative px-4 sm:px-6 lg:px-8 py-24 overflow-hidden">
      {/* Futuristic Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Light gradient for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
        
        {/* Soft tech pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Rotating geometric shapes - subtle */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 left-10 w-96 h-96 border border-gray-200/30 rounded-full"
        />
        
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 right-10 w-[500px] h-[500px] border border-gray-200/30 rounded-3xl"
        />

        {/* Floating icons - very subtle */}
        {floatingIcons.map((item, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: item.left,
              top: item.top,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
            }}
          >
            <item.Icon className="w-8 h-8 text-gray-200/30" />
          </motion.div>
        ))}

        {/* Soft gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-r from-blue-200/20 via-purple-200/20 to-pink-200/20 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.15, 0.1],
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-l from-emerald-200/20 via-teal-200/20 to-cyan-200/20 rounded-full blur-3xl"
        />

        {/* Floating particles - subtle */}
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gray-400/10"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Subtle scanning line */}
        <motion.div
          animate={{
            y: ['-100%', '100%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-300/30 to-transparent"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Animated badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            // className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6"
          >
            {/* <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Our Foundation
            </span> */}
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gray-800">What Drives</span>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}AxioQuan
            </span>
          </h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            We're more than just an e-learning platform. We're a movement dedicated to transforming
            how the world learns and grows.
          </motion.p>
        </motion.div>

        {/* Mission/Vision Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative"
            >
              {/* Glow effect on hover */}
              <div 
                className={`absolute -inset-0.5 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-all duration-500`}
              />
              
              {/* Card - White background for better contrast */}
              <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                {/* Subtle background pattern */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-5`} />
                
                {/* Icon with animation */}
                <div className="relative mb-6">
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-xl blur-md opacity-20`}
                  />
                  <div className={`relative w-16 h-16 rounded-xl bg-gradient-to-r ${item.iconBg} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>

                  {/* Floating particles on hover */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      whileHover={{
                        scale: [0, 1, 0],
                        x: [0, (i - 1) * 15],
                        y: [0, -20 - i * 5],
                      }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${item.gradient}`}
                      style={{
                        left: '50%',
                        top: '50%',
                      }}
                    />
                  ))}
                </div>

                {/* Title - Dark text */}
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300">
                  {item.title}
                </h3>
                
                {/* Description - Dark gray text */}
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Decorative line */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "40px" }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  className={`h-0.5 bg-gradient-to-r ${item.gradient} rounded-full mt-4`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center gap-2 mt-12"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}