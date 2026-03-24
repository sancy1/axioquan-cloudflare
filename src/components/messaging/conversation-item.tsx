// src/components/messaging/conversation-item.tsx
// Single conversation row in the inbox list
// FIXED: unreadCount prop shows actual message count
// FIXED: isUnread uses lastMessageAt > lastReadAt comparison

'use client'

import { formatDistanceToNow } from 'date-fns'
import { Users } from 'lucide-react'
import type { ConversationInbox } from '@/lib/messaging/types'

interface ConversationItemProps {
  conversation:  ConversationInbox
  isActive:      boolean
  currentUserId: string
  theme:         Record<string, string>
  onClick:       () => void
  unreadCount:   number
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-purple-500','bg-blue-500','bg-green-500',
    'bg-amber-500', 'bg-red-500', 'bg-teal-500',
    'bg-pink-500',  'bg-indigo-500',
  ]
  return colors[name.charCodeAt(0) % colors.length]
}

function formatTime(dateStr: string | null): string {
  if (!dateStr) return ''
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: false })
      .replace('about ','')
      .replace(' minutes','m').replace(' minute','m')
      .replace(' hours','h').replace(' hour','h')
      .replace(' days','d').replace(' day','d')
  } catch { return '' }
}

export default function ConversationItem({
  conversation,
  isActive,
  currentUserId,
  theme,
  onClick,
  unreadCount,
}: ConversationItemProps) {
  const isGroup = conversation.type === 'group'
  const other   = conversation.otherParticipant
  const name    = isGroup
    ? (conversation.title ?? 'Group Chat')
    : (other?.name ?? conversation.title ?? 'Unknown')

  // Unread = has messages AND (never read OR new message after last read)
  const isUnread = !!conversation.lastMessageAt && (
    !conversation.lastReadAt ||
    new Date(conversation.lastMessageAt) > new Date(conversation.lastReadAt)
  )

  const timeAgo = formatTime(conversation.lastMessageAt)

  // Online = had activity in last 10 minutes
  const isRecentlyActive = conversation.lastMessageAt
    ? (Date.now() - new Date(conversation.lastMessageAt).getTime()) < 10 * 60 * 1000
    : false

  // Show badge if unread by date comparison OR if we have a live count
  const showBadge = isUnread || unreadCount > 0
  const badgeNum  = unreadCount > 0 ? unreadCount : 1

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-4 py-3.5 flex gap-3 items-start
        transition-all duration-150 relative border-b ${theme.border}
        ${isActive
          ? `${theme.accentSoft} border-l-2 ${theme.accentBorder}`
          : `hover:${theme.surface2} border-l-2 border-transparent`
        }
      `}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {isGroup ? (
          <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
            <Users className="w-4 h-4 text-purple-400" />
          </div>
        ) : other?.image ? (
          <img
            src={other.image}
            alt={name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className={`
            w-10 h-10 rounded-full ${getAvatarColor(name)}
            flex items-center justify-center
          `}>
            <span className="text-white text-xs font-bold">
              {getInitials(name)}
            </span>
          </div>
        )}

        {/* Online/offline dot — direct only */}
        {!isGroup && (
          <span className={`
            absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full
            border-2 border-current transition-colors duration-300
            ${isRecentlyActive ? 'bg-green-500' : 'bg-gray-500'}
          `} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span className={`
            text-sm font-medium truncate
            ${isUnread ? theme.text : theme.textSec}
          `}>
            {name}
          </span>
          <span className={`text-[10px] flex-shrink-0 ${theme.textMuted}`}>
            {timeAgo}
          </span>
        </div>

        <p className={`text-xs truncate mb-1 ${theme.textMuted}`}>
          {conversation.lastMessagePreview ?? 'No messages yet'}
        </p>

        {/* Tags row */}
        <div className="flex items-center justify-between gap-2">
          {isGroup ? (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 flex items-center gap-1">
              <Users className="w-2.5 h-2.5" />
              Group
            </span>
          ) : conversation.title ? (
            <span className={`
              text-[10px] px-1.5 py-0.5 rounded
              ${theme.surface2} ${theme.textMuted} truncate max-w-[140px]
            `}>
              {conversation.title}
            </span>
          ) : (
            <span />
          )}

          {/* Unread badge — shows actual count */}
          {showBadge && (
            <span className="ml-auto min-w-[20px] h-5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0 px-1">
              {badgeNum > 99 ? '99+' : badgeNum}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}