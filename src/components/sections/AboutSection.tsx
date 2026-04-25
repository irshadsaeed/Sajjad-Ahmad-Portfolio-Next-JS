'use client'

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  memo,
} from 'react'
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import { identity } from '@/lib/data'

/* ─────────────────────────────────────────────────────────────
   EASE CONSTANTS
   ─────────────────────────────────────────────────────────── */
const EASE_EXPO   = [0.16, 1, 0.3, 1]    as const
const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const

/* ─────────────────────────────────────────────────────────────
   FEATURE DATA
   ─────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinejoin="round" strokeLinecap="round"/>
      </svg>
    ),
    title:   'Performance First',
    body:    'Sub-second load targets, intelligent caching layers, and lean database queries baked into every deliverable.',
    accentColor: 'var(--ac)',
    accentDim:   'var(--ac-dim)',
    accentBdr:   'var(--ac-bdr)',
    offset:  { x: 0, y: 0 },
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinejoin="round" strokeLinecap="round"/>
      </svg>
    ),
    title:   'Security Hardened',
    body:    'Auth systems, input validation, and WordPress hardening built into every project from day one.',
    accentColor: 'var(--gold)',
    accentDim:   'var(--gold-dim)',
    accentBdr:   'var(--gold-bdr)',
    offset:  { x: 0, y: 28 },
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <polyline points="16 18 22 12 16 6" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="8 6 2 12 8 18"   strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title:   'Clean Code',
    body:    'Documented, testable, maintainable. Code the next developer will actually thank you for.',
    accentColor: 'var(--ac)',
    accentDim:   'var(--ac-dim)',
    accentBdr:   'var(--ac-bdr)',
    offset:  { x: 0, y: -12 },
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeLinecap="round"/>
      </svg>
    ),
    title:   'Global Reach',
    body:    'Based in Islamabad — delivering for clients across North America, Europe, and the Gulf.',
    accentColor: 'var(--gold)',
    accentDim:   'var(--gold-dim)',
    accentBdr:   'var(--gold-bdr)',
    offset:  { x: 0, y: 16 },
  },
] as const

/* ─────────────────────────────────────────────────────────────
   STAT ITEMS for the data panel
   ─────────────────────────────────────────────────────────── */
const STATS = [
  { label: 'Location', value: identity.location,        isGold: false },
  { label: 'CGPA',     value: identity.cgpa + ' / 4.00 — UET Taxila', isGold: true  },
  { label: 'Status',   value: identity.status,           isGold: true  },
  { label: 'Email',    value: identity.email,             isGold: false },
] as const

/* ─────────────────────────────────────────────────────────────
   3D FEATURE CARD
   Glassmorphism + tilt + accent glow
   ─────────────────────────────────────────────────────────── */
const FeatureCard = memo(function FeatureCard({
  feat,
  index,
  inView,
}: {
  feat:   typeof FEATURES[number]
  index:  number
  inView: boolean
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotX   = useSpring(useTransform(mouseY, [-0.5, 0.5], [ 6, -6]), { stiffness: 200, damping: 24 })
  const rotY   = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6,  6]), { stiffness: 200, damping: 24 })
  const [hovered, setHovered] = useState(false)

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el   = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width  - 0.5)
    mouseY.set((e.clientY - rect.top)  / rect.height - 0.5)
  }, [mouseX, mouseY])

  const onMouseLeave = useCallback(() => {
    mouseX.set(0); mouseY.set(0); setHovered(false)
  }, [mouseX, mouseY])

  const isGold   = feat.accentColor === 'var(--gold)'
  const delay    = 0.1 + index * 0.1

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: feat.offset.y, scale: 1 } : {}}
      transition={{ duration: 0.65, delay, ease: EASE_EXPO }}
      style={{
        transformStyle: 'preserve-3d',
        perspective:    800,
      }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onMouseEnter={() => setHovered(true)}
        style={{
          rotateX:        rotX,
          rotateY:        rotY,
          transformStyle: 'preserve-3d',
        }}
      >
        <div style={{
          position:     'relative',
          background:   hovered
            ? `linear-gradient(135deg, var(--canvas-3), var(--canvas-2))`
            : 'var(--canvas-2)',
          border:       `1px solid ${hovered ? feat.accentBdr : 'var(--canvas-4)'}`,
          borderRadius: 'var(--r-lg)',
          padding:      '1.75rem',
          overflow:     'hidden',
          transition:   'border-color 0.3s, background 0.3s',
          boxShadow:    hovered
            ? isGold ? 'var(--sh-gd)' : 'var(--sh-ac)'
            : 'var(--sh-sm)',
          cursor:       'default',
          height:       '100%',
        }}>

          {/* Inner top highlight line */}
          <div aria-hidden="true" style={{
            position:   'absolute',
            top: 0, left: '10%', right: '10%',
            height:     '1px',
            background: hovered
              ? `linear-gradient(to right, transparent, ${feat.accentColor}, transparent)`
              : 'transparent',
            transition: 'background 0.3s',
          }} />

          {/* Radial glow on hover */}
          {hovered && (
            <div aria-hidden="true" style={{
              position:      'absolute',
              inset:         0,
              background:    `radial-gradient(ellipse at 50% 0%, ${feat.accentDim}, transparent 70%)`,
              pointerEvents: 'none',
              borderRadius:  'var(--r-lg)',
            }} />
          )}

          {/* Corner accent */}
          <div aria-hidden="true" style={{
            position:      'absolute',
            top: 0, right: 0,
            width:         70, height: 70,
            background:    hovered
              ? `radial-gradient(circle at 100% 0%, ${feat.accentDim}, transparent 70%)`
              : 'transparent',
            transition:    'background 0.3s',
            pointerEvents: 'none',
          }} />

          {/* Icon box */}
          <div style={{
            width:          '2.4rem',
            height:         '2.4rem',
            borderRadius:   'var(--r-sm)',
            background:     feat.accentDim,
            border:         `1px solid ${feat.accentBdr}`,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            color:          feat.accentColor,
            marginBottom:   '1.35rem',
            transition:     'transform 0.25s var(--ease-expo)',
            transform:      hovered ? 'scale(1.08) translateY(-1px)' : 'scale(1)',
            position:       'relative',
            zIndex:         1,
          }}>
            {feat.icon}
          </div>

          {/* Title — Playfair */}
          <h3 style={{
            fontFamily:    'var(--font-family-display)',
            fontWeight:    700,
            fontSize:      'clamp(0.92rem, 1.1vw, 1.05rem)',
            letterSpacing: '-0.01em',
            color:         'var(--t1)',
            marginBottom:  '0.65rem',
            lineHeight:    1.2,
            position:      'relative',
            zIndex:        1,
          }}>
            {feat.title}
          </h3>

          {/* Body */}
          <p style={{
            fontFamily:  'var(--font-family-sans)',
            fontSize:    'var(--text-sm)',
            color:       'var(--t2)',
            fontWeight:  300,
            lineHeight:  1.75,
            position:    'relative',
            zIndex:      1,
          }}>
            {feat.body}
          </p>

          {/* Bottom accent bar */}
          <motion.div
            animate={{ scaleX: hovered ? 1 : 0 }}
            initial={{ scaleX: 0 }}
            transition={{ duration: 0.3, ease: EASE_EXPO }}
            aria-hidden="true"
            style={{
              position:        'absolute',
              bottom: 0, left: '8%', right: '8%',
              height:          '1.5px',
              background:      `linear-gradient(to right, transparent, ${feat.accentColor}, transparent)`,
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
   DATA PANEL — dashboard-style info block
   ─────────────────────────────────────────────────────────── */
function DataPanel({ inView }: { inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.38, ease: EASE_EXPO }}
      style={{
        background:   'var(--canvas-2)',
        border:       '1px solid var(--canvas-4)',
        borderRadius: 'var(--r-lg)',
        overflow:     'hidden',
        position:     'relative',
      }}
    >
      {/* Gold top accent */}
      <div aria-hidden="true" style={{
        position:   'absolute',
        top: 0, left: '8%', right: '8%',
        height:     '1px',
        background: 'linear-gradient(to right, transparent, var(--gold-bdr), transparent)',
      }} />

      {/* Panel header */}
      <div style={{
        padding:      '0.85rem 1.25rem',
        borderBottom: '1px solid var(--canvas-4)',
        display:      'flex',
        alignItems:   'center',
        gap:          6,
        background:   'linear-gradient(to bottom, var(--canvas-3), var(--canvas-2))',
      }}>
        {/* Traffic lights */}
        {['var(--red-dot)', 'var(--yel-dot)', 'var(--ac)'].map((c, i) => (
          <span key={i} aria-hidden="true" style={{
            width:        8, height: 8,
            borderRadius: '50%',
            background:   c,
            display:      'block',
            boxShadow:    `0 0 5px ${c}50`,
          }} />
        ))}
        <span style={{
          fontFamily:    'var(--font-family-mono)',
          fontSize:      '0.58rem',
          color:         'var(--t3)',
          letterSpacing: '0.06em',
          marginLeft:    6,
        }}>
          sajjad.json
        </span>
      </div>

      {/* Data rows */}
      <div style={{ padding: '0.5rem 0' }}>
        {STATS.map(({ label, value, isGold }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.42 + i * 0.07, ease: EASE_EXPO }}
            style={{
              display:    'flex',
              alignItems: 'baseline',
              gap:        '1rem',
              padding:    '0.55rem 1.25rem',
              borderBottom: i < STATS.length - 1 ? '1px solid var(--canvas-4)' : 'none',
            }}
          >
            {/* Key */}
            <span style={{
              fontFamily:    'var(--font-family-mono)',
              fontSize:      'var(--text-label)',
              color:         'var(--ac)',
              letterSpacing: '0.1em',
              minWidth:      72,
              flexShrink:    0,
            }}>
              {label}
            </span>
            {/* Value */}
            <span style={{
              fontFamily:    isGold ? 'var(--font-family-display)' : 'var(--font-family-sans)',
              fontStyle:     isGold ? 'italic' : 'normal',
              fontWeight:    isGold ? 600 : 300,
              fontSize:      'var(--text-sm)',
              color:         isGold ? 'var(--gold)' : 'var(--t2)',
              letterSpacing: isGold ? '-0.005em' : '0',
            }}>
              {value}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   NARRATIVE PARAGRAPH — with inline accent spans
   ─────────────────────────────────────────────────────────── */
function NarrativeParagraph({
  children,
  delay,
  inView,
}: {
  children: React.ReactNode
  delay:    number
  inView:   boolean
}) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: EASE_EXPO }}
      style={{
        fontFamily:  'var(--font-family-sans)',
        fontWeight:  300,
        fontSize:    'var(--text-body)',
        color:       'var(--t2)',
        lineHeight:  1.88,
        marginBottom: '1.15rem',
      }}
    >
      {children}
    </motion.p>
  )
}

/* ─────────────────────────────────────────────────────────────
   INLINE ACCENT — gold italic serif for key phrases
   ─────────────────────────────────────────────────────────── */
function Gold({ children }: { children: React.ReactNode }) {
  return (
    <em style={{
      fontFamily:    'var(--font-family-display)',
      fontStyle:     'italic',
      fontWeight:    600,
      color:         'var(--gold)',
      letterSpacing: '-0.005em',
    }}>
      {children}
    </em>
  )
}

function Accent({ children }: { children: React.ReactNode }) {
  return (
    <strong style={{
      color:      'var(--t1)',
      fontWeight: 500,
    }}>
      {children}
    </strong>
  )
}

/* ─────────────────────────────────────────────────────────────
   ABOUT SECTION
   ─────────────────────────────────────────────────────────── */
export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView     = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-pad"
      style={{
        background: 'var(--canvas)',
        position:   'relative',
        overflow:   'hidden',
      }}
    >

      {/* ── Ambient depth ── */}
      <div aria-hidden="true" style={{
        position:      'absolute',
        top:           '20%',
        left:          '-10%',
        width:         '60vw',
        height:        '60vw',
        borderRadius:  '50%',
        background:    'radial-gradient(circle, rgba(200,168,75,0.024) 0%, transparent 65%)',
        pointerEvents: 'none',
        filter:        'blur(40px)',
      }} />
      <div aria-hidden="true" style={{
        position:      'absolute',
        top: 0, left: '50%',
        transform:     'translateX(-50%)',
        width:         200, height: 1,
        background:    'linear-gradient(to right, transparent, var(--ac-bdr), transparent)',
      }} />

      <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
        <div
          className="about-grid"
          style={{
            display:           'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
            gap:               'clamp(3rem,6vw,5.5rem)',
            alignItems:        'start',
          }}
        >

          {/* ══ LEFT — NARRATIVE ════════════════════════ */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>

            {/* Section label */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease: EASE_EXPO }}
              style={{ marginBottom: '0.7rem' }}
            >
              <span className="section-label">// About</span>
            </motion.div>

            {/* Heading — Playfair serif split */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.06, ease: EASE_EXPO }}
              style={{ marginBottom: '2rem', overflow: 'hidden' }}
            >
              <div style={{
                fontFamily:    'var(--font-family-display)',
                fontWeight:    800,
                fontSize:      'clamp(2rem, 3.5vw, 3rem)',
                letterSpacing: '-0.025em',
                lineHeight:    0.95,
                color:         'var(--t1)',
              }}>
                Turning ideas
              </div>
              {/* Italic gold line — reference image pattern */}
              <div style={{
                fontFamily:    'var(--font-family-display)',
                fontStyle:     'italic',
                fontWeight:    800,
                fontSize:      'clamp(2rem, 3.5vw, 3rem)',
                letterSpacing: '-0.025em',
                lineHeight:    0.95,
                color:         'var(--gold)',
                marginTop:     '0.06em',
              }}>
                into reality.
              </div>
            </motion.div>

            {/* Narrative paragraphs */}
            <NarrativeParagraph delay={0.14} inView={inView}>
              {"I'm a WordPress and Laravel developer with "}
              <Accent>3+ years</Accent>
              {" of professional experience building production-grade web applications. My work spans custom plugin development, LMS implementations, RESTful APIs, and full eCommerce ecosystems."}
            </NarrativeParagraph>

            <NarrativeParagraph delay={0.22} inView={inView}>
              {"Holding a "}
              <Accent>BS Computer Science (Honours)</Accent>
              {" from UET Taxila with a CGPA of "}
              <Gold>3.42 / 4.00</Gold>
              {", I bring academic rigour to every practical challenge. My thesis on Brain Tumor Detection using Deep Neural Networks was selected for the NUML Open House 2021."}
            </NarrativeParagraph>

            <NarrativeParagraph delay={0.3} inView={inView}>
              {"Based in "}
              <Gold>Islamabad, Pakistan</Gold>
              {" — I work across timezones for clients who demand precision, punctuality, and code that scales."}
            </NarrativeParagraph>

            {/* Data panel */}
            <DataPanel inView={inView} />

          </div>

          {/* ══ RIGHT — FEATURE CARDS ═══════════════════ */}
          <div style={{
            display:             'grid',
            gridTemplateColumns: '1fr 1fr',
            gap:                 '1.6rem',
            alignItems:          'start',
            paddingTop:          'clamp(0px, 2vw, 28px)',
          }}>
            {FEATURES.map((feat, i) => (
              <FeatureCard
                key={feat.title}
                feat={feat}
                index={i}
                inView={inView}
              />
            ))}

            {/* Floating stats pod — spans full width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.5, ease: EASE_EXPO }}
              style={{ gridColumn: '1 / -1' }}
            >
              <div style={{
                background:   'var(--canvas-2)',
                border:       '1px solid var(--canvas-4)',
                borderRadius: 'var(--r-lg)',
                padding:      '1.1rem 1.4rem',
                display:      'flex',
                alignItems:   'center',
                justifyContent: 'space-between',
                flexWrap:     'wrap',
                gap:          '1rem',
                position:     'relative',
                overflow:     'hidden',
              }}>

                {/* Gold left accent */}
                <div aria-hidden="true" style={{
                  position:     'absolute',
                  top: 0, bottom: 0, left: 0,
                  width:        '2px',
                  background:   'linear-gradient(to bottom, transparent, var(--gold), transparent)',
                }} />

                {/* Stats */}
                {[
                  { val: '3+',   lbl: 'Years Exp',  gold: true  },
                  { val: '50+',  lbl: 'Projects',   gold: false },
                  { val: '3.42', lbl: 'GPA',         gold: true  },
                  { val: '5+',   lbl: 'Companies',  gold: false },
                ].map(({ val, lbl, gold }) => (
                  <div key={lbl} style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 60 }}>
                    <span style={{
                      fontFamily:    'var(--font-family-display)',
                      fontStyle:     gold ? 'italic' : 'normal',
                      fontWeight:    700,
                      fontSize:      'clamp(1.4rem, 2.2vw, 1.8rem)',
                      color:         gold ? 'var(--gold)' : 'var(--t1)',
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
                      {lbl}
                    </span>
                  </div>
                ))}

                {/* Green status badge */}
                <div style={{
                  display:       'inline-flex',
                  alignItems:    'center',
                  gap:           5,
                  padding:       '4px 12px',
                  background:    'var(--ac-dim)',
                  border:        '1px solid var(--ac-bdr)',
                  borderRadius:  100,
                }}>
                  <span style={{
                    width:        5, height: 5,
                    borderRadius: '50%',
                    background:   'var(--ac)',
                    display:      'block',
                    boxShadow:    '0 0 6px var(--ac)',
                    animation:    'pulse-dot 2s ease-in-out infinite',
                  }} />
                  <span style={{
                    fontFamily:    'var(--font-family-accent)',
                    fontSize:      '0.56rem',
                    color:         'var(--ac)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontWeight:    500,
                    whiteSpace:    'nowrap',
                  }}>
                    {identity.status}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(0.78); }
        }
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </section>
  )
}