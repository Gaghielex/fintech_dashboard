import { formatGreetingDate } from '../../utils/formatCurrency.js'
import { JointAvatars } from './HouseholdVisuals.jsx'

export function HomeHeader() {
  const today = new Date()

  return (
    <header className="mb-5 flex items-start justify-between gap-4 pt-1">
      <div>
        <p className="font-dm-sans text-sm text-ink-muted">
          {formatGreetingDate(today)}
        </p>
        <h1 className="font-syne mt-1 text-[calc(1.5rem-2pt)] font-extrabold tracking-tight text-ink">
          Overview
        </h1>
      </div>
      <div className="flex shrink-0 items-center" aria-label="Household">
        <JointAvatars size="56" />
      </div>
    </header>
  )
}
