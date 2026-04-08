// /hooks/use-verify-payment.ts
// Hook to verify payment after user returns from Paystack

import { useEffect, useState } from 'react'

interface VerifyPaymentResponse {
  enrollmentId: string
  courseId: string
  status: 'SUCCESS' | 'FAILED' | 'PENDING'
}

export function useVerifyPayment(reference: string | null) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'verify-pending' | 'success' | 'failed'>('verify-pending')
  const [data, setData] = useState<VerifyPaymentResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!reference) return

    const verify = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/payment/verify?reference=${reference}`)
        const jsonData = await response.json()

        if (!response.ok || !jsonData.success) {
          setError(jsonData.error || 'Payment verification failed')
          setStatus('failed')
          return
        }

        setData(jsonData.data)
        setStatus(jsonData.data?.status === 'SUCCESS' ? 'success' : 'failed')
      } catch (err: any) {
        const message = err.message || 'Network error'
        setError(message)
        setStatus('failed')
        console.error('❌ Payment verification error:', err)
      } finally {
        setLoading(false)
      }
    }

    verify()
  }, [reference])

  return { data, loading, status, error }
}
