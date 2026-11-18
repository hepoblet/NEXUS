#!/usr/bin/env node
// Optional: exposes Requiem's skills to each CLI's native skill discovery.
// Copies .requiem/skills/* and .requiem/stack/skills/* into .claude/skills/ and .agents/skills/.
// Each copy ignores itself in git, and skills the project already has there are left alone.
// The source of truth stays under .requiem/. Re-run after a Requiem update.
// Usage: node .requiem/scripts/sync-skills.mjs
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sources = [path.join(root, '.requiem', 'skills'), path.join(root, '.requiem', 'stack', 'skills')];
const targets = [path.join(root, '.claude', 'skills'), path.join(root, '.agents', 'skills')];
const MARKER = '.requiem-synced';

const skills = [];
for (const source of sources) {
  if (!fs.existsSync(source)) continue;
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const dir = path.join(source, entry.name);
    if (entry.isDirectory() && fs.existsSync(path.join(dir, 'SKILL.md'))) skills.push({ name: entry.name, dir });
  }
}
if (!skills.length) {
  console.error('No skills found under .requiem/. Run this from a project where Requiem is installed.');
  process.exit(1);
}

for (const target of targets) {
  fs.mkdirSync(target, { recursive: true });
  // Drop copies from an earlier sync that no longer exist in the source.
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    const dir = path.join(target, entry.name);
    if (entry.isDirectory() && fs.existsSync(path.join(dir, MARKER)) && !skills.some((s) => s.name === entry.name)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
  const skipped = [];
  for (const skill of skills) {
    const dest = path.join(target, skill.name);
    if (fs.existsSync(dest) && !fs.existsSync(path.join(dest, MARKER))) {
      skipped.push(skill.name); // the project owns a skill with this name
      continue;
    }
    fs.rmSync(dest, { recursive: true, force: true });
    fs.cpSync(skill.dir, dest, { recursive: true });
    fs.writeFileSync(path.join(dest, MARKER), 'Copied by Requiem sync-skills. Edit the source under .requiem/ instead.\n');
    fs.writeFileSync(path.join(dest, '.gitignore'), '*\n');
  }
  console.log(`${path.relative(root, target)}: ${skills.length - skipped.length} skills synced`);
  if (skipped.length) console.log(`  left alone (owned by the project): ${skipped.join(', ')}`);
}
