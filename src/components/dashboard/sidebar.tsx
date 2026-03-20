

// /components/dashboard/sidebar.tsx

'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { UserProfileNav } from './user-profile-nav'

interface SidebarProps {
  user: any
}

export default function Sidebar({ user }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>('learn')
  const pathname = usePathname()

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Common menu items for all roles
  const commonMenuItems = [
    {
      label: 'Menu',
      icon: '📚',
      submenu: [
        { label: 'Dashboard', href: '/dashboard', icon: '📊', id: 'dashboard' },
        { label: 'Profile', href: '/dashboard/profile', icon: '👤', id: 'profile' },
        { label: 'Courses', href: '/courses', icon: '🎓', id: 'courses' },
        { label: 'Inbox', href: '/dashboard/inbox', icon: '📬', id: 'inbox' },
        // { label: 'Certificates', href: '#', icon: '📜', id: 'certificates' },
      ],
      id: 'Menu',
    },
  ]

  // Student specific menu
  const studentMenuItems = [
    {
      label: 'My Learning',
      icon: '📖',
      submenu: [
        { label: 'My Courses', href: '/dashboard/my-courses', icon: '📚', id: 'my-courses' },
        { label: 'Progress', href: '/dashboard/progress', icon: '📊', id: 'progress' }, 
        { label: 'Certificates', href: '/dashboard/certificates', icon: '📜', id: 'certificates' },
        { label: 'Quiz Results', href: '/dashboard/my-courses', icon: '📝', id: 'quiz-results' },
        // { label: 'In Progress', href: '#', icon: '⏳', id: 'in-progress' },
        // { label: 'Completed', href: '#', icon: '✅', id: 'completed' },
      ],
      id: 'my-learning',
    },
  ]

  // Instructor specific menu - UPDATED
  const instructorMenuItems = [
    {
      label: 'Teaching',
      icon: '👨‍🏫',
      submenu: [
        { label: 'My Courses', href: '/dashboard/instructor/courses', icon: '📚', id: 'instructor-courses' },
        { label: 'Create Course', href: '/dashboard/instructor/create', icon: '➕', id: 'create-course' },
        { label: 'Quiz Analytics', href: '/dashboard/instructor/quizzes', icon: '📊', id: 'quiz-analytics' },
        { label: 'Students', href: '/dashboard/instructor/students', icon: '👥', id: 'students' },
        { label: 'Certificates', href: '/dashboard/instructor/certificates', icon: '📜', id: 'certificates' },
        { label: 'Earnings', href: '/dashboard/instructor/earnings', icon: '💰', id: 'earnings' },
      ],
      id: 'teaching',
    },
  ]

  // Admin specific menu
  const adminMenuItems = [
    {
      label: 'Admin',
      icon: '⚙️',
      submenu: [
        { label: 'Dashboard', href: '/dashboard/admin', icon: '📊', id: 'admin-dashboard' },
        { label: 'Categories', href: '/dashboard/admin/categories', icon: '📑', id: 'categories' },
        { label: 'Tags', href: '/dashboard/admin/tags', icon: '🏷️', id: 'tags' },
        { label: 'Cleanup', href: '/dashboard/admin/cleanup', icon: '🧹', id: 'cleanup' },
        { label: 'Role Requests', href: '/dashboard/admin/role-requests', icon: '👥', id: 'role-requests' },
        { label: 'Analytics', href: '/dashboard/admin/analytics', icon: '📈', id: 'admin-analytics' },
      ],
      id: 'admin',
    },
  ]

  // Get menu items based on user role
  const getMenuItems = () => {
    if (!user) return commonMenuItems
    
    switch (user.primaryRole) {
      case 'admin':
        // Admin can also have instructor access if they have instructor role
        const adminItems = [...commonMenuItems, ...adminMenuItems];
        // Check if admin also has instructor role
        if (user.roles && user.roles.includes('instructor')) {
          adminItems.push(...instructorMenuItems);
        }
        return adminItems;
      case 'instructor':
        return [...commonMenuItems, ...instructorMenuItems]
      case 'student':
        return [...commonMenuItems, ...studentMenuItems]
      default:
        return commonMenuItems
    }
  }

  const menuItems = getMenuItems()

  // Check if a link is active
  const isLinkActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') return true
    if (href !== '/dashboard' && pathname.startsWith(href)) return true
    return false
  }

  // Find active menu item
  const findActiveMenuItem = () => {
    for (const item of menuItems) {
      for (const subitem of item.submenu) {
        if (isLinkActive(subitem.href)) {
          return subitem.id
        }
      }
    }
    return 'dashboard'
  }

  const activeMenuItem = findActiveMenuItem()

  // Improved Mobile Overlay - Same as course learning sidebar
  const MobileOverlay = () => (
    <div 
      className={`lg:hidden fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 transition-all duration-300 ${
        isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => setIsMobileOpen(false)}
    />
  )

  // Logo component with link to homepage
  const Logo = () => (
    <Link 
      href="/" 
      className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''} hover:opacity-80 transition-opacity`}
    >
      <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
        <span className="text-white font-bold">A</span>
      </div>
      {!isCollapsed && (
        <div>
          <h2 className="font-bold text-gray-900">AxioQuan</h2>
          <p className="text-xs text-gray-500">Learning Platform</p>
        </div>
      )}
    </Link>
  )

  // Collapsed logo component
  const CollapsedLogo = () => (
    <Link 
      href="/" 
      className="w-10 h-10 rounded-lg bg-black flex items-center justify-center hover:opacity-80 transition-opacity"
      title="Go to homepage"
    >
      <span className="text-white font-bold">a</span>
    </Link>
  )

  // Sidebar content - REMOVED height constraint
  const SidebarContent = () => (
    <div className={`bg-white border-r border-gray-200 flex flex-col ${
      isCollapsed ? 'w-16' : 'w-64'
    } h-full`}> {/* Changed from h-screen to h-full for full height */}
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        {/* Logo and Toggle */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {isCollapsed ? <CollapsedLogo /> : <Logo />}
          
          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              )}
            </svg>
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Menu Section - Fixed, non-scrollable */}
      <div className="flex-1 p-4">
        {/* Main Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              {/* Main Menu Item */}
              {isCollapsed ? (
                // Collapsed view - just icon
                <button
                  onClick={() => setExpandedMenu(expandedMenu === item.id ? null : item.id)}
                  className={`w-full flex items-center justify-center p-3 rounded-lg transition-colors cursor-pointer ${
                    expandedMenu === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title={item.label}
                >
                  <span className="text-lg">{item.icon}</span>
                </button>
              ) : (
                // Expanded view - full label
                <button
                  onClick={() => setExpandedMenu(expandedMenu === item.id ? null : item.id)}
                  className="w-full cursor-pointer flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <span className={`transition-transform ${expandedMenu === item.id ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
              )}

              {/* Submenu Items */}
              {expandedMenu === item.id && (
                <div className={`space-y-1 mt-1 ${isCollapsed ? 'ml-0' : 'ml-6'}`}>
                  {item.submenu.map((subitem) => (
                    <Link
                      key={subitem.id}
                      href={subitem.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isLinkActive(subitem.href)
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                      title={isCollapsed ? subitem.label : undefined}
                    >
                      <span>{subitem.icon}</span>
                      {!isCollapsed && <span>{subitem.label}</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Fixed Footer Section - User Profile */}
      {!isCollapsed && user && (
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <UserProfileNav
            userName={user.name || 'User'}
            userEmail={user.email || 'user@example.com'}
            userRole={user.primaryRole || 'user'}
            userImage={user.image}
          />
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile Hamburger Button - Floating Bottom Left */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="cursor-pointer lg:hidden fixed bottom-6 left-6 z-50 p-4 bg-white rounded-full shadow-2xl border border-gray-200 hover:bg-gray-50 transition-colors hover:shadow-3xl"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Improved Mobile Overlay */}
      <MobileOverlay />

      {/* Desktop Sidebar - Always visible on desktop */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar - Full height like course learning sidebar */}
      <div className={`
        lg:hidden fixed inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        shadow-xl
      `}>
        <SidebarContent />
      </div>
    </>
  )
}