import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import {
  convertFromAud,
  getTapCycleCurrencies,
} from '../../utils/currencyConvert.js'
import { formatMoney } from '../../utils/formatCurrency.js'

function IconChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-ink-faint">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconCycle() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 opacity-50">
      <path
        d="M4 12a8 8 0 0 1 13.66-5.66M20 12a8 8 0 0 1-13.66 5.66M15 6h5V1M9 18H4v5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

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
    <motion.div
      whileTap={{ opacity: 0.72 }}
      transition={{ duration: 0.1 }}
      className={`cursor-pointer rounded-xl border p-4 text-left outline-none transition-colors hover:bg-surface-1/80 focus-visible:ring-2 focus-visible:ring-primary/40 ${
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
      {/* Header row — title + chevron */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-syne text-lg font-bold leading-tight text-ink">
            {title}
          </p>
          <p className="font-dm-sans text-xs text-ink-muted">{subtitle}</p>
        </div>
        <div className="flex items-center gap-1.5 pt-0.5">
          {isRetirement ? (
            <span className="font-dm-mono shrink-0 rounded-md bg-accent-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-gold">
              Super
            </span>
          ) : null}
          <IconChevronRight />
        </div>
      </div>

      {/* Currency pill — tap to cycle */}
      <div className="mt-4 space-y-1">
        <motion.div
          data-cycle
          onClick={bump}
          whileTap={{ scale: 0.93 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-surface-1/80 px-2 py-2 outline-none ring-primary/30 hover:bg-surface-1 focus-visible:ring-2"
        >
          <span className="font-dm-mono text-xl font-medium tabular-nums text-ink">
            {ratesReady
              ? formatMoney(primaryAmount, displayCcy)
              : '—'}
          </span>
          <IconCycle />
        </motion.div>
        <p className="font-dm-mono text-xs tabular-nums text-ink-muted">
          ≈ {ratesReady ? formatMoney(anchorAud, 'AUD') : '—'}
        </p>
      </div>
    </motion.div>
  )
}
