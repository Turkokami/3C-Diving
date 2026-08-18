/**
 * business.ts — global constants for 3cdiving.com
 * Keystone v1, Part 15. THE single source of truth for every NAP / phone /
 * credential / social string on the site. Nothing below is hardcoded anywhere else.
 *
 * PENDING-CLIENT-INPUT PATTERN (Part 7A):
 * Fields the client still owes are `null`, never a placeholder string and never
 * invented. Every consumer guards on them; the page renders correctly without
 * them and lights up automatically once filled. Doctrine #6: never fabricate.
 *
 * Blockers B1-B4 from the buildout plan map to the four PENDING blocks below.
 */

export const SITE_URL = 'https://3cdiving.com' as const;

export const business = {
  // ── Identity ────────────────────────────────────────────────────────────
  name: '3rd Coast Commercial Diving & Salvage',
  shortName: '3rd Coast Diving',
  /** PENDING B1 — exact registered entity name (LLC / Inc.) for schema `legalName` */
  legalName: null as string | null,
  /** PENDING — founding year, drives `foundingDate` and "since YYYY" copy */
  foundingYear: null as number | null,
  tagline:
    'Commercial diving, underwater welding and marine salvage on the South Texas Gulf Coast.',

  // ── Contact ─────────────────────────────────────────────────────────────
  /**
   * PENDING B2 — which number is the NAP primary?
   * 713 is a Houston area code on a business positioned as local to Brownsville.
   * Recommendation: promote a 956 number to primary. Whatever is chosen must match
   * the GBP and every visible NAP character for character (Part 5.3).
   */
  phone: { display: '(713) 384-1954', href: 'tel:+17133841954', napPrimary: true },
  phoneSpanish: { display: '(956) 455-8476', href: 'tel:+19564558476' },
  /** P1-2 — recommend a domain mailbox; keep gmail as a forwarding alias */
  email: '3cdiving@gmail.com',

  // ── PENDING B1 · address + hours ────────────────────────────────────────
  // No PostalAddress node is emitted while this is null. `areaServed`-only
  // LocalBusiness is the documented fallback. This is the largest local-SEO gap.
  address: null as {
    streetAddress: string;
    addressLocality: string;
    addressRegion: 'TX';
    postalCode: string;
    addressCountry: 'US';
  } | null,
  geo: null as { latitude: number; longitude: number } | null,
  /** e.g. [{ days: ['Mo','Tu','We','Th','Fr'], opens: '07:00', closes: '17:00' }] */
  hours: null as Array<{ days: string[]; opens: string; closes: string }> | null,
  /** Emergency response is advertised on the live site — confirm 24/7 before claiming it */
  emergency247: null as boolean | null,

  // ── PENDING B3 · named expert + credentials ─────────────────────────────
  // Drives the Person node (#named-expert), `hasCredential`, and the
  // first-person named-expert block on all 107 pages. E-E-A-T is capped
  // at 2/5 until this is supplied. Nothing here is ever invented.
  namedExpert: null as {
    name: string;
    slug: string;
    jobTitle: string;
    bio: string;
    image: string;
  } | null,
  credentials: [] as Array<{
    name: string;
    issuer: string;
    identifier?: string;
    credentialCategory: string;
  }>,
  /** Highest-value trust token in this vertical — ABS / Lloyd's Register / DNV / BV / ClassNK */
  classSocietyApprovals: [] as string[],
  insurance: null as { marineLiability: boolean; jonesAct: boolean; note: string } | null,
  /** Surface-supplied capability, depth rating, vessel, spread — buyers ask for this */
  capability: null as {
    diveMode: string[];
    maxDepthFt: number;
    vessel: string | null;
    spread: string[];
  } | null,

  // ── PENDING · off-page entity ───────────────────────────────────────────
  /** No aggregateRating is emitted until a verified GBP exists. Never hand-entered. */
  gbpUrl: null as string | null,
  aggregateRating: null as { ratingValue: number; reviewCount: number } | null,
  /** `sameAs` — primary entity-disambiguation signal. Empty until profiles exist. */
  sameAs: [] as string[],

  // ── Brand assets (M7 — required on every page) ──────────────────────────
  /**
   * The real emblem, supplied by the owner: a pewter dive-helmet badge over an
   * anchor inside a rope ring. It replaced a placeholder wordmark SVG. Alt
   * describes the artwork rather than repeating the company name, because the
   * schema `logo` node is consumed by machines that already have the name.
   */
  logo: {
    src: '/brand/logo-512.png',
    alt: '3rd Coast Commercial Diving and Salvage emblem: a vintage dive helmet over an anchor, ringed by rope',
  },
  /**
   * M6 — alt describes what the image ACTUALLY shows, judged by sight.
   *
   * This is now built from a REAL PHOTOGRAPH of a 3rd Coast job (see
   * scripts/make-social-card.py): a diver in surface-supplied gear entering the
   * water beside a barge, under the brand charcoal wash with the pewter emblem.
   *
   * The scaffold originally shipped alt text describing "a diver entering the
   * water at the Port of Brownsville" for an image that did not exist — a small
   * fabrication baked into every page's og:image. It now describes a photograph
   * that does exist. The location is deliberately NOT asserted: the causeway in
   * the background reads as Queen Isabella, which would place it at Port Isabel,
   * but that is an inference and questionnaire Q27 asks the owner to confirm it.
   */
  socialImage: {
    src: '/brand/3rd-coast-social.jpg',
    alt: 'Commercial diver in surface-supplied gear entering the water beside a work barge, with 3rd Coast branding',
    width: 1200,
    height: 630,
  },

  // ── Territory (B4 — hard filter, Part 14) ───────────────────────────────
  primaryMarket: 'Brownsville, Texas',
  primaryPort: 'Port of Brownsville',
  areaServedSummary:
    'Brownsville, Port Isabel, South Padre Island and the South Texas Gulf Coast',
  languages: ['en', 'es'] as const,
} as const;

// ── Guards — import these instead of re-checking null at every call site ──

/**
 * THE NAP phone. Part 5.3 requires the phone in the schema graph to match the
 * visible phone character for character, so both read from this one function
 * rather than each picking a field. Flipping `napPrimary` in the block above
 * therefore moves the number everywhere at once — visible NAP, header, footer,
 * sticky call bar and the LocalBusiness node — with no chance of drift.
 * Resolving B2 is that one flag.
 */
export const napPhone = () =>
  business.phone.napPrimary ? business.phone : business.phoneSpanish;

export const hasAddress = () => business.address !== null;
export const hasNamedExpert = () => business.namedExpert !== null;
export const hasCredentials = () => business.credentials.length > 0;
/** Doctrine #6 — the ONLY gate that may allow rating markup onto the site. */
export const hasVerifiedRating = () =>
  business.gbpUrl !== null && business.aggregateRating !== null;

/** Every pending field, for the build-time "what does the client still owe" report. */
export const pendingFields = (): string[] =>
  [
    business.legalName === null && 'legalName (B1)',
    business.foundingYear === null && 'foundingYear',
    business.address === null && 'address (B1)',
    business.geo === null && 'geo (B1)',
    business.hours === null && 'hours (B1)',
    business.namedExpert === null && 'namedExpert (B3)',
    business.credentials.length === 0 && 'credentials (B3)',
    business.classSocietyApprovals.length === 0 && 'classSocietyApprovals (B3)',
    business.insurance === null && 'insurance (B3)',
    business.capability === null && 'capability',
    business.gbpUrl === null && 'gbpUrl (reviews)',
    business.sameAs.length === 0 && 'sameAs (social profiles)',
  ].filter(Boolean) as string[];
