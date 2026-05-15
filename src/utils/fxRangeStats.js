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
  if (position < 0.15) return 'Near range low · closer to floor'
  if (position < 0.35) return 'Below mid-range'
  if (position <= 0.65) return 'Mid-range · not peak'
  if (position < 0.85) return 'Above mid-range'
  return 'Near range high · closer to ceiling'
}
