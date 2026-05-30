import { formatGreetingDate } from '../../utils/formatCurrency.js'
import { JointAvatars } from './HouseholdVisuals.jsx'

export function HomeHeader() {
  const today = new Date()

  return (
    <header className="mb-5 flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <JointAvatars size="40" />
          <div className="flex flex-col leading-none">
            <span className="font-syne text-sm font-extrabold uppercase tracking-tight text-ink">
              DOGGO
            </span>
            <span className="font-syne text-sm font-semibold text-ink-muted tracking-[0.18em]">
              Finance
            </span>
          </div>
        </div>
        <h1 className="font-syne mt-2 text-2xl font-extrabold tracking-tight text-ink">
          Dashboard
        </h1>
        <p className="font-dm-sans mt-0.5 text-xs text-ink-muted">
          {formatGreetingDate(today)}
        </p>
      </div>
    </header>
  )
}
