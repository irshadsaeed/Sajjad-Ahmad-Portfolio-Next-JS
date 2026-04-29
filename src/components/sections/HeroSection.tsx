'use client'

import React, {
  useEffect, useRef, useState, useCallback, memo,
} from 'react'
import {
  motion, useMotionValue, useSpring, useTransform, AnimatePresence,
} from 'framer-motion'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import Image from 'next/image'

/* ─────────────────────────────────────────────────────────────
   IDENTITY
   ─────────────────────────────────────────────────────────── */
const IDENTITY = {
  name:        'Sajjad Ahmad',
  firstName:   'Sajjad',
  lastName:    'Ahmad',
  discipline:  'WordPress & Laravel',
  tagline:     'Website Developer · API Specialist',
  status:      'Available',
  location:    'Islamabad · PKT',
  whatsappUrl: 'https://wa.me/923435252754',
  imageSrc:    '/images/image.png',
  heroDesc:    'Building high-performance plugins, custom themes, RESTful APIs and LMS solutions — crafted with precision, delivered with excellence.',
}

const STATS = [
  { value: '4+',   label: 'Years',     sub: 'Experience' },
  { value: '50+',  label: 'Projects',  sub: 'Delivered'  },
  { value: '3.42', label: 'CGPA',      sub: 'UET Taxila' },
  { value: '6+',   label: 'Companies', sub: 'Served'     },
] as const

const E  = [0.16, 1, 0.3, 1]    as const
const ES = [0.34, 1.56, 0.64, 1] as const

/* ─────────────────────────────────────────────────────────────
   COUNT-UP
   ─────────────────────────────────────────────────────────── */
function useCountUp(target: number, dur = 1800, dec = 0, on = false) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!on) return
    let s: number | null = null
    const step = (ts: number) => {
      if (!s) s = ts
      const p  = Math.min((ts - s) / dur, 1)
      const e2 = 1 - Math.pow(1 - p, 4)
      setV(parseFloat((e2 * target).toFixed(dec)))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, dur, dec, on])
  return v
}

/* ─────────────────────────────────────────────────────────────
   STAT CARD
   ─────────────────────────────────────────────────────────── */
const StatCard = memo(function StatCard({
  item, index, on,
}: {
  item: typeof STATS[number]; index: number; on: boolean
}) {
  const num     = parseFloat(item.value.replace('+', ''))
  const dec     = item.value.includes('.') ? 2 : 0
  const val     = useCountUp(num, 1800, dec, on)
  const suffix  = item.value.includes('+')
  const isGold  = index === 0 || index === 2
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={on ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1, ease: E }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position:     'relative',
        padding:      '1rem 1.1rem',
        background:   hov
          ? 'linear-gradient(145deg, var(--canvas-3), var(--canvas-2))'
          : 'var(--canvas-2)',
        border:       `1px solid ${hov
          ? isGold ? 'var(--gold-bdr)' : 'var(--ac-bdr)'
          : 'var(--canvas-4)'}`,
        borderRadius: 14,
        overflow:     'hidden',
        transition:   'all 0.28s var(--ease-expo)',
        transform:    hov ? 'translateY(-3px)' : 'none',
        boxShadow:    hov
          ? isGold
            ? '0 12px 32px rgba(0,0,0,0.3), 0 0 0 1px var(--gold-bdr)'
            : '0 12px 32px rgba(0,0,0,0.3), 0 0 0 1px var(--ac-bdr)'
          : 'var(--sh-sm)',
        cursor:       'default',
      }}
    >
      {/* Top accent */}
      <div style={{
        position:   'absolute', top: 0, left: '8%', right: '8%', height: '1.5px',
        background: `linear-gradient(to right, transparent, ${isGold ? 'var(--gold)' : 'var(--ac)'}, transparent)`,
        opacity:    hov ? 1 : 0, transition: 'opacity 0.28s',
      }} />

      {/* Value */}
      <div style={{
        fontFamily:    'var(--font-family-display)',
        fontStyle:     isGold ? 'italic' : 'normal',
        fontWeight:    800,
        fontSize:      'clamp(1.6rem, 2.8vw, 2.2rem)',
        color:         isGold ? 'var(--gold)' : 'var(--t1)',
        lineHeight:    1, letterSpacing: '-0.03em',
        textShadow:    isGold ? '0 0 28px var(--gold-glow)' : 'none',
      }}>
        {on ? `${val.toFixed(dec)}${suffix ? '+' : ''}` : item.value}
      </div>

      {/* Label */}
      <div style={{
        fontFamily:    'var(--font-family-display)', fontWeight: 600,
        fontSize:      '0.78rem', color: hov ? 'var(--t1)' : 'var(--t2)',
        letterSpacing: '-0.01em', marginTop: '0.22rem', transition: 'color 0.2s',
      }}>
        {item.label}
      </div>

      {/* Sub */}
      <div style={{
        fontFamily:    'var(--font-family-mono)', fontSize: '0.47rem',
        color:         isGold ? 'rgba(200,168,75,0.5)' : 'var(--t3)',
        letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '0.08rem',
      }}>
        {item.sub}
      </div>
    </motion.div>
  )
})

/* ─────────────────────────────────────────────────────────────
   SIGNATURE PORTRAIT
   ─────────────────────────────────────────────────────────── */
function SignaturePortrait() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotX   = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 120, damping: 18 })
  const rotY   = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 120, damping: 18 })
  const imgX   = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]),  { stiffness: 100, damping: 16 })
  const imgY   = useSpring(useTransform(mouseY, [-0.5, 0.5], [-8, 8]),  { stiffness: 100, damping: 16 })
  const floatY = useSpring(0, { stiffness: 18, damping: 7 })
  const [hov, setHov] = useState(false)

  useEffect(() => {
    let t = 0
    const iv = setInterval(() => { t += 0.032; floatY.set(Math.sin(t) * 7) }, 16)
    return () => clearInterval(iv)
  }, [floatY])

  const onMM = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - r.left) / r.width  - 0.5)
    mouseY.set((e.clientY - r.top)  / r.height - 0.5)
  }, [mouseX, mouseY])

  return (
    <motion.div
      onMouseMove={onMM}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); setHov(false) }}
      onMouseEnter={() => setHov(true)}
      style={{
        rotateX: rotX, rotateY: rotY, y: floatY,
        transformStyle: 'preserve-3d', perspective: 900,
        position: 'relative', width: '100%', maxWidth: 400, margin: '0 auto',
      }}
    >
      {/* Ambient glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: '-50px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(200,168,75,0.1) 0%, transparent 65%)',
        filter: 'blur(32px)', opacity: hov ? 1 : 0.5,
        transition: 'opacity 0.6s', pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Dashed ring */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: '-20px', borderRadius: '50%',
        border: '1px dashed rgba(200,168,75,0.16)',
        animation: 'ring-drift 26s linear infinite',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Shadow offset frame */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: '10px', left: '10px', right: '-10px', bottom: '-10px',
        borderRadius: 'var(--r-xl)',
        border: '1px solid rgba(200,168,75,0.06)',
        pointerEvents: 'none', zIndex: 1,
        transform: hov ? 'translate(-2px,-2px)' : 'none',
        transition: 'transform 0.4s var(--ease-expo)',
      }} />

      {/* Main frame */}
      <motion.div style={{
        position: 'relative', zIndex: 5,
        borderRadius: 'var(--r-xl)', overflow: 'hidden',
        background: 'var(--canvas-2)',
        border: `1px solid ${hov ? 'var(--gold-bdr)' : 'var(--canvas-4)'}`,
        boxShadow: hov ? 'var(--sh-gd)' : 'var(--sh)',
        transition: 'border-color 0.4s, box-shadow 0.4s',
        aspectRatio: '3 / 4',
      }}>
        <motion.div style={{ x: imgX, y: imgY, position: 'absolute', inset: '-12px' }}>
          <Image
            src={IDENTITY.imageSrc} alt={IDENTITY.name}
            fill priority sizes="(max-width:768px) 90vw, 400px"
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
        </motion.div>

        {/* Bottom gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.05) 48%, transparent 65%)',
          zIndex: 2, pointerEvents: 'none',
        }} />

        {/* Top gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(8,8,8,0.15) 0%, transparent 28%)',
          zIndex: 2, pointerEvents: 'none',
        }} />

        {/* Corner gold glow */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: 0, right: 0, width: 100, height: 100,
          background: 'radial-gradient(circle at 100% 0%, rgba(200,168,75,0.14), transparent 70%)',
          zIndex: 2, pointerEvents: 'none',
        }} />

        {/* Identity overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '1.4rem 1.3rem 1.2rem', zIndex: 3,
        }}>
          {/* Status pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'rgba(0,255,148,0.1)', border: '1px solid rgba(0,255,148,0.22)',
            borderRadius: 100, padding: '3px 10px', marginBottom: '0.6rem',
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: 'var(--ac)', boxShadow: '0 0 6px var(--ac)',
              display: 'block', animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily: 'var(--font-family-mono)', fontSize: '0.5rem',
              color: 'var(--ac)', letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              {IDENTITY.status}
            </span>
          </div>

          {/* Name */}
          <div style={{
            fontFamily: 'var(--font-family-display)', fontWeight: 800,
            fontSize: 'clamp(1.25rem, 2.1vw, 1.65rem)',
            letterSpacing: '-0.02em', lineHeight: 0.92, color: '#F2EFE8',
          }}>
            {IDENTITY.firstName}
          </div>
          <div style={{
            fontFamily: 'var(--font-family-display)', fontStyle: 'italic', fontWeight: 800,
            fontSize: 'clamp(1.25rem, 2.1vw, 1.65rem)',
            letterSpacing: '-0.02em', lineHeight: 0.92,
            color: 'var(--gold)', textShadow: '0 0 18px var(--gold-glow)',
          }}>
            {IDENTITY.lastName}
          </div>

          <div style={{
            fontFamily: 'var(--font-family-mono)', fontSize: '0.48rem',
            color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em',
            textTransform: 'uppercase', marginTop: '0.45rem',
          }}>
            {IDENTITY.discipline}
          </div>
        </div>
      </motion.div>

      {/* Outer gold rim */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: '-6px',
        borderRadius: 'calc(var(--r-xl) + 8px)',
        border: '1px solid var(--gold-bdr)',
        opacity: hov ? 1 : 0.3, transition: 'opacity 0.4s',
        pointerEvents: 'none', zIndex: 6,
      }} />
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   CINEMATIC NAME
   ─────────────────────────────────────────────────────────── */
function CinematicName() {
  const [revealed, setRevealed] = useState(false)
  const mouse  = useRef({ x: 0, y: 0 })
  const raf    = useRef<number | null>(null)
  const chars  = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 150)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const fn = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', fn, { passive: true })

    const loop = () => {
      chars.current.forEach(el => {
        if (!el) return
        const r  = el.getBoundingClientRect()
        const dx = mouse.current.x - (r.left + r.width  / 2)
        const dy = mouse.current.y - (r.top  + r.height / 2)
        const d  = Math.sqrt(dx * dx + dy * dy)
        const mx = 160
        if (d < mx) {
          const f  = (1 - d / mx) ** 2
          el.style.transform  = `skewX(${Math.max(-4, Math.min(4, (dx / mx) * 4 * f))}deg) translateY(${-f * 5}px)`
          el.style.transition = 'transform 40ms ease-out'
        } else {
          el.style.transform  = 'none'
          el.style.transition = 'transform 200ms ease-out'
        }
      })
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', fn)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [])

  const [first, last] = IDENTITY.name.split(' ')

  const renderChars = (word: string, italic: boolean, start: number) =>
    word.split('').map((char, ci) => (
      <span
        key={ci}
        ref={el => { chars.current[start + ci] = el }}
        aria-hidden="true"
        style={{
          display:            'inline-block',
          fontFamily:         'var(--font-family-display)',
          fontStyle:          italic ? 'italic' : 'normal',
          fontWeight:         800,
          fontSize:           'var(--text-name)',
          letterSpacing:      '-0.02em',
          color:              italic ? 'var(--gold)' : 'var(--t1)',
          lineHeight:         0.88,
          willChange:         'transform',
          backfaceVisibility: 'hidden',
          filter:             italic ? 'drop-shadow(0 0 28px rgba(200,168,75,0.22))' : 'none',
        }}
      >
        {char}
      </span>
    ))

  return (
    <div aria-label={IDENTITY.name}>
      {/* Line 1 */}
      <div style={{ overflow: 'hidden', lineHeight: 0.88 }}>
        <motion.div
          initial={{ y: '112%' }}
          animate={revealed ? { y: 0 } : {}}
          transition={{ duration: 0.88, ease: E }}
        >
          {renderChars(first, false, 0)}
        </motion.div>
      </div>

      {/* Gold rule */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={revealed ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.75, delay: 0.32, ease: E }}
        aria-hidden="true"
        style={{
          height: '1px', maxWidth: '72%',
          background: 'linear-gradient(to right, var(--gold), rgba(200,168,75,0.1), transparent)',
          transformOrigin: 'left',
          marginTop: '0.05em', marginBottom: '0.04em',
        }}
      />

      {/* Line 2 */}
      <div style={{ overflow: 'hidden', lineHeight: 0.88 }}>
        <motion.div
          initial={{ y: '112%' }}
          animate={revealed ? { y: 0 } : {}}
          transition={{ duration: 0.88, delay: 0.12, ease: E }}
        >
          {renderChars(last, true, first.length)}
        </motion.div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAGNETIC CTA
   ─────────────────────────────────────────────────────────── */
function MagCTA({
  href, children, primary, onClick,
}: {
  href?: string; children: React.ReactNode; primary?: boolean; onClick?: () => void
}) {
  const ref  = useRef<HTMLAnchorElement | HTMLButtonElement>(null)
  const mx   = useMotionValue(0)
  const my   = useMotionValue(0)
  const smx  = useSpring(mx, { stiffness: 200, damping: 20 })
  const smy  = useSpring(my, { stiffness: 200, damping: 20 })
  const [hov, setHov]   = useState(false)
  const [shim, setShim] = useState(false)

  const onMM = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current; if (!el) return
    const r  = el.getBoundingClientRect()
    mx.set((e.clientX - r.left - r.width  / 2) * 0.28)
    my.set((e.clientY - r.top  - r.height / 2) * 0.28)
  }, [mx, my])

  const onME = useCallback(() => { setHov(true); setShim(true); setTimeout(() => setShim(false), 550) }, [])
  const onML = useCallback(() => { mx.set(0); my.set(0); setHov(false) }, [mx, my])

  const style: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: primary ? '0.88rem 2rem' : '0.85rem 1.65rem',
    background: primary ? (hov ? 'var(--gold-rich)' : 'var(--gold)') : (hov ? 'var(--canvas-3)' : 'transparent'),
    color:     primary ? '#0A0907' : (hov ? 'var(--t1)' : 'var(--t2)'),
    border:    primary ? 'none' : `1px solid ${hov ? 'var(--canvas-4)' : 'var(--canvas-4)'}`,
    borderRadius: 'var(--r-sm)',
    fontFamily:    'var(--font-family-accent)',
    fontWeight:    primary ? 700 : 500,
    fontSize:      '0.82rem',
    letterSpacing: primary ? '0.07em' : '0.04em',
    textTransform: primary ? 'uppercase' : undefined,
    textDecoration: 'none', cursor: 'pointer',
    transition:     'background 0.25s, color 0.25s, box-shadow 0.25s',
    boxShadow:      primary && hov ? 'var(--sh-gd)' : 'none',
    whiteSpace:     'nowrap', position: 'relative', overflow: 'hidden',
  }

  const inner = (
    <>
      <AnimatePresence>
        {shim && (
          <motion.span
            key="s" initial={{ x: '-110%' }} animate={{ x: '220%' }} exit={{}}
            transition={{ duration: 0.5, ease: 'linear' }}
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
      <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
        {children}
      </span>
    </>
  )

  const mp = { ref, onMouseMove: onMM, onMouseEnter: onME, onMouseLeave: onML, style: { x: smx, y: smy } }

  if (href) return (
    <motion.a href={href} target="_blank" rel="noopener noreferrer"
      {...mp} style={{ ...style, ...mp.style } as any} ref={ref as any}>
      {inner}
    </motion.a>
  )
  return (
    <motion.button {...mp} onClick={onClick} style={{ ...style, ...mp.style } as any} ref={ref as any}>
      {inner}
    </motion.button>
  )
}

/* ─────────────────────────────────────────────────────────────
   HERO SECTION
   ─────────────────────────────────────────────────────────── */
export default function HeroSection() {
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsOn, setStatsOn] = useState(false)

  useEffect(() => {
    const el = statsRef.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsOn(true) },
      { threshold: 0.15 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      id="hero"
      aria-label={`Hero — ${IDENTITY.name}`}
      style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        overflow: 'hidden', background: 'var(--canvas)',
      }}
    >

      {/* ── ATMOSPHERE ── */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.026) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)',
        }} />
        {/* Diagonal lines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(122deg, rgba(200,168,75,0.01) 0px, rgba(200,168,75,0.01) 1px, transparent 1px, transparent 80px)',
          pointerEvents: 'none',
        }} />
        {/* Gold left bloom */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 52% 62% at 16% 54%, rgba(200,168,75,0.048) 0%, transparent 68%)',
        }} />
        {/* Green right accent */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 40% 45% at 88% 38%, rgba(0,255,148,0.018) 0%, transparent 68%)',
        }} />
        {/* Top vignette */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '32vh',
          background: 'linear-gradient(to bottom, rgba(8,8,8,0.45), transparent)',
        }} />
        {/* Bottom vignette */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '22vh',
          background: 'linear-gradient(to top, rgba(8,8,8,0.28), transparent)',
        }} />
      </div>

      {/* ── CONTENT ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: 1240, margin: '0 auto',
        padding: 'clamp(96px, 11vw, 140px) clamp(20px, 5vw, 60px) clamp(60px, 8vw, 100px)',
      }}>
        <div
          className="hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 0.88fr) minmax(0, 1.12fr)',
            gap: 'clamp(3rem, 6vw, 6rem)',
            alignItems: 'center',
          }}
        >

          {/* ── LEFT — PORTRAIT ── */}
          <motion.div
            initial={{ opacity: 0, x: -36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.06, ease: E }}
            style={{ position: 'relative' }}
          >
            {/* Badge top-left */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9, ease: ES }}
              className="hero-badge"
              aria-hidden="true"
              style={{
                position: 'absolute', top: '-0.9rem', left: '-0.5rem', zIndex: 20,
                background: 'var(--canvas-2)', border: '1px solid var(--canvas-4)',
                borderRadius: 10, padding: '0.3rem 0.7rem',
                fontFamily: 'var(--font-family-accent)', fontSize: '0.57rem',
                color: 'var(--t2)', boxShadow: 'var(--sh)', backdropFilter: 'blur(12px)',
                display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
              }}
            >
              <span style={{ color: 'var(--gold)', display: 'flex' }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              </span>
              WordPress Expert
            </motion.div>

            {/* Badge bottom-right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.05, ease: ES }}
              className="hero-badge"
              aria-hidden="true"
              style={{
                position: 'absolute', bottom: '-0.9rem', right: '-0.5rem', zIndex: 20,
                background: 'var(--canvas-2)', border: '1px solid var(--canvas-4)',
                borderRadius: 10, padding: '0.3rem 0.7rem',
                fontFamily: 'var(--font-family-accent)', fontSize: '0.57rem',
                color: 'var(--t2)', boxShadow: 'var(--sh)', backdropFilter: 'blur(12px)',
                display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontFamily: 'var(--font-family-display)', fontStyle: 'italic', color: 'var(--gold)', fontSize: '0.64rem' }}>🎓</span>
              UET · 3.42 GPA
            </motion.div>

            <SignaturePortrait />
          </motion.div>

          {/* ── RIGHT — EDITORIAL ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.45rem' }}>

            {/* Meta row */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: E }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}
            >
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'var(--ac-dim)', border: '1px solid var(--ac-bdr)',
                borderRadius: 100, padding: '4px 12px',
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: 'var(--ac)', boxShadow: '0 0 7px var(--ac)',
                  display: 'block', animation: 'pulse-dot 2s ease-in-out infinite',
                }} />
                <span style={{
                  fontFamily: 'var(--font-family-accent)', fontSize: '0.57rem',
                  color: 'var(--ac)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600,
                }}>
                  {IDENTITY.status}
                </span>
              </div>
              <span style={{ color: 'var(--canvas-4)', fontSize: '0.7rem' }}>·</span>
              <span style={{
                fontFamily: 'var(--font-family-mono)', fontSize: '0.56rem',
                color: 'var(--t3)', letterSpacing: '0.08em',
              }}>
                {IDENTITY.location}
              </span>
            </motion.div>

            {/* Cinematic name */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <CinematicName />
            </motion.div>

            {/* Tagline with vertical accent */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.52, ease: E }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}
            >
              <div style={{
                width: '2px', height: '2rem', flexShrink: 0,
                background: 'linear-gradient(to bottom, var(--gold), transparent)',
                borderRadius: 1,
              }} />
              <span style={{
                fontFamily: 'var(--font-family-display)',
                fontStyle: 'italic', fontWeight: 400,
                fontSize: 'clamp(0.98rem, 1.55vw, 1.18rem)',
                color: 'var(--t2)', letterSpacing: '-0.005em', lineHeight: 1.4,
              }}>
                {IDENTITY.tagline}
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: E }}
              style={{
                fontFamily:    'var(--font-family-sans)', fontWeight: 300,
                fontSize:      'clamp(0.84rem, 1vw, 0.96rem)',
                color:         'var(--t2)', lineHeight: 1.88,
                letterSpacing: '0.005em', margin: 0,
                maxWidth:      460,
              }}
            >
              {IDENTITY.heroDesc}
            </motion.p>

            {/* Role label */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.66, ease: E }}
            >
              <span style={{
                fontFamily:    'var(--font-family-accent)', fontWeight: 500,
                fontSize:      'clamp(0.78rem, 1.1vw, 0.94rem)',
                color:         'var(--t3)', letterSpacing: '0.07em', textTransform: 'uppercase',
              }}>
                {IDENTITY.discipline} · Developer
              </span>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.72, ease: E }}
              style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap', alignItems: 'center' }}
            >
              <MagCTA href={IDENTITY.whatsappUrl} primary>
                Start a Project
                <ArrowUpRight size={13} />
              </MagCTA>
              <MagCTA onClick={() => scrollTo('experience')}>
                View Work
              </MagCTA>
            </motion.div>

            {/* Gold divider */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.8, ease: E }}
              style={{
                height: '1px', maxWidth: 500,
                background: 'linear-gradient(to right, var(--gold-bdr), var(--canvas-4), transparent)',
                transformOrigin: 'left',
              }}
            />

            {/* Stats */}
            <motion.div
              ref={statsRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.88 }}
              className="hero-stats"
            >
              {STATS.map((s, i) => (
                <StatCard key={s.label} item={s} index={i} on={statsOn} />
              ))}
            </motion.div>

          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => scrollTo('about')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.6 }}
        aria-label="Scroll down"
        className="hero-scroll-btn"
        style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
          animation: 'float-btn 3.5s ease-in-out infinite',
        }}
      >
        <span style={{ fontFamily: 'var(--font-family-mono)', fontSize: '0.49rem', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
          scroll
        </span>
        <ChevronDown size={10} />
      </motion.button>

      <style>{`
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(0.78); }
        }
        @keyframes ring-drift {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes float-btn {
          0%,100% { transform:translateX(-50%) translateY(0); }
          50%     { transform:translateX(-50%) translateY(-7px); }
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.6rem;
        }

        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2.5rem !important;
          }
        }
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .hero-grid > *:first-child {
            order: -1;
            max-width: 360px;
            width: 100%;
            margin: 0 auto;
          }
          .hero-badge      { display: none !important; }
          .hero-scroll-btn { display: none !important; }
          .hero-stats {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.5rem !important;
          }
        }
        @media (max-width: 420px) {
          .hero-grid > *:first-child { max-width: 100%; }
        }
      `}</style>
    </section>
  )
}