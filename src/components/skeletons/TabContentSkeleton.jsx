function Bar({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-surface-1 ${className}`}
      aria-hidden
    />
  )
}

/**
 * @param {{ tab: 'home' | 'accounts' | 'goals' | 'convert' }} props
 */
export function TabContentSkeleton({ tab }) {
  if (tab === 'home') {
    return (
      <div className="space-y-6 pb-6" aria-busy="true" aria-label="Loading">
        <Bar className="h-8 w-40" />
        <Bar className="h-36 w-full rounded-2xl" />
        <div className="space-y-2">
          <Bar className="h-4 w-48" />
          <Bar className="h-14 w-full" />
        </div>
        <Bar className="h-24 w-full rounded-xl" />
        <div className="grid gap-3">
          <Bar className="h-28 w-full rounded-xl" />
          <Bar className="h-28 w-full rounded-xl" />
        </div>
        <Bar className="h-20 w-full rounded-xl" />
      </div>
    )
  }

  if (tab === 'accounts') {
    return (
      <div className="space-y-4 pb-6" aria-busy="true" aria-label="Loading">
        <Bar className="h-9 w-36" />
        <Bar className="h-5 w-56" />
        <div className="flex gap-2">
          <Bar className="h-9 w-16 rounded-full" />
          <Bar className="h-9 w-20 rounded-full" />
          <Bar className="h-9 w-14 rounded-full" />
        </div>
        <Bar className="h-10 w-full rounded-lg" />
        <Bar className="h-32 w-full rounded-xl" />
        <Bar className="h-32 w-full rounded-xl" />
      </div>
    )
  }

  if (tab === 'goals') {
    return (
      <div className="space-y-5 pb-6" aria-busy="true" aria-label="Loading">
        <Bar className="h-9 w-28" />
        <Bar className="h-16 w-full rounded-xl" />
        <Bar className="h-24 w-full rounded-xl" />
        <Bar className="h-40 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-6" aria-busy="true" aria-label="Loading">
      <div className="flex justify-between gap-4">
        <div className="space-y-2">
          <Bar className="h-9 w-32" />
          <Bar className="h-4 w-52" />
        </div>
        <Bar className="h-10 w-24" />
      </div>
      <Bar className="h-20 w-full rounded-xl" />
      <Bar className="h-20 w-full rounded-xl" />
      <Bar className="h-20 w-full rounded-xl" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Bar className="h-36 w-full rounded-xl" />
        <Bar className="h-36 w-full rounded-xl" />
      </div>
    </div>
  )
}
