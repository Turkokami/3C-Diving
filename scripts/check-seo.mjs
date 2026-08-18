/**
 * check-seo.mjs — per-page on-page audit. Keystone Part 9, harness item 2.
 *
 * Directly enforces the defects the Phase 0 audit found:
 *   P0-3  title ≤60 chars AND unique sitewide (the live site shipped 91 chars)
 *   P0-8  a Quick Answer block exists on every indexable page
 *   M6    every image carries alt text
 *   12.3  meta description never ends mid-word ("dangling ending" validator)
 */
import { loadPages, Report, isIndexable } from './lib/harness.mjs';

const TITLE_MAX = 60;
const DESC_MIN = 110;
const DESC_MAX = 165;

const report = new Report('SEO audit');
const pages = await loadPages();

const titles = new Map();
const descriptions = new Map();

for (const page of pages) {
  const { dom, url } = page;
  const indexable = isIndexable(dom);

  // ── Title ───────────────────────────────────────────────────────────────
  const title = dom.querySelector('title')?.structuredText?.trim() ?? '';
  if (!title) {
    report.error(url, 'no <title>');
  } else {
    if (title.length > TITLE_MAX) {
      report.error(url, `title ${title.length} chars (max ${TITLE_MAX}): "${title}"`);
    }
    if (indexable) {
      if (titles.has(title)) {
        report.error(url, `duplicate title, also on ${titles.get(title)}`);
      } else {
        titles.set(title, url);
      }
    }
  }

  // ── Meta description ────────────────────────────────────────────────────
  const desc = dom.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() ?? '';
  if (!desc) {
    report.error(url, 'no meta description');
  } else {
    if (desc.length < DESC_MIN || desc.length > DESC_MAX) {
      report.warn(url, `description ${desc.length} chars (want ${DESC_MIN}–${DESC_MAX})`);
    }
    /**
     * The dangling-ending check. A description that stops without terminal
     * punctuation was almost always produced by a character-count truncation
     * and reads as a sentence cut in half in the SERP.
     */
    if (!/[.!?]$/.test(desc)) {
      report.error(url, `description does not end on terminal punctuation: "…${desc.slice(-42)}"`);
    }
    if (indexable) {
      if (descriptions.has(desc)) {
        report.error(url, `duplicate description, also on ${descriptions.get(desc)}`);
      } else {
        descriptions.set(desc, url);
      }
    }
  }

  // ── Headings ────────────────────────────────────────────────────────────
  const h1s = dom.querySelectorAll('h1');
  if (h1s.length === 0) report.error(url, 'no <h1>');
  if (h1s.length > 1) report.error(url, `${h1s.length} <h1> elements (must be exactly 1)`);

  // ── Canonical ───────────────────────────────────────────────────────────
  const canonical = dom.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
  if (!canonical) {
    report.error(url, 'no canonical');
  } else {
    if (!canonical.startsWith('https://')) report.error(url, `canonical not absolute https: ${canonical}`);
    // A canonical whose slash does not match the served URL manufactures a
    // sitewide redirect chain. Cheap to check, expensive to miss.
    if (!canonical.endsWith('/') && !/\.[a-z0-9]{2,5}$/i.test(canonical)) {
      report.error(url, `canonical missing trailing slash: ${canonical}`);
    }
  }

  // ── Open Graph ──────────────────────────────────────────────────────────
  for (const prop of ['og:title', 'og:description', 'og:url', 'og:image']) {
    if (!dom.querySelector(`meta[property="${prop}"]`)) report.error(url, `missing ${prop}`);
  }

  // ── Images (M6) ─────────────────────────────────────────────────────────
  for (const img of dom.querySelectorAll('img')) {
    const alt = img.getAttribute('alt');
    if (alt === null) report.error(url, `<img> without alt: ${img.getAttribute('src') ?? '?'}`);
    else if (alt.trim() !== '' && alt.length > 125) {
      report.warn(url, `alt ${alt.length} chars (max 125): "${alt.slice(0, 50)}…"`);
    }
  }

  // ── AEO layer (P0-8) ────────────────────────────────────────────────────
  if (indexable) {
    const box = dom.querySelector('.answer-box .answer-text');
    if (!box) {
      report.error(url, 'no Quick Answer block (.answer-box)');
    } else {
      const words = box.structuredText.trim().split(/\s+/).length;
      if (words < 40 || words > 60) {
        report.warn(url, `Quick Answer ${words} words (want 40–60)`);
      }
    }
  }
}

console.log(`\nSEO audit — ${pages.length} page(s)`);
report.finish();
