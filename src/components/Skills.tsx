'use client'

import type { MouseEvent } from 'react'
import { LayoutTemplate, Server, ShieldCheck, Code2, Wrench, Users } from 'lucide-react'
import Reveal from './Reveal'

const icons = [LayoutTemplate, Server, ShieldCheck, Code2, Wrench, Users]
import { skillCategories } from '@/lib/data'

function spotlight(e: MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - r.left}px`)
  el.style.setProperty('--my', `${e.clientY - r.top}px`)
  if (!window.matchMedia('(hover: hover)').matches) return
  const rx = ((e.clientY - r.top) / r.height - 0.5) * -6
  const ry = ((e.clientX - r.left) / r.width - 0.5) * 6
  el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`
}

function reset(e: MouseEvent<HTMLDivElement>) {
  e.currentTarget.style.transform = ''
}

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="wrap">
        <div className="section-head">
          <Reveal>
            <span className="eyebrow">Capabilities</span>
            <h2 className="h2">A toolkit built for <em>real projects</em></h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lead">
              Deep in WordPress, fluent in Laravel, and careful about security — the full
              path from database schema to a polished front end.
            </p>
          </Reveal>
        </div>

        <div className="bento">
          {skillCategories.map((c, i) => (
            <Reveal key={c.id} delay={(i % 3) * 0.08} className="card" onMouseMove={spotlight} onMouseLeave={reset}>
              <div className="card-top">
                <span className="card-icon">
                  {(() => { const I = icons[i % icons.length]; return <I size={21} strokeWidth={1.6} /> })()}
                </span>
                <span className="card-num">0{i + 1}</span>
              </div>
              <h3>{c.label}</h3>
              <div className="pills">
                {c.pills.map(p => <span className="pill" key={p}>{p}</span>)}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
