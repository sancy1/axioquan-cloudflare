
// src/app/dashboard/inbox/notifications/page.tsx
// Screen 03 — Full notifications page
// Shows all message notifications grouped by date
// Mark individual or all as read
// Matches design: dark surface, date dividers, unread dots, checkmark buttons

import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import NotificationsClient from '@/components/messaging/notifications-client'

export default async function NotificationsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div className="inbox-fullbleed h-screen">
      <NotificationsClient
        currentUserId={session.userId}
        currentUserRole={session.primaryRole}
      />
    </div>
  )
}