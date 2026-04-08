
// src/components/messaging/directory-modal.tsx
// Screen 04 — Participant Directory modal
// Opens from the Directory button in the conversation list footer
// Shows all axioquan users in a card grid
// Filter by role, search by name
// "Send Message" creates or opens a direct conversation

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { X, Search, MessageSquare } from 'lucide-react'
import type { ConversationInbox } from '@/lib/messaging/types'

interface User {
  id:           string
  name:         string
  email:        string
  username:     string
  image:        string | null
  primary_role: string | null
}

interface DirectoryModalProps {
  isOpen:    boolean
  onClose:   () => void
  onMessage: (conv: ConversationInbox) => void
  theme:     Record<string, string>
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function getAvatarColor(name: string) {
  const colors = [
    'bg-purple-500','bg-blue-500','bg-green-500',
    'bg-amber-500', 'bg-red-500', 'bg-teal-500',
    'bg-pink-500',  'bg-indigo-500',
  ]
  return colors[name.charCodeAt(0) % colors.length]
}

function getRoleBadgeStyle(role: string | null) {
  switch (role) {
    case 'instructor': return 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
    case 'admin':      return 'bg-amber-500/20  text-amber-300  border border-amber-500/30'
    default:           return 'bg-blue-500/20   text-blue-300   border border-blue-500/30'
  }
}

function getRoleLabel(role: string | null) {
  if (!role) return 'Student'
  return role.charAt(0).toUpperCase() + role.slice(1)
}

export default function DirectoryModal({
  isOpen,
  onClose,
  onMessage,
  theme,
}: DirectoryModalProps) {
  const [users, setUsers]           = useState<User[]>([])
  const [search, setSearch]         = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [loading, setLoading]       = useState(false)
  const [creatingFor, setCreatingFor] = useState<string | null>(null)
  const searchRef                   = useRef<HTMLInputElement>(null)
  const searchTimer                 = useRef<number>(0)

  // ── Fetch users ───────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async (q: string) => {
    setLoading(true)
    try {
      const url  = q
        ? `/api/messaging/users?search=${encodeURIComponent(q)}`
        : '/api/messaging/users'
      const res  = await fetch(url)
      const data = await res.json()
      setUsers(data.success ? data.data : [])
    } catch {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Fetch on open ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return
    fetchUsers('')
    setSearch('')
    setRoleFilter('all')
    setTimeout(() => searchRef.current?.focus(), 100)
  }, [isOpen, fetchUsers])

  // ── Debounced search ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return
    window.clearTimeout(searchTimer.current)
    searchTimer.current = window.setTimeout(() => fetchUsers(search), 300)
    return () => window.clearTimeout(searchTimer.current)
  }, [search, isOpen, fetchUsers])

  // ── Send message — create or open direct conversation ────────────────────
  const handleSendMessage = async (user: User) => {
    setCreatingFor(user.id)
    try {
      const res  = await fetch('/api/messaging/proxy/conversations', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          type:           'direct',
          participantIds: [user.id],
        }),
      })
      const data = await res.json()

      if (data.success) {
        // Fetch the full conversation with participant details
        const listRes  = await fetch('/api/messaging/proxy/conversations')
        const listData = await listRes.json()

        if (listData.success) {
          const found = listData.data.find(
            (c: ConversationInbox) => c.id === data.data.id
          )
          if (found) {
            onMessage(found)
            onClose()
            return
          }
        }

        // Fallback — build manually
        const conv: ConversationInbox = {
          ...data.data,
          myRole:             'student',
          lastReadAt:         null,
          lastMessagePreview: null,
          otherParticipant: {
            id:       user.id,
            username: user.username,
            name:     user.name,
            image:    user.image,
          },
        }
        onMessage(conv)
        onClose()
      }
    } catch {
      console.error('Failed to create conversation')
    } finally {
      setCreatingFor(null)
    }
  }

  // ── Filter by role client-side ────────────────────────────────────────────
  const filtered = users.filter((u) => {
    if (roleFilter === 'all') return true
    return u.primary_role === roleFilter
  })

  if (!isOpen) return null

  const roles = ['all', 'instructor', 'student', 'admin']

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={`
        w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl
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
            <span className="text-white text-sm">👥</span>
          </div>
          <div>
            <div className={`text-sm font-semibold ${theme.text}`}>
              Participant Directory
            </div>
            <div className={`text-xs ${theme.textMuted}`}>
              Browse all users available to message
            </div>
          </div>
          <button
            onClick={onClose}
            className={`
              ml-auto p-1.5 rounded-lg ${theme.textSec}
              hover:${theme.text} transition-colors
            `}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Search + filters ──────────────────────────────────────────── */}
        <div className={`
          px-6 py-3 border-b ${theme.border}
          flex flex-col sm:flex-row gap-3 flex-shrink-0
        `}>
          {/* Search */}
          <div className={`
            flex items-center gap-2 flex-1 px-3 py-2 rounded-lg
            border ${theme.border} ${theme.inputBg}
            focus-within:border-[#4f6ef7] transition-colors
          `}>
            <Search className={`w-3.5 h-3.5 ${theme.textMuted} flex-shrink-0`} />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or department..."
              className={`
                bg-transparent text-xs ${theme.text}
                placeholder:text-[#4a5568] outline-none w-full
              `}
            />
          </div>

          {/* Role filter */}
          <div className="flex gap-1.5 flex-shrink-0">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium
                  capitalize transition-all border
                  ${roleFilter === role
                    ? `${theme.accent} text-white border-transparent`
                    : `${theme.border} ${theme.textSec} hover:${theme.text}`
                  }
                `}
              >
                {role === 'all' ? 'All Roles' : role}
              </button>
            ))}
          </div>
        </div>

        {/* ── User grid ─────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            // Loading skeleton grid
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[1,2,3,4,5,6,7,8].map((i) => (
                <div
                  key={i}
                  className={`
                    rounded-xl p-4 border ${theme.border} ${theme.surface2}
                    animate-pulse flex flex-col items-center gap-3
                  `}
                >
                  <div className="w-14 h-14 rounded-full bg-white/10" />
                  <div className="w-24 h-3 rounded bg-white/10" />
                  <div className="w-16 h-2 rounded bg-white/10" />
                  <div className="w-full h-7 rounded-lg bg-white/10" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className={`
              flex flex-col items-center justify-center py-16 gap-3
              ${theme.textMuted}
            `}>
              <span className="text-3xl">🔍</span>
              <p className={`text-sm ${theme.textSec}`}>No users found</p>
              <p className="text-xs">Try a different search or role filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map((user) => {
                // Online = joined recently — placeholder until presence system
                const isOnline = Math.random() > 0.4

                return (
                  <div
                    key={user.id}
                    className={`
                      rounded-xl p-4 border ${theme.border} ${theme.surface2}
                      flex flex-col items-center gap-2.5
                      hover:border-[#4f6ef7]/40 transition-all duration-150
                    `}
                  >
                    {/* Avatar */}
                    <div className="relative">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className={`
                          w-14 h-14 rounded-full ${getAvatarColor(user.name)}
                          flex items-center justify-center
                        `}>
                          <span className="text-white text-base font-bold">
                            {getInitials(user.name)}
                          </span>
                        </div>
                      )}
                      {/* Online/offline dot */}
                      <span className={`
                        absolute bottom-0.5 right-0.5
                        w-3 h-3 rounded-full border-2
                        ${theme.surface2 === 'bg-[#161b2e]' ? 'border-[#161b2e]' : 'border-gray-100'}
                        ${isOnline ? 'bg-green-500' : 'bg-gray-500'}
                      `} />
                    </div>

                    {/* Name */}
                    <div className="text-center">
                      <div className={`
                        text-xs font-semibold ${theme.text}
                        truncate w-full max-w-[120px]
                      `}>
                        {user.name}
                      </div>
                      <div className={`text-[10px] ${theme.textMuted} truncate max-w-[120px]`}>
                        {user.username ? `@${user.username}` : user.email}
                      </div>
                    </div>

                    {/* Role badge */}
                    <span className={`
                      text-[9px] font-bold uppercase px-2 py-0.5 rounded
                      ${getRoleBadgeStyle(user.primary_role)}
                    `}>
                      {getRoleLabel(user.primary_role)}
                    </span>

                    {/* Online status text */}
                    <span className={`
                      text-[10px] flex items-center gap-1
                      ${isOnline ? 'text-green-400' : theme.textMuted}
                    `}>
                      <span className={`
                        w-1.5 h-1.5 rounded-full inline-block
                        ${isOnline ? 'bg-green-400' : 'bg-gray-500'}
                      `} />
                      {isOnline ? 'Online' : 'Offline'}
                    </span>

                    {/* Send Message button */}
                    <button
                      onClick={() => handleSendMessage(user)}
                      disabled={creatingFor === user.id}
                      className={`
                        w-full flex items-center justify-center gap-1.5
                        py-1.5 rounded-lg text-[10px] font-semibold
                        text-white transition-all
                        ${creatingFor === user.id
                          ? 'bg-[#4f6ef7]/50 cursor-not-allowed'
                          : 'bg-[#4f6ef7] hover:bg-[#3d5ce6]'
                        }
                      `}
                    >
                      {creatingFor === user.id ? (
                        <div className="w-3 h-3 rounded-full border-2 border-t-transparent border-white animate-spin" />
                      ) : (
                        <MessageSquare className="w-3 h-3" />
                      )}
                      Send Message
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <div className={`
          px-6 py-3 border-t ${theme.border} ${theme.surface2}
          flex items-center justify-between flex-shrink-0
        `}>
          <span className={`text-xs ${theme.textMuted}`}>
            {filtered.length} user{filtered.length !== 1 ? 's' : ''} found
          </span>
          <button
            onClick={onClose}
            className={`
              px-4 py-1.5 rounded-lg text-xs font-medium
              border ${theme.border} ${theme.textSec}
              hover:${theme.text} transition-colors
            `}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}