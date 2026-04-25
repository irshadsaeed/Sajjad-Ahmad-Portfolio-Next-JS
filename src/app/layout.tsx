import type { Metadata, Viewport } from 'next'
import {
  Playfair_Display,
  Inter,
  Space_Grotesk,
  IBM_Plex_Mono,
} from 'next/font/google'
import '@/app/globals.css'

/* ─────────────────────────────────────────────────────────────
   FONT SYSTEM — Editorial Luxury Stack
   Matched to reference images (Playfair Display + gold italic)

   Role mapping:
     --font-display → Playfair Display  (hero, headings — serif)
     --font-body    → Inter             (body text — sans)
     --font-accent  → Space Grotesk     (labels, UI, nav)
     --font-mono    → IBM Plex Mono     (terminal, code)

   Legacy aliases (no refactoring needed in components):
     --font-bebas   → --font-display
     --font-barlow  → --font-display
     --font-inter   → --font-body
     --font-fira    → --font-mono
     --font-space   → --font-accent
   ─────────────────────────────────────────────────────────── */

/* DISPLAY + HEADINGS — Playfair Display
   Must include both 'normal' and 'italic' styles.
   Italic is critical — it's the gold accent treatment
   from the reference images ("Delivered with Expertise").
   Weights 700–900 for bold hero impact.                   */
const playfairDisplay = Playfair_Display({
  weight:  ['400', '500', '600', '700', '800', '900'],
  style:   ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: true,   /* critical — it IS the LCP text element */
})

/* BODY — Inter
   Light 300 for body paragraphs (matches reference image).
   The contrast between thin sans and heavy serif is the
   exact aesthetic shown in both reference screenshots.    */
const inter = Inter({
  weight:  ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  preload: true,   /* critical — body text                 */
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
})

/* ACCENT — Space Grotesk
   UI labels, nav items, buttons, badges, tags.
   Modern and techie — sharp contrast with serif headings. */
const spaceGrotesk = Space_Grotesk({
  weight:  ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-accent',
  display: 'swap',
  preload: false,  /* non-critical — loads after LCP       */
  fallback: ['system-ui', 'sans-serif'],
})

/* MONO — IBM Plex Mono
   Terminal, code blocks, status strings.
   Crisp and professional — dev-grade readability.         */
const ibmPlexMono = IBM_Plex_Mono({
  weight:  ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
  fallback: ['JetBrains Mono', 'SF Mono', 'Menlo', 'monospace'],
})

/* ─────────────────────────────────────────────────────────────
   VIEWPORT
   ─────────────────────────────────────────────────────────── */
export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: dark)',  color: '#080808' },
    { media: '(prefers-color-scheme: light)', color: '#F7F4EF' },
  ],
}

/* ─────────────────────────────────────────────────────────────
   METADATA
   ─────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL('https://sajjadahmad.dev'),

  title: {
    default:  'Sajjad Ahmad — WordPress & Laravel Developer',
    template: '%s · Sajjad Ahmad',
  },

  description:
    'WordPress & Laravel developer with 3+ years delivering high-performance plugins, custom themes, RESTful APIs, and LMS solutions. Based in Islamabad — building for the world.',

  keywords: [
    'WordPress Developer',
    'Laravel Developer',
    'PHP Developer',
    'WooCommerce Developer',
    'Plugin Developer',
    'LMS Developer',
    'LearnDash',
    'Islamabad Developer',
    'Pakistan Web Developer',
    'REST API Developer',
    'Sajjad Ahmad',
    'Full Stack Developer Pakistan',
    'Next.js Developer',
    'WooCommerce Expert',
  ],

  authors:   [{ name: 'Sajjad Ahmad', url: 'https://sajjadahmad.dev' }],
  creator:   'Sajjad Ahmad',
  publisher: 'Sajjad Ahmad',

  alternates: { canonical: 'https://sajjadahmad.dev' },

  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         'https://sajjadahmad.dev',
    siteName:    'Sajjad Ahmad Portfolio',
    title:       'Sajjad Ahmad — WordPress & Laravel Developer',
    description: 'WordPress & Laravel developer · 3+ years · Islamabad, Pakistan',
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
    site:        '@sajjadahmad_',
    creator:     '@sajjadahmad_',
    title:       'Sajjad Ahmad — WordPress & Laravel Developer',
    description: 'WordPress & Laravel developer with 3+ years of professional experience.',
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
      'max-video-preview': -1,
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

  verification: {
    // google: 'ADD_AFTER_DEPLOYING_FROM_SEARCH_CONSOLE',
  },

  category: 'technology',
}

/* ─────────────────────────────────────────────────────────────
   JSON-LD — Person
   ─────────────────────────────────────────────────────────── */
const personJsonLd = {
  '@context':  'https://schema.org',
  '@type':     'Person',
  name:        'Sajjad Ahmad',
  url:         'https://sajjadahmad.dev',
  image:       'https://sajjadahmad.dev/og-image.png',
  jobTitle:    'WordPress & Laravel Developer',
  description: 'WordPress & Laravel developer with 3+ years delivering high-performance plugins, custom themes, RESTful APIs, and LMS solutions.',
  email:       'sajjadahmadwaseer@gmail.com',
  telephone:   '+92-343-525-2754',
  address: {
    '@type':          'PostalAddress',
    addressLocality:  'Islamabad',
    addressCountry:   'PK',
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name:    'University of Engineering & Technology (UET), Taxila',
  },
  knowsAbout: [
    'WordPress', 'Laravel', 'PHP', 'WooCommerce',
    'REST APIs', 'LMS Development', 'Next.js', 'React', 'LearnDash',
  ],
  sameAs: [
    'https://www.linkedin.com/in/sajjad-ahmad754',
    'https://wa.me/923435252754',
  ],
}

/* ─────────────────────────────────────────────────────────────
   JSON-LD — WebSite
   ─────────────────────────────────────────────────────────── */
const websiteJsonLd = {
  '@context':     'https://schema.org',
  '@type':        'WebSite',
  name:           'Sajjad Ahmad Portfolio',
  url:            'https://sajjadahmad.dev',
  description:    'Portfolio of Sajjad Ahmad — WordPress & Laravel developer based in Islamabad.',
  author:         { '@type': 'Person', name: 'Sajjad Ahmad' },
  inLanguage:     'en-US',
  copyrightYear:  new Date().getFullYear(),
  copyrightHolder: { '@type': 'Person', name: 'Sajjad Ahmad' },
}

/* ─────────────────────────────────────────────────────────────
   THEME INIT SCRIPT — runs before paint, prevents FOUC
   ─────────────────────────────────────────────────────────── */
const themeScript = `
(function(){
  try{
    var s=localStorage.getItem('sajjad-portfolio-theme');
    var d=window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme',s||(d?'dark':'light'));
  }catch(e){}
})();
`.trim()

/* ─────────────────────────────────────────────────────────────
   ROOT LAYOUT
   ─────────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const fontVariables = [
    playfairDisplay.variable,   /* --font-display */
    inter.variable,             /* --font-body    */
    spaceGrotesk.variable,      /* --font-accent  */
    ibmPlexMono.variable,       /* --font-mono    */
  ].join(' ')

  return (
    <html
      lang="en"
      data-theme="dark"
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        {/* Theme init — before first paint */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />

        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />

        {/* DNS prefetch */}
        <link rel="dns-prefetch"  href="//fonts.googleapis.com" />
        <link rel="dns-prefetch"  href="//fonts.gstatic.com" />
        <link rel="preconnect"    href="https://fonts.googleapis.com" />
        <link rel="preconnect"    href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>

      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}