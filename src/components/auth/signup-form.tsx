
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
// # Signup form — dark/purple theme, 2-step: registration → email OTP verification

'use client';

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signUpUser, sendSignupVerificationOTP, verifySignupOTPAndCreateSession } from '@/lib/auth/actions';
import { Eye, EyeOff } from 'lucide-react';
import SocialButtons from './social-buttons';

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputClass =
  'w-full bg-[#1a1a1a] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 disabled:opacity-50 transition-all';
const labelClass = 'text-gray-400 text-xs font-medium tracking-wide uppercase';
const submitBtnClass =
  'cursor-pointer w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-all shadow-lg shadow-violet-900/40 hover:shadow-violet-800/50 mt-2';

function Spinner() {
  return (
    <span className="flex items-center justify-center gap-2">
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SignUpForm() {
  const router = useRouter();

  // ── Shared state ──────────────────────────────────────────────────────────
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [isLoading, setIsLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  // ── Step 1: registration state ────────────────────────────────────────────
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  // ── Step 2: OTP state ─────────────────────────────────────────────────────
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  // ── Step 1 handler ────────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') setPasswordErrors([]);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordErrors([]);

    try {
      // 1. Create account
      const result = await signUpUser(formData);

      if (!result.success) {
        if (result.errors) {
          result.errors.forEach((err) => toast.error('Registration failed', { description: err }));
          if (result.errors.some((err) => err.includes('Password'))) setPasswordErrors(result.errors);
        }
        return;
      }

      // 2. Send email verification OTP
      setRegisteredEmail(formData.email);
      await sendSignupVerificationOTP(formData.email);

      toast.success('Account created!', { description: 'Check your email for the verification code.' });
      setStep('verify');
    } catch {
      toast.error('Registration error', { description: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 2 handler ────────────────────────────────────────────────────────
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setOtpError('');

    if (otp.length !== 6) {
      setOtpError('Please enter the 6-digit code.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await verifySignupOTPAndCreateSession(registeredEmail, otp);

      if (result.success) {
        toast.success('Welcome!', { description: 'Your email has been verified.' });
        router.push('/dashboard');
        router.refresh();
      } else {
        setOtpError(result.errors?.[0] ?? result.message);
      }
    } catch {
      setOtpError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setOtpError('');
    try {
      await sendSignupVerificationOTP(registeredEmail);
      toast.success('Code resent', { description: 'A new verification code has been sent.' });
    } catch {
      toast.error('Failed to resend code', { description: 'Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 2 render: OTP verification ───────────────────────────────────────
  if (step === 'verify') {
    return (
      <form onSubmit={handleVerify} className="space-y-5">

        {/* Instruction */}
        <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 px-4 py-3">
          <p className="text-violet-300 text-sm font-medium">Verify your email</p>
          <p className="text-gray-400 text-xs mt-1">
            We sent a 6-digit code to <span className="text-white font-medium">{registeredEmail}</span>.
            Enter it below to activate your account.
          </p>
        </div>

        {/* OTP input */}
        <div className="space-y-1.5">
          <label htmlFor="otp" className={labelClass}>Verification code</label>
          <input
            id="otp"
            type="text"
            inputMode="numeric"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setOtpError(''); }}
            disabled={isLoading}
            className={inputClass}
            autoComplete="one-time-code"
            maxLength={6}
          />
          {otpError && (
            <p className="text-red-400 text-xs flex items-center gap-1.5"><span>•</span>{otpError}</p>
          )}
        </div>

        {/* Bypass hint */}
        <p className="text-gray-600 text-xs">
          Didn&apos;t receive the email?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={isLoading}
            className="cursor-pointer text-violet-400 hover:text-violet-300 transition-colors disabled:opacity-50"
          >
            Resend code
          </button>
          {' '}or use the bypass code{' '}
          <span className="text-gray-400 font-mono">029780</span> to verify instantly.
        </p>

        {/* Verify button */}
        <button type="submit" disabled={isLoading} className={submitBtnClass}>
          {isLoading ? <Spinner /> : 'Verify & continue'}
        </button>

        {/* Back link */}
        <p className="text-center text-gray-600 text-xs pt-1">
          Wrong email?{' '}
          <button
            type="button"
            onClick={() => { setStep('register'); setOtp(''); setOtpError(''); }}
            className="cursor-pointer text-violet-400 hover:text-violet-300 font-medium transition-colors"
          >
            Go back
          </button>
        </p>

      </form>
    );
  }

  // ── Step 1 render: registration form ──────────────────────────────────────
  return (
    <form onSubmit={handleRegister} className="space-y-4">

      {/* Full Name */}
      <div className="space-y-1.5">
        <label htmlFor="name" className={labelClass}>Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isLoading}
          className={inputClass}
        />
      </div>

      {/* Username */}
      <div className="space-y-1.5">
        <label htmlFor="username" className={labelClass}>Username</label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="e.g. john_doe, alex123, user-42"
          value={formData.username}
          onChange={handleChange}
          required
          disabled={isLoading}
          className={inputClass}
          autoComplete="username"
          spellCheck={false}
        />
        {/* Username rules */}
        <div className="rounded-lg bg-white/3 border border-white/6 px-3 py-2.5 space-y-1">
          <p className="text-gray-500 text-[11px] font-medium uppercase tracking-wide">Username rules</p>
          <ul className="space-y-0.5">
            {[
              '3–20 characters',
              'Lowercase letters, numbers, _ and - only',
              'Must start with a letter (e.g. a–z)',
              'Must end with a letter or number',
              'No consecutive _ or - (e.g. john__doe ✗)',
            ].map((rule) => (
              <li key={rule} className="text-gray-600 text-[11px] flex items-start gap-1.5">
                <span className="mt-0.5 shrink-0 text-violet-700">·</span>
                {rule}
              </li>
            ))}
          </ul>
          <p className="text-gray-600 text-[11px] pt-0.5">
            <span className="text-gray-500">Examples: </span>
            <span className="font-mono text-violet-400/80">john_doe</span>
            {', '}
            <span className="font-mono text-violet-400/80">alex123</span>
            {', '}
            <span className="font-mono text-violet-400/80">user-42</span>
          </p>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className={labelClass}>Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@university.edu"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isLoading}
          className={inputClass}
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="password" className={labelClass}>Password</label>
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
        <label htmlFor="confirmPassword" className={labelClass}>Confirm Password</label>
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
      <button type="submit" disabled={isLoading} className={submitBtnClass}>
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
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
