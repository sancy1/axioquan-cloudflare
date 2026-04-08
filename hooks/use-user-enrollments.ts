// /hooks/use-user-enrollments.ts
// Hook to fetch all enrollments for a user (for "My Courses" dashboard)
// Shows all courses user is enrolled in with progress data

import { useEffect, useState } from 'react'

interface UserEnrollment {
  enrollmentId: string
  courseId: string
  courseTitle: string
  thumbnailUrl?: string
  status: string
  progressPercentage: number
  completedLessons: number
  totalLessons: number
  timeSpentMinutes: number
  isPaid: boolean
  enrolledAt: string
}

export function useUserEnrollments(userId: string) {
  const [enrollments, setEnrollments] = useState<UserEnrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchEnrollments = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/enrollments/user/${userId}`)
        const data = await response.json()

        if (response.ok && data.success) {
          setEnrollments(data.data || [])
        } else {
          console.warn('⚠ Could not fetch enrollments:', data.error)
          setEnrollments([])
        }
      } catch (err: any) {
        console.error('❌ Enrollments fetch error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEnrollments()
  }, [userId])

  return { enrollments, loading, error }
}
