// src/app/api/csharp-notifications/[id]/read/route.ts
// Marks a single C# notification as read.

import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import {
  generateCsharpToken,
  CSHARP_BASE_URL,
} from '@/lib/notifications/csharp-notification-api'

export async function PUT(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const tokenResult = await generateCsharpToken(session.userId)
  if (!tokenResult.success || !tokenResult.token) {
    return NextResponse.json({ error: 'Token fetch failed' }, { status: 502 })
  }

  try {
    const res = await fetch(
      `${CSHARP_BASE_URL}/api/v1/notifications/${id}/read`,
      {
        method: 'PUT',
        cache: 'no-store',
        headers: { Authorization: `Bearer ${tokenResult.token}` },
      }
    )
    if (!res.ok) return NextResponse.json({ error: 'Failed' }, { status: res.status })
    return NextResponse.json({ message: 'Notification marked as read.' })
  } catch {
    return NextResponse.json({ error: 'Network error' }, { status: 500 })
  }
}
