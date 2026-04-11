// src/components/notifications/notification-bell.tsx
// Bell icon button with animated unread badge.
// Opens/closes the NotificationPanel as a popover below.
// Pass placement="sidebar" to open the panel upward instead of downward.

'use client'

import { useRef, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { useNotifications } from '@/hooks/use-notifications'
import { NotificationPanel } from './notification-panel'

interface NotificationBellProps {
  /** 'header' (default) — panel opens downward.
   *  'sidebar' — panel opens upward (bottom: 100%). */
  placement?: 'header' | 'sidebar'
}

export function NotificationBell({ placement = 'header' }: NotificationBellProps) {
  const {
    notifications,
    unreadCount,
    isLoading,
    isPanelOpen,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
    togglePanel,
    closePanel,
  } = useNotifications()

  const containerRef = useRef<HTMLDivElement>(null)

  // Close panel on outside click
  useEffect(() => {
    if (!isPanelOpen) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closePanel()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isPanelOpen, closePanel])

  // Close panel on Escape
  useEffect(() => {
    if (!isPanelOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isPanelOpen, closePanel])

  const panelPositionClass =
    placement === 'sidebar'
      ? 'absolute bottom-0 left-full ml-3'  // opens to the right at bell level
      : 'absolute top-full mt-2 right-0'   // opens downward, aligned right

  return (
    <div ref={containerRef} className="relative shrink-0">
      {/* Bell button */}
      <button
        onClick={togglePanel}
        aria-label="Notifications"
        aria-haspopup="true"
        aria-expanded={isPanelOpen}
        className={`
          relative w-9 h-9 flex items-center justify-center rounded-full
          transition-all duration-200
          ${isPanelOpen
            ? 'bg-violet-100 text-violet-700'
            : 'text-gray-600 hover:bg-violet-50 hover:text-violet-600'}
        `}
      >
        <Bell className="w-5 h-5" />

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span
            className="absolute top-0.5 right-0.5 min-w-4.25 h-4.25
              flex items-center justify-center rounded-full
              bg-violet-600 text-white text-[10px] font-bold leading-none px-1
              shadow-sm ring-2 ring-white"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel — positioned relative to this container */}
      {isPanelOpen && (
        <NotificationPanel
          notifications={notifications}
          isLoading={isLoading}
          markAsRead={markAsRead}
          markAllAsRead={markAllAsRead}
          deleteNotification={deleteNotification}
          refresh={refresh}
          closePanel={closePanel}
          panelClassName={panelPositionClass}
        />
      )}
    </div>
  )
}
