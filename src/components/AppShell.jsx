import { BottomNav } from './BottomNav.jsx'
import { SideNav } from './SideNav.jsx'

/**
 * @param {{ children: import('react').ReactNode }} props
 */
export function AppShell({ children }) {
  return (
    <div className="flex min-h-dvh min-w-0 overflow-x-hidden bg-canvas">
      <SideNav />

      {/* Content + mobile bottom nav */}
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col overflow-x-hidden lg:pl-56">
        <main className="mx-auto w-full min-w-0 max-w-lg flex-1 px-4 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-4 lg:max-w-2xl lg:pb-10 lg:pt-8">
          {children}
        </main>
        <BottomNav />
      </div>

    </div>
  )
}
