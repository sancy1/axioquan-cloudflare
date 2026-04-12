
// // /app/api/courses/[id]/enroll/route.ts

// import { NextRequest } from 'next/server';
// import { getSession } from '@/lib/auth/session';
// import { enrollUserInCourse } from '@/lib/db/queries/courses';

// interface RouteParams {
//   params: Promise<{ id: string }>;
// }

// export async function POST(request: NextRequest, { params }: RouteParams) {
//   try {
//     const session = await getSession();
//     if (!session) {
//       return Response.json(
//         { 
//           success: false,
//           message: 'Authentication required'
//         },
//         { status: 401 }
//       );
//     }

//     const { id } = await params;
    
//     if (!id) {
//       return Response.json(
//         { 
//           success: false,
//           message: 'Course ID is required'
//         },
//         { status: 400 }
//       );
//     }

//     // Enroll user in course
//     const result = await enrollUserInCourse(session.userId, id);

//     if (result.success) {
//       return Response.json({
//         success: true,
//         message: 'Successfully enrolled in course',
//         enrollment: result.enrollment
//       });
//     } else {
//       return Response.json(
//         { 
//           success: false,
//           message: result.errors?.[0] || 'Failed to enroll in course'
//         },
//         { status: 400 }
//       );
//     }

//   } catch (error: any) {
//     console.error('❌ Error enrolling in course:', error);
    
//     return Response.json(
//       { 
//         success: false,
//         message: 'Error enrolling in course'
//       },
//       { status: 500 }
//     );
//   }
// }


























// /app/api/courses/[id]/enroll/route.ts - ADD DEBUG LOGGING
import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { enrollUserInCourse, getCourseDetails } from '@/lib/db/queries/courses';
import { sendNotification } from '@/lib/notifications/send-notification';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json(
        { 
          success: false,
          message: 'Authentication required'
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    if (!id) {
      return Response.json(
        { 
          success: false,
          message: 'Course ID is required'
        },
        { status: 400 }
      );
    }

    console.log(`[ENROLL] User ${session.userId} enrolling in course ${id}`);
    
    // Enroll user in course
    const result = await enrollUserInCourse(session.userId, id);

    console.log(`[ENROLL] Result:`, result);

    if (result.success) {
      // Fire enrollment notification (fire-and-forget)
      getCourseDetails(id).then(course => {
        const title = (course as any)?.title ?? 'the course'
        sendNotification({
          userId: session!.userId,
          notificationType: 'COURSE_ENROLLED',
          title: '🎓 Enrolled Successfully!',
          message: `You are now enrolled in "${title}". Start learning today!`,
          actionUrl: `/courses/learn/${id}`,
          iconType: 'course',
          data: { courseId: id },
        }).catch(() => {})
      }).catch(() => {})

      return Response.json({
        success: true,
        message: 'Successfully enrolled in course',
        enrollment: result.enrollment
      });
    } else {
      return Response.json(
        { 
          success: false,
          message: result.errors?.[0] || 'Failed to enroll in course'
        },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('❌ Error enrolling in course:', error);
    
    return Response.json(
      { 
        success: false,
        message: 'Error enrolling in course',
        error: error.message
      },
      { status: 500 }
    );
  }
}