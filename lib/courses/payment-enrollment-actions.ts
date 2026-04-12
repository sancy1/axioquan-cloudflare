// /lib/courses/payment-enrollment-actions.ts
// Server actions for payment-based course enrollment
// Orchestrates interaction between Next.js, payment service, and database

'use server'

import { getSession } from '@/lib/auth/session'
import { updateSessionPaymentToken } from '@/lib/auth/session'
import { paymentApi } from '@/lib/payment/java-payment-api'
import {
  recordPaymentInitiation,
  updatePaymentStatus,
  hasUserPurchasedCourse,
  getPaymentByReference,
} from '@/lib/db/queries/payments'
import { getCourseDetails } from '@/lib/db/queries/courses'
import { enrollUserInCourse } from '@/lib/db/queries/courses'
import type { InitializePaymentRequest, InitializePaymentResponse } from '@/types/payments'
import { sendNotification } from '@/lib/notifications/send-notification'

/**
 * Check whether a payment reference has already been processed (success page shown).
 * Called at the top of the success page to prevent re-processing.
 */
export async function checkPaymentAlreadyProcessed(
  reference: string
): Promise<{ alreadyProcessed: boolean; courseId?: string }> {
  try {
    const payment = await getPaymentByReference(reference)
    if (payment?.status === 'SUCCESS' && payment.paid_at) {
      return { alreadyProcessed: true, courseId: payment.course_id }
    }
    return { alreadyProcessed: false }
  } catch {
    return { alreadyProcessed: false }
  }
}

/**
 * Initiate payment for a course
 * Handles both FREE and PAID courses
 *
 * FREE courses:
 *   1. Call payment service → Instant SUCCESS
 *   2. Create enrollment
 *   3. Cache payment locally
 *
 * PAID courses:
 *   1. Call payment service → Get Paystack URL
 *   2. Cache payment as PENDING
 *   3. Return checkout URL
 */
export async function initiatePaymentAction(
  courseId: string
): Promise<{
  success: boolean
  message: string
  data?: {
    paymentReference: string
    checkoutUrl?: string // Only for paid courses
    status: 'FREE_COURSE_SUCCESS' | 'AWAITING_PAYMENT'
  }
  error?: string
}> {
  try {
    // ─── Step 1: Validate session ───
    const session = await getSession()
    if (!session?.userId || !session.email) {
      return {
        success: false,
        message: 'Unauthorized',
        error: 'You must be logged in',
      }
    }

    // ─── Step 1b: Students only ───
    if (!session.roles?.includes('student')) {
      return {
        success: false,
        message: 'Students Only',
        error:
          'Only accounts with the Student role can enroll in courses or make payments. Please register a student account to continue.',
      }
    }

    console.log('[PAYMENT ACTION] Initiating payment:', {
      user: session.userId,
      course: courseId,
    })

    // ─── Step 2: Verify course exists and get pricing ───
    const courseResult = await getCourseDetails(courseId)
    if (!courseResult) {
      return {
        success: false,
        message: 'Course not found',
        error: 'This course does not exist',
      }
    }

    const course = courseResult as any
    const isFree = !course.price_cents || course.price_cents === 0

    console.log('[PAYMENT ACTION] Course pricing:', {
      courseId,
      price: course.price_cents,
      isFree,
    })

    // ─── Step 3: Check if already enrolled / purchased ───
    if (isFree) {
      // Free courses use enrollments table, not payments
      const { checkEnrollmentStatus } = await import('@/lib/db/queries/courses')
      const existing = await checkEnrollmentStatus(session.userId, courseId)
      if (existing.isEnrolled) {
        return {
          success: false,
          message: 'Already Enrolled',
          error: 'You already have access to this course',
        }
      }

      // ─── FREE COURSE: skip Java entirely, enroll directly ───
      console.log('[PAYMENT ACTION] FREE course — enrolling directly, bypassing payment service')
      const enrollResult = await enrollUserInCourse(session.userId, courseId)
      if (!enrollResult.success) {
        console.error('[PAYMENT ACTION] Free enrollment failed:', enrollResult.errors)
        return {
          success: false,
          message: 'Enrollment Failed',
          error: enrollResult.errors?.[0] || 'Could not create enrollment',
        }
      }

      console.log('[PAYMENT ACTION] ✓ User enrolled in FREE course')
      // Fire enrollment notification (fire-and-forget)
      sendNotification({
        userId: session.userId,
        notificationType: 'COURSE_ENROLLED',
        title: '🎓 Enrolled Successfully!',
        message: `You are now enrolled in "${(course as any).title ?? 'this course'}". Start learning today!`,
        actionUrl: `/courses/learn/${courseId}`,
        iconType: 'course',
        data: { courseId },
      }).catch(() => {})
      return {
        success: true,
        message: 'Successfully enrolled in free course',
        data: {
          paymentReference: `FREE_${courseId}`,
          status: 'FREE_COURSE_SUCCESS',
        },
      }
    }

    const alreadyPurchased = await hasUserPurchasedCourse(session.userId, courseId)
    if (alreadyPurchased) {
      return {
        success: false,
        message: 'Already Enrolled',
        error: 'You already have access to this course',
      }
    }

    // ─── Step 4: Build payment request ───
    // Backend expects: userId, courseId, email, amountCents
    // callbackUrl overrides the Java backend's FRONTEND_URL env var so
    // Paystack redirects back to this Next.js instance (local or prod).
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const paymentRequest: InitializePaymentRequest = {
      userId: session.userId,
      courseId: courseId,
      email: session.email,
      amountCents: course.price_cents || 0,
      callbackUrl: `${appUrl}/payment-success`,
    }

    console.log('[PAYMENT ACTION] Payment request to Java service:', {
      userId: paymentRequest.userId,
      courseId: paymentRequest.courseId,
      amountCents: paymentRequest.amountCents,
      isFree: paymentRequest.amountCents === 0,
    })

    // ✅ Get JWT token from session for payment service authentication
    // This token was generated during user login via /api/v1/auth/generate-token
    let authToken = session.paymentToken

    if (!authToken) {
      console.warn('[PAYMENT ACTION] ⚠️ Payment token missing from session - attempting to generate on-demand')
      
      try {
        // Fallback: Generate token on-demand if missing from session
        const tokenResponse = await paymentApi.generatePaymentToken(session.userId, session.email, session.name)
        
        if (tokenResponse.success && tokenResponse.data?.token) {
          authToken = tokenResponse.data.token
          console.log('[PAYMENT ACTION] ✓ Generated payment token on-demand')
          
          // Try to update session with token for next time
          try {
            // Note: This is a best-effort update - doesn't block if it fails
            await updateSessionPaymentToken(session.userId, authToken)
          } catch (updateError) {
            console.warn('[PAYMENT ACTION] Could not update session with token:', updateError)
            // Continue anyway - we have the token in memory for this request
          }
        } else {
          console.error('[PAYMENT ACTION] Failed to generate token on-demand:', tokenResponse.error)
          return {
            success: false,
            message: 'Authorization Error',
            error: tokenResponse.error || 'Payment service authentication failed.',
          }
        }
      } catch (error) {
        console.error('[PAYMENT ACTION] Error generating token on-demand:', error)
        return {
          success: false,
          message: 'Authorization Error',
          error: 'Could not authenticate with payment service. Please log in again.',
        }
      }
    } else {
      console.log('[PAYMENT ACTION] ✓ Found payment token in session')
    }

    let paymentResponse = await paymentApi.initializePayment(paymentRequest, authToken)

    // ─── 403 token refresh: stale/invalid token → regenerate once and retry ───
    // Spring Security returns {"error":"Forbidden"} so we check httpStatus, not
    // the error string (which would NOT contain "403" in that case).
    if (!paymentResponse.success && paymentResponse.httpStatus === 403) {
      console.warn('[PAYMENT ACTION] 403 on payment init — token may be stale, regenerating...')

      try {
        const freshTokenResponse = await paymentApi.generatePaymentToken(session.userId, session.email, session.name)

        if (freshTokenResponse.success && freshTokenResponse.data?.token) {
          authToken = freshTokenResponse.data.token
          console.log('[PAYMENT ACTION] ✓ Fresh token obtained — retrying payment init')

          // Persist new token to session for subsequent requests
          try {
            await updateSessionPaymentToken(session.userId, authToken)
          } catch {
            // Non-critical — we have the token in memory for this request
          }

          // Retry with the fresh token
          paymentResponse = await paymentApi.initializePayment(paymentRequest, authToken)
        } else {
          console.error('[PAYMENT ACTION] Failed to regenerate token:', freshTokenResponse.error)
          return {
            success: false,
            message: 'Session Expired',
            error: 'Your payment session has expired. Please log out and log back in.',
          }
        }
      } catch (refreshError) {
        console.error('[PAYMENT ACTION] Error during token refresh:', refreshError)
        return {
          success: false,
          message: 'Session Expired',
          error: 'Your payment session has expired. Please log out and log back in.',
        }
      }
    }

    if (!paymentResponse.success || !paymentResponse.data) {
      const errorMsg = paymentResponse.error || 'Failed to initialize payment'

      if (errorMsg?.includes('429') || errorMsg?.includes('rate limit') || errorMsg?.includes('Rate limit')) {
        console.error('[PAYMENT ACTION] Rate limit exceeded:', paymentResponse.error)
        return {
          success: false,
          message: 'Too Many Requests',
          error: 'Payment service is busy. Please wait a moment and try again.',
        }
      }

      console.error('[PAYMENT ACTION] Payment service error:', paymentResponse.error)
      return {
        success: false,
        message: 'Payment Service Error',
        error: errorMsg,
      }
    }

    const paymentData = paymentResponse.data as InitializePaymentResponse

    // Normalise checkout URL — backend returns authorizationUrl, we also support checkoutUrl
    const checkoutUrl = paymentData.authorizationUrl || paymentData.checkoutUrl || ''

    console.log('[PAYMENT ACTION] Payment service response (full):', JSON.stringify(paymentData))

    // Guard: reference is required for the DB insert. If the prod Java service
    // wraps its response differently, paymentData.reference will be undefined.
    if (!paymentData.reference) {
      console.error('[PAYMENT ACTION] ❌ No reference in Java response:', JSON.stringify(paymentData))
      return {
        success: false,
        message: 'Payment Service Error',
        error: `Payment service returned no reference. Raw response: ${JSON.stringify(paymentData)}`,
      }
    }

    // ─── Step 6: Cache payment locally ───
    const cacheResult = await recordPaymentInitiation({
      reference: paymentData.reference,
      user_id: session.userId,
      course_id: courseId,
      amount_cents: paymentData.amountCents ?? course.price_cents ?? 0,
      currency: paymentData.currency ?? 'NGN',
      status: paymentData.status === 'SUCCESS' ? 'SUCCESS' : 'PENDING',
      payment_method: 'paystack',
      metadata: {
        courseId,
        userId: session.userId,
      },
    })

    if (!cacheResult.success) {
      console.error('[PAYMENT ACTION] Failed to cache payment:', cacheResult.error)
      return {
        success: false,
        message: 'Database Error',
        error: `Failed to save payment record: ${cacheResult.error}`,
      }
    }

    // ─── Step 7: For FREE courses, create enrollment immediately ───
    // Java service returns no status field — for free courses (amountCents=0)
    // there will be no authorizationUrl, so checkoutUrl will be empty.
    if (isFree) {
      console.log('[PAYMENT ACTION] FREE course - Instant enrollment approved')

      const enrollmentResult = await enrollUserInCourse(session.userId, courseId)
      if (!enrollmentResult.success) {
        console.error('[PAYMENT ACTION] Enrollment failed:', enrollmentResult.errors)
        return {
          success: false,
          message: 'Enrollment Failed',
          error: enrollmentResult.errors?.[0] || 'Could not create enrollment',
        }
      }

      console.log('[PAYMENT ACTION] ✓ User enrolled in FREE course')
      // Fire enrollment notification (fire-and-forget)
      sendNotification({
        userId: session.userId,
        notificationType: 'COURSE_ENROLLED',
        title: '🎓 Enrolled Successfully!',
        message: `You are now enrolled in "${(course as any).title ?? 'this course'}". Start learning today!`,
        actionUrl: `/courses/learn/${courseId}`,
        iconType: 'course',
        data: { courseId },
      }).catch(() => {})
      return {
        success: true,
        message: 'Successfully enrolled in free course',
        data: {
          paymentReference: paymentData.reference,
          status: 'FREE_COURSE_SUCCESS',
        },
      }
    }

    // ─── Step 8: For PAID courses, DO NOT create enrollment yet ───
    // ⚠️ CRITICAL: Payment must be verified with Java service first
    // Backend returns authorizationUrl (Paystack checkout) — enrollment only after webhook/verify
    if (!isFree && checkoutUrl) {
      console.log('[PAYMENT ACTION] PAID course - User MUST verify payment via Paystack')
      console.log('[PAYMENT ACTION] ⚠️ Blocking enrollment until payment verified', {
        courseId,
        reference: paymentData.reference,
        status: 'AWAITING_PAYMENT',
      })

      return {
        success: true,
        message: 'Please complete payment to gain access',
        data: {
          paymentReference: paymentData.reference,
          checkoutUrl,
          status: 'AWAITING_PAYMENT',
        },
      }
    }

    // ─── Step 9: Unexpected state ───
    console.error('[PAYMENT ACTION] ❌ Unexpected state:', {
      isFree,
      status: paymentData.status,
    })

    return {
      success: false,
      message: 'Invalid Payment State',
      error: 'Payment service returned unexpected status',
    }
  } catch (error: any) {
    console.error('❌ Error in initiatePaymentAction:', error)
    return {
      success: false,
      message: 'System Error',
      error: error.message || 'An unexpected error occurred',
    }
  }
}

/**
 * Verify payment after user returns from Paystack
 * ⚠️ CRITICAL: This is the ONLY place where paid course enrollment is allowed
 * 
 * Flow:
 * 1. User completes Paystack payment
 * 2. Paystack redirects to: /api/payment/verify?reference=PAY_XXX
 * 3. This function verifies with Java service
 * 4. Java service confirms payment + auto-creates enrollment via trigger
 * 5. ONLY then is user allowed access to the course
 * 
 * Security guarantees:
 * - User CANNOT access course without successful payment verification
 * - Java trigger confirms payment before enrollment
 * - Local DB is cache only (source of truth is Java service)
 */
export async function verifyPaymentAction(
  paymentReference: string
): Promise<{
  success: boolean
  message: string
  data?: {
    enrollmentId: string
    courseId: string
    status: 'SUCCESS' | 'FAILED' | 'PENDING'
  }
  error?: string
}> {
  try {
    // ─── Step 1: Validate session ───
    const session = await getSession()
    if (!session?.userId) {
      return {
        success: false,
        message: 'Unauthorized',
        error: 'Session expired. Please log in again.',
      }
    }

    console.log('[VERIFY PAYMENT] Starting verification:', {
      reference: paymentReference,
      userId: session.userId,
    })

    if (!paymentReference || paymentReference.trim() === '') {
      return {
        success: false,
        message: 'Invalid Reference',
        error: 'Payment reference is missing or invalid',
      }
    }

    // ─── Step 2: Verify with Java service (SOURCE OF TRUTH) ───
    // Java service checks with Paystack and database trigger auto-creates enrollment
    // IMPORTANT: /api/v1/payments/verify/* is a protected endpoint — must send Bearer token
    console.log('[VERIFY PAYMENT] Calling Java service to verify with Paystack...')
    const authToken = session.paymentToken || undefined
    const verifyResponse = await paymentApi.verifyPayment(paymentReference, authToken)

    if (!verifyResponse.success) {
      console.error('[VERIFY PAYMENT] ❌ Java service verification failed:', verifyResponse.error)
      return {
        success: false,
        message: 'Verification Failed',
        error: verifyResponse.error || 'Could not verify payment with Paystack',
      }
    }

    if (!verifyResponse.data) {
      return {
        success: false,
        message: 'No Payment Data',
        error: 'Payment service returned no data',
      }
    }

    const paymentData = verifyResponse.data

    console.log('[VERIFY PAYMENT] Java service response:', {
      status: paymentData.status,
      courseId: paymentData.courseId,
      enrollmentId: paymentData.enrollmentId,
      isPaid: paymentData.isPaid,
    })

    // ─── Step 3: Check payment status from Java service ───
    // CRITICAL: Student can ONLY access course if Java confirms SUCCESS + enrollment created
    if (paymentData.status !== 'SUCCESS') {
      console.warn('[VERIFY PAYMENT] ❌ Payment not successful:', paymentData.status)
      return {
        success: false,
        message: 'Payment Not Completed',
        error: `Payment status: ${paymentData.status}. Please try again.`,
        data: {
          enrollmentId: '',
          courseId: paymentData.courseId || '',
          status: paymentData.status as 'FAILED' | 'PENDING',
        },
      }
    }

    // ─── Step 4: Verify enrollment was created by database trigger ───
    if (!paymentData.enrollmentId || !paymentData.hasEnrollment) {
      console.error('[VERIFY PAYMENT] ❌ Java trigger did not create enrollment', {
        enrollmentId: paymentData.enrollmentId,
        hasEnrollment: paymentData.hasEnrollment,
      })
      return {
        success: false,
        message: 'Enrollment Error',
        error: 'Payment verified but enrollment creation failed. Please contact support.',
      }
    }

    // ─── Step 5: Update local cache with verified status ───
    const updateResult = await updatePaymentStatus(
      paymentReference,
      'SUCCESS'
    )

    if (!updateResult.success) {
      console.warn('[VERIFY PAYMENT] Local cache update failed (non-critical):', updateResult.error)
      // Continue anyway - Java service has authoritative record
    }

    // ─── Step 5b: Create enrollment in Next.js DB ───
    // Java trigger creates enrollment in Java DB; we mirror it locally so the
    // curriculum, enrollment-status endpoints, and CourseCurriculum all work.
    const enrollResult = await enrollUserInCourse(session.userId, paymentData.courseId)
    if (!enrollResult.success) {
      // "already enrolled" is fine — it means a record already exists
      if (!enrollResult.errors?.[0]?.includes('already enrolled')) {
        console.warn('[VERIFY PAYMENT] Local enrollment creation failed (non-critical):', enrollResult.errors)
      }
    } else {
      console.log('[VERIFY PAYMENT] ✓ Local enrollment created for paid course')
    }

    // ─── Step 6: ✅ PAYMENT VERIFIED - User now has access ───
    console.log('[VERIFY PAYMENT] ✅ PAYMENT VERIFIED', {
      enrollmentId: paymentData.enrollmentId,
      courseId: paymentData.courseId,
      lifetime: paymentData.isPaid,
    })

    return {
      success: true,
      message: '✅ Payment confirmed! You now have lifetime access to this course.',
      data: {
        enrollmentId: paymentData.enrollmentId,
        courseId: paymentData.courseId,
        status: 'SUCCESS',
      },
    }
  } catch (error: any) {
    console.error('❌ Error in verifyPaymentAction:', error)
    return {
      success: false,
      message: 'System Error',
      error: error.message || 'An unexpected error occurred during verification',
    }
  }
}

/**
 * Verify user has PAID access to course (critical security check)
 * ⚠️ MUST be called before allowing access to paid course content
 * 
 * Returns whether user has:
 * 1. Valid payment record with status='SUCCESS'
 * 2. Active enrollment created by database trigger
 * 
 * Prevents: Unauthenticated access, free course info on paid courses,
 *           incomplete payments, manual enrollment bypasses
 */
export async function verifyPaidAccessAction(
  courseId: string
): Promise<{
  hasAccess: boolean
  reason?: string
}> {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return {
        hasAccess: false,
        reason: 'Not authenticated',
      }
    }

    // Check if user has successful payment
    const hasPurchased = await hasUserPurchasedCourse(session.userId, courseId)

    if (!hasPurchased) {
      return {
        hasAccess: false,
        reason: 'Payment not verified',
      }
    }

    console.log('[VERIFY ACCESS] ✓ User has verified paid access', {
      userId: session.userId,
      courseId,
    })

    return {
      hasAccess: true,
    }
  } catch (error: any) {
    console.error('❌ Error verifying paid access:', error)
    return {
      hasAccess: false,
      reason: 'Access verification failed',
    }
  }
}

/**
 * Check purchase status for a course
 * Used to show correct button: "Enroll" vs "Continue Learning"
 */
export async function checkPurchaseStatusAction(
  courseId: string
): Promise<{
  success: boolean
  isPurchased: boolean
}> {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return {
        success: false,
        isPurchased: false,
      }
    }

    const isPurchased = await hasUserPurchasedCourse(session.userId, courseId)

    return {
      success: true,
      isPurchased,
    }
  } catch (error: any) {
    console.error('❌ Error checking purchase status:', error)
    return {
      success: false,
      isPurchased: false,
    }
  }
}
