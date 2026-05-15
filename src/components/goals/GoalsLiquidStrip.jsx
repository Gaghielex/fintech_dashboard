import { formatMoney } from '../../utils/formatCurrency.js'
import { computeGoalsStripStatus } from '../../utils/goalProgress.js'

/**
 * @param {{
 *   liquidAud: number,
 *   ratesReady: boolean,
 *   goals: import('../../types/sheetTypes.js').GoalRow[],
 * }} props
 */
export function GoalsLiquidStrip({ liquidAud, ratesReady, goals }) {
  const status = computeGoalsStripStatus(goals, liquidAud)

  const toneClass =
    status.tone === 'ok'
      ? 'border-primary/40 bg-primary/10'
      : status.tone === 'behind'
        ? 'border-warning/50 bg-warning/10'
        : 'border-border bg-surface'

  const headlineClass =
    status.tone === 'ok'
      ? 'text-primary'
      : status.tone === 'behind'
        ? 'text-warning'
        : 'text-ink'

  return (
    <section
      className={`mb-6 rounded-xl border px-4 py-3 ${toneClass}`}
      aria-label="Liquid available for goals"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-dm-sans text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Liquid available
          </p>
          <p className="font-dm-mono mt-1 text-2xl font-medium tabular-nums text-ink">
            {ratesReady ? formatMoney(liquidAud, 'AUD') : '—'}
          </p>
        </div>
        <div className="text-right">
          <p className={`font-syne text-sm font-extrabold ${headlineClass}`}>
            {status.headline}
          </p>
          <p className="font-dm-sans mt-0.5 max-w-[14rem] text-xs leading-snug text-ink-muted">
            {status.detail}
          </p>
        </div>
      </div>
    </section>
  )
}
