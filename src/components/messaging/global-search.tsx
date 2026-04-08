
// src/components/messaging/global-search.tsx
// Global search across all conversations — searches by name, title, preview
// Opens as a dropdown from the top search bar in inbox-layout
// Clicking a result navigates to that conversation

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, MessageSquare, Users } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { ConversationInbox } from '@/lib/messaging/types'

interface GlobalSearchProps {
  conversations: ConversationInbox[]
  theme:         Record<string, string>
  onSelect:      (id: string) => void
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

function formatTime(dateStr: string | null) {
  if (!dateStr) return ''
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: false })
      .replace('about ','')
      .replace(' minutes','m').replace(' minute','m')
      .replace(' hours','h').replace(' hour','h')
      .replace(' days','d').replace(' day','d')
  } catch { return '' }
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} className="bg-[#4f6ef7]/30 text-[#4f6ef7] rounded px-0.5">{part}</mark>
      : part
  )
}

export default function GlobalSearch({
  conversations,
  theme,
  onSelect,
}: GlobalSearchProps) {
  const [query, setQuery]       = useState('')
  const [isOpen, setIsOpen]     = useState(false)
  const [results, setResults]   = useState<ConversationInbox[]>([])
  const inputRef                = useRef<HTMLInputElement>(null)
  const containerRef            = useRef<HTMLDivElement>(null)

  // ── Search logic ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    const q = query.toLowerCase()
    const found = conversations.filter((c) => {
      const name    = c.otherParticipant?.name?.toLowerCase() ?? ''
      const title   = c.title?.toLowerCase() ?? ''
      const preview = c.lastMessagePreview?.toLowerCase() ?? ''
      const username = c.otherParticipant?.username?.toLowerCase() ?? ''
      return (
        name.includes(q) ||
        title.includes(q) ||
        preview.includes(q) ||
        username.includes(q)
      )
    })
    setResults(found)
  }, [query, conversations])

  // ── Close on outside click ────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (id: string) => {
    onSelect(id)
    setQuery('')
    setIsOpen(false)
    setResults([])
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className="relative flex-1 min-w-0">
      {/* Search input */}
      <div className={`
        flex items-center gap-2 px-3 py-2 rounded-lg
        border ${theme.border} ${theme.inputBg}
        focus-within:border-[#4f6ef7] transition-colors
        ${isOpen && query ? 'rounded-b-none border-b-0' : ''}
      `}>
        <Search className={`w-3.5 h-3.5 ${theme.textMuted} flex-shrink-0`} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search conversations..."
          className={`
            bg-transparent text-xs ${theme.text}
            placeholder:text-[#4a5568] outline-none w-full min-w-0
          `}
        />
        {query && (
          <button onClick={handleClear} className={`${theme.textMuted} flex-shrink-0`}>
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {isOpen && query.trim() && (
        <div className={`
          absolute top-full left-0 right-0 z-50
          border ${theme.border} border-t-0 rounded-b-lg
          ${theme.surface} shadow-2xl
          max-h-72 overflow-y-auto
        `}>
          {results.length === 0 ? (
            <div className={`
              flex flex-col items-center justify-center py-6 gap-2
              ${theme.textMuted}
            `}>
              <Search className="w-5 h-5 opacity-40" />
              <p className="text-xs">No conversations match "{query}"</p>
            </div>
          ) : (
            <>
              <div className={`
                px-3 py-1.5 border-b ${theme.border}
                text-[10px] font-semibold uppercase tracking-wider ${theme.textMuted}
              `}>
                {results.length} result{results.length !== 1 ? 's' : ''}
              </div>
              {results.map((conv) => {
                const isGroup = conv.type === 'group'
                const other   = conv.otherParticipant
                const name    = isGroup
                  ? (conv.title ?? 'Group Chat')
                  : (other?.name ?? 'Unknown')
                const timeAgo = formatTime(conv.lastMessageAt)

                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelect(conv.id)}
                    className={`
                      w-full text-left flex items-center gap-3 px-3 py-2.5
                      hover:${theme.surface2} transition-colors border-b ${theme.border}
                      last:border-b-0
                    `}
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {isGroup ? (
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                          <Users className="w-3.5 h-3.5 text-purple-400" />
                        </div>
                      ) : other?.image ? (
                        <img
                          src={other.image}
                          alt={name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className={`
                          w-8 h-8 rounded-full ${getAvatarColor(name)}
                          flex items-center justify-center
                        `}>
                          <span className="text-white text-[10px] font-bold">
                            {getInitials(name)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className={`text-xs font-semibold ${theme.text} truncate`}>
                          {highlight(name, query)}
                        </span>
                        <span className={`text-[10px] ${theme.textMuted} flex-shrink-0`}>
                          {timeAgo}
                        </span>
                      </div>
                      {conv.lastMessagePreview && (
                        <p className={`text-[10px] ${theme.textMuted} truncate`}>
                          {highlight(conv.lastMessagePreview, query)}
                        </p>
                      )}
                    </div>

                    {/* Type icon */}
                    <div className={`flex-shrink-0 ${theme.textMuted}`}>
                      <MessageSquare className="w-3 h-3" />
                    </div>
                  </button>
                )
              })}
            </>
          )}
        </div>
      )}
    </div>
  )
}