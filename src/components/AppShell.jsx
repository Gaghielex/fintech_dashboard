import { BottomNav } from './BottomNav.jsx'

/**
 * @param {{ children: import('react').ReactNode }} props
 */
export function AppShell({ children }) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <main className="mx-auto w-full max-w-lg flex-1 px-4 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-4">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
