import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'

/* Self-hosted fonts — no network needed at build or runtime */
const display = localFont({
  src: [
    { path: './fonts/instrument-serif-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/instrument-serif-latin-400-italic.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--font-display',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
})

const sans = localFont({
  src: './fonts/Geist-Variable.woff2',
  weight: '100 900',
  variable: '--font-sans',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
})

const mono = localFont({
  src: './fonts/GeistMono-Variable.woff2',
  weight: '100 900',
  variable: '--font-mono',
  display: 'swap',
  preload: false,
  fallback: ['ui-monospace', 'monospace'],
})

const SITE = 'https://sajjadahmad.vercel.app'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0b',
  colorScheme: 'dark',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'Sajjad Ahmad — WordPress & Laravel Developer',
    template: '%s · Sajjad Ahmad',
  },
  description:
    'WordPress & Laravel developer with 4+ years building high-performance plugins, custom themes, REST APIs and LMS platforms. Based in Islamabad, working worldwide.',
  keywords: [
    'Sajjad Ahmad', 'WordPress Developer', 'Laravel Developer', 'PHP Developer',
    'WooCommerce Developer', 'Plugin Developer', 'LearnDash', 'REST API',
    'Islamabad', 'Pakistan',
  ],
  authors: [{ name: 'Sajjad Ahmad', url: SITE }],
  creator: 'Sajjad Ahmad',
  alternates: { canonical: SITE },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE,
    siteName: 'Sajjad Ahmad',
    title: 'Sajjad Ahmad — WordPress & Laravel Developer',
    description: 'WordPress & Laravel developer · 4+ years · Islamabad, Pakistan',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Sajjad Ahmad' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sajjad Ahmad — WordPress & Laravel Developer',
    description: 'WordPress & Laravel developer with 4+ years of professional experience.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Sajjad Ahmad',
  url: SITE,
  image: `${SITE}/images/image.png`,
  jobTitle: 'WordPress & Laravel Developer',
  email: 'sajjadahmadwaseer@gmail.com',
  address: { '@type': 'PostalAddress', addressLocality: 'Islamabad', addressCountry: 'PK' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of Engineering & Technology, Taxila' },
  sameAs: ['https://www.linkedin.com/in/sajjad-ahmad754'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <a href="#main" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  )
}
