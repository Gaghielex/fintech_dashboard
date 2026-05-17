import { useNavigation } from '../context/useNavigation.js'

const tabs = [
  { id: 'home', label: 'Home' },
  { id: 'accounts', label: 'Accounts' },
  { id: 'goals', label: 'Goals' },
  { id: 'convert', label: 'Convert' },
]

function IconHome({ active }) {
  const c = active ? 'var(--palette-primary)' : 'var(--palette-text-tertiary)'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke={c}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconAccounts({ active }) {
  const c = active ? 'var(--palette-primary)' : 'var(--palette-text-tertiary)'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 6.5h14v11H5v-11Z" stroke={c} strokeWidth="1.8" />
      <path d="M5 9.5h14M9 6.5V18" stroke={c} strokeWidth="1.8" />
    </svg>
  )
}

function IconGoals({ active }) {
  const c = active ? 'var(--palette-primary)' : 'var(--palette-text-tertiary)'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 18V6l7 4 7-4v12"
        stroke={c}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12 10v8" stroke={c} strokeWidth="1.8" />
    </svg>
  )
}

function IconConvert({ active }) {
  const c = active ? 'var(--palette-primary)' : 'var(--palette-text-tertiary)'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 10h10M7 10l2.5-2.5M17 14H7m10 0-2.5 2.5"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

const icons = { home: IconHome, accounts: IconAccounts, goals: IconGoals, convert: IconConvert }

export function SideNav() {
  const { tab, setTab, goToAccountsDefault } = useNavigation()

  return (
    <aside className="hidden lg:flex lg:w-56 lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:border-r lg:border-border lg:bg-surface/95 lg:backdrop-blur-md">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-border">
        <span className="font-syne text-base font-extrabold tracking-tight text-ink">
          Doggo Finance
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4" aria-label="Main">
        {tabs.map(({ id, label }) => {
          const active = tab === id
          const Icon = icons[id]
          const onActivate = () => {
            if (id === 'accounts') {
              goToAccountsDefault()
              return
            }
            setTab(/** @type {'home'|'accounts'|'goals'|'convert'} */ (id))
          }
          return (
            <button
              key={id}
              type="button"
              onClick={onActivate}
              aria-current={active ? 'page' : undefined}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left font-dm-sans text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/40 ${
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-ink-muted hover:bg-surface-1 hover:text-ink'
              }`}
            >
              <Icon active={active} />
              {label}
            </button>
          )
        })}
      </nav>

      {/* Household avatars */}
      <div className="flex items-center gap-2 px-5 py-4 border-t border-border">
        <span className="font-syne flex h-8 w-8 items-center justify-center rounded-full border-2 border-canvas bg-surface-1 text-xs font-bold text-primary">
          G
        </span>
        <span className="font-syne -ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-surface text-xs font-bold text-accent-pink">
          A
        </span>
        <span className="font-dm-sans ml-1 text-xs text-ink-muted">Household</span>
      </div>
    </aside>
  )
}
