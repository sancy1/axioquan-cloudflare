
// // =============================================================================================

// // /components/courses/course-enrollment.tsx - UPDATED WITH DEBUGGING
// 'use client';

// import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { useRouter } from 'next/navigation';
// import { Check, Loader2, AlertCircle } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';

// interface CourseEnrollmentProps {
//   courseId: string;
//   courseSlug: string;
//   priceCents: number;
// }

// export function CourseEnrollment({ courseId, courseSlug, priceCents }: CourseEnrollmentProps) {
//   const [isEnrolled, setIsEnrolled] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isEnrolling, setIsEnrolling] = useState(false);
//   const [enrollmentStatus, setEnrollmentStatus] = useState<string>('unknown');
//   const router = useRouter();
//   const { toast } = useToast();

//   // Check enrollment status on component mount
//   useEffect(() => {
//     checkEnrollmentStatus();
//   }, [courseId]);

//   // Check if user is enrolled in the course
//   const checkEnrollmentStatus = async () => {
//     try {
//       setIsLoading(true);
//       console.log(`[ENROLLMENT] Checking status for course ${courseId}`);
      
//       const response = await fetch(`/api/courses/${courseId}/enrollment-status`);
      
//       console.log(`[ENROLLMENT] Status response:`, response.status);
      
//       if (response.ok) {
//         const data = await response.json();
//         console.log(`[ENROLLMENT] Status data:`, data);
        
//         setIsEnrolled(data.isEnrolled);
//         setEnrollmentStatus(data.currentStatus || 'none');
        
//         // If user has dropped enrollment, show special message in console
//         if (data.currentStatus === 'dropped') {
//           console.log(`[ENROLLMENT] User has dropped enrollment, can re-enroll`);
//         }
//       } else {
//         console.error('[ENROLLMENT] Failed to check status:', response.status);
//         setIsEnrolled(false);
//       }
//     } catch (error) {
//       console.error('[ENROLLMENT] Error checking status:', error);
//       setIsEnrolled(false);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle course enrollment
//   const handleEnroll = async () => {
//     try {
//       setIsEnrolling(true);
//       console.log(`[ENROLLMENT] Attempting to enroll in course ${courseId}`);
      
//       const response = await fetch(`/api/courses/${courseId}/enroll`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       console.log(`[ENROLLMENT] Enroll response status:`, response.status);
      
//       if (response.ok) {
//         const data = await response.json();
//         console.log(`[ENROLLMENT] Enroll response data:`, data);
        
//         if (data.success) {
//           setIsEnrolled(true);
//           setEnrollmentStatus('active');
          
//           // Show success toast
//           toast({
//             title: "Successfully Enrolled!",
//             description: priceCents === 0 
//               ? "You've enrolled in this free course. Start learning now!"
//               : `You've successfully enrolled in "${courseSlug}" for $${(priceCents / 100).toFixed(2)}`,
//             duration: 5000,
//           });
          
//           // Refresh the page to update UI state
//           setTimeout(() => {
//             router.refresh();
//           }, 1500);
//         } else {
//           // Show specific error message
//           console.error('[ENROLLMENT] Failed with message:', data.message);
//           toast({
//             title: "Enrollment Failed",
//             description: data.message || "Failed to enroll in the course. Please try again.",
//             variant: "destructive",
//             duration: 5000,
//           });
//         }
//       } else {
//         console.error('[ENROLLMENT] HTTP error:', response.status);
//         const errorData = await response.json().catch(() => ({}));
//         console.error('[ENROLLMENT] Error data:', errorData);
        
//         toast({
//           title: "Enrollment Failed",
//           description: errorData.message || `Server error: ${response.status}. Please try again.`,
//           variant: "destructive",
//           duration: 5000,
//         });
//       }
//     } catch (error) {
//       console.error('[ENROLLMENT] Network error:', error);
//       toast({
//         title: "Network Error",
//         description: "Failed to connect to server. Please check your connection and try again.",
//         variant: "destructive",
//         duration: 5000,
//       });
//     } finally {
//       setIsEnrolling(false);
//     }
//   };

//   // Handle start learning - redirect to learning portal
//   const handleStartLearning = () => {
//     // Show toast before redirecting
//     toast({
//       title: "Redirecting to Learning Portal",
//       description: "Taking you to the course content...",
//       duration: 3000,
//     });
    
//     // Small delay to show the toast
//     setTimeout(() => {
//       router.push(`/courses/learn/${courseId}`);
//     }, 500);
//   };

//   // Show special message if user has dropped enrollment
//   const getEnrollmentMessage = () => {
//     if (enrollmentStatus === 'dropped') {
//       return "You previously unenrolled from this course. Click 'Enroll Now' to re-enroll.";
//     }
//     return isEnrolled 
//       ? "✓ Successfully enrolled in this course" 
//       : priceCents === 0 
//         ? "Free enrollment - start learning immediately"
//         : "30-day money-back guarantee";
//   };

//   if (isLoading) {
//     return (
//       <Button disabled className="w-full py-3 px-4 rounded-lg font-bold text-lg bg-gray-800 text-white">
//         <Loader2 className="w-4 h-4 animate-spin mr-2" />
//         Loading...
//       </Button>
//     );
//   }

//   if (isEnrolled) {
//     return (
//       <div className="space-y-3">
//         <Button
//           onClick={handleStartLearning}
//           className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-lg transition"
//         >
//           <Check className="w-5 h-5 mr-2" />
//           Start Learning
//         </Button>
//         <p className="text-sm text-green-600 text-center">
//           {getEnrollmentMessage()}
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-3">
//       <Button
//         onClick={handleEnroll}
//         disabled={isEnrolling}
//         className="w-full py-3 px-4 bg-white text-gray-900 hover:bg-gray-100 rounded-lg font-bold text-lg transition"
//       >
//         {isEnrolling ? (
//           <>
//             <Loader2 className="w-4 h-4 animate-spin mr-2" />
//             Enrolling...
//           </>
//         ) : (
//           `Enroll Now ${priceCents === 0 ? 'Free' : `- $${(priceCents / 100).toFixed(2)}`}`
//         )}
//       </Button>
      
//       {/* Debug button - remove in production */}
//       <div className="hidden">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => {
//             console.log('[ENROLLMENT] Debug info:', { 
//               courseId, 
//               isEnrolled, 
//               enrollmentStatus,
//               isLoading, 
//               isEnrolling 
//             });
//             checkEnrollmentStatus();
//           }}
//           className="text-xs w-full"
//         >
//           <AlertCircle className="w-3 h-3 mr-1" />
//           Debug Info
//         </Button>
//       </div>
      
//       <p className="text-xs text-gray-400 text-center">
//         {enrollmentStatus === 'dropped' ? (
//           <span className="text-amber-600">
//             You previously unenrolled. Click above to re-enroll.
//           </span>
//         ) : getEnrollmentMessage()}
//       </p>
//     </div>
//   );
// }
























// // /src/components/courses/course-enrollment.tsx

// 'use client';

// import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { useRouter } from 'next/navigation';
// import { Check, Loader2 } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';

// interface CourseEnrollmentProps {
//   courseId: string;
//   courseSlug: string;
//   priceCents: number;
// }

// export function CourseEnrollment({ courseId, courseSlug, priceCents }: CourseEnrollmentProps) {
//   const [isEnrolled, setIsEnrolled] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isEnrolling, setIsEnrolling] = useState(false);
//   const [enrollmentStatus, setEnrollmentStatus] = useState<string>('unknown');
//   const router = useRouter();
//   const { toast } = useToast();

//   useEffect(() => {
//     checkEnrollmentStatus();
//   }, [courseId]);

//   const checkEnrollmentStatus = async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch(`/api/courses/${courseId}/enrollment-status`);
//       if (response.ok) {
//         const data = await response.json();
//         setIsEnrolled(data.isEnrolled);
//         setEnrollmentStatus(data.currentStatus || 'none');
//       } else {
//         setIsEnrolled(false);
//       }
//     } catch (error) {
//       setIsEnrolled(false);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleEnroll = async () => {
//     try {
//       setIsEnrolling(true);

//       const response = await fetch(`/api/courses/${courseId}/enroll`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//       });

//       if (response.ok) {
//         const data = await response.json();

//         if (data.success) {
//           // ✅ Update state directly — no router.refresh(), no page blink
//           setIsEnrolled(true);
//           setEnrollmentStatus('active');

//           toast({
//             title: '🎉 Successfully Enrolled!',
//             description: priceCents === 0
//               ? "You've enrolled in this free course. Start learning now!"
//               : `You've enrolled for $${(priceCents / 100).toFixed(2)}. Start learning!`,
//             duration: 5000,
//           });
//         } else {
//           toast({
//             title: 'Enrollment Failed',
//             description: data.message || 'Failed to enroll. Please try again.',
//             variant: 'destructive',
//             duration: 5000,
//           });
//         }
//       } else {
//         const errorData = await response.json().catch(() => ({}));
//         toast({
//           title: 'Enrollment Failed',
//           description: errorData.message || `Server error: ${response.status}. Please try again.`,
//           variant: 'destructive',
//           duration: 5000,
//         });
//       }
//     } catch (error) {
//       toast({
//         title: 'Network Error',
//         description: 'Failed to connect to server. Please check your connection.',
//         variant: 'destructive',
//         duration: 5000,
//       });
//     } finally {
//       setIsEnrolling(false);
//     }
//   };

//   const handleStartLearning = () => {
//     router.push(`/courses/learn/${courseId}`);
//   };

//   if (isLoading) {
//     return (
//       <Button disabled className="w-full py-3 px-4 rounded-lg font-bold text-lg bg-gray-800 text-white">
//         <Loader2 className="w-4 h-4 animate-spin mr-2" />
//         Loading...
//       </Button>
//     );
//   }

//   if (isEnrolled) {
//     return (
//       <div className="space-y-3">
//         <Button
//           onClick={handleStartLearning}
//           className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-lg transition-colors"
//         >
//           <Check className="w-5 h-5 mr-2" />
//           Start Learning
//         </Button>
//         <p className="text-sm text-green-600 text-center font-medium">
//           ✓ You are enrolled in this course
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-3">
//       <Button
//         onClick={handleEnroll}
//         disabled={isEnrolling}
//         className="w-full py-3 px-4 bg-white text-gray-900 hover:bg-gray-100 rounded-lg font-bold text-lg transition-colors"
//       >
//         {isEnrolling ? (
//           <>
//             <Loader2 className="w-4 h-4 animate-spin mr-2" />
//             Enrolling...
//           </>
//         ) : (
//           `Enroll Now${priceCents === 0 ? ' — Free' : ` — $${(priceCents / 100).toFixed(2)}`}`
//         )}
//       </Button>

//       <p className="text-xs text-gray-400 text-center">
//         {enrollmentStatus === 'dropped'
//           ? <span className="text-amber-500">You previously unenrolled. Click above to re-enroll.</span>
//           : priceCents === 0
//             ? 'Free enrollment — start learning immediately'
//             : '30-day money-back guarantee'
//         }
//       </p>
//     </div>
//   );
// }

























// /src/components/courses/course-enrollment.tsx

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Check, Loader2, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CourseEnrollmentProps {
  courseId: string;
  courseSlug: string;
  priceCents: number;
}

export function CourseEnrollment({ courseId, courseSlug, priceCents }: CourseEnrollmentProps) {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState<string>('unknown');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndEnrollment();
  }, [courseId]);

  const checkAuthAndEnrollment = async () => {
    try {
      setIsLoading(true);

      // Check auth and enrollment status in parallel
      const [authRes, enrollRes] = await Promise.all([
        fetch('/api/auth/status'),
        fetch(`/api/courses/${courseId}/enrollment-status`),
      ]);

      if (authRes.ok) {
        const authData = await authRes.json();
        setIsAuthenticated(authData.isAuthenticated);
      }

      if (enrollRes.ok) {
        const enrollData = await enrollRes.json();
        setIsEnrolled(enrollData.isEnrolled);
        setEnrollmentStatus(enrollData.currentStatus || 'none');
      } else {
        setIsEnrolled(false);
      }
    } catch {
      setIsEnrolled(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async () => {
    // ✅ Intercept unauthenticated clicks before hitting the API
    if (!isAuthenticated) {
      const currentPath = window.location.pathname;
      toast({
        title: '🔒 Login Required',
        description: 'You need to be logged in to enroll in this course.',
        duration: 6000,
        action: (
          <Button
            size="sm"
            onClick={() => router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)}
            className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white flex items-center gap-1 shrink-0"
          >
            <LogIn className="w-3 h-3" />
            Log In
          </Button>
        ),
      });
      return;
    }

    try {
      setIsEnrolling(true);

      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success) {
          setIsEnrolled(true);
          setEnrollmentStatus('active');

          toast({
            title: '🎉 Successfully Enrolled!',
            description: priceCents === 0
              ? "You've enrolled in this free course. Start learning now!"
              : `You've enrolled for $${(priceCents / 100).toFixed(2)}. Start learning!`,
            duration: 5000,
          });
        } else {
          toast({
            title: 'Enrollment Failed',
            description: data.message || 'Failed to enroll. Please try again.',
            variant: 'destructive',
            duration: 5000,
          });
        }
      } else {
        const errorData = await response.json().catch(() => ({}));

        // Fallback: handle 401 from server in case auth state is stale
        if (response.status === 401) {
          const currentPath = window.location.pathname;
          toast({
            title: '🔒 Session Expired',
            description: 'Your session has expired. Please log in again to enroll.',
            duration: 6000,
            action: (
              <Button
                size="sm"
                onClick={() => router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)}
                className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white flex items-center gap-1 shrink-0"
              >
                <LogIn className="w-3 h-3" />
                Log In
              </Button>
            ),
          });
        } else {
          toast({
            title: 'Enrollment Failed',
            description: errorData.message || `Server error: ${response.status}. Please try again.`,
            variant: 'destructive',
            duration: 5000,
          });
        }
      }
    } catch {
      toast({
        title: 'Network Error',
        description: 'Failed to connect to server. Please check your connection.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleStartLearning = () => {
    router.push(`/courses/learn/${courseId}`);
  };

  if (isLoading) {
    return (
      <Button disabled className="w-full cursor-pointer py-3 px-4 rounded-lg font-bold text-lg bg-gray-800 text-white">
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
        Loading...
      </Button>
    );
  }

  if (isEnrolled) {
    return (
      <div className="space-y-3">
        <Button
          onClick={handleStartLearning}
          className="w-full cursor-pointer py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-lg transition-colors"
        >
          <Check className="w-5 h-5 mr-2" />
          Start Learning
        </Button>
        <p className="text-sm text-green-600 text-center font-medium">
          ✓ You are enrolled in this course
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={handleEnroll}
        disabled={isEnrolling}
        className="w-full cursor-pointer py-3 px-4 bg-white text-gray-900 hover:bg-gray-100 rounded-lg font-bold text-lg transition-colors"
      >
        {isEnrolling ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Enrolling...
          </>
        ) : (
          `Enroll Now${priceCents === 0 ? ' — Free' : ` — $${(priceCents / 100).toFixed(2)}`}`
        )}
      </Button>

      {/* Subtle hint visible only to guests */}
      {!isAuthenticated && (
        <p className="text-xs text-amber-400 text-center">
          🔒 Login required to enroll
        </p>
      )}

      <p className="text-xs text-gray-400 text-center">
        {enrollmentStatus === 'dropped' ? (
          <span className="text-amber-500">You previously unenrolled. Click above to re-enroll.</span>
        ) : priceCents === 0 ? (
          'Free enrollment — start learning immediately'
        ) : (
          '30-day money-back guarantee'
        )}
      </p>
    </div>
  );
}
