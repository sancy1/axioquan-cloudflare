
// lib/messaging/api.ts
// Typed fetch wrapper for all messag API endpoints.
// All functions accept a token parameter — the JWT from /api/messaging/token.
// Never stores the token — caller manages token lifecycle.
// Base URL comes from NEXT_PUBLIC_MESSAGING_API_URL environment variable.

import type {
  ApiResponse,
  Conversation,
  ConversationInbox,
  Message,
  MessageWithSender,
  Participant,
  MessageNotification,
  NotificationCount,
  CreateConversationInput,
  SendMessageInput,
  UpdateConversationInput,
  AddParticipantInput,
  PaginationMeta,
} from './types'

const BASE_URL = '/api/messaging/proxy'

// ── Core fetch helper ─────────────────────────────────────────────────────────

async function messagingFetch<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
const strippedPath = path.replace(/^\/api\//, '')
const url = `${BASE_URL}/${strippedPath}`

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    })

    const data = await res.json()
    return data as ApiResponse<T>
  } catch (error) {
    console.error(`❌ Messaging API fetch failed [${path}]:`, error)
    return {
      success: false,
      error: {
        message: 'Network error — could not reach messaging server',
        code: 'NETWORK_ERROR',
      },
    }
  }
}

// ── Conversations ─────────────────────────────────────────────────────────────

export async function getConversations(
  token: string,
  params?: { page?: number; limit?: number }
): Promise<{
  conversations: ConversationInbox[]
  meta: PaginationMeta | null
}> {
  const query = new URLSearchParams()
  if (params?.page)  query.set('page',  String(params.page))
  if (params?.limit) query.set('limit', String(params.limit))

  const path = `/api/conversations${query.toString() ? `?${query}` : ''}`
  const res  = await messagingFetch<ConversationInbox[]>(path, token)

  if (res.success) {
    return { conversations: res.data, meta: res.meta }
  }

  console.error('getConversations failed:', res.error)
  return { conversations: [], meta: null }
}

export async function getConversationById(
  token: string,
  id: string
): Promise<Conversation | null> {
  const res = await messagingFetch<Conversation>(
    `/api/conversations/${id}`,
    token
  )

  if (res.success) return res.data
  console.error('getConversationById failed:', res.error)
  return null
}

export async function createConversation(
  token: string,
  input: CreateConversationInput
): Promise<Conversation | null> {
  const res = await messagingFetch<Conversation>(
    '/api/conversations',
    token,
    {
      method: 'POST',
      body:   JSON.stringify({
        type:           input.type,
        participantIds: input.participantIds,
        title:          input.title,
        course_id:      input.courseId,
      }),
    }
  )

  if (res.success) return res.data
  console.error('createConversation failed:', res.error)
  return null
}

export async function updateConversation(
  token: string,
  id: string,
  input: UpdateConversationInput
): Promise<Conversation | null> {
  const res = await messagingFetch<Conversation>(
    `/api/conversations/${id}`,
    token,
    {
      method: 'PATCH',
      body:   JSON.stringify(input),
    }
  )

  if (res.success) return res.data
  console.error('updateConversation failed:', res.error)
  return null
}

export async function deleteConversation(
  token: string,
  id: string
): Promise<boolean> {
  const res = await messagingFetch<null>(
    `/api/conversations/${id}`,
    token,
    { method: 'DELETE' }
  )

  return res.success
}

// ── Messages ──────────────────────────────────────────────────────────────────

export async function getMessages(
  token: string,
  conversationId: string,
  params?: { page?: number; limit?: number }
): Promise<{
  messages: MessageWithSender[]
  meta: PaginationMeta | null
}> {
  const query = new URLSearchParams()
  if (params?.page)  query.set('page',  String(params.page))
  if (params?.limit) query.set('limit', String(params.limit))

  const path = `/api/conversations/${conversationId}/messages${
    query.toString() ? `?${query}` : ''
  }`

  const res = await messagingFetch<MessageWithSender[]>(path, token)

  if (res.success) {
    return { messages: res.data, meta: res.meta }
  }

  console.error('getMessages failed:', res.error)
  return { messages: [], meta: null }
}

export async function sendMessage(
  token: string,
  conversationId: string,
  input: SendMessageInput
): Promise<Message | null> {
  const res = await messagingFetch<Message>(
    `/api/conversations/${conversationId}/messages`,
    token,
    {
      method: 'POST',
      body:   JSON.stringify({
        content:         input.content,
        message_type:    input.messageType ?? 'text',
        reply_to_id:     input.replyToId,
        attachment_url:  input.attachmentUrl,
        attachment_type: input.attachmentType,
        attachment_size: input.attachmentSize,
      }),
    }
  )

  if (res.success) return res.data
  console.error('sendMessage failed:', res.error)
  return null
}

export async function deleteMessage(
  token: string,
  messageId: string
): Promise<boolean> {
  const res = await messagingFetch<null>(
    `/api/messages/${messageId}`,
    token,
    { method: 'DELETE' }
  )

  return res.success
}

// ── Participants ──────────────────────────────────────────────────────────────

export async function getParticipants(
  token: string,
  conversationId: string
): Promise<Participant[]> {
  const res = await messagingFetch<Participant[]>(
    `/api/conversations/${conversationId}/participants`,
    token
  )

  if (res.success) return res.data
  console.error('getParticipants failed:', res.error)
  return []
}

export async function addParticipant(
  token: string,
  conversationId: string,
  input: AddParticipantInput
): Promise<Participant | null> {
  const res = await messagingFetch<Participant>(
    `/api/conversations/${conversationId}/participants`,
    token,
    {
      method: 'POST',
      body:   JSON.stringify(input),
    }
  )

  if (res.success) return res.data
  console.error('addParticipant failed:', res.error)
  return null
}

export async function removeParticipant(
  token: string,
  conversationId: string,
  userId: string
): Promise<boolean> {
  const res = await messagingFetch<null>(
    `/api/conversations/${conversationId}/participants/${userId}`,
    token,
    { method: 'DELETE' }
  )

  return res.success
}

// ── Notifications ─────────────────────────────────────────────────────────────

export async function getNotifications(
  token: string
): Promise<MessageNotification[]> {
  const res = await messagingFetch<MessageNotification[]>(
    '/api/notifications',
    token
  )

  if (res.success) return res.data
  console.error('getNotifications failed:', res.error)
  return []
}

export async function getNotificationCount(
  token: string
): Promise<number> {
  const res = await messagingFetch<NotificationCount>(
    '/api/notifications/count',
    token
  )

  if (res.success) return res.data.count
  console.error('getNotificationCount failed:', res.error)
  return 0
}

export async function markNotificationRead(
  token: string,
  notificationId: string
): Promise<boolean> {
  const res = await messagingFetch<null>(
    `/api/notifications/${notificationId}/read`,
    token,
    { method: 'PATCH' }
  )

  return res.success
}

export async function markAllNotificationsRead(
  token: string,
  conversationId: string
): Promise<boolean> {
  const res = await messagingFetch<null>(
    '/api/notifications/read-all',
    token,
    {
      method: 'PATCH',
      body:   JSON.stringify({ conversationId }),
    }
  )

  return res.success
}