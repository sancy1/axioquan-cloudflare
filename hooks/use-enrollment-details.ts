// /hooks/use-enrollment-details.ts
// Hook to get enrollment details for a user + course
// Shows progress, status, paid status, etc.

import { useEffect, useState } from 'react'

interface EnrollmentDetails {
  enrollmentId: string
  courseId: string
  userId: string
  status: string
  progressPercentage: number
  isPaid: boolean
  enrolledAt: string
  completedLessons: number
  totalLessons: number
  averageQuizScore?: number
}

export function useEnrollmentDetails(userId: string, courseId: string) {
  const [enrollment, setEnrollment] = useState<EnrollmentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId || !courseId) {
      setLoading(false)
      return
    }

    const fetchEnrollment = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch enrollment details by userId + courseId (not by enrollmentId)
        const response = await fetch(
          `/api/enrollments?userId=${userId}&courseId=${courseId}`
        )
        const data = await response.json()

        if (response.ok && data.success) {
          setEnrollment(data.data)
        } else {
          console.warn('⚠ Enrollment not found:', data.error)
          setEnrollment(null)
        }
      } catch (err: any) {
        console.error('❌ Enrollment fetch error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEnrollment()
  }, [userId, courseId])

  return { enrollment, loading, error }
}
