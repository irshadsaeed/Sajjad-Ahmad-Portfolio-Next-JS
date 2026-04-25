'use client'

import { useState, useEffect } from 'react'

/**
 * Detects which section is currently active based on IntersectionObserver.
 * Returns the active section ID string.
 */
export function useScrollSpy(sectionIds: string[], threshold = 0.4): string {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] ?? '')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id)
          }
        },
        { threshold, rootMargin: '-10% 0px -60% 0px' }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => {
      observers.forEach((obs) => obs.disconnect())
    }
  }, [sectionIds, threshold])

  return activeSection
}