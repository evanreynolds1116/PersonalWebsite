# Personal website

Source for my personal site: a portfolio, resume and freelance page for a software engineer, styled as a **readable terminal**. The terminal look is the flavor, not the interface: monospace headings and prompt-style labels on top of a clean, editorial layout that anyone can scan.

Built with [Astro](https://astro.build), TypeScript (strict) and [Tailwind CSS](https://tailwindcss.com) v4. Pages are static HTML, and JavaScript ships only for small enhancements: the theme toggle, the mobile menu, the projects filter, the contact form and the 404 path.

> **Status: Phase 2 (core pages).** Home, projects with case studies, resume, about and contact are built on the Phase 1 foundation (tokens, fonts, nav, footer, theme toggle, 404). Content is placeholder text in `[brackets]`. See [`docs/website-plan.md`](docs/website-plan.md) for the full plan and build phases.

## Running it

Requires Node.js 22.12 or newer.

```bash
npm install
npm run dev        # http://localhost:4321
```

| Script                            | What it does                                                        |
| --------------------------------- | ------------------------------------------------------------------- |
| `npm run dev`                     | Start the dev server with hot reload                                |
| `npm run build`                   | Type-check (`astro check`), then build the static site into `dist/` |
| `npm run preview`                 | Serve the built `dist/` locally                                     |
| `npm run check`                   | Type-check `.astro` and `.ts` files only                            |
| `npm run lint` / `lint:fix`       | ESLint (TypeScript, Astro and accessibility rules)                  |
| `npm run format` / `format:check` | Prettier                                                            |

The first build downloads the fonts (see [Fonts](#fonts)), so it needs network access.

## Project structure

```text
├── astro.config.mjs          Astro config: MDX, fonts, Tailwind, build-info injection
├── config/
│   └── build-info.mjs        Reads branch + commit for the footer at build time (runs in Node)
├── docs/                     Planning docs and approved mockups (not part of the build)
├── public/                   Static files copied as-is (favicon)
└── src/
    ├── components/
    │   ├── mdx/                Case-study body components: Figure, Decisions, Decision
    │   ├── AvailabilityBadge.astro
    │   ├── Button.astro        Primary / ghost link-button (44px nav size, 48px content size)
    │   ├── Container.astro     The 1100px content column with phone/desktop gutters
    │   ├── CtaBand.astro       "Let's build something." call-to-action band
    │   ├── Flags.astro         Stack tags as --flags (boxed or plain)
    │   ├── Footer.astro        Editor status-line footer
    │   ├── Nav.astro           Header nav, plus the phone menu panel below 768px
    │   ├── PageHeader.astro    Prompt line + H1 + lead at the top of inner pages
    │   ├── ProjectCard.astro   Window-framed project card
    │   ├── PromptHeading.astro Section heading as a shell prompt (~/projects $ ls)
    │   ├── Screenshot.astro    Responsive AVIF/WebP screenshot, or a placeholder until set
    │   ├── ThemeToggle.astro   Dark/light toggle button
    │   └── WindowFrame.astro   Three dots + file-path title bar
    ├── config/
    │   └── site.ts             Handle, availability, whoami card, stack strip, nav, form endpoint
    ├── content/
    │   └── projects/*.mdx      One file per case study (filename = URL slug)
    ├── data/
    │   ├── resume.json         JSON Resume: single source for /resume and the home timeline
    │   └── services.ts         Freelance offerings
    ├── layouts/
    │   └── BaseLayout.astro    <head>, theme bootstrap, fonts, skip link, nav, footer
    ├── lib/
    │   ├── projects.ts         Collection queries: ordered, featured, tags
    │   ├── resume.ts           Validates resume.json with zod; date helpers
    │   └── theme.ts            Theme read/apply/persist helpers used by the toggle
    ├── pages/
    │   ├── index.astro         Home
    │   ├── projects/
    │   │   ├── index.astro     Project grid with tag filter
    │   │   └── [slug].astro    Case-study template
    │   ├── resume.astro        Web resume (print-friendly)
    │   ├── about.astro
    │   ├── contact.astro       Contact form (Formspree)
    │   └── 404.astro           "zsh: command not found" page
    ├── styles/
    │   └── global.css          Tokens, Tailwind theme mapping, base, prose and print styles
    ├── content.config.ts       Projects collection schema
    └── env.d.ts                Types for values injected at build time
```

## How it works

### Design tokens and theming

All colors are CSS custom properties defined in [`src/styles/global.css`](src/styles/global.css): one set for dark (the default) and one for light, switched by `data-theme` on `<html>`. Tailwind's `@theme inline` maps them to utilities, so components use `bg-surface`, `text-muted`, `border-border`, `text-accent`, `text-highlight` and so on, and never hard-code a hex value.

| Token         | Dark      | Light     | Used for                                    |
| ------------- | --------- | --------- | ------------------------------------------- |
| `--bg`        | `#0B0F14` | `#FAFAF7` | Page background                             |
| `--surface`   | `#111820` | `#FFFFFF` | Cards, window frames, footer                |
| `--border`    | `#1F2A36` | `#E3E3DE` | Dividers, outlines                          |
| `--text`      | `#E6EDF3` | `#1B1F24` | Body text                                   |
| `--muted`     | `#8B98A5` | `#5E6770` | Metadata, secondary text                    |
| `--accent`    | `#7EE787` | `#1A7F37` | Links, prompts, primary buttons             |
| `--highlight` | `#E3B341` | `#9A6700` | Availability badge, key numbers, focus ring |
| `--on-accent` | `#0B0F14` | `#FFFFFF` | Text on accent buttons                      |

Every text/background pair meets WCAG AA (4.5:1) in both themes. The lowest is light-mode highlight on the page background, at 4.65:1.

Theme selection, in order:

1. A choice the visitor made with the toggle (saved in `localStorage`).
2. The OS setting (`prefers-color-scheme`), followed live until the visitor picks one.
3. Dark.

A tiny inline script in `BaseLayout.astro` applies this before first paint, so there's no flash of the wrong theme. The toggle itself lives in `ThemeToggle.astro` and `src/lib/theme.ts`.

### Fonts

JetBrains Mono (headings, nav, labels, buttons, code) and Geist (body text) are loaded through Astro's built-in [Fonts API](https://docs.astro.build/en/guides/fonts/), configured in `astro.config.mjs`. At build time Astro downloads them from Fontsource, subsets them to Latin, and serves them from this site with hashed filenames. No requests go to a third-party font CDN. It also generates size-adjusted fallback faces to minimize layout shift, and preloads only the two faces used above the fold (Mono 700 and Geist 400).

In CSS they're available as `font-mono` and `font-sans`.

### Motion

The blinking cursors (`.cursor`) and any other animation stop under `prefers-reduced-motion: reduce`.

### Footer build info

The status line shows the branch and short commit hash of the build: `main · built from a1b2c3d`. `config/build-info.mjs` reads them from Cloudflare Pages or Vercel environment variables, then from local git, and the result is injected as `__BUILD_INFO__` via Vite's `define`. Outside a git repo it shows `built from dev`.

### Without JavaScript

The site still works. On phones the menu links render inline and the menu and theme buttons are hidden, and the 404 page shows a generic path.

## Code quality

- **TypeScript:** `astro/tsconfigs/strict`, checked on every build.
- **ESLint:** flat config in `eslint.config.js` with `@eslint/js`, `typescript-eslint` (strict), `eslint-plugin-astro`, and its jsx-a11y rules (via `eslint-plugin-jsx-a11y-x`, the maintained fork that supports ESLint 10).
- **Prettier:** with `prettier-plugin-astro`. `docs/` is excluded so the exported planning files stay byte-for-byte.

One gotcha: Astro trims whitespace that contains a line break, as JSX does. Prettier may move inline elements onto new lines, which can drop a space between words. Write `{' '}` where a space must survive, or build the string in the frontmatter (see `Footer.astro`).

## Editing content

Everything in `[brackets]` is a placeholder. Where each piece lives:

| What                                                               | Where                                                                                                  |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Name, role, email, city, GitHub/LinkedIn                           | `basics` in [`src/data/resume.json`](src/data/resume.json); the rest of the site reads them from there |
| Experience, education, certificates, skills                        | [`src/data/resume.json`](src/data/resume.json), in [JSON Resume](https://jsonresume.org/schema) format |
| Handle, availability badge, whoami card, stack strip, booking link | [`src/config/site.ts`](src/config/site.ts)                                                             |
| Freelance offerings                                                | [`src/data/services.ts`](src/data/services.ts)                                                         |
| About page copy                                                    | The lists at the top of [`src/pages/about.astro`](src/pages/about.astro)                               |
| Projects                                                           | [`src/content/projects/`](src/content/projects/)                                                       |
| Production URL                                                     | `site` in `astro.config.mjs`                                                                           |

`resume.json` is validated when the site builds (`src/lib/resume.ts`), so a missing field or a malformed date fails with a clear message instead of a broken page. Dates are `YYYY`, `YYYY-MM` or `YYYY-MM-DD`. Leave out `endDate` for your current role, which the timeline marks `HEAD`.

### Adding a project

Create `src/content/projects/<slug>.mdx`; the filename becomes `/projects/<slug>`. Copy an existing file for the frontmatter. The schema in `src/content.config.ts` documents every field, and the build fails if one is missing or invalid.

- `featured: true` puts it on the home page (the first three by `order`).
- `stack` takes lowercase slugs (`node`, `postgres`). They render as `--node` and feed the filter on `/projects`.
- `results` needs exactly three `{ value, label }` pairs for the highlight cards.
- `cover` is a path to an image next to the file (e.g. `./project-one.png`), and needs `coverAlt` with it. It's served as responsive AVIF/WebP; until it's set, a placeholder renders.
- `draft: true` hides it from production builds but keeps it visible in `npm run dev`.

Write the body as plain Markdown with `## Heading` sections. The template numbers them `## 01`, `## 02`… automatically and appends a "Stack & links" section built from the frontmatter. For richer blocks, import the components from `src/components/mdx/`:

```mdx
<Figure title="architecture.svg" caption="How requests flow." src={diagram} alt="…" />

<Decisions>
  <Decision title="Chose Postgres over DynamoDB">Why, and what it cost.</Decision>
</Decisions>
```

### Contact form

The form posts to [Formspree](https://formspree.io). Create a form there and paste its endpoint into `formEndpoint` in `src/config/site.ts`; until then, submitting shows the error state. Each inquiry type (Job / Freelance / Other) sets its own email subject, `?type=freelance` in a link preselects the type, and a honeypot field (`_gotcha`) filters bots. With JavaScript it submits in place with inline validation and success and error states; without it, it's a normal form POST.
