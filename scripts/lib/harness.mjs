/**
 * harness.mjs — shared plumbing for the verification scripts.
 *
 * Keystone Part 9 verifies at three layers: the source, the BUILT HTML, and the
 * deployed page. Everything in /scripts operates on layer 2 — `dist/` — because
 * that is what a crawler actually receives. Auditing the markdown source instead
 * is how a site passes its own checks and still ships broken.
 */
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative, sep } from 'node:path';
import { parse } from 'node-html-parser';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const DIST = join(ROOT, 'dist');

export function requireDist() {
  if (!existsSync(DIST)) {
    console.error('✗ dist/ not found. Run `npm run build` first.');
    process.exit(1);
  }
}

/** Every built HTML file, as { file, url, html, dom }. */
export async function loadPages() {
  requireDist();
  const files = [];
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (entry.name.endsWith('.html')) files.push(full);
    }
  }
  await walk(DIST);

  const pages = [];
  for (const file of files.sort()) {
    const html = await readFile(file, 'utf8');
    // dist/services/hull-cleaning/index.html  →  /services/hull-cleaning/
    const rel = relative(DIST, file).split(sep).join('/');
    const url = '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '/');
    pages.push({ file, rel, url, html, dom: parse(html) });
  }
  return pages;
}

/**
 * Sitewide chrome — everything that is NOT this page's own writing.
 *
 * Two checks depend on getting this list right:
 *
 *   WORD COUNT. Counting chrome would credit every page with the footer's service
 *   list, the nav and the CTA — several hundred words that are identical sitewide —
 *   and float every page toward the 3,000 floor without a word being written.
 *
 *   DUPLICATE SENTENCES. The CTA and related-links blocks render the same default
 *   copy on every page by design. Scanning them would report a duplicate-content
 *   failure on what is actually a correctly-working shared component, and the
 *   genuine template seams the scanner exists to find would be lost in the noise.
 *
 * `.cta` and `.related` sit INSIDE <main> (they belong there for readers and for
 * screen-reader flow), which is exactly why stripping by <main> alone is not enough.
 */
export const CHROME_SELECTORS = [
  'script',
  'style',
  'nav',
  'header',
  'footer',
  '.phonebar',
  '.crumbs',
  '.cta',
  '.related',
  '.build-note',
];

/** This page's own content, with all sitewide chrome removed. */
export function mainContent(dom) {
  const clone = parse(dom.toString());
  for (const sel of CHROME_SELECTORS) {
    for (const el of clone.querySelectorAll(sel)) el.remove();
  }
  return clone.querySelector('main') ?? clone;
}

/** Visible prose word count, chrome excluded. */
export function contentWords(dom) {
  const text = mainContent(dom).structuredText.replace(/\s+/g, ' ').trim();
  return text ? text.split(' ').length : 0;
}

/** JSON-LD graph on a page, parsed. Returns null if absent or unparseable. */
export function readGraph(dom) {
  const el = dom.querySelector('script[type="application/ld+json"]');
  if (!el) return null;
  try {
    return JSON.parse(el.rawText ?? el.text);
  } catch {
    return null;
  }
}

export function isIndexable(dom) {
  const robots = dom.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '';
  return !/noindex/i.test(robots);
}

// ── Reporting ─────────────────────────────────────────────────────────────

export class Report {
  constructor(name) {
    this.name = name;
    this.errors = [];
    this.warnings = [];
  }
  error(where, msg) {
    this.errors.push({ where, msg });
  }
  warn(where, msg) {
    this.warnings.push({ where, msg });
  }
  /** @returns {boolean} true when clean */
  finish({ exit = true } = {}) {
    const e = this.errors.length;
    const w = this.warnings.length;

    for (const { where, msg } of this.warnings) console.log(`  ⚠ ${where} — ${msg}`);
    for (const { where, msg } of this.errors) console.log(`  ✗ ${where} — ${msg}`);

    if (e === 0 && w === 0) console.log(`✓ ${this.name}: clean`);
    else console.log(`${e ? '✗' : '⚠'} ${this.name}: ${e} error(s), ${w} warning(s)`);

    if (exit && e > 0) process.exitCode = 1;
    return e === 0;
  }
}
