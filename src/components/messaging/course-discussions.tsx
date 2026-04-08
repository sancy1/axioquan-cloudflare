
// src/components/messaging/course-discussions.tsx
// Screen 05 — Course Discussions grouped view
// Groups conversations by title (since courseId is null in test data)
// Active = conversations with messages
// Archived = conversations with no messages yet
// Matches Screen 05 design: emoji icon, course group header, conversation rows

'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Users, MessageSquare, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { ConversationInbox } from '@/lib/messaging/types'

interface CourseDiscussionsProps {
  initialConversations: ConversationInbox[]
  currentUserId:        string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function getGroupKey(conv: ConversationInbox): string {
  // Use courseId title if linked, otherwise use conversation title, fallback to type
  if (conv.title) return conv.title
  if (conv.type === 'group') return 'Group Conversations'
  return 'Direct Messages'
}

function getGroupEmoji(key: string): string {
  const lower = key.toLowerCase()
  if (lower.includes('python'))    return '🐍'
  if (lower.includes('react'))     return '⚛️'
  if (lower.includes('math'))      return '📐'
  if (lower.includes('physics'))   return '⚡'
  if (lower.includes('chemistry')) return '🧪'
  if (lower.includes('biology'))   return '🧬'
  if (lower.includes('history'))   return '📜'
  if (lower.includes('english'))   return '📝'
  if (lower.includes('art'))       return '🎨'
  if (lower.includes('music'))     return '🎵'
  if (lower.includes('group'))     return '👥'
  if (lower.includes('direct'))    return '💬'
  if (lower.includes('study'))     return '📚'
  if (lower.includes('economics')) return '📊'
  if (lower.includes('design'))    return '🎯'
  if (lower.includes('science'))   return '🔬'
  return '💬'
}

function isConversationUnread(c: ConversationInbox): boolean {
  if (!c.lastMessageAt) return false
  if (!c.lastReadAt) return true
  return new Date(c.lastMessageAt) > new Date(c.lastReadAt)
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

// ── Component ─────────────────────────────────────────────────────────────────

export default function CourseDiscussions({
  initialConversations,
  currentUserId,
}: CourseDiscussionsProps) {
  const router = useRouter()
  const [tab, setTab] = useState<'active' | 'archived'>('active')

  // ── Split into active (has messages) and archived (no messages) ───────────
  const active   = initialConversations.filter((c) => !!c.lastMessageAt)
  const archived = initialConversations.filter((c) => !c.lastMessageAt)
  const displayed = tab === 'active' ? active : archived

  // ── Group by title ────────────────────────────────────────────────────────
  const grouped = displayed.reduce<Record<string, ConversationInbox[]>>(
    (groups, conv) => {
      const key = getGroupKey(conv)
      if (!groups[key]) groups[key] = []
      groups[key].push(conv)
      return groups
    },
    {}
  )

  // ── Navigate to inbox with conversation selected ──────────────────────────
  const handleConversationClick = useCallback((id: string) => {
    router.push(`/dashboard/inbox?conversation=${id}`)
  }, [router])

  return (
    <div className="flex flex-col h-full bg-[#0a0d14]">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-6 py-4 bg-[#111420] border-b border-white/10 flex-shrink-0">
        {/* Back button */}
        <button
          onClick={() => router.push('/dashboard/inbox')}
          className="p-1.5 rounded-lg border border-white/10 text-[#8892b0] hover:text-[#f0f2ff] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Icon + title */}
        <div className="w-8 h-8 rounded-lg bg-[#4f6ef7] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm">💬</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-[#f0f2ff]">
            Course Discussions
          </div>
          <div className="text-xs text-[#8892b0]">
            Browse conversations by course
          </div>
        </div>

        {/* Active / Archived toggle */}
        <div className="flex items-center gap-1 bg-[#161b2e] rounded-lg p-1 border border-white/10">
          <button
            onClick={() => setTab('active')}
            className={`
              px-3 py-1.5 rounded-md text-xs font-medium transition-all
              ${tab === 'active'
                ? 'bg-[#4f6ef7] text-white'
                : 'text-[#8892b0] hover:text-[#f0f2ff]'
              }
            `}
          >
            Active
          </button>
          <button
            onClick={() => setTab('archived')}
            className={`
              px-3 py-1.5 rounded-md text-xs font-medium transition-all
              ${tab === 'archived'
                ? 'bg-[#4f6ef7] text-white'
                : 'text-[#8892b0] hover:text-[#f0f2ff]'
              }
            `}
          >
            Archived
          </button>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">

          {Object.keys(grouped).length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 rounded-full bg-[#4f6ef7]/15 border border-[#4f6ef7]/30 flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-[#4f6ef7]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-[#f0f2ff] mb-1">
                  {tab === 'active'
                    ? 'No active discussions'
                    : 'No archived conversations'
                  }
                </p>
                <p className="text-xs text-[#4a5568]">
                  {tab === 'active'
                    ? 'Start a conversation to see it here'
                    : 'Conversations with no messages appear here'
                  }
                </p>
              </div>
              <button
                onClick={() => router.push('/dashboard/inbox')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4f6ef7] text-white text-xs font-medium hover:bg-[#3d5ce6] transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Go to Inbox
              </button>
            </div>
          ) : (
            Object.entries(grouped).map(([groupKey, convs]) => (
              <div key={groupKey}>

                {/* ── Group header ─────────────────────────────────────── */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">
                    {getGroupEmoji(groupKey)}
                  </span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#8892b0]">
                    {groupKey}
                  </span>
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-[10px] text-[#4a5568]">
                    {convs.length} conversation{convs.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* ── Conversation rows ─────────────────────────────────── */}
                <div className="space-y-2">
                  {convs.map((conv) => {
                    const isGroup  = conv.type === 'group'
                    const other    = conv.otherParticipant
                    const name     = isGroup
                      ? (conv.title ?? 'Group Chat')
                      : (other?.name ?? 'Unknown')
                    const isUnread = isConversationUnread(conv)
                    const timeAgo  = formatTime(conv.lastMessageAt)

                    return (
                      <button
                        key={conv.id}
                        onClick={() => handleConversationClick(conv.id)}
                        className={`
                          w-full text-left p-4 rounded-xl border
                          transition-all duration-150
                          bg-[#111420] hover:border-[#4f6ef7]/40
                          ${isUnread
                            ? 'border-[#4f6ef7]/20'
                            : 'border-white/5'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">

                          {/* Course/conversation icon */}
                          <div className={`
                            w-10 h-10 rounded-xl flex-shrink-0
                            flex items-center justify-center
                            ${isGroup
                              ? 'bg-purple-500/20 border border-purple-500/30'
                              : 'bg-[#4f6ef7]/15 border border-[#4f6ef7]/25'
                            }
                          `}>
                            {isGroup
                              ? <Users className="w-4 h-4 text-purple-400" />
                              : <MessageSquare className="w-4 h-4 text-[#4f6ef7]" />
                            }
                          </div>

                          {/* Main content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              {/* Name */}
                              <span className="text-sm font-semibold text-[#f0f2ff] truncate">
                                {name}
                              </span>

                              {/* Type badge */}
                              <span className={`
                                text-[9px] font-bold uppercase px-1.5 py-0.5
                                rounded flex-shrink-0
                                ${isGroup
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                }
                              `}>
                                {isGroup ? 'Group' : 'Direct'}
                              </span>
                            </div>

                            {/* Course context if available */}
                            {conv.courseId && (
                              <div className="text-[10px] text-[#4f6ef7] mb-0.5">
                                {groupKey}
                              </div>
                            )}

                            {/* Preview */}
                            <p className="text-xs text-[#4a5568] truncate">
                              {conv.lastMessagePreview ?? 'No messages yet'}
                            </p>

                            {/* Meta row */}
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="text-[10px] text-[#4a5568] flex items-center gap-1">
                                <Users className="w-2.5 h-2.5" />
                                2 participants
                              </span>
                              {timeAgo && (
                                <span className="text-[10px] text-[#4a5568] flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5" />
                                  {timeAgo}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Right side — unread badge */}
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            {timeAgo && (
                              <span className="text-[10px] text-[#4a5568]">
                                {timeAgo}
                              </span>
                            )}
                            {isUnread && (
                              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                                1
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}