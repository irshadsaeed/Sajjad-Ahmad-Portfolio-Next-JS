'use client'

import React, {
  useState,
  useRef,
  useCallback,
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

const E  = [0.16, 1, 0.3, 1]    as const
const ES = [0.34, 1.56, 0.64, 1] as const

const FEATURES = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinejoin="round" strokeLinecap="round"/>
      </svg>
    ),
    title:   'Performance First',
    body:    'Sub-second load targets, intelligent caching, and lean database queries baked into every deliverable.',
    color:   'var(--ac)',
    dim:     'var(--ac-dim)',
    bdr:     'var(--ac-bdr)',
    yOffset: 0,
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinejoin="round" strokeLinecap="round"/>
      </svg>
    ),
    title:   'Security Hardened',
    body:    'Auth systems, input validation, and WordPress hardening built into every project from day one.',
    color:   'var(--gold)',
    dim:     'var(--gold-dim)',
    bdr:     'var(--gold-bdr)',
    yOffset: 22,
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <polyline points="16 18 22 12 16 6" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="8 6 2 12 8 18"   strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title:   'Clean Code',
    body:    'Documented, testable, maintainable. Code the next developer will actually thank you for.',
    color:   'var(--ac)',
    dim:     'var(--ac-dim)',
    bdr:     'var(--ac-bdr)',
    yOffset: -10,
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeLinecap="round"/>
      </svg>
    ),
    title:   'Global Reach',
    body:    'Based in Islamabad — delivering for clients across North America, Europe, and the Gulf.',
    color:   'var(--gold)',
    dim:     'var(--gold-dim)',
    bdr:     'var(--gold-bdr)',
    yOffset: 14,
  },
] as const

const PANEL_DATA = [
  { key: 'Location', val: identity.location,             gold: false },
  { key: 'CGPA',     val: '3.42 / 4.00 — UET Taxila',   gold: true  },
  { key: 'Status',   val: identity.status,               gold: true  },
  { key: 'Email',    val: identity.email,                gold: false },
] as const

/* ─── FEATURE CARD ─── */
const FeatureCard = memo(function FeatureCard({
  feat, index, inView,
}: {
  feat:   typeof FEATURES[number]
  index:  number
  inView: boolean
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotX   = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 200, damping: 24 })
  const rotY   = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5,  5]), { stiffness: 200, damping: 24 })
  const [hov, setHov] = useState(false)

  const onMM = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return
    const r  = el.getBoundingClientRect()
    mouseX.set((e.clientX - r.left) / r.width  - 0.5)
    mouseY.set((e.clientY - r.top)  / r.height - 0.5)
  }, [mouseX, mouseY])

  const onML = useCallback(() => { mouseX.set(0); mouseY.set(0); setHov(false) }, [mouseX, mouseY])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, delay: 0.08 + index * 0.1, ease: E }}
      style={{ transformStyle: 'preserve-3d', perspective: 800 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMM}
        onMouseLeave={onML}
        onMouseEnter={() => setHov(true)}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
      >
        <div className="feature-card-inner" style={{
          position:     'relative',
          background:   hov ? 'linear-gradient(140deg, var(--canvas-3), var(--canvas-2))' : 'var(--canvas-2)',
          border:       `1px solid ${hov ? feat.bdr : 'var(--canvas-4)'}`,
          borderRadius: 'var(--r-lg)',
          padding:      'clamp(1rem, 2vw, 1.65rem)',
          overflow:     'hidden',
          height:       '100%',
          transition:   'border-color 0.3s, background 0.3s, box-shadow 0.3s',
          boxShadow:    hov ? (feat.color === 'var(--gold)' ? 'var(--sh-gd)' : 'var(--sh-ac)') : 'none',
          cursor:       'default',
        }}>
          <div aria-hidden="true" style={{
            position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px',
            background: hov ? `linear-gradient(to right, transparent, ${feat.color}, transparent)` : 'transparent',
            transition: 'background 0.3s',
          }} />
          <div aria-hidden="true" style={{
            position: 'absolute', top: 0, right: 0, width: 80, height: 80,
            background: hov ? `radial-gradient(circle at 100% 0%, ${feat.dim}, transparent 70%)` : 'transparent',
            transition: 'background 0.3s', pointerEvents: 'none',
          }} />
          <div style={{
            width: '2.2rem', height: '2.2rem', borderRadius: 'var(--r-sm)',
            background: feat.dim, border: `1px solid ${feat.bdr}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: feat.color, marginBottom: '1.25rem',
            transition: 'transform 0.25s var(--ease-expo), box-shadow 0.25s',
            transform: hov ? 'scale(1.1) translateY(-2px)' : 'scale(1)',
            boxShadow: hov ? `0 4px 14px ${feat.color === 'var(--gold)' ? 'rgba(200,168,75,0.15)' : 'rgba(0,255,148,0.12)'}` : 'none',
            position: 'relative', zIndex: 1,
          }}>
            {feat.icon}
          </div>
          <h3 style={{
            fontFamily: 'var(--font-family-display)', fontWeight: 800,
            fontSize: 'clamp(0.95rem, 1.15vw, 1.08rem)', letterSpacing: '-0.015em',
            color: 'var(--t1)', marginBottom: '0.6rem', lineHeight: 1.15,
            position: 'relative', zIndex: 1, transition: 'color 0.2s',
          }}>
            {feat.title}
          </h3>
          <p style={{
            fontFamily: 'var(--font-family-sans)', fontSize: 'clamp(0.76rem, 0.88vw, 0.84rem)',
            color: 'var(--t2)', fontWeight: 300, lineHeight: 1.82, letterSpacing: '0.004em',
            position: 'relative', zIndex: 1, margin: 0,
          }}>
            {feat.body}
          </p>
          <motion.div
            animate={{ scaleX: hov ? 1 : 0 }} initial={{ scaleX: 0 }}
            transition={{ duration: 0.3, ease: E }} aria-hidden="true"
            style={{
              position: 'absolute', bottom: 0, left: '8%', right: '8%', height: '1.5px',
              background: `linear-gradient(to right, transparent, ${feat.color}, transparent)`,
              transformOrigin: 'center', pointerEvents: 'none',
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
})

/* ─── DATA PANEL ─── */
function DataPanel({ inView }: { inView: boolean }) {
  const [hovRow, setHovRow] = useState<number | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.2, ease: E }}
      style={{
        background: 'var(--canvas-2)', border: '1px solid var(--canvas-4)',
        borderRadius: 'var(--r-lg)', overflow: 'hidden',
        position: 'relative', boxShadow: 'var(--sh-sm)',
      }}
    >
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, right: 0, width: 120, height: 120,
        background: 'radial-gradient(circle at 100% 0%, rgba(200,168,75,0.06), transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px',
        background: 'linear-gradient(to right, transparent, var(--gold), rgba(200,168,75,0.3), transparent)',
      }} />
      <div style={{
        padding: '0.85rem 1.3rem', borderBottom: '1px solid var(--canvas-4)',
        display: 'flex', alignItems: 'center', gap: 7,
        background: 'linear-gradient(180deg, var(--canvas-3) 0%, rgba(15,15,15,0) 100%)',
      }}>
        {[{ c: '#FF5F57', s: '#FF3B30' }, { c: '#FEBC2E', s: '#FF9500' }, { c: '#28C840', s: 'var(--ac)' }]
          .map(({ c, s }, i) => (
            <span key={i} aria-hidden="true" style={{
              width: 8, height: 8, borderRadius: '50%', background: c,
              display: 'block', flexShrink: 0,
              boxShadow: `0 0 0 0.5px rgba(0,0,0,0.3), 0 0 6px ${s}55`,
            }} />
          ))}
        <div style={{ width: 1, height: 12, background: 'var(--canvas-4)', marginLeft: 2, marginRight: 2 }} />
        <span style={{
          fontFamily: 'var(--font-family-mono)', fontSize: '0.54rem',
          color: 'var(--t3)', letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>sajjad.config</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{
            width: 4, height: 4, borderRadius: '50%', background: 'var(--ac)',
            boxShadow: '0 0 5px var(--ac)', display: 'block',
            animation: 'pulse-dot 2s ease-in-out infinite',
          }} />
          <span style={{ fontFamily: 'var(--font-family-mono)', fontSize: '0.5rem', color: 'var(--ac)', letterSpacing: '0.08em' }}>live</span>
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        {PANEL_DATA.map(({ key, val, gold }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.42 + i * 0.08, ease: E }}
            onMouseEnter={() => setHovRow(i)}
            onMouseLeave={() => setHovRow(null)}
            className="data-panel-row"
            style={{
              display: 'flex', alignItems: 'flex-start', gap: '0.65rem',
              padding: '0.65rem 1rem',
              borderBottom: i < PANEL_DATA.length - 1 ? '1px solid var(--canvas-4)' : 'none',
              background: hovRow === i ? 'rgba(255,255,255,0.018)' : 'transparent',
              transition: 'background 0.2s', cursor: 'default', position: 'relative',
            }}
          >
            <div style={{
              position: 'absolute', left: 0, top: '10%', bottom: '10%', width: '2px',
              background: hovRow === i ? (gold ? 'var(--gold)' : 'var(--ac)') : 'transparent',
              borderRadius: 1, transition: 'background 0.2s',
            }} />
            <span aria-hidden="true" style={{
              fontFamily: 'var(--font-family-mono)', fontSize: '0.48rem',
              color: 'var(--canvas-5)', letterSpacing: '0.06em', minWidth: 12, userSelect: 'none',
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="data-panel-key" style={{
              fontFamily: 'var(--font-family-mono)', fontSize: '0.56rem',
              color: hovRow === i ? 'var(--ac)' : 'rgba(0,255,148,0.55)',
              letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500,
              minWidth: 56, flexShrink: 0, transition: 'color 0.2s',
            }}>
              {key}
            </span>
            <span style={{ fontFamily: 'var(--font-family-mono)', fontSize: '0.6rem', color: 'var(--canvas-5)', flexShrink: 0 }}>:</span>
            <span className="data-panel-val" style={{
              fontFamily: gold ? 'var(--font-family-display)' : 'var(--font-family-mono)',
              fontStyle: gold ? 'italic' : 'normal', fontWeight: gold ? 700 : 400,
              fontSize: gold ? '0.9rem' : '0.7rem',
              color: hovRow === i ? (gold ? 'var(--gold-rich)' : 'var(--t1)') : (gold ? 'var(--gold)' : 'var(--t2)'),
              letterSpacing: gold ? '-0.01em' : '0.03em', lineHeight: 1.3,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              flex: 1, minWidth: 0, transition: 'color 0.2s',
              textShadow: hovRow === i && gold ? '0 0 12px rgba(200,168,75,0.3)' : 'none',
            }}>
              {gold ? `"${val}"` : val}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function Gold({ children }: { children: React.ReactNode }) {
  return (
    <em style={{ fontFamily: 'var(--font-family-display)', fontStyle: 'italic', fontWeight: 600, color: 'var(--gold)', letterSpacing: '-0.005em' }}>
      {children}
    </em>
  )
}

function Accent({ children }: { children: React.ReactNode }) {
  return <strong style={{ color: 'var(--t1)', fontWeight: 500 }}>{children}</strong>
}

function Para({ children, delay, inView }: { children: React.ReactNode; delay: number; inView: boolean }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: E }}
      style={{
        fontFamily: 'var(--font-family-sans)', fontWeight: 300,
        fontSize: 'clamp(0.88rem, 1.02vw, 1rem)', color: 'var(--t2)',
        lineHeight: 1.92, letterSpacing: '0.005em', margin: '0 0 1.2rem',
      }}
    >
      {children}
    </motion.p>
  )
}

/* ─── STATS POD ─── */
function StatsPod({ inView }: { inView: boolean }) {
  const items = [
    { val: '4+',   lbl: 'Years',     sub: 'Experience', gold: true  },
    { val: '50+',  lbl: 'Projects',  sub: 'Delivered',  gold: false },
    { val: '3.42', lbl: 'CGPA',      sub: 'UET Taxila', gold: true  },
    { val: '6+',   lbl: 'Companies', sub: 'Served',     gold: false },
  ]
  const [hov, setHov] = useState<number | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.28, ease: E }}
      style={{ gridColumn: '1 / -1' }}
    >
      <div style={{
        background: 'var(--canvas-2)', border: '1px solid var(--canvas-4)',
        borderRadius: 'var(--r-lg)', overflow: 'hidden', position: 'relative',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px',
          background: 'linear-gradient(to right, transparent, var(--gold), rgba(200,168,75,0.2), transparent)',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: 0, right: 0, width: 100, height: 100,
          background: 'radial-gradient(circle at 100% 100%, rgba(200,168,75,0.04), transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="stats-pod-row" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          borderBottom: '1px solid var(--canvas-4)',
        }}>
          {items.map(({ val, lbl, sub, gold }, i) => (
            <div
              key={lbl}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{
                padding: '1.1rem 0.65rem',
                borderRight: i < items.length - 1 ? '1px solid var(--canvas-4)' : 'none',
                display: 'flex', flexDirection: 'column', gap: 3,
                background: hov === i ? (gold ? 'rgba(200,168,75,0.03)' : 'rgba(0,255,148,0.02)') : 'transparent',
                transition: 'background 0.25s', cursor: 'default',
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: '10%', right: '10%', height: '1.5px',
                background: hov === i ? `linear-gradient(to right, transparent, ${gold ? 'var(--gold)' : 'var(--ac)'}, transparent)` : 'transparent',
                transition: 'background 0.25s',
              }} />
              <span style={{
                fontFamily: 'var(--font-family-display)', fontStyle: gold ? 'italic' : 'normal',
                fontWeight: 800, fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                color: gold ? (hov === i ? 'var(--gold-rich)' : 'var(--gold)') : 'var(--t1)',
                letterSpacing: '-0.028em', lineHeight: 1,
                transition: 'color 0.25s, text-shadow 0.25s',
                textShadow: hov === i && gold ? '0 0 28px rgba(200,168,75,0.35)' : gold ? '0 0 18px rgba(200,168,75,0.12)' : 'none',
              }}>
                {val}
              </span>
              <span style={{
                fontFamily: 'var(--font-family-display)', fontWeight: 600, fontSize: '0.78rem',
                color: hov === i ? 'var(--t1)' : 'var(--t2)',
                letterSpacing: '-0.01em', lineHeight: 1.2, transition: 'color 0.2s',
              }}>
                {lbl}
              </span>
              <span style={{
                fontFamily: 'var(--font-family-mono)', fontSize: '0.48rem',
                color: gold ? 'rgba(200,168,75,0.45)' : 'var(--t3)',
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                {sub}
              </span>
            </div>
          ))}
        </div>

        <div className="stats-pod-bottom" style={{
          padding: '0.7rem 1rem', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem',
          background: 'linear-gradient(to bottom, var(--canvas-3), var(--canvas-2))',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px',
            background: 'var(--ac-dim)', border: '1px solid var(--ac-bdr)', borderRadius: 100,
          }}>
            <span style={{
              width: 4, height: 4, borderRadius: '50%', background: 'var(--ac)',
              boxShadow: '0 0 5px var(--ac)', display: 'block',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily: 'var(--font-family-accent)', fontSize: '0.52rem', color: 'var(--ac)',
              letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap',
            }}>
              {identity.status} for hire
            </span>
          </div>
          <span style={{
            fontFamily: 'var(--font-family-display)', fontStyle: 'italic', fontWeight: 400,
            fontSize: '0.78rem', color: 'var(--t3)', letterSpacing: '-0.005em',
          }}>
            Engineering precision. Delivering results.
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── SECTION ─── */
export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView     = useInView(sectionRef, { once: true, margin: '-10px' })

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-pad"
      style={{ background: 'var(--canvas)', position: 'relative', overflow: 'hidden' }}
    >
      <div aria-hidden="true" style={{
        position: 'absolute', top: '15%', left: '-8%', width: '55vw', height: '55vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,168,75,0.022) 0%, transparent 65%)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 200, height: 1,
        background: 'linear-gradient(to right, transparent, var(--ac-bdr), transparent)',
      }} />

      <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
        <div
          className="about-grid"
          style={{
            display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
            gap: 'clamp(2.5rem, 6vw, 5.5rem)', alignItems: 'start',
          }}
        >
          {/* LEFT */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: E }}
              style={{ marginBottom: '0.65rem' }}
            >
              <span className="section-label">// About</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.06, ease: E }}
              style={{ marginBottom: '1.85rem' }}
            >
              <div className="about-heading-line" style={{
                fontFamily: 'var(--font-family-display)', fontWeight: 800,
                fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', letterSpacing: '-0.028em',
                lineHeight: 0.9, color: 'var(--t1)',
              }}>
                Turning ideas
              </div>
              <div className="about-heading-line" style={{
                fontFamily: 'var(--font-family-display)', fontStyle: 'italic', fontWeight: 800,
                fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', letterSpacing: '-0.028em',
                lineHeight: 0.9, color: 'var(--gold)', marginTop: '0.05em',
                textShadow: '0 0 40px rgba(200,168,75,0.16)',
              }}>
                into reality.
              </div>
            </motion.div>

            <Para delay={0.14} inView={inView}>
              {"I'm a WordPress and Laravel developer with "}
              <Accent>4+ years</Accent>
              {" of professional experience building production-grade web applications — from custom plugins and LMS platforms to RESTful APIs and full eCommerce ecosystems."}
            </Para>
            <Para delay={0.22} inView={inView}>
              {"Holding a "}
              <Accent>BS Computer Science (Honours)</Accent>
              {" from UET Taxila with a CGPA of "}
              <Gold>3.42 / 4.00</Gold>
              {". My thesis on Brain Tumor Detection using Deep Neural Networks was showcased at NUML Open House 2021 — bridging AI research with real-world medical applications."}
            </Para>
            <Para delay={0.3} inView={inView}>
              {"Based in "}
              <Gold>Islamabad, Pakistan</Gold>
              {" — I collaborate with global clients who value precision, reliability, and code built to last."}
            </Para>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={inView ? { scaleX: 1, opacity: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.36, ease: E }}
              style={{
                height: '1px',
                background: 'linear-gradient(to right, var(--gold-bdr), var(--canvas-4), transparent)',
                transformOrigin: 'left', marginBottom: '1.35rem',
              }}
            />
            <DataPanel inView={inView} />
          </div>

          {/* RIGHT */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(0.75rem, 1.5vw, 1.4rem)',
            alignItems: 'start', paddingTop: 'clamp(0px, 2vw, 24px)',
          }}>
            {FEATURES.map((feat, i) => (
              <FeatureCard key={feat.title} feat={feat} index={i} inView={inView} />
            ))}
            <StatsPod inView={inView} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(0.78); }
        }

        /* Tablet */
        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }

        /* Mobile */
        @media (max-width: 600px) {
          .about-grid > div:last-child { grid-template-columns: 1fr !important; gap: 0.75rem !important; }
          .stats-pod-row { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-pod-row > div:nth-child(2) { border-right: none !important; }
          .stats-pod-row > div:nth-child(1),
          .stats-pod-row > div:nth-child(2) { border-bottom: 1px solid var(--canvas-4) !important; }
        }

        /* ── 432px and below ── */
        @media (max-width: 432px) {
          .about-grid { gap: 2rem !important; }

          .about-heading-line {
            font-size: clamp(1.8rem, 8vw, 2.2rem) !important;
          }

          /* Cards — single column */
          .about-grid > div:last-child { grid-template-columns: 1fr !important; gap: 0.75rem !important; }

          /* Stats pod — 2 cols */
          .stats-pod-row { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-pod-row > div { padding: 0.9rem 0.65rem !important; }
          .stats-pod-row > div:nth-child(2) { border-right: none !important; }
          .stats-pod-row > div:nth-child(1),
          .stats-pod-row > div:nth-child(2) { border-bottom: 1px solid var(--canvas-4) !important; }

          /* Stats bottom bar */
          .stats-pod-bottom {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.4rem !important;
          }

          /* Data panel */
          .data-panel-row { padding: 0.55rem 0.75rem !important; gap: 0.4rem !important; }
          .data-panel-key { min-width: 44px !important; }
        }

        /* ── 320px and below ── */
        @media (max-width: 320px) {
          .about-grid { gap: 1.5rem !important; }
          .section-pad { padding-left: 0.75rem !important; padding-right: 0.75rem !important; }
          .container-custom { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }

          .about-heading-line {
            font-size: 1.7rem !important;
            letter-spacing: -0.02em !important;
            line-height: 1 !important;
          }

          .about-grid > div:last-child { grid-template-columns: 1fr !important; gap: 0.6rem !important; }
          .feature-card-inner { padding: 0.9rem !important; }

          .stats-pod-row { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-pod-row > div { padding: 0.7rem 0.6rem !important; }
          .stats-pod-row > div:nth-child(2) { border-right: none !important; }
          .stats-pod-row > div:nth-child(1),
          .stats-pod-row > div:nth-child(2) { border-bottom: 1px solid var(--canvas-4) !important; }

          .stats-pod-bottom {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.4rem !important;
            padding: 0.6rem 0.75rem !important;
          }

          .data-panel-row { padding: 0.5rem 0.6rem !important; gap: 0.3rem !important; }
          .data-panel-key { min-width: 40px !important; font-size: 0.44rem !important; letter-spacing: 0.08em !important; }
          .data-panel-val { font-size: 0.6rem !important; }
        }
      `}</style>
    </section>
  )
}