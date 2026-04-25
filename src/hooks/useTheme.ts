'use client'

import { useState, useEffect, useCallback } from 'react'

type Theme = 'dark' | 'light'
const STORAGE_KEY = 'sajjad-portfolio-theme'

/**
 * SSR-safe theme hook with localStorage persistence.
 * Writes data-theme attribute to <html> element.
 * Defaults to 'dark'.
 */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    const systemPrefers =
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initial = stored ?? systemPrefers

    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', next)
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  return [theme, toggle]
}