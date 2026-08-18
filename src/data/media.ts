/**
 * media.ts — the real photography. Keystone M6 / M7.
 *
 * THESE ARE REAL PHOTOGRAPHS OF REAL 3RD COAST JOBS, supplied by the owner.
 * That makes them the single strongest E-E-A-T asset the site has: a competitor
 * can copy every word on this site and cannot copy these.
 *
 * ALT TEXT IS WRITTEN FROM WHAT IS VISIBLE IN THE FRAME, judged by sight, never
 * from the filename (M6). The scaffold originally shipped alt text describing
 * "a commercial diver entering the water at the Port of Brownsville" for an image
 * that was a generated graphic — a small fabrication that would have ridden every
 * page's og:image. Everything below describes what is actually in the picture.
 *
 * WHAT IS DESCRIBED vs WHAT IS INFERRED. The alt text states what can be SEEN:
 * surface-supplied dive gear, an umbilical, a tender, a barge, a crawler crane,
 * sheet piles, the causeway. The `location` field is a best reading of the
 * background (the causeway in two frames is the Queen Isabella Causeway, which
 * places the work at Port Isabel / South Padre) and is flagged `locationConfirmed`
 * so nothing states it as fact on the page until the owner confirms it —
 * questionnaire Q27 asks exactly this.
 */

export type Photo = {
  slug: string;
  /** ≤125 chars, [what's shown] + [action/context] + [local]. */
  alt: string;
  /** Visible caption. May be empty. */
  caption: string;
  width: number;
  height: number;
  /** Best reading of where this was taken — NOT published until confirmed. */
  location: string;
  locationConfirmed: boolean;
  /** Service slugs this frame genuinely illustrates. Never used decoratively. */
  relevantTo: string[];
};

const base = '/photos';

export const photos: Record<string, Photo> = {
  diverEntry: {
    slug: 'diver-entry-port-isabel',
    alt: 'Commercial diver in surface-supplied gear stepping into the water beside a barge while a tender pays out the umbilical',
    caption:
      'Surface-supplied entry alongside a barge. The tender on the quay controls the umbilical throughout the dive — under 29 CFR 1910.425 the diver is continuously tended.',
    width: 1600,
    height: 1205,
    location: 'Port Isabel / Brazos Santiago — causeway visible in background',
    locationConfirmed: false,
    relevantTo: [
      'underwater-inspection',
      'marine-construction-support',
      'pile-dock-pier-inspection',
      'port-diving',
    ],
  },
  diverTender: {
    slug: 'diver-tender-crane-barge',
    alt: 'Diver in a band mask and tender in a life jacket on a barge deck, with a crawler crane and driven sheet piles behind',
    caption:
      'Dive crew working off a barge alongside a crawler crane and driven piles. Umbilical, comms and fins are laid out on deck ready for entry.',
    width: 1206,
    height: 1600,
    location: 'South Texas Gulf Coast marine construction site',
    locationConfirmed: false,
    relevantTo: [
      'marine-construction-support',
      'pile-dock-pier-inspection',
      'underwater-inspection',
      'port-diving',
    ],
  },
  bargeDusk: {
    slug: 'barge-crew-dusk-causeway',
    alt: 'Dive and construction crew on a barge at dusk with a long-reach excavator, concrete pile caps and a causeway behind',
    caption:
      'Working into the evening off the barge. Long-reach excavator, recovered concrete pile caps and salvaged steel on deck.',
    width: 1600,
    height: 1205,
    location: 'Port Isabel / South Padre — Queen Isabella Causeway in background',
    locationConfirmed: false,
    relevantTo: [
      'marine-construction-support',
      'marine-salvage',
      'pile-dock-pier-inspection',
      'underwater-survey',
    ],
  },
};

/** srcset-ready sources. 800w and 1600w variants exist for every photo. */
export const photoSrc = (p: Photo) => ({
  src: `${base}/${p.slug}-1600.webp`,
  srcset: `${base}/${p.slug}-800.webp 800w, ${base}/${p.slug}-1600.webp 1600w`,
});

/** Photos that genuinely illustrate a given service. Empty is a valid answer. */
export const photosFor = (serviceSlug: string): Photo[] =>
  Object.values(photos).filter((p) => p.relevantTo.includes(serviceSlug));

/** The shared brand mark. */
export const logo = {
  src: '/brand/logo-512.webp',
  fallback: '/brand/logo-512.png',
  alt: '3rd Coast Commercial Diving and Salvage emblem: a vintage dive helmet over an anchor, ringed by rope',
  width: 512,
  height: 512,
};
