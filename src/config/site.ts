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
  handle: 'yourname',
  city: resume.basics.location.city,
  description: '[Role] who builds [what you build] for [who you help].',
  locale: 'en',
  /** The amber badge in the hero. */
  availability: 'Open to senior roles · Taking select freelance work',
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
} as const;

/** The `$ whoami` card in the home hero. */
export const whoami = {
  role: site.role,
  focus: '[Backend · APIs · Cloud]',
  experience: '[X] years',
  based: `${site.city} · remote-friendly`,
  status: 'available [month]',
} as const;

/** The `stack:` strip on the home page, as --flags. */
export const stack: readonly string[] = [
  'typescript',
  'react',
  'node',
  'go',
  'postgres',
  'aws',
  'docker',
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
