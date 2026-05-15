/**
 * @param {{
 *   globalLastUpdated: string | null,
 *   staleThresholdDays: number,
 *   fxDateLabel: string | null,
 * }} props
 */
export function FreshnessBar({
  globalLastUpdated,
  staleThresholdDays,
  fxDateLabel,
}) {
  let message = 'No account last_updated values found in the sheet.'
  let stale = false

  if (globalLastUpdated) {
    const d = new Date(globalLastUpdated)
    const now = new Date()
    const days = Math.floor(
      (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
    )
    stale = days > staleThresholdDays
    message = `Balances last updated ${d.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })} · ${days} day${days === 1 ? '' : 's'} ago`
  }

  return (
    <footer
      className={`mt-auto rounded-xl border px-4 py-3 ${
        stale
          ? 'border-warning/70 bg-warning/10'
          : 'border-border bg-surface'
      }`}
    >
      <p
        className={`font-dm-mono text-xs leading-relaxed ${
          stale ? 'text-warning' : 'text-ink-muted'
        }`}
      >
        <span className="font-dm-sans font-semibold text-ink">
          Data freshness
        </span>
        <br />
        {message}
        {fxDateLabel ? (
          <>
            <br />
            <span className="text-ink-faint">FX: {fxDateLabel}</span>
          </>
        ) : null}
      </p>
    </footer>
  )
}
