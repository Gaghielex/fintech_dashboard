const MS_DAY = 86400000

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
 * @param {import('../types/sheetTypes.js').GoalRow} goal
 * @param {number} liquidAud
 * @param {Date} [now]
 */
export function computeGoalMetrics(goal, liquidAud, now = new Date()) {
  const target = Math.max(0, Number(goal.target_amount_aud) || 0)
  const start = parseDate(goal.start_date)
  const due = parseDate(goal.due_date)
  const elapsed = computeTimeElapsedFraction(start, due, now)

  const validWindow = elapsed !== null
  const thresholdToday = validWindow ? elapsed * target : 0

  const progressPct =
    target > 0 ? Math.min(100, (Math.max(0, liquidAud) / target) * 100) : 0
  const thresholdPct = validWindow ? elapsed * 100 : 0

  const surplusVsSchedule = liquidAud - thresholdToday
  const onTrackVsSchedule =
    !validWindow || liquidAud + 1e-6 >= thresholdToday

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
    timeElapsedPct: validWindow ? elapsed : 0,
    thresholdToday,
    thresholdPct,
    progressPct,
    surplusVsSchedule,
    onTrackVsSchedule,
    daysRemaining,
  }
}

/**
 * PRD §43 — overall on-track vs linear thresholds for all dated goals.
 * @param {import('../types/sheetTypes.js').GoalRow[]} goals
 * @param {number} liquidAud
 * @param {Date} [now]
 */
export function computeGoalsStripStatus(goals, liquidAud, now = new Date()) {
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

  const anyBehind = dated.some((g) => {
    const m = computeGoalMetrics(g, liquidAud, now)
    return m.validWindow && !m.onTrackVsSchedule
  })

  return {
    tone: anyBehind ? 'behind' : 'ok',
    headline: anyBehind ? 'Review schedule' : 'On track',
    detail: anyBehind
      ? 'Liquid is below the linear “need by now” line for at least one goal.'
      : 'Liquid meets or beats the linear schedule for every dated goal.',
  }
}
