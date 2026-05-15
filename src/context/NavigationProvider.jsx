import { useCallback, useMemo, useState } from 'react'
import { NavigationContext } from './navigationContext.js'

/**
 * @typedef {{ country: 'AU'|'JP'|'EC'|null, owner: 'gabriel'|'ana'|'joint'|null, retirementOnly: boolean }} AccountsEntry
 */

const defaultEntry = /** @type {AccountsEntry} */ ({
  country: null,
  owner: null,
  retirementOnly: false,
})

export function NavigationProvider({ children }) {
  const [tab, setTabState] = useState(
    /** @type {'home'|'accounts'|'goals'|'convert'} */ ('home'),
  )
  const [accountsEntry, setAccountsEntry] = useState(
    /** @type {AccountsEntry} */ ({ ...defaultEntry }),
  )

  const setTab = useCallback((t) => {
    setTabState(t)
  }, [])

  const goToAccountsDefault = useCallback(() => {
    setAccountsEntry({ ...defaultEntry })
    setTabState('accounts')
  }, [])

  const goToAccountsByCountry = useCallback((c) => {
    setAccountsEntry({
      country: c,
      owner: null,
      retirementOnly: false,
    })
    setTabState('accounts')
  }, [])

  const goToAccountsByOwner = useCallback((o) => {
    setAccountsEntry({
      country: null,
      owner: o,
      retirementOnly: false,
    })
    setTabState('accounts')
  }, [])

  const goToAccountsRetirement = useCallback(() => {
    setAccountsEntry({
      country: null,
      owner: null,
      retirementOnly: true,
    })
    setTabState('accounts')
  }, [])

  const value = useMemo(
    () => ({
      tab,
      accountsEntry,
      setTab,
      goToAccountsDefault,
      goToAccountsByCountry,
      goToAccountsByOwner,
      goToAccountsRetirement,
    }),
    [
      tab,
      accountsEntry,
      setTab,
      goToAccountsDefault,
      goToAccountsByCountry,
      goToAccountsByOwner,
      goToAccountsRetirement,
    ],
  )

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}
