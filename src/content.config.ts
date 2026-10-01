import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Projects: one MDX file per case study in src/content/projects/.
 * The filename is the URL slug (/projects/<filename>). Frontmatter drives the
 * cards, header, details box and result cards; the MDX body is the write-up.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        /** One sentence for the case-study header: what it is, who it's for, the headline result. */
        summary: z.string(),
        /** One line with a number, for the project cards. */
        outcome: z.string(),
        /** Sort order on /projects and for prev/next; lowest first. */
        order: z.number(),
        /** Shown in the home page's featured grid (first three by order). */
        featured: z.boolean().default(false),
        /** Lowercase tag slugs rendered as --flags and used by the /projects filter. */
        stack: z.array(z.string().regex(/^[a-z0-9.+#-]+$/, 'Use lowercase slugs like "node"')),
        /** Window-frame title bar, e.g. `project-one/app`. */
        windowTitle: z.string(),
        role: z.string(),
        timeline: z.string(),
        team: z.string(),
        links: z.object({ live: z.url().optional(), github: z.url().optional() }).default({}),
        /** Exactly three headline numbers for the result cards. */
        results: z.array(z.object({ value: z.string(), label: z.string() })).length(3),
        /** Screenshot for the card and case-study hero. A placeholder renders until it's set. */
        cover: image().optional(),
        coverAlt: z.string().optional(),
        draft: z.boolean().default(false),
      })
      .refine((p) => !p.cover || p.coverAlt, {
        message: 'coverAlt is required when cover is set',
        path: ['coverAlt'],
      }),
});

export const collections = { projects };
