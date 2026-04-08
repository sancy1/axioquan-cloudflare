/**
 * /lib/payment/java-payment-api.ts
 * 
 * Wrapper for Java Payment Service API (microservice)
 * Handles token generation, payment initialization, and verification
 * 
 * Rate Limiting:
 * - The backend uses a fixed counter with 1-minute window (expireAfterWrite)
 * - Limit: 5 requests per minute per endpoint
 * - Counter resets every 60 seconds (fixed - not tied to last access)
 * - When rate limited: returns 429 with Retry-After: 60 header
 * 
 * Environment Configuration:
 * - Dev:  Use NEXT_PUBLIC_PAYMENT_SERVICE_URL or default to http://localhost:8080
 * - Prod: Set NEXT_PUBLIC_PAYMENT_SERVICE_URL=https://axio-payment.onrender.com
 */

import type {
  InitializePaymentRequest,
  InitializePaymentResponse,
  VerifyPaymentResponse,
  PurchaseStatusResponse,
  Transaction,
  TransactionSummary,
} from '@/types/payments'

// Base URL for Java Payment Service - configurable per environment
// IMPORTANT: java-payment-api.ts is server-side only (server actions).
// Prefer PAYMENT_SERVICE_URL (runtime env var, never inlined by Next.js build)
// over NEXT_PUBLIC_PAYMENT_SERVICE_URL (baked into bundle at build time).
const BASE_URL =
  process.env.PAYMENT_SERVICE_URL ||
  process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL ||
  'http://localhost:8080'

// ── Core fetch helper ─────────────────────────────────────────────────────────

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

async function paymentFetch<T>(
  path: string,
  options: RequestInit = {},
  authToken?: string
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${path}`

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    }

    // Add authorization token if provided
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    // Handle non-200 responses
    if (!response.ok) {
      let errorMessage = `Payment service error: ${response.status}`
      
      try {
        const errorData = await response.json()
        console.error(`❌ Payment API error [${path}]:`, {
          status: response.status,
          errorData,
        })
        
        // Try multiple common error field names
        errorMessage =
          errorData?.message ||
          errorData?.error ||
          errorData?.detail ||
          errorData?.msg ||
          `Payment service error: ${response.status}`
        console.error(`❌ Payment API error body [${path}]:`, JSON.stringify(errorData))
      } catch (parseError) {
        // If response isn't JSON, log raw body — helps diagnose proxy-level 403s
        const text = await response.text().catch(() => '')
        errorMessage = text
          ? `Payment service error: ${response.status} — ${text.substring(0, 300)}`
          : `Payment service error: ${response.status}`
        console.error(`❌ Payment API error [${path}] - Non-JSON response:`, {
          status: response.status,
          body: text.substring(0, 300),
        })
      }
      
      return {
        success: false,
        error: errorMessage,
      }
    }

    const data = await response.json()
    return {
      success: true,
      data: data.data || data,
      message: data.message,
    }
  } catch (error) {
    console.error(`❌ Payment fetch failed [${path}]:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    }
  }
}

// ── Payment API Functions ───────────────────────────────────────────────────────

/**
 * Initialize payment for a course (free or paid)
 * FREE courses: Returns SUCCESS status immediately
 * PAID courses: Returns Paystack checkout URL with PENDING status
 */
export async function initializePayment(
  request: InitializePaymentRequest,
  authToken?: string
): Promise<ApiResponse<InitializePaymentResponse>> {
  console.log('[PAYMENT] Initializing payment:', {
    userId: request.userId,
    courseId: request.courseId,
    email: request.email,
  })

  return paymentFetch<InitializePaymentResponse>(
    '/api/v1/payments/initialize',
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
    authToken
  )
}

/**
 * Verify payment status after user returns from Paystack
 * Returns final payment status and enrollment ID (if created by Java service)
 */
export async function verifyPayment(
  reference: string,
  authToken?: string
): Promise<ApiResponse<VerifyPaymentResponse>> {
  console.log('[PAYMENT] Verifying payment:', reference)

  return paymentFetch<VerifyPaymentResponse>(
    `/api/v1/payments/verify/${reference}`,
    { method: 'GET' },
    authToken
  )
}

/**
 * Check if user has already purchased a course
 * Returns boolean: true = already purchased, false = not purchased
 */
export async function checkPurchaseStatus(
  userId: string,
  courseId: string
): Promise<ApiResponse<boolean>> {
  console.log('[PAYMENT] Checking purchase status:', { userId, courseId })

  return paymentFetch<boolean>(
    `/api/v1/payments/user/${userId}/course/${courseId}/status`,
    { method: 'GET' }
  )
}

/**
 * Get all courses purchased by a user
 * Returns array of course details they've paid for
 */
export async function getUserPurchasedCourses(
  userId: string
): Promise<ApiResponse<Array<any>>> {
  console.log('[PAYMENT] Fetching user purchased courses:', userId)

  return paymentFetch<Array<any>>(
    `/api/v1/payments/user/${userId}/courses`,
    { method: 'GET' }
  )
}

/**
 * Get payment details by reference
 * Used to fetch specific payment record
 */
export async function getPaymentByReference(
  reference: string
): Promise<ApiResponse<any>> {
  console.log('[PAYMENT] Fetching payment by reference:', reference)

  return paymentFetch<any>(
    `/api/v1/payments/reference/${reference}`,
    { method: 'GET' }
  )
}

/**
 * Get all transactions for a user (immutable ledger)
 * Returns: PAYMENT, REFUND, CHARGEBACK, DISPUTE records
 */
export async function getUserTransactions(
  userId: string
): Promise<ApiResponse<Transaction[]>> {
  console.log('[PAYMENT] Fetching user transactions:', userId)

  return paymentFetch<Transaction[]>(
    `/api/v1/transactions/user/${userId}`,
    { method: 'GET' }
  )
}

/**
 * Get transaction summary for user
 * Returns: total spent, transaction count, averages
 */
export async function getTransactionSummary(
  userId: string
): Promise<ApiResponse<TransactionSummary>> {
  console.log('[PAYMENT] Fetching transaction summary:', userId)

  return paymentFetch<TransactionSummary>(
    `/api/v1/transactions/user/${userId}/summary`,
    { method: 'GET' }
  )
}

/**
 * Health check - verify payment service is running
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/health`, {
      method: 'GET',
    })
    return response.ok
  } catch (error) {
    console.error('❌ Payment service health check failed:', error)
    return false
  }
}

/**
 * Generate JWT token via server-to-server trust (no DB lookup on Java side)
 * 
 * NEW endpoint: POST /api/v1/auth/service-token?userId=&email=&name=
 * Auth:         X-Service-Secret header (server-side only — never NEXT_PUBLIC_)
 * Returns:      JWT valid for 7 days
 * 
 * ⚠️ MUST only be called from server actions / route handlers — never client code.
 */
export async function generatePaymentToken(
  userId: string,
  email: string,
  name?: string
): Promise<ApiResponse<{ token: string; userId: string; email: string; name: string; expiresIn: string }>> {
  console.log('[PAYMENT] Generating service token for userId:', userId)

  // Use server-side PAYMENT_SERVICE_URL (no NEXT_PUBLIC_ prefix) so the secret
  // base URL stays out of the client bundle. Fall back to the public var if unset.
  const serviceUrl =
    process.env.PAYMENT_SERVICE_URL ||
    process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL ||
    'http://localhost:8080'

  const serviceSecret = process.env.SERVICE_SECRET

  if (!serviceSecret) {
    console.error('[PAYMENT] ❌ SERVICE_SECRET env var is not set')
    return { success: false, error: 'Payment service is misconfigured (missing secret).' }
  }

  const params = new URLSearchParams({
    userId,
    email,
    name: name ?? '',
  })

  try {
    const response = await fetch(
      `${serviceUrl}/api/v1/auth/service-token?${params.toString()}`,
      {
        method: 'POST',
        headers: { 'X-Service-Secret': serviceSecret },
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      let errMsg = `Token service error: ${response.status}`
      try {
        const errData = await response.json()
        console.error('[PAYMENT] ❌ service-token error:', { status: response.status, errData })
        errMsg = errData?.message || errMsg
      } catch {}
      return { success: false, error: errMsg }
    }

    const body = await response.json()
    const token = body?.data?.token
    if (!token) {
      console.error('[PAYMENT] ❌ service-token response missing token:', body)
      return { success: false, error: 'Payment service returned no token.' }
    }

    console.log('[PAYMENT] ✓ Service token obtained')
    return { success: true, data: body.data }
  } catch (error) {
    console.error('[PAYMENT] ❌ service-token fetch failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error reaching payment service',
    }
  }
}

// ── Export all functions ────────────────────────────────────────────────────────

export const paymentApi = {
  initializePayment,
  verifyPayment,
  checkPurchaseStatus,
  getUserPurchasedCourses,
  getPaymentByReference,
  getUserTransactions,
  getTransactionSummary,
  healthCheck,
  generatePaymentToken,
}
