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
import { awards } from '@/lib/data'

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
   ─────────────────────────────────────────────────────────── */
const EASE_EXPO   = [0.16, 1, 0.3, 1]    as const
const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const

/* ─────────────────────────────────────────────────────────────
   GLOBAL CURSOR LIGHT — follows mouse, creates spotlight feel
   ─────────────────────────────────────────────────────────── */
function CursorLight({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const x = useMotionValue(-300)
  const y = useMotionValue(-300)
  const sx = useSpring(x, { stiffness: 80, damping: 20 })
  const sy = useSpring(y, { stiffness: 80, damping: 20 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const sec = sectionRef.current
      if (!sec) return
      const rect = sec.getBoundingClientRect()
      if (e.clientY < rect.top || e.clientY > rect.bottom) return
      x.set(e.clientX - rect.left)
      y.set(e.clientY - rect.top)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [sectionRef, x, y])

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position:      'absolute',
        left:          0, top: 0,
        x:             sx,
        y:             sy,
        translateX:    '-50%',
        translateY:    '-50%',
        width:         500,
        height:        500,
        borderRadius:  '50%',
        background:    'radial-gradient(circle, rgba(200,168,75,0.055) 0%, rgba(0,255,148,0.02) 45%, transparent 70%)',
        pointerEvents: 'none',
        zIndex:        0,
        filter:        'blur(4px)',
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────
   AWARD CARD — Spotlight variant (featured / center)
   ─────────────────────────────────────────────────────────── */
const SpotlightCard = memo(function SpotlightCard({
  award,
  isActive,
  onActivate,
  index,
  inView,
}: {
  award:      typeof awards[number]
  isActive:   boolean
  onActivate: () => void
  index:      number
  inView:     boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX  = useMotionValue(0)
  const mouseY  = useMotionValue(0)
  const rotX    = useSpring(useTransform(mouseY, [-0.5, 0.5], [ 7, -7]), { stiffness: 180, damping: 22 })
  const rotY    = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7,  7]), { stiffness: 180, damping: 22 })

  const [hovered,  setHovered]  = useState(false)
  const [shimmer,  setShimmer]  = useState(false)
  const [edgePct,  setEdgePct]  = useState(0)

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el   = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width  - 0.5)
    mouseY.set((e.clientY - rect.top)  / rect.height - 0.5)
  }, [mouseX, mouseY])

  const onMouseEnter = useCallback(() => {
    setHovered(true)
    setShimmer(true)
    setTimeout(() => setShimmer(false), 600)
  }, [])

  const onMouseLeave = useCallback(() => {
    mouseX.set(0); mouseY.set(0)
    setHovered(false)
  }, [mouseX, mouseY])

  /* Animated edge fill on hover */
  useEffect(() => {
    let raf: number
    if (hovered) {
      const step = () => {
        setEdgePct(p => {
          if (p >= 100) return 100
          raf = requestAnimationFrame(step)
          return p + 4
        })
      }
      raf = requestAnimationFrame(step)
    } else {
      const step = () => {
        setEdgePct(p => {
          if (p <= 0) return 0
          raf = requestAnimationFrame(step)
          return p - 6
        })
      }
      raf = requestAnimationFrame(step)
    }
    return () => cancelAnimationFrame(raf)
  }, [hovered])

  const isActive2 = isActive || hovered

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={inView
        ? { opacity: 1, y: 0, scale: isActive ? 1 : 0.97 }
        : { opacity: 0, y: 24, scale: 0.96 }
      }
      transition={{ duration: 0.6, delay: index * 0.09, ease: EASE_EXPO }}
      onClick={onActivate}
      style={{
        transformStyle: 'preserve-3d',
        perspective:    900,
        cursor:         'pointer',
        height:         '100%',
      }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          rotateX: rotX,
          rotateY: rotY,
          height:  '100%',
        }}
      >
        <div style={{
          background:   isActive2
            ? 'linear-gradient(145deg, var(--canvas-3), var(--canvas-2))'
            : 'var(--canvas-2)',
          border:       `1px solid ${
            isActive
              ? 'var(--gold)'
              : hovered ? 'var(--gold-bdr)' : 'var(--canvas-4)'
          }`,
          borderRadius: 'var(--r-xl)',
          padding:      '2rem',
          height:       '100%',
          position:     'relative',
          overflow:     'hidden',
          transition:   'border-color 0.3s, background 0.3s, box-shadow 0.3s',
          boxShadow:    isActive
            ? 'var(--sh-gd)'
            : hovered ? '0 8px 32px rgba(200,168,75,0.1)' : 'var(--sh-sm)',
          display:      'flex',
          flexDirection: 'column',
          gap:           '0',
        }}>

          {/* Animated left edge fill */}
          <div aria-hidden="true" style={{
            position:     'absolute',
            left: 0, top: 0,
            width:        '2.5px',
            height:       `${edgePct}%`,
            background:   'linear-gradient(to bottom, var(--gold), var(--gold-rich))',
            borderRadius: '0 0 2px 2px',
            boxShadow:    edgePct > 0 ? '0 0 8px var(--gold-glow)' : 'none',
            transition:   'box-shadow 0.2s',
          }} />

          {/* Top highlight line */}
          <div aria-hidden="true" style={{
            position:   'absolute',
            top: 0, left: '8%', right: '8%',
            height:     '1px',
            background: isActive2
              ? 'linear-gradient(to right, transparent, var(--gold), transparent)'
              : 'transparent',
            transition: 'background 0.35s',
          }} />

          {/* Shimmer sweep */}
          <AnimatePresence>
            {shimmer && (
              <motion.div
                key="shimmer"
                initial={{ x: '-110%' }}
                animate={{ x: '220%' }}
                exit={{}}
                transition={{ duration: 0.6, ease: 'linear' }}
                aria-hidden="true"
                style={{
                  position:      'absolute', inset: 0,
                  background:    'linear-gradient(90deg, transparent, rgba(200,168,75,0.08), transparent)',
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
            width:         100, height: 100,
            background:    isActive2
              ? 'radial-gradient(circle at 100% 0%, var(--gold-dim), transparent 70%)'
              : 'transparent',
            transition:    'background 0.35s',
            pointerEvents: 'none',
          }} />

          {/* Bottom-right inner glow */}
          <div aria-hidden="true" style={{
            position:      'absolute',
            bottom: 0, right: 0,
            width:         80, height: 80,
            background:    isActive
              ? 'radial-gradient(circle at 100% 100%, rgba(200,168,75,0.06), transparent 70%)'
              : 'transparent',
            transition:    'background 0.4s',
            pointerEvents: 'none',
          }} />

          {/* Year chip — top right */}
          <div style={{
            position:     'absolute',
            top:          '1.2rem',
            right:        '1.25rem',
            fontFamily:   'var(--font-family-mono)',
            fontSize:     'var(--text-label)',
            color:        isActive2 ? 'var(--gold)' : 'var(--t3)',
            letterSpacing: '0.1em',
            background:   isActive2 ? 'var(--gold-dim)' : 'transparent',
            border:       isActive2 ? '1px solid var(--gold-bdr)' : '1px solid transparent',
            padding:      '2px 8px',
            borderRadius: 'var(--r-xs)',
            transition:   'all 0.25s',
            zIndex:        2,
          }}>
            {award.year}
          </div>

          {/* Icon */}
          <motion.div
            animate={{ scale: isActive2 ? 1.08 : 1, y: isActive2 ? -2 : 0 }}
            transition={{ duration: 0.3, ease: EASE_SPRING }}
            style={{
              fontSize:    '2.2rem',
              marginBottom: '1.3rem',
              lineHeight:  1,
              filter:      isActive2
                ? 'drop-shadow(0 3px 12px rgba(200,168,75,0.45))'
                : 'drop-shadow(0 2px 6px rgba(200,168,75,0.2))',
              zIndex:       2,
              position:    'relative',
            }}
            aria-hidden="true"
          >
            {award.icon}
          </motion.div>

          {/* Title */}
          <h3 style={{
            fontFamily:    'var(--font-family-display)',
            fontWeight:    700,
            fontSize:      'clamp(0.92rem, 1.3vw, 1.1rem)',
            letterSpacing: '-0.01em',
            lineHeight:    1.2,
            color:         isActive2 ? 'var(--t1)' : 'var(--t2)',
            marginBottom:  '0.75rem',
            paddingRight:  '2.5rem',
            transition:    'color 0.25s',
            position:      'relative',
            zIndex:        2,
          }}>
            {award.title}
          </h3>

          {/* Description */}
          <AnimatePresence>
            {isActive && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{   opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: EASE_EXPO }}
                style={{
                  fontFamily:  'var(--font-family-sans)',
                  fontSize:    'var(--text-sm)',
                  color:       'var(--t2)',
                  fontWeight:  300,
                  lineHeight:  1.78,
                  overflow:    'hidden',
                  position:    'relative',
                  zIndex:      2,
                }}
              >
                {award.description}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Always-visible short description */}
          {!isActive && (
            <p style={{
              fontFamily:  'var(--font-family-sans)',
              fontSize:    'var(--text-sm)',
              color:       'var(--t3)',
              fontWeight:  300,
              lineHeight:  1.7,
              overflow:    'hidden',
              display:     '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
              position:    'relative',
              zIndex:       2,
            }}>
              {award.description}
            </p>
          )}

          {/* "Active" indicator dot */}
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                position:     'absolute',
                bottom:       '1.1rem',
                right:        '1.25rem',
                width:        7, height: 7,
                borderRadius: '50%',
                background:   'var(--gold)',
                boxShadow:    '0 0 10px var(--gold-glow)',
              }}
            />
          )}

          {/* Expand hint */}
          {!isActive && (
            <motion.div
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position:      'absolute',
                bottom:        '1.1rem',
                right:         '1.25rem',
                fontFamily:    'var(--font-family-mono)',
                fontSize:      '0.5rem',
                color:         'var(--gold)',
                letterSpacing: '0.1em',
                zIndex:        2,
              }}
            >
              tap to expand
            </motion.div>
          )}

          {/* Bottom bar */}
          <motion.div
            animate={{ scaleX: isActive2 ? 1 : 0 }}
            initial={{ scaleX: 0 }}
            transition={{ duration: 0.35, ease: EASE_EXPO }}
            aria-hidden="true"
            style={{
              position:        'absolute',
              bottom: 0, left: '8%', right: '8%',
              height:          '1.5px',
              background:      'linear-gradient(to right, transparent, var(--gold), transparent)',
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
   FEATURED STAT ROW — spans below the grid
   ─────────────────────────────────────────────────────────── */
function AwardsMeta({ inView }: { inView: boolean }) {
  const stats = [
    { val: awards.length.toString(), label: 'Total Awards'  },
    { val: '2019',                   label: 'First Award'   },
    { val: '2021',                   label: 'Latest Award'  },
    { val: '3',                      label: 'Institutions'  },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.55, ease: EASE_EXPO }}
      style={{
        marginTop:    '2.5rem',
        display:      'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap:          '1px',
        background:   'var(--canvas-4)',
        borderRadius: 'var(--r-lg)',
        overflow:     'hidden',
        border:       '1px solid var(--canvas-4)',
      }}
      className="awards-meta-grid"
    >
      {stats.map(({ val, label }, i) => (
        <div
          key={label}
          style={{
            background: 'var(--canvas-2)',
            padding:    '1.2rem 1.4rem',
            display:    'flex',
            flexDirection: 'column',
            gap:        '0.2rem',
          }}
        >
          <span style={{
            fontFamily:    'var(--font-family-display)',
            fontStyle:     i % 2 === 0 ? 'italic' : 'normal',
            fontWeight:    700,
            fontSize:      'clamp(1.4rem, 2vw, 1.8rem)',
            color:         i % 2 === 0 ? 'var(--gold)' : 'var(--t1)',
            letterSpacing: '-0.02em',
            lineHeight:    1,
          }}>
            {val}
          </span>
          <span style={{
            fontFamily:    'var(--font-family-mono)',
            fontSize:      '0.56rem',
            color:         'var(--t3)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            {label}
          </span>
        </div>
      ))}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAIN SECTION
   ─────────────────────────────────────────────────────────── */
export default function AwardsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)
  const inView     = useInView(sectionRef, { once: true, margin: '-80px' })
  const headerInView = useInView(headerRef, { once: true })

  const [activeId, setActiveId] = useState<string>(awards[0]?.id ?? '')

  return (
    <section
      id="awards"
      ref={sectionRef}
      className="section-pad"
      style={{
        background: 'var(--canvas)',
        position:   'relative',
        overflow:   'hidden',
      }}
    >

      {/* Cursor light effect */}
      <CursorLight sectionRef={sectionRef} />

      {/* Ambient layers */}
      <div aria-hidden="true" style={{
        position:      'absolute', inset: 0,
        background:    'radial-gradient(ellipse 55% 40% at 50% 30%, rgba(200,168,75,0.03) 0%, transparent 65%)',
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

        {/* ── Header ── */}
        <div ref={headerRef} style={{ marginBottom: '3.5rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: EASE_EXPO }}
            style={{ marginBottom: '0.7rem' }}
          >
            <span className="section-label">// Awards & Recognition</span>
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
                Recognition
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
                  earned.
                </span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Awards Grid — spotlight system ── */}
        <div
          className="awards-grid"
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap:                 '1.2rem',
            alignItems:          'start',
          }}
        >
          {awards.map((award, i) => (
            <SpotlightCard
              key={award.id}
              award={award}
              index={i}
              isActive={activeId === award.id}
              onActivate={() => setActiveId(award.id)}
              inView={inView}
            />
          ))}
        </div>

        {/* ── Meta stats ── */}
        <AwardsMeta inView={inView} />

      </div>

      <style>{`
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(0.78); }
        }
        @media (max-width: 900px) {
          .awards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 560px) {
          .awards-grid {
            grid-template-columns: 1fr !important;
          }
          .awards-meta-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}