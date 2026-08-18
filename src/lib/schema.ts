/**
 * schema.ts — the hand-built entity graph. Keystone v1 Part 5.1.
 *
 * ONE EMITTER. There is no SEO plugin on a static build, so the duplicate-node
 * defect that dominates the WordPress portfolio cannot occur here by construction.
 * `BaseLayout` calls `buildGraph()` exactly once per page and prints the result
 * into a real <script type="application/ld+json"> element.
 *
 * DOCTRINE #6 IS ENFORCED IN CODE, NOT BY DISCIPLINE.
 * Every node that depends on a PENDING field is assembled behind a guard:
 *   - no `address` / `geo`      → no PostalAddress, no GeoCoordinates          (B1)
 *   - no verified GBP           → no aggregateRating, no Review, ever          (doctrine #6)
 *   - no named expert           → no Person node, no `hasCredential`           (B3)
 *   - no social profiles        → `sameAs` omitted rather than emitted empty
 * A property that would be null, empty or invented is DROPPED from the JSON,
 * never emitted as null and never filled with a placeholder. `prune()` below is
 * the single mechanism that guarantees this.
 *
 * ENTITY IDENTITY. One business entity, one @id: `#localbusiness`. LocalBusiness
 * is already a subtype of Organization, so a second Organization node describing
 * the same company would be an @id collision dressed up as thoroughness — the
 * exact defect Part 12.1 warns about. The single node serves as `publisher`,
 * `provider` and `about` throughout.
 */

import {
  business,
  SITE_URL,
  hasAddress,
  hasNamedExpert,
  hasCredentials,
  hasVerifiedRating,
  napPhone,
} from '../data/business.ts';
import { serviceAreaNames } from './geo.ts';

// ─────────────────────────────────────────────────────────────────────────────
// URL helpers — every @id and every url in the graph flows through these, so
// the graph physically cannot disagree with the canonical tag about slashes.
// ─────────────────────────────────────────────────────────────────────────────

/** Absolute, trailing-slashed URL for a site path. `absUrl('/services')` → `https://3cdiving.com/services/` */
export function absUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  let p = path.startsWith('/') ? path : `/${path}`;
  // Files keep their extension; directories always get a trailing slash.
  const isFile = /\.[a-z0-9]{2,5}$/i.test(p);
  if (!isFile && !p.endsWith('/')) p = `${p}/`;
  return `${SITE_URL}${p}`;
}

/** Stable node ids. Kept in one place so nothing hand-types an @id string. */
export const ID = {
  website: `${SITE_URL}/#website`,
  business: `${SITE_URL}/#localbusiness`,
  logo: `${SITE_URL}/#/schema/image/logo`,
  social: `${SITE_URL}/#/schema/image/social`,
  expert: `${SITE_URL}/#named-expert`,
  webpage: (path: string) => `${absUrl(path)}#webpage`,
  breadcrumb: (path: string) => `${absUrl(path)}#breadcrumb`,
  faq: (path: string) => `${absUrl(path)}#faq`,
  primary: (path: string) => `${absUrl(path)}#primary-entity`,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// prune — the doctrine #6 enforcement point.
// Recursively strips undefined, null, empty strings, empty arrays and empty
// objects. A guarded field that resolves to nothing therefore disappears from
// the emitted JSON instead of shipping as `"address": null`, which validators
// read as a real but broken claim.
// ─────────────────────────────────────────────────────────────────────────────

type Json = string | number | boolean | Json[] | { [k: string]: Json };

function prune<T>(value: T): T {
  if (Array.isArray(value)) {
    const out = value.map(prune).filter((v) => v !== undefined);
    return out as unknown as T;
  }
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const cleaned = prune(v);
      if (cleaned === undefined || cleaned === null) continue;
      if (typeof cleaned === 'string' && cleaned.trim() === '') continue;
      if (Array.isArray(cleaned) && cleaned.length === 0) continue;
      if (
        typeof cleaned === 'object' &&
        !Array.isArray(cleaned) &&
        Object.keys(cleaned as object).length === 0
      ) {
        continue;
      }
      out[k] = cleaned;
    }
    return out as unknown as T;
  }
  return value;
}

// ─────────────────────────────────────────────────────────────────────────────
// Node builders
// ─────────────────────────────────────────────────────────────────────────────

function imageNodes() {
  return [
    {
      '@type': 'ImageObject',
      '@id': ID.logo,
      url: absUrl(business.logo.src),
      contentUrl: absUrl(business.logo.src),
      caption: business.logo.alt,
      inLanguage: 'en-US',
    },
    {
      '@type': 'ImageObject',
      '@id': ID.social,
      url: absUrl(business.socialImage.src),
      contentUrl: absUrl(business.socialImage.src),
      caption: business.socialImage.alt,
      width: business.socialImage.width,
      height: business.socialImage.height,
      inLanguage: 'en-US',
    },
  ];
}

function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': ID.website,
    url: `${SITE_URL}/`,
    name: business.name,
    description: business.tagline,
    publisher: { '@id': ID.business },
    inLanguage: 'en-US',
  };
}

/**
 * The business entity. Everything below `telephone` is conditional — this is the
 * node that B1/B3 light up. It renders as a valid, honest, if thinner entity today
 * and gains PostalAddress, GeoCoordinates, opening hours, credentials and sameAs
 * automatically the moment `business.ts` is filled in. No page needs re-editing.
 */
function businessNode() {
  // Same function the visible NAP renders from — Part 5.3 character-for-character.
  const nap = napPhone();

  return {
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': ID.business,
    name: business.name,
    alternateName: business.shortName,
    legalName: business.legalName ?? undefined, // PENDING B1
    url: `${SITE_URL}/`,
    description: business.tagline,
    telephone: nap.display,
    email: business.email,
    image: { '@id': ID.social },
    logo: { '@id': ID.logo },

    // PENDING B1 — omitted entirely rather than emitted hollow.
    address: hasAddress()
      ? {
          '@type': 'PostalAddress',
          streetAddress: business.address!.streetAddress,
          addressLocality: business.address!.addressLocality,
          addressRegion: business.address!.addressRegion,
          postalCode: business.address!.postalCode,
          addressCountry: business.address!.addressCountry,
        }
      : undefined,
    geo: business.geo
      ? {
          '@type': 'GeoCoordinates',
          latitude: business.geo.latitude,
          longitude: business.geo.longitude,
        }
      : undefined,
    openingHoursSpecification: business.hours
      ? business.hours.map((h) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: h.days,
          opens: h.opens,
          closes: h.closes,
        }))
      : undefined,

    foundingDate: business.foundingYear ? String(business.foundingYear) : undefined,

    // areaServed is the fallback local signal while B1 is open, and stays useful after.
    areaServed: areaServedNodes(),
    knowsLanguage: ['en-US', 'es-US'],
    availableLanguage: ['English', 'Spanish'],

    // PENDING — empty array is pruned, so `sameAs` is absent rather than [].
    sameAs: [...business.sameAs],

    /**
     * DOCTRINE #6 HARD GATE. `hasVerifiedRating()` requires BOTH a real GBP URL
     * and a real rating object. There is no other path to rating markup in this
     * codebase, and self-serving aggregateRating is exactly the defect that gets
     * rich results revoked. Stars come from the Google Business Profile.
     */
    aggregateRating: hasVerifiedRating()
      ? {
          '@type': 'AggregateRating',
          ratingValue: business.aggregateRating!.ratingValue,
          reviewCount: business.aggregateRating!.reviewCount,
        }
      : undefined,

    employee: hasNamedExpert() ? { '@id': ID.expert } : undefined,
  };
}

/**
 * areaServed from the geo lattice, filtered by the B4 territory gate.
 *
 * Towns that are in territory but not yet researched still appear here — that is
 * precisely the documented fallback for an unbuilt city page. Towns OUTSIDE the
 * confirmed territory never appear, because claiming coverage we have not
 * confirmed is a liability rather than a ranking signal.
 */
function areaServedNodes() {
  return [
    { '@type': 'Place', name: business.areaServedSummary },
    ...serviceAreaNames().map((name) => ({ '@type': 'Place', name })),
  ];
}

/** PENDING B3. Absent until a real, named, credentialed human is supplied. */
function expertNode() {
  if (!hasNamedExpert()) return null;
  const e = business.namedExpert!;
  return {
    '@type': 'Person',
    '@id': ID.expert,
    name: e.name,
    jobTitle: e.jobTitle,
    description: e.bio,
    image: e.image ? absUrl(e.image) : undefined,
    url: absUrl(`/${e.slug}`),
    worksFor: { '@id': ID.business },
    // Real credential numbers only. An empty array prunes away.
    hasCredential: hasCredentials()
      ? business.credentials.map((c) => ({
          '@type': 'EducationalOccupationalCredential',
          name: c.name,
          credentialCategory: c.credentialCategory,
          identifier: c.identifier,
          recognizedBy: { '@type': 'Organization', name: c.issuer },
        }))
      : undefined,
  };
}

function breadcrumbNode(path: string, crumbs: Crumb[]) {
  if (!crumbs.length) return null;
  return {
    '@type': 'BreadcrumbList',
    '@id': ID.breadcrumb(path),
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absUrl(c.href),
    })),
  };
}

/** Exactly one FAQPage per URL — the schema validator asserts this. */
function faqNode(path: string, faqs: Faq[]) {
  if (!faqs.length) return null;
  return {
    '@type': 'FAQPage',
    '@id': ID.faq(path),
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

/**
 * Node 5 — Service on money pages and verticals, Article on library and
 * compliance pages. Compliance pages additionally carry `citation` pointing at
 * the real CFR / class-society source (plan §5).
 */
function primaryEntityNode(path: string, entity: PrimaryEntity | undefined, title: string) {
  if (!entity) return null;
  const id = ID.primary(path);

  if (entity.kind === 'service') {
    return {
      '@type': 'Service',
      '@id': id,
      name: entity.name,
      description: entity.description,
      serviceType: entity.serviceType ?? entity.name,
      provider: { '@id': ID.business },
      areaServed: areaServedNodes(),
      url: absUrl(path),
      mainEntityOfPage: { '@id': ID.webpage(path) },
    };
  }

  return {
    '@type': 'Article',
    '@id': id,
    headline: entity.name || title,
    description: entity.description,
    author: hasNamedExpert() ? { '@id': ID.expert } : { '@id': ID.business },
    publisher: { '@id': ID.business },
    image: { '@id': ID.social },
    mainEntityOfPage: { '@id': ID.webpage(path) },
    datePublished: entity.datePublished,
    dateModified: entity.dateModified ?? entity.datePublished,
    // T8 contract: a compliance page states its source.
    citation: entity.citations?.map((c) => ({
      '@type': 'CreativeWork',
      name: c.name,
      url: c.url,
    })),
  };
}

function webPageNode(input: GraphInput, hasFaq: boolean, hasCrumbs: boolean, hasPrimary: boolean) {
  const { path, title, description } = input;
  return {
    '@type': 'WebPage',
    '@id': ID.webpage(path),
    url: absUrl(path),
    name: title,
    description,
    isPartOf: { '@id': ID.website },
    about: { '@id': ID.business },
    primaryImageOfPage: { '@id': ID.social },
    breadcrumb: hasCrumbs ? { '@id': ID.breadcrumb(path) } : undefined,
    mainEntity: hasPrimary
      ? { '@id': ID.primary(path) }
      : hasFaq
        ? { '@id': ID.faq(path) }
        : undefined,
    inLanguage: input.lang === 'es' ? 'es-US' : 'en-US',
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    /**
     * M4 — the Quick Answer is the Speakable target. Same 40–60 words that the
     * AnswerBox renders and that the meta description reuses, so the answer a
     * voice assistant reads is the answer a human sees.
     */
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.answer-box', 'h1'],
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────────────────────────────────────

export type Crumb = { name: string; href: string };
export type Faq = { question: string; answer: string };

export type PrimaryEntity =
  | { kind: 'service'; name: string; description: string; serviceType?: string }
  | {
      kind: 'article';
      name: string;
      description: string;
      datePublished?: string;
      dateModified?: string;
      citations?: { name: string; url: string }[];
    };

export type GraphInput = {
  /** Site-relative path, e.g. '/services/hull-cleaning/'. Normalised by absUrl. */
  path: string;
  title: string;
  description: string;
  crumbs?: Crumb[];
  faqs?: Faq[];
  entity?: PrimaryEntity;
  lang?: 'en' | 'es';
  datePublished?: string;
  dateModified?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// buildGraph — the single entry point BaseLayout calls.
// ─────────────────────────────────────────────────────────────────────────────

export function buildGraph(input: GraphInput) {
  const { path, crumbs = [], faqs = [], entity } = input;

  const breadcrumb = breadcrumbNode(path, crumbs);
  const faq = faqNode(path, faqs);
  const primary = primaryEntityNode(path, entity, input.title);
  const expert = expertNode();

  const graph = [
    websiteNode(),
    webPageNode(input, Boolean(faq), Boolean(breadcrumb), Boolean(primary)),
    ...imageNodes(),
    businessNode(),
    primary,
    faq,
    breadcrumb,
    expert,
  ].filter(Boolean);

  return prune({ '@context': 'https://schema.org', '@graph': graph });
}

/**
 * Serialise for injection into a real <script> element.
 *
 * `</script>` appearing inside any string value would close the element early and
 * dump the rest of the graph into the DOM as markup, so `<` is escaped to its
 * JSON unicode form. This is valid JSON-LD, parses identically, and is the
 * correct fix — the failure catalog's "JSON-LD renders as visible escaped text"
 * comes from the opposite mistake: putting set:html on a pseudo-element instead
 * of a genuine <script type="application/ld+json">.
 */
export function serialiseGraph(graph: unknown): string {
  return JSON.stringify(graph).replace(/</g, '\\u003c');
}
