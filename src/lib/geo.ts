/**
 * geo.ts — the differentiator helper. Keystone Part 6.3.
 *
 * Two jobs:
 *
 * 1. TERRITORY GATE (B4). Territory is a hard filter (Part 14). Only tiers listed
 *    in CONFIRMED_TIERS may appear anywhere on the site — in `areaServed`, in copy,
 *    or as a route. Today that is `core` only: the Coastal Bend and upper coast are
 *    an ASSUMPTION drawn from the 713 phone number, not a confirmed capability, and
 *    publishing "we serve Galveston" for a business that will not mobilise there is
 *    a liability, not an SEO win. Confirming B4 is a one-line edit here.
 *
 * 2. CAPACITY GATE (Part 6.3). A location page is only routable when it is inside
 *    the confirmed territory AND `researched === true`. A thin geo page is worse
 *    than no geo page, so `getStaticPaths` reads `buildableLocations()` and an
 *    unresearched town physically cannot emit a page.
 *
 * The two gates are deliberately separate. A town can be inside the territory but
 * not yet researched (→ areaServed mention, no page). It can never be researched
 * but outside the territory (→ invisible entirely).
 */

import { locations, type Location, type Tier } from '../data/locations.ts';

/**
 * B4 — WIDEN ONLY ON WRITTEN OWNER CONFIRMATION.
 * Adding 'coastal-bend' / 'upper-coast' here is the single switch that brings
 * those 10 towns into areaServed and makes them eligible for pages.
 */
export const CONFIRMED_TIERS: readonly Tier[] = ['core'] as const;

export const isInTerritory = (l: Location): boolean => CONFIRMED_TIERS.includes(l.tier);

/** Every location we are permitted to mention at all. */
export const territoryLocations = (): Location[] =>
  locations.filter(isInTerritory).sort((a, b) => a.order - b.order);

/** Locations that may emit a page: in territory AND researched. Routes read this. */
export const buildableLocations = (): Location[] =>
  territoryLocations().filter((l) => l.researched);

/** In territory but not yet researched — earns an `areaServed` mention only. */
export const areaServedOnlyLocations = (): Location[] =>
  territoryLocations().filter((l) => !l.researched);

/** Names for the `areaServed` array in the entity graph. */
export const serviceAreaNames = (): string[] => territoryLocations().map((l) => l.name);

/** Staged but not yet permitted — surfaced by the pending report, never by a page. */
export const stagedLocations = (): Location[] => locations.filter((l) => !isInTerritory(l));

export const getLocation = (slug: string): Location | undefined =>
  locations.find((l) => l.slug === slug);

/**
 * Differentiator sentence fragments built from a location's verified data.
 *
 * This is the anti-slop engine (plan §7): copy derived from real channel depths,
 * named berths and actual vessel mix varies on its own, because the underlying
 * data varies. Returns an empty array when nothing is verified, so a caller can
 * never accidentally render "the  channel's  foot depth".
 */
export function differentiators(l: Location): string[] {
  const out: string[] = [];
  if (l.port) out.push(l.port);
  if (l.waterConditions.length) out.push(...l.waterConditions);
  if (l.vesselMix.length) out.push(`vessel mix: ${l.vesselMix.join(', ')}`);
  if (l.landmarks.length) out.push(...l.landmarks);
  if (l.industry.length) out.push(...l.industry);
  return out;
}

/** Distance phrasing, only when both fields are verified. */
export function distancePhrase(l: Location): string | null {
  if (l.distanceMi === null || !l.direction) return null;
  return `${l.distanceMi} miles ${l.direction} of the Port of Brownsville`;
}

/**
 * How much unique local material a location actually has. The capacity gate is a
 * judgement call the researcher makes, but this makes the call visible: a row
 * scoring 0–2 will not sustain 3,000 unique words no matter how it is written.
 */
export function researchDepth(l: Location): number {
  return (
    (l.port ? 1 : 0) +
    (l.geo ? 1 : 0) +
    (l.distanceMi !== null ? 1 : 0) +
    l.waterConditions.length +
    l.vesselMix.length +
    l.landmarks.length +
    l.industry.length
  );
}
