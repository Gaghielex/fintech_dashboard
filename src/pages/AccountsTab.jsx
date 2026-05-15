import { useNavigation } from '../context/useNavigation.js'

const countryLabel = {
  AU: 'Australia',
  JP: 'Japan',
  EC: 'Ecuador',
}

const ownerLabel = {
  rodrigo: 'Rodrigo',
  nat: 'Nat',
  joint: 'Joint',
}

/**
 * Phase 2 stub — shows drill-down state for Phase 3 list + filters.
 * @param {{
 *   loading: boolean,
 *   error: string | null,
 * }} props
 */
export function AccountsTab({ loading, error }) {
  const { accountsEntry, goToAccountsDefault } = useNavigation()

  const lines = []
  if (accountsEntry.retirementOnly) {
    lines.push('Retirement / super focus (list wiring in Phase 3).')
  } else if (accountsEntry.country) {
    const c = accountsEntry.country
    lines.push(
      `Geography drill-down: ${countryLabel[c] ?? c}. Other regions will stay collapsed in Phase 3.`,
    )
  } else if (accountsEntry.owner) {
    const o = accountsEntry.owner
    lines.push(
      `Ownership drill-down: ${ownerLabel[o] ?? o}. Joint is included in R & N totals on Home; this view filters the account list.`,
    )
  } else {
    lines.push('Default view: grouped by country (full Accounts tab in Phase 3).')
  }

  return (
    <div className="space-y-4 pb-4">
      <header>
        <h1 className="font-syne text-2xl font-extrabold tracking-tight text-ink">
          Accounts
        </h1>
        <p className="font-dm-sans mt-1 text-sm text-ink-muted">
          {loading ? 'Loading sheet…' : 'Read-only from Google Sheets.'}
        </p>
      </header>

      {error ? (
        <p className="font-dm-sans rounded-lg border border-negative/40 bg-negative/10 px-3 py-2 text-sm text-negative">
          {error}
        </p>
      ) : null}

      <section className="rounded-xl border border-border bg-surface p-4">
        <h2 className="font-dm-sans text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Active navigation context
        </h2>
        <ul className="font-dm-mono mt-2 list-inside list-disc space-y-1 text-xs text-ink-muted">
          {lines.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <dl className="font-dm-mono mt-3 grid gap-1 text-xs text-ink">
          <div className="flex justify-between gap-2">
            <dt className="text-ink-muted">country</dt>
            <dd>{accountsEntry.country ?? '—'}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-ink-muted">owner</dt>
            <dd>{accountsEntry.owner ?? '—'}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-ink-muted">retirementOnly</dt>
            <dd>{accountsEntry.retirementOnly ? 'yes' : 'no'}</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={goToAccountsDefault}
          className="font-dm-sans mt-4 rounded-lg border border-border px-3 py-2 text-xs font-medium text-ink hover:bg-surface-1"
        >
          Reset to default Accounts view
        </button>
      </section>
    </div>
  )
}
