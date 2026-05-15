import { useMemo } from 'react'
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
 *   loading: boolean,
 * }} props
 */
export function GoalsTab({
  goals,
  accounts,
  settings,
  latestRates,
  spreadsheetId,
  sheetGids,
  loading,
}) {
  const metrics = useMemo(
    () => computeHomeMetrics(accounts, settings, latestRates),
    [accounts, settings, latestRates],
  )

  const ratesReady = Boolean(
    latestRates && latestRates.JPY > 0 && latestRates.USD > 0,
  )

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
        <p className="font-dm-sans mt-1 text-sm text-ink-muted">
          Read-only view — edit amounts and dates in Google Sheets.
        </p>
      </header>

      {loading ? (
        <p className="font-dm-mono text-sm text-ink-muted">Loading sheet…</p>
      ) : null}

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
