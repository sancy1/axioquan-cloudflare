
// // src/app/api/messaging/proxy/[...path]/route.ts
// // Proxies all messag API requests through Next.js.
// // Solves CORS permanently — browser talks to localhost:3000
// // Next.js server talks to messag API (server-to-server, no CORS)
// // Also hides the messag API URL from the browser entirely.

// import { NextRequest, NextResponse } from 'next/server'
// import { SignJWT } from 'jose'
// import { getSession } from '@/lib/auth/session'

// const MESSAGING_API_URL = process.env.NEXT_PUBLIC_MESSAGING_API_URL || ''

// const JWT_SECRET = new TextEncoder().encode(
//   process.env.MESSAGING_JWT_SECRET || ''
// )

// async function getMessagingToken(session: {
//   userId: string
//   email: string
//   primaryRole: string
// }): Promise<string> {
//   return new SignJWT({
//     userId: session.userId,
//     email:  session.email,
//     role:   session.primaryRole,
//   })
//     .setProtectedHeader({ alg: 'HS256' })
//     .setIssuedAt()
//     .setExpirationTime('7d')
//     .sign(JWT_SECRET)
// }

// async function handleRequest(
//   request: NextRequest,
//   params: { path: string[] }
// ): Promise<NextResponse> {
//   try {
//     const session = await getSession()

//     if (!session) {
//       return NextResponse.json(
//         { success: false, error: { message: 'Unauthorised', code: 'UNAUTHORISED' } },
//         { status: 401 }
//       )
//     }

//     const token   = await getMessagingToken(session)
//     const apiPath = params.path.join('/')
//     const url     = new URL(request.url)
//     const query   = url.search
//     const target  = `${MESSAGING_API_URL}/api/${apiPath}${query}`

//     const headers: Record<string, string> = {
//       'Content-Type':  'application/json',
//       'Authorization': `Bearer ${token}`,
//     }

//     let body: string | undefined
//     if (request.method !== 'GET' && request.method !== 'HEAD') {
//       body = await request.text()
//     }

//     const response = await fetch(target, {
//       method:  request.method,
//       headers,
//       body,
//     })

//     const data = await response.json()
//     return NextResponse.json(data, { status: response.status })

//   } catch (error) {
//     console.error('❌ Messaging proxy error:', error)
//     return NextResponse.json(
//       {
//         success: false,
//         error: {
//           message: 'Proxy error — could not reach messaging server',
//           code:    'PROXY_ERROR',
//         },
//       },
//       { status: 500 }
//     )
//   }
// }

// export async function GET(
//   request: NextRequest,
//   { params }: { params: Promise<{ path: string[] }> }
// ) {
//   return handleRequest(request, await params)
// }

// export async function POST(
//   request: NextRequest,
//   { params }: { params: Promise<{ path: string[] }> }
// ) {
//   return handleRequest(request, await params)
// }

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: Promise<{ path: string[] }> }
// ) {
//   return handleRequest(request, await params)
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: Promise<{ path: string[] }> }
// ) {
//   return handleRequest(request, await params)
// }























// src/app/api/messaging/proxy/[...path]/route.ts
// Proxies all messag API requests through Next.js.
// Solves CORS permanently — browser talks to localhost:3000
// Next.js server talks to messag API (server-to-server, no CORS)
// Also hides the messag API URL from the browser entirely.
// FIXED: empty body on PATCH/POST now sends '{}' to satisfy Fastify JSON parser

import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { getSession } from '@/lib/auth/session'

const MESSAGING_API_URL = process.env.NEXT_PUBLIC_MESSAGING_API_URL || ''

const JWT_SECRET = new TextEncoder().encode(
  process.env.MESSAGING_JWT_SECRET || ''
)

async function getMessagingToken(session: {
  userId:      string
  email:       string
  primaryRole: string
}): Promise<string> {
  return new SignJWT({
    userId: session.userId,
    email:  session.email,
    role:   session.primaryRole,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

async function handleRequest(
  request: NextRequest,
  params:  { path: string[] }
): Promise<NextResponse> {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorised', code: 'UNAUTHORISED' } },
        { status: 401 }
      )
    }

    const token   = await getMessagingToken(session)
    const apiPath = params.path.join('/')
    const url     = new URL(request.url)
    const query   = url.search
    const target  = `${MESSAGING_API_URL}/api/${apiPath}${query}`

    const headers: Record<string, string> = {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`,
    }

    let body: string | undefined
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const raw = await request.text()
      // FIXED: Fastify rejects empty body when content-type is application/json
      // Always send at least '{}' for PATCH and POST requests
      body = raw.trim() === '' ? '{}' : raw
    }

    const response = await fetch(target, {
      method:  request.method,
      headers,
      body,
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })

  } catch (error) {
    console.error('❌ Messaging proxy error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Proxy error — could not reach messaging server',
          code:    'PROXY_ERROR',
        },
      },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, await params)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, await params)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, await params)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, await params)
}