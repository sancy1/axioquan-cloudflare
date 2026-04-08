
// src/components/messaging/empty-state.tsx
// Screen 08 — Three empty state variations
// Used across inbox, chat panel, and notifications
// variant: 'no-conversations' | 'empty-thread' | 'no-notifications'

'use client'

import { MessageSquare, Bell } from 'lucide-react'

interface EmptyStateProps {
  variant:      'no-conversations' | 'empty-thread' | 'no-notifications'
  theme:        Record<string, string>
  onNewMessage?: () => void
  participants?: string  // for empty-thread: "Alex, Sarah · 2 participants"
}

export default function EmptyState({
  variant,
  theme,
  onNewMessage,
  participants,
}: EmptyStateProps) {

  if (variant === 'no-conversations') {
    return (
      <div className={`
        flex flex-col items-center justify-center h-full gap-5
        px-8 text-center
      `}>
        {/* Icon */}
        <div className={`
          w-16 h-16 rounded-full border-2 ${theme.border}
          flex items-center justify-center
          ${theme.surface2}
        `}>
          <MessageSquare className={`w-7 h-7 ${theme.textMuted}`} />
        </div>

        {/* Text */}
        <div>
          <p className={`text-sm font-semibold ${theme.text} mb-1.5`}>
            No conversations yet
          </p>
          <p className={`text-xs ${theme.textMuted} leading-relaxed max-w-[220px]`}>
            Start by sending a message to your instructor or joining a study group
          </p>
        </div>

        {/* CTA */}
        {onNewMessage && (
          <button
            onClick={onNewMessage}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4f6ef7] text-white text-xs font-semibold hover:bg-[#3d5ce6] transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            + New Message
          </button>
        )}
      </div>
    )
  }

  if (variant === 'empty-thread') {
    return (
      <div className={`
        flex flex-col items-center justify-center h-full gap-4
        px-8 text-center
      `}>
        {/* Icon */}
        <div className={`
          w-16 h-16 rounded-full border-2 ${theme.border}
          flex items-center justify-center
          ${theme.surface2}
        `}>
          <span className="text-2xl">✉️</span>
        </div>

        {/* Text */}
        <div>
          <p className={`text-sm font-semibold ${theme.text} mb-1.5`}>
            Start the conversation
          </p>
          <p className={`text-xs ${theme.textMuted} leading-relaxed max-w-[220px]`}>
            No messages yet. Say hello and break the ice!
          </p>
        </div>

        {/* Participants hint */}
        {participants && (
          <p className={`text-[10px] ${theme.textMuted} italic`}>
            {participants}
          </p>
        )}
      </div>
    )
  }

  if (variant === 'no-notifications') {
    return (
      <div className={`
        flex flex-col items-center justify-center h-full gap-5
        px-8 text-center
      `}>
        {/* Icon — golden bell matching Screen 08 */}
        <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
          <Bell className="w-7 h-7 text-amber-400" />
        </div>

        {/* Text */}
        <div>
          <p className={`text-sm font-semibold ${theme.text} mb-1.5`}>
            All caught up!
          </p>
          <p className={`text-xs ${theme.textMuted} leading-relaxed max-w-[240px]`}>
            You have no unread notifications. We'll let you know when something arrives.
          </p>
        </div>
      </div>
    )
  }

  return null
}