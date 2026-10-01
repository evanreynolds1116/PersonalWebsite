import { z } from 'astro/zod';
import data from '../data/resume.json';

/*
 * Validates src/data/resume.json against the subset of the JSON Resume schema
 * (https://jsonresume.org/schema) this site uses. A typo fails the build with a
 * readable error instead of rendering a broken page.
 */

/** JSON Resume dates are `YYYY`, `YYYY-MM` or `YYYY-MM-DD`; `[...]` placeholders are allowed too. */
const date = z
  .string()
  .regex(/^(\d{4}(-\d{2}(-\d{2})?)?|\[.+\])$/, 'Use YYYY, YYYY-MM or YYYY-MM-DD');

const resumeSchema = z.object({
  basics: z.object({
    name: z.string(),
    label: z.string(),
    email: z.string(),
    url: z.url().optional(),
    summary: z.string(),
    location: z.object({
      city: z.string(),
      region: z.string().optional(),
      countryCode: z.string().optional(),
    }),
    profiles: z.array(z.object({ network: z.string(), username: z.string(), url: z.url() })),
  }),
  work: z.array(
    z.object({
      name: z.string(),
      position: z.string(),
      url: z.url().optional(),
      startDate: date,
      /** Omit for the current role. */
      endDate: date.optional(),
      summary: z.string(),
      highlights: z.array(z.string()).default([]),
    }),
  ),
  education: z
    .array(
      z.object({
        institution: z.string(),
        area: z.string(),
        studyType: z.string(),
        startDate: date.optional(),
        endDate: date.optional(),
      }),
    )
    .default([]),
  certificates: z
    .array(
      z.object({
        name: z.string(),
        issuer: z.string(),
        date: date.optional(),
        url: z.url().optional(),
      }),
    )
    .default([]),
  skills: z.array(z.object({ name: z.string(), keywords: z.array(z.string()) })).default([]),
});

export type Resume = z.infer<typeof resumeSchema>;
export type WorkItem = Resume['work'][number];

export const resume: Resume = resumeSchema.parse(data);

/** The year part of a JSON Resume date, or the placeholder as written. */
export function year(value: string): string {
  return /^\d{4}/.test(value) ? value.slice(0, 4) : value;
}

/** `2021–2024`, or `2021–now` for a role without an end date. */
export function dateRange(start: string | undefined, end: string | undefined): string {
  if (!start) return end ? year(end) : '';
  return `${year(start)}–${end ? year(end) : 'now'}`;
}

/** Looks up a profile URL by network name, case-insensitively. */
export function profileUrl(network: string): string | undefined {
  return resume.basics.profiles.find((p) => p.network.toLowerCase() === network.toLowerCase())?.url;
}
