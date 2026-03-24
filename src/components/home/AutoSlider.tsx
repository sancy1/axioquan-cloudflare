
// // // src/components/home/AutoSlider.tsx

// 'use client';

// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import {
//   ArrowRight, ChevronLeft, ChevronRight,
//   Sparkles, Play, BookOpen, Users, Star,
// } from 'lucide-react';

// // ─── Slide data ───────────────────────────────────────────────────────────────
// const slides = [
//   {
//     id: 1,
//     title: 'Start Your\nLearning Journey',
//     subtitle: 'New Courses Added',
//     description: 'Access 1000+ courses from industry experts and level up your skills today.',
//     cta: 'Explore Courses',
//     image: '/images/python-course.jpg',
//     link: '/dashboard',
//     accent: '#3B82F6',
//     accentRgb: '59,130,246',
//     tag: 'Most Popular',
//     stats: [
//       { icon: BookOpen, label: '1,000+ Courses' },
//       { icon: Users,    label: '50K+ Learners'  },
//     ],
//   },
//   {
//     id: 2,
//     title: 'Become an\nInstructor',
//     subtitle: 'Share Your Knowledge',
//     description: 'Teach what you know, earn what you deserve. Join our growing instructor community.',
//     cta: 'Start Teaching',
//     image: '/images/react-course-hero.jpg',
//     link: '/dashboard/request-upgrade',
//     accent: '#8B5CF6',
//     accentRgb: '139,92,246',
//     tag: 'Earn & Teach',
//     stats: [
//       { icon: Star,  label: '4.9 Avg Rating' },
//       { icon: Users, label: '200+ Instructors' },
//     ],
//   },
//   {
//     id: 3,
//     title: 'Learn from\nThe Best',
//     subtitle: 'Industry Professionals',
//     description: 'Learn from industry professionals and thought leaders shaping the future.',
//     cta: 'Meet Instructors',
//     image: '/images/ios-development.png',
//     link: '/instructors',
//     accent: '#F59E0B',
//     accentRgb: '245,158,11',
//     tag: 'Expert-Led',
//     stats: [
//       { icon: Star,     label: 'Top Instructors' },
//       { icon: BookOpen, label: 'Live Sessions'    },
//     ],
//   },
//   {
//     id: 4,
//     title: 'Advance Your\nCareer Today',
//     subtitle: 'Get Certified',
//     description: 'Earn recognised certificates and unlock new opportunities in your career.',
//     cta: 'View Certificates',
//     image: '/images/instructor-portrait.png',
//     link: '/dashboard/certificates',
//     accent: '#10B981',
//     accentRgb: '16,185,129',
//     tag: 'Career Boost',
//     stats: [
//       { icon: Star,  label: 'Verified Certs' },
//       { icon: Users, label: 'Hired Graduates' },
//     ],
//   },
// ];

// const DURATION = 5500;  // ms between auto-advances
// const ANIM     = 650;   // ms transition

// // ─── Keyframe string — injected once into a <style> tag that never changes ───
// const KEYFRAMES = `
// @keyframes _axio_fadeUp {
//   from { opacity:0; transform:translateY(28px); }
//   to   { opacity:1; transform:translateY(0);    }
// }
// @keyframes _axio_fadeIn {
//   from { opacity:0; }
//   to   { opacity:1; }
// }
// @keyframes _axio_scaleIn {
//   from { opacity:0; transform:scale(0.92); }
//   to   { opacity:1; transform:scale(1);    }
// }
// @keyframes _axio_progress {
//   from { transform: scaleX(0); }
//   to   { transform: scaleX(1); }
// }
// `;

// // ─── Static <style> — rendered once, never re-renders ─────────────────────────
// function StaticStyles() {
//   return <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />;
// }

// // ─── Main component ────────────────────────────────────────────────────────────
// export default function AutoSlider() {
//   const router        = useRouter();
//   const [idx, setIdx] = useState(0);
//   const [prev, setPrev] = useState<number | null>(null);
//   const [entering, setEntering] = useState(false);

//   const idxRef      = useRef(0);
//   const animRef     = useRef(false);
//   const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
//   const progressRef = useRef<HTMLDivElement | null>(null);

//   // Restart the CSS progress-bar animation
//   const restartProgress = useCallback(() => {
//     const el = progressRef.current;
//     if (!el) return;
//     el.style.animation = 'none';
//     // Force reflow without reading offsetHeight (avoids layout thrash)
//     void el.offsetWidth;
//     el.style.animation = `_axio_progress ${DURATION}ms linear forwards`;
//   }, []);

//   const advance = useCallback((nextIdx: number) => {
//     if (animRef.current) return;
//     animRef.current = true;
//     setPrev(idxRef.current);
//     setEntering(true);
//     idxRef.current = nextIdx;
//     setIdx(nextIdx);
//     restartProgress();
//     setTimeout(() => {
//       animRef.current = false;
//       setPrev(null);
//       setEntering(false);
//     }, ANIM);
//   }, [restartProgress]);

//   const goNext = useCallback(() => advance((idxRef.current + 1) % slides.length), [advance]);
//   const goPrev = useCallback(() => advance((idxRef.current - 1 + slides.length) % slides.length), [advance]);
//   const goTo   = useCallback((i: number) => advance(i), [advance]);

//   // Auto-play
//   useEffect(() => {
//     restartProgress();
//     timerRef.current = setInterval(goNext, DURATION);
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);                        // ← intentionally empty: interval set once

//   // Reset interval when user manually navigates
//   const manualNav = useCallback((fn: () => void) => {
//     if (timerRef.current) clearInterval(timerRef.current);
//     fn();
//     timerRef.current = setInterval(goNext, DURATION);
//   }, [goNext]);

//   const slide = slides[idx];

//   return (
//     <>
//       {/* Keyframes injected ONCE — this component never re-renders */}
//       <StaticStyles />

//       <section
//         className="relative w-full overflow-hidden bg-gray-950"
//         style={{ height: 'clamp(520px, 70vh, 720px)' }}
//       >

//         {/* ── Background slides (cross-fade) ───────────────────────── */}
//         {slides.map((s, i) => {
//           const isActive  = i === idx;
//           const isPrev    = i === prev;
//           return (
//             <div
//               key={s.id}
//               aria-hidden={!isActive}
//               className="absolute inset-0"
//               style={{
//                 opacity   : isActive ? 1 : isPrev ? 0 : 0,
//                 transition: `opacity ${ANIM}ms cubic-bezier(0.4,0,0.2,1)`,
//                 zIndex    : isActive ? 2 : isPrev ? 1 : 0,
//               }}
//             >
//               <Image
//                 src={s.image}
//                 alt={s.title.replace('\n', ' ')}
//                 fill
//                 className="object-cover"
//                 priority={i === 0}
//                 unoptimized
//               />
//               {/* Multi-layer gradient for depth */}
//               <div
//                 className="absolute inset-0"
//                 style={{
//                   background: `
//                     linear-gradient(
//                       105deg,
//                       rgba(0,0,0,0.82) 0%,
//                       rgba(0,0,0,0.55) 45%,
//                       rgba(${s.accentRgb},0.18) 100%
//                     )
//                   `,
//                 }}
//               />
//               {/* Vignette */}
//               <div
//                 className="absolute inset-0"
//                 style={{
//                   background: 'radial-gradient(ellipse at 20% 50%, transparent 30%, rgba(0,0,0,0.45) 100%)',
//                 }}
//               />
//               {/* Accent glow bottom-right */}
//               <div
//                 className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full"
//                 style={{
//                   background   : `radial-gradient(circle, rgba(${s.accentRgb},0.14) 0%, transparent 70%)`,
//                   filter       : 'blur(60px)',
//                   transform    : 'translate(30%, 30%)',
//                   pointerEvents: 'none',
//                 }}
//               />
//             </div>
//           );
//         })}

//         {/* ── Decorative grid overlay ───────────────────────────────── */}
//         <div
//           className="absolute inset-0 pointer-events-none"
//           style={{
//             zIndex         : 3,
//             backgroundImage: `
//               linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
//               linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
//             `,
//             backgroundSize : '60px 60px',
//           }}
//         />

//         {/* ── Slide number strip (left edge) ────────────────────────── */}
//         <div
//           className="absolute left-0 top-0 bottom-0 flex flex-col items-center justify-center gap-3 px-3 md:px-5"
//           style={{ zIndex: 10 }}
//         >
//           {slides.map((_, i) => (
//             <button
//               key={i}
//               onClick={() => manualNav(() => goTo(i))}
//               aria-label={`Slide ${i + 1}`}
//               className="relative flex items-center justify-center transition-all duration-300"
//               style={{
//                 width : i === idx ? 32 : 24,
//                 height: i === idx ? 32 : 24,
//               }}
//             >
//               <span
//                 className="absolute inset-0 rounded-full transition-all duration-300"
//                 style={{
//                   background  : i === idx ? `rgba(${slide.accentRgb},0.25)` : 'transparent',
//                   border      : `1.5px solid ${i === idx ? slide.accent : 'rgba(255,255,255,0.25)'}`,
//                 }}
//               />
//               <span
//                 className="relative text-[10px] font-black tabular-nums"
//                 style={{ color: i === idx ? slide.accent : 'rgba(255,255,255,0.4)' }}
//               >
//                 {String(i + 1).padStart(2, '0')}
//               </span>
//             </button>
//           ))}
//         </div>

//         {/* ── Main content ──────────────────────────────────────────── */}
//         <div
//           className="absolute inset-0 flex items-center pl-16 md:pl-20"
//           style={{ zIndex: 10 }}
//         >
//           <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full">
//             <div className="max-w-xl lg:max-w-2xl">

//               {/* Tag pill */}
//               <div
//                 key={`tag-${idx}`}
//                 className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold mb-5 border"
//                 style={{
//                   background   : `rgba(${slide.accentRgb},0.15)`,
//                   borderColor  : `rgba(${slide.accentRgb},0.4)`,
//                   color        : slide.accent,
//                   animation    : `_axio_fadeIn ${ANIM}ms ease both`,
//                   animationDelay: '0ms',
//                 }}
//               >
//                 {/* <Sparkles size={11} /> */}
//                 {slide.tag} · {slide.subtitle}
//               </div>

//               {/* Title */}
//               <h2
//                 key={`title-${idx}`}
//                 className="font-black text-white leading-[1.05] mb-5 tracking-tight"
//                 style={{
//                   fontSize     : 'clamp(2rem, 5vw, 3.75rem)',
//                   animation    : `_axio_fadeUp ${ANIM}ms cubic-bezier(0.22,1,0.36,1) both`,
//                   animationDelay: '60ms',
//                   textShadow   : '0 2px 24px rgba(0,0,0,0.4)',
//                   whiteSpace   : 'pre-line',
//                 }}
//               >
//                 {slide.title}
//               </h2>

//               {/* Accent underline */}
//               <div
//                 key={`line-${idx}`}
//                 className="mb-5 rounded-full"
//                 style={{
//                   height       : 3,
//                   width        : 56,
//                   background   : `linear-gradient(90deg, ${slide.accent}, transparent)`,
//                   animation    : `_axio_scaleIn ${ANIM}ms ease both`,
//                   animationDelay: '100ms',
//                   transformOrigin: 'left',
//                 }}
//               />

//               {/* Description */}
//               <p
//                 key={`desc-${idx}`}
//                 className="text-white/70 leading-relaxed mb-8"
//                 style={{
//                   fontSize     : 'clamp(0.95rem, 1.5vw, 1.1rem)',
//                   maxWidth     : 480,
//                   animation    : `_axio_fadeUp ${ANIM}ms cubic-bezier(0.22,1,0.36,1) both`,
//                   animationDelay: '120ms',
//                 }}
//               >
//                 {slide.description}
//               </p>

//               {/* CTAs */}
//               <div
//                 key={`cta-${idx}`}
//                 className="flex flex-wrap items-center gap-4"
//                 style={{
//                   animation    : `_axio_fadeUp ${ANIM}ms cubic-bezier(0.22,1,0.36,1) both`,
//                   animationDelay: '180ms',
//                 }}
//               >
//                 <button
//                   onClick={() => router.push(slide.link)}
//                   className="group inline-flex items-center gap-2.5 font-bold px-7 py-3.5 rounded-full text-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
//                   style={{
//                     background : slide.accent,
//                     color      : '#fff',
//                     boxShadow  : `0 8px 32px rgba(${slide.accentRgb},0.45)`,
//                   }}
//                 >
//                   {slide.cta}
//                   <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
//                 </button>

//                 <button
//                   onClick={() => router.push('/courses')}
//                   className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors duration-200 cursor-pointer"
//                 >
//                   <span
//                     className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center"
//                     style={{ background: 'rgba(255,255,255,0.08)' }}
//                   >
//                     <Play size={12} className="fill-white ml-0.5" />
//                   </span>
//                   Browse all courses
//                 </button>
//               </div>

//               {/* Stat pills */}
//               <div
//                 key={`stats-${idx}`}
//                 className="flex items-center gap-3 mt-8 flex-wrap"
//                 style={{
//                   animation    : `_axio_fadeUp ${ANIM}ms cubic-bezier(0.22,1,0.36,1) both`,
//                   animationDelay: '240ms',
//                 }}
//               >
//                 {slide.stats.map((stat, si) => {
//                   const Icon = stat.icon;
//                   return (
//                     <div
//                       key={si}
//                       className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
//                       style={{
//                         background : 'rgba(255,255,255,0.07)',
//                         border     : '1px solid rgba(255,255,255,0.12)',
//                         color      : 'rgba(255,255,255,0.75)',
//                         backdropFilter: 'blur(8px)',
//                       }}
//                     >
//                       <Icon size={12} style={{ color: slide.accent }} />
//                       {stat.label}
//                     </div>
//                   );
//                 })}
//               </div>

//             </div>
//           </div>
//         </div>

//         {/* ── Bottom progress bar ───────────────────────────────────── */}
//         <div
//           className="absolute bottom-0 left-0 right-0"
//           style={{ zIndex: 10, height: 2, background: 'rgba(255,255,255,0.08)' }}
//         >
//           <div
//             ref={progressRef}
//             className="h-full origin-left"
//             style={{ background: slide.accent }}
//           />
//         </div>

//         {/* ── Prev / Next arrows ────────────────────────────────────── */}
//         <button
//           onClick={() => manualNav(goPrev)}
//           aria-label="Previous slide"
//           className="absolute top-1/2 -translate-y-1/2 right-16 md:right-20 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
//           style={{
//             zIndex    : 10,
//             width     : 40,
//             height    : 40,
//             background: 'rgba(255,255,255,0.08)',
//             border    : '1px solid rgba(255,255,255,0.15)',
//             backdropFilter: 'blur(8px)',
//             color     : 'rgba(255,255,255,0.7)',
//           }}
//         >
//           <ChevronLeft size={18} />
//         </button>

//         <button
//           onClick={() => manualNav(goNext)}
//           aria-label="Next slide"
//           className="absolute top-1/2 -translate-y-1/2 right-4 md:right-6 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
//           style={{
//             zIndex    : 10,
//             width     : 40,
//             height    : 40,
//             background: `rgba(${slide.accentRgb},0.25)`,
//             border    : `1px solid rgba(${slide.accentRgb},0.4)`,
//             backdropFilter: 'blur(8px)',
//             color     : slide.accent,
//           }}
//         >
//           <ChevronRight size={18} />
//         </button>

//         {/* ── Slide thumbnail strip (bottom-right) ─────────────────── */}
//         <div
//           className="absolute bottom-8 right-4 md:right-6 hidden md:flex flex-col gap-2"
//           style={{ zIndex: 10 }}
//         >
//           {slides.map((s, i) => (
//             <button
//               key={s.id}
//               onClick={() => manualNav(() => goTo(i))}
//               aria-label={`Go to slide ${i + 1}`}
//               className="relative overflow-hidden rounded-lg transition-all duration-300 cursor-pointer"
//               style={{
//                 width  : 56,
//                 height : 36,
//                 opacity: i === idx ? 1 : 0.4,
//                 border : `1.5px solid ${i === idx ? slide.accent : 'rgba(255,255,255,0.15)'}`,
//                 transform: i === idx ? 'scale(1.08)' : 'scale(1)',
//               }}
//             >
//               <Image
//                 src={s.image}
//                 alt={s.title.replace('\n', ' ')}
//                 fill
//                 className="object-cover"
//                 unoptimized
//               />
//             </button>
//           ))}
//         </div>

//       </section>
//     </>
//   );
// }


























// // src/components/home/AutoSlider.tsx

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, ChevronLeft, ChevronRight,
  Play, BookOpen, Users, Star,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SiteStats {
  activeLearners:    number;
  expertInstructors: number;
  coursesAvailable:  number;
  averageRating:     number;
}

interface SlideDefinition {
  id:          number;
  title:       string;
  subtitle:    string;
  description: string;
  cta:         string;
  image:       string;
  link:        string;
  accent:      string;
  accentRgb:   string;
  tag:         string;
  statKeys:    [keyof SiteStats, keyof SiteStats]; // which two stats to show
  statIcons:   [React.ElementType, React.ElementType];
  statLabels:  [string, string]; // fallback labels while stats load
}

// ─── Slide definitions (no hardcoded stat numbers) ───────────────────────────
const SLIDES: SlideDefinition[] = [
  {
    id:         1,
    title:      'Start Your\nLearning Journey',
    subtitle:   'New Courses Added',
    description:'Access thousands of courses from industry experts and level up your skills today.',
    cta:        'Explore Courses',
    image:      '/images/python-course.png',
    link:       '/dashboard',
    accent:     '#3B82F6',
    accentRgb:  '59,130,246',
    tag:        'Most Popular',
    statKeys:   ['coursesAvailable', 'activeLearners'],   // courses + learners → makes sense for "start learning"
    statIcons:  [BookOpen, Users],
    statLabels: ['Courses Available', 'Active Learners'],
  },
  {
    id:         2,
    title:      'Become an\nInstructor',
    subtitle:   'Share Your Knowledge',
    description:'Teach what you know, earn what you deserve. Join our growing instructor community.',
    cta:        'Start Teaching',
    image:      '/images/react-course-hero.jpg',
    link:       '/dashboard/request-upgrade',
    accent:     '#8B5CF6',
    accentRgb:  '139,92,246',
    tag:        'Earn & Teach',
    statKeys:   ['expertInstructors', 'averageRating'],   // instructors + rating → makes sense for "join instructors"
    statIcons:  [Users, Star],
    statLabels: ['Expert Instructors', 'Avg Rating'],
  },
  
  {
    id:         3,
    title:      'Learn from\nThe Best',
    subtitle:   'Industry Professionals',
    description:'Learn from industry professionals and thought leaders shaping the future.',
    cta:        'Meet Instructors',
    image:      '/images/learn-from-the-best.jpg',
    link:       '/instructors',
    accent:     '#F59E0B',
    accentRgb:  '245,158,11',
    tag:        'Expert-Led',
    statKeys:   ['averageRating', 'expertInstructors'],   // rating + instructors → makes sense for "learn from the best"
    statIcons:  [Star, Users],
    statLabels: ['Platform Rating', 'Expert Instructors'],
  },

//   {
//   id:         3,
//   title:      'Learn from\nThe Best',
//   subtitle:   'Industry Professionals',
//   description:'Learn from industry professionals and thought leaders shaping the future.',
//   cta:        'Meet Instructors',
//   image:      '/images/ios-development.png',
//   link:       '/instructors',
//   accent:     '#F59E0B',
//   accentRgb:  '245,158,11',
//   tag:        'Expert-Led',
//   statKeys:   [null, 'expertInstructors'],          // null = hardcoded, no DB lookup
//   statIcons:  [Star, Users],
//   statLabels: ['Industry Vetted', 'Expert Instructors'],
// },

  {
    id:         4,
    title:      'Advance Your\nCareer Today',
    subtitle:   'Get Certified',
    description:'Earn recognised certificates and unlock new opportunities in your career.',
    cta:        'View Certificates',
    image:      '/images/career-advancement.png',
    link:       '/dashboard/certificates',
    accent:     '#10B981',
    accentRgb:  '16,185,129',
    tag:        'Career Boost',
    statKeys:   ['activeLearners', 'coursesAvailable'],   // learners + courses → makes sense for "advance career"
    statIcons:  [Users, BookOpen],
    statLabels: ['Learners Enrolled', 'Courses Available'],
  },
];

const DURATION = 5500;
const ANIM     = 650;

const KEYFRAMES = `
@keyframes _axio_fadeUp {
  from { opacity:0; transform:translateY(28px); }
  to   { opacity:1; transform:translateY(0);    }
}
@keyframes _axio_fadeIn {
  from { opacity:0; }
  to   { opacity:1; }
}
@keyframes _axio_scaleIn {
  from { opacity:0; transform:scale(0.92); }
  to   { opacity:1; transform:scale(1);    }
}
@keyframes _axio_progress {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
`;

// Rendered once, never re-renders
function StaticStyles() {
  return <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />;
}

// ─── Stat formatter ───────────────────────────────────────────────────────────
function formatStat(key: keyof SiteStats, value: number): string {
  if (key === 'averageRating') {
    return value > 0 ? `${value.toFixed(1)} ★` : '—';
  }
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M+`;
  if (value >= 1_000)     return `${(value / 1_000).toFixed(0)}K+`;
  if (value > 0)          return `${value}+`;
  return '—';
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface AutoSliderProps {
  stats?: SiteStats | null;
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function AutoSlider({ stats }: AutoSliderProps) {
  const router          = useRouter();
  const [idx, setIdx]   = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [entering, setEntering] = useState(false);

  const idxRef      = useRef(0);
  const animRef     = useRef(false);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const restartProgress = useCallback(() => {
    const el = progressRef.current;
    if (!el) return;
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = `_axio_progress ${DURATION}ms linear forwards`;
  }, []);

  const advance = useCallback((nextIdx: number) => {
    if (animRef.current) return;
    animRef.current = true;
    setPrev(idxRef.current);
    setEntering(true);
    idxRef.current = nextIdx;
    setIdx(nextIdx);
    restartProgress();
    setTimeout(() => {
      animRef.current = false;
      setPrev(null);
      setEntering(false);
    }, ANIM);
  }, [restartProgress]);

  const goNext = useCallback(() => advance((idxRef.current + 1) % SLIDES.length), [advance]);
  const goPrev = useCallback(() => advance((idxRef.current - 1 + SLIDES.length) % SLIDES.length), [advance]);
  const goTo   = useCallback((i: number) => advance(i), [advance]);

  useEffect(() => {
    restartProgress();
    timerRef.current = setInterval(goNext, DURATION);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const manualNav = useCallback((fn: () => void) => {
    if (timerRef.current) clearInterval(timerRef.current);
    fn();
    timerRef.current = setInterval(goNext, DURATION);
  }, [goNext]);

  const slide = SLIDES[idx];

  // Build the two stat pills for the current slide from live stats
  const statPills = slide.statKeys.map((key, i) => ({
    Icon:  slide.statIcons[i],
    label: stats
      ? `${formatStat(key, stats[key])} ${slide.statLabels[i]}`
      : slide.statLabels[i],
  }));

  return (
    <>
      <StaticStyles />

      <section
        className="relative w-full overflow-hidden bg-gray-950"
        style={{ height: 'clamp(520px, 70vh, 720px)' }}
      >

        {/* ── Background slides (cross-fade) ───────────────────────── */}
        {SLIDES.map((s, i) => {
          const isActive = i === idx;
          const isPrev   = i === prev;
          return (
            <div
              key={s.id}
              aria-hidden={!isActive}
              className="absolute inset-0"
              style={{
                opacity   : isActive ? 1 : isPrev ? 0 : 0,
                transition: `opacity ${ANIM}ms cubic-bezier(0.4,0,0.2,1)`,
                zIndex    : isActive ? 2 : isPrev ? 1 : 0,
              }}
            >
              <Image
                src={s.image}
                alt={s.title.replace('\n', ' ')}
                fill
                className="object-cover"
                priority={i === 0}
                unoptimized
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(
                    105deg,
                    rgba(0,0,0,0.82) 0%,
                    rgba(0,0,0,0.55) 45%,
                    rgba(${s.accentRgb},0.18) 100%
                  )`,
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(ellipse at 20% 50%, transparent 30%, rgba(0,0,0,0.45) 100%)',
                }}
              />
              <div
                className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full"
                style={{
                  background   : `radial-gradient(circle, rgba(${s.accentRgb},0.14) 0%, transparent 70%)`,
                  filter       : 'blur(60px)',
                  transform    : 'translate(30%, 30%)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          );
        })}

        {/* ── Decorative grid overlay ───────────────────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex         : 3,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* ── Slide number strip (left edge) ────────────────────────── */}
        <div
          className="absolute left-0 top-0 bottom-0 flex flex-col items-center justify-center gap-3 px-3 md:px-5"
          style={{ zIndex: 10 }}
        >
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => manualNav(() => goTo(i))}
              aria-label={`Slide ${i + 1}`}
              className="relative flex items-center justify-center transition-all duration-300"
              style={{
                width : i === idx ? 32 : 24,
                height: i === idx ? 32 : 24,
              }}
            >
              <span
                className="absolute inset-0 rounded-full transition-all duration-300"
                style={{
                  background: i === idx ? `rgba(${slide.accentRgb},0.25)` : 'transparent',
                  border    : `1.5px solid ${i === idx ? slide.accent : 'rgba(255,255,255,0.25)'}`,
                }}
              />
              <span
                className="relative text-[10px] font-black tabular-nums"
                style={{ color: i === idx ? slide.accent : 'rgba(255,255,255,0.4)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
            </button>
          ))}
        </div>

        {/* ── Main content ──────────────────────────────────────────── */}
        <div
          className="absolute inset-0 flex items-center pl-16 md:pl-20"
          style={{ zIndex: 10 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full">
            <div className="max-w-xl lg:max-w-2xl">

              {/* Tag pill */}
              <div
                key={`tag-${idx}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold mb-5 border"
                style={{
                  background   : `rgba(${slide.accentRgb},0.15)`,
                  borderColor  : `rgba(${slide.accentRgb},0.4)`,
                  color        : slide.accent,
                  animation    : `_axio_fadeIn ${ANIM}ms ease both`,
                  animationDelay: '0ms',
                }}
              >
                {slide.tag} · {slide.subtitle}
              </div>

              {/* Title */}
              <h2
                key={`title-${idx}`}
                className="font-black text-white leading-[1.05] mb-5 tracking-tight"
                style={{
                  fontSize      : 'clamp(2rem, 5vw, 3.75rem)',
                  animation     : `_axio_fadeUp ${ANIM}ms cubic-bezier(0.22,1,0.36,1) both`,
                  animationDelay: '60ms',
                  textShadow    : '0 2px 24px rgba(0,0,0,0.4)',
                  whiteSpace    : 'pre-line',
                }}
              >
                {slide.title}
              </h2>

              {/* Accent underline */}
              <div
                key={`line-${idx}`}
                className="mb-5 rounded-full"
                style={{
                  height         : 3,
                  width          : 56,
                  background     : `linear-gradient(90deg, ${slide.accent}, transparent)`,
                  animation      : `_axio_scaleIn ${ANIM}ms ease both`,
                  animationDelay : '100ms',
                  transformOrigin: 'left',
                }}
              />

              {/* Description */}
              <p
                key={`desc-${idx}`}
                className="text-white/70 leading-relaxed mb-8"
                style={{
                  fontSize      : 'clamp(0.95rem, 1.5vw, 1.1rem)',
                  maxWidth      : 480,
                  animation     : `_axio_fadeUp ${ANIM}ms cubic-bezier(0.22,1,0.36,1) both`,
                  animationDelay: '120ms',
                }}
              >
                {slide.description}
              </p>

              {/* CTAs */}
              <div
                key={`cta-${idx}`}
                className="flex flex-wrap items-center gap-4"
                style={{
                  animation     : `_axio_fadeUp ${ANIM}ms cubic-bezier(0.22,1,0.36,1) both`,
                  animationDelay: '180ms',
                }}
              >
                <button
                  onClick={() => router.push(slide.link)}
                  className="group inline-flex items-center gap-2.5 font-bold px-7 py-3.5 rounded-full text-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                  style={{
                    background: slide.accent,
                    color     : '#fff',
                    boxShadow : `0 8px 32px rgba(${slide.accentRgb},0.45)`,
                  }}
                >
                  {slide.cta}
                  <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => router.push('/courses')}
                  className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors duration-200 cursor-pointer"
                >
                  <span
                    className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  >
                    <Play size={12} className="fill-white ml-0.5" />
                  </span>
                  Browse all courses
                </button>
              </div>

              {/* ── Stat pills — now dynamic from props ───────────── */}
              <div
                key={`stats-${idx}`}
                className="flex items-center gap-3 mt-8 flex-wrap"
                style={{
                  animation     : `_axio_fadeUp ${ANIM}ms cubic-bezier(0.22,1,0.36,1) both`,
                  animationDelay: '240ms',
                }}
              >
                {statPills.map((pill, si) => {
                  const Icon = pill.Icon;
                  return (
                    <div
                      key={si}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{
                        background    : 'rgba(255,255,255,0.07)',
                        border        : '1px solid rgba(255,255,255,0.12)',
                        color         : 'rgba(255,255,255,0.75)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <Icon size={12} style={{ color: slide.accent }} />
                      {/* Show skeleton shimmer while stats are loading */}
                      {!stats ? (
                        <span
                          className="inline-block rounded animate-pulse"
                          style={{
                            width     : 64,
                            height    : 10,
                            background: 'rgba(255,255,255,0.15)',
                          }}
                        />
                      ) : (
                        pill.label
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>

        {/* ── Bottom progress bar ───────────────────────────────────── */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ zIndex: 10, height: 2, background: 'rgba(255,255,255,0.08)' }}
        >
          <div
            ref={progressRef}
            className="h-full origin-left"
            style={{ background: slide.accent }}
          />
        </div>

        {/* ── Prev / Next arrows ────────────────────────────────────── */}
        <button
          onClick={() => manualNav(goPrev)}
          aria-label="Previous slide"
          className="absolute top-1/2 -translate-y-1/2 right-16 md:right-20 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
          style={{
            zIndex        : 10,
            width         : 40,
            height        : 40,
            background    : 'rgba(255,255,255,0.08)',
            border        : '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            color         : 'rgba(255,255,255,0.7)',
          }}
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={() => manualNav(goNext)}
          aria-label="Next slide"
          className="absolute top-1/2 -translate-y-1/2 right-4 md:right-6 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
          style={{
            zIndex        : 10,
            width         : 40,
            height        : 40,
            background    : `rgba(${slide.accentRgb},0.25)`,
            border        : `1px solid rgba(${slide.accentRgb},0.4)`,
            backdropFilter: 'blur(8px)',
            color         : slide.accent,
          }}
        >
          <ChevronRight size={18} />
        </button>

        {/* ── Slide thumbnail strip (bottom-right) ─────────────────── */}
        <div
          className="absolute bottom-8 right-4 md:right-6 hidden md:flex flex-col gap-2"
          style={{ zIndex: 10 }}
        >
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => manualNav(() => goTo(i))}
              aria-label={`Go to slide ${i + 1}`}
              className="relative overflow-hidden rounded-lg transition-all duration-300 cursor-pointer"
              style={{
                width    : 56,
                height   : 36,
                opacity  : i === idx ? 1 : 0.4,
                border   : `1.5px solid ${i === idx ? slide.accent : 'rgba(255,255,255,0.15)'}`,
                transform: i === idx ? 'scale(1.08)' : 'scale(1)',
              }}
            >
              <Image
                src={s.image}
                alt={s.title.replace('\n', ' ')}
                fill
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>

      </section>
    </>
  );
}
