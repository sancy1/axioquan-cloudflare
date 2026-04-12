// src/app/api/csharp-notifications/count/route.ts
// Returns the user's unread notification count from the C# service.
// Response shape: { count: number }

import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import {
  generateCsharpToken,
  CSHARP_BASE_URL,
} from '@/lib/notifications/csharp-notification-api'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ count: 0 }, { status: 401 })

  const tokenResult = await generateCsharpToken(session.userId)
  if (!tokenResult.success || !tokenResult.token) {
    return NextResponse.json({ count: 0 }, { status: 502 })
  }

  try {
    const res = await fetch(
      `${CSHARP_BASE_URL}/api/v1/notifications/unread/count`,
      {
        cache: 'no-store',
        headers: { Authorization: `Bearer ${tokenResult.token}` },
      }
    )
    if (!res.ok) return NextResponse.json({ count: 0 })
    const data = await res.json()
    return NextResponse.json({ count: data.count ?? 0 })
  } catch {
    return NextResponse.json({ count: 0 })
  }
}
