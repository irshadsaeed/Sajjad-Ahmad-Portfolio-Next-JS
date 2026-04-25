'use client'

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
} from 'react'
import {
  motion,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import {
  ArrowUpRight,
  Mail,
  MessageCircle,
  Linkedin,
  MapPin,
  ArrowUp,
  Zap,
} from 'lucide-react'
import { identity } from '@/lib/data'

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
   ─────────────────────────────────────────────────────────── */
const EASE_EXPO   = [0.16, 1, 0.3, 1]    as const
const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const

/* ─────────────────────────────────────────────────────────────
   MAGNETIC CONTACT PILL
   Full magnetic hover with gold glow + icon shift
   ─────────────────────────────────────────────────────────── */
const MagPill = memo(function MagPill({
  href,
  label,
  icon,
  external = true,
  index = 0,
}: {
  href:      string
  label:     string
  icon:      React.ReactNode
  external?: boolean
  index?:    number
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const x   = useMotionValue(0)
  const y   = useMotionValue(0)
  const sx  = useSpring(x, { stiffness: 260, damping: 20 })
  const sy  = useSpring(y, { stiffness: 260, damping: 20 })
  const [hovered, setHovered] = useState(false)

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width  / 2) * 0.28)
    y.set((e.clientY - rect.top  - rect.height / 2) * 0.28)
  }, [x, y])

  const onMouseLeave = useCallback(() => {
    x.set(0); y.set(0); setHovered(false)
  }, [x, y])

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      aria-label={label}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={() => setHovered(true)}
      style={{ x: sx, y: sy, textDecoration: 'none', display: 'inline-flex' }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.08, ease: EASE_EXPO }}
    >
      <div style={{
        display:       'flex',
        alignItems:    'center',
        gap:           '0.5rem',
        padding:       '0.55rem 1.1rem',
        borderRadius:  'var(--r-sm)',
        background:    hovered ? 'var(--gold-dim)' : 'var(--canvas-3)',
        border:        hovered
          ? '1px solid var(--gold-bdr)'
          : '1px solid var(--canvas-4)',
        transition:    'all 0.25s var(--ease-expo)',
        boxShadow:     hovered ? 'var(--sh-gd)' : 'none',
        position:      'relative',
        overflow:      'hidden',
        whiteSpace:    'nowrap',
      }}>
        {/* Shimmer on hover */}
        {hovered && (
          <motion.div
            initial={{ x: '-110%' }}
            animate={{ x: '220%' }}
            transition={{ duration: 0.5, ease: 'linear' }}
            aria-hidden="true"
            style={{
              position:      'absolute', inset: 0,
              background:    'linear-gradient(90deg,transparent,rgba(200,168,75,0.18),transparent)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Icon */}
        <motion.span
          animate={{ rotate: hovered ? 12 : 0, color: hovered ? 'var(--gold)' : 'var(--t3)' }}
          transition={{ duration: 0.2 }}
          style={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}
        >
          {icon}
        </motion.span>

        {/* Label */}
        <span style={{
          fontFamily:    'var(--font-family-accent)',
          fontSize:      '0.6rem',
          fontWeight:    500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color:         hovered ? 'var(--gold)' : 'var(--t2)',
          transition:    'color 0.22s',
          position:      'relative',
          zIndex:        1,
        }}>
          {label}
        </span>

        {/* Arrow */}
        {external && (
          <motion.span
            animate={{ x: hovered ? 2 : 0, y: hovered ? -2 : 0, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.18 }}
            style={{
              display:  'flex',
              color:    'var(--gold)',
              position: 'relative',
              zIndex:   1,
            }}
          >
            <ArrowUpRight size={10} aria-hidden="true" />
          </motion.span>
        )}
      </div>
    </motion.a>
  )
})

/* ─────────────────────────────────────────────────────────────
   CINEMATIC CTA BLOCK
   The hero of the footer — massive serif headline + gold CTA
   ─────────────────────────────────────────────────────────── */
function CTABlock() {
  const [hovered, setHovered] = useState(false)
  const ref     = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div ref={ref} style={{ position: 'relative' }}>

      {/* Eyebrow label */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: EASE_EXPO }}
        style={{
          display:       'inline-flex',
          alignItems:    'center',
          gap:           6,
          background:    'var(--ac-dim)',
          border:        '1px solid var(--ac-bdr)',
          borderRadius:  100,
          padding:       '4px 12px',
          marginBottom:  '1.4rem',
        }}
      >
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
          fontSize:      '0.58rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color:         'var(--ac)',
          fontWeight:    500,
        }}>
          Available for New Projects
        </span>
      </motion.div>

      {/* Giant headline — two-line Playfair pattern */}
      <div style={{ marginBottom: '2rem', overflow: 'hidden' }}>
        <motion.div
          initial={{ y: '110%', opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.75, delay: 0.08, ease: EASE_EXPO }}
        >
          <div style={{
            fontFamily:    'var(--font-family-display)',
            fontWeight:    800,
            fontSize:      'clamp(2rem, 3.5vw, 3rem)',
            letterSpacing: '-0.025em',
            lineHeight:    0.9,
            color:         'var(--t1)',
          }}>
            Let's Build
          </div>
        </motion.div>

        <motion.div
          initial={{ y: '110%', opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.75, delay: 0.16, ease: EASE_EXPO }}
          style={{ overflow: 'hidden' }}
        >
          {/* Italic gold second line — the reference image signature */}
          <div style={{
            fontFamily:    'var(--font-family-display)',
            fontStyle:     'italic',
            fontWeight:    800,
            fontSize:      'clamp(2rem, 3.5vw, 3rem)',
            letterSpacing: '-0.025em',
            lineHeight:    0.9,
            color:         'var(--gold)',
            textShadow:    '0 0 60px var(--gold-glow)',
          }}>
            Something Great.
          </div>
        </motion.div>
      </div>

      {/* Sub-copy */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.28, ease: EASE_EXPO }}
        style={{
          fontFamily:  'var(--font-family-sans)',
          fontWeight:  300,
          fontSize:    'clamp(0.88rem, 1vw, 1rem)',
          color:       'var(--t2)',
          lineHeight:  1.8,
          maxWidth:    420,
          marginBottom: '2.2rem',
        }}
      >
        WordPress, Laravel, React — turning your vision into a
        {' '}
        <em style={{ fontFamily: 'var(--font-family-display)', fontStyle: 'italic', color: 'var(--gold)', fontWeight: 500 }}>
          high-performance reality.
        </em>
        {' '}
        Let's start a conversation.
      </motion.p>

      {/* Primary CTA */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.36, ease: EASE_EXPO }}
      >
        <a
          href={identity.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display:        'inline-flex',
            alignItems:     'center',
            gap:            8,
            padding:        '0.85rem 2rem',
            background:     hovered ? 'var(--gold-rich)' : 'var(--gold)',
            color:          '#0A0907',
            borderRadius:   'var(--r-sm)',
            textDecoration: 'none',
            fontFamily:     'var(--font-family-accent)',
            fontWeight:     600,
            fontSize:       '0.82rem',
            letterSpacing:  '0.06em',
            textTransform:  'uppercase',
            transition:     'all 0.25s var(--ease-expo)',
            transform:      hovered ? 'translateY(-2px)' : 'translateY(0)',
            boxShadow:      hovered ? 'var(--sh-gd)' : 'none',
            position:       'relative',
            overflow:       'hidden',
          }}
        >
          {hovered && (
            <motion.div
              initial={{ x: '-110%' }}
              animate={{ x: '220%' }}
              transition={{ duration: 0.5, ease: 'linear' }}
              aria-hidden="true"
              style={{
                position:      'absolute', inset: 0,
                background:    'linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)',
                pointerEvents: 'none',
              }}
            />
          )}
          <Zap size={14} aria-hidden="true" style={{ position: 'relative', zIndex: 1 }} />
          <span style={{ position: 'relative', zIndex: 1 }}>Start a Project</span>
          <ArrowUpRight size={13} aria-hidden="true" style={{ position: 'relative', zIndex: 1 }} />
        </a>
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   IDENTITY PANEL
   Right side — brand pod, contact pills, metadata
   ─────────────────────────────────────────────────────────── */
function IdentityPanel({
  isInView,
  links,
}: {
  isInView: boolean
  links:    { href: string; label: string; icon: React.ReactNode; external: boolean }[]
}) {
  const [logoHovered, setLogoHovered] = useState(false)

  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      gap:           '2rem',
      alignItems:    'flex-start',
    }}>

      {/* Brand identity block */}
      <motion.div
        initial={{ opacity: 0, x: 32 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.2, ease: EASE_EXPO }}
        style={{
          background:    'var(--canvas-2)',
          border:        '1px solid var(--canvas-4)',
          borderRadius:  'var(--r-xl)',
          padding:       '1.8rem',
          width:         '100%',
          position:      'relative',
          overflow:      'hidden',
        }}
      >
        {/* Gold top accent */}
        <div aria-hidden="true" style={{
          position:   'absolute',
          top: 0, left: '10%', right: '10%',
          height:     '1px',
          background: 'linear-gradient(to right, transparent, var(--gold-bdr), transparent)',
        }} />

        {/* Corner glow */}
        <div aria-hidden="true" style={{
          position:      'absolute',
          top: 0, right: 0,
          width:         100, height: 100,
          background:    'radial-gradient(circle at 100% 0%, rgba(200,168,75,0.08), transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Monogram + name */}
        <div
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1.4rem', cursor: 'default' }}
        >
          {/* SA box */}
          <motion.div
            animate={{ scale: logoHovered ? 1.04 : 1 }}
            transition={{ duration: 0.3, ease: EASE_SPRING }}
            style={{
              width:          46, height: 46,
              borderRadius:   '11px',
              background:     logoHovered ? 'var(--gold)' : 'var(--canvas-3)',
              border:         logoHovered ? '1px solid var(--gold)' : '1px solid var(--canvas-4)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              flexShrink:     0,
              transition:     'all 0.3s var(--ease-expo)',
              position:       'relative',
              overflow:       'hidden',
              boxShadow:      logoHovered ? 'var(--sh-gd)' : 'none',
            }}
          >
            {logoHovered && (
              <motion.div
                initial={{ x: '-110%' }}
                animate={{ x: '220%' }}
                transition={{ duration: 0.5, ease: 'linear' }}
                aria-hidden="true"
                style={{
                  position:      'absolute', inset: 0,
                  background:    'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)',
                  pointerEvents: 'none',
                }}
              />
            )}
            <span style={{
              fontFamily:    'var(--font-family-display)',
              fontStyle:     'italic',
              fontWeight:    700,
              fontSize:      '1.05rem',
              color:         logoHovered ? '#0A0907' : 'var(--t1)',
              lineHeight:    1,
              transition:    'color 0.3s',
              userSelect:    'none',
              position:      'relative',
              zIndex:        1,
            }}>SA</span>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{
              fontFamily:    'var(--font-family-display)',
              fontWeight:    700,
              fontSize:      '1rem',
              letterSpacing: '-0.01em',
              color:         'var(--t1)',
              lineHeight:    1.05,
            }}>
              Sajjad Ahmad
            </span>
            <span style={{
              fontFamily:    'var(--font-family-display)',
              fontStyle:     'italic',
              fontWeight:    400,
              fontSize:      '0.63rem',
              color:         'var(--gold)',
              letterSpacing: '0.01em',
              lineHeight:    1,
            }}>
              WordPress & Laravel Developer
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height:        '1px',
          background:    'var(--canvas-4)',
          marginBottom:  '1.2rem',
        }} />

        {/* Mini metadata grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>

          {/* Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={11} style={{ color: 'var(--t3)', flexShrink: 0 }} aria-hidden="true" />
            <span style={{
              fontFamily:    'var(--font-family-accent)',
              fontSize:      '0.6rem',
              color:         'var(--t2)',
              letterSpacing: '0.06em',
            }}>
              {identity.location}
            </span>
          </div>

          {/* Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--ac)', flexShrink: 0,
              boxShadow: '0 0 8px var(--ac)',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily:    'var(--font-family-accent)',
              fontSize:      '0.6rem',
              color:         'var(--ac)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight:    500,
            }}>
              Open to Work
            </span>
          </div>

        </div>
      </motion.div>

      {/* Contact pills — stacked vertically for the side panel */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.32, ease: EASE_EXPO }}
        style={{
          display:  'flex',
          flexWrap: 'wrap',
          gap:      '0.4rem',
          width:    '100%',
        }}
      >
        {links.map((link, i) => (
          <MagPill
            key={link.label}
            href={link.href}
            label={link.label}
            icon={link.icon}
            external={link.external}
            index={i}
          />
        ))}
      </motion.div>

    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   BACK TO TOP FAB
   ─────────────────────────────────────────────────────────── */
const BackToTopFAB = memo(function BackToTopFAB() {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="btt"
          initial={{ opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1,   y: 0  }}
          exit={{    opacity: 0, scale: 0.7, y: 12 }}
          transition={{ duration: 0.35, ease: EASE_SPRING }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          whileTap={{ scale: 0.9 }}
          style={{
            width:          40, height: 40,
            borderRadius:   '50%',
            background:     hovered ? 'var(--gold)' : 'var(--canvas-3)',
            border:         hovered
              ? '1px solid var(--gold)'
              : '1px solid var(--canvas-4)',
            color:          hovered ? '#0A0907' : 'var(--t2)',
            cursor:         'pointer',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            transition:     'all 0.25s var(--ease-expo)',
            boxShadow:      hovered ? 'var(--sh-gd)' : 'none',
            position:       'relative',
            overflow:       'hidden',
            flexShrink:     0,
          }}
        >
          {hovered && (
            <motion.div
              initial={{ x: '-110%' }}
              animate={{ x: '220%' }}
              transition={{ duration: 0.45, ease: 'linear' }}
              aria-hidden="true"
              style={{
                position:      'absolute', inset: 0,
                background:    'linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)',
                pointerEvents: 'none',
              }}
            />
          )}
          <motion.div
            animate={{ y: hovered ? -2 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <ArrowUp size={14} aria-hidden="true" />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  )
})

/* ─────────────────────────────────────────────────────────────
   MAIN FOOTER
   ─────────────────────────────────────────────────────────── */
export default function Footer() {
  const year      = new Date().getFullYear()
  const footerRef = useRef<HTMLElement>(null)
  const isInView  = useInView(footerRef, { once: true, margin: '-60px' })

  const links = [
    { href: identity.linkedinUrl,       label: 'LinkedIn',  icon: <Linkedin size={12} />,      external: true  },
    { href: identity.whatsappUrl,       label: 'WhatsApp',  icon: <MessageCircle size={12} />, external: true  },
    { href: `mailto:${identity.email}`, label: 'Email',     icon: <Mail size={12} />,           external: false },
  ]

  return (
    <footer
      ref={footerRef}
      role="contentinfo"
      style={{
        background: 'var(--canvas)',
        position:   'relative',
        overflow:   'hidden',
      }}
    >

      {/* ── Deep ambient glow layer ── */}
      <div aria-hidden="true" style={{
        position:      'absolute',
        bottom:        '-80px',
        left:          '50%',
        transform:     'translateX(-50%)',
        width:         '900px',
        height:        '400px',
        background:    'radial-gradient(ellipse at 40% 100%, rgba(200,168,75,0.055) 0%, rgba(0,255,148,0.018) 50%, transparent 72%)',
        pointerEvents: 'none',
        zIndex:        0,
        filter:        'blur(2px)',
      }} />

      {/* ── Separator — gold shimmer sweep ── */}
      <div style={{ position: 'relative', height: '1px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--canvas-4)' }} />
        <motion.div
          initial={{ x: '-100%' }}
          animate={isInView ? { x: '120%' } : { x: '-100%' }}
          transition={{ duration: 1.5, ease: EASE_EXPO, delay: 0.1 }}
          aria-hidden="true"
          style={{
            position:   'absolute',
            top: 0, bottom: 0,
            width:      '50%',
            background: 'linear-gradient(to right, transparent, var(--gold), var(--gold-rich), transparent)',
          }}
        />
        {/* Permanent centre glow */}
        <div aria-hidden="true" style={{
          position:   'absolute', top: 0, left: '50%',
          transform:  'translateX(-50%)',
          width:      300, height: 1,
          background: 'linear-gradient(to right,transparent,var(--gold-bdr),var(--ac-bdr),transparent)',
        }} />
      </div>

      {/* ── Main content ── */}
      <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HERO ZONE — CTA + Identity split ── */}
        <div
          className="footer-main-grid"
          style={{
            display:           'grid',
            gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,0.7fr)',
            gap:               'clamp(3rem,6vw,6rem)',
            alignItems:        'start',
            padding:           'clamp(3rem,6vw,5rem) 0 2.5rem',
          }}
        >
          {/* Left — cinematic CTA */}
          <CTABlock />

          {/* Right — identity panel */}
          <IdentityPanel isInView={isInView} links={links} />
        </div>

        {/* ── Bottom meta bar ── */}
        <div style={{
          height:        1,
          background:    'linear-gradient(to right, transparent, var(--canvas-4), transparent)',
          marginBottom:  '1.1rem',
        }} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            flexWrap:       'wrap',
            gap:            '0.75rem',
            paddingBottom:  '1.6rem',
          }}
        >

          {/* Copyright */}
          <p style={{
            fontFamily:    'var(--font-family-accent)',
            fontSize:      '0.56rem',
            color:         'var(--t3)',
            letterSpacing: '0.07em',
            lineHeight:    1.5,
            margin:        0,
          }}>
            {'© '}
            {year}
            {'  '}
            <span style={{
              fontFamily:    'var(--font-family-display)',
              fontStyle:     'italic',
              fontWeight:    600,
              color:         'var(--t2)',
              letterSpacing: '0',
            }}>
              Sajjad Ahmad
            </span>
            {'  —  All rights reserved.'}
          </p>

          {/* Centre — stack */}
          <div style={{
            fontFamily:    'var(--font-family-accent)',
            fontSize:      '0.56rem',
            color:         'var(--t3)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            WordPress · Laravel · React · Next.js
          </div>

        </motion.div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(0.78); }
        }

        /* Responsive stacking */
        @media (max-width: 860px) {
          .footer-main-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </footer>
  )
}