import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'

/**
 * Animates a number from its previous value to `target` whenever `enabled`
 * is true. Returns 0 (and resets) while disabled.
 *
 * @param {number} target
 * @param {boolean} enabled
 * @param {number} [duration=1.2]
 * @returns {number}
 */
export function useCountUp(target, enabled, duration = 1.2) {
  const [value, setValue] = useState(0)
  const fromRef = useRef(0)

  useEffect(() => {
    if (!enabled) {
      setValue(0)
      fromRef.current = 0
      return
    }
    const from = fromRef.current
    fromRef.current = target
    const controls = animate(from, target, {
      duration,
      ease: [0.33, 1, 0.68, 1],
      onUpdate(v) {
        setValue(v)
      },
    })
    return () => controls.stop()
  }, [target, enabled, duration])

  return value
}
