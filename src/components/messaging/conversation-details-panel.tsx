
// src/components/messaging/conversation-details-panel.tsx
// Screen 09 — Conversation Details slide-out panel
// Shows participants with roles, joined date, last read
// Add participant + Leave conversation actions
// Accessible from Users button in chat header

'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Users, Info, UserPlus, LogOut, Search } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { ConversationInbox, Participant } from '@/lib/messaging/types'

interface ConversationDetailsPanelProps {
  conversation:  ConversationInbox
  currentUserId: string
  theme:         Record<string, string>
  onClose:       () => void
  onLeave?:      (conversationId: string) => void
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

function getRoleBadgeStyle(role: string) {
  switch (role) {
    case 'instructor': return 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
    case 'admin':      return 'bg-amber-500/20  text-amber-300  border border-amber-500/30'
    default:           return 'bg-blue-500/20   text-blue-300   border border-blue-500/30'
  }
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    })
  } catch { return '' }
}

function formatRead(dateStr: string | null) {
  if (!dateStr) return 'Never'
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
  } catch { return '' }
}

export default function ConversationDetailsPanel({
  conversation,
  currentUserId,
  theme,
  onClose,
  onLeave,
}: ConversationDetailsPanelProps) {
  const [tab, setTab]               = useState<'participants' | 'info'>('participants')
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [leaving, setLeaving]       = useState(false)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)

  const isGroup    = conversation.type === 'group'
  const name       = isGroup
    ? (conversation.title ?? 'Group Chat')
    : (conversation.otherParticipant?.name ?? 'Unknown')

  // ── Fetch participants ────────────────────────────────────────────────────
  const fetchParticipants = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch(
        `/api/messaging/proxy/conversations/${conversation.id}/participants`
      )
      const data = await res.json()
      if (data.success) setParticipants(data.data)
    } catch {
      console.error('Failed to fetch participants')
    } finally {
      setLoading(false)
    }
  }, [conversation.id])

  useEffect(() => {
    fetchParticipants()
  }, [fetchParticipants])

  // ── Leave conversation ────────────────────────────────────────────────────
  const handleLeave = async () => {
    setLeaving(true)
    try {
      const res = await fetch(
        `/api/messaging/proxy/conversations/${conversation.id}/participants/${currentUserId}`,
        { method: 'DELETE' }
      )
      if (res.ok) {
        onLeave?.(conversation.id)
        onClose()
      }
    } catch {
      console.error('Failed to leave conversation')
    } finally {
      setLeaving(false)
      setShowLeaveConfirm(false)
    }
  }

  const filtered = participants.filter((p) =>
    !search ||
    p.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.user?.username?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={`
      flex flex-col h-full border-l ${theme.border} ${theme.surface}
      w-full sm:w-[320px] flex-shrink-0
    `}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className={`flex items-center gap-3 px-4 py-3.5 border-b ${theme.border} flex-shrink-0`}>
        <div className={`
          w-7 h-7 rounded-lg ${theme.accent}
          flex items-center justify-center flex-shrink-0
        `}>
          <Users className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-xs font-semibold ${theme.text} truncate`}>
            Conversation Details
          </div>
        </div>
        <button
          onClick={onClose}
          className={`p-1 rounded-lg ${theme.textSec} hover:${theme.text} transition-colors`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── Conversation name + type ─────────────────────────────────────── */}
      <div className={`px-4 py-4 border-b ${theme.border}`}>
        <div className={`text-sm font-bold ${theme.text} mb-1`}>{name}</div>
        <div className="flex items-center gap-2">
          <span className={`
            text-[9px] font-bold uppercase px-2 py-0.5 rounded
            ${isGroup
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }
          `}>
            {isGroup ? 'Group' : 'Direct'}
          </span>
          {conversation.courseId && (
            <span className="text-[9px] text-[#4f6ef7]">Course Linked</span>
          )}
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      <div className={`flex border-b ${theme.border} flex-shrink-0`}>
        <button
          onClick={() => setTab('participants')}
          className={`
            flex-1 flex items-center justify-center gap-1.5
            py-2.5 text-xs font-medium transition-colors
            border-b-2
            ${tab === 'participants'
              ? `border-[#4f6ef7] text-[#4f6ef7]`
              : `border-transparent ${theme.textSec}`
            }
          `}
        >
          <Users className="w-3 h-3" />
          Participants
        </button>
        <button
          onClick={() => setTab('info')}
          className={`
            flex-1 flex items-center justify-center gap-1.5
            py-2.5 text-xs font-medium transition-colors
            border-b-2
            ${tab === 'info'
              ? `border-[#4f6ef7] text-[#4f6ef7]`
              : `border-transparent ${theme.textSec}`
            }
          `}
        >
          <Info className="w-3 h-3" />
          Info
        </button>
      </div>

      {/* ── Tab content ──────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">

        {tab === 'participants' && (
          <div className="p-3">
            {/* Participant count */}
            <div className={`text-xs font-semibold ${theme.text} mb-3`}>
              Participants{' '}
              <span className={`font-normal ${theme.textMuted}`}>
                ({participants.length} members)
              </span>
            </div>

            {/* Search */}
            {participants.length > 3 && (
              <div className={`
                flex items-center gap-2 px-3 py-2 rounded-lg
                border ${theme.border} ${theme.inputBg} mb-3
              `}>
                <Search className={`w-3 h-3 ${theme.textMuted} flex-shrink-0`} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search members..."
                  className={`
                    bg-transparent text-xs ${theme.text}
                    placeholder:text-[#4a5568] outline-none w-full
                  `}
                />
              </div>
            )}

            {/* Participants list */}
            {loading ? (
              <div className="space-y-2">
                {[1,2,3].map((i) => (
                  <div key={i} className={`
                    flex items-center gap-3 p-3 rounded-xl
                    border ${theme.border} animate-pulse
                  `}>
                    <div className="w-9 h-9 rounded-full bg-white/10 flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-24 rounded bg-white/10" />
                      <div className="h-2 w-16 rounded bg-white/10" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map((p) => {
                  const isCreator = p.userId === conversation.createdBy
                  const isMe      = p.userId === currentUserId

                  return (
                    <div
                      key={p.id}
                      className={`
                        flex items-center gap-3 p-3 rounded-xl
                        border ${theme.border} ${theme.surface2}
                      `}
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        {p.user?.image ? (
                          <img
                            src={p.user.image}
                            alt={p.user.name}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className={`
                            w-9 h-9 rounded-full ${getAvatarColor(p.user?.name ?? '')}
                            flex items-center justify-center
                          `}>
                            <span className="text-white text-xs font-bold">
                              {getInitials(p.user?.name ?? '?')}
                            </span>
                          </div>
                        )}
                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-current" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                          <span className={`text-xs font-semibold ${theme.text} truncate`}>
                            {p.user?.name ?? 'Unknown'}
                          </span>
                          {isMe && (
                            <span className={`text-[9px] ${theme.textMuted}`}>(you)</span>
                          )}
                        </div>

                        {/* Badges row */}
                        <div className="flex items-center gap-1 flex-wrap mb-1">
                          <span className={`
                            text-[9px] font-bold uppercase px-1.5 py-0.5 rounded
                            ${getRoleBadgeStyle(p.role)}
                          `}>
                            {p.role}
                          </span>
                          {isCreator && (
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Creator
                            </span>
                          )}
                        </div>

                        {/* Joined + last read */}
                        <div className={`text-[10px] ${theme.textMuted}`}>
                          Joined {formatDate(p.joinedAt)}
                          {p.lastReadAt && (
                            <span> · Read {formatRead(p.lastReadAt)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {tab === 'info' && (
          <div className="p-4 space-y-4">
            {/* Conversation info */}
            <div className={`p-3 rounded-xl border ${theme.border} ${theme.surface2} space-y-2.5`}>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${theme.textMuted}`}>
                  Type
                </span>
                <span className={`text-xs font-medium ${theme.text} capitalize`}>
                  {conversation.type}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${theme.textMuted}`}>
                  Created
                </span>
                <span className={`text-xs ${theme.textSec}`}>
                  {formatDate(conversation.createdAt)}
                </span>
              </div>
              {conversation.title && (
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${theme.textMuted}`}>
                    Title
                  </span>
                  <span className={`text-xs ${theme.textSec} truncate max-w-[160px]`}>
                    {conversation.title}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${theme.textMuted}`}>
                  Members
                </span>
                <span className={`text-xs ${theme.textSec}`}>
                  {participants.length}
                </span>
              </div>
              {conversation.lastMessageAt && (
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${theme.textMuted}`}>
                    Last message
                  </span>
                  <span className={`text-xs ${theme.textSec}`}>
                    {formatRead(conversation.lastMessageAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Footer actions ────────────────────────────────────────────────── */}
      <div className={`px-3 py-3 border-t ${theme.border} flex gap-2 flex-shrink-0`}>
        {/* Add participant — visible to all for now */}
        {/* <button className={`
          flex-1 flex items-center justify-center gap-1.5
          py-2 rounded-lg text-xs font-medium
          bg-[#4f6ef7] text-white hover:bg-[#3d5ce6] transition-colors
        `}>
          <UserPlus className="w-3.5 h-3.5" />
          Add Participant
        </button> */}

        

        {/* Leave conversation */}
        {showLeaveConfirm ? (
          <div className="flex gap-1.5 flex-1">
            <button
              onClick={() => setShowLeaveConfirm(false)}
              className={`
                flex-1 py-2 rounded-lg text-xs font-medium
                border ${theme.border} ${theme.textSec} transition-colors
              `}
            >
              Cancel
            </button>
            <button
              onClick={handleLeave}
              disabled={leaving}
              className="flex-1 py-2 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
            >
              {leaving
                ? <div className="w-3 h-3 rounded-full border-2 border-t-transparent border-white animate-spin" />
                : <LogOut className="w-3 h-3" />
              }
              Confirm
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLeaveConfirm(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Leave
          </button>
        )}
      </div>
    </div>
  )
}