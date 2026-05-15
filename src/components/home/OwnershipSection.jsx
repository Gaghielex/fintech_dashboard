import { formatMoney } from '../../utils/formatCurrency.js'
import { useNavigation } from '../../context/useNavigation.js'

/**
 * @param {{
 *   gabrielAud: number,
 *   anaAud: number,
 *   jointAud: number,
 *   ratesReady: boolean,
 * }} props
 */
export function OwnershipSection({
  gabrielAud,
  anaAud,
  jointAud,
  ratesReady,
}) {
  const { goToAccountsByOwner } = useNavigation()

  return (
    <section className="mb-8">
      <h2 className="font-syne mb-3 text-lg font-bold text-ink">Ownership</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <OwnerTile
          label="Gabriel"
          hint="includes joint"
          amountAud={gabrielAud}
          ready={ratesReady}
          onOpen={() => goToAccountsByOwner('gabriel')}
        />
        <OwnerTile
          label="Ana"
          hint="includes joint"
          amountAud={anaAud}
          ready={ratesReady}
          onOpen={() => goToAccountsByOwner('ana')}
        />
        <OwnerTile
          label="Joint"
          hint="joint accounts only"
          amountAud={jointAud}
          ready={ratesReady}
          onOpen={() => goToAccountsByOwner('joint')}
        />
      </div>
    </section>
  )
}

/**
 * @param {{ label: string, hint: string, amountAud: number, ready: boolean, onOpen: () => void }} props
 */
function OwnerTile({ label, hint, amountAud, ready, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="rounded-xl border border-border bg-surface p-4 text-left outline-none transition hover:bg-surface-1/80 focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <p className="font-syne text-base font-bold text-ink">{label}</p>
      <p className="font-dm-sans text-[10px] text-ink-faint">{hint}</p>
      <p className="font-dm-mono mt-3 text-lg font-medium tabular-nums text-ink">
        {ready ? formatMoney(amountAud, 'AUD') : '—'}
      </p>
    </button>
  )
}
