/**
 * @typedef {'AU' | 'JP' | 'EC'} CountryCode
 */

/**
 * @typedef {'AUD' | 'JPY' | 'USD'} CurrencyCode
 */

/**
 * @typedef {'transaction' | 'savings' | 'term_deposit' | 'super' | 'other'} AccountType
 */

/**
 * @typedef {'rodrigo' | 'nat' | 'joint'} OwnerCode
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
 * @property {SettingsRow | null} settings
 * @property {Record<string, string[][]>} rawTabs
 * @property {string[]} tabOrder
 */

export {}
