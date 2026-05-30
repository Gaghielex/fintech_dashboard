/**
 * @param {{
 *   globalLastUpdated: string | null,
 *   staleThresholdDays: number,
 * }} props
 */
export function FreshnessBar({
  globalLastUpdated,
  staleThresholdDays,
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
    <footer className="mt-auto rounded-xl border border-white/10 bg-gradient-to-r from-violet-500/25 via-pink-500/20 to-orange-400/25 px-4 py-3">
      <p className={`font-dm-mono text-xs leading-relaxed ${stale ? 'text-orange-200' : 'text-white/70'}`}>
        <span className={`font-dm-sans font-semibold ${stale ? 'text-orange-100' : 'text-white/90'}`}>
          Data freshness
        </span>
        <br />
        {message}
      </p>
    </footer>
  )
}
