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
import { education } from '@/lib/data'

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
   ─────────────────────────────────────────────────────────── */
const EASE_EXPO   = [0.16, 1, 0.3, 1]    as const
const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const

/* ─────────────────────────────────────────────────────────────
   BADGE CONFIG
   ─────────────────────────────────────────────────────────── */
const BADGE_CFG: Record<string, { color: string; dim: string; bdr: string; emoji: string }> = {
  degree:     { color: 'var(--ac)',   dim: 'var(--ac-dim)',   bdr: 'var(--ac-bdr)',   emoji: '🎓' },
  cert:       { color: 'var(--gold)', dim: 'var(--gold-dim)', bdr: 'var(--gold-bdr)', emoji: '📜' },
  fellowship: { color: 'var(--gold)', dim: 'var(--gold-dim)', bdr: 'var(--gold-bdr)', emoji: '🏛️' },
  course:     { color: 'var(--t2)',   dim: 'var(--canvas-3)', bdr: 'var(--canvas-4)', emoji: '🧠' },
}

/* ─────────────────────────────────────────────────────────────
   HOOK — smooth count-up
   ─────────────────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1900, decimals = 0, enabled = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!enabled) return
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const p    = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 4)
      setVal(parseFloat((ease * target).toFixed(decimals)))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, decimals, enabled])
  return val
}

/* ─────────────────────────────────────────────────────────────
   RADIAL CGPA GAUGE
   SVG circle progress with glow + animated count-up
   ─────────────────────────────────────────────────────────── */
const CGPAGauge = memo(function CGPAGauge({ enabled }: { enabled: boolean }) {
  const val     = useCountUp(3.42, 2000, 2, enabled)
  const maxVal  = 4.0
  const pct     = val / maxVal
  const size    = 148
  const stroke  = 7
  const r       = (size - stroke) / 2
  const circ    = 2 * Math.PI * r
  const dash    = circ * pct
  const gap     = circ - dash
  const cx      = size / 2
  const cy      = size / 2
  // Start from top (-90deg)
  const rotate  = -90

  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            '0.5rem',
    }}>
      {/* SVG gauge */}
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-label={`CGPA: ${val.toFixed(2)} out of 4.00`}
        >
          {/* Track ring */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="var(--canvas-4)"
            strokeWidth={stroke}
          />

          {/* Subtle tick marks at 25% intervals */}
          {[0, 0.25, 0.5, 0.75].map((p, i) => {
            const angle = (p * 2 * Math.PI) - Math.PI / 2
            const outer = r + stroke / 2 + 4
            const inner = r - stroke / 2 - 4
            return (
              <line
                key={i}
                x1={cx + inner * Math.cos(angle)}
                y1={cy + inner * Math.sin(angle)}
                x2={cx + outer * Math.cos(angle)}
                y2={cy + outer * Math.sin(angle)}
                stroke="var(--canvas-5)"
                strokeWidth="1"
              />
            )
          })}

          {/* Progress arc */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${gap}`}
            transform={`rotate(${rotate} ${cx} ${cy})`}
            style={{
              filter:     enabled ? 'drop-shadow(0 0 6px rgba(200,168,75,0.5))' : 'none',
              transition: 'filter 0.3s',
            }}
          />

          {/* Gold end-cap dot */}
          {enabled && pct > 0.01 && (() => {
            const angle = (pct * 2 * Math.PI) - Math.PI / 2
            return (
              <circle
                cx={cx + r * Math.cos(angle)}
                cy={cy + r * Math.sin(angle)}
                r={stroke / 2 + 1}
                fill="var(--gold-rich)"
                style={{ filter: 'drop-shadow(0 0 4px var(--gold))' }}
              />
            )
          })()}

          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="var(--gold)" />
              <stop offset="100%" stopColor="var(--gold-rich)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center value */}
        <div style={{
          position:       'absolute',
          inset:          0,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            '1px',
        }}>
          <span style={{
            fontFamily:    'var(--font-family-display)',
            fontStyle:     'italic',
            fontWeight:    700,
            fontSize:      '1.85rem',
            color:         'var(--gold)',
            lineHeight:    1,
            letterSpacing: '-0.02em',
            textShadow:    '0 0 20px var(--gold-glow)',
          }}>
            {val.toFixed(2)}
          </span>
          <span style={{
            fontFamily:    'var(--font-family-mono)',
            fontSize:      '0.5rem',
            color:         'var(--t3)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            / 4.00
          </span>
        </div>
      </div>

      {/* Label */}
      <div style={{
        fontFamily:    'var(--font-family-accent)',
        fontSize:      '0.56rem',
        color:         'var(--t3)',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
      }}>
        CGPA
      </div>
    </div>
  )
})

/* ─────────────────────────────────────────────────────────────
   BADGE CHIP — premium micro-component
   ─────────────────────────────────────────────────────────── */
function BadgeChip({ type, label }: { type: string; label: string }) {
  const cfg = BADGE_CFG[type] ?? BADGE_CFG.course
  return (
    <div style={{
      display:       'inline-flex',
      alignItems:    'center',
      gap:           5,
      background:    cfg.dim,
      border:        `1px solid ${cfg.bdr}`,
      borderRadius:  100,
      padding:       '0.22rem 0.65rem',
    }}>
      <span style={{ fontSize: '0.7rem' }}>{cfg.emoji}</span>
      <span style={{
        fontFamily:    'var(--font-family-accent)',
        fontSize:      '0.54rem',
        color:         cfg.color,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        fontWeight:    600,
      }}>
        {label}
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   FEATURED DEGREE PANEL — hero-level spotlight
   ─────────────────────────────────────────────────────────── */
const FeaturedPanel = memo(function FeaturedPanel({
  item,
  inView,
}: {
  item:   typeof education[number]
  inView: boolean
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const gaugeRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotX   = useSpring(useTransform(mouseY, [-0.5, 0.5], [ 3.5, -3.5]), { stiffness: 140, damping: 20 })
  const rotY   = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3.5,  3.5]), { stiffness: 140, damping: 20 })

  const [hovered,  setHovered]  = useState(false)
  const [shimmer,  setShimmer]  = useState(false)
  const [gaugeOn,  setGaugeOn]  = useState(false)

  /* Activate gauge on intersection */
  useEffect(() => {
    const el = gaugeRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setGaugeOn(true) },
      { threshold: 0.5 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const onMM = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r  = el.getBoundingClientRect()
    mouseX.set((e.clientX - r.left) / r.width  - 0.5)
    mouseY.set((e.clientY - r.top)  / r.height - 0.5)
  }, [mouseX, mouseY])

  const onME = useCallback(() => {
    setHovered(true)
    setShimmer(true)
    setTimeout(() => setShimmer(false), 700)
  }, [])

  const onML = useCallback(() => {
    mouseX.set(0); mouseY.set(0)
    setHovered(false)
  }, [mouseX, mouseY])

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE_EXPO }}
      style={{
        transformStyle: 'preserve-3d',
        perspective:    1000,
        marginBottom:   '1.25rem',
      }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMM}
        onMouseEnter={onME}
        onMouseLeave={onML}
        style={{ rotateX: rotX, rotateY: rotY }}
      >
        <div style={{
          background:   hovered
            ? 'linear-gradient(145deg, var(--canvas-3), var(--canvas-2))'
            : 'var(--canvas)',
          border:       `1px solid ${hovered ? 'var(--ac-bdr)' : 'var(--canvas-4)'}`,
          /* Upgraded: left accent as gradient, not flat color */
          borderLeft:   `3px solid ${hovered ? 'var(--ac)' : 'rgba(0,255,148,0.35)'}`,
          borderRadius: 'var(--r-xl)',
          padding:      '2.25rem',
          display:      'grid',
          gridTemplateColumns: '1fr auto',
          gap:          '2rem',
          alignItems:   'center',
          position:     'relative',
          overflow:     'hidden',
          transition:   'border-color 0.3s, background 0.3s, box-shadow 0.3s',
          boxShadow:    hovered ? 'var(--sh-ac)' : 'var(--sh-sm)',
        }}
        className="edu-featured-inner"
        >

          {/* Top accent line */}
          <div aria-hidden="true" style={{
            position:   'absolute',
            top: 0, left: '5%', right: '5%',
            height:     '1px',
            background: `linear-gradient(to right, transparent, var(--ac-bdr), transparent)`,
            opacity:    hovered ? 1 : 0.3,
            transition: 'opacity 0.3s',
          }} />

          {/* Shimmer */}
          <AnimatePresence>
            {shimmer && (
              <motion.div
                key="s"
                initial={{ x: '-110%' }}
                animate={{ x: '220%' }}
                exit={{}}
                transition={{ duration: 0.7, ease: 'linear' }}
                aria-hidden="true"
                style={{
                  position:      'absolute', inset: 0,
                  background:    'linear-gradient(90deg, transparent, rgba(0,255,148,0.05), transparent)',
                  pointerEvents: 'none',
                  zIndex:        1,
                }}
              />
            )}
          </AnimatePresence>

          {/* Corner glow */}
          <div aria-hidden="true" style={{
            position:      'absolute',
            top: 0, right: 0,
            width:         120, height: 120,
            background:    'radial-gradient(circle at 100% 0%, var(--ac-glow), transparent 70%)',
            opacity:       hovered ? 1 : 0.4,
            transition:    'opacity 0.3s',
            pointerEvents: 'none',
          }} />

          {/* Left content */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ marginBottom: '1rem' }}>
              <BadgeChip type="degree" label={item.badge} />
            </div>

            {/* Degree — Playfair Display */}
            <h3 style={{
              fontFamily:    'var(--font-family-display)',
              fontWeight:    800,
              fontSize:      'clamp(1.2rem, 2vw, 1.6rem)',
              letterSpacing: '-0.02em',
              lineHeight:    1.05,
              color:         'var(--t1)',
              marginBottom:  '0.4rem',
            }}>
              {item.degree}
            </h3>

            {/* Institution — italic gold serif */}
            <div style={{
              fontFamily:    'var(--font-family-display)',
              fontStyle:     'italic',
              fontWeight:    600,
              fontSize:      'clamp(0.9rem, 1.2vw, 1.05rem)',
              color:         'var(--ac)',
              letterSpacing: '-0.005em',
              marginBottom:  '0.2rem',
            }}>
              {item.school}
            </div>

            {/* Period */}
            <div style={{
              fontFamily:    'var(--font-family-mono)',
              fontSize:      'var(--text-xs)',
              color:         'var(--t3)',
              letterSpacing: '0.08em',
              marginBottom:  '1.25rem',
            }}>
              {item.period}
            </div>

            {/* Description */}
            <p style={{
              fontFamily:  'var(--font-family-sans)',
              fontSize:    'var(--text-sm)',
              color:       'var(--t2)',
              fontWeight:  300,
              lineHeight:  1.82,
              maxWidth:    560,
            }}>
              {item.description.split('Thesis:').map((part, i) =>
                i === 0
                  ? part
                  : (
                    <React.Fragment key="thesis">
                      <em style={{
                        fontFamily:  'var(--font-family-display)',
                        fontStyle:   'italic',
                        color:       'var(--gold)',
                        fontWeight:  500,
                      }}>
                        Thesis:
                      </em>
                      {part}
                    </React.Fragment>
                  )
              )}
            </p>
          </div>

          {/* Right — CGPA Gauge */}
          <div
            ref={gaugeRef}
            style={{
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              justifyContent: 'center',
              padding:        '1.5rem',
              background:     'var(--canvas-2)',
              border:         '1px solid var(--canvas-4)',
              borderRadius:   'var(--r-lg)',
              position:       'relative',
              zIndex:         2,
              minWidth:       170,
            }}
          >
            <CGPAGauge enabled={gaugeOn} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
})

/* ─────────────────────────────────────────────────────────────
   KNOWLEDGE MODULE CARD — non-featured items
   Staggered vertical offsets for visual rhythm
   ─────────────────────────────────────────────────────────── */
const KnowledgeModule = memo(function KnowledgeModule({
  item,
  index,
  inView,
}: {
  item:   typeof education[number]
  index:  number
  inView: boolean
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotX   = useSpring(useTransform(mouseY, [-0.5, 0.5], [ 5, -5]), { stiffness: 180, damping: 22 })
  const rotY   = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5,  5]), { stiffness: 180, damping: 22 })

  const [hovered, setHovered] = useState(false)
  const [shimmer, setShimmer] = useState(false)

  const onMM = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r  = el.getBoundingClientRect()
    mouseX.set((e.clientX - r.left) / r.width  - 0.5)
    mouseY.set((e.clientY - r.top)  / r.height - 0.5)
  }, [mouseX, mouseY])

  const onME = useCallback(() => {
    setHovered(true)
    setShimmer(true)
    setTimeout(() => setShimmer(false), 600)
  }, [])

  const onML = useCallback(() => {
    mouseX.set(0); mouseY.set(0)
    setHovered(false)
  }, [mouseX, mouseY])

  const cfg         = BADGE_CFG[item.badgeType] ?? BADGE_CFG.course
  const isGold      = item.badgeType === 'cert' || item.badgeType === 'fellowship'
  /* Stagger offsets for floating asymmetric grid */
  const yOffsets    = [0, 20, -12, 16, -8, 24]
  const yOffset     = yOffsets[index % yOffsets.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 + Math.abs(yOffset), scale: 0.95 }}
      animate={inView ? { opacity: 1, y: yOffset, scale: 1 } : {}}
      transition={{ duration: 0.65, delay: 0.08 + index * 0.1, ease: EASE_EXPO }}
      style={{
        transformStyle: 'preserve-3d',
        perspective:    800,
      }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMM}
        onMouseEnter={onME}
        onMouseLeave={onML}
        style={{ rotateX: rotX, rotateY: rotY }}
      >
        <div style={{
          background:   hovered
            ? `linear-gradient(145deg, var(--canvas-3), var(--canvas-2))`
            : 'var(--canvas)',
          border:       `1px solid ${hovered ? cfg.bdr : 'var(--canvas-4)'}`,
          borderRadius: 'var(--r-xl)',
          padding:      '1.6rem',
          height:       '100%',
          position:     'relative',
          overflow:     'hidden',
          transition:   'border-color 0.3s, background 0.3s, box-shadow 0.3s',
          boxShadow:    hovered
            ? isGold ? 'var(--sh-gd)' : 'var(--sh-ac)'
            : 'none',
          cursor:       'default',
        }}>

          {/* Top accent line */}
          <div aria-hidden="true" style={{
            position:   'absolute',
            top: 0, left: '6%', right: '6%',
            height:     '1px',
            background: `linear-gradient(to right, transparent, ${cfg.color}, transparent)`,
            opacity:    hovered ? 1 : 0.2,
            transition: 'opacity 0.3s',
          }} />

          {/* Shimmer */}
          <AnimatePresence>
            {shimmer && (
              <motion.div
                key="ms"
                initial={{ x: '-110%' }}
                animate={{ x: '220%' }}
                exit={{}}
                transition={{ duration: 0.6, ease: 'linear' }}
                aria-hidden="true"
                style={{
                  position:      'absolute', inset: 0,
                  background:    `linear-gradient(90deg, transparent, rgba(200,168,75,0.07), transparent)`,
                  pointerEvents: 'none',
                }}
              />
            )}
          </AnimatePresence>

          {/* Corner glow */}
          <div aria-hidden="true" style={{
            position:      'absolute',
            top: 0, right: 0,
            width:         80, height: 80,
            background:    `radial-gradient(circle at 100% 0%, ${cfg.dim}, transparent 70%)`,
            opacity:       hovered ? 1 : 0.4,
            transition:    'opacity 0.3s',
            pointerEvents: 'none',
          }} />

          {/* Background large letter */}
          <div aria-hidden="true" style={{
            position:      'absolute',
            bottom:        '-0.5rem',
            right:         '-0.25rem',
            fontFamily:    'var(--font-family-display)',
            fontStyle:     'italic',
            fontWeight:    800,
            fontSize:      '6rem',
            lineHeight:    1,
            color:         cfg.color,
            opacity:       hovered ? 0.05 : 0.02,
            transition:    'opacity 0.4s',
            userSelect:    'none',
            pointerEvents: 'none',
            letterSpacing: '-0.05em',
          }}>
            {item.badge[0]}
          </div>

          {/* Badge chip */}
          <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
            <BadgeChip type={item.badgeType} label={item.badge} />
          </div>

          {/* Degree title */}
          <h3 style={{
            fontFamily:    'var(--font-family-display)',
            fontWeight:    700,
            fontSize:      'clamp(0.9rem, 1.2vw, 1.05rem)',
            letterSpacing: '-0.01em',
            lineHeight:    1.2,
            color:         hovered ? 'var(--t1)' : 'var(--t2)',
            marginBottom:  '0.3rem',
            transition:    'color 0.22s',
            position:      'relative',
            zIndex:        1,
          }}>
            {item.degree}
          </h3>

          {/* Institution */}
          <div style={{
            fontFamily:    'var(--font-family-display)',
            fontStyle:     'italic',
            fontWeight:    500,
            fontSize:      'var(--text-xs)',
            color:         hovered ? cfg.color : 'var(--t3)',
            letterSpacing: '-0.005em',
            marginBottom:  '0.15rem',
            transition:    'color 0.22s',
            position:      'relative',
            zIndex:        1,
          }}>
            {item.school}
          </div>

          {/* Period */}
          <div style={{
            fontFamily:    'var(--font-family-mono)',
            fontSize:      '0.54rem',
            color:         'var(--t3)',
            letterSpacing: '0.08em',
            marginBottom:  '1rem',
            position:      'relative',
            zIndex:        1,
          }}>
            {item.period}
          </div>

          {/* Description */}
          <p style={{
            fontFamily:  'var(--font-family-sans)',
            fontSize:    'var(--text-sm)',
            color:       'var(--t2)',
            fontWeight:  300,
            lineHeight:  1.75,
            position:    'relative',
            zIndex:      1,
          }}>
            {item.description}
          </p>

          {/* Bottom bar */}
          <motion.div
            animate={{ scaleX: hovered ? 1 : 0 }}
            initial={{ scaleX: 0 }}
            transition={{ duration: 0.35, ease: EASE_EXPO }}
            aria-hidden="true"
            style={{
              position:        'absolute',
              bottom: 0, left: '6%', right: '6%',
              height:          '1.5px',
              background:      `linear-gradient(to right, transparent, ${cfg.color}, transparent)`,
              transformOrigin: 'center',
              pointerEvents:   'none',
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
})

/* ─────────────────────────────────────────────────────────────
   MAIN SECTION
   ─────────────────────────────────────────────────────────── */
export default function EducationSection() {
  const sectionRef   = useRef<HTMLElement>(null)
  const headerRef    = useRef<HTMLDivElement>(null)
  const inView       = useInView(sectionRef, { once: true, margin: '-80px' })
  const headerInView = useInView(headerRef, { once: true })

  const featured = education.find(e => e.featured)!
  const rest     = education.filter(e => !e.featured)

  return (
    <section
      id="education"
      ref={sectionRef}
      className="section-pad"
      style={{
        background: 'var(--canvas-2)',
        position:   'relative',
        overflow:   'hidden',
      }}
    >

      {/* ── Ambient layers ── */}
      <div aria-hidden="true" style={{
        position:      'absolute',
        inset:         0,
        background:    'radial-gradient(ellipse 50% 35% at 5% 40%, rgba(0,255,148,0.015) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position:      'absolute',
        inset:         0,
        background:    'radial-gradient(ellipse 45% 40% at 95% 65%, rgba(200,168,75,0.018) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position:   'absolute',
        top: 0, left: '50%',
        transform:  'translateX(-50%)',
        width:      200, height: 1,
        background: 'linear-gradient(to right, transparent, var(--gold-bdr), transparent)',
      }} />

      <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Section Header ── */}
        <div ref={headerRef} style={{ marginBottom: '3.5rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: EASE_EXPO }}
            style={{ marginBottom: '0.7rem' }}
          >
            <span className="section-label">// Education</span>
          </motion.div>

          <div style={{ overflow: 'hidden' }}>
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={headerInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.08, ease: EASE_EXPO }}
            >
              <span style={{
                fontFamily:    'var(--font-family-display)',
                fontWeight:    800,
                fontSize:      'clamp(2rem, 3.5vw, 3rem)',
                letterSpacing: '-0.025em',
                lineHeight:    0.95,
                color:         'var(--t1)',
                display:       'block',
              }}>
                Academic
              </span>
            </motion.div>
            <div style={{ overflow: 'hidden' }}>
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={headerInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.15, ease: EASE_EXPO }}
              >
                <span style={{
                  fontFamily:    'var(--font-family-display)',
                  fontStyle:     'italic',
                  fontWeight:    800,
                  fontSize:      'clamp(2rem, 3.5vw, 3rem)',
                  letterSpacing: '-0.025em',
                  lineHeight:    0.95,
                  color:         'var(--gold)',
                  display:       'block',
                }}>
                  foundation.
                </span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Featured degree panel ── */}
        <FeaturedPanel item={featured} inView={inView} />

        {/* ── Knowledge modules — asymmetric staggered grid ── */}
        <div
          className="edu-modules-grid"
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap:                 '1.2rem',
            alignItems:          'start',
            /* Extra bottom padding to accommodate downward offsets */
            paddingBottom:       '1.5rem',
          }}
        >
          {rest.map((item, i) => (
            <KnowledgeModule
              key={item.id}
              item={item}
              index={i}
              inView={inView}
            />
          ))}
        </div>

      </div>

      <style>{`
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(0.78); }
        }
        @media (max-width: 900px) {
          .edu-modules-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .edu-modules-grid {
            grid-template-columns: 1fr !important;
            padding-bottom: 0 !important;
            
          }
          .edu-featured-inner {
            grid-template-columns: 1fr !important;
          }
          /* Hide stagger offsets on mobile — cards stack cleanly */
          .edu-modules-grid > div {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  )
}