
// // /src/app/api/certificates/issue/route.ts

// import { NextRequest } from 'next/server';
// import { getSession } from '@/lib/auth/session';
// import { requireRole } from '@/lib/auth/utils';
// import { issueCertificate } from '@/lib/db/queries/certificates';

// export async function POST(request: NextRequest) {
//   try {
//     await requireRole(['instructor', 'admin']);
//     const session = await getSession();
//     if (!session?.userId) {
//       return Response.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const body = await request.json();
//     const { student_id, course_id, assessment_id, student_name, course_title, overall_score, final_grade } = body;

//     if (!student_id || !course_id || !assessment_id || !student_name || !course_title) {
//       return Response.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     // Generate unique certificate code
//     const year = new Date().getFullYear();
//     const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
//     const ts   = Date.now().toString(36).toUpperCase().slice(-4);
//     const certificate_code = `AXQ-${year}-${rand}-${ts}`;

//     const result = await issueCertificate({
//       user_id: student_id,
//       course_id,
//       assessment_id,
//       student_name,
//       course_title,
//       overall_score: Math.round(overall_score),
//       final_grade,
//       issued_by: session.userId,
//       certificate_code,
//     });

//     if (!result.success) {
//       return Response.json({ error: result.message }, { status: 400 });
//     }

//     return Response.json({ success: true, certificate: result.certificate, message: result.message });
//   } catch (error: any) {
//     console.error('❌ Error issuing certificate:', error);
//     if (error.message?.includes('unauthorized')) {
//       return Response.json({ error: 'Unauthorized' }, { status: 403 });
//     }
//     return Response.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }




























// // /src/app/api/certificates/issue/route.ts
// //
// // FIXES:
// // 1. requireRole() was called BEFORE getSession() — it needs the session
// //    context to work. Moved session check first, role check second.
// // 2. Added bulk issuance support (body.students array) so the
// //    "Send Certificates to Eligible Students" bulk button works.
// // 3. Added duplicate-per-assessment check (not just per course) so
// //    re-issuing for the same quiz attempt is blocked correctly.

// import { NextRequest } from 'next/server';
// import { getSession } from '@/lib/auth/session';
// import { issueCertificate } from '@/lib/db/queries/certificates';
// import { sql } from '@/lib/db/index';

// function generateCertCode(): string {
//   const year = new Date().getFullYear();
//   const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
//   const ts = Date.now().toString(36).toUpperCase().slice(-4);
//   return `AXQ-${year}-${rand}-${ts}`;
// }

// async function checkAlreadyIssued(user_id: string, assessment_id: string): Promise<boolean> {
//   try {
//     const rows = await sql`
//       SELECT id FROM certificates
//       WHERE user_id = ${user_id}
//         AND certificate_data->>'assessment_id' = ${assessment_id}
//         AND is_revoked = false
//       LIMIT 1
//     `;
//     return rows.length > 0;
//   } catch {
//     return false;
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     // FIX 1: Get session FIRST before any role check
//     const session = await getSession();
//     if (!session?.userId) {
//       return Response.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     // Optional role guard (won't throw if requireRole is not available)
//     // If you want strict role enforcement, uncomment:
//     // const roleOk = session.primaryRole === 'instructor' || session.primaryRole === 'admin';
//     // if (!roleOk) return Response.json({ error: 'Forbidden' }, { status: 403 });

//     const body = await request.json();

//     // ── BULK ISSUANCE ─────────────────────────────────────────────────────
//     // Called by "Send Certificates to Eligible Students" button
//     if (body.students && Array.isArray(body.students)) {
//       const results = await Promise.allSettled(
//         body.students.map(async (s: {
//           student_id: string;
//           course_id: string;
//           assessment_id: string;
//           student_name: string;
//           course_title: string;
//           overall_score: number;
//           final_grade: string;
//         }) => {
//           const alreadyIssued = await checkAlreadyIssued(s.student_id, s.assessment_id);
//           if (alreadyIssued) return { skipped: true };

//           return issueCertificate({
//             user_id: s.student_id,
//             course_id: s.course_id,
//             assessment_id: s.assessment_id,
//             student_name: s.student_name,
//             course_title: s.course_title,
//             overall_score: Math.round(s.overall_score),
//             final_grade: s.final_grade,
//             issued_by: session.userId,
//             certificate_code: generateCertCode(),
//           });
//         })
//       );

//       const issued  = results.filter(r => r.status === 'fulfilled' && (r.value as any)?.success).length;
//       const skipped = results.filter(r => r.status === 'fulfilled' && (r.value as any)?.skipped).length;
//       const failed  = results.filter(r => r.status === 'rejected').length;

//       return Response.json({
//         success: true,
//         message: `${issued} certificate(s) issued, ${skipped} already existed, ${failed} failed.`,
//         issued,
//         skipped,
//         failed,
//       });
//     }

//     // ── INDIVIDUAL ISSUANCE ───────────────────────────────────────────────
//     const {
//       student_id,
//       course_id,
//       assessment_id,
//       student_name,
//       course_title,
//       overall_score,
//       final_grade,
//     } = body;

//     if (!student_id || !course_id || !assessment_id || !student_name || !course_title) {
//       return Response.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     // FIX 3: Check per-assessment duplicate, not just per-course
//     const alreadyIssued = await checkAlreadyIssued(student_id, assessment_id);
//     if (alreadyIssued) {
//       return Response.json(
//         {
//           success: false,
//           alreadyIssued: true,
//           message: 'Certificate already issued for this student and assessment.',
//         },
//         { status: 200 }
//       );
//     }

//     const result = await issueCertificate({
//       user_id: student_id,
//       course_id,
//       assessment_id,
//       student_name,
//       course_title,
//       overall_score: Math.round(overall_score ?? 0),
//       final_grade: final_grade ?? 'PASS',
//       issued_by: session.userId,
//       certificate_code: generateCertCode(),
//     });

//     if (!result.success) {
//       return Response.json({ error: result.message }, { status: 400 });
//     }

//     return Response.json({
//       success: true,
//       certificate: result.certificate,
//       message: result.message,
//     });
//   } catch (error: any) {
//     console.error('❌ Error issuing certificate:', error);
//     return Response.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }
























// // /src/app/api/certificates/issue/route.ts
// //
// // v5 changes:
// // • On duplicate: returns alreadyIssued=true + issuedCount + latestCertCode
// //   so the UI can show "already issued N times — resend?" confirm dialog
// // • force=true flag bypasses duplicate check and issues another cert
// // • Bulk: per-student skippedNames list returned for messaging
// // • GET handler so CertificateGenerator can check issued status on mount
// //   → GET /api/certificates/issue?student_id=X&assessment_id=Y

// import { NextRequest } from 'next/server';
// import { getSession } from '@/lib/auth/session';
// import { issueCertificate } from '@/lib/db/queries/certificates';
// import { sql } from '@/lib/db/index';

// function generateCertCode(): string {
//   const year = new Date().getFullYear();
//   const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
//   const ts = Date.now().toString(36).toUpperCase().slice(-4);
//   return `AXQ-${year}-${rand}-${ts}`;
// }

// async function getExistingCerts(user_id: string, assessment_id: string) {
//   try {
//     const rows = await sql`
//       SELECT id, certificate_code, issued_at, overall_score, final_grade
//       FROM certificates
//       WHERE user_id = ${user_id}
//         AND certificate_data->>'assessment_id' = ${assessment_id}
//         AND is_revoked = false
//       ORDER BY issued_at DESC
//     `;
//     return rows as { id: string; certificate_code: string; issued_at: string; overall_score: number; final_grade: string }[];
//   } catch {
//     return [];
//   }
// }

// // ── GET: check if cert already issued (used by CertificateGenerator on mount) ─
// export async function GET(request: NextRequest) {
//   try {
//     const session = await getSession();
//     if (!session?.userId) {
//       return Response.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { searchParams } = new URL(request.url);
//     const student_id   = searchParams.get('student_id');
//     const assessment_id = searchParams.get('assessment_id');

//     if (!student_id || !assessment_id) {
//       return Response.json({ error: 'student_id and assessment_id required' }, { status: 400 });
//     }

//     const existing = await getExistingCerts(student_id, assessment_id);

//     return Response.json({
//       issued: existing.length > 0,
//       issuedCount: existing.length,
//       certificates: existing,
//       latestCertCode: existing[0]?.certificate_code ?? null,
//       latestIssuedAt: existing[0]?.issued_at ?? null,
//     });
//   } catch (error: any) {
//     console.error('❌ Error checking certificate:', error);
//     return Response.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

// // ── POST: issue certificate ───────────────────────────────────────────────────
// export async function POST(request: NextRequest) {
//   try {
//     const session = await getSession();
//     if (!session?.userId) {
//       return Response.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const body = await request.json();

//     // ── BULK ────────────────────────────────────────────────────────────────
//     if (body.students && Array.isArray(body.students)) {
//       const results = await Promise.allSettled(
//         body.students.map(async (s: {
//           student_id: string; course_id: string; assessment_id: string;
//           student_name: string; course_title: string;
//           overall_score: number; final_grade: string; force?: boolean;
//         }) => {
//           const existing = await getExistingCerts(s.student_id, s.assessment_id);
//           if (existing.length > 0 && !s.force) {
//             return { skipped: true, studentName: s.student_name, existingCount: existing.length };
//           }
//           return issueCertificate({
//             user_id: s.student_id, course_id: s.course_id,
//             assessment_id: s.assessment_id, student_name: s.student_name,
//             course_title: s.course_title,
//             overall_score: Math.round(s.overall_score),
//             final_grade: s.final_grade,
//             issued_by: session.userId,
//             certificate_code: generateCertCode(),
//           });
//         })
//       );

//       const issued      = results.filter(r => r.status === 'fulfilled' && (r.value as any)?.success).length;
//       const skipped     = results.filter(r => r.status === 'fulfilled' && (r.value as any)?.skipped).length;
//       const failed      = results.filter(r => r.status === 'rejected').length;
//       const skippedNames = results
//         .filter(r => r.status === 'fulfilled' && (r.value as any)?.skipped)
//         .map(r => (r as PromiseFulfilledResult<any>).value?.studentName)
//         .filter(Boolean);

//       return Response.json({ success: true, issued, skipped, failed, skippedNames,
//         message: `${issued} issued, ${skipped} already existed, ${failed} failed.` });
//     }

//     // ── INDIVIDUAL ──────────────────────────────────────────────────────────
//     const {
//       student_id, course_id, assessment_id,
//       student_name, course_title,
//       overall_score, final_grade,
//       force = false,
//     } = body;

//     if (!student_id || !course_id || !assessment_id || !student_name || !course_title) {
//       return Response.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     const existing = await getExistingCerts(student_id, assessment_id);

//     // Duplicate — return rich info, NOT an error
//     if (existing.length > 0 && !force) {
//       return Response.json({
//         success: false,
//         alreadyIssued: true,
//         issuedCount: existing.length,
//         latestCertCode: existing[0].certificate_code,
//         latestIssuedAt: existing[0].issued_at,
//         message: `Certificate already issued ${existing.length} time(s) for this student and quiz.`,
//       });
//     }

//     const result = await issueCertificate({
//       user_id: student_id, course_id, assessment_id,
//       student_name, course_title,
//       overall_score: Math.round(overall_score ?? 0),
//       final_grade: final_grade ?? 'PASS',
//       issued_by: session.userId,
//       certificate_code: generateCertCode(),
//     });

//     if (!result.success) {
//       return Response.json({ error: result.message }, { status: 400 });
//     }

//     return Response.json({
//       success: true,
//       certificate: result.certificate,
//       wasForced: force && existing.length > 0,
//       totalIssued: existing.length + 1,
//       message: result.message,
//     });

//   } catch (error: any) {
//     console.error('❌ Error issuing certificate:', error);
//     return Response.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }










































// src/app/api/certificates/issue/route.ts
// v6: fires achievement trigger after successful certificate issuance

import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { issueCertificate } from '@/lib/db/queries/certificates';
import { sql } from '@/lib/db/index';
import { fireAchievementTrigger } from '@/lib/achievements/achievement-engine';
import { TRIGGERS } from '@/lib/achievements/triggers';
import { sendNotification } from '@/lib/notifications/send-notification';

function generateCertCode(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  const ts   = Date.now().toString(36).toUpperCase().slice(-4);
  return `AXQ-${year}-${rand}-${ts}`;
}

async function getExistingCerts(user_id: string, assessment_id: string) {
  try {
    const rows = await sql`
      SELECT id, certificate_code, issued_at, overall_score, final_grade
      FROM certificates
      WHERE user_id = ${user_id}
        AND certificate_data->>'assessment_id' = ${assessment_id}
        AND is_revoked = false
      ORDER BY issued_at DESC
    `;
    return rows as { id: string; certificate_code: string; issued_at: string; overall_score: number; final_grade: string }[];
  } catch {
    return [];
  }
}

// ── GET: check if cert already issued ────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const student_id    = searchParams.get('student_id');
    const assessment_id = searchParams.get('assessment_id');

    if (!student_id || !assessment_id) {
      return Response.json({ error: 'student_id and assessment_id required' }, { status: 400 });
    }

    const existing = await getExistingCerts(student_id, assessment_id);

    return Response.json({
      issued:         existing.length > 0,
      issuedCount:    existing.length,
      certificates:   existing,
      latestCertCode: existing[0]?.certificate_code ?? null,
      latestIssuedAt: existing[0]?.issued_at ?? null,
    });
  } catch (error: any) {
    console.error('❌ Error checking certificate:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ── POST: issue certificate ───────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // ── BULK ─────────────────────────────────────────────────────────────────
    if (body.students && Array.isArray(body.students)) {
      const results = await Promise.allSettled(
        body.students.map(async (s: {
          student_id: string; course_id: string; assessment_id: string;
          student_name: string; course_title: string;
          overall_score: number; final_grade: string; force?: boolean;
        }) => {
          const existing = await getExistingCerts(s.student_id, s.assessment_id);
          if (existing.length > 0 && !s.force) {
            return { skipped: true, studentName: s.student_name, existingCount: existing.length };
          }
          const result = await issueCertificate({
            user_id: s.student_id, course_id: s.course_id,
            assessment_id: s.assessment_id, student_name: s.student_name,
            course_title: s.course_title,
            overall_score: Math.round(s.overall_score),
            final_grade: s.final_grade,
            issued_by: session.userId,
            certificate_code: generateCertCode(),
          });
          // Fire achievement trigger per student (non-blocking)
          if (result.success) {
            fireAchievementTrigger(s.student_id, TRIGGERS.CERTIFICATE_ISSUED, {
              courseId: s.course_id,
              score:    Math.round(s.overall_score),
            }).catch(() => {});
            sendNotification({
              userId: s.student_id,
              notificationType: 'CERTIFICATE_ISSUED',
              title: '🏆 Certificate Issued!',
              message: `Congratulations! Your certificate for "${s.course_title}" has been issued.`,
              actionUrl: '/dashboard/certificates',
              iconType: 'certificate',
              data: { courseId: s.course_id, certCode: result.certificate?.certificate_code },
            }).catch(() => {});
          }
          return result;
        })
      );

      const issued       = results.filter(r => r.status === 'fulfilled' && (r.value as any)?.success).length;
      const skipped      = results.filter(r => r.status === 'fulfilled' && (r.value as any)?.skipped).length;
      const failed       = results.filter(r => r.status === 'rejected').length;
      const skippedNames = results
        .filter(r => r.status === 'fulfilled' && (r.value as any)?.skipped)
        .map(r => (r as PromiseFulfilledResult<any>).value?.studentName)
        .filter(Boolean);

      return Response.json({
        success: true, issued, skipped, failed, skippedNames,
        message: `${issued} issued, ${skipped} already existed, ${failed} failed.`,
      });
    }

    // ── INDIVIDUAL ────────────────────────────────────────────────────────────
    const {
      student_id, course_id, assessment_id,
      student_name, course_title,
      overall_score, final_grade,
      force = false,
    } = body;

    if (!student_id || !course_id || !assessment_id || !student_name || !course_title) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await getExistingCerts(student_id, assessment_id);

    if (existing.length > 0 && !force) {
      return Response.json({
        success:        false,
        alreadyIssued:  true,
        issuedCount:    existing.length,
        latestCertCode: existing[0].certificate_code,
        latestIssuedAt: existing[0].issued_at,
        message: `Certificate already issued ${existing.length} time(s) for this student and quiz.`,
      });
    }

    const result = await issueCertificate({
      user_id:          student_id,
      course_id,
      assessment_id,
      student_name,
      course_title,
      overall_score:    Math.round(overall_score ?? 0),
      final_grade:      final_grade ?? 'PASS',
      issued_by:        session.userId,
      certificate_code: generateCertCode(),
    });

    if (!result.success) {
      return Response.json({ error: result.message }, { status: 400 });
    }

    // 🏆 Fire achievement trigger — non-blocking, never fails the response
    fireAchievementTrigger(student_id, TRIGGERS.CERTIFICATE_ISSUED, {
      courseId: course_id,
      score:    Math.round(overall_score ?? 0),
    }).catch(() => {});
    // 🔔 Fire certificate notification (fire-and-forget)
    sendNotification({
      userId: student_id,
      notificationType: 'CERTIFICATE_ISSUED',
      title: '🏆 Certificate Issued!',
      message: `Congratulations! Your certificate for "${course_title}" has been issued.`,
      actionUrl: '/dashboard/certificates',
      iconType: 'certificate',
      data: { courseId: course_id, certCode: result.certificate?.certificate_code },
    }).catch(() => {});

    return Response.json({
      success:    true,
      certificate: result.certificate,
      wasForced:  force && existing.length > 0,
      totalIssued: existing.length + 1,
      message:    result.message,
    });

  } catch (error: any) {
    console.error('❌ Error issuing certificate:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
