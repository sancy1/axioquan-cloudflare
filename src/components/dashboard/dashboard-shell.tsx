

// src/components/dashboard/dashboard-shell.tsx

'use client';

import { useSidebar } from '@/contexts/sidebar-context';
import Sidebar from '@/components/dashboard/sidebar';
import { RoleRefreshHandler } from '@/components/auth/role-refresh-handler';

interface DashboardShellProps {
  user: any;
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar user={user} />
      <main
        className={`
          flex-1 min-h-screen overflow-auto
          transition-[margin] duration-300 ease-in-out
          ml-0
          ${isCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
        `}
      >
        <div className="pt-5 lg:pt-8 px-4 lg:px-8 pb-8 has-[.inbox-fullbleed]:p-0 has-[.inbox-fullbleed]:pt-0">
          <RoleRefreshHandler />
          {children}
        </div>
      </main>
    </div>
  );
}