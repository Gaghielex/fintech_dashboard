import { formatMoney } from '../../utils/formatCurrency.js'

/**
 * @param {{
 *   netWorthAud: number,
 *   liquidAud: number,
 *   depositsAud: number,
 *   superAud: number,
 *   ratesReady: boolean,
 * }} props
 */
export function HomeHeroSection({
  netWorthAud,
  liquidAud,
  depositsAud,
  superAud,
  ratesReady,
}) {
  return (
    <section className="mb-8 space-y-4">
      <div>
        <p className="font-dm-sans text-xs font-medium uppercase tracking-wider text-ink-muted">
          Household net worth
        </p>
        <p
          className="font-syne mt-1 text-[clamp(2.25rem,8vw,3rem)] font-extrabold leading-none tracking-tight text-primary"
          aria-live="polite"
        >
          {ratesReady
            ? formatMoney(netWorthAud, 'AUD', { maxFractionDigits: 0 })
            : '—'}
        </p>
        {!ratesReady ? (
          <p className="font-dm-mono mt-2 text-xs text-warning">
            Waiting for FX rates…
          </p>
        ) : null}
      </div>

      <div className="grid gap-2 rounded-xl border border-border bg-surface px-4 py-3">
        <SubLine label="Liquid" valueAud={liquidAud} ready={ratesReady} />
        <SubLine label="In deposits" valueAud={depositsAud} ready={ratesReady} />
        <SubLine label="Super" valueAud={superAud} ready={ratesReady} />
      </div>
    </section>
  )
}

/**
 * @param {{ label: string, valueAud: number, ready: boolean }} props
 */
function SubLine({ label, valueAud, ready }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="font-dm-sans text-sm text-ink-muted">{label}</span>
      <span className="font-dm-mono text-sm font-medium tabular-nums text-ink">
        {ready ? formatMoney(valueAud, 'AUD', { maxFractionDigits: 0 }) : '—'}
      </span>
    </div>
  )
}
