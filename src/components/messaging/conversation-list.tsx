// src/components/messaging/conversation-list.tsx
// Left sidebar — shows all conversations with unread badges
// FIXED: All tab shows plain count, no red badge
// FIXED: Unread tab only shows red badge
// FIXED: unreadCounts prop drives actual message count per conversation

'use client'

import { useState } from 'react'
import { Users } from 'lucide-react'
import ConversationItem from './conversation-item'
import type { ConversationInbox } from '@/lib/messaging/types'

interface ConversationListProps {
  conversations:         ConversationInbox[]
  activeId:              string | null
  currentUserId:         string
  theme:                 Record<string, string>
  onSelect:              (id: string) => void
  onConversationCreated: (conv: ConversationInbox) => void
  unreadCounts:          Record<string, number>
}

type FilterTab = 'all' | 'unread' | 'course'

function isConversationUnread(c: ConversationInbox): boolean {
  if (!c.lastMessageAt) return false
  if (!c.lastReadAt) return true
  return new Date(c.lastMessageAt) > new Date(c.lastReadAt)
}

export default function ConversationList({
  conversations,
  activeId,
  currentUserId,
  theme,
  onSelect,
  onConversationCreated,
  unreadCounts,
}: ConversationListProps) {
  const [filter, setFilter] = useState<FilterTab>('all')
  const [search, setSearch] = useState('')

  const unreadCount = conversations.filter(isConversationUnread).length

  const filtered = conversations.filter((c) => {
    const name    = c.otherParticipant?.name?.toLowerCase() ?? ''
    const title   = c.title?.toLowerCase() ?? ''
    const preview = c.lastMessagePreview?.toLowerCase() ?? ''
    const matchesSearch =
      !search ||
      name.includes(search.toLowerCase()) ||
      title.includes(search.toLowerCase()) ||
      preview.includes(search.toLowerCase())

    if (!matchesSearch) return false
    if (filter === 'unread') return isConversationUnread(c)
    if (filter === 'course') return !!c.courseId
    return true
  })

  return (
    <>
      {/* Header */}
      <div className={`px-4 pt-4 pb-3 border-b ${theme.border}`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-sm font-semibold ${theme.text}`}>Inbox</span>
          <span className={`text-xs ${theme.textMuted}`}>
            {conversations.length} total
          </span>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 mb-3">

          {/* All tab — plain count, no red badge */}
          <button
            onClick={() => setFilter('all')}
            className={`
              flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
              transition-all duration-150
              ${filter === 'all'
                ? `${theme.accent} text-white`
                : `${theme.surface2} ${theme.textSec} hover:${theme.text}`
              }
            `}
          >
            All
            <span className={`
              text-[9px] font-medium
              ${filter === 'all' ? 'text-white/70' : theme.textMuted}
            `}>
              {conversations.length}
            </span>
          </button>

          {/* Unread tab — red badge when unread > 0 */}
          <button
            onClick={() => setFilter('unread')}
            className={`
              flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
              transition-all duration-150
              ${filter === 'unread'
                ? `${theme.accent} text-white`
                : `${theme.surface2} ${theme.textSec} hover:${theme.text}`
              }
            `}
          >
            Unread
            {unreadCount > 0 && (
              <span className={`
                w-4 h-4 rounded-full text-[9px] font-bold
                flex items-center justify-center
                ${filter === 'unread'
                  ? 'bg-white/20 text-white'
                  : 'bg-red-500 text-white'
                }
              `}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* By Course tab */}
          <button
            onClick={() => setFilter('course')}
            className={`
              flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
              transition-all duration-150
              ${filter === 'course'
                ? `${theme.accent} text-white`
                : `${theme.surface2} ${theme.textSec} hover:${theme.text}`
              }
            `}
          >
            By Course
          </button>
        </div>

        {/* Search */}
        <div className={`
          flex items-center gap-2 px-3 py-2 rounded-lg
          border ${theme.border} ${theme.inputBg}
        `}>
          <svg
            className={`w-3 h-3 ${theme.textMuted} flex-shrink-0`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter conversations..."
            className={`
              bg-transparent text-xs ${theme.text}
              placeholder:${theme.textMuted} outline-none w-full
            `}
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filtered.length === 0 ? (
          <div className={`
            flex flex-col items-center justify-center h-32 gap-2 ${theme.textMuted}
          `}>
            <span className="text-2xl">💬</span>
            <p className="text-xs">
              {filter === 'unread' ? 'No unread conversations' : 'No conversations yet'}
            </p>
          </div>
        ) : (
          filtered.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeId}
              currentUserId={currentUserId}
              theme={theme}
              onClick={() => onSelect(conv.id)}
              unreadCount={unreadCounts[conv.id] ?? 0}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className={`
        px-4 py-3 border-t ${theme.border}
        flex items-center justify-between
      `}>
        <span className={`text-xs ${theme.textMuted} flex items-center gap-1.5`}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
          {conversations.length} conversations
          {unreadCount > 0 && (
            <span className="text-red-400 font-medium">· {unreadCount} unread</span>
          )}
        </span>
        <button className={`
          flex items-center gap-1 text-xs ${theme.textSec}
          hover:${theme.text} transition-colors
        `}>
          <Users className="w-3 h-3" />
          Directory
        </button>
      </div>
    </>
  )
}