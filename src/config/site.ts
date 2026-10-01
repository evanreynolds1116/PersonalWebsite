/**
 * Site-wide facts shown in the nav, footer and metadata.
 * Everything in [brackets] is a placeholder to replace with real content.
 */
export const site = {
  name: '[Your Name]',
  /** Shown as the `~/handle` logo; match your GitHub/LinkedIn handle. */
  handle: 'yourname',
  city: '[your city]',
  description: '[Role] who builds [what you build] for [who you help].',
  locale: 'en',
} as const;

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

export const hireLink: NavLink = { label: 'hire me', href: '/contact' };
