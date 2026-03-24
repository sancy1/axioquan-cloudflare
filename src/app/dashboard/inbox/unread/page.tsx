
// src/app/dashboard/inbox/unread/page.tsx
// Screen 07 — Unread messages focused view
// Shows only unread notifications across all conversations
// Mark individual or all as read

import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import NotificationsClient from '@/components/messaging/notifications-client'

export default async function UnreadPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div className="inbox-fullbleed h-screen">
      <NotificationsClient
        currentUserId={session.userId}
        currentUserRole={session.primaryRole}
        defaultFilter="unread"
      />
    </div>
  )
}