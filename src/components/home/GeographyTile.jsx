import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import {
  convertFromAud,
  getTapCycleCurrencies,
} from '../../utils/currencyConvert.js'
import { formatMoney } from '../../utils/formatCurrency.js'

const CCY_SYMBOL = { AUD: 'A$', JPY: '¥', USD: '$' }

function formatTileAmount(amount, ccy) {
  const symbol = CCY_SYMBOL[ccy] ?? ccy
  const decimals = ccy === 'JPY' ? 0 : 0
  return `${symbol} ${new Intl.NumberFormat('en-AU', { maximumFractionDigits: decimals }).format(amount)}`
}

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

import { FlagBadge } from './HouseholdVisuals.jsx'

/**
 * @param {{
 *   flag: string,
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
  flag,
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
      className={`cursor-pointer rounded-xl border p-3 text-left outline-none backdrop-blur-xl transition-colors focus-visible:ring-2 focus-visible:ring-primary/40 aspect-square flex flex-col ${
        isRetirement
          ? 'border-accent-gold/50'
          : 'border-white/[0.06]'
      }`}
      style={{
        background: isRetirement
          ? 'linear-gradient(135deg, rgba(240,196,25,0.18) 0%, rgba(240,196,25,0.06) 50%, transparent 80%), rgba(38,32,18,0.82)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.012) 45%, transparent 75%), rgba(22,27,34,0.6)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.13), inset 1px 0 0 rgba(255,255,255,0.05), inset -1px 0 0 rgba(255,255,255,0.05)',
      }}
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
      {/* Header row — flag + title + chevron */}
      <div>
        <div className="flex items-center gap-2">
          <FlagBadge flag={flag} label={title} />
          <p className="font-syne text-sm font-bold leading-tight text-ink flex-1 min-w-0">
            {title}
          </p>
          <IconChevronRight />
        </div>
        <p className="font-dm-sans pl-8 mt-0.5 text-xs text-ink-muted">{subtitle}</p>
        {isRetirement ? (
          <span className="font-dm-mono mt-1 inline-block pl-8 text-[9px] font-semibold uppercase tracking-wide text-accent-gold">
            Super
          </span>
        ) : null}
      </div>

      {/* Currency pill — tap to cycle */}
      <div className="mt-auto pt-3 space-y-1">
        <motion.div
          data-cycle
          onClick={bump}
          whileTap={{ scale: 0.93 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          className="flex cursor-pointer items-center gap-1 rounded-lg bg-surface-1/80 px-2 py-1.5 outline-none ring-primary/30 hover:bg-surface-1 focus-visible:ring-2 min-w-0"
        >
          <span className="font-dm-mono text-sm font-medium tabular-nums text-ink truncate min-w-0">
            {ratesReady
              ? formatTileAmount(primaryAmount, displayCcy)
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
