// src/app/api/notifications/list/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { generatePaymentToken } from '@/lib/payment/java-payment-api';

const BASE_URL =
  process.env.PAYMENT_SERVICE_URL ||
  process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL ||
  'http://localhost:8080';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ content: [], totalElements: 0 }, { status: 401 });
  }

  const tokenResult = await generatePaymentToken(session.userId, session.email, session.name);
  if (!tokenResult.success || !tokenResult.data?.token) {
    return NextResponse.json({ content: [], totalElements: 0 }, { status: 502 });
  }

  const { searchParams } = request.nextUrl;
  const page = searchParams.get('page') ?? '0';
  const size = searchParams.get('size') ?? '20';

  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/notifications/user/${session.userId}?page=${page}&size=${size}`,
      {
        cache: 'no-store',
        headers: { 'Authorization': `Bearer ${tokenResult.data.token}` },
      }
    );
    if (!res.ok) return NextResponse.json({ content: [], totalElements: 0 });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ content: [], totalElements: 0 });
  }
}
