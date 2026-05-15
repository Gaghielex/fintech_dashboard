import { useSheetData } from '../hooks/useSheetData.js'
import { useFXRates } from '../hooks/useFXRates.js'

/**
 * Phase 1 smoke UI — replace with Home / tabs in later phases.
 */
export function Phase1Status() {
  const sheet = useSheetData()
  const fx = useFXRates()

  return (
    <div className="mx-auto max-w-lg space-y-8 px-4 py-10">
      <header className="space-y-2">
        <p className="font-dm-mono text-xs uppercase tracking-widest text-primary">
          Phase 1 · Foundation
        </p>
        <h1 className="font-syne text-3xl font-extrabold tracking-tight text-ink">
          Data layer
        </h1>
        <p className="font-dm-sans text-sm leading-relaxed text-ink-muted">
          Google Sheets (all tabs) and Frankfurter FX (latest + 30-day window).
          Styling uses design tokens from the PRD.
        </p>
      </header>

      <section className="space-y-3 rounded-xl border border-border bg-surface p-4">
        <h2 className="font-dm-sans text-sm font-semibold text-ink">
          Google Sheet
        </h2>
        {sheet.loading ? (
          <p className="font-dm-mono text-sm text-ink-muted">Loading…</p>
        ) : null}
        {sheet.error ? (
          <p className="font-dm-sans text-sm text-negative">{sheet.error}</p>
        ) : null}
        {sheet.data ? (
          <ul className="font-dm-mono space-y-1 text-xs text-ink-muted">
            <li>Tabs: {sheet.data.tabOrder.join(', ')}</li>
            <li>Accounts parsed: {sheet.data.accounts.length}</li>
            <li>Goals parsed: {sheet.data.goals.length}</li>
            <li>FX snapshots parsed: {sheet.data.fxSnapshots.length}</li>
            <li>Settings: {sheet.data.settings ? 'yes' : 'none'}</li>
            <li>Other / raw tabs: {Object.keys(sheet.data.rawTabs).length}</li>
            {sheet.lastFetchedAt ? (
              <li className="text-ink-faint">
                Fetched: {new Date(sheet.lastFetchedAt).toLocaleString()}
              </li>
            ) : null}
          </ul>
        ) : null}
        <button
          type="button"
          onClick={sheet.refetch}
          className="font-dm-sans rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-1"
        >
          Refetch sheet
        </button>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-surface p-4">
        <h2 className="font-dm-sans text-sm font-semibold text-ink">
          Frankfurter (AUD → JPY, USD)
        </h2>
        {fx.loading ? (
          <p className="font-dm-mono text-sm text-ink-muted">Loading…</p>
        ) : null}
        {fx.error && !fx.latest ? (
          <p className="font-dm-sans text-sm text-negative">{fx.error}</p>
        ) : null}
        {fx.latest ? (
          <ul className="font-dm-mono space-y-1 text-xs text-ink-muted">
            <li>
              Latest date: <span className="text-ink">{fx.latest.date}</span>
            </li>
            <li>
              JPY:{' '}
              <span className="text-ink">{fx.latest.rates.JPY.toFixed(2)}</span>{' '}
              · USD:{' '}
              <span className="text-ink">{fx.latest.rates.USD.toFixed(5)}</span>
            </li>
            <li>
              History points:{' '}
              <span className="text-ink">{fx.history?.points.length ?? 0}</span>
            </li>
            {fx.fromCache ? (
              <li className="text-warning">
                Using cached rates
                {fx.lastFetchAt
                  ? ` (saved ${new Date(fx.lastFetchAt).toLocaleString()})`
                  : ''}
              </li>
            ) : null}
            {fx.ratesAsOf && !fx.fromCache ? (
              <li className="text-ink-faint">
                Market date: {fx.ratesAsOf}
              </li>
            ) : null}
          </ul>
        ) : null}
        <button
          type="button"
          onClick={fx.refetch}
          className="font-dm-sans rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-1"
        >
          Refetch FX
        </button>
      </section>
    </div>
  )
}
