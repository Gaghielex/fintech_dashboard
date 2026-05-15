import { computeHomeMetrics } from './financeAggregate.js'
import { convertFromAud } from './currencyConvert.js'

/**
 * Japan / Ecuador totals for Convert shortcuts (same AUD geography totals as Home, expressed in native FX).
 * @param {import('../types/sheetTypes.js').AccountRow[]} accounts
 * @param {import('../types/sheetTypes.js').SettingsRow | null} settings
 * @param {{ JPY: number, USD: number } | null} rates
 */
export function getConvertShortcutAmounts(accounts, settings, rates) {
  if (!rates?.JPY || !rates?.USD) {
    return { japanJpy: null, ecuadorUsd: null }
  }
  const m = computeHomeMetrics(accounts, settings, rates)
  const japanJpy = Math.round(
    convertFromAud(m.geography.JP.totalAud, 'JPY', rates),
  )
  const ecuadorUsd =
    Math.round(convertFromAud(m.geography.EC.totalAud, 'USD', rates) * 100) /
    100
  return { japanJpy, ecuadorUsd }
}
