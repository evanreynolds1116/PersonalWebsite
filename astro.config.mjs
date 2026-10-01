// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { readBuildInfo } from './config/build-info.mjs';

// https://astro.build/config
export default defineConfig({
  // Placeholder until the domain is decided (Phase 4). Used for canonical URLs and the sitemap.
  site: 'https://yourname.dev',
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
