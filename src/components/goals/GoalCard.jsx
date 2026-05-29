import { formatMoney } from '../../utils/formatCurrency.js'
import {
  computeGoalMetrics,
  SCHEDULE_STATUS_LABEL,
} from '../../utils/goalProgress.js'
import { GoalCompletionDonut } from './GoalCompletionDonut.jsx'
import { InstitutionLogo } from '../InstitutionLogo.jsx'

function GoalIcon({ accent }) {
  const isGold = accent === 'gold'
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
        isGold ? 'bg-accent-gold/20 text-accent-gold' : 'bg-primary/15 text-primary'
      }`}
      aria-hidden
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3 2 8.5 12 14l10-5.5L12 3Zm0 5.5L4.2 8.5 12 11.8l7.8-3.3L12 8.5ZM4 11.5v4L12 21l8-5.5v-4L12 16 4 11.5Z"
          fill="currentColor"
        />
      </svg>
    </span>
  )
}

/** @param {{ status: import('../../utils/goalProgress.js').ScheduleStatus }} props */
function scheduleBadgeClass(status) {
  switch (status) {
    case 'on_track':
      return 'bg-primary/15 text-primary'
    case 'critical':
      return 'bg-negative/15 text-negative'
    case 'behind':
      return 'bg-warning/15 text-warning'
    case 'not_started':
      return 'bg-surface-1 text-ink-muted'
    default:
      return 'bg-surface-1 text-ink-muted'
  }
}

/** @param {{ status: Exclude<import('../../utils/goalProgress.js').ScheduleStatus, 'none'> }} props */
function StatusBadge({ status }) {
  return (
    <span
      className={`font-dm-sans inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${scheduleBadgeClass(status)}`}
    >
      {SCHEDULE_STATUS_LABEL[status]}
    </span>
  )
}

/**
 * @param {{
 *   goal: import('../../types/sheetTypes.js').GoalRow,
 *   allocatedAud: number,
 *   ratesReady: boolean,
 *   dragHandle?: React.ReactNode,
 * }} props
 */
export function GoalCard({ goal, allocatedAud, ratesReady, dragHandle }) {
  const now = new Date()
  const m = computeGoalMetrics(goal, allocatedAud, now)
  const accent = String(goal.accent || 'teal').toLowerCase()
  const fillClass =
    accent === 'gold' ? 'bg-accent-gold/90' : 'bg-primary/90'
  const amountClass =
    accent === 'gold' ? 'text-accent-gold' : 'text-primary'

  const timeBarPct = m.validWindow ? m.timeElapsedPct * 100 : 0

  const dueShort = goal.due_date
    ? new Date(goal.due_date).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
      })
    : '—'

  const scheduleActive =
    m.schedulePhase === 'active' || m.schedulePhase === 'ended'
  const showThresholdTick =
    ratesReady &&
    scheduleActive &&
    m.thresholdPct >= 5 &&
    m.thresholdPct <= 95
  const wellAhead =
    ratesReady &&
    m.schedulePhase === 'active' &&
    m.thresholdPct < 5 &&
    m.progressPct >= 5

  const surplusVsTargetLabel = (() => {
    if (!ratesReady) return '—'
    if (m.surplusVsTarget >= 0) {
      return `+${formatMoney(m.surplusVsTarget, 'AUD', { maxFractionDigits: 0 })}`
    }
    return `${formatMoney(m.remainingToTarget, 'AUD', { maxFractionDigits: 0 })} to go`
  })()
  return (
    <article
      className={`relative select-none rounded-xl border glass-card px-3.5 pb-3 ${dragHandle ? 'pt-7' : 'pt-3'}`}
      style={{
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {dragHandle}
      {dragHandle && <div className="mb-3 -mx-3.5 border-t border-border/50" />}
      <header className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          {goal.icon_url ? (
            <InstitutionLogo name={goal.goal_name} iconUrl={goal.icon_url} size={32} />
          ) : (
            <GoalIcon accent={accent} />
          )}
          <div className="min-w-0 flex-1">
            <h2 className="font-syne truncate text-base font-extrabold leading-snug text-ink">
              {goal.goal_name || 'Untitled goal'}
            </h2>
            {goal.subtitle ? (
              <p className="font-dm-sans truncate text-xs text-ink-muted">{goal.subtitle}</p>
            ) : null}
          </div>
        </div>
        <div className="shrink-0 pl-2 text-right">
          <p className="font-dm-mono text-base font-bold tabular-nums text-ink">
            {ratesReady ? formatMoney(m.target, 'AUD', { maxFractionDigits: 0 }) : '—'}
          </p>
          <p className="font-dm-sans text-[9px] font-semibold uppercase tracking-wide text-ink-muted">
            Target
          </p>
        </div>
      </header>

      <div className="mt-3">
        <div className="relative h-2 overflow-hidden rounded-full bg-surface-1">
          <div
            className={`h-full rounded-full ${fillClass}`}
            style={{ width: `${ratesReady ? m.progressPct : 0}%` }}
          />
          {showThresholdTick ? (
            <div
              className="pointer-events-none absolute top-1/2 z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-canvas bg-ink"
              style={{ left: `${m.thresholdPct}%` }}
              title="Schedule threshold"
            />
          ) : null}
        </div>
        {wellAhead ? (
          <p className="font-dm-sans mt-1.5 text-[11px] text-primary">Well ahead of schedule</p>
        ) : null}

        <div className="mt-2.5 grid grid-cols-2 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <p className={`font-dm-mono text-base font-bold tabular-nums ${amountClass}`}>
                {ratesReady ? formatMoney(allocatedAud, 'AUD', { maxFractionDigits: 0 }) : '—'}
              </p>
              {ratesReady && m.target > 0 ? (
                <GoalCompletionDonut percent={m.progressPct} accent={accent} size={32} />
              ) : null}
            </div>
            <p className="font-dm-sans text-[9px] font-semibold uppercase tracking-wide text-ink-muted">
              Available today
            </p>
          </div>
          <div className="min-w-0 text-right">
            <p className="font-dm-mono text-xs font-bold leading-tight tabular-nums text-ink whitespace-nowrap">
              {surplusVsTargetLabel}
            </p>
            <p className="font-dm-sans text-[9px] font-semibold uppercase tracking-wide text-ink-muted">
              Surplus vs target
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5">
        <StatusChip
          scheduleStatus={
            ratesReady && m.scheduleStatus !== 'none' ? m.scheduleStatus : null
          }
        />
        <StatChip
          label="Days left"
          value={
            m.daysRemaining === null
              ? '—'
              : String(m.daysRemaining)
          }
          variant="neutral"
        />
        <StatChip label="Due date" value={dueShort} variant="neutral" />
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-dm-sans text-[9px] font-semibold uppercase tracking-wide text-ink-muted">
            Time elapsed
          </span>
          <span className="font-dm-mono text-[11px] tabular-nums text-ink">
            {ratesReady && m.schedulePhase !== 'invalid'
              ? `${(m.timeElapsedPct * 100).toFixed(0)}%`
              : '—'}
          </span>
        </div>
        <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface-1">
          <div
            className="h-full rounded-full bg-ink-faint/80"
            style={{ width: `${ratesReady ? timeBarPct : 0}%` }}
          />
        </div>
      </div>
    </article>
  )
}

/**
 * @param {{ scheduleStatus: import('../../utils/goalProgress.js').ScheduleStatus | null }} props
 */
function StatusChip({ scheduleStatus }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface-1 px-1.5 py-1.5">
      {scheduleStatus === null || scheduleStatus === 'none' ? (
        <p className="font-dm-mono text-xs font-bold text-ink">—</p>
      ) : (
        <StatusBadge status={scheduleStatus} />
      )}
      <p className="font-dm-sans mt-1 text-[9px] font-semibold uppercase tracking-wide text-ink-muted">
        Status
      </p>
    </div>
  )
}

/**
 * @param {{ label: string, value: string, variant: 'positive'|'negative'|'neutral' }} props
 */
function StatChip({ label, value, variant }) {
  const valueCls =
    variant === 'positive'
      ? 'text-positive'
      : variant === 'negative'
        ? 'text-negative'
        : 'text-ink'
  return (
    <div className="rounded-lg border border-border bg-surface-1 px-1.5 py-1.5 text-center">
      <p className={`font-dm-mono text-xs font-bold tabular-nums ${valueCls}`}>{value}</p>
      <p className="font-dm-sans mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </p>
    </div>
  )
}
