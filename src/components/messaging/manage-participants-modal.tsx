// src/components/messaging/manage-participants-modal.tsx
// Screen 06 — Manage Participants modal
// Instructor/Admin only — add or remove participants
// Shows stats: Total Members | Instructors | Students
// Search members, remove with confirmation

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { X, Search, UserPlus, Trash2, Users } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { ConversationInbox, Participant } from '@/lib/messaging/types'

interface AvailableUser {
  id:           string
  name:         string
  email:        string
  username:     string
  image:        string | null
  primary_role: string | null
}

interface ManageParticipantsModalProps {
  isOpen:        boolean
  onClose:       () => void
  conversation:  ConversationInbox
  currentUserId: string
  theme:         Record<string, string>
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

function formatJoined(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    })
  } catch { return '' }
}

export default function ManageParticipantsModal({
  isOpen,
  onClose,
  conversation,
  currentUserId,
  theme,
}: ManageParticipantsModalProps) {
  const [tab, setTab]                     = useState<'members' | 'add'>('members')
  const [participants, setParticipants]   = useState<Participant[]>([])
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([])
  const [loading, setLoading]             = useState(true)
  const [loadingUsers, setLoadingUsers]   = useState(false)
  const [memberSearch, setMemberSearch]   = useState('')
  const [userSearch, setUserSearch]       = useState('')
  const [removingId, setRemovingId]       = useState<string | null>(null)
  const [addingId, setAddingId]           = useState<string | null>(null)
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null)
  const searchTimer                       = useRef<number>(0)

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

  // ── Fetch available users ─────────────────────────────────────────────────
  const fetchAvailableUsers = useCallback(async (q: string) => {
    setLoadingUsers(true)
    try {
      const url  = q
        ? `/api/messaging/users?search=${encodeURIComponent(q)}`
        : '/api/messaging/users'
      const res  = await fetch(url)
      const data = await res.json()
      if (data.success) {
        // Filter out users already in the conversation
        const participantIds = new Set(participants.map((p) => p.userId))
        setAvailableUsers(
          data.data.filter((u: AvailableUser) => !participantIds.has(u.id))
        )
      }
    } catch {
      setAvailableUsers([])
    } finally {
      setLoadingUsers(false)
    }
  }, [participants])

  // ── Load on open ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return
    fetchParticipants()
    setTab('members')
    setMemberSearch('')
    setUserSearch('')
  }, [isOpen, fetchParticipants])

  // ── Load users when switching to Add tab ──────────────────────────────────
  useEffect(() => {
    if (tab === 'add' && isOpen) fetchAvailableUsers('')
  }, [tab, isOpen, fetchAvailableUsers])

  // ── Debounced user search ─────────────────────────────────────────────────
  useEffect(() => {
    if (tab !== 'add' || !isOpen) return
    window.clearTimeout(searchTimer.current)
    searchTimer.current = window.setTimeout(
      () => fetchAvailableUsers(userSearch), 300
    )
    return () => window.clearTimeout(searchTimer.current)
  }, [userSearch, tab, isOpen, fetchAvailableUsers])

  // ── Remove participant ────────────────────────────────────────────────────
  const handleRemove = async (userId: string) => {
    setRemovingId(userId)
    try {
      const res = await fetch(
        `/api/messaging/proxy/conversations/${conversation.id}/participants/${userId}`,
        { method: 'DELETE' }
      )
      if (res.ok) {
        setParticipants((prev) => prev.filter((p) => p.userId !== userId))
      }
    } catch {
      console.error('Failed to remove participant')
    } finally {
      setRemovingId(null)
      setConfirmRemove(null)
    }
  }

  // ── Add participant ───────────────────────────────────────────────────────
  const handleAdd = async (userId: string) => {
    setAddingId(userId)
    try {
      const res  = await fetch(
        `/api/messaging/proxy/conversations/${conversation.id}/participants`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ userId }),
        }
      )
      const data = await res.json()
      if (data.success) {
        await fetchParticipants()
        setAvailableUsers((prev) => prev.filter((u) => u.id !== userId))
      }
    } catch {
      console.error('Failed to add participant')
    } finally {
      setAddingId(null)
    }
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalMembers  = participants.length
  const instructors   = participants.filter((p) => p.role === 'instructor').length
  const students      = participants.filter((p) => p.role === 'student').length

  const filteredMembers = participants.filter((p) =>
    !memberSearch ||
    p.user?.name?.toLowerCase().includes(memberSearch.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={`
        w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl
        border ${theme.border} ${theme.surface}
        flex flex-col max-h-[88vh]
      `}>

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className={`
          flex items-center gap-3 px-6 py-4
          border-b ${theme.border} flex-shrink-0
        `}>
          <div className={`
            w-8 h-8 rounded-lg ${theme.accent}
            flex items-center justify-center flex-shrink-0
          `}>
            <Users className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className={`text-sm font-semibold ${theme.text}`}>
              Manage Participants
            </div>
            <div className={`text-xs ${theme.textMuted}`}>
              {conversation.title ?? 'Conversation'}
            </div>
          </div>

          {/* Add Member button */}
          <button
            onClick={() => setTab('add')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4f6ef7] text-white text-xs font-medium hover:bg-[#3d5ce6] transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add Member
          </button>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg ${theme.textSec} hover:${theme.text} transition-colors`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Stats row ─────────────────────────────────────────────────── */}
        <div className={`grid grid-cols-3 gap-3 px-6 py-4 border-b ${theme.border} flex-shrink-0`}>
          {[
            { label: 'Total Members', value: totalMembers, color: 'text-[#4f6ef7]' },
            { label: 'Instructors',   value: instructors,  color: 'text-purple-400' },
            { label: 'Students',      value: students,     color: 'text-blue-400'   },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`
                flex flex-col items-center justify-center py-3 rounded-xl
                border ${theme.border} ${theme.surface2}
              `}
            >
              <span className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </span>
              <span className={`text-[10px] ${theme.textMuted} mt-0.5`}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────────── */}
        <div className={`flex border-b ${theme.border} flex-shrink-0`}>
          <button
            onClick={() => setTab('members')}
            className={`
              flex-1 flex items-center justify-center gap-1.5
              py-2.5 text-xs font-medium transition-colors border-b-2
              ${tab === 'members'
                ? 'border-[#4f6ef7] text-[#4f6ef7]'
                : `border-transparent ${theme.textSec}`
              }
            `}
          >
            <Users className="w-3 h-3" />
            Members
          </button>
          <button
            onClick={() => setTab('add')}
            className={`
              flex-1 flex items-center justify-center gap-1.5
              py-2.5 text-xs font-medium transition-colors border-b-2
              ${tab === 'add'
                ? 'border-[#4f6ef7] text-[#4f6ef7]'
                : `border-transparent ${theme.textSec}`
              }
            `}
          >
            <UserPlus className="w-3 h-3" />
            Add Member
          </button>
        </div>

        {/* ── Tab content ───────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4">

          {tab === 'members' && (
            <>
              {/* Section header */}
              <div className={`mb-3`}>
                <div className={`text-xs font-semibold ${theme.text} mb-0.5`}>
                  Conversation Members
                </div>
                <div className={`text-[10px] ${theme.textMuted}`}>
                  Manage who has access to this conversation
                </div>
              </div>

              {/* Search */}
              <div className={`
                flex items-center gap-2 px-3 py-2 rounded-lg
                border ${theme.border} ${theme.inputBg} mb-3
              `}>
                <Search className={`w-3 h-3 ${theme.textMuted} flex-shrink-0`} />
                <input
                  type="text"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  placeholder="Search members..."
                  className={`
                    bg-transparent text-xs ${theme.text}
                    placeholder:text-[#4a5568] outline-none w-full
                  `}
                />
              </div>

              {/* Members list */}
              {loading ? (
                <div className="space-y-2">
                  {[1,2,3].map((i) => (
                    <div key={i} className={`
                      flex items-center gap-3 p-3 rounded-xl
                      border ${theme.border} animate-pulse
                    `}>
                      <div className="w-9 h-9 rounded-full bg-white/10" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-28 rounded bg-white/10" />
                        <div className="h-2 w-20 rounded bg-white/10" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredMembers.map((p) => {
                    const isCreator  = p.userId === conversation.createdBy
                    const isMe       = p.userId === currentUserId
                    const isRemoving = removingId === p.userId
                    const isConfirming = confirmRemove === p.userId

                    return (
                      <div
                        key={p.id}
                        className={`
                          flex items-center gap-3 p-3 rounded-xl
                          border ${theme.border} ${theme.surface2}
                        `}
                      >
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {p.user?.image ? (
                            <img
                              src={p.user.image}
                              alt={p.user.name}
                              className="w-9 h-9 rounded-full object-cover"
                            />
                          ) : (
                            <div className={`
                              w-9 h-9 rounded-full
                              ${getAvatarColor(p.user?.name ?? '')}
                              flex items-center justify-center
                            `}>
                              <span className="text-white text-xs font-bold">
                                {getInitials(p.user?.name ?? '?')}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                            <span className={`text-xs font-semibold ${theme.text}`}>
                              {p.user?.name ?? 'Unknown'}
                            </span>
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
                          <div className={`text-[10px] ${theme.textMuted}`}>
                            {p.user?.username
                              ? `@${p.user.username} · `
                              : ''
                            }
                            Joined {formatJoined(p.joinedAt)}
                            {isCreator && ' · Creator'}
                          </div>
                        </div>

                        {/* Remove button — not for creator */}
                        {!isCreator && !isMe && (
                          isConfirming ? (
                            <div className="flex gap-1.5 flex-shrink-0">
                              <button
                                onClick={() => setConfirmRemove(null)}
                                className={`
                                  px-2 py-1 rounded-lg text-[10px]
                                  border ${theme.border} ${theme.textSec}
                                  transition-colors
                                `}
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleRemove(p.userId)}
                                disabled={isRemoving}
                                className="px-2 py-1 rounded-lg text-[10px] bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-1"
                              >
                                {isRemoving
                                  ? <div className="w-2.5 h-2.5 rounded-full border border-t-transparent border-white animate-spin" />
                                  : <Trash2 className="w-2.5 h-2.5" />
                                }
                                Remove
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmRemove(p.userId)}
                              className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/15 transition-colors flex-shrink-0"
                              title="Remove participant"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {tab === 'add' && (
            <>
              <div className={`text-xs font-semibold ${theme.text} mb-3`}>
                Add New Members
              </div>

              {/* Search */}
              <div className={`
                flex items-center gap-2 px-3 py-2 rounded-lg
                border ${theme.border} ${theme.inputBg} mb-3
                focus-within:border-[#4f6ef7] transition-colors
              `}>
                <Search className={`w-3 h-3 ${theme.textMuted} flex-shrink-0`} />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search users to add..."
                  className={`
                    bg-transparent text-xs ${theme.text}
                    placeholder:text-[#4a5568] outline-none w-full
                  `}
                />
              </div>

              {/* Available users list */}
              {loadingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-[#4f6ef7] animate-spin" />
                </div>
              ) : availableUsers.length === 0 ? (
                <div className={`
                  flex flex-col items-center justify-center py-10 gap-2
                  ${theme.textMuted}
                `}>
                  <Users className="w-8 h-8 opacity-30" />
                  <p className="text-xs">No users available to add</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`
                        flex items-center gap-3 p-3 rounded-xl
                        border ${theme.border} ${theme.surface2}
                      `}
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className={`
                            w-9 h-9 rounded-full
                            ${getAvatarColor(user.name)}
                            flex items-center justify-center
                          `}>
                            <span className="text-white text-xs font-bold">
                              {getInitials(user.name)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`text-xs font-semibold ${theme.text} truncate`}>
                            {user.name}
                          </span>
                          {user.primary_role && (
                            <span className={`
                              text-[9px] font-bold uppercase px-1.5 py-0.5 rounded
                              ${getRoleBadgeStyle(user.primary_role)}
                            `}>
                              {user.primary_role}
                            </span>
                          )}
                        </div>
                        <div className={`text-[10px] ${theme.textMuted} truncate`}>
                          {user.username ? `@${user.username} · ` : ''}{user.email}
                        </div>
                      </div>

                      {/* Add button */}
                      <button
                        onClick={() => handleAdd(user.id)}
                        disabled={addingId === user.id}
                        className={`
                          flex items-center gap-1 px-2.5 py-1.5 rounded-lg
                          text-[10px] font-semibold text-white flex-shrink-0
                          transition-colors
                          ${addingId === user.id
                            ? 'bg-[#4f6ef7]/50 cursor-not-allowed'
                            : 'bg-[#4f6ef7] hover:bg-[#3d5ce6]'
                          }
                        `}
                      >
                        {addingId === user.id
                          ? <div className="w-2.5 h-2.5 rounded-full border border-t-transparent border-white animate-spin" />
                          : <UserPlus className="w-2.5 h-2.5" />
                        }
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}