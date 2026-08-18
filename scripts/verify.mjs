/**
 * verify.mjs — the full harness. Runs between every content wave and before
 * every push (Keystone Part 9).
 *
 * Runs each check in a child process so one crashing check cannot mask the rest,
 * and so a single non-zero exit code represents the whole gate.
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const HERE = fileURLToPath(new URL('.', import.meta.url));

const checks = [
  ['Link integrity', 'check-links.mjs'],
  ['SEO audit', 'check-seo.mjs'],
  ['Schema validator', 'check-schema.mjs'],
  ['Word count', 'check-wordcount.mjs'],
  ['Duplicate content', 'check-duplicates.mjs'],
];

console.log('\n══ Keystone verification harness ' + '═'.repeat(36));

const failed = [];

for (const [name, script] of checks) {
  const res = spawnSync(process.execPath, [join(HERE, script)], {
    stdio: 'inherit',
    encoding: 'utf8',
  });
  if (res.status !== 0) failed.push(name);
}

// Informational, never fails the gate.
spawnSync(process.execPath, [join(HERE, 'pending-report.mjs')], { stdio: 'inherit' });

console.log('═'.repeat(68));
if (failed.length) {
  console.log(`✗ GATE FAILED — ${failed.join(', ')}`);
  process.exit(1);
}
console.log('✓ GATE PASSED — all checks clean');
