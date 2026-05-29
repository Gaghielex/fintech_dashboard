import { normalizeSheetHeader } from './normalizeSheetHeader.js'
import {
  parseDateCell,
  parseNumberCell,
  parseStringCell,
} from './cellCoercion.js'

/**
 * @param {string[][]} rows
 * @returns {Record<string, string | number | null>[]}
 */
function rowsToRecordObjects(rows) {
  if (!rows?.length) return []
  const headerCells = rows[0] ?? []
  const keys = headerCells.map(normalizeSheetHeader)
  const out = []
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r] ?? []
    /** @type {Record<string, string | number | null>} */
    const obj = {}
    let has = false
    for (let c = 0; c < keys.length; c++) {
      const key = keys[c]
      if (!key) continue
      const raw = row[c]
      if (raw !== undefined && raw !== null && String(raw).trim() !== '') {
        has = true
      }
      obj[key] = raw === undefined || raw === null ? '' : raw
    }
    if (has) out.push(obj)
  }
  return out
}

/**
 * @param {Record<string, unknown>} raw
 */
function coerceAccount(raw) {
  return {
    id: parseStringCell(raw.id) ?? '',
    account_name: parseStringCell(raw.account_name) ?? '',
    bank: parseStringCell(raw.bank) ?? '',
    country: parseStringCell(raw.country) ?? '',
    currency: parseStringCell(raw.currency) ?? '',
    type: parseStringCell(raw.type) ?? '',
    owner: parseStringCell(raw.owner) ?? '',
    balance: parseNumberCell(raw.balance) ?? 0,
    interest_rate: parseNumberCell(raw.interest_rate),
    status: parseStringCell(raw.status) ?? '',
    maturity_date: parseDateCell(raw.maturity_date),
    last_updated: parseDateCell(raw.last_updated),
    notes: parseStringCell(raw.notes),
    icon_url: parseStringCell(raw.icon_url) ?? null,
  }
}

/**
 * @param {Record<string, unknown>} raw
 */
function coerceGoal(raw) {
  return {
    id: parseStringCell(raw.id) ?? '',
    goal_name: parseStringCell(raw.goal_name) ?? '',
    subtitle: parseStringCell(raw.subtitle),
    target_amount_aud: parseNumberCell(raw.target_amount_aud) ?? 0,
    due_date: parseDateCell(raw.due_date),
    start_date: parseDateCell(raw.start_date),
    accent: parseStringCell(raw.accent) ?? '',
    notes: parseStringCell(raw.notes),
    icon_url: parseStringCell(raw.icon_url) ?? null,
  }
}

/**
 * @param {Record<string, unknown>} raw
 */
function coerceFxSnapshot(raw) {
  return {
    date: parseDateCell(raw.date),
    jpy_aud: parseNumberCell(raw.jpy_aud),
    usd_aud: parseNumberCell(raw.usd_aud),
  }
}

/**
 * @param {Record<string, unknown>} raw
 */
function coerceNetWorthSnapshot(raw) {
  return {
    date: parseDateCell(raw.date),
    total_aud: parseNumberCell(raw.total_aud),
    liquid_aud: parseNumberCell(raw.liquid_aud),
    deposits_aud: parseNumberCell(raw.deposits_aud),
  }
}

/**
 * @param {Record<string, unknown>} raw
 */
function coerceSettings(raw) {
  return {
    base_currency: parseStringCell(raw.base_currency),
    stale_threshold_days: parseNumberCell(raw.stale_threshold_days),
    low_balance_threshold_aud: parseNumberCell(raw.low_balance_threshold_aud),
  }
}

/**
 * @param {string} tabTitle
 * @param {string[][]} rows
 */
export function parseTabByTitle(tabTitle, rows) {
  const key = tabTitle.trim().toLowerCase()
  const records = rowsToRecordObjects(rows)

  if (key === 'accounts') {
    return { kind: 'accounts', data: records.map(coerceAccount) }
  }
  if (key === 'goals') {
    return { kind: 'goals', data: records.map(coerceGoal) }
  }
  if (key === 'snapshots') {
    return { kind: 'net_worth_snapshots', data: records.map(coerceNetWorthSnapshot) }
  }
  if (key === 'fx snapshots' || key === 'fx_snapshots') {
    return { kind: 'fx_snapshots', data: records.map(coerceFxSnapshot) }
  }
  if (key === 'settings') {
    if (!records.length) return { kind: 'settings', data: null }
    /** @type {import('../types/sheetTypes.js').SettingsRow} */
    const merged = {
      base_currency: null,
      stale_threshold_days: null,
      low_balance_threshold_aud: null,
    }
    for (const row of records) {
      const c = coerceSettings(row)
      if (c.base_currency != null) merged.base_currency = c.base_currency
      if (c.stale_threshold_days != null)
        merged.stale_threshold_days = c.stale_threshold_days
      if (c.low_balance_threshold_aud != null)
        merged.low_balance_threshold_aud = c.low_balance_threshold_aud
    }
    const hasAny =
      merged.base_currency != null ||
      merged.stale_threshold_days != null ||
      merged.low_balance_threshold_aud != null
    return { kind: 'settings', data: hasAny ? merged : null }
  }
  return { kind: 'unknown', data: rows }
}

/**
 * @param {string[]} tabOrder
 * @param {Record<string, string[][]>} titleToRows
 * @param {Record<string, number>} [sheetGids]
 */
export function buildParsedBundle(tabOrder, titleToRows, sheetGids = {}) {
  /** @type {import('../types/sheetTypes.js').AccountRow[]} */
  const accounts = []
  /** @type {import('../types/sheetTypes.js').GoalRow[]} */
  const goals = []
  /** @type {import('../types/sheetTypes.js').FxSnapshotRow[]} */
  const fxSnapshots = []
  /** @type {import('../types/sheetTypes.js').NetWorthSnapshotRow[]} */
  const netWorthSnapshots = []
  /** @type {import('../types/sheetTypes.js').SettingsRow | null} */
  let settings = null
  /** @type {Record<string, string[][]>} */
  const rawTabs = {}

  for (const title of tabOrder) {
    const rows = titleToRows[title] ?? []
    const parsed = parseTabByTitle(title, rows)
    if (parsed.kind === 'accounts') {
      accounts.push(...parsed.data)
    } else if (parsed.kind === 'goals') {
      goals.push(...parsed.data)
    } else if (parsed.kind === 'fx_snapshots') {
      fxSnapshots.push(...parsed.data)
    } else if (parsed.kind === 'net_worth_snapshots') {
      netWorthSnapshots.push(...parsed.data)
    } else if (parsed.kind === 'settings') {
      settings = parsed.data
    } else {
      rawTabs[title] = rows
    }
  }

  return {
    accounts,
    goals,
    fxSnapshots,
    netWorthSnapshots,
    settings,
    rawTabs,
    tabOrder: [...tabOrder],
    sheetGids: { ...sheetGids },
  }
}
