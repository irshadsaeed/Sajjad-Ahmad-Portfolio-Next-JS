'use client'

import React, {
  useRef, useState, useEffect, useCallback, memo,
} from 'react'
import {
  motion, useInView, useMotionValue, useSpring, AnimatePresence,
} from 'framer-motion'
import { Mail, MessageCircle, Linkedin, MapPin, ArrowUpRight } from 'lucide-react'
import { identity } from '@/lib/data'

const E  = [0.16, 1, 0.3, 1]    as const
const ES = [0.34, 1.56, 0.64, 1] as const

/* ─── CHANNELS ─── */
const CHANNELS = [
  {
    id:     'linkedin',
    label:  'LinkedIn',
    sub:    'sajjad-ahmad754',
    note:   '500+ connections',
    href:   identity.linkedinUrl,
    icon:   <Linkedin     size={15} aria-hidden="true" />,
    color:  'var(--gold)', dim: 'var(--gold-dim)', bdr: 'var(--gold-bdr)',
    glow:   'rgba(200,168,75,0.18)', gold: true,
  },
  {
    id:     'whatsapp',
    label:  'WhatsApp',
    sub:    '+92 343 525 2754',
    note:   'Replies within hours',
    href:   identity.whatsappUrl,
    icon:   <MessageCircle size={15} aria-hidden="true" />,
    color:  'var(--ac)', dim: 'var(--ac-dim)', bdr: 'var(--ac-bdr)',
    glow:   'rgba(0,255,148,0.15)', gold: false,
  },
  {
    id:     'email',
    label:  'Email',
    sub:    identity.email,
    note:   'For detailed proposals',
    href:   `mailto:${identity.email}`,
    icon:   <Mail         size={15} aria-hidden="true" />,
    color:  'var(--gold)', dim: 'var(--gold-dim)', bdr: 'var(--gold-bdr)',
    glow:   'rgba(200,168,75,0.15)', gold: true,
  },
  {
    id:     'location',
    label:  'Location',
    sub:    'Islamabad · PKT / UTC+5',
    note:   'All timezones welcome',
    href:   null,
    icon:   <MapPin       size={15} aria-hidden="true" />,
    color:  'var(--t2)', dim: 'var(--canvas-3)', bdr: 'var(--canvas-4)',
    glow:   'rgba(0,0,0,0.04)', gold: false,
  },
] as const

type Channel = typeof CHANNELS[number]

/* ─────────────────────────────────────────────────────────────
   CHANNEL CARD — fully theme-aware
   ─────────────────────────────────────────────────────────── */
const ChannelCard = memo(function ChannelCard({
  ch, index, inView,
}: {
  ch: Channel; index: number; inView: boolean
}) {
  const [hov, setHov] = useState(false)

  const Tag       = ch.href ? 'a' : 'div'
  const linkProps = ch.href
    ? { href: ch.href, target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.1 + index * 0.09, ease: E }}
    >
      <Tag
        {...(linkProps as any)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display:        'flex',
          alignItems:     'center',
          gap:            '0.75rem',
          padding:        '0.9rem 1rem',
          borderRadius:   'var(--r-lg)',
          background:     hov ? ch.dim : 'var(--canvas-2)',
          border:         `1px solid ${hov ? ch.bdr : 'var(--canvas-4)'}`,
          textDecoration: 'none',
          cursor:         ch.href ? 'pointer' : 'default',
          transition:     'all 0.28s var(--ease-expo)',
          boxShadow:      hov ? `0 8px 28px ${ch.glow}` : 'var(--sh-sm)',
          position:       'relative',
          overflow:       'hidden',
        }}
      >
        {/* Top accent line on hover */}
        <div style={{
          position:   'absolute', top: 0, left: '8%', right: '8%',
          height:     '1.5px',
          background: `linear-gradient(to right, transparent, ${ch.color}, transparent)`,
          opacity:    hov ? 1 : 0,
          transition: 'opacity 0.28s',
        }} />

        {/* Icon pod */}
        <div style={{
          width:          '2.4rem', height: '2.4rem', flexShrink: 0,
          borderRadius:   'var(--r-sm)',
          background:     hov ? ch.dim : 'var(--canvas-3)',
          border:         `1px solid ${hov ? ch.bdr : 'var(--canvas-4)'}`,
          display:        'flex', alignItems: 'center', justifyContent: 'center',
          color:          hov ? ch.color : 'var(--t3)',
          transition:     'all 0.25s',
          boxShadow:      hov ? `0 0 12px ${ch.glow}` : 'none',
        }}>
          {ch.icon}
        </div>

        {/* Text group */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Label */}
          <div style={{
            fontFamily:    'var(--font-family-display)',
            fontWeight:    700,
            fontSize:      'clamp(0.9rem, 1.1vw, 1rem)',
            letterSpacing: '-0.01em',
            lineHeight:    1.2,
            color:         hov ? 'var(--t1)' : 'var(--t1)',
            transition:    'color 0.2s',
            marginBottom:  '0.2rem',
          }}>
            {ch.label}
          </div>

          {/* Sub — handle */}
          <div style={{
            fontFamily:    ch.gold ? 'var(--font-family-display)' : 'var(--font-family-mono)',
            fontStyle:     ch.gold ? 'italic' : 'normal',
            fontWeight:    ch.gold ? 500 : 400,
            fontSize:      ch.gold ? '0.82rem' : '0.65rem',
            color:         hov ? ch.color : 'var(--t2)',
            letterSpacing: ch.gold ? '-0.005em' : '0.03em',
            transition:    'color 0.25s',
            overflow:      'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {ch.id === 'whatsapp' && (
              <span style={{
                display:      'inline-block',
                width:        5, height: 5,
                borderRadius: '50%',
                background:   hov ? 'var(--ac)' : 'var(--t3)',
                boxShadow:    hov ? '0 0 5px var(--ac)' : 'none',
                marginRight:  5, marginBottom: 1,
                verticalAlign: 'middle',
                transition:   'all 0.25s',
                animation:    hov ? 'pulse-dot 2s ease-in-out infinite' : 'none',
              }} />
            )}
            {ch.sub}
          </div>
        </div>

        {/* Right meta */}
        <div style={{
          display:       'flex', flexDirection: 'column',
          alignItems:    'flex-end', gap: '0.2rem',
          flexShrink:    1, minWidth: 0,
        }}>
          {/* Note pill — hidden on mobile via CSS */}
          <span className="ch-note-pill" style={{
            fontFamily:    'var(--font-family-mono)',
            fontSize:      '0.5rem',
            color:         hov ? ch.color : 'var(--t3)',
            letterSpacing: '0.08em',
            background:    hov ? ch.dim : 'var(--canvas-3)',
            border:        `1px solid ${hov ? ch.bdr : 'var(--canvas-4)'}`,
            borderRadius:  100,
            padding:       '2px 8px',
            whiteSpace:    'nowrap',
            transition:    'all 0.25s',
            flexShrink:    0,
          }}>
            {ch.note}
          </span>

          {/* Arrow */}
          {ch.href && (
            <motion.span
              animate={{ opacity: hov ? 1 : 0.3, x: hov ? 0 : 3, y: hov ? 0 : 3 }}
              transition={{ duration: 0.18 }}
              style={{ color: hov ? ch.color : 'var(--t3)', display: 'flex', flexShrink: 0 }}
            >
              <ArrowUpRight size={13} aria-hidden="true" />
            </motion.span>
          )}
        </div>

        {/* Bottom bar */}
        <motion.div
          animate={{ scaleX: hov ? 1 : 0 }}
          initial={{ scaleX: 0 }}
          transition={{ duration: 0.3, ease: E }}
          aria-hidden="true"
          style={{
            position:        'absolute', bottom: 0, left: '5%', right: '5%',
            height:          '1.5px',
            background:      `linear-gradient(to right, transparent, ${ch.color}, transparent)`,
            transformOrigin: 'center', pointerEvents: 'none',
          }}
        />
      </Tag>
    </motion.div>
  )
})

/* ─────────────────────────────────────────────────────────────
   STATUS CARD — live clock, fully theme-aware
   ─────────────────────────────────────────────────────────── */
function StatusCard({ inView }: { inView: boolean }) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => setTime(
      new Date().toLocaleTimeString('en-PK', {
        timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit',
      })
    )
    tick()
    const iv = setInterval(tick, 1000)
    return () => clearInterval(iv)
  }, [])

  const rows = [
    { dot: 'var(--ac)',   label: 'Open to Freelance',  val: 'Active',      gold: false },
    { dot: 'var(--ac)',   label: 'Remote / Contract',  val: 'Available',   gold: false },
    { dot: 'var(--gold)', label: 'Full-time Roles',    val: 'Considering', gold: true  },
    { dot: 'var(--ac)',   label: 'Response Time',      val: '< 24 hours',  gold: false },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.38, ease: E }}
      style={{
        background:   'var(--canvas-2)',
        border:       '1px solid var(--canvas-4)',
        borderRadius: 'var(--r-lg)',
        overflow:     'hidden',
        position:     'relative',
        boxShadow:    'var(--sh-sm)',
      }}
    >
      {/* Gold top accent */}
      <div aria-hidden="true" style={{
        position:   'absolute', top: 0, left: 0, right: 0, height: '1.5px',
        background: 'linear-gradient(to right, transparent, var(--gold), transparent)',
        opacity:    0.6,
      }} />

      {/* Header */}
      <div style={{
        display:        'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding:        '0.7rem 1.1rem',
        borderBottom:   '1px solid var(--canvas-4)',
        background:     'linear-gradient(to bottom, var(--canvas-3), transparent)',
        overflow:       'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Traffic lights */}
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c, i) => (
            <span key={i} aria-hidden="true" style={{
              width: 7, height: 7, borderRadius: '50%',
              background: c, display: 'block',
              boxShadow: `0 0 4px ${c}55`,
            }} />
          ))}
          <span style={{
            fontFamily:    'var(--font-family-mono)',
            fontSize:      '0.52rem', color: 'var(--t3)',
            letterSpacing: '0.1em', marginLeft: 6,
          }}>
            availability.json
          </span>
        </div>

        {/* Live clock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <span style={{
            width: 4, height: 4, borderRadius: '50%',
            background: 'var(--ac)', boxShadow: '0 0 5px var(--ac)',
            display: 'block', flexShrink: 0,
            animation: 'pulse-dot 2s ease-in-out infinite',
          }} />
          <span style={{
            fontFamily:    'var(--font-family-mono)',
            fontSize:      '0.56rem', color: 'var(--gold)',
            letterSpacing: '0.04em', fontWeight: 500,
            whiteSpace:    'nowrap',
          }}>
            {time}
          </span>
        </div>
      </div>

      {/* Rows */}
      {rows.map(({ dot, label, val, gold }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, x: -10 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.42 + i * 0.07, ease: E }}
          style={{
            display:        'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding:        '0.55rem 1.1rem',
            borderBottom:   i < rows.length - 1 ? '1px solid var(--canvas-4)' : 'none',
            overflow:       'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: dot, display: 'block',
              boxShadow: `0 0 5px ${dot}`,
              animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily:    'var(--font-family-mono)',
              fontSize:      '0.6rem', color: 'var(--t2)',
              letterSpacing: '0.04em',
            }}>
              {label}
            </span>
          </div>
          <span style={{
            fontFamily:    gold ? 'var(--font-family-display)' : 'var(--font-family-accent)',
            fontStyle:     gold ? 'italic' : 'normal',
            fontWeight:    500, fontSize: '0.72rem',
            color:         gold ? 'var(--gold)' : 'var(--ac)',
            letterSpacing: gold ? '-0.005em' : '0.02em',
            whiteSpace:    'nowrap', flexShrink: 0,
          }}>
            {val}
          </span>
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   MORPHING CTA
   ─────────────────────────────────────────────────────────── */
function MorphingCTA({ inView }: { inView: boolean }) {
  const ref   = useRef<HTMLAnchorElement>(null)
  const mx    = useMotionValue(0)
  const my    = useMotionValue(0)
  const smx   = useSpring(mx, { stiffness: 180, damping: 20 })
  const smy   = useSpring(my, { stiffness: 180, damping: 20 })
  const [hov,   setHov]   = useState(false)
  const [shim,  setShim]  = useState(false)
  const [pulse, setPulse] = useState(false)

  const onMM = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current; if (!el) return
    const r  = el.getBoundingClientRect()
    mx.set((e.clientX - r.left - r.width  / 2) * 0.3)
    my.set((e.clientY - r.top  - r.height / 2) * 0.3)
  }, [mx, my])

  const onME = useCallback(() => {
    setHov(true); setShim(true); setPulse(true)
    setTimeout(() => setShim(false), 600)
    setTimeout(() => setPulse(false), 900)
  }, [])

  const onML = useCallback(() => { mx.set(0); my.set(0); setHov(false) }, [mx, my])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.5, ease: E }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.8rem' }}
    >
      <div style={{ position: 'relative' }}>
        {/* Aura */}
        <motion.div
          animate={{ scale: pulse ? 1.4 : hov ? 1.15 : 1, opacity: hov ? 1 : 0 }}
          transition={{ duration: pulse ? 0.65 : 0.4 }}
          aria-hidden="true"
          style={{
            position: 'absolute', inset: '-18px', borderRadius: 'var(--r-lg)',
            background: 'radial-gradient(ellipse, rgba(200,168,75,0.14), transparent 70%)',
            filter: 'blur(12px)', pointerEvents: 'none',
          }}
        />

        <motion.a
          ref={ref}
          href={identity.whatsappUrl}
          target="_blank" rel="noopener noreferrer"
          onMouseMove={onMM} onMouseEnter={onME} onMouseLeave={onML}
          style={{
            x: smx, y: smy,
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '0.9rem 2rem',
            background: hov ? 'var(--gold-rich)' : 'var(--gold)',
            color: '#0A0907',
            borderRadius: 'var(--r-md)',
            textDecoration: 'none',
            transition: 'background 0.25s, box-shadow 0.25s',
            boxShadow: hov ? 'var(--sh-gd)' : 'none',
            position: 'relative', overflow: 'hidden', whiteSpace: 'nowrap',
          }}
        >
          <AnimatePresence>
            {shim && (
              <motion.span
                key="s"
                initial={{ x: '-110%' }} animate={{ x: '220%' }} exit={{}}
                transition={{ duration: 0.55, ease: 'linear' }}
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
            position: 'relative', zIndex: 1,
            fontFamily: 'var(--font-family-accent)',
            fontWeight: 700, fontSize: '0.83rem',
            letterSpacing: '0.07em', textTransform: 'uppercase',
          }}>
            <AnimatePresence mode="wait">
              {hov ? (
                <motion.span key="b"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15, ease: E }}
                  style={{ display: 'block' }}
                >
                  Let's Talk
                </motion.span>
              ) : (
                <motion.span key="a"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15, ease: E }}
                  style={{ display: 'block' }}
                >
                  Start a Conversation
                </motion.span>
              )}
            </AnimatePresence>
          </span>

          <motion.span
            animate={{ x: hov ? 2 : 0, y: hov ? -2 : 0 }}
            transition={{ duration: 0.18 }}
            style={{ position: 'relative', zIndex: 1, display: 'flex' }}
          >
            <ArrowUpRight size={14} aria-hidden="true" />
          </motion.span>
        </motion.a>
      </div>

      {/* Availability line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{
          width: 5, height: 5, borderRadius: '50%',
          background: 'var(--ac)', boxShadow: '0 0 6px var(--ac)',
          display: 'block', animation: 'pulse-dot 2s ease-in-out infinite',
        }} />
        <span style={{
          fontFamily:    'var(--font-family-mono)',
          fontSize:      '0.52rem', color: 'var(--t3)',
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          Available · Response within 24h · GMT+5
        </span>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   SECTION
   ─────────────────────────────────────────────────────────── */
export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const innerRef   = useRef<HTMLDivElement>(null)
  const inView     = useInView(innerRef, { once: true, margin: '-60px' })

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section-pad"
      style={{ background: 'var(--canvas-2)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Ambient */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, right: 0, width: 420, height: 420,
        background: 'radial-gradient(circle, rgba(0,255,148,0.016) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position:   'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 200, height: 1,
        background: 'linear-gradient(to right, transparent, var(--ac-bdr), transparent)',
      }} />

      <div className="container-custom" ref={innerRef} style={{ position: 'relative', zIndex: 1 }}>
        <div
          className="contact-grid"
          style={{
            display:             'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
            gap:                 'clamp(3rem, 7vw, 7rem)',
            alignItems:          'start',
          }}
        >

          {/* ── LEFT ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: E }}
            >
              <span className="section-label">// Contact</span>
            </motion.div>

            {/* Heading */}
            <div>
              <div style={{ overflow: 'hidden' }}>
                <motion.div
                  initial={{ y: '105%' }}
                  animate={inView ? { y: 0 } : {}}
                  transition={{ duration: 0.78, delay: 0.08, ease: E }}
                >
                  <h2 style={{
                    fontFamily: 'var(--font-family-display)', fontWeight: 800,
                    fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                    letterSpacing: '-0.028em', lineHeight: 0.9,
                    color: 'var(--t1)', margin: 0,
                  }}>
                    Start a
                  </h2>
                </motion.div>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <motion.div
                  initial={{ y: '105%' }}
                  animate={inView ? { y: 0 } : {}}
                  transition={{ duration: 0.78, delay: 0.17, ease: E }}
                >
                  <h2 style={{
                    fontFamily: 'var(--font-family-display)', fontStyle: 'italic', fontWeight: 800,
                    fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                    letterSpacing: '-0.028em', lineHeight: 0.9,
                    color: 'var(--gold)',
                    textShadow: '0 0 40px rgba(200,168,75,0.18)',
                    margin: 0,
                  }}>
                    Conversation.
                  </h2>
                </motion.div>
              </div>
            </div>

            {/* Body */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.28, ease: E }}
              style={{
                fontFamily: 'var(--font-family-sans)', fontWeight: 300,
                fontSize:   'clamp(0.88rem, 1.02vw, 1rem)',
                color:      'var(--t2)', lineHeight: 1.9, maxWidth: 400,
                margin:     0, letterSpacing: '0.005em',
              }}
            >
              Open to freelance, contract, and full-time roles.{' '}
              <em style={{
                fontFamily: 'var(--font-family-display)', fontStyle: 'italic',
                color: 'var(--gold)', fontWeight: 500, letterSpacing: '-0.005em',
              }}>
                Based in Islamabad
              </em>{' '}
              — delivering precision across every timezone.
            </motion.p>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={inView ? { scaleX: 1, opacity: 1 } : {}}
              transition={{ duration: 1.0, delay: 0.34, ease: E }}
              style={{
                height: 1, maxWidth: 340,
                background: 'linear-gradient(to right, var(--gold-bdr), var(--canvas-4), transparent)',
                transformOrigin: 'left',
              }}
            />

            {/* Status card */}
            <StatusCard inView={inView} />

            {/* CTA */}
            <MorphingCTA inView={inView} />
          </div>

          {/* ── RIGHT — CHANNEL CARDS ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.1, ease: E }}
              style={{ marginBottom: '0.5rem' }}
            >
              <span className="section-label">// Direct Channels</span>
            </motion.div>

            {CHANNELS.map((ch, i) => (
              <ChannelCard key={ch.id} ch={ch} index={i} inView={inView} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(0.78); }
        }
        @media (max-width: 860px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
        @media (max-width: 540px) {
          .ch-note-pill {
            display: none !important;
          }
          .contact-grid {
            gap: 2rem !important;
          }
        }
      `}</style>
    </section>
  )
}