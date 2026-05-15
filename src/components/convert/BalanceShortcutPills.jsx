import { formatMoney } from '../../utils/formatCurrency.js'
/**
 * @param {{
 *   japanJpy: number | null,
 *   ecuadorUsd: number | null,
 *   rates: { JPY: number, USD: number } | null,
 *   ratesReady: boolean,
 *   onApply: (active: 'JPY'|'USD', amount: number) => void,
 * }} props
 */
export function BalanceShortcutPills({
  japanJpy,
  ecuadorUsd,
  rates,
  ratesReady,
  onApply,
}) {
  return (
    <section className="space-y-2" aria-label="Balance shortcuts">
        <h3 className="font-syne text-base font-bold text-ink">
          Sheet shortcuts
        </h3>
        <p className="font-dm-sans text-xs text-ink-muted">
          Pre-fill the converter using geography totals from your Accounts tab
          (same basis as Home).
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!ratesReady || !rates}
            onClick={() => onApply('JPY', japanJpy ?? 0)}
            className="font-dm-sans rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium text-ink transition hover:bg-surface-1 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="text-ink-muted">Japan total</span>{' '}
            <span className="font-dm-mono text-ink">
              {japanJpy != null && ratesReady
                ? formatMoney(japanJpy, 'JPY')
                : '—'}
            </span>
          </button>
          <button
            type="button"
            disabled={!ratesReady || !rates}
            onClick={() => onApply('USD', ecuadorUsd ?? 0)}
            className="font-dm-sans rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium text-ink transition hover:bg-surface-1 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="text-ink-muted">Ecuador total</span>{' '}
            <span className="font-dm-mono text-ink">
              {ecuadorUsd != null && ratesReady
                ? formatMoney(ecuadorUsd, 'USD', { maxFractionDigits: 2 })
                : '—'}
            </span>
          </button>
        </div>
      </section>
  )
}
