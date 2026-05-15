import { GeographyTile } from './GeographyTile.jsx'
import { useNavigation } from '../../context/useNavigation.js'

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
      <h2 className="font-syne mb-3 text-lg font-bold text-ink">Where it lives</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <GeographyTile
          title="Australia"
          subtitle="Cash & deposits"
          regionNative="AUD"
          totalAud={geography.AU.totalAud}
          rates={rates}
          ratesReady={ratesReady}
          onNavigate={() => goToAccountsByCountry('AU')}
        />
        <GeographyTile
          title="Japan"
          subtitle="Cash & deposits"
          regionNative="JPY"
          totalAud={geography.JP.totalAud}
          rates={rates}
          ratesReady={ratesReady}
          onNavigate={() => goToAccountsByCountry('JP')}
        />
        <GeographyTile
          title="Ecuador"
          subtitle="Cash & deposits"
          regionNative="USD"
          totalAud={geography.EC.totalAud}
          rates={rates}
          ratesReady={ratesReady}
          onNavigate={() => goToAccountsByCountry('EC')}
        />
        <GeographyTile
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
