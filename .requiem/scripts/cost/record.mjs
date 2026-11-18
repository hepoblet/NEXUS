#!/usr/bin/env node
// Stop / SubagentStop hook. Reads the hook payload on stdin, sums the token usage added to the
// transcript since the last run, and appends it to .requiem/local/ledger.jsonl tagged with the active
// feature, task and phase (see mark.mjs). Stores tokens, never prices.
// A telemetry hook must never block the session: every failure exits 0 silently.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { projectRoot, dataDir, sharedDir, readJson, writeJson } from './lib.mjs';

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function main() {
  const payload = JSON.parse(readStdin() || '{}');
  const isSubagent = payload.hook_event_name === 'SubagentStop';
  const transcript = isSubagent
    ? payload.agent_transcript_path || payload.transcript_path
    : payload.transcript_path;
  if (!transcript || !fs.existsSync(transcript)) return;

  const root = projectRoot(payload.cwd);
  const shared = sharedDir(root);
  // One state file per transcript, so parallel sessions never overwrite each other's offsets.
  const key = crypto.createHash('sha1').update(transcript).digest('hex').slice(0, 16);
  const stateFile = path.join(shared, 'state', `${key}.json`);
  const seen = readJson(stateFile, { lines: 0, lastId: null });

  const lines = fs.readFileSync(transcript, 'utf8').split('\n').filter(Boolean);
  const fresh = lines.slice(seen.lines);
  // A separate subagent transcript belongs to that agent. In the main transcript, entries flagged
  // as sidechain come from subagents (older layouts keep them inline).
  const ownAgent = isSubagent && payload.agent_transcript_path
    ? payload.agent_type || 'subagent'
    : 'orchestrator';

  const totals = new Map();
  let lastId = seen.lastId;
  for (const line of fresh) {
    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }
    const message = entry.message;
    const usage = message && message.usage;
    if (entry.type !== 'assistant' || !usage) continue;
    // One API response can span several transcript lines with the same id and usage.
    if (message.id && message.id === lastId) continue;
    lastId = message.id || lastId;

    const agent = ownAgent === 'orchestrator' && entry.isSidechain ? 'subagent' : ownAgent;
    const model = message.model || 'unknown';
    const key = `${agent}\u0000${model}`;
    const sum = totals.get(key) || { agent, model, in: 0, out: 0, cache_read: 0, cache_write: 0 };
    sum.in += usage.input_tokens || 0;
    sum.out += usage.output_tokens || 0;
    sum.cache_read += usage.cache_read_input_tokens || 0;
    sum.cache_write += usage.cache_creation_input_tokens || 0;
    totals.set(key, sum);
  }

  writeJson(stateFile, { lines: lines.length, lastId });

  const current = readJson(path.join(dataDir(root), 'current.json'), {});
  const rows = [...totals.values()]
    .filter((s) => s.in + s.out + s.cache_read + s.cache_write > 0)
    .map((s) =>
      JSON.stringify({
        ts: new Date().toISOString(),
        session: payload.session_id || null,
        feature: current.feature || null,
        task: current.task || null,
        phase: current.phase || null,
        ...s,
      }),
    );
  if (rows.length) {
    fs.mkdirSync(shared, { recursive: true });
    fs.appendFileSync(path.join(shared, 'ledger.jsonl'), rows.join('\n') + '\n');
  }
}

try {
  main();
} catch {
  // never block the session
}
process.exit(0);
