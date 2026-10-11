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
  /** "Starting from" price, shown only when `showPricing` is on. */
  startingFrom?: string;
  /** Typical duration, e.g. "2–4 weeks". */
  timeline: string;
}

export const services: readonly Service[] = [
  {
    title: 'Websites for small businesses',
    summary:
      'A fast, custom site for a local business, with booking or intake forms that email you directly and hosting that costs little or nothing.',
    includes: [
      'Custom design and build',
      'Booking, contact or intake forms',
      'Domain, DNS, email and hosting setup',
      'A plain-language guide for updating your content',
    ],
    timeline: '1–3 weeks',
  },
  {
    title: 'Data pipelines & automation',
    summary:
      'For teams moving data between systems by hand: scheduled pipelines that pull, clean, validate and deliver it, with dashboards that show it’s working.',
    includes: [
      'ETL pipelines in Python, SQL and Airflow',
      'File transfers and system integrations',
      'Validation, reconciliation and alerting',
      'Power BI dashboards',
    ],
    timeline: '2–6 weeks',
  },
  {
    title: 'Web apps & MVPs',
    summary:
      'For founders and teams with an idea to test: a full-stack web app, built spec-first with automated tests and ready for real users.',
    includes: [
      'Spec and data model',
      'Front end, API and database',
      'Sign-in, roles and privacy rules',
      'Automated tests and deployment',
    ],
    timeline: '3–8 weeks',
  },
];

/** Set to true (and give each service a `startingFrom`) to show "starting from" prices. */
export const showPricing = false;

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
      'A short call and a written scope: your goals, constraints, what “done” means, and a quote before any work starts.',
  },
  {
    name: 'build',
    summary: 'Small, demoable increments with regular updates, so you see progress every week.',
  },
  {
    name: 'handoff',
    summary: 'Documentation, a walkthrough and a support window, so you can run it without me.',
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

/** The section hides while this is empty. Only add quotes you have permission to publish. */
export const testimonials: readonly Testimonial[] = [];
