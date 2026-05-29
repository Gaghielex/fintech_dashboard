import { motion } from 'framer-motion'
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
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style={{ color: c }} aria-hidden>
      <path fill="currentColor" fillRule="evenodd" d="M11.415 2.395a2 2 0 0 1 1.17 0l2.986.918a16.7 16.7 0 0 1 4.39 2.089c1.054.705.555 2.348-.713 2.348H4.752c-1.268 0-1.767-1.643-.714-2.348a16.7 16.7 0 0 1 4.391-2.09zm.73 1.434a.5.5 0 0 0-.29 0l-2.985.918A15.2 15.2 0 0 0 5.5 6.25h13a15.2 15.2 0 0 0-3.37-1.503z" clipRule="evenodd" />
      <path fill="currentColor" d="M4.25 21a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75m2-4a.75.75 0 0 0 1.5 0v-6a.75.75 0 0 0-1.5 0zm5.75.75a.75.75 0 0 1-.75-.75v-6a.75.75 0 0 1 1.5 0v6a.75.75 0 0 1-.75.75m4.25-.75a.75.75 0 0 0 1.5 0v-6a.75.75 0 0 0-1.5 0z" />
    </svg>
  )
}

function IconGoals({ active }) {
  const c = active ? 'var(--palette-primary)' : 'var(--palette-text-tertiary)'
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" style={{ color: c }} aria-hidden>
      <g fill="none">
        <path stroke="currentColor" strokeLinejoin="round" strokeWidth="4" d="M14.054 9.644a9 9 0 0 1 1.414 1.845a15.95 15.95 0 0 1 8.483-2.426c3.146 0 6.08.906 8.555 2.471c.4-.691.886-1.337 1.44-1.89c2.521-2.516 6.946-3.624 8.991-1.583c2.045 2.04.934 6.456-1.587 8.972a9.4 9.4 0 0 1-2.638 1.824a15.9 15.9 0 0 1 1.24 6.175c0 8.819-7.164 15.968-16 15.968C15.113 41 7.95 33.85 7.95 25.032c0-2.204.447-4.304 1.256-6.214a9.3 9.3 0 0 1-2.556-1.785c-2.522-2.516-3.632-6.932-1.587-8.972s6.47-.933 8.99 1.583Z" />
        <ellipse cx="24" cy="29" stroke="currentColor" strokeWidth="4" rx="8" ry="7" />
        <circle cx="17" cy="18" r="2" fill="currentColor" />
        <circle cx="21" cy="29" r="2" fill="currentColor" />
        <circle cx="31" cy="18" r="2" fill="currentColor" />
        <circle cx="27" cy="29" r="2" fill="currentColor" />
      </g>
    </svg>
  )
}

function IconConvert({ active }) {
  const c = active ? 'var(--palette-primary)' : 'var(--palette-text-tertiary)'
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style={{ color: c }} aria-hidden>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
        <path d="m5.795 14.306l-1.772-1.775l-1.773 1.775m15.955-4.579l1.772 1.776l1.773-1.776" />
        <path d="M19.977 11.503c0-2.12-.84-4.151-2.336-5.65A7.97 7.97 0 0 0 12 3.513a7.9 7.9 0 0 0-2.97.577a7.98 7.98 0 0 0-4.555 4.75m-.452 3.69a8 8 0 0 0 1.827 5.082a7.97 7.97 0 0 0 9.966 1.927a8 8 0 0 0 3.585-4.034" />
        <path d="M9.58 13.978A2.28 2.28 0 0 0 12 16.054c1.952 0 2.42-1.123 2.42-2.076s-.807-1.963-2.42-1.963s-2.42-.638-2.42-1.938a2.22 2.22 0 0 1 1.537-2.003c.285-.092.585-.125.883-.097a2.33 2.33 0 0 1 2.42 2.1M12 17.264v-1.051m0-9.45v1.21" />
      </g>
    </svg>
  )
}

const icons = { home: IconHome, accounts: IconAccounts, goals: IconGoals, convert: IconConvert }

export function BottomNav() {
  const { tab, setTab, goToAccountsDefault } = useNavigation()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center lg:hidden"
      style={{ paddingBottom: 'max(1rem, calc(env(safe-area-inset-bottom) + 0.5rem))' }}
      aria-label="Main"
    >
      <div
        className="flex items-center gap-0.5 rounded-full px-2 py-2"
        style={{
          background: 'rgba(42, 52, 70, 0.42)',
          backdropFilter: 'blur(28px) saturate(1.6)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 40px rgba(0,0,0,0.4)',
        }}
      >
        {tabs.map(({ id, label }) => {
          const active = tab === id
          const Icon = icons[id]
          const onActivate = () => {
            if (id === 'accounts') { goToAccountsDefault(); return }
            setTab(/** @type {any} */ (id))
          }
          return (
            <button
              key={id}
              type="button"
              onClick={onActivate}
              aria-current={active ? 'page' : undefined}
              className="relative flex items-center gap-1.5 rounded-full px-3.5 py-2 outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              {active && (
                <motion.div
                  layoutId="tab-active-pill"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'rgba(0, 200, 150, 0.12)',
                    border: '1px solid rgba(0, 200, 150, 0.22)',
                  }}
                  transition={{ type: 'spring', stiffness: 420, damping: 46, mass: 0.8 }}
                />
              )}

              <span className="relative z-10">
                <Icon active={active} />
              </span>

              <motion.span
                animate={{
                  maxWidth: active ? 110 : 0,
                  opacity: active ? 1 : 0,
                }}
                transition={{ type: 'spring', stiffness: 420, damping: 46, mass: 0.8 }}
                className="relative z-10 overflow-hidden whitespace-nowrap font-dm-sans text-sm font-semibold text-primary"
                aria-hidden={!active}
              >
                {label}
              </motion.span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
