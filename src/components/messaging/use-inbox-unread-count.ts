
// src/hooks/use-inbox-unread-count.ts
// Fetches unread conversation count for the dashboard sidebar badge
// Lightweight — just counts conversations where lastMessageAt > lastReadAt
// Refreshes every 60 seconds and on messaging events

'use client'

import { useState, useEffect, useCallback } from 'react'

export function useInboxUnreadCount() {
  const [count, setCount] = useState(0)

  const fetchCount = useCallback(async () => {
    try {
      const res  = await fetch('/api/messaging/proxy/conversations?limit=50', {
        cache: 'no-store',
      })
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        const unread = data.data.filter((c: {
          lastMessageAt: string | null
          lastReadAt:    string | null
        }) => {
          if (!c.lastMessageAt) return false
          if (!c.lastReadAt) return true
          return new Date(c.lastMessageAt) > new Date(c.lastReadAt)
        }).length
        setCount(unread)
      }
    } catch {
      // silently fail
    }
  }, [])

  useEffect(() => {
    fetchCount()
  }, [fetchCount])

  // Refresh every 60 seconds
  useEffect(() => {
    const interval = window.setInterval(fetchCount, 60_000)
    return () => window.clearInterval(interval)
  }, [fetchCount])

  // Refresh when a message is read or received
  useEffect(() => {
    const handler = () => fetchCount()
    window.addEventListener('messaging:new-message', handler)
    window.addEventListener('messaging:conversation-read', handler)
    window.addEventListener('messaging:notification-read', handler)
    return () => {
      window.removeEventListener('messaging:new-message', handler)
      window.removeEventListener('messaging:conversation-read', handler)
      window.removeEventListener('messaging:notification-read', handler)
    }
  }, [fetchCount])

  return count
}