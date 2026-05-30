/**
 * @param {{ date: string, JPY: number, USD: number }[]} points
 * @param {'JPY'|'USD'} quoteKey
 * @param {number} currentRate latest spot quote (same units as points)
 */
export function computeFxRangeStats(points, quoteKey, currentRate) {
  if (!points?.length) {
    const c = Number(currentRate) || 0
    return {
      min: c,
      max: c,
      current: c,
      position: 0.5,
    }
  }
  const vals = points.map((p) => Number(p[quoteKey]) || 0).filter((v) => v > 0)
  if (!vals.length) {
    const c = Number(currentRate) || 0
    return { min: c, max: c, current: c, position: 0.5 }
  }
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const cur = Number(currentRate) || 0
  let position = 0.5
  if (max > min) {
    position = (cur - min) / (max - min)
    position = Math.min(1, Math.max(0, position))
  }
  return { min, max, current: cur, position }
}

/**
 * @param {number} position 0–1 on range
 */
export function describeFxRangePosition(position) {
  if (position < 1 / 3) return 'bottom third'
  if (position <= 2 / 3) return 'middle'
  return 'top third'
}

/**
 * @param {{ date: string, JPY: number, USD: number }[]} points
 * @param {'JPY'|'USD'} quoteKey
 * @param {number} currentRate
 */
export function computeFxTrend(points, quoteKey, currentRate) {
  const stats = computeFxRangeStats(points, quoteKey, currentRate)
  const vals = (points ?? [])
    .map((p) => ({ date: p.date, value: Number(p[quoteKey]) || 0 }))
    .filter((p) => p.date && p.value > 0)
    .sort((a, b) => (a.date > b.date ? 1 : -1))

  const current = Number(currentRate) || vals.at(-1)?.value || 0
  const currentDate = vals.at(-1)?.date ? new Date(vals.at(-1).date) : new Date()
  const sevenDaysAgo = new Date(currentDate)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const baseline =
    [...vals].reverse().find((p) => new Date(p.date).getTime() <= sevenDaysAgo.getTime()) ??
    vals[0] ??
    { value: current }

  const deltaPct = baseline.value > 0 ? ((current - baseline.value) / baseline.value) * 100 : 0
  const slope =
    Math.abs(deltaPct) < 0.15 ? 'flat'
      : deltaPct > 0 ? 'up'
        : 'down'
  const rangePosition =
    stats.position < 1 / 3 ? 'bottom'
      : stats.position <= 2 / 3 ? 'middle'
        : 'top'

  let label = ''
  let tone = 'neutral'
  if (slope === 'flat') {
    if (rangePosition === 'bottom') {
      label = `Stable at ${describeFxRangePosition(stats.position)}. Relatively favorable for converting ${quoteKey} into AUD.`
      tone = 'low'
    } else if (rangePosition === 'top') {
      label = `Stable at ${describeFxRangePosition(stats.position)}. Relatively unfavorable for converting ${quoteKey} into AUD.`
      tone = 'high'
    } else {
      label = `Stable at ${describeFxRangePosition(stats.position)}. No strong signal; convert when you need liquidity.`
    }
  } else if (slope === 'up' && rangePosition === 'bottom') {
    label = `Rising from recent lows. Still favorable for ${quoteKey}->AUD, but becoming less attractive.`
    tone = 'low'
  } else if (slope === 'up' && rangePosition === 'middle') {
    label = `Trending up. Conversion from ${quoteKey} into AUD is getting less favorable.`
  } else if (slope === 'up') {
    label = `Near recent highs. Consider waiting before converting ${quoteKey} into AUD.`
    tone = 'high'
  } else if (rangePosition === 'top') {
    label = `Falling from recent highs. Improving for ${quoteKey}->AUD, but not favorable yet.`
    tone = 'high'
  } else if (rangePosition === 'middle') {
    label = `Trending down. ${quoteKey}->AUD is becoming more favorable.`
  } else {
    label = `Near recent lows. May be a good time to convert ${quoteKey} into AUD.`
    tone = 'low'
  }

  return {
    ...stats,
    slope,
    rangePosition,
    deltaPct,
    label,
    tone,
  }
}
