// src/components/notifications/notification-panel.tsx
// Full notification panel UI — extensible for future notification sources.
// Accepts an optional `extraNotifications` prop for merging other app notifications.

'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Bell, X, Check, CheckCheck, Trash2,
  CreditCard, BookOpen, Award, AlertCircle,
  Info, Star, Loader2, RefreshCw,
} from 'lucide-react'
import type { Notification } from '@/types/notifications'

// ── Types ────────────────────────────────────────────────────────────────────

type Tab = 'all' | 'unread'

/** Extra notification shape from other future sub-systems (e.g. messaging). */
export interface ExtraNotification {
  id: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
  iconType?: string
  actionUrl?: string
  source: string
}

export interface NotificationPanelProps {
  notifications: Notification[]
  isLoading: boolean
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  refresh: () => void
  closePanel: () => void
  /** Extra notifications from other systems; merged into the list. */
  extraNotifications?: ExtraNotification[]
  /** CSS classes to control absolute positioning (injected by NotificationBell). */
  panelClassName?: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getIcon(notificationType?: string, iconType?: string) {
  const t = ((notificationType ?? '') + (iconType ?? '')).toUpperCase()
  if (t.includes('PAYMENT') || t.includes('TRANSACTION'))
    return <CreditCard className="w-4 h-4" />
  if (t.includes('ENROLL') || t.includes('COURSE'))
    return <BookOpen className="w-4 h-4" />
  if (t.includes('CERTIFICATE') || t.includes('COMPLETE') || t.includes('AWARD'))
    return <Award className="w-4 h-4" />
  if (t.includes('ERROR') || t.includes('FAIL') || t.includes('CANCEL'))
    return <AlertCircle className="w-4 h-4" />
  if (t.includes('STAR') || t.includes('RATING'))
    return <Star className="w-4 h-4" />
  return <Info className="w-4 h-4" />
}

function getIconColorClass(notificationType?: string) {
  const t = (notificationType ?? '').toUpperCase()
  if (t.includes('PAYMENT') || t.includes('TRANSACTION')) return 'bg-green-100 text-green-600'
  if (t.includes('ENROLL') || t.includes('COURSE'))        return 'bg-violet-100 text-violet-600'
  if (t.includes('CERTIFICATE') || t.includes('COMPLETE')) return 'bg-amber-100 text-amber-600'
  if (t.includes('ERROR') || t.includes('FAIL') || t.includes('CANCEL'))
    return 'bg-red-100 text-red-600'
  return 'bg-blue-100 text-blue-600'
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  if (diff < 60_000)       return 'just now'
  if (diff < 3_600_000)    return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000)   return `${Math.floor(diff / 3_600_000)}h ago`
  if (diff < 604_800_000)  return `${Math.floor(diff / 86_400_000)}d ago`
  return new Date(dateStr).toLocaleDateString()
}

// ── NotificationCard ─────────────────────────────────────────────────────────

function NotificationCard({
  notification,
  markAsRead,
  deleteNotification,
}: {
  notification: Notification
  markAsRead: (id: string) => void
  deleteNotification: (id: string) => void
}) {
  const colorClass = getIconColorClass(notification.notificationType)
  const icon = getIcon(notification.notificationType, notification.iconType)

  const cardContent = (
    <div
      className={`group relative flex items-start gap-3 px-4 py-3.5 transition-colors
        hover:bg-gray-50 cursor-pointer
        ${!notification.isRead ? 'bg-violet-50/40' : ''}
      `}
    >
      {/* Unread indicator dot */}
      {!notification.isRead && (
        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
      )}

      {/* Type icon */}
      <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${notification.isRead ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
          {notification.title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-[10px] text-gray-400 mt-1">
          {relativeTime(notification.createdAt)}
        </p>
      </div>

      {/* Action buttons — appear on hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5">
        {!notification.isRead && (
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); markAsRead(notification.id) }}
            className="p-1.5 rounded-full hover:bg-violet-100 text-gray-400 hover:text-violet-600 transition-colors"
            title="Mark as read"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); deleteNotification(notification.id) }}
          className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          title="Delete notification"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )

  if (notification.actionUrl) {
    return (
      <Link
        href={notification.actionUrl}
        className="block"
        onClick={() => { if (!notification.isRead) markAsRead(notification.id) }}
      >
        {cardContent}
      </Link>
    )
  }

  return (
    <div onClick={() => { if (!notification.isRead) markAsRead(notification.id) }}>
      {cardContent}
    </div>
  )
}

// ── NotificationPanel ─────────────────────────────────────────────────────────

export function NotificationPanel({
  notifications,
  isLoading,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  refresh,
  closePanel,
  extraNotifications = [],
  panelClassName = 'absolute top-full mt-2 right-0',
}: NotificationPanelProps) {
  const [tab, setTab] = useState<Tab>('all')

  const unreadItems = notifications.filter(n => !n.isRead)
  const displayed   = tab === 'unread' ? unreadItems : notifications

  return (
    <div
      className={`${panelClassName} z-[200]
        w-[376px] max-w-[calc(100vw-16px)]
        bg-white rounded-2xl border border-gray-100 overflow-hidden`}
      style={{
        boxShadow:
          '0 20px 60px rgba(0,0,0,0.12), 0 4px 20px rgba(124,58,237,0.09)',
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-violet-600" />
          <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
          {unreadItems.length > 0 && (
            <span className="px-1.5 py-0.5 bg-violet-100 text-violet-700 text-[10px] font-bold rounded-full leading-none">
              {unreadItems.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadItems.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 font-medium transition-colors"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
          <button
            onClick={closePanel}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close notifications"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <div className="flex border-b border-gray-100 bg-gray-50/60">
        {(['all', 'unread'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-xs font-semibold capitalize transition-colors ${
              tab === t
                ? 'text-violet-700 border-b-2 border-violet-500 bg-white -mb-px'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'unread'
              ? `Unread (${unreadItems.length})`
              : `All (${notifications.length})`}
          </button>
        ))}
      </div>

      {/* ── List ────────────────────────────────────────────────────────────── */}
      <div className="overflow-y-auto max-h-[420px] divide-y divide-gray-50">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-14">
            <Loader2 className="w-6 h-6 text-violet-400 animate-spin mb-2" />
            <p className="text-xs text-gray-400">Loading notifications…</p>
          </div>
        ) : displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 px-6">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Bell className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-700">
              {tab === 'unread' ? 'All caught up!' : 'No notifications yet'}
            </p>
            <p className="text-xs text-gray-400 mt-1 text-center">
              {tab === 'unread'
                ? 'You have no unread notifications.'
                : 'Payment and enrollment updates will appear here.'}
            </p>
          </div>
        ) : (
          displayed.map(n => (
            <NotificationCard
              key={n.id}
              notification={n}
              markAsRead={markAsRead}
              deleteNotification={deleteNotification}
            />
          ))
        )}
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      {notifications.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-2.5 bg-gray-50/60 flex items-center justify-between">
          <button
            onClick={refresh}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-violet-600 transition-colors font-medium"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
          <Link
            href="/dashboard/notifications"
            onClick={closePanel}
            className="text-xs text-violet-600 hover:text-violet-700 font-semibold transition-colors"
          >
            View all →
          </Link>
        </div>
      )}
    </div>
  )
}
