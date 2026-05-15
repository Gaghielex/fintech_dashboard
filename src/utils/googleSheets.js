import { toA1Range } from './sheetRange.js'

/**
 * @param {string} spreadsheetId
 * @param {string} apiKey
 * @returns {Promise<string[]>}
 */
export async function fetchSpreadsheetTabTitles(spreadsheetId, apiKey) {
  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}`,
  )
  url.searchParams.set('fields', 'sheets.properties(title)')
  url.searchParams.set('key', apiKey)
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Sheets metadata ${res.status}: ${text.slice(0, 200)}`)
  }
  /** @type {{ sheets?: { properties: { title: string } }[] }} */
  const json = await res.json()
  const sheets = json.sheets ?? []
  return sheets.map((s) => s.properties.title)
}

/**
 * @param {string} spreadsheetId
 * @param {string} apiKey
 * @param {string[]} tabTitles
 */
export async function batchGetValuesForTabs(spreadsheetId, apiKey, tabTitles) {
  if (!tabTitles.length) return /** @type {{ valueRanges?: { range?: string, values?: string[][] }[] }} */ ({})
  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values:batchGet`,
  )
  url.searchParams.set('key', apiKey)
  for (const t of tabTitles) {
    url.searchParams.append('ranges', toA1Range(t))
  }
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Sheets batchGet ${res.status}: ${text.slice(0, 200)}`)
  }
  return res.json()
}
