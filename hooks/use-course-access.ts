// /hooks/use-course-access.ts
// Hook to check if user has access to a course
// Used for gating course content

import { useEffect, useState } from 'react'

export function useCourseAccess(userId: string, courseId: string) {
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId || !courseId) {
      setLoading(false)
      return
    }

    const checkAccess = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `/api/enrollments/check-access?userId=${userId}&courseId=${courseId}`
        )
        const data = await response.json()

        if (response.ok && data.success) {
          setHasAccess(data.data?.hasAccess || false)
        } else {
          console.warn('⚠ Could not check access:', data.error)
          setHasAccess(false)
        }
      } catch (err: any) {
        console.error('❌ Access check error:', err)
        setError(err.message)
        setHasAccess(false)
      } finally {
        setLoading(false)
      }
    }

    checkAccess()
  }, [userId, courseId])

  return { hasAccess, loading, error }
}
