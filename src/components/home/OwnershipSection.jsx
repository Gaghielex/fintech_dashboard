import { motion } from 'framer-motion'
import { formatMoney } from '../../utils/formatCurrency.js'
import { useNavigation } from '../../context/useNavigation.js'

function IconChevronRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-ink-faint">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

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
    <motion.button
      type="button"
      onClick={onOpen}
      whileTap={{ opacity: 0.72, scale: 0.98 }}
      transition={{ duration: 0.1 }}
      className="rounded-xl border border-border bg-surface p-4 text-left outline-none transition-colors hover:bg-surface-1/80 focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <div className="flex items-start justify-between gap-1">
        <p className="font-syne text-base font-bold text-ink">{label}</p>
        <IconChevronRight />
      </div>
      <p className="font-dm-sans text-[10px] text-ink-faint">{hint}</p>
      <p className="font-dm-mono mt-3 text-lg font-medium tabular-nums text-ink">
        {ready ? formatMoney(amountAud, 'AUD') : '—'}
      </p>
    </motion.button>
  )
}
