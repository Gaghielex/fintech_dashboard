/**
 * Parse YYYY-MM-DD as a local calendar day (avoids UTC off-by-one).
 * @param {string} iso
 */
export function parseSheetDate(iso) {
  const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

/**
 * Filter dated rows to a trailing window, including the closest row on or
 * before the window start so sparse series still span the selected range.
 *
 * @template {{ date: string }} T
 * @param {T[]} rows
 * @param {number | null} days null = all rows
 * @param {Date} [endDate] defaults to today (local)
 * @returns {T[]}
 */
export function filterByDateRange(rows, days, endDate = new Date()) {
  const dated = (rows ?? [])
    .map((row) => ({ row, date: parseSheetDate(row.date) }))
    .filter((entry) => entry.date != null)
    .sort((a, b) => a.date - b.date)

  if (!dated.length) return []
  if (days == null) return dated.map((entry) => entry.row)

  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
  const cutoff = new Date(end)
  cutoff.setDate(cutoff.getDate() - days)

  const inWindow = dated.filter((entry) => entry.date >= cutoff)
  const before = dated.filter((entry) => entry.date < cutoff)
  const anchor = before.at(-1)

  if (anchor && (!inWindow.length || inWindow[0].row.date !== anchor.row.date)) {
    return [anchor.row, ...inWindow.map((entry) => entry.row)]
  }
  return inWindow.map((entry) => entry.row)
}
