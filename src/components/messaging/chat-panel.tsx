
// src/components/messaging/chat-panel.tsx
// Right panel — active conversation thread
// Phase 3: WebSocket real-time listener
// Phase 3.5: Emoji picker, delete message, clear conversation
// Phase 3.6: Group chat — members popover, group avatar in header

'use client'

import {
  useState, useEffect, useRef, useCallback
} from 'react'
import {
  ArrowLeft, MoreHorizontal, Bell, Paperclip,
  Smile, Send, Users, Trash2, X
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import EmojiPicker from './emoji-picker'
import type {
  ConversationInbox,
  MessageWithSender,
  WsMessagePayload,
  Participant,
} from '@/lib/messaging/types'

interface ChatPanelProps {
  conversation:           ConversationInbox
  currentUserId:          string
  currentUserName:        string
  currentUserImage?:      string
  theme:                  Record<string, string>
  onBack:                 () => void
  onConversationDeleted?: (id: string) => void
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

function formatMsgTime(dateStr: string) {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: false })
      .replace('about ','')
      .replace(' minutes','m').replace(' minute','m')
      .replace(' hours','h').replace(' hour','h')
      .replace(' days','d').replace(' day','d')
  } catch { return '' }
}

export default function ChatPanel({
  conversation,
  currentUserId,
  currentUserName,
  currentUserImage,
  theme,
  onBack,
  onConversationDeleted,
}: ChatPanelProps) {
  const isGroup = conversation.type === 'group'
  const other   = conversation.otherParticipant
  const name    = isGroup
    ? (conversation.title ?? 'Group Chat')
    : (other?.name ?? conversation.title ?? 'Unknown')

  // ── State ─────────────────────────────────────────────────────────────────
  const [messages, setMessages]               = useState<MessageWithSender[]>([])
  const [content, setContent]                 = useState('')
  const [loading, setLoading]                 = useState(true)
  const [sending, setSending]                 = useState(false)
  const [showEmoji, setShowEmoji]             = useState(false)
  const [showMenu, setShowMenu]               = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [clearing, setClearing]               = useState(false)
  const [hoveredMsgId, setHoveredMsgId]       = useState<string | null>(null)
  const [deletingId, setDeletingId]           = useState<string | null>(null)
  const [showMembers, setShowMembers]         = useState(false)
  const [members, setMembers]                 = useState<Participant[]>([])
  const [loadingMembers, setLoadingMembers]   = useState(false)

  const bottomRef   = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const menuRef     = useRef<HTMLDivElement>(null)
  const membersRef  = useRef<HTMLDivElement>(null)

  // ── Close dropdowns on outside click ─────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
      if (membersRef.current && !membersRef.current.contains(e.target as Node)) {
        setShowMembers(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── Reset members when conversation changes ───────────────────────────────
  useEffect(() => {
    setMembers([])
    setShowMembers(false)
  }, [conversation.id])

  // ── Fetch messages ────────────────────────────────────────────────────────
  const fetchMessages = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch(
        `/api/messaging/proxy/conversations/${conversation.id}/messages?limit=50`
      )
      const data = await res.json()
      if (data.success) setMessages(data.data)
    } catch (err) {
      console.error('Failed to fetch messages:', err)
    } finally {
      setLoading(false)
    }
  }, [conversation.id])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  // ── WebSocket real-time listener ──────────────────────────────────────────
  useEffect(() => {
    const handler = (e: Event) => {
      const payload = (e as CustomEvent).detail as WsMessagePayload
      if (payload.conversationId === conversation.id) {
        fetchMessages()
      }
    }
    window.addEventListener('messaging:new-message', handler)
    return () => window.removeEventListener('messaging:new-message', handler)
  }, [conversation.id, fetchMessages])

  // ── Scroll to bottom on new messages ─────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Fetch participants when members panel opens ───────────────────────────
  useEffect(() => {
    if (!showMembers || members.length > 0) return
    const fetchMembers = async () => {
      setLoadingMembers(true)
      try {
        const res  = await fetch(
          `/api/messaging/proxy/conversations/${conversation.id}/participants`
        )
        const data = await res.json()
        if (data.success) setMembers(data.data)
      } catch {
        console.error('Failed to fetch members')
      } finally {
        setLoadingMembers(false)
      }
    }
    fetchMembers()
  }, [showMembers, conversation.id, members.length])

  // ── Send message ──────────────────────────────────────────────────────────
  const handleSend = async () => {
    const text = content.trim()
    if (!text || sending) return
    setSending(true)
    setContent('')
    try {
      const res  = await fetch(
        `/api/messaging/proxy/conversations/${conversation.id}/messages`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ content: text, message_type: 'text' }),
        }
      )
      const data = await res.json()
      if (data.success) {
        const newMsg: MessageWithSender = {
          ...data.data,
          sender: {
            username: currentUserName,
            name:     currentUserName,
            image:    currentUserImage ?? null,
          },
          recipientHasRead: false,
          recipientReadAt:  null,
        }
        setMessages((prev) => [...prev, newMsg])
      }
    } catch (err) {
      console.error('Failed to send message:', err)
      setContent(text)
    } finally {
      setSending(false)
      textareaRef.current?.focus()
    }
  }


  // ── Mark as read when user focuses the input ──────────────────────────────
// Fires when user clicks into the text area — assumes all messages are read
const handleTextareaFocus = useCallback(async () => {
  try {
    await fetch('/api/messaging/proxy/notifications/read-all', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({}),
    })
    // Tell the sidebar to clear the unread badge for this conversation
    window.dispatchEvent(
      new CustomEvent('messaging:conversation-read', {
        detail: { conversationId: conversation.id }
      })
    )
  } catch {
    // Non-critical
  }
}, [conversation.id])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ── Emoji insert at cursor position ───────────────────────────────────────
  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current
    if (!textarea) {
      setContent((prev) => prev + emoji)
      return
    }
    const start      = textarea.selectionStart
    const end        = textarea.selectionEnd
    const newContent =
      content.substring(0, start) + emoji + content.substring(end)
    setContent(newContent)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + emoji.length, start + emoji.length)
    }, 0)
  }

  // ── Delete individual message ─────────────────────────────────────────────
  const handleDeleteMessage = async (messageId: string) => {
    setDeletingId(messageId)
    try {
      const res  = await fetch(`/api/messaging/proxy/messages/${messageId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId ? { ...m, content: '[Message deleted]' } : m
          )
        )
      }
    } catch (err) {
      console.error('Failed to delete message:', err)
    } finally {
      setDeletingId(null)
      setHoveredMsgId(null)
    }
  }

  // ── Delete conversation ───────────────────────────────────────────────────
  const handleClearConversation = async () => {
    setClearing(true)
    try {
      const res  = await fetch(
        `/api/messaging/proxy/conversations/${conversation.id}`,
        { method: 'DELETE' }
      )
      const data = await res.json()
      if (data.success) {
        onConversationDeleted?.(conversation.id)
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err)
    } finally {
      setClearing(false)
      setShowClearConfirm(false)
      setShowMenu(false)
    }
  }

  // ── Group messages by date ────────────────────────────────────────────────
  const groupedMessages = messages.reduce<Record<string, MessageWithSender[]>>(
    (groups, msg) => {
      const date = new Date(msg.createdAt).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      }).toUpperCase()
      if (!groups[date]) groups[date] = []
      groups[date].push(msg)
      return groups
    },
    {}
  )

  return (
    <>
      {/* ── Chat header ────────────────────────────────────────────────────── */}
      <div className={`
        flex items-center gap-3 px-5 py-3.5
        border-b ${theme.border} ${theme.surface} flex-shrink-0
      `}>

        {/* Mobile back button */}
        <button
          onClick={onBack}
          className={`md:hidden p-1.5 rounded-lg ${theme.textSec} transition-colors`}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Avatar — group gets purple icon, direct gets photo */}
        <div className="relative flex-shrink-0">
          {isGroup ? (
            <div className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-400" />
            </div>
          ) : other?.image ? (
            <img
              src={other.image}
              alt={name}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className={`
              w-9 h-9 rounded-full ${getAvatarColor(name)}
              flex items-center justify-center
            `}>
              <span className="text-white text-xs font-bold">
                {getInitials(name)}
              </span>
            </div>
          )}
          {/* Online dot — direct only */}
          {!isGroup && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-current" />
          )}
        </div>

        {/* Name + status/type */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className={`text-sm font-semibold ${theme.text} truncate`}>
              {name}
            </div>
            {isGroup && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 flex-shrink-0 flex items-center gap-1">
                <Users className="w-2.5 h-2.5" />
                Group
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {isGroup ? (
              <span className={`text-xs ${theme.textSec}`}>
                Click 👥 to view members
              </span>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                <span className={`text-xs ${theme.textSec}`}>
                  Online{conversation.title ? ` · ${conversation.title}` : ''}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">

          {/* Members popover */}
          <div className="relative" ref={membersRef}>
            <button
              onClick={() => setShowMembers(!showMembers)}
              className={`
                p-1.5 rounded-lg border ${theme.border}
                ${theme.textSec} transition-colors
                ${showMembers ? theme.accentSoft : ''}
              `}
              title="View members"
            >
              <Users className="w-3.5 h-3.5" />
            </button>

            {showMembers && (
              <div className={`
                absolute right-0 top-full mt-1 w-64 rounded-xl
                border ${theme.border} ${theme.surface}
                shadow-2xl overflow-hidden z-50
              `}>
                {/* Members header */}
                <div className={`
                  px-4 py-2.5 border-b ${theme.border}
                  flex items-center justify-between
                `}>
                  <span className={`text-xs font-semibold ${theme.text}`}>
                    {isGroup ? 'Group Members' : 'Participants'}
                  </span>
                  <button
                    onClick={() => setShowMembers(false)}
                    className={theme.textMuted}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Members list */}
                {loadingMembers ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-[#4f6ef7] animate-spin" />
                  </div>
                ) : members.length === 0 ? (
                  <div className={`py-4 text-center text-xs ${theme.textMuted}`}>
                    No members found
                  </div>
                ) : (
                  <div className="py-1 max-h-60 overflow-y-auto">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className={`
                          flex items-center gap-2.5 px-4 py-2.5
                          hover:${theme.surface2} transition-colors
                        `}
                      >
                        {/* Member avatar */}
                        {member.user?.image ? (
                          <img
                            src={member.user.image}
                            alt={member.user.name}
                            className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className={`
                            w-7 h-7 rounded-full flex-shrink-0
                            ${getAvatarColor(member.user?.name ?? '')}
                            flex items-center justify-center
                          `}>
                            <span className="text-white text-[10px] font-bold">
                              {getInitials(member.user?.name ?? '?')}
                            </span>
                          </div>
                        )}

                        {/* Member info */}
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-medium ${theme.text} truncate`}>
                            {member.user?.name ?? 'Unknown'}
                            {member.userId === currentUserId && (
                              <span className={`ml-1.5 text-[10px] ${theme.textMuted}`}>
                                (you)
                              </span>
                            )}
                          </div>
                          <div className={`text-[10px] ${theme.textMuted} capitalize`}>
                            {member.role}
                          </div>
                        </div>

                        {/* Online dot */}
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bell button */}
          <button className={`
            p-1.5 rounded-lg border ${theme.border}
            ${theme.textSec} transition-colors
          `}>
            <Bell className="w-3.5 h-3.5" />
          </button>

          {/* Three-dot menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`
                p-1.5 rounded-lg border ${theme.border}
                ${theme.textSec} transition-colors
                ${showMenu ? theme.accentSoft : ''}
              `}
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <div className={`
                absolute right-0 top-full mt-1 w-48 rounded-xl
                border ${theme.border} ${theme.surface}
                shadow-2xl overflow-hidden z-50
              `}>
                <button
                  onClick={() => {
                    setShowMenu(false)
                    setShowClearConfirm(true)
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete conversation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Delete conversation confirm dialog ────────────────────────────── */}
      {showClearConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className={`
            w-80 rounded-2xl border ${theme.border} ${theme.surface}
            p-6 shadow-2xl
          `}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <div className={`text-sm font-semibold ${theme.text}`}>
                  Delete conversation
                </div>
                <div className={`text-xs ${theme.textMuted}`}>
                  This cannot be undone
                </div>
              </div>
            </div>
            <p className={`text-xs ${theme.textSec} mb-5 leading-relaxed`}>
              Are you sure you want to delete this conversation with{' '}
              <strong className={theme.text}>{name}</strong>?
              All messages will be permanently removed.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className={`
                  flex-1 px-4 py-2 rounded-lg text-xs font-medium
                  border ${theme.border} ${theme.textSec} transition-colors
                `}
              >
                Cancel
              </button>
              <button
                onClick={handleClearConversation}
                disabled={clearing}
                className="flex-1 px-4 py-2 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center gap-1.5"
              >
                {clearing
                  ? <div className="w-3 h-3 rounded-full border-2 border-t-transparent border-white animate-spin" />
                  : <Trash2 className="w-3 h-3" />
                }
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Messages area ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4 scrollbar-thin">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className={`
              w-6 h-6 rounded-full border-2 border-t-transparent
              ${theme.accentBorder} animate-spin
            `} />
          </div>
        ) : messages.length === 0 ? (
          <div className={`flex flex-col items-center justify-center h-full gap-3 ${theme.textMuted}`}>
            <div className={`w-14 h-14 rounded-full border-2 ${theme.border} flex items-center justify-center`}>
              <span className="text-xl">✉️</span>
            </div>
            <p className={`text-sm ${theme.textSec}`}>Start the conversation</p>
            <p className="text-xs">No messages yet. Say hello!</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>

              {/* Date divider */}
              <div className="flex items-center gap-3 my-4">
                <div className={`flex-1 h-px bg-current opacity-10 ${theme.textMuted}`} />
                <span className={`text-[10px] font-medium tracking-wider ${theme.textMuted}`}>
                  {date}
                </span>
                <div className={`flex-1 h-px bg-current opacity-10 ${theme.textMuted}`} />
              </div>

              <div className="space-y-3">
                {msgs.map((msg) => {
                  const isOwn     = msg.senderId === currentUserId
                  const isDeleted = msg.content === '[Message deleted]'
                  const isHovered = hoveredMsgId === msg.id

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${isOwn ? 'flex-row-reverse' : 'flex-row'} group`}
                      onMouseEnter={() => setHoveredMsgId(msg.id)}
                      onMouseLeave={() => setHoveredMsgId(null)}
                    >
                      {/* Incoming avatar */}
                      {!isOwn && (
                        <div className="flex-shrink-0 self-end">
                          {msg.sender?.image ? (
                            <img
                              src={msg.sender.image}
                              alt={msg.sender.name}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                          ) : (
                            <div className={`
                              w-7 h-7 rounded-full
                              ${getAvatarColor(msg.sender?.name ?? '')}
                              flex items-center justify-center
                            `}>
                              <span className="text-white text-[10px] font-bold">
                                {getInitials(msg.sender?.name ?? '?')}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className={`
                        flex flex-col max-w-[72%]
                        ${isOwn ? 'items-end' : 'items-start'}
                      `}>
                        {/* Sender name — incoming only */}
                        {!isOwn && (
                          <span className={`text-[10px] font-semibold mb-1 ${theme.accentText}`}>
                            {msg.sender?.name ?? 'Unknown'}
                          </span>
                        )}

                        {/* Bubble + delete row */}
                        <div className={`
                          flex items-center gap-1.5
                          ${isOwn ? 'flex-row-reverse' : 'flex-row'}
                        `}>

                          {/* Delete button — own messages on hover */}
                          {isOwn && !isDeleted && isHovered && (
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              disabled={deletingId === msg.id}
                              className="p-1 rounded-lg opacity-70 hover:opacity-100 transition-all text-red-400 hover:bg-red-500/15 flex-shrink-0"
                              title="Delete message"
                            >
                              {deletingId === msg.id
                                ? <div className="w-3 h-3 rounded-full border border-t-transparent border-red-400 animate-spin" />
                                : <Trash2 className="w-3 h-3" />
                              }
                            </button>
                          )}

                          {/* Message bubble */}
                          <div className={`
                            px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
                            ${isOwn
                              ? 'bg-[#4f6ef7] text-white rounded-br-sm'
                              : `${theme.surface2} ${theme.text} rounded-bl-sm`
                            }
                            ${isDeleted ? 'italic opacity-40' : ''}
                          `}>
                            {msg.content}
                          </div>
                        </div>

                        {/* Time + read receipt */}
                        <div className={`flex items-center gap-1.5 mt-1 ${theme.textMuted}`}>
                          <span className="text-[10px]">
                            {formatMsgTime(msg.createdAt)}
                          </span>
                          {isOwn && !isDeleted && (
                            <span className={`text-[10px] ${
                              msg.isRead
                                ? 'text-blue-400'
                                : msg.isDelivered
                                  ? 'text-green-400'
                                  : theme.textMuted
                            }`}>
                              {msg.isRead ? '✓✓' : msg.isDelivered ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input area ────────────────────────────────────────────────────── */}
      <div className={`px-5 py-4 border-t ${theme.border} ${theme.surface} flex-shrink-0`}>
        <div className={`
          flex items-end gap-2.5 px-4 py-3 rounded-xl border
          ${theme.border} ${theme.inputBg}
          focus-within:border-[#4f6ef7] transition-colors relative
        `}>

          {/* Attachment button */}
          <button className={`${theme.textMuted} transition-colors flex-shrink-0 pb-0.5`}>
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleTextareaFocus}
            placeholder="Type your message here..."
            rows={2}
            style={{ resize: 'none' }}
            className={`
              flex-1 bg-transparent text-sm ${theme.text}
              placeholder:text-[#4a5568] outline-none
              min-h-[44px] max-h-[160px] overflow-y-auto
            `}
          />

          <div className="flex items-center gap-1.5 flex-shrink-0 pb-0.5">
            {/* Character count */}
            <span className={`text-[10px] ${theme.textMuted}`}>
              {content.length}/5000
            </span>

            {/* Emoji picker */}
            <div className="relative">
              <button
                onClick={() => setShowEmoji(!showEmoji)}
                className={`transition-colors ${showEmoji ? theme.accentText : theme.textMuted}`}
              >
                <Smile className="w-4 h-4" />
              </button>
              {showEmoji && (
                <EmojiPicker
                  onSelect={handleEmojiSelect}
                  onClose={() => setShowEmoji(false)}
                  theme={theme}
                />
              )}
            </div>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!content.trim() || sending}
              className={`
                w-8 h-8 rounded-lg flex items-center justify-center transition-all
                ${content.trim() && !sending
                  ? 'bg-[#4f6ef7] text-white hover:bg-[#3d5ce6] scale-100'
                  : `${theme.surface2} ${theme.textMuted} scale-95 cursor-not-allowed`
                }
              `}
            >
              {sending
                ? <div className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent border-white animate-spin" />
                : <Send className="w-3.5 h-3.5" />
              }
            </button>
          </div>
        </div>

        <p className={`text-[10px] ${theme.textMuted} mt-1.5 px-1`}>
          Press Enter to send · Shift + Enter for new line
        </p>
      </div>
    </>
  )
}
