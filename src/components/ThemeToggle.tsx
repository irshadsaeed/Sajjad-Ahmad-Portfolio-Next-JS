'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

type Theme = 'dark' | 'light'

/** Theme switch with a circular "ink spread" reveal (View Transitions API, graceful fallback). */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setTheme((document.documentElement.dataset.theme as Theme) || 'dark')
    setReady(true)
  }, [])

  const apply = (t: Theme) => {
    document.documentElement.dataset.theme = t
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'light' ? '#f5f1ea' : '#0a0a0b')
    try { localStorage.setItem('theme', t) } catch {}
    setTheme(t)
  }

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!doc.startViewTransition || reduce) { apply(next); return }

    const x = e.clientX || window.innerWidth - 40
    const y = e.clientY || 40
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

    doc.startViewTransition(() => apply(next)).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 750, easing: 'cubic-bezier(0.76, 0, 0.24, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    }).catch(() => {})
  }

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title="Toggle theme"
      data-ready={ready}
    >
      <span className={`tt-icon ${theme === 'dark' ? 'on' : ''}`}><Moon size={18} /></span>
      <span className={`tt-icon ${theme === 'light' ? 'on' : ''}`}><Sun size={18} /></span>
    </button>
  )
}
