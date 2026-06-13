
// // /src/components/layout/header.tsx

'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, LogIn, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { UserProfileDropdown } from '@/components/layout/user-profile-dropdown';
import { NotificationBell } from '@/components/notifications/notification-bell';

interface AuthStatus {
  isAuthenticated: boolean;
  user?: {
    name: string;
    email: string;
    primaryRole: string;
  };
}

const navLinks = [
  { href: '/',           label: 'Home'       },
  { href: '/courses',    label: 'Courses'    },
  { href: '/categories', label: 'Categories' },
  { href: '/about',      label: 'About'      },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [authStatus, setAuthStatus] = useState<AuthStatus>({ isAuthenticated: false });
  const [isLoading,  setIsLoading]  = useState(true);
  const pathname                    = usePathname();

  // Track whether this is the very first fetch
  const isFirstFetch = useRef(true);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      // ✅ Only show skeleton on the very first load, never on background re-checks
      if (isFirstFetch.current) {
        setIsLoading(true);
      }

      try {
        const response = await fetch('/api/auth/status', {
          method: 'GET',
          credentials: 'include',
          // ✅ Use cache so background re-checks don't always hit the server hard
          headers: { 'Cache-Control': 'no-cache' },
        });

        const next: AuthStatus = response.ok
          ? await response.json()
          : { isAuthenticated: false };

        // ✅ Only call setAuthStatus if data actually changed — prevents
        //    unnecessary re-renders that cause visible flicker
        setAuthStatus(prev => {
          const prevStr = JSON.stringify(prev);
          const nextStr = JSON.stringify(next);
          return prevStr === nextStr ? prev : next;
        });
      } catch {
        setAuthStatus(prev =>
          prev.isAuthenticated ? { isAuthenticated: false } : prev
        );
      } finally {
        if (isFirstFetch.current) {
          setIsLoading(false);
          isFirstFetch.current = false;
        }
      }
    };

    checkAuthStatus();

    // ✅ 30s is fine but background re-checks must NOT touch isLoading
    const interval = setInterval(checkAuthStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const isActive  = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const closeMenu = () => setIsMenuOpen(false);

  const handleMobileLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      // ignore
    } finally {
      closeMenu();
      window.location.href = '/login';
    }
  };

  // ── Loading skeleton — only shown once on first paint ──────────────────────
  if (isLoading) {
    return (
      <nav className="sticky top-0 z-50 h-16 border-b border-gray-200/60 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 animate-pulse" />
            <div className="w-24 h-5 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="hidden md:flex gap-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-16 h-5 rounded bg-gray-200 animate-pulse" />
            ))}
          </div>
          <div className="w-20 h-8 rounded-full bg-gray-200 animate-pulse" />
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background   : scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.80)',
          backdropFilter: 'blur(20px)',
          borderBottom : scrolled ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(0,0,0,0.05)',
          boxShadow    : scrolled ? '0 4px 24px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm transition-transform duration-200 group-hover:scale-110"
                // style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
                style={{ background: '#000' }}
              >
                A
              </div>
              <span className="font-extrabold text-xl tracking-tight text-gray-900">
                AxioQuan
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className="relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200"
                    style={{
                      color     : active ? '#7c3aed' : '#374151',
                      background: active ? 'rgba(124,58,237,0.08)' : 'transparent',
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(124,58,237,0.06)';
                        (e.currentTarget as HTMLAnchorElement).style.color = '#7c3aed';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                        (e.currentTarget as HTMLAnchorElement).style.color = '#374151';
                      }
                    }}
                  >
                    {label}
                    {active && (
                      <span
                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full"
                        style={{
                          width     : '60%',
                          background: 'linear-gradient(90deg, #7c3aed, #4f46e5)',
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop right actions */}
            <div className="hidden md:flex items-center gap-3">
              {authStatus.isAuthenticated && authStatus.user ? (
                <>
                  <NotificationBell placement="header" />
                  <UserProfileDropdown user={authStatus.user} />
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 flex items-center gap-2"
                    style={{ color: '#7c3aed' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(124,58,237,0.08)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                    }}
                  >
                    <LogIn className="h-4 w-4" />
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="px-5 py-2 text-sm font-bold rounded-full text-white transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                      boxShadow : '0 4px 14px rgba(124,58,237,0.3)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px rgba(124,58,237,0.45)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 14px rgba(124,58,237,0.3)';
                    }}
                  >
                    Get started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMenuOpen(prev => !prev)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-200"
              style={{ background: isMenuOpen ? 'rgba(124,58,237,0.08)' : 'transparent' }}
            >
              {isMenuOpen
                ? <X    className="h-5 w-5 text-violet-700" />
                : <Menu className="h-5 w-5 text-gray-700"   />
              }
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className="md:hidden fixed left-0 right-0 z-40 transition-all duration-300 overflow-hidden"
        style={{
          top         : '64px',
          maxHeight   : isMenuOpen ? '600px' : '0px',
          opacity     : isMenuOpen ? 1 : 0,
          background  : 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)',
          borderBottom: isMenuOpen ? '1px solid rgba(0,0,0,0.08)' : 'none',
          boxShadow   : isMenuOpen ? '0 12px 40px rgba(0,0,0,0.1)' : 'none',
        }}
      >
        <div className="px-4 py-5 space-y-1">
          {navLinks.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  color     : active ? '#7c3aed' : '#374151',
                  background: active ? 'rgba(124,58,237,0.08)' : 'transparent',
                }}
              >
                {label}
                {active && (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
                  />
                )}
              </Link>
            );
          })}

          <div className="h-px bg-gray-100 my-2" />

          {authStatus.isAuthenticated && authStatus.user ? (
            <div className="space-y-2 pt-1">
              <div
                className="px-4 py-3 rounded-xl text-sm font-semibold text-center"
                style={{ background: 'rgba(124,58,237,0.06)', color: '#7c3aed' }}
              >
                👋 &nbsp;{authStatus.user.name}
              </div>
              <Link href="/dashboard" onClick={closeMenu}
                className="block text-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-200"
                style={{ border: '1.5px solid rgba(124,58,237,0.3)', color: '#7c3aed' }}
              >
                Dashboard
              </Link>
              <Link href="/saved-courses" onClick={closeMenu}
                className="block text-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-200"
                style={{ border: '1.5px solid rgba(124,58,237,0.3)', color: '#7c3aed' }}
              >
                Saved Courses
              </Link>
              <Link href="/dashboard/profile" onClick={closeMenu}
                className="block text-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-200"
                style={{ border: '1.5px solid rgba(124,58,237,0.3)', color: '#7c3aed' }}
              >
                Settings
              </Link>
              <button onClick={handleMobileLogout}
                className="w-full text-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-200"
                style={{ border: '1.5px solid rgba(239,68,68,0.3)', color: '#dc2626' }}
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <Link href="/login" onClick={closeMenu}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold"
                style={{ border: '1.5px solid rgba(124,58,237,0.3)', color: '#7c3aed' }}
              >
                <LogIn className="h-4 w-4" />
                Log in
              </Link>
              <Link href="/signup" onClick={closeMenu}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  boxShadow : '0 4px 14px rgba(124,58,237,0.3)',
                }}
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}