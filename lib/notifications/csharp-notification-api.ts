// lib/notifications/csharp-notification-api.ts
// Server-side helper for the C# AxioNotification service.
// Used by Next.js API routes to authenticate and call the C# service.

export const CSHARP_BASE_URL =
  process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5231'

export interface CsharpTokenResult {
  success: boolean
  token?: string
}

/**
 * Exchanges a userId for a C# notification-service JWT (7-day token).
 * The C# /auth/generate-token endpoint validates userId against the DB —
 * no shared secret is required.
 */
export async function generateCsharpToken(userId: string): Promise<CsharpTokenResult> {
  try {
    const res = await fetch(
      `${CSHARP_BASE_URL}/api/v1/auth/generate-token?userId=${encodeURIComponent(userId)}`,
      { method: 'POST', cache: 'no-store' }
    )
    if (!res.ok) return { success: false }
    const data = await res.json()
    if (!data.token) return { success: false }
    return { success: true, token: data.token }
  } catch {
    return { success: false }
  }
}

/**
 * Returns true for notification types that the Java payment service already
 * handles, so they are filtered out of the C# notification list to prevent
 * duplicate entries in the bell tray.
 */
export function isPaymentType(notificationType: string): boolean {
  const t = notificationType.toLowerCase()
  return t.includes('payment') || t.includes('refund')
}
