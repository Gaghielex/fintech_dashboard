import { convertToAud } from './currencyConvert.js'

/**
 * @param {unknown} s
 */
function norm(s) {
  return String(s ?? '')
    .trim()
    .toLowerCase()
}

/**
 * @param {import('../types/sheetTypes.js').AccountRow} a
 */
function isSuper(a) {
  return norm(a.type) === 'super'
}

/**
 * @param {import('../types/sheetTypes.js').AccountRow} a
 */
function isInactive(a) {
  return norm(a.status) === 'inactive'
}

/**
 * Net worth includes all typed rows (PRD: inactive still counts toward NW).
 * @param {import('../types/sheetTypes.js').AccountRow} a
 */
export function isInNetWorth(a) {
  return Boolean(norm(a.type))
}

/**
 * @param {import('../types/sheetTypes.js').AccountRow} a
 */
export function isInLiquid(a) {
  if (isSuper(a) || isInactive(a)) return false
  const t = norm(a.type)
  const st = norm(a.status)
  if (t === 'transaction' || t === 'savings') return st === 'active'
  if (t === 'term_deposit') {
    return st === 'matured' || st === 'pending_renewal'
  }
  return false
}

/**
 * @param {import('../types/sheetTypes.js').AccountRow} a
 */
export function isInDeposits(a) {
  if (isSuper(a) || isInactive(a)) return false
  const t = norm(a.type)
  const st = norm(a.status)
  return t === 'term_deposit' && st === 'active'
}

/**
 * @param {import('../types/sheetTypes.js').AccountRow} a
 */
export function isInSuper(a) {
  return isSuper(a) && isInNetWorth(a)
}

/**
 * @param {import('../types/sheetTypes.js').AccountRow[]} accounts
 * @param {{ JPY: number, USD: number }} rates
 * @param {(a: import('../types/sheetTypes.js').AccountRow) => boolean} predicate
 */
function sumAud(accounts, rates, predicate) {
  let t = 0
  for (const a of accounts) {
    if (!predicate(a)) continue
    t += convertToAud(Number(a.balance) || 0, String(a.currency), rates)
  }
  return t
}

/**
 * @param {import('../types/sheetTypes.js').AccountRow[]} accounts
 * @param {'AU'|'JP'|'EC'} country
 */
function countryNonSuper(accounts, country) {
  return accounts.filter(
    (a) => norm(a.country) === country.toLowerCase() && !isSuper(a),
  )
}

/**
 * @param {import('../types/sheetTypes.js').AccountRow[]} accounts
 * @param {import('../types/sheetTypes.js').SettingsRow | null} settings
 * @param {{ JPY: number, USD: number } | null} rates
 */
export function computeHomeMetrics(accounts, settings, rates) {
  const r = rates ?? { JPY: 0, USD: 0 }
  const netWorthAud = sumAud(accounts, r, isInNetWorth)
  const liquidAud = sumAud(accounts, r, isInLiquid)
  const depositsAud = sumAud(accounts, r, isInDeposits)
  const superAud = sumAud(accounts, r, isInSuper)

  const auAud = sumAud(countryNonSuper(accounts, 'AU'), r, () => true)
  const jpAud = sumAud(countryNonSuper(accounts, 'JP'), r, () => true)
  const ecAud = sumAud(countryNonSuper(accounts, 'EC'), r, () => true)

  const jointAud = sumAud(
    accounts,
    r,
    (a) => norm(a.owner) === 'joint' && isInNetWorth(a),
  )
  const rodrigoOwnAud = sumAud(
    accounts,
    r,
    (a) => norm(a.owner) === 'rodrigo' && isInNetWorth(a),
  )
  const natOwnAud = sumAud(
    accounts,
    r,
    (a) => norm(a.owner) === 'nat' && isInNetWorth(a),
  )
  const rodrigoAud = rodrigoOwnAud + jointAud
  const natAud = natOwnAud + jointAud

  /** @type {string | null} */
  let globalLastUpdated = null
  for (const a of accounts) {
    if (!a.last_updated) continue
    const d = new Date(a.last_updated)
    if (Number.isNaN(d.getTime())) continue
    if (!globalLastUpdated || d > new Date(globalLastUpdated)) {
      globalLastUpdated = a.last_updated
    }
  }

  const staleDays =
    settings?.stale_threshold_days != null &&
    Number.isFinite(settings.stale_threshold_days)
      ? settings.stale_threshold_days
      : 30

  return {
    netWorthAud,
    liquidAud,
    depositsAud,
    superAud,
    geography: {
      AU: { totalAud: auAud, native: 'AUD' },
      JP: { totalAud: jpAud, native: 'JPY' },
      EC: { totalAud: ecAud, native: 'USD' },
    },
    retirementAud: superAud,
    ownership: {
      rodrigoAud,
      natAud,
      jointAud,
    },
    globalLastUpdated,
    staleThresholdDays: staleDays,
  }
}
