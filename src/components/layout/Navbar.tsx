'use client'

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
} from 'react'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useScroll,
} from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { navLinks, identity } from '@/lib/data'

/* ─────────────────────────────────────────────────────────────
   TYPES + CONSTANTS
   ─────────────────────────────────────────────────────────── */
type NavLink = (typeof navLinks)[0]
const sectionIds = navLinks.map(l => l.href.replace('#', ''))
const E  = [0.16, 1, 0.3, 1]    as const
const ES = [0.34, 1.56, 0.64, 1] as const

/* ─────────────────────────────────────────────────────────────
   LINK ICONS — minimal SVG per section
   ─────────────────────────────────────────────────────────── */
const LINK_ICONS: Record<string, React.ReactNode> = {
  hero: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  ),
  about: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/>
    </svg>
  ),
  experience: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    </svg>
  ),
  skills: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  education: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  awards: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="8" r="6"/>
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  ),
  contact: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
}

/* ─────────────────────────────────────────────────────────────
   COMMAND BAR LINK — icon + expand-on-hover label
   ─────────────────────────────────────────────────────────── */
const CommandLink = memo(function CommandLink({
  link,
  isActive,
  onClick,
  proximity, // 0–1 based on cursor distance to this item
}: {
  link:      NavLink
  isActive:  boolean
  onClick:   () => void
  proximity: number
}) {
  const [hov, setHov] = useState(false)
  const id = link.href.replace('#', '')

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-current={isActive ? 'page' : undefined}
      aria-label={`Navigate to ${link.label}`}
      style={{
        display:        'flex',
        alignItems:     'center',
        gap:            hov || isActive ? '0.4rem' : 0,
        padding:        '0.38rem 0.55rem',
        borderRadius:   6,
        background:     isActive ? 'var(--gold-dim)' : hov ? 'var(--canvas-3)' : 'transparent',
        border:         `1px solid ${isActive ? 'var(--gold-bdr)' : hov ? 'var(--canvas-4)' : 'transparent'}`,
        cursor:         'pointer',
        transition:     'all 0.22s var(--ease-expo)',
        color:          isActive ? 'var(--gold)' : hov ? 'var(--t1)' : 'var(--t3)',
        position:       'relative',
        overflow:       'hidden',
        /* Subtle proximity glow — scales with how close cursor is */
        boxShadow:      proximity > 0.3
          ? `0 0 ${proximity * 14}px rgba(200,168,75,${proximity * 0.18})`
          : 'none',
      }}
    >
      {/* Icon */}
      <span style={{
        display:    'flex',
        flexShrink: 0,
        transition: 'transform 0.2s var(--ease-expo)',
        transform:  hov ? 'scale(1.15)' : 'scale(1)',
      }}>
        {LINK_ICONS[id] ?? LINK_ICONS.contact}
      </span>

      {/* Label — expands in on hover or active */}
      <motion.span
        animate={{
          width:   hov || isActive ? 'auto' : 0,
          opacity: hov || isActive ? 1 : 0,
        }}
        transition={{ duration: 0.22, ease: E }}
        style={{
          fontFamily:    'var(--font-family-accent)',
          fontSize:      '0.58rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontWeight:    isActive ? 600 : 400,
          whiteSpace:    'nowrap',
          overflow:      'hidden',
          display:       'block',
        }}
      >
        {link.label}
      </motion.span>

      {/* Active gold dot */}
      {isActive && (
        <motion.span
          layoutId="cmd-dot"
          style={{
            position:     'absolute',
            bottom:       2, left: '50%',
            transform:    'translateX(-50%)',
            width:        3, height: 3,
            borderRadius: '50%',
            background:   'var(--gold)',
            boxShadow:    '0 0 6px var(--gold)',
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        />
      )}
    </button>
  )
})

/* ─────────────────────────────────────────────────────────────
   SA CENTER EMBLEM — the pivot of the command bar
   ─────────────────────────────────────────────────────────── */
const SAEmblem = memo(function SAEmblem({
  onClick,
  scrolled,
}: {
  onClick: () => void
  scrolled: boolean
}) {
  const [hov, setHov] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label="Return to top — Sajjad Ahmad"
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        width:          34, height: 34,
        borderRadius:   9,
        background:     hov
          ? 'linear-gradient(135deg, var(--gold) 0%, var(--gold-rich) 50%, var(--gold) 100%)'
          : 'linear-gradient(145deg, var(--canvas-3), var(--canvas-4))',
        border:         `1px solid ${hov ? 'var(--gold)' : 'rgba(200,168,75,0.2)'}`,
        cursor:         'pointer',
        transition:     'all 0.3s var(--ease-expo)',
        boxShadow:      hov
          ? '0 0 0 2px rgba(200,168,75,0.2), 0 4px 20px rgba(200,168,75,0.3)'
          : '0 0 0 1px rgba(200,168,75,0.08), 0 2px 8px rgba(0,0,0,0.4)',
        position:       'relative',
        overflow:       'hidden',
        flexShrink:     0,
      }}
    >
      {/* Top reflective sheen */}
      <div aria-hidden="true" style={{
        position:      'absolute',
        top: 0, left: 0, right: 0,
        height:        '45%',
        background:    hov
          ? 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)'
          : 'linear-gradient(to bottom, rgba(255,255,255,0.07), transparent)',
        borderRadius:  '9px 9px 0 0',
        pointerEvents: 'none',
        transition:    'background 0.3s',
      }} />

      {hov && (
        <motion.div
          initial={{ x: '-110%' }}
          animate={{ x: '220%' }}
          transition={{ duration: 0.5, ease: 'linear' }}
          aria-hidden="true"
          style={{
            position:      'absolute', inset: 0,
            background:    'linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)',
            pointerEvents: 'none',
          }}
        />
      )}

      <span style={{
        fontFamily:    'var(--font-family-display)',
        fontStyle:     'italic',
        fontWeight:    800,
        fontSize:      '0.85rem',
        color:         hov ? '#0A0907' : 'var(--t1)',
        lineHeight:    1,
        userSelect:    'none',
        position:      'relative', zIndex: 1,
        textShadow:    hov ? 'none' : '0 1px 4px rgba(0,0,0,0.6)',
        transition:    'all 0.3s',
        animation:     !hov ? 'emblem-idle 4s ease-in-out infinite' : 'none',
      }}>
        SA
      </span>
    </button>
  )
})

/* ─────────────────────────────────────────────────────────────
   PROGRESS CAPSULE — lives at bottom of floating bar
   ─────────────────────────────────────────────────────────── */
function ProgressCapsule() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: '10%', right: '10%',
      height: '1.5px', borderRadius: 1, overflow: 'hidden',
      background: 'rgba(200,168,75,0.06)',
    }}>
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          scaleX, transformOrigin: '0%',
          background: 'linear-gradient(to right, var(--gold), var(--gold-rich), var(--ac))',
          boxShadow:  '0 0 8px rgba(200,168,75,0.5)',
        }}
      />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   FULLSCREEN CINEMATIC MENU
   Opens when SA emblem is clicked on mobile
   ─────────────────────────────────────────────────────────── */
function FullscreenMenu({
  open, onClose, activeSection, onNavClick,
}: {
  open: boolean; onClose: () => void
  activeSection: string; onNavClick: (href: string) => void
}) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="fs-menu"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{   opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.4, ease: E }}
          style={{
            position:        'fixed', inset: 0,
            zIndex:          300,
            background:      'var(--canvas)',
            display:         'flex',
            flexDirection:   'column',
            alignItems:      'center',
            justifyContent:  'center',
            overflow:        'hidden',
          }}
        >
          {/* Background ambient */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200,168,75,0.04) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          {/* Dot grid */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent 100%)',
            pointerEvents: 'none',
          }} />

          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.15 }}
            onClick={onClose}
            aria-label="Close menu"
            style={{
              position: 'absolute', top: '1.75rem', right: '1.75rem',
              width: '2.4rem', height: '2.4rem',
              borderRadius: '50%',
              border: '1px solid var(--canvas-4)',
              background: 'var(--canvas-2)',
              color: 'var(--t2)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-family-accent)',
              fontSize: '0.8rem',
              transition: 'all 0.2s',
              zIndex: 2,
            }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor='var(--gold-bdr)'; el.style.color='var(--gold)'; el.style.background='var(--gold-dim)' }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor='var(--canvas-4)'; el.style.color='var(--t2)'; el.style.background='var(--canvas-2)' }}
          >
            ✕
          </motion.button>

          {/* SA top identity */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.4, ease: E }}
            style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
          >
            <span style={{
              fontFamily: 'var(--font-family-display)', fontStyle: 'italic', fontWeight: 800,
              fontSize: '1.2rem', color: 'var(--gold)', letterSpacing: '-0.01em',
            }}>SA</span>
            <span style={{
              fontFamily: 'var(--font-family-mono)', fontSize: '0.52rem',
              color: 'var(--t3)', letterSpacing: '0.14em', textTransform: 'uppercase',
            }}>Sajjad Ahmad</span>
          </motion.div>

          {/* Links — large editorial */}
          <nav aria-label="Full screen navigation">
            {navLinks.map((link, i) => {
              const id       = link.href.replace('#', '')
              const isActive = activeSection === id
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{   opacity: 0, y: -12 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.45, ease: E }}
                  style={{ textAlign: 'center', marginBottom: '0.2rem' }}
                >
                  <button
                    onClick={() => onNavClick(link.href)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily:    'var(--font-family-display)',
                      fontWeight:    isActive ? 800 : 600,
                      fontStyle:     isActive ? 'italic' : 'normal',
                      fontSize:      'clamp(2rem, 7vw, 4.5rem)',
                      letterSpacing: '-0.025em',
                      color:         isActive ? 'var(--gold)' : 'var(--t2)',
                      lineHeight:    1.05,
                      transition:    'all 0.22s',
                      padding:       '0.1rem 1rem',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLButtonElement
                      if (!isActive) {
                        el.style.color = 'var(--t1)'
                        el.style.transform = 'translateX(6px)'
                      }
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLButtonElement
                      if (!isActive) {
                        el.style.color = 'var(--t2)'
                        el.style.transform = 'translateX(0)'
                      }
                    }}
                  >
                    {link.label}
                  </button>
                </motion.div>
              )
            })}
          </nav>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.4, ease: E }}
            style={{
              marginTop: '3rem',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.9rem',
              width: '100%', maxWidth: 320, padding: '0 1.5rem',
            }}
          >
            <a
              href={identity.whatsappUrl}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                width: '100%', padding: '0.8rem',
                background: 'var(--gold)', color: '#0A0907',
                borderRadius: 9, textDecoration: 'none',
                fontFamily: 'var(--font-family-accent)', fontWeight: 700,
                fontSize: '0.82rem', letterSpacing: '0.07em', textTransform: 'uppercase',
                boxShadow: '0 4px 20px rgba(200,168,75,0.25)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background='var(--gold-rich)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background='var(--gold)' }}
            >
              Start a Conversation
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'var(--ac)', boxShadow: '0 0 6px var(--ac)',
                display: 'block', animation: 'pulse-dot 2s ease-in-out infinite',
              }} />
              <span style={{
                fontFamily: 'var(--font-family-mono)', fontSize: '0.52rem',
                color: 'var(--t3)', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                Available · {identity.location}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAIN NAVBAR — FLOATING COMMAND BAR
   ─────────────────────────────────────────────────────────── */
export default function Navbar() {
  const activeSection = useScrollSpy(sectionIds)
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  /* Track cursor position relative to the bar for proximity glow */
  const barRef         = useRef<HTMLDivElement>(null)
  const [cursorX, setCursorX]       = useState(-999)
  const itemRefs       = useRef<(HTMLLIElement | null)[]>([])
  const [proximities,  setProximities] = useState<number[]>(navLinks.map(() => 0))

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  /* Update proximity for each link based on cursor X */
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const bar = barRef.current
    if (!bar) return
    const bRect = bar.getBoundingClientRect()
    const relX  = e.clientX - bRect.left

    const newP = itemRefs.current.map(el => {
      if (!el) return 0
      const r   = el.getBoundingClientRect()
      const cx  = r.left - bRect.left + r.width / 2
      const dist = Math.abs(relX - cx)
      return Math.max(0, 1 - dist / 140)
    })
    setProximities(newP)
  }, [])

  const onMouseLeave = useCallback(() => {
    setProximities(navLinks.map(() => 0))
  }, [])

  const goTo = useCallback((href: string) => {
    document.getElementById(href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }, [])

  return (
    <>
      {/* ── FLOATING COMMAND BAR ── */}
      <div style={{
        position:       'fixed',
        top:            scrolled ? '0.85rem' : '1.25rem',
        left:           '50%',
        transform:      'translateX(-50%)',
        zIndex:         100,
        transition:     'top 0.4s var(--ease-expo)',
        pointerEvents:  'none', /* only interactive children */
      }}>
        <motion.div
          initial={{ y: -80, opacity: 0, scale: 0.9 }}
          animate={{ y: 0,   opacity: 1, scale: 1  }}
          transition={{ duration: 0.75, ease: ES, delay: 0.06 }}
          style={{ pointerEvents: 'auto' }}
        >
          {/* The pill container */}
          <div
            ref={barRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{
              display:        'flex',
              alignItems:     'center',
              gap:            '0.15rem',
              padding:        '0.35rem 0.45rem',
              borderRadius:   14,
              background:     scrolled
                ? 'var(--nav-bg-scrolled)'
                : 'var(--nav-bg)',
              backdropFilter: 'blur(32px) saturate(200%)',
              WebkitBackdropFilter: 'blur(32px) saturate(200%)',
              border:         '1px solid var(--nav-border)',
              boxShadow:      scrolled
                ? '0 0 0 1px rgba(200,168,75,0.1), 0 8px 32px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12)'
                : '0 0 0 1px rgba(200,168,75,0.06), 0 4px 24px rgba(0,0,0,0.12)',
              transition:     'background 0.4s, box-shadow 0.4s',
              position:       'relative',
              whiteSpace:     'nowrap',
            }}
          >
            {/* Left nav group */}
            <ul role="list" className="cmd-desktop-links" style={{display:"flex",alignItems:"center",gap:"0.05rem",listStyle:"none",margin:0,padding:0}}>
              {navLinks.slice(0, Math.floor(navLinks.length / 2)).map((link, i) => (
                <li key={link.href} ref={el => { itemRefs.current[i] = el }}>
                  <CommandLink
                    link={link}
                    isActive={activeSection === link.href.replace('#', '')}
                    onClick={() => goTo(link.href)}
                    proximity={proximities[i] ?? 0}
                  />
                </li>
              ))}
            </ul>

            {/* ── SA CENTER DIVIDER + EMBLEM ── */}
            <div style={{
              display:    'flex',
              alignItems: 'center',
              gap:        '0.3rem',
              padding:    '0 0.25rem',
            }}>
              {/* Left thin separator */}
              <div style={{
                width: 1, height: 20,
                background: 'linear-gradient(to bottom, transparent, rgba(200,168,75,0.2), transparent)',
              }} />

              <SAEmblem onClick={() => goTo('#hero')} scrolled={scrolled} />

              {/* Right thin separator */}
              <div style={{
                width: 1, height: 20,
                background: 'linear-gradient(to bottom, transparent, rgba(200,168,75,0.2), transparent)',
              }} />
            </div>

            {/* Right nav group */}
            <ul role="list" className="cmd-desktop-links" style={{display:"flex",alignItems:"center",gap:"0.05rem",listStyle:"none",margin:0,padding:0}}>
              {navLinks.slice(Math.floor(navLinks.length / 2)).map((link, i) => {
                const globalIdx = Math.floor(navLinks.length / 2) + i
                return (
                  <li key={link.href} ref={el => { itemRefs.current[globalIdx] = el }}>
                    <CommandLink
                      link={link}
                      isActive={activeSection === link.href.replace('#', '')}
                      onClick={() => goTo(link.href)}
                      proximity={proximities[globalIdx] ?? 0}
                    />
                  </li>
                )
              })}
            </ul>

            {/* Right utilities */}
            <div style={{
              display:    'flex',
              alignItems: 'center',
              gap:        '0.25rem',
              marginLeft: '0.15rem',
              paddingLeft: '0.3rem',
              borderLeft: '1px solid rgba(255,255,255,0.05)',
            }}>
              {/* CTA — desktop */}
              <div className="cmd-desktop-only">
                <a
                  href={identity.whatsappUrl}
                  target="_blank" rel="noopener noreferrer"
                  aria-label="Start a project"
                  style={{
                    display:        'flex',
                    alignItems:     'center',
                    gap:            4,
                    padding:        '0.35rem 0.8rem',
                    borderRadius:   6,
                    background:     'var(--gold)',
                    color:          '#0A0907',
                    fontFamily:     'var(--font-family-accent)',
                    fontSize:       '0.56rem',
                    letterSpacing:  '0.1em',
                    textTransform:  'uppercase',
                    fontWeight:     700,
                    textDecoration: 'none',
                    whiteSpace:     'nowrap',
                    transition:     'all 0.22s',
                    boxShadow:      '0 2px 10px rgba(200,168,75,0.25)',
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background='var(--gold-rich)'; el.style.transform='translateY(-1px)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background='var(--gold)'; el.style.transform='translateY(0)' }}
                >
                  Hire
                  <ArrowUpRight size={9} aria-hidden="true" />
                </a>
              </div>

              <ThemeToggle />

              {/* Mobile trigger */}
              <button
                className="cmd-mobile-only"
                onClick={() => setMobileOpen(o => !o)}
                aria-label="Open menu"
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  width:          28, height: 28,
                  borderRadius:   6,
                  border:         '1px solid var(--canvas-4)',
                  background:     'transparent',
                  color:          'var(--t2)',
                  cursor:         'pointer',
                  transition:     'all 0.2s',
                  fontSize:       '0.7rem',
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor='var(--gold-bdr)'; el.style.color='var(--gold)'; el.style.background='var(--gold-dim)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor='var(--canvas-4)'; el.style.color='var(--t2)'; el.style.background='transparent' }}
              >
                ≡
              </button>
            </div>

            {/* Scroll progress inside bar bottom */}
            <ProgressCapsule />
          </div>
        </motion.div>
      </div>

      {/* Fullscreen menu (mobile + desktop overflow) */}
      <FullscreenMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        activeSection={activeSection}
        onNavClick={goTo}
      />

      <style>{`
        @keyframes emblem-idle {
          0%,100% { text-shadow: 0 0 8px rgba(200,168,75,0.0); }
          50%      { text-shadow: 0 0 8px rgba(200,168,75,0.3); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(2.5); opacity: 0;   }
        }
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(0.78); }
        }

        /* Mobile only — hide desktop links */
        @media (max-width: 699px) {
          .cmd-desktop-links { display: none !important; }
          .cmd-desktop-only  { display: none !important; }
          .cmd-mobile-only   { display: flex !important; }
        }
        @media (min-width: 700px) {
          .cmd-mobile-only   { display: none !important; }
        }
      `}</style>
    </>
  )
}