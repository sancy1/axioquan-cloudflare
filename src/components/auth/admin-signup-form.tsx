
// // // /src/components/auth/admin-signup-form.tsx
// // # Signup form component

// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { toast } from 'sonner';
// import { signUpUser } from '@/lib/auth/actions';
// import { Eye, EyeOff } from 'lucide-react';

// export function AdminSignUpForm() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [showAdminKey, setShowAdminKey] = useState(false);
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     name: '',
//     adminKey: '',
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({ 
//       ...formData, 
//       [name]: value 
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       // Check admin key
//       const adminRegistrationKey = process.env.NEXT_PUBLIC_ADMIN_REGISTRATION_KEY || 'axioquan-admin-2024';
      
//       if (formData.adminKey !== adminRegistrationKey) {
//         toast.error('Invalid admin key', {
//           description: 'Please provide a valid admin registration key.',
//         });
//         setIsLoading(false);
//         return;
//       }

//       // Create user with admin role
//       const signUpResult = await signUpUser({
//         username: formData.username,
//         email: formData.email,
//         password: formData.password,
//         confirmPassword: formData.confirmPassword,
//         name: formData.name,
//         role: 'admin' // 👈 This ensures admin role assignment
//       });

//       if (signUpResult.success && signUpResult.user) {
//         toast.success('Admin account created successfully!', {
//           description: 'Your admin account has been created. Please login.',
//         });
        
//         // Redirect to login page after successful registration
//         setTimeout(() => {
//           router.push('/login');
//         }, 2000);
//       } else {
//         toast.error('Admin registration failed', {
//           description: signUpResult.errors?.[0] || 'Failed to create admin account',
//         });
//       }
//     } catch (error: any) {
//       console.error('❌ Admin registration error:', error);
//       toast.error('Registration error', {
//         description: error.message || 'An unexpected error occurred. Please try again.',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Card className="w-full max-w-md">
//       <CardHeader className="space-y-1">
//         <CardTitle className="text-2xl font-bold">Admin Registration</CardTitle>
//         <CardDescription>
//           Create an administrator account with full platform access.
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <label htmlFor="name" className="text-sm font-medium">
//               Full Name *
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
//               Username *
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
//               Email *
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
//               Password *
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
//           </div>

//           <div className="space-y-2">
//             <label htmlFor="confirmPassword" className="text-sm font-medium">
//               Confirm Password *
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

//           <div className="space-y-2">
//             <label htmlFor="adminKey" className="text-sm font-medium">
//               Admin Registration Key *
//             </label>
//             <div className="relative">
//               <Input
//                 id="adminKey"
//                 name="adminKey"
//                 type={showAdminKey ? "text" : "password"}
//                 placeholder="Enter admin registration key"
//                 value={formData.adminKey}
//                 onChange={handleChange}
//                 required
//                 disabled={isLoading}
//                 className="pr-10"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowAdminKey(!showAdminKey)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                 disabled={isLoading}
//               >
//                 {showAdminKey ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//             <p className="text-xs text-gray-500">
//               This key is required for admin account creation.
//             </p>
//           </div>

//           <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
//             {isLoading ? 'Creating Admin Account...' : 'Create Admin Account'}
//           </Button>
//         </form>

//         {/* REMOVED DUPLICATE LINK - Only keep one in the page component */}
//       </CardContent>
//     </Card>
//   );
// }


























// // /src/components/auth/admin-signup-form.tsx
// // # Admin signup form — dark/purple theme, mirrors login-form design

// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'sonner';
// import { signUpUser } from '@/lib/auth/actions';
// import { Eye, EyeOff } from 'lucide-react';

// export function AdminSignUpForm() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [showAdminKey, setShowAdminKey] = useState(false);
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     name: '',
//     adminKey: '',
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       // Validate admin key
//       const adminRegistrationKey =
//         process.env.NEXT_PUBLIC_ADMIN_REGISTRATION_KEY || 'axioquan-admin-2024';

//       if (formData.adminKey !== adminRegistrationKey) {
//         toast.error('Invalid admin key', {
//           description: 'Please provide a valid admin registration key.',
//         });
//         setIsLoading(false);
//         return;
//       }

//       // Create user with admin role
//       const signUpResult = await signUpUser({
//         username: formData.username,
//         email: formData.email,
//         password: formData.password,
//         confirmPassword: formData.confirmPassword,
//         name: formData.name,
//         role: 'admin',
//       });

//       if (signUpResult.success && signUpResult.user) {
//         toast.success('Admin account created successfully!', {
//           description: 'Your admin account has been created. Please login.',
//         });
//         setTimeout(() => {
//           router.push('/login');
//         }, 2000);
//       } else {
//         toast.error('Admin registration failed', {
//           description: signUpResult.errors?.[0] || 'Failed to create admin account',
//         });
//       }
//     } catch (error: any) {
//       console.error('❌ Admin registration error:', error);
//       toast.error('Registration error', {
//         description: error.message || 'An unexpected error occurred. Please try again.',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const inputClass =
//     'w-full bg-[#1a1a1a] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 disabled:opacity-50 transition-all';

//   const labelClass =
//     'text-gray-400 text-xs font-medium tracking-wide uppercase';

//   const eyeBtnClass =
//     'cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors disabled:opacity-50';

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">

//       {/* Full Name */}
//       <div className="space-y-1.5">
//         <label htmlFor="name" className={labelClass}>Full Name *</label>
//         <input
//           id="name"
//           name="name"
//           type="text"
//           placeholder="Enter your full name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//           disabled={isLoading}
//           className={inputClass}
//         />
//       </div>

//       {/* Username */}
//       <div className="space-y-1.5">
//         <label htmlFor="username" className={labelClass}>Username *</label>
//         <input
//           id="username"
//           name="username"
//           type="text"
//           placeholder="Choose a username"
//           value={formData.username}
//           onChange={handleChange}
//           required
//           disabled={isLoading}
//           className={inputClass}
//         />
//       </div>

//       {/* Email */}
//       <div className="space-y-1.5">
//         <label htmlFor="email" className={labelClass}>Email *</label>
//         <input
//           id="email"
//           name="email"
//           type="email"
//           placeholder="Enter your email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//           disabled={isLoading}
//           className={inputClass}
//         />
//       </div>

//       {/* Password */}
//       <div className="space-y-1.5">
//         <label htmlFor="password" className={labelClass}>Password *</label>
//         <div className="relative">
//           <input
//             id="password"
//             name="password"
//             type={showPassword ? 'text' : 'password'}
//             placeholder="Create a password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             disabled={isLoading}
//             className={`${inputClass} pr-11`}
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             disabled={isLoading}
//             className={eyeBtnClass}
//           >
//             {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//           </button>
//         </div>
//       </div>

//       {/* Confirm Password */}
//       <div className="space-y-1.5">
//         <label htmlFor="confirmPassword" className={labelClass}>Confirm Password *</label>
//         <div className="relative">
//           <input
//             id="confirmPassword"
//             name="confirmPassword"
//             type={showConfirmPassword ? 'text' : 'password'}
//             placeholder="Confirm your password"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             required
//             disabled={isLoading}
//             className={`${inputClass} pr-11`}
//           />
//           <button
//             type="button"
//             onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//             disabled={isLoading}
//             className={eyeBtnClass}
//           >
//             {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//           </button>
//         </div>
//       </div>

//       {/* Admin Key */}
//       <div className="space-y-1.5">
//         <label htmlFor="adminKey" className={labelClass}>Admin Registration Key *</label>
//         <div className="relative">
//           <input
//             id="adminKey"
//             name="adminKey"
//             type={showAdminKey ? 'text' : 'password'}
//             placeholder="Enter admin registration key"
//             value={formData.adminKey}
//             onChange={handleChange}
//             required
//             disabled={isLoading}
//             className={`${inputClass} pr-11`}
//           />
//           <button
//             type="button"
//             onClick={() => setShowAdminKey(!showAdminKey)}
//             disabled={isLoading}
//             className={eyeBtnClass}
//           >
//             {showAdminKey ? <EyeOff size={16} /> : <Eye size={16} />}
//           </button>
//         </div>
//         <p className="text-gray-600 text-xs pt-0.5">
//           This key is required for admin account creation.
//         </p>
//       </div>

//       {/* Submit */}
//       <button
//         type="submit"
//         disabled={isLoading}
//         className="cursor-pointer w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-all shadow-lg shadow-violet-900/40 hover:shadow-violet-800/50 mt-2"
//       >
//         {isLoading ? (
//           <span className="flex items-center justify-center gap-2">
//             <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
//             </svg>
//             Creating admin account...
//           </span>
//         ) : (
//           'Create Admin Account'
//         )}
//       </button>

//       {/* Links */}
//       <p className="text-center text-gray-600 text-xs pt-2">
//         Need a regular account?{' '}
//         <a href="/signup" className="cursor-pointer text-violet-400 hover:text-violet-300 font-medium transition-colors">
//           Sign up here
//         </a>
//       </p>

//     </form>
//   );
// }



























// /src/components/auth/admin-signup-form.tsx
// # Admin signup form — dark/purple theme, all logic preserved

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signUpUser } from '@/lib/auth/actions';
import { Eye, EyeOff } from 'lucide-react';

export function AdminSignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    adminKey: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const adminRegistrationKey =
        process.env.NEXT_PUBLIC_ADMIN_REGISTRATION_KEY || 'axioquan-admin-2024';

      if (formData.adminKey !== adminRegistrationKey) {
        toast.error('Invalid admin key', {
          description: 'Please provide a valid admin registration key.',
        });
        setIsLoading(false);
        return;
      }

      const signUpResult = await signUpUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        name: formData.name,
        role: 'admin',
      });

      if (signUpResult.success && signUpResult.user) {
        toast.success('Admin account created successfully!', {
          description: 'Your admin account has been created. Please login.',
        });
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        toast.error('Admin registration failed', {
          description: signUpResult.errors?.[0] || 'Failed to create admin account',
        });
      }
    } catch (error: any) {
      console.error('❌ Admin registration error:', error);
      toast.error('Registration error', {
        description: error.message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    'w-full bg-[#141414] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 disabled:opacity-50 transition-all';

  const labelClass = 'text-gray-400 text-xs font-medium tracking-wide uppercase';

  const eyeBtnClass =
    'cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors disabled:opacity-50';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Full Name */}
      <div className="space-y-1.5">
        <label htmlFor="name" className={labelClass}>Full Name *</label>
        <input
          id="name" name="name" type="text"
          placeholder="Enter your full name"
          value={formData.name} onChange={handleChange}
          required disabled={isLoading} className={inputClass}
        />
      </div>

      {/* Username */}
      <div className="space-y-1.5">
        <label htmlFor="username" className={labelClass}>Username *</label>
        <input
          id="username" name="username" type="text"
          placeholder="Choose a username"
          value={formData.username} onChange={handleChange}
          required disabled={isLoading} className={inputClass}
        />
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className={labelClass}>Email *</label>
        <input
          id="email" name="email" type="email"
          placeholder="Enter your email"
          value={formData.email} onChange={handleChange}
          required disabled={isLoading} className={inputClass}
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="password" className={labelClass}>Password *</label>
        <div className="relative">
          <input
            id="password" name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password"
            value={formData.password} onChange={handleChange}
            required disabled={isLoading} className={`${inputClass} pr-11`}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading} className={eyeBtnClass}>
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className={labelClass}>Confirm Password *</label>
        <div className="relative">
          <input
            id="confirmPassword" name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={formData.confirmPassword} onChange={handleChange}
            required disabled={isLoading} className={`${inputClass} pr-11`}
          />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading} className={eyeBtnClass}>
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Admin Key */}
      <div className="space-y-1.5">
        <label htmlFor="adminKey" className={labelClass}>Admin Registration Key *</label>
        <div className="relative">
          <input
            id="adminKey" name="adminKey"
            type={showAdminKey ? 'text' : 'password'}
            placeholder="Enter admin registration key"
            value={formData.adminKey} onChange={handleChange}
            required disabled={isLoading} className={`${inputClass} pr-11`}
          />
          <button type="button" onClick={() => setShowAdminKey(!showAdminKey)}
            disabled={isLoading} className={eyeBtnClass}>
            {showAdminKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <p className="text-gray-600 text-xs pt-0.5">
          This key is required for admin account creation.
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit" disabled={isLoading}
        className="cursor-pointer w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-all shadow-lg shadow-violet-900/40 hover:shadow-violet-800/50 mt-2"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Creating admin account...
          </span>
        ) : (
          'Create Admin Account'
        )}
      </button>

      {/* Bottom link */}
      <p className="text-center text-gray-600 text-xs pt-2">
        Need a regular account?{' '}
        <a href="/signup" className="cursor-pointer text-violet-400 hover:text-violet-300 font-medium transition-colors">
          Sign up here
        </a>
      </p>

    </form>
  );
}
