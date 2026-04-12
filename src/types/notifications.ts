// src/types/notifications.ts

export interface Notification {
  id: string
  userId: string
  notificationType: string
  title: string
  message: string
  isRead: boolean
  actionUrl?: string
  iconType?: string
  data?: Record<string, unknown>
  createdAt: string
  readAt?: string
  /** Which backend owns this notification; used to route read/delete actions correctly. */
  source?: 'java' | 'csharp'
}

export interface UnreadCountResponse {
  userId: string
  unreadCount: number
}

export interface NotificationPage {
  content: Notification[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  last: boolean
}
