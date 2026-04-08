
// src/app/dashboard/inbox/courses/page.tsx
// Screen 05 — Course Discussions page
// Server component — fetches conversations directly from messag API
// Passes conversations to CourseDiscussions client component

import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { SignJWT } from 'jose'
import CourseDiscussions from '@/components/messaging/course-discussions'

const JWT_SECRET = new TextEncoder().encode(
  process.env.MESSAGING_JWT_SECRET || ''
)

const MESSAGING_API_URL =
  process.env.NEXT_PUBLIC_MESSAGING_API_URL ||
  'https://messag-api-dev.onrender.com'

async function getMessagingToken(session: {
  userId:      string
  email:       string
  primaryRole: string
}): Promise<string> {
  return new SignJWT({
    userId: session.userId,
    email:  session.email,
    role:   session.primaryRole,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

async function fetchConversations(token: string) {
  try {
    const res = await fetch(
      `${MESSAGING_API_URL}/api/conversations?limit=100`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache:   'no-store',
      }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.success ? data.data : []
  } catch (err) {
    console.error('fetchConversations error:', err)
    return []
  }
}

export default async function CoursesPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const token         = await getMessagingToken(session)
  const conversations = await fetchConversations(token)

  // Deduplicate
  const seen   = new Set<string>()
  const unique = conversations.filter((c: { id: string }) => {
    if (seen.has(c.id)) return false
    seen.add(c.id)
    return true
  })

  return (
    <div className="inbox-fullbleed h-screen">
      <CourseDiscussions
        initialConversations={unique}
        currentUserId={session.userId}
      />
    </div>
  )
}