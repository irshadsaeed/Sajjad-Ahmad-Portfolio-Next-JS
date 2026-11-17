import { ArrowUpRight } from 'lucide-react'
import Reveal from './Reveal'
import { education } from '@/lib/data'

export default function Education() {
  const featured = education.find(e => e.featured)
  const rest = education.filter(e => !e.featured)

  return (
    <section id="education" className="section">
      <div className="wrap">
        <div className="section-head">
          <Reveal>
            <span className="eyebrow">Education</span>
            <h2 className="h2">Grounded in <em>computer science</em></h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lead">
              A solid academic base, sharpened by certifications, fellowships and programs
              in development, leadership and entrepreneurship.
            </p>
          </Reveal>
        </div>

        {featured && (
          <Reveal className="edu-feature">
            <div>
              <span className="edu-badge">{featured.badge}</span>
              <h3>{featured.degree}</h3>
              <div className="edu-school">{featured.school}</div>
              <div className="edu-period">{featured.period}</div>
              <p className="desc">{featured.description}</p>
            </div>
            {featured.cgpa && (
              <div className="cgpa">
                <strong>{featured.cgpa.split(' ')[0]}</strong>
                <span>CGPA out of 4.00</span>
              </div>
            )}
          </Reveal>
        )}

        <div className="edu-list">
          {rest.map((e, i) => (
            <Reveal key={e.id} delay={(i % 2) * 0.08} className="edu-item">
              <div className="top">
                <span className="edu-badge">{e.badge}</span>
                <span className="when">{e.period}</span>
              </div>
              <h4>{e.degree}</h4>
              <div className="school">{e.school}</div>
              <p>{e.description}</p>
              {e.link && (
                <a className="cert" href={e.link} target="_blank" rel="noopener noreferrer">
                  View certificate <ArrowUpRight size={14} />
                </a>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
