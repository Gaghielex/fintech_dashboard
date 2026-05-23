import { useCallback, useMemo, useState } from 'react'
import { NavigationProvider } from '../context/NavigationProvider.jsx'
import { useNavigation } from '../context/useNavigation.js'
import { AppShell } from './AppShell.jsx'
import { SheetLoadError } from './SheetLoadError.jsx'
import { TabContentSkeleton } from './skeletons/TabContentSkeleton.jsx'
import { useSheetData } from '../hooks/useSheetData.js'
import { useFXRates } from '../hooks/useFXRates.js'
import { usePullToRefresh } from '../hooks/usePullToRefresh.js'
import { HomeTab } from '../pages/HomeTab.jsx'
import { AccountsTab } from '../pages/AccountsTab.jsx'
import { GoalsTab } from '../pages/GoalsTab.jsx'
import { ConvertTab } from '../pages/ConvertTab.jsx'

/**
 * Fixed indicator that appears at the top of the viewport on pull or while
 * refreshing. Rendered above all tabs so pull-to-refresh works everywhere.
 * @param {{ pullY: number, threshold: number, refreshing: boolean }} props
 */
function PullIndicator({ pullY, threshold, refreshing }) {
  const progress = Math.min(1, pullY / threshold)
  if (pullY < 2 && !refreshing) return null

  return (
    <div
      className="pointer-events-none fixed left-1/2 z-50"
      style={{
        top: 'calc(env(safe-area-inset-top, 0px) + 10px)',
        opacity: refreshing ? 1 : Math.min(1, progress * 1.6),
        transform: `translateX(-50%) translateY(${refreshing ? 0 : (1 - progress) * -18}px) scale(${refreshing ? 1 : 0.65 + progress * 0.35})`,
        transition: pullY === 0 && !refreshing ? 'opacity 0.25s ease-out, transform 0.25s ease-out' : 'none',
      }}
      aria-hidden
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/25">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="white"
          className={refreshing ? 'animate-spin' : ''}
          style={!refreshing ? { transform: `rotate(${progress * 360}deg)` } : undefined}
        >
          <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
        </svg>
      </div>
    </div>
  )
}

function DashboardBody({ sheet, fx, numbersVisible, onToggleNumbers }) {
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
          numbersVisible={numbersVisible}
          onToggleNumbers={onToggleNumbers}
          spreadsheetId={import.meta.env.VITE_SHEET_ID}
          sheetGids={sheet.data?.sheetGids}
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
  const refreshing = sheet.loading || fx.loading

  const onRefresh = useCallback(() => {
    sheet.refetch()
    fx.refetch()
  }, [sheet.refetch, fx.refetch])

  const ptr = usePullToRefresh({ onRefresh, disabled: refreshing })

  // Numbers are hidden on load and stay visible for the session (reset on reload/refresh)
  const [numbersVisible, setNumbersVisible] = useState(false)
  const onToggleNumbers = useCallback(() => setNumbersVisible((v) => !v), [])

  return (
    <NavigationProvider>
      <AppShell>
        <PullIndicator pullY={ptr.pullY} threshold={ptr.threshold} refreshing={refreshing} />
        <DashboardBody
          sheet={sheet}
          fx={fx}
          numbersVisible={numbersVisible}
          onToggleNumbers={onToggleNumbers}
        />
      </AppShell>
    </NavigationProvider>
  )
}
