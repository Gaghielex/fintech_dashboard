import { formatMoney } from '../../utils/formatCurrency.js'
import { useCountUp } from '../../hooks/useCountUp.js'

const HERO_AMOUNT = 'clamp(2rem, 8vw, 3rem)'
const HERO_AUD = 'clamp(0.8rem, 2.5vw, 1rem)'

function formatHeroAmount(amount) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(amount)
}

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
  const displayNetWorth = useCountUp(netWorthAud, ratesReady)

  return (
    <section className="mb-8" aria-label="Household net worth">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="px-6 pb-5 pt-6 sm:px-7">
          <p className="font-dm-sans text-xs font-medium uppercase tracking-wider text-ink-muted">
            Household net worth
          </p>

          <div className="mt-3 flex justify-center">
            <p
              className="font-syne inline-flex max-w-full flex-wrap items-baseline justify-center gap-x-1.5 leading-none tracking-tight"
              aria-live="polite"
            >
              {ratesReady ? (
                <>
                  <span
                    className="shrink-0 font-extrabold text-primary/75"
                    style={{ fontSize: HERO_AUD }}
                  >
                    AUD
                  </span>
                  <span
                    className="font-extrabold text-primary tabular-nums"
                    style={{ fontSize: HERO_AMOUNT }}
                  >
                    {formatHeroAmount(Math.round(displayNetWorth))}
                  </span>
                </>
              ) : (
                <span
                  className="font-extrabold text-primary"
                  style={{ fontSize: HERO_AMOUNT }}
                >
                  —
                </span>
              )}
            </p>
          </div>

          {!ratesReady ? (
            <p className="font-dm-mono mt-2 text-xs text-warning">
              Waiting for FX rates…
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
          <BreakdownCol
            label="Liquid"
            valueAud={liquidAud}
            ready={ratesReady}
            dotClass="bg-primary"
          />
          <BreakdownCol
            label="In deposits"
            valueAud={depositsAud}
            ready={ratesReady}
            dotClass="bg-accent-gold"
          />
          <BreakdownCol
            label="Super"
            valueAud={superAud}
            ready={ratesReady}
            dotClass="bg-ink-faint"
          />
        </div>
      </div>
    </section>
  )
}

/**
 * @param {{
 *   label: string,
 *   valueAud: number,
 *   ready: boolean,
 *   dotClass: string,
 * }} props
 */
function BreakdownCol({ label, valueAud, ready, dotClass }) {
  return (
    <div className="flex min-w-0 flex-col items-center px-3 py-4 text-center sm:px-4">
      <span className="font-dm-mono text-sm font-bold tabular-nums text-ink">
        {ready ? formatMoney(valueAud, 'AUD', { maxFractionDigits: 0 }) : '—'}
      </span>
      <span className="font-dm-sans mt-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
        <span
          className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`}
          aria-hidden
        />
        <span className="truncate">{label}</span>
      </span>
    </div>
  )
}
