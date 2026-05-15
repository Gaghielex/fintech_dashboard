import { useMemo, useState } from 'react'
import { computeHomeMetrics } from '../utils/financeAggregate.js'
import { getGoalsSheetEditUrl } from '../utils/goalsSheetUrl.js'
import { GoalsLiquidStrip } from '../components/goals/GoalsLiquidStrip.jsx'
import { GoalCard } from '../components/goals/GoalCard.jsx'

/**
 * @param {{
 *   goals: import('../types/sheetTypes.js').GoalRow[],
 *   accounts: import('../types/sheetTypes.js').AccountRow[],
 *   settings: import('../types/sheetTypes.js').SettingsRow | null,
 *   latestRates: { JPY: number, USD: number } | null,
 *   spreadsheetId: string | undefined,
 *   sheetGids: Record<string, number> | undefined,
 * }} props
 */
export function GoalsTab({
  goals,
  accounts,
  settings,
  latestRates,
  spreadsheetId,
  sheetGids,
}) {
  const metrics = useMemo(
    () => computeHomeMetrics(accounts, settings, latestRates),
    [accounts, settings, latestRates],
  )

  const ratesReady = Boolean(
    latestRates && latestRates.JPY > 0 && latestRates.USD > 0,
  )

  const [bannerDismissed, setBannerDismissed] = useState(
    () => localStorage.getItem('goals_readonly_dismissed') === 'true',
  )
  const dismissBanner = () => {
    localStorage.setItem('goals_readonly_dismissed', 'true')
    setBannerDismissed(true)
  }

  const goalsUrl = useMemo(
    () =>
      spreadsheetId
        ? getGoalsSheetEditUrl(spreadsheetId, sheetGids)
        : null,
    [spreadsheetId, sheetGids],
  )

  return (
    <div className="flex min-h-[calc(100dvh-6rem)] flex-col space-y-5 pb-6">
      <header>
        <h1 className="font-syne text-2xl font-extrabold tracking-tight text-ink">
          Goals
        </h1>
      </header>

      {!bannerDismissed && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3">
          <p className="font-dm-sans text-sm text-ink-muted">
            Read-only view — edit amounts and dates in Google Sheets.
          </p>
          <button
            type="button"
            onClick={dismissBanner}
            aria-label="Dismiss"
            className="mt-0.5 shrink-0 text-ink-faint transition hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      <GoalsLiquidStrip
        liquidAud={metrics.liquidAud}
        ratesReady={ratesReady}
        goals={goals}
      />

      <section className="space-y-4">
        <h2 className="font-syne text-base font-bold text-ink">Your goals</h2>
        {!goals.length ? (
          <p className="font-dm-sans rounded-xl border border-dashed border-border bg-surface/60 px-4 py-6 text-center text-sm text-ink-muted">
            No rows on the <span className="font-dm-mono">Goals</span> tab yet.
            Use <span className="font-semibold text-ink">Add a goal</span> below.
          </p>
        ) : (
          goals.map((g, idx) => (
            <GoalCard
              key={g.id ? String(g.id) : `goal-${idx}`}
              goal={g}
              liquidAud={metrics.liquidAud}
              ratesReady={ratesReady}
            />
          ))
        )}
      </section>

      <div className="mt-auto pt-2">
        {goalsUrl ? (
          <a
            href={goalsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-dm-sans flex w-full items-center justify-center rounded-xl bg-primary py-3 text-center text-sm font-semibold text-canvas transition hover:opacity-90"
          >
            Add a goal in Google Sheets
          </a>
        ) : (
          <p className="font-dm-sans text-center text-xs text-ink-faint">
            Set VITE_SHEET_ID to enable the sheet link.
          </p>
        )}
      </div>
    </div>
  )
}
