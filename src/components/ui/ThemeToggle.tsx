'use client'

import { useTheme } from '@/hooks/useTheme'
import { Sun, Moon } from 'lucide-react'

/**
 * Dark/light theme toggle button.
 * SSR-safe via useTheme hook.
 */
export default function ThemeToggle() {
  const [theme, toggle] = useTheme()

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2.25rem',
        height: '2.25rem',
        borderRadius: 'var(--r-sm)',
        border: 'var(--bdr)',
        background: 'transparent',
        color: 'var(--t2)',
        cursor: 'pointer',
        transition: 'color 0.2s, border-color 0.2s, background 0.2s',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.color = 'var(--ac)'
        el.style.borderColor = 'var(--ac-bdr)'
        el.style.background = 'var(--ac-dim)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.color = 'var(--t2)'
        el.style.borderColor = 'var(--canvas-4)'
        el.style.background = 'transparent'
      }}
    >
      {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  )
}