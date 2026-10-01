# Personal Website Plan & Design Brief

Sep 30, 2026 · @Evan Reynolds

## Goals & audiences

The site's first job is getting you interviews; its second is turning visitors into freelance inquiries. Every page should let each audience find what it needs in under 60 seconds, then take one clear action.

| Audience | Priority | What they need in the first minute | The one action |
| --- | --- | --- | --- |
| Recruiters | Primary | Your title, years of experience, core stack, location/remote status, availability | Download resume or email you |
| Hiring managers / engineers | Primary | Proof you ship: 3 to 4 strong projects with your role, decisions and results; GitHub | Read a case study, then book a call |
| Freelance clients | Secondary | What you build, for whom, how an engagement works, rough starting price or "from" range | Send a project inquiry |

**Design principle that follows from this:** the terminal aesthetic is the flavor, not the interface. A recruiter who has never opened a terminal must be able to scan the site with zero learning curve.

## Site map & page plan

Launch with six pages plus case studies; add a blog only once you have three posts ready. Besides the sections you picked, I recommend a **Services** page (it's what converts freelance visitors) and a small **/uses** page (cheap to build, fits the terminal theme, and gives interviewers a conversation starter).

| Page | URL | What's on it | Primary CTA |
| --- | --- | --- | --- |
| Home | `/` | Hero with name, role, one-line value prop and an availability badge (e.g. "Open to senior roles · Taking select freelance work"); 3 featured projects; tech stack strip; experience snapshot of your last 2 to 3 roles | View resume · Hire me |
| Projects | `/projects` | Card grid: title, one-line outcome, stack tags, live/GitHub links; filter by tag | Open a case study |
| Case study | `/projects/[slug]` | Problem → your role → approach/architecture → result with numbers → stack → screenshots → links | Next project · Get in touch |
| Resume | `/resume` | Web version: experience timeline, grouped skills, education/certs; print-friendly styles | Download PDF |
| Services | `/services` | 2 to 3 offerings, how an engagement works (discovery → build → handoff), "starting from" pricing if you're comfortable, testimonials | Start a project |
| About | `/about` | Short story, how you like to work, what you're learning, a photo | Contact |
| Contact | `/contact` | Form with an inquiry type (Job / Freelance / Other), plus email, LinkedIn, GitHub, optional booking link | Send |
| Uses | `/uses` | Editor, terminal, hardware, tools | none |
| 404 | any | Styled as `command not found`, with links home | Go home |

**Later (phase 2):** Blog at `/blog`, a `/now` page, and a `Cmd+K` command palette for keyboard navigation as a power-user easter egg.

## Design direction: "readable terminal"

Dark-first and code-flavored, but built like a clean editorial site underneath. Monospace carries the personality (headings, nav, labels, tags); a proportional sans carries the reading (paragraphs, case studies, resume).

### Color tokens

| Token | Dark (default) | Light | Used for |
| --- | --- | --- | --- |
| `--bg` | `#0B0F14` | `#FAFAF7` | Page background |
| `--surface` | `#111820` | `#FFFFFF` | Cards, code blocks, window frames |
| `--border` | `#1F2A36` | `#E3E3DE` | Dividers, card outlines |
| `--text` | `#E6EDF3` | `#1B1F24` | Body text |
| `--muted` | `#8B98A5` | `#5E6770` | Metadata, dates, captions |
| `--accent` | `#7EE787` (phosphor green) | `#1A7F37` | Links, prompt symbols, primary buttons |
| `--highlight` | `#E3B341` (amber) | `#9A6700` | Availability badge, key numbers in case studies |

Check every text/background pair hits WCAG AA (4.5:1). Include a theme toggle that respects `prefers-color-scheme` on first visit.

### Typography

- **Mono:** JetBrains Mono (or Geist Mono) for H1 to H3, nav, tags, buttons, code.
- **Sans:** Inter (or Geist) for body at 17 to 18px, line height 1.6, max width about 68 characters.
- **Scale:** 14 / 16 / 18 / 24 / 32 / 48px.

### Signature details (use these, sparingly)

- Section headings written as prompts: `~/projects $ ls`, `~/about $ cat bio.md`.
- A blinking cursor after your name in the hero; an optional one-time typed intro under 1 second.
- Stack tags styled like flags: `--react` `--go` `--postgres`.
- Project screenshots inside a minimal window frame (three dots, file-path title bar).
- Footer as an editor status line: `main ● built from commit a1b2c3 ●` your-city (or "Remote").
- 404 page: `zsh: command not found: /that-page`.

### Avoid

- A fake terminal as the *only* way to navigate. Recruiters won't type `help`.
- Green-on-black everywhere, CRT scanlines, glow effects: they hurt readability.
- Long typing animations that delay content. Anything animated must respect `prefers-reduced-motion`.
- ASCII art that breaks at phone width.

### Layout & components

Mobile-first; content max width 1100px, reading width 720px; 8px spacing grid. Components to design once and reuse: nav bar, hero, availability badge, button (primary/ghost), project card, case-study layout, experience timeline item, tag, form field, footer status line.

## Tech stack & hosting

Recommendation: **Astro + TypeScript, deployed as a static site on Cloudflare Pages, Vercel or Netlify (free tier), with a custom domain.** It's fast by default, cheap to run, and your content lives in plain files you can edit without touching components.

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Astro | Ships zero JS by default, so pages load near-instantly; content collections give typed Markdown/MDX for case studies; you can still drop in React components where you want to show React skills |
| Styling | Tailwind CSS with the color tokens above as CSS variables (or plain CSS modules) | Fast to iterate; tokens make light/dark trivial |
| Content | MDX files for projects; one `resume.json` (JSON Resume schema) as the single source of truth | The web resume and the PDF are generated from the same data, so they never drift |
| Resume PDF | Print stylesheet on `/resume`, exported to PDF at build time (e.g. Playwright in CI) | No hand-maintained Word file |
| Contact form | Form service (Formspree, Web3Forms) or a small serverless function sending via an email API | No backend to maintain; add a honeypot field against spam |
| Analytics | Cookie-free: Plausible, Umami or Cloudflare Web Analytics | No consent banner needed |
| Repo & CI | Public GitHub repo, deploy on push to `main`, preview deploys on PRs | The repo itself becomes a portfolio piece |
| Domain | `yourname.dev` or `yourname.com` | Use the same handle across GitHub and LinkedIn |

If you'd rather showcase Next.js specifically for React-heavy roles, it works too; expect a bit more setup for the same result.

## Quality bar

Hiring engineers will open DevTools, so treat these as launch requirements, not polish.

| Area | Target |
| --- | --- |
| Performance | Lighthouse 95+ on all four categories, mobile; LCP under 2s; fonts self-hosted and subset; images in AVIF/WebP with explicit sizes |
| Accessibility | WCAG AA contrast; full keyboard navigation with visible focus; semantic landmarks; alt text on every screenshot; reduced-motion respected |
| SEO & sharing | Unique title and description per page; Open Graph image per page (auto-generated in the terminal style); `sitemap.xml`, `robots.txt`; JSON-LD `Person` schema on the home page |
| Responsiveness | Tested at 360px, 768px, 1280px; no horizontal scroll |
| Contact | Inquiry type routes to a clear subject line; honeypot spam protection; success and error states |
| Code quality | TypeScript strict, ESLint + Prettier, a README explaining the architecture (interviewers read it) |
| Privacy | Cookie-free analytics; no third-party trackers |

## Content checklist

Content is the slowest part, so gather it before the build session. Claude can scaffold everything with placeholders, but real words and numbers are what get you hired.

- [ ] One-line headline: role + specialty + who you help (e.g. "Backend engineer who builds reliable payment systems")
- [ ] Availability statement for jobs and for freelance
- [ ] Resume data: roles, dates, 3 to 5 impact bullets each with numbers, skills, education, certifications
- [ ] 3 to 4 projects for case studies: problem, your role, key decisions, measurable result, stack, screenshots, links
- [ ] 2 to 3 service offerings, your process, and whether to show "starting from" pricing
- [ ] 1 to 3 testimonials (former managers, clients, teammates) with permission to publish
- [ ] Short bio (about 150 words) and a professional photo
- [ ] Links: GitHub, LinkedIn, email, optional booking link
- [ ] Domain name decided and purchased
- [ ] Your `/uses` list

## Build phases & prompt for Claude

Build in four short phases so you have something shippable after each one.

1. **Foundation:** Astro project, design tokens, fonts, layout, nav, footer, theme toggle, 404.
2. **Core pages:** Home, Resume (from `resume.json`), Projects grid and case-study template, About, Contact form.
3. **Freelance & polish:** Services page, testimonials, `/uses`, OG images, SEO, accessibility and Lighthouse pass, resume PDF export.
4. **Launch:** Connect the domain, analytics, deploy pipeline; then phase 2 extras (blog, `/now`, `Cmd+K` palette).

Paste this to start the build, and attach this doc or paste its sections below it. The mockup canvas is private to you; share it from its Share menu first if someone else is doing the build.

```markdown
Build my personal website as a software engineer. Goal: primarily land a full-time role, secondarily win freelance clients.

Design reference: match the approved mockups on this canvas: https://claude.ai/artifact/UyoNtzAwR8yhta8WNtPrKv
It has three artboards: "Home — desktop", "Home — phone" and "Case study — desktop". Treat them as the source of truth for layout, spacing, copy structure and components.

Stack: Astro + TypeScript (strict), Tailwind CSS using CSS-variable design tokens, MDX content collections for projects, a single resume.json (JSON Resume schema) that renders /resume and a print-to-PDF version. Static deploy to Cloudflare Pages/Vercel. Contact form via Formspree with a honeypot field.

Pages: / (home), /projects, /projects/[slug] case studies, /resume, /services, /about, /contact (inquiry type: Job/Freelance/Other), /uses, themed 404 ("zsh: command not found").

Visual style — "readable terminal":
- Dark by default with a light mode; theme toggle button in the nav, respecting prefers-color-scheme on first visit.
- Fonts: JetBrains Mono for headings, nav, tags, buttons and labels; Geist for body text.
- Tokens (dark): bg #0B0F14, surface #111820, border #1F2A36, text #E6EDF3, muted #8B98A5, accent #7EE787, highlight #E3B341, text-on-accent #0B0F14.
- Tokens (light): bg #FAFAF7, surface #FFFFFF, border #E3E3DE, text #1B1F24, muted #5E6770, accent #1A7F37, highlight #9A6700, text-on-accent #FFFFFF.
- Section headings written as shell prompts, stack tags styled as --flags, screenshots inside minimal window frames (three dots + file-path title bar), footer styled as an editor status line.
- No fake-terminal-only navigation, no CRT effects; blinking cursors stop under prefers-reduced-motion.

Home page (from the mockup), top to bottom:
1. Nav: "~/yourname" logo; links projects, resume, services, about; theme toggle; "hire me" accent button.
2. Hero: amber availability badge ("Open to senior roles · Taking select freelance work"), H1 "Hi, I'm [Name]" with a blinking cursor, one-line value prop, buttons "./view-resume" (primary) and "start a project →" (ghost). Beside it, a terminal window card running `whoami` with role, focus, experience, based, status.
3. Stack strip of --flag tags.
4. "~/projects $ ls --featured": 3 project cards (window-frame screenshot, title, outcome, stack flags, "case study →" and "github" links) + "all projects →".
5. "~/experience $ git log --oneline": 3 roles (dates, role @ company, one impact line; current role marked HEAD) + "full resume (pdf) ↓".
6. "~/freelance $ cat services.txt": 3 numbered offering cards.
7. Contact band: "Let's build something.", reply-time line, "get in touch" + github + linkedin.
8. Status-line footer.

Mobile (below ~768px, from the phone mockup): single column; nav collapses to theme toggle + menu button; the menu opens a panel of "$ cd projects"-style links plus a full-width "hire me" button; primary buttons go full width; all tap targets at least 44px.

Case study template (from the mockup): "← cd ../projects" back link; "~/projects/<slug> $ cat README.md" line; H1 title + one-sentence summary; details box (role, timeline, team, live/github links); hero screenshot in a window frame; 3 result cards with big highlight-colored numbers; then numbered sections (## 01 … ## 06) at 720px reading width: The problem, My role, Approach (with an architecture diagram figure + caption), Key decisions (cards: decision → why and the trade-off), Results, Stack & links. End with prev/next project nav and a "Want something like this built?" call-to-action band. Drive all of it from MDX frontmatter + body so each project is one file.

Quality: Lighthouse 95+ mobile, WCAG AA contrast, keyboard accessible with visible focus, per-page meta + OG images, sitemap, JSON-LD Person schema, responsive from 360px.

Start with Phase 1 (foundation: project setup, tokens, fonts, layout, nav incl. mobile menu, footer, theme toggle, 404) using placeholder content, then pause so I can review before Phase 2.
```
