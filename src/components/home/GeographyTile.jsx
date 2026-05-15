import { useCallback, useState } from 'react'
import {
  convertFromAud,
  getTapCycleCurrencies,
} from '../../utils/currencyConvert.js'
import { formatMoney } from '../../utils/formatCurrency.js'

/**
 * @param {{
 *   title: string,
 *   subtitle: string,
 *   regionNative: 'AUD'|'JPY'|'USD',
 *   totalAud: number,
 *   rates: { JPY: number, USD: number },
 *   ratesReady: boolean,
 *   onNavigate: () => void,
 *   variant?: 'country' | 'retirement',
 * }} props
 */
export function GeographyTile({
  title,
  subtitle,
  regionNative,
  totalAud,
  rates,
  ratesReady,
  onNavigate,
  variant = 'country',
}) {
  const [i, setI] = useState(0)
  const cycle = getTapCycleCurrencies(regionNative)
  const displayCcy = cycle[i % cycle.length]

  const bump = useCallback((e) => {
    e.stopPropagation()
    setI((x) => x + 1)
  }, [])

  const primaryAmount = ratesReady
    ? convertFromAud(totalAud, displayCcy, rates)
    : 0
  const anchorAud = ratesReady ? totalAud : 0

  const isRetirement = variant === 'retirement'

  return (
    <div
      className={`cursor-pointer rounded-xl border p-4 text-left outline-none transition hover:bg-surface-1/80 focus-visible:ring-2 focus-visible:ring-primary/40 ${
        isRetirement
          ? 'border-accent-gold/50 bg-surface/80'
          : 'border-border bg-surface'
      }`}
      onClick={onNavigate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onNavigate()
        }
      }}
      aria-label={`Open accounts: ${title}`}
      tabIndex={0}
      role="button"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-syne text-lg font-bold leading-tight text-ink">
            {title}
          </p>
          <p className="font-dm-sans text-xs text-ink-muted">{subtitle}</p>
        </div>
        {isRetirement ? (
          <span className="font-dm-mono shrink-0 rounded-md bg-accent-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-gold">
            Super
          </span>
        ) : null}
      </div>

      <div className="mt-4 space-y-1">
        <div
          data-cycle
          onClick={bump}
          className="cursor-pointer rounded-lg bg-surface-1/80 px-2 py-2 outline-none ring-primary/30 hover:bg-surface-1 focus-visible:ring-2"
        >
          <span className="font-dm-mono text-xl font-medium tabular-nums text-ink">
            {ratesReady
              ? formatMoney(primaryAmount, displayCcy)
              : '—'}
          </span>
          <span className="font-dm-sans ml-2 text-xs text-ink-faint">
            tap to cycle
          </span>
        </div>
        <p className="font-dm-mono text-xs tabular-nums text-ink-muted">
          ≈ {ratesReady ? formatMoney(anchorAud, 'AUD') : '—'}
        </p>
      </div>
    </div>
  )
}
