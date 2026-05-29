import { formatMoney } from '../../utils/formatCurrency.js'
import { computeGoalsStripStatus } from '../../utils/goalProgress.js'

/**
 * @param {{
 *   liquidAud: number,
 *   ratesReady: boolean,
 *   goals: import('../../types/sheetTypes.js').GoalRow[],
 *   upSaversOnly: boolean,
 *   onUpSaversOnlyChange: (value: boolean) => void,
 *   upSaverSelection: { rmit: boolean, gabs: boolean },
 *   onUpSaverSelectionChange: (key: 'rmit' | 'gabs', value: boolean) => void,
 * }} props
 */
export function GoalsLiquidStrip({
  liquidAud,
  ratesReady,
  goals,
  upSaversOnly,
  onUpSaversOnlyChange,
  upSaverSelection,
  onUpSaverSelectionChange,
}) {
  const status = computeGoalsStripStatus(goals, liquidAud)

  const hint = (() => {
    if (!upSaversOnly) return 'AUD liquid across all accounts'
    const selected = []
    if (upSaverSelection.rmit) selected.push('2Up RMIT Saver 🎓')
    if (upSaverSelection.gabs) selected.push('2Up Gabs Saver 🚀')
    if (selected.length === 0) return 'No Up savers selected'
    return selected.join(' + ')
  })()

  return (
    <section className="mb-6 space-y-3" aria-label="Available today for goals">
      <div className="rounded-xl border glass-card px-4 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-dm-sans text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
              Available today
            </p>
            <p className="font-dm-mono mt-1 text-2xl font-bold tabular-nums text-primary">
              {ratesReady ? formatMoney(liquidAud, 'AUD') : '—'}
            </p>
            <p className="font-dm-sans mt-1 text-xs text-ink-muted">{hint}</p>
          </div>
          <div className="text-right">
            <p className="font-dm-sans text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
              Combined goals
            </p>
            {ratesReady && goals.length > 0 ? (
              <StripStatusBadge tone={status.tone} label={status.headline} />
            ) : (
              <p className="font-dm-sans mt-1 text-xs text-ink-muted">—</p>
            )}
          </div>
        </div>
      </div>

      {/* Main toggle + sub-toggles in one card */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <label className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3">
          <span className="font-dm-sans text-sm text-ink-muted">
            Only Up savers account
          </span>
          <Toggle checked={upSaversOnly} onChange={onUpSaversOnlyChange} />
        </label>

        {upSaversOnly && (
          <div className="border-t border-border/50 bg-surface-1/40 px-4 py-2.5 space-y-2.5">
            <SubToggleRow
              label="2Up RMIT Saver 🎓"
              checked={upSaverSelection.rmit}
              onChange={(v) => onUpSaverSelectionChange('rmit', v)}
            />
            <SubToggleRow
              label="2Up Gabs Saver 🚀"
              checked={upSaverSelection.gabs}
              onChange={(v) => onUpSaverSelectionChange('gabs', v)}
            />
          </div>
        )}
      </div>
    </section>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        className="absolute inset-0 rounded-full bg-surface-1 transition-colors peer-checked:bg-primary/40 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50"
        aria-hidden
      />
      <span
        className="pointer-events-none relative ml-0.5 h-5 w-5 rounded-full bg-ink-faint transition-transform peer-checked:translate-x-5 peer-checked:bg-primary"
        aria-hidden
      />
    </span>
  )
}

function SubToggleRow({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span className="font-dm-sans text-xs text-ink-muted">{label}</span>
      <span className="relative inline-flex h-5 w-9 shrink-0 items-center">
        <input
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          className="absolute inset-0 rounded-full bg-surface-1 transition-colors peer-checked:bg-primary/40"
          aria-hidden
        />
        <span
          className="pointer-events-none relative ml-0.5 h-4 w-4 rounded-full bg-ink-faint transition-transform peer-checked:translate-x-4 peer-checked:bg-primary"
          aria-hidden
        />
      </span>
    </label>
  )
}

/**
 * @param {{ tone: string, label: string }} props
 */
function StripStatusBadge({ tone, label }) {
  const cls =
    tone === 'ok'
      ? 'bg-primary/15 text-primary'
      : tone === 'critical'
        ? 'bg-negative/15 text-negative'
        : tone === 'behind'
          ? 'bg-warning/15 text-warning'
          : 'bg-surface-1 text-ink-muted'
  return (
    <span
      className={`font-dm-sans mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cls}`}
    >
      {label}
    </span>
  )
}
