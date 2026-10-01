// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import { readBuildInfo } from './config/build-info.mjs';

/**
 * The production URL: canonical links, sitemap, share images and JSON-LD all use it.
 * Replace the placeholder once the domain is live.
 */
const SITE_URL = 'https://yourname.dev';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  // URLs have no trailing slash (/projects, not /projects/). Emitting projects.html rather than
  // projects/index.html makes Cloudflare Pages serve /projects directly instead of 308-redirecting
  // to /projects/, so links, canonical URLs and the sitemap all point at the served URL.
  build: { format: 'file' },
  trailingSlash: 'never',
  integrations: [mdx()],
  security: {
    // Astro hashes the site's own scripts and styles into a <meta> Content-Security-Policy.
    // External origins are listed explicitly; frame-ancestors lives in public/_headers
    // because browsers ignore it in a <meta> tag.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        // Cloudflare Web Analytics beacon, and the contact form's in-page submit.
        "connect-src 'self' https://cloudflareinsights.com https://formspree.io",
        "form-action 'self' https://formspree.io",
        "base-uri 'self'",
        "object-src 'none'",
      ],
      scriptDirective: {
        resources: ["'self'", 'https://static.cloudflareinsights.com'],
      },
    },
  },
  // Fonts are downloaded from Fontsource at build time and served from this site,
  // subset to Latin, with metric-matched fallbacks to avoid layout shift.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      weights: [400, 500, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Geist',
      cssVariable: '--font-geist',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
    define: {
      __BUILD_INFO__: JSON.stringify(readBuildInfo()),
    },
  },
});
