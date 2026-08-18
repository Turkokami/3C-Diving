/**
 * check-duplicates.mjs — the anti-slop scanner. Part 9 harness item 3.
 *
 * Two distinct failures at 107 pages:
 *
 *   REPEATED SENTENCES — any 10+ word sentence appearing on 3 or more pages is a
 *   template seam. It is the single clearest signal that a fan-out wave stopped
 *   researching and started reskinning, and it is what "unique content" actually
 *   means in the M1 band.
 *
 *   REPEATED H2s — Part 12.1 cannibalisation. Two pages competing on the same
 *   heading are two pages competing for the same intent, which is the defect the
 *   one-intent-one-URL rule exists to prevent. Flagged across the set, not within.
 *
 * Boilerplate is excluded by counting only <main>, minus nav/header/footer.
 */
import { loadPages, Report, isIndexable, contentWords } from './lib/harness.mjs';
import { parse } from 'node-html-parser';

const SENTENCE_MIN_WORDS = 10;
const PAGE_THRESHOLD = 3;

const report = new Report('Duplicate content');
const pages = (await loadPages()).filter((p) => isIndexable(p.dom));

const sentenceMap = new Map(); // sentence → Set(url)
const h2Map = new Map(); // heading → Set(url)

function mainText(dom) {
  const clone = parse(dom.toString());
  for (const sel of ['script', 'style', 'nav', 'header', 'footer', '.phonebar', '.crumbs']) {
    for (const el of clone.querySelectorAll(sel)) el.remove();
  }
  return clone.querySelector('main') ?? clone;
}

for (const { dom, url } of pages) {
  const main = mainText(dom);

  const text = main.structuredText.replace(/\s+/g, ' ').trim();
  for (const raw of text.split(/(?<=[.!?])\s+/)) {
    const s = raw.trim();
    if (s.split(' ').length < SENTENCE_MIN_WORDS) continue;
    if (!sentenceMap.has(s)) sentenceMap.set(s, new Set());
    sentenceMap.get(s).add(url);
  }

  for (const h of main.querySelectorAll('h2')) {
    const t = h.structuredText.trim().toLowerCase();
    if (!t) continue;
    if (!h2Map.has(t)) h2Map.set(t, new Set());
    h2Map.get(t).add(url);
  }
}

for (const [sentence, urls] of sentenceMap) {
  if (urls.size >= PAGE_THRESHOLD) {
    report.error(
      `${urls.size} pages`,
      `repeated sentence: "${sentence.slice(0, 90)}${sentence.length > 90 ? '…' : ''}"`
    );
  }
}

/**
 * H2 reuse is a warning, not an error. Some repetition is legitimate and
 * expected — "Frequently asked questions" is the same heading everywhere by
 * design. Genuine cannibalisation is a repeated TOPIC heading, which a human
 * reading this list spots immediately.
 */
const ALLOWED_H2 = new Set(['frequently asked questions', 'what we do', 'where we work', 'try one of these', 'how to reach us']);

for (const [heading, urls] of h2Map) {
  if (urls.size >= PAGE_THRESHOLD && !ALLOWED_H2.has(heading)) {
    report.warn(`${urls.size} pages`, `repeated H2 "${heading}" — check for cannibalisation`);
  }
}

console.log(`\nDuplicate content — ${pages.length} indexable page(s)`);
report.finish();
