// /hooks/use-purchase-status.ts
// Hook to check if user has already purchased a course
// Used to show correct button: "Enroll" or "Continue Learning"

import { useEffect, useState } from 'react'

export function usePurchaseStatus(userId: string, courseId: string) {
  const [isPurchased, setIsPurchased] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId || !courseId) {
      setLoading(false)
      return
    }

    const checkStatus = async () => {
      setLoading(true)
      setError(null)

      try {
        // This endpoint checks local cache + payment service
        const response = await fetch(`/api/payment/status?userId=${userId}&courseId=${courseId}`)
        const data = await response.json()

        if (response.ok && data.success) {
          setIsPurchased(data.data?.isPurchased || false)
        } else {
          console.warn('⚠ Could not check purchase status:', data.error)
          setIsPurchased(false)
        }
      } catch (err: any) {
        console.error('❌ Purchase status check error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    checkStatus()
  }, [userId, courseId])

  return { isPurchased, loading, error }
}
