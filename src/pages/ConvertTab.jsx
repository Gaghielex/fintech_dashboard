import { useMemo, useState } from 'react'
import { BalanceShortcutPills } from '../components/convert/BalanceShortcutPills.jsx'
import { RateContextCard } from '../components/convert/RateContextCard.jsx'
import { TriCurrencyFields } from '../components/convert/TriCurrencyFields.jsx'
import { getConvertShortcutAmounts } from '../utils/convertShortcutBalances.js'
import { recalcTriFromActive } from '../utils/triCurrencyConvert.js'

/**
 * @param {{
 *   accounts: import('../types/sheetTypes.js').AccountRow[],
 *   settings: import('../types/sheetTypes.js').SettingsRow | null,
 *   latestRates: { JPY: number, USD: number } | null,
 *   fx: {
 *     latest: { rates: { JPY: number, USD: number } } | null,
 *     history: { points: { date: string, JPY: number, USD: number }[] } | null,
 *     loading: boolean,
 *     error: string | null,
 *     fromCache: boolean,
 *     lastFetchAt: string | null,
 *     ratesAsOf: string | null,
 *     refetch: () => void,
 *   },
 * }} props
 */
export function ConvertTab({ accounts, settings, latestRates, fx }) {
  const [amounts, setAmounts] = useState({ aud: 0, jpy: 0, usd: 0 })
  const [active, setActive] = useState(
    /** @type {'AUD'|'JPY'|'USD'} */ ('AUD'),
  )
  const [syncKey, setSyncKey] = useState(0)

  const ratesReady = Boolean(
    latestRates && latestRates.JPY > 0 && latestRates.USD > 0,
  )

  const points = fx.history?.points ?? []

  const shortcuts = useMemo(
    () => getConvertShortcutAmounts(accounts, settings, latestRates),
    [accounts, settings, latestRates],
  )

  const updatedLabel = useMemo(() => {
    if (fx.loading && !ratesReady) return 'Loading rates…'
    if (fx.lastFetchAt) {
      const t = new Date(fx.lastFetchAt).toLocaleTimeString('en-AU', {
        hour: '2-digit',
        minute: '2-digit',
      })
      return fx.fromCache ? `Cached · saved ${t}` : `Updated ${t}`
    }
    if (fx.ratesAsOf) return `Ref ${fx.ratesAsOf}`
    return '—'
  }, [fx.loading, fx.lastFetchAt, fx.fromCache, fx.ratesAsOf, ratesReady])

  const applyShortcut = (ccy, amount) => {
    if (!latestRates) return
    setAmounts(recalcTriFromActive(ccy, amount, latestRates))
    setActive(ccy)
    setSyncKey((k) => k + 1)
  }

  const jpySpot = latestRates?.JPY ?? 0
  const usdSpot = latestRates?.USD ?? 0

  return (
    <div className="flex flex-col space-y-6 pb-6 pt-8 px-5">
      <header className="space-y-3">
        <h1 className="font-syne text-2xl font-extrabold tracking-tight text-ink">
          Convert
        </h1>
        <div className="rounded-xl border border-white/10 bg-gradient-to-r from-violet-500/25 via-pink-500/20 to-orange-400/25 px-4 py-3">
          <p className="font-dm-sans font-semibold text-white/90 text-xs">
            FX Rates
          </p>
          <p className="font-dm-mono mt-0.5 text-xs leading-relaxed text-white/70" aria-live="polite">
            {ratesReady
              ? `1 AUD = ${jpySpot.toFixed(2)} JPY · ${usdSpot.toFixed(4)} USD`
              : fx.loading ? 'Loading…' : 'Rates unavailable'}
            {ratesReady && (
              <span className="text-white/50"> · {updatedLabel}</span>
            )}
          </p>
        </div>
      </header>

      {!ratesReady && !fx.loading ? (
        <p className="font-dm-sans rounded-lg border border-warning/50 bg-warning/10 px-3 py-2 text-sm text-warning">
          {fx.error ||
            'FX rates unavailable. Converter inputs stay disabled until rates load.'}
        </p>
      ) : null}

      {fx.fromCache && ratesReady ? (
        <p className="font-dm-sans rounded-lg border border-warning/40 bg-warning/5 px-3 py-2 text-xs text-warning">
          Showing last known FX bundle (Frankfurter unavailable on last fetch).
        </p>
      ) : null}

      <TriCurrencyFields
        key={`tri-${active}-${syncKey}`}
        rates={latestRates}
        ratesReady={ratesReady}
        amounts={amounts}
        onAmountsChange={setAmounts}
        active={active}
        onActiveChange={setActive}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <RateContextCard
          title="JPY / AUD"
          subtitle="Yen per one Australian dollar"
          quoteKey="JPY"
          latestRate={jpySpot}
          points={points}
          ratesReady={ratesReady}
        />
        <RateContextCard
          title="USD / AUD"
          subtitle="US dollars per one Australian dollar"
          quoteKey="USD"
          latestRate={usdSpot}
          points={points}
          ratesReady={ratesReady}
        />
      </div>

      <BalanceShortcutPills
        japanJpy={shortcuts.japanJpy}
        ecuadorUsd={shortcuts.ecuadorUsd}
        rates={latestRates}
        ratesReady={ratesReady}
        onApply={applyShortcut}
      />

      <button
        type="button"
        onClick={() => fx.refetch()}
        className="font-dm-sans self-start rounded-lg border border-border bg-surface-1 px-3 py-2 text-xs font-medium text-ink transition hover:bg-surface-1/70"
      >
        Refresh FX
      </button>
    </div>
  )
}
