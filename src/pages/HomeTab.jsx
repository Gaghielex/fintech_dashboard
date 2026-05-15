import { useMemo } from 'react'
import { computeHomeMetrics } from '../utils/financeAggregate.js'
import { HomeHeader } from '../components/home/HomeHeader.jsx'
import { IllustrationPlaceholder } from '../components/home/IllustrationPlaceholder.jsx'
import { HomeHeroSection } from '../components/home/HomeHeroSection.jsx'
import { GeographySection } from '../components/home/GeographySection.jsx'
import { OwnershipSection } from '../components/home/OwnershipSection.jsx'
import { FreshnessBar } from '../components/home/FreshnessBar.jsx'

/**
 * @param {{
 *   accounts: import('../types/sheetTypes.js').AccountRow[],
 *   settings: import('../types/sheetTypes.js').SettingsRow | null,
 *   latestRates: { JPY: number, USD: number } | null,
 *   fxDateLabel: string | null,
 *   sheetLoading: boolean,
 * }} props
 */
export function HomeTab({
  accounts,
  settings,
  latestRates,
  fxDateLabel,
  sheetLoading,
}) {
  const metrics = useMemo(
    () => computeHomeMetrics(accounts, settings, latestRates),
    [accounts, settings, latestRates],
  )

  const ratesReady = Boolean(
    latestRates && latestRates.JPY > 0 && latestRates.USD > 0,
  )

  return (
    <div className="flex min-h-[calc(100dvh-5.5rem)] flex-col">
      <HomeHeader />
      <IllustrationPlaceholder />

      {sheetLoading ? (
        <p className="font-dm-mono mb-6 text-sm text-ink-muted">
          Loading sheet…
        </p>
      ) : null}

      <HomeHeroSection
        netWorthAud={metrics.netWorthAud}
        liquidAud={metrics.liquidAud}
        depositsAud={metrics.depositsAud}
        superAud={metrics.superAud}
        ratesReady={ratesReady}
      />

      <GeographySection
        geography={metrics.geography}
        retirementAud={metrics.retirementAud}
        rates={latestRates ?? { JPY: 0, USD: 0 }}
        ratesReady={ratesReady}
      />

      <OwnershipSection
        gabrielAud={metrics.ownership.gabrielAud}
        anaAud={metrics.ownership.anaAud}
        jointAud={metrics.ownership.jointAud}
        ratesReady={ratesReady}
      />

      <FreshnessBar
        globalLastUpdated={metrics.globalLastUpdated}
        staleThresholdDays={metrics.staleThresholdDays}
        fxDateLabel={fxDateLabel}
      />
    </div>
  )
}
