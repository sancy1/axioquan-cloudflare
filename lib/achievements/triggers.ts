// lib/achievements/triggers.ts
// Single source of truth for all achievement trigger event names.
// Import these constants everywhere — never hardcode trigger strings.

export const TRIGGERS = {
  QUIZ_SUBMITTED:      'quiz_submitted',       // fired after every quiz submission
  CERTIFICATE_ISSUED:  'certificate_issued',   // fired after a certificate is issued
  COURSE_ENROLLED:     'course_enrolled',      // fired after enrolling in a course
  COURSE_COMPLETED:    'course_completed',     // fired when progress_percentage = 100
  STREAK_UPDATED:      'streak_updated',       // fired when daily streak changes
} as const

export type TriggerEvent = typeof TRIGGERS[keyof typeof TRIGGERS]
