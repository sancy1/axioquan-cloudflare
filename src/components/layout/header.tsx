
// // /src/components/layout/header.tsx

// 'use client';

// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { useState } from 'react';
// import { Menu, X, Search } from 'lucide-react';
// import { ActiveLink } from '@/components/ui/active-link';

// export function Header() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const closeMenu = () => {
//     setIsMenuOpen(false);
//   };

//   return (
//     <nav className="backdrop-blur-xl bg-white/30 border-b border-white/20 shadow-lg sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
          
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
//               A
//             </div>
//             <span className="font-bold text-xl hidden sm:inline">AxioQuan</span>
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center gap-6">
//             <ActiveLink href="/">
//               Home
//             </ActiveLink>

//             <ActiveLink href="/courses">
//               Courses
//             </ActiveLink>

//             <ActiveLink href="/categories">
//               Categories
//             </ActiveLink>

//             <ActiveLink href="#">
//               About
//             </ActiveLink>
//           </div>

//           {/* Right Actions */}
//           <div className="hidden md:flex items-center gap-4">
//             {/* Search Input - Commented out for future use */}
//             {/*
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="pl-10 pr-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition w-48"
//               />
//             </div>
//             */}

//             <ActiveLink 
//               href="/login"
//               className="px-4 py-2 font-semibold rounded-lg transition border border-transparent"
//               activeClassName="bg-primary/20 text-primary"
//               inactiveClassName="text-primary hover:bg-primary/10"
//             >
//               Login
//             </ActiveLink>

//             <ActiveLink 
//               href="/signup"
//               className="px-6 py-2 font-semibold rounded-lg transition border border-transparent"
//               activeClassName="bg-primary text-primary-foreground"
//               inactiveClassName="text-primary border hover:bg-primary/10"
//             >
//               Sign Up
//             </ActiveLink>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden flex items-center gap-2">
//             {/* Mobile Search Icon - Commented out for future use */}
//             {/*
//             <Button variant="ghost" size="icon" className="text-foreground">
//               <Search className="h-5 w-5" />
//             </Button>
//             */}
            
//             <Button 
//               variant="ghost" 
//               size="icon" 
//               onClick={toggleMenu}
//               className="text-foreground"
//             >
//               {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </Button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-white/20 shadow-lg">
//             <div className="px-4 py-4 space-y-4">
//               {/* Navigation Links */}
//               <ActiveLink 
//                 href="/" 
//                 className="block"
//                 activeClassName="bg-primary/20 text-primary"
//                 inactiveClassName="text-foreground hover:bg-primary/10 hover:text-primary"
//                 onClick={closeMenu}
//               >
//                 Home
//               </ActiveLink>

//               <ActiveLink 
//                 href="/courses" 
//                 className="block"
//                 activeClassName="bg-primary/20 text-primary"
//                 inactiveClassName="text-foreground hover:bg-primary/10 hover:text-primary"
//                 onClick={closeMenu}
//               >
//                 Courses
//               </ActiveLink>

//               <ActiveLink 
//                 href="/categories" 
//                 className="block"
//                 activeClassName="bg-primary/20 text-primary"
//                 inactiveClassName="text-foreground hover:bg-primary/10 hover:text-primary"
//                 onClick={closeMenu}
//               >
//                 Categories
//               </ActiveLink>

//               <ActiveLink 
//                 href="#" 
//                 className="block"
//                 activeClassName="bg-primary/20 text-primary"
//                 inactiveClassName="text-foreground hover:bg-primary/10 hover:text-primary"
//                 onClick={closeMenu}
//               >
//                 About
//               </ActiveLink>

//               {/* Mobile Search - Commented out for future use */}
//               {/*
//               <div className="pt-2 pb-2">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                   <input
//                     type="text"
//                     placeholder="Search..."
//                     className="w-full pl-10 pr-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition"
//                   />
//                 </div>
//               </div>
//               */}

//               {/* Mobile Auth Buttons */}
//               <div className="pt-2 flex flex-col gap-3">
//                 <ActiveLink 
//                   href="/login"
//                   className="block text-center px-4 py-2 font-semibold rounded-lg transition border"
//                   activeClassName="bg-primary/20 text-primary"
//                   inactiveClassName="text-primary hover:bg-primary/10"
//                   onClick={closeMenu}
//                 >
//                   Login
//                 </ActiveLink>

//                 <ActiveLink 
//                   href="/signup"
//                   className="block text-center px-4 py-2 font-semibold rounded-lg transition border"
//                   activeClassName="bg-primary text-primary-foreground"
//                   inactiveClassName="text-primary border hover:bg-primary/10"
//                   onClick={closeMenu}
//                 >
//                   Sign Up
//                 </ActiveLink>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }















// // /src/components/layout/header.tsx

// 'use client';

// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { useState, useEffect } from 'react';
// import { Menu, X, Search } from 'lucide-react';
// import { ActiveLink } from '@/components/ui/active-link';
// import { UserProfileDropdown } from '@/components/layout/user-profile-dropdown';

// interface AuthStatus {
//   isAuthenticated: boolean;
//   user?: {
//     name: string;
//     email: string;
//     primaryRole: string;
//   };
// }

// export function Header() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [authStatus, setAuthStatus] = useState<AuthStatus>({ 
//     isAuthenticated: false 
//   });
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch('/api/auth/status', {
//           method: 'GET',
//           credentials: 'include',
//           headers: {
//             'Cache-Control': 'no-cache'
//           }
//         });
        
//         if (response.ok) {
//           const data = await response.json();
//           setAuthStatus(data);
//         } else {
//           setAuthStatus({ isAuthenticated: false });
//         }
//       } catch (error) {
//         console.error('Failed to check auth status:', error);
//         setAuthStatus({ isAuthenticated: false });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkAuthStatus();

//     // Set up periodic auth status checks
//     const interval = setInterval(checkAuthStatus, 30000); // Check every 30 seconds

//     return () => clearInterval(interval);
//   }, []);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const closeMenu = () => {
//     setIsMenuOpen(false);
//   };

//   const handleMobileLogout = async () => {
//     try {
//       console.log('Mobile logout initiated...');
//       const response = await fetch('/api/auth/logout', { 
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
      
//       if (response.ok) {
//         console.log('Mobile logout successful');
//         window.location.href = '/login';
//       } else {
//         console.error('Mobile logout failed');
//         // Fallback redirect
//         window.location.href = '/login';
//       }
//     } catch (error) {
//       console.error('Mobile logout error:', error);
//       // Last resort redirect
//       window.location.href = '/login';
//     } finally {
//       closeMenu();
//     }
//   };

//   // Show loading state briefly
//   if (isLoading) {
//     return (
//       <nav className="backdrop-blur-xl bg-white/30 border-b border-white/20 shadow-lg sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <Link href="/" className="flex items-center gap-2">
//               <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
//                 A
//               </div>
//               <span className="font-bold text-xl hidden sm:inline">AxioQuan</span>
//             </Link>
//             <div className="hidden md:flex items-center gap-4">
//               <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
//             </div>
//           </div>
//         </div>
//       </nav>
//     );
//   }

//   return (
//     <nav className="backdrop-blur-xl bg-white/30 border-b border-white/20 shadow-lg sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
          
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
//               A
//             </div>
//             <span className="font-bold text-xl hidden sm:inline">AxioQuan</span>
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center gap-6">
//             <ActiveLink href="/">
//               Home
//             </ActiveLink>

//             <ActiveLink href="/courses">
//               Courses
//             </ActiveLink>

//             <ActiveLink href="/categories">
//               Categories
//             </ActiveLink>

//             <ActiveLink href="#">
//               About
//             </ActiveLink>
//           </div>

//           {/* Right Actions */}
//           <div className="hidden md:flex items-center gap-4">
//             {/* Search Input - Commented out for future use */}
//             {/*
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="pl-10 pr-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition w-48"
//               />
//             </div>
//             */}

//             {authStatus.isAuthenticated && authStatus.user ? (
//               <UserProfileDropdown user={authStatus.user} />
//             ) : (
//               <>
//                 <ActiveLink 
//                   href="/login"
//                   className="px-4 py-2 font-semibold rounded-lg transition border border-transparent"
//                   activeClassName="bg-primary/20 text-primary"
//                   inactiveClassName="text-primary hover:bg-primary/10"
//                 >
//                   Login
//                 </ActiveLink>

//                 <ActiveLink 
//                   href="/signup"
//                   className="px-6 py-2 font-semibold rounded-lg transition border border-transparent"
//                   activeClassName="bg-primary text-primary-foreground"
//                   inactiveClassName="text-primary border hover:bg-primary/10"
//                 >
//                   Sign Up
//                 </ActiveLink>
//               </>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden flex items-center gap-2">
//             {/* Mobile Search Icon - Commented out for future use */}
//             {/*
//             <Button variant="ghost" size="icon" className="text-foreground">
//               <Search className="h-5 w-5" />
//             </Button>
//             */}
            
//             <Button 
//               variant="ghost" 
//               size="icon" 
//               onClick={toggleMenu}
//               className="text-foreground"
//             >
//               {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </Button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-white/20 shadow-lg">
//             <div className="px-4 py-4 space-y-4">
//               {/* Navigation Links */}
//               <ActiveLink 
//                 href="/" 
//                 className="block"
//                 activeClassName="bg-primary/20 text-primary"
//                 inactiveClassName="text-foreground hover:bg-primary/10 hover:text-primary"
//                 onClick={closeMenu}
//               >
//                 Home
//               </ActiveLink>

//               <ActiveLink 
//                 href="/courses" 
//                 className="block"
//                 activeClassName="bg-primary/20 text-primary"
//                 inactiveClassName="text-foreground hover:bg-primary/10 hover:text-primary"
//                 onClick={closeMenu}
//               >
//                 Courses
//               </ActiveLink>

//               <ActiveLink 
//                 href="/categories" 
//                 className="block"
//                 activeClassName="bg-primary/20 text-primary"
//                 inactiveClassName="text-foreground hover:bg-primary/10 hover:text-primary"
//                 onClick={closeMenu}
//               >
//                 Categories
//               </ActiveLink>

//               <ActiveLink 
//                 href="#" 
//                 className="block"
//                 activeClassName="bg-primary/20 text-primary"
//                 inactiveClassName="text-foreground hover:bg-primary/10 hover:text-primary"
//                 onClick={closeMenu}
//               >
//                 About
//               </ActiveLink>

//               {/* Mobile Auth Buttons */}
//               <div className="pt-2 flex flex-col gap-3">
//                 {authStatus.isAuthenticated && authStatus.user ? (
//                   <div className="space-y-2">
//                     <div className="text-center px-4 py-2 font-semibold rounded-lg bg-primary/10 text-primary">
//                       Welcome, {authStatus.user.name}
//                     </div>
//                     <Link
//                       href="/dashboard"
//                       className="block text-center px-4 py-2 font-semibold rounded-lg transition border border-primary text-primary hover:bg-primary/10"
//                       onClick={closeMenu}
//                     >
//                       Dashboard
//                     </Link>
//                     <Link
//                       href="/dashboard/profile"
//                       className="block text-center px-4 py-2 font-semibold rounded-lg transition border border-primary text-primary hover:bg-primary/10"
//                       onClick={closeMenu}
//                     >
//                       Settings
//                     </Link>
//                     <button
//                       onClick={handleMobileLogout}
//                       className="block text-center px-4 py-2 font-semibold rounded-lg transition border border-red-600 text-red-600 hover:bg-red-50"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     <ActiveLink 
//                       href="/login"
//                       className="block text-center px-4 py-2 font-semibold rounded-lg transition border"
//                       activeClassName="bg-primary/20 text-primary"
//                       inactiveClassName="text-primary hover:bg-primary/10"
//                       onClick={closeMenu}
//                     >
//                       Login
//                     </ActiveLink>

//                     <ActiveLink 
//                       href="/signup"
//                       className="block text-center px-4 py-2 font-semibold rounded-lg transition border"
//                       activeClassName="bg-primary text-primary-foreground"
//                       inactiveClassName="text-primary border hover:bg-primary/10"
//                       onClick={closeMenu}
//                     >
//                       Sign Up
//                     </ActiveLink>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }






































// // /src/components/layout/header.tsx

// 'use client';

// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { useState, useEffect } from 'react';
// import { Menu, X, Search } from 'lucide-react';
// import { ActiveLink } from '@/components/ui/active-link';
// import { UserProfileDropdown } from '@/components/layout/user-profile-dropdown';

// interface AuthStatus {
//   isAuthenticated: boolean;
//   user?: {
//     name: string;
//     email: string;
//     primaryRole: string;
//   };
// }

// export function Header() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [authStatus, setAuthStatus] = useState<AuthStatus>({ 
//     isAuthenticated: false 
//   });
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch('/api/auth/status', {
//           method: 'GET',
//           credentials: 'include',
//           headers: {
//             'Cache-Control': 'no-cache'
//           }
//         });
        
//         if (response.ok) {
//           const data = await response.json();
//           setAuthStatus(data);
//         } else {
//           setAuthStatus({ isAuthenticated: false });
//         }
//       } catch (error) {
//         console.error('Failed to check auth status:', error);
//         setAuthStatus({ isAuthenticated: false });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkAuthStatus();

//     // Set up periodic auth status checks
//     const interval = setInterval(checkAuthStatus, 30000); // Check every 30 seconds

//     return () => clearInterval(interval);
//   }, []);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const closeMenu = () => {
//     setIsMenuOpen(false);
//   };

//   const handleMobileLogout = async () => {
//     try {
//       console.log('Mobile logout initiated...');
//       const response = await fetch('/api/auth/logout', { 
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
      
//       if (response.ok) {
//         console.log('Mobile logout successful');
//         window.location.href = '/login';
//       } else {
//         console.error('Mobile logout failed');
//         // Fallback redirect
//         window.location.href = '/login';
//       }
//     } catch (error) {
//       console.error('Mobile logout error:', error);
//       // Last resort redirect
//       window.location.href = '/login';
//     } finally {
//       closeMenu();
//     }
//   };

//   // Show loading state briefly
//   if (isLoading) {
//     return (
//       <nav className="backdrop-blur-xl bg-white/30 border-b border-white/20 shadow-lg sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <Link href="/" className="flex items-center gap-2">
//               <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
//                 A
//               </div>
//               <span className="font-bold text-xl">AxioQuan</span>
//             </Link>
//             <div className="hidden md:flex items-center gap-4">
//               <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
//             </div>
//           </div>
//         </div>
//       </nav>
//     );
//   }

//   return (
//     <nav className="backdrop-blur-xl bg-white/30 border-b border-white/20 shadow-lg sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
          
//           {/* Logo - Now visible on all screen sizes */}
//           <Link href="/" className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
//               A
//             </div>
//             <span className="font-bold text-xl">AxioQuan</span>
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center gap-6">
//             <ActiveLink href="/">
//               Home
//             </ActiveLink>

//             <ActiveLink href="/courses">
//               Courses
//             </ActiveLink>

//             <ActiveLink href="/categories">
//               Categories
//             </ActiveLink>

//             <ActiveLink href="/about">
//               About
//             </ActiveLink>
//           </div>

//           {/* Right Actions */}
//           <div className="hidden md:flex items-center gap-4">
//             {/* Search Input - Commented out for future use */}
//             {/*
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="pl-10 pr-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition w-48"
//               />
//             </div>
//             */}

//             {authStatus.isAuthenticated && authStatus.user ? (
//               <UserProfileDropdown user={authStatus.user} />
//             ) : (
//               <>
//                 <ActiveLink 
//                   href="/login"
//                   className="px-4 py-2 font-semibold rounded-lg transition border border-transparent"
//                   activeClassName="bg-primary/20 text-primary"
//                   inactiveClassName="text-primary hover:bg-primary/10"
//                 >
//                   Login
//                 </ActiveLink>

//                 <ActiveLink 
//                   href="/signup"
//                   className="px-6 py-2 font-semibold rounded-lg transition border border-transparent"
//                   activeClassName="bg-primary text-primary-foreground"
//                   inactiveClassName="text-primary border hover:bg-primary/10"
//                 >
//                   Sign Up
//                 </ActiveLink>
//               </>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden flex items-center gap-2">
//             {/* Mobile Search Icon - Commented out for future use */}
//             {/*
//             <Button variant="ghost" size="icon" className="text-foreground">
//               <Search className="h-5 w-5" />
//             </Button>
//             */}
            
//             <Button 
//               variant="ghost" 
//               size="icon" 
//               onClick={toggleMenu}
//               className="text-foreground"
//             >
//               {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </Button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-white/20 shadow-lg">
//             <div className="px-4 py-4 space-y-4">
//               {/* Navigation Links */}
//               <ActiveLink 
//                 href="/" 
//                 className="block"
//                 activeClassName="bg-primary/20 text-primary"
//                 inactiveClassName="text-foreground hover:bg-primary/10 hover:text-primary"
//                 onClick={closeMenu}
//               >
//                 Home
//               </ActiveLink>

//               <ActiveLink 
//                 href="/courses" 
//                 className="block"
//                 activeClassName="bg-primary/20 text-primary"
//                 inactiveClassName="text-foreground hover:bg-primary/10 hover:text-primary"
//                 onClick={closeMenu}
//               >
//                 Courses
//               </ActiveLink>

//               <ActiveLink 
//                 href="/categories" 
//                 className="block"
//                 activeClassName="bg-primary/20 text-primary"
//                 inactiveClassName="text-foreground hover:bg-primary/10 hover:text-primary"
//                 onClick={closeMenu}
//               >
//                 Categories
//               </ActiveLink>

//               <ActiveLink 
//                 href="#" 
//                 className="block"
//                 activeClassName="bg-primary/20 text-primary"
//                 inactiveClassName="text-foreground hover:bg-primary/10 hover:text-primary"
//                 onClick={closeMenu}
//               >
//                 About
//               </ActiveLink>

//               {/* Mobile Auth Buttons */}
//               <div className="pt-2 flex flex-col gap-3">
//                 {authStatus.isAuthenticated && authStatus.user ? (
//                   <div className="space-y-2">
//                     <div className="text-center px-4 py-2 font-semibold rounded-lg bg-primary/10 text-primary">
//                       Welcome, {authStatus.user.name}
//                     </div>
//                     <Link
//                       href="/dashboard"
//                       className="block text-center px-4 py-2 font-semibold rounded-lg transition border border-primary text-primary hover:bg-primary/10"
//                       onClick={closeMenu}
//                     >
//                       Dashboard
//                     </Link>
//                     <Link
//                       href="/dashboard/profile"
//                       className="block text-center px-4 py-2 font-semibold rounded-lg transition border border-primary text-primary hover:bg-primary/10"
//                       onClick={closeMenu}
//                     >
//                       Settings
//                     </Link>
//                     <button
//                       onClick={handleMobileLogout}
//                       className="block text-center px-4 py-2 font-semibold rounded-lg transition border border-red-600 text-red-600 hover:bg-red-50"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     <ActiveLink 
//                       href="/login"
//                       className="block text-center px-4 py-2 font-semibold rounded-lg transition border"
//                       activeClassName="bg-primary/20 text-primary"
//                       inactiveClassName="text-primary hover:bg-primary/10"
//                       onClick={closeMenu}
//                     >
//                       Login
//                     </ActiveLink>

//                     <ActiveLink 
//                       href="/signup"
//                       className="block text-center px-4 py-2 font-semibold rounded-lg transition border"
//                       activeClassName="bg-primary text-primary-foreground"
//                       inactiveClassName="text-primary border hover:bg-primary/10"
//                       onClick={closeMenu}
//                     >
//                       Sign Up
//                     </ActiveLink>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }





































// 'use client';

// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { useState, useEffect } from 'react';
// import { Menu, X } from 'lucide-react';
// import { usePathname } from 'next/navigation';
// import { UserProfileDropdown } from '@/components/layout/user-profile-dropdown';

// interface AuthStatus {
//   isAuthenticated: boolean;
//   user?: {
//     name: string;
//     email: string;
//     primaryRole: string;
//   };
// }

// const navLinks = [
//   { href: '/',           label: 'Home' },
//   { href: '/courses',    label: 'Courses' },
//   { href: '/categories', label: 'Categories' },
//   { href: '/about',      label: 'About' },
// ];

// export function Header() {
//   const [isMenuOpen, setIsMenuOpen]   = useState(false);
//   const [scrolled, setScrolled]       = useState(false);
//   const [authStatus, setAuthStatus]   = useState<AuthStatus>({ isAuthenticated: false });
//   const [isLoading, setIsLoading]     = useState(true);
//   const pathname                       = usePathname();

//   // Scroll detection for nav shadow/blur enhancement
//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 12);
//     window.addEventListener('scroll', onScroll, { passive: true });
//     return () => window.removeEventListener('scroll', onScroll);
//   }, []);

//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch('/api/auth/status', {
//           method: 'GET',
//           credentials: 'include',
//           headers: { 'Cache-Control': 'no-cache' },
//         });
//         if (response.ok) {
//           const data = await response.json();
//           setAuthStatus(data);
//         } else {
//           setAuthStatus({ isAuthenticated: false });
//         }
//       } catch {
//         setAuthStatus({ isAuthenticated: false });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkAuthStatus();
//     const interval = setInterval(checkAuthStatus, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   const isActive = (href: string) =>
//     href === '/' ? pathname === '/' : pathname.startsWith(href);

//   const closeMenu = () => setIsMenuOpen(false);

//   const handleMobileLogout = async () => {
//     try {
//       const response = await fetch('/api/auth/logout', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//       });
//       if (response.ok || true) window.location.href = '/login';
//     } catch {
//       window.location.href = '/login';
//     } finally {
//       closeMenu();
//     }
//   };

//   // ── Loading skeleton ────────────────────────────────────────────────────────
//   if (isLoading) {
//     return (
//       <nav className="sticky top-0 z-50 h-16 border-b border-gray-200/60 bg-white/80 backdrop-blur-xl">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-lg bg-primary/20 animate-pulse" />
//             <div className="w-24 h-5 rounded bg-gray-200 animate-pulse" />
//           </div>
//           <div className="hidden md:flex gap-2">
//             {[1,2,3,4].map(i => (
//               <div key={i} className="w-16 h-5 rounded bg-gray-200 animate-pulse" />
//             ))}
//           </div>
//           <div className="w-20 h-8 rounded-full bg-gray-200 animate-pulse" />
//         </div>
//       </nav>
//     );
//   }

//   return (
//     <>
//       <nav
//         className="sticky top-0 z-50 transition-all duration-300"
//         style={{
//           background: scrolled
//             ? 'rgba(255,255,255,0.92)'
//             : 'rgba(255,255,255,0.80)',
//           backdropFilter: 'blur(20px)',
//           borderBottom: scrolled
//             ? '1px solid rgba(0,0,0,0.08)'
//             : '1px solid rgba(0,0,0,0.05)',
//           boxShadow: scrolled
//             ? '0 4px 24px rgba(0,0,0,0.06)'
//             : 'none',
//         }}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">

//             {/* Logo */}
//             <Link href="/" className="flex items-center gap-2.5 group">
//               <div
//                 className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm transition-transform duration-200 group-hover:scale-110"
//                 style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
//               >
//                 A
//               </div>
//               <span className="font-extrabold text-xl tracking-tight text-gray-900">
//                 AxioQuan
//               </span>
//             </Link>

//             {/* Desktop nav links */}
//             <div className="hidden md:flex items-center gap-1">
//               {navLinks.map(({ href, label }) => {
//                 const active = isActive(href);
//                 return (
//                   <Link
//                     key={href}
//                     href={href}
//                     className="relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 group"
//                     style={{
//                       color: active ? '#7c3aed' : '#374151',
//                       background: active ? 'rgba(124,58,237,0.08)' : 'transparent',
//                     }}
//                     onMouseEnter={e => {
//                       if (!active) {
//                         (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(124,58,237,0.06)';
//                         (e.currentTarget as HTMLAnchorElement).style.color = '#7c3aed';
//                       }
//                     }}
//                     onMouseLeave={e => {
//                       if (!active) {
//                         (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
//                         (e.currentTarget as HTMLAnchorElement).style.color = '#374151';
//                       }
//                     }}
//                   >
//                     {label}
//                     {/* Active underline pill */}
//                     {active && (
//                       <span
//                         className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300"
//                         style={{
//                           width: '60%',
//                           background: 'linear-gradient(90deg, #7c3aed, #4f46e5)',
//                         }}
//                       />
//                     )}
//                   </Link>
//                 );
//               })}
//             </div>

//             {/* Desktop right actions */}
//             <div className="hidden md:flex items-center gap-3">
//               {authStatus.isAuthenticated && authStatus.user ? (
//                 <UserProfileDropdown user={authStatus.user} />
//               ) : (
//                 <>
//                   <Link
//                     href="/login"
//                     className="px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200"
//                     style={{ color: '#7c3aed' }}
//                     onMouseEnter={e => {
//                       (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(124,58,237,0.08)';
//                     }}
//                     onMouseLeave={e => {
//                       (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
//                     }}
//                   >
//                     Log in
//                   </Link>
//                   <Link
//                     href="/signup"
//                     className="px-5 py-2 text-sm font-bold rounded-full text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
//                     style={{
//                       background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
//                       boxShadow: '0 4px 14px rgba(124,58,237,0.3)',
//                     }}
//                     onMouseEnter={e => {
//                       (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px rgba(124,58,237,0.45)';
//                     }}
//                     onMouseLeave={e => {
//                       (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 14px rgba(124,58,237,0.3)';
//                     }}
//                   >
//                     Get started
//                   </Link>
//                 </>
//               )}
//             </div>

//             {/* Mobile hamburger */}
//             <button
//               onClick={() => setIsMenuOpen(prev => !prev)}
//               className="md:hidden w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-200"
//               style={{ background: isMenuOpen ? 'rgba(124,58,237,0.08)' : 'transparent' }}
//             >
//               {isMenuOpen
//                 ? <X className="h-5 w-5 text-violet-700" />
//                 : <Menu className="h-5 w-5 text-gray-700" />
//               }
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile menu — slides down below nav */}
//       <div
//         className="md:hidden fixed left-0 right-0 z-40 transition-all duration-300 overflow-hidden"
//         style={{
//           top: '64px',
//           maxHeight: isMenuOpen ? '600px' : '0px',
//           opacity: isMenuOpen ? 1 : 0,
//           background: 'rgba(255,255,255,0.97)',
//           backdropFilter: 'blur(20px)',
//           borderBottom: isMenuOpen ? '1px solid rgba(0,0,0,0.08)' : 'none',
//           boxShadow: isMenuOpen ? '0 12px 40px rgba(0,0,0,0.1)' : 'none',
//         }}
//       >
//         <div className="px-4 py-5 space-y-1">

//           {/* Mobile nav links */}
//           {navLinks.map(({ href, label }) => {
//             const active = isActive(href);
//             return (
//               <Link
//                 key={href}
//                 href={href}
//                 onClick={closeMenu}
//                 className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
//                 style={{
//                   color: active ? '#7c3aed' : '#374151',
//                   background: active ? 'rgba(124,58,237,0.08)' : 'transparent',
//                 }}
//               >
//                 {label}
//                 {active && (
//                   <span
//                     className="w-1.5 h-1.5 rounded-full"
//                     style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
//                   />
//                 )}
//               </Link>
//             );
//           })}

//           {/* Mobile divider */}
//           <div className="h-px bg-gray-100 my-2" />

//           {/* Mobile auth */}
//           {authStatus.isAuthenticated && authStatus.user ? (
//             <div className="space-y-2 pt-1">
//               <div
//                 className="px-4 py-3 rounded-xl text-sm font-semibold text-center"
//                 style={{ background: 'rgba(124,58,237,0.06)', color: '#7c3aed' }}
//               >
//                 👋 &nbsp;{authStatus.user.name}
//               </div>
//               <Link
//                 href="/dashboard"
//                 onClick={closeMenu}
//                 className="block text-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-200"
//                 style={{ border: '1.5px solid rgba(124,58,237,0.3)', color: '#7c3aed' }}
//               >
//                 Dashboard
//               </Link>
//               <Link
//                 href="/dashboard/profile"
//                 onClick={closeMenu}
//                 className="block text-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-200"
//                 style={{ border: '1.5px solid rgba(124,58,237,0.3)', color: '#7c3aed' }}
//               >
//                 Settings
//               </Link>
//               <button
//                 onClick={handleMobileLogout}
//                 className="w-full text-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-200"
//                 style={{ border: '1.5px solid rgba(239,68,68,0.3)', color: '#dc2626' }}
//               >
//                 Log out
//               </button>
//             </div>
//           ) : (
//             <div className="flex flex-col gap-2 pt-1">
//               <Link
//                 href="/login"
//                 onClick={closeMenu}
//                 className="block text-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-200"
//                 style={{ border: '1.5px solid rgba(124,58,237,0.3)', color: '#7c3aed' }}
//               >
//                 Log in
//               </Link>
//               <Link
//                 href="/signup"
//                 onClick={closeMenu}
//                 className="block text-center px-4 py-3 rounded-xl text-sm font-bold text-white"
//                 style={{
//                   background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
//                   boxShadow: '0 4px 14px rgba(124,58,237,0.3)',
//                 }}
//               >
//                 Get started
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }
































'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { UserProfileDropdown } from '@/components/layout/user-profile-dropdown';

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
                <UserProfileDropdown user={authStatus.user} />
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200"
                    style={{ color: '#7c3aed' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(124,58,237,0.08)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                    }}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="px-5 py-2 text-sm font-bold rounded-full text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
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
                className="block text-center px-4 py-3 rounded-xl text-sm font-semibold"
                style={{ border: '1.5px solid rgba(124,58,237,0.3)', color: '#7c3aed' }}
              >
                Log in
              </Link>
              <Link href="/signup" onClick={closeMenu}
                className="block text-center px-4 py-3 rounded-xl text-sm font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  boxShadow : '0 4px 14px rgba(124,58,237,0.3)',
                }}
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}