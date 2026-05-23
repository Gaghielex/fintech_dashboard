import { useState, useMemo } from 'react'
import { getAccountsSheetEditUrl } from '../../utils/goalsSheetUrl.js'

const DISMISSED_KEY = 'update_reminder_dismissed_at'
const REMINDER_INTERVAL_MS = 14 * 24 * 60 * 60 * 1000

function SpreadsheetIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 12 12" aria-hidden>
      <path fill="currentColor" d="M10.5 4h-2C7.67 4 7 3.33 7 2.5v-2c0-.28-.22-.5-.5-.5H2c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V4.5c0-.28-.22-.5-.5-.5m-6 6h-1c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h1c.28 0 .5.22.5.5s-.22.5-.5.5m0-2h-1c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h1c.28 0 .5.22.5.5s-.22.5-.5.5m0-2h-1c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h1c.28 0 .5.22.5.5s-.22.5-.5.5m4 4h-2c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h2c.28 0 .5.22.5.5s-.22.5-.5.5m0-2h-2c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h2c.28 0 .5.22.5.5s-.22.5-.5.5m0-2h-2c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h2c.28 0 .5.22.5.5s-.22.5-.5.5M8 .5V2c0 .55.45 1 1 1h1.5c.45 0 .67-.54.35-.85l-2-2C8.54-.17 8 .06 8 .5" />
    </svg>
  )
}

/**
 * @param {{
 *   globalLastUpdated: string | null,
 *   spreadsheetId: string | undefined,
 *   sheetGids: Record<string, number> | undefined,
 * }} props
 */
export function UpdateReminderBanner({ globalLastUpdated, spreadsheetId, sheetGids }) {
  const [dismissed, setDismissed] = useState(() => {
    const ts = localStorage.getItem(DISMISSED_KEY)
    if (!ts) return false
    return Date.now() - Number(ts) < REMINDER_INTERVAL_MS
  })

  const daysOld = useMemo(() => {
    if (!globalLastUpdated) return null
    return Math.floor((Date.now() - new Date(globalLastUpdated).getTime()) / 86400000)
  }, [globalLastUpdated])

  if (daysOld === null || daysOld < 14 || dismissed) return null

  const sheetUrl = spreadsheetId
    ? getAccountsSheetEditUrl(spreadsheetId, sheetGids)
    : null

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()))
    setDismissed(true)
  }

  return (
    <div className="rounded-2xl bg-white px-5 pt-4 pb-5 shadow-xl shadow-black/25">
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-syne flex items-center gap-2 text-xl font-extrabold leading-tight text-gray-900">
          It's time to update<br />your balances
          <SpreadsheetIcon />
        </h2>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss reminder"
          className="mt-0.5 shrink-0 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <p className="font-dm-sans mt-2 text-sm leading-relaxed text-gray-500">
        Keep your data fresh to see the latest numbers.
      </p>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="font-dm-mono text-4xl font-bold leading-none text-gray-900">
            {daysOld}
          </p>
          <p className="font-dm-sans mt-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Days since update
          </p>
        </div>

        {sheetUrl ? (
          <a
            href={sheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 font-dm-sans text-sm font-semibold text-canvas transition hover:opacity-90"
          >
            Update now
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        ) : (
          <button
            type="button"
            onClick={dismiss}
            className="rounded-xl bg-primary px-4 py-2.5 font-dm-sans text-sm font-semibold text-canvas transition hover:opacity-90"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  )
}
