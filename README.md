# Personal website

Source for my personal site: a portfolio, resume and freelance page for a software engineer, styled as a **readable terminal**. The terminal look is the flavor, not the interface: monospace headings and prompt-style labels on top of a clean, editorial layout that anyone can scan.

Built with [Astro](https://astro.build), TypeScript (strict) and [Tailwind CSS](https://tailwindcss.com) v4. Pages are static HTML, and JavaScript ships only for small enhancements: the theme toggle, the mobile menu, the projects filter, the contact form and the 404 path.

> **Status: Phase 4 (launch-ready).** All pages are built and score 100 on all Lighthouse categories (mobile). GitHub Actions builds every push and pull request and deploys to Cloudflare Pages once it is connected; see [Deploying](#deploying) and the [launch checklist](#launch-checklist). Content is still placeholder text in `[brackets]`. See [`docs/website-plan.md`](docs/website-plan.md) for the full plan.

## Running it

Requires Node.js 22.12 or newer.

```bash
npm install
npx playwright install chromium   # once per machine, for the build's PDF and share images
npm run dev                        # http://localhost:4321
```

| Script                            | What it does                                                                                             |
| --------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `npm run dev`                     | Start the dev server with hot reload                                                                     |
| `npm run build`                   | Type-check, build into `dist/`, then generate share images and the resume PDF ([details](#build-output)) |
| `npm run build:site`              | Type-check and build only, without the Playwright step                                                   |
| `npm run preview`                 | Serve the built `dist/` locally                                                                          |
| `npm run check`                   | Type-check `.astro` and `.ts` files only                                                                 |
| `npm run lint` / `lint:fix`       | ESLint (TypeScript, Astro and accessibility rules)                                                       |
| `npm run format` / `format:check` | Prettier                                                                                                 |

The first build downloads the fonts (see [Fonts](#fonts)), so it needs network access.

## Project structure

```text
├── .github/workflows/
│   └── deploy.yml            CI: lint, type-check, build; deploy to Cloudflare Pages
├── astro.config.mjs          Astro config: MDX, fonts, Tailwind, build-info injection
├── config/
│   └── build-info.mjs        Reads branch + commit for the footer at build time (runs in Node)
├── docs/                     Planning docs and approved mockups (not part of the build)
├── public/                   Static files copied as-is: favicon, _headers (Cloudflare response headers)
├── scripts/
│   └── postbuild.mjs         Share images, resume PDF and output checks (runs after astro build)
└── src/
    ├── components/
    │   ├── mdx/                Case-study body components: Figure, Decisions, Decision
    │   ├── AvailabilityBadge.astro
    │   ├── Button.astro        Primary / ghost link-button (44px nav size, 48px content size)
    │   ├── Container.astro     The 1100px content column with phone/desktop gutters
    │   ├── CommandPalette.astro Cmd+K / Ctrl+K palette
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
    │   ├── services.ts         Offerings, process, pricing, testimonials
    │   └── uses.ts             The /uses list
    ├── layouts/
    │   └── BaseLayout.astro    <head>, theme bootstrap, fonts, skip link, nav, footer
    ├── lib/
    │   ├── pages.ts            Registry of every page: sitemap entries and share-image text
    │   ├── projects.ts         Collection queries: ordered, featured, tags
    │   ├── resume.ts           Validates resume.json with zod; date helpers
    │   └── theme.ts            Theme read/apply/persist helpers used by the toggle
    ├── pages/
    │   ├── index.astro         Home
    │   ├── projects/
    │   │   ├── index.astro     Project grid with tag filter
    │   │   └── [slug].astro    Case-study template
    │   ├── resume.astro        Web resume (print-friendly)
    │   ├── services.astro      Offerings, process, testimonials
    │   ├── about.astro
    │   ├── contact.astro       Contact form (Formspree)
    │   ├── uses.astro
    │   ├── 404.astro           "zsh: command not found" page
    │   ├── og-src/[key].astro  Share-image templates (screenshotted, then removed)
    │   ├── sitemap.xml.ts
    │   └── robots.txt.ts
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

The status line shows the branch and short commit hash of the build: `main · built from a1b2c3d`. `config/build-info.mjs` reads them from `BUILD_BRANCH` / `BUILD_COMMIT` (set by CI), then from local git, and the result is injected as `__BUILD_INFO__` via Vite's `define`. Outside a git repo it shows `built from dev`.

### Build output

`npm run build` runs `astro build`, then [`scripts/postbuild.mjs`](scripts/postbuild.mjs), which serves `dist/` with Astro's preview server and uses Playwright's headless Chromium to:

1. **Generate share images.** Each page gets a 1200×630 Open Graph image in the terminal style, rendered from `src/pages/og-src/[key].astro` with the site's own CSS and fonts and saved to `dist/og/<page>.png`. The template HTML is then deleted so it never ships.
2. **Export the resume PDF.** `/resume` is printed to `dist/resume.pdf` (US Letter) with the print stylesheet, so the web resume and the PDF come from the same `resume.json` and never drift. Print styles live in `global.css` (colors) and `resume.astro` (compact layout).
3. **Check the output.** The build fails if any page's `og:image` is missing or an indexable page isn't in `sitemap.xml`. Both come from [`src/lib/pages.ts`](src/lib/pages.ts), so a new page needs an entry there.

Chromium has to be installed once per machine (`npx playwright install chromium`). Where it can't run, `npm run build:site` builds the site without these files. In `npm run dev`, `/resume.pdf` and `/og/*` don't exist yet.

### SEO and sharing

Every page has a unique title and description, a canonical URL, Open Graph and Twitter/X card tags with its own image, and an entry in `sitemap.xml` (the 404 is `noindex`). `robots.txt` points to the sitemap. The home page includes JSON-LD `Person` data built from `resume.json`.

### Security headers and CSP

Astro generates a Content-Security-Policy `<meta>` tag on every page (`security.csp` in `astro.config.mjs`), hashing the site's own inline scripts and styles. Only two external origins are allowed: Cloudflare's analytics beacon and Formspree. [`public/_headers`](public/_headers) adds the headers a `<meta>` tag can't carry (`frame-ancestors`, HSTS, `nosniff`, referrer and permissions policies), long-term caching for hashed assets, and `noindex` on `*.pages.dev` URLs so only your domain shows in search. CSP isn't applied in `npm run dev`; test it with `npm run build && npm run preview`.

### Analytics

[Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) is cookie-free, so it needs no consent banner. Set `cloudflareAnalyticsToken` in `src/config/site.ts` and the beacon loads on production builds only. Unset, the site makes no third-party requests at all.

### Command palette

Press <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd> (or click the `⌘K` chip in the footer on desktop) to jump to any page or project, download the resume, copy your email or switch theme. It's built on `<dialog>` for focus handling, with a combobox/listbox pattern for screen readers. It's an extra: everything in it is also reachable through the normal navigation.

### Without JavaScript

The site still works. On phones the menu links render inline and the menu and theme buttons are hidden, and the 404 page shows a generic path.

## Deploying

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs on every push and pull request: install, lint, format check, then `npm run build` (type-check, site, share images, resume PDF). If Cloudflare is configured it then deploys `dist/`: pushes to `main` go to production, and each pull request gets its own preview URL, linked from the PR's deployments. The build runs in GitHub Actions rather than on Cloudflare because it needs Chromium.

Until the repository variable below is set, the workflow builds and checks but skips the deploy.

### One-time Cloudflare setup

1. **Create the Pages project** (Cloudflare dashboard → Workers & Pages → Create → Pages → _Direct Upload_), named e.g. `yourname-site`, with production branch `main`. Or from a terminal: `npx wrangler pages project create yourname-site --production-branch main`.
2. **Create an API token** (My Profile → API Tokens → Create token → Custom), with the permission _Account → Cloudflare Pages → Edit_, scoped to your account.
3. **Add them to GitHub** (repo → Settings → Secrets and variables → Actions):
   - Secret `CLOUDFLARE_API_TOKEN`: the token from step 2.
   - Secret `CLOUDFLARE_ACCOUNT_ID`: shown in the dashboard sidebar (Workers & Pages → Account ID).
   - Variable `CLOUDFLARE_PAGES_PROJECT`: the project name from step 1.
4. Push to `main` (or re-run the workflow). The site is live at `https://<project>.pages.dev`.

### Launch checklist

These need your accounts or your content, so they're manual:

- [ ] **Domain:** buy it, add it under the Pages project → Custom domains (Cloudflare sets up DNS and HTTPS), then set `SITE_URL` in `astro.config.mjs` and `handle` in `src/config/site.ts`.
- [ ] **Analytics:** Cloudflare dashboard → Web Analytics → add the domain, then paste the token into `cloudflareAnalyticsToken` in `src/config/site.ts`.
- [ ] **Contact form:** create a Formspree form for your email and paste its endpoint into `formEndpoint`. Send yourself a test of each inquiry type.
- [ ] **Content:** replace every `[bracketed]` placeholder (see [Editing content](#editing-content)), add screenshots and a photo, and only publish testimonials you have permission for.
- [ ] **Search:** add the domain in Google Search Console and submit `/sitemap.xml`.
- [ ] **Check the live site:** run Lighthouse on the production URL and share a page on LinkedIn or Slack to check its preview image.

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
| Offerings, process, pricing, testimonials                          | [`src/data/services.ts`](src/data/services.ts) (set `showPricing = false` to hide prices)              |
| The /uses list                                                     | [`src/data/uses.ts`](src/data/uses.ts)                                                                 |
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
