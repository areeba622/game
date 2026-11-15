# MARSBOUND — Redesign plan (Phase 1: analysis only)

Status: **read-only analysis. No code, no `theme.css`, no component has been changed.**
Revision 2 adds: drawn 16×16 pixel-map icons (§3.1), a CSS-only `SceneBackdrop` (§3.2), and the `legacy.css` migration strategy (§3.3).
Goal: move the flat layout in `docs/WIREFRAMES.md` from the current neumorphic look to the pixel/glow system in `references/style/STYLE.md` + `DESIGN.md`, without touching game logic, numbers, reducer, NASA data, props or handlers. Base Hub and Room Scene are out of scope.

Read for this plan: `CLAUDE.md`, `STYLE.md`, `DESIGN.md`, `principles.md`, `WIREFRAMES.md`, `WIREFRAMES_ADDENDUM.md`, `STORY_AND_MOTION.md`, 
`STORY_AND_MOTION_ADDENDUM.md`, `KID_TEXT.md`, and every file in `src/screens`, `src/components`, `src/styles`, plus `App.jsx`, `main.jsx`, `index.css`, `App.css`, `kidText.js`, `missionControlLine.js`, `statusLabel` in `game.js`.

---

## 0. Ground truth (corrects my earlier audit)

My earlier audit described 8–26 line stub screens. That was a stale checkout. Today `main` (ac920f7) has every screen and 12 components built by Person B, merged from `dev-b-ui`:

- **All 8 screens exist and are wired to the real reducer/actions.** Only `Title`, `Callsign`, `Intro`, `Dashboard`, `Challenge`, `SolSummary`, `Debrief` and `Sources` are screens. `Challenge` owns the Confirm and Result pop-ups.
- **`src/styles/theme.css` already exists (1199 lines) and is neumorphism on navy with a Mars-orange accent.** Its own header says so. That is exactly the look `CLAUDE.md` / `WIREFRAMES.md` / `DESIGN.md` now forbid. Phase 2 therefore **replaces** it, not "creates" it.
- `index.css` and `App.css` are already emptied (one comment line each). `main.jsx` already imports `./styles/theme.css`.
- The three self-hosted font files and OFL licenses I downloaded are in `src/assets/fonts/` (untracked). Nothing uses them yet.
- `docs/KID_TEXT.md` and `docs/STORY_AND_MOTION.md` now exist (they were missing in my first read). `MARSBOUND_Complete_Game_Plan.md` still does not.
- `CLAUDE.md` and `WIREFRAMES.md` have uncommitted edits (the pixel-style rewrite). Tests exist only for `src/game` (`game.test.js`, `debrief.test.js`); no component or DOM tests.

---

## 1. Rules I will follow in every phase

- Never touch `src/game/*`, the reducer in `App.jsx`, game numbers, endings, NASA data/facts, props, state or handlers.
- Keep all text unchanged (including the `TODO` text in `ResultModal`). Markup changes only where needed to swap emoji for `<Icon>` and plain tags for shared components.
- Styling-only edits in `NasaDrawer.jsx` and `Sources.jsx` are authorised. No content or logic edits there.
- Today's `theme.css` is kept as `src/styles/legacy.css` until the last screen is migrated (§3.3). It is deleted only in a final cleanup step you approve.
- No new packages without asking. Screenshots need a browser: I will check for a built-in/Chrome tool first, and ask before adding Playwright.
- After every screen: `npm test`, `npm run build`, screenshots at 360 px and 1280 px, list of differences from `STYLE.md`, one commit, stop for review.

---

## 2. Global findings (apply to every screen)

### 2.1 Current `theme.css` versus DESIGN.md

| Area | Today | DESIGN.md / STYLE.md requires |
|---|---|---|
| Surfaces | One flat navy (`#1e2740`) that reads raised or pressed | Three stepped tiers `panel-1-bg #12141c` / `panel-2-surface #1c202c` / `panel-3-raised #262b3b` (hue 226°) |
| Depth | 23 uses of soft `--shadow-*` variables, 20 `box-shadow` rules | 1–2 px bevel edges (`bevel-light` / `bevel-dark`), raised vs inset by swapping edges. No blur anywhere |
| Corners | 19 `border-radius` rules: 12, 18, 24 px, pill 999 px, 50% | `--radius: 0` everywhere (the Intro dots and the Empty status disc are round today) |
| Interactive colour | Orange `--accent #ff7a3d` is the primary button **and** a decoration (Sol label, storm size, science value, title subtitle, selected chip, `+` in table) | Teal `accent-signal #3fb6c4` means "you can act on this" and nothing else. It is the only focus ring colour. Primary button: filled teal, `panel-1-bg` text |
| Status colours | Own hexes (`#4ade80`, `#facc15`, `#fb923c`, `#ff6b6b`, `#e2e8f0`), applied as **text colour** on the panel | Fixed ramp `healthy / ok / low / critical / empty`. Critical and Empty fail contrast as plain text (2.45, 1.32) and Low only passes large-text. They must be fills/chips with the text-on-fill rule and a 1 px `text-primary` outline on Critical/Empty |
| Status tokens used for non-status | Green/orange status colours also colour gain/cost chips, storm safe/hit, "DONE", good-line, tips, shelter tags | Status tokens are reserved for the five meter states (STYLE amendment 5) |
| Fonts | One `system-ui` stack, no `@font-face` | `--font-ui` Pixelify Sans (default), `--font-reading` Nunito (NASA drawer paragraph + lesson only), `--font-stat` Press Start 2P (meter values + Sol counter only, 32 px) |
| Type scale | 18 / 22 / 28 / 40 px (`--font-lg` 22 and `--font-xl` 28 are not on the scale); Title clamps to 44–80 px | 18 body, 20 emphasis, 24 subhead, 32 heading, 40 hero (Title only), 32 stat |
| Focus | 3 px two-ring `box-shadow` in `--accent-strong` | `outline: 2px solid accent-signal; outline-offset: 2px` |
| Backdrop | `rgba(6,9,18,.78)` | `panel-1-bg` at about 70 % |
| Gradients | 2 radial gradients (Title, Mars photo placeholder), 3 `rgba()` | Posterised steps. Dither only in large atmospheric fields |
| Hard-coded colours | 19 hex values in `theme.css` (for example `#0b0d10` behind the photo, `#b3261e` danger) | Only the 27 tokens |
| Meter motion | `transition: width 300ms ease` (smooth tween) | Value changes step (STYLE §10, STORY_AND_MOTION §6: steps of 5) |
| Tap targets | Buttons and inputs are 48 px. The three text links (`Sources.jsx` 46 and 65, `NasaDrawer.jsx` 79) are plain inline text, under 48 px | Anything tappable at least 48 px |
| Meter track | 18 px high | 24 px (`--space-3`) with a 1 px `bevel-dark` inset border |

### 2.2 Emoji and glyphs: three layers, only two are mine to change

1. **Data I may not edit (`src/game`).** `statusLabel()` returns emoji `🟢🟡🟠🔴⚫` and `CHALLENGES[id].icon` is `🫧 ☢️ ⚡ 🌱 📡`. Plan: `<Icon>` is selected by **word / id / key**, never by the emoji string, and the screens stop printing those fields. `statusLabel().color` is already ignored.
2. **Presentation data in `components/kidText.js` (Person B).** `METER_INFO` icons `🫧 💧 ⚡ 🧑‍🚀 🔬`. I will replace them with icon names.
3. **Literal characters in JSX.** Inventory:

| File | Glyphs |
|---|---|
| `Callsign.jsx` | ⚠ |
| `Challenge.jsx` | ← Back (×2), ⚠ (×2), 🛰, ▲ ▼, data icons for title, meters and status |
| `ChallengeCard.jsx` | ⚠, ✓, data icon |
| `ConfirmModal.jsx` | meter icons, → in the table, ☂, ⚠ (×3) |
| `Debrief.jsx` | ★, ✓, •, 🛰, 🟦, 🟧 |
| `EffectChips.jsx` | meter icons |
| `MarsPhoto.jsx` | 🟦 |
| `MeterPanel.jsx` | 🔬, ✓, ✗ |
| `MissionControl.jsx` | 📻 |
| `MorningReport.jsx` | 🌅, 🌱, 📡 |
| `OptionCard.jsx` | ☂, ⚠ |
| `ResourceBar.jsx` | meter icon + status icon (data) |
| `ResultModal.jsx` | 🌩, 🌱, 📡, 🟦 (×2) |
| `SolSummary.jsx` | ☀, 🌩, ☂, 🌙, ⚠, ⏳, data icon |
| `Sources.jsx` | ← Back, 🟦, 🟧 |
| `StormForecast.jsx` | ☀, 🟦, 🌩, ☂, ⚠, ✓ |
| `NasaDrawer.jsx` | 🟦, 🟧 (×2), 🛰, ✕ |

About 35 distinct icon uses. The icon registry needs roughly: 5 meters, 5 statuses, 5 challenges, 2 badges (real / game), plus ui: warning, check, cross, close, arrow-left, arrow-right, shelter, sun/storm, flare, night, hourglass, radio, sunrise, plant, satellite, star, bullet, expand/collapse.

Font risk: Pixelify Sans (latin subset) very likely has no `← → ✓ ✗ ★ ▲ ▼`, so they would fall back to a system font and look wrong. Replacing them with `<Icon>` removes the risk. U+2212 (the real minus used in all chips) must be checked in the downloaded subset during Phase 2. The Press Start 2P digit-only use is safe.

### 2.3 Inline styles

Only two, both data-driven widths: `ResourceBar.jsx:26` and `NasaDrawer.jsx:64`. I will keep them (a width from data cannot be a static class) but pass them as a CSS variable. `NasaDrawer.jsx:89-205` has a 117-line inline `<style>` block that duplicates `theme.css` conventions: it moves into `theme.css` (styling-only, authorised).

### 2.4 Suspected existing bug (verify in Phase 2 screenshots)

`NasaDrawer` is `position: absolute; top: 100%` and expects a `position: relative` wrapper. `.challenge-nasa` in `theme.css` has none. On laptop the drawer may anchor to the page, not under the button. I will confirm visually before touching anything.

---

## 3. Shared components

Existing screen-level components keep their **names and props**. The new primitives sit underneath them.

| Component | Status | Plan |
|---|---|---|
| `Icon` | new | Drawn 16×16 pixel maps (34 icons), rendered as crisp inline SVG at integer scale. No letter boxes, no emoji. Full spec in §3.1 |
| `SceneBackdrop` | new | CSS-only atmospheric field behind Title, Dashboard and Sol Summary. Full spec in §3.2 |
| `Button` | new | `default` and `primary`, plus `disabled`. Bevel raised and pressed, 48 px tall, `--text-emphasis`. New `mb-` classes; it never styles bare `<button>`, so unmigrated screens are untouched (§3.3) |
| `Card` | new | Inset slot (default), selected, done. Replaces `.card`, `.sources-section`, `.challenge-card`, `.option-card` shells |
| `MeterBar` | new primitive; `ResourceBar` becomes a thin wrapper (same props `{label, icon, value}`, still calls `statusLabel`) | 24 px inset track, stepped fill, value in `--font-stat`, status shown as a chip (fill + text-on-fill rule + Critical/Empty outline) with word + `Icon` |
| `Chip` | new | `warning` (4 px `status-low` left border), `cost` and `gain`, `suggestion` (Nova/Comet/Orbit, `aria-pressed`), `badge-real`, `badge-game` |
| `Modal` | exists | Keep focus trap / Esc logic untouched. Restyle shell: `panel-3-raised`, bevel, 70 % backdrop, plus the red mission-ending block (`status-critical` fill, bold 24 px, outline) |
| `DialogueBox` | new | Speaker tag + up to 3 short lines on `panel-3-raised`. Used for Mission Control and Intro lines. **Static text now**; no typewriter (see §6) |
| `EffectChips`, `ChallengeCard`, `OptionCard`, `MeterPanel`, `StormForecast`, `MorningReport`, `MissionControl`, `ConfirmModal`, `ResultModal`, `MarsPhoto` | exist | Restyle to use the primitives. No prop or handler change |

New files go in `src/components` plus a dev-only `style-guide.html` (not a build input, no `vite.config.js` change unless I find it is unavoidable, in which case I ask first).

### 3.1 Icon: drawn 16×16 pixel maps

**Format.** Each icon is 16 strings of 16 characters in `src/components/icons/pixelMaps.js`. `.` is transparent; any other character is a key into that icon's own small palette, whose values are token names only (for example `{ a: 'text-primary', b: 'water-blue' }`). `Icon` converts each map to one inline `<svg viewBox="0 0 16 16" shape-rendering="crispEdges">` with merged horizontal runs of `<rect>`s filled by `var(--color-…)`. No bitmap files, no extra requests.

**Scale.** Prop `scale` accepts 1, 2, 3 or 4 only (16, 32, 48, 64 px); anything else is clamped to an integer. Default is 2 (32 px). Every icon on a screen uses the same scale family so the pixel size stays consistent (STYLE §10). Never `width: 100%`.

**Accessibility.** Decorative: `aria-hidden="true"`. When it is the only signal (status, shelter, warning): `role="img"` plus `aria-label`. The status word is always printed next to the status icon.

**Core set to draw (29):**

| Group | Icons | Notes |
|---|---|---|
| Meters (5) | oxygen (bubbles), water (drop), power (bolt), crew (helmet), science (flask) | Identity colours: `text-primary`, `water-blue`, `glow-flare`, `hi-pale`, `glow-violet`. Never teal and never status tokens |
| Statuses (5) | healthy, ok, low, critical, empty | **Different silhouettes**, not only colours: circle with check, diamond, triangle, octagon with bar, hollow square with cross. Filled with the matching `status-*` token. Critical and Empty carry a 1 px `text-primary` pixel outline (DESIGN §5). These are the only icons that may use status tokens |
| Challenges (5) | life-support, radiation, power-budget, greenhouse, earth-signal | Drawn in the same 16×16 grid at 2× so their pixels match the meter icons (see §5 item 11) |
| UI (14) | warning, check, close, arrow-left, arrow-right, arrow-up, arrow-down, shelter, sun, storm, radio, plant, satellite, star | `close` also serves as the "✗" mark. Up/down arrows replace ▲ ▼ on the NASA button |

**Extra icons I will also draw (5), because screens currently use them and you listed none:** `globe` (REAL NASA badge), `die` (GAME NUMBERS badge), `moon` (night), `hourglass` (arriving tomorrow), `sunrise` (Morning report). Without them those spots would be left as emoji. Total 34.

**Rules while drawing.** Tokens only (no new colours); at most 4 colours per icon; transparent background; 1 px of padding so shapes read at 1×; no anti-aliasing; no teal anywhere.

**Checks.** (a) A small `vitest` file `icons/pixelMaps.test.js` asserts every map is exactly 16×16 and uses only keys in its palette and tokens that exist. (b) The style guide has an icon sheet at 1×, 2× and 4×, and a greyscale-and-simulated-colour-blindness pass on the five status icons. (c) A contrast check of each meter icon colour against `panel-1/2/3` (non-text 3:1).

### 3.2 SceneBackdrop (CSS-only)

**Where.** First child of `Title`, `Dashboard` and `SolSummary` (`<SceneBackdrop variant="title|dashboard|summary" />`). A markup addition only; props, state and handlers of those screens do not change.

**Mechanics.** A fixed, full-viewport `div` with `aria-hidden="true"`, `pointer-events: none`, behind the content (screen content gets `position: relative; z-index: 1`). No JS at runtime, no canvas, no images. Everything lives in `theme.css` as stacked `background` layers:

| Layer | How | Tokens |
|---|---|---|
| 1. Field | Flat `panel-1-bg` | `panel-1-bg` |
| 2. Glow pools (2–3) | Concentric **hard-stop** radial gradients, so each pool is 3 visible steps, not a smooth ramp: faint outer ring, mid ring, small core. Positions and radii on the 8 px grid. One pool is dominant, the others one step dimmer (STYLE §9 one focal point) | `glow-ember` and `glow-flare` (Title, Dashboard); `glow-violet` and `glow-magenta` for the dusk look (Sol Summary) |
| 3. Fleck texture | About 24 two-pixel squares, each one `no-repeat` `linear-gradient` layer at a fixed `background-position`. Sparse, never inside a pool core (STYLE §7). Authored once with a throwaway script and pasted as static CSS | `hi-pale` (a few), `bevel-light` (most) |
| 4. Stepped vignette | Hard-stop elliptical gradient, 2 darker bands toward the edges | `bevel-dark` and `panel-1-bg` |

**Variants.** `title`: dominant horizon glow low and centred, 2 smaller pools at the sides. `dashboard`: one small pool top-left behind the header, one faint low pool. `summary`: dusk, violet at the top, magenta in the middle, ember low at the horizon (matches STORY_AND_MOTION §3 DUSK).

**Safety.** Static by default. The single optional motion is a 2-step "breathe" on the dominant pool's opacity, period 8 s or longer (well under the 2 pulses per second limit, low contrast, never white). It is removed under `prefers-reduced-motion: reduce`, and nothing animates `box-shadow` or layout. No flashing. Text that sits directly on the backdrop (Title only) must keep contrast of at least 4.5:1; I will check this in the screenshots and move the pool if it fails. Cards and panels are opaque and cover the rest.

### 3.3 `legacy.css` migration strategy

Phase 3 migrates one screen at a time, and `main` must always run, so the old theme cannot simply vanish in Phase 2.

1. **Move** the current `src/styles/theme.css` verbatim to `src/styles/legacy.css`. One mechanical rename inside it: the variable `--radius` becomes `--legacy-radius` (DESIGN.md also defines `--radius`, set to 0, and the two would collide). No other edit.
2. **Load it without touching `main.jsx`**: the new `theme.css` starts with `@import './legacy.css';`. `main.jsx` keeps its single approved import and the "main.jsx: one line only" rule stays intact.
3. **New primitives never collide.** They use `mb-` class names and `--color-*` tokens, and never style bare elements (`button`, `h1`, `input`, `.card`, `.badge`, …). Legacy screens keep rendering with the old rules.
4. **Known side effect.** The new base rules set `html`/`body` (dark panel background, Pixelify Sans, focus outline). Unmigrated screens will look mixed (old navy cards on the new dark field) until their turn. This is temporary.
5. **Drawer aliases are scoped, not global.** Legacy still defines `--bg`, `--text-h`, `--border`, `--accent`, `--shadow`. Aliasing them at `:root` would recolour every legacy screen, so the approved TEMPORARY aliases are set only on `.nasa-drawer` and `.nasa-drawer-backdrop` (`--bg`→`--color-panel-2-surface`, `--text-h`→`--color-text-primary`, `--border`→`--color-panel-3-raised`, `--accent`→`--color-accent-signal`, `--shadow: none`), commented as TEMPORARY and removed when the drawer is migrated.
6. **Delete `legacy.css`** (and its `@import`) in a final cleanup commit after Sources is done, once a search shows no remaining use of its classes. I will ask before deleting.

---

## 4. Per screen (Phase 3 order)

Each block lists: **fixed contract** (do not change), **WIREFRAMES.md status**, **DESIGN.md violations specific to it**, and **components**.

### 4.1 Title (`screens/Title.jsx`)
- **Contract:** props `{ go }`. `go('callsign')`, `go('sources')`. No state.
- **Wireframe:** matches title, subtitle, tagline, both buttons, footer line. **Missing:** Mars photo with dark overlay and credit line (a `TODO` in the file; the only photo we have is the square Perseverance rock close-up used on Intro, which is not a Title hero).
- **Violations:** orange subtitle; clamp 44–80 px title (hero max 40 px); letter-spacing 0.3 em; radial-gradient glow; default buttons.
- **Uses:** `SceneBackdrop` (`title`, replaces the radial-gradient glow and stands in for the Mars photo until one is approved), `Button` (primary + default). Photo slot waits for an approved image and its exact credit.

### 4.2 Dashboard (`screens/Dashboard.jsx`)
- **Contract:** `{ state, go, morningReport, actions }`. Local `askRestart`. `JOBS_PER_SOL`. `go('challenge', id)`, `actions.clearMorningReport`, `actions.restart`. Uses `commanderName`, `CHALLENGES`, `kidText`.
- **Wireframe:** header, Commander line, 4 meters + Science with goal, Storm card with REAL NASA badge and sheltered state, challenge cards with warning chips and done state, Mission Control line, Morning report card all present. Phone layout (2-column meters, 1-column cards) present. **Missing (Day 2 per docs):** Explorer Mode toggle, Sources link in footer. **Not in docs but present:** the "Start over?" confirm modal on Restart. Kept as is.
- **Violations:** Sol counter is orange text (should be `--font-stat` in `text-primary`); meter values not in `--font-stat`; status word coloured text; storm size coloured orange; warning chip text in `status-low`; done card colour; 📻 icon; two data-icon spots.
- **Uses:** `SceneBackdrop` (`dashboard`), `Card`, `MeterBar`, `Chip` (warning, badge-real), `Button`, `Icon`, `DialogueBox` (Mission Control), `Modal`.

### 4.3 Challenge with Confirm and Result (`screens/Challenge.jsx`, `OptionCard`, `ConfirmModal`, `ResultModal`, `EffectChips`)
- **Contract:** `{ state, dispatch, go, selectedChallenge, actions }`. Local `drawerOpen`, `chosen`, `step`. `dispatch({type:'CHOOSE', cid, opt})` on Confirm; `go('dashboard')` on Back; `actions.continueAfterResult` on Continue; `previewChoice` and `statusLabel` calls.
- **Wireframe:** header, Sol 3 red notes, intro, "Now:" row, three options with cost chips, Tomorrow chip, shelter tag, NASA button all present. Confirm: NOW → AFTER / AFTER TONIGHT, night note, arriving tomorrow, all three warnings present. Result: effects, WHAT HAPPENED, three REAL NASA lines present. **Missing:** the "small picture or icon" under the header. **Differs:** "Now:" shows all 4 meters + Science, wireframe shows only the affected ones (the code shows more; harmless). `WHAT HAPPENED` still prints `option.text` (a `TODO` waits on result lines in `KID_TEXT.md`).
- **Violations:** all cost chips are orange `status-low` text (fails small-text contrast); gain chips green status text; the red warning block is `#b3261e` with white text instead of `status-critical` + bold 24 px + outline; modal max width 560 vs 480; ▲ ▼ ← → ☂ ⚠ glyphs; `.preview-table` coloured accent text; round pills.
- **Uses:** `Card`, `Chip` (cost/gain/warning), `Button`, `Icon`, `Modal`, `MeterBar`-style status chip in "Now".

### 4.4 NasaDrawer (`components/NasaDrawer.jsx`, Person A, styling only)
- **Contract:** props `{ challengeId, onClose }`; reads `NASA_CONTENT`, `RADIATION_BARS`.
- **Wireframe:** header + close, badge, title, text, radiation bar chart (R only), lesson, source link, game-numbers note all present. **Missing:** the line "A millisievert measures how much radiation a body takes in" (needs a check in `nasaContent.js`; if it is not there I cannot add it because it would be a content change).
- **Violations:** 117-line inline `<style>`; fallback hexes; 16/10/6 px radii; soft box-shadow; `rgba` track and backdrop; fonts 14 and 16 px (below the 18 px floor); no `--font-reading` on paragraph + lesson; ✕ character; emoji ×4; source link under 48 px; purple fallback accent.
- **Uses:** `Modal`-like drawer shell, `Chip` (badge), `Button` (close, 48×48), `Icon`. Until it is migrated, your approved TEMPORARY aliases (`--bg`, `--text-h`, `--border`, `--accent` mapped to the new tokens, plus `--shadow: none`, which the drawer also reads) apply **only to `.nasa-drawer` and its backdrop** (§3.3 item 5), and are deleted when this step is done.

### 4.5 Sol Summary (`screens/SolSummary.jsx`)
- **Contract:** `{ state, actions }`. Reads `history`, `log`, `pending`, `phase`. Calls `actions.startMorning`.
- **Wireframe:** TODAY YOU DID, TONIGHT with storm line, METERS NOW, ARRIVING TOMORROW (or "ARRIVES AFTER THE MISSION" on Sol 3), button all present.
- **Violations:** ☀ 🌩 ☂ 🌙 ⚠ ⏳ and a data icon; red/green text for storm outcome; heading letter-spacing; pills.
- **Uses:** `SceneBackdrop` (`summary`, dusk palette), `Card`, `MeterBar`, `Chip`, `Icon`, `Button`.

### 4.6 Debrief (`screens/Debrief.jsx`)
- **Contract:** `{ state, go, actions }`. `outcome`, `buildDebrief`, `go('sources')`, `actions.playAgain`, `actions.restart`.
- **Wireframe:** header with outcome, FINAL STATUS, YOUR MISSION, what went well/improve/tip, arrives-after box, THINK ABOUT IT, honesty line and three buttons all present. **Missing (Day 2):** Print report.
- **Violations:** ★ ✓ • 🛰 🟦 🟧; outcome heading coloured with status tokens; list good-lines in green status text; badge pills.
- **Uses:** `Card`, `MeterBar`, `Chip` (badges), `Icon`, `Button`.

### 4.7 Callsign (`screens/Callsign.jsx`)
- **Contract:** `{ actions }`. Local `nickname`, `showError`. Form submit and Skip call `actions.startMission`. Validation rules untouched.
- **Wireframe:** matches (question, text box, privacy hint, chips, Continue, Skip, error). The error says "Use 2 to 16 letters or numbers" (CLAUDE.md) not "Pick a name with 2 to 16 letters" (wireframe); the code follows CLAUDE.md.
- **Violations:** text input has a soft inset shadow and 18 px radius; chips are pills; ⚠; orange primary.
- **Uses:** `Card`, `Chip` (suggestion), `Button`, `Icon`. Input gets an inset bevel with a teal focus outline.

### 4.8 Intro (`screens/Intro.jsx`, `MarsPhoto`)
- **Contract:** `{ state, go }`. Local `index`. `go('dashboard')` on Next after last slide and on Skip.
- **Wireframe:** slides 1 and 2 present (3 and 4 are Day 2). **Differs:** counter reads "1 of 2" (derived from slide count) where the wireframe says "1 of 4"; four dots shown in the wireframe, two in code. This will self-correct when slides 3–4 land.
- **Violations:** round dots (50 %) with soft shadows; photo has a 24 px radius, a soft shadow and a `#0b0d10` backdrop; `object-fit: contain` and a non-integer `min(100%, 300px, 32vh)` size; 🟦 in the caption.
- **Uses:** `Card`, `DialogueBox`, `Chip` (badge-real), `Button`. Dots become square pips.

### 4.9 Sources (`screens/Sources.jsx`, Person A, styling only)
- **Contract:** `{ state, go }`. `backTo` is derived from `state.phase`. Lists come from `spaceWeatherEvents.json`, `NASA_CONTENT`, `credits.txt`.
- **Wireframe:** matches (flare records, facts, image credits, game-numbers disclaimer, how we used NASA data, Back). I will not add a font credit to the screen (content change); the font credit goes in `credits.txt` in Phase 2 and appears automatically.
- **Violations:** `🟦` and `🟧` in `<h2>`; `← Back`; link text under 48 px; list gaps; `.sources-section` neumorphic card.
- **Uses:** `Card`, `Chip` (badges), `Button`, `Icon`.

---

## 5. Conflicts and ambiguities that affect the redesign

1. **STYLE.md §9a vs DESIGN.md meter table on Low-fill text.** STYLE.md says Low takes `text-primary` (3.80). DESIGN.md says `panel-1-bg` (4.23) and claims STYLE had it backwards. DESIGN.md says STYLE wins on colour/value, DESIGN wins on CSS mechanics, so the tie-break is unclear. I will use `panel-1-bg` (higher contrast) unless you say otherwise.
2. **DESIGN.md meter bar: 24 px track vs 32 px stat number "sitting over the fill".** A 32 px number cannot sit over a 24 px track. I will put the value beside the track and keep the track at 24 px.
3. **No token exists for "gain" and "cost" chips.** WIREFRAMES.md says gains green and costs orange, but status tokens are reserved for status. Tokens I could use: `glow-ember` for costs, `hi-pale` for gains. Every chip also keeps the `+`/`−` sign and the meter icon.
4. **STORY_AND_MOTION.md vs this task.** It asks for a Motion toggle, scene strip, vignettes and cinematics. The scene strip is superseded by the Base Hub (out of scope). I will build none of it, but I will keep the reduced-motion rule and stepped meter fills.
5. **Photograph vs pixel rules.** DESIGN.md §3 (integer scale, `image-rendering: pixelated`) is written for authored scenes. Applying it to a real NASA photo would degrade it. I will keep the photo smooth in an inset, bevelled slot.
6. **(Resolved in revision 2.)** Letter-box placeholders are dropped. Icons are drawn pixel maps, so the 18 px text floor no longer applies to them.
7. **`statusLabel().icon` and `CHALLENGES[].icon` are emoji and I may not edit them.** Handled by name-based `Icon` (see §2.2), but they remain in the data.
8. **Wireframe mockups still draw emoji** (DESIGN.md §5 note). Implementation follows the written rules, not the mockups.
9. **`WIREFRAMES.md` Challenge "Now:" shows only affected meters; the code shows all.** I keep the code.
10. **`MARSBOUND_Complete_Game_Plan.md` is still missing**, but nothing in this task depends on it now that `KID_TEXT.md` exists.
11. **Icon native size.** DESIGN.md §4 says challenge icons and the NASA badge icon are 32×32 native, and 16×16 only for status dots and small meter icons. The request is 16×16 for the whole core set. Drawing challenge icons at 16×16 and showing them at 2× (32 px) keeps one 2 px pixel size across the screen, which is what STYLE §10 and DESIGN §4 actually protect ("do not mix densities"). Showing them at 4× would mix densities. This deviates from the DESIGN.md §4 table, so I need your OK.
12. **`--radius` name collision.** DESIGN.md defines `--radius: 0`; the old theme defines `--radius: 18px`. Handled by renaming the legacy one (§3.3 item 1).
13. **`main.jsx` import rule vs two stylesheets.** CLAUDE.md allows one added import line in `main.jsx`. Loading `legacy.css` through `@import` inside the new `theme.css` keeps that rule.
14. **STYLE §11 "do not interpolate new colours" vs glow falloff.** STYLE §8 wants a bloom ring between emitter and field. With tokens only, the pool steps are alpha steps of existing glow tokens over `panel-1-bg`, not new hex values. I read that as compliant; it is an interpretation.
15. **DESIGN.md §3 scene rules assume raster scenes.** A CSS gradient scene cannot be "integer-scaled". I keep every radius, offset and size on the 8 px grid and accept 1 px anti-aliased edges on the gradient rings.

---

## 6. What I would have to guess (need your answer or approval)

1. **Gain/cost chip colours** (§5 item 3): `glow-ember` cost / `hi-pale` gain, or another pair.
2. **DialogueBox typewriter:** static text only now, or add the 2-characters-per-step typewriter (max 1.5 s) plus a Skip? I recommend static now.
3. **Title photo:** which image and exact credit? Until then `SceneBackdrop` (`title`) is the Title visual, with no image.
4. **Icons:** I draw the 34 icons myself as 16×16 pixel maps, then you review the sheet. Hand-drawn icons from me are a first pass; swapping in an artist's versions later is a one-file change.
5. **Meter number font:** `--font-stat` for values and the Sol counter only, as DESIGN.md says. The Debrief final status uses the same.
6. **Screenshots:** I will check for a built-in/Chrome browser tool. If none exists I need your yes to add Playwright as a devDependency.
7. **Scope of `NasaDrawer` fixes:** moving its CSS into `theme.css` and fixing its sizes and font are styling. If the anchoring bug in §2.4 needs a wrapper `position: relative` in `Challenge.jsx`, that is a one-class markup change in Person B's file, no logic.
8. **`legacy.css`:** I have no record of agreeing it earlier in this conversation. I am reading it as §3.3 (old theme kept as `legacy.css`, loaded by `@import`, deleted at the end). Tell me if you meant something else.
9. **Backdrop breathe:** include the optional 2-step 8 s opacity breathe, or keep the backdrop fully static? I recommend fully static in Phase 2 and adding the breathe only if you ask.
10. **Challenge icons at 16×16 shown at 2×** (§5 item 11) instead of DESIGN.md's 32×32 native. OK?
11. **The five extra icons** (globe, die, moon, hourglass, sunrise) beyond your core list. OK to draw them?

---

## 7. Phase 2 deliverables (after you approve)

1. Move the current `theme.css` to `src/styles/legacy.css` (only the `--radius` rename, §3.3).
2. Write the new `src/styles/theme.css`: `@import './legacy.css';` first, then DESIGN.md §1 tokens verbatim, `@font-face` for the five files already in `src/assets/fonts/` (Pixelify Sans 400/700, Nunito 400/700, Press Start 2P 400), base rules (dark panel `html`/`body`, 2 px teal focus outline, `prefers-reduced-motion`), the scoped drawer aliases, and the `SceneBackdrop` rules.
3. Add the font OFL licence files (already downloaded) and a credits line to `src/assets/credits.txt`, which the Sources screen reads.
4. Add `Button`, `Card`, `MeterBar`, `Chip`, `Modal` (restyle), `DialogueBox`, `SceneBackdrop`, and `Icon` with `icons/pixelMaps.js` (34 maps) and its test.
5. Add dev-only `style-guide.html` showing every component in every state, the icon sheet at 1×/2×/4×, the status-icon colour-blindness check, the three backdrop variants, plus the colour, type and spacing sheets. Screenshot at 360 px and 1280 px, compare with STYLE.md, run `npm test` and `npm run build`, stop for review.

The app's screens are untouched in Phase 2, so only `html`/`body` base styling changes for them (§3.3 item 4). The old look stays recoverable both through `legacy.css` and git history.

**After Phase 3:** a cleanup commit removes `legacy.css`, its `@import`, and any leftover legacy-only class names. I ask before doing it.
