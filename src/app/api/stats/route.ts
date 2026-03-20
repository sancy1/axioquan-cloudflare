
// /src/app/api/stats/route.ts

import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    console.log('📊 /api/stats called');
    console.log('📊 DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('📊 sql exists:', !!sql);

    // Run each query separately so we can see exactly which one fails
    let activeLearners = 0;
    let expertInstructors = 0;
    let coursesAvailable = 0;
    let averageRating = 0;

    try {
      const learnersResult = await sql`
        SELECT COUNT(DISTINCT user_id) as count
        FROM enrollments
        WHERE status = 'active'
      `;
      activeLearners = parseInt(learnersResult[0]?.count ?? '0');
      console.log('✅ activeLearners:', activeLearners);
    } catch (e: any) {
      console.error('❌ activeLearners query failed:', e.message);
    }

    try {
      const instructorsResult = await sql`
        SELECT COUNT(DISTINCT instructor_id) as count
        FROM courses
        WHERE is_published = true
      `;
      expertInstructors = parseInt(instructorsResult[0]?.count ?? '0');
      console.log('✅ expertInstructors:', expertInstructors);
    } catch (e: any) {
      console.error('❌ expertInstructors query failed:', e.message);
    }

    try {
      const coursesResult = await sql`
        SELECT COUNT(*) as count
        FROM courses
        WHERE is_published = true
      `;
      coursesAvailable = parseInt(coursesResult[0]?.count ?? '0');
      console.log('✅ coursesAvailable:', coursesAvailable);
    } catch (e: any) {
      console.error('❌ coursesAvailable query failed:', e.message);
    }

    try {
      const ratingResult = await sql`
        SELECT ROUND(AVG(rating)::numeric, 1) as avg_rating
        FROM course_reviews
        WHERE status = 'active'
          AND is_public = true
      `;
      averageRating = parseFloat(ratingResult[0]?.avg_rating ?? '0');
      console.log('✅ averageRating:', averageRating);
    } catch (e: any) {
      console.error('❌ averageRating query failed:', e.message);
    }

    const result = { activeLearners, expertInstructors, coursesAvailable, averageRating };
    console.log('📊 Final stats result:', result);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('❌ /api/stats top-level error:', error.message);
    return NextResponse.json(
      { error: error.message, activeLearners: 0, expertInstructors: 0, coursesAvailable: 0, averageRating: 0 },
      { status: 500 }
    );
  }
}