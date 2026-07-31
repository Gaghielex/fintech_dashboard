import { useMemo } from 'react'
import {
  computeFxTrend,
  describeFxRangePosition,
} from '../../utils/fxRangeStats.js'
import { FlagBadge } from '../home/HouseholdVisuals.jsx'

function formatShortDate(date) {
  if (!date) return ''
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
}

function Sparkline({ points, decimals, gradientId }) {
  const width = 320
  const height = 160
  const pad = { top: 10, right: 44, bottom: 26, left: 8 }
  const series = points
    .map((p) => ({ date: p.date, value: Number(p.value) || 0 }))
    .filter((p) => p.date && p.value > 0)
  const nums = series.map((p) => p.value)
  const min = nums.length ? Math.min(...nums) : 0
  const max = nums.length ? Math.max(...nums) : 1
  const span = max - min || 1
  const chartLeft = pad.left
  const chartRight = width - pad.right
  const chartTop = pad.top
  const chartBottom = height - pad.bottom
  const plotW = chartRight - chartLeft
  const plotH = chartBottom - chartTop
  const gridTicks = [0, 0.25, 0.5, 0.75, 1]
  const xTicks = series.length
    ? [0, Math.floor((series.length - 1) / 2), series.length - 1]
    : []
  const svgPoints = series.map((p, i) => {
    const x = series.length <= 1 ? chartLeft : chartLeft + (i / (series.length - 1)) * plotW
    const y = chartBottom - ((p.value - min) / span) * plotH
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const chartBoxClass = 'relative h-32 w-full shrink-0 md:h-52 lg:h-64'

  if (svgPoints.length < 2) {
    return <div className={`${chartBoxClass} rounded-xl bg-surface-1/40`} aria-hidden />
  }

  return (
    <div className={chartBoxClass}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00c896" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#00c896" stopOpacity="0" />
          </linearGradient>
        </defs>
        {gridTicks.map((tick) => {
          const y = chartBottom - tick * plotH
          return (
            <line
              key={tick}
              x1={chartLeft}
              y1={y}
              x2={chartRight}
              y2={y}
              stroke="rgba(139,148,158,0.13)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          )
        })}
        <line
          x1={chartLeft}
          y1={chartBottom}
          x2={chartRight}
          y2={chartBottom}
          stroke="rgba(139,148,158,0.30)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={`${svgPoints[0]} ${svgPoints.join(' ')} ${svgPoints[svgPoints.length - 1].split(',')[0]},${chartBottom} ${svgPoints[0].split(',')[0]},${chartBottom}`}
          fill={`url(#${gradientId})`}
          stroke="none"
        />
        <polyline
          points={svgPoints.join(' ')}
          fill="none"
          stroke="#00c896"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {gridTicks.map((tick) => {
        const value = min + tick * span
        const topPct = ((pad.top + (1 - tick) * plotH) / height) * 100
        return (
          <span
            key={tick}
            className="pointer-events-none absolute right-0 -translate-y-1/2 font-dm-mono text-[9px] tabular-nums leading-none text-ink-muted md:text-[10px]"
            style={{ top: `${topPct}%` }}
          >
            {value.toFixed(decimals)}
          </span>
        )
      })}

      {xTicks.map((index) => {
        const xPct =
          series.length <= 1
            ? (chartLeft / width) * 100
            : ((chartLeft + (index / (series.length - 1)) * plotW) / width) * 100
        if (index === 0) {
          return (
            <span
              key={index}
              className="pointer-events-none absolute bottom-0 left-0 font-dm-mono text-[9px] leading-none text-ink-muted md:text-[10px]"
            >
              {formatShortDate(series[index]?.date)}
            </span>
          )
        }
        if (index === series.length - 1) {
          return (
            <span
              key={index}
              className="pointer-events-none absolute bottom-0 font-dm-mono text-[9px] leading-none text-ink-muted md:text-[10px]"
              style={{ right: `${(pad.right / width) * 100}%` }}
            >
              {formatShortDate(series[index]?.date)}
            </span>
          )
        }
        return (
          <span
            key={index}
            className="pointer-events-none absolute bottom-0 -translate-x-1/2 font-dm-mono text-[9px] leading-none text-ink-muted md:text-[10px]"
            style={{ left: `${xPct}%` }}
          >
            {formatShortDate(series[index]?.date)}
          </span>
        )
      })}
    </div>
  )
}

function PairFlags({ quoteKey, inverted }) {
  const quoteFlag = quoteKey === 'JPY' ? 'jp' : 'us'
  const quoteLabel = quoteKey === 'JPY' ? 'Japan' : 'United States'
  const front = inverted
    ? { flag: 'au', label: 'Australia' }
    : { flag: quoteFlag, label: quoteLabel }
  const back = inverted
    ? { flag: quoteFlag, label: quoteLabel }
    : { flag: 'au', label: 'Australia' }

  return (
    <div className="relative h-6 w-11 shrink-0" aria-hidden>
      <span className="absolute left-0 top-0">
        <FlagBadge flag={front.flag} label={front.label} />
      </span>
      <span className="absolute left-5 top-0">
        <FlagBadge flag={back.flag} label={back.label} />
      </span>
    </div>
  )
}

function FlipIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 10h14l-4-4m0 8H3l4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
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
 *   quoteKey: 'JPY' | 'USD',
 *   latestRate: number,
 *   points: { date: string, JPY: number, USD: number }[],
 *   ratesReady: boolean,
 *   rangeKey: '30d' | '90d' | '180d' | '1y',
 *   onRangeChange: (range: '30d' | '90d' | '180d' | '1y') => void,
 *   inverted?: boolean,
 *   onToggleInvert?: () => void,
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
  inverted = false,
  onToggleInvert,
}) {
  // Guidance always uses native foreign-per-AUD quote (best time to convert into AUD).
  const guidance = computeFxTrend(points, quoteKey, latestRate)
  const signalClass =
    guidance.tone === 'low'
      ? 'border-primary/15 bg-primary/8 text-primary'
      : guidance.tone === 'high'
        ? 'border-accent-gold/20 bg-accent-gold/10 text-accent-gold'
        : 'border-white/10 bg-surface-1/55 text-ink-muted'

  const displayPoints = useMemo(
    () =>
      points
        .map((p) => {
          const raw = Number(p[quoteKey]) || 0
          return {
            date: p.date,
            value: inverted && raw > 0 ? 1 / raw : raw,
          }
        })
        .filter((p) => p.value > 0),
    [points, quoteKey, inverted],
  )

  const displayRate = inverted && latestRate > 0 ? 1 / latestRate : latestRate
  const displayStats = useMemo(() => {
    const vals = displayPoints.map((p) => p.value)
    if (!vals.length) {
      return { min: displayRate, max: displayRate, current: displayRate, position: 0.5 }
    }
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    let position = 0.5
    if (max > min) position = Math.min(1, Math.max(0, (displayRate - min) / (max - min)))
    return { min, max, current: displayRate, position }
  }, [displayPoints, displayRate])

  const positionLabel = describeFxRangePosition(displayStats.position)
  const decimals = inverted ? (quoteKey === 'JPY' ? 5 : 4) : quoteKey === 'JPY' ? 2 : 4
  const displayTitle = inverted
    ? `AUD / ${quoteKey}`
    : title
  const displaySubtitle = inverted
    ? `Australian dollars per one ${quoteKey === 'JPY' ? 'yen' : 'US dollar'}`
    : subtitle

  return (
    <section
      className="flex h-full min-h-[17rem] flex-col rounded-2xl border border-white/[0.08] p-4 backdrop-blur-xl"
      style={{
        background:
          'linear-gradient(145deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.035) 42%, rgba(0,200,150,0.055) 100%), rgba(22,27,34,0.72)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.16), inset 1px 0 0 rgba(255,255,255,0.06), 0 16px 40px rgba(0,0,0,0.24)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-syne text-lg font-bold text-ink">{displayTitle}</h3>
          <p className="font-dm-sans mt-0.5 text-xs text-ink-muted">{displaySubtitle}</p>
        </div>
        <div className="mt-1 flex h-6 shrink-0 items-center gap-2">
          {onToggleInvert ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onToggleInvert()
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="inline-flex h-6 w-6 items-center justify-center text-ink-muted transition hover:text-ink"
              aria-label={inverted ? `Show ${quoteKey} per AUD` : `Show AUD per ${quoteKey}`}
            >
              <FlipIcon />
            </button>
          ) : null}
          <PairFlags quoteKey={quoteKey} inverted={inverted} />
        </div>
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
            onClick={(e) => {
              e.stopPropagation()
              onRangeChange(/** @type {'30d'|'90d'|'180d'|'1y'} */ (key))
            }}
            onPointerDown={(e) => e.stopPropagation()}
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
        {ratesReady ? displayStats.current.toFixed(decimals) : '—'}
      </p>

      <div className="mt-3 shrink-0">
        <Sparkline
          points={displayPoints}
          decimals={decimals}
          gradientId={`fxSparkFill-${quoteKey}-${inverted ? 'inv' : 'nat'}`}
        />
      </div>

      <p
        className={`font-dm-sans mt-3 flex min-h-[2.75rem] items-center rounded-xl border px-3 py-2 text-xs leading-snug ${signalClass}`}
      >
        {ratesReady ? guidance.label : 'Waiting for rate history...'}
      </p>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <RangeStat label="Min" value={ratesReady ? displayStats.min.toFixed(decimals) : '—'} />
        <RangeStat label="Max" value={ratesReady ? displayStats.max.toFixed(decimals) : '—'} />
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
      <p className="font-dm-mono mt-1 truncate text-xs font-semibold tabular-nums text-ink">
        {value}
      </p>
    </div>
  )
}
