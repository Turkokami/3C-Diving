/**
 * routes.ts — what actually exists, computed from the filesystem.
 *
 * THE PROBLEM THIS SOLVES. The site is built in waves: the header and footer are
 * written once, in Phase 1, but they point at services, locations, compliance and
 * about pages that do not land until Phases 2–5. Shipping those links early gives
 * every page on the site a fistful of hard 404s, which is worse than not linking
 * at all — and it is exactly what the dead-link crawler is there to catch.
 *
 * The usual fix is a hand-maintained "which sections are live yet" flag list, which
 * is one more thing to forget to update. Instead this reads the route files
 * themselves via `import.meta.glob`, so a link becomes live the moment its page
 * file is created and never before. There is nothing to remember.
 *
 * DYNAMIC ROUTES RESOLVE AGAINST CONTENT, NOT AGAINST THE ROUTE PATTERN.
 *
 * This is the subtle part. `src/pages/services/[...slug].astro` is a single route
 * file that matches every path under `/services/`, so testing a path against the
 * PATTERN would report that all fourteen spokes exist the moment the first one is
 * written — and the site would ship thirteen dead links from the home page.
 *
 * So a dynamic route's real inventory is read from the source of truth that
 * `getStaticPaths` itself uses: the content collection files on disk. A spoke
 * becomes linkable exactly when its markdown lands, and not one build earlier.
 *
 * `scripts/check-links.mjs` remains the backstop, because it reads `dist/` rather
 * than the source tree and so catches any disagreement between the two.
 */

// Keys only — the modules are never evaluated, so this costs nothing at runtime.
const pageFiles = import.meta.glob('/src/pages/**/*.astro');

/**
 * Content-collection inventories. Each entry maps a collection's files to the URL
 * prefix its route file serves them under. Add a line here when a new collection
 * gets a route — locations, compliance, marine-library and the rest.
 */
const contentRoutes = new Set<string>(
  Object.keys(import.meta.glob('/src/content/services/*.md')).map(
    (f) => `/services/${f.split('/').pop().replace(/\.md$/, '')}/`
  )
);

/** '/src/pages/services/[service].astro' → '/services/[service]/' */
function fileToRoute(file: string): string {
  let r = file.replace('/src/pages', '').replace(/\.astro$/, '');
  r = r.replace(/\/index$/, '');
  if (!r.endsWith('/')) r += '/';
  return r === '' ? '/' : r;
}

const allRoutes = Object.keys(pageFiles).map(fileToRoute);

/** Routes with no [param] — exact matches. */
const staticRoutes = new Set(allRoutes.filter((r) => !r.includes('[')));

/**
 * Does a page exist that can serve this path?
 *
 * Deliberately does NOT pattern-match dynamic route files — see the header note.
 * A path under a dynamic route counts as existing only when the content file
 * backing it is present.
 */
export function routeExists(href: string): boolean {
  const path = href.split('#')[0].split('?')[0];
  return staticRoutes.has(path) || contentRoutes.has(path);
}

/** Filter a nav list down to what is currently built. */
export function liveLinks<T extends { href: string }>(items: T[]): T[] {
  return items.filter((i) => routeExists(i.href));
}

/** For debugging / the build report. */
export const builtRoutes = () => [...staticRoutes, ...contentRoutes].sort();
