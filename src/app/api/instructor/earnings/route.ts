
// /app/api/instructor/earnings/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { sql } from '@/lib/db';

// ─── Types ──────────────────────────────────────────────────────────────────

interface PaymentRow {
  payment_id: string;
  reference: string;
  user_id: string;
  course_id: string;
  amount_cents: number;
  currency: string;
  original_amount_cents: number;
  original_currency: string;
  status: string;
  payment_method: string | null;
  paid_at: string | null;
  created_at: string;
  student_name: string | null;
  student_email: string;
  student_username: string | null;
  student_image: string | null;
  course_title: string | null;
  course_slug: string | null;
  course_thumbnail: string | null;
}

interface SummaryRow {
  total_students: string;
  total_courses: string;
  total_payments: string;
  total_earnings_cents: string;
  total_original_earnings_cents: string;
}

interface CourseEarningRow {
  course_id: string;
  course_title: string | null;
  course_slug: string | null;
  payment_count: string;
  student_count: string;
  total_earnings_cents: string;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const instructorId = session.userId;

    // Get all payments for instructor's courses with user and course details
    const paymentsResult = await sql`
      SELECT 
        p.id as payment_id,
        p.reference,
        p.user_id,
        p.course_id,
        p.amount_cents,
        p.currency,
        p.original_amount_cents,
        p.original_currency,
        p.status,
        p.payment_method,
        p.paid_at,
        p.created_at,
        u.name as student_name,
        u.email as student_email,
        u.username as student_username,
        u.image as student_image,
        c.title as course_title,
        c.slug as course_slug,
        c.thumbnail_url as course_thumbnail
      FROM payments p
      JOIN users u ON p.user_id = u.id
      JOIN courses c ON p.course_id = c.id
      WHERE c.instructor_id = ${instructorId}
      ORDER BY p.paid_at DESC NULLS LAST, p.created_at DESC
    `;

    // Calculate summary statistics
    const summaryResult = await sql`
      SELECT 
        COUNT(DISTINCT p.user_id) as total_students,
        COUNT(DISTINCT p.course_id) as total_courses,
        COUNT(*) as total_payments,
        COALESCE(SUM(CASE WHEN p.status = 'SUCCESS' THEN p.amount_cents ELSE 0 END), 0) as total_earnings_cents,
        COALESCE(SUM(CASE WHEN p.status = 'SUCCESS' THEN p.original_amount_cents ELSE 0 END), 0) as total_original_earnings_cents
      FROM payments p
      JOIN courses c ON p.course_id = c.id
      WHERE c.instructor_id = ${instructorId}
    `;

    // Get earnings by course breakdown
    const courseEarningsResult = await sql`
      SELECT 
        c.id as course_id,
        c.title as course_title,
        c.slug as course_slug,
        COUNT(*) as payment_count,
        COUNT(DISTINCT p.user_id) as student_count,
        COALESCE(SUM(CASE WHEN p.status = 'SUCCESS' THEN p.amount_cents ELSE 0 END), 0) as total_earnings_cents
      FROM payments p
      JOIN courses c ON p.course_id = c.id
      WHERE c.instructor_id = ${instructorId}
      GROUP BY c.id, c.title, c.slug
      ORDER BY total_earnings_cents DESC
    `;

    const summary = {
      totalStudents: parseInt(summaryResult[0]?.total_students || '0'),
      totalCourses: parseInt(summaryResult[0]?.total_courses || '0'),
      totalPayments: parseInt(summaryResult[0]?.total_payments || '0'),
      totalEarningsCents: parseInt(summaryResult[0]?.total_earnings_cents || '0'),
      totalOriginalEarningsCents: parseInt(summaryResult[0]?.total_original_earnings_cents || '0'),
    };

    const payments = paymentsResult.map((row: PaymentRow) => ({
      paymentId: row.payment_id,
      reference: row.reference,
      userId: row.user_id,
      courseId: row.course_id,
      amountCents: row.amount_cents,
      currency: row.currency,
      originalAmountCents: row.original_amount_cents,
      originalCurrency: row.original_currency,
      status: row.status,
      paymentMethod: row.payment_method,
      paidAt: row.paid_at,
      createdAt: row.created_at,
      student: {
        name: row.student_name,
        email: row.student_email,
        username: row.student_username,
        image: row.student_image,
      },
      course: {
        title: row.course_title,
        slug: row.course_slug,
        thumbnail: row.course_thumbnail,
      },
    }));

    const courseEarnings = courseEarningsResult.map((row: CourseEarningRow) => ({
      courseId: row.course_id,
      courseTitle: row.course_title,
      courseSlug: row.course_slug,
      paymentCount: parseInt(row.payment_count),
      studentCount: parseInt(row.student_count),
      totalEarningsCents: parseInt(row.total_earnings_cents),
    }));

    return NextResponse.json({
      success: true,
      summary,
      payments,
      courseEarnings,
    });
  } catch (error) {
    console.error('Error fetching instructor earnings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
