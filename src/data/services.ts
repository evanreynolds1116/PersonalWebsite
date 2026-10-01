/**
 * Freelance offerings. Shown as numbered cards on the home page; the full
 * /services page (Phase 3) reuses this list.
 */
export interface Service {
  title: string;
  /** Who it's for and what they walk away with. */
  summary: string;
}

export const services: readonly Service[] = [
  { title: '[Offering one]', summary: "[Who it's for and what they walk away with.]" },
  { title: '[Offering two]', summary: "[Who it's for and what they walk away with.]" },
  { title: '[Offering three]', summary: "[Who it's for and what they walk away with.]" },
];
