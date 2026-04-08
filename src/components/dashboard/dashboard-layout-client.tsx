'use client'

import { useSidebar } from '@/contexts/sidebar-context'
import { ReactNode } from 'react'

interface DashboardLayoutClientProps {
  children: ReactNode
  userRole: string
}

export default function DashboardLayoutClient({ children, userRole }: DashboardLayoutClientProps) {
  const { isCollapsed } = useSidebar()

  return (
    <main className={`flex-1 min-h-screen overflow-auto transition-all duration-300 ease-in-out ${
      userRole ? (isCollapsed ? 'lg:ml-16' : 'lg:ml-64') : 'lg:ml-0'
    }`}>
      <div className="pt-5 lg:pt-8 px-4 lg:px-8 pb-8 has-[.inbox-fullbleed]:p-0 has-[.inbox-fullbleed]:pt-0">
        {children}
      </div>
    </main>
  )
}
