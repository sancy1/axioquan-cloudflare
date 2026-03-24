// // src/app/dashboard/inbox/page.tsx
// // Server component — fetches conversations server-side
// // FIXED: calls messag API directly (server-to-server, no CORS)
// // instead of going through the Next.js proxy (which fails on Render)

// import { getSession } from '@/lib/auth/session'
// import { redirect } from 'next/navigation'
// import { SignJWT } from 'jose'
// import InboxLayout from '@/components/messaging/inbox-layout'

// const JWT_SECRET = new TextEncoder().encode(
//   process.env.MESSAGING_JWT_SECRET || ''
// )

// const MESSAGING_API_URL = process.env.NEXT_PUBLIC_MESSAGING_API_URL
//   || 'https://messag-api-dev.onrender.com'

// async function getMessagingToken(session: {
//   userId: string
//   email: string
//   primaryRole: string
// }): Promise<string> {
//   return new SignJWT({
//     userId: session.userId,
//     email:  session.email,
//     role:   session.primaryRole,
//   })
//     .setProtectedHeader({ alg: 'HS256' })
//     .setIssuedAt()
//     .setExpirationTime('7d')
//     .sign(JWT_SECRET)
// }

// async function fetchConversations(token: string) {
//   try {
//     // Call messag API directly — server-to-server, no CORS issue
//     const res = await fetch(
//       `${MESSAGING_API_URL}/api/conversations?limit=50`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//         cache:   'no-store',
//       }
//     )
//     if (!res.ok) {
//       console.error('fetchConversations failed:', res.status, res.statusText)
//       return []
//     }
//     const data = await res.json()
//     return data.success ? data.data : []
//   } catch (err) {
//     console.error('fetchConversations error:', err)
//     return []
//   }
// }

// export default async function InboxPage() {
//   const session = await getSession()
//   if (!session) redirect('/login')

//   const token         = await getMessagingToken(session)
//   const conversations = await fetchConversations(token)

//   // Deduplicate by conversation id
//   const seen   = new Set<string>()
//   const unique = conversations.filter((c: { id: string }) => {
//     if (seen.has(c.id)) return false
//     seen.add(c.id)
//     return true
//   })

//   return (
//     <div className="inbox-fullbleed h-screen">
//       <InboxLayout
//         initialConversations={unique}
//         currentUserId={session.userId}
//         currentUserName={session.name}
//         currentUserImage={session.image}
//         currentUserRole={session.primaryRole}
//       />
//     </div>
//   )
// }





















// src/app/dashboard/inbox/page.tsx
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { SignJWT } from 'jose'
import InboxLayout from '@/components/messaging/inbox-layout'

const JWT_SECRET = new TextEncoder().encode(
  process.env.MESSAGING_JWT_SECRET || ''
)

const MESSAGING_API_URL = process.env.NEXT_PUBLIC_MESSAGING_API_URL
  || 'https://messag-api-dev.onrender.com'

async function getMessagingToken(session: {
  userId: string
  email: string
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
      `${MESSAGING_API_URL}/api/conversations?limit=50`,
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

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ conversation?: string }>
}) {
  const session = await getSession()
  if (!session) redirect('/login')

  const params            = await searchParams
  const initialActiveId   = params.conversation ?? null

  const token         = await getMessagingToken(session)
  const conversations = await fetchConversations(token)

  const seen   = new Set<string>()
  const unique = conversations.filter((c: { id: string }) => {
    if (seen.has(c.id)) return false
    seen.add(c.id)
    return true
  })

  return (
    <div className="inbox-fullbleed h-screen">
      <InboxLayout
        initialConversations={unique}
        currentUserId={session.userId}
        currentUserName={session.name}
        currentUserImage={session.image}
        currentUserRole={session.primaryRole}
        initialActiveConversationId={initialActiveId}
      />
    </div>
  )
}