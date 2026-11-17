'use client'

import { useState } from 'react'
import { ArrowUpRight, Check, Copy, Linkedin, Mail, MapPin, MessageCircle } from 'lucide-react'
import Reveal from './Reveal'
import { contactLinks, identity } from '@/lib/data'

const icons = {
  mail: Mail,
  'message-circle': MessageCircle,
  linkedin: Linkedin,
  'map-pin': MapPin,
} as const

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(identity.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${identity.email}`
    }
  }

  return (
    <section id="contact" className="section contact">
      <div className="contact-bg" aria-hidden="true" />
      <div className="wrap">
        <Reveal><span className="eyebrow">Contact</span></Reveal>
        <Reveal delay={0.08}>
          <h2 className="contact-title">
            Have a project?<br />
            <em>Let's talk.</em>
          </h2>
        </Reveal>

        <Reveal delay={0.16} className="mail">
          <a className="big" href={`mailto:${identity.email}`}>{identity.email}</a>
          <button className="copy" onClick={copy} aria-live="polite">
            {copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy email</>}
          </button>
        </Reveal>

        <div className="links">
          {contactLinks.map((c, i) => {
            const Icon = icons[c.icon as keyof typeof icons] ?? Mail
            const label = c.label.replace('// ', '')
            const inner = (
              <>
                <div className="row">
                  <Icon size={20} />
                  {c.href && <ArrowUpRight size={18} />}
                </div>
                <div><small>{label}</small><b>{c.value}</b></div>
              </>
            )
            return (
              <Reveal key={c.id} delay={i * 0.06}>
                {c.href ? (
                  <a
                    className="link-card"
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="link-card">{inner}</div>
                )}
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
