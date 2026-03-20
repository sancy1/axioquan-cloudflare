'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Play } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'Start Your Learning Journey',
    subtitle: 'New Courses Added',
    description: 'Access 1000+ courses from industry experts and level up your skills today.',
    cta: 'Explore Courses',
    image: '/images/python-course.jpg',
    link: '/dashboard',
    accent: '#3B82F6',
    gradientFrom: 'from-blue-900/80',
    gradientTo: 'to-indigo-900/60',
  },
  {
    id: 2,
    title: 'Become an Instructor',
    subtitle: 'Share Your Knowledge',
    description: 'Teach what you know, earn what you deserve. Join our growing instructor community.',
    cta: 'Start Teaching',
    image: '/images/react-course-hero.jpg',
    link: '/dashboard/request-upgrade',
    accent: '#8B5CF6',
    gradientFrom: 'from-purple-900/80',
    gradientTo: 'to-pink-900/60',
  },
  {
    id: 3,
    title: 'Expert Instructors',
    subtitle: 'Industry Professionals',
    description: 'Learn from industry professionals and thought leaders shaping the future.',
    cta: 'Meet Instructors',
    image: '/images/ios-development.png',
    link: '/instructors',
    accent: '#F59E0B',
    gradientFrom: 'from-orange-900/80',
    gradientTo: 'to-red-900/60',
  },
  {
    id: 4,
    title: 'Advance Your Career',
    subtitle: 'Get Certified',
    description: 'Earn recognized certificates and unlock new opportunities in your career.',
    cta: 'View Certificates',
    image: '/images/instructor-portrait.png',
    link: '/dashboard/certificates',
    accent: '#10B981',
    gradientFrom: 'from-emerald-900/80',
    gradientTo: 'to-teal-900/60',
  },
];

export default function AutoSlider() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const goTo = useCallback((index: number, dir: 'next' | 'prev' = 'next') => {
    if (animating) return;
    setAnimating(true);
    setDirection(dir);
    setCurrent(index);
    setTimeout(() => setAnimating(false), 700);
  }, [animating]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length, 'next');
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, 'prev');
  }, [current, goTo]);

  useEffect(() => {
    const interval = setInterval(next, 5500);
    return () => clearInterval(interval);
  }, [next]);

  const handleCTA = (link: string) => {
    router.push(link);
  };

  const slide = slides[current];

  return (
    <section className="relative w-full h-[580px] md:h-[680px] overflow-hidden bg-gray-950">

      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === current ? 1 : 0, pointerEvents: 'none' }}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            className="object-cover"
            priority={i === 0}
            unoptimized
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${s.gradientFrom} ${s.gradientTo}`} />
          {/* Grain texture overlay */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
            }}
          />
        </div>
      ))}

      {/* Content — this layer handles all interactions */}
      <div className="absolute inset-0 flex items-center" style={{ zIndex: 10 }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
          <div className="max-w-2xl">

            {/* Pill badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5 border border-white/20 backdrop-blur-sm"
              style={{ backgroundColor: `${slide.accent}30`, color: 'white' }}
            >
              <Sparkles size={12} />
              {slide.subtitle}
            </div>

            {/* Title */}
            <h2
              key={`title-${current}`}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-none mb-4 tracking-tight"
              style={{
                animation: 'slideUp 0.6s ease-out forwards',
                textShadow: '0 2px 20px rgba(0,0,0,0.3)',
              }}
            >
              {slide.title}
            </h2>

            {/* Description */}
            <p
              key={`desc-${current}`}
              className="text-base md:text-lg text-white/80 mb-8 max-w-lg leading-relaxed"
              style={{ animation: 'slideUp 0.6s ease-out 0.1s both' }}
            >
              {slide.description}
            </p>

            {/* CTA — button with onClick using router.push, NOT a Link inside absolute stack */}
            <div
              key={`cta-${current}`}
              style={{ animation: 'slideUp 0.6s ease-out 0.2s both' }}
            >
              <button
                onClick={() => handleCTA(slide.link)}
                className="group inline-flex items-center gap-3 font-bold px-8 py-4 rounded-full text-base transition-all duration-200 hover:scale-105 cursor-pointer active:scale-95 shadow-2xl"
                style={{
                  backgroundColor: 'white',
                  color: '#0f172a',
                  boxShadow: `0 8px 32px ${slide.accent}40`,
                }}
              >
                {slide.cta}
                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </button>

              {/* Secondary ghost link */}
              <button
                onClick={() => handleCTA('/courses')}
                className="ml-4 inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors cursor-pointer duration-200"
              >
                <Play size={14} className="fill-current" />
                Browse all courses
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center border border-white/20 bg-black/20 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-200 hover:scale-110"
        style={{ zIndex: 20 }}
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center border border-white/20 bg-black/20 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-200 hover:scale-110"
        style={{ zIndex: 20 }}
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dot indicators */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2"
        style={{ zIndex: 20 }}
      >
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i, i > current ? 'next' : 'prev')}
            className="h-2 rounded-full transition-all duration-400"
            style={{
              width: i === current ? '32px' : '8px',
              backgroundColor: i === current ? 'white' : 'rgba(255,255,255,0.4)',
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div
        className="absolute bottom-6 right-6 text-white/50 text-xs font-mono tabular-nums"
        style={{ zIndex: 20 }}
      >
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>

      {/* Keyframe styles */}
      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
