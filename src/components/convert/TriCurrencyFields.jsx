import { useState } from 'react'
import { formatMoney } from '../../utils/formatCurrency.js'
import { recalcTriFromActive } from '../../utils/triCurrencyConvert.js'

/**
 * @param {{ aud: number, jpy: number, usd: number }} amounts
 * @param {'AUD'|'JPY'|'USD'} active
 */
function formatForActive(amounts, active) {
  if (active === 'JPY') {
    return amounts.jpy === 0 ? '' : String(Math.round(amounts.jpy))
  }
  if (active === 'USD') {
    if (amounts.usd === 0) return ''
    const r = Math.round(amounts.usd * 10000) / 10000
    return String(r)
  }
  if (amounts.aud === 0) return ''
  const r = Math.round(amounts.aud * 100) / 100
  return String(r)
}

/**
 * @param {{
 *   rates: { JPY: number, USD: number } | null,
 *   ratesReady: boolean,
 *   amounts: { aud: number, jpy: number, usd: number },
 *   onAmountsChange: (a: { aud: number, jpy: number, usd: number }) => void,
 *   active: 'AUD' | 'JPY' | 'USD',
 *   onActiveChange: (c: 'AUD' | 'JPY' | 'USD') => void,
 * }} props
 */
export function TriCurrencyFields({
  rates,
  ratesReady,
  amounts,
  onAmountsChange,
  active,
  onActiveChange,
}) {
  const [local, setLocal] = useState(() => formatForActive(amounts, active))

  const applyParsed = (rawString) => {
    if (!ratesReady || !rates) return
    const t = rawString.replace(/,/g, '').trim()
    if (t === '') {
      onAmountsChange({ aud: 0, jpy: 0, usd: 0 })
      return
    }
    if (t === '-' || t === '.' || t === '-.') return
    const n = parseFloat(t)
    if (!Number.isFinite(n)) return
    onAmountsChange(recalcTriFromActive(active, n, rates))
  }

  return (
    <section className="space-y-3" aria-label="Currency converter">
      <CurrencyBlock
        code="AUD"
        label="Australian dollar"
        selected={active === 'AUD'}
        onSelect={() => onActiveChange('AUD')}
        ratesReady={ratesReady}
        isEditor={active === 'AUD'}
        local={local}
        display={formatMoney(amounts.aud, 'AUD')}
        onBlur={() => applyParsed(local)}
        onChange={(e) => {
          setLocal(e.target.value)
          applyParsed(e.target.value)
        }}
      />
      <CurrencyBlock
        code="JPY"
        label="Japanese yen"
        selected={active === 'JPY'}
        onSelect={() => onActiveChange('JPY')}
        ratesReady={ratesReady}
        isEditor={active === 'JPY'}
        local={local}
        display={formatMoney(amounts.jpy, 'JPY')}
        onBlur={() => applyParsed(local)}
        onChange={(e) => {
          setLocal(e.target.value)
          applyParsed(e.target.value)
        }}
      />
      <CurrencyBlock
        code="USD"
        label="US dollar"
        selected={active === 'USD'}
        onSelect={() => onActiveChange('USD')}
        ratesReady={ratesReady}
        isEditor={active === 'USD'}
        local={local}
        display={formatMoney(amounts.usd, 'USD', { maxFractionDigits: 4 })}
        onBlur={() => applyParsed(local)}
        onChange={(e) => {
          setLocal(e.target.value)
          applyParsed(e.target.value)
        }}
      />
    </section>
  )
}

/**
 * @param {{
 *   code: string,
 *   label: string,
 *   selected: boolean,
 *   onSelect: () => void,
 *   ratesReady: boolean,
 *   isEditor: boolean,
 *   local: string,
 *   display: string,
 *   onBlur: () => void,
 *   onChange: (e: import('react').ChangeEvent<HTMLInputElement>) => void,
 * }} props
 */
function CurrencyBlock({
  code,
  label,
  selected,
  onSelect,
  ratesReady,
  isEditor,
  local,
  display,
  onBlur,
  onChange,
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 transition ${
        selected
          ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
          : 'border-border bg-surface'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onSelect}
          className="min-w-0 flex-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <p className="font-dm-mono text-xs font-semibold uppercase tracking-wider text-ink-muted">
            {code}
          </p>
          <p className="font-dm-sans text-[11px] text-ink-faint">{label}</p>
        </button>
        <div className="min-w-0 flex-1 text-right">
          {isEditor && ratesReady ? (
            <input
              type="text"
              inputMode="decimal"
              aria-label={`Amount in ${code}`}
              value={local}
              onChange={onChange}
              onBlur={onBlur}
              className="font-dm-mono w-full max-w-[12rem] rounded-lg border border-border bg-canvas px-2 py-1.5 text-right text-lg font-medium tabular-nums text-ink outline-none focus:border-primary"
            />
          ) : (
            <button
              type="button"
              onClick={onSelect}
              className="font-dm-mono w-full max-w-[12rem] rounded-lg border border-transparent py-1.5 text-right text-lg font-medium tabular-nums text-ink outline-none hover:border-border focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              {ratesReady ? display : '—'}
            </button>
          )}
        </div>
      </div>
      <p className="font-dm-sans mt-2 text-[10px] text-ink-faint">
        {selected ? 'Editing · others update live' : 'Tap to edit this currency'}
      </p>
    </div>
  )
}
