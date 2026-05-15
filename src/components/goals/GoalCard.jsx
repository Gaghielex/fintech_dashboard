import { formatMoney } from '../../utils/formatCurrency.js'
import { computeGoalMetrics } from '../../utils/goalProgress.js'

/**
 * @param {{
 *   goal: import('../../types/sheetTypes.js').GoalRow,
 *   liquidAud: number,
 *   ratesReady: boolean,
 * }} props
 */
export function GoalCard({ goal, liquidAud, ratesReady }) {
  const now = new Date()
  const m = computeGoalMetrics(goal, liquidAud, now)
  const accent = String(goal.accent || 'teal').toLowerCase()
  const accentBorder =
    accent === 'gold' ? 'border-l-accent-gold' : 'border-l-primary'
  const fillClass =
    accent === 'gold' ? 'bg-accent-gold/90' : 'bg-primary/90'

  const timeBarPct = m.validWindow ? m.timeElapsedPct * 100 : 0

  const dueLabel = goal.due_date
    ? new Date(goal.due_date).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '—'

  const surplusLabel =
    m.surplusVsSchedule >= 0 ? 'Surplus vs schedule' : 'Shortfall vs schedule'
  const surplusAbs = Math.abs(m.surplusVsSchedule)

  const chipDays =
    m.daysRemaining === null
      ? '—'
      : `${m.daysRemaining} day${m.daysRemaining === 1 ? '' : 's'} left`

  return (
    <article
      className={`rounded-xl border border-border bg-surface py-4 pl-4 pr-4 border-l-[4px] ${accentBorder}`}
    >
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-syne text-lg font-extrabold leading-tight text-ink">
            {goal.goal_name || 'Untitled goal'}
          </h2>
          {goal.subtitle ? (
            <p className="font-dm-sans text-sm text-ink-muted">{goal.subtitle}</p>
          ) : null}
        </div>
        <p className="font-dm-mono text-right text-xs text-ink-muted">
          Target{' '}
          <span className="font-medium text-ink">
            {ratesReady ? formatMoney(m.target, 'AUD') : '—'}
          </span>
        </p>
      </header>

      <p className="font-dm-mono mt-3 text-xs text-ink-muted">
        Due <span className="text-ink">{dueLabel}</span>
      </p>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-2">
          <span className="font-dm-sans text-xs font-medium text-ink-muted">
            Progress (liquid ÷ target)
          </span>
          <span className="font-dm-mono text-xs tabular-nums text-ink">
            {ratesReady ? `${m.progressPct.toFixed(0)}%` : '—'}
          </span>
        </div>
        <div className="relative mt-1.5 h-3 overflow-hidden rounded-full bg-surface-1">
          <div
            className={`h-full rounded-full ${fillClass}`}
            style={{ width: `${ratesReady ? m.progressPct : 0}%` }}
          />
          {ratesReady && m.validWindow ? (
            <div
              className="pointer-events-none absolute top-0 z-10 h-full w-0.5 bg-warning shadow-[0_0_0_1px_rgba(13,17,23,0.9)]"
              style={{ left: `calc(${m.thresholdPct}% - 1px)` }}
              title="Schedule threshold"
            />
          ) : null}
        </div>
        {ratesReady && m.validWindow ? (
          <p className="font-dm-mono mt-1.5 text-[11px] leading-snug text-ink-muted">
            Need{' '}
            <span className="font-medium text-ink">
              {formatMoney(m.thresholdToday, 'AUD')}
            </span>{' '}
            by now (linear schedule)
          </p>
        ) : (
          <p className="font-dm-mono mt-1.5 text-[11px] text-ink-faint">
            Add start_date &amp; due_date to show the threshold line.
          </p>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-2">
          <span className="font-dm-sans text-xs font-medium text-ink-muted">
            Time elapsed
          </span>
          <span className="font-dm-mono text-xs tabular-nums text-ink">
            {ratesReady && m.validWindow
              ? `${(m.timeElapsedPct * 100).toFixed(0)}%`
              : '—'}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-1">
          <div
            className="h-full rounded-full bg-ink-faint/80"
            style={{ width: `${ratesReady ? timeBarPct : 0}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <StatChip
          label={surplusLabel}
          value={ratesReady ? formatMoney(surplusAbs, 'AUD') : '—'}
          variant={m.surplusVsSchedule >= 0 ? 'positive' : 'negative'}
        />
        <StatChip label="Days remaining" value={chipDays} variant="neutral" />
      </div>
    </article>
  )
}

/**
 * @param {{ label: string, value: string, variant: 'positive'|'negative'|'neutral' }} props
 */
function StatChip({ label, value, variant }) {
  const cls =
    variant === 'positive'
      ? 'border-positive/40 bg-positive/10 text-positive'
      : variant === 'negative'
        ? 'border-negative/40 bg-negative/10 text-negative'
        : 'border-border bg-surface-1 text-ink-muted'
  return (
    <div
      className={`rounded-lg border px-2.5 py-1.5 font-dm-sans text-[11px] leading-tight ${cls}`}
    >
      <span className="block text-ink-faint">{label}</span>
      <span className="font-dm-mono mt-0.5 block text-sm font-medium text-ink">
        {value}
      </span>
    </div>
  )
}
