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
 * Dynamic routes are handled by converting `[param]` segments to a regex, so
 * `/services/hull-cleaning/` resolves as soon as `src/pages/services/[service].astro`
 * exists. Whether that particular slug is actually emitted is a separate question
 * owned by `getStaticPaths` and the capacity gate — and the dead-link crawler in
 * `scripts/check-links.mjs` is the backstop that catches any disagreement, because
 * it reads `dist/` rather than the source tree.
 */

// Keys only — the modules are never evaluated, so this costs nothing at runtime.
const pageFiles = import.meta.glob('/src/pages/**/*.astro');

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

/** Routes with [param] segments, compiled to matchers. */
const dynamicMatchers = allRoutes
  .filter((r) => r.includes('['))
  .map((r) => {
    const pattern = r
      .replace(/[.*+?^${}()|\\]/g, '\\$&')
      .replace(/\[\.\.\.[^\]]+\]/g, '.+') // rest params
      .replace(/\[[^\]]+\]/g, '[^/]+');
    return new RegExp(`^${pattern}$`);
  });

/** Does a page exist that can serve this path? */
export function routeExists(href: string): boolean {
  const path = href.split('#')[0].split('?')[0];
  if (staticRoutes.has(path)) return true;
  return dynamicMatchers.some((re) => re.test(path));
}

/** Filter a nav list down to what is currently built. */
export function liveLinks<T extends { href: string }>(items: T[]): T[] {
  return items.filter((i) => routeExists(i.href));
}

/** For debugging / the build report. */
export const builtRoutes = () => [...staticRoutes].sort();
