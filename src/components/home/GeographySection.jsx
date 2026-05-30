import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { GeographyTile } from './GeographyTile.jsx'
import { GEO_FLAGS } from './geographyFlags.js'
import { useNavigation } from '../../context/useNavigation.js'
import { HOME_SECTION_TITLE_CLASS } from './sectionTitle.js'
import { FlagBadge } from './HouseholdVisuals.jsx'
import { formatMoney } from '../../utils/formatCurrency.js'

const VIEW_OPTIONS = [
  { id: 'cards', label: 'By Country' },
  { id: 'allocation', label: 'Allocation' },
  { id: 'map', label: 'Map' },
]

const COUNTRY_META = {
  AU: { label: 'Australia', flag: GEO_FLAGS.AU, color: '#00c896', marker: { left: '73%', top: '67%' } },
  JP: { label: 'Japan', flag: GEO_FLAGS.JP, color: '#f0c419', marker: { left: '77%', top: '36%' } },
  EC: { label: 'Ecuador', flag: GEO_FLAGS.EC, color: '#f72585', marker: { left: '23%', top: '58%' } },
}

function GeographyViewController({ activeView, onChange }) {
  return (
    <div className="mb-3 flex gap-2 overflow-x-auto pb-0.5">
      {VIEW_OPTIONS.map((opt) => {
        const active = activeView === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`font-dm-sans shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active
                ? 'bg-primary text-canvas'
                : 'border border-border bg-surface text-ink-muted hover:bg-surface-1'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function getCountryRows(geography) {
  return ['AU', 'JP', 'EC'].map((key) => ({
    key,
    ...COUNTRY_META[key],
    amount: geography[key]?.totalAud ?? 0,
  }))
}

function AllocationDonutView({ geography, ratesReady }) {
  const rows = getCountryRows(geography)
  const total = rows.reduce((sum, row) => sum + row.amount, 0)
  let cursor = 0
  const gradient = rows.map((row) => {
    const pct = total > 0 ? (row.amount / total) * 100 : 0
    const part = `${row.color} ${cursor}% ${cursor + pct}%`
    cursor += pct
    return part
  }).join(', ')

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border glass-card p-5"
    >
      <div className="flex items-center gap-5">
        <div
          className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full"
          style={{
            background: total > 0 ? `conic-gradient(${gradient})` : 'rgba(255,255,255,0.08)',
          }}
        >
          <div className="absolute inset-5 rounded-full bg-canvas/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]" />
          <div className="relative text-center">
            <p className="font-dm-sans text-[10px] font-semibold uppercase tracking-wide text-ink-muted">Total</p>
            <p className="font-dm-mono mt-1 text-lg font-bold tabular-nums text-ink">
              {ratesReady ? formatMoney(total, 'AUD', { maxFractionDigits: 0 }) : '—'}
            </p>
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          {rows.map((row) => {
            const pct = total > 0 ? (row.amount / total) * 100 : 0
            return (
              <div key={row.key} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.color }} />
                <span className="font-dm-sans min-w-0 flex-1 text-sm text-ink">{row.label}</span>
                <span className="font-dm-mono text-xs text-ink-muted">{pct.toFixed(0)}%</span>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

function MapMarker({ row, ratesReady, onNavigate }) {
  return (
    <button
      type="button"
      onClick={onNavigate}
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-left"
      style={row.marker}
      aria-label={`Open ${row.label} accounts`}
    >
      <div className="flex items-center gap-2 rounded-full border border-white/15 bg-canvas/80 px-2 py-1 shadow-lg backdrop-blur-md">
        <FlagBadge flag={row.flag} label={row.label} />
        <span className="font-dm-mono whitespace-nowrap text-[10px] font-bold text-ink">
          {ratesReady ? formatMoney(row.amount, 'AUD', { maxFractionDigits: 0 }) : '—'}
        </span>
      </div>
    </button>
  )
}

function StylizedMapView({ geography, ratesReady, onCountry }) {
  const rows = getCountryRows(geography)
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border glass-card p-4"
    >
      <div className="mb-3">
        <p className="font-syne text-base font-bold text-ink">Global position</p>
        <p className="font-dm-sans text-xs text-ink-muted">Tap a marker to open accounts</p>
      </div>
      <div className="relative h-64 overflow-hidden rounded-xl border border-white/[0.06] bg-[#11182a]">
        <div className="absolute inset-0 opacity-40" style={{
          background:
            'radial-gradient(circle at 20% 55%, rgba(247,37,133,0.25), transparent 18%), radial-gradient(circle at 76% 38%, rgba(240,196,25,0.20), transparent 16%), radial-gradient(circle at 73% 68%, rgba(0,200,150,0.22), transparent 18%)',
        }} />
        <svg viewBox="0 0 520 270" className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <pattern id="mapStripes" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M0 3.5H8" stroke="rgba(139,148,158,0.55)" strokeWidth="1.4" />
            </pattern>
          </defs>
          <path d="M58 92c38-22 70-18 107-5 24 8 42 3 58 20 14 15 3 31-17 35-35 6-60-14-94-9-29 4-58-8-69-25-5-8 2-13 15-16Z" fill="url(#mapStripes)" stroke="rgba(139,148,158,0.55)" />
          <path d="M154 151c23 3 42 24 36 52-4 20-20 31-31 48-8-30-27-51-30-73-2-16 8-30 25-27Z" fill="url(#mapStripes)" stroke="rgba(139,148,158,0.55)" />
          <path d="M240 78c54-26 126-20 188 4 36 14 55 35 42 54-15 20-57 8-92 16-44 10-82 11-119-2-31-10-55-22-52-43 2-13 14-21 33-29Z" fill="url(#mapStripes)" stroke="rgba(139,148,158,0.55)" />
          <path d="M314 153c28 8 47 30 42 57-6 30-37 38-56 17-21-24-18-55 14-74Z" fill="url(#mapStripes)" stroke="rgba(139,148,158,0.55)" />
          <path d="M389 191c32-20 73-8 88 14 13 18 1 37-30 38-26 1-61-8-73-25-8-11 0-20 15-27Z" fill="url(#mapStripes)" stroke="rgba(139,148,158,0.55)" />
          <path d="M424 135c16-16 36-15 45-1 7 11-1 25-21 29-18 3-36-13-24-28Z" fill="url(#mapStripes)" stroke="rgba(139,148,158,0.55)" />
          <path d="M112 151 150 151" stroke="rgba(255,255,255,0.58)" strokeWidth="1" />
          <path d="M400 94 432 100" stroke="rgba(255,255,255,0.58)" strokeWidth="1" />
          <path d="M386 190 395 204" stroke="rgba(255,255,255,0.58)" strokeWidth="1" />
        </svg>
        {rows.map((row) => (
          <MapMarker
            key={row.key}
            row={row}
            ratesReady={ratesReady}
            onNavigate={() => onCountry(row.key)}
          />
        ))}
      </div>
    </motion.div>
  )
}

/**
 * @param {{
 *   geography: {
 *     AU: { totalAud: number, native: string },
 *     JP: { totalAud: number, native: string },
 *     EC: { totalAud: number, native: string },
 *   },
 *   retirementAud: number,
 *   rates: { JPY: number, USD: number },
 *   ratesReady: boolean,
 *   retirementIconUrl?: string | null,
 * }} props
 */
export function GeographySection({
  geography,
  retirementAud,
  rates,
  ratesReady,
  retirementIconUrl,
}) {
  const [activeView, setActiveView] = useState('cards')
  const {
    goToAccountsByCountry,
    goToAccountsRetirement,
  } = useNavigation()
  const onCountry = useMemo(() => ({
    AU: () => goToAccountsByCountry('AU'),
    JP: () => goToAccountsByCountry('JP'),
    EC: () => goToAccountsByCountry('EC'),
  }), [goToAccountsByCountry])

  return (
    <section className="mb-8">
      <h2 className={HOME_SECTION_TITLE_CLASS}>Where is our money?</h2>
      <GeographyViewController activeView={activeView} onChange={setActiveView} />
      {activeView === 'cards' ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
          <GeographyTile
            flag={GEO_FLAGS.AU}
            title="Australia"
            subtitle="Cash & deposits"
            regionNative="AUD"
            totalAud={geography.AU.totalAud}
            rates={rates}
            ratesReady={ratesReady}
            onNavigate={onCountry.AU}
          />
          <GeographyTile
            flag={GEO_FLAGS.JP}
            title="Japan"
            subtitle="Cash & deposits"
            regionNative="JPY"
            totalAud={geography.JP.totalAud}
            rates={rates}
            ratesReady={ratesReady}
            onNavigate={onCountry.JP}
          />
          <GeographyTile
            flag={GEO_FLAGS.EC}
            title="Ecuador"
            subtitle="Cash & deposits"
            regionNative="USD"
            totalAud={geography.EC.totalAud}
            rates={rates}
            ratesReady={ratesReady}
            onNavigate={onCountry.EC}
          />
          <GeographyTile
            flag={retirementIconUrl ?? GEO_FLAGS.retirement}
            title="Retirement"
            subtitle="Superannuation"
            regionNative="AUD"
            totalAud={retirementAud}
            rates={rates}
            ratesReady={ratesReady}
            onNavigate={goToAccountsRetirement}
            variant="retirement"
          />
        </motion.div>
      ) : activeView === 'allocation' ? (
        <AllocationDonutView geography={geography} ratesReady={ratesReady} />
      ) : (
        <StylizedMapView geography={geography} ratesReady={ratesReady} onCountry={(key) => onCountry[key]()} />
      )}
    </section>
  )
}
