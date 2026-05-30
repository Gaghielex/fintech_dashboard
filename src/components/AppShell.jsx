import { BottomNav } from './BottomNav.jsx'
import { SideNav } from './SideNav.jsx'

/**
 * @param {{ children: import('react').ReactNode }} props
 */
export function AppShell({ children }) {
  return (
    <div className="flex min-h-dvh min-w-0 overflow-x-hidden bg-canvas">
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] lg:hidden"
        style={{
          height: 'calc(env(safe-area-inset-top, 0px) + 0.65rem)',
          background:
            'linear-gradient(to bottom, rgba(13, 17, 23, 0.86), rgba(13, 17, 23, 0.56), rgba(13, 17, 23, 0))',
          backdropFilter: 'blur(18px) saturate(1.35)',
          WebkitBackdropFilter: 'blur(18px) saturate(1.35)',
        }}
        aria-hidden
      />
      <SideNav />

      {/* Content + mobile bottom nav */}
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col overflow-x-hidden lg:pl-56">
        <main className="mx-auto w-full min-w-0 max-w-lg flex-1 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-4 lg:px-5 lg:max-w-2xl lg:pb-10 lg:pt-8">
          {children}
        </main>
        <BottomNav />
      </div>

    </div>
  )
}
