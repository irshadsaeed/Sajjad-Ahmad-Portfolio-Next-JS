'use client'

import React, {
  useRef, useState, useEffect, useCallback, memo,
} from 'react'
import {
  motion, useInView, useMotionValue, useSpring,
  useTransform, AnimatePresence,
} from 'framer-motion'
import { skillCategories } from '@/lib/data'

const E  = [0.16, 1, 0.3, 1]    as const
const ES = [0.34, 1.56, 0.64, 1] as const

/* ─── PROFICIENCY ─── */
const PROF: Record<string, number> = {
  'Plugin Dev': 95, 'Theme Dev': 90, 'WooCommerce': 92, 'LearnDash': 84,
  'Tutor LMS': 80, 'Elementor': 78, 'ACF': 82, 'Custom CPTs': 85, 'Shortcodes': 80,
  'Laravel': 90, 'Eloquent ORM': 88, 'REST APIs': 92, 'PHP': 90, 'MySQL': 86,
  'Auth Systems': 84, 'API Integration': 88,
  'Security Hardening': 88, 'Firewall Setup': 82, '2FA': 80,
  'SSL': 85, 'XSS Protection': 82, 'SQL Injection Prevention': 84,
  'HTML5': 92, 'CSS3': 90, 'JavaScript': 86, 'jQuery': 84,
  'Bootstrap': 80, 'Tailwind CSS': 85, 'AJAX': 82, 'JSON': 88,
  'Git': 90, 'GitHub': 88, 'Postman': 85, 'cPanel': 84, 'Linux CLI': 82,
  'Team Leadership': 85, 'Problem Solving': 92, 'Clean Code': 90,
  'Documentation': 84, 'Agile Workflow': 80, 'API Testing': 86,
}
const getP = (s: string) => PROF[s] ?? 72

const ACCENTS = [
  { c: 'var(--ac)',   d: 'var(--ac-dim)',   b: 'var(--ac-bdr)',   g: 'rgba(0,255,148,0.08)',   gold: false },
  { c: 'var(--gold)', d: 'var(--gold-dim)', b: 'var(--gold-bdr)', g: 'rgba(200,168,75,0.1)',   gold: true  },
  { c: 'var(--ac)',   d: 'var(--ac-dim)',   b: 'var(--ac-bdr)',   g: 'rgba(0,255,148,0.08)',   gold: false },
  { c: 'var(--gold)', d: 'var(--gold-dim)', b: 'var(--gold-bdr)', g: 'rgba(200,168,75,0.1)',   gold: true  },
  { c: 'var(--ac)',   d: 'var(--ac-dim)',   b: 'var(--ac-bdr)',   g: 'rgba(0,255,148,0.08)',   gold: false },
  { c: 'var(--gold)', d: 'var(--gold-dim)', b: 'var(--gold-bdr)', g: 'rgba(200,168,75,0.1)',   gold: true  },
]

/* ─────────────────────────────────────────────────────────────
   INFINITE TICKER — scrolling skills tape
   ─────────────────────────────────────────────────────────── */
function SkillTicker() {
  const allSkills = skillCategories.flatMap(c => c.pills)
  const doubled   = [...allSkills, ...allSkills]

  return (
    <div style={{
      overflow:   'hidden',
      position:   'relative',
      padding:    '0.75rem 0',
      borderTop:  '1px solid var(--canvas-4)',
      borderBottom: '1px solid var(--canvas-4)',
      background: 'linear-gradient(to right, var(--canvas) 0%, transparent 8%, transparent 92%, var(--canvas) 100%)',
      marginBottom: '3.5rem',
      zIndex: 2,
    }}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
        style={{ display: 'flex', gap: '0', whiteSpace: 'nowrap', width: 'max-content' }}
      >
        {doubled.map((skill, i) => (
          <div key={i} style={{
            display:    'inline-flex',
            alignItems: 'center',
            gap:        '0.5rem',
            padding:    '0 1.5rem',
          }}>
            <span style={{
              width: 3, height: 3, borderRadius: '50%',
              background: i % 3 === 0 ? 'var(--gold)' : i % 3 === 1 ? 'var(--ac)' : 'var(--canvas-5)',
              display: 'block', flexShrink: 0,
            }} />
            <span style={{
              fontFamily:    'var(--font-family-accent)',
              fontSize:      '0.62rem',
              color:         i % 7 === 0 ? 'var(--gold)' : i % 5 === 0 ? 'var(--ac)' : 'var(--t3)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontWeight:    i % 7 === 0 || i % 5 === 0 ? 600 : 400,
            }}>
              {skill}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   RADIAL PROFICIENCY — circular gauge
   ─────────────────────────────────────────────────────────── */
function RadialGauge({ value, color, size = 52 }: {
  value: number; color: string; size?: number
}) {
  const r   = (size - 6) / 2
  const circ = 2 * Math.PI * r
  const dash = (value / 100) * circ

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke="var(--canvas-4)" strokeWidth={2.5} />
        {/* Fill */}
        <motion.circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color === 'var(--gold)' ? '#C8A84B' : '#00FF94'}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.2, ease: E, delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 4px ${color === 'var(--gold)' ? 'rgba(200,168,75,0.5)' : 'rgba(0,255,148,0.5)'})` }}
        />
      </svg>
      {/* Value */}
      <div style={{
        position:   'absolute', inset: 0,
        display:    'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-family-mono)',
        fontSize:   '0.5rem', fontWeight: 500,
        color:      color, letterSpacing: '0.02em',
      }}>
        {value}%
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   FEATURED SPOTLIGHT CARD — large hero card for first category
   ─────────────────────────────────────────────────────────── */
function SpotlightCard({ cat, inView }: {
  cat: typeof skillCategories[number]; inView: boolean
}) {
  const accent  = ACCENTS[0]
  const top5    = [...cat.pills].sort((a, b) => getP(b) - getP(a)).slice(0, 5)
  const [hov, setHov] = useState(false)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (inView) setTimeout(() => setActive(true), 200)
  }, [inView])

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: E }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="spotlight-card"
      style={{
        background:   hov
          ? 'linear-gradient(145deg, var(--canvas-3) 0%, var(--canvas-2) 100%)'
          : 'var(--canvas-2)',
        border:       `1px solid ${hov ? accent.b : 'var(--canvas-4)'}`,
        borderRadius: 'var(--r-xl)',
        padding:      '2rem',
        position:     'relative',
        overflow:     'hidden',
        transition:   'all 0.35s var(--ease-expo)',
        boxShadow:    hov
          ? `0 0 0 1px ${accent.b}, 0 32px 70px rgba(0,0,0,0.35), 0 0 60px ${accent.g}`
          : 'var(--sh-sm)',
        cursor:       'default',
        gridColumn:   'span 1',
        gridRow:      'span 2',
      }}
    >
      {/* Full top gradient line */}
      <div aria-hidden="true" style={{
        position:   'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(to right, transparent, ${accent.c}, transparent)`,
        opacity:    hov ? 1 : 0.3, transition: 'opacity 0.3s',
      }} />

      {/* Large watermark */}
      <div aria-hidden="true" style={{
        position:      'absolute', bottom: '-1rem', right: '-0.5rem',
        fontFamily:    'var(--font-family-display)', fontStyle: 'italic',
        fontWeight:    800, fontSize: '11rem', lineHeight: 1,
        color:         accent.c, opacity: hov ? 0.04 : 0.015,
        transition:    'opacity 0.4s', userSelect: 'none', pointerEvents: 'none',
        letterSpacing: '-0.08em',
      }}>
        WP
      </div>

      {/* Corner glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, right: 0, width: 160, height: 160,
        background: `radial-gradient(circle at 100% 0%, ${accent.d}, transparent 65%)`,
        opacity: hov ? 1 : 0.5, transition: 'opacity 0.3s', pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', position: 'relative', zIndex: 2 }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-family-accent)', fontSize: '0.54rem',
            color: accent.c, letterSpacing: '0.18em', textTransform: 'uppercase',
            fontWeight: 500, marginBottom: '0.4rem', opacity: 0.7,
          }}>
            Primary Expertise
          </div>
          <h3 style={{
            fontFamily:    'var(--font-family-display)', fontWeight: 800,
            fontSize:      'clamp(1.3rem, 2vw, 1.6rem)', letterSpacing: '-0.02em',
            lineHeight:    1.05, color: 'var(--t1)', margin: 0,
          }}>
            {cat.label}
          </h3>
        </div>

        {/* Icon pod */}
        <div style={{
          width: '3rem', height: '3rem', borderRadius: 'var(--r-md)',
          background: accent.d, border: `1px solid ${accent.b}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: accent.c, flexShrink: 0,
          boxShadow: hov ? `0 0 20px ${accent.g}` : 'none',
          transition: 'box-shadow 0.3s',
        }}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={cat.icon} />
          </svg>
        </div>
      </div>

      {/* Top 5 radial gauges */}
      <div style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 2 }}>
        <div style={{
          fontFamily: 'var(--font-family-accent)', fontSize: '0.52rem',
          color: accent.c, letterSpacing: '0.16em', textTransform: 'uppercase',
          fontWeight: 500, marginBottom: '1rem', opacity: 0.65,
        }}>
          Proficiency Radar
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {top5.map((skill, i) => {
            const level = getP(skill)
            return (
              <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <RadialGauge value={level} color={accent.c} size={44} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'baseline', marginBottom: '0.2rem',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-family-accent)', fontSize: '0.62rem',
                      color: 'var(--t1)', fontWeight: 500, letterSpacing: '0.02em',
                    }}>
                      {skill}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-family-mono)', fontSize: '0.5rem',
                      color: 'var(--t3)', letterSpacing: '0.06em',
                    }}>
                      {level >= 90 ? 'Expert' : level >= 80 ? 'Advanced' : 'Proficient'}
                    </span>
                  </div>
                  {/* Thin bar */}
                  <div style={{ height: 2, background: 'var(--canvas-4)', borderRadius: 1, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: active ? `${level}%` : 0 }}
                      transition={{ duration: 1.1, delay: 0.25 + i * 0.1, ease: E }}
                      style={{
                        height: '100%', borderRadius: 1,
                        background: `linear-gradient(to right, ${accent.c}, ${accent.gold ? 'var(--gold-rich)' : 'rgba(0,255,148,0.6)'})`,
                        boxShadow: `0 0 4px ${accent.g}`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: 1, background: hov
          ? `linear-gradient(to right, ${accent.c}, var(--canvas-4), transparent)`
          : 'var(--canvas-4)',
        marginBottom: '1.2rem', position: 'relative', zIndex: 2,
        transition: 'background 0.3s',
      }} />

      {/* All chips */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.3rem',
        position: 'relative', zIndex: 2,
      }}>
        {cat.pills.map((pill, pi) => (
          <motion.span
            key={pill}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={active ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.3, delay: 0.4 + pi * 0.04, ease: ES }}
            style={{
              fontFamily:    'var(--font-family-accent)', fontSize: '0.57rem',
              color:         'var(--t2)', background: 'var(--canvas-3)',
              border:        '1px solid var(--canvas-4)',
              padding:       '0.22rem 0.6rem', borderRadius: 100,
              letterSpacing: '0.03em', fontWeight: 400,
              transition:    'all 0.2s',
              cursor:        'default',
            }}
            whileHover={{
              background: accent.d,
              borderColor: accent.b,
              color: accent.c,
              scale: 1.05,
            }}
          >
            {pill}
          </motion.span>
        ))}
      </div>

      {/* Bottom bar */}
      <motion.div
        animate={{ scaleX: hov ? 1 : 0 }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.4, ease: E }}
        aria-hidden="true"
        style={{
          position: 'absolute', bottom: 0, left: '5%', right: '5%',
          height: '2px',
          background: `linear-gradient(to right, transparent, ${accent.c}, transparent)`,
          transformOrigin: 'center', pointerEvents: 'none',
        }}
      />
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   COMPACT SKILL CARD — for remaining categories
   ─────────────────────────────────────────────────────────── */
const CompactCard = memo(function CompactCard({
  cat, catIndex, index, inView,
}: {
  cat: typeof skillCategories[number]
  catIndex: number; index: number; inView: boolean
}) {
  const accent  = ACCENTS[catIndex % ACCENTS.length]
  const topSkill = [...cat.pills].sort((a, b) => getP(b) - getP(a))[0]
  const [hov, setHov]     = useState(false)
  const [active, setActive] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotX   = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), { stiffness: 160, damping: 22 })
  const rotY   = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), { stiffness: 160, damping: 22 })
  const ref    = useRef<HTMLDivElement>(null)

  const onMM = useCallback((e: React.MouseEvent) => {
    const el = ref.current; if (!el) return
    const r  = el.getBoundingClientRect()
    mouseX.set((e.clientX - r.left) / r.width  - 0.5)
    mouseY.set((e.clientY - r.top)  / r.height - 0.5)
  }, [mouseX, mouseY])
  const onML = useCallback(() => { mouseX.set(0); mouseY.set(0); setHov(false) }, [mouseX, mouseY])

  useEffect(() => {
    if (inView) setTimeout(() => setActive(true), 150 + index * 80)
  }, [inView, index])

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.1 + index * 0.1, ease: E }}
      style={{ transformStyle: 'preserve-3d', perspective: 800, height: '100%' }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMM}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={onML}
        style={{ rotateX: rotX, rotateY: rotY, height: '100%' }}
      >
        <div style={{
          background:   hov
            ? 'linear-gradient(148deg, var(--canvas-3), var(--canvas-2))'
            : 'var(--canvas-2)',
          border:       `1px solid ${hov ? accent.b : 'var(--canvas-4)'}`,
          borderRadius: 'var(--r-xl)',
          padding:      '1.5rem',
          height:       '100%',
          display:      'flex', flexDirection: 'column', gap: '1.1rem',
          position:     'relative', overflow: 'hidden',
          transition:   'all 0.3s var(--ease-expo)',
          boxShadow:    hov
            ? `0 0 0 1px ${accent.b}, 0 20px 50px rgba(0,0,0,0.28), 0 0 40px ${accent.g}`
            : 'none',
          cursor:       'default',
        }}>

          {/* Top line */}
          <div aria-hidden="true" style={{
            position:   'absolute', top: 0, left: 0, right: 0, height: '1.5px',
            background: `linear-gradient(to right, transparent, ${accent.c}, transparent)`,
            opacity:    hov ? 0.9 : 0.18, transition: 'opacity 0.3s',
          }} />

          {/* Watermark */}
          <div aria-hidden="true" style={{
            position:      'absolute', bottom: '-0.5rem', right: '-0.2rem',
            fontFamily:    'var(--font-family-display)', fontStyle: 'italic',
            fontWeight:    800, fontSize: '5rem', lineHeight: 1,
            color:         accent.c, opacity: hov ? 0.045 : 0.015,
            transition:    'opacity 0.4s', userSelect: 'none', pointerEvents: 'none',
            letterSpacing: '-0.06em',
          }}>
            {cat.label[0]}
          </div>

          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', position: 'relative', zIndex: 2 }}>
            <div style={{
              width: '2rem', height: '2rem', borderRadius: 'var(--r-sm)',
              background: hov ? accent.d : 'var(--canvas-3)',
              border: `1px solid ${hov ? accent.b : 'var(--canvas-4)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: hov ? accent.c : 'var(--t3)', flexShrink: 0,
              transition: 'all 0.24s',
              boxShadow: hov ? `0 0 12px ${accent.g}` : 'none',
            }}>
              <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d={cat.icon} />
              </svg>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{
                fontFamily: 'var(--font-family-display)', fontWeight: 700,
                fontSize: 'clamp(0.88rem, 1.05vw, 1rem)', letterSpacing: '-0.012em',
                lineHeight: 1.1, color: 'var(--t1)', margin: 0,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {cat.label}
              </h3>
              <div style={{
                fontFamily: 'var(--font-family-mono)', fontSize: '0.48rem',
                color: hov ? accent.c : 'var(--t3)', letterSpacing: '0.1em',
                marginTop: '0.1rem', transition: 'color 0.2s',
              }}>
                {cat.pills.length} skills
              </div>
            </div>

            {/* Top skill radial */}
            {active && (
              <RadialGauge value={getP(topSkill)} color={accent.c} size={38} />
            )}
          </div>

          {/* Divider */}
          <div style={{
            height: 1,
            background: hov
              ? `linear-gradient(to right, ${accent.c}, var(--canvas-4), transparent)`
              : 'var(--canvas-4)',
            transition: 'background 0.3s', position: 'relative', zIndex: 2,
          }} />

          {/* Top 2 mini bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', zIndex: 2 }}>
            {[...cat.pills].sort((a, b) => getP(b) - getP(a)).slice(0, 2).map((skill, i) => {
              const level = getP(skill)
              return (
                <div key={skill}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'baseline', marginBottom: '0.18rem',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-family-accent)', fontSize: '0.56rem',
                      color: 'var(--t2)', letterSpacing: '0.03em',
                    }}>
                      {skill}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-family-mono)', fontSize: '0.48rem',
                      color: accent.c, letterSpacing: '0.08em',
                    }}>
                      {level}%
                    </span>
                  </div>
                  <div style={{ height: 2, background: 'var(--canvas-4)', borderRadius: 1, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: active ? `${level}%` : 0 }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: E }}
                      style={{
                        height: '100%', borderRadius: 1,
                        background: `linear-gradient(to right, ${accent.c}, ${accent.gold ? 'var(--gold-rich)' : 'rgba(0,255,148,0.5)'})`,
                        boxShadow: `0 0 4px ${accent.g}`,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pills */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '0.28rem',
            position: 'relative', zIndex: 2,
          }}>
            {cat.pills.map((pill, pi) => (
              <motion.span
                key={pill}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={active ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.28, delay: 0.3 + pi * 0.035, ease: ES }}
                style={{
                  fontFamily:    'var(--font-family-accent)', fontSize: '0.55rem',
                  color:         'var(--t2)', background: 'var(--canvas-3)',
                  border:        '1px solid var(--canvas-4)',
                  padding:       '0.2rem 0.55rem', borderRadius: 100,
                  letterSpacing: '0.03em', cursor: 'default',
                  transition:    'all 0.18s',
                }}
                whileHover={{
                  background: accent.d, borderColor: accent.b, color: accent.c, scale: 1.06,
                }}
              >
                {pill}
              </motion.span>
            ))}
          </div>

          {/* Bottom bar */}
          <motion.div
            animate={{ scaleX: hov ? 1 : 0 }} initial={{ scaleX: 0 }}
            transition={{ duration: 0.35, ease: E }}
            aria-hidden="true"
            style={{
              position: 'absolute', bottom: 0, left: '5%', right: '5%',
              height: '1.5px',
              background: `linear-gradient(to right, transparent, ${accent.c}, transparent)`,
              transformOrigin: 'center', pointerEvents: 'none',
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
})

/* ─────────────────────────────────────────────────────────────
   HEADER STATS
   ─────────────────────────────────────────────────────────── */
function HeaderStats({ inView }: { inView: boolean }) {
  const total = skillCategories.reduce((a, c) => a + c.pills.length, 0)
  const items = [
    { val: `${total}`, lbl: 'Total Skills', gold: true  },
    { val: `${skillCategories.length}`, lbl: 'Domains', gold: false },
    { val: '4+',       lbl: 'Yrs Mastering', gold: true  },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.3, ease: E }}
      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}
    >
      {items.map(({ val, lbl, gold }, i) => (
        <React.Fragment key={lbl}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
            <span style={{
              fontFamily:    'var(--font-family-display)',
              fontStyle:     gold ? 'italic' : 'normal',
              fontWeight:    800,
              fontSize:      'clamp(1.4rem, 2.2vw, 1.85rem)',
              color:         gold ? 'var(--gold)' : 'var(--t1)',
              letterSpacing: '-0.025em', lineHeight: 1,
              textShadow:    gold ? '0 0 22px rgba(200,168,75,0.2)' : 'none',
            }}>
              {val}
            </span>
            <span style={{
              fontFamily:    'var(--font-family-accent)', fontSize: '0.5rem',
              color:         'var(--t3)', letterSpacing: '0.12em',
              textTransform: 'uppercase', fontWeight: 500,
            }}>
              {lbl}
            </span>
          </div>
          {i < items.length - 1 && (
            <div style={{
              width: 1, height: 30,
              background: 'linear-gradient(to bottom, transparent, var(--canvas-4), transparent)',
              margin: '0 0.3rem',
            }} />
          )}
        </React.Fragment>
      ))}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   SECTION
   ─────────────────────────────────────────────────────────── */
export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)
  const gridRef    = useRef<HTMLDivElement>(null)
  const inView     = useInView(gridRef,   { once: true, margin: '-10px' })
  const hInView    = useInView(headerRef, { once: true })

  const [featured, ...rest] = skillCategories

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="section-pad"
      style={{ background: 'var(--canvas)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Ambient atmosphere */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 55% 45% at 0% 55%, rgba(200,168,75,0.018) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 50% 40% at 100% 50%, rgba(0,255,148,0.014) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position:   'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width:      180, height: 1,
        background: 'linear-gradient(to right, transparent, var(--gold-bdr), transparent)',
      }} />

      <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HEADER ── */}
        <div
          ref={headerRef}
          style={{
            display: 'flex', alignItems: 'flex-end',
            justifyContent: 'space-between', flexWrap: 'wrap',
            gap: '1.5rem', marginBottom: '2rem',
          }}
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={hInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: E }}
              style={{ marginBottom: '0.65rem' }}
            >
              <span className="section-label">// Skill Intelligence</span>
            </motion.div>

            <div style={{ overflow: 'hidden' }}>
              <motion.div
                initial={{ y: '105%', opacity: 0 }}
                animate={hInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.75, delay: 0.08, ease: E }}
              >
                <span style={{
                  fontFamily: 'var(--font-family-display)', fontWeight: 800,
                  fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', letterSpacing: '-0.028em',
                  lineHeight: 0.9, color: 'var(--t1)', display: 'block',
                }}>
                  The full
                </span>
              </motion.div>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <motion.div
                initial={{ y: '105%', opacity: 0 }}
                animate={hInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.75, delay: 0.16, ease: E }}
              >
                <span style={{
                  fontFamily: 'var(--font-family-display)', fontStyle: 'italic', fontWeight: 800,
                  fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', letterSpacing: '-0.028em',
                  lineHeight: 0.9, color: 'var(--gold)', display: 'block',
                  textShadow: '0 0 40px rgba(200,168,75,0.18)',
                }}>
                  stack.
                </span>
              </motion.div>
            </div>
          </div>

          <HeaderStats inView={hInView} />
        </div>

        {/* ── TICKER ── */}
        <SkillTicker />

        {/* ── BENTO GRID ── */}
        <div ref={gridRef} className="skills-bento" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows:    'auto',
          gap:                 '1rem',
          alignItems:          'start',
        }}>
          {/* Spotlight card — tall, left column */}
          <div style={{ gridColumn: '1', gridRow: '1 / 3' }}>
            <SpotlightCard cat={featured} inView={inView} />
          </div>

          {/* Remaining compact cards */}
          {rest.map((cat, i) => (
            <CompactCard
              key={cat.id}
              cat={cat}
              catIndex={i + 1}
              index={i}
              inView={inView}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(0.75); }
        }
        @media (max-width: 1024px) {
          .skills-bento {
            grid-template-columns: 1fr 1fr !important;
          }
          .spotlight-card {
            grid-column: 1 / -1 !important;
            grid-row: auto !important;
          }
        }
        @media (max-width: 600px) {
          .skills-bento {
            grid-template-columns: 1fr !important;
          }
          .spotlight-card {
            grid-column: 1 !important;
            grid-row: auto !important;
          }
        }
      `}</style>
    </section>
  )
}