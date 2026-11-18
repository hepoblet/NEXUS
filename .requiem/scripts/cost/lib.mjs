// Shared helpers for the cost ledger. No dependencies.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

export function projectRoot(fallback) {
  return process.env.CLAUDE_PROJECT_DIR || fallback || process.cwd();
}

// Per-checkout data: the active-feature marker. Each worktree has its own. Git-ignored.
export function dataDir(root) {
  return path.join(root, '.requiem', 'local');
}

// Shared data: ledger and read offsets. Lives in the main checkout so every worktree of the
// repo writes to the same ledger.
export function sharedDir(root) {
  try {
    const common = execFileSync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (common && path.basename(common) === '.git') return dataDir(path.dirname(common));
  } catch {
    // not a git repo, or git missing: fall back to the checkout itself
  }
  return dataDir(root);
}

export function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

export function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
}

export function readLedger(root) {
  const file = path.join(sharedDir(root), 'ledger.jsonl');
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

export const TOKEN_FIELDS = ['in', 'out', 'cache_read', 'cache_write'];
