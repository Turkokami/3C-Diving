# Content brief — 3rd Coast Commercial Diving & Salvage

**Read this before writing a single page.** Plan §7 artifact 1. The exemplar (`/services/underwater-inspection/`) is artifact 2 — read that too, and match its depth, structure and voice.

---

## 1. The reader

Not a homeowner. Not a recreational diver. The buyer is one of:

| Buyer | What they need to believe before they call |
|---|---|
| **Port engineer / terminal ops** | You can work a live berth without stopping cargo, and you document what you find |
| **Vessel operator / port captain / agent** | You can get in the water today and keep the vessel trading |
| **Class surveyor (ABS / LR / DNV / BV)** | Your work will be *acceptable* to them — approved service supplier, CCTV, two-way comms, adequate visibility |
| **Marine contractor / dredging super** | You will not be the reason their schedule slips |
| **Insurer / adjuster / attorney** | Your report will survive scrutiny |

They search in **operational and regulatory language**, not marketing language: "UWILD in lieu of drydocking," "ABS in-water survey Brownsville," "29 CFR 1910 Subpart T dive plan," "rope wrap prop removal Brownsville." Write for that.

**Write to one person.** Second person singular. "If your vessel is at Berth 7 and the surveyor wants the running gear in one frame, here is what has to be true."

---

## 2. Voice

**Working contractor who writes clearly.** Direct, technical, unhurried. The register is a good field report, not a brochure.

**Do:**
- State the constraint before the solution. "Visibility is the variable that decides whether a UWILD is acceptable. Here is how we handle it."
- Use the real noun. *Anode*, not "protective component". *Sea chest*, *strainer*, *cofferdam*, *wet weld*, *cathodic protection*, *scour*, *fsw*.
- Give numbers, and only numbers from `docs/RESEARCH-NOTES.md` or `business.ts`.
- Say what you *cannot* do, and when a job needs a drydock. Naming the limit is the most persuasive thing on the page.

**Never:**
- "We pride ourselves on…", "state-of-the-art", "unparalleled", "your trusted partner", "in today's fast-paced world"
- "Best in Brownsville", "#1", or any superlative that cannot be evidenced
- An unqualified guarantee or warranty. A diving contractor must never publish one. Point at `/our-standards/` for defined terms.
- Any credential, certification, membership, insurance, year founded, review, rating, client name, or photograph description **that is not already in `business.ts`**. See §5 — this is the hardest rule on the page.

---

## 3. Hard facts — the only numbers you may use

Everything in **`docs/RESEARCH-NOTES.md`** and **`src/data/business.ts`**. Nothing else.

**Burn this in:** the Brownsville Ship Channel is **52 ft** (main) and **54 ft** (entrance/jetty) as of the June 2026 deepening. **It is not 42 ft.** The buildout plan's own sample copy uses the stale figure. If you write 42 you are wrong about the home port.

Need a fact that isn't there? Research it, add it to `RESEARCH-NOTES.md` **with a source**, then use it. Never estimate. Never write "typically around" to paper over a number you don't have.

---

## 4. Page contract

Every indexable page, in order:

1. **H1** — the intent in plain words. One per page. City where natural, never bolted on.
2. **Quick Answer** (`answer` prop) — **40–60 words**. Directly answers the H1's implied question.
   **Write sentence one to stand alone at 110–165 characters** — `BaseLayout` derives the meta description by taking whole sentences from the front, so sentence one *becomes* the description.
3. **Body** — 3,000–5,000 words. **Question-formed H2s** wherever natural ("How is a UWILD actually scheduled?"), because that is how the query arrives.
4. **A named-expert passage** — first person, from the dive supervisor. ⛔ **Blocked on B3.** Until then, first person plural ("we"), never an invented name.
5. **FAQ** — 5–8 entries via the `faqs` prop. One array only: it renders *and* becomes the `FAQPage` node.
6. **CTA** — automatic, market-named. Pass `market`.

### Word floor

3,000 minimum, 5,000 ceiling, measured on `<main>` minus chrome by `scripts/check-wordcount.mjs`. **A thin page is worse than no page.** If a topic will not hold 3,000 honest words, it does not get a URL — fold it into a parent as a section instead. That judgement is the whole point of the `rolledUp` field in `services.ts`.

---

## 5. The honesty rules (doctrine #6) — non-negotiable

The Phase 0 audit scored this site **3/5 on honesty when it had almost no content**, purely because it claimed nothing it could not support. That is a real asset. Do not spend it.

**Currently PENDING and therefore unwritable** — every one of these is `null` in `business.ts`:

> legal entity name · founding year · years in business · physical address · hours · owner or supervisor name · ADCI membership · OSHA Subpart T compliance claims · AWS D3.6M certification · USCG credential · TWIC · class-society approval (ABS/LR/DNV/BV) · insurance · equipment, dive spread, depth rating, vessel · Google Business Profile · reviews or ratings · field photographs

**You may describe what a service involves in general professional terms. You may not claim 3rd Coast holds a credential, has been in business N years, or owns specific equipment.**

The distinction, concretely:

| ✅ Write this | ⛔ Not this |
|---|---|
| "An ABS in-water survey has to be carried out by a diver employed by a firm ABS has approved as a service supplier." | "We are an ABS-approved service supplier." |
| "Surface-supplied air diving under 29 CFR 1910.425 requires a minimum three-person team and continuous tending." | "Our ADCI-certified divers follow OSHA Subpart T." |
| "Ask any contractor for their dive plan and their supervisor's qualifications before they get in the water." | "Our supervisor holds AWS D3.6M certification." |

Explaining the standard the buyer should hold *any* contractor to is genuinely useful, ranks for the regulatory language nobody else targets, and is completely honest. When B3 lands, the claims get added on top — no rewrite needed.

---

## 6. Internal linking (M3) — every page, no exceptions

- **Up** to its parent hub
- **In** to `/services/` or `/locations/`
- **Laterally** to 3–6 genuine siblings — the `library`, `problems` and `rolledUp` fields in `services.ts` tell you which are genuine
- **Down** to its own children

**Link with `routeExists()`.** `src/lib/routes.ts` resolves links against route files that actually exist, so a link to an unbuilt page renders as plain text instead of a 404. Use it — do not hand-write links to pages later phases will create.

Descriptive anchors. Never "click here", never a bare URL.

---

## 7. Anti-slop

`scripts/check-duplicates.mjs` fails the build on **any 10+ word sentence appearing on 3 or more pages**, and warns on repeated H2s.

The defence is not synonym-swapping — it is **research**. A page grounded in the SteelCoast layberth fleet, the 140-boat shrimp fleet, the 52 ft channel and the ABS single-frame visibility criterion cannot read like a template, because no other page has that material. A page written from the service name alone always will.

Concretely: **do not write the same section on every spoke.** "Our process" repeated fourteen times is the seam. Each spoke's structure should follow *that service's* actual decision path.

---

## 8. Valid slugs

Link only to these. Sourced from `src/data/services.ts` and `src/data/locations.ts` — those files are authoritative.

**Services** (`/services/{slug}/`)
`underwater-inspection` · `underwater-welding` · `hull-cleaning` · `propeller-services` · `anode-replacement` · `uwild-in-water-survey` · `marine-salvage` · `sea-chest-services` · `port-diving` · `pile-dock-pier-inspection` · `marine-construction-support` · `emergency-underwater-response` · `search-and-recovery` · `underwater-survey`

**Locations** (`/locations/{slug}/`) — page only when `researched: true`
Researched: `port-of-brownsville` · `brownsville`
In territory, awaiting research: `port-isabel` · `south-padre-island` · `brazos-santiago-pass` · `harlingen` · `los-fresnos` · `laguna-vista`
⛔ Outside confirmed territory (B4) — do not mention: Coastal Bend and upper-coast towns

**Hubs** `/services/` · `/locations/` · `/commercial/` · `/compliance/` · `/marine-library/` · `/case-studies/` · `/about/` · `/our-standards/` · `/contact/`

---

## 9. Images (M6, M7)

- Alt = **[what's shown] + [action/context] + [local]**, ≤125 chars, describing what the image **actually shows, judged by sight**. Never write alt from a filename.
- One inline image per ~300–400 words; hero on-topic and geo-matched.
- ⛔ **No field photography exists yet.** Do not write alt text describing a dive that cannot be evidenced. The scaffold shipped alt text describing "a diver entering the water at the Port of Brownsville" for an image that was never taken — that is a fabrication baked into every page's `og:image`. Real photos are the single highest-value asset gap in the ledger.

---

## 10. Before you call a page done

```bash
npm run build && npm run verify
```

Gate: dead links + orphans · title ≤60 and unique · description 110–165 ending on punctuation · exactly one H1 · alt on every image · OG + canonical · Quick Answer 40–60 words · 3,000–5,000 words · no sentence repeated across 3+ pages · schema graph connected with exactly one FAQPage and no rating markup.

All five checks green, or it does not ship.
