'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, ArrowDown, Code2, ShieldCheck } from 'lucide-react'
import { identity } from '@/lib/data'

const ease = [0.22, 1, 0.36, 1] as const

function Letters({ text, delay }: { text: string; delay: number }) {
  return (
    <span aria-label={text}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          style={{ display: 'inline-block' }}
          initial={{ y: '115%', rotate: 8 }}
          animate={{ y: '0%', rotate: 0 }}
          transition={{ duration: 1.1, delay: delay + i * 0.045, ease }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease },
})

export default function Hero() {
  const { scrollY } = useScroll()
  const imgY = useTransform(scrollY, [0, 800], [0, 80])

  return (
    <section id="hero" className="hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="grid" />
        <div className="glow-a" />
        <div className="glow-b" />
      </div>

      <div className="wrap hero-grid">
        <div>
          <motion.div {...fade(0.1)} className="status">
            <span className="dot" /> Available for new projects
          </motion.div>

          <h1 className="hero-title">
            <span className="line"><Letters text={identity.firstName} delay={0.2} /></span>
            <span className="line"><em><Letters text={identity.lastName} delay={0.42} /></em></span>
          </h1>

          <motion.div {...fade(0.55)} className="hero-role">
            <span>WordPress Engineer</span>
            <span className="sep" aria-hidden="true" />
            <span>Laravel Developer</span>
          </motion.div>

          <motion.p {...fade(0.65)} className="hero-desc">
            I build fast, secure WordPress plugins, WooCommerce stores, LMS platforms and
            Laravel APIs — clean code that ships on time and keeps working long after launch.
          </motion.p>

          <motion.div {...fade(0.75)} className="hero-ctas">
            <a href="#contact" className="btn btn-primary">
              Start a project <ArrowUpRight size={18} />
            </a>
            <a href="#experience" className="btn btn-ghost">View my work</a>
          </motion.div>

          <motion.div {...fade(0.9)} className="hero-meta">
            <div><strong>4+</strong><span>Years building</span></div>
            <div><strong>5</strong><span>Companies</span></div>
            <div><strong>UET</strong><span>CS Graduate</span></div>
          </motion.div>
        </div>

        <motion.div
          className="portrait-wrap"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.25, ease }}
        >
          <div className="portrait-ring" aria-hidden="true" />
          <motion.div className="portrait" style={{ y: imgY }}>
            <Image
              src="/images/image.png"
              alt="Sajjad Ahmad, WordPress and Laravel developer"
              fill
              priority
              sizes="(max-width: 960px) 88vw, 460px"
            />
          </motion.div>

          <svg className="orbit" viewBox="0 0 120 120" aria-hidden="true">
            <defs>
              <path id="circ" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
            </defs>
            <text><textPath href="#circ">Islamabad · Pakistan · Remote · Worldwide ·</textPath></text>
          </svg>
          <div className="orbit-core" aria-hidden="true">
            <i><ArrowDown size={18} /></i>
          </div>

          <motion.div
            className="chip chip-a"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.05, ease }}
          >
            <span className="ic"><Code2 size={17} /></span>
            <span><b>ChronoMate</b><small>Custom WP plugin</small></span>
          </motion.div>

          <motion.div
            className="chip chip-b"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.2, ease }}
          >
            <span className="ic"><ShieldCheck size={17} /></span>
            <span><b>Security-first</b><small>Hardened & audited</small></span>
          </motion.div>
        </motion.div>
      </div>

      <a href="#about" className="scroll-cue" aria-label="Scroll to about">
        SCROLL <i />
      </a>
    </section>
  )
}
