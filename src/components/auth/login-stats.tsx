
// src/components/auth/login-stats.tsx

'use client';

// /src/components/auth/login-stats.tsx
// # Dynamic stats strip for login page image panel
// Fetches from /api/stats — same endpoint as about-hero

import { useEffect, useState } from 'react';

interface SiteStats {
  activeLearners: number;
  expertInstructors: number;
  coursesAvailable: number;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K+`;
  return n > 0 ? `${n}+` : '—';
}

export default function LoginStats() {
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data: SiteStats) => {
        setStats(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const items = [
    {
      value: stats?.activeLearners ?? 0,
      label: 'Active Learners',
    },
    {
      value: stats?.coursesAvailable ?? 0,
      label: 'Expert Courses',
    },
    {
      value: stats?.expertInstructors ?? 0,
      label: 'Instructors',
    },
  ];

  return (
    <div className="flex items-center gap-4 sm:gap-6">
      {items.map((item, i) => (
        <div key={item.label} className="flex items-center gap-4 sm:gap-6">
          <div>
            {/* Value */}
            {isLoading ? (
              <div className="h-5 w-10 bg-white/10 animate-pulse rounded mb-1" />
            ) : (
              <p className="text-white font-bold text-base lg:text-lg leading-none mb-0.5">
                {formatCount(item.value)}
              </p>
            )}
            {/* Label */}
            <p className="text-gray-400 text-xs">{item.label}</p>
          </div>

          {/* Divider — not after last item */}
          {i < items.length - 1 && (
            <div className="w-px h-7 bg-white/10 flex-shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}
