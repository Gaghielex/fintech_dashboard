import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'

/**
 * Animates a number from its previous value to `target` whenever `enabled`
 * is true. Returns 0 while disabled.
 *
 * Survives React Strict Mode: we never set the "from" ref to `target` until
 * the animation completes, so the dev double-invoked effect still animates
 * from the real start value.
 *
 * @param {number} target
 * @param {boolean} enabled
 * @param {number} [duration=1.2]
 * @returns {number}
 */
export function useCountUp(target, enabled, duration = 1.2) {
  const [value, setValue] = useState(0)
  const fromRef = useRef(0)
  const latestRef = useRef(0)

  useEffect(() => {
    if (!enabled) {
      fromRef.current = 0
      latestRef.current = 0
      return
    }

    const from = fromRef.current
    latestRef.current = from
    setValue(from)

    const controls = animate(from, target, {
      duration,
      ease: [0.33, 1, 0.68, 1],
      onUpdate(v) {
        latestRef.current = v
        setValue(v)
      },
      onComplete() {
        fromRef.current = target
        latestRef.current = target
      },
    })

    return () => {
      controls.stop()
      fromRef.current = latestRef.current
    }
  }, [target, enabled, duration])

  return enabled ? value : 0
}
