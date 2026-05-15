import { GeographyTile } from './GeographyTile.jsx'
import { GEO_FLAGS } from './geographyFlags.js'
import { useNavigation } from '../../context/useNavigation.js'
import { HOME_SECTION_TITLE_CLASS } from './sectionTitle.js'

/**
 * @param {{
 *   geography: {
 *     AU: { totalAud: number, native: string },
 *     JP: { totalAud: number, native: string },
 *     EC: { totalAud: number, native: string },
 *   },
 *   retirementAud: number,
 *   rates: { JPY: number, USD: number },
 *   ratesReady: boolean,
 * }} props
 */
export function GeographySection({
  geography,
  retirementAud,
  rates,
  ratesReady,
}) {
  const {
    goToAccountsByCountry,
    goToAccountsRetirement,
  } = useNavigation()

  return (
    <section className="mb-8">
      <h2 className={HOME_SECTION_TITLE_CLASS}>Where is our money?</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <GeographyTile
          flag={GEO_FLAGS.AU}
          title="Australia"
          subtitle="Cash & deposits"
          regionNative="AUD"
          totalAud={geography.AU.totalAud}
          rates={rates}
          ratesReady={ratesReady}
          onNavigate={() => goToAccountsByCountry('AU')}
        />
        <GeographyTile
          flag={GEO_FLAGS.JP}
          title="Japan"
          subtitle="Cash & deposits"
          regionNative="JPY"
          totalAud={geography.JP.totalAud}
          rates={rates}
          ratesReady={ratesReady}
          onNavigate={() => goToAccountsByCountry('JP')}
        />
        <GeographyTile
          flag={GEO_FLAGS.EC}
          title="Ecuador"
          subtitle="Cash & deposits"
          regionNative="USD"
          totalAud={geography.EC.totalAud}
          rates={rates}
          ratesReady={ratesReady}
          onNavigate={() => goToAccountsByCountry('EC')}
        />
        <GeographyTile
          flag={GEO_FLAGS.retirement}
          title="Retirement"
          subtitle="Superannuation"
          regionNative="AUD"
          totalAud={retirementAud}
          rates={rates}
          ratesReady={ratesReady}
          onNavigate={goToAccountsRetirement}
          variant="retirement"
        />
      </div>
    </section>
  )
}
