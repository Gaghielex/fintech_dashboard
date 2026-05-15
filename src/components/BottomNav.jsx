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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 6.5h14v11H5v-11Z"
        stroke={c}
        strokeWidth="1.8"
      />
      <path
        d="M5 9.5h14M9 6.5V18"
        stroke={c}
        strokeWidth="1.8"
      />
    </svg>
  )
}

function IconGoals({ active }) {
  const c = active ? 'var(--palette-primary)' : 'var(--palette-text-tertiary)'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 18V6l7 4 7-4v12"
        stroke={c}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12 10v8"
        stroke={c}
        strokeWidth="1.8"
      />
    </svg>
  )
}

function IconConvert({ active }) {
  const c = active ? 'var(--palette-primary)' : 'var(--palette-text-tertiary)'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 10h10M7 10l2.5-2.5M17 14H7m10 0-2.5 2.5"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

const icons = {
  home: IconHome,
  accounts: IconAccounts,
  goals: IconGoals,
  convert: IconConvert,
}

export function BottomNav() {
  const { tab, setTab, goToAccountsDefault } = useNavigation()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md lg:hidden"
      aria-label="Main"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2">
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
              className="flex min-w-[4.25rem] flex-1 flex-col items-center gap-1 rounded-lg py-1.5 font-dm-sans text-[10px] font-medium text-ink-muted outline-none ring-primary/30 focus-visible:ring-2"
              aria-current={active ? 'page' : undefined}
            >
              <span
                className="h-0.5 w-6 rounded-full"
                style={{
                  backgroundColor: active
                    ? 'var(--palette-primary)'
                    : 'transparent',
                }}
                aria-hidden
              />
              <Icon active={active} />
              <span className={active ? 'text-primary' : 'text-ink-faint'}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
