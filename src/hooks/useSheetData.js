import { useCallback, useEffect, useState } from 'react'
import {
  batchGetValuesForTabs,
  fetchSpreadsheetTabTitles,
} from '../utils/googleSheets.js'
import { buildParsedBundle } from '../utils/parseSheetTabs.js'

/**
 * @returns {{
 *   data: import('../types/sheetTypes.js').ParsedSheetBundle | null,
 *   loading: boolean,
 *   error: string | null,
 *   refetch: () => void,
 *   lastFetchedAt: string | null,
 * }}
 */
export function useSheetData() {
  const apiKey = import.meta.env.VITE_SHEETS_API_KEY
  const spreadsheetId = import.meta.env.VITE_SHEET_ID

  const canFetch = Boolean(
    apiKey &&
      spreadsheetId &&
      apiKey !== 'your_api_key_here' &&
      spreadsheetId !== 'your_spreadsheet_id_here',
  )

  const [loading, setLoading] = useState(() => canFetch)
  const [error, setError] = useState(
    /** @type {string | null} */ (
      canFetch
        ? null
        : 'Missing VITE_SHEETS_API_KEY or VITE_SHEET_ID (.env at project root).'
    ),
  )
  const [data, setData] = useState(
    /** @type {import('../types/sheetTypes.js').ParsedSheetBundle | null} */ (
      null
    ),
  )
  const [lastFetchedAt, setLastFetchedAt] = useState(
    /** @type {string | null} */ (null),
  )
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    if (!canFetch) return

    let cancelled = false

    async function run() {
      setLoading(true)
      setError(null)
      try {
        const titles = await fetchSpreadsheetTabTitles(spreadsheetId, apiKey)
        if (cancelled) return
        const batch = await batchGetValuesForTabs(
          spreadsheetId,
          apiKey,
          titles,
        )
        if (cancelled) return
        const valueRanges = batch.valueRanges ?? []
        /** @type {Record<string, string[][]>} */
        const titleToRows = {}
        for (let i = 0; i < titles.length; i++) {
          titleToRows[titles[i]] = valueRanges[i]?.values ?? []
        }
        const bundle = buildParsedBundle(titles, titleToRows)
        setData(bundle)
        setLastFetchedAt(new Date().toISOString())
      } catch (e) {
        if (!cancelled) {
          setData(null)
          setError(e instanceof Error ? e.message : 'Sheet fetch failed')
          setLastFetchedAt(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [apiKey, spreadsheetId, canFetch, tick])

  return { data, loading, error, refetch, lastFetchedAt }
}
