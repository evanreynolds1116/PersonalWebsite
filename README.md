# Personal website

Source for my personal site: a portfolio, resume and freelance page for a software engineer, styled as a **readable terminal**. The terminal look is the flavor, not the interface: monospace headings and prompt-style labels on top of a clean, editorial layout that anyone can scan.

Built with [Astro](https://astro.build), TypeScript (strict) and [Tailwind CSS](https://tailwindcss.com) v4. Pages are static HTML, and JavaScript ships only for the theme toggle, the mobile menu and the 404 path.

> **Status: Phase 1 (foundation).** Layout, design tokens, fonts, nav with mobile menu, status-line footer, theme toggle and the 404 page are in place. Content is placeholder text in `[brackets]`. See [`docs/website-plan.md`](docs/website-plan.md) for the full plan and build phases.

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
├── astro.config.mjs        Astro config: fonts, Tailwind, build-info injection
├── config/
│   └── build-info.mjs      Reads branch + commit for the footer at build time (runs in Node)
├── docs/                   Planning docs and approved mockups (not part of the build)
├── public/                 Static files copied as-is (favicon)
└── src/
    ├── components/
    │   ├── Button.astro      Primary / ghost link-button (44px nav size, 48px content size)
    │   ├── Container.astro   The 1100px content column with phone/desktop gutters
    │   ├── Footer.astro      Editor status-line footer
    │   ├── Nav.astro         Header nav, plus the phone menu panel below 768px
    │   └── ThemeToggle.astro Dark/light toggle button
    ├── config/
    │   └── site.ts           Name, handle, city, nav links: edit this first
    ├── layouts/
    │   └── BaseLayout.astro  <head>, theme bootstrap, fonts, skip link, nav, footer
    ├── lib/
    │   └── theme.ts          Theme read/apply/persist helpers used by the toggle
    ├── pages/
    │   ├── index.astro       Home (placeholder until Phase 2)
    │   └── 404.astro         "zsh: command not found" page
    ├── styles/
    │   └── global.css        Design tokens, Tailwind theme mapping, base styles
    └── env.d.ts              Types for values injected at build time
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

## Editing placeholder content

Site-wide facts (name, handle, city, nav) live in [`src/config/site.ts`](src/config/site.ts). The production URL is the `site` field in `astro.config.mjs`. Page content arrives in Phase 2: projects as MDX content collections and the resume from a single `resume.json`.
