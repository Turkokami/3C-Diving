/**
 * content.config.ts — collection schemas.
 *
 * Page BODIES live in markdown; page CONTRACT lives in typed frontmatter. The
 * schema is the enforcement point: a writer physically cannot ship a page with a
 * 71-character title or a missing Quick Answer, because the build fails at the
 * collection boundary before the page is ever rendered.
 *
 * This is deliberately stricter than the runtime needs. At 107 pages across
 * multiple writing waves, the difference between "the auditor will catch it" and
 * "it cannot be committed" is several rounds of rework.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Shared contract for every written page. Mirrors CONTENT_BRIEF.md §4. */
const pageContract = {
  /** M5: ≤60 chars, unique sitewide, city front-loaded. */
  title: z.string().max(60, 'Title must be ≤60 characters (M5)'),

  /** The H1. Distinct from the title tag — the title sells the click, the H1 confirms it. */
  h1: z.string(),

  /**
   * The Quick Answer, 40–60 words (M2/M4).
   * Sentence one must stand alone at 110–165 chars: BaseLayout derives the meta
   * description from it. See CONTENT_BRIEF.md §4.
   */
  answer: z
    .string()
    .refine((s) => {
      const w = s.trim().split(/\s+/).length;
      return w >= 40 && w <= 60;
    }, 'Quick Answer must be 40–60 words (M2)'),

  /** Override the derived description only when the derivation reads badly. */
  description: z.string().min(110).max(165).optional(),

  /** 5–8 entries. Renders the visible FAQ AND becomes the FAQPage node — one source. */
  faqs: z
    .array(z.object({ question: z.string(), answer: z.string() }))
    .min(3, 'Every page needs an FAQ block (P0-8)'),

  /** CTA market name. A Port Isabel page says Port Isabel. */
  market: z.string().optional(),

  order: z.number().default(99),

  datePublished: z.string().optional(),
  dateModified: z.string().optional(),
};

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    ...pageContract,
    /** Must match a slug in src/data/services.ts — checked by scripts/check-content.mjs. */
    serviceSlug: z.string(),
    /** Short label for cards and nav. */
    shortName: z.string(),
    /** Drives the Service node's serviceType. */
    serviceType: z.string().optional(),
    ctaVariant: z.enum(['default', 'emergency']).default('default'),
  }),
});

export const collections = { services };
