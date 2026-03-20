// /lib/db/queries/certificates.ts

import { sql } from '../index';

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  enrollment_id: string;
  certificate_code: string;
  issued_at: string;
  expires_at?: string;
  final_grade?: string;
  completion_percentage?: number;
  overall_score?: number;
  certificate_data?: {
    student_name: string;
    course_title: string;
    assessment_id: string;
    issued_by: string;
  };
  download_url?: string;
  is_revoked: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Issue a certificate using the existing certificates table schema
 */
export async function issueCertificate(data: {
  user_id: string;
  course_id: string;
  assessment_id: string;
  student_name: string;
  course_title: string;
  overall_score: number;
  final_grade: string;
  issued_by: string;
  certificate_code: string;
}): Promise<{ success: boolean; certificate?: Certificate; message: string; error?: string }> {
  try {
    // Look up the enrollment_id (required column)
    const enrollment = await sql`
      SELECT id FROM enrollments
      WHERE user_id = ${data.user_id}
        AND course_id = ${data.course_id}
      LIMIT 1
    `;

    if (enrollment.length === 0) {
      return { success: false, message: 'Student is not enrolled in this course' };
    }

    const enrollment_id = enrollment[0].id;

    // Check for duplicate
    const existing = await sql`
      SELECT id FROM certificates
      WHERE user_id = ${data.user_id}
        AND course_id = ${data.course_id}
        AND is_revoked = false
      LIMIT 1
    `;
    if (existing.length > 0) {
      return { success: false, message: 'Certificate already issued for this student and course' };
    }

    const certificate_data = {
      student_name: data.student_name,
      course_title: data.course_title,
      assessment_id: data.assessment_id,
      issued_by: data.issued_by,
    };

    const cert = await sql`
      INSERT INTO certificates (
        user_id, course_id, enrollment_id,
        certificate_code, final_grade, overall_score,
        completion_percentage, certificate_data, issued_at
      ) VALUES (
        ${data.user_id},
        ${data.course_id},
        ${enrollment_id},
        ${data.certificate_code},
        ${data.final_grade},
        ${data.overall_score},
        100,
        ${JSON.stringify(certificate_data)}::jsonb,
        NOW()
      )
      RETURNING *
    `;

    return { success: true, certificate: cert[0] as Certificate, message: 'Certificate issued successfully' };
  } catch (error: any) {
    console.error('❌ Error issuing certificate:', error);
    return { success: false, message: 'Failed to issue certificate', error: error.message };
  }
}

/**
 * Get all active certificates for courses owned by an instructor
 */
export async function getInstructorCertificates(instructorId: string): Promise<Certificate[]> {
  try {
    const certs = await sql`
      SELECT c.*
      FROM certificates c
      JOIN courses co ON co.id = c.course_id
      WHERE co.instructor_id = ${instructorId}
        AND c.is_revoked = false
      ORDER BY c.issued_at DESC
    `;
    return certs as Certificate[];
  } catch (error) {
    console.error('❌ Error fetching instructor certificates:', error);
    return [];
  }
}

/**
 * Get certificates for a specific student
 */
export async function getStudentCertificates(userId: string): Promise<Certificate[]> {
  try {
    const certs = await sql`
      SELECT * FROM certificates
      WHERE user_id = ${userId}
        AND is_revoked = false
      ORDER BY issued_at DESC
    `;
    return certs as Certificate[];
  } catch (error) {
    console.error('❌ Error fetching student certificates:', error);
    return [];
  }
}

/**
 * Check if a certificate already exists for user + course
 */
export async function certificateExists(userId: string, courseId: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT id FROM certificates
      WHERE user_id = ${userId}
        AND course_id = ${courseId}
        AND is_revoked = false
      LIMIT 1
    `;
    return result.length > 0;
  } catch {
    return false;
  }
}

/**
 * Revoke (soft-delete) a certificate — instructor only
 */
export async function revokeCertificate(
  certificateId: string,
  instructorId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const result = await sql`
      UPDATE certificates c
      SET is_revoked = true,
          revoked_reason = 'Revoked by instructor',
          updated_at = NOW()
      FROM courses co
      WHERE c.id = ${certificateId}
        AND c.course_id = co.id
        AND co.instructor_id = ${instructorId}
      RETURNING c.id
    `;
    if (result.length === 0) {
      return { success: false, message: 'Certificate not found or permission denied' };
    }
    return { success: true, message: 'Certificate revoked successfully' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/**
 * Instructor certificate stats
 */
export async function getInstructorCertificateStats(instructorId: string) {
  try {
    const stats = await sql`
      SELECT
        COUNT(c.id)::int                    AS total_issued,
        COUNT(DISTINCT c.user_id)::int      AS unique_students,
        COUNT(DISTINCT c.course_id)::int    AS courses_with_certs,
        ROUND(AVG(c.overall_score)::numeric, 1) AS avg_score
      FROM certificates c
      JOIN courses co ON co.id = c.course_id
      WHERE co.instructor_id = ${instructorId}
        AND c.is_revoked = false
    `;
    return stats[0] || { total_issued: 0, unique_students: 0, courses_with_certs: 0, avg_score: 0 };
  } catch (error) {
    console.error('❌ Error fetching cert stats:', error);
    return { total_issued: 0, unique_students: 0, courses_with_certs: 0, avg_score: 0 };
  }
}
