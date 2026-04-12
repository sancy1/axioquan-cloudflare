
// lib/achievements/achievement-engine.ts
//
// USAGE — call fireAchievementTrigger() after any major student action:
//
//   await fireAchievementTrigger(userId, TRIGGERS.CERTIFICATE_ISSUED, {
//     score: 92, courseId: '...', assessmentId: '...'
//   })
//
// The engine checks every achievement whose trigger matches, evaluates the
// condition against live DB data, and awards the achievement if criteria are met.
// Already-awarded achievements are never awarded twice (idempotent).
//
// Adding new achievements: just add an entry to ACHIEVEMENT_DEFINITIONS below.
// No other files need to change.

import { sql } from '@/lib/db/index'
import { TRIGGERS, TriggerEvent } from './triggers'
import { sendNotification } from '@/lib/notifications/send-notification'

// ── Context passed with each trigger ────────────────────────────────────────
export interface TriggerContext {
  score?:        number   // 0-100 quiz score
  courseId?:     string
  assessmentId?: string
  enrolledCount?: number
  streakDays?:   number
  passed?:       boolean  // did the student pass this attempt?
}

// ── Achievement definition ───────────────────────────────────────────────────
interface AchievementDef {
  /** Must match achievements.name in DB exactly */
  name: string
  /** Which trigger fires this check */
  trigger: TriggerEvent
  /**
   * Async condition evaluated with live DB data.
   * Return true = award the achievement.
   */
  condition: (userId: string, ctx: TriggerContext) => Promise<boolean>
}

// ── All achievement definitions ──────────────────────────────────────────────
// Add new achievements here — zero other files need to change.
const ACHIEVEMENT_DEFINITIONS: AchievementDef[] = [
  // ── Certificate-based ────────────────────────────────────────────────────
  {
    name: 'First Certificate',
    trigger: TRIGGERS.CERTIFICATE_ISSUED,
    condition: async (userId) => {
      const rows = await sql`
        SELECT COUNT(*) as count FROM certificates
        WHERE user_id = ${userId} AND is_revoked = false
      `
      return parseInt(rows[0]?.count ?? '0') >= 1
    },
  },
  {
    name: 'Triple Certified',
    trigger: TRIGGERS.CERTIFICATE_ISSUED,
    condition: async (userId) => {
      const rows = await sql`
        SELECT COUNT(*) as count FROM certificates
        WHERE user_id = ${userId} AND is_revoked = false
      `
      return parseInt(rows[0]?.count ?? '0') >= 3
    },
  },
  {
    name: 'Certificate Collector',
    trigger: TRIGGERS.CERTIFICATE_ISSUED,
    condition: async (userId) => {
      const rows = await sql`
        SELECT COUNT(*) as count FROM certificates
        WHERE user_id = ${userId} AND is_revoked = false
      `
      return parseInt(rows[0]?.count ?? '0') >= 5
    },
  },

  // ── Quiz score-based ─────────────────────────────────────────────────────
  {
    name: 'Perfect Score',
    trigger: TRIGGERS.QUIZ_SUBMITTED,
    condition: async (_userId, ctx) => (ctx.score ?? 0) === 100,
  },
  {
    name: 'Quiz Master',
    trigger: TRIGGERS.QUIZ_SUBMITTED,
    condition: async (_userId, ctx) => (ctx.score ?? 0) >= 90,
  },
  {
    name: 'High Achiever',
    trigger: TRIGGERS.QUIZ_SUBMITTED,
    condition: async (_userId, ctx) => (ctx.score ?? 0) >= 80,
  },

  // ── Persistence ──────────────────────────────────────────────────────────
  {
    name: 'Never Give Up',
    trigger: TRIGGERS.QUIZ_SUBMITTED,
    condition: async (userId, ctx) => {
      if (!ctx.passed || !ctx.assessmentId) return false
      // Passed this attempt — check if they failed at least once before
      const rows = await sql`
        SELECT COUNT(*) as count
        FROM assessment_attempts
        WHERE user_id       = ${userId}
          AND assessment_id = ${ctx.assessmentId}
          AND status        = 'completed'
          AND passed        = false
      `
      return parseInt(rows[0]?.count ?? '0') >= 1
    },
  },
  {
    name: 'On a Roll',
    trigger: TRIGGERS.QUIZ_SUBMITTED,
    condition: async (userId, ctx) => {
      if (!ctx.passed) return false
      // Last 3 completed attempts must all be passed
      const rows = await sql`
        SELECT passed FROM assessment_attempts
        WHERE user_id = ${userId} AND status = 'completed'
        ORDER BY submitted_at DESC
        LIMIT 3
      `
      return rows.length >= 3 && rows.every((r: any) => r.passed === true)
    },
  },

  // ── Enrollment-based ─────────────────────────────────────────────────────
  {
    name: 'Course Collector',
    trigger: TRIGGERS.COURSE_ENROLLED,
    condition: async (userId) => {
      const rows = await sql`
        SELECT COUNT(*) as count FROM enrollments
        WHERE user_id = ${userId} AND status = 'active'
      `
      return parseInt(rows[0]?.count ?? '0') >= 3
    },
  },
  {
    name: 'Learning Addict',
    trigger: TRIGGERS.COURSE_ENROLLED,
    condition: async (userId) => {
      const rows = await sql`
        SELECT COUNT(*) as count FROM enrollments
        WHERE user_id = ${userId} AND status = 'active'
      `
      return parseInt(rows[0]?.count ?? '0') >= 5
    },
  },

  // ── Completion-based ─────────────────────────────────────────────────────
  {
    name: 'Course Graduate',
    trigger: TRIGGERS.COURSE_COMPLETED,
    condition: async (userId) => {
      const rows = await sql`
        SELECT COUNT(*) as count FROM enrollments
        WHERE user_id = ${userId} AND progress_percentage = 100
      `
      return parseInt(rows[0]?.count ?? '0') >= 1
    },
  },

  // ── Streak-based ─────────────────────────────────────────────────────────
  {
    name: '7-Day Streak',
    trigger: TRIGGERS.STREAK_UPDATED,
    condition: async (_userId, ctx) => (ctx.streakDays ?? 0) >= 7,
  },
  {
    name: '30-Day Streak',
    trigger: TRIGGERS.STREAK_UPDATED,
    condition: async (_userId, ctx) => (ctx.streakDays ?? 0) >= 30,
  },
]

// ── Core engine function ─────────────────────────────────────────────────────

/**
 * Look up achievement id from the achievements table by name.
 * Returns null if not found (achievement not seeded in DB yet).
 */
async function getAchievementId(name: string): Promise<string | null> {
  try {
    const rows = await sql`
      SELECT id FROM achievements
      WHERE name = ${name} AND is_active = true
      LIMIT 1
    `
    return rows[0]?.id ?? null
  } catch {
    return null
  }
}

/**
 * Check if a user already has this achievement.
 */
async function alreadyAwarded(userId: string, achievementId: string): Promise<boolean> {
  try {
    const rows = await sql`
      SELECT id FROM user_achievements
      WHERE user_id = ${userId} AND achievement_id = ${achievementId}
      LIMIT 1
    `
    return rows.length > 0
  } catch {
    return false
  }
}

/**
 * Write the award to user_achievements.
 */
async function writeAward(userId: string, achievementId: string, xpReward: number): Promise<void> {
  await sql`
    INSERT INTO user_achievements
      (id, user_id, achievement_id, earned_at, xp_earned, is_seen, progress_percentage)
    VALUES
      (gen_random_uuid(), ${userId}, ${achievementId}, NOW(), ${xpReward}, false, 100)
    ON CONFLICT (user_id, achievement_id) DO NOTHING
  `
}

/**
 * Get xp_reward from achievements table.
 */
async function getXpReward(achievementId: string): Promise<number> {
  try {
    const rows = await sql`
      SELECT xp_reward FROM achievements WHERE id = ${achievementId} LIMIT 1
    `
    return rows[0]?.xp_reward ?? 10
  } catch {
    return 10
  }
}

// ── Main exported function ───────────────────────────────────────────────────

/**
 * Fire an achievement trigger for a student.
 * Checks all matching achievement definitions and awards any that are earned.
 * Safe to call from anywhere — never throws, logs errors silently.
 *
 * @param userId  - the student's user id
 * @param trigger - one of TRIGGERS.*
 * @param ctx     - context data for condition evaluation (score, courseId, etc.)
 * @returns array of achievement names that were newly awarded
 */
export async function fireAchievementTrigger(
  userId: string,
  trigger: TriggerEvent,
  ctx: TriggerContext = {}
): Promise<string[]> {
  const newlyAwarded: string[] = []

  const matching = ACHIEVEMENT_DEFINITIONS.filter(def => def.trigger === trigger)

  await Promise.allSettled(
    matching.map(async (def) => {
      try {
        const achievementId = await getAchievementId(def.name)
        if (!achievementId) return // not seeded in DB — skip silently

        const already = await alreadyAwarded(userId, achievementId)
        if (already) return // idempotent — never double-award

        const earned = await def.condition(userId, ctx)
        if (!earned) return

        const xp = await getXpReward(achievementId)
        await writeAward(userId, achievementId, xp)
        newlyAwarded.push(def.name)
        console.log(`🏆 Achievement awarded: "${def.name}" → user ${userId}`)
        // Notify the user (fire-and-forget)
        sendNotification({
          userId,
          notificationType: 'ACHIEVEMENT_UNLOCKED',
          title: '🏆 Achievement Unlocked!',
          message: `You earned the "${def.name}" achievement. Keep it up!`,
          actionUrl: '/dashboard/achievements',
          iconType: 'achievement',
          data: { achievement: def.name, xp },
        }).catch(() => {})
      } catch (err) {
        console.error(`⚠️ Achievement check failed for "${def.name}":`, err)
      }
    })
  )

  return newlyAwarded
}
