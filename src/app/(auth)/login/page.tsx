

// /src/app/(auth)/login/page.tsx
// # User login page — redesigned with split layout + dynamic stats

import LoginForm from '@/components/auth/login-form';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import LoginStats from '@/components/auth/login-stats';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col lg:flex-row">

        {/* ── LEFT / TOP PANEL — Illustration + Marketing ───────────────── */}
        <div className="relative w-full lg:w-1/2 h-72 sm:h-80 md:h-96 lg:h-auto overflow-hidden flex flex-col">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/education.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/40" />
          <div className="absolute inset-0 bg-black/30" />

          {/* <div className="relative z-10 mt-auto p-6 sm:p-8 lg:p-10 lg:pb-12"> */}
          <div className="relative z-10 pt-20 sm:pt-24 lg:pt-40 p-6 sm:p-8 lg:p-10 lg:pb-12">
            <div className="max-w-sm">
              <div className="hidden sm:inline-flex items-center gap-2 bg-violet-600/20 border border-violet-500/30 rounded-full px-3 py-1 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-violet-300 text-xs font-medium tracking-wide uppercase">e-Learning Platform</span>
              </div>
              <h2 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold leading-tight mb-2 sm:mb-3 lg:mb-4">
                Learn. Connect.<br />
                <span className="text-violet-400">Grow together.</span>
              </h2>
              <p className="hidden sm:block text-gray-300 text-sm leading-relaxed mb-5 lg:mb-8">
                Join thousands of students already collaborating, sharing knowledge, and accelerating their learning journey on Axioquan.
              </p>
              <LoginStats />
              <div className="flex items-center gap-3 sm:gap-4 mt-5 lg:mt-8">
                <Link href="/signup" className="cursor-pointer inline-flex items-center gap-2 bg-white text-gray-900 font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-gray-100 transition-colors shadow-lg">
                  Create free account
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <span className="text-gray-400 text-xs hidden sm:inline">No credit card required</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT / BOTTOM PANEL — Login Form + grid ──────────────────── */}
        <div className="relative w-full lg:w-1/2 flex flex-col items-center justify-center px-5 sm:px-8 py-10 lg:py-12 bg-[#0d0d0d] overflow-hidden">

          {/* Violet grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(139,92,246,1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
            }}
          />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-900/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 w-full max-w-sm">
            <div className="flex bg-[#1a1a1a] rounded-full p-1 mb-7 border border-white/5">
              <button className="flex-1 py-2 rounded-full bg-violet-600 text-white text-sm font-semibold shadow-lg shadow-violet-900/40 cursor-default">
                Sign in
              </button>
              <Link href="/signup" className="cursor-pointer flex-1 py-2 rounded-full text-gray-400 text-sm font-medium text-center hover:text-white transition-colors">
                Create account
              </Link>
            </div>
            <div className="mb-6">
              <h1 className="text-white text-2xl sm:text-3xl font-bold mb-1">Welcome back</h1>
              <p className="text-gray-500 text-sm">Sign in to continue learning</p>
            </div>
            <LoginForm />
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
