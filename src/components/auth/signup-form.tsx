
// // // /src/components/auth/signup-form.tsx

// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { toast } from 'sonner';
// import { signUpUser } from '@/lib/auth/actions';
// import { Eye, EyeOff } from 'lucide-react';

// export default function SignUpForm() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     name: '',
//   });
//   const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     // Clear password errors when user types
//     if (name === 'password') {
//       setPasswordErrors([]);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setPasswordErrors([]);

//     try {
//       const result = await signUpUser(formData);

//       if (result.success) {
//         toast.success('Account created!', {
//           description: 'Your account has been created successfully.',
//         });
//         // Redirect to login page
//         router.push('/login');
//       } else {
//         if (result.errors) {
//           result.errors.forEach(error => {
//             toast.error('Registration failed', {
//               description: error,
//             });
//           });
//           // Set password errors for display
//           if (result.errors.some(error => error.includes('Password'))) {
//             setPasswordErrors(result.errors);
//           }
//         }
//       }
//     } catch (error) {
//       toast.error('Registration error', {
//         description: 'An unexpected error occurred. Please try again.',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Card className="w-full max-w-md">
//       <CardHeader className="space-y-1">
//         <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
//         <CardDescription>
//           Enter your information to create your account
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <label htmlFor="name" className="text-sm font-medium">
//               Full Name
//             </label>
//             <Input
//               id="name"
//               name="name"
//               type="text"
//               placeholder="Enter your full name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               disabled={isLoading}
//             />
//           </div>

//           <div className="space-y-2">
//             <label htmlFor="username" className="text-sm font-medium">
//               Username
//             </label>
//             <Input
//               id="username"
//               name="username"
//               type="text"
//               placeholder="Choose a username"
//               value={formData.username}
//               onChange={handleChange}
//               required
//               disabled={isLoading}
//             />
//           </div>

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
//             <label htmlFor="password" className="text-sm font-medium">
//               Password
//             </label>
//             <div className="relative">
//               <Input
//                 id="password"
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Create a password"
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
//             {passwordErrors.length > 0 && (
//               <div className="text-sm text-red-600 space-y-1">
//                 {passwordErrors.map((error, index) => (
//                   <div key={index}>• {error}</div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="space-y-2">
//             <label htmlFor="confirmPassword" className="text-sm font-medium">
//               Confirm Password
//             </label>
//             <div className="relative">
//               <Input
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 type={showConfirmPassword ? "text" : "password"}
//                 placeholder="Confirm your password"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 required
//                 disabled={isLoading}
//                 className="pr-10"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                 disabled={isLoading}
//               >
//                 {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//           </div>

//           <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
//             {isLoading ? 'Creating Account...' : 'Create Account'}
//           </Button>
//         </form>

//         <div className="mt-6 text-center text-sm">
//           Already have an account?{' '}
//           <a href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
//             Sign in
//           </a>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
































// /src/components/auth/signup-form.tsx
// # Signup form component — dark/purple theme, mirrors login-form design

'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signUpUser } from '@/lib/auth/actions';
import { Eye, EyeOff } from 'lucide-react';
import SocialButtons from './social-buttons';

export default function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear password errors when user types in password field
    if (name === 'password') {
      setPasswordErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordErrors([]);

    try {
      const result = await signUpUser(formData);

      if (result.success) {
        toast.success('Account created!', {
          description: 'Your account has been created successfully.',
        });
        router.push('/login');
      } else {
        if (result.errors) {
          result.errors.forEach((error) => {
            toast.error('Registration failed', { description: error });
          });
          if (result.errors.some((error) => error.includes('Password'))) {
            setPasswordErrors(result.errors);
          }
        }
      }
    } catch (error) {
      toast.error('Registration error', {
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Full Name */}
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-gray-400 text-xs font-medium tracking-wide uppercase">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="w-full bg-[#1a1a1a] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 disabled:opacity-50 transition-all"
        />
      </div>

      {/* Username */}
      <div className="space-y-1.5">
        <label htmlFor="username" className="text-gray-400 text-xs font-medium tracking-wide uppercase">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="Choose a username"
          value={formData.username}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="w-full bg-[#1a1a1a] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 disabled:opacity-50 transition-all"
        />
      </div>

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
            placeholder="Create a password"
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

        {/* Password validation errors */}
        {passwordErrors.length > 0 && (
          <div className="space-y-1 pt-1">
            {passwordErrors.map((error, index) => (
              <p key={index} className="text-red-400 text-xs flex items-start gap-1.5">
                <span className="mt-0.5 shrink-0">•</span>
                {error}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className="text-gray-400 text-xs font-medium tracking-wide uppercase">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full bg-[#1a1a1a] border border-white/8 rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 disabled:opacity-50 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
            className="cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors disabled:opacity-50"
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
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
            Creating account...
          </span>
        ) : (
          'Create account'
        )}
      </button>

      {/* Social sign-up */}
      <Suspense fallback={null}>
        <SocialButtons mode="signup" />
      </Suspense>

      {/* Sign in link */}
      <p className="text-center text-gray-600 text-xs pt-2">
        Already have an account?{' '}
        <a href="/login" className="cursor-pointer text-violet-400 hover:text-violet-300 font-medium transition-colors">
          Sign in
        </a>
      </p>

    </form>
  );
}
