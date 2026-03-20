
// // /src/components/home/become-instructor-steps.tsx

// 'use client';

// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   UserPlus, 
//   LogIn, 
//   FileText, 
//   CheckCircle, 
//   LogOut, 
//   Users, 
//   BookOpen,
//   Award,
//   ChevronRight,
//   Sparkles,
//   Shield,
//   Rocket,
//   GraduationCap,
//   Mail,
//   Linkedin,
//   Globe,
//   ArrowRight
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';

// const steps = [
//   {
//     id: 1,
//     icon: <UserPlus className="h-8 w-8" />,
//     title: "Create Your Account",
//     description: "Sign up for a free student account to start your journey",
//     details: "Fill out your basic information and verify your email address to create your student account.",
//     color: "from-blue-500 to-cyan-500",
//     bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
//     borderColor: "border-blue-200",
//     action: "Sign Up Now",
//     link: "/signup"
//   },
//   {
//     id: 2,
//     icon: <LogIn className="h-8 w-8" />,
//     title: "Complete Your Profile",
//     description: "Log in and build your comprehensive learner profile",
//     details: "Add your profile picture, bio, and connect your learning goals to establish your presence.",
//     color: "from-purple-500 to-pink-500",
//     bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
//     borderColor: "border-purple-200",
//     action: "Complete Profile",
//     link: "/dashboard"
//   },
//   {
//     id: 3,
//     icon: <FileText className="h-8 w-8" />,
//     title: "Request Instructor Role",
//     description: "Submit your teaching credentials for review",
//     details: "Share your expertise background, teaching experience, and social media links for our admin team to evaluate your qualifications.",
//     color: "from-green-500 to-emerald-500",
//     bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
//     borderColor: "border-green-200",
//     action: "Apply Now",
//     link: "/dashboard",
//     highlight: true
//   },
//   {
//     id: 4,
//     icon: <CheckCircle className="h-8 w-8" />,
//     title: "Admin Review & Approval",
//     description: "Our team carefully evaluates your application",
//     details: "We review your experience, expertise, and passion for teaching. Typically takes 1-3 business days.",
//     color: "from-yellow-500 to-orange-500",
//     bgColor: "bg-gradient-to-br from-yellow-50 to-orange-50",
//     borderColor: "border-yellow-200",
//     action: "Learn More",
//     link: "/dashboard"
//   },
//   {
//     id: 5,
//     icon: <LogOut className="h-8 w-8" />,
//     title: "Account Upgrade",
//     description: "After approval, please log out and then log back in to access new features.",
//     details: "Once approved, simply sign out and sign back in to see your upgraded instructor dashboard.",
//     color: "from-red-500 to-rose-500",
//     bgColor: "bg-gradient-to-br from-red-50 to-rose-50",
//     borderColor: "border-red-200",
//     action: "View Dashboard",
//     link: "/dashboard"
//   },
//   {
//     id: 6,
//     icon: <BookOpen className="h-8 w-8" />,
//     title: "Start Creating Courses",
//     description: "Build your first course with our powerful tools",
//     details: "Use our intuitive course builder to create engaging lessons, add curriculum, and design quizzes for students.",
//     color: "from-indigo-500 to-violet-500",
//     bgColor: "bg-gradient-to-br from-indigo-50 to-violet-50",
//     borderColor: "border-indigo-200",
//     action: "Start Creating",
//     link: "/dashboard"
//   },
//   {
//     id: 7,
//     icon: <Users className="h-8 w-8" />,
//     title: "Teach & Inspire",
//     description: "Share knowledge and impact thousands of learners",
//     details: "Engage with students, and build your reputation as an expert instructor in our community.",
//     color: "from-teal-500 to-cyan-500",
//     bgColor: "bg-gradient-to-br from-teal-50 to-cyan-50",
//     borderColor: "border-teal-200",
//     action: "Join Community",
//     link: "/dashboard"
//   }
// ];

// const applicationRequirements = [
//   {
//     icon: <GraduationCap className="h-5 w-5" />,
//     text: "Professional experience in your field"
//   },
//   {
//     icon: <Mail className="h-5 w-5" />,
//     text: "Clear communication skills"
//   },
//   {
//     icon: <Linkedin className="h-5 w-5" />,
//     text: "LinkedIn profile showing expertise"
//   },
//   {
//     icon: <Globe className="h-5 w-5" />,
//     text: "Portfolio or social proof of work"
//   },
//   {
//     icon: <Award className="h-5 w-5" />,
//     text: "Passion for teaching and mentoring"
//   },
//   {
//     icon: <Shield className="h-5 w-5" />,
//     text: "Commitment to quality education"
//   }
// ];

// export default function BecomeInstructorSteps() {
//   const [activeStep, setActiveStep] = useState(3);
//   const [hoveredStep, setHoveredStep] = useState<number | null>(null);

//   return (
//     <section className="py-20 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-16"
//         >
//           <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-200/50 mb-4">
//             <Sparkles className="h-4 w-4 text-blue-500" />
//             <span className="text-sm font-medium text-blue-700">Transform Your Expertise</span>
//           </div>
          
//           <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
//             Become an <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Instructor</span>
//           </h2>
          
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
//             Share your knowledge, inspire learners worldwide, and build a rewarding teaching career.
//             Follow these simple steps to start your journey as an AxioQuan instructor.
//           </p>
//         </motion.div>

//         <div className="grid lg:grid-cols-2 gap-12">
//           {/* Left Column - Steps */}
//           <div className="relative">
//             {/* Progress Line */}
//             <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-teal-500"></div>
            
//             {/* Steps List */}
//             <div className="space-y-8 relative z-10">
//               {steps.map((step, index) => {
//                 const isActive = activeStep === step.id;
//                 const isHovered = hoveredStep === step.id;
                
//                 return (
//                   <motion.div
//                     key={step.id}
//                     initial={{ opacity: 0, x: -20 }}
//                     whileInView={{ opacity: 1, x: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ duration: 0.5, delay: index * 0.1 }}
//                     className="relative"
//                     onMouseEnter={() => setHoveredStep(step.id)}
//                     onMouseLeave={() => setHoveredStep(null)}
//                     onClick={() => setActiveStep(step.id)}
//                   >
//                     {/* Step Connector */}
//                     {index < steps.length - 1 && (
//                       <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gray-200"></div>
//                     )}
                    
//                     {/* Step Card */}
//                     <div className={`relative flex gap-6 p-6 rounded-2xl transition-all duration-300 cursor-pointer ${
//                       isActive 
//                         ? 'transform scale-[1.02] shadow-2xl border-2' 
//                         : 'shadow-lg hover:shadow-xl hover:-translate-y-1 border'
//                     } ${step.bgColor} border-${step.borderColor.split('-')[1]}-200`}>
                      
//                       {/* Step Number Badge */}
//                       <div className={`relative flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${
//                         isActive 
//                           ? `bg-gradient-to-br ${step.color} text-white shadow-lg` 
//                           : 'bg-white border border-gray-200'
//                       }`}>
//                         {step.highlight && (
//                           <div className="absolute -top-2 -right-2">
//                             <Sparkles className="h-5 w-5 text-yellow-500 fill-yellow-500" />
//                           </div>
//                         )}
//                         {step.icon}
//                       </div>
                      
//                       {/* Step Content */}
//                       <div className="flex-1">
//                         <div className="flex items-center justify-between mb-2">
//                           <h3 className={`text-xl font-bold ${
//                             isActive ? 'text-gray-900' : 'text-gray-800'
//                           }`}>
//                             {step.title}
//                           </h3>
//                           <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                             isActive 
//                               ? 'bg-white/20 text-white' 
//                               : 'bg-gray-100 text-gray-700'
//                           }`}>
//                             Step {step.id}
//                           </div>
//                         </div>
                        
//                         <p className={`mb-3 ${
//                           isActive ? 'text-gray-700' : 'text-gray-600'
//                         }`}>
//                           {step.description}
//                         </p>
                        
//                         <AnimatePresence>
//                           {isActive && (
//                             <motion.div
//                               initial={{ opacity: 0, height: 0 }}
//                               animate={{ opacity: 1, height: 'auto' }}
//                               exit={{ opacity: 0, height: 0 }}
//                               transition={{ duration: 0.3 }}
//                             >
//                               <p className="text-gray-600 mb-4">{step.details}</p>
//                               <Link href={step.link}>
//                                 <Button className={`rounded-full px-6 cursor-pointer ${
//                                   step.highlight 
//                                     ? 'bg-gradient-to-r cursor-pointer from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
//                                     : ''
//                                 }`}>
//                                   {step.action}
//                                   <ArrowRight className="ml-2 h-4 w-4" />
//                                 </Button>
//                               </Link>
//                             </motion.div>
//                           )}
//                         </AnimatePresence>
//                       </div>
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Right Column - Application Details & Requirements */}
//           <div className="space-y-8">
//             {/* Application Requirements Card */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.2 }}
//               className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 text-white"
//             >
//               <div className="flex items-center gap-3 mb-6">
//                 <Shield className="h-8 w-8 text-blue-400" />
//                 <h3 className="text-2xl font-bold">What We Look For</h3>
//               </div>
              
//               <p className="text-gray-300 mb-8 leading-relaxed">
//                 We're looking for passionate experts who can create engaging, high-quality learning experiences.
//                 Here's what you'll need for a successful application:
//               </p>
              
//               <div className="space-y-4 mb-8">
//                 {applicationRequirements.map((req, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, x: 20 }}
//                     whileInView={{ opacity: 1, x: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ delay: 0.3 + index * 0.1 }}
//                     className="flex items-center gap-3"
//                   >
//                     <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
//                       {req.icon}
//                     </div>
//                     <span className="text-gray-200">{req.text}</span>
//                   </motion.div>
//                 ))}
//               </div>
              
//               <div className="bg-white/10 rounded-xl p-4 border border-white/20">
//                 <p className="text-sm text-gray-300">
//                   💡 <span className="font-semibold">Tip:</span> Include specific examples of your work, 
//                   teaching experience, or contributions to your field in your application.
//                 </p>
//               </div>
//             </motion.div>

//             {/* Benefits Card */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.4 }}
//               className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200"
//             >
//               <div className="flex items-center gap-3 mb-6">
//                 <Rocket className="h-8 w-8 text-blue-600" />
//                 <h3 className="text-2xl font-bold text-gray-900">Instructor Benefits</h3>
//               </div>
              
//               <div className="grid grid-cols-2 gap-4 mb-8">
//                 {[
//                   { label: "Advance tools", value: "100% Flexible" },
//                   { label: "Global Reach", value: "120+ Countries" },
//                   { label: "Support Team", value: "24/7 Available" },
//                   { label: "Analytics", value: "Real-time Data" },
//                 ].map((benefit, index) => (
//                   <div key={index} className="bg-white rounded-xl p-4 text-center border border-blue-100">
//                     <div className="text-2xl font-bold text-blue-600 mb-1">{benefit.value}</div>
//                     <div className="text-sm text-gray-600">{benefit.label}</div>
//                   </div>
//                 ))}
//               </div>
              
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-semibold text-gray-900">Ready to inspire learners?</p>
//                   <p className="text-sm text-gray-600">Start your application today</p>
//                 </div>
//                 <Link href="/signup">
//                   <Button className="cursor-pointer rounded-full cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
//                     Apply Now
//                     <Rocket className="ml-2 h-4 w-4" />
//                   </Button>
//                 </Link>
//               </div>
//             </motion.div>

            
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
























// 'use client';

// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import {
//   UserPlus,
//   LogIn,
//   FileText,
//   CheckCircle,
//   LogOut,
//   Users,
//   BookOpen,
//   Award,
//   Sparkles,
//   Shield,
//   Rocket,
//   GraduationCap,
//   Mail,
//   Linkedin,
//   Globe,
//   ArrowRight
// } from 'lucide-react';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';

// const steps = [
//   {
//     id: 1,
//     icon: UserPlus,
//     title: "Create Your Account",
//     description: "Sign up for a free student account to start your journey",
//     details: "Fill out your basic information and verify your email address to create your student account.",
//     link: "/signup"
//   },
//   {
//     id: 2,
//     icon: LogIn,
//     title: "Complete Your Profile",
//     description: "Log in and build your comprehensive learner profile",
//     details: "Add your profile picture, bio, and connect your learning goals to establish your presence.",
//     link: "/dashboard"
//   },
//   {
//     id: 3,
//     icon: FileText,
//     title: "Request Instructor Role",
//     description: "Submit your teaching credentials for review",
//     details: "Share your expertise background, teaching experience, and social media links for our admin team to evaluate your qualifications.",
//     link: "/dashboard"
//   },
//   {
//     id: 4,
//     icon: CheckCircle,
//     title: "Admin Review & Approval",
//     description: "Our team carefully evaluates your application",
//     details: "We review your experience, expertise, and passion for teaching. Typically takes 1-3 business days.",
//     link: "/dashboard"
//   },
//   {
//     id: 5,
//     icon: LogOut,
//     title: "Account Upgrade",
//     description: "After approval, log out and log back in.",
//     details: "Once approved, simply sign out and sign back in to see your upgraded instructor dashboard.",
//     link: "/dashboard"
//   },
//   {
//     id: 6,
//     icon: BookOpen,
//     title: "Start Creating Courses",
//     description: "Build your first course with our powerful tools",
//     details: "Use our intuitive course builder to create engaging lessons and quizzes.",
//     link: "/dashboard"
//   },
//   {
//     id: 7,
//     icon: Users,
//     title: "Teach & Inspire",
//     description: "Impact thousands of learners worldwide",
//     details: "Engage with students and grow your reputation.",
//     link: "/dashboard"
//   }
// ];

// const requirements = [
//   { icon: GraduationCap, text: "Professional experience in your field" },
//   { icon: Mail, text: "Clear communication skills" },
//   { icon: Linkedin, text: "LinkedIn profile showing expertise" },
//   { icon: Globe, text: "Portfolio or proof of work" },
//   { icon: Award, text: "Passion for teaching" },
//   { icon: Shield, text: "Commitment to quality education" }
// ];

// export default function BecomeInstructorModern() {
//   const [active, setActive] = useState(0);

//   const ActiveIcon = steps[active].icon;

//   return (
//     <section className="relative py-24 bg-black text-white overflow-hidden">

//       {/* Background Glow */}
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent blur-3xl" />

//       <div className="relative max-w-7xl mx-auto px-6">

//         {/* Header */}
//         <div className="text-center mb-20">
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-6">
//             <Sparkles className="w-4 h-4 text-yellow-400" />
//             <span className="text-sm">Transform Your Expertise</span>
//           </div>

//           <h2 className="text-5xl font-bold mb-6">
//             Become an <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Instructor</span>
//           </h2>

//           <p className="text-gray-400 max-w-2xl mx-auto text-lg">
//             Share your knowledge, inspire learners, and build a global teaching brand.
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-16">

//           {/* LEFT: Timeline */}
//           <div className="space-y-6">
//             {steps.map((step, index) => {
//               const Icon = step.icon;
//               const isActive = index === active;

//               return (
//                 <motion.div
//                   key={step.id}
//                   onClick={() => setActive(index)}
//                   whileHover={{ scale: 1.02 }}
//                   className={`cursor-pointer p-6 rounded-2xl border transition ${
//                     isActive
//                       ? 'bg-white/10 border-white/30'
//                       : 'bg-white/5 border-white/10 hover:bg-white/10'
//                   }`}
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className={`p-3 rounded-xl ${isActive ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-white/10'}`}>
//                       <Icon className="w-6 h-6" />
//                     </div>

//                     <div>
//                       <h3 className="font-semibold text-lg">{step.title}</h3>
//                       <p className="text-sm text-gray-400">{step.description}</p>
//                     </div>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </div>

//           {/* RIGHT: Active Detail Panel */}
//           <motion.div
//             key={active}
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="p-10 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl"
//           >
//             <div className="mb-6 flex items-center gap-4">
//               <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
//                 <ActiveIcon className="w-8 h-8" />
//               </div>
//               <h3 className="text-2xl font-bold">{steps[active].title}</h3>
//             </div>

//             <p className="text-gray-300 mb-6">
//               {steps[active].details}
//             </p>

//             <Link href={steps[active].link}>
//               <Button className="cursor-pointer rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90">
//                 Get Started
//                 <ArrowRight className="ml-2 w-4 h-4" />
//               </Button>
//             </Link>
//           </motion.div>

//         </div>

//         {/* REQUIREMENTS */}
//         <div className="mt-24 grid md:grid-cols-2 gap-10">

//           {/* Requirements */}
//           <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
//             <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
//               <Shield className="w-5 h-5 text-blue-400" />
//               Requirements
//             </h3>

//             <div className="space-y-4">
//               {requirements.map((r, i) => {
//                 const Icon = r.icon;
//                 return (
//                   <div key={i} className="flex items-center gap-3 text-gray-300">
//                     <Icon className="w-4 h-4 text-blue-400" />
//                     {r.text}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* CTA */}
//           <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
//             <h3 className="text-2xl font-bold mb-4">Start Your Journey</h3>
//             <p className="mb-6 text-white/80">
//               Join thousands of instructors teaching worldwide.
//             </p>

//             <Link href="/signup">
//               <Button className="bg-white text-black rounded-full cursor-pointer">
//                 Apply Now
//                 <Rocket className="ml-2 w-4 h-4" />
//               </Button>
//             </Link>
//           </div>

//         </div>

//       </div>
//     </section>
//   );
// }






















// /src/components/home/become-instructor-steps.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  LogIn, 
  FileText, 
  CheckCircle, 
  LogOut, 
  Users, 
  BookOpen,
  Award,
  ChevronRight,
  Sparkles,
  Shield,
  Rocket,
  GraduationCap,
  Mail,
  Linkedin,
  Globe,
  ArrowRight,
  Target,
  Zap,
  Heart,
  Star,
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const steps = [
  {
    id: 1,
    icon: <UserPlus className="h-6 w-6 md:h-8 md:w-8" />,
    title: "Create Your Account",
    description: "Sign up for a free student account to start your journey",
    details: "Fill out your basic information and verify your email address to create your student account.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10",
    borderColor: "border-blue-500/20",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
    action: "Sign Up Now",
    link: "/signup"
  },
  {
    id: 2,
    icon: <LogIn className="h-6 w-6 md:h-8 md:w-8" />,
    title: "Complete Your Profile",
    description: "Log in and build your comprehensive learner profile",
    details: "Add your profile picture, bio, and connect your learning goals to establish your presence.",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-gradient-to-br from-purple-500/10 to-pink-500/10",
    borderColor: "border-purple-500/20",
    iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
    action: "Complete Profile",
    link: "/dashboard"
  },
  {
    id: 3,
    icon: <FileText className="h-6 w-6 md:h-8 md:w-8" />,
    title: "Request Instructor Role",
    description: "Submit your teaching credentials for review",
    details: "Share your expertise background, teaching experience, and social media links for our admin team to evaluate your qualifications.",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-gradient-to-br from-emerald-500/10 to-teal-500/10",
    borderColor: "border-emerald-500/20",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
    action: "Apply Now",
    link: "/dashboard",
    highlight: true
  },
  {
    id: 4,
    icon: <CheckCircle className="h-6 w-6 md:h-8 md:w-8" />,
    title: "Admin Review & Approval",
    description: "Our team carefully evaluates your application",
    details: "We review your experience, expertise, and passion for teaching. Typically takes 1-3 business days.",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-gradient-to-br from-amber-500/10 to-orange-500/10",
    borderColor: "border-amber-500/20",
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
    action: "Learn More",
    link: "/dashboard"
  },
  {
    id: 5,
    icon: <LogOut className="h-6 w-6 md:h-8 md:w-8" />,
    title: "Account Upgrade",
    description: "After approval, please log out and then log back in to access new features.",
    details: "Once approved, simply sign out and sign back in to see your upgraded instructor dashboard.",
    color: "from-rose-500 to-red-500",
    bgColor: "bg-gradient-to-br from-rose-500/10 to-red-500/10",
    borderColor: "border-rose-500/20",
    iconBg: "bg-gradient-to-br from-rose-500 to-red-500",
    action: "View Dashboard",
    link: "/dashboard"
  },
  {
    id: 6,
    icon: <BookOpen className="h-6 w-6 md:h-8 md:w-8" />,
    title: "Start Creating Courses",
    description: "Build your first course with our powerful tools",
    details: "Use our intuitive course builder to create engaging lessons, add curriculum, and design quizzes for students.",
    color: "from-indigo-500 to-violet-500",
    bgColor: "bg-gradient-to-br from-indigo-500/10 to-violet-500/10",
    borderColor: "border-indigo-500/20",
    iconBg: "bg-gradient-to-br from-indigo-500 to-violet-500",
    action: "Start Creating",
    link: "/dashboard"
  },
  {
    id: 7,
    icon: <Users className="h-6 w-6 md:h-8 md:w-8" />,
    title: "Teach & Inspire",
    description: "Share knowledge and impact thousands of learners",
    details: "Engage with students, and build your reputation as an expert instructor in our community.",
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-gradient-to-br from-teal-500/10 to-cyan-500/10",
    borderColor: "border-teal-500/20",
    iconBg: "bg-gradient-to-br from-teal-500 to-cyan-500",
    action: "Join Community",
    link: "/dashboard"
  }
];

const applicationRequirements = [
  {
    icon: <GraduationCap className="h-5 w-5" />,
    text: "Professional experience in your field",
    color: "from-blue-400 to-cyan-400"
  },
  {
    icon: <Mail className="h-5 w-5" />,
    text: "Clear communication skills",
    color: "from-purple-400 to-pink-400"
  },
  {
    icon: <Linkedin className="h-5 w-5" />,
    text: "LinkedIn profile showing expertise",
    color: "from-emerald-400 to-teal-400"
  },
  {
    icon: <Globe className="h-5 w-5" />,
    text: "Portfolio or social proof of work",
    color: "from-amber-400 to-orange-400"
  },
  {
    icon: <Award className="h-5 w-5" />,
    text: "Passion for teaching and mentoring",
    color: "from-rose-400 to-red-400"
  },
  {
    icon: <Shield className="h-5 w-5" />,
    text: "Commitment to quality education",
    color: "from-indigo-400 to-violet-400"
  }
];

const benefits = [
  { icon: <Zap className="h-6 w-6" />, label: "100% Flexible", value: "Work on your own schedule", color: "from-blue-500 to-cyan-500" },
  { icon: <Globe className="h-6 w-6" />, label: "120+ Countries", value: "Global student reach", color: "from-purple-500 to-pink-500" },
  { icon: <Heart className="h-6 w-6" />, label: "24/7 Support", value: "Dedicated help team", color: "from-emerald-500 to-teal-500" },
  { icon: <TrendingUp className="h-6 w-6" />, label: "Real-time Analytics", value: "Track your impact", color: "from-amber-500 to-orange-500" },
  { icon: <DollarSign className="h-6 w-6" />, label: "Competitive Revenue", value: "Earn up to 70%", color: "from-rose-500 to-red-500" },
  { icon: <Star className="h-6 w-6" />, label: "Top Instructors", value: "Join the best", color: "from-indigo-500 to-violet-500" },
];

const stats = [
  { value: "5000+", label: "Active Instructors", icon: <Users className="h-4 w-4" /> },
  { value: "1M+", label: "Students Taught", icon: <GraduationCap className="h-4 w-4" /> },
  { value: "2000+", label: "Courses Created", icon: <BookOpen className="h-4 w-4" /> },
  { value: "4.8★", label: "Avg. Rating", icon: <Star className="h-4 w-4" /> },
];

export default function BecomeInstructorSteps() {
  const [activeStep, setActiveStep] = useState(3);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [particles, setParticles] = useState<Array<{x: string, y: string, duration: number, delay: number}>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  // Generate particles only on client side to avoid hydration mismatch
  useEffect(() => {
    const newParticles = [...Array(20)].map(() => ({
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <section ref={containerRef} className="relative py-24 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -50, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl"
        />

        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating Particles - Fixed hydration issue */}
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            suppressHydrationWarning
            className="absolute w-1 h-1 rounded-full bg-white/20"
            initial={{
              x: particle.x,
              y: particle.y,
            }}
            animate={{
              y: [null, -30, 30, -20, 0],
              x: [null, 20, -20, 10, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          {/* Animated Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6"
          >
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Transform Your Expertise</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
              Become an
            </span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}Instructor
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-white/50 max-w-3xl mx-auto leading-relaxed"
          >
            Share your knowledge, inspire learners worldwide, and build a rewarding teaching career.
            Follow these simple steps to start your journey as an AxioQuan instructor.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Steps Timeline */}
          <div className="relative">
            {/* Animated Timeline Line */}
            <motion.div
              initial={{ height: 0 }}
              animate={isInView ? { height: "100%" } : { height: 0 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500"
            />

            {/* Steps */}
            <div className="space-y-6 relative">
              {steps.map((step, index) => {
                const isActive = activeStep === step.id;
                const isHovered = hoveredStep === step.id;

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    onHoverStart={() => setHoveredStep(step.id)}
                    onHoverEnd={() => setHoveredStep(null)}
                    onClick={() => setActiveStep(step.id)}
                    className="relative cursor-pointer group"
                  >
                    {/* Step Card */}
                    <motion.div
                      animate={{
                        scale: isActive ? 1.02 : 1,
                        x: isActive ? 10 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`relative p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
                        isActive 
                          ? 'bg-white/10 border-white/20 shadow-2xl shadow-blue-500/20' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {/* Glow Effect */}
                      <motion.div
                        animate={{
                          opacity: isActive ? 0.5 : 0,
                          scale: isActive ? 1 : 0.8,
                        }}
                        className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-2xl blur-xl`}
                      />

                      <div className="relative flex gap-6">
                        {/* Icon Container */}
                        <div className="relative flex-shrink-0">
                          <motion.div
                            animate={{
                              rotate: isHovered ? 360 : 0,
                              scale: isHovered ? 1.1 : 1,
                            }}
                            transition={{ duration: 0.5 }}
                            className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${step.iconBg} flex items-center justify-center text-white shadow-lg`}
                          >
                            {step.icon}
                          </motion.div>

                          {/* Pulse Ring */}
                          {isActive && (
                            <motion.div
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 0, 0.5],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                              }}
                              className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-xl`}
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`text-xl font-bold ${
                              isActive ? 'text-white' : 'text-white/80 group-hover:text-white'
                            }`}>
                              {step.title}
                            </h3>
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              isActive 
                                ? `bg-gradient-to-r ${step.color} text-white` 
                                : 'bg-white/10 text-white/60'
                            }`}>
                              Step {step.id}
                            </div>
                          </div>

                          <p className={`mb-3 ${
                            isActive ? 'text-white/70' : 'text-white/50'
                          }`}>
                            {step.description}
                          </p>

                          <AnimatePresence>
                            {isActive && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                              >
                                <p className="text-white/60">{step.details}</p>
                                <Link href={step.link}>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`group relative inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white overflow-hidden`}
                                  >
                                    <div className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />
                                    <span className="relative flex items-center gap-2">
                                      {step.action}
                                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                  </motion.button>
                                </Link>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Info Cards */}
          <div className="space-y-6">
            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="relative p-6 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-center group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="flex items-center justify-center gap-1 text-sm text-white/50">
                      {stat.icon}
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Requirements Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.9 }}
              className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 overflow-hidden group"
            >
              {/* Animated Background */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
              />

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="h-8 w-8 text-blue-400" />
                  <h3 className="text-2xl font-bold text-white">What We Look For</h3>
                </div>

                <p className="text-white/60 mb-8 leading-relaxed">
                  We're looking for passionate experts who can create engaging, high-quality learning experiences.
                  Here's what you'll need for a successful application:
                </p>

                <div className="space-y-4 mb-8">
                  {applicationRequirements.map((req, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 1 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${req.color} flex items-center justify-center text-white`}>
                        {req.icon}
                      </div>
                      <span className="text-white/80">{req.text}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                  <p className="text-sm text-white/70">
                    <span className="font-semibold text-blue-400">💡 Tip:</span> Include specific examples of your work, 
                    teaching experience, or contributions to your field in your application.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Benefits Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="relative p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${benefit.color} flex items-center justify-center text-white mb-3`}>
                      {benefit.icon}
                    </div>
                    <div className="text-lg font-bold text-white mb-1">{benefit.value}</div>
                    <div className="text-xs text-white/50">{benefit.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.4 }}
              whileHover={{ scale: 1.02 }}
              className="relative p-8 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden group"
            >
              {/* Animated Shine Effect */}
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />

              <div className="relative flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">Ready to inspire learners?</h4>
                  <p className="text-white/80">Start your application today</p>
                </div>
                <Link href="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-6 py-3 rounded-full bg-white text-gray-900 font-semibold overflow-hidden"
                  >
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-gray-200/50 to-transparent transition-transform duration-700" />
                    <span className="relative flex items-center gap-2">
                      Apply Now
                      <Rocket className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}