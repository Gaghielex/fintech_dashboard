/**
 * @param {string | number | null | undefined} raw
 * @returns {number | null}
 */
export function parseNumberCell(raw) {
  if (raw === '' || raw === null || raw === undefined) return null
  if (typeof raw === 'number' && !Number.isNaN(raw)) return raw
  const n = Number(String(raw).replace(/,/g, '').trim())
  return Number.isFinite(n) ? n : null
}

/**
 * @param {string | number | null | undefined} raw
 * @returns {string | null}
 */
export function parseStringCell(raw) {
  if (raw === '' || raw === null || raw === undefined) return null
  return String(raw).trim()
}

/**
 * @param {string | number | null | undefined} raw
 * @returns {string | null} ISO date string or trimmed raw if parse fails
 */
export function parseDateCell(raw) {
  const s = parseStringCell(raw)
  if (!s) return null
  const d = new Date(s)
  if (!Number.isNaN(d.getTime())) return s
  return s
}
