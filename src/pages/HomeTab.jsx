import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { computeHomeMetrics } from '../utils/financeAggregate.js'
import { HomeHeader } from '../components/home/HomeHeader.jsx'
import { HomeHeroImage, HOME_HERO_SPACER, HomeHeroGlassLayer } from '../components/home/HomeHeroImage.jsx'
import { HomeHeroSection } from '../components/home/HomeHeroSection.jsx'
import { GeographySection } from '../components/home/GeographySection.jsx'
import { OwnershipSection } from '../components/home/OwnershipSection.jsx'
import { FreshnessBar } from '../components/home/FreshnessBar.jsx'
import { AddToHomeScreenBanner } from '../components/home/AddToHomeScreenBanner.jsx'

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
 *   fxFromCache: boolean,
 *   fxRatesCachedAt: string | null,
 * }} props
 */
export function HomeTab({
  accounts,
  settings,
  latestRates,
  fxDateLabel,
  fxFromCache,
  fxRatesCachedAt,
}) {
  const metrics = useMemo(
    () => computeHomeMetrics(accounts, settings, latestRates),
    [accounts, settings, latestRates],
  )

  const ratesReady = Boolean(
    latestRates && latestRates.JPY > 0 && latestRates.USD > 0,
  )

  return (
    <motion.div className="relative -mt-4 lg:-mt-8 flex min-h-[calc(100dvh-5.5rem)] flex-col lg:mt-0">
      <HomeHeroImage />

      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="shrink-0"
        style={{ height: HOME_HERO_SPACER }}
        aria-hidden
      />

      <HomeHeroGlassLayer>
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
          <HomeHeader />
        </motion.div>

        {!accounts.length ? (
          <p className="font-dm-sans mb-4 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink-muted">
            No account rows in the sheet yet. Balances below stay at zero until you add data.
          </p>
        ) : null}

        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
          <HomeHeroSection
            netWorthAud={metrics.netWorthAud}
            liquidAud={metrics.liquidAud}
            depositsAud={metrics.depositsAud}
            superAud={metrics.superAud}
            ratesReady={ratesReady}
          />
        </motion.div>

        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
          <GeographySection
            geography={metrics.geography}
            retirementAud={metrics.retirementAud}
            rates={latestRates ?? { JPY: 0, USD: 0 }}
            ratesReady={ratesReady}
          />
        </motion.div>

        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
          <OwnershipSection
            gabrielAud={metrics.ownership.gabrielAud}
            anaAud={metrics.ownership.anaAud}
            jointAud={metrics.ownership.jointAud}
            ratesReady={ratesReady}
          />
        </motion.div>

        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-auto space-y-4 pb-2"
        >
          {fxFromCache && ratesReady && fxRatesCachedAt ? (
            <p className="font-dm-sans rounded-lg border border-warning/50 bg-warning/10 px-3 py-2 text-sm text-warning">
              Rates as of{' '}
              {new Date(fxRatesCachedAt).toLocaleString('en-AU', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
              {' — '}
              could not refresh. Converted amounts may be stale.
            </p>
          ) : null}

          <AddToHomeScreenBanner />

          <FreshnessBar
            globalLastUpdated={metrics.globalLastUpdated}
            staleThresholdDays={metrics.staleThresholdDays}
            fxDateLabel={fxDateLabel}
          />
        </motion.div>
      </HomeHeroGlassLayer>
    </motion.div>
  )
}
