// src/components/messaging/inbox-layout.tsx
// Main client component — split panel layout
// Phase 4A: unread counts per conversation, mark read on select and textarea focus

'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sun, Moon, Plus, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import ConversationList from './conversation-list'
import ChatPanel from './chat-panel'
import NewConversationModal from './new-conversation-modal'
import { useMessaging } from '@/hooks/use-messaging'
import type { ConversationInbox, WsMessagePayload } from '@/lib/messaging/types'

interface InboxLayoutProps {
  initialConversations:         ConversationInbox[]
  currentUserId:                string
  currentUserName:              string
  currentUserImage?:            string
  currentUserRole:              string
  initialActiveConversationId?: string | null
}

export default function InboxLayout({
  initialConversations,
  currentUserId,
  currentUserName,
  currentUserImage,
  currentUserRole,
  initialActiveConversationId,
}: InboxLayoutProps) {
  const router = useRouter()

  const [isDark, setIsDark]               = useState(true)
  const [conversations, setConversations] = useState(initialConversations)
  const [activeConversationId, setActiveId] = useState<string | null>(
    initialActiveConversationId ?? initialConversations[0]?.id ?? null
  )
  const [showMobileChat, setShowMobileChat] = useState(false)
  const [showSidebar, setShowSidebar]       = useState(true)
  const [showNewModal, setShowNewModal]     = useState(false)
  const [unreadCounts, setUnreadCounts]     = useState<Record<string, number>>({})

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  ) ?? null

  // ── Refetch full conversation list ────────────────────────────────────────
  const refetchConversations = useCallback(async () => {
    try {
      const res  = await fetch('/api/messaging/proxy/conversations?limit=50')
      const data = await res.json()
      if (data.success) {
        const seen  = new Set<string>()
        const fresh = (data.data as ConversationInbox[]).filter((c) => {
          if (seen.has(c.id)) return false
          seen.add(c.id)
          return true
        })
        setConversations(fresh)
      }
    } catch {
      console.error('Failed to refetch conversations')
    }
  }, [])

  // ── WebSocket message handler ─────────────────────────────────────────────
  const handleWsMessage = useCallback((payload: WsMessagePayload) => {
    // Always dispatch — ChatPanel filters by conversationId
    window.dispatchEvent(
      new CustomEvent('messaging:new-message', { detail: payload })
    )

    setConversations((prev) => {
      const exists = prev.find((c) => c.id === payload.conversationId)
      if (exists) {
        const isCurrentlyOpen = payload.conversationId === activeConversationId
        const updated = prev.map((c) =>
          c.id === payload.conversationId
            ? {
                ...c,
                lastMessageAt: payload.timestamp,
                lastReadAt: isCurrentlyOpen ? c.lastReadAt : null,
              }
            : c
        )
        const target = updated.find((c) => c.id === payload.conversationId)
        if (!target) return updated
        return [target, ...updated.filter((c) => c.id !== payload.conversationId)]
      }
      // Not in list yet — refetch
      refetchConversations()
      return prev
    })

    // Increment unread count only if conversation is not currently open
    if (payload.conversationId !== activeConversationId) {
      setUnreadCounts((prev) => ({
        ...prev,
        [payload.conversationId]: (prev[payload.conversationId] ?? 0) + 1,
      }))
    }
  }, [activeConversationId, refetchConversations])

  // ── WebSocket connection ──────────────────────────────────────────────────
  const { isConnected, isWaking } = useMessaging({ onMessage: handleWsMessage })

  // ── Listen for conversation-read event from ChatPanel textarea focus ──────
  useEffect(() => {
    const handler = (e: Event) => {
      const { conversationId } = (e as CustomEvent).detail
      setUnreadCounts((prev) => ({ ...prev, [conversationId]: 0 }))
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? { ...c, lastReadAt: new Date().toISOString() }
            : c
        )
      )
    }
    window.addEventListener('messaging:conversation-read', handler)
    return () => window.removeEventListener('messaging:conversation-read', handler)
  }, [])

  // ── Select conversation ───────────────────────────────────────────────────
  const handleSelectConversation = useCallback(async (id: string) => {
    setActiveId(id)
    setShowMobileChat(true)

    // Clear unread count immediately
    setUnreadCounts((prev) => ({ ...prev, [id]: 0 }))

    // Mark as read in local state
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, lastReadAt: new Date().toISOString() }
          : c
      )
    )

    // Mark on server in background — non-critical
    try {
      await fetch('/api/messaging/proxy/notifications/read-all', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({}),
      })
    } catch {
      // silent
    }
  }, [])

  const handleConversationCreated = (conv: ConversationInbox) => {
    setConversations((prev) => {
      if (prev.find((c) => c.id === conv.id)) return prev
      return [conv, ...prev]
    })
    setActiveId(conv.id)
    setShowMobileChat(true)
    setShowNewModal(false)
  }

  const handleBackToList = () => setShowMobileChat(false)

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const theme = isDark
    ? {
        bg:           'bg-[#0a0d14]',
        surface:      'bg-[#111420]',
        surface2:     'bg-[#161b2e]',
        border:       'border-white/10',
        text:         'text-[#f0f2ff]',
        textSec:      'text-[#8892b0]',
        textMuted:    'text-[#4a5568]',
        accent:       'bg-[#4f6ef7]',
        accentText:   'text-[#4f6ef7]',
        accentBorder: 'border-[#4f6ef7]',
        accentSoft:   'bg-[#4f6ef7]/15',
        inputBg:      'bg-[#161b2e]',
      }
    : {
        bg:           'bg-gray-50',
        surface:      'bg-white',
        surface2:     'bg-gray-100',
        border:       'border-gray-200',
        text:         'text-gray-900',
        textSec:      'text-gray-500',
        textMuted:    'text-gray-400',
        accent:       'bg-blue-600',
        accentText:   'text-blue-600',
        accentBorder: 'border-blue-500',
        accentSoft:   'bg-blue-50',
        inputBg:      'bg-gray-50',
      }

  return (
    <div className={`flex flex-col h-full overflow-hidden ${theme.bg} relative`}>

      {/* ── Topbar ────────────────────────────────────────────────────────── */}
      <div className={`
        flex items-center gap-2 px-3 md:px-5 py-3
        border-b ${theme.border} ${theme.surface} flex-shrink-0
      `}>

        {/* Logo + title — hidden on small screens */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <div className={`w-7 h-7 rounded-lg ${theme.accent} flex items-center justify-center`}>
            <span className="text-white text-xs">💬</span>
          </div>
          <div>
            <div className={`text-xs font-semibold leading-none ${theme.text}`}>Messages</div>
            <div className={`text-[10px] leading-none mt-0.5 ${theme.textMuted}`}>hub</div>
          </div>
        </div>

        {/* Sidebar toggle */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className={`
            p-1.5 rounded-lg border ${theme.border} ${theme.textSec}
            hover:${theme.text} transition-all flex-shrink-0
          `}
          title={showSidebar ? 'Hide list' : 'Show list'}
        >
          {showSidebar
            ? <PanelLeftClose className="w-4 h-4" />
            : <PanelLeftOpen  className="w-4 h-4" />
          }
        </button>

        {/* Search */}
        <div className={`
          flex items-center gap-2 flex-1 min-w-0
          px-3 py-2 rounded-lg border ${theme.border} ${theme.inputBg}
          focus-within:border-[#4f6ef7] transition-colors
        `}>
          <svg
            className={`w-3.5 h-3.5 ${theme.textMuted} flex-shrink-0`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search conversations..."
            className={`
              bg-transparent text-xs ${theme.text}
              placeholder:text-[#4a5568] outline-none w-full min-w-0
            `}
          />
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">

          {/* New Message — desktop only */}
          <button
            onClick={() => setShowNewModal(true)}
            className={`
              hidden md:flex items-center gap-1.5
              px-3 py-1.5 rounded-lg text-xs font-medium text-white
              ${theme.accent} hover:opacity-90 transition-opacity flex-shrink-0
            `}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Message</span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className={`
              p-1.5 rounded-lg border ${theme.border}
              ${theme.textSec} transition-all
            `}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark
              ? <Sun  className="w-4 h-4 text-amber-400" />
              : <Moon className="w-4 h-4 text-slate-500" />
            }
          </button>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Left sidebar */}
        <div className={`
          flex-shrink-0 flex flex-col border-r ${theme.border} ${theme.surface}
          transition-all duration-300 overflow-hidden
          ${showSidebar ? 'w-[300px] lg:w-[320px]' : 'w-0 border-r-0'}
          ${showMobileChat ? 'hidden md:flex' : 'flex'}
        `}>
          <ConversationList
            conversations={conversations}
            activeId={activeConversationId}
            currentUserId={currentUserId}
            theme={theme}
            onSelect={handleSelectConversation}
            onConversationCreated={handleConversationCreated}
            unreadCounts={unreadCounts}
          />
        </div>

        {/* Right panel */}
        <div className={`
          flex-1 min-w-0 flex flex-col ${theme.bg}
          ${!showMobileChat ? 'hidden md:flex' : 'flex'}
        `}>
          {activeConversation ? (
            <ChatPanel
              conversation={activeConversation}
              currentUserId={currentUserId}
              currentUserName={currentUserName}
              currentUserImage={currentUserImage}
              theme={theme}
              onBack={handleBackToList}
              onConversationDeleted={(id) => {
                setConversations((prev) => prev.filter((c) => c.id !== id))
                setActiveId(null)
                setShowMobileChat(false)
              }}
            />
          ) : (
            <div className={`
              flex-1 flex flex-col items-center justify-center gap-4
              ${theme.textMuted}
            `}>
              <div className={`
                w-16 h-16 rounded-full border-2 ${theme.border}
                flex items-center justify-center
              `}>
                <span className="text-2xl">💬</span>
              </div>
              <div className="text-center">
                <p className={`font-medium ${theme.textSec}`}>
                  Select a conversation
                </p>
                <p className="text-xs mt-1">
                  Choose from the list or start a new message
                </p>
              </div>
              <button
                onClick={() => setShowNewModal(true)}
                className={`
                  hidden md:flex items-center gap-2
                  px-4 py-2 rounded-lg text-xs font-medium
                  text-white ${theme.accent}
                  hover:opacity-90 transition-opacity mt-2
                `}
              >
                <Plus className="w-3.5 h-3.5" />
                Start a conversation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── WebSocket status dot ──────────────────────────────────────────── */}
      <div className={`
        fixed bottom-3 left-1/2 -translate-x-1/2 z-40
        flex items-center gap-1.5 px-2.5 py-1 rounded-full
        text-[10px] font-medium pointer-events-none
        ${theme.surface} border ${theme.border}
        opacity-50 transition-opacity
      `}>
        <span className={`
          w-1.5 h-1.5 rounded-full transition-colors
          ${isConnected ? 'bg-green-500' : isWaking ? 'bg-amber-400' : 'bg-red-400'}
        `} />
        <span className={theme.textMuted}>
          {isConnected ? 'Live' : isWaking ? 'Waking server...' : 'Reconnecting...'}
        </span>
      </div>

      {/* ── Floating compose — mobile only ───────────────────────────────── */}
      <button
        onClick={() => setShowNewModal(true)}
        className={`
          md:hidden fixed bottom-8 right-5 z-50
          rounded-full shadow-2xl flex items-center justify-center
          ${theme.accent} text-white
          hover:opacity-90 active:scale-95
          transition-all duration-200 border-2 border-white/20
        `}
        style={{ width: 52, height: 52 }}
        title="New conversation"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* ── New Conversation modal ────────────────────────────────────────── */}
      <NewConversationModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onCreated={handleConversationCreated}
        theme={theme}
      />

    </div>
  )
}