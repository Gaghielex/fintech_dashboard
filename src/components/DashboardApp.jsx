import { useMemo } from 'react'
import { NavigationProvider } from '../context/NavigationProvider.jsx'
import { useNavigation } from '../context/useNavigation.js'
import { AppShell } from './AppShell.jsx'
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

  const fxDateLabel = useMemo(() => {
    if (!fx.latest) return null
    const { date, rates } = fx.latest
    const j = rates.JPY.toFixed(2)
    const u = rates.USD.toFixed(4)
    return `1 AUD = ${j} JPY · ${u} USD · ${date}${fx.fromCache ? ' · cached rates' : ''}`
  }, [fx.latest, fx.fromCache])

  return (
    <>
      {sheet.error ? (
        <div className="mb-4 rounded-lg border border-negative/40 bg-negative/10 px-3 py-2 font-dm-sans text-sm text-negative">
          {sheet.error}
        </div>
      ) : null}

      {tab === 'home' ? (
        <HomeTab
          accounts={accounts}
          settings={settings}
          latestRates={latestRates}
          fxDateLabel={fxDateLabel}
          sheetLoading={sheet.loading}
        />
      ) : null}

      {tab === 'accounts' ? (
        <AccountsTab
          accounts={accounts}
          loading={sheet.loading}
          error={sheet.error}
          latestRates={latestRates}
          settings={settings}
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
          loading={sheet.loading}
        />
      ) : null}
      {tab === 'convert' ? <ConvertTab /> : null}
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
