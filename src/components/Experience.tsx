'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import Reveal from './Reveal'
import { jobs } from '@/lib/data'

export default function Experience() {
  const [open, setOpen] = useState<string | null>(jobs[0]?.id ?? null)

  return (
    <section id="experience" className="section">
      <div className="wrap">
        <div className="section-head">
          <Reveal>
            <span className="eyebrow">Experience</span>
            <h2 className="h2">Where I've <em>shipped</em> work</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lead">
              Six teams, from software houses to consultancies — building plugins, stores,
              APIs and learning platforms used by real customers every day.
            </p>
          </Reveal>
        </div>

        <div className="jobs">
          {jobs.map((job, i) => {
            const isOpen = open === job.id
            return (
              <Reveal key={job.id} delay={i * 0.05} className={`job ${isOpen ? 'open' : ''}`}>
                <button
                  className="job-head"
                  aria-expanded={isOpen}
                  aria-controls={`job-${job.id}`}
                  onClick={() => setOpen(isOpen ? null : job.id)}
                >
                  <span className="job-period">
                    {job.period}
                    {job.current && <span className="job-now">Now</span>}
                  </span>
                  <span className="job-role">{job.role}</span>
                  <span className="job-company">{job.company}</span>
                  <span className="job-toggle" aria-hidden="true"><Plus size={18} /></span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`job-${job.id}`}
                      className="job-body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <ul>
                        <li style={{ paddingLeft: 0 }} className="job-loc-li">
                          <span className="job-loc">{job.location}</span>
                        </li>
                        {job.bullets.map((b, k) => <li key={k}>{b}</li>)}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
