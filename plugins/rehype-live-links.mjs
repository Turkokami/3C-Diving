/**
 * rehype-live-links — unwraps internal links whose page has not been built yet.
 *
 * THE PROBLEM. `lib/routes.ts` keeps `.astro` components from linking to unbuilt
 * pages, but markdown has no access to it: a writer working on a spoke naturally
 * cross-links to the thirteen sibling spokes, and at any point mid-wave most of
 * those do not exist. The options were to forbid forward links (which guts the M3
 * wiring contract and forces a link-adding pass over every page at the end), or to
 * ship dead links (which fails the gate, correctly).
 *
 * THE FIX. At build time this walks the rendered HTML of every markdown page and,
 * for each internal href, checks whether a page actually exists to serve it. If
 * one does, the link is left alone. If not, the <a> is replaced by its own text
 * content — the sentence still reads correctly, and no dead link ships.
 *
 * The effect is that a writer links to the whole taxonomy freely, and each link
 * switches itself on the moment that page lands. No retro-fit pass, no registry to
 * maintain, and the dead-link crawler stays green throughout the build-out.
 *
 * Inventory is read from the filesystem rather than imported from lib/routes.ts,
 * because remark/rehype plugins are loaded by the Vite config before Astro's module
 * graph (and `import.meta.glob`) is available.
 */
import { readdirSync, existsSync, statSync } from 'node:fs';
import { join, extname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const PAGES = join(ROOT, 'src', 'pages');
const CONTENT = join(ROOT, 'src', 'content');

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

/** Build the route inventory fresh each build. */
function buildInventory() {
  const routes = new Set();

  // Static page files. Dynamic ([param]) files are skipped — their real inventory
  // comes from the content collections below, for the reason in lib/routes.ts.
  for (const file of walk(PAGES)) {
    if (extname(file) !== '.astro') continue;
    const rel = relative(PAGES, file).split(sep).join('/');
    if (rel.includes('[')) continue;
    let r = '/' + rel.replace(/\.astro$/, '').replace(/(^|\/)index$/, '');
    if (!r.endsWith('/')) r += '/';
    routes.add(r === '//' ? '/' : r);
  }

  // Content collections → the URL prefix their route file serves them under.
  const collectionPrefix = {
    services: '/services/',
    locations: '/locations/',
    compliance: '/compliance/',
    'marine-library': '/marine-library/',
    commercial: '/commercial/',
    'case-studies': '/case-studies/',
  };

  for (const [dir, prefix] of Object.entries(collectionPrefix)) {
    const base = join(CONTENT, dir);
    if (!existsSync(base)) continue;
    for (const file of walk(base)) {
      if (!/\.mdx?$/.test(file)) continue;
      const slug = relative(base, file)
        .split(sep)
        .join('/')
        .replace(/\.mdx?$/, '');
      routes.add(`${prefix}${slug}/`);
    }
  }

  return routes;
}

export function rehypeLiveLinks() {
  const routes = buildInventory();

  return (tree) => {
    visit(tree);

    function visit(node, parent, index) {
      if (node.type === 'element' && node.tagName === 'a' && parent) {
        const href = node.properties?.href;
        if (typeof href === 'string' && shouldUnwrap(href, routes)) {
          // Replace the <a> with its children — the prose survives, the link does not.
          parent.children.splice(index, 1, ...node.children);
          return;
        }
      }
      const children = node.children;
      if (!children) return;
      // Reverse order so in-place splices do not shift indices we have yet to visit.
      for (let i = children.length - 1; i >= 0; i--) visit(children[i], node, i);
    }
  };
}

function shouldUnwrap(href, routes) {
  if (/^(https?:|mailto:|tel:|#|\/\/)/i.test(href)) return false; // external or in-page
  if (!href.startsWith('/')) return false; // relative — not used in this build
  const path = href.split('#')[0].split('?')[0];
  if (/\.[a-z0-9]{2,5}$/i.test(path)) return false; // asset, not a page
  return !routes.has(path);
}

export default rehypeLiveLinks;
