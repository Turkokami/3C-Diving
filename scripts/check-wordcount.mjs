/**
 * check-wordcount.mjs — the depth floor. Part 9 harness item 4, defect P0-2.
 *
 * M1 mandates 3,000–5,000 words PER INDEXABLE PAGE. The live site had ~700–900
 * across the entire site — the floor missed by roughly 99%.
 *
 * Boilerplate is stripped before counting (see contentWords in lib/harness.mjs):
 * nav, header and footer are identical sitewide, and counting them would credit
 * every page with several hundred words it did not write. Counting what is unique
 * is the whole point of the gate.
 *
 * PHASE-AWARE. Phase 1 ships a foundation route that is deliberately short — its
 * job is to prove the graph deploys, not to hold 3,000 words. Pages listed in
 * FOUNDATION_EXEMPT report their count but do not fail the build. The exemption
 * list must be EMPTY by the Phase 2 acceptance gate.
 */
import { loadPages, Report, isIndexable, contentWords } from './lib/harness.mjs';

const MIN = 3000;
const MAX = 5000;

/** Phase 1 only. Every entry here is a page that has not been written yet. */
const FOUNDATION_EXEMPT = new Set(['/', '/404/']);

const report = new Report('Word count');
const pages = await loadPages();

const rows = [];

for (const { dom, url } of pages) {
  if (!isIndexable(dom)) continue;
  const words = contentWords(dom);
  const exempt = FOUNDATION_EXEMPT.has(url);
  rows.push({ url, words, exempt });

  if (exempt) continue;
  if (words < MIN) report.error(url, `${words} words (floor ${MIN}) — thin page, do not ship`);
  else if (words > MAX) report.warn(url, `${words} words (ceiling ${MAX}) — consider splitting`);
}

console.log(`\nWord count — ${rows.length} indexable page(s)`);
for (const r of rows.sort((a, b) => a.words - b.words)) {
  const flag = r.exempt ? 'foundation (exempt)' : r.words < MIN ? 'THIN' : 'ok';
  console.log(`  ${String(r.words).padStart(6)}  ${r.url}  ${flag}`);
}

if (FOUNDATION_EXEMPT.size) {
  console.log(
    `\n  Note: ${FOUNDATION_EXEMPT.size} page(s) exempt as Phase 1 foundation routes.` +
      '\n  This list must be empty before the Phase 2 acceptance gate passes.'
  );
}

report.finish();
