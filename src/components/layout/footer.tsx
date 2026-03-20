
// // File: /src/components/layout/footer.tsx
// 'use client';

// import Link from 'next/link';

// export function Footer() {
//   return (
//     <footer className="bg-foreground text-primary-foreground">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid md:grid-cols-4 gap-8 mb-8">
//           {/* Brand */}
//           <div>
//             <h3 className="font-bold text-lg mb-4">AxioQuan</h3>
//             <p className="text-sm opacity-80">Empower your learning journey with world-class courses.</p>

//            <Link 
//               href="/admin-signup" 
//               className="inline-flex items-center px-3 py-1 border border-gray-700 text-xs font-medium rounded-md text-gray-400 bg-gray-900 hover:bg-gray-800 hover:text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-700 transition-colors mt-6"
//             >
//               Admin Access
//           </Link>
//           </div>

//           {/* Product */}
//           <div>
//             <h4 className="font-bold mb-4">Product</h4>
//             <ul className="space-y-2 text-sm opacity-80">
//               <li><Link href="/courses" className="hover:opacity-100 transition">Courses</Link></li>
//               <li><Link href="/categories" className="hover:opacity-100 transition">Categories</Link></li>
//               <li><Link href="#" className="hover:opacity-100 transition">Certificates</Link></li>
//             </ul>
//           </div>

//           {/* Company */}
//           <div>
//             <h4 className="font-bold mb-4">Company</h4>
//             <ul className="space-y-2 text-sm opacity-80">
//               <li><Link href="#" className="hover:opacity-100 transition">About</Link></li>
//               <li><Link href="#" className="hover:opacity-100 transition">Blog</Link></li>
//               <li><Link href="#" className="hover:opacity-100 transition">Careers</Link></li>
//             </ul>
//           </div>

//           {/* Social */}
//           <div>
//             <h4 className="font-bold mb-4">Follow Us</h4>
//             <ul className="space-y-2 text-sm opacity-80">
//               <li><Link href="#" className="hover:opacity-100 transition">Twitter</Link></li>
//               <li><Link href="#" className="hover:opacity-100 transition">LinkedIn</Link></li>
//               <li><Link href="#" className="hover:opacity-100 transition">Facebook</Link></li>
//             </ul>
//           </div>
//         </div>

//         <div className="border-t border-white/20 pt-8 text-center text-sm opacity-80">
//           <p>&copy; {new Date().getFullYear()} AxioQuan. All rights reserved.</p>
//         </div>
//       </div>
//     </footer>
//   );
// }


























// File: /src/components/layout/footer.tsx
'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0d0d0d]">

      {/* Violet grid — same as login/signup form panel */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139,92,246,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Soft glow orbs */}
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-violet-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-48 h-48 bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg text-white mb-4">AxioQuan</h3>
            <p className="text-sm text-gray-400">Empower your learning journey with world-class courses.</p>
            <Link
              href="/admin-signup"
              className="inline-flex items-center px-3 py-1 border border-gray-700 text-xs font-medium rounded-md text-gray-400 bg-gray-900 hover:bg-gray-800 hover:text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-700 transition-colors mt-6"
            >
              Admin Access
            </Link>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/courses" className="hover:text-violet-400 transition-colors">Courses</Link></li>
              <li><Link href="/categories" className="hover:text-violet-400 transition-colors">Categories</Link></li>
              <li><Link href="#" className="hover:text-violet-400 transition-colors">Certificates</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-violet-400 transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-violet-400 transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-violet-400 transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-white mb-4">Follow Us</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-violet-400 transition-colors">Twitter</Link></li>
              <li><Link href="#" className="hover:text-violet-400 transition-colors">LinkedIn</Link></li>
              <li><Link href="#" className="hover:text-violet-400 transition-colors">Facebook</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} AxioQuan. All rights reserved.</p>
        </div>
      </div>

    </footer>
  );
}
