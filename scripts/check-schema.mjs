/**
 * check-schema.mjs — the schema validator. Keystone Part 9, harness item 6.
 *
 * Parses the RENDERED JSON-LD out of dist/ and asserts the graph is real,
 * connected and node-complete. Reading `lib/schema.ts` instead would prove only
 * that the source compiles, which is not the failure mode: Part 12.3's "JSON-LD
 * renders as visible escaped text" produces a perfectly valid source module and a
 * page with no machine-readable graph at all.
 *
 * Asserts:
 *   - exactly one ld+json script per page (single emitter — no duplicate nodes)
 *   - it parses as JSON
 *   - required nodes present
 *   - every internal { "@id": … } reference resolves to a node in the same graph
 *   - exactly one FAQPage per URL
 *   - DOCTRINE #6: no aggregateRating / Review anywhere while the GBP is unverified
 */
import { loadPages, Report, isIndexable } from './lib/harness.mjs';
import { business } from '../src/data/business.ts';

const report = new Report('Schema validator');
const pages = await loadPages();

const gbpVerified = business.gbpUrl !== null && business.aggregateRating !== null;

for (const { dom, url } of pages) {
  const scripts = dom.querySelectorAll('script[type="application/ld+json"]');

  if (scripts.length === 0) {
    report.error(url, 'no JSON-LD script');
    continue;
  }
  if (scripts.length > 1) {
    report.error(url, `${scripts.length} JSON-LD scripts — there must be exactly one emitter`);
  }

  let data;
  try {
    data = JSON.parse(scripts[0].rawText ?? scripts[0].text);
  } catch (err) {
    report.error(url, `JSON-LD does not parse: ${err.message}`);
    continue;
  }

  const graph = data['@graph'];
  if (!Array.isArray(graph)) {
    report.error(url, 'no @graph array');
    continue;
  }

  const typesOf = (n) => (Array.isArray(n['@type']) ? n['@type'] : [n['@type']]);
  const has = (t) => graph.some((n) => typesOf(n).includes(t));

  // ── Required nodes ──────────────────────────────────────────────────────
  for (const required of ['WebSite', 'WebPage', 'ImageObject', 'LocalBusiness', 'BreadcrumbList']) {
    if (!has(required)) report.error(url, `missing ${required} node`);
  }

  // ── Exactly one FAQPage ─────────────────────────────────────────────────
  const faqCount = graph.filter((n) => typesOf(n).includes('FAQPage')).length;
  if (faqCount > 1) report.error(url, `${faqCount} FAQPage nodes (max 1 per URL)`);
  if (faqCount === 0 && isIndexable(dom)) {
    report.warn(url, 'no FAQPage node — every indexable page should carry an FAQ (P0-8)');
  }

  // ── No duplicate @ids ───────────────────────────────────────────────────
  const ids = graph.map((n) => n['@id']).filter(Boolean);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  for (const d of new Set(dupes)) report.error(url, `duplicate @id in graph: ${d}`);

  // ── Referential integrity: every {@id} reference resolves ───────────────
  const known = new Set(ids);
  const dangling = new Set();
  (function walk(node) {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== 'object') return;
    const keys = Object.keys(node);
    // A bare { "@id": "..." } with no other keys is a REFERENCE, not a definition.
    if (keys.length === 1 && keys[0] === '@id' && !known.has(node['@id'])) {
      dangling.add(node['@id']);
    }
    for (const [k, v] of Object.entries(node)) {
      if (k !== '@id') walk(v);
    }
  })(graph);
  for (const d of dangling) report.error(url, `dangling @id reference (nothing defines it): ${d}`);

  // ── Doctrine #6 hard gate ───────────────────────────────────────────────
  if (!gbpVerified) {
    const raw = JSON.stringify(graph);
    if (/"aggregateRating"/.test(raw)) {
      report.error(url, 'aggregateRating present with no verified GBP — doctrine #6 violation');
    }
    if (/"@type":\s*"Review"/.test(raw) || /"reviewRating"/.test(raw)) {
      report.error(url, 'Review markup present with no verified reviews — doctrine #6 violation');
    }
  }

  // ── No hollow values ────────────────────────────────────────────────────
  const rawGraph = JSON.stringify(graph);
  if (/:\s*null/.test(rawGraph)) {
    report.error(url, 'graph contains a null value — pending fields must be omitted, not nulled');
  }
  if (/"(TBD|TODO|PENDING|XXX|Lorem)"/i.test(rawGraph)) {
    report.error(url, 'graph contains a placeholder string');
  }
}

console.log(`\nSchema validator — ${pages.length} page(s)`);
if (!gbpVerified) {
  console.log('  · GBP unverified → rating markup is hard-blocked (expected at this phase)');
}
report.finish();
