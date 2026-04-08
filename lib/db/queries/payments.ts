// /lib/db/queries/payments.ts
// Database queries for shared payments table
// Multi-project database schema with multi-currency support
// Source of truth is Java/Spring Boot service, but we cache here for compliance & performance

import { sql } from '../index'
import { Payment } from '@/types/payments'

/**
 * Record a new payment initiation
 * Called when user starts payment flow (free or paid)
 * Status: PENDING for paid, SUCCESS for free
 */
export async function recordPaymentInitiation(input: {
  reference: string // Unique payment reference (PAY_XXX)
  user_id: string
  course_id: string
  amount_cents: number
  currency: string
  status: string // PENDING or SUCCESS
  payment_method?: string
  original_currency?: string
  original_amount_cents?: number
  exchange_rate?: number
  settlement_currency?: string
  metadata?: Record<string, any> // Additional data as JSON
}): Promise<{ success: boolean; paymentId?: string; error?: string }> {
  try {
    console.log('[DB] Recording payment initiation:', {
      reference: input.reference,
      user: input.user_id,
      course: input.course_id,
      status: input.status,
    })

    const result = await sql`
      INSERT INTO payments (
        reference,
        user_id,
        course_id,
        amount_cents,
        currency,
        original_currency,
        original_amount_cents,
        exchange_rate,
        settlement_currency,
        status,
        payment_method,
        metadata,
        created_at,
        updated_at
      ) VALUES (
        ${input.reference},
        ${input.user_id},
        ${input.course_id},
        ${input.amount_cents},
        ${input.currency},
        ${input.original_currency || input.currency},
        ${input.original_amount_cents ?? input.amount_cents},
        ${input.exchange_rate || null},
        ${input.settlement_currency || null},
        ${input.status},
        ${input.payment_method || null},
        ${input.metadata ? JSON.stringify(input.metadata) : null},
        NOW(),
        NOW()
      )
      RETURNING id
    `

    if (result.length > 0) {
      console.log('✓ Payment recorded:', result[0].id)
      return { success: true, paymentId: result[0].id }
    }

    return { success: false, error: 'Failed to insert payment record' }
  } catch (error: any) {
    console.error('❌ Error recording payment:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Update payment status with Paystack details
 * Called when payment is confirmed with Paystack
 */
export async function updatePaymentWithPaystack(input: {
  reference: string
  paystackReference: string // Transaction reference from Paystack
  paystackResponse?: any // Full Paystack API response
  status: string // SUCCESS, FAILED, etc
}): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('[DB] Updating payment with Paystack:', {
      reference: input.reference,
      paystackRef: input.paystackReference,
      status: input.status,
    })

    const result = await sql`
      UPDATE payments
      SET
        paystack_reference = ${input.paystackReference},
        paystack_response = ${input.paystackResponse ? JSON.stringify(input.paystackResponse) : null},
        status = ${input.status},
        paid_at = CASE WHEN ${input.status} = 'SUCCESS' THEN NOW() ELSE paid_at END,
        updated_at = NOW()
      WHERE reference = ${input.reference}
      RETURNING id
    `

    if (result.length > 0) {
      console.log('✓ Payment updated with Paystack details')
      return { success: true }
    }

    return { success: false, error: 'Payment record not found' }
  } catch (error: any) {
    console.error('❌ Error updating payment:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Update payment status to SUCCESS or FAILED
 */
export async function updatePaymentStatus(
  reference: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await sql`
      UPDATE payments
      SET
        status = ${status},
        paid_at = CASE WHEN ${status} = 'SUCCESS' THEN NOW() ELSE paid_at END,
        updated_at = NOW()
      WHERE reference = ${reference}
      RETURNING id
    `

    if (result.length > 0) {
      console.log('✓ Payment status updated to:', status)
      return { success: true }
    }

    return { success: false, error: 'Payment not found' }
  } catch (error: any) {
    console.error('❌ Error updating payment status:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get payment by reference
 * Used to check if payment exists and fetch details
 */
export async function getPaymentByReference(reference: string): Promise<Payment | null> {
  try {
    const result = await sql`
      SELECT *
      FROM payments
      WHERE reference = ${reference}
      LIMIT 1
    `

    return result.length > 0 ? (result[0] as Payment) : null
  } catch (error: any) {
    console.error('❌ Error fetching payment:', error)
    return null
  }
}

/**
 * Check if user has purchased a course (fast local query)
 * Returns boolean for purchase status check
 */
export async function hasUserPurchasedCourse(userId: string, courseId: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT id
      FROM payments
      WHERE 
        user_id = ${userId}
        AND course_id = ${courseId}
        AND status = 'SUCCESS'
      LIMIT 1
    `

    return result.length > 0
  } catch (error: any) {
    console.error('❌ Error checking purchase status:', error)
    return false
  }
}

/**
 * Get all payments for a user
 * Used for payment history page
 */
export async function getUserPayments(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<Payment[]> {
  try {
    const result = await sql`
      SELECT *
      FROM payments
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `

    return result as Payment[]
  } catch (error: any) {
    console.error('❌ Error fetching user payments:', error)
    return []
  }
}

/**
 * Get payment for user + course combo
 * Returns payment details if exists
 */
export async function getPaymentForCourse(
  userId: string,
  courseId: string
): Promise<Payment | null> {
  try {
    const result = await sql`
      SELECT *
      FROM payments
      WHERE 
        user_id = ${userId}
        AND course_id = ${courseId}
      ORDER BY created_at DESC
      LIMIT 1
    `

    return result.length > 0 ? (result[0] as Payment) : null
  } catch (error: any) {
    console.error('❌ Error fetching course payment:', error)
    return null
  }
}

/**
 * Get payment statistics for user
 * Total spent, count, average per payment
 */
export async function getUserPaymentStats(userId: string): Promise<{
  totalPaid: number
  successfulPayments: number
  failedPayments: number
  totalAmountCents: number
}> {
  try {
    const result = await sql`
      SELECT
        COUNT(*) FILTER (WHERE status = 'SUCCESS') as successful_count,
        COUNT(*) FILTER (WHERE status = 'FAILED') as failed_count,
        COALESCE(SUM(amount_cents), 0) as total_amount
      FROM payments
      WHERE user_id = ${userId} AND status = 'SUCCESS'
    `

    if (result.length > 0) {
      return {
        totalPaid: result[0].successful_count || 0,
        successfulPayments: result[0].successful_count || 0,
        failedPayments: result[0].failed_count || 0,
        totalAmountCents: result[0].total_amount || 0,
      }
    }

    return {
      totalPaid: 0,
      successfulPayments: 0,
      failedPayments: 0,
      totalAmountCents: 0,
    }
  } catch (error: any) {
    console.error('❌ Error fetching user payment stats:', error)
    return {
      totalPaid: 0,
      successfulPayments: 0,
      failedPayments: 0,
      totalAmountCents: 0,
    }
  }
}

/**
 * Mark payment as refunded
 */
export async function markPaymentAsRefunded(reference: string): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await sql`
      UPDATE payments
      SET
        status = 'REFUNDED',
        updated_at = NOW()
      WHERE reference = ${reference}
      RETURNING id
    `

    if (result.length > 0) {
      console.log('✓ Payment marked as refunded')
      return { success: true }
    }

    return { success: false, error: 'Payment not found' }
  } catch (error: any) {
    console.error('❌ Error marking payment as refunded:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Update notification status
 * Called after sending webhook notifications
 */
export async function updateNotificationStatus(input: {
  reference: string
  sent: boolean
  status: 'pending' | 'sent' | 'failed'
  error?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await sql`
      UPDATE payments
      SET
        notification_sent = ${input.sent},
        notification_sent_at = CASE WHEN ${input.sent} THEN NOW() ELSE notification_sent_at END,
        notification_status = ${input.status},
        notification_error = ${input.error || null},
        updated_at = NOW()
      WHERE reference = ${input.reference}
      RETURNING id
    `

    if (result.length > 0) {
      return { success: true }
    }

    return { success: false, error: 'Payment not found' }
  } catch (error: any) {
    console.error('❌ Error updating notification status:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get pending notifications
 * Payments that need webhook notification
 */
export async function getPendingNotifications(limit: number = 100): Promise<Payment[]> {
  try {
    const result = await sql`
      SELECT *
      FROM payments
      WHERE 
        status = 'SUCCESS'
        AND (notification_sent = false OR notification_sent IS NULL)
      ORDER BY paid_at DESC
      LIMIT ${limit}
    `

    return result as Payment[]
  } catch (error: any) {
    console.error('❌ Error fetching pending notifications:', error)
    return []
  }
}

/**
 * Get recent payments for analytics
 * For dashboard revenue metrics
 */
export async function getRecentPayments(days: number = 30, limit: number = 100): Promise<Payment[]> {
  try {
    const result = await sql`
      SELECT *
      FROM payments
      WHERE 
        status = 'SUCCESS'
        AND created_at >= NOW() - INTERVAL '${days} days'
      ORDER BY created_at DESC
      LIMIT ${limit}
    `

    return result as Payment[]
  } catch (error: any) {
    console.error('❌ Error fetching recent payments:', error)
    return []
  }
}
