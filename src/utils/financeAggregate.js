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

/** Sheet account ids for Up Bank savers sub-toggles. */
export const UP_SAVERS_ACCOUNT_ID = 'au-up-02'
export const UP_SAVERS_GABS_ID    = 'au-up-03'

/**
 * @param {import('../types/sheetTypes.js').AccountRow} a
 */
export function isInLiquid(a) {
  if (isSuper(a) || isInactive(a)) return false
  const t = norm(a.type)
  const st = norm(a.status)
  if (t === 'cash' || t === 'transaction' || t === 'savings') {
    return st === 'active'
  }
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
 * Liquid AUD for Goals tab: all liquid accounts or a filtered set of Up saver accounts.
 * @param {import('../types/sheetTypes.js').AccountRow[]} accounts
 * @param {{ JPY: number, USD: number } | null} rates
 * @param {{ upSaversOnly?: boolean, upSaverIds?: string[] }} [opts]
 */
export function computeGoalsLiquidAud(accounts, rates, opts = {}) {
  const r = rates ?? { JPY: 0, USD: 0 }
  if (opts.upSaversOnly) {
    const ids = opts.upSaverIds ?? [UP_SAVERS_ACCOUNT_ID]
    if (ids.length === 0) return 0
    return ids.reduce((sum, id) => {
      const acc = accounts.find((a) => norm(a.id) === id)
      if (!acc) return sum
      return sum + convertToAud(Number(acc.balance) || 0, String(acc.currency), r)
    }, 0)
  }
  return sumAud(accounts, r, isInLiquid)
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
  const gabrielOwnAud = sumAud(
    accounts,
    r,
    (a) => norm(a.owner) === 'gabriel' && isInNetWorth(a),
  )
  const anaOwnAud = sumAud(
    accounts,
    r,
    (a) => norm(a.owner) === 'ana' && isInNetWorth(a),
  )
  const gabrielAud = gabrielOwnAud + jointAud
  const anaAud = anaOwnAud + jointAud

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
      gabrielAud,
      anaAud,
      jointAud,
    },
    globalLastUpdated,
    staleThresholdDays: staleDays,
  }
}
