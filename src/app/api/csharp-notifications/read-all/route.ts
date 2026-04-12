// src/app/api/csharp-notifications/read-all/route.ts
// Marks all C# notifications for the authenticated user as read.

import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import {
  generateCsharpToken,
  CSHARP_BASE_URL,
} from '@/lib/notifications/csharp-notification-api'

export async function PUT() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const tokenResult = await generateCsharpToken(session.userId)
  if (!tokenResult.success || !tokenResult.token) {
    return NextResponse.json({ error: 'Token fetch failed' }, { status: 502 })
  }

  try {
    const res = await fetch(
      `${CSHARP_BASE_URL}/api/v1/notifications/read-all`,
      {
        method: 'PUT',
        cache: 'no-store',
        headers: { Authorization: `Bearer ${tokenResult.token}` },
      }
    )
    if (!res.ok) return NextResponse.json({ error: 'Failed' }, { status: res.status })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Network error' }, { status: 500 })
  }
}
