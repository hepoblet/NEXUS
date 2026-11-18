#!/usr/bin/env node
// Copies Requiem's herdr-core agent templates into this machine's herdr-core config.
// Usage: node .requiem/scripts/herdr-templates.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const source = path.join(here, '..', 'herdr', 'templates');
const configHome =
  process.env.XDG_CONFIG_HOME ||
  (process.platform === 'win32' ? process.env.APPDATA : path.join(os.homedir(), '.config'));
const dest = path.join(configHome, 'herdr-core', 'templates');

fs.mkdirSync(dest, { recursive: true });
const files = fs.readdirSync(source).filter((f) => f.endsWith('.md'));
for (const file of files) fs.copyFileSync(path.join(source, file), path.join(dest, file));
console.log(`Templates installed in ${dest}:`);
for (const file of files) console.log(`  ${file}`);
