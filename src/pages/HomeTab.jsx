import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { computeHomeMetrics } from '../utils/financeAggregate.js'
import { HomeHeader } from '../components/home/HomeHeader.jsx'
import { IllustrationPlaceholder } from '../components/home/IllustrationPlaceholder.jsx'
import { HomeHeroSection } from '../components/home/HomeHeroSection.jsx'
import { GeographySection } from '../components/home/GeographySection.jsx'
import { OwnershipSection } from '../components/home/OwnershipSection.jsx'
import { FreshnessBar } from '../components/home/FreshnessBar.jsx'

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.33, 1, 0.68, 1], delay: i * 0.08 },
  }),
}

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

      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
        <IllustrationPlaceholder />
      </motion.div>

      {sheetLoading ? (
        <p className="font-dm-mono mb-6 text-sm text-ink-muted">
          Loading sheet…
        </p>
      ) : null}

      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
        <HomeHeroSection
          netWorthAud={metrics.netWorthAud}
          liquidAud={metrics.liquidAud}
          depositsAud={metrics.depositsAud}
          superAud={metrics.superAud}
          ratesReady={ratesReady}
        />
      </motion.div>

      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
        <GeographySection
          geography={metrics.geography}
          retirementAud={metrics.retirementAud}
          rates={latestRates ?? { JPY: 0, USD: 0 }}
          ratesReady={ratesReady}
        />
      </motion.div>

      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
        <OwnershipSection
          gabrielAud={metrics.ownership.gabrielAud}
          anaAud={metrics.ownership.anaAud}
          jointAud={metrics.ownership.jointAud}
          ratesReady={ratesReady}
        />
      </motion.div>

      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
        <FreshnessBar
          globalLastUpdated={metrics.globalLastUpdated}
          staleThresholdDays={metrics.staleThresholdDays}
          fxDateLabel={fxDateLabel}
        />
      </motion.div>
    </div>
  )
}
