
// // /src/app/courses/learn/[courseId]/page.tsx

// import { getSession } from '@/lib/auth/session'
// import Sidebar from '@/components/dashboard/sidebar'
// import CourseLearningPage from '@/components/courses/course-learning'
// import { sql } from '@/lib/db'
// import { redirect } from 'next/navigation'
// import { getCourseResources } from '@/lib/courses/resources-actions'
// import { SidebarProvider } from '@/contexts/sidebar-context'   // ← add this import

// interface LearnCoursePageProps {
//   params: Promise<{ courseId: string }>
// }

// interface UserProgress {
//   [lessonId: string]: {
//     completed: boolean
//     progress: number
//     timeSpent: number
//     lastPosition: number
//     lastAccessedAt: string | null
//   }
// }

// export default async function LearnCoursePage({ params }: LearnCoursePageProps) {
//   const session = await getSession()
//   const { courseId } = await params

//   if (!session || !session.userId) {
//     redirect('/login')
//   }

//   let isEnrolled = false
//   try {
//     const enrollment = await sql`
//       SELECT id FROM enrollments 
//       WHERE course_id = ${courseId} AND user_id = ${session.userId} AND status = 'active'
//       LIMIT 1
//     `
//     isEnrolled = enrollment.length > 0
//   } catch (error) {
//     console.error('Error checking enrollment:', error)
//   }

//   if (!isEnrolled) {
//     redirect(`/courses/${courseId}?error=not_enrolled`)
//   }

//   let courseData: any = null
//   let curriculumData: any[] = []

//   try {
//     const course = await sql`
//       SELECT 
//         c.id,
//         c.title,
//         c.short_description,
//         c.description_html,
//         c.materials_url,
//         u.name AS instructor_name
//       FROM courses c
//       LEFT JOIN users u ON c.instructor_id = u.id
//       WHERE c.id = ${courseId}
//       LIMIT 1
//     `

//     if (course.length > 0) {
//       courseData = course[0]

//       const rows = await sql`
//         SELECT
//           m.id                    AS module_id,
//           m.title                 AS module_title,
//           m.description           AS module_description,
//           m.order_index           AS module_order,
//           m.learning_objectives,
//           m.key_concepts,
//           l.id                    AS lesson_id,
//           l.title                 AS lesson_title,
//           l.description           AS lesson_description,
//           l.lesson_type,
//           l.content_type,
//           l.difficulty,
//           l.content_html,
//           l.video_url,
//           l.video_duration,
//           l.video_thumbnail,
//           l.audio_url,
//           l.audio_duration,
//           l.document_url,
//           l.document_type,
//           l.document_size,
//           l.external_links,
//           l.downloadable_resources,
//           l.attached_files,
//           l.recommended_readings,
//           l.has_downloadable_resources,
//           l.order_index           AS lesson_order,
//           l.is_preview,
//           l.is_published          AS lesson_published
//         FROM modules m
//         LEFT JOIN lessons l ON m.id = l.module_id
//         WHERE m.course_id = ${courseId}
//           AND m.is_published = true
//           AND (l.is_published = true OR l.id IS NULL)
//         ORDER BY m.order_index ASC, l.order_index ASC
//       `

//       const modulesMap = new Map<string, any>()

//       for (const row of rows) {
//         if (!modulesMap.has(row.module_id)) {
//           modulesMap.set(row.module_id, {
//             id:                 row.module_id,
//             title:              row.module_title,
//             description:        row.module_description,
//             order:              row.module_order,
//             learningObjectives: row.learning_objectives ?? [],
//             keyConcepts:        row.key_concepts ?? [],
//             lessons:            [],
//           })
//         }

//         if (row.lesson_id) {
//           modulesMap.get(row.module_id)!.lessons.push({
//             id:          row.lesson_id,
//             title:       row.lesson_title,
//             description: row.lesson_description,
//             lessonType:  row.lesson_type,
//             contentType: row.content_type,
//             difficulty:  row.difficulty,
//             contentHtml: row.content_html ?? null,
//             videoUrl:       row.video_url       ?? null,
//             videoDuration:  row.video_duration  ?? 0,
//             videoThumbnail: row.video_thumbnail ?? null,
//             audioUrl:      row.audio_url      ?? null,
//             audioDuration: row.audio_duration ?? 0,
//             documentUrl:  row.document_url  ?? null,
//             documentType: row.document_type ?? null,
//             documentSize: row.document_size ?? null,
//             externalLinks:            row.external_links            ?? null,
//             downloadableResources:    row.downloadable_resources    ?? [],
//             attachedFiles:            row.attached_files            ?? [],
//             recommendedReadings:      row.recommended_readings      ?? [],
//             hasDownloadableResources: row.has_downloadable_resources ?? false,
//             duration:  row.video_duration || row.audio_duration || 0,
//             order:     row.lesson_order,
//             isPreview: row.is_preview ?? false,
//           })
//         }
//       }

//       curriculumData = Array.from(modulesMap.values())
//     }
//   } catch (error: any) {
//     console.error('Error in learning portal:', error)
//     courseData = {
//       id:               courseId,
//       title:            'Course Learning',
//       short_description:'Start your learning journey',
//       instructor_name:  'Instructor',
//     }
//     curriculumData = [
//       {
//         id: '1', title: 'Getting Started', order: 1,
//         learningObjectives: [], keyConcepts: [],
//         lessons: [{
//           id: '1-1', title: 'Welcome to the Course',
//           description: 'Introduction to the course material.',
//           lessonType: 'video', contentType: 'free', difficulty: 'beginner',
//           contentHtml: null, videoUrl: null, videoDuration: 0,
//           videoThumbnail: null, audioUrl: null, audioDuration: 0,
//           documentUrl: null, documentType: null, documentSize: null,
//           externalLinks: null, downloadableResources: [], attachedFiles: [],
//           recommendedReadings: [], hasDownloadableResources: false,
//           duration: 0, order: 1, isPreview: false,
//         }],
//       },
//     ]
//   }

//   // User progress
//   let userProgress: UserProgress = {}
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/student/progress?courseId=${courseId}`,
//       {
//         headers: { Cookie: `axioquan-user=${encodeURIComponent(JSON.stringify(session))}` },
//         cache: 'no-store',
//       }
//     )
//     if (response.ok) {
//       const data = await response.json()
//       if (data.progress && typeof data.progress === 'object') {
//         Object.entries(data.progress).forEach(([lessonId, d]: [string, any]) => {
//           userProgress[lessonId] = {
//             completed:      d.is_completed  || d.completed  || false,
//             progress:       d.video_progress || d.progress  || 0,
//             timeSpent:      d.time_spent     || 0,
//             lastPosition:   d.last_position  || 0,
//             lastAccessedAt: d.last_accessed_at || d.last_accessed || null,
//           }
//         })
//       }
//     }
//   } catch (error) {
//     console.error('Error fetching user progress:', error)
//   }

//   // Course resources
//   let courseResources: any[] = []
//   try {
//     courseResources = await getCourseResources(courseId)
//   } catch (error) {
//     console.error('Error fetching course resources:', error)
//   }

//   const user = {
//     id:          session.userId,
//     name:        session.name        || 'Student',
//     email:       session.email       || 'student@example.com',
//     primaryRole: session.primaryRole || 'student',
//     image:       session.image,
//   }

//   return (
//     // ✅ SidebarProvider wraps the whole page so Sidebar can use useSidebar
//     <SidebarProvider>
//       <div className="flex min-h-screen bg-background">
//         <Sidebar user={user} />
//         <CourseLearningPage
//           courseId={courseId}
//           courseData={courseData}
//           curriculumData={curriculumData}
//           userId={session.userId}
//           initialUserProgress={userProgress}
//           courseResources={courseResources}
//         />
//       </div>
//     </SidebarProvider>
//   )
// }




























// /src/app/courses/learn/[courseId]/page.tsx
// CHANGE: In the catch block, remove the fake fallback curriculumData array.
//         Leave curriculumData as [] so the empty-state UI in course-learning.tsx renders.

import { getSession } from '@/lib/auth/session'
import Sidebar from '@/components/dashboard/sidebar'
import CourseLearningPage from '@/components/courses/course-learning'
import { sql } from '@/lib/db'
import { redirect } from 'next/navigation'
import { getCourseResources } from '@/lib/courses/resources-actions'
import { SidebarProvider } from '@/contexts/sidebar-context'

interface LearnCoursePageProps {
  params: Promise<{ courseId: string }>
}

interface UserProgress {
  [lessonId: string]: {
    completed: boolean
    progress: number
    timeSpent: number
    lastPosition: number
    lastAccessedAt: string | null
  }
}

export default async function LearnCoursePage({ params }: LearnCoursePageProps) {
  const session = await getSession()
  const { courseId } = await params

  if (!session || !session.userId) {
    redirect('/login')
  }

  let isEnrolled = false
  try {
    const enrollment = await sql`
      SELECT id FROM enrollments 
      WHERE course_id = ${courseId} AND user_id = ${session.userId} AND status = 'active'
      LIMIT 1
    `
    isEnrolled = enrollment.length > 0
  } catch (error) {
    console.error('Error checking enrollment:', error)
  }

  if (!isEnrolled) {
    redirect(`/courses/${courseId}?error=not_enrolled`)
  }

  let courseData: any = null
  let curriculumData: any[] = []

  try {
    const course = await sql`
      SELECT 
        c.id,
        c.title,
        c.short_description,
        c.description_html,
        c.materials_url,
        u.name AS instructor_name
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE c.id = ${courseId}
      LIMIT 1
    `

    if (course.length > 0) {
      courseData = course[0]

      const rows = await sql`
        SELECT
          m.id                    AS module_id,
          m.title                 AS module_title,
          m.description           AS module_description,
          m.order_index           AS module_order,
          m.learning_objectives,
          m.key_concepts,
          l.id                    AS lesson_id,
          l.title                 AS lesson_title,
          l.description           AS lesson_description,
          l.lesson_type,
          l.content_type,
          l.difficulty,
          l.content_html,
          l.video_url,
          l.video_duration,
          l.video_thumbnail,
          l.audio_url,
          l.audio_duration,
          l.document_url,
          l.document_type,
          l.document_size,
          l.external_links,
          l.downloadable_resources,
          l.attached_files,
          l.recommended_readings,
          l.has_downloadable_resources,
          l.order_index           AS lesson_order,
          l.is_preview,
          l.is_published          AS lesson_published
        FROM modules m
        LEFT JOIN lessons l ON m.id = l.module_id
        WHERE m.course_id = ${courseId}
          AND m.is_published = true
          AND (l.is_published = true OR l.id IS NULL)
        ORDER BY m.order_index ASC, l.order_index ASC
      `

      const modulesMap = new Map<string, any>()

      for (const row of rows) {
        if (!modulesMap.has(row.module_id)) {
          modulesMap.set(row.module_id, {
            id:                 row.module_id,
            title:              row.module_title,
            description:        row.module_description,
            order:              row.module_order,
            learningObjectives: row.learning_objectives ?? [],
            keyConcepts:        row.key_concepts ?? [],
            lessons:            [],
          })
        }

        if (row.lesson_id) {
          modulesMap.get(row.module_id)!.lessons.push({
            id:          row.lesson_id,
            title:       row.lesson_title,
            description: row.lesson_description,
            lessonType:  row.lesson_type,
            contentType: row.content_type,
            difficulty:  row.difficulty,
            contentHtml: row.content_html ?? null,
            videoUrl:       row.video_url       ?? null,
            videoDuration:  row.video_duration  ?? 0,
            videoThumbnail: row.video_thumbnail ?? null,
            audioUrl:      row.audio_url      ?? null,
            audioDuration: row.audio_duration ?? 0,
            documentUrl:  row.document_url  ?? null,
            documentType: row.document_type ?? null,
            documentSize: row.document_size ?? null,
            externalLinks:            row.external_links            ?? null,
            downloadableResources:    row.downloadable_resources    ?? [],
            attachedFiles:            row.attached_files            ?? [],
            recommendedReadings:      row.recommended_readings      ?? [],
            hasDownloadableResources: row.has_downloadable_resources ?? false,
            duration:  row.video_duration || row.audio_duration || 0,
            order:     row.lesson_order,
            isPreview: row.is_preview ?? false,
          })
        }
      }

      curriculumData = Array.from(modulesMap.values())
    }
  } catch (error: any) {
    console.error('Error in learning portal:', error)
    // ─── CHANGED: no fake fallback curriculum. ────────────────────────────
    // Leave curriculumData as [] and courseData as a minimal stub so the
    // empty-state UI in course-learning.tsx renders instead of spinning forever.
    courseData = courseData ?? {
      id:               courseId,
      title:            'Course Learning',
      short_description:'',
      instructor_name:  'Instructor',
    }
    // curriculumData stays []
  }

  // User progress
  let userProgress: UserProgress = {}
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/student/progress?courseId=${courseId}`,
      {
        headers: { Cookie: `axioquan-user=${encodeURIComponent(JSON.stringify(session))}` },
        cache: 'no-store',
      }
    )
    if (response.ok) {
      const data = await response.json()
      if (data.progress && typeof data.progress === 'object') {
        Object.entries(data.progress).forEach(([lessonId, d]: [string, any]) => {
          userProgress[lessonId] = {
            completed:      d.is_completed  || d.completed  || false,
            progress:       d.video_progress || d.progress  || 0,
            timeSpent:      d.time_spent     || 0,
            lastPosition:   d.last_position  || 0,
            lastAccessedAt: d.last_accessed_at || d.last_accessed || null,
          }
        })
      }
    }
  } catch (error) {
    console.error('Error fetching user progress:', error)
  }

  // Course resources
  let courseResources: any[] = []
  try {
    courseResources = await getCourseResources(courseId)
  } catch (error) {
    console.error('Error fetching course resources:', error)
  }

  const user = {
    id:          session.userId,
    name:        session.name        || 'Student',
    email:       session.email       || 'student@example.com',
    primaryRole: session.primaryRole || 'student',
    image:       session.image,
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar user={user} />
        <CourseLearningPage
          courseId={courseId}
          courseData={courseData}
          curriculumData={curriculumData}
          userId={session.userId}
          initialUserProgress={userProgress}
          courseResources={courseResources}
        />
      </div>
    </SidebarProvider>
  )
}
