'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { easeOutExpo } from '@/lib/utils'

interface UseCountUpOptions {
  target: number
  duration?: number
  decimals?: number
  enabled?: boolean
}

/**
 * Animated number counter with easeOutExpo easing.
 * Triggered by the `enabled` flag (set via IntersectionObserver).
 */
export function useCountUp({
  target,
  duration = 1800,
  decimals = 0,
  enabled = false,
}: UseCountUpOptions): number {
  const [current, setCurrent] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const animate = useCallback(
    (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutExpo(progress)

      setCurrent(parseFloat((easedProgress * target).toFixed(decimals)))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setCurrent(target)
      }
    },
    [target, duration, decimals]
  )

  useEffect(() => {
    if (!enabled) return

    startTimeRef.current = null
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [enabled, animate])

  return current
}