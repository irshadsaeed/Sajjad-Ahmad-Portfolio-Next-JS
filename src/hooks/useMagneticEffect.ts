'use client'

import { useRef, useCallback, useEffect } from 'react'
import { lerp, getDistance } from '@/lib/utils'

const RADIUS = 80
const STRENGTH = 0.3

/**
 * Magnetic hover effect for CTA buttons.
 * Cursor within RADIUS px → button follows at STRENGTH factor.
 */
export function useMagneticEffect<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const rafRef = useRef<number | null>(null)
  const currentXRef = useRef(0)
  const currentYRef = useRef(0)
  const targetXRef = useRef(0)
  const targetYRef = useRef(0)

  const animate = useCallback(() => {
    currentXRef.current = lerp(currentXRef.current, targetXRef.current, 0.1)
    currentYRef.current = lerp(currentYRef.current, targetYRef.current, 0.1)

    if (ref.current) {
      ref.current.style.transform = `translate(${currentXRef.current}px, ${currentYRef.current}px)`
    }

    const dx = Math.abs(currentXRef.current - targetXRef.current)
    const dy = Math.abs(currentYRef.current - targetYRef.current)

    if (dx > 0.01 || dy > 0.01) {
      rafRef.current = requestAnimationFrame(animate)
    } else {
      rafRef.current = null
    }
  }, [])

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dist = getDistance(e.clientX, e.clientY, centerX, centerY)

      if (dist < RADIUS) {
        targetXRef.current = (e.clientX - centerX) * STRENGTH
        targetYRef.current = (e.clientY - centerY) * STRENGTH
      } else {
        targetXRef.current = 0
        targetYRef.current = 0
      }

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(animate)
      }
    },
    [animate]
  )

  const onMouseLeave = useCallback(() => {
    targetXRef.current = 0
    targetYRef.current = 0
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate)
    }
  }, [animate])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    window.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mouseleave', onMouseLeave)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onMouseLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [onMouseMove, onMouseLeave])

  return ref
}