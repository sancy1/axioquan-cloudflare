// // /src/app/api/instructor/students/delete-quiz/route.ts

// import { NextRequest } from 'next/server';
// import { getSession } from '@/lib/auth/session';
// import { sql } from '@/lib/db/index';

// export async function DELETE(request: NextRequest) {
//   try {
//     const session = await getSession();
//     if (!session?.userId) {
//       return Response.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { student_id, assessment_id } = await request.json();
//     if (!student_id || !assessment_id) {
//       return Response.json({ error: 'student_id and assessment_id are required' }, { status: 400 });
//     }

//     // Verify instructor owns the assessment's course
//     const ownership = await sql`
//       SELECT a.id FROM assessments a
//       JOIN courses c ON c.id = a.course_id
//       WHERE a.id = ${assessment_id}
//         AND c.instructor_id = ${session.userId}
//       LIMIT 1
//     `;

//     if (ownership.length === 0) {
//       return Response.json({ error: 'Unauthorized or assessment not found' }, { status: 403 });
//     }

//     await sql`
//       DELETE FROM assessment_attempts
//       WHERE student_id = ${student_id}
//         AND assessment_id = ${assessment_id}
//     `;

//     return Response.json({ success: true, message: 'Quiz records deleted successfully' });
//   } catch (error: any) {
//     console.error('❌ Error deleting quiz records:', error);
//     return Response.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }




























// /src/app/api/instructor/students/delete-quiz/route.ts
//
// FIX: The DELETE query used `student_id` as the column name but the
//      `assessment_attempts` table uses `user_id`.
//      This caused the WHERE clause to never match, so records were never
//      actually deleted even though the route returned success.
//
// Also verified: ownership check joins assessments → courses on instructor_id ✅

import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { sql } from '@/lib/db/index';

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { student_id, assessment_id } = await request.json();

    if (!student_id || !assessment_id) {
      return Response.json(
        { error: 'student_id and assessment_id are required' },
        { status: 400 }
      );
    }

    // Verify instructor owns the assessment's course
    const ownership = await sql`
      SELECT a.id FROM assessments a
      JOIN courses c ON c.id = a.course_id
      WHERE a.id = ${assessment_id}
        AND c.instructor_id = ${session.userId}
      LIMIT 1
    `;

    if (ownership.length === 0) {
      return Response.json(
        { error: 'Unauthorized or assessment not found' },
        { status: 403 }
      );
    }

    // FIX: column is `user_id`, NOT `student_id`
    const deleted = await sql`
      DELETE FROM assessment_attempts
      WHERE user_id = ${student_id}
        AND assessment_id = ${assessment_id}
      RETURNING id
    `;

    return Response.json({
      success: true,
      message: `${deleted.length} quiz record(s) deleted successfully`,
      deletedCount: deleted.length,
    });
  } catch (error: any) {
    console.error('❌ Error deleting quiz records:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
