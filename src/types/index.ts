/** ============================================================
 *  TYPE DEFINITIONS — Sajjad Ahmad Portfolio
 * ============================================================ */

export interface Job {
  id: string
  role: string
  company: string
  location: string
  period: string
  current: boolean
  bullets: string[]
}

export interface SkillCategory {
  id: string
  label: string
  icon: string         // SVG path string
  pills: string[]
}

export interface EducationItem {
  id: string
  badge: string
  badgeType: 'degree' | 'cert' | 'fellowship' | 'course'
  degree: string
  school: string
  period: string
  cgpa?: string
  description: string
  featured?: boolean
link?: string;
}

export interface Award {
  id: string
  icon: string
  title: string
  year: string
  description: string
}

export interface Stat {
  value: number
  suffix: string
  label: string
  decimals: number
}

export interface TerminalLine {
  type: 'comment' | 'fn' | 'code' | 'blank'
  content: string
}

export interface ContactLink {
  id: string
  icon: string
  label: string
  value: string
  href: string | null
}

export interface NavLink {
  label: string
  href: string
}