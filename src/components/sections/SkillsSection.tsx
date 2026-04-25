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
import { skillCategories } from '@/lib/data'

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
   ─────────────────────────────────────────────────────────── */
const EASE_EXPO   = [0.16, 1, 0.3, 1]    as const
const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const

/* ─────────────────────────────────────────────────────────────
   CATEGORY ACCENT SYSTEM
   Primary categories get gold, secondary get green
   ─────────────────────────────────────────────────────────── */
const CAT_ACCENTS: Record<number, {
  color: string; dim: string; bdr: string; glow: string; isGold: boolean
}> = {
  0: { color: 'var(--ac)',   dim: 'var(--ac-dim)',   bdr: 'var(--ac-bdr)',   glow: 'rgba(0,255,148,0.1)',   isGold: false },
  1: { color: 'var(--gold)', dim: 'var(--gold-dim)', bdr: 'var(--gold-bdr)', glow: 'rgba(200,168,75,0.12)', isGold: true  },
  2: { color: 'var(--ac)',   dim: 'var(--ac-dim)',   bdr: 'var(--ac-bdr)',   glow: 'rgba(0,255,148,0.1)',   isGold: false },
  3: { color: 'var(--gold)', dim: 'var(--gold-dim)', bdr: 'var(--gold-bdr)', glow: 'rgba(200,168,75,0.12)', isGold: true  },
  4: { color: 'var(--ac)',   dim: 'var(--ac-dim)',   bdr: 'var(--ac-bdr)',   glow: 'rgba(0,255,148,0.1)',   isGold: false },
  5: { color: 'var(--gold)', dim: 'var(--gold-dim)', bdr: 'var(--gold-bdr)', glow: 'rgba(200,168,75,0.12)', isGold: true  },
}

/* ─────────────────────────────────────────────────────────────
   PROFICIENCY LEVELS
   Assign visual weight to each skill
   ─────────────────────────────────────────────────────────── */
const PROFICIENCY: Record<string, number> = {
  // WordPress / PHP
  'WordPress':     95, 'WooCommerce':    90, 'Custom Plugins':  88,
  'PHP':           88, 'LearnDash':      82, 'ACF':             80,
  'Elementor':     78,
  // Laravel / Backend
  'Laravel':       92, 'REST API':       90, 'MySQL':           85,
  'Sanctum Auth':  82, 'Eloquent ORM':   85, 'Queues & Jobs':   75,
  // Frontend
  'React':         80, 'Next.js':        78, 'TypeScript':      75,
  'Tailwind CSS':  82, 'JavaScript':     85, 'HTML/CSS':        92,
  // DevOps / Tools
  'Git':           90, 'Docker':         68, 'cPanel/WHM':      85,
  'Linux':         72, 'CI/CD':          65, 'Cloudflare':      78,
  // default fallback
  '_':             70,
}

function getProficiency(skill: string): number {
  return PROFICIENCY[skill] ?? PROFICIENCY['_']
}

/* ─────────────────────────────────────────────────────────────
   SECTION CURSOR — global ambient orb
   ─────────────────────────────────────────────────────────── */
function SectionCursorLight({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>
}) {
  const x  = useMotionValue(-600)
  const y  = useMotionValue(-600)
  const sx = useSpring(x, { stiffness: 50, damping: 16 })
  const sy = useSpring(y, { stiffness: 50, damping: 16 })

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      const sec = sectionRef.current
      if (!sec) return
      const rect = sec.getBoundingClientRect()
      if (e.clientY < rect.top || e.clientY > rect.bottom) return
      x.set(e.clientX - rect.left)
      y.set(e.clientY - rect.top)
    }
    window.addEventListener('mousemove', fn, { passive: true })
    return () => window.removeEventListener('mousemove', fn)
  }, [sectionRef, x, y])

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position:      'absolute',
        left: 0, top: 0,
        x: sx, y: sy,
        translateX: '-50%', translateY: '-50%',
        width:         700, height: 700,
        borderRadius:  '50%',
        background:    'radial-gradient(circle, rgba(0,255,148,0.03) 0%, rgba(200,168,75,0.015) 45%, transparent 68%)',
        pointerEvents: 'none',
        zIndex:        0,
        filter:        'blur(16px)',
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────
   SKILL CHIP — magnetic floating chip
   Each chip slightly follows cursor proximity
   ─────────────────────────────────────────────────────────── */
const SkillChip = memo(function SkillChip({
  skill,
  accent,
  index,
  active,
}: {
  skill:  string
  accent: typeof CAT_ACCENTS[number]
  index:  number
  active: boolean
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const mx     = useMotionValue(0)
  const my     = useMotionValue(0)
  const smx    = useSpring(mx, { stiffness: 300, damping: 20 })
  const smy    = useSpring(my, { stiffness: 300, damping: 20 })
  const [hov, setHov] = useState(false)
  const level  = getProficiency(skill)

  const onMM = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r  = el.getBoundingClientRect()
    const dx = (e.clientX - r.left - r.width  / 2) * 0.18
    const dy = (e.clientY - r.top  - r.height / 2) * 0.18
    mx.set(dx); my.set(dy)
  }, [mx, my])

  const onML = useCallback(() => {
    mx.set(0); my.set(0); setHov(false)
  }, [mx, my])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.35, delay: active ? index * 0.04 : 0, ease: EASE_SPRING }}
      onMouseMove={onMM}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={onML}
      style={{ x: smx, y: smy, display: 'inline-flex' }}
    >
      <div style={{
        display:       'flex',
        alignItems:    'center',
        gap:           5,
        padding:       '0.28rem 0.7rem',
        background:    hov ? accent.dim : 'var(--canvas-3)',
        border:        `1px solid ${hov ? accent.bdr : 'var(--canvas-4)'}`,
        borderRadius:  100,
        cursor:        'default',
        transition:    'all 0.2s var(--ease-expo)',
        transform:     hov ? 'scale(1.06)' : 'scale(1)',
        boxShadow:     hov ? `0 0 12px ${accent.glow}` : 'none',
        whiteSpace:    'nowrap',
      }}>
        {/* Proficiency dot — size indicates level */}
        <span style={{
          width:        hov ? 7 : 5,
          height:       hov ? 7 : 5,
          borderRadius: '50%',
          background:   hov ? accent.color : 'var(--t3)',
          display:      'block',
          flexShrink:   0,
          transition:   'all 0.2s',
          boxShadow:    hov ? `0 0 6px ${accent.glow}` : 'none',
        }} />
        <span style={{
          fontFamily:    'var(--font-family-accent)',
          fontSize:      '0.6rem',
          fontWeight:    hov ? 600 : 400,
          letterSpacing: '0.04em',
          color:         hov ? accent.color : 'var(--t2)',
          transition:    'color 0.2s',
        }}>
          {skill}
        </span>
      </div>
    </motion.div>
  )
})

/* ─────────────────────────────────────────────────────────────
   TOP 3 PROFICIENCY BARS — shown in featured/tall modules
   ─────────────────────────────────────────────────────────── */
function ProficiencyBars({
  skills,
  accent,
  active,
}: {
  skills: string[]
  accent: typeof CAT_ACCENTS[number]
  active: boolean
}) {
  const top3 = [...skills]
    .sort((a, b) => getProficiency(b) - getProficiency(a))
    .slice(0, 3)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      {top3.map((skill, i) => {
        const level = getProficiency(skill)
        return (
          <div key={skill}>
            <div style={{
              display:        'flex',
              justifyContent: 'space-between',
              alignItems:     'baseline',
              marginBottom:   '0.25rem',
            }}>
              <span style={{
                fontFamily:    'var(--font-family-accent)',
                fontSize:      '0.58rem',
                color:         'var(--t2)',
                letterSpacing: '0.04em',
              }}>
                {skill}
              </span>
              <span style={{
                fontFamily:    'var(--font-family-mono)',
                fontSize:      '0.5rem',
                color:         accent.color,
                letterSpacing: '0.08em',
                opacity:       active ? 1 : 0,
                transition:    'opacity 0.4s 0.4s',
              }}>
                {level}%
              </span>
            </div>
            {/* Track */}
            <div style={{
              height:       4,
              background:   'var(--canvas-4)',
              borderRadius: 2,
              overflow:     'hidden',
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: active ? `${level}%` : 0 }}
                transition={{ duration: 1.1, delay: 0.2 + i * 0.12, ease: EASE_EXPO }}
                style={{
                  height:        '100%',
                  borderRadius:  2,
                  background:    `linear-gradient(to right, ${accent.color}, ${accent.isGold ? 'var(--gold-rich)' : 'rgba(0,255,148,0.6)'})`,
                  boxShadow:     active ? `0 0 8px ${accent.glow}` : 'none',
                  transformOrigin: 'left',
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   SKILL MODULE — the core card component
   Large modules (0, 1) show proficiency bars + chips
   Compact modules show chips only
   ─────────────────────────────────────────────────────────── */
const SkillModule = memo(function SkillModule({
  cat,
  catIndex,
  globalIndex,
  isLarge,
  inView,
}: {
  cat:         typeof skillCategories[number]
  catIndex:    number
  globalIndex: number
  isLarge:     boolean
  inView:      boolean
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotX   = useSpring(useTransform(mouseY, [-0.5, 0.5], [ isLarge ? 3 : 4.5, isLarge ? -3 : -4.5]), { stiffness: 160, damping: 22 })
  const rotY   = useSpring(useTransform(mouseX, [-0.5, 0.5], [-isLarge ? 3 : 4.5,  isLarge ? 3 : 4.5 ]), { stiffness: 160, damping: 22 })

  const [hovered, setHovered] = useState(false)
  const [shimmer, setShimmer] = useState(false)
  const [chipIn,  setChipIn]  = useState(false)

  const accent = CAT_ACCENTS[catIndex % 6] ?? CAT_ACCENTS[0]

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
    setTimeout(() => setShimmer(false), 650)
  }, [])

  const onML = useCallback(() => {
    mouseX.set(0); mouseY.set(0)
    setHovered(false)
  }, [mouseX, mouseY])

  /* Activate chips as soon as section is in view */
  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setChipIn(true), 80 + globalIndex * 60)
      return () => clearTimeout(t)
    }
  }, [inView, globalIndex])

  /* Stagger vertical offsets for asymmetric rhythm */
  const yOffsets = [0, 18, -10, 14, -8, 20]
  const yOff     = isLarge ? 0 : yOffsets[globalIndex % yOffsets.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 + Math.abs(yOff) }}
      animate={inView ? { opacity: 1, y: yOff } : {}}
      transition={{ duration: 0.65, delay: 0.06 + globalIndex * 0.08, ease: EASE_EXPO }}
      style={{
        transformStyle: 'preserve-3d',
        perspective:    900,
        gridRow:        isLarge ? 'span 1' : 'auto',
        height:         '100%',
      }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMM}
        onMouseEnter={onME}
        onMouseLeave={onML}
        style={{ rotateX: rotX, rotateY: rotY, height: '100%' }}
      >
        <div style={{
          background:   hovered
            ? 'linear-gradient(145deg, var(--canvas-3), var(--canvas-2))'
            : 'var(--canvas-2)',
          border:       `1px solid ${hovered ? accent.bdr : 'var(--canvas-4)'}`,
          borderRadius: 'var(--r-xl)',
          padding:      isLarge ? '1.85rem' : '1.5rem',
          height:       '100%',
          display:      'flex',
          flexDirection: 'column',
          gap:          isLarge ? '1.3rem' : '1.1rem',
          position:     'relative',
          overflow:     'hidden',
          transition:   'border-color 0.3s, background 0.3s, box-shadow 0.3s',
          boxShadow:    hovered
            ? `0 0 0 1px ${accent.bdr}, 0 20px 50px rgba(0,0,0,0.35), 0 0 60px ${accent.glow}`
            : 'none',
          cursor:       'default',
        }}>

          {/* Top accent line */}
          <div aria-hidden="true" style={{
            position:   'absolute',
            top: 0, left: '6%', right: '6%',
            height:     '1.5px',
            background: `linear-gradient(to right, transparent, ${accent.color}, transparent)`,
            opacity:    hovered ? 1 : 0.22,
            transition: 'opacity 0.3s',
          }} />

          {/* Shimmer */}
          <AnimatePresence>
            {shimmer && (
              <motion.div
                key="ss"
                initial={{ x: '-110%' }}
                animate={{ x: '220%' }}
                exit={{}}
                transition={{ duration: 0.65, ease: 'linear' }}
                aria-hidden="true"
                style={{
                  position:      'absolute', inset: 0,
                  background:    `linear-gradient(90deg, transparent, ${accent.glow}, transparent)`,
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
            background:    `radial-gradient(circle at 100% 0%, ${accent.dim}, transparent 70%)`,
            opacity:       hovered ? 1 : 0.4,
            transition:    'opacity 0.3s',
            pointerEvents: 'none',
          }} />

          {/* Large decorative background initial */}
          <div aria-hidden="true" style={{
            position:      'absolute',
            bottom:        '-0.5rem',
            right:         '-0.25rem',
            fontFamily:    'var(--font-family-display)',
            fontStyle:     'italic',
            fontWeight:    800,
            fontSize:      isLarge ? '8rem' : '6rem',
            lineHeight:    1,
            color:         accent.color,
            opacity:       hovered ? 0.05 : 0.02,
            transition:    'opacity 0.4s',
            userSelect:    'none',
            pointerEvents: 'none',
            letterSpacing: '-0.05em',
          }}>
            {cat.label[0]}
          </div>

          {/* ── Header ── */}
          <div style={{
            display:    'flex',
            alignItems: 'center',
            gap:        '0.7rem',
            position:   'relative',
            zIndex:     2,
          }}>
            {/* Icon pod */}
            <motion.div
              animate={{ scale: hovered ? 1.1 : 1 }}
              transition={{ duration: 0.25, ease: EASE_SPRING }}
              style={{
                width:          isLarge ? '2.5rem' : '2.1rem',
                height:         isLarge ? '2.5rem' : '2.1rem',
                borderRadius:   'var(--r-sm)',
                background:     hovered ? accent.dim : 'var(--canvas-3)',
                border:         `1px solid ${hovered ? accent.bdr : 'var(--canvas-4)'}`,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                color:          hovered ? accent.color : 'var(--t3)',
                flexShrink:     0,
                transition:     'all 0.25s',
                boxShadow:      hovered ? `0 0 16px ${accent.glow}` : 'none',
              }}
            >
              <svg
                width={isLarge ? 17 : 15}
                height={isLarge ? 17 : 15}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d={cat.icon} />
              </svg>
            </motion.div>

            {/* Title */}
            <h3 style={{
              fontFamily:    'var(--font-family-display)',
              fontWeight:    700,
              fontSize:      isLarge ? 'clamp(1rem,1.5vw,1.2rem)' : 'clamp(0.9rem,1.1vw,1rem)',
              letterSpacing: '-0.01em',
              color:         hovered ? 'var(--t1)' : 'var(--t2)',
              transition:    'color 0.22s',
            }}>
              {cat.label}
            </h3>

            {/* Skill count badge */}
            <div style={{
              marginLeft:    'auto',
              fontFamily:    'var(--font-family-mono)',
              fontSize:      '0.52rem',
              color:         hovered ? accent.color : 'var(--t3)',
              background:    hovered ? accent.dim : 'transparent',
              border:        `1px solid ${hovered ? accent.bdr : 'transparent'}`,
              padding:       '2px 7px',
              borderRadius:  100,
              transition:    'all 0.22s',
              letterSpacing: '0.06em',
              whiteSpace:    'nowrap',
            }}>
              {cat.pills.length} skills
            </div>
          </div>

          {/* ── Gradient divider ── */}
          <div style={{
            height:     '1px',
            background: hovered
              ? `linear-gradient(to right, ${accent.color}, var(--canvas-4), transparent)`
              : 'linear-gradient(to right, var(--canvas-4), transparent)',
            transition: 'background 0.3s',
            position:   'relative',
            zIndex:     2,
          }} />

          {/* ── Proficiency bars (large modules only) ── */}
          {isLarge && (
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{
                fontFamily:    'var(--font-family-accent)',
                fontSize:      '0.54rem',
                color:         accent.color,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom:  '0.75rem',
                opacity:       0.7,
              }}>
                Top Proficiency
              </div>
              <ProficiencyBars skills={cat.pills} accent={accent} active={chipIn} />
            </div>
          )}

          {/* ── Skill chips — all modules ── */}
          <div style={{
            display:   'flex',
            flexWrap:  'wrap',
            gap:       '0.35rem',
            position:  'relative',
            zIndex:    2,
          }}>
            {cat.pills.map((pill, pi) => (
              <SkillChip
                key={pill}
                skill={pill}
                accent={accent}
                index={pi}
                active={chipIn}
              />
            ))}
          </div>

          {/* Bottom bar */}
          <motion.div
            animate={{ scaleX: hovered ? 1 : 0 }}
            initial={{ scaleX: 0 }}
            transition={{ duration: 0.4, ease: EASE_EXPO }}
            aria-hidden="true"
            style={{
              position:        'absolute',
              bottom: 0, left: '6%', right: '6%',
              height:          '1.5px',
              background:      `linear-gradient(to right, transparent, ${accent.color}, transparent)`,
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
   MASTHEAD STATS — total skills + categories
   ─────────────────────────────────────────────────────────── */
function MastheadStats({ inView }: { inView: boolean }) {
  const totalSkills = skillCategories.reduce((acc, c) => acc + c.pills.length, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.35, ease: EASE_EXPO }}
      style={{
        display:   'flex',
        alignItems: 'center',
        gap:        '1.5rem',
        flexWrap:  'wrap',
      }}
    >
      {[
        { val: totalSkills.toString(),           label: 'Total Skills'    },
        { val: skillCategories.length.toString(), label: 'Domains'        },
        { val: '3+',                              label: 'Years Mastering' },
      ].map(({ val, label }, i) => (
        <div key={label} style={{
          display:    'flex',
          alignItems: 'baseline',
          gap:        '0.4rem',
        }}>
          <span style={{
            fontFamily:    'var(--font-family-display)',
            fontStyle:     i % 2 === 0 ? 'italic' : 'normal',
            fontWeight:    700,
            fontSize:      'clamp(1.3rem, 2vw, 1.7rem)',
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
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            {label}
          </span>
          {i < 2 && (
            <span style={{ color: 'var(--canvas-4)', marginLeft: '1rem', fontSize: '0.7rem' }}>·</span>
          )}
        </div>
      ))}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAIN SECTION
   ─────────────────────────────────────────────────────────── */
export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)
  const gridRef    = useRef<HTMLDivElement>(null)
  const inView     = useInView(gridRef,  { once: true, margin: '-20px' })
  const hInView    = useInView(headerRef, { once: true })

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="section-pad"
      style={{
        background: 'var(--canvas)',
        position:   'relative',
        overflow:   'hidden',
      }}
    >
      <SectionCursorLight sectionRef={sectionRef} />

      {/* Ambient layers */}
      <div aria-hidden="true" style={{
        position:      'absolute', inset: 0,
        background:    'radial-gradient(ellipse 50% 40% at 5% 50%, rgba(200,168,75,0.018) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position:      'absolute', inset: 0,
        background:    'radial-gradient(ellipse 45% 40% at 95% 50%, rgba(0,255,148,0.015) 0%, transparent 65%)',
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
        <div
          ref={headerRef}
          style={{
            display:        'flex',
            alignItems:     'flex-end',
            justifyContent: 'space-between',
            flexWrap:       'wrap',
            gap:            '1.5rem',
            marginBottom:   '3.5rem',
          }}
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={hInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease: EASE_EXPO }}
              style={{ marginBottom: '0.7rem' }}
            >
              <span className="section-label">// Skill Intelligence</span>
            </motion.div>

            <div style={{ overflow: 'hidden' }}>
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={hInView ? { y: 0, opacity: 1 } : {}}
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
                  The full
                </span>
              </motion.div>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={hInView ? { y: 0, opacity: 1 } : {}}
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
                  stack.
                </span>
              </motion.div>
            </div>
          </div>

          <MastheadStats inView={hInView} />
        </div>

        {/* ── Skill modules grid ── */}
        <div
          ref={gridRef}
          className="skills-module-grid"
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap:                 '1.2rem',
            alignItems:          'start',
            paddingBottom:       '2rem', /* room for offset cards */
          }}
        >
          {skillCategories.map((cat, i) => (
            <SkillModule
              key={cat.id}
              cat={cat}
              catIndex={i}
              globalIndex={i}
              isLarge={i === 0 || i === 1} /* First two get proficiency bars */
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
        @media (max-width: 1024px) {
          .skills-module-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .skills-module-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}