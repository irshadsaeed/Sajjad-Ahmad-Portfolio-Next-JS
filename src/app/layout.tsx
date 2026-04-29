import type { Metadata, Viewport } from 'next'
import {
  Cormorant_Garamond,
  DM_Sans,
  Outfit,
  Geist_Mono,
} from 'next/font/google'
import '@/app/globals.css'
import { CursorProvider } from '@/components/ui/CursorProvider'

/* ─────────────────────────────────────────────────────────────
   FONT SYSTEM — Ultra-Refined Luxury Stack

   --font-display  → Cormorant Garamond  (hero, headings — ultra-refined serif)
   --font-body     → DM Sans             (body text — clean modern sans)
   --font-accent   → Outfit              (UI labels, nav, buttons — geometric)
   --font-mono     → Geist Mono          (terminal, code — Vercel's own mono)
   ─────────────────────────────────────────────────────────── */

const cormorantGaramond = Cormorant_Garamond({
  weight:   ['300', '400', '500', '600', '700'],
  style:    ['normal', 'italic'],
  subsets:  ['latin'],
  variable: '--font-display',
  display:  'swap',
  preload:  true,
})

const dmSans = DM_Sans({
  weight:   ['300', '400', '500', '600'],
  subsets:  ['latin'],
  variable: '--font-body',
  display:  'swap',
  preload:  true,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
})

const outfit = Outfit({
  weight:   ['300', '400', '500', '600', '700'],
  subsets:  ['latin'],
  variable: '--font-accent',
  display:  'swap',
  preload:  false,
  fallback: ['system-ui', 'sans-serif'],
})

const geistMono = Geist_Mono({
  weight:   ['300', '400', '500'],
  subsets:  ['latin'],
  variable: '--font-mono',
  display:  'swap',
  preload:  false,
  fallback: ['JetBrains Mono', 'Fira Code', 'monospace'],
})

/* ─── VIEWPORT ─────────────────────────────────────────────── */
export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: dark)',  color: '#080808' },
    { media: '(prefers-color-scheme: light)', color: '#F7F4EF' },
  ],
}

/* ─── METADATA ─────────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL('https://sajjadahmad.vercel.app'),

  title: {
    default:  'Sajjad Ahmad — WordPress & Laravel Developer',
    template: '%s · Sajjad Ahmad',
  },

  description:
    'WordPress & Laravel developer with 4+ years delivering high-performance plugins, custom themes, RESTful APIs, and LMS solutions. Based in Islamabad — building for the world.',

  keywords: [
    'WordPress Developer', 'Laravel Developer', 'PHP Developer',
    'WooCommerce Developer', 'Plugin Developer', 'LMS Developer',
    'LearnDash', 'Islamabad Developer', 'Pakistan Web Developer',
    'REST API Developer', 'Sajjad Ahmad', 'Full Stack Developer Pakistan',
  ],

  authors:   [{ name: 'Sajjad Ahmad', url: 'https://sajjadahmad.vercel.app' }],
  creator:   'Sajjad Ahmad',
  publisher: 'Sajjad Ahmad',
  alternates: { canonical: 'https://sajjadahmad.vercel.app' },

  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         'https://sajjadahmad.vercel.app',
    siteName:    'Sajjad Ahmad Portfolio',
    title:       'Sajjad Ahmad — WordPress & Laravel Developer',
    description: 'WordPress & Laravel developer · 4+ years · Islamabad, Pakistan',
    images: [{
      url:    '/og-image.png',
      width:  1200,
      height: 630,
      alt:    'Sajjad Ahmad — WordPress & Laravel Developer',
      type:   'image/png',
    }],
  },

  twitter: {
    card:        'summary_large_image',
    title:       'Sajjad Ahmad — WordPress & Laravel Developer',
    description: 'WordPress & Laravel developer with 4+ years of professional experience.',
    images:      ['/og-image.png'],
  },

  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      'max-image-preview': 'large',
      'max-snippet':       -1,
    },
  },

  icons: {
    icon: [
      { url: '/favicon.ico',               sizes: 'any'   },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple:    [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: [{ url: '/favicon.ico' }],
  },

  manifest: '/site.webmanifest',
  category: 'technology',
}

/* ─── JSON-LD ──────────────────────────────────────────────── */
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type':    'Person',
  name:       'Sajjad Ahmad',
  url:        'https://sajjadahmad.vercel.app',
  image:      'https://sajjadahmad.vercel.app/og-image.png',
  jobTitle:   'WordPress & Laravel Developer',
  email:      'sajjadahmadwaseer@gmail.com',
  telephone:  '+92-343-525-2754',
  address: {
    '@type':         'PostalAddress',
    addressLocality: 'Islamabad',
    addressCountry:  'PK',
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name:    'University of Engineering & Technology (UET), Taxila',
  },
  sameAs: [
    'https://www.linkedin.com/in/sajjad-ahmad754',
    'https://wa.me/923435252754',
  ],
}

const websiteJsonLd = {
  '@context':      'https://schema.org',
  '@type':         'WebSite',
  name:            'Sajjad Ahmad Portfolio',
  url:             'https://sajjadahmad.vercel.app',
  author:          { '@type': 'Person', name: 'Sajjad Ahmad' },
  inLanguage:      'en-US',
  copyrightYear:   new Date().getFullYear(),
  copyrightHolder: { '@type': 'Person', name: 'Sajjad Ahmad' },
}

/* ─── FOUC PREVENTION ──────────────────────────────────────── */
const themeScript = `(function(){try{var s=localStorage.getItem('sajjad-portfolio-theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',s||(d?'dark':'light'));}catch(e){}})();`

/* ─── ROOT LAYOUT ──────────────────────────────────────────── */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fonts = [
    cormorantGaramond.variable,
    dmSans.variable,
    outfit.variable,
    geistMono.variable,
  ].join(' ')

  return (
    <html lang="en" data-theme="dark" className={fonts} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <link rel="dns-prefetch"  href="//fonts.googleapis.com" />
        <link rel="dns-prefetch"  href="//fonts.gstatic.com" />
        <link rel="preconnect"    href="https://fonts.googleapis.com" />
        <link rel="preconnect"    href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <CursorProvider />
        {children}
      </body>
    </html>
  )
}