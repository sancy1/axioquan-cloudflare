// hooks/use-notifications.ts
// Manages in-app notification state: unread count polling, list fetching,
// mark-as-read, mark-all-read, and client-side soft-delete via localStorage.
// Merges notifications from both the Java payment service and the C# notification service.
// Multiple hook instances stay in sync via a window broadcast event.

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Notification, NotificationPage } from '@/types/notifications'

const DELETED_KEY = 'axioquan-deleted-notifications'
const POLL_INTERVAL = 30_000
const SYNC_EVENT = 'notifications:sync'

function getDeletedIds(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(DELETED_KEY)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

function saveDeletedIds(ids: Set<string>): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(DELETED_KEY, JSON.stringify([...ids]))
  } catch {
    // storage full or unavailable — silently ignore
  }
}

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
  const deletedIds = useRef<Set<string>>(new Set())
  // Mirror of the notifications array — lets callbacks read current state
  // without stale closures or adding notifications to their dep arrays.
  const notificationsRef = useRef<Notification[]>([])

  // Keep ref in sync with state
  useEffect(() => {
    notificationsRef.current = notifications
  }, [notifications])

  // Initialise deleted IDs from localStorage after mount
  useEffect(() => {
    deletedIds.current = getDeletedIds()
  }, [])

  // Poll Java count only (cheap, non-breaking).
  // When the panel opens, fetchList syncs the exact merged count.
  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications/count')
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
      // allSettled — a C# failure can never suppress Java notifications
      const [javaResult, csResult] = await Promise.allSettled([
        fetch('/api/notifications/list?page=0&size=30'),
        fetch('/api/csharp-notifications/list?page=0&size=30'),
      ])

      const deleted = getDeletedIds()
      deletedIds.current = deleted

      let javaNotifs: Notification[] = []
      if (javaResult.status === 'fulfilled' && javaResult.value.ok) {
        try {
          const data: NotificationPage = await javaResult.value.json()
          javaNotifs = (data.content ?? [])
            .filter(n => !deleted.has(n.id))
            .map(n => ({ ...n, source: 'java' as const }))
        } catch (err) {
          console.error('[Notifications] Failed to parse Java list response:', err)
        }
      } else if (javaResult.status === 'rejected') {
        console.error('[Notifications] Java list fetch rejected:', javaResult.reason)
      } else if (javaResult.status === 'fulfilled') {
        console.warn('[Notifications] Java list route returned', javaResult.value.status)
      }

      let csNotifs: Notification[] = []
      if (csResult.status === 'fulfilled' && csResult.value.ok) {
        try {
          const data = await csResult.value.json()
          csNotifs = (data.content ?? []).map(
            (n: Notification) => ({ ...n, source: 'csharp' as const })
          )
        } catch (err) {
          console.error('[Notifications] Failed to parse C# list response:', err)
        }
      }

      // Merge and sort newest first
      const merged = [...javaNotifs, ...csNotifs].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )

      setNotifications(merged)
      // Derive accurate count from the authoritative merged list
      setUnreadCount(merged.filter(n => !n.isRead).length)
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
    const notif = notificationsRef.current.find(n => n.id === id)
    const endpoint =
      notif?.source === 'csharp'
        ? `/api/csharp-notifications/${id}/read`
        : `/api/notifications/${id}/read`
    try {
      await fetch(endpoint, { method: 'PUT' })
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
      // Fire both services in parallel; ignore individual failures
      await Promise.all([
        fetch('/api/notifications/read-all', { method: 'PUT' }),
        fetch('/api/csharp-notifications/read-all', { method: 'PUT' }),
      ])
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
      broadcastSync()
    } catch {
      // silently fail
    }
  }, [])

  const deleteNotification = useCallback((id: string) => {
    const notif = notificationsRef.current.find(n => n.id === id)

    if (notif?.source === 'csharp') {
      // Server-side delete for C# notifications (fire-and-forget)
      fetch(`/api/csharp-notifications/${id}`, { method: 'DELETE' }).catch(() => {})
    } else {
      // Client-side soft-delete for Java notifications (existing behaviour)
      const ids = getDeletedIds()
      ids.add(id)
      saveDeletedIds(ids)
      deletedIds.current = ids
    }

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
