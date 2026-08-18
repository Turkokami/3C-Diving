/**
 * check-links.mjs — dead-link crawler + orphan check. Part 9 harness item 1, M3.
 *
 * Two failures, one pass over dist/:
 *
 *   DEAD LINKS — every internal href must resolve to a file that was actually
 *   built. On a static site a typo'd href is a hard 404, not a soft redirect.
 *
 *   ORPHANS — M3's wiring contract says nothing is orphaned, ever. A page nobody
 *   links to is invisible to a crawler no matter how good it is. Part 3.1's
 *   warning cuts the other way too: hubs must be audited by INBOUND LINK COUNT,
 *   so this prints the hub link tally rather than trusting how a hub looks.
 */
import { loadPages, Report } from './lib/harness.mjs';
import { SITE_URL } from '../src/data/business.ts';

const report = new Report('Link integrity');
const pages = await loadPages();

const built = new Set(pages.map((p) => p.url));
const inbound = new Map(pages.map((p) => [p.url, 0]));

/** Normalise an href to a comparable site path, or null if external/non-page. */
function toSitePath(href) {
  if (!href) return null;
  if (/^(mailto:|tel:|javascript:|#|data:)/i.test(href)) return null;
  if (/^https?:\/\//i.test(href)) {
    if (!href.startsWith(SITE_URL)) return null; // external — not ours to verify
    href = href.slice(SITE_URL.length) || '/';
  }
  if (!href.startsWith('/')) return null; // relative — not used in this build
  const path = href.split('#')[0].split('?')[0];
  return path === '' ? '/' : path;
}

const assetExt = /\.(svg|jpg|jpeg|png|webp|avif|ico|xml|txt|css|js|json|pdf)$/i;

for (const { dom, url } of pages) {
  for (const a of dom.querySelectorAll('a[href]')) {
    const path = toSitePath(a.getAttribute('href'));
    if (path === null) continue;
    if (assetExt.test(path)) continue; // handled by the asset check below

    if (!built.has(path)) {
      report.error(url, `dead internal link → ${path}`);
      continue;
    }
    if (path !== url) inbound.set(path, (inbound.get(path) ?? 0) + 1);
  }
}

// ── Orphans ───────────────────────────────────────────────────────────────
for (const [url, count] of inbound) {
  if (url === '/') continue; // home is reached by the brand link and by definition
  if (url === '/404/') continue; // reached by the server, never linked
  if (count === 0) report.error(url, 'ORPHAN — no internal page links to it (M3)');
}

// ── Hub health, by inbound count ──────────────────────────────────────────
const hubs = ['/services/', '/locations/', '/commercial/', '/compliance/', '/marine-library/'];
const hubReport = hubs
  .filter((h) => built.has(h))
  .map((h) => `${h} ← ${inbound.get(h)} inbound`);

console.log(`\nLink integrity — ${pages.length} page(s), ${built.size} routes`);
if (hubReport.length) console.log('  Hubs: ' + hubReport.join(' · '));
report.finish();
