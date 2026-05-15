/**
 * Opens the spreadsheet editor on the Goals tab when gid is known.
 * @param {string} spreadsheetId
 * @param {Record<string, number> | undefined} sheetGids
 */
export function getGoalsSheetEditUrl(spreadsheetId, sheetGids) {
  const id = encodeURIComponent(spreadsheetId)
  const base = `https://docs.google.com/spreadsheets/d/${id}/edit`
  if (!sheetGids) return base
  const entry = Object.entries(sheetGids).find(
    ([title]) => title.trim().toLowerCase() === 'goals',
  )
  const gid = entry?.[1]
  return gid != null ? `${base}#gid=${gid}` : base
}
