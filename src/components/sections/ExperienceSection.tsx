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
import { jobs } from '@/lib/data'

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
   ─────────────────────────────────────────────────────────── */
const EASE_EXPO   = [0.16, 1, 0.3, 1]    as const
const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const

/* ─────────────────────────────────────────────────────────────
   ACHIEVEMENT CAPSULE
   Floating pill for each bullet — staggered entrance
   ─────────────────────────────────────────────────────────── */
const AchievementCapsule = memo(function AchievementCapsule({
  text,
  index,
  active,
  isCurrent,
}: {
  text:      string
  index:     number
  active:    boolean
  isCurrent?: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.95 }}
      animate={active
        ? { opacity: 1, y: 0, scale: 1 }
        : { opacity: 0, y: 14, scale: 0.95 }
      }
      transition={{
        duration: 0.45,
        delay:    active ? 0.18 + index * 0.07 : 0,
        ease:     EASE_EXPO,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:    'flex',
        alignItems: 'flex-start',
        gap:        '0.6rem',
        padding:    '0.75rem 1rem',
        background: hovered
          ? isCurrent ? 'rgba(0,255,148,0.06)' : 'var(--gold-dim)'
          : 'var(--canvas-3)',
        border:     `1px solid ${
          hovered
            ? isCurrent ? 'var(--ac-bdr)' : 'var(--gold-bdr)'
            : 'var(--canvas-4)'
        }`,
        borderRadius:  'var(--r-sm)',
        transition:    'all 0.25s var(--ease-expo)',
        transform:     hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow:     hovered
          ? isCurrent ? '0 4px 20px rgba(0,255,148,0.08)' : 'var(--sh-gd)'
          : 'none',
        cursor:        'default',
        position:      'relative',
        overflow:      'hidden',
      }}
    >
      {/* Accent dot */}
      <span style={{
        width:        5, height: 5,
        borderRadius: '50%',
        background:   isCurrent ? 'var(--ac)' : 'var(--gold)',
        display:      'block',
        flexShrink:   0,
        marginTop:    '0.38rem',
        boxShadow:    isCurrent
          ? '0 0 6px rgba(0,255,148,0.5)'
          : '0 0 6px var(--gold-glow)',
      }} />

      <span style={{
        fontFamily:  'var(--font-family-sans)',
        fontSize:    'var(--text-sm)',
        color:       hovered ? 'var(--t1)' : 'var(--t2)',
        fontWeight:  300,
        lineHeight:  1.65,
        transition:  'color 0.2s',
      }}>
        {text}
      </span>
    </motion.div>
  )
})

/* ─────────────────────────────────────────────────────────────
   EXPERIENCE PANEL
   Full-width cinematic panel per job
   Left: role/company/meta  |  Right: achievement capsules
   ─────────────────────────────────────────────────────────── */
const ExperiencePanel = memo(function ExperiencePanel({
  job,
  index,
  isActive,
  total,
}: {
  job:      (typeof jobs)[number]
  index:    number
  isActive: boolean
  total:    number
}) {
  const panelRef = useRef<HTMLDivElement>(null)

  /* Tilt on mouse */
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotX   = useSpring(useTransform(mouseY, [-0.5, 0.5], [2.5, -2.5]), { stiffness: 160, damping: 22 })
  const rotY   = useSpring(useTransform(mouseX, [-0.5, 0.5], [-2.5, 2.5]), { stiffness: 160, damping: 22 })

  const [hovered, setHovered] = useState(false)
  const [shimmer, setShimmer] = useState(false)

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el   = panelRef.current
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

  const accentColor = job.current ? 'var(--ac)'     : 'var(--gold)'
  const accentDim   = job.current ? 'var(--ac-dim)' : 'var(--gold-dim)'
  const accentBdr   = job.current ? 'var(--ac-bdr)' : 'var(--gold-bdr)'
  const accentGlow  = job.current
    ? '0 0 60px rgba(0,255,148,0.07)'
    : '0 0 60px rgba(200,168,75,0.07)'

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.4, y: 0 }}
      transition={{ duration: 0.65, ease: EASE_EXPO }}
      style={{
        flexShrink:     0,
        width:          '100%',
        scrollSnapAlign: 'start',
        paddingBottom:  '0.5rem',
      }}
    >
      <motion.div
        ref={panelRef}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          rotateX:        rotX,
          rotateY:        rotY,
          transformStyle: 'preserve-3d',
          perspective:    1000,
        }}
      >
        <div style={{
          background:   hovered
            ? `linear-gradient(145deg, var(--canvas-3), var(--canvas-2))`
            : 'var(--canvas-2)',
          border:       `1px solid ${hovered ? accentBdr : 'var(--canvas-4)'}`,
          borderRadius: 'var(--r-xl)',
          padding:      'clamp(1.75rem, 3vw, 2.5rem)',
          position:     'relative',
          overflow:     'hidden',
          transition:   'border-color 0.3s, background 0.3s, box-shadow 0.3s',
          boxShadow:    hovered
            ? `${accentGlow}, var(--sh)`
            : 'var(--sh-sm)',
        }}>

          {/* Top accent line */}
          <div aria-hidden="true" style={{
            position:   'absolute',
            top: 0, left: '6%', right: '6%',
            height:     '1.5px',
            background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`,
            opacity:    hovered ? 1 : 0.35,
            transition: 'opacity 0.3s',
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
                  background:    job.current
                    ? 'linear-gradient(90deg, transparent, rgba(0,255,148,0.05), transparent)'
                    : 'linear-gradient(90deg, transparent, rgba(200,168,75,0.07), transparent)',
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
            background:    `radial-gradient(circle at 100% 0%, ${accentDim}, transparent 70%)`,
            opacity:       hovered ? 1 : 0.5,
            transition:    'opacity 0.3s',
            pointerEvents: 'none',
          }} />

          {/* ── 2-col layout ── */}
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.1fr)',
            gap:                 'clamp(2rem, 4vw, 3.5rem)',
            alignItems:          'start',
            position:            'relative',
            zIndex:              2,
          }}
          className="exp-panel-grid"
          >

            {/* ════ LEFT — IDENTITY ════ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>

              {/* Index label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  fontFamily:    'var(--font-family-mono)',
                  fontSize:      '0.56rem',
                  color:         accentColor,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  opacity:       0.7,
                }}>
                  {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
                <div style={{ flex: 1, height: '1px', background: accentBdr, maxWidth: 40 }} />
              </div>

              {/* Role */}
              <div>
                <h3 style={{
                  fontFamily:    'var(--font-family-display)',
                  fontWeight:    800,
                  fontSize:      'clamp(1.4rem, 2.4vw, 2rem)',
                  letterSpacing: '-0.025em',
                  lineHeight:    1.0,
                  color:         'var(--t1)',
                  marginBottom:  '0.55rem',
                }}>
                  {job.role}
                </h3>

                {/* Company — italic gold/green */}
                <div style={{
                  fontFamily:    'var(--font-family-display)',
                  fontStyle:     'italic',
                  fontWeight:    600,
                  fontSize:      'clamp(1rem, 1.5vw, 1.2rem)',
                  color:         accentColor,
                  letterSpacing: '-0.005em',
                  lineHeight:    1,
                  textShadow:    job.current
                    ? '0 0 20px rgba(0,255,148,0.2)'
                    : '0 0 20px var(--gold-glow)',
                }}>
                  {job.company}
                </div>
              </div>

              {/* Meta row */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

                {/* Period chip */}
                <div style={{
                  display:    'inline-flex',
                  alignItems: 'center',
                  gap:        6,
                  width:      'fit-content',
                }}>
                  <time style={{
                    fontFamily:    'var(--font-family-mono)',
                    fontSize:      'var(--text-xs)',
                    color:         'var(--t3)',
                    letterSpacing: '0.08em',
                    background:    'var(--canvas-3)',
                    border:        '1px solid var(--canvas-4)',
                    padding:       '0.2rem 0.65rem',
                    borderRadius:  'var(--r-xs)',
                    whiteSpace:    'nowrap',
                  }}>
                    {job.period}
                  </time>
                </div>

                {/* Location */}
                <span style={{
                  fontFamily:    'var(--font-family-mono)',
                  fontSize:      'var(--text-xs)',
                  color:         'var(--t3)',
                  letterSpacing: '0.06em',
                }}>
                  {job.location}
                </span>
              </div>

              {/* Current badge */}
              {job.current && (
                <div style={{
                  display:      'inline-flex',
                  alignItems:   'center',
                  gap:          5,
                  background:   'var(--ac-dim)',
                  border:       '1px solid var(--ac-bdr)',
                  borderRadius: 100,
                  padding:      '0.22rem 0.7rem',
                  width:        'fit-content',
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
                    fontWeight:    600,
                  }}>
                    Current Role
                  </span>
                </div>
              )}

              {/* Decorative vertical line */}
              <div style={{
                width:        '1.5px',
                height:       48,
                background:   `linear-gradient(to bottom, ${accentColor}, transparent)`,
                opacity:      0.3,
                marginTop:    'auto',
              }} />
            </div>

            {/* ════ RIGHT — ACHIEVEMENT CAPSULES ════ */}
            <div>
              <div style={{
                fontFamily:    'var(--font-family-accent)',
                fontSize:      '0.58rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color:         accentColor,
                marginBottom:  '1rem',
                opacity:       0.75,
              }}>
                Key Contributions
              </div>

              <div style={{
                display:       'flex',
                flexDirection: 'column',
                gap:           '0.6rem',
              }}>
                {job.bullets.map((bullet, bi) => (
                  <AchievementCapsule
                    key={bi}
                    text={bullet}
                    index={bi}
                    active={isActive}
                    isCurrent={job.current}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Bottom accent bar */}
          <motion.div
            animate={{ scaleX: hovered ? 1 : 0 }}
            initial={{ scaleX: 0 }}
            transition={{ duration: 0.4, ease: EASE_EXPO }}
            aria-hidden="true"
            style={{
              position:        'absolute',
              bottom: 0, left: '8%', right: '8%',
              height:          '1.5px',
              background:      `linear-gradient(to right, transparent, ${accentColor}, transparent)`,
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
   PROGRESS DOTS — shows active panel
   ─────────────────────────────────────────────────────────── */
function ProgressDots({
  total,
  active,
  onSelect,
}: {
  total:    number
  active:   number
  onSelect: (i: number) => void
}) {
  return (
    <div style={{
      display:    'flex',
      alignItems: 'center',
      gap:        '0.45rem',
    }}>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          aria-label={`View job ${i + 1}`}
          style={{
            width:        i === active ? 24 : 6,
            height:       6,
            borderRadius: 3,
            background:   i === active
              ? jobs[i]?.current ? 'var(--ac)' : 'var(--gold)'
              : 'var(--canvas-4)',
            border:       'none',
            cursor:       'pointer',
            padding:      0,
            transition:   'all 0.35s var(--ease-expo)',
            boxShadow:    i === active
              ? jobs[i]?.current
                ? '0 0 8px rgba(0,255,148,0.4)'
                : '0 0 8px var(--gold-glow)'
              : 'none',
          }}
        />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAIN SECTION
   ─────────────────────────────────────────────────────────── */
export default function ExperienceSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const trackRef    = useRef<HTMLDivElement>(null)
  const headerRef   = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true })

  const [activeIndex, setActiveIndex] = useState(0)
  const total = jobs.length

  /* Sync active index from scroll position */
  const onScroll = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const index = Math.round(el.scrollLeft / el.clientWidth)
    setActiveIndex(Math.min(index, total - 1))
  }, [total])

  /* Scroll to panel programmatically */
  const goTo = useCallback((i: number) => {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
    setActiveIndex(i)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [onScroll])

  /* Keyboard navigation */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const inViewport = rect.top < window.innerHeight && rect.bottom > 0
      if (!inViewport) return
      if (e.key === 'ArrowRight' && activeIndex < total - 1) goTo(activeIndex + 1)
      if (e.key === 'ArrowLeft'  && activeIndex > 0)         goTo(activeIndex - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIndex, goTo, total])

  return (
    <section
      id="experience"
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
        position:      'absolute', inset: 0,
        background:    'radial-gradient(ellipse 60% 40% at 5% 50%, rgba(0,255,148,0.015) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position:      'absolute', inset: 0,
        background:    'radial-gradient(ellipse 50% 40% at 95% 55%, rgba(200,168,75,0.015) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position:   'absolute',
        top: 0, left: '50%',
        transform:  'translateX(-50%)',
        width:      200, height: 1,
        background: 'linear-gradient(to right, transparent, var(--ac-bdr), transparent)',
      }} />

      <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Header + controls ── */}
        <div
          ref={headerRef}
          style={{
            display:        'flex',
            alignItems:     'flex-end',
            justifyContent: 'space-between',
            flexWrap:       'wrap',
            gap:            '1.5rem',
            marginBottom:   '3rem',
          }}
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease: EASE_EXPO }}
              style={{ marginBottom: '0.7rem' }}
            >
              <span className="section-label">// Experience</span>
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
                  Where I&apos;ve
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
                    built things.
                  </span>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.25, ease: EASE_EXPO }}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}
          >
            {/* Progress dots */}
            <ProgressDots total={total} active={activeIndex} onSelect={goTo} />

            {/* Arrow buttons */}
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {(['prev', 'next'] as const).map((dir) => {
                const isPrev    = dir === 'prev'
                const disabled  = isPrev ? activeIndex === 0 : activeIndex === total - 1
                return (
                  <button
                    key={dir}
                    onClick={() => goTo(isPrev ? activeIndex - 1 : activeIndex + 1)}
                    disabled={disabled}
                    aria-label={isPrev ? 'Previous role' : 'Next role'}
                    style={{
                      width:          36, height: 36,
                      borderRadius:   'var(--r-sm)',
                      background:     'var(--canvas-3)',
                      border:         '1px solid var(--canvas-4)',
                      color:          disabled ? 'var(--t3)' : 'var(--t2)',
                      cursor:         disabled ? 'not-allowed' : 'pointer',
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      opacity:        disabled ? 0.4 : 1,
                      transition:     'all 0.2s var(--ease-expo)',
                      fontSize:       '0.9rem',
                    }}
                    onMouseEnter={e => {
                      if (disabled) return
                      const el = e.currentTarget
                      el.style.borderColor = 'var(--gold-bdr)'
                      el.style.color       = 'var(--gold)'
                      el.style.background  = 'var(--gold-dim)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget
                      el.style.borderColor = 'var(--canvas-4)'
                      el.style.color       = disabled ? 'var(--t3)' : 'var(--t2)'
                      el.style.background  = 'var(--canvas-3)'
                    }}
                  >
                    {isPrev ? '←' : '→'}
                  </button>
                )
              })}
            </div>

            {/* Keyboard hint */}
            <span style={{
              fontFamily:    'var(--font-family-mono)',
              fontSize:      '0.52rem',
              color:         'var(--t3)',
              letterSpacing: '0.06em',
              display:       'flex',
              alignItems:    'center',
              gap:           4,
            }}>
              <kbd style={{
                background:    'var(--canvas-3)',
                border:        '1px solid var(--canvas-4)',
                borderRadius:  3,
                padding:       '1px 5px',
                fontSize:      '0.55rem',
                color:         'var(--t3)',
                fontFamily:    'var(--font-family-mono)',
              }}>←</kbd>
              <kbd style={{
                background:    'var(--canvas-3)',
                border:        '1px solid var(--canvas-4)',
                borderRadius:  3,
                padding:       '1px 5px',
                fontSize:      '0.55rem',
                color:         'var(--t3)',
                fontFamily:    'var(--font-family-mono)',
              }}>→</kbd>
              navigate
            </span>
          </motion.div>
        </div>

        {/* ── Horizontal snap track ── */}
        <div
          ref={trackRef}
          style={{
            display:             'flex',
            overflowX:           'auto',
            scrollSnapType:      'x mandatory',
            scrollBehavior:      'smooth',
            gap:                 '1.5rem',
            paddingBottom:       '1rem',
            /* Hide scrollbar */
            msOverflowStyle:     'none',
            scrollbarWidth:      'none',
          }}
          /* @ts-ignore */
          css={`&::-webkit-scrollbar { display: none; }`}
        >
          {jobs.map((job, i) => (
            <div
              key={job.id}
              style={{
                flexShrink:     0,
                width:          '100%',
                scrollSnapAlign: 'start',
              }}
            >
              <ExperiencePanel
                job={job}
                index={i}
                isActive={activeIndex === i}
                total={total}
              />
            </div>
          ))}
        </div>

        {/* ── Swipe hint on mobile ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          style={{
            display:       'flex',
            justifyContent: 'center',
            marginTop:     '1.25rem',
          }}
          className="exp-swipe-hint"
        >
          <span style={{
            fontFamily:    'var(--font-family-mono)',
            fontSize:      '0.52rem',
            color:         'var(--t3)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            swipe to explore ·{' '}
            {activeIndex + 1} of {total}
          </span>
        </motion.div>
      </div>

      <style>{`
        /* Hide scrollbar in WebKit */
        [data-exp-track]::-webkit-scrollbar { display: none; }

        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(2.4); opacity: 0;   }
        }
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(0.78); }
        }

        /* Desktop: hide swipe hint */
        @media (min-width: 769px) {
          .exp-swipe-hint { display: none !important; }
        }

        /* Tablet: reduce panel grid to single col */
        @media (max-width: 768px) {
          .exp-panel-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </section>
  )
}