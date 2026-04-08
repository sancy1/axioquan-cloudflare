// /src/app/api/payment/initialize/route.ts
// API endpoint to initialize payment
// Handles payment initialization for both free and paid courses

import { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { initiatePaymentAction } from '@/lib/courses/payment-enrollment-actions'

interface InitializePaymentBody {
  courseId: string
}

export async function POST(request: NextRequest) {
  try {
    // ─── Step 1: Validate session ───
    const session = await getSession()
    if (!session?.userId) {
      return Response.json(
        {
          success: false,
          message: 'Authentication required',
        },
        { status: 401 }
      )
    }

    // ─── Step 2: Parse request body ───
    const body = (await request.json()) as InitializePaymentBody

    if (!body.courseId) {
      return Response.json(
        {
          success: false,
          message: 'Course ID is required',
        },
        { status: 400 }
      )
    }

    console.log('[API] Payment initialization:', {
      courseId: body.courseId,
      userId: session.userId,
    })

    // ─── Step 3: Call server action ───
    const result = await initiatePaymentAction(body.courseId)

    // ─── Step 4: Return response ───
    if (result.success) {
      return Response.json({
        success: true,
        message: result.message,
        data: result.data,
      })
    } else {
      return Response.json(
        {
          success: false,
          message: result.message,
          error: result.error,
        },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('❌ Error in payment initialization:', error)

    return Response.json(
      {
        success: false,
        message: 'Payment initialization failed',
        error: error.message || 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}
