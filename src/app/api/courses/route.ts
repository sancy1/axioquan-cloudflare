
// // /app/api/courses/route.ts
// // # courses route

// import { NextRequest } from 'next/server';
// import { getCoursesAction, createCourseAction } from '@/lib/courses/actions';
// import { requireRole } from '@/lib/auth/utils';

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const category_slug = searchParams.get('category_slug');
//     const is_published = searchParams.get('is_published') === 'true';
//     const is_featured = searchParams.get('is_featured') === 'true';
//     const limit = parseInt(searchParams.get('limit') || '50');
//     const offset = parseInt(searchParams.get('offset') || '0');
    
//     const result = await getCoursesAction({
//       category_slug: category_slug || undefined,
//       is_published,
//       is_featured,
//       limit,
//       offset
//     });
    
//     if (!result.success) {
//       return Response.json(
//         { error: result.errors?.[0] || 'Failed to fetch courses' },
//         { status: 400 }
//       );
//     }

//     return Response.json({
//       courses: result.courses
//     });
//   } catch (error: any) {
//     console.error('❌ API Error fetching courses:', error);
//     return Response.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     // Check instructor role
//     await requireRole(['instructor', 'admin']);
    
//     const body = await request.json();
    
//     // Debug: Log the incoming data
//     console.log('📝 CREATE COURSE - Received data:', body);
    
//     // Ensure optional fields are properly handled
//     const processedData = {
//       ...body,
//       promo_video_url: body.promo_video_url || null, // Convert empty string to null
//       materials_url: body.materials_url || null, // Convert empty string to null
//       subtitle: body.subtitle || null,
//       description_html: body.description_html || null,
//       short_description: body.short_description || null,
//       category_id: body.category_id || null,
//     };
    
//     console.log('📝 CREATE COURSE - Processed data:', processedData);
    
//     const result = await createCourseAction(processedData);
    
//     if (!result.success) {
//       console.error('❌ CREATE COURSE - Action failed:', result.errors);
//       return Response.json(
//         { 
//           error: result.errors?.[0] || 'Failed to create course',
//           details: result.errors // Include all errors for debugging
//         },
//         { status: 400 }
//       );
//     }

//     return Response.json({
//       message: result.message,
//       course: result.course
//     }, { status: 201 });
//   } catch (error: any) {
//     console.error('❌ API Error creating course:', error);
    
//     if (error.message?.includes('unauthorized')) {
//       return Response.json(
//         { error: 'Unauthorized' },
//         { status: 403 }
//       );
//     }
    
//     return Response.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }












///src/app/api/courses/route.ts

import { NextRequest } from 'next/server';
import { getCoursesAction, createCourseAction } from '@/lib/courses/actions';
import { requireRole } from '@/lib/auth/utils';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category_slug = searchParams.get('category_slug');
    const is_published = searchParams.get('is_published') === 'true';
    const is_featured = searchParams.get('is_featured') === 'true';
    const include_reviews = searchParams.get('include_reviews') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    console.log('=== API COURSES REQUEST ===');
    console.log('include_reviews:', include_reviews);
    console.log('category_slug:', category_slug);
    console.log('is_published:', is_published);
    console.log('is_featured:', is_featured);
    
    // If include_reviews is true, we need to fetch with custom query
    if (include_reviews) {
      console.log('Fetching courses with review ratings...');
      
      let query = sql`
        SELECT 
          c.id,
          c.slug,
          c.title,
          c.subtitle,
          c.short_description,
          c.thumbnail_url,
          c.instructor_id,
          c.category_id,
          c.price_cents,
          c.is_published,
          c.is_featured,
          c.is_trending,
          c.enrolled_students_count,
          
          -- Include rating from reviews
          COALESCE(
            (SELECT AVG(rating) 
             FROM course_reviews cr 
             WHERE cr.course_id = c.id 
             AND cr.rating > 0),
            c.average_rating,
            0
          ) as average_rating,
          
          -- Review count
          COALESCE(
            (SELECT COUNT(*) 
             FROM course_reviews cr 
             WHERE cr.course_id = c.id 
             AND cr.rating > 0),
            0
          ) as review_count,
          
          c.total_views,
          c.total_video_duration,
          COALESCE(c.like_count, 0) as like_count,
          COALESCE(c.share_count, 0) as share_count,
          c.created_at,
          u.name as instructor_name,
          u.image as instructor_image,
          cat.name as category_name
        FROM courses c
        LEFT JOIN users u ON c.instructor_id = u.id
        LEFT JOIN categories cat ON c.category_id = cat.id
        WHERE 1=1
      `;

      // Add filters
      if (is_published) {
        query = sql`${query} AND c.is_published = true`;
      }
      
      if (is_featured) {
        query = sql`${query} AND c.is_featured = true`;
      }
      
      if (category_slug) {
        query = sql`${query} AND cat.slug = ${category_slug}`;
      }

      // Add ordering and limit
      query = sql`${query} ORDER BY c.created_at DESC`;

      if (limit) {
        query = sql`${query} LIMIT ${limit}`;
      }
      
      if (offset) {
        query = sql`${query} OFFSET ${offset}`;
      }

      const courses = await query;
      
      // Parse numbers to ensure proper types
      const parsedCourses = courses.map((course: any) => ({
        ...course,
        average_rating: parseFloat(course.average_rating),
        review_count: parseInt(course.review_count),
        like_count: parseInt(course.like_count),
        share_count: parseInt(course.share_count),
        enrolled_students_count: parseInt(course.enrolled_students_count),
        total_views: parseInt(course.total_views),
        price_cents: parseInt(course.price_cents),
        total_video_duration: parseInt(course.total_video_duration),
      }));
      
      // Log sample data for debugging
      console.log('=== COURSES WITH REVIEWS DATA ===');
      parsedCourses.slice(0, 5).forEach((course: any, index: number) => {
        console.log(`${index + 1}. ${course.title}`);
        console.log(`   Rating: ${course.average_rating}`);
        console.log(`   Reviews: ${course.review_count}`);
        console.log(`   Likes: ${course.like_count}`);
        console.log(`   Shares: ${course.share_count}`);
      });
      
      return Response.json({
        courses: parsedCourses,
        meta: {
          total: parsedCourses.length,
          limit,
          offset
        }
      });
    }
    
    // Original behavior for backward compatibility
    const result = await getCoursesAction({
      category_slug: category_slug || undefined,
      is_published,
      is_featured,
      limit,
      offset
    });
    
    if (!result.success) {
      return Response.json(
        { error: result.errors?.[0] || 'Failed to fetch courses' },
        { status: 400 }
      );
    }

    return Response.json({
      courses: result.courses
    });
  } catch (error: any) {
    console.error('❌ API Error fetching courses:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check instructor role
    await requireRole(['instructor', 'admin']);
    
    const body = await request.json();
    
    // Debug: Log the incoming data
    console.log('📝 CREATE COURSE - Received data:', body);
    
    // Ensure optional fields are properly handled
    const processedData = {
      ...body,
      promo_video_url: body.promo_video_url || null, // Convert empty string to null
      materials_url: body.materials_url || null, // Convert empty string to null
      subtitle: body.subtitle || null,
      description_html: body.description_html || null,
      short_description: body.short_description || null,
      category_id: body.category_id || null,
    };
    
    console.log('📝 CREATE COURSE - Processed data:', processedData);
    
    const result = await createCourseAction(processedData);
    
    if (!result.success) {
      console.error('❌ CREATE COURSE - Action failed:', result.errors);
      return Response.json(
        { 
          error: result.errors?.[0] || 'Failed to create course',
          details: result.errors // Include all errors for debugging
        },
        { status: 400 }
      );
    }

    return Response.json({
      message: result.message,
      course: result.course
    }, { status: 201 });
  } catch (error: any) {
    console.error('❌ API Error creating course:', error);
    
    if (error.message?.includes('unauthorized')) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}