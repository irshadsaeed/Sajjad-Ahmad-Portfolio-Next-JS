'use client'

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  memo,
} from 'react'
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion'
import { Mail, MessageCircle, Linkedin, MapPin, ArrowUpRight } from 'lucide-react'
import { identity } from '@/lib/data'

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
   ─────────────────────────────────────────────────────────── */
const E  = [0.16, 1, 0.3, 1]    as const
const ES = [0.34, 1.56, 0.64, 1] as const

/* ─────────────────────────────────────────────────────────────
   SIGNAL LINE DATA
   Each method = a vertical "signal" that expands on hover
   ─────────────────────────────────────────────────────────── */
const SIGNALS = [
  {
    id:      'linkedin',
    label:   'LinkedIn',
    action:  'Connect professionally',
    handle:  'sajjad-ahmad754',
    note:    '500+ connections · Professional network',
    href:    identity.linkedinUrl,
    icon:    <Linkedin size={15} aria-hidden="true" />,
    color:   'var(--gold)',
    dim:     'var(--gold-dim)',
    bdr:     'var(--gold-bdr)',
    glow:    'rgba(200,168,75,0.2)',
    isGold:  true,
  },
  {
    id:      'whatsapp',
    label:   'WhatsApp',
    action:  'Start a project',
    handle:  '+92 343 525 2754',
    note:    'Usually replies within hours',
    href:    identity.whatsappUrl,
    icon:    <MessageCircle size={15} aria-hidden="true" />,
    color:   'var(--ac)',
    dim:     'var(--ac-dim)',
    bdr:     'var(--ac-bdr)',
    glow:    'rgba(0,255,148,0.18)',
    isGold:  false,
  },
  {
    id:      'email',
    label:   'Email',
    action:  'Send a formal inquiry',
    handle:  identity.email,
    note:    'Best for detailed project briefs',
    href:    `mailto:${identity.email}`,
    icon:    <Mail size={15} aria-hidden="true" />,
    color:   'var(--gold)',
    dim:     'var(--gold-dim)',
    bdr:     'var(--gold-bdr)',
    glow:    'rgba(200,168,75,0.16)',
    isGold:  true,
  },
  {
    id:      'location',
    label:   'Location',
    action:  'Islamabad, Pakistan',
    handle:  'PKT — GMT+5',
    note:    'Working across all timezones',
    href:    null,
    icon:    <MapPin size={15} aria-hidden="true" />,
    color:   'var(--t3)',
    dim:     'var(--canvas-3)',
    bdr:     'var(--canvas-4)',
    glow:    'rgba(255,255,255,0.04)',
    isGold:  false,
  },
] as const

type Signal = typeof SIGNALS[number]

/* ─────────────────────────────────────────────────────────────
   CURSOR LIGHT — slow ambient orb tracking mouse
   ─────────────────────────────────────────────────────────── */
function CursorLight({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const x  = useMotionValue(-600)
  const y  = useMotionValue(-600)
  const sx = useSpring(x, { stiffness: 45, damping: 15 })
  const sy = useSpring(y, { stiffness: 45, damping: 15 })

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      const s = sectionRef.current
      if (!s) return
      const r = s.getBoundingClientRect()
      if (e.clientY < r.top || e.clientY > r.bottom) return
      x.set(e.clientX - r.left)
      y.set(e.clientY - r.top)
    }
    window.addEventListener('mousemove', fn, { passive: true })
    return () => window.removeEventListener('mousemove', fn)
  }, [sectionRef, x, y])

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'absolute', left: 0, top: 0,
        x: sx, y: sy,
        translateX: '-50%', translateY: '-50%',
        width: 800, height: 800, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,168,75,0.035) 0%, rgba(0,255,148,0.012) 40%, transparent 68%)',
        pointerEvents: 'none', zIndex: 0, filter: 'blur(20px)',
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────
   SIGNAL LINE — vertical expandable contact method
   Each signal has:
   - A thin vertical line on the left
   - A horizontal connector to content
   - Content that expands height on hover
   - Cursor-proximity glow on the line
   ─────────────────────────────────────────────────────────── */
const SignalLine = memo(function SignalLine({
  signal,
  index,
  inView,
  cursorY,    // relative Y of cursor in the right panel
  panelTop,   // panel top offset for proximity calc
}: {
  signal:   Signal
  index:    number
  inView:   boolean
  cursorY:  number
  panelTop: number
}) {
  const ref     = useRef<HTMLDivElement>(null)
  const [hov, setHov] = useState(false)
  const [expanded, setExpanded] = useState(false)

  // Calculate center Y of this signal row for proximity
  const [centerY, setCenterY] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const r  = el.getBoundingClientRect()
    setCenterY(r.top + r.height / 2 - panelTop)
  })

  const dist     = Math.abs(cursorY - centerY)
  const proximity = Math.max(0, 1 - dist / 180)
  const lineGlow  = proximity * 0.9

  const Tag = signal.href ? 'a' : 'div'
  const linkProps = signal.href
    ? { href: signal.href, target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.1, ease: E }}
      onMouseEnter={() => { setHov(true); setExpanded(true) }}
      onMouseLeave={() => { setHov(false); setExpanded(false) }}
      style={{ position: 'relative', display: 'flex', alignItems: 'stretch', gap: 0 }}
    >
      {/* ── Vertical signal line ── */}
      <div style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        gap:            0,
        flexShrink:     0,
        width:          24,
        paddingTop:     2,
      }}>
        {/* Node dot */}
        <motion.div
          animate={{
            scale:     hov ? 1.4 : proximity > 0.2 ? 1.2 : 1,
            background: hov ? signal.color : proximity > 0.4 ? signal.color : 'var(--canvas-4)',
            boxShadow:  hov
              ? `0 0 12px ${signal.glow}`
              : proximity > 0.4
                ? `0 0 ${proximity * 10}px ${signal.glow}`
                : 'none',
          }}
          transition={{ duration: 0.25 }}
          style={{
            width:        8, height: 8,
            borderRadius: '50%',
            flexShrink:   0,
            marginTop:    '0.85rem',
          }}
        />

        {/* Vertical line segment */}
        {index < SIGNALS.length - 1 && (
          <div style={{
            flex:     1,
            width:    1,
            marginTop: 4,
            background: hov
              ? `linear-gradient(to bottom, ${signal.color}, var(--canvas-4))`
              : `linear-gradient(to bottom, rgba(200,168,75,${lineGlow * 0.4 + 0.06}), var(--canvas-4))`,
            transition: 'background 0.35s',
            minHeight: expanded ? 80 : 48,
          }} />
        )}
      </div>

      {/* ── Horizontal connector ── */}
      <div style={{
        width:      24,
        height:     1,
        marginTop:  '1.15rem',
        background: hov
          ? `linear-gradient(to right, ${signal.color}, ${signal.color}40)`
          : `rgba(200,168,75,${lineGlow * 0.3 + 0.06})`,
        flexShrink: 0,
        transition: 'background 0.25s',
        alignSelf:  'flex-start',
      }} />

      {/* ── Content block ── */}
      <Tag
        {...linkProps}
        style={{
          display:        'flex',
          flexDirection:  'column',
          flex:           1,
          padding:        '0.65rem 0.9rem',
          borderRadius:   'var(--r-md)',
          background:     hov ? signal.dim : 'transparent',
          border:         `1px solid ${hov ? signal.bdr : 'transparent'}`,
          textDecoration: 'none',
          cursor:         signal.href ? 'pointer' : 'default',
          transition:     'all 0.28s var(--ease-expo)',
          boxShadow:      hov ? `0 0 30px ${signal.glow}` : 'none',
          overflow:       'hidden',
        }}
      >
        {/* Top row: icon + label + arrow */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          gap:            '0.6rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            {/* Icon */}
            <motion.span
              animate={{
                color:     hov ? signal.color : 'var(--t3)',
                scale:     hov ? 1.1 : 1,
              }}
              transition={{ duration: 0.22 }}
              style={{ display: 'flex', flexShrink: 0 }}
            >
              {signal.icon}
            </motion.span>

            {/* Label */}
            <span style={{
              fontFamily:    'var(--font-family-display)',
              fontWeight:    hov ? 700 : 600,
              fontSize:      'clamp(0.95rem, 1.3vw, 1.05rem)',
              letterSpacing: '-0.01em',
              color:         hov ? 'var(--t1)' : 'var(--t2)',
              transition:    'color 0.22s',
              lineHeight:    1,
            }}>
              {signal.label}
            </span>

            {/* Italic action — slides in on hover */}
            <AnimatePresence>
              {hov && (
                <motion.span
                  initial={{ opacity: 0, x: -8, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: 'auto' }}
                  exit={{ opacity: 0, x: -4, width: 0 }}
                  transition={{ duration: 0.22, ease: E }}
                  style={{
                    fontFamily:    'var(--font-family-display)',
                    fontStyle:     'italic',
                    fontWeight:    400,
                    fontSize:      '0.82rem',
                    color:         signal.color,
                    letterSpacing: '-0.005em',
                    whiteSpace:    'nowrap',
                    overflow:      'hidden',
                  }}
                >
                  — {signal.action}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Arrow — appears on hover */}
          {signal.href && (
            <motion.div
              animate={{ opacity: hov ? 1 : 0, x: hov ? 0 : 6, y: hov ? 0 : 6 }}
              transition={{ duration: 0.2 }}
              style={{ color: signal.color, flexShrink: 0 }}
            >
              <ArrowUpRight size={14} aria-hidden="true" />
            </motion.div>
          )}
        </div>

        {/* Expanded detail — handle + note */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{   opacity: 0, height: 0, y: -4 }}
              transition={{ duration: 0.3, ease: E }}
              style={{ overflow: 'hidden', marginTop: '0.55rem' }}
            >
              {/* Handle */}
              <div style={{
                fontFamily:    signal.isGold ? 'var(--font-family-display)' : 'var(--font-family-mono)',
                fontStyle:     signal.isGold ? 'italic' : 'normal',
                fontWeight:    signal.isGold ? 500 : 400,
                fontSize:      'var(--text-sm)',
                color:         signal.color,
                letterSpacing: signal.isGold ? '-0.005em' : '0.04em',
                marginBottom:  '0.25rem',
              }}>
                {signal.handle}
              </div>

              {/* Note + live dot for WhatsApp */}
              <div style={{
                display:    'flex',
                alignItems: 'center',
                gap:        5,
              }}>
                {signal.id === 'whatsapp' && (
                  <span style={{
                    width: 4, height: 4, borderRadius: '50%',
                    background: 'var(--ac)', boxShadow: '0 0 5px var(--ac)',
                    display: 'block', flexShrink: 0,
                    animation: 'pulse-dot 2s ease-in-out infinite',
                  }} />
                )}
                <span style={{
                  fontFamily:    'var(--font-family-mono)',
                  fontSize:      '0.54rem',
                  color:         'var(--t3)',
                  letterSpacing: '0.06em',
                }}>
                  {signal.note}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Tag>
    </motion.div>
  )
})

/* ─────────────────────────────────────────────────────────────
   MORPHING CTA — text transforms on hover
   "Start a Conversation" → "Let's Talk →"
   with liquid glow pulse effect
   ─────────────────────────────────────────────────────────── */
function MorphingCTA({ inView }: { inView: boolean }) {
  const ref    = useRef<HTMLAnchorElement>(null)
  const mx     = useMotionValue(0)
  const my     = useMotionValue(0)
  const smx    = useSpring(mx, { stiffness: 180, damping: 18 })
  const smy    = useSpring(my, { stiffness: 180, damping: 18 })
  const [hov, setHov]   = useState(false)
  const [shim, setShim] = useState(false)
  const [pulse, setPulse] = useState(false)

  const onMM = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current; if (!el) return
    const r  = el.getBoundingClientRect()
    mx.set((e.clientX - r.left - r.width  / 2) * 0.35)
    my.set((e.clientY - r.top  - r.height / 2) * 0.35)
  }, [mx, my])

  const onME = useCallback(() => {
    setHov(true); setShim(true); setPulse(true)
    setTimeout(() => setShim(false), 600)
    setTimeout(() => setPulse(false), 800)
  }, [])

  const onML = useCallback(() => { mx.set(0); my.set(0); setHov(false) }, [mx, my])

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.5, ease: E }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.85rem' }}
    >
      {/* CTA wrapper with aura */}
      <div style={{ position: 'relative' }}>
        {/* Energy aura */}
        <motion.div
          animate={{ scale: pulse ? 1.35 : hov ? 1.15 : 1, opacity: hov ? 1 : 0 }}
          transition={{ duration: pulse ? 0.6 : 0.4 }}
          aria-hidden="true"
          style={{
            position: 'absolute', inset: '-18px',
            borderRadius: 'var(--r-lg)',
            background: 'radial-gradient(ellipse, rgba(200,168,75,0.18), transparent 72%)',
            filter: 'blur(12px)',
            pointerEvents: 'none',
          }}
        />

        <motion.a
          ref={ref}
          href={identity.whatsappUrl}
          target="_blank" rel="noopener noreferrer"
          onMouseMove={onMM} onMouseEnter={onME} onMouseLeave={onML}
          style={{
            x: smx, y: smy,
            display:        'inline-flex',
            alignItems:     'center',
            gap:            10,
            padding:        '0.9rem 2.2rem',
            background:     hov ? 'var(--gold-rich)' : 'var(--gold)',
            color:          '#0A0907',
            borderRadius:   'var(--r-md)',
            textDecoration: 'none',
            transition:     'background 0.25s, box-shadow 0.25s',
            boxShadow:      hov ? 'var(--sh-gd)' : 'none',
            position:       'relative',
            overflow:       'hidden',
            whiteSpace:     'nowrap',
          }}
        >
          <AnimatePresence>
            {shim && (
              <motion.span
                key="s"
                initial={{ x: '-110%' }} animate={{ x: '220%' }} exit={{}}
                transition={{ duration: 0.55, ease: 'linear' }}
                aria-hidden="true"
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)',
                  pointerEvents: 'none',
                }}
              />
            )}
          </AnimatePresence>

          {/* Morphing text */}
          <span style={{
            position: 'relative', zIndex: 1,
            fontFamily:    'var(--font-family-accent)',
            fontWeight:    700,
            fontSize:      '0.85rem',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
          }}>
            <AnimatePresence mode="wait">
              {hov ? (
                <motion.span
                  key="alt"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{   opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: E }}
                  style={{ display: 'block' }}
                >
                  Let's Talk
                </motion.span>
              ) : (
                <motion.span
                  key="default"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{   opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: E }}
                  style={{ display: 'block' }}
                >
                  Start a Conversation
                </motion.span>
              )}
            </AnimatePresence>
          </span>

          <motion.span
            animate={{ x: hov ? 2 : 0, y: hov ? -2 : 0, rotate: hov ? 0 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'relative', zIndex: 1, display: 'flex' }}
          >
            <ArrowUpRight size={14} aria-hidden="true" />
          </motion.span>
        </motion.a>
      </div>

      {/* Availability row */}
      <motion.div
        animate={{ opacity: hov ? 0.9 : 0.45 }}
        transition={{ duration: 0.3 }}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        <span style={{
          width: 5, height: 5, borderRadius: '50%',
          background: 'var(--ac)', boxShadow: '0 0 6px var(--ac)',
          display: 'block', animation: 'pulse-dot 2s ease-in-out infinite',
        }} />
        <span style={{
          fontFamily:    'var(--font-family-mono)',
          fontSize:      '0.54rem',
          color:         'var(--t3)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          Available · Response within 24h · GMT+5
        </span>
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAIN SECTION
   ─────────────────────────────────────────────────────────── */
export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const innerRef   = useRef<HTMLDivElement>(null)
  const rightRef   = useRef<HTMLDivElement>(null)
  const inView     = useInView(innerRef, { once: true, margin: '-60px' })

  /* Track cursor Y relative to right panel for proximity effects */
  const [cursorY, setCursorY] = useState(-999)
  const [panelTop, setPanelTop] = useState(0)

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      const el = rightRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      setPanelTop(r.top)
      setCursorY(e.clientY)
    }
    window.addEventListener('mousemove', fn, { passive: true })
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section-pad"
      style={{
        background: 'var(--canvas-2)',
        position:   'relative',
        overflow:   'hidden',
      }}
    >
      {/* Cursor light */}
      <CursorLight sectionRef={sectionRef} />

      {/* Ambient blobs */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, right: 0,
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(0,255,148,0.02) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: '50%',
        transform: 'translateX(-50%)', width: 200, height: 1,
        background: 'linear-gradient(to right, transparent, var(--ac-bdr), transparent)',
      }} />

      <div className="container-custom" ref={innerRef} style={{ position: 'relative', zIndex: 1 }}>

        {/* ══ MAIN SPLIT GRID ══ */}
        <div
          className="contact-main-grid"
          style={{
            display:             'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            gap:                 'clamp(4rem, 7vw, 7rem)',
            alignItems:          'start',
          }}
        >

          {/* ── LEFT — EDITORIAL CONTENT ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingTop: '0.5rem' }}>

            {/* Section label */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: E }}
            >
              <span className="section-label">// Contact</span>
            </motion.div>

            {/* Giant editorial headline */}
            <div>
              {/* Line 1 — massive white serif */}
              <div style={{ overflow: 'hidden' }}>
                <motion.div
                  initial={{ y: '105%' }}
                  animate={inView ? { y: 0 } : {}}
                  transition={{ duration: 0.75, delay: 0.08, ease: E }}
                >
                  <h2 style={{
                    fontFamily:    'var(--font-family-display)',
                    fontWeight:    800,
                    fontSize:      'clamp(2rem, 3.5vw, 3rem)',
                    letterSpacing: '-0.03em',
                    lineHeight:    0.9,
                    color:         'var(--t1)',
                    margin:        0,
                  }}>
                    Start a
                  </h2>
                </motion.div>
              </div>

              {/* Line 2 — italic gold, same scale */}
              <div style={{ overflow: 'hidden' }}>
                <motion.div
                  initial={{ y: '105%' }}
                  animate={inView ? { y: 0 } : {}}
                  transition={{ duration: 0.75, delay: 0.16, ease: E }}
                >
                  <h2 style={{
                    fontFamily:    'var(--font-family-display)',
                    fontStyle:     'italic',
                    fontWeight:    800,
                    fontSize:      'clamp(2rem, 3.5vw, 3rem)',
                    letterSpacing: '-0.03em',
                    lineHeight:    0.9,
                    color:         'var(--gold)',
                    textShadow:    '0 0 40px var(--gold-glow)',
                    margin:        0,
                  }}>
                    Conversation.
                  </h2>
                </motion.div>
              </div>
            </div>

            {/* Body — Inter light */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.28, ease: E }}
              style={{
                fontFamily:  'var(--font-family-sans)',
                fontWeight:  300,
                fontSize:    'clamp(0.88rem, 1vw, 0.98rem)',
                color:       'var(--t2)',
                lineHeight:  1.85,
                maxWidth:    380,
              }}
            >
              Open to freelance, contract, and full-time roles.{' '}
              <em style={{
                fontFamily:    'var(--font-family-display)',
                fontStyle:     'italic',
                color:         'var(--gold)',
                fontWeight:    500,
                letterSpacing: '-0.005em',
              }}>
                Based in Islamabad
              </em>{' '}
              — delivering precision at every timezone.
            </motion.p>

            {/* Vertical divider line with gold tip */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.0, delay: 0.38, ease: E }}
              style={{
                width:           1,
                height:          64,
                background:      'linear-gradient(to bottom, var(--gold-bdr), var(--canvas-4), transparent)',
                transformOrigin: 'top',
                marginLeft:      2,
              }}
            />

            {/* CTA */}
            <MorphingCTA inView={inView} />
          </div>

          {/* ── RIGHT — SIGNAL LINES ── */}
          <div
            ref={rightRef}
            style={{
              display:       'flex',
              flexDirection: 'column',
              gap:           0,
              paddingTop:    '0.25rem',
            }}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.12, ease: E }}
              style={{
                fontFamily:    'var(--font-family-accent)',
                fontSize:      '0.58rem',
                color:         'var(--t3)',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                marginBottom:  '1.25rem',
                paddingLeft:   48, /* align with content */
              }}
            >
              Direct Channels
            </motion.div>

            {/* Signal lines */}
            {SIGNALS.map((signal, i) => (
              <SignalLine
                key={signal.id}
                signal={signal}
                index={i}
                inView={inView}
                cursorY={cursorY}
                panelTop={panelTop}
              />
            ))}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(0.78); }
        }
        @media (max-width: 860px) {
          .contact-main-grid {
            grid-template-columns: 1fr !important;
            gap: 3.5rem !important;
          }
        }
      `}</style>
    </section>
  )
}