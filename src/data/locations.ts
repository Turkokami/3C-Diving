/**
 * locations.ts — the geo lattice.
 *
 * TERRITORY IS A HARD FILTER (Keystone Part 14). Blocker B4: the outer boundary
 * is assumed, not confirmed. Everything past `tier: 'core'` is staged and does
 * not build until the owner confirms mobilization reach.
 *
 * THE CAPACITY GATE (Part 6.3). A city page ships ONLY when `researched: true`
 * and the differentiator fields carry real, verified local data — enough to write
 * 3,000 unique words. Every field below is deliberately empty: none of it has been
 * verified yet, and inventing channel depths or berth names would be fabrication
 * (doctrine #6). Phase 3 research fills these; `getStaticPaths` filters on
 * `researched`, so an unresearched town CANNOT accidentally emit a thin page.
 * Unresearched towns get an `areaServed` mention only.
 */

export type Cluster = 'full' | 'triple' | 'single' | 'area';
export type Tier = 'core' | 'coastal-bend' | 'upper-coast';

export type Location = {
  slug: string;
  name: string;
  /** Named port/waterway entity, where the page's authority actually comes from */
  port: string | null;
  tier: Tier;
  cluster: Cluster;
  /** Capacity gate — false means NO page is generated. Never flip without real research. */
  researched: boolean;

  // ── Differentiator payload (Part 6.3) — fills in Phase 3, verified sources only ──
  distanceMi: number | null;
  direction: string | null;
  geo: { latitude: number; longitude: number } | null;
  /** e.g. project channel depth, tidal range, typical visibility, current */
  waterConditions: string[];
  /** e.g. container, bulk, LNG, shrimp fleet, layberth, tug and barge */
  vesselMix: string[];
  /** Real named berths, jetties, bridges, terminals, passes */
  landmarks: string[];
  /** Local industry that generates dive work */
  industry: string[];
  order: number;
};

/** Fresh arrays per row — a shared `as const` literal would alias every location's arrays. */
const blank = () => ({
  researched: false,
  distanceMi: null,
  direction: null,
  geo: null,
  waterConditions: [] as string[],
  vesselMix: [] as string[],
  landmarks: [] as string[],
  industry: [] as string[],
});

export const locations: Location[] = [
  // ── CORE · Deep South Texas (Phase 3a) — confirmed by the live site's own claims ──
  /**
   * RESEARCHED. Every value below is sourced in docs/RESEARCH-NOTES.md.
   *
   * NOTE THE CHANNEL DEPTH. The Brazos Island Harbor deepening completed
   * 25 June 2026: the main channel went 42 ft → 52 ft and the entrance and
   * jetty channels 44 ft → 54 ft. The buildout plan's own sample copy cites
   * "42-foot project depth" — that number is now stale, and repeating it would
   * mean being wrong about the single most basic fact of the home port.
   */
  {
    slug: 'port-of-brownsville',
    name: 'Port of Brownsville',
    port: 'Port of Brownsville',
    tier: 'core',
    cluster: 'full',
    order: 1,
    researched: true,
    distanceMi: 0,
    direction: 'at',
    geo: { latitude: 25.9509, longitude: -97.3987 },
    waterConditions: [
      '52 ft main channel project depth following the June 2026 Brazos Island Harbor deepening',
      '54 ft entrance and jetty channels at Brazos Santiago Pass',
      'third deepest port in Texas',
      'working commercial water — visibility varies with wind, tide and channel traffic',
    ],
    vesselMix: [
      'bulk carriers',
      'tankers',
      'LNG construction traffic',
      'tug and barge',
      'layberth and tow-in tonnage awaiting recycling',
      'offshore support vessels',
    ],
    landmarks: [
      'Brazos Santiago Pass',
      'the Brownsville Ship Channel',
      'SteelCoast ship recycling complex — roughly 4,000 ft of water frontage on the main channel',
      'Rio Grande LNG',
      'Texas LNG',
    ],
    industry: [
      'ship recycling — over 85% of US Navy and MARAD vessel recycling',
      'LNG export construction',
      'steel and scrap processing',
      'cross-border trade — the only deep-water port on the US–Mexico border',
      '28 million tons of cargo moved in FY2025',
    ],
  },
  {
    slug: 'brownsville',
    name: 'Brownsville',
    port: 'Port of Brownsville',
    tier: 'core',
    cluster: 'full',
    order: 2,
    researched: true,
    distanceMi: 5,
    direction: 'west of',
    geo: { latitude: 25.9017, longitude: -97.4975 },
    waterConditions: [
      'Brownsville Ship Channel runs east to the Laguna Madre and Brazos Santiago Pass',
      'silt-laden channel water — blackwater technique is routine, not exceptional',
    ],
    vesselMix: ['shrimp trawlers', 'tug and barge', 'workboats', 'commercial fishing fleet'],
    landmarks: ['the Brownsville Ship Channel turning basin', 'the shrimp basin'],
    industry: [
      'Brownsville–Port Isabel shrimp fleet — roughly 140 boats, second in the nation by value and volume of wild-caught shrimp',
      'the largest and most valuable commercial fishery in Texas',
      'marine services and fabrication',
    ],
  },
  { slug: 'port-isabel', name: 'Port Isabel', port: 'Port Isabel', tier: 'core', cluster: 'triple', order: 3, ...blank() },
  { slug: 'south-padre-island', name: 'South Padre Island', port: null, tier: 'core', cluster: 'triple', order: 4, ...blank() },
  { slug: 'brazos-santiago-pass', name: 'Brazos Santiago Pass', port: 'Brazos Santiago', tier: 'core', cluster: 'single', order: 5, ...blank() },
  { slug: 'harlingen', name: 'Harlingen', port: 'Port of Harlingen', tier: 'core', cluster: 'single', order: 6, ...blank() },
  { slug: 'los-fresnos', name: 'Los Fresnos', port: null, tier: 'core', cluster: 'area', order: 7, ...blank() },
  { slug: 'laguna-vista', name: 'Laguna Vista', port: null, tier: 'core', cluster: 'area', order: 8, ...blank() },

  // ── COASTAL BEND (Phase 3b) — BLOCKED on B4 territory confirmation ──
  { slug: 'corpus-christi', name: 'Corpus Christi', port: 'Port of Corpus Christi', tier: 'coastal-bend', cluster: 'full', order: 9, ...blank() },
  { slug: 'port-aransas', name: 'Port Aransas', port: null, tier: 'coastal-bend', cluster: 'triple', order: 10, ...blank() },
  { slug: 'ingleside', name: 'Ingleside', port: 'Ingleside Terminals', tier: 'coastal-bend', cluster: 'single', order: 11, ...blank() },
  { slug: 'aransas-pass', name: 'Aransas Pass', port: null, tier: 'coastal-bend', cluster: 'single', order: 12, ...blank() },
  { slug: 'rockport', name: 'Rockport', port: null, tier: 'coastal-bend', cluster: 'area', order: 13, ...blank() },
  { slug: 'harbor-island', name: 'Harbor Island', port: null, tier: 'coastal-bend', cluster: 'area', order: 14, ...blank() },

  // ── UPPER COAST (Phase 3b) — BLOCKED on B4. The 713 phone implies reach; confirm it. ──
  { slug: 'freeport', name: 'Freeport', port: 'Port Freeport', tier: 'upper-coast', cluster: 'triple', order: 15, ...blank() },
  { slug: 'texas-city', name: 'Texas City', port: 'Port of Texas City', tier: 'upper-coast', cluster: 'single', order: 16, ...blank() },
  { slug: 'galveston', name: 'Galveston', port: 'Port of Galveston', tier: 'upper-coast', cluster: 'triple', order: 17, ...blank() },
  { slug: 'houston-ship-channel', name: 'Houston Ship Channel', port: 'Port Houston', tier: 'upper-coast', cluster: 'full', order: 18, ...blank() },
];

/**
 * NOTE — routing helpers deliberately do NOT live here.
 *
 * This file is data only. `buildableLocations()` / `areaServedOnlyLocations()`
 * live in `src/lib/geo.ts`, because a location is only routable when it passes
 * BOTH gates: the capacity gate (`researched`) and the B4 territory gate
 * (`CONFIRMED_TIERS`). A helper defined here could only ever see the first of
 * those, so a route importing it would happily emit an upper-coast page for
 * territory the owner has not confirmed. Import from `lib/geo.ts`.
 */
