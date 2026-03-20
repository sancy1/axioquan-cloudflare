
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { requestPasswordReset } from '@/lib/auth/actions';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    errors?: string[];
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setResult(null);

    try {
      const result = await requestPasswordReset({
        ...data,
        ipAddress: undefined,
        userAgent: navigator.userAgent,
      });
      setResult(result);
    } catch {
      // Show success to prevent email enumeration
      setResult({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-gray-400 text-xs font-medium tracking-wide uppercase">
          Email address
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register('email')}
          disabled={isLoading}
          className="w-full bg-[#1a1a1a] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 disabled:opacity-50 transition-all"
        />
        {errors.email && (
          <p className="text-red-400 text-xs flex items-center gap-1.5">
            <span>•</span>{errors.email.message}
          </p>
        )}
      </div>

      {/* Result banner */}
      {result && (
        <div className={`rounded-xl px-4 py-3 border ${
          result.success
            ? 'bg-emerald-500/10 border-emerald-500/25'
            : 'bg-red-500/10 border-red-500/25'
        }`}>
          <div className="flex items-start gap-2.5">
            <div className="shrink-0 mt-0.5">
              {result.success ? (
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              ) : (
                <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${result.success ? 'text-emerald-400' : 'text-red-400'}`}>
                {result.message}
              </p>
              {result.errors && result.errors.length > 0 && (
                <ul className="mt-1.5 space-y-1">
                  {result.errors.map((error, index) => (
                    <li key={index} className={`text-xs ${result.success ? 'text-emerald-500' : 'text-red-500'}`}>
                      • {error}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

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
            Sending reset link...
          </span>
        ) : (
          'Send reset link'
        )}
      </button>

    </form>
  );
}
