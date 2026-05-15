/**
 * @param {number} amount
 * @param {string} currency AUD | JPY | USD
 * @param {{ maxFractionDigits?: number, minFractionDigits?: number }} [opts]
 */
export function formatMoney(amount, currency, opts = {}) {
  const ccy = String(currency || 'AUD').toUpperCase()
  const max =
    opts.maxFractionDigits ??
    (ccy === 'JPY' ? 0 : ccy === 'USD' ? 2 : 0)
  const min = opts.minFractionDigits ?? 0
  try {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: ccy,
      currencyDisplay: 'code',
      maximumFractionDigits: max,
      minimumFractionDigits: min,
    }).format(Number(amount) || 0)
  } catch {
    return `${(Number(amount) || 0).toFixed(2)} ${ccy}`
  }
}

/**
 * @param {Date} d
 */
export function formatGreetingDate(d) {
  return new Intl.DateTimeFormat('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}
