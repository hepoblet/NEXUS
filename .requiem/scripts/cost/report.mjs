#!/usr/bin/env node
// Reports token usage (and cost, when prices are configured) from the local ledger.
// Usage: node .requiem/scripts/cost/report.mjs            project totals, by feature
//        node .requiem/scripts/cost/report.mjs <feature>  one feature, by task / phase / agent / model
//        add --md for a Markdown report
import path from 'node:path';
import { projectRoot, readJson, readLedger, TOKEN_FIELDS } from './lib.mjs';

const args = process.argv.slice(2);
const markdown = args.includes('--md');
const feature = args.find((a) => !a.startsWith('--'));
const root = projectRoot();
const pricing = readJson(path.join(root, '.requiem', 'pricing.json'), {}).models || {};

// Prices are USD per million tokens. A model matches the first key contained in its name.
function priceFor(model) {
  const key = Object.keys(pricing).find((k) => String(model).includes(k));
  return key ? pricing[key] : null;
}

function costOf(row) {
  const price = priceFor(row.model);
  if (!price) return null;
  return TOKEN_FIELDS.reduce((sum, f) => sum + ((row[f] || 0) * (price[f] || 0)) / 1e6, 0);
}

function group(rows, keyOf) {
  const groups = new Map();
  for (const row of rows) {
    const key = keyOf(row) ?? '(none)';
    const g = groups.get(key) || { key, in: 0, out: 0, cache_read: 0, cache_write: 0, cost: 0, priced: true };
    for (const f of TOKEN_FIELDS) g[f] += row[f] || 0;
    const cost = costOf(row);
    if (cost === null) g.priced = false;
    else g.cost += cost;
    groups.set(key, g);
  }
  return [...groups.values()].sort((a, b) => total(b) - total(a));
}

const total = (g) => g.in + g.out + g.cache_read + g.cache_write;
const num = (n) => n.toLocaleString('en-US');
const usd = (g) => (g.priced ? `$${g.cost.toFixed(2)}` : 'n/a');
// Share of input-side tokens that were served from cache.
const cacheHit = (g) => {
  const input = g.in + g.cache_read + g.cache_write;
  return input ? `${Math.round((g.cache_read / input) * 100)}%` : '-';
};

function table(title, groups) {
  const head = [title, 'input', 'output', 'cache read', 'cache write', 'cache hit', 'cost'];
  const body = groups.map((g) => [
    String(g.key), num(g.in), num(g.out), num(g.cache_read), num(g.cache_write), cacheHit(g), usd(g),
  ]);
  if (markdown) {
    return [
      `| ${head.join(' | ')} |`,
      `|${head.map(() => '---').join('|')}|`,
      ...body.map((r) => `| ${r.join(' | ')} |`),
    ].join('\n');
  }
  const widths = head.map((h, i) => Math.max(h.length, ...body.map((r) => r[i].length)));
  const fmt = (r) => r.map((c, i) => (i === 0 ? c.padEnd(widths[i]) : c.padStart(widths[i]))).join('  ');
  return [fmt(head), ...body.map(fmt)].join('\n');
}

const all = readLedger(root);
const rows = feature ? all.filter((r) => r.feature === feature) : all;

if (!rows.length) {
  console.log(feature ? `No usage recorded for feature "${feature}".` : 'No usage recorded yet.');
  process.exit(0);
}

const h = (text) => (markdown ? `## ${text}` : `\n${text}`);
const out = [markdown ? `# Cost: ${feature || 'project'}` : `Cost: ${feature || 'project'}`];
out.push(h('Total'), table('scope', group(rows, () => feature || 'project')));
if (feature) {
  out.push(h('By task'), table('task', group(rows, (r) => r.task)));
  out.push(h('By phase'), table('phase', group(rows, (r) => r.phase)));
} else {
  out.push(h('By feature'), table('feature', group(rows, (r) => r.feature)));
}
out.push(h('By agent'), table('agent', group(rows, (r) => r.agent)));
out.push(h('By model'), table('model', group(rows, (r) => r.model)));
if (!Object.keys(pricing).length) {
  out.push('', 'Cost shows n/a: no prices configured in .requiem/pricing.json.');
}
console.log(out.join('\n'));
