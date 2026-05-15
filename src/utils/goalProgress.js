const MS_DAY = 86400000

/** Critical when gap ≥ this and time elapsed > {@link SCHEDULE_CRITICAL_MIN_ELAPSED_PCT}. */
export const SCHEDULE_CRITICAL_GAP_PCT = 30

/** Critical only when more than this % of the goal window has elapsed. */
export const SCHEDULE_CRITICAL_MIN_ELAPSED_PCT = 75

/** @typedef {'none' | 'not_started' | 'on_track' | 'behind' | 'critical'} ScheduleStatus */

/**
 * @param {import('../types/sheetTypes.js').GoalRow} goal
 */
function parseDate(iso) {
  if (!iso) return null
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? null : d
}

/**
 * Linear schedule: fraction of window elapsed in [0,1].
 * @param {Date | null} start
 * @param {Date | null} due
 * @param {Date} now
 */
export function computeTimeElapsedFraction(start, due, now) {
  if (!start || !due || due.getTime() <= start.getTime()) return null
  const t0 = start.getTime()
  const t1 = due.getTime()
  const tn = now.getTime()
  if (tn <= t0) return 0
  if (tn >= t1) return 1
  return (tn - t0) / (t1 - t0)
}

/**
 * @param {Date | null} start
 * @param {Date | null} due
 * @param {Date} now
 * @returns {'invalid' | 'not_started' | 'active' | 'ended'}
 */
function getSchedulePhase(start, due, now) {
  if (!start || !due || due.getTime() <= start.getTime()) return 'invalid'
  const tn = now.getTime()
  if (tn < start.getTime()) return 'not_started'
  if (tn >= due.getTime()) return 'ended'
  return 'active'
}

/**
 * Compare progress % vs linear time % for schedule badge.
 * @param {number} progressPct 0–100
 * @param {number} elapsedPct 0–100
 * @returns {ScheduleStatus}
 */
/** @type {Record<Exclude<ScheduleStatus, 'none'>, string>} */
export const SCHEDULE_STATUS_LABEL = {
  not_started: 'Not started',
  on_track: 'On track',
  behind: 'Behind',
  critical: 'Critical',
}

export function computeScheduleStatus(progressPct, elapsedPct) {
  const gap = elapsedPct - progressPct
  if (gap <= 1e-6) return 'on_track'
  if (
    gap >= SCHEDULE_CRITICAL_GAP_PCT &&
    elapsedPct > SCHEDULE_CRITICAL_MIN_ELAPSED_PCT
  ) {
    return 'critical'
  }
  return 'behind'
}

/**
 * Waterfall: earlier goals consume liquid up to their full target before later goals receive any.
 * @param {import('../types/sheetTypes.js').GoalRow[]} goals Sheet row order
 * @param {number} totalLiquidAud
 * @returns {number[]} allocated AUD per goal index
 */
export function computeGoalsLiquidAllocation(goals, totalLiquidAud) {
  const total = Math.max(0, totalLiquidAud)
  let priorTargetsSum = 0
  return goals.map((g) => {
    const target = Math.max(0, Number(g.target_amount_aud) || 0)
    const pool = Math.max(0, total - priorTargetsSum)
    const allocated = Math.min(pool, target)
    priorTargetsSum += target
    return allocated
  })
}

/**
 * @param {import('../types/sheetTypes.js').GoalRow} goal
 * @param {number} allocatedAud Liquid assigned to this goal (waterfall)
 * @param {Date} [now]
 */
export function computeGoalMetrics(goal, allocatedAud, now = new Date()) {
  const target = Math.max(0, Number(goal.target_amount_aud) || 0)
  const start = parseDate(goal.start_date)
  const due = parseDate(goal.due_date)
  const phase = getSchedulePhase(start, due, now)
  const elapsed = computeTimeElapsedFraction(start, due, now)

  const validWindow = phase !== 'invalid'
  const liquid = Math.max(0, allocatedAud)

  const progressPct =
    target > 0 ? Math.min(100, (liquid / target) * 100) : 0

  const timeElapsedPct =
    phase === 'not_started'
      ? 0
      : phase === 'ended'
        ? 1
        : validWindow
          ? elapsed ?? 0
          : 0
  const thresholdPct = timeElapsedPct * 100
  const thresholdToday = (thresholdPct / 100) * target

  /** @type {ScheduleStatus} */
  let scheduleStatus = 'none'
  if (phase === 'not_started') {
    scheduleStatus = 'not_started'
  } else if (validWindow) {
    scheduleStatus = computeScheduleStatus(progressPct, thresholdPct)
  }

  const scheduleGapPct = Math.max(0, thresholdPct - progressPct)
  const surplusVsSchedule = liquid - thresholdToday
  const onTrackVsSchedule = scheduleStatus === 'on_track'
  const surplusVsTarget = liquid - target
  const remainingToTarget = Math.max(0, target - liquid)

  let daysRemaining = null
  if (due) {
    const raw = Math.ceil((due.getTime() - now.getTime()) / MS_DAY)
    daysRemaining = raw < 0 ? 0 : raw
  }

  return {
    target,
    start,
    due,
    validWindow,
    schedulePhase: phase,
    scheduleStatus,
    scheduleGapPct,
    timeElapsedPct,
    thresholdToday,
    thresholdPct,
    progressPct,
    surplusVsSchedule,
    onTrackVsSchedule,
    surplusVsTarget,
    remainingToTarget,
    daysRemaining,
  }
}

const STRIP_STATUS_PRIORITY = {
  critical: 4,
  behind: 3,
  on_track: 2,
  not_started: 1,
  none: 0,
}

/**
 * @param {ScheduleStatus} a
 * @param {ScheduleStatus} b
 */
function worseScheduleStatus(a, b) {
  return (STRIP_STATUS_PRIORITY[a] ?? 0) >= (STRIP_STATUS_PRIORITY[b] ?? 0)
    ? a
    : b
}

/**
 * PRD §43 — overall on-track vs linear thresholds for all dated goals.
 * @param {import('../types/sheetTypes.js').GoalRow[]} goals
 * @param {number} liquidAud
 * @param {Date} [now]
 */
export function computeGoalsStripStatus(goals, liquidAud, now = new Date()) {
  const allocations = computeGoalsLiquidAllocation(goals, liquidAud)

  const dated = goals.filter((g) => {
    const s = parseDate(g.start_date)
    const d = parseDate(g.due_date)
    return s && d && d.getTime() > s.getTime() && (Number(g.target_amount_aud) || 0) > 0
  })

  if (dated.length === 0) {
    return {
      tone: 'neutral',
      headline: 'No dated targets',
      detail:
        'Add start_date and due_date on Goals rows to unlock schedule tracking.',
    }
  }

  /** @type {ScheduleStatus} */
  let worst = 'none'
  for (let idx = 0; idx < goals.length; idx++) {
    const m = computeGoalMetrics(goals[idx], allocations[idx] ?? 0, now)
    if (m.scheduleStatus === 'none') continue
    worst = worseScheduleStatus(worst, m.scheduleStatus)
  }

  if (worst === 'none') {
    return {
      tone: 'neutral',
      headline: 'No dated targets',
      detail:
        'Add start_date and due_date on Goals rows to unlock schedule tracking.',
    }
  }

  if (worst === 'critical') {
    return {
      tone: 'critical',
      headline: 'Critical',
      detail:
        'At least one goal is 30%+ behind schedule with over 75% of the window elapsed.',
    }
  }

  if (worst === 'behind') {
    return {
      tone: 'behind',
      headline: 'Review schedule',
      detail:
        'Saved progress is below the linear “need by now” line for at least one goal.',
    }
  }

  if (worst === 'not_started') {
    return {
      tone: 'neutral',
      headline: 'Not started',
      detail: 'Goal window has not begun yet.',
    }
  }

  return {
    tone: 'ok',
    headline: 'On track',
    detail: 'Saved progress meets or beats the linear schedule for every active goal.',
  }
}
