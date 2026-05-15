/**
 * Google Sheets A1 range for a tab title (handles spaces and quotes).
 * @param {string} sheetTitle
 * @param {string} [cellRange='A:Z']
 */
export function toA1Range(sheetTitle, cellRange = 'A:Z') {
  const escaped = String(sheetTitle).replace(/'/g, "''")
  return `'${escaped}'!${cellRange}`
}
