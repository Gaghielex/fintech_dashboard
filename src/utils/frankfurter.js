const FRANKFURTER = 'https://api.frankfurter.dev/v1'

/**
 * @returns {{ from: string, to: string }}
 */
export function getDefaultHistoryRange() {
  const to = new Date()
  const from = new Date(to)
  from.setDate(from.getDate() - 30)
  return { from: formatIsoDate(from), to: formatIsoDate(to) }
}

/**
 * @param {Date} d
 */
function formatIsoDate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * @typedef {{ amount: number, base: string, date: string, rates: { JPY?: number, USD?: number } }} FrankfurterLatest
 */

/**
 * @typedef {{
 *   amount: number,
 *   base: string,
 *   start_date: string,
 *   end_date: string,
 *   rates: Record<string, { JPY?: number, USD?: number }>
 * }} FrankfurterTimeSeries
 */

/**
 * @returns {Promise<FrankfurterLatest>}
 */
export async function fetchLatestAudRates() {
  const res = await fetch(`${FRANKFURTER}/latest?from=AUD&to=JPY,USD`)
  if (!res.ok) throw new Error(`Frankfurter latest ${res.status}`)
  return res.json()
}

/**
 * @param {string} fromIso yyyy-mm-dd
 * @param {string} toIso yyyy-mm-dd
 * @returns {Promise<FrankfurterTimeSeries>}
 */
export async function fetchAudHistory(fromIso, toIso) {
  const res = await fetch(
    `${FRANKFURTER}/${fromIso}..${toIso}?from=AUD&to=JPY,USD`,
  )
  if (!res.ok) throw new Error(`Frankfurter history ${res.status}`)
  return res.json()
}

/**
 * @param {FrankfurterTimeSeries} series
 * @returns {{ date: string, JPY: number, USD: number }[]}
 */
export function timeSeriesToSortedPoints(series) {
  const rates = series.rates ?? {}
  const dates = Object.keys(rates).sort()
  return dates.map((date) => {
    const day = rates[date] ?? {}
    return {
      date,
      JPY: Number(day.JPY ?? 0),
      USD: Number(day.USD ?? 0),
    }
  })
}
