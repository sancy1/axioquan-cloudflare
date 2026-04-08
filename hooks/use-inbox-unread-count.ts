
// // src/hooks/use-inbox-unread-count.ts
// 'use client'

// import { useState, useEffect, useCallback } from 'react'

// export function useInboxUnreadCount() {
//   const [count, setCount] = useState(0)

//   const fetchCount = useCallback(async () => {
//     try {
//       const res  = await fetch('/api/messaging/proxy/conversations?limit=50', {
//         cache: 'no-store',
//       })
//       const data = await res.json()
//       if (data.success && Array.isArray(data.data)) {
//         const unread = data.data.filter((c: {
//           lastMessageAt: string | null
//           lastReadAt:    string | null
//         }) => {
//           if (!c.lastMessageAt) return false
//           if (!c.lastReadAt) return true
//           return new Date(c.lastMessageAt) > new Date(c.lastReadAt)
//         }).length
//         setCount(unread)
//       }
//     } catch {
//       // silent
//     }
//   }, [])

//   useEffect(() => { fetchCount() }, [fetchCount])

//   useEffect(() => {
//     const interval = window.setInterval(fetchCount, 60_000)
//     return () => window.clearInterval(interval)
//   }, [fetchCount])

//   useEffect(() => {
//     const handler = () => fetchCount()
//     window.addEventListener('messaging:new-message',       handler)
//     window.addEventListener('messaging:conversation-read', handler)
//     window.addEventListener('messaging:notification-read', handler)
//     return () => {
//       window.removeEventListener('messaging:new-message',       handler)
//       window.removeEventListener('messaging:conversation-read', handler)
//       window.removeEventListener('messaging:notification-read', handler)
//     }
//   }, [fetchCount])

//   return count
// }

















// src/hooks/use-inbox-unread-count.ts
// Counts UNREAD NOTIFICATIONS for sidebar Inbox badge
// Uses notifications endpoint — notifications only exist for receivers
// This naturally excludes senders from getting their own alert
// FIXED: sender no longer gets alerted for their own messages

'use client'

import { useState, useEffect, useCallback } from 'react'

export function useInboxUnreadCount() {
  const [count, setCount] = useState(0)

  const fetchCount = useCallback(async () => {
    try {
      const res  = await fetch(
        '/api/messaging/proxy/notifications/count',
        { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } }
      )
      const data = await res.json()
      if (data.success) {
        setCount(data.data?.count ?? 0)
      }
    } catch {
      // silent
    }
  }, [])

  useEffect(() => { fetchCount() }, [fetchCount])

  useEffect(() => {
    const interval = window.setInterval(fetchCount, 60_000)
    return () => window.clearInterval(interval)
  }, [fetchCount])

  useEffect(() => {
    const handler = () => fetchCount()
    window.addEventListener('messaging:new-message',       handler)
    window.addEventListener('messaging:conversation-read', handler)
    window.addEventListener('messaging:notification-read', handler)
    return () => {
      window.removeEventListener('messaging:new-message',       handler)
      window.removeEventListener('messaging:conversation-read', handler)
      window.removeEventListener('messaging:notification-read', handler)
    }
  }, [fetchCount])

  return count
}