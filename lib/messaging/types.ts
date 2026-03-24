
// lib/messaging/types.ts
// TypeScript types matching the messag API response shapes exactly

// ── Conversation types ────────────────────────────────────────────────────────

export type ConversationType = 'direct' | 'group'

export interface ConversationParticipant {
  id: string
  username: string
  name: string
  image: string | null
}

export interface Conversation {
  id: string
  type: ConversationType
  title: string | null
  courseId: string | null
  createdBy: string
  lastMessageAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ConversationInbox extends Conversation {
  myRole: string
  lastReadAt: string | null
  otherParticipant: ConversationParticipant
  lastMessagePreview: string | null
}

// ── Message types ─────────────────────────────────────────────────────────────

export type MessageType = 'text' | 'image' | 'file' | 'audio'

export interface MessageSender {
  username: string
  name: string
  image: string | null
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  content: string
  messageType: MessageType
  attachmentUrl: string | null
  attachmentType: string | null
  attachmentSize: number | null
  isDelivered: boolean
  isRead: boolean
  deliveredAt: string | null
  readAt: string | null
  isEdited: boolean
  editedAt: string | null
  replyToId: string | null
  reactions: Record<string, unknown> | null
  createdAt: string
}

export interface MessageWithSender extends Message {
  sender: MessageSender
  recipientHasRead: boolean | null
  recipientReadAt: string | null
}

// ── Participant types ─────────────────────────────────────────────────────────

export interface Participant {
  id: string
  conversationId: string
  userId: string
  role: string
  joinedAt: string
  lastReadAt: string | null
  user: {
    username: string
    name: string
    image: string | null
  }
}

// ── Notification types ────────────────────────────────────────────────────────

export interface MessageNotification {
  id: string
  userId: string
  conversationId: string
  messageId: string
  isRead: boolean
  readAt: string | null
  createdAt: string
  sender: {
    username: string
    name: string
  }
  messagePreview: string
  conversationTitle: string | null
}

export interface NotificationCount {
  count: number
}

// ── API response wrapper types ────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true
  message: string
  data: T
  meta: PaginationMeta | null
}

export interface ApiError {
  success: false
  error: {
    message: string
    code: string
    fields?: Record<string, string[]>
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// ── Request input types ───────────────────────────────────────────────────────

export interface CreateConversationInput {
  type: ConversationType
  participantIds: string[]
  title?: string
  courseId?: string
}

export interface SendMessageInput {
  content: string
  messageType?: MessageType
  replyToId?: string
  attachmentUrl?: string
  attachmentType?: string
  attachmentSize?: number
}

export interface UpdateConversationInput {
  title: string
}

export interface AddParticipantInput {
  userId: string
  role?: string
}

// ── WebSocket event types ─────────────────────────────────────────────────────

export type WsEventType =
  | 'message'
  | 'delivered'
  | 'read'
  | 'typing'
  | 'ping'
  | 'pong'
  | 'error'
  | 'connected'

export interface WsEvent<T = unknown> {
  type: WsEventType
  payload?: T
}

export interface WsMessagePayload {
  messageId: string
  conversationId: string
  senderId: string
  timestamp: string
}

export interface WsConnectedPayload {
  userId: string
  message: string
  timestamp: string
}

export interface WsTypingPayload {
  conversationId: string
  userId: string
  userName: string
}