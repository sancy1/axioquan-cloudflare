
// src/components/messaging/notifications-client.tsx
// Handles both Screen 03 (all notifications) and Screen 07 (unread only)
// Groups notifications by date
// Mark individual or all as read
// Clicking notification navigates to conversation

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, Check, CheckCheck, Search } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { MessageNotification } from '@/lib/messaging/types'

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

  // ── Fetch notifications ───────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/messaging/proxy/notifications')
      const data = await res.json()
      if (data.success) setNotifications(data.data ?? [])
    } catch {
      console.error('Failed to fetch notifications')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // ── Listen for new messages via WebSocket ─────────────────────────────────
  useEffect(() => {
    const handler = () => fetchNotifications()
    window.addEventListener('messaging:new-message', handler)
    return () => window.removeEventListener('messaging:new-message', handler)
  }, [fetchNotifications])

  // ── Mark single notification as read ─────────────────────────────────────
  const handleMarkRead = async (notifId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setMarkingId(notifId)
    try {
      const res = await fetch(
        `/api/messaging/proxy/notifications/${notifId}/read`,
        { method: 'PATCH' }
      )
      if (res.ok) {
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
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
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


  // ── Navigate to conversation ──────────────────────────────────────────────
const handleNotifClick = async (notif: MessageNotification) => {
  if (!notif.isRead) {
    try {
      await fetch(`/api/messaging/proxy/notifications/${notif.id}/read`, {
        method: 'PATCH',
      })
      setNotifications((prev) =>
        prev.map((n) => n.id === notif.id ? { ...n, isRead: true } : n)
      )
      // Dispatch event so bell count updates
      window.dispatchEvent(new CustomEvent('messaging:notification-read'))
    } catch {
      console.error('Failed to mark notification as read')
    }
  }
  // Navigate to inbox — conversation will be selected by URL param
  router.push(`/dashboard/inbox?conversation=${notif.conversationId}`)
}


  // ── Filter + search ───────────────────────────────────────────────────────
  const filtered = notifications.filter((n) => {
    const matchesFilter = filter === 'all' || !n.isRead
    const matchesSearch = !search ||
      n.sender?.name?.toLowerCase().includes(search.toLowerCase()) ||
      n.messagePreview?.toLowerCase().includes(search.toLowerCase()) ||
      n.conversationTitle?.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const unreadCount  = notifications.filter((n) => !n.isRead).length
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

        <div className="w-8 h-8 rounded-lg bg-[#4f6ef7] flex items-center justify-center">
          <Bell className="w-4 h-4 text-white" />
        </div>

        <div>
          <div className="text-sm font-semibold text-[#f0f2ff]">
            {isUnreadView ? 'Unread Messages' : 'Notifications'}
          </div>
          {isUnreadView && (
            <div className="text-xs text-[#8892b0]">
              {unreadCount} unread
            </div>
          )}
        </div>

        {/* Mark all as read */}
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-[#8892b0] hover:text-[#f0f2ff] transition-colors"
          >
            {markingAll
              ? <div className="w-3 h-3 rounded-full border border-t-transparent border-[#4f6ef7] animate-spin" />
              : <CheckCheck className="w-3.5 h-3.5" />
            }
            Mark all as read
          </button>
        )}

        {/* Bell with count */}
        <div className="relative ml-2">
          <Bell className="w-5 h-5 text-[#8892b0]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
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
              <span className="text-xs text-[#4a5568]">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Filter tabs */}
          {!isUnreadView && (
            <div className="flex items-center gap-2 mb-6">
              {[
                { key: 'all',    label: 'All',    icon: '📋' },
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
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`
                      w-4 h-4 rounded-full text-[9px] font-bold
                      flex items-center justify-center
                      ${filter === tab.key
                        ? 'bg-white/20 text-white'
                        : 'bg-red-500 text-white'
                      }
                    `}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}

              {/* Mentions tab — placeholder for future */}
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#8892b0] border border-white/10 hover:text-[#f0f2ff] transition-colors">
                <span>@</span>
                Mentions
              </button>
            </div>
          )}

          {/* Unread count summary for Screen 07 */}
          {isUnreadView && (
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-[#8892b0]">
                Showing{' '}
                <strong className="text-[#f0f2ff]">1 to {filtered.length}</strong>
                {' '}of{' '}
                <strong className="text-[#f0f2ff]">{filtered.length}</strong>
                {' '}messages
              </span>
            </div>
          )}

          {/* Loading */}
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
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 rounded-full bg-[#4f6ef7]/15 border border-[#4f6ef7]/30 flex items-center justify-center">
                <Bell className="w-7 h-7 text-[#4f6ef7]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-[#f0f2ff] mb-1">
                  All caught up!
                </p>
                <p className="text-xs text-[#4a5568]">
                  {filter === 'unread'
                    ? 'No unread notifications. Check back later.'
                    : 'You have no notifications yet.'
                  }
                </p>
              </div>
            </div>
          ) : (
            /* Grouped notifications */
            Object.entries(grouped).map(([date, notifs]) => (
              <div key={date} className="mb-6">
                {/* Date header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-bold tracking-widest text-[#4a5568]">
                    {date}
                  </span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>

                {/* Notification items */}
                <div className="space-y-2">
                  {notifs.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => handleNotifClick(notif)}
                      className={`
                        w-full text-left p-4 rounded-xl border
                        transition-all duration-150 group
                        ${!notif.isRead
                          ? 'bg-[#111420] border-[#4f6ef7]/20 hover:border-[#4f6ef7]/40'
                          : 'bg-[#111420]/50 border-white/5 hover:border-white/10'
                        }
                      `}
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
                          {/* Online dot */}
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#111420]" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Sender + conversation */}
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-semibold text-[#f0f2ff]">
                              {notif.sender?.name ?? 'Unknown'}
                            </span>
                          </div>

                          {/* Conversation context */}
                          {notif.conversationTitle && (
                            <div className="text-[10px] text-[#4f6ef7] mb-1">
                              in {notif.conversationTitle}
                            </div>
                          )}

                          {/* Message preview */}
                          <p className="text-xs text-[#8892b0] leading-relaxed line-clamp-2">
                            {notif.messagePreview}
                          </p>

                          {/* Unread indicator */}
                          {!notif.isRead && (
                            <div className="flex items-center gap-1 mt-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#4f6ef7] inline-block" />
                              <span className="text-[10px] text-[#4f6ef7] font-medium">
                                Unread
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Right side — time + mark read */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className="text-[10px] text-[#4a5568]">
                            {formatTime(notif.createdAt)}
                          </span>

                          {/* Mark read button */}
                          <button
                            onClick={(e) => handleMarkRead(notif.id, e)}
                            disabled={notif.isRead || markingId === notif.id}
                            className={`
                              w-7 h-7 rounded-lg border flex items-center justify-center
                              transition-all
                              ${notif.isRead
                                ? 'border-white/5 text-[#4a5568] cursor-default'
                                : 'border-white/10 text-[#8892b0] hover:border-[#4f6ef7] hover:text-[#4f6ef7]'
                              }
                            `}
                            title={notif.isRead ? 'Already read' : 'Mark as read'}
                          >
                            {markingId === notif.id
                              ? <div className="w-3 h-3 rounded-full border border-t-transparent border-[#4f6ef7] animate-spin" />
                              : <Check className="w-3 h-3" />
                            }
                          </button>
                        </div>
                      </div>
                    </button>
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