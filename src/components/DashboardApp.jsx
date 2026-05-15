import { useMemo } from 'react'
import { NavigationProvider } from '../context/NavigationProvider.jsx'
import { useNavigation } from '../context/useNavigation.js'
import { AppShell } from './AppShell.jsx'
import { SheetLoadError } from './SheetLoadError.jsx'
import { TabContentSkeleton } from './skeletons/TabContentSkeleton.jsx'
import { useSheetData } from '../hooks/useSheetData.js'
import { useFXRates } from '../hooks/useFXRates.js'
import { HomeTab } from '../pages/HomeTab.jsx'
import { AccountsTab } from '../pages/AccountsTab.jsx'
import { GoalsTab } from '../pages/GoalsTab.jsx'
import { ConvertTab } from '../pages/ConvertTab.jsx'

function DashboardBody({ sheet, fx }) {
  const { tab } = useNavigation()

  const accounts = sheet.data?.accounts ?? []
  const settings = sheet.data?.settings ?? null
  const latestRates = fx.latest?.rates ?? null

  const blockingSheetError = Boolean(sheet.error && !sheet.data)
  const sheetInitialLoad = Boolean(sheet.loading && !sheet.data)

  const fxDateLabel = useMemo(() => {
    if (!fx.latest) return null
    const { date, rates } = fx.latest
    const j = rates.JPY.toFixed(2)
    const u = rates.USD.toFixed(4)
    return `1 AUD = ${j} JPY · ${u} USD · ${date}${fx.fromCache ? ' · cached rates' : ''}`
  }, [fx.latest, fx.fromCache])

  if (blockingSheetError) {
    return (
      <SheetLoadError
        message={sheet.error ?? 'Unknown error'}
        onRetry={sheet.refetch}
      />
    )
  }

  if (sheetInitialLoad) {
    return <TabContentSkeleton tab={tab} />
  }

  return (
    <>
      {tab === 'home' ? (
        <HomeTab
          accounts={accounts}
          settings={settings}
          latestRates={latestRates}
          fxDateLabel={fxDateLabel}
          fxFromCache={fx.fromCache}
          fxRatesCachedAt={fx.lastFetchAt}
        />
      ) : null}

      {tab === 'accounts' ? (
        <AccountsTab
          accounts={accounts}
          loading={sheet.loading}
          error={sheet.error}
          latestRates={latestRates}
          settings={settings}
          onRetryLoad={sheet.refetch}
          spreadsheetId={import.meta.env.VITE_SHEET_ID}
          sheetGids={sheet.data?.sheetGids}
        />
      ) : null}

      {tab === 'goals' ? (
        <GoalsTab
          goals={sheet.data?.goals ?? []}
          accounts={accounts}
          settings={settings}
          latestRates={latestRates}
          spreadsheetId={import.meta.env.VITE_SHEET_ID}
          sheetGids={sheet.data?.sheetGids}
        />
      ) : null}
      {tab === 'convert' ? (
        <ConvertTab
          accounts={accounts}
          settings={settings}
          latestRates={latestRates}
          fx={fx}
        />
      ) : null}
    </>
  )
}

export default function DashboardApp() {
  const sheet = useSheetData()
  const fx = useFXRates()

  return (
    <NavigationProvider>
      <AppShell>
        <DashboardBody sheet={sheet} fx={fx} />
      </AppShell>
    </NavigationProvider>
  )
}
