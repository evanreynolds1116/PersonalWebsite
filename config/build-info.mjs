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
 * Prefers BUILD_BRANCH / BUILD_COMMIT, which CI sets explicitly (a pull-request
 * checkout is a detached merge commit, so git alone would report the wrong thing),
 * then local git, then placeholders.
 * @returns {{ branch: string, commit: string }}
 */
export function readBuildInfo() {
  const env = process.env;
  const sha = env.BUILD_COMMIT || git('rev-parse HEAD');
  const branch = env.BUILD_BRANCH || git('rev-parse --abbrev-ref HEAD');

  return {
    branch: branch && branch !== 'HEAD' ? branch : 'main',
    commit: sha ? sha.slice(0, 7) : 'dev',
  };
}
