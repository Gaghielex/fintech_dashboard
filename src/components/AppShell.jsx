import { useEffect, useState } from 'react'
import { BottomNav } from './BottomNav.jsx'
import { SideNav } from './SideNav.jsx'

function ScrollFade() {
  const [atBottom, setAtBottom] = useState(false)

  useEffect(() => {
    const check = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      setAtBottom(scrollTop + clientHeight >= scrollHeight - 12)
    }
    window.addEventListener('scroll', check, { passive: true })
    check()
    return () => window.removeEventListener('scroll', check)
  }, [])

  if (atBottom) return null
  return (
    <div
      className="pointer-events-none fixed bottom-[4.5rem] left-0 right-0 z-30 h-14 lg:bottom-0"
      style={{
        background:
          'linear-gradient(to bottom, transparent, var(--palette-canvas))',
      }}
      aria-hidden
    />
  )
}

/**
 * @param {{ children: import('react').ReactNode }} props
 */
export function AppShell({ children }) {
  return (
    <div className="flex min-h-dvh bg-canvas">
      <SideNav />

      {/* Content + mobile bottom nav */}
      <div className="flex flex-1 flex-col lg:pl-56">
        <main className="mx-auto w-full max-w-lg flex-1 px-4 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-4 lg:max-w-2xl lg:pb-10 lg:pt-8">
          {children}
        </main>
        <BottomNav />
      </div>

      <ScrollFade />
    </div>
  )
}
