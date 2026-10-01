/**
 * Runs after `astro build`. Serves dist/ with Astro's preview server and uses
 * Playwright (headless Chromium) to:
 *
 *   1. Screenshot each Open Graph template in dist/og-src/<key>.html to dist/og/<key>.png,
 *      then delete the templates so they never ship.
 *   2. Print /resume to dist/resume.pdf with the site's print stylesheet.
 *   3. Check the output: every page's og:image exists, and every indexable page
 *      is listed in sitemap.xml. Any problem fails the build.
 *
 * Needs Chromium once per machine: `npx playwright install chromium`.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { preview } from 'astro';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = path.join(root, 'dist');
const ogSrc = path.join(dist, 'og-src');
const ogOut = path.join(dist, 'og');
const PAPER = 'Letter';

const started = Date.now();
const log = (/** @type {string} */ message) => console.log(`[postbuild] ${message}`);

const server = await preview({ root, logLevel: 'warn', server: { host: '127.0.0.1', port: 4329 } });
const base = `http://127.0.0.1:${server.port}`;

let browser;
try {
  browser = await chromium.launch();
} catch (error) {
  await server.stop();
  console.error(
    '[postbuild] Could not start Chromium. Run `npx playwright install chromium` once, then build again.',
  );
  throw error;
}

try {
  // 1. Open Graph images
  // One template per page: dist/og-src/<key>.html (build.format: 'file').
  const keys = (await fs.readdir(ogSrc, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => entry.name.slice(0, -'.html'.length));
  await fs.mkdir(ogOut, { recursive: true });

  const ogPage = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    colorScheme: 'dark',
  });
  for (const key of keys) {
    await ogPage.goto(`${base}/og-src/${key}`, { waitUntil: 'networkidle' });
    await ogPage.evaluate(() => document.fonts.ready);
    await ogPage.screenshot({ path: path.join(ogOut, `${key}.png`) });
  }
  await fs.rm(ogSrc, { recursive: true });
  log(`og images: ${keys.length}`);

  // 2. Resume PDF, from the same page and print styles as /resume
  const resumePage = await browser.newPage();
  await resumePage.emulateMedia({ media: 'print', colorScheme: 'light' });
  await resumePage.goto(`${base}/resume`, { waitUntil: 'networkidle' });
  await resumePage.evaluate(() => document.fonts.ready);
  await resumePage.pdf({
    path: path.join(dist, 'resume.pdf'),
    format: PAPER,
    printBackground: true,
    // Margins come from the @page rule in global.css.
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });
  log(`resume.pdf (${PAPER})`);
} finally {
  await browser.close();
  await server.stop();
}

// 3. Checks
const problems = await checkOutput();
if (problems.length > 0) {
  console.error(`[postbuild] ${problems.length} problem(s):\n  - ${problems.join('\n  - ')}`);
  process.exit(1);
}
log(`checks passed in ${((Date.now() - started) / 1000).toFixed(1)}s`);

/** @returns {Promise<string[]>} */
async function checkOutput() {
  const problems = [];
  const sitemap = await fs.readFile(path.join(dist, 'sitemap.xml'), 'utf8');
  const listed = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));

  for (const file of await htmlFiles(dist)) {
    const html = await fs.readFile(file, 'utf8');
    const name = path.relative(dist, file);

    const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
    if (!ogImage) {
      problems.push(`${name}: no og:image`);
    } else {
      const image = path.join(dist, new URL(ogImage).pathname);
      if (!(await exists(image))) {
        problems.push(
          `${name}: og:image ${new URL(ogImage).pathname} missing (add it to src/lib/pages.ts)`,
        );
      }
    }

    const noindex = /<meta name="robots" content="noindex"/.test(html);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    if (!noindex && canonical && !listed.has(canonical)) {
      problems.push(`${name}: ${canonical} not in sitemap.xml (add it to src/lib/pages.ts)`);
    }
  }
  return problems;
}

/** @param {string} dir @returns {Promise<string[]>} */
async function htmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => path.join(entry.parentPath, entry.name));
}

/** @param {string} file */
async function exists(file) {
  return fs.access(file).then(
    () => true,
    () => false,
  );
}
