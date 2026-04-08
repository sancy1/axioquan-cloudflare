// /hooks/use-initialize-payment.ts
// Hook to initialize payment for a course
// Handles both free and paid course initialization

import { useState } from 'react'

interface InitializePaymentResponse {
  paymentReference: string
  checkoutUrl?: string
  status: 'FREE_COURSE_SUCCESS' | 'AWAITING_PAYMENT'
}

export function useInitializePayment() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initialize = async (courseId: string): Promise<InitializePaymentResponse | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to initialize payment')
        return null
      }

      return data.data
    } catch (err: any) {
      const message = err.message || 'Network error'
      setError(message)
      console.error('❌ Payment initialization error:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { initialize, loading, error }
}
