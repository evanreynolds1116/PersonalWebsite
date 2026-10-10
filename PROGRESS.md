# Progress

A dated log of the build, following the phases in [`docs/website-plan.md`](docs/website-plan.md). Update it whenever a milestone lands or a decision changes. Times are US Central (UTC−5).

## Status

**Deployed to https://evanreynolds-site.pages.dev; no custom domain yet.** Every page is built, CI passes on `main`, pushes to `main` deploy automatically, and Lighthouse (mobile) scores 100 in every category. The `pages.dev` address is `noindex` until the domain is connected. Real content so far: name, contact details and work history in `resume.json`, the `~/EvanReynolds` handle, and two project case studies (Red Tide Tattoo Co. and Draft Day). The rest is still placeholder text in `[brackets]`.

| Phase                 | Status                            | Commit    | Date       |
| --------------------- | --------------------------------- | --------- | ---------- |
| 1. Foundation         | Done                              | `9be4352` | 2026-09-30 |
| 2. Core pages         | Done                              | `eb3b844` | 2026-09-30 |
| 3. Freelance & polish | Done                              | `ddb1ade` | 2026-09-30 |
| 4. Launch pipeline    | Done (code); launch steps pending | `be33a5b` | 2026-09-30 |

## Next up

The launch checklist from the README. These need your accounts or content:

- [x] **Cloudflare:** Pages project `evanreynolds-site`, API token, and GitHub secrets/variable set; deploys run on every push to `main`.
- [ ] **Domain:** buy it, add it to the Pages project, then set `SITE_URL` in `astro.config.mjs` (the `handle` is already set to `EvanReynolds`).
- [ ] **Analytics:** add the Cloudflare Web Analytics token to `cloudflareAnalyticsToken` in `src/config/site.ts`.
- [ ] **Contact form:** create the Formspree form and set `formEndpoint` in `src/config/site.ts`; test each inquiry type.
- [ ] **Content:** replace every `[bracketed]` placeholder, add project screenshots and a photo, and publish only testimonials you have permission for. Progress:
  - [x] `resume.json` basics and work history (name, title, email, location, profiles, three roles with titles)
  - [ ] `resume.json`: summary, impact lines and bullets, HCA's company URL, education, certificates
  - [x] Project 1: Red Tide Tattoo Co. case study
  - [ ] Red Tide: add the owner's view of the old site, early results, and what you'd do differently (removed as placeholders before publishing)
  - [x] Project 2: Draft Day case study
  - [ ] Draft Day: decide on the real player headshots in the screenshots, and whether to mention AI-assisted development (the public repo has a `CLAUDE.md`)
  - [ ] Project 3 (still `[Project Three]`)
  - [x] Handle (`EvanReynolds`) and years of experience in the whoami card
  - [ ] Hero line, rest of the whoami card (focus, status), stack strip, services, about, `/uses`, photo
- [ ] **Search:** submit `/sitemap.xml` in Google Search Console.
- [ ] **Check the live site:** Lighthouse on the production URL; share a page to check its preview image.

Later (from the plan): a blog once three posts are ready, and a `/now` page.

## Log

### 2026-10-10

- Added the first real project, [Red Tide Tattoo Co.](https://redtidetattooco.com), a custom site built for a tattoo studio (PR [#4](https://github.com/evanreynolds1116/PersonalWebsite/pull/4), merged as `e5b63eb`; branch deleted). It replaces the `[Project One]` placeholder and is the first featured project.
  - Case study written from the RedTideTattoo repo's README and worker code: consent forms and their QR-code URLs, appointment requests, nightly Instagram sync, DNS move, four key decisions.
  - Results measured on the live site: 1 week from first commit to launch, Lighthouse 100 for accessibility, best practices and SEO (performance 94 home, 97 booking), $0/month hosting.
  - Screenshots of the live home and booking pages, plus an architecture diagram, in `src/assets/projects/red-tide-tattoo/`.
  - No GitHub link, because the RedTideTattoo repo is private. Placeholder prompts were removed before publishing; add the real text later.
- Logged PRs #2–#4 in this file (PR [#5](https://github.com/evanreynolds1116/PersonalWebsite/pull/5), merged as `d2b6f51`).
- Set the handle to `EvanReynolds` (logo, terminal title bars, share images), the whoami experience to `5 years`, and the Momentum Technology title to Backend Software Engineer (PR [#6](https://github.com/evanreynolds1116/PersonalWebsite/pull/6), merged as `194eabe`).
- Added the second real project, Draft Day ([FantasyFootballApp](https://github.com/evanreynolds1116/FantasyFootballApp)), a real-time sealed-bid auction and snake draft app for a 12-team fantasy football league (PR [#7](https://github.com/evanreynolds1116/PersonalWebsite/pull/7), merged as `b12c8bb`). It replaces the `[Project Two]` placeholder.
  - Case study written from the repo's README, commits and test suite: the league's format, pure rules engine, authoritative server, bid secrecy, restart safety, four key decisions.
  - Results counted from the repo: 350 automated tests (246 engine, 51 server, 53 web), 3 days from first commit to full 12-team mock drafts, ~60 ms per action. States that it isn't hosted yet and the known 0.7 s gap under simultaneous bids.
  - Big board auction and reveal screenshots from the repo, plus an architecture diagram, in `src/assets/projects/draft-day/`. Links to the public GitHub repo.
- Deleted each branch after its PR merged; `main` is the only branch.

### 2026-10-01

- Merged PR [#1](https://github.com/evanreynolds1116/PersonalWebsite/pull/1) (Phases 2–4) into `main` as `da3779c`. CI passed on the PR and again on `main`. The deploy step is skipped until Cloudflare is configured.
- Deleted the `phase-2`, `phase-3` and `phase-4` branches after confirming they were fully merged.
- Installed the GitHub CLI (`gh` 2.102.0) and signed it in, so PRs and CI can be checked from the terminal.
- Connected Cloudflare Pages (project `evanreynolds-site`). First production deploy from `5e55e6a` succeeded; all pages, the PDF, share images, sitemap and security headers checked live.
- Fixed trailing-slash redirects: Cloudflare 308-redirected `/projects` to `/projects/`, so every internal link and canonical URL pointed at a redirect. Switched to `build.format: 'file'` so the no-slash URLs are served directly, with a shared `pagePath()` helper for canonical URLs and the nav.
- Heads-up: GitHub moves `ubuntu-latest` to Ubuntu 26 on 2026-10-19. If the Chromium install step breaks, pin the workflow to `ubuntu-24.04`.
- Merged the trailing-slash fix, PR [#2](https://github.com/evanreynolds1116/PersonalWebsite/pull/2), as `8002225`, after checking on its preview that `/projects` returns 200 with no redirect.
- First real content: name, title, email, Nashville TN, GitHub and LinkedIn, and work history (HCA Healthcare, Momentum Technology, Accenture) in `resume.json`. Merged as PR [#3](https://github.com/evanreynolds1116/PersonalWebsite/pull/3) (`90b7c52`) and checked live.
- Deleted the `fix/no-trailing-slash` and `content/resume-basics` branches after merging.

### 2026-09-30

**Phase 4: launch pipeline** (`be33a5b`)

- GitHub Actions workflow: lint, format check and full build on every push and PR; deploys `dist/` to Cloudflare Pages (main → production, PRs → previews).
- Content Security Policy generated by Astro with hashed inline scripts and styles; `public/_headers` for the rest (frame-ancestors, HSTS, nosniff, caching, `noindex` on `*.pages.dev`).
- Cloudflare Web Analytics (cookie-free), production only, behind a token.
- Cmd+K / Ctrl+K command palette.
- Decisions: Cloudflare Pages + Cloudflare Web Analytics; build in Actions because it needs Chromium; domain kept as a placeholder.

**Phase 3: freelance & polish** (`ddb1ade`)

- `/services` (offerings, process, pricing toggle, testimonials) and `/uses`.
- Per-page Open Graph tags, `sitemap.xml`, `robots.txt`, JSON-LD `Person`.
- Post-build step (Playwright): share images, `resume.pdf` (US Letter), and checks for missing images or sitemap entries.
- Lighthouse (mobile): 100 / 100 / 100 / 100 on every page.
- Decisions: Playwright for both the PDF and share images (no extra packages); Lighthouse run via `npx`, not installed.

**Phase 2: core pages** (`eb3b844`)

- Home page from the mockups; projects as MDX case studies with a tag filter; `/resume` from `resume.json`; `/about`; `/contact` with Formspree.
- Decisions: amber (not red) for form errors, since the palette has no red; "full resume" linked the web page until the PDF existed.

**Phase 1: foundation** (`9be4352`)

- Astro + TypeScript (strict) + Tailwind v4; color tokens for both themes; self-hosted JetBrains Mono and Geist; layout, nav with mobile menu, status-line footer, theme toggle, 404.
- ESLint, Prettier and the README.
- Decisions: the focus ring uses the highlight token (the mockups' fixed amber failed contrast in light mode); TypeScript pinned to 6.0 for tooling compatibility; jsx-a11y via the maintained `-x` fork for ESLint 10.
