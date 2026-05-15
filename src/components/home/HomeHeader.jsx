import { formatGreetingDate } from '../../utils/formatCurrency.js'

export function HomeHeader() {
  const today = new Date()

  return (
    <header className="mb-6 flex items-start justify-between gap-4">
      <div>
        <p className="font-dm-sans text-sm text-ink-muted">
          {formatGreetingDate(today)}
        </p>
        <h1 className="font-syne mt-1 text-2xl font-extrabold tracking-tight text-ink">
          Overview
        </h1>
      </div>
      <div
        className="flex shrink-0 items-center"
        aria-label="Household"
      >
        <span className="font-syne -mr-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-canvas bg-surface-1 text-sm font-bold text-primary">
          R
        </span>
        <span className="font-syne flex h-10 w-10 items-center justify-center rounded-full border-2 border-canvas bg-surface text-sm font-bold text-accent-gold">
          N
        </span>
      </div>
    </header>
  )
}
