// src/app/api/csharp-notifications/list/route.ts
// Proxies the C# notification list to the Next.js client.

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import {
  generateCsharpToken,
  CSHARP_BASE_URL,
} from '@/lib/notifications/csharp-notification-api'
import type { Notification } from '@/types/notifications'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ content: [] }, { status: 401 })

  const tokenResult = await generateCsharpToken(session.userId)
  if (!tokenResult.success || !tokenResult.token) {
    return NextResponse.json({ content: [] }, { status: 502 })
  }

  // C# uses 1-based pagination; the hook sends 0-based — convert
  const { searchParams } = request.nextUrl
  const javaPage = parseInt(searchParams.get('page') ?? '0', 10)
  const size = searchParams.get('size') ?? '30'
  const page = javaPage + 1

  try {
    const res = await fetch(
      `${CSHARP_BASE_URL}/api/v1/notifications?page=${page}&pageSize=${size}`,
      {
        cache: 'no-store',
        headers: { Authorization: `Bearer ${tokenResult.token}` },
      }
    )
    if (!res.ok) return NextResponse.json({ content: [] })
    const data = await res.json()

    // Normalise to the same { content: Notification[] } shape the hook expects.
    const content: (Notification & { source: 'csharp' })[] = (data.notifications ?? [])
      .map((n: Notification & { data?: unknown; readAt?: string }) => ({
        id: n.id,
        userId: n.userId,
        notificationType: n.notificationType,
        title: n.title,
        message: n.message,
        isRead: n.isRead,
        actionUrl: n.actionUrl,
        iconType: n.iconType,
        createdAt: n.createdAt,
        readAt: n.readAt,
        // C# serialises `data` as a JSON string; parse it for the frontend
        data:
          n.data && typeof n.data === 'string'
            ? (() => { try { return JSON.parse(n.data as unknown as string) } catch { return undefined } })()
            : n.data,
        source: 'csharp' as const,
      }))

    return NextResponse.json({ content, unreadCount: data.unreadCount ?? 0 })
  } catch {
    return NextResponse.json({ content: [] })
  }
}
