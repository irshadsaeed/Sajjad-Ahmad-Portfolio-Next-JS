'use client'

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
} from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import Image from 'next/image'

/* ─────────────────────────────────────────────────────────────
   DATA
   ─────────────────────────────────────────────────────────── */
const IDENTITY = {
  name:        'Sajjad Ahmad',
  firstName:   'Sajjad',
  lastName:    'Ahmad',
  discipline:  'WordPress & Laravel',
  tagline:     'Engineering digital precision',
  status:      'Available',
  location:    'Islamabad · PKT',
  whatsappUrl: 'https://wa.me/923435252754',
  imageSrc:    '/images/profilee.png',
}

const STATS = [
  { value: '3+',   label: 'Years',     sub: 'Professional' },
  { value: '50+',  label: 'Projects',  sub: 'Delivered'    },
  { value: '3.42', label: 'GPA',       sub: 'UET Taxila'   },
  { value: '5+',   label: 'Companies', sub: 'Served'       },
] as const

/* ─────────────────────────────────────────────────────────────
   EASE
   ─────────────────────────────────────────────────────────── */
const E = [0.16, 1, 0.3, 1] as const

/* ─────────────────────────────────────────────────────────────
   COUNT-UP HOOK
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
   ANIMATED METRIC — financial dashboard style
   ─────────────────────────────────────────────────────────── */
const Metric = memo(function Metric({
  item, index, on,
}: {
  item:  typeof STATS[number]
  index: number
  on:    boolean
}) {
  // Parse numeric value for count-up
  const numericTarget = parseFloat(item.value.replace('+', ''))
  const decimals      = item.value.includes('.') ? 2 : 0
  const val           = useCountUp(numericTarget, 1800, decimals, on)
  const hasSuffix     = item.value.includes('+')
  const isGold        = index === 0 || index === 2

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={on ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: E }}
      style={{
        display:       'flex',
        flexDirection: 'column',
        gap:           '0.1rem',
      }}
    >
      {/* Value */}
      <div style={{
        fontFamily:    'var(--font-family-display)',
        fontStyle:     isGold ? 'italic' : 'normal',
        fontWeight:    700,
        fontSize:      'clamp(1.6rem, 2.8vw, 2.2rem)',
        color:         isGold ? 'var(--gold)' : 'var(--t1)',
        lineHeight:    1,
        letterSpacing: '-0.02em',
        textShadow:    isGold ? '0 0 24px var(--gold-glow)' : 'none',
      }}>
        {on ? `${val.toFixed(decimals)}${hasSuffix ? '+' : ''}` : item.value}
      </div>
      {/* Label */}
      <div style={{
        fontFamily:    'var(--font-family-accent)',
        fontSize:      '0.58rem',
        color:         'var(--t2)',
        letterSpacing: '0.04em',
        lineHeight:    1.2,
      }}>
        {item.label}
      </div>
      {/* Sub */}
      <div style={{
        fontFamily:    'var(--font-family-mono)',
        fontSize:      '0.5rem',
        color:         'var(--t3)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>
        {item.sub}
      </div>
    </motion.div>
  )
})

/* ─────────────────────────────────────────────────────────────
   SIGNATURE PORTRAIT — floating identity module
   Restrained, spatial, high-end
   ─────────────────────────────────────────────────────────── */
function SignaturePortrait() {
  const ref    = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotX   = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 18 })
  const rotY   = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6,  6]), { stiffness: 120, damping: 18 })
  const imgX   = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 100, damping: 16 })
  const imgY   = useSpring(useTransform(mouseY, [-0.5, 0.5], [-10, 10]), { stiffness: 100, damping: 16 })

  const floatY = useSpring(0, { stiffness: 18, damping: 7 })
  const [hov, setHov] = useState(false)

  useEffect(() => {
    let t = 0
    const iv = setInterval(() => { t += 0.035; floatY.set(Math.sin(t) * 8) }, 16)
    return () => clearInterval(iv)
  }, [floatY])

  const onMM = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - r.left) / r.width  - 0.5)
    mouseY.set((e.clientY - r.top)  / r.height - 0.5)
  }, [mouseX, mouseY])

  const onML = useCallback(() => {
    mouseX.set(0); mouseY.set(0); setHov(false)
  }, [mouseX, mouseY])

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMM}
      onMouseLeave={onML}
      onMouseEnter={() => setHov(true)}
      style={{
        rotateX: rotX, rotateY: rotY,
        y: floatY,
        transformStyle: 'preserve-3d',
        perspective: 900,
        position: 'relative',
        width: '100%',
        maxWidth: 380,
        margin: '0 auto',
      }}
    >
      {/* Ambient gold glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: '-60px',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(200,168,75,0.08) 0%, transparent 65%)',
        filter: 'blur(40px)',
        opacity: hov ? 0.9 : 0.5,
        transition: 'opacity 0.6s',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Outer dashed ring — restrained */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: '-18px',
        borderRadius: '50%',
        border: '1px dashed rgba(200,168,75,0.2)',
        animation: 'ring-drift 22s linear infinite',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Depth shadow box — offset bottom-right */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: '14px', left: '14px', right: '-14px', bottom: '-14px',
        borderRadius: 'var(--r-xl)',
        border: '1px solid rgba(200,168,75,0.06)',
        pointerEvents: 'none', zIndex: 1,
        transition: 'transform 0.4s var(--ease-expo)',
        transform: hov ? 'translate(-2px,-2px)' : 'none',
      }} />

      {/* Main frame */}
      <motion.div style={{
        position: 'relative', zIndex: 5,
        borderRadius: 'var(--r-xl)',
        overflow: 'hidden',
        background: 'var(--canvas-2)',
        border: `1px solid ${hov ? 'var(--gold-bdr)' : 'var(--canvas-4)'}`,
        boxShadow: hov ? 'var(--sh-gd)' : 'var(--sh)',
        transition: 'border-color 0.4s, box-shadow 0.4s',
        aspectRatio: '3 / 4',
      }}>
        {/* Image parallax */}
        <motion.div style={{ x: imgX, y: imgY, position: 'absolute', inset: '-14px' }}>
          <Image
            src={IDENTITY.imageSrc}
            alt={IDENTITY.name}
            fill priority
            sizes="(max-width:768px) 90vw, 380px"
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
        </motion.div>

        {/* Gradient overlays */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.1) 45%, transparent 65%)',
          zIndex: 2, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(8,8,8,0.2) 0%, transparent 25%)',
          zIndex: 2, pointerEvents: 'none',
        }} />

        {/* Identity overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '1.4rem 1.3rem 1.2rem',
          zIndex: 3,
        }}>
          {/* Availability chip */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'rgba(0,255,148,0.1)',
            border: '1px solid rgba(0,255,148,0.18)',
            borderRadius: 100, padding: '3px 10px',
            marginBottom: '0.6rem',
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: 'var(--ac)', boxShadow: '0 0 6px var(--ac)',
              display: 'block', animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily: 'var(--font-family-mono)', fontSize: '0.52rem',
              color: 'var(--ac)', letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              {IDENTITY.status}
            </span>
          </div>

          {/* Name split */}
          <div style={{
            fontFamily: 'var(--font-family-display)', fontWeight: 800,
            fontSize: 'clamp(1.25rem, 2vw, 1.6rem)',
            letterSpacing: '-0.02em', lineHeight: 0.95,
            color: '#F2EFE8',
          }}>
            {IDENTITY.firstName}
          </div>
          <div style={{
            fontFamily: 'var(--font-family-display)', fontStyle: 'italic', fontWeight: 800,
            fontSize: 'clamp(1.25rem, 2vw, 1.6rem)',
            letterSpacing: '-0.02em', lineHeight: 0.95,
            color: 'var(--gold)', textShadow: '0 0 16px var(--gold-glow)',
          }}>
            {IDENTITY.lastName}
          </div>

          {/* Discipline */}
          <div style={{
            fontFamily: 'var(--font-family-mono)', fontSize: '0.52rem',
            color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em',
            textTransform: 'uppercase', marginTop: '0.45rem',
          }}>
            {IDENTITY.discipline}
          </div>
        </div>

        {/* Corner accent */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: 0, right: 0,
          width: 90, height: 90,
          background: 'radial-gradient(circle at 100% 0%, rgba(200,168,75,0.1), transparent 70%)',
          zIndex: 2, pointerEvents: 'none',
        }} />
      </motion.div>

      {/* Outer gold rim */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: '-5px',
        borderRadius: 'calc(var(--r-xl) + 6px)',
        border: '1px solid var(--gold-bdr)',
        opacity: hov ? 1 : 0.4,
        transition: 'opacity 0.4s',
        pointerEvents: 'none', zIndex: 6,
      }} />
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   EDITORIAL NAME — large split serif, letter-warp on proximity
   ─────────────────────────────────────────────────────────── */
function EditorialName() {
  const letters = useRef<(HTMLSpanElement | null)[]>([])
  const mouse   = useRef({ x: 0, y: 0 })
  const raf     = useRef<number | null>(null)

  useEffect(() => {
    const fn = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', fn, { passive: true })

    const animate = () => {
      letters.current.forEach(el => {
        if (!el) return
        const r    = el.getBoundingClientRect()
        const cx   = r.left + r.width  / 2
        const cy   = r.top  + r.height / 2
        const dx   = mouse.current.x - cx
        const dy   = mouse.current.y - cy
        const dist = Math.sqrt(dx*dx + dy*dy)
        const max  = 200

        if (dist < max) {
          const f  = 1 - dist / max
          const f2 = f * f
          el.style.transform  = `skewX(${Math.max(-3.5,Math.min(3.5,(dx/max)*3.5*f2))}deg) translateY(${-f2*4}px)`
          el.style.transition = 'transform 50ms ease-out'
        } else {
          el.style.transform  = 'skewX(0deg) translateY(0)'
          el.style.transition = 'transform 220ms ease-out'
        }
      })
      raf.current = requestAnimationFrame(animate)
    }
    raf.current = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('mousemove', fn)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [])

  const [first, last] = IDENTITY.name.split(' ')
  let idx = 0

  const renderWord = (word: string, italic: boolean, start: number) =>
    word.split('').map((char, ci) => {
      const i = start + ci
      return (
        <span key={ci}
          ref={el => { letters.current[i] = el }}
          aria-hidden="true"
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-family-display)',
            fontStyle: italic ? 'italic' : 'normal',
            fontSize: 'var(--text-name)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: italic ? 'var(--gold)' : 'var(--t1)',
            lineHeight: 0.87,
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        >{char}</span>
      )
    })

  return (
    <div aria-label={IDENTITY.name} style={{ lineHeight: 1 }}>
      <div style={{ display: 'block', lineHeight: 0.87 }}>
        {renderWord(first, false, 0)}
      </div>
      <div style={{ display: 'block', lineHeight: 0.87, marginTop: '0.04em' }}>
        {renderWord(last, true, first.length)}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAGNETIC CTA
   ─────────────────────────────────────────────────────────── */
function MagCTA({
  href, children, primary,
}: {
  href?: string; children: React.ReactNode; primary?: boolean
}) {
  const ref    = useRef<HTMLElement>(null)
  const mx     = useMotionValue(0)
  const my     = useMotionValue(0)
  const smx    = useSpring(mx, { stiffness: 200, damping: 20 })
  const smy    = useSpring(my, { stiffness: 200, damping: 20 })
  const [hov, setHov] = useState(false)
  const [shim, setShim] = useState(false)

  const onMM = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current
    if (!el) return
    const r  = el.getBoundingClientRect()
    mx.set((e.clientX - r.left - r.width  / 2) * 0.32)
    my.set((e.clientY - r.top  - r.height / 2) * 0.32)
  }, [mx, my])

  const onME = useCallback(() => { setHov(true); setShim(true); setTimeout(() => setShim(false), 550) }, [])
  const onML = useCallback(() => { mx.set(0); my.set(0); setHov(false) }, [mx, my])

  const style: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: primary ? '0.8rem 1.8rem' : '0.78rem 1.6rem',
    background: primary
      ? hov ? 'var(--gold-rich)' : 'var(--gold)'
      : hov ? 'var(--canvas-3)' : 'transparent',
    color: primary ? '#0A0907' : hov ? 'var(--t1)' : 'var(--t2)',
    border: primary
      ? 'none'
      : `1px solid ${hov ? 'var(--canvas-4)' : 'var(--canvas-4)'}`,
    borderRadius: 'var(--r-sm)',
    fontFamily: 'var(--font-family-accent)',
    fontWeight: primary ? 700 : 500,
    fontSize: '0.82rem',
    letterSpacing: primary ? '0.06em' : '0.04em',
    textTransform: primary ? 'uppercase' : undefined,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'background 0.25s, color 0.25s, box-shadow 0.25s',
    boxShadow: primary && hov ? 'var(--sh-gd)' : 'none',
    whiteSpace: 'nowrap',
    position: 'relative',
    overflow: 'hidden',
  }

  const props = {
    ref, onMouseMove: onMM, onMouseEnter: onME, onMouseLeave: onML,
    style: { x: smx, y: smy },
  }

  const inner = (
    <>
      <AnimatePresence>
        {shim && (
          <motion.span
            key="s"
            initial={{ x: '-110%' }} animate={{ x: '220%' }} exit={{}}
            transition={{ duration: 0.5, ease: 'linear' }}
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)',
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

  if (href) {
    return (
      <motion.a href={href} target="_blank" rel="noopener noreferrer" {...props} style={{ ...style, ...props.style } as any}>
        {inner}
      </motion.a>
    )
  }
  return (
    <motion.button {...props} style={{ ...style, ...props.style } as any}>
      {inner}
    </motion.button>
  )
}

/* ─────────────────────────────────────────────────────────────
   HERO SECTION
   Layout: asymmetric — large portrait left, editorial content right
   Intentional breathing room — negative space as design weapon
   ─────────────────────────────────────────────────────────── */
export default function HeroSection() {
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsOn, setStatsOn] = useState(false)

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsOn(true) },
      { threshold: 0.3 },
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
        position:   'relative',
        minHeight:  '100vh',
        display:    'flex',
        alignItems: 'center',
        overflow:   'hidden',
        background: 'var(--canvas)',
      }}
    >

      {/* ── Background system ── */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {/* Dot grid — restrained */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.032) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)',
        }} />
        {/* Gold warm — left */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 55% 65% at 20% 55%, rgba(200,168,75,0.035) 0%, transparent 70%)',
        }} />
        {/* Green — right, very subtle */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 45% 50% at 82% 42%, rgba(0,255,148,0.018) 0%, transparent 70%)',
        }} />
        {/* Top fade */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '28vh',
          background: 'linear-gradient(to bottom, rgba(8,8,8,0.35), transparent)',
        }} />
      </div>

      {/* ── Content ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(90px,10vw,130px) clamp(24px,5vw,60px) clamp(60px,8vw,100px)',
      }}>

        {/* ══ MAIN GRID — portrait left, content right ══ */}
        <div
          className="hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.1fr)',
            gap: 'clamp(4rem, 7vw, 7rem)',
            alignItems: 'center',
          }}
        >

          {/* ── LEFT — PORTRAIT ── */}
          <motion.div
            initial={{ opacity: 0, x: -50, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.95, delay: 0.08, ease: E }}
            style={{ position: 'relative' }}
          >
            {/* Floating badge — top left */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8, ease: [0.34,1.56,0.64,1] }}
              aria-hidden="true"
              style={{
                position: 'absolute', top: '-1rem', left: '-0.5rem',
                zIndex: 20, background: 'var(--canvas-2)',
                border: '1px solid var(--canvas-4)', borderRadius: 10,
                padding: '0.35rem 0.8rem',
                fontFamily: 'var(--font-family-accent)', fontSize: '0.6rem',
                color: 'var(--t2)',
                boxShadow: 'var(--sh)', backdropFilter: 'blur(12px)',
                display: 'flex', alignItems: 'center', gap: 5,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ color: 'var(--gold)', display: 'flex' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              </span>
              WordPress Expert
            </motion.div>

            {/* Floating badge — bottom right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.95, ease: [0.34,1.56,0.64,1] }}
              aria-hidden="true"
              style={{
                position: 'absolute', bottom: '-1rem', right: '-0.5rem',
                zIndex: 20, background: 'var(--canvas-2)',
                border: '1px solid var(--canvas-4)', borderRadius: 10,
                padding: '0.35rem 0.8rem',
                fontFamily: 'var(--font-family-accent)', fontSize: '0.6rem',
                color: 'var(--t2)',
                boxShadow: 'var(--sh)', backdropFilter: 'blur(12px)',
                display: 'flex', alignItems: 'center', gap: 5,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-family-display)',
                fontStyle: 'italic', color: 'var(--gold)', fontSize: '0.7rem',
              }}>🎓</span>
              UET Taxila · 3.42 GPA
            </motion.div>

            <SignaturePortrait />
          </motion.div>

          {/* ── RIGHT — EDITORIAL CONTENT ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>

            {/* Location + discipline — minimal metadata row */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: E }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap',
              }}
            >
              {/* Status dot + label */}
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
                  fontFamily: 'var(--font-family-accent)', fontSize: '0.58rem',
                  color: 'var(--ac)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600,
                }}>
                  {IDENTITY.status}
                </span>
              </div>

              <span style={{ color: 'var(--canvas-4)', fontSize: '0.75rem' }}>·</span>

              <span style={{
                fontFamily: 'var(--font-family-mono)', fontSize: '0.58rem',
                color: 'var(--t3)', letterSpacing: '0.08em',
              }}>
                {IDENTITY.location}
              </span>
            </motion.div>

            {/* Editorial name — giant serif */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: E }}
            >
              <EditorialName />
            </motion.div>

            {/* Discipline — italic gold tagline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2, ease: E }}
            >
              <span style={{
                fontFamily: 'var(--font-family-display)',
                fontStyle: 'italic', fontWeight: 400,
                fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
                color: 'var(--gold)', letterSpacing: '-0.005em', lineHeight: 1.3,
              }}>
                {IDENTITY.tagline}
              </span>
            </motion.div>

            {/* Role badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.26, ease: E }}
            >
              <span style={{
                fontFamily: 'var(--font-family-display)', fontWeight: 600,
                fontSize: 'clamp(0.88rem, 1.3vw, 1.05rem)',
                color: 'var(--t2)', letterSpacing: '-0.005em',
              }}>
                {IDENTITY.discipline} Developer
              </span>
            </motion.div>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.34, ease: E }}
              style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}
            >
              <MagCTA href={IDENTITY.whatsappUrl} primary>
                Start a Project
                <ArrowUpRight size={13} />
              </MagCTA>

              <MagCTA>
                <span onClick={() => scrollTo('experience')}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  View Work
                </span>
              </MagCTA>
            </motion.div>

            {/* Divider — gold-to-transparent */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.44, ease: E }}
              style={{
                height: 1,
                background: 'linear-gradient(to right, var(--gold-bdr), var(--canvas-4), transparent)',
                transformOrigin: 'left',
                maxWidth: 480,
              }}
            />

            {/* Metrics row — financial dashboard style */}
            <motion.div
              ref={statsRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              style={{
                display: 'flex',
                gap: 0,
                flexWrap: 'wrap',
              }}
            >
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    paddingRight: i < STATS.length - 1 ? '2rem' : 0,
                    borderRight: i < STATS.length - 1 ? '1px solid var(--canvas-4)' : 'none',
                    marginRight: i < STATS.length - 1 ? 0 : 0,
                  }}
                >
                  <Metric item={s} index={i} on={statsOn} />
                </div>
              ))}
            </motion.div>

          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.button
        onClick={() => scrollTo('about')}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.9, duration: 0.5 }}
        aria-label="Scroll to About"
        style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          animation: 'float-btn 3.5s ease-in-out infinite',
        }}
      >
        <span style={{ fontFamily: 'var(--font-family-mono)', fontSize: '0.52rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          scroll
        </span>
        <ChevronDown size={11} />
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
          50%     { transform:translateX(-50%) translateY(-8px); }
        }
        /* Tablet: equal cols */
        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 4rem !important;
          }
        }
        /* Mobile: stack, portrait on top */
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 3.5rem !important;
          }
          .hero-grid > *:first-child {
            order: -1;
            max-width: 300px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  )
}