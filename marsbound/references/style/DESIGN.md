# DESIGN.md — Implementation spec

`STYLE.md` is the rationale (why these colors, what technique). This file is the implementation: the literal CSS variables, type scale, scene/sprite resolution rules, and component specs built from it. If the two ever disagree on a number, `STYLE.md` wins on color/value, this file wins on anything CSS-mechanical (padding, sizes, states).

None of this is wired into code yet — it's a spec for whoever edits `src/styles/theme.css` (Person B) and the component files next. Nothing here has been installed or added to the repo as a dependency.

---

## 1. CSS variables

Drop this into `theme.css`. Names match `STYLE.md` §3 token names exactly (kebab-case, `--color-` prefix) so the two documents stay traceable to each other.

```css
:root {
  /* Panel tiers + bevel — one hue family (226°, 22% sat), lightness only */
  --color-bevel-light: #6b78a3;   /* amendment 4 — lightened so it clears 3:1 on panel-2-surface */
  --color-panel-3-raised: #262b3b;
  --color-panel-2-surface: #1c202c;
  --color-panel-1-bg: #12141c;
  --color-bevel-dark: #08090c;

  /* Illustration-only shadow — never use these as UI chrome */
  --color-shadow-warm: #4a1c24;
  --color-shadow-neutral: #3d3a34;

  /* Midtones — illustration; mid-slate is art-only, never UI text/icon */
  --color-mid-hot: #d34022;
  --color-mid-ochre: #91633b;
  --color-mid-slate: #2e4f6b;

  /* Highlights */
  --color-hi-gold: #f7b645;
  --color-hi-pale: #f1e2b1;

  /* Glow / emitter family */
  --color-glow-ember: #f65f31;
  --color-glow-flare: #f8d362;
  --color-glow-violet: #bb67e4;
  --color-glow-magenta: #e755aa;

  /* Haze */
  --color-haze-dusty-sky: #bfa59b;

  /* Green ramp — green-deep is art-only, never UI text/icon */
  --color-green-deep: #223f26;
  --color-green-bright: #5cd68f;

  /* Status ramp — status meaning ONLY, never decorative (STYLE.md amendment 5) */
  --color-status-healthy: var(--color-green-bright);
  --color-status-ok: #edb91d;
  --color-status-low: #d05011;
  --color-status-critical: #a51f12;
  --color-status-empty: #4d1937;

  /* Accent / meter-identity / text */
  --color-accent-signal: #3fb6c4;   /* the ONLY cyan/teal; interactive + focus ring, nothing else */
  --color-water-blue: #95aae4;      /* Water meter identity only — not a second signal color */
  --color-text-primary: #f5efe6;
  --color-text-secondary: #a89a8c;

  /* Structure */
  --radius: 0;                                   /* locked, everywhere, no alternative */
  --focus-ring-color: var(--color-accent-signal);
  --focus-ring-width: 2px;
  --focus-ring-offset: 2px;

  /* 8px base grid (STYLE.md §6a) */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-6: 48px;
  --space-8: 64px;

  /* Type (rev. 3 — see §2) */
  --font-ui: "MB Digits", "Pixelify Sans", monospace; /* everything except NASA drawer paragraphs and stat numbers; MB Digits = Nunito Bold for 0-9 + − only */
  --font-reading: "Nunito", system-ui, sans-serif;  /* NASA drawer paragraph/lesson text ONLY */
  --font-stat: "Press Start 2P", monospace;         /* meter values + Sol counter ONLY — re-added in rev. 3 */
  --text-body: 18px;     /* floor — CLAUDE.md hard rule, never go below this */
  --text-emphasis: 20px;
  --text-subhead: 24px;
  --text-heading: 32px;
  --text-hero: 40px;
  --text-stat: 32px;     /* big meter/Sol numbers, --font-stat — integer of 8 (amendment 2) */
  --line-ui: 1.3;
  --line-reading: 1.55;
  --line-stat: 1.15;
  --tracking-ui: 0.02em;
}
```

**Usage rule for the two art-only tokens:** `--color-mid-slate` and `--color-green-deep` exist in this file so illustration/background assets can reference them, but no component spec in §5 uses them for `color`, border, or fill on interactive/text elements — if you find yourself reaching for either on a button, card border, or label, that's the wrong token (see STYLE.md §10/§11).

## 2. Fonts and allowed sizes

**Rev. 3 of this section — three fonts, three scoped jobs.** Rev. 2 collapsed everything down to Pixelify Sans + Nunito, retiring Press Start 2P entirely. Press Start 2P is back, but scoped narrowly to the one thing it's actually good at: short, punchy numeric stat displays — not general UI text.

- **Digits face (Phase 2 amendment).** Pixelify Sans draws the digit 5 so it reads as the letter S ("+5" looks like "+S"), which matters for kids reading costs. `theme.css` declares a font-face named "MB Digits" from the Nunito Bold file, limited by `unicode-range` to `0-9`, `+` and the real minus `−` (U+2212), and puts it first in `--font-ui`. Every other character still falls through to Pixelify Sans. Meter values and the Sol counter stay in Press Start 2P (`--font-stat`). The style guide has a digit test line at 18px.
- **`--font-ui` ("Pixelify Sans" plus the digits face)** — the default for everything *except* stat numbers and drawer paragraphs: challenge intros, option text, debrief lines, button labels, meter labels, headings, chip text. Unlike Press Start 2P, Pixelify Sans has normal upper/lowercase letterforms rather than a fixed-width all-caps bitmap grid, so it holds up for full sentences, not just short labels.
- **`--font-reading` ("Nunito")** — reserved for **NASA drawer paragraph and lesson text only** (the `text` and `lesson` fields from `nasaContent.js`). That content is the longest sustained reading in the app and carries real citations/facts, so it gets the plainest, most road-tested-for-legibility typeface instead of either pixel-styled font. The drawer's title, badge, and source-link text stay `--font-ui` — only the paragraph body switches.
- **`--font-stat` ("Press Start 2P")** — **meter values and the Sol counter only** (e.g. "75", "SOL 2"). This is exactly Press Start 2P's classic use case — large, short numeric/arcade-style readouts — and exactly where its fixed-width all-caps bitmap grid is a feature, not the legibility problem it would be in a sentence. Capped hard at short numeric/few-character strings; never a label with more than a couple characters, never a sentence.

**Legibility check at 18px — now split by font, since rev. 3 has two display-ish fonts instead of one:**
- **Pixelify Sans:** designed to read at small sizes (normal letterforms, not a literal 8×8 bitmap font), so 18px should hold up for short-to-medium UI text. Untested with the actual target readers (ages 7–12) so far.
- **Press Start 2P:** only ever used at `--text-stat` (32px) in this spec, for 1–5 character strings — well above its known-legible range for that length, so no 18px legibility question applies to it; it's never used at 18px at all, by design.
- **Do a real legibility pass with a few kids in the target age range once this ships**, for Pixelify Sans specifically — if any specific passage is genuinely straining at 18px, move *that* content type under the `--font-reading` rule rather than shrinking text below the 18px floor or making a per-screen exception.

**Allowed sizes — nothing below 18px, ever** (CLAUDE.md hard floor):

| Token | Size | Use |
|---|---|---|
| `--text-body` | 18px | Body copy, option text, lesson text, secondary labels — the floor, not a default to go below |
| `--text-emphasis` | 20px | Button labels, emphasized body text |
| `--text-subhead` | 24px | Card/section subheadings, chip labels |
| `--text-heading` | 32px | Screen headings |
| `--text-hero` | 40px | Title screen only |
| `--text-stat` | 32px | Big meter/Sol numbers, `--font-stat` (Press Start 2P) |

`status-critical` **and `status-low`** fill text share one stricter floor — **bold, `--text-subhead` (24px) or larger, never `--text-body`** (amendment 3 extended this to Low, not just Critical) — comfortably past the plain "large text" contrast tier rather than sitting at its edge.

Line height: `--line-reading` (1.55) for `--font-reading` paragraphs; `--line-ui` (1.3) for everything in `--font-ui`; `--line-stat` (1.15) for `--font-stat` numbers, which are short and don't need breathing room.

## 3. Scene resolution + responsive scaling (overscan, not blur) — corrected

**Rev. 2 of this section.** The first version of this spec said to use `object-fit: cover` to avoid blur. That was wrong: `object-fit: cover` scales the image by *whatever ratio makes it fill the box* — box-size ÷ native-size is essentially never a clean integer, so `cover` is actually a non-integer-scaling mechanism, i.e. exactly the blur source STYLE.md §6a/§11 forbids. Corrected approach below.

"Scene" = a large illustrated background (Intro's Mars photo slide, Title screen art, any future full-bleed illustration) — as opposed to UI chrome, which is handled by the 8px grid in §1/§4.

**The rule: author small, scale by a fixed integer, crop with `overflow: hidden`, pan with `object-position` — never `object-fit: cover`.**

1. **Author scenes at a small native canvas**, same logic as icons (§4) but scaled up for a bigger asset — e.g. a decorative strip scene at **400×60px native**.
2. **Pick the display scale from a fixed breakpoint list, not a computed ratio.** Each breakpoint maps to exactly one integer multiplier — e.g. viewport ≤900px → **2×** (strip renders at 800×120px), viewport >900px → **3×** (1200×180px). No breakpoint ever lands on a non-integer multiplier.
3. **Set the `<img>`'s actual `width`/`height` in CSS to that exact scaled pixel value** (`width: 800px; height: 120px` at the 2× breakpoint) — never `width: 100%` or any percentage/viewport unit on the image itself, since that's what reintroduces non-integer scaling.
4. **Wrap it in a container sized to the visible slot, with `overflow: hidden`.** The scaled image (800×120 at 2×) is very likely bigger than the container that's supposed to show it — that size mismatch is the "overscan": the extra image is simply clipped by `overflow: hidden`, not squashed to fit.
5. **Use `object-position` (or, for a CSS background, `background-position`) to choose which part of the oversized, cleanly-scaled image is visible inside that clipped container** — this is the pan/crop control, decoupled entirely from the scaling math in steps 2–3.
6. **`image-rendering: pixelated`** on the `<img>`/background always, so the browser's own upscaling from native→display pixels (which *is* happening, by the fixed integer factor from step 2) stays crisp rather than smoothed.
7. **High-DPI screens** still get a real `@2x`/`@3x` *source* asset via `srcset` for the device-pixel-ratio dimension — that's a separate axis from the CSS display-scale breakpoint in step 2, and both stack multiplicatively (e.g. a 3× CSS breakpoint on a 2×-DPR screen loads the `@2x` source and displays it at 3× CSS scale, landing on 6× real device pixels — still a clean integer throughout).
8. **Compose the scene's focal point (STYLE.md §9's one-focal-point rule) inside the middle ~70% of the native canvas**, so panning via `object-position` across the supported breakpoints never crops it out.

## 4. Sprite / icon sizes

Two categories, with different flexibility (amendment 6) — and every icon in this spec is a drawn pixel icon, not an emoji glyph (amendment 8; see the note at the end of §5 for what's actually synced to this vs. not yet).

**UI icons — functional, locked to exactly 16 or 32 native, no other size.** These carry meaning (status, challenge identity, badge type), so they stay rigid for the "one consistent icon/badge raster density" rule (STYLE.md §10):

| Native size | Use | Integer display sizes |
|---|---|---|
| 16×16px | Status dots, small meter icons | 16 / 32 / 48 / 64px |
| 32×32px | Challenge pixel icons (life-support, radiation, power, greenhouse, earth-signal), NASA-source badge icon, larger drawer art | 32 / 64 / 96 / 128px |

**Amendment (Phase 2): all pixel icons are drawn at 16×16 and shown at 2× (32px).** The 34 icons in `src/components/icons/pixelMaps.js` (meters, statuses, challenges, interface, badges) are authored on one 16×16 grid and the `Icon` component shows them at integer scale only (1×, 2×, 3× or 4×; 2× is the standard size). Challenge and badge icons are drawn at 16×16 too, not 32×32: at 2× they get the same 2px pixel as the meter and status icons, so one screen never mixes pixel densities. The 32×32 row above is kept for drawer art that is later drawn at 32×32. Icons use at most 4 tokens; only the five status icons use status tokens; no icon uses `accent-signal`; `green-bright` appears only on `plant`, `greenhouse` and `status-healthy` (plant is the accepted exception: a seedling with a gold-rimmed ochre pot, a different silhouette from the greenhouse dome).

**Scene sprites — decorative, any multiple of 8 native.** A sprite placed *inside* a scene illustration (§3) — a rock, a plant, a star-field speck, a parallax layer element — isn't carrying UI meaning on its own, so it can be authored at whatever native size fits the art (8, 16, 24, 32, 40, 48px…), as long as it's still displayed only at an integer multiple of *its own* native size. Don't use this flexibility for anything in the UI-icon table above.

## 5. Component specs

All components: `border-radius: var(--radius)` (0), minimum touch target 48×48px for anything tappable, padding and sizing on the `--space-*` 8px grid, focus state always `outline: var(--focus-ring-width) solid var(--focus-ring-color); outline-offset: var(--focus-ring-offset)`.

Depth is drawn with a **1px bevel edge** (top/left one color, bottom/right another — from `--color-bevel-light`/`--color-bevel-dark`), never a soft drop-shadow blur. "Raised" = light edge top/left, dark edge bottom/right. "Inset/pressed" = the same two edges swapped.

### Button
- Default: `background: var(--color-panel-2-surface)`; `border: 2px solid`, top/left `var(--color-bevel-light)`, bottom/right `var(--color-bevel-dark)` (raised).
- Hover: `background: var(--color-panel-3-raised)`.
- Active/pressed: swap the bevel edges (top/left `--color-bevel-dark`, bottom/right `--color-bevel-light`) and shift label `transform: translate(1px, 1px)` — a real pressed-frame, not a shadow fade.
- **Primary/CTA button (amendment 7): fully filled, not just bordered.** `background: var(--color-accent-signal)`, no bevel border (a solid fill reads as "the one main action" on its own), text `var(--color-panel-1-bg)` — computed contrast 7.61, AA-normal pass. (`var(--color-text-primary)` on `accent-signal` is only 2.11 — a real fail — which is exactly why the text color has to be the dark panel tone here, not the usual light text color.) Hover: fill lightens by swapping to a 10%-lighter mix, or simplest, just apply a 1px `--color-bevel-light` inner border on hover without changing the fill. Active/pressed: same 1px translate as the standard button.
- Disabled: `background: var(--color-panel-1-bg)`, `color: var(--color-text-secondary)`, no bevel, no hover/active states.
- Text: `--color-text-primary` (standard button) or `--color-panel-1-bg` (primary/CTA fill only), `--font-ui`, `--text-emphasis` (20px), min-height 48px, padding `var(--space-2) var(--space-3)` (16px 24px).

### Card (challenge card, option card)
- Default ("slot" styling, per `principles.md`'s inventory-slot framing): `background: var(--color-panel-2-surface)`; border 2px, top/left `--color-bevel-dark`, bottom/right `--color-bevel-light` (inset — a card is a slot you select, not a button you press).
- Selected/active: `background: var(--color-panel-3-raised)`, border color `var(--color-accent-signal)` (2px, replaces the bevel on all four sides while selected).
- Done/disabled (a completed challenge): `background: var(--color-panel-1-bg)`, `color: var(--color-text-secondary)`, bevel removed (flat) but **keeps a 1px `--color-panel-2-surface` edge** so the slot stays visible on a `--color-panel-1-bg` page (padding grows by 1px to keep the card the same size), not interactive.
- Padding `var(--space-3)` (24px) all sides; heading `--font-ui`/`--text-subhead`, body `--font-ui`/`--text-body`.

### Meter bar — text-on-fill table re-run (amendment 3)
- Track (empty portion): `background: var(--color-panel-1-bg)`, border 1px `var(--color-bevel-dark)` (inset slot, per `principles.md`'s "health bars").
- Fill: whichever status color applies to the current value (`--color-status-healthy/ok/low/critical/empty`).
- **Every text/background pair for the fill case, recomputed** (not re-stated from memory — rerun because amendment 3 asked for it, and it actually changed one answer: `status-low` reads better with `panel-1-bg` text than `text-primary`, which the original spec had backwards):

  | Fill | Best foreground | Ratio | Verdict | Weight/size |
  |---|---|---|---|---|
  | `status-healthy` (green-bright) | `panel-1-bg` | 10.04 | AA-normal | regular, `--text-body` ok |
  | `status-ok` | `panel-1-bg` | 10.12 | AA-normal | regular, `--text-body` ok |
  | `status-low` | `panel-1-bg` | 4.23 | AA-large/UI | **bold, `--text-subhead` (24px)+ (amendment 3)** |
  | `status-critical` | `text-primary` | 6.55 | AA-normal | **bold, `--text-subhead` (24px)+ (amendment 3)** |
  | `status-empty` | `text-primary` | 12.17 | AA-normal | regular ok, but see outline rule below |

  (For reference, the losing option at each row: `text-primary` on healthy/ok = 1.60/1.59, both fail; `text-primary` on low = 3.80, worse than panel-1-bg's 4.23; `panel-1-bg` on critical/empty = 2.45/1.32, both fail.)

- **Amendment 3 — 1px outline on Critical/Empty fills and dots.** Both `status-critical` and `status-empty` additionally get `box-shadow: 0 0 0 1px var(--color-text-primary)` (or `outline`, same effect) around the fill or dot shape itself. This doesn't change the contrast *ratio* above — WCAG contrast math only ever compares two flat colors, an outline isn't part of that formula — it's a separate, additive boundary cue: a thin light edge makes a dark, low-contrast shape visually separate from an equally dark panel behind it, which matters most for the small status *dot* (a few px across) where there's no room for a text label to help.
- Height 24px (`var(--space-3)`), full width of its row; value number in `--font-stat`/`--text-stat` sitting over the fill, status word + pixel icon beside it in `--font-ui` (word + colour + icon, never colour alone — CLAUDE.md §5.1/§8).
- Water meter only: the meter label/heading (not the fill — the fill still follows status color) uses `--color-water-blue` as its identity accent, since that's the one meter this amendment gave a dedicated identity color. Oxygen/Power/Crew Health/Science keep their existing icon-only identity; don't invent new identity colors for them without being asked.

### Drawer (NasaDrawer)
- Backdrop: `background: var(--color-panel-1-bg)` at ~70% opacity, covering the viewport.
- Panel: `background: var(--color-panel-2-surface)`, border 2px solid `var(--color-panel-3-raised)`, radius 0.
- Laptop: anchored under the trigger button (absolute, `top: 100%`), max-width ~420px.
- Phone (≤640px): full-screen sheet — `position: fixed; inset: 0`, `background: var(--color-panel-1-bg)` (promoted to the root tier since it now owns the whole screen), inner content cards at `--color-panel-2-surface`.
- Close button: standard Button spec, 48×48px, pixel icon only (✕ as a drawn pixel glyph, not the Unicode ✕ character, for density-consistency with the other UI icons — see §4).
- Radiation bar chart inside: same Meter bar track/fill logic, scaled down (height 16px).
- **Font exception (amendment 5): the drawer's `text` and `lesson` paragraph content renders in `--font-reading` (Nunito), `--line-reading` line-height.** Everything else in the drawer — the "How NASA handles this" title, the REAL/GAME badge, the source link, the game-note line — stays `--font-ui` (Pixelify Sans), same as the rest of the app. This is the *only* place `--font-reading` is used.

### Modal (Confirm / Result)
- Backdrop: same as Drawer.
- Panel: `background: var(--color-panel-3-raised)` (the topmost tier — modals sit above drawers), border 2px `var(--color-bevel-light)` top/left + `var(--color-bevel-dark)` bottom/right, radius 0, max-width 480px (`var(--space-8)` × 7.5, i.e. 60 grid units), centered.
- Mission-ending warning block (Confirm pop-up): `background: var(--color-status-critical)` (fill), text `var(--color-text-primary)`, **bold, `--text-subhead` (24px) minimum**, plus the amendment-3 1px `--color-text-primary` outline around the block — this is the literal "bold, high-contrast block" CLAUDE.md already requires, now backed by the §9a/Meter-bar contrast numbers instead of guessed.
- NOW→AFTER meter columns: plain `--color-text-primary` labels over `--color-panel-2-surface` sub-panels; arriving-tomorrow list same treatment.

### Chips
- Warning chip (Dashboard card warnings — "costs 8 Oxygen…"): `background: var(--color-panel-3-raised)`, left border 4px `var(--color-status-low)`, text `--color-text-primary`, height ~32px, padding `var(--space-1) var(--space-2)`.
- Nickname suggestion chip (Nova/Comet/Orbit): `background: var(--color-panel-2-surface)`, border 2px bevel (same raised logic as Button, since it's clickable), selected state border `var(--color-accent-signal)`.
- Badge chip (REAL NASA / GAME NUMBERS — rendered with a drawn pixel icon, not the 🟦/🟧 emoji, per amendment 8): `background: var(--color-panel-1-bg)`, text colored per badge — badges aren't "interactive," so they don't get `accent-signal`. Use `--color-hi-pale` text for REAL NASA and `--color-glow-flare` text for GAME NUMBERS (both pass contrast against `--color-panel-1-bg` comfortably per the highlight family's general contrast margin — recompute if these specific pairs ever get questioned, the same way §9a did for status).

**Note on amendment 8's scope, updated:** `CLAUDE.md`'s "Look"/"Status colours" paragraph and `WIREFRAMES.md`'s "Visual rules" section have since been synced to say pixel icons, not emoji (no game number/rule/NASA fact touched in that sync). Two things are still *not* synced, deliberately out of scope so far: (1) `WIREFRAMES.md`'s dozens of ASCII mockup boxes elsewhere in that file still literally draw 🟦🟧🟢🟡🟠🔴⚫🫧⚡☢️🌱📡 as the layout illustration — rewriting every mockup is a much bigger job than a rules-section sync and hasn't been asked for; (2) no actual `statusLabel`/icon code exists yet to migrate from emoji to real pixel-icon assets. Both are flagged, not fixed.

---

## 6. Replacement visual-rules block (for `CLAUDE.md` and `WIREFRAMES.md`)

This is the literal text to paste over the neumorphism language in both files — written once here so the two docs don't drift from each other again.

> **Style: pixel-art / glow (see `references/style/STYLE.md` and `DESIGN.md`).** Not neumorphism, not soft shadows. Every screen and pop-up follows it. A single tinted-dark panel family (`--color-panel-1-bg` / `--color-panel-2-surface` / `--color-panel-3-raised` — one hue, lightness-stepped only) is the base; it is never true neutral gray/black.
> - **Depth is drawn with a 1px bevel edge, not a soft shadow.** "Raised" (buttons, selectable chips) = light edge top/left, dark edge bottom/right, from `--color-bevel-light`/`--color-bevel-dark`. "Inset/pressed" (cards/slots, meter tracks, a pressed button) = the same two edges swapped. No blurred drop-shadows anywhere.
> - **Corner radius is locked to 0, everywhere.** No rounded corners, no exceptions.
> - **`--color-accent-signal` (teal) is the only color that ever means "you can act on this,"** and it is also the only focus-ring color. It's never used decoratively.
> - **Status, meters and badges use the fixed 5-step status ramp** (`--color-status-healthy/ok/low/critical/empty`) plus the glow/highlight families for emphasis — always word + colour + icon, never colour alone. Text/icon color on any fill follows the fill's own lightness (see `DESIGN.md` §5's Meter bar spec); Critical and Low fill text are bold 24px+, and Critical/Empty fills and dots carry a 1px light outline on top of that.
> - Buttons ≥48px tall with a visible pressed/impact state and focus outline. Text ≥18px always, `--font-ui` (Pixelify Sans) by default; `--font-reading` (Nunito) only for NASA drawer paragraph/lesson text; `--font-stat` (Press Start 2P) only for meter values and the Sol counter (`DESIGN.md` §2).
> - The NASA drawer, Confirm and Result pop-ups get a `--color-panel-1-bg` backdrop at ~70% opacity behind them so they stand out.
> - Text at least 18px. Buttons at least 48px tall.
> - Every status uses **word + colour + icon** (drawn pixel icons, per `DESIGN.md` §4/§8).
> - Short sentences (about 12 words). Explain every science word once.
> - Badge every NASA item: REAL NASA or GAME NUMBERS, each with its pixel icon. Never write "live" for saved or archived data.
> - No sound. No NASA logo.

**`CLAUDE.md` and `docs/WIREFRAMES.md` have been synced to this version** (three-font system, 32px stat size, filled CTA, outlined Critical/Empty, pixel icons) — no game number, rule, or NASA fact changed in that sync, only the visual-rules language. If this block changes again, re-sync both.
