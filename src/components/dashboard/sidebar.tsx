

// // // /components/dashboard/sidebar.tsx

// 'use client'

// import Link from 'next/link'
// import { useState, useEffect } from 'react'
// import { usePathname } from 'next/navigation'
// import { UserProfileNav } from './user-profile-nav'
// import { useSidebar } from '@/contexts/sidebar-context'
// import {
//   LayoutDashboard,
//   User,
//   GraduationCap,
//   Inbox,
//   BookOpen,
//   TrendingUp,
//   Award,
//   FileText,
//   Users,
//   DollarSign,
//   Settings,
//   FolderOpen,
//   Tags,
//   Trash2,
//   UserCheck,
//   BarChart3,
//   PlusCircle,
//   Menu,
//   X,
//   ChevronLeft,
//   ChevronRight
// } from 'lucide-react'

// interface SidebarProps {
//   user: any
// }

// export default function Sidebar({ user }: SidebarProps) {
//   const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar()
//   const [expandedMenu, setExpandedMenu] = useState<string | null>('learn')
//   const pathname = usePathname()

//   // Close mobile sidebar when route changes
//   useEffect(() => {
//     setIsMobileOpen(false)
//   }, [pathname, setIsMobileOpen])

//   // Close mobile sidebar on resize to desktop
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 1024) {
//         setIsMobileOpen(false)
//       }
//     }

//     window.addEventListener('resize', handleResize)
//     return () => window.removeEventListener('resize', handleResize)
//   }, [setIsMobileOpen])

//   // Common menu items for all roles
//   const commonMenuItems = [
//     {
//       label: 'Menu',
//       icon: <Menu className="h-5 w-5" />,
//       submenu: [
//         { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" />, id: 'dashboard' },
//         { label: 'Profile', href: '/dashboard/profile', icon: <User className="h-4 w-4" />, id: 'profile' },
//         { label: 'Courses', href: '/courses', icon: <GraduationCap className="h-4 w-4" />, id: 'courses' },
//         { label: 'Inbox', href: '/dashboard/inbox', icon: <Inbox className="h-4 w-4" />, id: 'inbox' },
//       ],
//       id: 'Menu',
//     },
//   ]

//   // Student specific menu
//   const studentMenuItems = [
//     {
//       label: 'My Learning',
//       icon: <BookOpen className="h-5 w-5" />,
//       submenu: [
//         { label: 'My Courses', href: '/dashboard/my-courses', icon: <BookOpen className="h-4 w-4" />, id: 'my-courses' },
//         { label: 'Progress', href: '/dashboard/progress', icon: <TrendingUp className="h-4 w-4" />, id: 'progress' }, 
//         { label: 'Certificates', href: '/dashboard/certificates', icon: <Award className="h-4 w-4" />, id: 'certificates' },
//         { label: 'Quiz Results', href: '/dashboard/my-courses', icon: <FileText className="h-4 w-4" />, id: 'quiz-results' },
//       ],
//       id: 'my-learning',
//     },
//   ]

//   // Instructor specific menu
//   const instructorMenuItems = [
//     {
//       label: 'Teaching',
//       icon: <Users className="h-5 w-5" />,
//       submenu: [
//         { label: 'My Courses', href: '/dashboard/instructor/courses', icon: <BookOpen className="h-4 w-4" />, id: 'instructor-courses' },
//         { label: 'Create Course', href: '/dashboard/instructor/create', icon: <PlusCircle className="h-4 w-4" />, id: 'create-course' },
//         { label: 'Quiz Analytics', href: '/dashboard/instructor/quizzes', icon: <BarChart3 className="h-4 w-4" />, id: 'quiz-analytics' },
//         { label: 'Students', href: '/dashboard/instructor/students', icon: <Users className="h-4 w-4" />, id: 'students' },
//         { label: 'Certificates', href: '/dashboard/instructor/certificates', icon: <Award className="h-4 w-4" />, id: 'certificates' },
//         { label: 'Earnings', href: '/dashboard/instructor/earnings', icon: <DollarSign className="h-4 w-4" />, id: 'earnings' },
//       ],
//       id: 'teaching',
//     },
//   ]

//   // Admin specific menu
//   const adminMenuItems = [
//     {
//       label: 'Admin',
//       icon: <Settings className="h-5 w-5" />,
//       submenu: [
//         { label: 'Dashboard', href: '/dashboard/admin', icon: <LayoutDashboard className="h-4 w-4" />, id: 'admin-dashboard' },
//         { label: 'Categories', href: '/dashboard/admin/categories', icon: <FolderOpen className="h-4 w-4" />, id: 'categories' },
//         { label: 'Tags', href: '/dashboard/admin/tags', icon: <Tags className="h-4 w-4" />, id: 'tags' },
//         { label: 'Cleanup', href: '/dashboard/admin/cleanup', icon: <Trash2 className="h-4 w-4" />, id: 'cleanup' },
//         { label: 'Role Requests', href: '/dashboard/admin/role-requests', icon: <UserCheck className="h-4 w-4" />, id: 'role-requests' },
//         { label: 'Analytics', href: '/dashboard/admin/analytics', icon: <BarChart3 className="h-4 w-4" />, id: 'admin-analytics' },
//       ],
//       id: 'admin',
//     },
//   ]

//   // Get menu items based on user role
//   const getMenuItems = () => {
//     if (!user) return commonMenuItems
    
//     switch (user.primaryRole) {
//       case 'admin':
//         const adminItems = [...commonMenuItems, ...adminMenuItems];
//         if (user.roles && user.roles.includes('instructor')) {
//           adminItems.push(...instructorMenuItems);
//         }
//         return adminItems;
//       case 'instructor':
//         return [...commonMenuItems, ...instructorMenuItems]
//       case 'student':
//         return [...commonMenuItems, ...studentMenuItems]
//       default:
//         return commonMenuItems
//     }
//   }

//   const menuItems = getMenuItems()

//   // Check if a link is active
//   const isLinkActive = (href: string) => {
//     if (href === '/dashboard' && pathname === '/dashboard') return true
//     if (href !== '/dashboard' && pathname.startsWith(href)) return true
//     return false
//   }

//   // Find active menu item
//   const findActiveMenuItem = () => {
//     for (const item of menuItems) {
//       for (const subitem of item.submenu) {
//         if (isLinkActive(subitem.href)) {
//           return subitem.id
//         }
//       }
//     }
//     return 'dashboard'
//   }

//   const activeMenuItem = findActiveMenuItem()

//   // Mobile Overlay
//   const MobileOverlay = () => (
//     <div 
//       className={`lg:hidden fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 transition-all duration-300 ${
//         isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//       }`}
//       onClick={() => setIsMobileOpen(false)}
//     />
//   )

//   // Logo component
//   const Logo = () => (
//     <Link 
//       href="/" 
//       className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''} hover:opacity-80 transition-opacity`}
//     >
//       <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
//         <span className="text-white font-bold">A</span>
//       </div>
//       {!isCollapsed && (
//         <div>
//           <h2 className="font-bold text-gray-900">AxioQuan</h2>
//           <p className="text-xs text-gray-500">Learning Platform</p>
//         </div>
//       )}
//     </Link>
//   )

//   // Collapsed logo component
//   const CollapsedLogo = () => (
//     <Link 
//       href="/" 
//       className="w-10 h-10 rounded-lg bg-black flex items-center justify-center hover:opacity-80 transition-opacity"
//       title="Go to homepage"
//     >
//       <span className="text-white font-bold">a</span>
//     </Link>
//   )

//   // Sidebar content
//   const SidebarContent = () => (
//     <div className={`bg-white border-r border-gray-200 flex flex-col ${
//       isCollapsed ? 'w-16' : 'w-64'
//     } h-full`}>
//       {/* Header Section */}
//       <div className="shrink-0 p-4 border-b border-gray-200">
//         <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
//           {isCollapsed ? <CollapsedLogo /> : <Logo />}
          
//           {/* Desktop Toggle Button */}
//           <button
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
//             title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
//           >
//             {isCollapsed ? (
//               <ChevronRight className="w-4 h-4 text-gray-600" />
//             ) : (
//               <ChevronLeft className="w-4 h-4 text-gray-600" />
//             )}
//           </button>

//           {/* Mobile Close Button */}
//           <button
//             onClick={() => setIsMobileOpen(false)}
//             className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
//           >
//             <X className="w-4 h-4 text-gray-600" />
//           </button>
//         </div>
//       </div>

//       {/* Menu Section */}
//       <div className="flex-1 p-4">
//         <nav className="space-y-2">
//           {menuItems.map((item) => (
//             <div key={item.id}>
//               {/* Main Menu Item */}
//               {isCollapsed ? (
//                 <button
//                   onClick={() => setExpandedMenu(expandedMenu === item.id ? null : item.id)}
//                   className={`w-full flex items-center justify-center p-3 rounded-lg transition-colors cursor-pointer ${
//                     expandedMenu === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
//                   }`}
//                   title={item.label}
//                 >
//                   <div className="scale-125">
//                     {item.icon}
//                   </div>
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => setExpandedMenu(expandedMenu === item.id ? null : item.id)}
//                   className="w-full cursor-pointer flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium text-sm"
//                 >
//                   <div className="flex items-center gap-2">
//                     {item.icon}
//                     <span>{item.label}</span>
//                   </div>
//                   <span className={`transition-transform ${expandedMenu === item.id ? 'rotate-180' : ''}`}>
//                     ▼
//                   </span>
//                 </button>
//               )}

//               {/* Submenu Items */}
//               {expandedMenu === item.id && (
//                 <div className={`space-y-1 mt-1 ${isCollapsed ? 'ml-0' : 'ml-6'}`}>
//                   {item.submenu.map((subitem) => (
//                     <Link
//                       key={subitem.id}
//                       href={subitem.href}
//                       className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
//                         isLinkActive(subitem.href)
//                           ? 'bg-blue-50 text-blue-600 font-medium'
//                           : 'text-gray-600 hover:bg-gray-100'
//                       } ${isCollapsed ? 'justify-center' : ''}`}
//                       title={isCollapsed ? subitem.label : undefined}
//                     >
//                       <div className={`${isCollapsed ? 'scale-110' : ''}`}>
//                         {subitem.icon}
//                       </div>
//                       {!isCollapsed && <span>{subitem.label}</span>}
//                     </Link>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </nav>
//       </div>

//       {/* Footer Section - User Profile */}
//       {!isCollapsed && user && (
//         <div className="shrink-0 p-4 border-t border-gray-200">
//           <UserProfileNav
//             userName={user.name || 'User'}
//             userEmail={user.email || 'user@example.com'}
//             userRole={user.primaryRole || 'user'}
//             userImage={user.image}
//           />
//         </div>
//       )}
//     </div>
//   )

//   return (
//     <>
//       {/* Mobile Hamburger Button */}
//       <button
//         onClick={() => setIsMobileOpen(true)}
//         className="cursor-pointer lg:hidden fixed bottom-6 left-6 z-50 p-4 bg-white rounded-full shadow-2xl border border-gray-200 hover:bg-gray-50 transition-colors hover:shadow-3xl"
//       >
//         <Menu className="w-6 h-6 text-gray-600" />
//       </button>

//       {/* Mobile Overlay */}
//       <MobileOverlay />

//       {/* Desktop Sidebar */}
//       <div className="hidden lg:block fixed inset-y-0 left-0 z-30">
//         <SidebarContent />
//       </div>

//       {/* Mobile Sidebar */}
//       <div className={`
//         lg:hidden fixed inset-y-0 left-0 z-50
//         transform transition-transform duration-300 ease-out
//         ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
//         shadow-xl
//       `}>
//         <SidebarContent />
//       </div>
//     </>
//   )
// }






























// 'use client'

// import Link from 'next/link'
// import { useState, useEffect } from 'react'
// import { usePathname } from 'next/navigation'
// import { UserProfileNav } from './user-profile-nav'
// import { useSidebar } from '@/contexts/sidebar-context'

// // ─── Replaced all generic icons with purpose-specific ones ───────────────────
// import {
//   LayoutDashboard,   // Dashboard overview
//   CircleUser,        // Profile
//   GraduationCap,     // Courses / My Learning
//   Inbox,             // Inbox messages
//   BookMarked,        // My Courses (student)
//   BarChart2,         // Progress
//   BadgeCheck,        // Certificates
//   ClipboardList,     // Quiz Results
//   Users,             // Students / Teaching
//   BookPlus,          // Create Course
//   PieChart,          // Quiz Analytics
//   DollarSign,        // Earnings
//   ShieldCheck,       // Admin
//   FolderTree,        // Categories
//   Tag,               // Tags
//   Trash2,            // Cleanup
//   UserCog,           // Role Requests
//   AreaChart,         // Analytics
//   PanelLeftClose,    // Collapse sidebar
//   PanelLeftOpen,     // Expand sidebar
//   AlignJustify,      // Mobile hamburger
//   X,                 // Close mobile
//   ChevronDown,       // Submenu toggle
//   Home,              // Menu group
//   Bell,
//   MailOpen,
//   MessagesSquare,
// } from 'lucide-react'

// interface SidebarProps {
//   user: any;
// }

// export default function Sidebar({ user }: SidebarProps) {
//   const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();
//   const [expandedMenu, setExpandedMenu] = useState<string | null>('Menu');
//   const pathname = usePathname();

//   useEffect(() => {
//     setIsMobileOpen(false);
//   }, [pathname, setIsMobileOpen]);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 1024) setIsMobileOpen(false);
//     };
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [setIsMobileOpen]);

//   // ─── Menu definitions ───────────────────────────────────────────────────────
//   const commonMenuItems = [
//     {
//       label: 'Menu',
//       icon: <Home className="h-5 w-5" />,
//       id: 'Menu',
//       submenu: [
//         { label: 'Dashboard',  href: '/dashboard',         icon: <LayoutDashboard className="h-4 w-4" />, id: 'dashboard'  },
//         { label: 'Profile',    href: '/dashboard/profile', icon: <CircleUser       className="h-4 w-4" />, id: 'profile'    },
//         { label: 'Courses',    href: '/courses',           icon: <GraduationCap    className="h-4 w-4" />, id: 'courses'    },
        
//         // { label: 'Inbox',      href: '/dashboard/inbox',   icon: <Inbox            className="h-4 w-4" />, id: 'inbox'      },
//         { label: 'Inbox',          href: '/dashboard/inbox',              icon: <Inbox          className="h-4 w-4" />, id: 'inbox'         },
//         // { label: 'Notifications',  href: '/dashboard/inbox/notifications', icon: <Bell          className="h-4 w-4" />, id: 'notifications'  },
//         { label: 'Unread',         href: '/dashboard/inbox/unread',        icon: <MailOpen      className="h-4 w-4" />, id: 'unread'         },
//         { label: 'Discussions',    href: '/dashboard/inbox/courses',       icon: <MessagesSquare className="h-4 w-4" />, id: 'discussions'   },
//       ],
//     },
//   ];

//   const studentMenuItems = [
//     {
//       label: 'My Learning',
//       icon: <BookMarked className="h-5 w-5" />,
//       id: 'my-learning',
//       submenu: [
//         { label: 'My Courses',    href: '/dashboard/my-courses',   icon: <BookMarked     className="h-4 w-4" />, id: 'my-courses'   },
//         { label: 'Progress',      href: '/dashboard/progress',     icon: <BarChart2      className="h-4 w-4" />, id: 'progress'     },
//         { label: 'Certificates',  href: '/dashboard/certificates', icon: <BadgeCheck     className="h-4 w-4" />, id: 'certificates' },
//         { label: 'Quiz Results',  href: '/dashboard/my-courses',   icon: <ClipboardList  className="h-4 w-4" />, id: 'quiz-results' },
//       ],
//     },
//   ];

//   const instructorMenuItems = [
//     {
//       label: 'Teaching',
//       icon: <Users className="h-5 w-5" />,
//       id: 'teaching',
//       submenu: [
//         { label: 'My Courses',      href: '/dashboard/instructor/courses',    icon: <BookMarked   className="h-4 w-4" />, id: 'instructor-courses' },
//         { label: 'Create Course',   href: '/dashboard/instructor/create',     icon: <BookPlus     className="h-4 w-4" />, id: 'create-course'      },
//         { label: 'Quiz Analytics',  href: '/dashboard/instructor/quizzes',    icon: <PieChart     className="h-4 w-4" />, id: 'quiz-analytics'     },
//         { label: 'Students',        href: '/dashboard/instructor/students',   icon: <Users        className="h-4 w-4" />, id: 'students'           },
//         { label: 'Certificates',    href: '/dashboard/instructor/certificates', icon: <BadgeCheck className="h-4 w-4" />, id: 'certificates'       },
//         { label: 'Earnings',        href: '/dashboard/instructor/earnings',   icon: <DollarSign   className="h-4 w-4" />, id: 'earnings'           },
//       ],
//     },
//   ];

//   const adminMenuItems = [
//     {
//       label: 'Admin',
//       icon: <ShieldCheck className="h-5 w-5" />,
//       id: 'admin',
//       submenu: [
//         { label: 'Dashboard',    href: '/dashboard/admin',               icon: <LayoutDashboard className="h-4 w-4" />, id: 'admin-dashboard' },
//         { label: 'Categories',   href: '/dashboard/admin/categories',    icon: <FolderTree      className="h-4 w-4" />, id: 'categories'      },
//         { label: 'Tags',         href: '/dashboard/admin/tags',          icon: <Tag             className="h-4 w-4" />, id: 'tags'            },
//         { label: 'Cleanup',      href: '/dashboard/admin/cleanup',       icon: <Trash2          className="h-4 w-4" />, id: 'cleanup'         },
//         { label: 'Role Requests',href: '/dashboard/admin/role-requests', icon: <UserCog         className="h-4 w-4" />, id: 'role-requests'   },
//         { label: 'Analytics',    href: '/dashboard/admin/analytics',     icon: <AreaChart       className="h-4 w-4" />, id: 'admin-analytics' },
//       ],
//     },
//   ];

//   const getMenuItems = () => {
//     if (!user) return commonMenuItems;
//     switch (user.primaryRole) {
//       case 'admin': {
//         const items = [...commonMenuItems, ...adminMenuItems];
//         if (user.roles?.includes('instructor')) items.push(...instructorMenuItems);
//         return items;
//       }
//       case 'instructor': return [...commonMenuItems, ...instructorMenuItems];
//       case 'student':    return [...commonMenuItems, ...studentMenuItems];
//       default:           return commonMenuItems;
//     }
//   };

//   const menuItems = getMenuItems();

//   const isLinkActive = (href: string) => {
//     if (href === '/dashboard') return pathname === '/dashboard';
//     return pathname.startsWith(href);
//   };

//   // ─── Sub-components ─────────────────────────────────────────────────────────
//   const Logo = () => (
//     <Link
//       href="/"
//       className={`flex items-center gap-2.5 ${isCollapsed ? 'justify-center' : ''} hover:opacity-80 transition-opacity`}
//     >
//       <div
//         className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
//         style={{ background: '#000' }}
//       >
//         <span className="text-white font-black text-sm">A</span>
//       </div>
//       {!isCollapsed && (
//         <div>
//           <p className="font-bold text-gray-900 text-lg leading-tight">AxioQuan</p>
//           <p className="text-[10px] text-gray-400 leading-tight">Learning Platform</p>
//         </div>
//       )}
//     </Link>
//   );

//   const SidebarContent = () => (
//     <div
//       className="bg-white border-r border-gray-100 flex flex-col h-full transition-all duration-300"
//       style={{ width: isCollapsed ? 64 : 256 }}
//     >
//       {/* ── Header ─────────────────────────────────────────────────── */}
//       <div className="shrink-0 px-4 py-4 border-b border-gray-100">
//         <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
//           <Logo />
//           {!isCollapsed && (
//             <button
//               onClick={() => setIsCollapsed(true)}
//               className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
//               title="Collapse sidebar"
//             >
//               <PanelLeftClose className="w-4 h-4 text-gray-500" />
//             </button>
//           )}
//           {isCollapsed && (
//             <button
//               onClick={() => setIsCollapsed(false)}
//               className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer mt-2"
//               title="Expand sidebar"
//             >
//               <PanelLeftOpen className="w-4 h-4 text-gray-500" />
//             </button>
//           )}
//           <button
//             onClick={() => setIsMobileOpen(false)}
//             className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
//           >
//             <X className="w-4 h-4 text-gray-500" />
//           </button>
//         </div>
//       </div>

//       {/* ── Nav ────────────────────────────────────────────────────── */}
//       <div className="flex-1 overflow-y-auto px-3 py-4">
//         <nav className="space-y-1">
//           {menuItems.map((item) => (
//             <div key={item.id}>
//               {/* Group header */}
//               {isCollapsed ? (
//                 // Collapsed: just the icon, click to expand inline
//                 <button
//                   onClick={() => setExpandedMenu(expandedMenu === item.id ? null : item.id)}
//                   title={item.label}
//                   className={`
//                     w-full flex items-center justify-center p-2.5 rounded-xl
//                     transition-all duration-200 cursor-pointer
//                     ${expandedMenu === item.id
//                       ? 'bg-violet-50 text-violet-600'
//                       : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}
//                   `}
//                 >
//                   {item.icon}
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => setExpandedMenu(expandedMenu === item.id ? null : item.id)}
//                   className="w-full flex items-center justify-between px-3 py-2 rounded-xl
//                     text-xs font-semibold text-gray-400 uppercase tracking-widest
//                     hover:text-gray-600 transition-colors cursor-pointer"
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="text-gray-400">{item.icon}</span>
//                     {item.label}
//                   </div>
//                   <ChevronDown
//                     className={`w-3.5 h-3.5 transition-transform duration-200 ${
//                       expandedMenu === item.id ? 'rotate-180' : ''
//                     }`}
//                   />
//                 </button>
//               )}

//               {/* Submenu */}
//               {expandedMenu === item.id && (
//                 <div className={`mt-1 space-y-0.5 ${isCollapsed ? '' : 'ml-1'}`}>
//                   {item.submenu.map((sub) => {
//                     const active = isLinkActive(sub.href);
//                     return (
//                       <Link
//                         key={sub.id}
//                         href={sub.href}
//                         title={isCollapsed ? sub.label : undefined}
//                         className={`
//                           flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
//                           transition-all duration-200 font-medium
//                           ${isCollapsed ? 'justify-center' : ''}
//                           ${active
//                             ? 'bg-violet-50 text-violet-700'
//                             : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
//                         `}
//                       >
//                         {/* Icon wrapper */}
//                         <span
//                           className={`
//                             flex-shrink-0 flex items-center justify-center
//                             w-7 h-7 rounded-lg transition-all duration-200
//                             ${active
//                               ? 'bg-violet-600 text-white shadow-sm shadow-violet-200'
//                               : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}
//                           `}
//                         >
//                           {sub.icon}
//                         </span>
//                         {!isCollapsed && (
//                           <span>{sub.label}</span>
//                         )}
//                         {/* Active indicator dot */}
//                         {active && !isCollapsed && (
//                           <span
//                             className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0"
//                           />
//                         )}
//                       </Link>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           ))}
//         </nav>
//       </div>

//       {/* ── Footer ─────────────────────────────────────────────────── */}
//       {!isCollapsed && user && (
//         <div className="shrink-0 px-3 py-4 border-t border-gray-100">
//           <UserProfileNav
//             userName={user.name  || 'User'}
//             userEmail={user.email || 'user@example.com'}
//             userRole={user.primaryRole || 'user'}
//             userImage={user.image}
//           />
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <>
//       {/* Mobile hamburger — fixed bottom-left */}
//       <button
//         onClick={() => setIsMobileOpen(true)}
//         className="lg:hidden fixed bottom-6 left-6 z-50 p-3.5 bg-white rounded-2xl
//           shadow-lg border border-gray-200 hover:bg-gray-50 transition-all
//           hover:shadow-xl cursor-pointer"
//       >
//         <AlignJustify className="w-5 h-5 text-gray-600" />
//       </button>

//       {/* Mobile overlay */}
//       <div
//         className={`lg:hidden fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40
//           transition-all duration-300
//           ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
//         onClick={() => setIsMobileOpen(false)}
//       />

//       {/* Desktop sidebar — fixed */}
//       <div className="hidden lg:block fixed inset-y-0 left-0 z-30">
//         <SidebarContent />
//       </div>

//       {/* Mobile sidebar — slides in */}
//       <div
//         className={`lg:hidden fixed inset-y-0 left-0 z-50 shadow-2xl
//           transform transition-transform duration-300 ease-out
//           ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
//       >
//         <SidebarContent />
//       </div>
//     </>
//   );
// }































'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { UserProfileNav } from './user-profile-nav'
import { useSidebar } from '@/contexts/sidebar-context'
import { InboxBadge } from './inbox-badge'
import { NotificationBell } from '@/components/notifications/notification-bell'

// ─── Replaced all generic icons with purpose-specific ones ───────────────────
import {
  LayoutDashboard,   // Dashboard overview
  CircleUser,        // Profile
  GraduationCap,     // Courses / My Learning
  Inbox,             // Inbox messages
  BookMarked,        // My Courses (student)
  BarChart2,         // Progress
  BadgeCheck,        // Certificates
  ClipboardList,     // Quiz Results
  Users,             // Students / Teaching
  BookPlus,          // Create Course
  PieChart,          // Quiz Analytics
  DollarSign,        // Earnings
  ShieldCheck,       // Admin
  FolderTree,        // Categories
  Tag,               // Tags
  Trash2,            // Cleanup
  UserCog,           // Role Requests
  AreaChart,         // Analytics
  PanelLeftClose,    // Collapse sidebar
  PanelLeftOpen,     // Expand sidebar
  AlignJustify,      // Mobile hamburger
  X,                 // Close mobile
  ChevronDown,       // Submenu toggle
  Home,              // Menu group
  Bell,
  MailOpen,
  MessagesSquare,
} from 'lucide-react'

interface SidebarProps {
  user: any;
}

export default function Sidebar({ user }: SidebarProps) {
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();
  const [expandedMenu, setExpandedMenu] = useState<string | null>('Menu');
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname, setIsMobileOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobileOpen]);

  // ─── Menu definitions ───────────────────────────────────────────────────────
  const commonMenuItems = [
    {
      label: 'Menu',
      icon: <Home className="h-5 w-5" />,
      id: 'Menu',
      submenu: [
        { label: 'Dashboard',  href: '/dashboard',         icon: <LayoutDashboard className="h-4 w-4" />, id: 'dashboard'  },
        { label: 'Profile',    href: '/dashboard/profile', icon: <CircleUser       className="h-4 w-4" />, id: 'profile'    },
        { label: 'Courses',    href: '/courses',           icon: <GraduationCap    className="h-4 w-4" />, id: 'courses'    },
        
        // { label: 'Inbox',      href: '/dashboard/inbox',   icon: <Inbox            className="h-4 w-4" />, id: 'inbox'      },
        // { label: 'Inbox',          href: '/dashboard/inbox',              icon: <Inbox          className="h-4 w-4" />, id: 'inbox'         },
        { label: 'Inbox', href: '/dashboard/inbox', icon: <Inbox className="h-4 w-4" />, id: 'inbox' },
        // { label: 'Notifications',  href: '/dashboard/inbox/notifications', icon: <Bell          className="h-4 w-4" />, id: 'notifications'  },
        { label: 'Unread',         href: '/dashboard/inbox/unread',        icon: <MailOpen      className="h-4 w-4" />, id: 'unread'         },
        { label: 'Discussions',    href: '/dashboard/inbox/courses',       icon: <MessagesSquare className="h-4 w-4" />, id: 'discussions'   },
      ],
    },
  ];

  const studentMenuItems = [
    {
      label: 'My Learning',
      icon: <BookMarked className="h-5 w-5" />,
      id: 'my-learning',
      submenu: [
        { label: 'My Courses',    href: '/dashboard/my-courses',   icon: <BookMarked     className="h-4 w-4" />, id: 'my-courses'   },
        { label: 'Progress',      href: '/dashboard/progress',     icon: <BarChart2      className="h-4 w-4" />, id: 'progress'     },
        { label: 'Certificates',  href: '/dashboard/certificates', icon: <BadgeCheck     className="h-4 w-4" />, id: 'certificates' },
        { label: 'Quiz Results',  href: '/dashboard/my-courses',   icon: <ClipboardList  className="h-4 w-4" />, id: 'quiz-results' },
      ],
    },
  ];

  const instructorMenuItems = [
    {
      label: 'Teaching',
      icon: <Users className="h-5 w-5" />,
      id: 'teaching',
      submenu: [
        { label: 'My Courses',      href: '/dashboard/instructor/courses',    icon: <BookMarked   className="h-4 w-4" />, id: 'instructor-courses' },
        { label: 'Create Course',   href: '/dashboard/instructor/create',     icon: <BookPlus     className="h-4 w-4" />, id: 'create-course'      },
        { label: 'Quiz Analytics',  href: '/dashboard/instructor/quizzes',    icon: <PieChart     className="h-4 w-4" />, id: 'quiz-analytics'     },
        { label: 'Students',        href: '/dashboard/instructor/students',   icon: <Users        className="h-4 w-4" />, id: 'students'           },
        { label: 'Certificates',    href: '/dashboard/instructor/certificates', icon: <BadgeCheck className="h-4 w-4" />, id: 'certificates'       },
        { label: 'Earnings',        href: '/dashboard/instructor/earnings',   icon: <DollarSign   className="h-4 w-4" />, id: 'earnings'           },
      ],
    },
  ];

  const adminMenuItems = [
    {
      label: 'Admin',
      icon: <ShieldCheck className="h-5 w-5" />,
      id: 'admin',
      submenu: [
        { label: 'Dashboard',    href: '/dashboard/admin',               icon: <LayoutDashboard className="h-4 w-4" />, id: 'admin-dashboard' },
        { label: 'Categories',   href: '/dashboard/admin/categories',    icon: <FolderTree      className="h-4 w-4" />, id: 'categories'      },
        { label: 'Tags',         href: '/dashboard/admin/tags',          icon: <Tag             className="h-4 w-4" />, id: 'tags'            },
        { label: 'Cleanup',      href: '/dashboard/admin/cleanup',       icon: <Trash2          className="h-4 w-4" />, id: 'cleanup'         },
        { label: 'Role Requests',href: '/dashboard/admin/role-requests', icon: <UserCog         className="h-4 w-4" />, id: 'role-requests'   },
        { label: 'Analytics',    href: '/dashboard/admin/analytics',     icon: <AreaChart       className="h-4 w-4" />, id: 'admin-analytics' },
      ],
    },
  ];

  const getMenuItems = () => {
    if (!user) return commonMenuItems;
    switch (user.primaryRole) {
      case 'admin': {
        const items = [...commonMenuItems, ...adminMenuItems];
        if (user.roles?.includes('instructor')) items.push(...instructorMenuItems);
        return items;
      }
      case 'instructor': return [...commonMenuItems, ...instructorMenuItems];
      case 'student':    return [...commonMenuItems, ...studentMenuItems];
      default:           return commonMenuItems;
    }
  };

  const menuItems = getMenuItems();

  const isLinkActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  // ─── Sub-components ─────────────────────────────────────────────────────────
  const Logo = () => (
    <Link
      href="/"
      className={`flex items-center gap-2.5 ${isCollapsed ? 'justify-center' : ''} hover:opacity-80 transition-opacity`}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: '#000' }}
      >
        <span className="text-white font-black text-sm">A</span>
      </div>
      {!isCollapsed && (
        <div>
          <p className="font-bold text-gray-900 text-lg leading-tight">AxioQuan</p>
          <p className="text-[10px] text-gray-400 leading-tight">Learning Platform</p>
        </div>
      )}
    </Link>
  );

  const SidebarContent = () => (
    <div
      className="bg-white border-r border-gray-100 flex flex-col h-full transition-all duration-300"
      style={{ width: isCollapsed ? 64 : 256 }}
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="shrink-0 px-4 py-4 border-b border-gray-100">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <Logo />
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4 text-gray-500" />
            </button>
          )}
          {isCollapsed && (
            <button
              onClick={() => setIsCollapsed(false)}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer mt-2"
              title="Expand sidebar"
            >
              <PanelLeftOpen className="w-4 h-4 text-gray-500" />
            </button>
          )}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* ── Nav ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              {/* Group header */}
              {isCollapsed ? (
                // Collapsed: just the icon, click to expand inline
                <button
                  onClick={() => setExpandedMenu(expandedMenu === item.id ? null : item.id)}
                  title={item.label}
                  className={`
                    w-full flex items-center justify-center p-2.5 rounded-xl
                    transition-all duration-200 cursor-pointer
                    ${expandedMenu === item.id
                      ? 'bg-violet-50 text-violet-600'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}
                  `}
                >
                  {item.icon}
                </button>
              ) : (
                <button
                  onClick={() => setExpandedMenu(expandedMenu === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl
                    text-xs font-semibold text-gray-400 uppercase tracking-widest
                    hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{item.icon}</span>
                    {item.label}
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      expandedMenu === item.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              )}

              {/* Submenu */}
              {expandedMenu === item.id && (
                <div className={`mt-1 space-y-0.5 ${isCollapsed ? '' : 'ml-1'}`}>
                  {item.submenu.map((sub) => {
                    const active = isLinkActive(sub.href);
                    return (
                      
                      
                      // <Link
                      //   key={sub.id}
                      //   href={sub.href}
                      //   title={isCollapsed ? sub.label : undefined}
                      //   className={`
                      //     flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                      //     transition-all duration-200 font-medium
                      //     ${isCollapsed ? 'justify-center' : ''}
                      //     ${active
                      //       ? 'bg-violet-50 text-violet-700'
                      //       : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                      //   `}
                      // >
                      //   {/* Icon wrapper */}
                      //   <span
                      //     className={`
                      //       flex-shrink-0 flex items-center justify-center
                      //       w-7 h-7 rounded-lg transition-all duration-200
                      //       ${active
                      //         ? 'bg-violet-600 text-white shadow-sm shadow-violet-200'
                      //         : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}
                      //     `}
                      //   >
                      //     {sub.icon}
                      //   </span>
                      //   {!isCollapsed && (
                      //     <span>{sub.label}</span>
                      //   )}
                      //   {/* Active indicator dot */}
                      //   {active && !isCollapsed && (
                      //     <span
                      //       className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0"
                      //     />
                      //   )}
                      // </Link>


                      <Link
  key={sub.id}
  href={sub.href}
  title={isCollapsed ? sub.label : undefined}
  className={`
    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
    transition-all duration-200 font-medium
    ${isCollapsed ? 'justify-center' : ''}
    ${active
      ? 'bg-violet-50 text-violet-700'
      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
  `}
>
  <span className={`
    flex-shrink-0 flex items-center justify-center
    w-7 h-7 rounded-lg transition-all duration-200
    ${active
      ? 'bg-violet-600 text-white shadow-sm shadow-violet-200'
      : 'bg-gray-100 text-gray-500'}
  `}>
    {sub.icon}
  </span>
  {!isCollapsed && (
    <span>{sub.label}</span>
  )}
  {/* Inbox badge — shows unread count */}
  {!isCollapsed && sub.id === 'inbox' && (
    <InboxBadge />
  )}
  {/* Active dot — only when no badge */}
  {active && !isCollapsed && sub.id !== 'inbox' && (
    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />
  )}
</Link>


                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      {isCollapsed && user && (
        <div className="shrink-0 px-2 py-4 border-t border-gray-100 flex justify-center">
          <NotificationBell placement="sidebar" />
        </div>
      )}
      {!isCollapsed && user && (
        <div className="shrink-0 px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <UserProfileNav
                userName={user.name  || 'User'}
                userEmail={user.email || 'user@example.com'}
                userRole={user.primaryRole || 'user'}
                userImage={user.image}
              />
            </div>
            <NotificationBell placement="sidebar" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile hamburger — fixed bottom-left */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-50 p-3.5 bg-white rounded-2xl
          shadow-lg border border-gray-200 hover:bg-gray-50 transition-all
          hover:shadow-xl cursor-pointer"
      >
        <AlignJustify className="w-5 h-5 text-gray-600" />
      </button>

      {/* Mobile overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40
          transition-all duration-300
          ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Desktop sidebar — fixed */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </div>

      {/* Mobile sidebar — slides in */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 shadow-2xl
          transform transition-transform duration-300 ease-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarContent />
      </div>
    </>
  );
}