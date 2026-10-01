// Branch and commit for the footer status line, resolved once when Astro loads its config.
// Lives outside src/ because it runs in Node at build time, not in the site.
import { execSync } from 'node:child_process';

/** @param {string} args */
function git(args) {
  try {
    return execSync(`git ${args}`, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return undefined;
  }
}

/**
 * Prefers the variables set by Cloudflare Pages and Vercel (their build checkouts
 * can be detached), then local git, then placeholders.
 * @returns {{ branch: string, commit: string }}
 */
export function readBuildInfo() {
  const env = process.env;
  const sha = env.CF_PAGES_COMMIT_SHA ?? env.VERCEL_GIT_COMMIT_SHA ?? git('rev-parse HEAD');
  const branch =
    env.CF_PAGES_BRANCH ?? env.VERCEL_GIT_COMMIT_REF ?? git('rev-parse --abbrev-ref HEAD');

  return {
    branch: branch && branch !== 'HEAD' ? branch : 'main',
    commit: sha ? sha.slice(0, 7) : 'dev',
  };
}
