


// /app/dashboard/instructor/certificates/page.tsx

import { getSession } from '@/lib/auth/session'
import InstructorCertificatesPage from '@/components/dashboard/instructor-certificates-page'

export default async function InstructorCertificates() {
  const session = await getSession()
  
  if (!session || !session.userId) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized</h1>
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    )
  }

  // REMOVED: User object creation (handled by layout)
  // REMOVED: Sidebar import and usage

  return (
    // REMOVED: Outer div with Sidebar
    <InstructorCertificatesPage />
  )
}