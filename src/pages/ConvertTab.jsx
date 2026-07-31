import { useEffect, useMemo, useRef, useState } from 'react'
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

function slideStride(scroller) {
  return scroller.clientWidth + CARD_GAP_PX
}

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
  const scrollerRef = useRef(/** @type {HTMLDivElement | null} */ (null))
  const scrollingFromUi = useRef(false)
  const rateCardIndexRef = useRef(0)
  rateCardIndexRef.current = rateCardIndex

  const scrollToCard = (index, smooth = true) => {
    const el = scrollerRef.current
    if (!el) return
    scrollingFromUi.current = true
    el.scrollTo({
      left: index * slideStride(el),
      behavior: smooth ? 'smooth' : 'auto',
    })
    window.setTimeout(() => {
      scrollingFromUi.current = false
    }, smooth ? 420 : 0)
  }

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return undefined
    const syncWidth = () => {
      el.scrollTo({ left: rateCardIndexRef.current * slideStride(el), behavior: 'auto' })
    }
    const ro = new ResizeObserver(syncWidth)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const onScrollerScroll = () => {
    const el = scrollerRef.current
    if (!el || scrollingFromUi.current) return
    const stride = slideStride(el)
    if (stride <= 0) return
    const next = Math.round(el.scrollLeft / stride)
    const clamped = Math.max(0, Math.min(1, next))
    setRateCardIndex((i) => (i === clamped ? i : clamped))
  }

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

  const showPrevRateCard = () => {
    const next = Math.max(0, rateCardIndex - 1)
    setRateCardIndex(next)
    scrollToCard(next)
  }
  const showNextRateCard = () => {
    const next = Math.min(rateCards.length - 1, rateCardIndex + 1)
    setRateCardIndex(next)
    scrollToCard(next)
  }
  const goToRateCard = (index) => {
    setRateCardIndex(index)
    scrollToCard(index)
  }
  const toggleInvert = (quoteKey) => {
    setInvertedByPair((prev) => ({ ...prev, [quoteKey]: !prev[quoteKey] }))
  }

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
        {rateCardIndex > 0 ? (
          <button
            type="button"
            onClick={showPrevRateCard}
            className="font-dm-sans absolute -left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-surface/80 text-xl text-ink shadow-lg backdrop-blur-md transition hover:bg-surface-1 lg:flex"
            aria-label="Previous rate card"
          >
            ‹
          </button>
        ) : null}
        {rateCardIndex < rateCards.length - 1 ? (
          <button
            type="button"
            onClick={showNextRateCard}
            className="font-dm-sans absolute -right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-surface/80 text-xl text-ink shadow-lg backdrop-blur-md transition hover:bg-surface-1 lg:flex"
            aria-label="Next rate card"
          >
            ›
          </button>
        ) : null}

        <div
          ref={scrollerRef}
          onScroll={onScrollerScroll}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {rateCards.map((card) => (
            <div
              key={card.quoteKey}
              className="w-full min-w-full shrink-0 snap-start"
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
        </div>
        <div className="mt-3 flex justify-center gap-1.5" aria-label="Rate card pagination">
          {rateCards.map((card, index) => (
            <button
              key={card.quoteKey}
              type="button"
              onClick={() => goToRateCard(index)}
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
