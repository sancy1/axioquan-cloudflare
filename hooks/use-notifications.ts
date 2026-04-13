// hooks/use-notifications.ts
// Manages in-app notification state: unread count polling, list fetching,
// mark-as-read, mark-all-read, and delete — all via the C# notification service.
// Multiple hook instances stay in sync via a window broadcast event.

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Notification } from '@/types/notifications'

const POLL_INTERVAL = 30_000
const SYNC_EVENT = 'notifications:sync'

function broadcastSync(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SYNC_EVENT))
  }
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const notificationsRef = useRef<Notification[]>([])

  // Keep ref in sync with state
  useEffect(() => {
    notificationsRef.current = notifications
  }, [notifications])

  // Poll C# count (cheap, non-breaking).
  // When the panel opens, fetchList syncs the exact count.
  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch('/api/csharp-notifications/count')
      if (res.ok) {
        const data = await res.json()
        setUnreadCount(data.unreadCount ?? 0)
      } else {
        console.warn('[Notifications] Count route returned', res.status)
      }
    } catch (err) {
      console.error('[Notifications] fetchCount failed:', err)
    }
  }, [])

  const fetchList = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/csharp-notifications/list?page=0&size=30')
      if (!res.ok) return

      const data = await res.json()
      const notifs: Notification[] = (data.content ?? []).map(
        (n: Notification) => ({ ...n, source: 'csharp' as const })
      )

      setNotifications(notifs)
      setUnreadCount(data.unreadCount ?? notifs.filter(n => !n.isRead).length)
    } catch (err) {
      console.error('[Notifications] fetchList unexpected error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Poll unread count on mount and every 30 seconds
  useEffect(() => {
    fetchCount()
    const interval = setInterval(fetchCount, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchCount])

  // Reload count when another hook instance broadcasts a change
  useEffect(() => {
    const handler = () => fetchCount()
    window.addEventListener(SYNC_EVENT, handler)
    return () => window.removeEventListener(SYNC_EVENT, handler)
  }, [fetchCount])

  // Fetch full list whenever the panel is opened
  useEffect(() => {
    if (isPanelOpen) fetchList()
  }, [isPanelOpen, fetchList])

  // ── Actions ────────────────────────────────────────────────────────────────

  const markAsRead = useCallback(async (id: string) => {
    try {
      await fetch(`/api/csharp-notifications/${id}/read`, { method: 'PUT' })
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
      broadcastSync()
    } catch {
      // silently fail
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      await fetch('/api/csharp-notifications/read-all', { method: 'PUT' })
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
      broadcastSync()
    } catch {
      // silently fail
    }
  }, [])

  const deleteNotification = useCallback((id: string) => {
    // Server-side delete for C# notifications (fire-and-forget)
    fetch(`/api/csharp-notifications/${id}`, { method: 'DELETE' }).catch(() => {})

    setNotifications(prev => {
      const removed = prev.find(n => n.id === id)
      if (removed && !removed.isRead) {
        setUnreadCount(c => Math.max(0, c - 1))
        broadcastSync()
      }
      return prev.filter(n => n.id !== id)
    })
  }, [])

  const togglePanel = useCallback(() => setIsPanelOpen(p => !p), [])
  const closePanel = useCallback(() => setIsPanelOpen(false), [])

  return {
    notifications,
    unreadCount,
    isLoading,
    isPanelOpen,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: fetchList,
    togglePanel,
    closePanel,
  }
}
