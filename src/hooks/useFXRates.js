import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  fetchLatestAudRates,
  fetchAudHistory,
  getDefaultHistoryRange,
  timeSeriesToSortedPoints,
} from '../utils/frankfurter.js'
import { FX_CACHE_STORAGE_KEY } from '../utils/storageKeys.js'

/**
 * @typedef {{
 *   date: string,
 *   base: string,
 *   rates: { JPY: number, USD: number }
 * }} FxLatest
 */

/**
 * @typedef {{
 *   startDate: string,
 *   endDate: string,
 *   points: { date: string, JPY: number, USD: number }[]
 * }} FxHistory
 */

/**
 * @typedef {{
 *   latest: FxLatest | null,
 *   history: FxHistory | null,
 *   loading: boolean,
 *   error: string | null,
 *   fromCache: boolean,
 *   ratesAsOf: string | null,
 *   lastFetchAt: string | null,
 *   refetch: () => void,
 * }} UseFxRatesResult
 */

function readCache() {
  try {
    const raw = localStorage.getItem(FX_CACHE_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/**
 * @param {unknown} payload
 */
function writeCache(payload) {
  try {
    localStorage.setItem(FX_CACHE_STORAGE_KEY, JSON.stringify(payload))
  } catch {
    /* ignore quota */
  }
}

/**
 * Frankfurter AUD→JPY, AUD→USD: latest + ~30 business days history (API omits weekends).
 * @returns {UseFxRatesResult}
 */
export function useFXRates() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(/** @type {string | null} */ (null))
  const [fromCache, setFromCache] = useState(false)
  const [latest, setLatest] = useState(/** @type {FxLatest | null} */ (null))
  const [history, setHistory] = useState(/** @type {FxHistory | null} */ (null))
  const [lastFetchAt, setLastFetchAt] = useState(/** @type {string | null} */ (null))
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    let cancelled = false
    const { from, to } = getDefaultHistoryRange()

    async function run() {
      setLoading(true)
      setError(null)
      setFromCache(false)

      try {
        const [lat, hist] = await Promise.all([
          fetchLatestAudRates(),
          fetchAudHistory(from, to),
        ])
        if (cancelled) return

        const normalizedLatest = {
          date: lat.date,
          base: lat.base,
          rates: {
            JPY: Number(lat.rates?.JPY ?? 0),
            USD: Number(lat.rates?.USD ?? 0),
          },
        }
        const points = timeSeriesToSortedPoints(hist)
        const normalizedHistory = {
          startDate: hist.start_date,
          endDate: hist.end_date,
          points,
        }

        setLatest(normalizedLatest)
        setHistory(normalizedHistory)
        const fetchedAt = new Date().toISOString()
        setLastFetchAt(fetchedAt)
        writeCache({
          version: 1,
          savedAt: fetchedAt,
          latest: normalizedLatest,
          history: normalizedHistory,
        })
      } catch (e) {
        if (cancelled) return
        const cached = readCache()
        if (cached?.latest && cached?.history) {
          setLatest(cached.latest)
          setHistory(cached.history)
          setFromCache(true)
          setLastFetchAt(cached.savedAt ?? null)
          setError(null)
        } else {
          setError(e instanceof Error ? e.message : 'FX fetch failed')
          setLatest(null)
          setHistory(null)
          setLastFetchAt(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [tick])

  const ratesAsOf = useMemo(() => {
    if (fromCache && lastFetchAt) return lastFetchAt
    if (latest?.date) return latest.date
    return null
  }, [fromCache, lastFetchAt, latest])

  return {
    latest,
    history,
    loading,
    error,
    fromCache,
    ratesAsOf,
    lastFetchAt,
    refetch,
  }
}
