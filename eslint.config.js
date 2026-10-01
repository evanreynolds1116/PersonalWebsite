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
    // Config files run in Node at build time.
    files: ['*.{js,mjs}', 'config/**/*.mjs'],
    languageOptions: { globals: { process: 'readonly' } },
  },
]);
