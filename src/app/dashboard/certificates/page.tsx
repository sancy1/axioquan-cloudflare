
// // /app/dashboard/certificates/page.tsx

// import { getSession } from '@/lib/auth/session'
// import Sidebar from '@/components/dashboard/sidebar'
// import StudentCertificatesPage from '@/components/dashboard/student-certificates-page'

// export default async function Certificates() {
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
//     primaryRole: session.primaryRole || 'student',
//     roles: session.roles || [], // Added roles array
//     image: session.image || undefined
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar user={user} />
//       <main className="flex-1 overflow-auto">
//         <StudentCertificatesPage />
//       </main>
//     </div>
//   )
// }























// /src/app/dashboard/certificates/page.tsx

import { getSession } from '@/lib/auth/session'
import Sidebar from '@/components/dashboard/sidebar'
import StudentCertificatesPage from '@/components/dashboard/student-certificates-page'
import { redirect } from 'next/navigation'

export default async function Certificates() {
  const session = await getSession()

  if (!session || !session.userId) {
    redirect('/login')
  }

  const user = {
    id: session.userId,
    name: session.name || 'User',
    email: session.email || 'user@example.com',
    primaryRole: session.primaryRole || 'student',
    roles: session.roles || [],
    image: session.image || undefined,
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} />
      <main className="flex-1 overflow-auto">
        <StudentCertificatesPage />
      </main>
    </div>
  )
}
