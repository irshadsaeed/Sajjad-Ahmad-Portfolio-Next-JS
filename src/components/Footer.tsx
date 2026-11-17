'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { identity, navLinks, contactLinks } from '@/lib/data'

function Clock() {
  const [t, setT] = useState<string | null>(null)
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Asia/Karachi',
    })
    const tick = () => setT(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return <span suppressHydrationWarning>{t ?? '--:--:--'}</span>
}

export default function Footer() {
  const sig = useRef<HTMLDivElement>(null)

  // Gold spotlight that follows the pointer across the giant signature
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = sig.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--sx', `${e.clientX - r.left}px`)
    el.style.setProperty('--sy', `${e.clientY - r.top}px`)
    el.classList.add('live')
  }

  const socials = contactLinks.filter(c => c.href)
  const cta = ['Let’s work together', 'Available for freelance', 'Let’s build something great']

  return (
    <footer className="footer">
      {/* Giant CTA ribbon */}
      <a href="#contact" className="f-ribbon" aria-label="Go to contact">
        <div className="f-ribbon-track">
          {[...cta, ...cta, ...cta, ...cta].map((t, i) => (
            <span key={i} aria-hidden={i >= cta.length}>
              {i % 2 ? <em>{t}</em> : t}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0c.5 6.5 5.5 11.5 12 12-6.5.5-11.5 5.5-12 12-.5-6.5-5.5-11.5-12-12C6.5 11.5 11.5 6.5 12 0z" />
              </svg>
            </span>
          ))}
        </div>
      </a>

      <div className="wrap">
        <div className="f-grid">
          <div className="f-intro">
            <p>
              Got an idea, a broken plugin or a platform to build? I reply within
              <em> 24 hours</em>.
            </p>
            <a href={`mailto:${identity.email}`} className="btn btn-primary">
              Start a project <ArrowUpRight size={18} />
            </a>
          </div>

          <nav className="f-col" aria-label="Footer">
            <h4>Navigate</h4>
            {navLinks.filter(l => l.href !== '#hero').map(l => (
              <a key={l.href} href={l.href}><span>{l.label}</span></a>
            ))}
          </nav>

          <div className="f-col">
            <h4>Connect</h4>
            {socials.map(s => (
              <a
                key={s.id}
                href={s.href!}
                target={s.href!.startsWith('http') ? '_blank' : undefined}
                rel={s.href!.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                <span>{s.label.replace('// ', '').split(' · ')[0]}</span>
                <ArrowUpRight size={14} />
              </a>
            ))}
          </div>

          <div className="f-col">
            <h4>Local time</h4>
            <div className="f-clock"><Clock /></div>
            <p className="f-muted">Islamabad · GMT+5</p>
            <p className="f-status"><span className="dot" /> Open to work</p>
          </div>
        </div>

        <div ref={sig} className="signature" onPointerMove={onMove} aria-hidden="true">
          <span className="sig-base">Sajjad <em>Ahmad</em></span>
          <span className="sig-glow">Sajjad <em>Ahmad</em></span>
        </div>

        <div className="footer-inner">
          <span>© {new Date().getFullYear()} {identity.name}. All rights reserved.</span>
          <span className="f-made">Designed & engineered in Islamabad</span>
          <a href="#hero" className="f-top" aria-label="Back to top">
            <ArrowUp size={18} />
          </a>
        </div>
      </div>
    </footer>
  )
}
