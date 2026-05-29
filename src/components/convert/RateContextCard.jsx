import {
  computeFxRangeStats,
  describeFxRangePosition,
} from '../../utils/fxRangeStats.js'

/**
 * @param {{
 *   title: string,
 *   subtitle: string,
 *   quoteKey: 'JPY' | 'USD',
 *   latestRate: number,
 *   points: { date: string, JPY: number, USD: number }[],
 *   ratesReady: boolean,
 * }} props
 */
export function RateContextCard({
  title,
  subtitle,
  quoteKey,
  latestRate,
  points,
  ratesReady,
}) {
  const stats = computeFxRangeStats(points, quoteKey, latestRate)
  const label = describeFxRangePosition(stats.position)

  const decimals = quoteKey === 'JPY' ? 2 : 4

  return (
    <section
      className="rounded-xl border border-white/[0.06] p-4 backdrop-blur-xl"
      style={{ background: 'rgba(22,27,34,0.6)', boxShadow: '0 1px 0 0 rgba(255,255,255,0.08) inset' }}
    >
      <h3 className="font-syne text-base font-bold text-ink">{title}</h3>
      <p className="font-dm-sans mt-0.5 text-xs text-ink-muted">{subtitle}</p>

      <p className="font-dm-mono mt-3 text-2xl font-medium tabular-nums text-ink">
        {ratesReady ? stats.current.toFixed(decimals) : '—'}
      </p>

      <p className="font-dm-mono mt-1 text-xs text-ink-muted">
        30-day range:{' '}
        {ratesReady ? (
          <>
            <span className="text-ink">{stats.min.toFixed(decimals)}</span>
            {' — '}
            <span className="text-ink">{stats.max.toFixed(decimals)}</span>
          </>
        ) : (
          '—'
        )}
      </p>

      <div className="relative mt-3 h-2.5 overflow-hidden rounded-full bg-surface-1">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary/25"
          style={{ width: `${ratesReady ? stats.position * 100 : 0}%` }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute top-1/2 z-10 h-4 w-0.5 -translate-y-1/2 rounded-full bg-warning shadow-[0_0_0_1px_rgba(13,17,23,0.85)]"
          style={{
            left: `clamp(0px, calc(${ratesReady ? stats.position * 100 : 50}% - 1px), calc(100% - 2px))`,
          }}
          title="Current vs range"
        />
      </div>

      <p className="font-dm-sans mt-2 text-xs leading-snug text-ink-muted">
        {ratesReady ? label : 'Waiting for rate history…'}
      </p>
    </section>
  )
}
