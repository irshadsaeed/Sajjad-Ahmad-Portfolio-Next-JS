import type {
  Job,
  SkillCategory,
  EducationItem,
  Award,
  Stat,
  TerminalLine,
  ContactLink,
  NavLink,
} from '@/types'

/* ── IDENTITY ──────────────────────────────────────────────── */
export const identity = {
  name:       'Sajjad Ahmad',
  firstName:  'Sajjad',
  lastName:   'Ahmad',
  title:      'WordPress & Laravel Developer',
  tagline:    'Engineering precision. Delivering results.',
  experience: '4+',
  location:   'Islamabad, Pakistan',
  status:     'Available',
  cgpa:       '3.42 / 4.00',
  university: 'UET Taxila',
  email:      'sajjadahmadwaseer@gmail.com',
  phone:      '+92 343 525 2754',
  linkedin:   'linkedin.com/in/sajjad-ahmad754',
  whatsappUrl:'https://wa.me/923435252754',
  linkedinUrl:'https://www.linkedin.com/in/sajjad-ahmad754',
  heroDesc:   'WordPress & Laravel developer with 4+ years delivering high-performance plugins, custom themes, RESTful APIs, and LMS solutions. Based in Islamabad — building for the world.',
}

/* ── STATS ─────────────────────────────────────────────────── */
export const stats: Stat[] = [
  { value: 4,    suffix: '+', label: '// YRS_EXPERIENCE', decimals: 0 },
  { value: 6,    suffix: '+', label: '// COMPANIES',      decimals: 0 },
  { value: 3.42, suffix: '',  label: '// UET_CGPA',       decimals: 2 },
]

/* ── NAV ───────────────────────────────────────────────────── */
export const navLinks: NavLink[] = [
  { label: 'Home',       href: '#hero'       },
  { label: 'About',      href: '#about'      },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills',     href: '#skills'     },
  { label: 'Education',  href: '#education'  },
  { label: 'Awards',     href: '#awards'     },
  { label: 'Contact',    href: '#contact'    },
]

/* ── TERMINAL LINES ────────────────────────────────────────── */
export const terminalLines: TerminalLine[] = [
  { type: 'blank',   content: '' },
  { type: 'comment', content: '// ChronoMate Plugin — Sajjad Ahmad' },
  { type: 'fn',      content: "add_action('wp_loaded'," },
  { type: 'code',    content: "  'sajjad_init_chronomate');" },
  { type: 'blank',   content: '' },
  { type: 'fn',      content: 'function sajjad_init_chronomate() {' },
  { type: 'code',    content: '  $scheduler = new ChronoMate();' },
  { type: 'code',    content: "  $scheduler->register_hooks();" },
  { type: 'code',    content: "  $scheduler->load_calendar();" },
  { type: 'code',    content: '}' },
  { type: 'blank',   content: '' },
  { type: 'comment', content: '// Laravel REST API' },
  { type: 'fn',      content: "Route::middleware('auth:sanctum')" },
  { type: 'code',    content: "  ->apiResource('courses'," },
  { type: 'code',    content: '     CourseController::class);' },
]

/* ── EXPERIENCE ────────────────────────────────────────────── */
export const jobs: Job[] = [
  {
    id: 'proto',
    role: 'WordPress Developer',
    company: 'Proto IT Consultant',
    location: 'Islamabad, Pakistan',
    period: 'Feb 2026 – Present',
    current: true,
    bullets: [
      'Developed and launched ChronoMate — a custom WordPress plugin for scheduling, time-tracking, and appointment management with calendar integration and automated reminders',
      'Applied WordPress security hardening including firewall setup, malware scanning, brute-force protection, SSL enforcement, and 2FA',
      'Extended WooCommerce with custom product types, payment gateways, and subscription models for high-traffic stores',
      'Integrated third-party REST APIs (CRMs, payment processors, automation tools) to streamline business workflows',
      'Conducted security audits to identify and patch plugin vulnerabilities, SQL injection, XSS, and access control issues',
    ],
  },
  {
    id: 'markloops',
    role: 'WordPress Developer',
    company: 'Markloops',
    location: 'Islamabad, Pakistan',
    period: 'Aug 2025 – Nov 2025',
    current: false,
    bullets: [
      'Implemented LMS solutions using LearnDash and Tutor LMS — including course creation, student management, and payment integrations',
      'Performed website migrations across servers and hosting environments ensuring data integrity and minimal downtime',
      'Integrated and customized WooCommerce for eCommerce and subscription-based sites',
      'Optimized site performance through caching, database optimization, security hardening, and troubleshooting',
    ],
  },
  {
    id: 'trs-laravel',
    role: 'Laravel Developer',
    company: 'The Right Software',
    location: 'Rawalpindi, Pakistan',
    period: 'Oct 2024 – Aug 2025',
    current: false,
    bullets: [
      'Developed and maintained scalable web applications using Laravel, adhering to clean code principles and industry best practices',
      'Built and deployed RESTful APIs for product search, cart management, and quote requests with seamless frontend integration',
      'Designed and optimized MySQL database schemas for performance and reliability',
      'Implemented secure user authentication systems and robust data validation mechanisms',
      'Utilized Eloquent ORM for efficient database operations, reducing development time and improving readability',
    ],
  },
  {
    id: 'trs-wp',
    role: 'WordPress Developer & Designer',
    company: 'The Right Software',
    location: 'Rawalpindi, Pakistan',
    period: 'Nov 2023 – Aug 2025',
    current: false,
    bullets: [
      'Specialized in WordPress theme and plugin development using best coding practices',
      'Developed WooCommerce and Easy Digital Downloads payment gateway plugins',
      'Built custom AI-based checkout tracking plugins and tailored bespoke solutions',
      'Implemented responsive designs ensuring consistent UX across all devices and browsers',
    ],
  },
  {
    id: 'hammani',
    role: 'Junior WordPress Developer',
    company: 'Hammani Tech (Pvt.) Ltd',
    location: 'Islamabad, Pakistan',
    period: 'Dec 2022 – Oct 2023',
    current: false,
    bullets: [
      'Developed and customized WordPress themes and plugins from scratch using HTML5, CSS3, JavaScript, and PHP',
      'Built custom post types, taxonomies, shortcodes, widgets, and page templates',
      'Collaborated with designers and frontend developers to integrate UI components',
      'Ensured website performance, security, and scalability across all deliverables',
    ],
  },
  {
    id: 'ebridge',
    role: 'Junior WordPress Plugin Developer',
    company: 'EBRIDGE Software House',
    location: 'Islamabad, Pakistan',
    period: 'Apr 2022 – Oct 2022',
    current: false,
    bullets: [
      'Developed WooCommerce plugins: Guest address display on Thank You page, Sales countdown timer, Shop the Look Pro plugin',
      'Wrote clean, optimized, well-documented code to enhance plugin performance and maintainability',
      'Conducted thorough testing and debugging to ensure plugin reliability and seamless user experience',
    ],
  },
]

/* ── SKILLS ────────────────────────────────────────────────── */
export const skillCategories: SkillCategory[] = [
  {
    id: 'wordpress',
    label: 'WordPress Ecosystem',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.49 0 2.87.43 4.04 1.17L5.17 16.04A7.934 7.934 0 0 1 4 12c0-4.41 3.59-8 8-8zm0 14c-1.49 0-2.87-.43-4.04-1.17l10.87-10.87C19.57 9.13 20 10.51 20 12c0 4.41-3.59 8-8 8z',
    pills: ['Plugin Dev','Theme Dev','WooCommerce','LearnDash','Tutor LMS','Elementor','ACF','Custom CPTs','Shortcodes'],
  },
  {
    id: 'laravel',
    label: 'Laravel & Backend',
    icon: 'M4 5h16a1 1 0 0 1 .8 1.6L13 14.333V19a1 1 0 0 1-1.447.894l-4-2A1 1 0 0 1 7 17v-2.667L3.2 6.6A1 1 0 0 1 4 5z',
    pills: ['Laravel','Eloquent ORM','REST APIs','PHP','MySQL','Auth Systems','API Integration'],
  },
  {
    id: 'security',
    label: 'Security & DevOps',
    icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 14l-3-3 1.41-1.41L11 12.17l4.59-4.58L17 9l-6 6z',
    pills: ['Security Hardening','Firewall Setup','2FA','Malware Scanning','SSL','SQL Injection Prevention','XSS Protection'],
  },
  {
    id: 'frontend',
    label: 'Frontend Languages',
    icon: 'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z',
    pills: ['HTML5','CSS3','JavaScript','jQuery','AJAX','Bootstrap','Tailwind CSS','JSON'],
  },
  {
    id: 'tools',
    label: 'Tools & DevOps',
    icon: 'M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.32.07-.64.07-.96 0-.32-.03-.66-.07-1l2.16-1.63c.19-.15.24-.42.12-.64l-2.05-3.55c-.13-.22-.38-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.48 0-.61.22L2.29 8.72c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.16 1.66c-.19.15-.24.42-.12.64l2.05 3.55c.13.22.38.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.58 1.69-.98l2.49 1c.23.09.48 0 .61-.22l2.05-3.55c.13-.22.07-.49-.12-.64l-2.14-1.66z',
    pills: ['Git','GitHub','Postman','Newman','cPanel','VS Code','Linux CLI'],
  },
  {
    id: 'professional',
    label: 'Professional Skills',
    icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
    pills: ['Team Leadership','Problem Solving','Clean Code','Documentation','Agile Workflow','API Testing'],
  },
]

/* ── EDUCATION ─────────────────────────────────────────────── */
export const education: EducationItem[] = [
  {
    id: 'uet',
    badge: "Bachelor's Degree",
    badgeType: 'degree',
    degree: 'BS Computer Science (Honours)',
    school: 'University of Engineering & Technology (UET), Taxila',
    period: '2018 – 2022 · Rawalpindi, Pakistan',
    cgpa: '3.42 / 4.00',
    description: 'Strong foundation in Data Structures & Algorithms, Advanced Database Systems, Computer Networks, Web Design & Development, and Smart Application Development. Thesis: Brain Tumor Detection System Using Deep Neural Networks — showcased as a standout project at NUML Open House 2021.',
    featured: true,
  },
  {
    id: 'digiskills',
    badge: 'Certified',
    badgeType: 'cert',
    degree: 'WordPress Development',
    school: 'Digiskills Training · Virtual University',
    period: 'Aug 2019 – Oct 2019',
    description: 'Comprehensive knowledge and practical skills in WordPress development, management, and deployment.',
  },
  {
    id: 'amal',
    badge: 'Fellowship',
    badgeType: 'fellowship',
    degree: 'Amal Career-Prep Fellowship',
    school: 'Amal Academy · Stanford-Funded',
    period: 'Dec 2020 – Feb 2021',
    description: '150+ hours developing leadership, communication, and problem-solving skills at a Stanford-funded education startup.',
  },
  {
    id: 'leeds',
    badge: 'Course',
    badgeType: 'course',
    degree: 'Critical Thinking at University of Leeds',
    school: 'FutureLearn · University of Leeds',
    period: 'December 2019',
    description: 'Applied critical thinking models, formative assessment, and action planning to sharpen analytical reasoning capabilities.',
    link: 'https://www.futurelearn.com/certificates/0g88779',
  },
  {
    id: 'ja-pakistan',
    badge: 'Program',
    badgeType: 'cert',
    degree: 'Tameer Entrepreneurship Program',
    school: 'JA Pakistan (INJAZ Pakistan)',
    period: 'Jan 2021 – Apr 2021',
    description: 'Completed the Tameer Entrepreneurship Program covering entrepreneurship skills, financial literacy, and workplace integrity. Developed key competencies in communication, problem solving, leadership, and business development.',
  },
]

/* ── AWARDS ────────────────────────────────────────────────── */
export const awards: Award[] = [
  {
    id: 'merit',
    icon: '🥇',
    title: 'Certificate of Merit & Scholarship',
    year: 'DEC 2019',
    description: "Ranked among the Top 3 performers in the 1st Semester of the bachelor's program. Honored at the prestigious Scholarship Ceremony at Army Public College of Management & Sciences, Rawalpindi.",
  },
  {
    id: 'peef',
    icon: '🏆',
    title: 'PEEF Merit-Based Scholarship',
    year: '2017',
    description: 'Awarded the prestigious Punjab Educational Endowment Fund Merit Scholarship with a certificate presented by the Chief Minister of Punjab, in recognition of outstanding academic achievement.',
  },
  {
    id: 'numl',
    icon: '🧠',
    title: 'NUML Open House — AI Showcase',
    year: '2021',
    description: '"Brain Tumor Detection System using Deep Neural Networks" selected as a standout showcase at NUML Open House 2021, recognizing innovation and technical excellence among hundreds of submissions.',
  },
]

/* ── CONTACT ───────────────────────────────────────────────── */
export const contactLinks: ContactLink[] = [
  {
    id: 'email',
    icon: 'mail',
    label: '// EMAIL',
    value: 'sajjadahmadwaseer@gmail.com',
    href: 'mailto:sajjadahmadwaseer@gmail.com',
  },
  {
    id: 'whatsapp',
    icon: 'message-circle',
    label: '// WHATSAPP · PHONE',
    value: '+92 343 525 2754',
    href: 'https://wa.me/923435252754',
  },
  {
    id: 'linkedin',
    icon: 'linkedin',
    label: '// LINKEDIN',
    value: 'linkedin.com/in/sajjad-ahmad754',
    href: 'https://www.linkedin.com/in/sajjad-ahmad754',
  },
  {
    id: 'location',
    icon: 'map-pin',
    label: '// LOCATION',
    value: 'Islamabad, Pakistan',
    href: null,
  },
]