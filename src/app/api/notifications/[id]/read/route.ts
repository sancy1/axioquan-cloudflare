// src/app/api/notifications/[id]/read/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { generatePaymentToken } from '@/lib/payment/java-payment-api';

const BASE_URL =
  process.env.PAYMENT_SERVICE_URL ||
  process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL ||
  'http://localhost:8080';

export async function PUT(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tokenResult = await generatePaymentToken(session.userId, session.email, session.name);
  if (!tokenResult.success || !tokenResult.data?.token) {
    return NextResponse.json({ success: false }, { status: 502 });
  }

  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/notifications/${params.id}/read`,
      {
        method: 'PUT',
        cache: 'no-store',
        headers: { 'Authorization': `Bearer ${tokenResult.data.token}` },
      }
    );
    if (!res.ok) return NextResponse.json({ success: false }, { status: res.status });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
