// ── Site content ─────────────────────────────────────────────────────────────
// Edit this file to update copy, services, testimonials, stats and values.
// Icons are inline SVGs — swap paths as needed.

export const SERVICES = [
  {
    label: 'MOTIVATIONAL SPEAKING',
    title: 'Words That Break Walls',
    desc: 'Powerful keynotes and group experiences that dismantle limiting beliefs and ignite lasting transformation — for companies, conferences, and communities ready to level up.',
    note: 'Booking available',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: 'LIFESTYLE COACHING',
    title: 'Design Your Ideal Life',
    desc: 'One-on-one sessions to help you clarify your values, break self-sabotage patterns, and build the daily disciplines that make your dream life inevitable.',
    note: 'Catalog coming soon',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    label: 'SPIRITUAL COACHING',
    title: 'Return to Your Inner Self',
    desc: 'Deep, heart-centered guidance that reconnects you with your intuition, dissolves inner conflict, and opens the door to the version of you that already knows the way.',
    note: 'Catalog coming soon',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 0 1 0 20M12 2a10 10 0 0 0 0 20M2 12h20" />
        <path d="M12 2c2.5 3 4 6.5 4 10s-1.5 7-4 10M12 2c-2.5 3-4 6.5-4 10s1.5 7 4 10" />
      </svg>
    ),
  },
]

export const STEPS = [
  {
    num: '01',
    title: 'Discover',
    desc: 'We uncover the beliefs and stories that have quietly been running your life — and name them.',
  },
  {
    num: '02',
    title: 'Transform',
    desc: 'Through powerful tools and deep presence, we rewrite the narrative and install new patterns.',
    featured: true,
  },
  {
    num: '03',
    title: 'Thrive',
    desc: 'You step forward clear, grounded, and powerfully aligned with who you are becoming.',
  },
]

export const VALUES = [
  {
    es: 'Confianza',
    en: 'Trust',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    es: 'Equilibrio',
    en: 'Balance',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="12" y1="2" x2="12" y2="22" />
      </svg>
    ),
  },
  {
    es: 'Enfoque',
    en: 'Focus',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    es: 'Calidez',
    en: 'Warmth',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
]

export const TESTIMONIALS = [
  {
    quote:
      'Working with Cami was the turning point I had been searching for. In just a few sessions, I finally understood what had been holding me back for years. I left feeling seen, clear, and genuinely ready to move forward.',
    name: 'Sofia M.',
    role: 'Entrepreneur & Mother',
    featured: true,
  },
  {
    quote:
      'Her speaking presence is magnetic. Our entire team left the workshop with a completely different energy — real results, real transformation.',
    name: 'Diego R.',
    role: 'CEO, Startforward',
  },
  {
    quote:
      'The spiritual coaching sessions gave me tools I use every single day. Cami meets you exactly where you are.',
    name: 'Valentina P.',
    role: 'Creative Director',
  },
  {
    quote:
      "I was skeptical at first, but Cami's approach is unlike anything I had experienced. Practical, warm, and deeply effective.",
    name: 'Andrés C.',
    role: 'Marketing Executive',
  },
]

export const STATS = [
  { num: '500+', label: 'Lives Transformed' },
  { num: '50+',  label: 'Speaking Events'   },
  { num: '12+',  label: 'Years of Practice' },
  { num: '3',    label: 'Pillars of Change' },
]

export const GALLERY_SLOTS = [
  { label: 'On Stage',          style: 'grid-row: 1 / 3; background: linear-gradient(155deg, #4a6178 0%, #1e2d42 100%)', tall: true },
  { label: 'Workshop',          style: 'background: linear-gradient(145deg, #e8d4d8 0%, #c9a4ab 100%)' },
  { label: '1-on-1 Session',    style: 'background: linear-gradient(145deg, #f5ede8 0%, #e8d4d8 100%)' },
  { label: 'Community',         style: 'background: linear-gradient(145deg, #4a6178 0%, #2c3e5a 100%)' },
  { label: 'Behind the Scenes', style: 'background: linear-gradient(145deg, #e8d4d8 0%, #4a6178 100%)' },
]
