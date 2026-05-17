/**
 * Frankfurter `latest` shape: JPY, USD, and EUR **per 1 AUD**.
 * @typedef {{ JPY: number, USD: number, EUR: number }} AudQuoteRates
 */

/**
 * @param {number} amount
 * @param {string} currency
 * @param {AudQuoteRates} rates
 */
export function convertToAud(amount, currency, rates) {
  const ccy = String(currency || 'AUD').toUpperCase()
  if (!Number.isFinite(amount)) return 0
  if (!rates?.JPY || !rates?.USD) return 0
  if (ccy === 'AUD') return amount
  if (ccy === 'JPY') return amount / rates.JPY
  if (ccy === 'USD') return amount / rates.USD
  if (ccy === 'EUR') return rates.EUR > 0 ? amount / rates.EUR : 0
  return amount
}

/**
 * @param {number} amountAud
 * @param {string} currency
 * @param {AudQuoteRates} rates
 */
export function convertFromAud(amountAud, currency, rates) {
  const ccy = String(currency || 'AUD').toUpperCase()
  if (!Number.isFinite(amountAud)) return 0
  if (!rates?.JPY || !rates?.USD) return 0
  if (ccy === 'AUD') return amountAud
  if (ccy === 'JPY') return amountAud * rates.JPY
  if (ccy === 'USD') return amountAud * rates.USD
  if (ccy === 'EUR') return amountAud * rates.EUR
  return amountAud
}

/**
 * @param {number} amount
 * @param {string} fromCurrency
 * @param {string} toCurrency
 * @param {AudQuoteRates} rates
 */
export function convertCross(amount, fromCurrency, toCurrency, rates) {
  const aud = convertToAud(amount, fromCurrency, rates)
  return convertFromAud(aud, toCurrency, rates)
}

/**
 * Tap-to-cycle order (PRD): JPY tiles JPY→AUD→USD; AUD tiles AUD→JPY→USD.
 * @param {string} regionNative
 * @returns {('AUD' | 'JPY' | 'USD')[]}
 */
export function getTapCycleCurrencies(regionNative) {
  const c = String(regionNative || 'AUD').toUpperCase()
  if (c === 'JPY') return ['JPY', 'AUD', 'USD']
  if (c === 'AUD') return ['AUD', 'JPY', 'USD']
  if (c === 'USD') return ['USD', 'AUD', 'JPY']
  return ['AUD', 'JPY', 'USD']
}
