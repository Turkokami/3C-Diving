# Build queue

**Updated:** August 17, 2026
**Batch discipline:** 10 pages per production session. Every batch passes `npm run build && npm run verify` before the next begins.

**To resume:** read `docs/CONTENT_BRIEF.md`, then `src/content/services/underwater-inspection.md` (the exemplar), then take the next unchecked item below.

---

## Status

| Phase | Scope | Done | Remaining |
|---|---|---|---|
| 0 · Defect remediation | audit, taxonomy, ledger | ✅ | — |
| 1 · Entity & schema foundation | infra, graph, harness, first green deploy | ✅ | — |
| 2 · Money pages | 18 | 2 | 16 |
| 3 · Geographic surface | 38 | 0 | 38 |
| 4 · Authority layer | 7 | 0 | 7 — **blocked on B3** |
| 5 · Blue-ocean clusters | 44 | 0 | 44 |
| | **107** | **2** | **105** |

Live: <https://3-c-diving.vercel.app> · Target domain: 3cdiving.com (not yet pointed)

---

## Phase 2 — money pages (16 remaining)

Hub is built and over the floor, so spokes may now proceed (Part 3.1 satisfied).

- [x] `/services/` — hub, 3,010 words
- [x] `/services/underwater-inspection/` — **exemplar**, 3,044 words
- [ ] `/services/underwater-welding/` — highest-value term in the vertical. Must be honest about wet weld classes vs dry. Needs AWS D3.6M research first.
- [ ] `/services/hull-cleaning/` — recurring revenue. VGP/biofouling angle; needs VGP in-water cleaning research.
- [ ] `/services/propeller-services/` — pairs with the 140-boat shrimp fleet. Fast-converting.
- [ ] `/services/anode-replacement/` — ties to the corrosion library cluster.
- [ ] `/services/uwild-in-water-survey/` — **blue ocean.** Research is already in RESEARCH-NOTES.md.
- [ ] `/services/marine-salvage/` — strong case-study candidate (Phase 4).
- [ ] `/services/sea-chest-services/` — overboard blanking / cofferdam folds in here.
- [ ] `/services/port-diving/` — wire hard to the ports & terminals vertical.
- [ ] `/services/pile-dock-pier-inspection/` — infrastructure owners, marine contractors.
- [ ] `/services/marine-construction-support/` — pairs with LNG build-out and dredging.
- [ ] `/services/emergency-underwater-response/` — `ctaVariant: emergency`. Minimal friction.
- [ ] `/services/search-and-recovery/` — handle sensitive cases carefully.
- [ ] `/services/underwater-survey/` — industrial intake/outfall folds in here.
- [ ] `/our-standards/` — defined-term standards + terms. **Never an unqualified warranty.**
- [ ] `/about/` — operating story. Thin until B1/B3 land; write what is honest now.
- [ ] `/contact/` — **blocked on P1-3:** confirm the existing quote-form endpoint before building, so lead tracking survives the rebuild.

## Phase 3 — geographic surface (38)

- [ ] `/locations/` hub — build BEFORE any city page (Part 3.1)
- [ ] 18 port/city pages — **capacity-gated.** Only `researched: true` rows emit.
  - Researched: `port-of-brownsville`, `brownsville`
  - Needs research: `port-isabel`, `south-padre-island`, `brazos-santiago-pass`, `harlingen`, `los-fresnos`, `laguna-vista`
  - ⛔ Blocked on **B4**: all Coastal Bend + upper-coast rows
- [ ] 19 problem micro pages — slugs already defined in `services.ts`

## Phase 4 — authority layer (7) — **blocked on B3**

- [ ] `/{expert-slug}/` — named-expert Person page
- [ ] First-person attribution woven back into every Phase 2–3 page
- [ ] 6 case studies — **gated on real jobs + written client consent**
- [ ] GBP + review generation loop

## Phase 5 — blue-ocean clusters (44)

- [ ] 10 compliance pages — each needs source + review date (T8)
- [ ] 6 industry verticals
- [ ] 14 marine-library profiles
- [ ] 14-page Spanish tree — real translation with local idiom, not machine output

---

## Infrastructure still to build

- [ ] `src/pages/locations/[...slug].astro` + `locations` collection schema
- [ ] Route + collection for compliance, marine-library, commercial, case-studies
      (prefixes are already registered in `plugins/rehype-live-links.mjs`)
- [ ] `scripts/check-content.mjs` — assert every content slug matches `services.ts`
- [x] Real field photography pipeline + `<Figure>` component (M6/M7) - done: 3 photos
      in `src/data/media.ts`, WebP at 800w/1600w, og:image rebuilt from a real frame.
      **Still need many more** - three frames of one job cannot cover 14 services (Q26).
- [ ] Empty the `FOUNDATION_EXEMPT` set in `check-wordcount.mjs` — currently exempts
      `/` and `/404/`. **The Phase 2 gate is not truly passed until `/` is rewritten
      to the full floor and removed from that list.**

---

## Owner inputs — the real blockers

Ordered by what they unlock. None of these block writing; all of them cap the ceiling.

| # | Item | What it unlocks | Cost of leaving it open |
|---|---|---|---|
| **B3** | Named dive supervisor + real credentials (ADCI, AWS D3.6M, USCG, TWIC, class-society approval) | `Person` node, `hasCredential`, the named-expert block on all 107 pages, Phase 4 entirely | **E-E-A-T hard-capped at 2/5.** The nearest real competitor leads with seven class-society approvals. This is the single biggest gap. |
| **B1** | Physical address + hours + legal entity name | `PostalAddress`, `GeoCoordinates`, opening hours, GBP entity match | Local dimension capped ~4/5; no map-pack foundation |
| **B2** | Which phone is NAP primary | One flag in `business.ts` — moves it everywhere at once | Leading with a Houston 713 number on a "we're local" positioning |
| **B4** | Territory confirmation | 10 staged locations, ~28 potential pages | Coastal Bend + upper coast invisible; `CONFIRMED_TIERS` is a one-line edit |
| **P1-3** | Existing quote-form endpoint | `/contact/` | Rebuild could silently break lead tracking |
| **—** | Real field photographs | M6/M7 imagery, biggest E-E-A-T asset | Every `og:image` is a generated type card |
| **P1-2** | Domain mailbox | Replaces `@gmail.com` | Credibility cost with institutional buyers |

Every one of these is scaffolded behind a guard in `business.ts`. Filling any of them lights it up across all pages with no rework.
