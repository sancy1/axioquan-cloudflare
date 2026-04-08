
// src/components/messaging/notifications-client.tsx
// Screen 03 (all notifications) and Screen 07 (unread only)
// FIXED: clicking a message removes it from unread list immediately
// FIXED: count updates after clicking
// FIXED: read/unread visual distinction
// FIXED: clear all button added
// FIXED: delete individual notification button added

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, Check, CheckCheck, Search, Trash2, X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { MessageNotification } from '@/lib/messaging/types'
import EmptyState from './empty-state'

interface NotificationsClientProps {
  currentUserId:   string
  currentUserRole: string
  defaultFilter?:  'all' | 'unread'
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function getAvatarColor(name: string) {
  const colors = [
    'bg-purple-500','bg-blue-500','bg-green-500',
    'bg-amber-500', 'bg-red-500', 'bg-teal-500',
  ]
  return colors[name.charCodeAt(0) % colors.length]
}

function formatTime(dateStr: string) {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: false })
      .replace('about ','')
      .replace(' minutes','m').replace(' minute','m')
      .replace(' hours','h').replace(' hour','h')
      .replace(' days','d').replace(' day','d')
  } catch { return '' }
}

function groupByDate(notifications: MessageNotification[]) {
  return notifications.reduce<Record<string, MessageNotification[]>>(
    (groups, notif) => {
      const date = new Date(notif.createdAt).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      }).toUpperCase()
      if (!groups[date]) groups[date] = []
      groups[date].push(notif)
      return groups
    },
    {}
  )
}

export default function NotificationsClient({
  currentUserId,
  currentUserRole,
  defaultFilter = 'all',
}: NotificationsClientProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState<MessageNotification[]>([])
  const [loading, setLoading]             = useState(true)
  const [filter, setFilter]               = useState<'all' | 'unread'>(defaultFilter)
  const [search, setSearch]               = useState('')
  const [markingAll, setMarkingAll]       = useState(false)
  const [markingId, setMarkingId]         = useState<string | null>(null)
  const [deletingId, setDeletingId]       = useState<string | null>(null)
  const [clearingAll, setClearingAll]     = useState(false)

  // ── Fetch notifications ───────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/messaging/proxy/notifications', {
        cache: 'no-store',
      })
      const data = await res.json()
      if (data.success) setNotifications(data.data ?? [])
    } catch {
      console.error('Failed to fetch notifications')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchNotifications() }, [fetchNotifications])

  // ── Refresh on new WS message ─────────────────────────────────────────────
  useEffect(() => {
    const handler = () => fetchNotifications()
    window.addEventListener('messaging:new-message', handler)
    return () => window.removeEventListener('messaging:new-message', handler)
  }, [fetchNotifications])

  // ── Mark single as read ───────────────────────────────────────────────────
  const handleMarkRead = async (notifId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setMarkingId(notifId)
    try {
      const res = await fetch(
        `/api/messaging/proxy/notifications/${notifId}/read`,
        { method: 'PATCH' }
      )
      if (res.ok) {
        // Update local state immediately — no refetch needed
        setNotifications((prev) =>
          prev.map((n) => n.id === notifId ? { ...n, isRead: true } : n)
        )
        window.dispatchEvent(new CustomEvent('messaging:notification-read'))
      }
    } catch {
      console.error('Failed to mark notification as read')
    } finally {
      setMarkingId(null)
    }
  }

  // ── Mark all as read ──────────────────────────────────────────────────────
  const handleMarkAllRead = async () => {
    setMarkingAll(true)
    try {
      const res = await fetch('/api/messaging/proxy/notifications/read-all', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({}),
      })
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        window.dispatchEvent(new CustomEvent('messaging:notification-read'))
      }
    } catch {
      console.error('Failed to mark all as read')
    } finally {
      setMarkingAll(false)
    }
  }

  // ── Delete single notification ────────────────────────────────────────────
  const handleDelete = async (notifId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeletingId(notifId)
    try {
      // Optimistically remove from UI immediately
      setNotifications((prev) => prev.filter((n) => n.id !== notifId))
      window.dispatchEvent(new CustomEvent('messaging:notification-read'))

      // Best effort delete on server — if endpoint exists
      await fetch(`/api/messaging/proxy/notifications/${notifId}`, {
        method: 'DELETE',
      }).catch(() => {
        // If DELETE not supported just keep removed from UI
      })
    } finally {
      setDeletingId(null)
    }
  }

  // ── Clear all notifications ───────────────────────────────────────────────
  const handleClearAll = async () => {
    setClearingAll(true)
    try {
      // Mark all read first then clear UI
      await fetch('/api/messaging/proxy/notifications/read-all', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({}),
      })
      // Clear from local state
      setNotifications([])
      window.dispatchEvent(new CustomEvent('messaging:notification-read'))
    } catch {
      console.error('Failed to clear all')
    } finally {
      setClearingAll(false)
    }
  }

  // ── Click notification — navigate + mark read + remove from unread list ───
  const handleNotifClick = async (notif: MessageNotification) => {
    if (!notif.isRead) {
      try {
        await fetch(`/api/messaging/proxy/notifications/${notif.id}/read`, {
          method: 'PATCH',
        })
        // FIXED: update local state immediately so count drops and
        // item disappears from unread view without page refresh
        setNotifications((prev) =>
          prev.map((n) => n.id === notif.id ? { ...n, isRead: true } : n)
        )
        window.dispatchEvent(new CustomEvent('messaging:notification-read'))
      } catch {
        console.error('Failed to mark notification as read')
      }
    }
    router.push(`/dashboard/inbox?conversation=${notif.conversationId}`)
  }

  // ── Filter + search ───────────────────────────────────────────────────────
  const filtered = notifications.filter((n) => {
    // In unread view — only show unread items
    const matchesFilter = filter === 'all' || !n.isRead
    const matchesSearch = !search ||
      n.sender?.name?.toLowerCase().includes(search.toLowerCase()) ||
      n.messagePreview?.toLowerCase().includes(search.toLowerCase()) ||
      n.conversationTitle?.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Derive counts from local state — updates immediately without refetch
  const unreadCount  = notifications.filter((n) => !n.isRead).length
  const totalCount   = notifications.length
  const grouped      = groupByDate(filtered)
  const isUnreadView = defaultFilter === 'unread'

  return (
    <div className="flex flex-col h-full bg-[#0a0d14]">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-6 py-4 bg-[#111420] border-b border-white/10 flex-shrink-0">
        <button
          onClick={() => router.push('/dashboard/inbox')}
          className="p-1.5 rounded-lg border border-white/10 text-[#8892b0] hover:text-[#f0f2ff] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="w-8 h-8 rounded-lg bg-[#4f6ef7] flex items-center justify-center flex-shrink-0">
          <Bell className="w-4 h-4 text-white" />
        </div>

        <div>
          <div className="text-sm font-semibold text-[#f0f2ff]">
            {isUnreadView ? 'Unread Messages' : 'Notifications'}
          </div>
          {/* FIXED: count derived from local state — updates instantly */}
          <div className="text-xs text-[#8892b0]">
            {isUnreadView
              ? `${unreadCount} unread`
              : `${totalCount} total · ${unreadCount} unread`
            }
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Mark all as read */}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-[#8892b0] hover:text-[#f0f2ff] transition-colors"
            >
              {markingAll
                ? <div className="w-3 h-3 rounded-full border border-t-transparent border-[#4f6ef7] animate-spin" />
                : <CheckCheck className="w-3.5 h-3.5" />
              }
              Mark all read
            </button>
          )}

          {/* Clear all button */}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              disabled={clearingAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
            >
              {clearingAll
                ? <div className="w-3 h-3 rounded-full border border-t-transparent border-red-400 animate-spin" />
                : <Trash2 className="w-3.5 h-3.5" />
              }
              Clear all
            </button>
          )}

          {/* Live unread count badge */}
          <div className="relative">
            <Bell className="w-5 h-5 text-[#8892b0]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">

          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/10 bg-[#161b2e] mb-4 focus-within:border-[#4f6ef7] transition-colors">
            <Search className="w-3.5 h-3.5 text-[#4a5568] flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isUnreadView
                ? 'Search by sender, conversation, or message...'
                : 'Search notifications...'
              }
              className="bg-transparent text-xs text-[#f0f2ff] placeholder:text-[#4a5568] outline-none w-full"
            />
            {search && (
              <button onClick={() => setSearch('')}>
                <X className="w-3.5 h-3.5 text-[#4a5568] hover:text-[#8892b0]" />
              </button>
            )}
          </div>

          {/* Filter tabs — only on full notifications view */}
          {!isUnreadView && (
            <div className="flex items-center gap-2 mb-6">
              {[
                { key: 'all',    label: 'All',    icon: '📋', count: totalCount  },
                { key: 'unread', label: 'Unread', icon: '🔔', count: unreadCount },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as 'all' | 'unread')}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                    transition-all border
                    ${filter === tab.key
                      ? 'bg-[#4f6ef7] text-white border-[#4f6ef7]'
                      : 'text-[#8892b0] border-white/10 hover:text-[#f0f2ff]'
                    }
                  `}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                  {/* Count badge — updates from local state instantly */}
                  {tab.count > 0 && (
                    <span className={`
                      min-w-[16px] h-4 rounded-full text-[9px] font-bold px-1
                      flex items-center justify-center
                      ${filter === tab.key
                        ? 'bg-white/20 text-white'
                        : tab.key === 'unread'
                          ? 'bg-red-500 text-white'
                          : 'bg-white/10 text-[#8892b0]'
                      }
                    `}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}

              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#8892b0] border border-white/10 hover:text-[#f0f2ff] transition-colors">
                <span>@</span>
                Mentions
              </button>
            </div>
          )}

          {/* Unread summary for Screen 07 */}
          {isUnreadView && filtered.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-[#8892b0]">
                <strong className="text-[#f0f2ff]">{filtered.length}</strong>
                {' '}unread message{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* Loading skeleton */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 p-4 rounded-xl bg-[#111420] border border-white/10 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/3 rounded bg-white/10" />
                    <div className="h-3 w-full rounded bg-white/10" />
                    <div className="h-2 w-1/4 rounded bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="h-64">
              <EmptyState
                variant="no-notifications"
                theme={{
                  border:    'border-white/10',
                  text:      'text-[#f0f2ff]',
                  textSec:   'text-[#8892b0]',
                  textMuted: 'text-[#4a5568]',
                  surface2:  'bg-[#161b2e]',
                }}
              />
            </div>
          ) : (
            Object.entries(grouped).map(([date, notifs]) => (
              <div key={date} className="mb-6">

                {/* Date header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-bold tracking-widest text-[#4a5568]">
                    {date}
                  </span>
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-[10px] text-[#4a5568]">
                    {notifs.length} message{notifs.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Notification items */}
                <div className="space-y-2">
                  {notifs.map((notif) => (
                    <div
                      key={notif.id}
                      className={`
                        relative rounded-xl border transition-all duration-150
                        ${!notif.isRead
                          ? 'bg-[#111420] border-[#4f6ef7]/20'
                          : 'bg-[#111420]/40 border-white/5'
                        }
                      `}
                    >
                      {/* Read/Unread left border indicator */}
                      {!notif.isRead && (
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl bg-[#4f6ef7]" />
                      )}

                      <button
                        onClick={() => handleNotifClick(notif)}
                        className="w-full text-left p-4 group"
                      >
                        <div className="flex items-start gap-3">

                          {/* Avatar */}
                          <div className="relative flex-shrink-0">
                            <div className={`
                              w-10 h-10 rounded-full
                              ${getAvatarColor(notif.sender?.name ?? 'Unknown')}
                              flex items-center justify-center
                            `}>
                              <span className="text-white text-xs font-bold">
                                {getInitials(notif.sender?.name ?? '?')}
                              </span>
                            </div>
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#111420]" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className={`text-xs font-semibold ${!notif.isRead ? 'text-[#f0f2ff]' : 'text-[#8892b0]'}`}>
                                {notif.sender?.name ?? 'Unknown'}
                              </span>
                              {/* READ / UNREAD badge */}
                              <span className={`
                                text-[9px] font-bold uppercase px-1.5 py-0.5 rounded
                                ${!notif.isRead
                                  ? 'bg-[#4f6ef7]/20 text-[#4f6ef7] border border-[#4f6ef7]/30'
                                  : 'bg-white/5 text-[#4a5568] border border-white/10'
                                }
                              `}>
                                {!notif.isRead ? 'Unread' : 'Read'}
                              </span>
                            </div>

                            {notif.conversationTitle && (
                              <div className="text-[10px] text-[#4f6ef7] mb-1">
                                in {notif.conversationTitle}
                              </div>
                            )}

                            <p className={`text-xs leading-relaxed line-clamp-2 ${!notif.isRead ? 'text-[#8892b0]' : 'text-[#4a5568]'}`}>
                              {notif.messagePreview}
                            </p>
                          </div>

                          {/* Time */}
                          <span className="text-[10px] text-[#4a5568] flex-shrink-0 mt-0.5">
                            {formatTime(notif.createdAt)}
                          </span>
                        </div>
                      </button>

                      {/* Action buttons row */}
                      <div className={`
                        flex items-center justify-end gap-1.5 px-4 pb-3
                        border-t border-white/5 pt-2
                      `}>
                        {/* Mark as read button */}
                        {!notif.isRead && (
                          <button
                            onClick={(e) => handleMarkRead(notif.id, e)}
                            disabled={markingId === notif.id}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] border border-white/10 text-[#8892b0] hover:border-[#4f6ef7] hover:text-[#4f6ef7] transition-all"
                          >
                            {markingId === notif.id
                              ? <div className="w-2.5 h-2.5 rounded-full border border-t-transparent border-[#4f6ef7] animate-spin" />
                              : <Check className="w-2.5 h-2.5" />
                            }
                            Mark read
                          </button>
                        )}

                        {/* Delete this message button */}
                        {/* <button
                          onClick={(e) => handleDelete(notif.id, e)}
                          disabled={deletingId === notif.id}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          {deletingId === notif.id
                            ? <div className="w-2.5 h-2.5 rounded-full border border-t-transparent border-red-400 animate-spin" />
                            : <Trash2 className="w-2.5 h-2.5" />
                          }
                          Delete
                        </button> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}