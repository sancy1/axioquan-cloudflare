// /src/app/api/payment/status/route.ts
// ⚠️ CRITICAL: Check if user has VERIFIED PAID access to course
// Returns: boolean (true = payment verified & access granted, false = not paid/not verified)
// 
// This endpoint is used to:
// - Gate course content (free vs paid courses)
// - Show enrollment button vs "Continue Learning"
// - Prevent access unless payment is verified

import { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { hasUserPurchasedCourse } from '@/lib/db/queries/payments'
import { getCourseDetails, checkEnrollmentStatus } from '@/lib/db/queries/courses'

export async function GET(request: NextRequest) {
  try {
    // ─── Step 1: Validate session ───
    const session = await getSession()

    // ─── Step 2: Get query parameters ───
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId') || session?.userId
    const courseId = searchParams.get('courseId')

    if (!userId || !courseId) {
      return Response.json(
        {
          success: false,
          message: 'User ID and Course ID are required',
        },
        { status: 400 }
      )
    }

    // ─── Step 3: Get course details to check if paid ───
    const course = await getCourseDetails(courseId)
    if (!course) {
      return Response.json(
        {
          success: false,
          message: 'Course not found',
        },
        { status: 404 }
      )
    }

    const isFree = !course.price_cents || course.price_cents === 0

    // ─── Step 4: For FREE courses, check actual enrollment record ───
    // Free courses still require the user to click "Enroll Now" — do NOT
    // auto-grant access just because the course is free, otherwise every
    // free course page would show "Start Learning" even without enrolling.
    if (isFree) {
      const enrollment = await checkEnrollmentStatus(userId, courseId)
      return Response.json({
        success: true,
        data: {
          hasAccess: enrollment.isEnrolled,
          reason: enrollment.isEnrolled ? 'Enrolled in free course' : 'Not yet enrolled',
          isPaid: false,
        },
      })
    }

    // ─── Step 5: For PAID courses, check payment verification ───
    // ⚠️ DO NOT grant access unless Java service confirmed payment
    const isDonePayment = await hasUserPurchasedCourse(userId, courseId)

    if (!isDonePayment) {
      console.log('[PAYMENT STATUS] Not yet purchased', { userId, courseId })
      return Response.json({
        success: true,
        data: {
          hasAccess: false,
          reason: 'Payment not completed or verified',
          isPaid: true,
          coursePrice: course.price_cents,
        },
      })
    }

    // ─── Step 6: ✅ Payment verified - Grant access ───
    console.log('[PAYMENT STATUS] ✅ Access granted', { userId, courseId })

    return Response.json({
      success: true,
      data: {
        hasAccess: true,
        reason: 'Payment verified',
        isPaid: true,
        hasLifetimeAccess: true,
      },
    })
  } catch (error: any) {
    console.error('❌ Error checking payment status:', error)

    return Response.json(
      {
        success: false,
        message: 'Failed to check access status',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
