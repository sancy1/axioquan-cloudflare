// /src/app/api/payment/verify/route.ts
// API endpoint to verify payment status
// Called when user is redirected back from Paystack
// Example: /api/payment/verify?reference=PAY_e47ac10b-58cc

import { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { verifyPaymentAction } from '@/lib/courses/payment-enrollment-actions'

export async function GET(request: NextRequest) {
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

    // ─── Step 2: Get payment reference from query string ───
    const searchParams = request.nextUrl.searchParams
    const reference = searchParams.get('reference')

    if (!reference) {
      return Response.json(
        {
          success: false,
          message: 'Payment reference is required',
        },
        { status: 400 }
      )
    }

    console.log('[API] Payment verification:', {
      reference,
      userId: session.userId,
    })

    // ─── Step 3: Call server action ───
    const result = await verifyPaymentAction(reference)

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
    console.error('❌ Error in payment verification:', error)

    return Response.json(
      {
        success: false,
        message: 'Payment verification failed',
        error: error.message || 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}
