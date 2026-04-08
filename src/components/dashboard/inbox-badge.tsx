
// src/components/dashboard/inbox-badge.tsx
// Client component — shows unread count badge on Inbox sidebar link
// Kept separate so the sidebar (server-safe) does not need to become a client component

'use client'

import { useInboxUnreadCount } from '@/hooks/use-inbox-unread-count'

export function InboxBadge() {
  const count = useInboxUnreadCount()
  if (count === 0) return null
  return (
    <span className="ml-auto min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-1 flex-shrink-0">
      {count > 99 ? '99+' : count}
    </span>
  )
}