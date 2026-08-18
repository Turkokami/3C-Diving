# 3rd Coast Commercial Diving & Salvage — Keystone Buildout Plan

**Domain:** 3cdiving.com
**Standard:** Keystone v1 (August 2026)
**Build type:** New — Static (Keystone Part 7A)
**Tier:** 1.0 built to scale to 2.0 (Part 2)
**Issued:** August 17, 2026
**Status:** Plan approved for execution pending owner confirmation of the four open items in §9

---

## 0. Assumptions on record

These were taken as defaults so the build could start. Each is cheap to change **now** and expensive to change after Phase 1. Correct any that are wrong before Phase 1 begins.

| # | Assumption | Why | Cost to change later |
|---|---|---|---|
| A1 | **Astro static output + Vercel + GitHub** | Keystone 7A default for greenfield. Near-zero JS, best CWV and answer-engine surface. Proven at 196 pages on the BugBoss build. | Low if changed before Phase 1; high after. |
| A2 | **Territory = Brownsville hub + Texas Gulf Coast** | The site claims "South Texas Gulf Coast"; the primary phone is a 713 (Houston) number, implying Houston-corridor reach. Deep South Texas alone is too small a lattice for a 2.0 ceiling. | High. Territory is a hard filter (Part 14) and drives the entire geo tree. |
| A3 | **Launch scope ≈ 107 indexable pages** | Standard 1.0→2.0. Enough surface to own the market without breaking the M1 uniqueness floor. | Medium. Additive later, but taxonomy must anticipate it. |
| A4 | **Spanish `/es/` tree is in scope** | Brownsville is a ~93% Hispanic border market and the business already runs a dedicated Spanish line — (956) 455-8476. This is unusually high-value here, not a nice-to-have. | Medium. |
| A5 | **No credentials, photos, GBP or address confirmed yet** | None appear anywhere on the live site. Every one of these is scaffolded behind a "pending client input" guard (Part 7A) and lights up automatically once supplied. Nothing is fabricated (doctrine #6). | None — designed for it. |

---

## 1. Job classification and what changes

**Route (Part 0.1):** New — Static. There is no legacy CMS, no Elementor, no plugin debris. Part 7B and 7C do not apply. This is the cleanest possible starting position: the existing site is a single HTML page with anchor navigation, so there is nothing to migrate and nothing to break.

**Keystone is pest-portfolio-native.** The doctrine, architecture, schema, content standard, verification and scorecard are stack- and vertical-agnostic and apply unchanged. Three abstractions get remapped for commercial diving:

| Keystone construct | 3rd Coast equivalent |
|---|---|
| Pest Library (`/pest-library/{pest}/`) | **Marine Reference Library** (`/marine-library/{topic}/`) — biofouling, corrosion and cathodic protection, weld defects, prop cavitation, sea-chest fouling, silt and scour |
| Compliance / code pages | **Class and regulatory cluster** — UWILD, ABS/Lloyd's/DNV survey requirements, USCG COI, OSHA 29 CFR 1910 Subpart T, ADCI consensus standards, AWS D3.6M, VGP/biofouling rules, Jones Act |
| `/financing/` (BNPL) | **`/services/emergency-underwater-response/`** — 24-hour mobilization and callout process, carried as a service spoke rather than a standalone page. Higher commercial intent than financing in this vertical, and keeping it as one URL avoids the cannibalization a duplicate `/emergency-response/` page would create (Part 12.1). |
| `/our-guarantee/` | **`/our-standards/`** — dive plan, supervision, documentation and reporting standards. Defined-term only; a diving contractor must never publish an unqualified warranty (doctrine #6). |

**Why this vertical rewards the Keystone method harder than pest control.** Commercial diving buyers are port authorities, vessel operators, class surveyors and marine contractors. They search in regulatory language — "UWILD in lieu of drydocking," "ABS in-water survey Brownsville," "29 CFR 1910 Subpart T dive plan requirements." Almost no diving contractor builds that content. The compliance cluster (Part 13, Phase 5) is normally the last phase; here it is a genuine blue ocean and gets pulled forward.

---

## 2. Tier call and the two-hat question

**Tier 1.0 built on 2.0 rails.** One market (Port of Brownsville / Brazos Santiago), one NAP, one LocalBusiness entity — but the location layer is built as data from day one, so adding Corpus Christi, Freeport or Galveston as real markets is a data-file edit, not a rebuild. Picking 1.0 *without* the scaling framework is the single most expensive mistake in Part 2; we avoid it by structure, not by building pages we can't fill.

The two-hat rule (Part 3.2) does **not** apply — no franchise network, no parent Organization above this entity. One `Organization` + one `LocalBusiness` (`ProfessionalService` / `HomeAndConstructionBusiness` subtype — see §5).

---

## 3. Architecture — hub and spoke

**Cardinal rule (Part 3.1): the hub is built before the spokes, with real content, never a stub.** On a prior build the `/services/` hub accumulated 74 inbound links while remaining a 558-word stub — the most link equity on the site pointing at its thinnest page. Here `/services/` and `/locations/` are each written to the full 3,000–5,000 word floor in Phase 2, *before* any child page exists.

### 3.1 URL taxonomy — decided now, never mixed

```
/                                        hub / home
/services/                               single services hub (never two)
/services/{service}/                     core service spoke              × 14
/services/{service}/{problem}/           problem-specific micro page     × 19
/locations/                              geo hub
/locations/{port-or-city}/               port / city page                × 18
/locations/{city}/{service}/             city × service matrix           (Phase 3b, capacity-gated)
/marine-library/{topic}/                 reference profile               × 14
/commercial/{vertical}/                  industry vertical page          × 6
/compliance/{topic}/                     class / regulatory page         × 10
/case-studies/{slug}/                    case study                      × 6 (gated on real jobs)
/our-standards/                          defined-term standards + terms
/about/                                  company + operating story
/{expert-slug}/                          named-expert Person entity page
/es/servicios/{service}/                 Spanish service tree            × 14
/es/ubicaciones/{ciudad}/                Spanish geo tree                (Phase 5)
```

Trailing slashes everywhere, lowercase, hyphenated, no dates, no `/blog/` prefix ambiguity. **One taxonomy, decided before Phase 1, never mixed** (Part 3.3).

### 3.2 The spoke-and-wheel wiring contract (M3)

Every page links **up** to its parent, **in** to the hub, and **laterally** to its siblings. Nothing is orphaned, ever. Enforced mechanically: the dead-link crawler and an orphan check run between every content wave, and hubs are audited by *inbound-link count*, not by how they look.

```
                        /  (home / hub)
                         |
        +----------------+----------------+----------------+
        |                |                |                |
   /services/      /locations/     /commercial/     /compliance/
        |                |                |                |
  {service} ×14   {port/city} ×18   {vertical} ×6    {topic} ×10
        |                |                |
  {problem} ×19   {city}/{service}   case studies ×6
        |
  /marine-library/{topic} ×14  ──lateral──► parent service spoke
```

---

## 4. The build inventory

| # | Page type | Template | Count | Phase |
|---|---|---|---|---|
| 1 | Home (hub) | T1 | 1 | 2 |
| 2 | Services hub | T1-var | 1 | 2 |
| 3 | Core service spokes | T2 | 14 | 2 |
| 4 | Our standards / terms | T2-var | 1 | 2 |
| 5 | About | T1-var | 1 | 2 |
| 6 | Locations hub | T4-var | 1 | 3 |
| 7 | Port & city pages | T4 | 18 | 3 |
| 8 | Problem micro pages | T3 | 19 | 3 |
| 9 | Named-expert Person page | — | 1 | 4 |
| 10 | Case studies | T9 | 6 | 4 |
| 11 | Marine reference library | T6 | 14 | 5 |
| 12 | Industry verticals | T7 | 6 | 5 |
| 13 | Compliance / class pages | T8 | 10 | 5 |
| 14 | Spanish service tree | T2 | 14 | 5 |
| | **Total indexable** | | **107** | |

At the M1 band of 3,000–5,000 words, that is **321,000–535,000 words** of unique, researched, hyper-local content.

### 4.1 The 14 service spokes

Derived strictly from what the live site already claims — no invented services (Part 14).

| Spoke | Slug |
|---|---|
| Underwater inspection | `/services/underwater-inspection/` |
| Underwater welding & cutting | `/services/underwater-welding/` |
| Hull cleaning | `/services/hull-cleaning/` |
| Propeller services — clearing, polishing, inspection | `/services/propeller-services/` |
| Anode replacement & cathodic protection | `/services/anode-replacement/` |
| UWILD & in-water survey support | `/services/uwild-in-water-survey/` |
| Marine salvage & recovery | `/services/marine-salvage/` |
| Sea chest inspection & repair support | `/services/sea-chest-services/` |
| Port & terminal diving | `/services/port-diving/` |
| Pile, dock & pier inspection | `/services/pile-dock-pier-inspection/` |
| Marine construction dive support | `/services/marine-construction-support/` |
| Emergency underwater response | `/services/emergency-underwater-response/` |
| Search & recovery | `/services/search-and-recovery/` |
| Seabed & underwater condition survey | `/services/underwater-survey/` |

Also carried from the live site and folded into the spokes above rather than given their own pages (too thin to hold 3,000 unique words alone): overboard blanking / cofferdam support, thruster and rudder inspection, hull repair support, damage inspection and reporting, industrial intake and outfall inspection, steel and structural inspection.

### 4.2 Geographic surface — 18 port/city pages

**Deep South Texas (core, Phase 3a):** Port of Brownsville · Brownsville · Port Isabel · South Padre Island · Brazos Santiago Pass · Harlingen · Los Fresnos · Laguna Vista

**Coastal Bend (Phase 3b):** Corpus Christi · Port Aransas · Ingleside · Aransas Pass · Rockport · Harbor Island

**Upper coast (Phase 3b, capacity-gated):** Freeport · Texas City · Galveston · Houston Ship Channel

> **Capacity gate.** A city page ships only when there is enough real local material — the specific berths, channel depths, tidal and visibility conditions, dominant vessel types, local industry — to write 3,000 unique words. A thin geo page is worse than no geo page (Part 6.3). Cities that can't clear the bar get an `areaServed` mention only, and wait.

### 4.3 The blue-ocean clusters — where this build wins

**Compliance / class (10 pages).** This is the highest-leverage cluster in the entire build and almost no diving contractor has it:

`/compliance/uwild-requirements/` · `/compliance/abs-in-water-survey/` · `/compliance/lloyds-register-in-water-survey/` · `/compliance/dnv-in-water-survey/` · `/compliance/uscg-coi-hull-exam/` · `/compliance/osha-1910-subpart-t/` · `/compliance/adci-consensus-standards/` · `/compliance/aws-d3-6m-underwater-welding/` · `/compliance/vgp-biofouling-requirements/` · `/compliance/dive-plan-documentation/`

Each carries the source citation and a review date (T8 contract). These pages are how a class surveyor or a port engineer finds you.

**Industry verticals (6).** Ports & terminals · marine contractors & dredging · LNG and energy terminals · ship recycling & layberth (the Port of Brownsville is a major US ship-recycling hub) · commercial fishing fleet (the Brownsville shrimp fleet) · municipal & industrial water intakes.

**Marine reference library (14).** Biofouling and hull roughness · barnacle and mussel growth cycles on the Texas coast · galvanic corrosion and anode wastage · cathodic protection basics · propeller cavitation and rope damage · sea-chest and strainer fouling · weld porosity and underwater weld classes · pile scour and marine borers · silt, visibility and blackwater diving · rudder and thruster wear · steel wastage and pitting · zebra/quagga and invasive species rules · seabed survey methods · UWILD photo and video evidence standards.

---

## 5. Entity & schema architecture (built first, Phase 1)

The 7-node graph per Part 5.1, injected once in `BaseLayout` from a hand-built `lib/schema.ts` module — no plugin, therefore no duplicate-emitter problem.

| # | Node | 3rd Coast specifics |
|---|---|---|
| 1 | `WebSite` | `https://3cdiving.com/#website` |
| 2 | `WebPage` | `{PAGE}#webpage`, `isPartOf` the WebSite |
| 3 | `ImageObject` | Shared brand hero/social image + logo, referenced by `@id`, never inlined |
| 4 | `LocalBusiness` | `#localbusiness`, `@type: ["LocalBusiness","ProfessionalService"]` — NAP, geo, hours, `areaServed`, `sameAs`. **`aggregateRating` omitted entirely until a verified GBP exists.** |
| 5 | `Service` / `Article` | `Service` on spokes and verticals; `Article` on library and compliance pages |
| 6 | `FAQPage` | One per URL, built from the same array the visible FAQ block renders from |
| 7 | `BreadcrumbList` | Mirrors the URL taxonomy exactly |
| + | `Person` | `#named-expert` — the dive supervisor/owner, with `hasCredential` carrying the real ADCI / AWS D3.6M / USCG numbers. **Pending client input.** |
| + | `citation` | On compliance pages, pointing at the actual CFR / class-society source. Telling an answer engine you source real regulation materially raises the odds it quotes you. |

**Hard rules applied here (Part 5.3):**

- No `Review` or `AggregateRating` markup, ever, until real verified reviews exist. Stars come from the Google Business Profile, not from markup on your own site.
- NAP inside schema matches visible NAP character for character, and matches the GBP.
- The JSON-LD is emitted from a real `<script type="application/ld+json">` element, and a build script parses the rendered output to confirm the graph is real, connected and node-complete — Astro's `set:html` on a pseudo-element double-escapes and renders the graph as visible text.
- One emitter. There is no SEO plugin on a static build, which removes the single most common schema defect in the portfolio by construction.

---

## 6. Phased sequence

| Phase | Work | Gate to exit |
|---|---|---|
| **0 · Defect remediation** *(running now)* | Audit the live state, catalog every P0, decide taxonomy, build the verified-facts ledger, confirm there is no legacy URL debt. | Defect report delivered; owner confirms facts and guardrails. |
| **1 · Entity & schema foundation** | `business.ts` constants, `lib/schema.ts` 7-node graph, `lib/geo.ts` differentiator helper, `BaseLayout`, `AnswerBox`/`Faq`/`Cta`/`Header`/`Footer`/`PhoneBar`, content collection schemas, design tokens, verification harness, `.gitignore` + `vercel.json`, repo pushed, Vercel Framework Preset set explicitly. | A single placeholder route deploys green on Vercel with a validating graph. |
| **2 · Money pages** (18) | Home, services hub, 14 service spokes, our standards, about. Full on-page contract. | Acceptance gate (Part 9) passes on all 18. |
| **3 · Geographic surface** (38) | Locations hub, 18 port/city pages, 19 problem micro pages. Capacity-gated. | Gate passes; zero orphans; no duplicate H2s across the set. |
| **4 · Authority layer** (7) | Named-expert Person page and first-person attribution woven back into every Phase 2–3 page, 6 case studies wired into their service spoke + city page + hub, GBP and review-generation loop stood up. | Every service spoke carries a real credentialed voice and at least one case-study link. |
| **5 · Blue-ocean clusters** (44) | 10 compliance pages, 6 verticals, 14 library profiles, 14-page Spanish tree. | Gate passes; every compliance page carries source + review date. |
| **6 · Cadence** | Seasonal rhythm (hurricane-season readiness, pre-drydock survey season, VGP renewal cycles, winter storm damage), ongoing review generation, quarterly schema revalidation. | Ongoing. |

**Batch discipline:** 10 pages per production session. Every batch passes the acceptance gate before the next begins. A master queue file tracks completion and the next item number, so any session can be resumed from a standalone takeover prompt.

---

## 7. Content production

**Two artifacts before any fan-out (Part 6.1):**

1. **`CONTENT_BRIEF.md`** — verbatim business facts, verified regional facts (Port of Brownsville berth and channel data, Brazos Santiago Pass conditions, Gulf visibility and current, local vessel mix, hurricane season, LNG and ship-recycling activity), anti-slop rules, exact frontmatter + section spec per template, internal-linking rules, the valid slug list, and brand voice.
2. **One gold-standard exemplar page** — hand-written. `/services/underwater-inspection/` is the exemplar. Every writer matches its depth, structure and voice.

**Fan-out in waves,** 3–5 pages per writer, each given the brief, the exemplar, exact slugs and the full valid internal-link slug list. Research is mandated before writing: real channel depths, berth names, water conditions, vessel types, regulation text. That research *is* the anti-slop engine.

**Data-driven differentiation.** Every location row carries `port`, `channelDepthFt`, `distanceMi`, `direction`, `waterConditions[]`, `vesselMix[]`, `landmarks[]`, `cluster` (`full | triple | single | area`). Copy derived from these varies on its own — a page grounded in "the Brownsville Ship Channel's 42-foot project depth, the layberth fleet, the Brazos Santiago jetties" cannot read as a template.

**Imagery (M6, M7).** Every image judged by sight, never by filename. Alt formula: [what's shown] + [action/context] + [local], ≤125 chars. Hero on-topic, one inline image per ~300–400 words, geo-matched to the page's port. Shared brand hero/social image + logo on every page. Real field photos are E-E-A-T gold here — underwater work, the dive spread, the crew, the boat — and are the single biggest asset gap right now.

---

## 8. Verification & acceptance

Three layers per Part 9: the markdown/data source (did the write land), the built HTML (what a crawler sees), the deployed page fetched logged-out with `credentials:'omit', cache:'no-store'` (what a real visitor sees).

**The harness lives in `/scripts/` and runs between every wave and before every push:**

1. Dead-link crawler — every internal href resolves to a built file
2. Per-page SEO audit — one H1, unique title ≤60, description 110–165 ending on punctuation, alt on every image, OG + canonical present
3. Duplicate-sentence scanner — flag any 10+ word sentence on ≥3 pages
4. Word-count auditor — every indexable page 3,000–5,000 words, measured on source not rendered HTML
5. Image-metadata integrity checker — snapshot Title/Alt before an edit run, re-check after; confirm hero + logo on every page
6. **Schema validator** — parse the rendered JSON-LD, assert the graph is connected, `@id`s resolve, exactly one FAQPage, no duplicate nodes

**Deployment checklist (the expensive lessons, Part 7A):** Vercel Framework Preset set explicitly *before* debugging any routing 404 · `.gitignore` from day one so `git add -A` is always complete · flat bundle at repo root · `vercel.json` pinning framework/build/output · `siteUrl` set to the canonical https domain · `git ls-files "src/pages/**"` > 0 and a from-scratch `npm ci && npm run build` reports the expected page count before anything is called done.

---

## 9. Open items blocking Phase 1

Nothing here blocks Phase 0. All four block the *entity foundation*, because a wrong answer propagates into all 107 pages.

| # | Item | Why it blocks Phase 1 | Fallback if unanswered |
|---|---|---|---|
| **B1** | **Physical address + formal hours** | `LocalBusiness` schema and the GBP entity connection are impossible without a real address. This is the single biggest local-SEO gap. | Build `areaServed`-only, no `PostalAddress` node. Materially weaker. |
| **B2** | **Which phone is the NAP primary?** | (713) 384-1954 is a Houston area code on a Brownsville business. A 956 local number as primary is a real local ranking signal. The Spanish line (956) 455-8476 is already local. | Keep 713 as primary, flag as a known weakness. |
| **B3** | **Real credentials + the named expert** | ADCI membership, AWS D3.6M, USCG, TWIC, dive supervisor name and license numbers. Drives the `Person` node, `hasCredential`, and the named-expert block on all 107 pages. | Scaffolded behind a pending-input guard; E-E-A-T dimension capped at 2/5 until supplied. |
| **B4** | **Territory confirmation (A2)** | Territory is a hard filter. Building Galveston pages for a business that won't mobilize there is a liability. | Build Deep South Texas core only (8 cities); hold the Coastal Bend and upper coast. |

---

## 10. Baseline scorecard and target

Scored 1–5 on the eleven Keystone dimensions (Part 10). "Now" is the live single-page site.

| # | Dimension | Now | Target at launch | What moves it |
|---|---|---|---|---|
| 1 | Services | 1 | 5 | 14 spokes + 18 problem pages, one page per money service |
| 2 | Local | 1 | 4 | 18 port/city pages with real conditions data; 5 requires the full matrix |
| 3 | E-E-A-T | 1 | 4 | Named dive supervisor, `hasCredential`, case studies — **gated on B3** |
| 4 | Reviews | 1 | 3 | GBP + review loop; earned in the field, not in the build |
| 5 | Schema | 1 | 5 | Hand-built 7-node graph, single emitter, validated in CI |
| 6 | Content | 1 | 5 | ~370k–610k researched words, anti-slop enforced |
| 7 | Design | 2 | 4 | Real brand palette and type system, mobile-first |
| 8 | Convert | 2 | 4 | CTA discipline, sticky click-to-call, emergency callout path |
| 9 | Performance | 3 | 5 | Astro static, WebP, LCP < 2.5s measured logged-out |
| 10 | Integrity | 2 | 5 | Harness in CI: zero dead links, zero orphans, one H1/page |
| 11 | Honesty & compliance | 3 | 5 | No fabricated creds or ratings; defined-term standards linked |
| | **Average** | **1.64** | **4.45** | |

### 10.1 Competitive position

| Operator | Position | Read |
|---|---|---|
| **Texas Commercial Diving** (Houston + Tampa) | The real benchmark | ~20 pages, named owners (Randy, Wesley), and — critically — **class-society approvals: ABS Recognized Specialist, Lloyd's Register, DNV-GL, Bureau Veritas, RINA, ClassNK, Korean Register.** That credential stack is the strongest trust token in this industry, the direct analogue of the A.C.E. credential in Part 11. If 3rd Coast holds or can pursue any class approval, it belongs in the `Person`/`Organization` node and the named-expert block on every page. |
| **Subsea Global Solutions** (Houston) | Enterprise incumbent | National/global footprint. Not beatable on brand; very beatable on hyper-local Brownsville depth. |
| **Tex-Dive, Specialty Dive** | Regional peers | Thin sites, no compliance content. |
| **"Brownsville Underwater Services"** | **Not a competitor** | Verified: this is Brownsville, **Washington** (Kitsap County, Poulsbo WA) — recreational hull cleaning at $7.50/ft. Name collision only. Any tool that surfaced it as a local competitor was wrong. |

**The opening.** Nobody in this market owns the regulatory language. The compliance cluster plus 18 genuine port pages is a position no competitor here currently holds, and it maps directly to how port engineers and class surveyors actually search.

### 10.2 What this would normally cost

Computed from the actual scope at 2026 market reference rates (Part 10.2), presented as a band, not a single number.

- **Content:** 107 pages × 3,500 avg words = 374,500 words
  - at $0.15/word (budget) ≈ **$56,000**
  - at $0.35/word (mid-market average) ≈ **$131,000**
  - at $0.60/word (premium researched) ≈ **$225,000**
- **Technical build project:** **$5,000–$9,500**
- **Retainer front-loaded into the build:** 12 × ~$3,200 ≈ **$38,000/yr equivalent**

> *At prevailing 2026 SEO-writing rates, the content in this build alone represents roughly **$56,000–$225,000**, plus $5k–$9.5k of technical build — engineered and delivered as one fixed engagement.*

Rates vary by market and competition; these are 2026 market benchmarks, presented as a value comparison against what the same scope costs on the open market — not an invoice.

---

## 11. Immediate next actions

1. ✅ **Phase 0 audit complete** — see `PHASE-0-DEFECT-REPORT.md`
2. ⬜ Owner confirms B1–B4 (§9)
3. ⬜ Phase 1 — entity foundation, repo scaffold, first green Vercel deploy
4. ⬜ Write `CONTENT_BRIEF.md` + the `/services/underwater-inspection/` exemplar
5. ⬜ Phase 2 batch 1 — home, services hub, first 8 spokes

---

*Built to Keystone v1. Every lesson in Parts 12 and 16 was checked against this plan before issue. This document is appended to, not replaced — when this build turns up something new, it goes back into Keystone and the file is re-issued dated.*
