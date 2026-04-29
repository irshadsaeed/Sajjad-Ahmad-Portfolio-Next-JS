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
const E  = [0.16, 1, 0.3, 1]    as const
const ES = [0.34, 1.56, 0.64, 1] as const

/* ─────────────────────────────────────────────────────────────
   ACHIEVEMENT CAPSULE
   ─────────────────────────────────────────────────────────── */
const AchievementCapsule = memo(function AchievementCapsule({
  text, index, active, isCurrent,
}: {
  text: string; index: number; active: boolean; isCurrent?: boolean
}) {
  const [hov, setHov] = useState(false)
  const color = isCurrent ? 'var(--ac)' : 'var(--gold)'
  const dim   = isCurrent ? 'var(--ac-dim)' : 'var(--gold-dim)'
  const bdr   = isCurrent ? 'var(--ac-bdr)' : 'var(--gold-bdr)'

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
      transition={{ duration: 0.4, delay: active ? 0.15 + index * 0.065 : 0, ease: E }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:      'flex',
        alignItems:   'flex-start',
        gap:          '0.7rem',
        padding:      '0.8rem 1rem',
        background:   hov ? dim : 'var(--canvas-3)',
        border:       `1px solid ${hov ? bdr : 'var(--canvas-4)'}`,
        borderRadius: 'var(--r-md)',
        transition:   'all 0.25s var(--ease-expo)',
        transform:    hov ? 'translateX(4px)' : 'translateX(0)',
        boxShadow:    hov
          ? isCurrent ? '0 4px 16px rgba(0,255,148,0.06)' : '0 4px 16px rgba(200,168,75,0.06)'
          : 'none',
        cursor:       'default',
        position:     'relative',
        overflow:     'hidden',
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position:   'absolute',
        left: 0, top: '15%', bottom: '15%',
        width:      '2px',
        background: hov ? color : 'transparent',
        borderRadius: 1,
        transition: 'background 0.25s',
      }} />

      {/* Dot */}
      <span style={{
        width:        5, height: 5, borderRadius: '50%',
        background:   hov ? color : 'var(--t3)',
        display:      'block', flexShrink: 0, marginTop: '0.42rem',
        boxShadow:    hov ? `0 0 8px ${color}` : 'none',
        transition:   'all 0.22s',
      }} />

      {/* Text */}
      <span style={{
        fontFamily:    'var(--font-family-sans)',
        fontSize:      'clamp(0.78rem, 0.9vw, 0.86rem)',
        color:         hov ? 'var(--t1)' : 'var(--t2)',
        fontWeight:    300,
        lineHeight:    1.75,
        letterSpacing: '0.005em',
        transition:    'color 0.2s',
      }}>
        {text}
      </span>
    </motion.div>
  )
})

/* ─────────────────────────────────────────────────────────────
   EXPERIENCE PANEL
   ─────────────────────────────────────────────────────────── */
const ExperiencePanel = memo(function ExperiencePanel({
  job, index, isActive, total,
}: {
  job: (typeof jobs)[number]; index: number; isActive: boolean; total: number
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const mouseX   = useMotionValue(0)
  const mouseY   = useMotionValue(0)
  const rotX     = useSpring(useTransform(mouseY, [-0.5, 0.5], [2, -2]), { stiffness: 140, damping: 22 })
  const rotY     = useSpring(useTransform(mouseX, [-0.5, 0.5], [-2, 2]), { stiffness: 140, damping: 22 })
  const [hov, setHov]   = useState(false)
  const [shim, setShim] = useState(false)

  const onMM = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = panelRef.current; if (!el) return
    const r  = el.getBoundingClientRect()
    mouseX.set((e.clientX - r.left) / r.width  - 0.5)
    mouseY.set((e.clientY - r.top)  / r.height - 0.5)
  }, [mouseX, mouseY])

  const onME = useCallback(() => {
    setHov(true); setShim(true); setTimeout(() => setShim(false), 650)
  }, [])

  const onML = useCallback(() => { mouseX.set(0); mouseY.set(0); setHov(false) }, [mouseX, mouseY])

  const color    = job.current ? 'var(--ac)'     : 'var(--gold)'
  const colorDim = job.current ? 'var(--ac-dim)' : 'var(--gold-dim)'
  const colorBdr = job.current ? 'var(--ac-bdr)' : 'var(--gold-bdr)'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.38, y: 0 }}
      transition={{ duration: 0.6, ease: E }}
      style={{ flexShrink: 0, width: '100%', scrollSnapAlign: 'start' }}
    >
      <motion.div
        ref={panelRef}
        onMouseMove={onMM} onMouseEnter={onME} onMouseLeave={onML}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', perspective: 1000 }}
      >
        <div style={{
          background:   hov
            ? 'linear-gradient(145deg, var(--canvas-3), var(--canvas-2))'
            : 'var(--canvas-2)',
          border:       `1px solid ${hov ? colorBdr : 'var(--canvas-4)'}`,
          borderRadius: 'var(--r-xl)',
          padding:      'clamp(1.75rem, 3vw, 2.5rem)',
          position:     'relative',
          overflow:     'hidden',
          transition:   'border-color 0.3s, background 0.3s, box-shadow 0.3s',
          boxShadow:    hov
            ? `0 0 0 1px ${colorBdr}, 0 24px 60px rgba(0,0,0,0.35), 0 0 60px ${job.current ? 'rgba(0,255,148,0.05)' : 'rgba(200,168,75,0.07)'}`
            : 'var(--sh-sm)',
        }}>

          {/* Top accent line */}
          <div aria-hidden="true" style={{
            position:   'absolute', top: 0, left: '6%', right: '6%',
            height:     '1.5px',
            background: `linear-gradient(to right, transparent, ${color}, transparent)`,
            opacity:    hov ? 1 : 0.3,
            transition: 'opacity 0.3s',
          }} />

          {/* Shimmer */}
          <AnimatePresence>
            {shim && (
              <motion.div
                key="s"
                initial={{ x: '-110%' }} animate={{ x: '220%' }} exit={{}}
                transition={{ duration: 0.65, ease: 'linear' }}
                aria-hidden="true"
                style={{
                  position: 'absolute', inset: 0,
                  background: job.current
                    ? 'linear-gradient(90deg,transparent,rgba(0,255,148,0.04),transparent)'
                    : 'linear-gradient(90deg,transparent,rgba(200,168,75,0.06),transparent)',
                  pointerEvents: 'none', zIndex: 1,
                }}
              />
            )}
          </AnimatePresence>

          {/* Corner glow */}
          <div aria-hidden="true" style={{
            position: 'absolute', top: 0, right: 0, width: 130, height: 130,
            background: `radial-gradient(circle at 100% 0%, ${colorDim}, transparent 70%)`,
            opacity: hov ? 1 : 0.45, transition: 'opacity 0.3s', pointerEvents: 'none',
          }} />

          {/* Panel grid */}
          <div className="exp-panel-grid" style={{
            display:             'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.15fr)',
            gap:                 'clamp(1.75rem, 4vw, 3.5rem)',
            alignItems:          'start',
            position:            'relative', zIndex: 2,
          }}>

            {/* ── LEFT ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Counter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  fontFamily:    'var(--font-family-mono)',
                  fontSize:      '0.54rem',
                  color:         color,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  opacity:       0.65,
                }}>
                  {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
                <div style={{ flex: 1, height: 1, background: colorBdr, maxWidth: 36 }} />
              </div>

              {/* Role */}
              <div>
                <h3 style={{
                  fontFamily:    'var(--font-family-display)',
                  fontWeight:    800,
                  fontSize:      'clamp(1.3rem, 2.2vw, 1.85rem)',
                  letterSpacing: '-0.025em',
                  lineHeight:    1.02,
                  color:         'var(--t1)',
                  marginBottom:  '0.5rem',
                }}>
                  {job.role}
                </h3>

                {/* Company */}
                <div style={{
                  fontFamily:    'var(--font-family-display)',
                  fontStyle:     'italic',
                  fontWeight:    600,
                  fontSize:      'clamp(0.95rem, 1.4vw, 1.1rem)',
                  color:         color,
                  letterSpacing: '-0.005em',
                  lineHeight:    1,
                  textShadow:    job.current
                    ? '0 0 18px rgba(0,255,148,0.18)'
                    : '0 0 18px rgba(200,168,75,0.18)',
                }}>
                  {job.company}
                </div>
              </div>

              {/* Meta */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <time style={{
                  fontFamily:    'var(--font-family-mono)',
                  fontSize:      '0.62rem',
                  color:         'var(--t3)',
                  letterSpacing: '0.08em',
                  background:    'var(--canvas-3)',
                  border:        '1px solid var(--canvas-4)',
                  padding:       '0.22rem 0.7rem',
                  borderRadius:  'var(--r-xs)',
                  display:       'inline-block',
                  width:         'fit-content',
                }}>
                  {job.period}
                </time>
                <span style={{
                  fontFamily:    'var(--font-family-mono)',
                  fontSize:      '0.6rem',
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
                  padding:      '0.22rem 0.75rem',
                  width:        'fit-content',
                }}>
                  <span style={{
                    width: 4, height: 4, borderRadius: '50%',
                    background: 'var(--ac)', boxShadow: '0 0 6px var(--ac)',
                    display: 'block', animation: 'pulse-dot 2s ease-in-out infinite',
                  }} />
                  <span style={{
                    fontFamily:    'var(--font-family-accent)',
                    fontSize:      '0.54rem',
                    color:         'var(--ac)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontWeight:    600,
                  }}>
                    Current Role
                  </span>
                </div>
              )}

              {/* Decorative line */}
              <div style={{
                width: '2px', height: 44, marginTop: 'auto',
                background: `linear-gradient(to bottom, ${color}, transparent)`,
                opacity: 0.28, borderRadius: 1,
              }} />
            </div>

            {/* ── RIGHT — CAPSULES ── */}
            <div>
              <div style={{
                fontFamily:    'var(--font-family-accent)',
                fontSize:      '0.56rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color:         color,
                marginBottom:  '0.85rem',
                opacity:       0.7,
                fontWeight:    500,
              }}>
                Key Contributions
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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

          {/* Bottom bar */}
          <motion.div
            animate={{ scaleX: hov ? 1 : 0 }}
            initial={{ scaleX: 0 }}
            transition={{ duration: 0.4, ease: E }}
            aria-hidden="true"
            style={{
              position:        'absolute',
              bottom: 0, left: '8%', right: '8%',
              height:          '1.5px',
              background:      `linear-gradient(to right, transparent, ${color}, transparent)`,
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
   PROGRESS DOTS
   ─────────────────────────────────────────────────────────── */
function ProgressDots({
  total, active, onSelect,
}: {
  total: number; active: number; onSelect: (i: number) => void
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          aria-label={`View job ${i + 1}`}
          style={{
            width:        i === active ? 22 : 5,
            height:       5,
            borderRadius: 3,
            background:   i === active
              ? jobs[i]?.current ? 'var(--ac)' : 'var(--gold)'
              : 'var(--canvas-4)',
            border:     'none',
            cursor:     'pointer',
            padding:    0,
            transition: 'all 0.35s var(--ease-expo)',
            boxShadow:  i === active
              ? jobs[i]?.current ? '0 0 8px rgba(0,255,148,0.4)' : '0 0 8px var(--gold-glow)'
              : 'none',
          }}
        />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   SECTION
   ─────────────────────────────────────────────────────────── */
export default function ExperienceSection() {
  const sectionRef   = useRef<HTMLElement>(null)
  const trackRef     = useRef<HTMLDivElement>(null)
  const headerRef    = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true })
  const [activeIndex, setActiveIndex] = useState(0)
  const total = jobs.length

  const onScroll = useCallback(() => {
    const el = trackRef.current; if (!el) return
    setActiveIndex(Math.min(Math.round(el.scrollLeft / el.clientWidth), total - 1))
  }, [total])

  const goTo = useCallback((i: number) => {
    trackRef.current?.scrollTo({ left: i * (trackRef.current.clientWidth), behavior: 'smooth' })
    setActiveIndex(i)
  }, [])

  useEffect(() => {
    const el = trackRef.current; if (!el) return
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [onScroll])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (!sectionRef.current) return
      const r = sectionRef.current.getBoundingClientRect()
      if (r.top > window.innerHeight || r.bottom < 0) return
      if (e.key === 'ArrowRight' && activeIndex < total - 1) goTo(activeIndex + 1)
      if (e.key === 'ArrowLeft'  && activeIndex > 0)         goTo(activeIndex - 1)
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [activeIndex, goTo, total])

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="section-pad"
      style={{ background: 'var(--canvas-2)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Ambient */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 55% 40% at 5% 50%, rgba(0,255,148,0.014) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 45% 40% at 95% 55%, rgba(200,168,75,0.014) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 200, height: 1,
        background: 'linear-gradient(to right, transparent, var(--ac-bdr), transparent)',
      }} />

      <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div
          ref={headerRef}
          style={{
            display: 'flex', alignItems: 'flex-end',
            justifyContent: 'space-between', flexWrap: 'wrap',
            gap: '1.5rem', marginBottom: '3rem',
          }}
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease: E }}
              style={{ marginBottom: '0.7rem' }}
            >
              <span className="section-label">// Experience</span>
            </motion.div>

            <div style={{ overflow: 'hidden' }}>
              <motion.div
                initial={{ y: '105%', opacity: 0 }}
                animate={headerInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.75, delay: 0.08, ease: E }}
              >
                <span style={{
                  fontFamily:    'var(--font-family-display)',
                  fontWeight:    800,
                  fontSize:      'clamp(2.2rem, 4vw, 3.4rem)',
                  letterSpacing: '-0.028em',
                  lineHeight:    0.9,
                  color:         'var(--t1)',
                  display:       'block',
                }}>
                  Where I&apos;ve
                </span>
              </motion.div>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <motion.div
                initial={{ y: '105%', opacity: 0 }}
                animate={headerInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.75, delay: 0.16, ease: E }}
              >
                <span style={{
                  fontFamily:    'var(--font-family-display)',
                  fontStyle:     'italic',
                  fontWeight:    800,
                  fontSize:      'clamp(2.2rem, 4vw, 3.4rem)',
                  letterSpacing: '-0.028em',
                  lineHeight:    0.9,
                  color:         'var(--gold)',
                  display:       'block',
                  textShadow:    '0 0 40px rgba(200,168,75,0.18)',
                }}>
                  built things.
                </span>
              </motion.div>
            </div>
          </div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.28, ease: E }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}
          >
            <ProgressDots total={total} active={activeIndex} onSelect={goTo} />

            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {(['prev', 'next'] as const).map((dir) => {
                const isPrev   = dir === 'prev'
                const disabled = isPrev ? activeIndex === 0 : activeIndex === total - 1
                return (
                  <button
                    key={dir}
                    onClick={() => goTo(isPrev ? activeIndex - 1 : activeIndex + 1)}
                    disabled={disabled}
                    aria-label={isPrev ? 'Previous' : 'Next'}
                    style={{
                      width: 34, height: 34,
                      borderRadius: 'var(--r-sm)',
                      background:   'var(--canvas-3)',
                      border:       '1px solid var(--canvas-4)',
                      color:        disabled ? 'var(--t3)' : 'var(--t2)',
                      cursor:       disabled ? 'not-allowed' : 'pointer',
                      display:      'flex', alignItems: 'center', justifyContent: 'center',
                      opacity:      disabled ? 0.38 : 1,
                      transition:   'all 0.22s var(--ease-expo)',
                      fontSize:     '0.88rem',
                      fontFamily:    'var(--font-family-mono)',
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
          </motion.div>
        </div>

        {/* Track */}
        <div
          ref={trackRef}
          style={{
            display:         'flex',
            overflowX:       'auto',
            scrollSnapType:  'x mandatory',
            scrollBehavior:  'smooth',
            paddingBottom:   '0.75rem',
            msOverflowStyle: 'none',
            scrollbarWidth:  'none',
          }}
        >
          {jobs.map((job, i) => (
            <div key={job.id} style={{ flexShrink: 0, width: '100%', scrollSnapAlign: 'start' }}>
              <ExperiencePanel
                job={job} index={i}
                isActive={activeIndex === i}
                total={total}
              />
            </div>
          ))}
        </div>

        {/* Mobile swipe hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="exp-swipe-hint"
          style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}
        >
          <span style={{
            fontFamily:    'var(--font-family-mono)',
            fontSize:      '0.52rem',
            color:         'var(--t3)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            swipe · {activeIndex + 1} of {total}
          </span>
        </motion.div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(0.78); }
        }
        @media (min-width: 769px) {
          .exp-swipe-hint { display: none !important; }
        }
        @media (max-width: 768px) {
          .exp-panel-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .exp-swipe-hint { display: flex !important; }
        }
      `}</style>
    </section>
  )
}