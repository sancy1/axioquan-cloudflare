// hooks/use-notifications.ts
// Manages in-app notification state: unread count polling, list fetching,
// mark-as-read, mark-all-read, and client-side soft-delete via localStorage.
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

  // initialise deleted IDs from localStorage after mount
  useEffect(() => {
    deletedIds.current = getDeletedIds()
  }, [])

  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications/count')
      if (res.ok) {
        const data = await res.json()
        setUnreadCount(data.unreadCount ?? 0)
      }
    } catch {
      // silently fail — count stays at previous value
    }
  }, [])

  const fetchList = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/notifications/list?page=0&size=30')
      if (res.ok) {
        const data: NotificationPage = await res.json()
        const deleted = getDeletedIds()
        deletedIds.current = deleted
        const filtered = (data.content ?? []).filter(n => !deleted.has(n.id))
        setNotifications(filtered)
        // keep badge in sync with the authoritative list data
        setUnreadCount(filtered.filter(n => !n.isRead).length)
      }
    } catch {
      // silently fail
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
      await fetch(`/api/notifications/${id}/read`, { method: 'PUT' })
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
      await fetch('/api/notifications/read-all', { method: 'PUT' })
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
      broadcastSync()
    } catch {
      // silently fail
    }
  }, [])

  const deleteNotification = useCallback((id: string) => {
    const ids = getDeletedIds()
    ids.add(id)
    saveDeletedIds(ids)
    deletedIds.current = ids

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
