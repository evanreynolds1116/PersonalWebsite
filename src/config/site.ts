import { profileUrl, resume } from '../lib/resume';

/**
 * Site-wide facts shown in the nav, footer, home page and metadata.
 * Name, role, email, city and profile links come from src/data/resume.json so
 * they're written once. Everything in [brackets] is a placeholder.
 */
export const site = {
  name: resume.basics.name,
  role: resume.basics.label,
  email: resume.basics.email,
  /** Shown as the `~/handle` logo; match your GitHub/LinkedIn handle. */
  handle: 'EvanReynolds',
  city: resume.basics.location.city,
  description:
    'Software engineer who builds the data pipelines behind enterprise payroll, and ships full-stack apps by directing AI coding agents.',
  locale: 'en',
  /** The amber badge in the hero. */
  availability: 'Open to software/data/analytics engineering roles · Taking select freelance work',
  /** Shown under the contact headings. */
  replyTime: 'I usually reply within a day.',
  github: profileUrl('github'),
  linkedin: profileUrl('linkedin'),
  /** Optional booking link (Cal.com, Calendly…); the contact page hides it when unset. */
  bookingUrl: undefined as string | undefined,
  /**
   * Formspree endpoint for the contact form. Create a form at formspree.io and
   * paste its URL here; until then submissions show the error state.
   */
  formEndpoint: 'https://formspree.io/f/[your-form-id]',
  /**
   * Cloudflare Web Analytics site token (cookie-free, so no consent banner).
   * Dashboard → Analytics & Logs → Web Analytics → add site → copy the token
   * from the snippet. Not a secret: it ships in every page. Unset = no analytics.
   */
  cloudflareAnalyticsToken: undefined as string | undefined,
} as const;

/** The `$ whoami` card in the home hero. */
export const whoami = {
  role: site.role,
  focus: 'Full-stack development · APIs · AI agents',
  experience: '5 years',
  based: `${site.city} · remote-friendly`,
  status: 'available now',
} as const;

/** The `stack:` strip on the home page, as --flags. */
export const stack: readonly string[] = [
  'python',
  'sql',
  'typescript',
  'airflow',
  'postgres',
  'react',
  'docker',
  'claude-code',
];

export interface NavLink {
  label: string;
  href: string;
}

/** Primary navigation, in display order. */
export const navLinks: readonly NavLink[] = [
  { label: 'projects', href: '/projects' },
  { label: 'resume', href: '/resume' },
  { label: 'services', href: '/services' },
  { label: 'about', href: '/about' },
];

/** `?type=` preselects the inquiry type on the contact form. */
export const hireLink: NavLink = { label: 'hire me', href: '/contact?type=job' };
export const projectInquiryHref = '/contact?type=freelance';
