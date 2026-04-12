// /src/components/courses/course-enrollment.tsx
// ⚠️ CRITICAL: Must use payment flow for PAID courses
// Free courses: Direct enrollment ✓
// Paid courses: MUST verify payment first ✅

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Check, Loader2, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { initiatePaymentAction } from '@/lib/courses/payment-enrollment-actions';

interface CourseEnrollmentProps {
  courseId: string;
  courseSlug: string;
  priceCents: number;
  /** Pre-fetched access state from parent — skips redundant /api/payment/status fetch */
  initialHasAccess?: boolean;
}

export function CourseEnrollment({ courseId, courseSlug, priceCents, initialHasAccess }: CourseEnrollmentProps) {
  const [isEnrolled, setIsEnrolled] = useState(initialHasAccess ?? false);
  // If parent provided initialHasAccess we don't need to fetch — skip loading state
  const [isLoading, setIsLoading] = useState(initialHasAccess === undefined);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState<string>('unknown');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const isFree = !priceCents || priceCents === 0;

  useEffect(() => {
    checkAuthAndEnrollment();
  }, [courseId]);

  // Sync when parent's access check resolves (parent fetches async, prop arrives after mount)
  useEffect(() => {
    if (initialHasAccess !== undefined) {
      setIsEnrolled(initialHasAccess);
      setEnrollmentStatus(initialHasAccess ? 'active' : 'not_enrolled');
      setIsLoading(false);
    }
  }, [initialHasAccess]);

  const checkAuthAndEnrollment = async () => {
    try {
      setIsLoading(true);

      if (initialHasAccess !== undefined) {
        // Parent already fetched payment status — only check auth to enable/disable login prompt
        const authRes = await fetch('/api/auth/status');
        if (authRes.ok) {
          const authData = await authRes.json();
          setIsAuthenticated(authData.isAuthenticated);
        }
        setIsEnrolled(initialHasAccess);
        setEnrollmentStatus(initialHasAccess ? 'active' : 'not_enrolled');
        return;
      }

      // No prop provided — fetch both auth and payment status
      const [authRes, statusRes] = await Promise.all([
        fetch('/api/auth/status'),
        fetch(`/api/payment/status?courseId=${courseId}`),
      ]);

      if (authRes.ok) {
        const authData = await authRes.json();
        setIsAuthenticated(authData.isAuthenticated);
      }

      if (statusRes.ok) {
        const statusData = await statusRes.json();
        // ✅ CRITICAL: Only grant access if payment verified
        setIsEnrolled(statusData.data?.hasAccess === true);
        setEnrollmentStatus(statusData.data?.reason || 'checking');
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
    // ✅ Intercept unauthenticated clicks
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

      // ⚠️ CRITICAL: Use payment flow, NOT direct enrollment
      console.log('[ENROLL] Starting enrollment:', {
        courseId,
        isFree,
        amount: priceCents,
      });

      const paymentResult = await initiatePaymentAction(courseId);

      if (!paymentResult.success) {
        console.error('[ENROLL] Payment initiation failed:', paymentResult.error);
        toast.error('Enrollment Failed', {
          description: paymentResult.error || 'Failed to process enroll request. Please try again.',
          duration: 6000,
        });
        return;
      }

      // ─── FREE COURSE: Auto-enrollment ───
      if (isFree && paymentResult.data?.status === 'FREE_COURSE_SUCCESS') {
        console.log('[ENROLL] ✓ Free course - auto enrolled');
        setIsEnrolled(true);
        setEnrollmentStatus('active');

        toast.success('🎉 Successfully Enrolled!', {
          description: "You've enrolled in this free course. Start learning now!",
          duration: 5000,
        });

        // Refresh to show "Start Learning" button
        setTimeout(() => {
          checkAuthAndEnrollment();
        }, 1000);
      }
      // ─── PAID COURSE: Redirect to Paystack ───
      else if (!isFree && paymentResult.data?.status === 'AWAITING_PAYMENT') {
        const paystackUrl = paymentResult.data.checkoutUrl || '';
        console.log('[ENROLL] ⏳ Paid course - redirecting to Paystack', {
          reference: paymentResult.data.paymentReference,
          paystackUrl: paystackUrl || '(none — may be pending)',
        });

        toast.loading('💳 Redirecting to Payment', {
          description: 'You will be redirected to complete your payment...',
          duration: 3000,
        });

        // Redirect to Paystack (after short delay for toast)
        setTimeout(() => {
          const url = paymentResult.data?.checkoutUrl;
          if (url) {
            window.location.href = url;
          } else {
            console.warn('[ENROLL] No Paystack URL in response — payment reference saved, awaiting webhook confirmation');
          }
        }, 500);
      } else {
        console.error('[ENROLL] Unexpected status:', paymentResult.data?.status);
        toast.error('Unexpected Response', {
          description: 'Payment service returned unexpected status. Please try again.',
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error('[ENROLL] Error:', error);
      toast.error('Network Error', {
        description: 'Failed to connect to server. Please check your connection.',
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

  // ✅ Only show "Start Learning" if enrolled AND payment verified
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
          ✓ You are enrolled in this course {!isFree && '(Lifetime Access)'}
        </p>
      </div>
    );
  }

  // ❌ Not enrolled
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
            {isFree ? 'Enrolling...' : 'Processing...'}
          </>
        ) : (
          `Enroll Now${isFree ? ' — Free' : ` — ₦${(priceCents).toLocaleString('en-NG')}`}`
        )}
      </Button>

      {!isAuthenticated && (
        <p className="text-xs text-amber-400 text-center">
          🔐 Login required to enroll
        </p>
      )}

      <p className="text-xs text-gray-400 text-center">
        {isFree
          ? 'Free enrollment — start learning immediately'
          : enrollmentStatus === 'Payment not verified'
            ? '❌ Payment required to access'
            : '30-day money-back guarantee'
        }
      </p>
    </div>
  );
}
