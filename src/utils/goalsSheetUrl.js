/**
 * @param {string} spreadsheetId
 * @param {Record<string, number> | undefined} sheetGids
 * @param {string} tabName - sheet tab name to jump to (case-insensitive)
 */
function getSheetEditUrl(spreadsheetId, sheetGids, tabName) {
  const id = encodeURIComponent(spreadsheetId)
  const base = `https://docs.google.com/spreadsheets/d/${id}/edit`
  if (!sheetGids) return base
  const entry = Object.entries(sheetGids).find(
    ([title]) => title.trim().toLowerCase() === tabName.toLowerCase(),
  )
  const gid = entry?.[1]
  return gid != null ? `${base}#gid=${gid}` : base
}

export function getGoalsSheetEditUrl(spreadsheetId, sheetGids) {
  return getSheetEditUrl(spreadsheetId, sheetGids, 'goals')
}

export function getAccountsSheetEditUrl(spreadsheetId, sheetGids) {
  return getSheetEditUrl(spreadsheetId, sheetGids, 'accounts')
}
