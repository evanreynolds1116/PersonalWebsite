// @ts-check
import js from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist/', '.astro/', 'node_modules/', 'docs/']),
  js.configs.recommended,
  tseslint.configs.strict,
  eslintPluginAstro.configs.recommended,
  eslintPluginAstro.configs['jsx-a11y-recommended'],
  {
    // TypeScript (via `astro check`) already reports undefined names, including
    // globals declared in src/env.d.ts; no-undef can't see those declarations.
    files: ['**/*.{ts,astro}'],
    rules: { 'no-undef': 'off' },
  },
  {
    // Config and build scripts run in Node; page.evaluate() callbacks in scripts run in the browser.
    files: ['*.{js,mjs}', 'config/**/*.mjs', 'scripts/**/*.mjs'],
    languageOptions: {
      globals: { process: 'readonly', console: 'readonly', URL: 'readonly', document: 'readonly' },
    },
  },
]);
