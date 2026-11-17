const items = [
  'WordPress', 'Laravel', 'WooCommerce', 'Custom Plugins', 'REST APIs',
  'LearnDash', 'Security Hardening', 'MySQL', 'Theme Development', 'Tutor LMS',
]

function Star() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0c.5 6.5 5.5 11.5 12 12-6.5.5-11.5 5.5-12 12-.5-6.5-5.5-11.5-12-12C6.5 11.5 11.5 6.5 12 0z" />
    </svg>
  )
}

export default function Marquee() {
  const row = [...items, ...items]
  return (
    <div className="marquee" aria-label="Core technologies">
      <div className="marquee-track">
        {row.map((t, i) => (
          <span className="marquee-item" key={i} aria-hidden={i >= items.length}>
            {t} <Star />
          </span>
        ))}
      </div>
    </div>
  )
}
