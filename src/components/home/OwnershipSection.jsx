import { motion } from 'framer-motion'
import { useNavigation } from '../../context/useNavigation.js'
import { OwnerAvatar } from './HouseholdVisuals.jsx'
import { HOME_SECTION_TITLE_CLASS } from './sectionTitle.js'

function formatCompactAud(amount) {
  const n = Math.round(Number(amount) || 0)
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1_000_000) {
    const m = abs / 1_000_000
    const s = m >= 10 ? Math.round(m) : m.toFixed(1).replace(/\.0$/, '')
    return `${sign}$${s}M`
  }
  if (abs >= 1000) {
    const k = Math.round((abs / 1000) * 10) / 10
    const s = k.toFixed(1).replace(/\.0$/, '')
    return `${sign}$${s}k`
  }
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(n)
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
      <h2 className={HOME_SECTION_TITLE_CLASS}>How much in my accounts?</h2>
      <motion.div className="grid grid-cols-3 gap-2 sm:gap-3">
        <OwnerTile
          owner="gabriel"
          label="Gabriel"
          amountAud={gabrielAud}
          ready={ratesReady}
          onOpen={() => goToAccountsByOwner('gabriel')}
        />
        <OwnerTile
          owner="ana"
          label="Ana"
          amountAud={anaAud}
          ready={ratesReady}
          onOpen={() => goToAccountsByOwner('ana')}
        />
        <OwnerTile
          owner="joint"
          label="Joint"
          amountAud={jointAud}
          ready={ratesReady}
          onOpen={() => goToAccountsByOwner('joint')}
        />
      </motion.div>
    </section>
  )
}

/**
 * @param {{
 *   owner: 'gabriel' | 'ana' | 'joint',
 *   label: string,
 *   amountAud: number,
 *   ready: boolean,
 *   onOpen: () => void,
 * }} props
 */
function OwnerTile({ owner, label, amountAud, ready, onOpen }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileTap={{ opacity: 0.72, scale: 0.98 }}
      transition={{ duration: 0.1 }}
      className="flex min-w-0 flex-col items-center gap-2 rounded-xl border border-border bg-surface px-2 py-4 text-center outline-none transition-colors hover:bg-surface-1/80 focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <OwnerAvatar owner={owner} size="40" />
      <p className="font-dm-mono text-lg font-bold leading-tight tabular-nums text-ink">
        {ready ? formatCompactAud(amountAud) : '—'}
      </p>
      <p className="font-dm-sans text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </p>
    </motion.button>
  )
}
