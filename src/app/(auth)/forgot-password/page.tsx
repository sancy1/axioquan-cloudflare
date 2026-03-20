
// // // /src/app/(auth)/forgot-password/page.tsx

// import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import Link from 'next/link';
// import { Header } from '@/components/layout/header';
// import { Footer } from '@/components/layout/footer';

// export default function ForgotPasswordPage() {
//   return (
//     <div className="min-h-screen bg-background flex flex-col">
//       <Header />
      
//       {/* Main Content */}
//       <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
//         {/* Admin Access Button - Positioned absolutely to avoid header overlap */}
//         <div className="absolute top-4 right-4">
//           <Link 
//             href="/admin-signup" 
//             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
//           >
//             Admin Access
//           </Link>
//         </div>
        
//         <div className="max-w-md w-full space-y-8">
//           <Card>
//             <CardHeader className="space-y-1">
//               <CardTitle className="text-2xl">Reset your password</CardTitle>
//               <CardDescription>
//                 Enter your email address and we'll send you a link to reset your password
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ForgotPasswordForm />
//               <div className="mt-4 text-center text-sm">
//                 <Link href="/login" className="text-blue-600 hover:underline">
//                   Back to login
//                 </Link>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }




























// /src/app/(auth)/forgot-password/page.tsx
// # Forgot password page — dark/purple theme, grid background, centered card

import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Header />

      {/* ── Full page grid background ─────────────────────────────────────── */}
      <div className="flex-1 relative flex items-center justify-center px-5 sm:px-8 py-12 overflow-hidden bg-[#0d0d0d]">

        {/* Violet grid pattern — full background */}
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

        {/* Soft violet glow behind card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-900/15 rounded-full blur-3xl pointer-events-none" />

        {/* ── Centered dark card ──────────────────────────────────────────── */}
        <div className="relative z-10 w-full max-w-sm">
          <div className="bg-[#141414] border border-white/8 rounded-2xl p-8 shadow-2xl">

            {/* Mail icon */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-violet-600/15 border border-violet-500/25 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,0.9)" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-7">
              <h1 className="text-white text-2xl font-bold mb-1">Reset your password</h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                Enter your email and we'll send you a link to reset your password
              </p>
            </div>

            {/* Form — all logic/validation preserved */}
            <ForgotPasswordForm />

            {/* Back to login */}
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="cursor-pointer inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-xs transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 12H5M12 5l-7 7 7 7"/>
                </svg>
                Back to login
              </Link>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
