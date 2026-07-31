import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useDragControls } from 'framer-motion'
import { BalanceShortcutPills } from '../components/convert/BalanceShortcutPills.jsx'
import { RateContextCard } from '../components/convert/RateContextCard.jsx'
import { TriCurrencyFields } from '../components/convert/TriCurrencyFields.jsx'
import { getConvertShortcutAmounts } from '../utils/convertShortcutBalances.js'
import { filterByDateRange } from '../utils/filterByDateRange.js'
import { recalcTriFromActive } from '../utils/triCurrencyConvert.js'

const HISTORY_RANGES = {
  '30d': 30,
  '90d': 90,
  '180d': 180,
  '1y': 365,
}

const CARD_GAP_PX = 16

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
  const [rateCardIndex, setRateCardIndex] = useState(0)
  const [historyRange, setHistoryRange] = useState(/** @type {'30d'|'90d'|'180d'|'1y'} */ ('30d'))
  const [invertedByPair, setInvertedByPair] = useState(
    /** @type {Record<'JPY'|'USD', boolean>} */ ({ JPY: false, USD: false }),
  )
  const [active, setActive] = useState(
    /** @type {'AUD'|'JPY'|'USD'} */ ('AUD'),
  )
  const [syncKey, setSyncKey] = useState(0)
  const [trackWidth, setTrackWidth] = useState(0)
  const trackRef = useRef(/** @type {HTMLDivElement | null} */ (null))
  const trackWidthRef = useRef(0)
  const dragControls = useDragControls()

  useEffect(() => {
    const el = trackRef.current
    if (!el) return undefined
    const measure = () => {
      const next = el.clientWidth
      if (next <= 0 || next === trackWidthRef.current) return
      trackWidthRef.current = next
      setTrackWidth(next)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const ratesReady = Boolean(
    latestRates && latestRates.JPY > 0 && latestRates.USD > 0,
  )

  const points = fx.history?.points ?? []
  const visiblePoints = useMemo(() => {
    if (!points.length) return []
    const latestPoint = points.at(-1)
    const endDate = latestPoint?.date
      ? new Date(`${latestPoint.date}T00:00:00`)
      : new Date()
    return filterByDateRange(points, HISTORY_RANGES[historyRange], endDate)
  }, [points, historyRange])

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
  const rateCards = [
    {
      title: 'JPY / AUD',
      subtitle: 'Yen per one Australian dollar',
      quoteKey: /** @type {'JPY'} */ ('JPY'),
      latestRate: jpySpot,
    },
    {
      title: 'USD / AUD',
      subtitle: 'US dollars per one Australian dollar',
      quoteKey: /** @type {'USD'} */ ('USD'),
      latestRate: usdSpot,
    },
  ]

  const onRateDragEnd = (_, info) => {
    const offset = info.offset.x
    const velocity = info.velocity.x
    if (offset < -80 || velocity < -600) {
      setRateCardIndex((i) => Math.min(rateCards.length - 1, i + 1))
    } else if (offset > 80 || velocity > 600) {
      setRateCardIndex((i) => Math.max(0, i - 1))
    }
  }

  const startRateDrag = (event) => {
    const target = /** @type {HTMLElement | null} */ (event.target)
    if (target?.closest?.('button, a, input, textarea, [role="button"]')) return
    dragControls.start(event)
  }

  const showPrevRateCard = () => setRateCardIndex((i) => Math.max(0, i - 1))
  const showNextRateCard = () => setRateCardIndex((i) => Math.min(rateCards.length - 1, i + 1))
  const toggleInvert = (quoteKey) => {
    setInvertedByPair((prev) => ({ ...prev, [quoteKey]: !prev[quoteKey] }))
  }

  const width = trackWidth || trackWidthRef.current
  const slideX = width > 0 ? -(rateCardIndex * (width + CARD_GAP_PX)) : 0

  return (
    <div className="flex flex-col space-y-6 pb-6 pt-8 px-5">
      <header>
        <h1 className="font-syne text-2xl font-extrabold tracking-tight text-ink">
          Convert
        </h1>
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

      <div className="relative">
        <button
          type="button"
          onClick={showPrevRateCard}
          disabled={rateCardIndex === 0}
          className="font-dm-sans absolute -left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-surface/80 text-xl text-ink shadow-lg backdrop-blur-md transition hover:bg-surface-1 disabled:cursor-default disabled:opacity-25 lg:flex"
          aria-label="Previous rate card"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={showNextRateCard}
          disabled={rateCardIndex === rateCards.length - 1}
          className="font-dm-sans absolute -right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-surface/80 text-xl text-ink shadow-lg backdrop-blur-md transition hover:bg-surface-1 disabled:cursor-default disabled:opacity-25 lg:flex"
          aria-label="Next rate card"
        >
          ›
        </button>

        <div
          ref={trackRef}
          className="overflow-hidden"
          onPointerDown={startRateDrag}
        >
          <motion.div
            className="flex"
            style={{ gap: CARD_GAP_PX, width: width > 0 ? width * rateCards.length + CARD_GAP_PX * (rateCards.length - 1) : undefined }}
            animate={{ x: slideX }}
            transition={{ type: 'spring', stiffness: 180, damping: 28, mass: 0.95 }}
            drag="x"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            dragMomentum={false}
            onDragEnd={onRateDragEnd}
          >
            {rateCards.map((card) => (
              <div
                key={card.quoteKey}
                className="shrink-0"
                style={{ width: width > 0 ? width : '100%' }}
              >
                <RateContextCard
                  title={card.title}
                  subtitle={card.subtitle}
                  quoteKey={card.quoteKey}
                  latestRate={card.latestRate}
                  points={visiblePoints}
                  ratesReady={ratesReady}
                  rangeKey={historyRange}
                  onRangeChange={setHistoryRange}
                  inverted={invertedByPair[card.quoteKey]}
                  onToggleInvert={() => toggleInvert(card.quoteKey)}
                />
              </div>
            ))}
          </motion.div>
        </div>
        <div className="mt-3 flex justify-center gap-1.5" aria-label="Rate card pagination">
          {rateCards.map((card, index) => (
            <button
              key={card.quoteKey}
              type="button"
              onClick={() => setRateCardIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === rateCardIndex ? 'w-5 bg-primary' : 'w-1.5 bg-ink-faint/35'
              }`}
              aria-label={`Show ${card.title}`}
            />
          ))}
        </div>
      </div>

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
