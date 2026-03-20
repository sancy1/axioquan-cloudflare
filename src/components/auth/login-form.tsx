
// // // /src/components/auth/login-form.tsx
// // # Login form component

// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { toast } from 'sonner';
// import { loginWithSession } from '@/lib/auth/actions';
// import { Eye, EyeOff } from 'lucide-react';

// export default function LoginForm() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       console.log('🔄 Attempting login...');
//       const result = await loginWithSession({
//         email: formData.email,
//         password: formData.password
//       });

//       console.log('📨 Login result:', result);

//       if (result.success && result.user) {
//         console.log('✅ Login successful for:', result.user.email);
//         toast.success('Welcome back!', {
//           description: 'You have successfully signed in.',
//         });
        
//         // Redirect to dashboard - session is stored in HTTP-only cookie
//         router.push('/dashboard');
//         router.refresh();
//       } else {
//         console.error('❌ Login failed:', result.message);
//         toast.error('Login failed', {
//           description: result.errors?.[0] || 'Invalid email or password.',
//         });
//       }
//     } catch (error) {
//       console.error('❌ Login form error:', error);
//       toast.error('Login error', {
//         description: 'An unexpected error occurred. Please try again.',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Card className="w-full max-w-md">
//       <CardHeader className="space-y-1">
//         <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
//         <CardDescription>
//           Enter your email and password to access your account
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <label htmlFor="email" className="text-sm font-medium">
//               Email
//             </label>
//             <Input
//               id="email"
//               name="email"
//               type="email"
//               placeholder="Enter your email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               disabled={isLoading}
//             />
//           </div>

//           <div className="space-y-2">
//             <div className="flex items-center justify-between">
//               <label htmlFor="password" className="text-sm font-medium">
//                 Password
//               </label>
//               <a
//                 href="/forgot-password"
//                 className="text-sm text-blue-600 hover:text-blue-500"
//               >
//                 Forgot password?
//               </a>
//             </div>
//             <div className="relative">
//               <Input
//                 id="password"
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 disabled={isLoading}
//                 className="pr-10"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                 disabled={isLoading}
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//           </div>

//           <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
//             {isLoading ? 'Signing in...' : 'Sign In'}
//           </Button>
//         </form>

//         <div className="mt-6 text-center text-sm">
//           Don't have an account?{' '}
//           <a href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
//             Sign up
//           </a>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

























// /src/components/auth/login-form.tsx
// # Login form component — dark/purple theme

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { loginWithSession } from '@/lib/auth/actions';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('🔄 Attempting login...');
      const result = await loginWithSession({
        email: formData.email,
        password: formData.password,
      });

      console.log('📨 Login result:', result);

      if (result.success && result.user) {
        console.log('✅ Login successful for:', result.user.email);
        toast.success('Welcome back!', {
          description: 'You have successfully signed in.',
        });
        router.push('/dashboard');
        router.refresh();
      } else {
        console.error('❌ Login failed:', result.message);
        toast.error('Login failed', {
          description: result.errors?.[0] || 'Invalid email or password.',
        });
      }
    } catch (error) {
      console.error('❌ Login form error:', error);
      toast.error('Login error', {
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-gray-400 text-xs font-medium tracking-wide uppercase">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@university.edu"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="w-full bg-[#1a1a1a] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 disabled:opacity-50 transition-all"
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="password" className="text-gray-400 text-xs font-medium tracking-wide uppercase">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Your password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full bg-[#1a1a1a] border border-white/8 rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 disabled:opacity-50 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            className="cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors disabled:opacity-50"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Forgot password */}
      <div className="flex justify-end">
        <a
          href="/forgot-password"
          className="text-violet-400 text-xs hover:text-violet-300 transition-colors"
        >
          Forgot password? <span className="font-semibold">Reset it</span>
        </a>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="cursor-pointer w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-all shadow-lg shadow-violet-900/40 hover:shadow-violet-800/50 mt-2"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Signing in...
          </span>
        ) : (
          'Sign in'
        )}
      </button>

      {/* Sign up link */}
      <p className="text-center text-gray-600 text-xs pt-2">
        Don&apos;t have an account?{' '}
        <a href="/signup" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
          Sign up free
        </a>
      </p>

    </form>
  );
}
