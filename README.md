<div align="center">

<img src="public/images/image.png" alt="Sajjad Ahmad" width="120" style="border-radius: 50%;" />

# Sajjad Ahmad — Portfolio

### WordPress & Laravel Developer

[![Live Site](https://img.shields.io/badge/Live-sajjadahmad.vercel.app-C8A84B?style=for-the-badge&logo=vercel&logoColor=white)](https://sajjadahmad.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-sajjad--ahmad754-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sajjad-ahmad754)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-%2B92%20343%20525%202754-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/923435252754)
[![Email](https://img.shields.io/badge/Email-sajjadahmadwaseer@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:sajjadahmadwaseer@gmail.com)

</div>

---

## Overview

Personal portfolio of **Sajjad Ahmad** — a WordPress & Laravel developer with **3+ years** of professional experience building high-performance plugins, custom themes, RESTful APIs, and LMS solutions. Based in Islamabad, Pakistan — delivering for clients globally.

This portfolio is built to **elite production standards** — competing with top-tier global developer portfolios in design, performance, and engineering quality.

---

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | CSS Custom Properties (Design Tokens) |
| **Animations** | Framer Motion |
| **Fonts** | Playfair Display · Inter · Space Grotesk · IBM Plex Mono |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

---

## Design System

The entire UI is built on a single **CSS token system** in `globals.css`:

- **Color** — Dark canvas `#080808` + Electric Green `--ac: #00FF94` + Luxury Gold `--gold: #C8A84B`
- **Typography** — Editorial serif (Playfair Display) paired with clean sans (Inter) and mono (IBM Plex Mono)
- **Spacing** — Fluid `clamp()` scale across all breakpoints
- **Themes** — Full dark + light mode with zero FOUC via inline theme init script

---

## Sections

| Section | Concept |
|---|---|
| **Hero** | Portrait left / editorial content right · Letter-warp proximity animation · Financial dashboard stats |
| **Navbar** | Floating Command Bar — centered glass pill with SA emblem · Proximity glow links · Fullscreen mobile menu |
| **About** | Terminal-style data panel · 3D tilt feature cards · Inline serif highlights |
| **Experience** | Horizontal snap carousel · Achievement capsules · Keyboard navigation |
| **Skills** | Skill Intelligence System · Proficiency bars · Magnetic floating chips |
| **Education** | SVG radial CGPA gauge with animated count-up · Knowledge module cards |
| **Awards** | Spotlight click-to-expand system · Cursor light · Animated edge fill |
| **Contact** | Vertical Signal Lines · Morphing CTA ("Start a Conversation" → "Let's Talk") · Cursor atmosphere orb |
| **Footer** | Cinematic editorial CTA · Gold shimmer separator |

---

## Features

- ⚡ **Performance** — Lazy-loaded sections via `React.lazy + Suspense`, GPU-only transforms, `next/font` with `display: swap`
- 🎨 **Animations** — Spring-based Framer Motion, magnetic elements, 3D tilt, shimmer sweeps, scroll-driven progress
- 🌗 **Theme System** — FOUC-free dark/light mode using `data-theme` attribute + `localStorage` persistence
- 📱 **Responsive** — Mobile-first, fluid grids, cinematic fullscreen mobile menu
- ♿ **Accessibility** — Skip link, ARIA labels, `aria-current`, semantic HTML, keyboard navigation
- 🔍 **SEO** — JSON-LD `Person` + `WebSite` schema, full OpenGraph + Twitter cards, canonical URL, sitemap-ready
- 🔒 **Security** — No client secrets, no exposed keys, CSP-ready structure

---

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Full design token system
│   ├── layout.tsx           # Fonts, metadata, JSON-LD, FOUC script
│   └── page.tsx             # Root page — lazy section loading
├── components/
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── EducationSection.tsx
│   │   ├── AwardsSection.tsx
│   │   ├── ContactSection.tsx
│   │   └── Footer.tsx
│   └── ui/
│       ├── Navbar.tsx
│       ├── ThemeToggle.tsx
│       └── RevealWrapper.tsx
├── hooks/
│   ├── useTheme.ts          # SSR-safe dark/light toggle
│   ├── useScrollSpy.ts      # Active section detection
│   └── useCountUp.ts        # Animated number counter
├── lib/
│   └── data.ts              # All content — jobs, skills, education, awards
├── types/
│   └── index.ts             # TypeScript interfaces
public/
├── images/
│   └── image.png            # Profile photo
├── og-image.png             # OpenGraph 1200×630
└── favicon.ico              # SA branded favicon
```

---

## Getting Started

```bash
# Clone
git clone https://github.com/yourusername/sajjad-portfolio.git
cd sajjad-portfolio

# Install
npm install

# Dev server
npm run dev

# Build
npm run build

# Start production
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

Deployed on **Vercel** with automatic deployments on every `main` branch push.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repo directly at [vercel.com](https://vercel.com) for zero-config deployment.

---

## Performance Targets

| Metric | Target |
|---|---|
| Performance | 95+ |
| Accessibility | 95+ |
| Best Practices | 100 |
| SEO | 100 |
| LCP | < 2.5s |
| CLS | < 0.1 |

---

## Author

**Sajjad Ahmad**
WordPress & Laravel Developer · Islamabad, Pakistan

- 🌐 [sajjadahmad.vercel.app](https://sajjadahmad.vercel.app)
- 💼 [LinkedIn](https://www.linkedin.com/in/sajjad-ahmad754)
- 📱 [WhatsApp](https://wa.me/923435252754)
- 📧 [sajjadahmadwaseer@gmail.com](mailto:sajjadahmadwaseer@gmail.com)

---

<div align="center">

Designed & built by **Sajjad Ahmad** · © 2025

*Engineering precision. Delivering results.*

</div>