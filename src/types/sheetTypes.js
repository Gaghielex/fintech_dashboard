/**
 * @typedef {'AU' | 'JP' | 'EC'} CountryCode
 */

/**
 * @typedef {'AUD' | 'JPY' | 'USD' | 'EUR'} CurrencyCode
 */

/**
 * @typedef {'cash' | 'transaction' | 'savings' | 'term_deposit' | 'super' | 'other'} AccountType
 */

/**
 * @typedef {'gabriel' | 'ana' | 'joint'} OwnerCode
 */

/**
 * @typedef {'active' | 'matured' | 'pending_renewal' | 'inactive'} AccountStatus
 */

/**
 * @typedef {Object} AccountRow
 * @property {string} id
 * @property {string} account_name
 * @property {string} bank
 * @property {CountryCode | string} country
 * @property {CurrencyCode | string} currency
 * @property {AccountType | string} type
 * @property {OwnerCode | string} owner
 * @property {number} balance
 * @property {number | null} interest_rate
 * @property {AccountStatus | string} status
 * @property {string | null} maturity_date
 * @property {string | null} last_updated
 * @property {string | null} notes
 * @property {string | null} icon_url
 */

/**
 * @typedef {'teal' | 'gold'} GoalAccent
 */

/**
 * @typedef {Object} GoalRow
 * @property {string} id
 * @property {string} goal_name
 * @property {string | null} subtitle
 * @property {number} target_amount_aud
 * @property {string | null} due_date
 * @property {string | null} start_date
 * @property {GoalAccent | string} accent
 * @property {string | null} notes
 * @property {string | null} icon_url
 */

/**
 * @typedef {Object} NetWorthSnapshotRow
 * @property {string | null} date
 * @property {number | null} total_aud
 * @property {number | null} liquid_aud
 * @property {number | null} deposits_aud
 */

/**
 * @typedef {Object} FxSnapshotRow
 * @property {string | null} date
 * @property {number | null} jpy_aud
 * @property {number | null} usd_aud
 */

/**
 * @typedef {Object} SettingsRow
 * @property {string | null} base_currency
 * @property {number | null} stale_threshold_days
 * @property {number | null} low_balance_threshold_aud
 */

/**
 * @typedef {Object} ParsedSheetBundle
 * @property {AccountRow[]} accounts
 * @property {GoalRow[]} goals
 * @property {FxSnapshotRow[]} fxSnapshots
 * @property {NetWorthSnapshotRow[]} netWorthSnapshots
 * @property {SettingsRow | null} settings
 * @property {Record<string, string[][]>} rawTabs
 * @property {string[]} tabOrder
 * @property {Record<string, number>} sheetGids — Google `sheetId` per tab title (for edit URLs)
 */

export {}
