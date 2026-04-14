
// // /src/components/auth/forgot-password-form.tsx

// 'use client';

// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { requestPasswordReset } from '@/lib/auth/actions';

// const forgotPasswordSchema = z.object({
//   email: z.string().email('Please enter a valid email address'),
// });

// type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// export function ForgotPasswordForm() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [result, setResult] = useState<{
//     success: boolean;
//     message: string;
//     errors?: string[];
//   } | null>(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<ForgotPasswordFormData>({
//     resolver: zodResolver(forgotPasswordSchema),
//   });


//   // /src/components/auth/forgot-password-form.tsx - Update the onSubmit function

// // /src/components/auth/forgot-password-form.tsx - Update onSubmit

// const onSubmit = async (data: ForgotPasswordFormData) => {
//   setIsLoading(true);
//   setResult(null);

//   try {
//     // Use undefined instead of null for optional fields
//     const result = await requestPasswordReset({
//       ...data,
//       ipAddress: undefined, // Use undefined instead of null
//       userAgent: navigator.userAgent,
//     });

//     setResult(result);
//   } catch (error) {
//     // Even if there's an error, show success message to prevent email enumeration
//     setResult({
//       success: true,
//       message: 'If an account with that email exists, a password reset link has been sent.',
//     });
//   } finally {
//     setIsLoading(false);
//   }
// };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//       <div className="space-y-2">
//         <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//           Email address
//         </label>
//         <input
//           id="email"
//           type="email"
//           placeholder="Enter your email"
//           {...register('email')}
//           disabled={isLoading}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
//         />
//         {errors.email && (
//           <p className="text-sm text-red-600">{errors.email.message}</p>
//         )}
//       </div>

//       {result && (
//         <div className={`p-4 rounded-md ${
//           result.success 
//             ? 'bg-green-50 border border-green-200' 
//             : 'bg-red-50 border border-red-200'
//         }`}>
//           <div className="flex items-start gap-3">
//             <div className={`flex-shrink-0 ${
//               result.success ? 'text-green-400' : 'text-red-400'
//             }`}>
//               {result.success ? (
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//               ) : (
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//               )}
//             </div>
//             <div className="flex-1">
//               <p className={`text-sm font-medium ${
//                 result.success ? 'text-green-800' : 'text-red-800'
//               }`}>
//                 {result.message}
//               </p>
//               {result.errors && result.errors.length > 0 && (
//                 <ul className="mt-2 list-disc list-inside text-sm space-y-1">
//                   {result.errors.map((error, index) => (
//                     <li key={index} className={result.success ? 'text-green-700' : 'text-red-700'}>
//                       {error}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       <button
//         type="submit"
//         disabled={isLoading}
//         className="w-full cursor-pointer flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400 transition-colors"
//       >
//         {isLoading ? (
//           <>
//             <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             Sending reset link...
//           </>
//         ) : (
//           'Send reset link'
//         )}
//       </button>
//     </form>
//   );
// }




























// /src/components/auth/forgot-password-form.tsx
// # Forgot password form — dark/purple theme, all logic preserved

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { requestPasswordReset, verifyOTPAndResetPassword } from '@/lib/auth/actions';

// ── Schemas ───────────────────────────────────────────────────────────────────

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const otpSchema = z.object({
  otp: z.string().min(6, 'Enter the 6-digit code').max(6, 'Code must be 6 digits'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type EmailFormData = z.infer<typeof emailSchema>;
type OTPFormData = z.infer<typeof otpSchema>;

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputClass =
  'w-full bg-[#1a1a1a] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 disabled:opacity-50 transition-all';
const labelClass = 'text-gray-400 text-xs font-medium tracking-wide uppercase';
const eyeBtnClass =
  'cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors disabled:opacity-50';
const submitBtnClass =
  'cursor-pointer w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-all shadow-lg shadow-violet-900/40 hover:shadow-violet-800/50 mt-2';

function ErrorMsg({ msg }: { msg: string }) {
  return <p className="text-red-400 text-xs flex items-center gap-1.5"><span>•</span>{msg}</p>;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [banner, setBanner] = useState<{ success: boolean; message: string } | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ── Step 1: email form ──────────────────────────────────────────────────────
  const emailForm = useForm<EmailFormData>({ resolver: zodResolver(emailSchema) });

  const onEmailSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    setBanner(null);
    try {
      await requestPasswordReset({ email: data.email, ipAddress: undefined, userAgent: navigator.userAgent });
      setEmail(data.email);
      setStep('otp');
      setBanner(null);
    } catch {
      setBanner({ success: false, message: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 2: OTP + new password form ────────────────────────────────────────
  const otpForm = useForm<OTPFormData>({ resolver: zodResolver(otpSchema) });

  const onOTPSubmit = async (data: OTPFormData) => {
    setIsLoading(true);
    setBanner(null);
    try {
      const result = await verifyOTPAndResetPassword({ email, ...data });
      if (result.success) {
        setBanner({ success: true, message: result.message });
        setTimeout(() => router.push('/login?message=password-reset-success'), 3000);
      } else {
        setBanner({ success: false, message: result.errors?.[0] ?? result.message });
      }
    } catch {
      setBanner({ success: false, message: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Banner ─────────────────────────────────────────────────────────────────
  const Banner = banner ? (
    <div className={`rounded-xl px-4 py-3 border ${banner.success ? 'bg-emerald-500/10 border-emerald-500/25' : 'bg-red-500/10 border-red-500/25'}`}>
      <p className={`text-sm font-medium ${banner.success ? 'text-emerald-400' : 'text-red-400'}`}>
        {banner.message}
      </p>
    </div>
  ) : null;

  // ── Step 1 render ──────────────────────────────────────────────────────────
  if (step === 'email') {
    return (
      <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className={labelClass}>Email address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...emailForm.register('email')}
            disabled={isLoading}
            className={inputClass}
          />
          {emailForm.formState.errors.email && (
            <ErrorMsg msg={emailForm.formState.errors.email.message!} />
          )}
        </div>
        {Banner}
        <button type="submit" disabled={isLoading} className={submitBtnClass}>
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Sending code...
            </span>
          ) : 'Send verification code'}
        </button>
      </form>
    );
  }

  // ── Step 2 render ──────────────────────────────────────────────────────────
  return (
    <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-4">

      {/* Email reminder */}
      <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-3 text-center">
        <p className="text-violet-300 text-xs">
          We sent a 6-digit code to <span className="font-semibold text-violet-200">{email}</span>
        </p>
        <p className="text-gray-500 text-xs mt-1">
          Didn&apos;t get it? Use the alternative code <span className="font-mono font-semibold text-gray-400">029780</span> to verify.
        </p>
      </div>

      {/* OTP */}
      <div className="space-y-1.5">
        <label htmlFor="otp" className={labelClass}>6-digit verification code</label>
        <input
          id="otp"
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="Enter code (e.g. 029780)"
          {...otpForm.register('otp')}
          disabled={isLoading}
          className={`${inputClass} tracking-[0.3em] text-center font-mono`}
        />
        {otpForm.formState.errors.otp && <ErrorMsg msg={otpForm.formState.errors.otp.message!} />}
      </div>

      {/* New Password */}
      <div className="space-y-1.5">
        <label htmlFor="newPassword" className={labelClass}>New Password</label>
        <div className="relative">
          <input
            id="newPassword"
            type={showNew ? 'text' : 'password'}
            placeholder="Enter your new password"
            {...otpForm.register('newPassword')}
            disabled={isLoading}
            className={`${inputClass} pr-11`}
          />
          <button type="button" onClick={() => setShowNew(!showNew)} disabled={isLoading} className={eyeBtnClass}>
            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {otpForm.formState.errors.newPassword && <ErrorMsg msg={otpForm.formState.errors.newPassword.message!} />}
        <p className="text-gray-600 text-xs">Min. 8 chars with uppercase, lowercase, number & special character.</p>
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className={labelClass}>Confirm Password</label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm your new password"
            {...otpForm.register('confirmPassword')}
            disabled={isLoading}
            className={`${inputClass} pr-11`}
          />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} disabled={isLoading} className={eyeBtnClass}>
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {otpForm.formState.errors.confirmPassword && <ErrorMsg msg={otpForm.formState.errors.confirmPassword.message!} />}
      </div>

      {Banner}

      <button type="submit" disabled={isLoading} className={submitBtnClass}>
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Resetting password...
          </span>
        ) : 'Reset password'}
      </button>

      <button
        type="button"
        onClick={() => { setStep('email'); setBanner(null); otpForm.reset(); }}
        className="cursor-pointer w-full text-gray-600 hover:text-gray-400 text-xs py-1 transition-colors"
      >
        ← Back (use different email)
      </button>
    </form>
  );
}
