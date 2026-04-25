'use client'

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  Suspense,
  lazy,
} from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'

import Navbar      from '@/components/layout/Navbar'
import Footer      from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'

import { useCustomCursor } from '@/hooks/useCustomCursor'

/* ─────────────────────────────────────────────────────────────
   LAZY-LOAD all below-fold sections
   Hero is eager (LCP critical path).
   Everything else defers until near-viewport.
   ───────────────────────────────────────────────────────────── */
const AboutSection      = lazy(() => import('@/components/sections/AboutSection'))
const ExperienceSection = lazy(() => import('@/components/sections/ExperienceSection'))
const SkillsSection     = lazy(() => import('@/components/sections/SkillsSection'))
const EducationSection  = lazy(() => import('@/components/sections/EducationSection'))
const AwardsSection     = lazy(() => import('@/components/sections/AwardsSection'))
const ContactSection    = lazy(() => import('@/components/sections/ContactSection'))

/* ─────────────────────────────────────────────────────────────
   SECTION MANIFEST
   Single source of truth for nav dots + active tracking
   ───────────────────────────────────────────────────────────── */
const SECTIONS = [
  { id: 'hero',       label: 'Home'       },
  { id: 'about',      label: 'About'      },
  { id: 'experience', label: 'Experience' },
  { id: 'skills',     label: 'Skills'     },
  { id: 'education',  label: 'Education'  },
  { id: 'awards',     label: 'Awards'     },
  { id: 'contact',    label: 'Contact'    },
] as const

type SectionId = typeof SECTIONS[number]['id']

/* ─────────────────────────────────────────────────────────────
   HOOK — active section via IntersectionObserver
   ───────────────────────────────────────────────────────────── */
function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>('hero')

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id as SectionId) },
        { rootMargin: '-40% 0px -55% 0px' },
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  return active
}

/* ─────────────────────────────────────────────────────────────
   SCROLL PROGRESS BAR
   ───────────────────────────────────────────────────────────── */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: '2px',
        scaleX,
        transformOrigin: '0%',
        background: 'linear-gradient(to right, var(--ac), var(--ac-text))',
        zIndex: 9999,
        boxShadow: '0 0 10px rgba(0,255,148,0.45)',
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────
   SECTION NAV DOTS — right rail
   ───────────────────────────────────────────────────────────── */
function SectionNavDots({ active }: { active: SectionId }) {
  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <nav
      aria-label="Page sections"
      style={{
        position: 'fixed',
        right: 'clamp(1rem, 2.5vw, 2rem)',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center',
      }}
    >
      {SECTIONS.map(s => {
        const isActive = s.id === active
        return (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            aria-label={`Go to ${s.label} section`}
            aria-current={isActive ? 'true' : undefined}
            title={s.label}
            style={{
              width:        isActive ? 6 : 4,
              height:       isActive ? 22 : 4,
              borderRadius: 3,
              background:   isActive ? 'var(--ac)' : 'var(--canvas-4)',
              border:       'none',
              cursor:       'pointer',
              padding:      0,
              transition:   'all 0.35s cubic-bezier(0.16,1,0.3,1)',
              boxShadow:    isActive ? '0 0 10px rgba(0,255,148,0.5)' : 'none',
            }}
          />
        )
      })}
    </nav>
  )
}

/* ─────────────────────────────────────────────────────────────
   BACK TO TOP
   ───────────────────────────────────────────────────────────── */
function BackToTop({ visible }: { visible: boolean }) {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          onClick={scrollTop}
          initial={{ opacity: 0, y: 12, scale: 0.85 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{    opacity: 0, y: 12, scale: 0.85 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Back to top"
          style={{
            position:       'fixed',
            bottom:         'clamp(1.5rem, 3vw, 2.5rem)',
            right:          'clamp(1.5rem, 3vw, 2.5rem)',
            zIndex:         100,
            width:          42,
            height:         42,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            background:     'var(--canvas-3)',
            border:         '1px solid var(--canvas-4)',
            borderRadius:   '50%',
            cursor:         'pointer',
            color:          'var(--t2)',
            transition:     'border-color 0.2s, color 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget
            el.style.borderColor = 'var(--ac-bdr)'
            el.style.color       = 'var(--ac)'
            el.style.boxShadow   = '0 0 20px rgba(0,255,148,0.15)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget
            el.style.borderColor = 'var(--canvas-4)'
            el.style.color       = 'var(--t2)'
            el.style.boxShadow   = 'none'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M7 11V3M3 7l4-4 4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

/* ─────────────────────────────────────────────────────────────
   SECTION SKELETON — shown while lazy chunk loads
   ───────────────────────────────────────────────────────────── */
function SectionSkeleton() {
  return (
    <div
      aria-hidden="true"
      style={{
        minHeight:      '60vh',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
      }}
    >
      <div style={{
        width:       28,
        height:      28,
        border:      '2px solid var(--canvas-4)',
        borderTopColor: 'var(--ac)',
        borderRadius:   '50%',
        animation:      'spin 0.7s linear infinite',
      }} />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   SECTION REVEAL WRAPPER
   Fade + slide-up animation on first intersection
   ───────────────────────────────────────────────────────────── */
function SectionReveal({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  const ref         = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSeen(true); obs.disconnect() } },
      { threshold: 0.06 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 36 }}
      animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────────────────────── */
export default function Page() {
  useCustomCursor()

  const activeSection           = useActiveSection()
  const [showBackTop, setShowBackTop] = useState(false)
  const [mounted, setMounted]         = useState(false)

  /* Hide system cursor — set after mount to avoid SSR mismatch */
  useEffect(() => {
    document.body.style.cursor = 'none'
    setMounted(true)
    return () => { document.body.style.cursor = '' }
  }, [])

  /* Back-to-top visibility threshold — 60% of first viewport */
  useEffect(() => {
    const onScroll = () =>
      setShowBackTop(window.scrollY > window.innerHeight * 0.6)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* ── Scroll progress — top edge ── */}
      <ScrollProgressBar />

      {/* ── Right-rail section nav dots — desktop only ── */}
      {mounted && <SectionNavDots active={activeSection} />}

      {/* ── Back to top FAB ── */}
      <BackToTop visible={showBackTop} />

      {/* ── Navigation ── */}
      <Navbar />

      {/* ── Main ── */}
      <main id="main-content">

        {/* Hero — always eager, never lazy */}
        <div id="hero">
          <HeroSection />
        </div>

        <Suspense fallback={<SectionSkeleton />}>
          <SectionReveal id="about">
            <AboutSection />
          </SectionReveal>
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <SectionReveal id="experience">
            <ExperienceSection />
          </SectionReveal>
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <SectionReveal id="skills">
            <SkillsSection />
          </SectionReveal>
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <SectionReveal id="education">
            <EducationSection />
          </SectionReveal>
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <SectionReveal id="awards">
            <AwardsSection />
          </SectionReveal>
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <SectionReveal id="contact">
            <ContactSection />
          </SectionReveal>
        </Suspense>

      </main>

      {/* ── Footer ── */}
      <Footer />

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        /* Hide nav dots on narrow screens */
        @media (max-width: 900px) {
          [aria-label="Page sections"] { display: none !important; }
        }
      `}</style>
    </>
  )
}