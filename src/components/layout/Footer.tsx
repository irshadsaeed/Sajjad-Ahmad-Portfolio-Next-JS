'use client'

import React, {
  useState, useEffect, useRef, useCallback, memo,
} from 'react'
import {
  motion, useInView, AnimatePresence, useMotionValue, useSpring,
} from 'framer-motion'
import {
  ArrowUpRight, Mail, MessageCircle, Linkedin, MapPin, ArrowUp, Zap,
} from 'lucide-react'
import { identity } from '@/lib/data'

const E  = [0.16, 1, 0.3, 1]    as const
const ES = [0.34, 1.56, 0.64, 1] as const

/* ─────────────────────────────────────────────────────────────
   MAGNETIC PILL
   ─────────────────────────────────────────────────────────── */
const MagPill = memo(function MagPill({
  href, label, icon, external = true, index = 0,
}: {
  href: string; label: string; icon: React.ReactNode
  external?: boolean; index?: number
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const mx  = useMotionValue(0)
  const my  = useMotionValue(0)
  const smx = useSpring(mx, { stiffness: 260, damping: 22 })
  const smy = useSpring(my, { stiffness: 260, damping: 22 })
  const [hov, setHov] = useState(false)

  const onMM = useCallback((e: React.MouseEvent) => {
    const el = ref.current; if (!el) return
    const r  = el.getBoundingClientRect()
    mx.set((e.clientX - r.left - r.width  / 2) * 0.25)
    my.set((e.clientY - r.top  - r.height / 2) * 0.25)
  }, [mx, my])

  const onML = useCallback(() => { mx.set(0); my.set(0); setHov(false) }, [mx, my])

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      aria-label={label}
      onMouseMove={onMM}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={onML}
      style={{ x: smx, y: smy, textDecoration: 'none', display: 'inline-flex' }}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.08 + index * 0.08, ease: E }}
    >
      <div style={{
        display:      'flex', alignItems: 'center', gap: '0.45rem',
        padding:      '0.5rem 1rem',
        borderRadius: 'var(--r-sm)',
        background:   hov ? 'var(--gold-dim)' : 'var(--canvas-3)',
        border:       `1px solid ${hov ? 'var(--gold-bdr)' : 'var(--canvas-4)'}`,
        transition:   'all 0.24s var(--ease-expo)',
        boxShadow:    hov ? 'var(--sh-gd)' : 'none',
        position:     'relative', overflow: 'hidden', whiteSpace: 'nowrap',
      }}>
        <AnimatePresence>
          {hov && (
            <motion.div
              initial={{ x: '-110%' }} animate={{ x: '220%' }} exit={{}}
              transition={{ duration: 0.5, ease: 'linear' }}
              aria-hidden="true"
              style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg,transparent,rgba(200,168,75,0.18),transparent)',
                pointerEvents: 'none',
              }}
            />
          )}
        </AnimatePresence>
        <motion.span
          animate={{ color: hov ? 'var(--gold)' : 'var(--t3)' }}
          transition={{ duration: 0.2 }}
          style={{ display: 'flex', position: 'relative', zIndex: 1 }}
        >
          {icon}
        </motion.span>
        <span style={{
          fontFamily:    'var(--font-family-accent)', fontSize: '0.58rem',
          fontWeight:    500, letterSpacing: '0.1em', textTransform: 'uppercase',
          color:         hov ? 'var(--gold)' : 'var(--t2)',
          transition:    'color 0.2s', position: 'relative', zIndex: 1,
        }}>
          {label}
        </span>
        {external && (
          <motion.span
            animate={{ x: hov ? 2 : 0, y: hov ? -2 : 0, opacity: hov ? 1 : 0 }}
            transition={{ duration: 0.16 }}
            style={{ display: 'flex', color: 'var(--gold)', position: 'relative', zIndex: 1 }}
          >
            <ArrowUpRight size={10} aria-hidden="true" />
          </motion.span>
        )}
      </div>
    </motion.a>
  )
})

/* ─────────────────────────────────────────────────────────────
   CTA BLOCK — left side cinematic headline
   ─────────────────────────────────────────────────────────── */
function CTABlock() {
  const [hov, setHov] = useState(false)
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div ref={ref}>

      {/* Status pill */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: E }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--ac-dim)', border: '1px solid var(--ac-bdr)',
          borderRadius: 100, padding: '4px 12px', marginBottom: '1.5rem',
        }}
      >
        <span style={{
          width: 5, height: 5, borderRadius: '50%',
          background: 'var(--ac)', boxShadow: '0 0 6px var(--ac)',
          display: 'block', animation: 'pulse-dot 2s ease-in-out infinite',
        }} />
        <span style={{
          fontFamily: 'var(--font-family-accent)', fontSize: '0.56rem',
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'var(--ac)', fontWeight: 500,
        }}>
          Available for New Projects
        </span>
      </motion.div>

      {/* Headline */}
      <div style={{ marginBottom: '1.85rem' }}>
        <div style={{ overflow: 'hidden' }}>
          <motion.div
            initial={{ y: '110%', opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.78, delay: 0.08, ease: E }}
          >
            <div style={{
              fontFamily:    'var(--font-family-display)', fontWeight: 800,
              fontSize:      'clamp(2.2rem, 4vw, 3.4rem)',
              letterSpacing: '-0.028em', lineHeight: 0.9, color: 'var(--t1)',
            }}>
              Let's Build
            </div>
          </motion.div>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <motion.div
            initial={{ y: '110%', opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.78, delay: 0.16, ease: E }}
          >
            <div style={{
              fontFamily:    'var(--font-family-display)', fontStyle: 'italic', fontWeight: 800,
              fontSize:      'clamp(2.2rem, 4vw, 3.4rem)',
              letterSpacing: '-0.028em', lineHeight: 0.9,
              color:         'var(--gold)', textShadow: '0 0 50px rgba(200,168,75,0.2)',
            }}>
              Something Great.
            </div>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.26, ease: E }}
        style={{
          fontFamily: 'var(--font-family-sans)', fontWeight: 300,
          fontSize:   'clamp(0.88rem, 1vw, 1rem)',
          color:      'var(--t2)', lineHeight: 1.88, maxWidth: 420,
          marginBottom: '2rem', letterSpacing: '0.005em',
        }}
      >
        WordPress, Laravel, React — turning your vision into a{' '}
        <em style={{
          fontFamily: 'var(--font-family-display)', fontStyle: 'italic',
          color: 'var(--gold)', fontWeight: 500,
        }}>
          high-performance reality.
        </em>{' '}
        Let's start a conversation.
      </motion.p>

      {/* CTA button */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.34, ease: E }}
      >
        <a
          href={identity.whatsappUrl}
          target="_blank" rel="noopener noreferrer"
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            display:        'inline-flex', alignItems: 'center', gap: 8,
            padding:        '0.88rem 2.1rem',
            background:     hov ? 'var(--gold-rich)' : 'var(--gold)',
            color:          '#0A0907', borderRadius: 'var(--r-md)',
            textDecoration: 'none',
            fontFamily:     'var(--font-family-accent)', fontWeight: 700,
            fontSize:       '0.82rem', letterSpacing: '0.07em', textTransform: 'uppercase',
            transition:     'all 0.25s var(--ease-expo)',
            transform:      hov ? 'translateY(-2px)' : 'translateY(0)',
            boxShadow:      hov ? 'var(--sh-gd)' : 'none',
            position:       'relative', overflow: 'hidden',
          }}
        >
          <AnimatePresence>
            {hov && (
              <motion.div
                key="s"
                initial={{ x: '-110%' }} animate={{ x: '220%' }} exit={{}}
                transition={{ duration: 0.5, ease: 'linear' }}
                aria-hidden="true"
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.24),transparent)',
                  pointerEvents: 'none',
                }}
              />
            )}
          </AnimatePresence>
          <Zap size={13} aria-hidden="true" style={{ position: 'relative', zIndex: 1 }} />
          <span style={{ position: 'relative', zIndex: 1 }}>Start a Project</span>
          <ArrowUpRight size={12} aria-hidden="true" style={{ position: 'relative', zIndex: 1 }} />
        </a>
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   IDENTITY PANEL — right side terminal card
   ─────────────────────────────────────────────────────────── */
function IdentityPanel({
  inView, links,
}: {
  inView: boolean
  links: { href: string; label: string; icon: React.ReactNode; external: boolean }[]
}) {
  const [logoHov, setLogoHov] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Brand card */}
      <motion.div
        initial={{ opacity: 0, x: 28 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.2, ease: E }}
        style={{
          background:   'var(--canvas-2)',
          border:       '1px solid var(--canvas-4)',
          borderRadius: 'var(--r-xl)',
          padding:      '1.65rem',
          position:     'relative', overflow: 'hidden',
          boxShadow:    'var(--sh-sm)',
        }}
      >
        {/* Gold top line */}
        <div aria-hidden="true" style={{
          position:   'absolute', top: 0, left: 0, right: 0, height: '1.5px',
          background: 'linear-gradient(to right, transparent, var(--gold), transparent)',
          opacity:    0.5,
        }} />

        {/* Corner glow */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: 0, right: 0, width: 90, height: 90,
          background: 'radial-gradient(circle at 100% 0%, rgba(200,168,75,0.07), transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Monogram + name */}
        <div
          onMouseEnter={() => setLogoHov(true)}
          onMouseLeave={() => setLogoHov(false)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', cursor: 'default' }}
        >
          <motion.div
            animate={{ scale: logoHov ? 1.05 : 1 }}
            transition={{ duration: 0.3, ease: ES }}
            style={{
              width:          44, height: 44, borderRadius: 10,
              background:     logoHov ? 'var(--gold)' : 'var(--canvas-3)',
              border:         `1px solid ${logoHov ? 'var(--gold)' : 'var(--canvas-4)'}`,
              display:        'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink:     0, transition: 'all 0.3s var(--ease-expo)',
              boxShadow:      logoHov ? 'var(--sh-gd)' : 'none',
              position:       'relative', overflow: 'hidden',
            }}
          >
            <AnimatePresence>
              {logoHov && (
                <motion.div
                  key="s"
                  initial={{ x: '-110%' }} animate={{ x: '220%' }} exit={{}}
                  transition={{ duration: 0.5, ease: 'linear' }}
                  aria-hidden="true"
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </AnimatePresence>
            <span style={{
              fontFamily: 'var(--font-family-display)', fontStyle: 'italic', fontWeight: 700,
              fontSize:   '1rem', color: logoHov ? '#0A0907' : 'var(--t1)',
              lineHeight: 1, transition: 'color 0.3s', userSelect: 'none',
              position:   'relative', zIndex: 1,
            }}>
              SA
            </span>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{
              fontFamily: 'var(--font-family-display)', fontWeight: 700,
              fontSize: '1rem', letterSpacing: '-0.01em', color: 'var(--t1)', lineHeight: 1.1,
            }}>
              Sajjad Ahmad
            </span>
            <span style={{
              fontFamily: 'var(--font-family-display)', fontStyle: 'italic', fontWeight: 400,
              fontSize: '0.62rem', color: 'var(--gold)', letterSpacing: '0.01em', lineHeight: 1,
            }}>
              WordPress & Laravel Developer
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--canvas-4)', marginBottom: '1.1rem' }} />

        {/* Meta rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={10} style={{ color: 'var(--t3)', flexShrink: 0 }} aria-hidden="true" />
            <span style={{
              fontFamily: 'var(--font-family-mono)', fontSize: '0.6rem',
              color: 'var(--t2)', letterSpacing: '0.04em',
            }}>
              {identity.location}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: 'var(--ac)', flexShrink: 0,
              boxShadow: '0 0 7px var(--ac)',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily: 'var(--font-family-accent)', fontSize: '0.58rem',
              color: 'var(--ac)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600,
            }}>
              Open to Work
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontFamily: 'var(--font-family-mono)', fontSize: '0.52rem',
              color: 'var(--t3)', letterSpacing: '0.04em',
            }}>
              UET Taxila · CGPA{' '}
            </span>
            <span style={{
              fontFamily: 'var(--font-family-display)', fontStyle: 'italic',
              fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 500,
            }}>
              3.42 / 4.00
            </span>
          </div>
        </div>
      </motion.div>

      {/* Contact pills */}
      <motion.div
        initial={{ opacity: 0, x: 22 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.3, ease: E }}
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}
      >
        {links.map((l, i) => (
          <MagPill key={l.label} href={l.href} label={l.label}
            icon={l.icon} external={l.external} index={i} />
        ))}
      </motion.div>

      {/* Tech stack pill row */}
      <motion.div
        initial={{ opacity: 0, x: 22 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.38, ease: E }}
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}
      >
        {['WordPress', 'Laravel', 'PHP', 'React', 'Next.js', 'WooCommerce'].map((t, i) => (
          <span key={t} style={{
            fontFamily:    'var(--font-family-mono)', fontSize: '0.52rem',
            color:         i % 2 === 0 ? 'var(--gold)' : 'var(--t3)',
            background:    'var(--canvas-3)',
            border:        '1px solid var(--canvas-4)',
            borderRadius:  100, padding: '2px 8px',
            letterSpacing: '0.04em',
          }}>
            {t}
          </span>
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
  const [hov, setHov]         = useState(false)

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
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{    opacity: 0, scale: 0.7, y: 12 }}
          transition={{ duration: 0.32, ease: ES }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          whileTap={{ scale: 0.88 }}
          style={{
            position: 'fixed', bottom: '2rem', right: '2rem',
            width: 40, height: 40, borderRadius: '50%',
            background: hov ? 'var(--gold)' : 'var(--canvas-3)',
            border:     `1px solid ${hov ? 'var(--gold)' : 'var(--canvas-4)'}`,
            color:      hov ? '#0A0907' : 'var(--t2)',
            cursor:     'pointer',
            display:    'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.25s var(--ease-expo)',
            boxShadow:  hov ? 'var(--sh-gd)' : 'var(--sh-sm)',
            zIndex:     50, overflow: 'hidden',
          }}
        >
          <AnimatePresence>
            {hov && (
              <motion.div
                key="s"
                initial={{ x: '-110%' }} animate={{ x: '220%' }} exit={{}}
                transition={{ duration: 0.45, ease: 'linear' }}
                aria-hidden="true"
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)',
                  pointerEvents: 'none',
                }}
              />
            )}
          </AnimatePresence>
          <motion.div
            animate={{ y: hov ? -2 : 0 }}
            transition={{ duration: 0.18 }}
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
   FOOTER
   ─────────────────────────────────────────────────────────── */
export default function Footer() {
  const year      = new Date().getFullYear()
  const footerRef = useRef<HTMLElement>(null)
  const inView    = useInView(footerRef, { once: true, margin: '-60px' })

  const links = [
    { href: identity.linkedinUrl,       label: 'LinkedIn', icon: <Linkedin      size={12} />, external: true  },
    { href: identity.whatsappUrl,       label: 'WhatsApp', icon: <MessageCircle size={12} />, external: true  },
    { href: `mailto:${identity.email}`, label: 'Email',    icon: <Mail          size={12} />, external: false },
  ]

  return (
    <footer
      ref={footerRef}
      role="contentinfo"
      style={{ background: 'var(--canvas)', position: 'relative', overflow: 'hidden' }}
    >
      <BackToTopFAB />

      {/* Deep ambient glow */}
      <div aria-hidden="true" style={{
        position:  'absolute', bottom: '-60px', left: '50%', transform: 'translateX(-50%)',
        width:     '800px', height: '350px',
        background: 'radial-gradient(ellipse at 40% 100%, rgba(200,168,75,0.05) 0%, rgba(0,255,148,0.016) 50%, transparent 72%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── Gold shimmer separator ── */}
      <div style={{ position: 'relative', height: '1px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--canvas-4)' }} />
        <motion.div
          initial={{ x: '-100%' }}
          animate={inView ? { x: '120%' } : { x: '-100%' }}
          transition={{ duration: 1.6, ease: E, delay: 0.1 }}
          aria-hidden="true"
          style={{
            position: 'absolute', top: 0, bottom: 0, width: '50%',
            background: 'linear-gradient(to right, transparent, var(--gold), var(--gold-rich), transparent)',
          }}
        />
        <div aria-hidden="true" style={{
          position:   'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 280, height: 1,
          background: 'linear-gradient(to right, transparent, var(--gold-bdr), transparent)',
        }} />
      </div>

      <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>

        {/* Main grid */}
        <div
          className="footer-grid"
          style={{
            display:             'grid',
            gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,0.7fr)',
            gap:                 'clamp(2.5rem, 6vw, 6rem)',
            alignItems:          'start',
            padding:             'clamp(3rem, 6vw, 5rem) 0 2.5rem',
          }}
        >
          <CTABlock />
          <IdentityPanel inView={inView} links={links} />
        </div>

        {/* Bottom bar */}
        <div style={{
          height: 1, marginBottom: '1.1rem',
          background: 'linear-gradient(to right, transparent, var(--canvas-4), transparent)',
        }} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{
            display:        'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap',
            gap:            '0.75rem', paddingBottom: '1.6rem',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-family-accent)', fontSize: '0.55rem',
            color:      'var(--t3)', letterSpacing: '0.07em', margin: 0,
          }}>
            {'© '}{year}{'  '}
            <span style={{
              fontFamily: 'var(--font-family-display)', fontStyle: 'italic',
              fontWeight: 600, color: 'var(--t2)', letterSpacing: '0',
            }}>
              Sajjad Ahmad
            </span>
            {'  —  All rights reserved.'}
          </p>

          <span style={{
            fontFamily:    'var(--font-family-mono)', fontSize: '0.52rem',
            color:         'var(--t3)', letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            WordPress · Laravel · React · Next.js
          </span>
        </motion.div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(0.78); }
        }
        @media (max-width: 860px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </footer>
  )
}