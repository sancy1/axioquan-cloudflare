
// // /app/dashboard/instructor/earnings/page.tsx

// import { getSession } from '@/lib/auth/session'
// import Sidebar from '@/components/dashboard/sidebar'

// export default async function InstructorEarnings() {
//   const session = await getSession()
  
//   if (!session || !session.userId) {
//     return (
//       <div className="flex min-h-screen bg-gray-50 items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized</h1>
//           <p className="text-gray-600">Please log in to access this page.</p>
//         </div>
//       </div>
//     )
//   }

//   const user = {
//     id: session.userId,
//     name: 'Instructor User',
//     email: 'instructor@example.com',
//     primaryRole: session.primaryRole || 'instructor',
//     image: undefined
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar user={user} />
//       <main className="flex-1 overflow-auto p-8">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Earnings & Reports</h1>
//           <p className="text-gray-600 mb-8">View your earnings and performance reports</p>
          
//           <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
//             <div className="text-6xl mb-4">💰</div>
//             <h2 className="text-xl font-semibold text-gray-900 mb-2">Earnings Dashboard</h2>
//             <p className="text-gray-600">
//               Earnings reports, revenue analytics, and payment information will be displayed here.
//             </p>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }


























// // /app/dashboard/instructor/earnings/page.tsx

// import { getSession } from '@/lib/auth/session'
// import Sidebar from '@/components/dashboard/sidebar'

// export default async function InstructorEarnings() {
//   const session = await getSession()
  
//   if (!session || !session.userId) {
//     return (
//       <div className="flex min-h-screen bg-gray-50 items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized</h1>
//           <p className="text-gray-600">Please log in to access this page.</p>
//         </div>
//       </div>
//     )
//   }

//   // FIXED: Create user object from actual session data
//   const user = {
//     id: session.userId,
//     name: session.name || 'User', // Use session.name instead of hardcoded
//     email: session.email || 'user@example.com', // Use session.email
//     primaryRole: session.primaryRole || 'instructor',
//     roles: session.roles || [], // Added roles array
//     image: session.image || undefined
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar user={user} />
//       <main className="flex-1 overflow-auto p-8">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Earnings & Reports</h1>
//           <p className="text-gray-600 mb-8">View your earnings and performance reports</p>
          
//           <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
//             <div className="text-6xl mb-4">💰</div>
//             <h2 className="text-xl font-semibold text-gray-900 mb-2">Earnings Dashboard</h2>
//             <p className="text-gray-600">
//               Earnings reports, revenue analytics, and payment information will be displayed here.
//             </p>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }























'use client'

// /app/dashboard/instructor/earnings/page.tsx
// Instructor Earnings Dashboard

import { useEffect, useState, useCallback } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DollarSign,
  Users,
  BookOpen,
  CreditCard,
  Search,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Filter,
  Calendar,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

interface Student {
  name: string | null
  email: string
  username: string | null
  image: string | null
}

interface Course {
  title: string | null
  slug: string | null
  thumbnail: string | null
}

interface Payment {
  paymentId: string
  reference: string
  userId: string
  courseId: string
  amountCents: number
  currency: string
  originalAmountCents: number
  originalCurrency: string
  status: string
  paymentMethod: string | null
  paidAt: string | null
  createdAt: string
  student: Student
  course: Course
}

interface Summary {
  totalStudents: number
  totalCourses: number
  totalPayments: number
  totalEarningsCents: number
  totalOriginalEarningsCents: number
}

interface CourseEarning {
  courseId: string
  courseTitle: string | null
  courseSlug: string | null
  paymentCount: number
  studentCount: number
  totalEarningsCents: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(cents: number, currency: string = 'NGN'): string {
  const amount = cents / 100
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function initials(student: Student): string {
  const n = student.name || student.username || student.email
  return n.slice(0, 2).toUpperCase()
}

function statusColor(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'SUCCESS':
      return 'default'
    case 'PENDING':
      return 'secondary'
    case 'FAILED':
      return 'destructive'
    case 'REFUNDED':
      return 'outline'
    case 'CANCELLED':
      return 'destructive'
    default:
      return 'outline'
  }
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function InstructorEarnings() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [courseEarnings, setCourseEarnings] = useState<CourseEarning[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter states
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [courseFilter, setCourseFilter] = useState<string>('all')

  // ─── Load earnings data ───────────────────────────────────────────────────
  const loadEarnings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/instructor/earnings')
      const data = await res.json()
      if (data.success) {
        setSummary(data.summary)
        setPayments(data.payments)
        setCourseEarnings(data.courseEarnings)
      } else {
        setError(data.error || 'Failed to load earnings data.')
      }
    } catch {
      setError('Network error. Could not load earnings data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEarnings()
  }, [loadEarnings])

  // ─── Filtered payments ─────────────────────────────────────────────────────
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.student.name?.toLowerCase().includes(search.toLowerCase()) ||
      payment.student.email.toLowerCase().includes(search.toLowerCase()) ||
      payment.student.username?.toLowerCase().includes(search.toLowerCase()) ||
      payment.course.title?.toLowerCase().includes(search.toLowerCase()) ||
      payment.reference.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    const matchesCourse = courseFilter === 'all' || payment.courseId === courseFilter

    return matchesSearch && matchesStatus && matchesCourse
  })

  // ─── Calculate filtered totals ─────────────────────────────────────────────
  const filteredTotalEarnings = filteredPayments
    .filter((p) => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + p.amountCents, 0)

  const filteredTotalPayments = filteredPayments.length

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Earnings & Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? 'Loading…' : `Track your course revenue and student payments`}
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={loadEarnings} title="Refresh">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Summary Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      ) : summary ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Earnings */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Total Earnings</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {formatCurrency(summary.totalEarningsCents, 'NGN')}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {summary.totalPayments} total payments
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Students */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Students</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {summary.totalStudents}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Unique paying students
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Courses */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Courses Sold</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                  {summary.totalCourses}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  Courses with payments
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Average per Course */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Avg. per Course</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">
                  {summary.totalCourses > 0
                    ? formatCurrency(summary.totalEarningsCents / summary.totalCourses, 'NGN')
                    : formatCurrency(0, 'NGN')}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  Revenue per course
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Course Earnings Breakdown */}
      {!loading && courseEarnings.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings by Course</h3>
          <div className="space-y-3">
            {courseEarnings.map((course) => (
              <div
                key={course.courseId}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{course.courseTitle}</p>
                  <p className="text-sm text-gray-600">
                    {course.studentCount} students • {course.paymentCount} payments
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(course.totalEarningsCents, 'NGN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      {!loading && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student, course, or reference…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courseEarnings.map((course) => (
                  <SelectItem key={course.courseId} value={course.courseId}>
                    {course.courseTitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Filtered Summary */}
      {!loading && filteredPayments.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-900">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">
              Showing {filteredTotalPayments} payments totaling{' '}
              <span className="font-bold">{formatCurrency(filteredTotalEarnings, 'NGN')}</span>
            </span>
          </div>
        </div>
      )}

      {/* Payments Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
          <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium">No payments found</p>
          <p className="text-sm mt-1">
            {payments.length === 0
              ? "You haven't received any payments yet."
              : "Try adjusting your filters or search terms."}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Student</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Course</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Payment Method</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredPayments.map((payment) => (
                <tr key={payment.paymentId} className="hover:bg-gray-50 transition-colors">
                  {/* Student */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 shrink-0 border border-gray-200">
                        {payment.student.image && (
                          <AvatarImage src={payment.student.image} alt={payment.student.name || payment.student.username} />
                        )}
                        <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                          {initials(payment.student)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {payment.student.name || payment.student.username}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{payment.student.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Course */}
                  <td className="px-4 py-3">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate max-w-48" title={payment.course.title || ''}>
                        {payment.course.title || 'Unknown Course'}
                      </p>
                      {payment.course.thumbnail && (
                        <img
                          src={payment.course.thumbnail}
                          alt=""
                          className="h-8 w-12 object-cover rounded mt-1"
                        />
                      )}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(payment.amountCents, payment.currency)}
                      </span>
                      {payment.originalCurrency !== payment.currency && (
                        <span className="text-xs text-muted-foreground">
                          {formatCurrency(payment.originalAmountCents, payment.originalCurrency)}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Payment Method */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700 capitalize">
                        {payment.paymentMethod || '—'}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-xs whitespace-nowrap">
                        {formatDate(payment.paidAt || payment.createdAt)}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <Badge variant={statusColor(payment.status)} className="text-xs font-medium">
                      {payment.status}
                    </Badge>
                  </td>

                  {/* Reference */}
                  <td className="px-4 py-3">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                      {payment.reference.slice(0, 12)}...
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}