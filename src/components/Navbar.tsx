'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { identity, navLinks } from '@/lib/data'
import ThemeToggle from './ThemeToggle'

const links = navLinks.filter(l => l.href !== '#hero')

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  // Glass on scroll + hide on scroll-down, show on scroll-up
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      setHidden(y > 400 && y > last + 4)
      if (y < last - 4) setHidden(false)
      last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section tracking
  useEffect(() => {
    const els = links
      .map(l => document.querySelector(l.href))
      .filter((el): el is Element => !!el)
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Lock page scroll while mobile menu is open
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className={`nav ${scrolled ? 'scrolled' : ''} ${hidden && !open ? 'hide' : ''}`}>
        <div className="nav-inner">
          <a href="#hero" className="logo" aria-label={`${identity.name} — home`}>
            Sajjad<span>.</span>
          </a>

          <nav className="nav-links" aria-label="Primary">
            {links.map(l => (
              <a key={l.href} href={l.href} className={active === l.href ? 'active' : ''}>
                {l.label}
              </a>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <ThemeToggle />
            <a href="#contact" className="btn btn-primary nav-cta">
              Hire me <ArrowUpRight size={16} />
            </a>
            <button
              className={`burger ${open ? 'open' : ''}`}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen(o => !o)}
            >
              <span /><span />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            initial={{ clipPath: 'circle(0% at calc(100% - 3rem) 2.5rem)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 3rem) 2.5rem)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 3rem) 2.5rem)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label="Mobile">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  className="m-link"
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <small>0{i + 1}</small>
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <div className="menu-foot">
              <a href={`mailto:${identity.email}`}>{identity.email}</a>
              <span>{identity.location}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
