/**
 * services.ts — the 14 money spokes.
 * Every entry is derived from a claim already made on the live 3cdiving.com site.
 * NO service is invented (Keystone Part 14: never invent services or verticals).
 *
 * `rolledUp` lists capabilities the live site mentions that are folded INTO this
 * spoke rather than given their own URL — each is too thin to hold 3,000 unique
 * words alone, and a thin page is worse than no page (Part 6.3).
 */

export type Service = {
  slug: string;
  name: string;
  /** ≤60 chars, city front-loaded, unique sitewide (M5) */
  title: string;
  /** Short internal note on intent — not rendered */
  intent: string;
  rolledUp: string[];
  /** Problem micro pages hanging off this spoke (T3) */
  problems: { slug: string; name: string }[];
  /** Related marine-library topics, for lateral wiring (M3) */
  library: string[];
  order: number;
};

export const services: Service[] = [
  {
    slug: 'underwater-inspection',
    name: 'Underwater Inspection',
    title: 'Underwater Inspection Brownsville TX | 3rd Coast Diving',
    intent: 'GOLD-STANDARD EXEMPLAR PAGE — written by hand first, all writers match it.',
    rolledUp: ['general hull inspections', 'damage inspection and reporting', 'steel and structural inspection support'],
    problems: [
      { slug: 'hull-damage-after-grounding', name: 'What to do after a grounding or hard contact' },
      { slug: 'pre-purchase-hull-survey', name: 'Pre-purchase underwater hull survey' },
    ],
    library: ['steel-wastage-and-pitting', 'uwild-photo-video-standards'],
    order: 1,
  },
  {
    slug: 'underwater-welding',
    name: 'Underwater Welding & Cutting',
    title: 'Underwater Welding Brownsville TX | Wet Weld Repair Support',
    intent: 'Highest-value search term in the vertical. Wet welding + cutting support.',
    rolledUp: ['underwater weld repair support', 'hull repair support'],
    problems: [
      { slug: 'crack-in-hull-plate', name: 'Cracked hull plate: temporary vs permanent repair' },
      { slug: 'wet-weld-vs-drydock', name: 'When a wet weld is acceptable and when it is not' },
    ],
    library: ['weld-porosity-and-classes'],
    order: 2,
  },
  {
    slug: 'hull-cleaning',
    name: 'Hull Cleaning',
    title: 'Hull Cleaning Brownsville TX | In-Water Hull Grooming',
    intent: 'Recurring-revenue service. Fuel-efficiency and VGP angle.',
    rolledUp: [],
    problems: [
      { slug: 'fuel-burn-from-hull-fouling', name: 'How hull fouling raises fuel burn' },
      { slug: 'hull-cleaning-frequency', name: 'How often a Gulf Coast hull needs cleaning' },
    ],
    library: ['biofouling-and-hull-roughness', 'barnacle-mussel-growth-texas-coast', 'vgp-invasive-species'],
    order: 3,
  },
  {
    slug: 'propeller-services',
    name: 'Propeller Clearing, Inspection & Polishing',
    title: 'Propeller Polishing & Clearing Brownsville TX | Divers',
    intent: 'Fouled-prop emergencies convert fast. Pair with the rope-cut problem page.',
    rolledUp: ['propeller clearing', 'propeller inspection', 'propeller polishing'],
    problems: [
      { slug: 'rope-or-net-in-propeller', name: 'Rope or net wrapped in the propeller' },
      { slug: 'vibration-after-prop-strike', name: 'Vibration after a suspected prop strike' },
    ],
    library: ['propeller-cavitation-and-rope-damage'],
    order: 4,
  },
  {
    slug: 'anode-replacement',
    name: 'Anode Replacement & Cathodic Protection',
    title: 'Anode Replacement Brownsville TX | Cathodic Protection',
    intent: 'Scheduled maintenance. Ties to the corrosion library cluster.',
    rolledUp: [],
    problems: [{ slug: 'anodes-wasting-too-fast', name: 'Why anodes are wasting faster than expected' }],
    library: ['galvanic-corrosion-and-anode-wastage', 'cathodic-protection-basics'],
    order: 5,
  },
  {
    slug: 'uwild-in-water-survey',
    name: 'UWILD & In-Water Survey Support',
    title: 'UWILD Brownsville TX | In-Water Survey In Lieu of Drydocking',
    intent: 'BLUE OCEAN. Class-surveyor search language. Wire to the whole compliance cluster.',
    rolledUp: ['UWILD support'],
    problems: [{ slug: 'uwild-vs-drydock-cost', name: 'UWILD or drydock: how the decision is actually made' }],
    library: ['uwild-photo-video-standards'],
    order: 6,
  },
  {
    slug: 'marine-salvage',
    name: 'Marine Salvage & Recovery',
    title: 'Marine Salvage Brownsville TX | Vessel Recovery & Refloat',
    intent: 'High-value, low-frequency. Strong case-study candidate.',
    rolledUp: ['marine salvage support', 'salvage and recovery operations'],
    problems: [
      { slug: 'sunken-vessel-first-steps', name: 'First steps when a vessel goes down' },
      { slug: 'refloat-vs-scrap', name: 'Refloat or scrap: assessing a sunken hull' },
    ],
    library: ['silt-visibility-blackwater-diving'],
    order: 7,
  },
  {
    slug: 'sea-chest-services',
    name: 'Sea Chest Inspection & Repair Support',
    title: 'Sea Chest Inspection Brownsville TX | Strainer & Grate',
    intent: 'Overboard blanking / cofferdam work folds in here.',
    rolledUp: ['overboard blanking and cofferdam support', 'sea chest repair support'],
    problems: [{ slug: 'blocked-sea-chest-overheating', name: 'Engine overheating from a blocked sea chest' }],
    library: ['sea-chest-and-strainer-fouling'],
    order: 8,
  },
  {
    slug: 'port-diving',
    name: 'Port & Terminal Diving',
    title: 'Port Diving Brownsville TX | Terminal & Berth Dive Services',
    intent: 'Institutional buyer. Wire hard to the ports & terminals vertical.',
    rolledUp: [],
    problems: [{ slug: 'berth-obstruction-survey', name: 'Suspected obstruction at a berth' }],
    library: ['pile-scour-and-marine-borers'],
    order: 9,
  },
  {
    slug: 'pile-dock-pier-inspection',
    name: 'Pile, Dock & Pier Inspection',
    title: 'Pile & Dock Inspection Brownsville TX | Underwater Survey',
    intent: 'Infrastructure owners and marine contractors.',
    rolledUp: ['pile inspections', 'dock inspections', 'pier inspections'],
    problems: [{ slug: 'scour-around-pilings', name: 'Scour around pilings: what it means structurally' }],
    library: ['pile-scour-and-marine-borers', 'steel-wastage-and-pitting'],
    order: 10,
  },
  {
    slug: 'marine-construction-support',
    name: 'Marine Construction Dive Support',
    title: 'Marine Construction Diving Brownsville TX | Dive Support',
    intent: 'B2B contractor work. Pairs with dredging vertical.',
    rolledUp: ['marine construction dive support'],
    problems: [{ slug: 'dive-support-for-dredging', name: 'Dive support on a dredging project' }],
    library: ['seabed-survey-methods'],
    order: 11,
  },
  {
    slug: 'emergency-underwater-response',
    name: 'Emergency Underwater Response',
    title: 'Emergency Diver Brownsville TX | 24-Hour Underwater Response',
    intent: 'Highest urgency, highest conversion. Sticky call CTA, minimal friction.',
    rolledUp: ['time-sensitive emergency mobilization'],
    problems: [{ slug: 'vessel-taking-on-water', name: 'Vessel taking on water at the dock' }],
    library: [],
    order: 12,
  },
  {
    slug: 'search-and-recovery',
    name: 'Search & Recovery',
    title: 'Underwater Search & Recovery Brownsville TX | Dive Team',
    intent: 'Dropped objects, equipment, evidence. Handle sensitive cases carefully.',
    rolledUp: [],
    problems: [{ slug: 'dropped-object-recovery', name: 'Recovering a dropped object in a channel' }],
    library: ['silt-visibility-blackwater-diving'],
    order: 13,
  },
  {
    slug: 'underwater-survey',
    name: 'Seabed & Underwater Condition Survey',
    title: 'Seabed Survey Brownsville TX | Underwater Condition Survey',
    intent: 'Industrial intake/outfall work folds in here.',
    rolledUp: ['seabed and underwater condition surveys', 'industrial intake and outfall inspections'],
    problems: [{ slug: 'intake-blockage-industrial', name: 'Industrial intake blockage: inspection and clearing' }],
    library: ['seabed-survey-methods', 'silt-visibility-blackwater-diving'],
    order: 14,
  },
];

/** Also claimed on the live site, folded into the spokes above rather than given URLs. */
export const rolledUpAudit = services.flatMap((s) =>
  s.rolledUp.map((r) => ({ capability: r, foldedInto: s.slug }))
);
