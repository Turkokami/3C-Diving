// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import { SITE_URL } from './src/data/business.ts';

/**
 * Keystone Part 7A — static output, near-zero JS.
 *
 * trailingSlash 'always' + build.format 'directory' matches vercel.json
 * (`"trailingSlash": true`) so the canonical URL, the internal href and the
 * URL the server actually serves are the same string. A mismatch here is the
 * cheapest way to manufacture a sitewide redirect chain (Part 12.1).
 *
 * The sitemap is generated from the ROUTES ASTRO ACTUALLY BUILT, not from a
 * hand-maintained list. It therefore cannot drift out of sync with the site as
 * pages are added wave by wave, which is the failure the plan's "self-growing
 * sitemap" requirement is guarding against.
 */
export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  integrations: [
    sitemap({
      // Nothing noindex ships yet; this filter is the single choke point when it does.
      filter: (page) => !page.includes('/404'),
      changefreq: 'monthly',
      lastmod: new Date(),
    }),
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  compressHTML: true,
});
