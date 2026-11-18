#!/usr/bin/env node
// Manages git worktrees with Requiem's convention: .worktrees/<feature> on feat/<feature>,
// branched from BRANCH_DEV in requiem.config.
// Usage: node .requiem/scripts/worktree.mjs add <feature> | remove <feature> | list
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const DIR = '.worktrees';
const [action = 'list', feature] = process.argv.slice(2);

function git(args, { quiet = false } = {}) {
  const result = spawnSync('git', args, { encoding: 'utf8', stdio: quiet ? 'pipe' : 'inherit' });
  return { ok: result.status === 0, out: (result.stdout || '').trim() };
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function configValue(key) {
  try {
    const line = fs
      .readFileSync('requiem.config', 'utf8')
      .split('\n')
      .find((l) => l.startsWith(`${key}=`));
    return line ? line.slice(key.length + 1).trim() : '';
  } catch {
    return '';
  }
}

const top = git(['rev-parse', '--show-toplevel'], { quiet: true });
if (!top.ok) fail('Not inside a git repository.');
process.chdir(top.out);

if (action === 'list') {
  git(['worktree', 'list']);
} else if (action === 'add') {
  if (!feature) fail('usage: worktree.mjs add <feature>');
  if (!git(['check-ignore', '-q', `${DIR}/`], { quiet: true }).ok) {
    fail(`${DIR}/ is not git-ignored; add it to .gitignore first.`);
  }
  const base = configValue('BRANCH_DEV');
  let start = 'HEAD';
  if (base) {
    git(['fetch', '-q', 'origin', base], { quiet: true });
    if (git(['rev-parse', '-q', '--verify', `origin/${base}`], { quiet: true }).ok) start = `origin/${base}`;
  }
  if (start === 'HEAD') console.error(`Branch ${base || '(BRANCH_DEV not set)'} not found on origin; branching from HEAD.`);
  const branch = `feat/${feature}`;
  const target = path.join(DIR, feature);
  const exists = git(['rev-parse', '-q', '--verify', `refs/heads/${branch}`], { quiet: true }).ok;
  const added = exists
    ? git(['worktree', 'add', target, branch])
    : git(['worktree', 'add', target, '-b', branch, start]);
  if (!added.ok) process.exit(1);
  console.log(`Worktree ready at ${path.join(top.out, target)} on ${branch}`);
} else if (action === 'remove') {
  if (!feature) fail('usage: worktree.mjs remove <feature>');
  // No --force: git refuses when there is uncommitted work, which is what we want.
  if (!git(['worktree', 'remove', path.join(DIR, feature)]).ok) process.exit(1);
  git(['worktree', 'prune']);
  console.log(`Worktree ${DIR}/${feature} removed. Branch feat/${feature} was kept.`);
} else {
  fail('usage: worktree.mjs add <feature> | remove <feature> | list');
}
