# STYLE.md — Unified art-style spec (rev. 3 — approved, with amendments)

**Approved with 5 amendments** (this revision): (1) two bevel tokens added to the panel hue family, plus a rule that the focus ring always uses `accent-signal`; (2) one non-cyan blue added for water; (3) a text-on-fill contrast rule, including a stricter rule for the Critical fill; (4) `mid-slate` and `green-deep` locked to art-only, never UI text/icon color; (5) status tokens locked to status-only use, plus a full color-blindness simulation (§9b) — which found real problems in the rev. 2 status ramp and is why its hex values changed in this revision (see §9b for why, and §3 for the new values).

Derived from three pixel-grid raster references plus the structural rules in `principles.md`. Where the two disagreed: the images decide color and lighting; `principles.md` decides UI structure (panels, density, shape, type, motion).

This document describes *technique only* — no reference to what any image depicts. File↔label mapping is in §0 and the Appendix only, as plain traceability metadata.

---

## 0. Method and coverage

**Coverage check:** `references/style/` holds exactly three source images and `principles.md`. All three were opened, viewed, and run through k-means palette extraction.

| Label | File |
|---|---|
| Reference A | `mars-pic.jpg` |
| Reference B | `mars-surface.jpg` |
| Reference C | `reference-style.jpg` (container is actually AVIF, despite the `.jpg` name — decodes fine) |

**Two extraction passes were run, not one.** The first pass (12 clusters, 400px thumbnail, 20,000-pixel random subsample) is what rev. 1 of this doc was built from. On review, Reference C has a visibly green-heavy region that the first pass under-represented — at k=12 on a subsampled thumbnail, small scattered clusters (like a minority green range sitting hue-adjacent to the larger teal/charcoal clusters) get absorbed into their nearest larger neighbor instead of surviving as their own cluster. So Reference C was re-run at k=20, on a larger 700px thumbnail, over **every** pixel (no subsampling). That re-run surfaced four distinct green-range clusters (hue ≈ 78–157°) totaling **~11.4% of the frame** — real, non-trivial, and missed the first time. Reference A and B were also re-run the same way as a consistency check; their dominant clusters came back materially unchanged (e.g. Reference A's dominant dark cluster: 47.7%→47.7%, same hex; Reference B's dominant warm cluster: 25.3%→22.8%, same hue/hex family) — only Reference C's result actually changed in a way that matters. The deeper Reference C table replaces the rev.1 table in the Appendix; A and B's tables are carried over as originally reported.

The unified palette in §3 is *not* a numeric average of these tables — it's a set of exemplar colors built from the ramp logic the three share (§1), each standing in for a role. Where §3 extends past what any reference actually shows (see §3's "Source" column), that's called out explicitly rather than presented as extracted.

## 1. What all three references share

- **Bimodal value structure.** A single dark, tinted field occupies roughly half-to-three-quarters of the frame (L 0.09–0.26 in the re-run). A small set of near-maximum-value colors (L 0.6–0.86) punctuate it. Mid-values exist but never dominate area — they're transition bands, not the main event.
- **No neutral shadow.** The dark field is never true gray/black — every reference tints its darkest tone toward a hue family (cool blue-violet, or warm plum-maroon, or desaturated warm charcoal). Shadow always carries color temperature.
- **Small, saturated "light-pool" accents.** The brightest colors in each reference are also among the most saturated, and occupy the smallest area share. Brightness and saturation rise together at the focal points; they fall together in the field.
- **Posterized, not smooth, transitions.** Color change happens in visible discrete steps/clusters rather than continuous gradients — confirmed by how cleanly k-means separates each image into tight, high-population clusters rather than a smear of near-duplicate colors.
- **Bloom around light sources.** Bright colors don't sit on a hard edge against the dark field; a falloff halo of mid-saturation, mid-value color cushions the transition.
- **Consistent raster density** *(as a visual impression — see §6a for why this can't be claimed as a hard measurement from these specific files)*.
- **Scattered fine particulate detail.** Each reference has small, sparse, high-contrast flecks scattered over the dark field, independent of the main shapes — a texture layer of its own.

## 2. Where they differ

| Axis | Reference A | Reference B | Reference C |
|---|---|---|---|
| Dominant dark tint | cool blue-violet | warm plum-maroon | near-neutral charcoal + separate saturated blue |
| Saturation spread | uniformly high across almost the whole frame | uniformly high, skewed toward the light end too | bimodal: structural tones nearly desaturated, glow tones sharply saturated |
| Light-pool hue | gold → orange-red | orange-red → pale cream | warm gold *and* a cooler cyan-teal glow family |
| Secondary hue beyond the main warm/cool pair | — (none at meaningful area share) | — (none at meaningful area share) | **a true green range, ~11% of frame** (see §0) — the only one of the three with this |
| Area given to highlight | small, concentrated in one zone | largest of the three — highlight band sweeps across a third of the frame | smallest — many tiny discrete pools rather than one sweep |
| Edge treatment | value-contrast silhouettes, no linework | value-contrast silhouettes, no linework | some crisp dark structural linework in the silhouette masses, in addition to value contrast |

The throughline: saturation-vs-value coupling and tinted-shadow logic are constants; which hue family carries the light, how concentrated it is, and whether a secondary hue (green) shows up at all are the variables. The green ramp in §3 is grounded in Reference C's actual data, not invented.

## 3. Unified palette — 27 colors (24 approved in rev. 2 + 3 added by amendments 1–2)

"Source" = which reference(s) the exemplar is grounded in, or **extended** where it serves a functional need (a new game state) that none of the three references actually shows. Extended colors still follow the value/saturation coupling rule in §1 — they're built the same way the sourced ones were, just at a hue the references didn't happen to use.

### Panel tiers + bevel — one hue family, stepped only by lightness
Resolves `principles.md`'s "three exact dark panel swatches." All five share hue 226°; the three panel tiers share saturation 22% exactly, and `bevel-light` sits at 23% (close enough to read as the same family — it was nudged lighter for contrast, see below, and saturation drifted by 1% as a side effect of that lightening, not a deliberate change). The two bevel tokens (amendment 1) are new in this revision — a light edge and a dark edge, both in the same panel hue family, for a 1px raised/pressed edge on cards, buttons and slots (§6a pixel-grid logic: a 1px edge line, not a soft shadow).

| Token | Hex | HSL | Source |
|---|---|---|---|
| `bevel-light` | `#6b78a3` | 226°, 23%, 53% | Extended — lightest step, for a raised top/left edge. Lightened from an earlier `#485170` draft (226°,22%,36%) once contrast was checked against `panel-2-surface` (needed ≥3:1, see §9a/§9b) |
| `panel-3-raised` | `#262b3b` | 226°, 22%, 19% | A + C |
| `panel-2-surface` | `#1c202c` | 226°, 22%, 14% | A + C |
| `panel-1-bg` | `#12141c` | 226°, 22%, 9% | A + C (both land their dominant dark cluster in this hue/lightness range) |
| `bevel-dark` | `#08090c` | 226°, 22%, 4% | Extended — darkest step, for a pressed/inset bottom-right edge |

**Bevel usage note (checked in §9b):** `bevel-light` reads clearly against all three panel tiers — and safely now in every respect: it also clears the ≥3:1 non-text contrast minimum against `panel-2-surface` (3.75:1) and `panel-3-raised` (3.25:1), which an earlier, darker draft of this token (`#485170`) did not reliably clear, so it was lightened to the current `#6b78a3`. `bevel-dark` only separates clearly from `panel-2-surface`/`panel-3-raised`; against `panel-1-bg` specifically it's a weak ΔE (the two are only 5 lightness points apart, and there's little room left below `panel-1-bg` before hitting literal black, which §1 forbids). So: **use `bevel-dark` for insets on cards/buttons sitting on `panel-2-surface` or `panel-3-raised`; don't rely on it for anything inset directly into `panel-1-bg`** (the app root background isn't something things get "pressed into" anyway).

**Focus ring:** always `accent-signal` — no separate focus-ring token. One color answers both "this is interactive" and "this currently has focus."

### Illustration-only shadow (not UI chrome — used for art, never for panels)
| Token | Hex | HSL | Source |
|---|---|---|---|
| `shadow-warm` | `#4a1c24` | 349°, 45%, 20% | B |
| `shadow-neutral` | `#3d3a34` | 40°, 8%, 22% | C |

### Midtones
| Token | Hex | HSL | Source |
|---|---|---|---|
| `mid-hot` | `#d34022` | 10°, 72%, 48% | A + B |
| `mid-ochre` | `#91633b` | 28°, 42%, 40% | C |
| `mid-slate` | `#2e4f6b` | 208°, 40%, 30% | A + C — **art-only (amendment 4): never UI text or icon color**, illustration use only |

### Highlights
| Token | Hex | HSL | Source |
|---|---|---|---|
| `hi-gold` | `#f7b645` | 38°, 92%, 62% | A |
| `hi-pale` | `#f1e2b1` | 46°, 70%, 82% | B + C |

### Glow / emitter family
| Token | Hex | HSL | Source |
|---|---|---|---|
| `glow-ember` | `#f65f31` | 14°, 92%, 58% | A + B |
| `glow-flare` | `#f8d362` | 45°, 92%, 68% | A |
| `glow-violet` | `#bb67e4` | 280°, 70%, 65% | **Extended** — dusk/storm state, built on the same light-pool formula as `glow-ember`/`glow-flare`, rotated to a hue none of the three references use as a bright emitter |
| `glow-magenta` | `#e755aa` | 325°, 75%, 62% | **Extended** — paired dusk/storm accent, same reasoning |

### Haze
| Token | Hex | HSL | Source |
|---|---|---|---|
| `haze-dusty-sky` | `#bfa59b` | 16°, 22%, 68% | **Extended** — low-saturation, mid-high-value warm gray for atmospheric recession (§8); none of the three references has a large-area desaturated haze field, so this is built from the aerial-perspective *logic* in §8, not sampled directly |

### Green ramp (plants, and doubles as the "Healthy" status color below)
| Token | Hex | HSL | Source |
|---|---|---|---|
| `green-deep` | `#223f26` | 129°, 30%, 19% | **C** (directly sampled — see §0's re-run). **Art-only (amendment 4): never UI text or icon color**, illustration use only |
| `green-bright` | `#42d780` | 145°, 65%, 55% | **C**, hue nudged from the sampled 157° down to 145° to stay clearly green rather than drifting toward the cyan range reserved for the signal color (below) |

### Status ramp — 5 steps, distinct hue *and* value (hex values changed in rev. 3 — see §9b)
`status-healthy` is not a new token — it reuses `green-bright` above. The other four are new, each a different hue family *and* a different lightness, so no two are distinguishable by hue alone or by value alone. **Reserved for status meaning only (amendment 5) — never reused decoratively**, same rule as `accent-signal`.

The rev. 2 values for this ramp were tuned for hue spread but not checked against color blindness. §9b's simulation found `status-low`/`status-critical` nearly collapsed under protanopia/deuteranopia (ΔE 9–10, a real failure) because they sat at almost the same lightness (52% vs 50%). **Fix: make lightness fall in strict, larger steps with severity — not just hue change** — this is the standard mitigation for a red-green-confusable warning ramp, and it's why every hex below is darker than its rev. 2 counterpart.

| Status word | Token | Hex | HSL | Source |
|---|---|---|---|---|
| Healthy | *(= `green-bright`)* | `#5cd68f` | 145°, 60%, 60% | C |
| OK | `status-ok` | `#edb91d` | 45°, 85%, 52% | Extended (status-specific tuning of the gold family) |
| Low | `status-low` | `#d05011` | 20°, 85%, 44% | Extended (status-specific tuning of the orange/ember family) |
| Critical | `status-critical` | `#a51f12` | 5°, 80%, 36% | Extended (status-specific tuning of the red family) |
| Empty | `status-empty` | `#4d1937` | 325°, 50%, 20% | Extended — deliberately the *darkest* step, to encode "worst" as a value drop. **See §9a/§9b — several of these still can't be plain foreground text/icon color; they need the fill rule below.** |

### Accent, meter-identity, and text
| Token | Hex | HSL | Role |
|---|---|---|---|
| `accent-signal` | `#3fb6c4` | 186°, 53%, 51% | The *only* cyan/teal-family color anywhere in this system (unchanged since rev. 1). Means "interactive" and nothing else — not reused for highlights, midtones, glow, or meter identity, which is why `mid-teal` and `highlight-cool-glow` from rev. 1 were retired (see §10), and why the new water color (below) is blue, not cyan. |
| `water-blue` | `#95aae4` | 224°, 60%, 74% | **New (amendment 2).** A meter-identity color for Water — clearly blue, not cyan, and kept at high lightness specifically so it survives tritanopia (blue-yellow color blindness) against `accent-signal`; see §9b. Decorative/meter-identity use, not a second "interactive" signal. |
| `text-primary` | `#f5efe6` | — | Primary UI text |
| `text-secondary` | `#a89a8c` | — | Secondary/caption UI text |

**Total: 2 bevel + 3 panel + 2 shadow + 3 midtone + 2 highlight + 4 glow + 1 haze + 2 green + 4 status (Healthy reuses green-bright) + 1 accent + 1 meter-identity + 2 text = 27.**

## 4. Light & shadow logic
Lighting is single-source and value-driven: one dominant dark ambient, one small warm (or, per Reference C, warm-plus-cool) emitter. Form is read through where the dark ambient tint shifts toward a midtone, not through a lit/unlit binary. Shadows always keep a hue lean — never drop to achromatic gray.

## 5. Shading method
Flat color clusters in discrete steps (posterization) are the default — not smooth ramps. No outline stroke around silhouettes by default; edges are value/hue contrast against the field. A sparing, thin structural line is permitted only where a reference actually used it (Reference C's architectural edges), never as a universal outline.

**Dithering: yes, but scoped.** Ordered/patterned dithering is allowed only inside large atmospheric or gradient fields — sky bands, deep-shadow falloff, haze (`haze-dusty-sky`) transitions — to fake a smooth value change without adding more flat color steps than §1's posterization rule allows. It must never appear on UI chrome, icons, badges, text, or anything rendered small; those stay flat and crisp, because dithering noise at small sizes reads as visual noise, not gradient.

## 6. Detail density
Large masses stay simple (2–4 color steps). Detail concentrates at: (a) the light-pool core and its falloff, (b) a scattering of fine particulate flecks across the dark field, (c) a narrow band where foreground silhouette meets the lit background. Everything else stays flat.

### 6a. Pixel grid — a design choice, not a measurement
An attempt was made to *measure* an apparent pixel-block size directly from the three reference files (run-length analysis of same-color pixel runs along sampled rows, looking for a dominant repeating step size). It did not find one: run-length counts decay smoothly from 1px with no spike at any specific block size, in all three files. The most likely reason is that these are compressed exports (JPEG/AVIF) of art that may originally have had a clean grid, but recompression has softened or noised it — so there is nothing solid to measure here, and claiming a specific "native resolution" from these files would be fabricating precision we don't have.

So the numbers below are a **stated design choice for MARSBOUND's own assets**, not something extracted from the references:
- Base grid unit: **8px**.
- Icon/badge native authoring size: **16×16px** for small glyphs/status icons, **32×32px** for larger badges and drawer art.
- Display scaling: **integer multiples only** — 1×/2×/3×/4× (a 16px icon may render at 16/32/48/64px; never at a non-multiple like 20px or 24px, which would blur or shimmer a crisp asset).
- If MARSBOUND ever commissions its own pixel-art assets, export them without additional lossy recompression, so a future audit doesn't hit the same measurement gap.

## 7. Texture
Texture reads as discrete speckle/fleck, not continuous grain or crosshatch. It sits in the dark field (sparse, high-contrast, low-area) and never inside the light-pool core itself (the core stays clean/flat so it reads as the brightest point unambiguously).

## 8. Atmosphere
Every light source gets a soft bloom halo (a ring of mid-value, mid-saturation color between the emitter and the dark field) rather than a hard cutoff. Distant/receding masses desaturate and shift toward `haze-dusty-sky` (aerial-perspective logic) rather than staying locally colored.

**Exception to "no interpolated colours" (§11): scene-backdrop glow pools.** The CSS `SceneBackdrop` draws each glow pool as three hard-stop rings. Those rings are three fixed alpha steps (44 %, 24 %, 12 %) of one existing glow token (`glow-ember`, `glow-flare`, `glow-violet` or `glow-magenta`) over `panel-1-bg`, which is how the bloom falloff above is made without adding a new hex value. This is the only place a token is used at less than full alpha. UI chrome, icons and badges never do this. The backdrop's vignette uses `bevel-dark` at 36 % and 64 % the same way.

## 9. Contrast and saturation rules
- Saturation and value rise together at focal points, fall together elsewhere — never a saturated-but-dark color or a bright-but-gray one used as a focal point.
- **One-focal-point rule — scoped to static scenes only.** For a single illustrated scene/composition, reserve the single highest-value, highest-saturation pairing for exactly one focal point; everything else is visibly a step down. This does **not** apply to ambient/idle UI loops (e.g. a slow glow pulse, a twinkling-particle loop, a breathing highlight on an active control) — those are allowed multiple simultaneous bright/saturated points over time, because they're a background rhythm, not a single composed scene competing for one read.
- Structural (non-emitting) mass may be either uniformly saturated (Reference A/B logic) or desaturated (Reference C logic) — pick one per surface and hold it; don't blend both approaches on the same surface.

### 9a. Accessibility — WCAG 2.1 contrast, computed for every text/icon-vs-background pair
Relative-luminance contrast ratios, computed directly (not eyeballed). AA normal text needs ≥4.5:1; AA large text / UI-only (icons, 24px+ regular or ~19px+ bold) needs ≥3:1. Numbers below are post-rev.3 (the redesigned status ramp — see §9b for why the hex values moved).

**As small foreground text/icon color, directly on a panel tier:**

| Foreground | vs panel-1-bg | vs panel-2-surface | vs panel-3-raised |
|---|---|---|---|
| `text-primary` | 16.08 ✅ | 14.22 ✅ | 12.32 ✅ |
| `text-secondary` | 6.71 ✅ | 5.93 ✅ | 5.14 ✅ |
| `accent-signal` | 7.61 ✅ | 6.73 ✅ | 5.83 ✅ |
| `water-blue` | 8.01 ✅ | 7.08 ✅ | 6.14 ✅ |
| `green-bright` (Healthy) | 10.04 ✅ | 8.88 ✅ | 7.69 ✅ |
| `status-ok` | 10.12 ✅ | 8.94 ✅ | 7.75 ✅ |
| `status-low` | 4.23 ⚠️ | 3.74 ⚠️ | 3.24 ⚠️ |
| `status-critical` | **2.45 ❌** | **2.17 ❌** | **1.88 ❌** |
| `status-empty` | **1.32 ❌** | **1.17 ❌** | **1.01 ❌** |

Only **Healthy** and **OK** are safe as plain colored text/icon on a panel. **Low** only clears the UI/large-text bar, never normal-text. **Critical and Empty fail outright at every tier, as colored text** — they must be presented as a *fill* (chip, swatch, meter-bar segment), not as a colored glyph on the bare panel.

**Amendment 3 — text-on-fill rule.** When a status or glow color is the *fill* (background) of a chip/bar/swatch, the text/icon drawn on top of it is chosen by the fill's own lightness, not fixed to one color:

| Text on this fill | Use this foreground | Ratio | Verdict |
|---|---|---|---|
| `green-bright` (Healthy) | `panel-1-bg` | 10.04 | ✅ (bright fill → dark text, per amendment 3) |
| `status-ok` | `panel-1-bg` | 10.12 | ✅ (bright fill → dark text) |
| `status-low` | `panel-1-bg` | 4.23 | ⚠️ UI/large-text only — bold 24px+ (corrected: `text-primary` on Low is only 3.80, see DESIGN.md §5) |
| `status-critical` | `text-primary` | 6.55 | ✅ — **but only at bold 19px+ (amendment 3's stricter rule for Critical)** |
| `status-empty` | `text-primary` | 12.17 | ✅ |

So the full rule is: **fills at ≈L50%+ (Healthy, OK, and the highlight/glow tokens generally) take `panel-1-bg` text; fills below that (Critical, Empty) take `text-primary`; Low is the one exception, it takes `panel-1-bg` because that is the higher contrast of the two (4.23 vs 3.80).** Low and Critical both still carry a size/weight floor (18px+ per the existing CLAUDE.md rule, and 19px **bold** specifically for Critical, so it unambiguously clears the large-text contrast tier rather than sitting right at the edge of it).

### 9b. Color-blindness simulation (amendment 5)
Method: each candidate color was converted sRGB→linear, passed through a standard dichromacy simulation matrix for protanopia, deuteranopia and tritanopia (Viénot-style linear-RGB approximation), converted back to sRGB, then compared to its paired color using CIE76 ΔE in Lab space — both before and after simulation. Read as: ΔE ≥ 20 ≈ safely distinct, 10–20 ≈ weak (distinguishable but not confidently), <10 ≈ effectively the same color to that vision type.

**Status ramp (5 colors, all 10 pairs checked).** The ramp in §3 is the *second* version — the first version (rev. 2's hex values) is what was actually simulated first, and it failed:

| Pair (rev. 2 values) | Base ΔE | Protan | Deutan | Tritan |
|---|---|---|---|---|
| status-low vs status-critical | 35.8 | **9.0 — collapse** | 10.2 — weak | 26.5 |

That's a real failure: a protanope could not reliably tell "Low" from "Critical" apart by color in the approved rev. 2 ramp. Root cause: the two were only 2 lightness points apart (52% vs 50%) — nearly all their separation was in hue, and hue separation in the orange-red range is exactly what protanopia/deuteranopia collapse. **Fix applied:** rebuilt the ramp (§3) with a strict, larger lightness step between every adjacent pair (60/52/44/36/20 instead of the old 58/58/52/50/24 — values didn't step monotonically before). Re-simulating the new ramp:

| Pair (rev. 3 values) | Base ΔE | Protan | Deutan | Tritan |
|---|---|---|---|---|
| status-low vs status-critical | 21.5 | 16.7 — weak | 17.0 — weak | 13.4 — weak |
| status-ok vs status-low | 53.3 | 18.1 — weak | 17.5 — weak | 31.4 |
| every other status pair | 70.9–111.9 | 41.9–78.6 | 42.7–80.6 | 47.2–94.7 |

**Residual risk, reported rather than hidden:** `status-low` vs `status-critical` is improved (9.0→16.7 minimum) but still only "weak," not fully safe, for protanopia/deuteranopia — adjacent steps in a 5-step warm ramp cannot be made fully hue-safe for red-green color blindness without either compressing the ramp to fewer steps or pushing lightness steps so large that "Critical" would stop looking alarming (too light) or "Low" would stop looking mild (too dark). Given the ramp must stay at 5 steps (one per status word) and must stay visually ordered by severity, this is accepted as a known residual limitation, **covered by the existing hard rule that color is never the only signal** — every status display is word + color + icon (CLAUDE.md §5.1/§8), so a protanope/deuteranope who can't fully distinguish Low-orange from Critical-red by hue will still read "Low" vs "Critical" from the word and the differently-shaped icon (🟠 vs 🔴).

**Other pairs checked:**
| Pair | Base ΔE | Protan | Deutan | Tritan | Verdict |
|---|---|---|---|---|---|
| `accent-signal` vs `water-blue` | 37.6 | 10.1 — weak | 18.9 — weak | 16.4 — weak | Improved from an initial design that collapsed outright under tritanopia (ΔE 3.6); current values are weak-but-not-collapsed on all three. Mitigated the same way: these two never mean the same *kind* of thing (interactive vs. meter-identity) and are never the sole signal — one is a control state (always paired with a focus/press state and label), the other a meter tag (always paired with the 🫧/droplet icon and the word "Water"). |
| `glow-violet` vs `glow-magenta` | 35.8 | 44.5 | 46.3 | 37.3 | Safe at every type — no issue. |
| `water-blue` vs `mid-slate` | 40.6 | 39.7 | 40.0 | 41.5 | Safe. (Also moot in practice: `mid-slate` is art-only per amendment 4 and never appears as UI color next to `water-blue`.) |
| `bevel-light` vs `bevel-dark` | 54.1 | 52.1 | 51.5 | 56.5 | Safe — improved further after `bevel-light` was lightened for the contrast fix above; was 37.2 base/35.2 min at the earlier `#485170` draft. |
| `bevel-light` vs `panel-3-raised` | 36.1 | 34.8 | 34.5 | 37.7 | Safe — also improved by the same lightening; was 19.1 base/18.1 min (weak) at the earlier draft. |
| `bevel-dark` vs `panel-1-bg` | 6.1 | 5.4 — collapse | 5.4 — collapse | 5.8 — collapse | **Real limitation, not fixed** — see the usage-scoping note under the palette table in §3: don't rely on `bevel-dark` against `panel-1-bg` specifically; it works against `panel-2-surface`/`panel-3-raised` (ΔE ~12, weak-but-present, same edge-vs-fill caveat as above). |

## 10. UI structure (from `principles.md`, adapted)
`principles.md` was written in terms of a sprite/party-based genre; nothing here is sprite- or character-based, so its rules are kept at the structural level and re-pointed at MARSBOUND's actual elements (meters, cards, badges, drawers, buttons):

- **Ramps per element category.** Build a short color ramp per functional category (status/meter, interactive control, informational badge) rather than one global ramp. Reserve the sharpest, highest-contrast pairing for whatever is currently interactable or whatever is reporting a status change.
- **One signal color for "interactive."** `accent-signal` is the only hue used to mean "you can act on this," and it is also the one and only focus-ring color (amendment 1) — never reused decoratively. This is why rev. 1's second cyan-ish token (`highlight-cool-glow`) and the cyan-leaning `mid-teal` were retired, and why the new water meter-identity color (amendment 2) is blue, not cyan — there is exactly one cyan/teal-family color in the whole system.
- **Status tokens are reserved for status, full stop (amendment 5).** `green-bright`/`status-ok`/`status-low`/`status-critical`/`status-empty` mean one of the five meter states and nothing else — never borrowed for decoration, a badge, or any non-status UI. **`mid-slate` and `green-deep` are the mirror rule: art-only, never UI text or icon color (amendment 4)** — they exist for illustration, not chrome.
- **Three exact panel tiers, one hue family.** `panel-1-bg` / `panel-2-surface` / `panel-3-raised` — same hue, same saturation, lightness-only steps (§3). No other dark token substitutes for these three roles.
- **One consistent icon/badge raster density.** Every icon, glyph, and badge renders at the same visual weight and scale step as every other one (§6a) — no mixing crisp and soft renderings side by side.
- **Density with preserved legibility.** Panels may be information-dense, but every interactive target and status indicator must still read as an instantly distinguishable color cluster at a glance; prefer the most compact sizing step that still clears this bar.
- **Locked corner radius: 0, everywhere.** No soft-radius alternative token — this revision drops rev. 1's "sharp or one soft value" option down to a single fixed value.
- **Framing via inset borders and slot-style containers,** built from repeatable grid-aligned modules, rather than loose free-floating panels.
- **Authored state-change motion.** Value changes step rather than tween continuously; state transitions get a brief anticipation beat and an impact beat; successful outcomes get one short celebratory burst. Ambient/idle loops are the one place continuous, non-stepped motion is allowed (§9).
- **Typography at integer scale with generous line-height for body copy; tight-tracked capitals reserved for stats, labels, and short commands.**

## 11. Don't
- Don't use a true neutral gray/black anywhere in a shadow — every dark must carry a hue lean.
- Don't spread saturation evenly across a surface — concentrate it at focal points and let structural mass fall quiet.
- Don't smooth a gradient — keep visible, discrete color steps, except inside the specific dithered atmospheric fields called out in §5.
- Don't dither anything that isn't a large atmospheric/gradient field — never UI chrome, icons, badges, or text.
- Don't ring every silhouette with a uniform outline stroke — read form through value/hue contrast instead.
- Don't let a "highlight" or "glow" drop below near-maximum value — if it's not near-max, it's a midtone, not a highlight.
- Don't add a second cyan/teal-family color anywhere — `accent-signal` is the only one, and it only ever means "interactive."
- Don't mix icon/badge rendering densities on the same screen, or scale a raster asset by a non-integer factor.
- Don't use any corner radius other than the single locked value (§10).
- Don't give a light source a hard edge — it needs a bloom falloff.
- Don't interpolate new in-between colors for a new asset — reuse the 27 tokens in §3.
- Don't apply the one-focal-point rule (§9) to ambient/idle UI loops — those may hold multiple bright points live at once.
- Don't set `status-critical` or `status-empty` as small foreground text/icon color on any panel tier — both fail contrast outright; use them as a fill only, with the text-on-fill rule in §9a.
- Don't use `status-low` for small body text either — it only clears the UI/large-text bar (§9a).
- Don't use anything but `panel-1-bg` for text on a bright (≈L50%+) status/glow fill, or anything but `text-primary` for text on a darker one — see the text-on-fill table in §9a.
- Don't render `status-critical` fill text below bold 19px (amendment 3) — it needs to unambiguously clear the large-text contrast tier, not sit at its edge.
- Don't use `mid-slate` or `green-deep` as UI text, icon, or status color — art/illustration only (amendment 4).
- Don't reuse any status-ramp token for a non-status purpose, or vice versa (amendment 5).
- Don't rely on `bevel-dark` for an inset directly against `panel-1-bg` — use it against `panel-2-surface`/`panel-3-raised` only (§3, §9b).
- Don't give water a cyan-leaning hue — `water-blue` stays clearly blue so it can't be mistaken for `accent-signal`'s "interactive" meaning (§9b flagged this as a real risk at one draft value; the shipped value is lighter specifically to survive tritanopia).
- Don't add a second focus-ring color — it's always `accent-signal` (amendment 1).

## Appendix — raw extracted palettes (k-means, sorted by area share)

**Reference A — `mars-pic.jpg`** *(k=20, 700px thumbnail, full pixel set — re-run matched the original k=12/subsampled pass; reported here at the higher fidelity)*
```
#100e22  47.72%  H=248  L=0.09  S=0.42
#a74a43   4.83%  H=  4  L=0.46  S=0.43
#172d47   4.79%  H=213  L=0.18  S=0.52
#33182b   4.53%  H=319  L=0.15  S=0.36
#2e495a   3.72%  H=204  L=0.27  S=0.33
#f5bf4c   3.43%  H= 41  L=0.63  S=0.90
#562838   3.41%  H=339  L=0.25  S=0.36
#762834   3.40%  H=351  L=0.31  S=0.49
#f9a22b   3.36%  H= 35  L=0.57  S=0.95
#59122a   2.64%  H=340  L=0.21  S=0.66
#aa342a   2.61%  H=  5  L=0.42  S=0.60
#ef811c   2.56%  H= 29  L=0.52  S=0.87
#ce5031   2.54%  H= 12  L=0.50  S=0.61
#fae269   2.32%  H= 50  L=0.70  S=0.94
#854444   2.06%  H=360  L=0.39  S=0.32
#ed5a15   2.05%  H= 19  L=0.51  S=0.85
#df2f1c   1.70%  H=  6  L=0.49  S=0.77
#db813c   0.97%  H= 26  L=0.55  S=0.69
#5f817e   0.91%  H=174  L=0.44  S=0.15
#a7ad8c   0.44%  H= 72  L=0.61  S=0.17
```

**Reference B — `mars-surface.jpg`** *(k=20, 700px thumbnail, full pixel set)*
```
#fd6636  22.82%  H= 15  L=0.60  S=0.98
#e47f61  13.54%  H= 14  L=0.64  S=0.71
#3c2330   7.12%  H=329  L=0.19  S=0.26
#ec4d2f   7.03%  H= 10  L=0.56  S=0.84
#551b25   6.77%  H=349  L=0.22  S=0.52
#f0ac6a   5.57%  H= 29  L=0.68  S=0.82
#ea9967   5.57%  H= 23  L=0.66  S=0.76
#d63622   5.53%  H=  6  L=0.49  S=0.72
#f97043   4.24%  H= 15  L=0.62  S=0.93
#a0231b   3.38%  H=  3  L=0.37  S=0.71
#fc904b   2.88%  H= 23  L=0.64  S=0.97
#fcedbb   2.54%  H= 47  L=0.86  S=0.90
#230c1a   2.28%  H=324  L=0.09  S=0.50
#b8382a   2.18%  H=  6  L=0.44  S=0.63
#791412   2.18%  H=  1  L=0.27  S=0.75
#4c0f13   1.66%  H=356  L=0.18  S=0.67
#cb5b47   1.61%  H=  9  L=0.54  S=0.56
#802f2d   1.59%  H=  1  L=0.34  S=0.48
#ecc899   0.99%  H= 34  L=0.76  S=0.68
#97584f   0.52%  H=  7  L=0.45  S=0.31
```

**Reference C — `reference-style.jpg`** *(k=20, 700px thumbnail, full pixel set, no subsampling — the re-run that recovered the green range missed by rev. 1's shallower pass)*
```
#181c21  16.02%  H=215  L=0.11  S=0.15
#1f2432  12.53%  H=224  L=0.16  S=0.24
#142c46  11.04%  H=212  L=0.18  S=0.55
#1b4461   7.48%  H=205  L=0.24  S=0.57
#2d3546   7.13%  H=221  L=0.22  S=0.22
#3f2e2e   5.81%  H=359  L=0.21  S=0.16
#234027   5.80%  H=129  L=0.19  S=0.30  <- green
#2a6b7b   5.37%  H=192  L=0.32  S=0.49
#434a5c   4.84%  H=223  L=0.31  S=0.16
#2b8f9a   4.72%  H=186  L=0.39  S=0.57
#58e9b2   2.75%  H=157  L=0.63  S=0.77  <- green
#6a4138   2.60%  H= 12  L=0.32  S=0.31
#38b6c0   2.50%  H=184  L=0.49  S=0.55
#76666a   2.25%  H=346  L=0.43  S=0.07
#e88e60   1.92%  H= 20  L=0.64  S=0.75
#a76348   1.57%  H= 17  L=0.47  S=0.40
#577139   1.53%  H= 87  L=0.33  S=0.33  <- green
#e0d47f   1.44%  H= 53  L=0.69  S=0.61
#ba7d84   1.42%  H=353  L=0.61  S=0.31
#93ab5a   1.28%  H= 78  L=0.51  S=0.33  <- green
```
Green-range rows total ≈ 11.4% of frame (5.80 + 2.75 + 1.53 + 1.28).
