import {
  computeFxTrend,
  describeFxRangePosition,
} from '../../utils/fxRangeStats.js'
import { FlagBadge } from '../home/HouseholdVisuals.jsx'

function formatShortDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
}

function Sparkline({ points, quoteKey, decimals }) {
  const width = 320
  const height = 132
  const pad = { top: 8, right: 44, bottom: 24, left: 8 }
  const series = points
    .map((p) => ({ date: p.date, value: Number(p[quoteKey]) || 0 }))
    .filter((p) => p.date && p.value > 0)
  const nums = series.map((p) => p.value)
  const min = nums.length ? Math.min(...nums) : 0
  const max = nums.length ? Math.max(...nums) : 1
  const span = max - min || 1
  const chartLeft = pad.left
  const chartRight = width - pad.right
  const chartTop = pad.top
  const chartBottom = height - pad.bottom
  const gridTicks = [0, 0.25, 0.5, 0.75, 1]
  const xTicks = series.length
    ? [0, Math.floor((series.length - 1) / 2), series.length - 1]
    : []
  const svgPoints = series.map((p, i) => {
    const x = series.length <= 1 ? chartLeft : chartLeft + (i / (series.length - 1)) * (chartRight - chartLeft)
    const y = chartBottom - ((p.value - min) / span) * (chartBottom - chartTop)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  if (svgPoints.length < 2) {
    return <div className="h-32 rounded-xl bg-surface-1/40" aria-hidden />
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-32 w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="fxSparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00c896" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#00c896" stopOpacity="0" />
        </linearGradient>
      </defs>
      {gridTicks.map((tick) => {
        const y = chartBottom - tick * (chartBottom - chartTop)
        const value = min + tick * span
        return (
          <g key={tick}>
            <line
              x1={chartLeft}
              y1={y}
              x2={chartRight}
              y2={y}
              stroke="rgba(139,148,158,0.13)"
              strokeWidth="1"
            />
            <text x={width - 2} y={y + 3} fill="#8b949e" fontSize="8" textAnchor="end">
              {value.toFixed(decimals)}
            </text>
          </g>
        )
      })}
      <line x1={chartLeft} y1={chartBottom} x2={chartRight} y2={chartBottom} stroke="rgba(139,148,158,0.30)" strokeWidth="1" />
      {xTicks.map((index) => {
        const x = series.length <= 1 ? chartLeft : chartLeft + (index / (series.length - 1)) * (chartRight - chartLeft)
        const anchor = index === 0 ? 'start' : index === series.length - 1 ? 'end' : 'middle'
        return (
          <text key={index} x={x} y={height - 5} fill="#8b949e" fontSize="8" textAnchor={anchor}>
            {formatShortDate(series[index]?.date)}
          </text>
        )
      })}
      <polyline
        points={`${svgPoints[0]} ${svgPoints.join(' ')} ${svgPoints[svgPoints.length - 1].split(',')[0]},${chartBottom} ${svgPoints[0].split(',')[0]},${chartBottom}`}
        fill="url(#fxSparkFill)"
        stroke="none"
      />
      <polyline
        points={svgPoints.join(' ')}
        fill="none"
        stroke="#00c896"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PairFlags({ quoteKey }) {
  const quoteFlag = quoteKey === 'JPY' ? 'jp' : 'us'
  const quoteLabel = quoteKey === 'JPY' ? 'Japan' : 'United States'
  return (
    <div className="relative h-8 w-12 shrink-0" aria-hidden>
      <span className="absolute left-0 top-0">
        <FlagBadge flag={quoteFlag} label={quoteLabel} />
      </span>
      <span className="absolute left-5 top-0">
        <FlagBadge flag="au" label="Australia" />
      </span>
    </div>
  )
}

/**
 * @param {{
 *   title: string,
 *   subtitle: string,
 *   quoteKey: 'JPY' | 'USD',
 *   latestRate: number,
 *   points: { date: string, JPY: number, USD: number }[],
 *   ratesReady: boolean,
 *   rangeKey: '30d' | '90d' | '180d' | '1y',
 *   onRangeChange: (range: '30d' | '90d' | '180d' | '1y') => void,
 * }} props
 */
export function RateContextCard({
  title,
  subtitle,
  quoteKey,
  latestRate,
  points,
  ratesReady,
  rangeKey,
  onRangeChange,
}) {
  const stats = computeFxTrend(points, quoteKey, latestRate)
  const positionLabel = describeFxRangePosition(stats.position)
  const signalClass =
    stats.tone === 'low'
      ? 'border-primary/15 bg-primary/8 text-primary'
      : stats.tone === 'high'
        ? 'border-accent-gold/20 bg-accent-gold/10 text-accent-gold'
        : 'border-white/10 bg-surface-1/55 text-ink-muted'

  const decimals = quoteKey === 'JPY' ? 2 : 4

  return (
    <section
      className="min-h-[17rem] rounded-2xl border border-white/[0.08] p-4 backdrop-blur-xl"
      style={{
        background:
          'linear-gradient(145deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.035) 42%, rgba(0,200,150,0.055) 100%), rgba(22,27,34,0.72)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.16), inset 1px 0 0 rgba(255,255,255,0.06), 0 16px 40px rgba(0,0,0,0.24)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-syne text-lg font-bold text-ink">{title}</h3>
          <p className="font-dm-sans mt-0.5 text-xs text-ink-muted">{subtitle}</p>
        </div>
        <PairFlags quoteKey={quoteKey} />
      </div>

      <div className="mt-3 flex gap-1.5">
        {[
          ['30d', '30d'],
          ['90d', '90d'],
          ['180d', '180d'],
          ['1y', '1Y'],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => onRangeChange(/** @type {'30d'|'90d'|'180d'|'1y'} */ (key))}
            className={`font-dm-mono rounded-full px-2.5 py-1 text-[10px] transition ${
              rangeKey === key
                ? 'bg-primary/20 text-primary'
                : 'bg-surface-1/70 text-ink-faint hover:text-ink-muted'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="font-dm-mono mt-4 text-4xl font-medium leading-none tabular-nums text-ink">
        {ratesReady ? stats.current.toFixed(decimals) : '—'}
      </p>

      <div className="mt-3">
        <Sparkline points={points} quoteKey={quoteKey} decimals={decimals} />
      </div>

      <p className={`font-dm-sans mt-3 rounded-xl border px-3 py-2 text-xs leading-snug ${signalClass}`}>
        {ratesReady ? stats.label : 'Waiting for rate history...'}
      </p>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <RangeStat label="Min" value={ratesReady ? stats.min.toFixed(decimals) : '—'} />
        <RangeStat label="Max" value={ratesReady ? stats.max.toFixed(decimals) : '—'} />
        <RangeStat label="Now" value={ratesReady ? positionLabel : '—'} />
      </div>

    </section>
  )
}

function RangeStat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-surface-1/55 px-2 py-2">
      <p className="font-dm-sans text-[9px] font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </p>
      <p className="font-dm-mono mt-1 truncate text-xs font-semibold text-ink">
        {value}
      </p>
    </div>
  )
}
