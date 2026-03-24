
// // src/hooks/use-notification-count.ts
// // Fetches real unread notification count from messag API
// // Refreshes every 30 seconds and on WebSocket new message event
// // Used by bell badge in inbox topbar and dashboard header

// 'use client'

// import { useState, useEffect, useCallback } from 'react'

// export function useNotificationCount() {
//   const [count, setCount]       = useState(0)
//   const [loading, setLoading]   = useState(true)

//   const fetchCount = useCallback(async () => {
//     try {
//       const res  = await fetch('/api/messaging/proxy/notifications/count')
//       const data = await res.json()
//       if (data.success) setCount(data.data?.count ?? 0)
//     } catch {
//       // silently fail — count stays at previous value
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   // Fetch on mount
//   useEffect(() => {
//     fetchCount()
//   }, [fetchCount])

//   // Refresh every 30 seconds
//   useEffect(() => {
//     const interval = window.setInterval(fetchCount, 30_000)
//     return () => window.clearInterval(interval)
//   }, [fetchCount])

//   // Refresh when WebSocket delivers a new message
//   useEffect(() => {
//     const handler = () => fetchCount()
//     window.addEventListener('messaging:new-message', handler)
//     return () => window.removeEventListener('messaging:new-message', handler)
//   }, [fetchCount])

//   return { count, loading, refetch: fetchCount }
// }






















// // hooks/use-notification-count.ts
// // Fetches real unread notification count from messag API
// // Refreshes every 30 seconds, on WebSocket new message, and on manual mark-read

// 'use client'

// import { useState, useEffect, useCallback } from 'react'

// export function useNotificationCount() {
//   const [count, setCount]     = useState(0)
//   const [loading, setLoading] = useState(true)

//   const fetchCount = useCallback(async () => {
//     try {
//       const res  = await fetch('/api/messaging/proxy/notifications/count')
//       const data = await res.json()
//       if (data.success) setCount(data.data?.count ?? 0)
//     } catch {
//       // Silently fail — count stays at previous value
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   // ── Fetch on mount ────────────────────────────────────────────────────────
//   useEffect(() => {
//     fetchCount()
//   }, [fetchCount])

//   // ── Refresh every 30 seconds ──────────────────────────────────────────────
//   useEffect(() => {
//     const interval = window.setInterval(fetchCount, 30_000)
//     return () => window.clearInterval(interval)
//   }, [fetchCount])

//   // ── Refresh when WebSocket delivers a new message ─────────────────────────
//   useEffect(() => {
//     const handler = () => fetchCount()
//     window.addEventListener('messaging:new-message', handler)
//     return () => window.removeEventListener('messaging:new-message', handler)
//   }, [fetchCount])

//   // ── Refresh when notifications page manually marks items as read ──────────
//   // notifications-client.tsx dispatches this event after marking read
//   useEffect(() => {
//     const handler = () => fetchCount()
//     window.addEventListener('messaging:notification-read', handler)
//     return () => window.removeEventListener('messaging:notification-read', handler)
//   }, [fetchCount])

//   return { count, loading, refetch: fetchCount }
// }























// hooks/use-notification-count.ts
// Fetches real unread notification count from messag API
// Refreshes every 30 seconds, on WebSocket new message, and on manual mark-read
// FIXED: cache:no-store prevents stale count responses
// FIXED: immediate local reset when mark-read event fires

'use client'

import { useState, useEffect, useCallback } from 'react'

export function useNotificationCount() {
  const [count, setCount]     = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch('/api/messaging/proxy/notifications/count', {
        cache:   'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      })
      const data = await res.json()
      if (data.success) {
        setCount(data.data?.count ?? 0)
      }
    } catch {
      // Silently fail — count stays at previous value
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Fetch on mount ────────────────────────────────────────────────────────
  useEffect(() => {
    fetchCount()
  }, [fetchCount])

  // ── Refresh every 30 seconds ──────────────────────────────────────────────
  useEffect(() => {
    const interval = window.setInterval(fetchCount, 30_000)
    return () => window.clearInterval(interval)
  }, [fetchCount])

  // ── Refresh when WebSocket delivers a new message ─────────────────────────
  useEffect(() => {
    const handler = () => fetchCount()
    window.addEventListener('messaging:new-message', handler)
    return () => window.removeEventListener('messaging:new-message', handler)
  }, [fetchCount])

  // ── Reset to 0 immediately when user opens a conversation ─────────────────
  // inbox-layout fires this after successful mark-all-read API call
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      // If detail contains newCount use it, otherwise refetch
      if (typeof detail?.newCount === 'number') {
        setCount(detail.newCount)
      } else {
        fetchCount()
      }
    }
    window.addEventListener('messaging:notification-read', handler)
    return () => window.removeEventListener('messaging:notification-read', handler)
  }, [fetchCount])

  return { count, loading, refetch: fetchCount }
}