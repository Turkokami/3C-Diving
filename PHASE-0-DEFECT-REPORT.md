# Phase 0 — Defect Remediation & Audit
## 3rd Coast Commercial Diving & Salvage · 3cdiving.com

**Standard:** Keystone v1, Part 13 Phase 0 · Part 12 Known-Failure Catalog
**Audited:** August 17, 2026
**Method:** Live-site fetch of the rendered page, search-index inspection of the served `<title>`, competitor cross-check. Verified against the live site, not against any prior report (Part 9.3).
**Outcome:** Nothing new gets built on a broken foundation. This report is what "broken" means here.

---

## Executive summary

The good news is unusual: **there is no legacy debt.** No CMS, no Elementor blob, no plugin debris, no OTTO/SearchAtlas artifacts, no competing URL taxonomy, no redirect chains, no `@id` collisions. Phase 0 on an inherited WordPress site is usually weeks of surgical cleanup. Here it is close to zero.

The bad news is that there is almost no site. 3cdiving.com is a **single HTML page with six anchor-linked sections**. The entire business — 14 services across an 18-port coastline — occupies one indexable URL of roughly 700–900 words. Against the Keystone acceptance gate this is not a site with defects; it is a placeholder.

**11 P0 defects. 6 P1. Baseline scorecard: 1.64 / 5.**

The single most consequential finding is not technical: **there is no verifiable trust signal anywhere on the site.** No address, no credentials, no named human, no certifications, no job proof. In a vertical where the buyer is a port engineer or a class surveyor, that is the whole ballgame — and it is the one thing the build cannot manufacture. See B1–B4.

---

## 1. What the live site actually is

| Attribute | Observed |
|---|---|
| Architecture | Single page, six `#anchor` sections: `#home` `#about` `#services` `#photos` `#what-sets-us-apart` `#contact` |
| Indexable URLs | **1** |
| Estimated total word count | ~700–900 across the entire site |
| Served `<title>` | `Commercial Diving Brownsville TX \| Underwater Welding & Salvage \| 3rd Coast Commercial Diving` — **91 characters** |
| Nav items | Home, About, Services, Photos, What Sets Us Apart, Contact — all client-side anchors |
| Phone (primary) | (713) 384-1954 — **Houston area code** |
| Phone (Spanish) | (956) 455-8476 — local Rio Grande Valley |
| Email | 3cdiving@gmail.com — free consumer mailbox, not a domain address |
| Physical address | **None published** |
| Hours | **None published** |
| Named people | **None** |
| Credentials / certifications | **None** |
| Pricing | None (appropriate for this vertical — not a defect) |
| Social profiles | **None found** |
| Case studies / job proof | **None** |
| Forms | A "Request a Quote" CTA; destination and lead-tracking path unverified |

**Facts the site does assert, and which the build will carry forward** (verbatim from the live page, to be confirmed by the owner before use in schema):

- Service area: Brownsville, Port Isabel, South Padre Island, and the South Texas Gulf Coast
- Vessel services: hull inspections · propeller clearing, inspection and polishing · hull cleaning · anode replacement · UWILD support · overboard blanking/cofferdam support · port diving
- Underwater repair & welding: underwater welding support · weld repair support · sea chest inspection and repair support · hull repair support · thruster and rudder inspection support · emergency underwater response · damage inspection and reporting
- Marine construction support: pile, dock and pier inspections · marine salvage support · salvage and recovery · steel and structural inspection · seabed and underwater condition surveys · marine construction dive support · industrial intake and outfall inspections
- Custom: project-specific underwater support · time-sensitive emergency mobilization · special inspections
- Stated differentiators: local and ready to move (faster response, lower mobilization cost, crew that knows the ports) · safety and professional standards · practical field problem-solving

---

## 2. P0 defects — must be resolved before anything is built on top

| ID | Defect | Keystone reference | Evidence | Remediation |
|---|---|---|---|---|
| **P0-1** | **Single-URL anchor architecture.** One indexable page for 14 services × 18 planned markets. The spoke-and-wheel is not merely incomplete — it is structurally impossible. Anchor fragments are never sent to the server, so they cannot rank, cannot be canonical targets, and cannot carry distinct titles or schema. | M3, Part 3 | Nav is `#home`, `#about`, `#services`… all client-side | Full static rebuild on the Part 3.1 taxonomy. Resolved by the Phase 1–5 build, not by patching. |
| **P0-2** | **Depth floor missed by ~99%.** Site total ~700–900 words. Mandate is 3,000–5,000 words *per indexable page*. | M1 | Full page fetch | 107 pages × 3,000–5,000 words, research-first. Capacity-gated so no page ships thin. |
| **P0-3** | **Title tag 91 characters** — 31 over the limit, will truncate in SERP, and it is the *only* title on the site so it cannot be unique per intent. | M5 | Served title observed in the search index | ≤60 chars, unique sitewide, city front-loaded. Validator runs on the full set before push. |
| **P0-4** | **No physical address and no hours anywhere.** A `LocalBusiness` node cannot be honestly emitted without a real `PostalAddress`, and the GBP entity connection — the actual source of map-pack visibility and star ratings — has nothing to match against. | Part 5.1 node 4; Part 5.3 NAP rule | No address on the page | **Blocker B1.** Owner supplies address + hours, or we ship `areaServed`-only and accept a materially weaker local position. |
| **P0-5** | **NAP primary phone is out-of-market.** (713) is Houston. The business positions itself on being *local* to Brownsville — "faster response times, lower mobilization costs, a crew that understands the ports" — while leading with a 300-mile-away area code. The local 956 number is buried as the "Spanish line." | Part 5.3; Part 12.1 brand-dependency | Both numbers on the live page | **Blocker B2.** Recommend promoting a 956 number to NAP primary. Whatever is chosen must then match the GBP and every page character for character. |
| **P0-6** | **Zero credentials or certifications published.** In commercial diving the buying criteria *are* the credentials — ADCI, OSHA 29 CFR 1910 Subpart T compliance, AWS D3.6M, USCG, TWIC, class-society approval. The nearest real competitor leads with seven class-society approvals. | Doctrine #5, #6; Part 11 credential-surfacing | No certification mentioned anywhere | **Blocker B3.** Collect real credentials + numbers. Nothing is invented — the `hasCredential` node stays absent until supplied (doctrine #6). |
| **P0-7** | **No named human.** No owner, no dive supervisor, no first-person voice. The named-expert E-E-A-T block (universal contract, block 2) has nobody to name. | Part 4.1 block 2; Part 5.1 Person node | No people named on the page | **Blocker B3.** One named, credentialed dive supervisor with a linked `Person` entity page, quoted in first person on every page. |
| **P0-8** | **No AEO layer.** No 40–60 word Quick Answer, no question-formed H2s, no FAQ block, no `FAQPage`, no Speakable hooks. The single cheapest AEO win available is entirely absent. | M2, M4; Part 4.1 blocks 1, 5 | Page structure is marketing headings + bullet lists | Full AEO stack on all 107 pages: Quick Answer reused as meta description, first FAQ answer and Speakable target. |
| **P0-9** | **Structured data absent or unverifiable.** No JSON-LD graph detected in the rendered content. Even if a fragment exists, a single-URL site cannot carry `WebPage`, `Service`, `FAQPage` and `BreadcrumbList` per intent. | Part 5.1 | Rendered page inspection | Hand-built 7-node `@graph` in `lib/schema.ts`, validated in the build script. |
| **P0-10** | **Zero geographic surface.** Four place names appear in prose. No city page, no port page, no `areaServed`, no coordinates, no local conditions, no landmarks. The business's entire stated advantage is *locality* and none of it is expressed in a form a search engine can read. | M2 GEO signals; Part 3 | Full page fetch | 18 port/city pages with real channel, berth, tide, visibility and vessel-mix data. |
| **P0-11** | **No proof assets.** A "Photos" section exists in the nav but no case study, no job documentation, no before/after, no client reference, no review. T9 case studies are the highest-trust, most citation-friendly asset in the system and there are none. | Part 4.2 T9; Part 11 | Nav vs content | Phase 4: 6 case studies, each wired into its service spoke, its port page and the hub. **Gated on real jobs and owner permission — no client names published without consent (Part 14).** |

---

## 3. P1 defects

| ID | Defect | Remediation |
|---|---|---|
| **P1-1** | **No Spanish content** despite a dedicated Spanish phone line in a border market that is roughly 93% Hispanic. A whole demand pool is unserved. | `/es/servicios/{service}/` tree, Phase 5. Real translation with local idiom, not machine output. |
| **P1-2** | **Free-mailbox contact address** (`@gmail.com`) on a commercial contractor bidding port and industrial work. Small signal, cheap fix, real credibility cost with institutional buyers. | Domain mailbox; keep the gmail as a forwarding alias so no lead is lost. |
| **P1-3** | **Quote form destination unverified.** Static sites cannot send email. If there is an existing CRM or form endpoint, it must be preserved so lead tracking survives the rebuild. | Confirm the current endpoint; embed it, or stand up a form service before Phase 2. |
| **P1-4** | **No social profiles found**, so the `sameAs` array — the primary entity-disambiguation signal — is empty. | Establish GBP first, then LinkedIn/Facebook. Populate `sameAs` in Phase 1 as they exist. |
| **P1-5** | **`robots.txt` and `sitemap.xml` unverified.** Both fetches were blocked pending approval during this audit. | Re-check, then ship a self-growing sitemap generated from the same data arrays the routes use. |
| **P1-6** | **No `/about/` depth, no operating story, no equipment or dive-spread description.** Buyers in this vertical want to know the surface-supplied capability, the depth rating, the vessel and the spread. | `/about/` page + capability detail woven into service spokes. Pending owner input. |

---

## 4. Legacy URL debt: none

Checked explicitly, because this is normally the expensive part of Phase 0.

**Anchor fragments are client-side only.** `#services`, `#about`, `#contact` and the rest are never transmitted to the server, never indexed as separate URLs, and hold no independent link equity. There is therefore **nothing to 301** and no redirect chain risk — a rare clean-slate advantage.

The redirect map is one line:

| Old | New | Code |
|---|---|---|
| `/` | `/` | — (home is rebuilt in place) |

**Two guards apply anyway:**

1. Before launch, pull Search Console and any server log for stray indexed paths (a `/index.html`, a staging subdomain, a `www` vs apex split). Anything found gets a page-by-page 301 to its true destination — never a chain, never a blanket redirect to home.
2. Confirm one canonical host. If both `www.3cdiving.com` and `3cdiving.com` resolve, one 301s to the other before any page is built (Part 12.1, two indexable domains for one entity).

---

## 5. Verified-facts ledger

Everything the build is permitted to state, and its status. **Nothing marked `PENDING` is written into copy or schema until the owner supplies it** (doctrine #6, Part 14).

| Fact | Value | Status |
|---|---|---|
| Legal business name | 3rd Coast Commercial Diving & Salvage | ⚠️ Confirm exact registered entity name |
| Primary phone | (713) 384-1954 | ⚠️ Confirm as NAP primary (see P0-5) |
| Spanish phone | (956) 455-8476 | ✅ From live site |
| Email | 3cdiving@gmail.com | ⚠️ Recommend domain mailbox |
| Physical address | — | 🔴 **PENDING (B1)** |
| Hours | — | 🔴 **PENDING (B1)** |
| Service area | Brownsville, Port Isabel, South Padre Island, South Texas Gulf Coast | ✅ From live site · ⚠️ Confirm the outer boundary (B4) |
| Services | 14 spokes, all derived from live-site claims | ✅ No service invented |
| Owner / dive supervisor name | — | 🔴 **PENDING (B3)** |
| ADCI membership | — | 🔴 PENDING |
| OSHA 1910 Subpart T compliance | — | 🔴 PENDING |
| AWS D3.6M underwater welding cert | — | 🔴 PENDING |
| USCG credential / TWIC | — | 🔴 PENDING |
| Class-society approval (ABS/LR/DNV) | — | 🔴 PENDING — highest-value credential in this vertical |
| Insurance (marine liability, Jones Act) | — | 🔴 PENDING |
| Years in business / founding year | — | 🔴 PENDING |
| Google Business Profile | — | 🔴 PENDING — **no `aggregateRating` until verified** |
| Reviews | — | 🔴 PENDING — **no Review schema, ever, until real** |
| Field photos | — | 🔴 PENDING — biggest single content asset gap |
| Equipment / dive spread / depth rating | — | 🔴 PENDING |
| Vessel | — | 🔴 PENDING |

Every `PENDING` field is scaffolded in `business.ts` behind a guard. The page renders correctly without it and lights up automatically the moment it is filled — no rework, no second pass across 107 pages.

---

## 6. Failure-catalog pre-flight

Checked proactively against Part 12 so these are designed out rather than debugged later.

**Architecture (12.1)** — Cannibalization: prevented by one intent → one canonical page, enforced by the H2-across-pages scan in the audit sweep. Isolated-page pattern: prevented by the M3 wiring contract plus an orphan check in the harness. Thin-page non-indexing: prevented by the capacity gate. Two indexable domains: checked at launch (§4).

**Static builds (12.3)** — all eight known failures pre-empted:

| Known failure | Design decision |
|---|---|
| Zip drops `[bracket]` route folders → "couldn't find app directory" | Deliver `.tar.gz` only, extract `--strip-components=1` |
| First deploy built 0 pages | `.gitignore` from day one; `git add -A`; verify `git ls-files "src/pages/**"` > 0 |
| 404 on every route | Vercel Framework Preset set explicitly and checked *first* |
| ESLint blocks the build | Internal links via the framework link component; `ignoreDuringBuilds` as a net |
| JSON-LD renders as visible escaped text | Directive on a real `<script>` element; parsed and validated in a build script |
| `params` errors | N/A on Astro; noted if A1 changes to Next 15 |
| Build stops on a partial page set | `genericLocal()` fallback everywhere; never non-null-assert optional data |
| Meta description ends mid-word | Dangling-ending validator across the full set before push |

**Tooling (12.4)** — no browser automation is required for this build, which removes the 45-second wall, nonce management and eval-truncation class of failures entirely.

---

## 7. Baseline scorecard

| # | Dimension | Score | Justification |
|---|---|---|---|
| 1 | Services | **1** | 14 services listed as bullets on one page; zero service pages |
| 2 | Local | **1** | Four place names in prose; no geo page, no coordinates, no `areaServed` |
| 3 | E-E-A-T | **1** | No named person, no credential, no license, no case proof |
| 4 | Reviews | **1** | No reviews, no GBP evidence, no platform presence |
| 5 | Schema | **1** | No detectable entity graph |
| 6 | Content | **1** | ~700–900 words total against a 3,000–5,000 per-page floor |
| 7 | Design | **2** | Clean and mobile-plausible, but generic template; no distinct brand system |
| 8 | Convert | **2** | Phone and quote CTA present; no sticky click-to-call, no trust strip, no market-named CTA |
| 9 | Performance | **3** | Single lightweight page likely passes CWV — by having no content, not by engineering |
| 10 | Integrity | **2** | No dead links or orphans, but only because there is one page |
| 11 | Honesty & compliance | **3** | Nothing fabricated — genuinely clean on this dimension. Held back by an incomplete NAP and unverifiable claims of professional standards. |
| | **Average** | **1.64** | |

Dimension 11 deserves the credit: the site claims nothing it cannot support. That is a better starting position than an inherited site full of fabricated ratings, and it means the build starts from honest ground.

---

## 8. Phase 0 exit

**Complete:**

- ✅ Live-state audit — every fact captured, every claim re-verified against the live site
- ✅ P0/P1 defect catalog — 11 P0, 6 P1
- ✅ Legacy URL debt assessed — none; redirect map is one line
- ✅ URL taxonomy decided and frozen (Plan §3.1)
- ✅ Verified-facts ledger with pending-input guards
- ✅ Failure-catalog pre-flight
- ✅ Baseline scorecard — 1.64 / 5
- ✅ Competitor set identified and one false positive removed

**Open:**

- ⬜ `robots.txt` / `sitemap.xml` / canonical-host check (P1-5, §4 guard 2) — needs fetch approval or GSC access
- ⬜ Quote-form endpoint confirmation (P1-3)
- ⬜ **B1–B4 owner confirmations** — see Plan §9

**Gate ruling:** Phase 0 passes. There is no broken foundation to remediate — there is an absent one. Phase 1 may begin as soon as B1–B4 are answered, because those four answers are baked into the entity graph that all 107 pages inherit.

---

*Audited to Keystone v1 Part 13 Phase 0. Every claim in this report was measured against the live site during this session, not carried over from any prior document (Part 9.3). Two items are explicitly marked unverified rather than assumed.*
