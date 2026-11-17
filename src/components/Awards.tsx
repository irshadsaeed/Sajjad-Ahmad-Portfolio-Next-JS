import Reveal from './Reveal'
import { awards } from '@/lib/data'

export default function Awards() {
  return (
    <section id="awards" className="section">
      <div className="wrap">
        <div className="section-head">
          <Reveal>
            <span className="eyebrow">Recognition</span>
            <h2 className="h2">Awards & <em>honours</em></h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lead">
              Consistent recognition for academic merit and technical innovation.
            </p>
          </Reveal>
        </div>

        <div className="awards">
          {awards.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.1} className="award">
              <span className="award-n" aria-hidden="true">0{i + 1}</span>
              <span className="award-year">{a.year}</span>
              <h3>{a.title}</h3>
              <p>{a.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
