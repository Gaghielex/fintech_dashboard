/**
 * @param {'AUD'|'JPY'|'USD'} active
 * @param {number} amount in active currency
 * @param {{ JPY: number, USD: number }} rates JPY & USD per 1 AUD
 */
export function recalcTriFromActive(active, amount, rates) {
  if (!rates?.JPY || !rates?.USD) {
    return { aud: 0, jpy: 0, usd: 0 }
  }
  const n = Number.isFinite(amount) ? amount : 0
  const { JPY, USD } = rates
  let aud
  let jpy
  let usd
  if (active === 'AUD') {
    aud = n
    jpy = aud * JPY
    usd = aud * USD
  } else if (active === 'JPY') {
    jpy = n
    aud = jpy / JPY
    usd = aud * USD
  } else {
    usd = n
    aud = usd / USD
    jpy = aud * JPY
  }
  return { aud, jpy, usd }
}
