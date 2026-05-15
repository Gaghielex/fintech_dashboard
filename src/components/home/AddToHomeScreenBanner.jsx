import { useCallback, useMemo, useState } from 'react'
import { HS_BANNER_DISMISSED_KEY } from '../../utils/storageKeys.js'

function isIosTouchDevice() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const isIosUa = /iPad|iPhone|iPod/i.test(ua)
  const isIpadOs =
    navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  return isIosUa || isIpadOs
}

function isInStandaloneDisplay() {
  if (typeof window === 'undefined') return false
  const nav = /** @type {Navigator & { standalone?: boolean }} */ (window.navigator)
  if (nav.standalone === true) return true
  return window.matchMedia?.('(display-mode: standalone)')?.matches === true
}

/**
 * Dismissible “Add to Home Screen” prompt for iPhone Safari (PRD / P3-03).
 */
export function AddToHomeScreenBanner() {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(HS_BANNER_DISMISSED_KEY) === 'true',
  )

  const shouldShow = useMemo(() => {
    if (dismissed) return false
    if (!isIosTouchDevice()) return false
    if (isInStandaloneDisplay()) return false
    return true
  }, [dismissed])

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(HS_BANNER_DISMISSED_KEY, 'true')
    } catch {
      /* ignore */
    }
    setDismissed(true)
  }, [])

  if (!shouldShow) return null

  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <p className="font-dm-sans text-sm leading-snug text-ink-muted">
          <span className="font-semibold text-ink">Add to Home Screen</span> for
          the best experience. Tap{' '}
          <span className="font-dm-mono text-ink">Share</span> →{' '}
          <span className="font-dm-mono text-ink">Add to Home Screen</span>.
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="mt-0.5 shrink-0 text-ink-faint transition hover:text-ink"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M18 6 6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
