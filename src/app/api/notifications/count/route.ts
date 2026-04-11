// src/app/api/notifications/count/route.ts

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { generatePaymentToken } from '@/lib/payment/java-payment-api';

const BASE_URL =
  process.env.PAYMENT_SERVICE_URL ||
  process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL ||
  'http://localhost:8080';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ unreadCount: 0 }, { status: 401 });
  }

  const tokenResult = await generatePaymentToken(session.userId, session.email, session.name);
  if (!tokenResult.success || !tokenResult.data?.token) {
    return NextResponse.json({ unreadCount: 0 }, { status: 502 });
  }

  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/notifications/user/${session.userId}/unread/count`,
      {
        cache: 'no-store',
        headers: { 'Authorization': `Bearer ${tokenResult.data.token}` },
      }
    );
    if (!res.ok) return NextResponse.json({ unreadCount: 0 });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ unreadCount: 0 });
  }
}
