'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'
import Reveal from './Reveal'
import { identity } from '@/lib/data'

function Count({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: setV })
    return () => c.stop()
  }, [inView, to])
  return <span ref={ref}>{v.toFixed(decimals)}</span>
}

export default function About() {
  return (
    <section id="about" className="section">
      <div className="wrap">
        <Reveal><span className="eyebrow">About</span></Reveal>
        <Reveal delay={0.08}>
          <p className="about-statement">
            I turn business problems into <em>reliable software</em>{' '}
            <span className="muted">— plugins, stores and platforms that load fast, stay secure and scale.</span>
          </p>
        </Reveal>

        <div className="about-grid">
          <Reveal className="about-copy">
            <p>
              I'm Sajjad, a developer based in Islamabad with over four years of hands-on experience
              across five companies. My day-to-day is the WordPress ecosystem — custom plugins,
              bespoke themes, WooCommerce extensions and LMS builds with LearnDash and Tutor LMS.
            </p>
            <p>
              On the backend I work in Laravel: RESTful APIs, well-structured MySQL schemas and secure
              authentication. Security isn't an afterthought for me — I audit, harden and patch so
              clients can sleep well.
            </p>
            <ul className="facts">
              <li><span>Based in</span><span>{identity.location}</span></li>
              <li><span>Education</span><span>BS Computer Science, UET Taxila</span></li>
              <li><span>Currently</span><span>WordPress Developer, Proto IT</span></li>
              <li><span>Open to</span><span>Freelance · Full-time · Remote</span></li>
            </ul>
          </Reveal>

          <Reveal delay={0.12} className="stats">
            <div className="stat accent">
              <strong><Count to={4} /><sup>+</sup></strong>
              <span>Years of professional experience</span>
            </div>
            <div className="stat">
              <strong><Count to={5} /></strong>
              <span>Companies trusted my code</span>
            </div>
            <div className="stat">
              <strong><Count to={3.42} decimals={2} /></strong>
              <span>CGPA at UET Taxila</span>
            </div>
            <div className="stat">
              <strong><Count to={3} /></strong>
              <span>Merit awards & scholarships</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
