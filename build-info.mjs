// Build-time provenance for the docs site footer. Resolves the commit this
// build was produced from, in priority order:
//   1. COMMIT_SHA / GITHUB_SHA from the environment — CI, or an explicit
//      `--build-arg COMMIT_SHA=...` (the iaas prod play can pass this).
//   2. the .git directory in the build context — Dokploy (dev/stg) builds the
//      Dockerfile from a git clone. We read HEAD/refs directly with fs so no
//      git binary is needed inside node:22-bookworm-slim, and .dockerignore
//      only ships the tiny ref files, not the object store.
//   3. the git CLI — local `pnpm build`.
//   4. 'dev' — nothing above was available.
// Evaluated once per build (ES module singleton), not per rendered page.
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const short = (sha) => sha.trim().slice(0, 7);

function fromEnv() {
  const sha = process.env.COMMIT_SHA || process.env.GITHUB_SHA;
  return sha ? short(sha) : null;
}

function fromGitDir() {
  try {
    const gitDir = join(ROOT, '.git');
    const head = readFileSync(join(gitDir, 'HEAD'), 'utf8').trim();
    if (!head.startsWith('ref:')) {
      return short(head); // detached HEAD holds the commit directly
    }
    const ref = head.slice(4).trim();
    try {
      return short(readFileSync(join(gitDir, ref), 'utf8'));
    } catch {
      const packed = readFileSync(join(gitDir, 'packed-refs'), 'utf8');
      for (const line of packed.split('\n')) {
        if (line.endsWith(` ${ref}`)) return short(line);
      }
      return null;
    }
  } catch {
    return null;
  }
}

function fromGitCli() {
  try {
    return execSync('git rev-parse --short HEAD', {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch {
    return null;
  }
}

export const COMMIT_SHA = fromEnv() ?? fromGitDir() ?? fromGitCli() ?? 'dev';
export const BUILD_DATE = new Date().toISOString().slice(0, 10);
