import { formatMoney } from '../../utils/formatCurrency.js'
import { useCountUp } from '../../hooks/useCountUp.js'

const HERO_AMOUNT = 'clamp(2rem, 8vw, 3rem)'
const HERO_AUD = 'clamp(0.8rem, 2.5vw, 1rem)'

const BLUR_STYLE = {
  filter: 'blur(10px)',
  userSelect: 'none',
  transition: 'filter 0.3s ease',
}
const REVEAL_STYLE = {
  filter: 'none',
  userSelect: 'auto',
  transition: 'filter 0.3s ease',
}

function formatHeroAmount(amount) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(amount)
}

function EyeIcon({ visible }) {
  return visible ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

/**
 * @param {{
 *   netWorthAud: number,
 *   liquidAud: number,
 *   depositsAud: number,
 *   superAud: number,
 *   ratesReady: boolean,
 *   numbersVisible: boolean,
 *   onToggleNumbers: () => void,
 * }} props
 */
export function HomeHeroSection({
  netWorthAud,
  liquidAud,
  depositsAud,
  superAud,
  ratesReady,
  numbersVisible,
  onToggleNumbers,
}) {
  const displayNetWorth = useCountUp(netWorthAud, ratesReady)
  const maskStyle = numbersVisible ? REVEAL_STYLE : BLUR_STYLE

  return (
    <section className="mb-8" aria-label="Household net worth">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="px-6 pb-5 pt-6 sm:px-7">
          <div className="flex items-center justify-between">
            <p className="font-dm-sans text-xs font-medium uppercase tracking-wider text-ink-muted">
              Household net worth
            </p>
            <button
              type="button"
              onClick={onToggleNumbers}
              className="text-ink-faint transition hover:text-ink-muted"
              aria-label={numbersVisible ? 'Hide amounts' : 'Reveal amounts'}
            >
              <EyeIcon visible={numbersVisible} />
            </button>
          </div>

          <div className="mt-3 flex justify-center">
            <p
              className="font-syne inline-flex max-w-full flex-wrap items-baseline justify-center gap-x-1.5 leading-none tracking-tight"
              style={maskStyle}
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
            maskStyle={maskStyle}
          />
          <BreakdownCol
            label="In deposits"
            valueAud={depositsAud}
            ready={ratesReady}
            dotClass="bg-accent-gold"
            maskStyle={maskStyle}
          />
          <BreakdownCol
            label="Super"
            valueAud={superAud}
            ready={ratesReady}
            dotClass="bg-ink-faint"
            maskStyle={maskStyle}
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
 *   maskStyle: object,
 * }} props
 */
function BreakdownCol({ label, valueAud, ready, dotClass, maskStyle }) {
  return (
    <div className="flex min-w-0 flex-col items-center px-3 py-4 text-center sm:px-4">
      <span
        className="font-dm-mono text-sm font-bold tabular-nums text-ink"
        style={maskStyle}
      >
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
