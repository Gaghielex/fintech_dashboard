import { useMemo, useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'

const NetWorthChart = lazy(() =>
  import('./NetWorthChart.jsx').then(m => ({ default: m.NetWorthChart }))
)
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

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-canvas/90 px-3 py-2 text-xs backdrop-blur-sm">
      <p className="font-dm-sans text-ink-muted">{payload[0].payload.label}</p>
      <p className="font-dm-mono mt-0.5 font-bold text-primary">
        {formatMoney(payload[0].value, 'AUD', { maxFractionDigits: 0 })}
      </p>
    </div>
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
 *   netWorthSnapshots?: import('../../types/sheetTypes.js').NetWorthSnapshotRow[],
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
  netWorthSnapshots = [],
}) {
  const [flipped, setFlipped] = useState(false)
  const [timeRange, setTimeRange] = useState('all')
  const displayNetWorth = useCountUp(netWorthAud, ratesReady)
  const maskStyle = numbersVisible ? REVEAL_STYLE : BLUR_STYLE

  const delta = useMemo(() => {
    const valid = netWorthSnapshots
      .filter(s => s.date && s.total_aud != null)
      .sort((a, b) => (b.date > a.date ? 1 : -1))
    if (valid.length < 2) return null
    const [latest, prev] = valid
    const diff = (latest.total_aud ?? 0) - (prev.total_aud ?? 0)
    const pct = (prev.total_aud ?? 0) > 0 ? (diff / prev.total_aud) * 100 : null
    const sinceLabel = prev.date
      ? new Date(prev.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
      : null
    return { diff, pct, sinceLabel, positive: diff >= 0 }
  }, [netWorthSnapshots])

  const TIME_RANGES = [
    { key: 'all', label: 'All', days: null },
    { key: '30d', label: '30d', days: 30 },
    { key: '90d', label: '90d', days: 90 },
    { key: '180d', label: '180d', days: 180 },
    { key: '1y', label: '1Y', days: 365 },
  ]

  const chartData = useMemo(() => {
    const range = TIME_RANGES.find(r => r.key === timeRange)
    const cutoff = range?.days ? Date.now() - range.days * 86400000 : 0
    return netWorthSnapshots
      .filter(s => s.date && s.total_aud != null)
      .filter(s => !cutoff || new Date(s.date).getTime() >= cutoff)
      .sort((a, b) => (a.date > b.date ? 1 : -1))
      .map(s => ({
        label: new Date(s.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }),
        total: s.total_aud,
      }))
  }, [netWorthSnapshots, timeRange])

  const hasChart = chartData.length >= 2

  return (
    <section className="mb-8" aria-label="Household net worth" style={{ perspective: '1400px' }}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 160, damping: 24, mass: 1 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full"
      >
        {/* ── Front ── */}
        <div
          className="overflow-hidden rounded-2xl border glass-card"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
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
                className="font-syne inline-flex items-baseline gap-x-1.5 whitespace-nowrap leading-none tracking-tight"
                style={maskStyle}
                aria-live="polite"
              >
                {ratesReady ? (
                  <>
                    <span className="shrink-0 font-extrabold text-primary/75" style={{ fontSize: HERO_AUD }}>AUD</span>
                    <span className="font-extrabold text-primary tabular-nums" style={{ fontSize: HERO_AMOUNT }}>
                      {formatHeroAmount(Math.round(displayNetWorth))}
                    </span>
                  </>
                ) : (
                  <span className="font-extrabold text-primary" style={{ fontSize: HERO_AMOUNT }}>—</span>
                )}
              </p>
            </div>

            {ratesReady && delta ? (
              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  onClick={hasChart ? () => setFlipped(true) : undefined}
                  className={`font-dm-sans inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-opacity ${
                    delta.positive ? 'bg-primary/15 text-primary' : 'bg-negative/15 text-negative'
                  } ${hasChart ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                  style={maskStyle}
                >
                  <span>{delta.positive ? '▲' : '▼'}</span>
                  <span>{delta.positive ? '+' : ''}{formatMoney(delta.diff, 'AUD', { maxFractionDigits: 0 })}</span>
                  {delta.pct != null && (
                    <span className="opacity-75">({delta.positive ? '+' : ''}{delta.pct.toFixed(1)}%)</span>
                  )}
                  {delta.sinceLabel && <span className="opacity-60">since {delta.sinceLabel}</span>}
                </button>
              </div>
            ) : null}

            {!ratesReady && (
              <p className="font-dm-mono mt-2 text-xs text-warning">Waiting for FX rates…</p>
            )}
          </div>

          <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
            <BreakdownCol label="Liquid" valueAud={liquidAud} ready={ratesReady} dotClass="bg-primary" maskStyle={maskStyle} />
            <BreakdownCol label="In deposits" valueAud={depositsAud} ready={ratesReady} dotClass="bg-accent-gold" maskStyle={maskStyle} />
            <BreakdownCol label="Super" valueAud={superAud} ready={ratesReady} dotClass="bg-ink-faint" maskStyle={maskStyle} />
          </div>
        </div>

        {/* ── Back (chart) — only rendered when flipped to avoid layout cost ── */}
        {flipped && (
          <div
            className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border glass-card px-6 pb-3 pt-5 sm:px-7"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="font-dm-sans text-xs font-medium uppercase tracking-wider text-ink-muted">
                Net worth history
              </p>
              <button
                type="button"
                onClick={() => setFlipped(false)}
                className="text-ink-faint transition hover:text-ink"
                aria-label="Back to overview"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M9 14 4 9l5-5" />
                  <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
                </svg>
              </button>
            </div>

            <div className="mb-2 flex gap-1.5">
              {TIME_RANGES.map(r => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setTimeRange(r.key)}
                  className={`font-dm-mono text-[10px] rounded-full px-2.5 py-0.5 transition ${
                    timeRange === r.key
                      ? 'bg-primary/20 text-primary'
                      : 'bg-surface-1/60 text-ink-faint hover:text-ink-muted'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="min-h-0 flex-1">
              <Suspense fallback={<div className="flex h-full items-center justify-center"><p className="font-dm-sans text-xs text-ink-muted">Loading…</p></div>}>
                <NetWorthChart data={chartData} />
              </Suspense>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  )
}

function BreakdownCol({ label, valueAud, ready, dotClass, maskStyle }) {
  return (
    <div className="flex min-w-0 flex-col items-center px-3 py-4 text-center sm:px-4">
      <span className="font-dm-mono text-sm font-bold tabular-nums text-ink" style={maskStyle}>
        {ready ? formatMoney(valueAud, 'AUD', { maxFractionDigits: 0 }) : '—'}
      </span>
      <span className="font-dm-sans mt-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
        <span className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} aria-hidden />
        <span className="truncate">{label}</span>
      </span>
    </div>
  )
}
