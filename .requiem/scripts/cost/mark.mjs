#!/usr/bin/env node
// Sets what the session is working on, so recorded usage is attributed to it.
// Usage: node .requiem/scripts/cost/mark.mjs <phase> <feature> [task]
//        node .requiem/scripts/cost/mark.mjs clear
import fs from 'node:fs';
import path from 'node:path';
import { projectRoot, dataDir, writeJson } from './lib.mjs';

const [phase, feature, task] = process.argv.slice(2);
const file = path.join(dataDir(projectRoot()), 'current.json');

if (!phase || phase === 'clear') {
  fs.rmSync(file, { force: true });
  console.log('cost marker cleared');
} else if (!feature) {
  console.error('usage: mark.mjs <phase> <feature> [task] | clear');
  process.exit(1);
} else {
  writeJson(file, { phase, feature, task: task || null });
  console.log(`cost marker: ${phase} ${feature}${task ? ' ' + task : ''}`);
}
