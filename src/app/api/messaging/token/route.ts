
// src/app/api/messaging/token/route.ts
// Bridges the axioquan cookie session to a messag API JWT token.
// The messag API requires a JWT — axioquan uses a cookie session.
// This route reads the server-side cookie and signs a short-lived JWT
// using jose (already installed) and the shared JWT_SECRET.
// Called once on mount by the useMessaging hook.

import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { getSession } from '@/lib/auth/session'

// Must match the JWT_SECRET in the messag API .env
const JWT_SECRET = new TextEncoder().encode(
  process.env.MESSAGING_JWT_SECRET || process.env.JWT_SECRET || ''
)

export async function GET() {
  try {
    // ── Read axioquan session ─────────────────────────────────────────────────
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorised — no active session' },
        { status: 401 }
      )
    }

    if (!JWT_SECRET.length) {
      console.error('❌ MESSAGING_JWT_SECRET or JWT_SECRET is not set')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // ── Sign a messag-compatible JWT ──────────────────────────────────────────
    // Payload matches exactly what the messag API expects:
    // { userId, email, role } — see src/types/fastify.d.ts in messag repo
    const token = await new SignJWT({
      userId: session.userId,
      email:  session.email,
      role:   session.primaryRole,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    return NextResponse.json({ token })
  } catch (error) {
    console.error('❌ Failed to generate messaging token:', error)
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    )
  }
}