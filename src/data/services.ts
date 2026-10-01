/**
 * Freelance offerings, engagement process and testimonials. The home page shows
 * the offerings as short cards; /services shows everything.
 */
export interface Service {
  title: string;
  /** Who it's for and what they walk away with. */
  summary: string;
  /** What's included, as short phrases. */
  includes: readonly string[];
  /** "Starting from" price, shown when `showPricing` is on. */
  startingFrom: string;
  /** Typical duration, e.g. "2–4 weeks". */
  timeline: string;
}

export const services: readonly Service[] = [
  {
    title: '[Offering one]',
    summary: "[Who it's for and what they walk away with.]",
    includes: ['[Deliverable]', '[Deliverable]', '[Deliverable]'],
    startingFrom: '[$X,XXX]',
    timeline: '[X–Y weeks]',
  },
  {
    title: '[Offering two]',
    summary: "[Who it's for and what they walk away with.]",
    includes: ['[Deliverable]', '[Deliverable]', '[Deliverable]'],
    startingFrom: '[$X,XXX]',
    timeline: '[X–Y weeks]',
  },
  {
    title: '[Offering three]',
    summary: "[Who it's for and what they walk away with.]",
    includes: ['[Deliverable]', '[Deliverable]', '[Deliverable]'],
    startingFrom: '[$X,XXX]',
    timeline: '[X–Y weeks]',
  },
];

/** Set to false to hide "starting from" prices and just invite an inquiry. */
export const showPricing = true;

export interface ProcessStep {
  /** Shown as the command, e.g. `discovery`. */
  name: string;
  summary: string;
}

/** How an engagement works: discovery → build → handoff. */
export const process: readonly ProcessStep[] = [
  {
    name: 'discovery',
    summary:
      '[A short call and a written scope: goals, constraints, what "done" means, and a fixed quote.]',
  },
  {
    name: 'build',
    summary: '[Work in small, demoable increments with a weekly update and a shared board.]',
  },
  {
    name: 'handoff',
    summary: '[Docs, a walkthrough and a support window, so your team can own it from day one.]',
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  /** e.g. "Engineering Manager @ Company". */
  title: string;
  /** Only publish with the person's permission. */
  url?: string;
}

export const testimonials: readonly Testimonial[] = [
  {
    quote:
      '[A specific sentence or two from a former manager, client or teammate about the result you delivered.]',
    name: '[Name]',
    title: '[Role] @ [Company]',
  },
  {
    quote: '[A second testimonial, ideally from a different kind of collaborator.]',
    name: '[Name]',
    title: '[Role] @ [Company]',
  },
];
