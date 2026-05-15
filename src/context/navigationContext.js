import { createContext } from 'react'

/**
 * @typedef {'home' | 'accounts' | 'goals' | 'convert'} AppTab
 */

/**
 * @typedef {Object} AccountsEntry
 * @property {'AU'|'JP'|'EC'|null} country
 * @property {'gabriel'|'ana'|'joint'|null} owner
 * @property {boolean} retirementOnly
 */

/** @type {React.Context<null | { tab: AppTab, accountsEntry: AccountsEntry, setTab: (t: AppTab) => void, goToAccountsDefault: () => void, goToAccountsByCountry: (c: 'AU'|'JP'|'EC') => void, goToAccountsByOwner: (o: 'gabriel'|'ana'|'joint') => void, goToAccountsRetirement: () => void }>} */
export const NavigationContext = createContext(null)
