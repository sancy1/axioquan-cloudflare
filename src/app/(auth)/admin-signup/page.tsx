

// // // /src/app/(auth)/admin-signup/page.tsx

// import { AdminSignUpForm } from '@/components/auth/admin-signup-form';
// import { Header } from '@/components/layout/header';
// import { Footer } from '@/components/layout/footer';
// import Link from 'next/link';

// export default function AdminSignUpPage() {
//   return (
//     <div className="min-h-screen bg-background flex flex-col">
//       <Header />
      
//       {/* Main Content */}
//       <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md w-full space-y-8">
//           <div>
//             <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//               Admin Registration
//             </h2>
//             <p className="mt-2 text-center text-sm text-gray-600">
//               Create an administrator account with full platform access
//             </p>
//           </div>
//           <AdminSignUpForm />
          
//           {/* Single Regular Signup Link - No duplicate */}
//           <div className="text-center">
//             <Link 
//               href="/signup" 
//               className="text-sm text-blue-600 hover:text-blue-500 font-medium"
//             >
//               Need a regular user account?
//             </Link>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }



























// // /src/app/(auth)/admin-signup/page.tsx
// // # Admin registration page — dark/authoritative design

// import { AdminSignUpForm } from '@/components/auth/admin-signup-form';
// import Link from 'next/link';
// import { Header } from '@/components/layout/header';
// import { Footer } from '@/components/layout/footer';

// export default function AdminSignUpPage() {
//   return (
//     <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
//       <Header />

//       {/* ── Main Content ─────────────────────────────────────────────────── */}
//       <div className="flex-1 flex flex-col lg:flex-row">

//         {/* ── LEFT / TOP PANEL — Admin branding ─────────────────────────── */}
//         <div className="relative w-full lg:w-1/2 h-72 sm:h-80 md:h-96 lg:h-auto overflow-hidden flex flex-col bg-[#0d0d0d]">

//           {/* Geometric dark background instead of photo */}
//           <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f1a] via-[#0d0d0d] to-[#0a0a12]" />

//           {/* Subtle violet grid pattern */}
//           <div
//             className="absolute inset-0 opacity-10"
//             style={{
//               backgroundImage: `
//                 linear-gradient(rgba(139,92,246,0.4) 1px, transparent 1px),
//                 linear-gradient(90deg, rgba(139,92,246,0.4) 1px, transparent 1px)
//               `,
//               backgroundSize: '48px 48px',
//             }}
//           />

//           {/* Glowing orbs */}
//           <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
//           <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl" />
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-900/20 rounded-full blur-3xl" />

//           {/* Content */}
//           <div className="relative z-10 mt-auto p-6 sm:p-8 lg:p-10 lg:pb-12">
//             <div className="max-w-sm">

//               {/* Admin badge */}
//               <div className="inline-flex items-center gap-2 bg-violet-600/15 border border-violet-500/25 rounded-full px-3 py-1 mb-5">
//                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
//                   <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z" fill="rgba(167,139,250,0.9)"/>
//                 </svg>
//                 <span className="text-violet-300 text-xs font-medium tracking-wide uppercase">
//                   Administrator Access
//                 </span>
//               </div>

//               {/* Headline */}
//               <h2 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold leading-tight mb-3 lg:mb-4">
//                 Platform control.<br />
//                 <span className="text-violet-400">Built for admins.</span>
//               </h2>

//               {/* Subtext */}
//               <p className="hidden sm:block text-gray-400 text-sm leading-relaxed mb-6 lg:mb-8">
//                 Admin accounts have full access to manage users, courses, content, and platform settings. A valid registration key is required.
//               </p>

//               {/* Access privileges list */}
//               <div className="hidden sm:flex flex-col gap-2.5 mb-6 lg:mb-8">
//                 {[
//                   'Manage all users & roles',
//                   'Create & publish courses',
//                   'Access platform analytics',
//                   'Configure system settings',
//                 ].map((item) => (
//                   <div key={item} className="flex items-center gap-2.5">
//                     <div className="w-4 h-4 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0">
//                       <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,1)" strokeWidth="3">
//                         <path d="M20 6L9 17l-5-5"/>
//                       </svg>
//                     </div>
//                     <span className="text-gray-400 text-xs">{item}</span>
//                   </div>
//                 ))}
//               </div>

//               {/* Regular account CTA */}
//               <div className="flex items-center gap-3">
//                 <Link
//                   href="/signup"
//                   className="cursor-pointer inline-flex items-center gap-2 bg-white/8 border border-white/10 text-gray-300 font-medium text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-white/12 hover:text-white transition-colors"
//                 >
//                   Regular account
//                   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                     <path d="M5 12h14M12 5l7 7-7 7"/>
//                   </svg>
//                 </Link>
//                 <span className="text-gray-600 text-xs hidden sm:inline">Not an admin?</span>
//               </div>

//             </div>
//           </div>
//         </div>

//         {/* ── RIGHT / BOTTOM PANEL — Admin Form ─────────────────────────── */}
//         <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-5 sm:px-8 py-10 lg:py-12 bg-[#0d0d0d]">

//           <div className="w-full max-w-sm">

//             {/* Toggle — Admin Registration is active */}
//             <div className="flex bg-[#1a1a1a] rounded-full p-1 mb-7 border border-white/5">
//               <Link
//                 href="/login"
//                 className="cursor-pointer flex-1 py-2 rounded-full text-gray-400 text-sm font-medium text-center hover:text-white transition-colors"
//               >
//                 Sign in
//               </Link>
//               <button className="flex-1 py-2 rounded-full bg-violet-600 text-white text-sm font-semibold shadow-lg shadow-violet-900/40 cursor-default">
//                 Admin Register
//               </button>
//             </div>

//             {/* Heading */}
//             <div className="mb-6">
//               <h1 className="text-white text-2xl sm:text-3xl font-bold mb-1">Admin Registration</h1>
//               <p className="text-gray-500 text-sm">Create an administrator account</p>
//             </div>

//             {/* Working admin signup form — all logic/validation untouched */}
//             <AdminSignUpForm />

//           </div>
//         </div>

//       </div>

//       <Footer />
//     </div>
//   );
// }



























// // /src/app/(auth)/admin-signup/page.tsx
// // # Admin registration page

// import { AdminSignUpForm } from '@/components/auth/admin-signup-form';
// import Link from 'next/link';
// import { Header } from '@/components/layout/header';
// import { Footer } from '@/components/layout/footer';

// export default function AdminSignUpPage() {
//   return (
//     <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
//       <Header />

//       {/* ── Main Content ─────────────────────────────────────────────────── */}
//       <div className="flex-1 flex flex-col lg:flex-row">

//         {/* ── LEFT / TOP PANEL — admin.jpg + marketing ──────────────────── */}
//         <div className="relative w-full lg:w-1/2 h-72 sm:h-80 md:h-96 lg:h-auto overflow-hidden flex flex-col">

//           {/* admin.jpg background */}
//           <div
//             className="absolute inset-0 bg-cover bg-center"
//             style={{ backgroundImage: "url('/images/admin.jpg')" }}
//           />

//           {/* Darker overlay layers for text legibility */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/30" />
//           <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/35" />
//           <div className="absolute inset-0 bg-black/25" />

//           {/* Marketing copy */}
//           <div className="relative z-10 mt-auto p-6 sm:p-8 lg:p-10 lg:pb-12">
//             <div className="max-w-sm">

//               {/* Admin badge */}
//               <div className="inline-flex items-center gap-2 bg-violet-600/20 border border-violet-500/30 rounded-full px-3 py-1 mb-4">
//                 <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
//                   <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z" fill="rgba(167,139,250,0.9)"/>
//                 </svg>
//                 <span className="text-violet-300 text-xs font-medium tracking-wide uppercase">
//                   Administrator Access
//                 </span>
//               </div>

//               {/* Headline */}
//               <h2 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold leading-tight mb-2 sm:mb-3 lg:mb-4">
//                 Platform control.<br />
//                 <span className="text-violet-400">Built for admins.</span>
//               </h2>

//               {/* Subtext — hidden on mobile */}
//               <p className="hidden sm:block text-gray-300 text-sm leading-relaxed mb-5 lg:mb-7">
//                 Admin accounts have full access to manage users, courses, content,
//                 and platform settings. A valid registration key is required.
//               </p>

//               {/* Privileges list — hidden on mobile */}
//               <div className="hidden sm:flex flex-col gap-2.5 mb-6 lg:mb-8">
//                 {[
//                   'Manage all users & roles',
//                   'Create & publish courses',
//                   'Access platform analytics',
//                   'Configure system settings',
//                 ].map((item) => (
//                   <div key={item} className="flex items-center gap-2.5">
//                     <div className="w-4 h-4 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0">
//                       <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,1)" strokeWidth="3">
//                         <path d="M20 6L9 17l-5-5"/>
//                       </svg>
//                     </div>
//                     <span className="text-gray-300 text-xs">{item}</span>
//                   </div>
//                 ))}
//               </div>

//               {/* Regular account CTA */}
//               <div className="flex items-center gap-3 sm:gap-4">
//                 <Link
//                   href="/signup"
//                   className="cursor-pointer inline-flex items-center gap-2 bg-white text-gray-900 font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
//                 >
//                   Regular account
//                   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                     <path d="M5 12h14M12 5l7 7-7 7"/>
//                   </svg>
//                 </Link>
//                 <span className="text-gray-400 text-xs hidden sm:inline">Not an admin?</span>
//               </div>

//             </div>
//           </div>
//         </div>

//         {/* ── RIGHT / BOTTOM PANEL — Form with grid lines ───────────────── */}
//         <div className="relative w-full lg:w-1/2 flex flex-col items-center justify-center px-5 sm:px-8 py-10 lg:py-12 bg-[#0d0d0d] overflow-hidden">

//           {/* Subtle violet grid pattern on form side */}
//           <div
//             className="absolute inset-0 opacity-[0.04]"
//             style={{
//               backgroundImage: `
//                 linear-gradient(rgba(139,92,246,1) 1px, transparent 1px),
//                 linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)
//               `,
//               backgroundSize: '48px 48px',
//             }}
//           />
//           {/* Soft glow to blend grid into background */}
//           <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-900/10 rounded-full blur-3xl pointer-events-none" />

//           <div className="relative z-10 w-full max-w-sm">

//             {/* Sign in / Admin Register pill toggle */}
//             <div className="flex bg-[#1a1a1a] rounded-full p-1 mb-7 border border-white/5">
//               <Link
//                 href="/login"
//                 className="cursor-pointer flex-1 py-2 rounded-full text-gray-400 text-sm font-medium text-center hover:text-white transition-colors"
//               >
//                 Sign in
//               </Link>
//               <button className="flex-1 py-2 rounded-full bg-violet-600 text-white text-sm font-semibold shadow-lg shadow-violet-900/40 cursor-default">
//                 Admin Register
//               </button>
//             </div>

//             {/* Heading */}
//             <div className="mb-6">
//               <h1 className="text-white text-2xl sm:text-3xl font-bold mb-1">Admin Registration</h1>
//               <p className="text-gray-500 text-sm">Create an administrator account</p>
//             </div>

//             {/* Working admin signup form */}
//             <AdminSignUpForm />

//           </div>
//         </div>

//       </div>

//       <Footer />
//     </div>
//   );
// }


























// /src/app/(auth)/admin-signup/page.tsx
// # Admin registration page

import { AdminSignUpForm } from '@/components/auth/admin-signup-form';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function AdminSignUpPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Header />

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row">

        {/* ── LEFT / TOP PANEL — admin.jpg + marketing ──────────────────── */}
        <div className="relative w-full lg:w-1/2 h-72 sm:h-80 md:h-96 lg:h-auto overflow-hidden flex flex-col">

          {/* admin.jpg background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/admin.jpg')" }}
          />

          {/* Darker overlay layers for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/35" />
          <div className="absolute inset-0 bg-black/25" />

          {/* Marketing copy — pushed up from the very bottom */}
          <div className="relative z-10 flex flex-col justify-end flex-1 p-6 sm:p-8 lg:p-10 pb-16 sm:pb-20 lg:pb-24">
            <div className="max-w-sm">

              {/* Admin badge */}
              <div className="inline-flex items-center gap-2 bg-violet-600/20 border border-violet-500/30 rounded-full px-3 py-1 mb-4">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z" fill="rgba(167,139,250,0.9)"/>
                </svg>
                <span className="text-violet-300 text-xs font-medium tracking-wide uppercase">
                  Administrator Access
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold leading-tight mb-2 sm:mb-3 lg:mb-4">
                Platform control.<br />
                <span className="text-violet-400">Built for admins.</span>
              </h2>

              {/* Subtext — hidden on mobile */}
              <p className="hidden sm:block text-gray-300 text-sm leading-relaxed mb-5 lg:mb-7">
                Admin accounts have full access to manage users, courses, content,
                and platform settings. A valid registration key is required.
              </p>

              {/* Privileges list — hidden on mobile */}
              <div className="hidden sm:flex flex-col gap-2.5 mb-6 lg:mb-8">
                {[
                  'Manage all users & roles',
                  'Create & publish courses',
                  'Access platform analytics',
                  'Configure system settings',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,1)" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    </div>
                    <span className="text-gray-300 text-xs">{item}</span>
                  </div>
                ))}
              </div>

              {/* Regular account CTA */}
              <div className="flex items-center gap-3 sm:gap-4">
                <Link
                  href="/signup"
                  className="cursor-pointer inline-flex items-center gap-2 bg-white text-gray-900 font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Regular account
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
                <span className="text-gray-400 text-xs hidden sm:inline">Not an admin?</span>
              </div>

            </div>
          </div>
        </div>

        {/* ── RIGHT / BOTTOM PANEL — Form with grid lines ───────────────── */}
        <div className="relative w-full lg:w-1/2 flex flex-col items-center justify-center px-5 sm:px-8 py-10 lg:py-12 bg-[#0d0d0d] overflow-hidden">

          {/* Subtle violet grid pattern */}
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

            {/* Pill toggle */}
            <div className="flex bg-[#1a1a1a] rounded-full p-1 mb-7 border border-white/5">
              <Link
                href="/login"
                className="cursor-pointer flex-1 py-2 rounded-full text-gray-400 text-sm font-medium text-center hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <button className="flex-1 py-2 rounded-full bg-violet-600 text-white text-sm font-semibold shadow-lg shadow-violet-900/40 cursor-default">
                Admin Register
              </button>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-white text-2xl sm:text-3xl font-bold mb-1">Admin Registration</h1>
              <p className="text-gray-500 text-sm">Create an administrator account</p>
            </div>

            <AdminSignUpForm />

          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
