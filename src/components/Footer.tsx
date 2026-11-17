import { ArrowUp } from 'lucide-react'
import { identity } from '@/lib/data'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="signature" aria-hidden="true">
          Sajjad <em>Ahmad</em>
        </div>
        <div className="footer-inner">
          <span>© {new Date().getFullYear()} {identity.name}</span>
          <span>WordPress · Laravel · Islamabad</span>
          <a href="#hero" className="top">Back to top <ArrowUp size={15} /></a>
        </div>
      </div>
    </footer>
  )
}
