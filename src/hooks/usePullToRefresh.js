import { useEffect, useRef, useState } from 'react'

/** Damped pull distance (px) needed to trigger a refresh. */
const THRESHOLD = 120

/**
 * Detects a pull-down-to-refresh gesture when the page is scrolled to the
 * top. Attaches passive touch listeners on `window`.
 *
 * Returns `pullY` — the current rubber-banded pull distance (0 while not
 * pulling). Callers use this to animate an indicator. The hook calls
 * `onRefresh` once the threshold is crossed on release.
 *
 * @param {{
 *   onRefresh: () => void,
 *   disabled?: boolean,
 * }} options
 * @returns {{ pullY: number, threshold: number }}
 */
export function usePullToRefresh({ onRefresh, disabled = false }) {
  const [pullY, setPullY] = useState(0)
  const startYRef = useRef(0)
  const isPullingRef = useRef(false)
  const currentPullRef = useRef(0)

  useEffect(() => {
    if (disabled) {
      isPullingRef.current = false
      currentPullRef.current = 0
      setPullY(0)
      return
    }

    function handleTouchStart(e) {
      if (window.scrollY > 4) return
      startYRef.current = e.touches[0].clientY
      isPullingRef.current = true
    }

    function handleTouchMove(e) {
      if (!isPullingRef.current) return
      if (window.scrollY > 4) {
        isPullingRef.current = false
        currentPullRef.current = 0
        setPullY(0)
        return
      }
      const delta = e.touches[0].clientY - startYRef.current
      if (delta <= 0) {
        currentPullRef.current = 0
        setPullY(0)
        return
      }
      // Rubber-band: sqrt curve so pull resistance increases with distance
      const damped = Math.min(THRESHOLD * 1.5, Math.sqrt(delta * THRESHOLD))
      currentPullRef.current = damped
      setPullY(damped)
    }

    function handleTouchEnd() {
      if (!isPullingRef.current) return
      isPullingRef.current = false
      const y = currentPullRef.current
      currentPullRef.current = 0
      setPullY(0)
      if (y >= THRESHOLD * 0.75) {
        onRefresh()
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [disabled, onRefresh])

  return { pullY, threshold: THRESHOLD }
}
