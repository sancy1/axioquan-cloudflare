// lib/notifications/send-notification.ts
// Server-side helper: fire-and-forget notification to the C# AxioNotification service.
// Uses X-Service-Key (SERVICE_SECRET env var) — no user token required.
// Import this from any Next.js API route or server action.

const BASE = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5231'
const SERVICE_KEY = process.env.SERVICE_SECRET

interface NotificationPayload {
  userId: string
  notificationType: string
  title: string
  message: string
  actionUrl?: string
  iconType?: string
  data?: Record<string, unknown>
}

/**
 * Fire-and-forget: create a notification for any user from server-side code.
 * Never throws — notification failure never blocks the main user flow.
 */
export async function sendNotification(payload: NotificationPayload): Promise<void> {
  if (!BASE || !SERVICE_KEY) {
    console.warn('[Notifications] NOTIFICATION_SERVICE_URL or SERVICE_SECRET not set — skipping notification')
    return
  }
  try {
    const res = await fetch(`${BASE}/api/v1/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Service-Key': SERVICE_KEY,
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      console.error('[Notifications] POST failed:', res.status, await res.text().catch(() => ''))
    }
  } catch (err) {
    console.error('[Notifications] network error:', err)
  }
}
