'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import {
  Bell, Check, CheckCheck, Trash2, RefreshCw,
  CreditCard, BookOpen, Award, AlertCircle, Info, Star,
  Loader2, Filter,
} from 'lucide-react'
import type { Notification } from '@/types/notifications'

// ── Helpers (same as panel) ───────────────────────────────────────────────────

function getIcon(type?: string) {
  const t = (type ?? '').toUpperCase()
  if (t.includes('PAYMENT') || t.includes('REFUND'))
    return <CreditCard className="w-5 h-5" />
  if (t.includes('ENROLL') || t.includes('COURSE'))
    return <BookOpen className="w-5 h-5" />
  if (t.includes('CERTIFICATE') || t.includes('COMPLETE') || t.includes('AWARD'))
    return <Award className="w-5 h-5" />
  if (t.includes('ERROR') || t.includes('FAIL') || t.includes('CANCEL'))
    return <AlertCircle className="w-5 h-5" />
  if (t.includes('STAR') || t.includes('RATING'))
    return <Star className="w-5 h-5" />
  return <Info className="w-5 h-5" />
}

function getIconColorClass(type?: string) {
  const t = (type ?? '').toUpperCase()
  if (t.includes('PAYMENT_SUCCESS') || t.includes('REFUND')) return 'bg-green-100 text-green-600'
  if (t.includes('PAYMENT_FAILED') || t.includes('CANCEL'))  return 'bg-red-100 text-red-600'
  if (t.includes('ENROLL') || t.includes('COURSE'))           return 'bg-violet-100 text-violet-600'
  if (t.includes('CERTIFICATE') || t.includes('COMPLETE'))    return 'bg-amber-100 text-amber-600'
  if (t.includes('ERROR') || t.includes('FAIL'))              return 'bg-red-100 text-red-600'
  return 'bg-blue-100 text-blue-600'
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  if (diff < 60_000)      return 'just now'
  if (diff < 3_600_000)   return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000)  return `${Math.floor(diff / 3_600_000)}h ago`
  if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

type FilterTab = 'all' | 'unread' | 'read'

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading]         = useState(true)
  const [filter, setFilter]               = useState<FilterTab>('all')
  const [deletingIds, setDeletingIds]     = useState<Set<string>>(new Set())

  const DELETED_KEY = 'axioquan-deleted-notifications'

  function getDeletedIds(): Set<string> {
    try {
      const raw = localStorage.getItem(DELETED_KEY)
      return new Set(raw ? (JSON.parse(raw) as string[]) : [])
    } catch { return new Set() }
  }

  function saveDeletedIds(ids: Set<string>) {
    try { localStorage.setItem(DELETED_KEY, JSON.stringify([...ids])) } catch {}
  }

  const fetchAll = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/notifications/list?page=0&size=100')
      if (res.ok) {
        const data = await res.json()
        const deleted = getDeletedIds()
        setNotifications((data.content ?? []).filter((n: Notification) => !deleted.has(n.id)))
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}/read`, { method: 'PUT' })
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
  }

  const markAllAsRead = async () => {
    await fetch('/api/notifications/read-all', { method: 'PUT' })
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setDeletingIds(prev => new Set(prev).add(id))
    setTimeout(() => {
      const deleted = getDeletedIds()
      deleted.add(id)
      saveDeletedIds(deleted)
      setNotifications(prev => prev.filter(n => n.id !== id))
      setDeletingIds(prev => { const next = new Set(prev); next.delete(id); return next })
    }, 300)
  }

  const displayed = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead
    if (filter === 'read')   return n.isRead
    return true
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium
                text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
          <button
            onClick={fetchAll}
            className="p-2 text-gray-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-4 w-fit">
        {(['all', 'unread', 'read'] as FilterTab[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg capitalize transition-all ${
              filter === f
                ? 'bg-white text-violet-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {f === 'all'    ? `All (${notifications.length})`    : ''}
            {f === 'unread' ? `Unread (${unreadCount})`          : ''}
            {f === 'read'   ? `Read (${notifications.length - unreadCount})` : ''}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-7 h-7 text-violet-400 animate-spin mb-3" />
            <p className="text-sm text-gray-400">Loading notifications…</p>
          </div>
        ) : displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Bell className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-base font-semibold text-gray-700">
              {filter === 'unread' ? 'All caught up!' : 'No notifications'}
            </p>
            <p className="text-sm text-gray-400 mt-1 text-center">
              {filter === 'unread'
                ? 'You have no unread notifications.'
                : 'Payment and enrollment updates will appear here.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {displayed.map(n => {
              const isDeleting = deletingIds.has(n.id)
              const colorClass = getIconColorClass(n.notificationType)

              const cardContent = (
                <div
                  className={`group flex items-start gap-4 px-5 py-4 transition-all duration-300
                    hover:bg-gray-50
                    ${!n.isRead ? 'bg-violet-50/30' : ''}
                    ${isDeleting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
                  `}
                >
                  {/* Unread dot */}
                  {!n.isRead && (
                    <span className="mt-2 shrink-0 w-2 h-2 rounded-full bg-violet-500" />
                  )}
                  {n.isRead && <span className="mt-2 shrink-0 w-2 h-2" />}

                  {/* Icon */}
                  <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                    {getIcon(n.notificationType)}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${n.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                      {n.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{relativeTime(n.createdAt)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1">
                    {!n.isRead && (
                      <button
                        onClick={e => { e.preventDefault(); e.stopPropagation(); markAsRead(n.id) }}
                        className="p-2 rounded-full hover:bg-violet-100 text-gray-400 hover:text-violet-600 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={e => { e.preventDefault(); e.stopPropagation(); deleteNotification(n.id) }}
                      className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      title="Dismiss"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )

              return (
                <li key={n.id}>
                  {n.actionUrl ? (
                    <Link
                      href={n.actionUrl}
                      className="block"
                      onClick={() => { if (!n.isRead) markAsRead(n.id) }}
                    >
                      {cardContent}
                    </Link>
                  ) : (
                    <div
                      className={n.isRead ? '' : 'cursor-pointer'}
                      onClick={() => { if (!n.isRead) markAsRead(n.id) }}
                    >
                      {cardContent}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
