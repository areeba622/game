# MARSBOUND — Team Development Plan v3 (2 people + Claude Code)

## 1. Before you start
 
### 1.1 Files that go in the repo
| File | Where |
|---|---|
| `CLAUDE.md` (latest version) | project root |
| `WIREFRAMES.md` | `docs/` |
| `NASA_DATA_VERIFIED.md` | `docs/` |
| `spaceWeatherEvents.json` | `docs/` (master copy) and later `src/data/` |
| `PHASE3A_data_prompt.md` | `docs/` |
| `KID_TEXT.md` | `docs/` (kid text: option titles, text, icons) |
| `MARSBOUND_Complete_Game_Plan.md` | `docs/` (old; optional, do not use for build) |
| `MARSBOUND_Game_Overview.md` | `docs/` |
| this plan | `docs/` |
 
### 1.2 Who owns what
| Person A owns | Person B owns |
|---|---|
| `src/game/*` | `src/screens/*` (except `Sources.jsx`) |
| `src/data/*` | `src/components/*` (except `NasaDrawer.jsx`) |
| `src/components/NasaDrawer.jsx`, `src/screens/Sources.jsx` | `src/styles/*`, `src/assets/*` |
| `src/App.jsx` (B asks first) | |
 
### 1.3 The contract (B builds against these names; A makes them real)
```js
// src/game/game.js
newGame(severity)                      // -> state
choose(state, challengeId, option)     // -> new state (also appends to state.history)
solIsFinished(state)                   // -> boolean
endSol(state)                          // -> new state: the NIGHT (storm, upkeep, penalties, failure check; phase 'complete' after Sol 3)
startNextSol(state)                    // -> new state: the MORNING (pending arrives, sol+1, failure check)
previewChoice(state, cid, opt)         // -> { after:{O,W,P,C,S}, includesNight, arriving:[...], failed, failReason }
outcome(state)                         // -> { key:'failed'|'atRisk'|'withChallenges'|'successful', label }
statusLabel(value)                     // -> { word, color, icon }
// src/game/debrief.js    buildDebrief(state) -> { good:[], better:[], tip }
// src/game/challenges.js CHALLENGES = { L:{id,title,icon,intro,options:{A:{title,text,effects,later,sheltered?},B,C}}, ... }
// src/game/storm.js      pickStorm(events) -> one record
// src/data/nasaContent.js  NASA_CONTENT[challengeId], SPACE_WEATHER_LABEL, RADIATION_BARS
// App.jsx: reducer actions START{severity,event,nickname} | CHOOSE{cid,opt} | END_SOL | START_SOL
//          screens get props { state, dispatch, go, selectedChallenge, morningReport, actions }; go('challenge','R') opens a challenge; actions = { startMission, continueAfterResult, startMorning, clearMorningReport, playAgain, restart } built in App.jsx by Person A (CLAUDE.md 5.10)
// state = { sol,O,W,P,C,S, done:{}, history:[{sol,cid,opt}], doneThisSol, sheltered, pending:[], severity, event,
//           nickname, phase:'active'|'failed'|'complete', failReason, log:[{sol,kind,text}] }
```
Full details are in `CLAUDE.md` sections 5.4, 5.7, 5.8 and 5.10.
 
---
 
## 2. Git: where to push, when, and what must pass first
 
### 2.1 Branches
- `main` = always works and is always deployable. **Nobody pushes to `main` directly.** Changes reach `main` through a pull request (PR).
- `logic` = Person A's branch. `ui` = Person B's branch.
- Exception: the very first commit (Phase 0) goes straight to `main` by A.
### 2.2 The two kinds of push
| Kind | When | What it is for |
|---|---|---|
| **Backup push** | every 30–45 minutes, and before a break | Push your branch so nothing is lost. Can be unfinished. Never to `main`. |
| **PR push** | when a phase's "Done when" is fully ticked | Open a PR into `main`, merge, then tell the other person to pull |
 
### 2.3 Before every PR (both of you)
- [ ] `npm test` is green
- [ ] `npm run build` has no errors
- [ ] `npm run dev` opens and you clicked through what you changed
- [ ] You read the changed files once (`git diff main`) and nothing outside your folders changed
- [ ] The phase's manual checks (below) are ticked
### 2.4 Push and merge points (the whole day)
| # | When | Who | Branch | What is in it | After merge |
|---|---|---|---|---|---|
| P0 | End of Phase 0 | A | `main` (first commit) | Vite project, `CLAUDE.md`, `docs/`, the stub, placeholders, deployed link | B clones, then creates `ui` from `main` |
| P1 | End of Phase 1A | A | `logic` → PR | Real `choose`, `endSol`, `startNextSol`, `statusLabel`, `outcome` + tests | B runs `git merge main` into `ui` at their next break |
| P2 | End of Phase 1B | B | `ui` → PR | Theme, `ResourceBar`, Title, Callsign, Intro, Dashboard | A pulls `main` and opens the app |
| P3 | End of Phase 2A | A | `logic` → PR | `previewChoice`, `buildDebrief` + tests | B merges `main` into `ui` before starting Confirm |
| P4 | End of Phase 3A | A | `logic` → PR | `spaceWeatherEvents.json`, `storm.js`, `nasaContent.js` | B merges `main` |
| P5 | End of Phase 3A+ | A | `logic` → PR | Real `NasaDrawer.jsx` and `Sources.jsx` | B merges `main` |
| P6 | End of Phase 2B | B | `ui` → PR | Challenge, Confirm, Result | A pulls `main` |
| P7 | End of Phase 4 | both | `main` | Integration fixes (small PRs) | — |
| P8 | End of Phase 3B | B | `ui` → PR | Sol Summary, Debrief | A pulls `main` |
| P9 | End of Phase 5 | both | `main` | Playtest fixes, **Day 1 release** | Deploy, tag `day1` |
| D2… | Day 2 | each | own branch → PR | one PR per task | |
 
**Who merges?** The author merges their own PR after ticking the checks in 2.3, then posts "merged, please pull main" in your chat. The other person pulls `main` within 15 minutes and opens the app. If it breaks, say so right away, and the author fixes it first.
 
**Merge conflicts:** if you obey the ownership table, you should get almost none. If you do, ask Claude Code: *"Resolve the merge conflict in [file]. Keep both sets of changes. Do not change anything else. Show me the result."* Then re-run `npm test` and `npm run dev`.
 
---
 
## 3. Timeline at a glance
 
| Phase | What | Who | Time |
|---|---|---|---|
| **0** | Setup, stub, wiring, first deploy | A leads; B reads docs and collects images | 60 min |
| **1A** | Real game logic + tests | A | 75 min |
| **1B** | Theme, Title, Callsign, Intro (+ Mars photo), Dashboard | B | 2 h 30 |
| **2A** | `previewChoice` + debrief | A | 45 min |
| **3A** | NASA data into code + link check | A | 40 min |
| **3A+** | `NasaDrawer` + `Sources` | A | 75 min |
| **2B** | Challenge, Confirm, Result | B | 90 min |
| **4** | Integration | both | 45 min |
| **3B** | Sol Summary + Debrief | B | 75 min |
| **5** | Playtest, fix, deploy | both | 80 min |
| **Day 1** | playable, NASA-compliant, deployed | | **about 8 h 15** |
| **6** | Day 2: DONKI call + RadLab | A | 2.5 h |
| **7** | Day 2: polish (Framer Motion with permission) | B | 2.5 h |
| **8** | Day 2: QA, video, submission | both | 3 h |
 
**Day 1 hour map**
```
0:00–1:00  Phase 0 (A: stub + wiring. B: read docs, collect images)
1:00–2:15  A: 1A logic            | B: 1B theme, Title, Callsign, Intro, Dashboard
2:15–3:00  A: 2A preview/debrief  | B: 1B finish
3:00–3:40  A: 3A data             | B: 2B start (Challenge)
3:40–4:55  A: 3A+ drawer, Sources | B: 2B finish (Confirm, Result)
4:55–5:40  Phase 4 integration (both)
5:40–6:55  B: 3B Sol Summary, Debrief | A: review B's screens, fix bugs
6:55–8:15  Phase 5 playtest + deploy (both)
```
 
---
 
## PHASE 0 — Setup, stub and wiring (60 min)
 
**Goal:** a repo where the app opens, every screen is reachable by clicking through, and B can start building against the stub.
**Who:** A does steps 1–6 and prompts 0.1–0.2. B reads docs and collects images.
 
### Manual steps (A)
1. Create GitHub repo `marsbound`. Run:
```bash
   npm create vite@latest marsbound -- --template react
   cd marsbound && npm install && npm install -D vitest
```
2. Add `"test": "vitest run"` to `package.json` scripts.
3. Copy `CLAUDE.md` to the root. Create `docs/` and copy in the files from section 1.1. Create folders `src/game src/data src/screens src/components src/styles src/assets`.
4. Copy `docs/spaceWeatherEvents.json` to `src/data/spaceWeatherEvents.json`.
5. First commit and push to `main`. Add B as a collaborator.
6. Connect Vercel or Netlify to `main`.
### Manual steps (B, at the same time)
- Read `docs/WIREFRAMES.md` completely and `CLAUDE.md` sections 5 and 8.
- **Collect the Mars photos (about 30 min, no Claude Code):**
  1. Open the NASA Image and Video Library (images.nasa.gov) or a Curiosity / Perseverance page on nasa.gov. Search "Mars surface panorama", "Curiosity Mars panorama" or "Perseverance Mars landscape".
  2. Pick **2–3 real rover photos** of the Martian ground (not artist drawings).
  3. Download a medium-size version of each, **under about 500 KB** (shrink with squoosh.app if needed).
  4. Save them in `src/assets/` as `mars-landing.jpg` and `mars-surface-2.jpg` (once the repo exists).
  5. For each photo, copy into `src/assets/credits.txt`: exact title, credit line (e.g. "NASA/JPL-Caltech"), page link, and rover name if the page gives it.
  6. Read the page's usage note. No NASA logo.
### Prompt 0.1 — game stub and data (A)
 
> Read CLAUDE.md first. Create a **stub** of the game contract so the screens can be built before the real logic exists. Create these files exactly as the contract in CLAUDE.md section 5.8 describes: (1) `src/game/challenges.js` exporting `CHALLENGES` with the five challenges (L, R, W, G, M): each has `id`, `title`, an emoji `icon`, a one-sentence `intro`, and options A/B/C with `title`, short `text`, and `effects`, `later` and `sheltered` values **copied exactly from the option table in CLAUDE.md section 5.3**. (2) `src/game/storm.js` exporting a real `pickStorm(events)` that returns a random record. (3) `src/game/game.js` exporting `newGame(severity)` (returns the starting state from CLAUDE.md 5.7 with `nickname: 'Commander'`, `event: null`, `history: []`), `choose` (apply the option's effects naively, clamp 0–100, mark done, append `{sol, cid, opt}` to `history`, increase `doneThisSol`), `solIsFinished` (real quota check: Sol 1 → 2, Sol 2 → 2, Sol 3 → 1), `endSol` (stub: set `phase` to `'complete'` if `sol === 3`, otherwise return the state unchanged), `startNextSol` (stub: `sol + 1`, `doneThisSol = 0`), `previewChoice` (stub: return `after` from applying the option only, `includesNight: false`, `arriving: []`, `failed: false`, `failReason: null`), `outcome` (stub: return `{ key: 'withChallenges', label: 'Complete — With Challenges' }`) and a **real** `statusLabel(value)` using the ranges in CLAUDE.md 5.1 and the icons 🟢 🟡 🟠 🔴 ⚫. Mark every non-final function with a `// STUB` comment. (4) `src/game/debrief.js` exporting a stub `buildDebrief(state)` that returns `{ good:['You did it!'], better:['Try a different order.'], tip:'Your lowest meter was Power.' }`. Do not change any numbers. Do not install any packages.
 
**What it does:** creates the data and function skeleton the whole team builds against.
**Creates:** `src/game/challenges.js`, `storm.js`, `game.js`, `debrief.js`.
**Output you should see:** four files. `challenges.js` has 15 options with numbers. `statusLabel(55)` gives `{ word:'OK', ... }`. Everything else is marked `// STUB`.
 
### Prompt 0.2 — App wiring and placeholder screens (A)
 
> Read CLAUDE.md first, especially section 5.10. Create `src/App.jsx` and placeholder files so the whole app can be clicked through. (1) In `App.jsx` use `useReducer` with actions `START` (payload `{severity, event, nickname}` → `{...newGame(severity), event, nickname}`), `CHOOSE` (`{cid, opt}` → `choose`), `END_SOL` (`endSol`), `START_SOL` (`startNextSol`). Keep the visible screen in `useState` (`'title' | 'callsign' | 'intro' | 'dashboard' | 'challenge' | 'solSummary' | 'debrief' | 'sources'`) plus `selectedChallenge` and `morningReport`. (2) Give every screen the props `{ state, dispatch, go }`, where `go(screenName, payload)` changes the screen (`go('challenge', 'R')` opens a challenge). (3) Provide `startMission(nickname)` in `App.jsx`: pick a random record with `pickStorm` from `src/data/spaceWeatherEvents.json`, dispatch `START` with `{severity: event.severity, event, nickname}`, then `go('intro')`; pass it to the Callsign screen. (4) Create placeholder components in `src/screens/` for Title, Callsign, Intro, Dashboard, Challenge, SolSummary, Debrief and Sources. Each shows its own name and a button that goes to the next screen in the flow, so I can click through the whole app. The Callsign placeholder has a text box and calls `startMission`. (5) Create placeholder `src/components/NasaDrawer.jsx` (props `{ challengeId, onClose }`) and `src/data/nasaContent.js` exporting `SPACE_WEATHER_LABEL = 'REAL NASA · saved copy of a DONKI record'`, `NASA_CONTENT = {}` and `RADIATION_BARS = []`. Use plain CSS only for now. Do not install any packages. Do not change any game numbers.
 
**What it does:** builds the shell: state, navigation, the nickname-to-game start, and clickable placeholders.
**Creates:** `src/App.jsx`, `src/screens/{Title,Callsign,Intro,Dashboard,Challenge,SolSummary,Debrief,Sources}.jsx`, `src/components/NasaDrawer.jsx`, `src/data/nasaContent.js`.
**Output you should see:** `npm run dev` opens an ugly page. Clicking through goes Title → Callsign → Intro → Dashboard → Challenge → … → Debrief. No errors in the console.
 
### Prompt 0.3 — App actions and kid-text sync (A)
 
Do this after Prompts 0.1 and 0.2 (it can ride along in the same PR as Phase 1A). Person B needs it before the Result and Sol Summary screens.
 
> Read CLAUDE.md first, section 5.10, and `docs/KID_TEXT.md`. Task 1: in `src/App.jsx` build the `actions` object described in section 5.10 (`startMission`, `continueAfterResult`, `startMorning`, `clearMorningReport`, `playAgain`, `restart`) and pass `{ state, dispatch, go, selectedChallenge, morningReport, actions }` to every screen. Compute the next state locally with the pure functions (`endSol`, `startNextSol`) and also dispatch the matching action. `startMorning` fills `morningReport` with the new `harvest` / `earthReply` log entries. Update the placeholder screens to use `actions` instead of calling `startMission` or deciding the next screen themselves. Task 2: in `src/game/challenges.js` change ONLY the `icon`, `title`, `intro` and option `title` and `text` fields to match `docs/KID_TEXT.md`. Do not change any `effects`, `later` or `sheltered` value. Do not install packages. Tell me what you changed.
 
**What it does:** gives every screen one place to ask "what happens next", and makes the kid-facing words match the docs.
**Changes:** `src/App.jsx`, the placeholder screens, `src/game/challenges.js` (words and icons only).
**Output:** the placeholder app still clicks through. Result → Continue and Sol Summary → Start work through `actions`. Option titles and icons match `KID_TEXT.md`.
**Check by hand:** `git diff src/game/challenges.js` shows no change to any number.
 
### Manual checks (A)
- [ ] `npm run dev` works and you can click through every screen.
- [ ] `challenges.js`: compare all 15 options with `CLAUDE.md` section 5.3 number by number.
- [ ] `npm run build` passes.
- [ ] Public Vercel/Netlify link opens.
### Push (A)
Commit and push to **`main`** (P0). Tell B. B then runs:
```bash
git clone <repo> && cd marsbound && npm install && git checkout -b ui
```
 
---
 
## PHASE 1A — Real game logic (A, 75 min)
 
**Goal:** the rules in `CLAUDE.md` section 5 work and are tested.
**Branch:** `logic`.
 
### Prompt 1A.1 — real logic
 
> Read CLAUDE.md first. Replace the stubs in `src/game/game.js` with the real logic for `choose`, `endSol`, `startNextSol` and `outcome`. Follow CLAUDE.md sections 5.1 to 5.7 **exactly**. Keep all option numbers in `src/game/challenges.js` and have `game.js` read them from there. Never mutate the old state; always return a new object. Clamp O, W, P, C to 0–100 after every change. In `choose`: if the challenge is already done or `phase` is not `'active'`, return the state unchanged; otherwise apply `effects`, mark the challenge done, append `{sol, cid, opt}` to `history`, increase `doneThisSol`, set `sheltered` only for Radiation A or B on Sol 1 or Sol 2, queue the option's `later` effects into `pending`, then check for failure (any of O, W, P, C equal to 0 → `phase = 'failed'` with a `failReason`). `endSol` is only the NIGHT: storm (end of Sol 2 only, only if not sheltered), upkeep (also on Sol 3), unfinished-problem penalties, failure check, and `phase = 'complete'` after Sol 3; it leaves `pending` untouched. `startNextSol` is only the MORNING (it does nothing unless `phase` is `'active'` and `sol < 3`): apply pending effects, add `harvest` and `earthReply` log entries, clear `pending`, `sol + 1`, `doneThisSol = 0`, then a failure check. Add readable `state.log` entries (`{sol, kind, text}`) for storm, upkeep, penalty, harvest and earthReply. Make `outcome(state)` follow CLAUDE.md 5.5. If anything is unclear, ask me before guessing. Do not change any numbers.
 
**What it does:** turns the stubs into the real rules.
**Changes:** `src/game/game.js` (and only reads `challenges.js`).
**Output:** no visible change in the browser yet. The app should still run.
 
### Prompt 1A.2 — tests
 
> Write `src/game/game.test.js` with vitest and run `npm test`. Tests: (1) a fresh game has O75 W70 P80 C75 S0, Sol 1, empty `history`. (2) Radiation A on Sol 1, then the night of Sol 2: Crew Health is not reduced by the storm. (3) Radiation never done with severity 3: Crew Health drops by 55 in the night of Sol 2. (4) Greenhouse A on Sol 1: after `endSol` the harvest is still in `pending`; after `startNextSol` Oxygen and Crew each gain 10. (5) Earth A on Sol 3: the +6 reply never arrives and `phase` is `'complete'`. (6) `history` records `{sol, cid, opt}` for each choice. (7) The full worked example in CLAUDE.md section 5.9 step by step, checking the numbers after every `endSol` and `startNextSol`. (8) Earth reply C with Power 8 or less: `startNextSol` ends the mission (`phase` is `'failed'`). (9) Earth A on Sol 1: after `endSol` the reply is still in `pending`; after `startNextSol` Power gains 6 on Sol 2. (10) Earth done on Sol 2 with Life Support C and Radiation A on Sol 1, then Earth A + Greenhouse A on Sol 2 and Power A on Sol 3: after `endSol` on Sol 2 the meters are O69 W43 P33 C81 S10; after `startNextSol` they are O79 W43 P39 C91 S10 (the Earth reply P+6 and the harvest both arrive); the final state is O75 W40 P30 C95 S10. Show me the test output.
 
**What it does:** locks the rules in with tests.
**Creates:** `src/game/game.test.js`.
**Output:** `npm test` shows 10 passing tests.
 
### Manual checks (A)
- [ ] All tests pass. Read each test once; they should assert the numbers in `CLAUDE.md` 5.9.
- [ ] Open `game.js`: the night order is storm → upkeep → penalties → failure → (complete after Sol 3). The morning applies pending, then `sol + 1`, then a failure check.
- [ ] Upkeep runs on Sol 3. Meters are clamped. Failure is checked after every option.
- [ ] `npm run dev` still clicks through.
### Push (A)
Backup-push `logic` every 30–45 minutes. When the checks pass: **PR P1 `logic` → `main`**, merge, tell B to `git merge main` into `ui` at their next break.
 
---
 
## PHASE 1B — Theme, Title, Callsign, Intro, Dashboard (B, 2 h 30)
 
**Branch:** `ui`. Runs in parallel with 1A and 2A, on the stub.
 
### Prompt 1B.1 — theme and meter bar
 
> Read CLAUDE.md first, then `docs/WIREFRAMES.md` (the "Visual rules" and "Components used" sections). Create the theme in `src/styles/theme.css` in a neumorphism (soft UI) style as described in the "Visual rules" of `docs/WIREFRAMES.md`: dark navy base, raised cards and buttons, pressed (inset) meter tracks and text boxes, soft light and dark shadow pairs stored as CSS variables (`--shadow-raised`, `--shadow-pressed`), Mars-orange as the only accent colour, white text, large rounded corners, text at least 18px, buttons at least 48px tall with a clear pressed and focus state, system fonts, and import it in the app. Keep strong text contrast and never use shadows alone to show a status. Build `src/components/ResourceBar.jsx` with props `label`, `icon`, `value` (0–100): a CSS bar, the number, and the status from `statusLabel(value)` shown as word + colour + icon (never colour alone). Use plain CSS for the bar. Do not install any packages. Then show me a temporary preview of four bars with values 80, 55, 30 and 10 (remove the preview when I say so).
 
**What it does:** sets the look and the reusable meter.
**Creates:** `src/styles/theme.css`, `src/components/ResourceBar.jsx`.
**Output:** four bars, each showing a number plus a word like "Healthy" or "Critical" with an icon.
 
### Prompt 1B.2 — Title and Callsign
 
> Read CLAUDE.md first, especially section 8.1. Build `src/screens/Title.jsx` (Screen 1 in `docs/WIREFRAMES.md`) and `src/screens/Callsign.jsx` (Screen 2). Title: name MARSBOUND, tagline, a Start Mission button (goes to Callsign) and a Sources & Data button (goes to Sources). Callsign: "What should we call you, Commander?", a text box, three tap-to-fill chips (Nova, Comet, Orbit), the line "Use a nickname, not your real name.", Continue and Skip. Trim spaces; require 2–16 characters; show a friendly message if invalid. Continue calls `actions.startMission(nickname)`; Skip calls `actions.startMission('Commander')`. Allowed characters: letters, digits, single spaces, `-` and `_` (no emoji or symbols); error text "Use 2 to 16 letters or numbers". Do not save the nickname to localStorage, cookies or any server. Render it as plain text. Replace the placeholder files; do not change `src/game/*` or `App.jsx` (if you need a change there, tell me).
 
**What it does:** the first two screens, including the nickname.
**Creates/changes:** `src/screens/Title.jsx`, `src/screens/Callsign.jsx`.
**Output:** Title → Callsign works. A one-letter name is rejected. Tapping "Nova" fills the box. Continue starts the game.
 
### Prompt 1B.3 — Intro
 
> Read CLAUDE.md first. Build `src/screens/Intro.jsx` (Screen 3 in `docs/WIREFRAMES.md`) with the first two slides only (slide 1: "Landing successful!" with "Welcome, {commander}"; slide 2: "Your job: solve 5 challenges in 3 Sols"), dot progress, Next and Skip. `{commander}` comes from `commanderName(state)` in `src/components/commander.js` (create it: "Commander " + nickname, or just "Commander" when the nickname is 'Commander'). After the last slide go to the Dashboard. Leave a clear comment where slides 3 and 4 will be added on Day 2.
 
**Creates/changes:** `src/screens/Intro.jsx`.
**Output:** two slides with dots; "Welcome, Commander Nova"; Next goes to the Dashboard.
 
### Prompt 1B.3b — Real Mars photo on Intro slide 1
 
Do this after the Intro screen works. Fill in the three `[ ]` parts from the NASA page first.
 
> Read CLAUDE.md first and `docs/WIREFRAMES.md` (Screen 3, Intro). Task: add a real Mars photo to Intro slide 1 in `src/screens/Intro.jsx`. The image file is `src/assets/mars-landing.jpg`. Show it as a banner at the top of the slide, above "Landing successful! Welcome, {commander}." Add a small caption under it with exactly this text: "REAL NASA photo of Mars, taken by [rover name]. [credit line]". Use the REAL NASA badge style we already use. Do not invent any rover name, date or credit; use only the text I gave you. Use this alt text: "[short description of what the photo shows]". Make it fit on a phone without scrolling and keep text at least 18px. If the image is missing, show the slide without it and do not crash. Also confirm that the credit lines from `src/assets/credits.txt` appear on the Sources screen. Change only `Intro.jsx`, the styles and `credits.txt`. Do not change `src/game/*` or `src/data/*`. Do not install any packages. Tell me what you changed.
 
**What it does:** puts a real NASA photo of Mars on the landing slide, with an honest caption.
**Changes:** `src/screens/Intro.jsx`, `src/styles/*`, `src/assets/credits.txt`.
**Output:** slide 1 shows a Mars photo with the caption "REAL NASA photo of Mars, taken by …". If the file is missing, the slide still works.
 
### Prompt 1B.4 — Dashboard
 
> Read CLAUDE.md first. Build `src/screens/Dashboard.jsx` following Screen 4 in `docs/WIREFRAMES.md`: header with Sol number, "Jobs today" progress, "{commander}" and a Restart button (goes to the Callsign screen); four `ResourceBar`s plus the Science score with goal 15; the storm forecast card (size, "arrives at the end of Sol 2", the flare class and date from `state.event`, the badge text from `SPACE_WEATHER_LABEL`, and the sheltered / not sheltered state from `state.sheltered`); the five challenge cards from `CHALLENGES` with the warning chips (Life Support "costs 8 Oxygen each night if not done", Power Budget "costs 4 Power each night if not done", Radiation "storm at end of Sol 2"); done challenges show ✓ and the chosen letter and cannot be selected; a Mission Control line using the text bank in the wireframes. Selecting a card calls `go('challenge', id)`. On phones: meters in 2 columns, cards in 1 column. Use only the contract in CLAUDE.md. Do not change `src/game/*`.
 
**Creates/changes:** `src/screens/Dashboard.jsx` (and small shared components if needed: `ChallengeCard`, `StormForecast`, `MissionControl`).
**Output:** a full Dashboard with 4 meters, the storm card showing a real flare (e.g. "M5.9, 2024-05-10"), five cards. It looks right at phone width.
 
### Manual checks (B)
- [ ] Title → Callsign → Intro → Dashboard works; the nickname shows on the Dashboard.
- [ ] A nickname with 1 character or 17 characters is rejected; Skip gives "Commander".
- [ ] The Dashboard looks right at laptop width and at phone width (use browser dev tools).
- [ ] Status shows words + icons, not only colour. Text is at least 18px; buttons at least 48px.
- [ ] Neumorphism check: cards and buttons look raised, meter tracks and the text box look pressed, text is easy to read on every card, and the pressed and focus states are visible.
- [ ] Compare with `WIREFRAMES.md` Screens 1–4. Note anything missing.
- [ ] Mars photo (Intro slide 1): loads on laptop and phone; text is readable; caption and credit match the NASA page word for word; file is under about 500 KB; game works with Wi-Fi off; the Sources screen lists the credit line; the caption does not suggest our base is real (it is a real photo of Mars, not of our outpost).
- [ ] `npm run build` passes.
### Push (B)
Backup-push `ui` every 30–45 minutes. When the checks pass: **PR P2 `ui` → `main`**, merge, tell A to pull.
 
---
 
## PHASE 2A — Preview and debrief (A, 45 min)
 
**Branch:** `logic`.
 
### Prompt 2A.1 — previewChoice
 
> Read CLAUDE.md first, sections 5.8 and 6. In `src/game/game.js` implement the real `previewChoice(state, challengeId, option)`. It must never change the state you pass in. It copies the state and applies the option with `choose`. If that option was the last job of the Sol (`solIsFinished` on the copy), it also runs `endSol` (the night) on the copy and sets `includesNight: true`. It returns `after` (the O, W, P, C, S values at that point, NOT including tomorrow's arrivals), `arriving` (the pending effects that would arrive tomorrow, empty unless `includesNight`), `failed` and `failReason`. `failed` is true if the option, the night, or tomorrow's arrival (run `startNextSol` on a further copy) would empty any of O, W, P, C. Add tests: preview does not mutate the original state; preview on the last job of a Sol includes the night; preview shows the Greenhouse C harvest in `arriving`; preview reports `failed: true` when the option would take Power to 0; preview reports `failed: true` when tomorrow's Earth reply C would empty a meter. Run `npm test`.
 
**What it does:** the "what will happen if I choose this" calculation used by the Confirm pop-up.
**Changes:** `src/game/game.js`, `src/game/game.test.js`.
**Output:** all tests pass. Example: Greenhouse C then Radiation B on Sol 1 starting from O75 W70 P80 C75 S0 → `after` O59 W47 P64 C75 S10 and `arriving` O+5, C+5.
 
### Prompt 2A.2 — debrief
 
> Read CLAUDE.md first, section 7. Implement the real `buildDebrief(state)` in `src/game/debrief.js`, returning `{ good: [], better: [], tip }`. Use `state.history` to know on which Sol each challenge was done, `state.sheltered`, and `state.log` to know whether the storm hit. Include the lines in CLAUDE.md section 7 exactly (sheltered; storm hurt the crew; fixed oxygen early; broken oxygen system wasted air; Earth reply came after the mission; plants did not have time; lowest meter tip). For a failed mission add a calm line naming the empty resource. Add tests: sheltered line when Radiation A was chosen on Sol 1; "reply came after the mission" when Earth was done on Sol 3; "plants did not have time" when Greenhouse was done on Sol 3; the tip names the lowest meter. Run `npm test`.
 
**Changes:** `src/game/debrief.js`, a new `src/game/debrief.test.js`.
**Output:** tests pass. `buildDebrief` of the CLAUDE.md worked example returns good lines ("protected the crew", "fixed the oxygen problem early"), a better line ("reply came after the mission") and a tip naming Power (28).
 
### Manual checks (A)
- [ ] `npm test` is green.
- [ ] By hand, call `previewChoice` twice and confirm the second call sees the same unchanged state.
- [ ] Re-do the Greenhouse C + Radiation B Sol 1 example above in your head from the rules; it should match the preview.
### Push (A)
**PR P3 `logic` → `main`**, merge, tell B to merge `main` before starting Confirm.
 
---
 
## PHASE 3A — NASA data into code (A, 40 min)
 
**Branch:** `logic`. The data is already collected; you check and convert it.
 
### Manual step first (15 min, no Claude Code)
Open all 6 links in `docs/spaceWeatherEvents.json`. On each page check the class and date match the file. `evt-1a` (C1.6, 2021-09-26) and `evt-3b` (X9.0, 2024-10-03) were not opened by the person who prepared the data, and four others have not yet been confirmed to open on the new host, so look closely. If a page differs from the file, trust the page and fix the file, or replace the record with one you can open. Tick section C of `docs/NASA_DATA_VERIFIED.md`.
 
### Prompt 3A — data into code
 
> Read CLAUDE.md first. Then read `docs/NASA_DATA_VERIFIED.md` and `docs/PHASE3A_data_prompt.md` and follow the prompt block in the second file. In short: confirm that `src/data/spaceWeatherEvents.json` is identical to `docs/spaceWeatherEvents.json`; replace the placeholder `src/data/nasaContent.js` with one entry per challenge (L, R, W, G, M) containing `title`, `text` (2–3 short kid-friendly sentences, explain each science word once), `lesson`, `sourceName`, `sourceUrl`, `badge` ('REAL' or 'GAME') and `gameNote`; keep the exports `SPACE_WEATHER_LABEL` and `RADIATION_BARS` (Mars surface 0.67 and trip to Mars 1.8 mSv/day only, plus a `// TODO (Day 2): ISS bar from NASA RadLab` comment). Use only the facts in section B of `docs/NASA_DATA_VERIFIED.md`. Do not add, change or round any NASA fact, and do not invent any value. Show me the files when done.
 
**What it does:** turns the verified facts into the data the drawers and Sources screen read.
**Changes:** `src/data/nasaContent.js`, `src/data/spaceWeatherEvents.json` (identical to docs).
**Output:** `NASA_CONTENT` has five entries with a source link each. `RADIATION_BARS` has two bars. The ISS bar is a TODO.
 
### Manual checks (A)
- [ ] Each `text` line says the same thing as its fact in `docs/NASA_DATA_VERIFIED.md` section B (read them all).
- [ ] REAL/GAME badges are right (facts = REAL; game values = GAME). Nothing says "live".
- [ ] Every `sourceUrl` opens in a browser.
- [ ] No number appears that is not in the docs file (search for digits).
### Push (A)
**PR P4 `logic` → `main`**, merge, tell B to merge `main`.
 
---
 
## PHASE 3A+ — NasaDrawer and Sources (A, 75 min)
 
**Branch:** `logic`.
 
### Prompt 3A+.1 — NasaDrawer
 
> Read CLAUDE.md first and `docs/WIREFRAMES.md` ("NASA drawer"). Replace the placeholder `src/components/NasaDrawer.jsx` (keep the props `{ challengeId, onClose }`). It reads `NASA_CONTENT[challengeId]` and shows the title, text, lesson line, a source line with a link, a 🟦 REAL NASA or 🟧 GAME NUMBERS badge, and the `gameNote`. On phones it opens as a full-screen sheet; on laptops it opens under the button. For Radiation (`R`) also show a simple CSS bar chart from `RADIATION_BARS`, showing only the bars in the file. Show nothing that is not in `nasaContent.js`. Do not install any packages.
 
**Changes:** `src/components/NasaDrawer.jsx`.
**Output:** a drawer with title, text, lesson, source link and badge; Radiation shows two bars.
 
### Prompt 3A+.2 — Sources
 
> Read CLAUDE.md first and `docs/WIREFRAMES.md` (Screen 8). Replace the placeholder `src/screens/Sources.jsx`. List the 6 flare records from `spaceWeatherEvents.json` (class, date, link) with the note "old records, not live data"; every source from `NASA_CONTENT`; the image credits from `src/assets/credits.txt` (if it is missing, show a clear "add credits" note instead); and a 🟧 GAME NUMBERS section saying: values are simplified and simulated; NASA has not landed people on Mars; the storm is based on a real flare record but is not a reading from Mars; Crew Health damage (−10, −30, −55) is a game number. Add a Back button that goes to `'title'` or `'debrief'` (whichever it came from). Do not add any source that is not in those files.
 
**Changes:** `src/screens/Sources.jsx`.
**Output:** a readable list of sources and the GAME NUMBERS honesty box.
 
### Manual checks (A)
- [ ] Open every drawer once (use the placeholder button in Challenge or call it from a test page). Check the badge and link.
- [ ] Open every link on the Sources screen.
- [ ] The Sources screen says the storm is not a reading from Mars.
### Push (A)
**PR P5 `logic` → `main`**, merge, tell B.
 
---
 
## PHASE 2B — Challenge, Confirm, Result (B, 90 min)
 
**Branch:** `ui`. Before you start, merge `main` into `ui` (you need the real `previewChoice`).
 
### Prompt 2B.1 — Challenge
 
> Read CLAUDE.md first. Build `src/screens/Challenge.jsx` following Screen 5 in `docs/WIREFRAMES.md`. It shows `state.selectedChallenge`'s data from `CHALLENGES`: title, intro, current meters, and three option cards. Each card shows title, text, and cost chips built from `effects` (gains green with +, costs orange with −, with the meter icon) and a "Tomorrow" chip from `later`. Radiation A and B show "Crew is SHELTERED"; Radiation C shows "Crew is NOT sheltered". On Sol 3 show the red notes from the wireframe (Radiation: the storm already passed; Greenhouse and Earth: the reward arrives after the mission ends). Add a Back button (to the Dashboard) and a "How NASA handles this" button that opens `NasaDrawer` with `challengeId` and `onClose`. Choosing an option opens the Confirm pop-up (built next). Do not change `src/game/*`.
 
**Creates/changes:** `src/screens/Challenge.jsx` (and `OptionCard.jsx`).
**Output:** three option cards with chips; "Back" works; the drawer opens.
 
### Prompt 2B.2 — Confirm and Result
 
> Read CLAUDE.md first, section 6, and `docs/WIREFRAMES.md` (Confirm and Result pop-ups). Build `src/components/ConfirmModal.jsx` and `src/components/ResultModal.jsx`. Confirm calls `previewChoice(state, cid, opt)` and shows NOW → AFTER for each meter. If `includesNight` is true the column is titled "AFTER TONIGHT" and a line lists tomorrow's arrivals from `arriving`. If `failed` is true show the red warning "If you choose this, the mission ends." (the player may still confirm). For Greenhouse or Earth on Sol 3 show the "arrives after the mission ends" warning. Nothing changes until Confirm, which dispatches `CHOOSE`. Result shows what changed, a short what-happened line, the real-NASA lines from the wireframe where they apply, and a Continue button. On Continue call `actions.continueAfterResult()`. Do not work out the next screen yourself and do not call `endSol` in the screen.
 
**Creates/changes:** `src/components/ConfirmModal.jsx`, `ResultModal.jsx`.
**Output:** choosing an option shows a before/after table; Confirm shows the result; Continue returns to the Dashboard or moves to the Sol Summary.
 
### Manual checks (B)
- [ ] Choose Radiation B from the start: Confirm shows Water 70→56, Power 80→78, Science 0→6.
- [ ] Cancel ("Change choice") changes nothing.
- [ ] Do two jobs: the second Confirm shows "AFTER TONIGHT" and "arriving tomorrow" if Greenhouse or Earth was done.
- [ ] After the 2nd job of Sol 1 the app goes to the Sol Summary placeholder.
- [ ] Cost chips are readable on a phone.
- [ ] `npm run build` passes.
### Push (B)
**PR P6 `ui` → `main`**, merge, tell A.
 
---
 
## PHASE 4 — Integration (both, 45 min)
 
**Goal:** the screens run on the real logic and a real storm.
 
### Steps
1. A confirms `main` has P1–P6. B runs `git merge main` into `ui`, then runs `npm test`, `npm run build`, `npm run dev`.
2. A checks `grep -rn "STUB" src/game` returns nothing.
3. Both play one full game together (A drives, B watches, then swap).
4. Reproduce the worked example from `CLAUDE.md` section 5.9 by clicking the same choices, and compare the numbers on screen.
### Prompt 4 — fix a mismatch (use as needed)
 
> Read CLAUDE.md first. Play-test finding: [exactly what I did, what I expected, what happened]. Find the cause. If it is a rules bug in `src/game/`, first write a failing test that shows it, then fix it. If it is a screen bug, fix the smallest thing. Do not change any game numbers or NASA data. Tell me what you changed.
 
**What it does:** fixes one problem at a time, test first.
**Output:** a new failing-then-passing test (rules bug) or a small screen fix.
 
### Manual checks (both)
- [ ] One full run reaches the Sol Summary and the Debrief with no console errors.
- [ ] The storm card shows a real class and date, and they change between runs.
- [ ] The worked example numbers match on screen.
### Push (both)
Small PRs into `main` (P7), one per fix.
 
---
 
## PHASE 3B — Sol Summary and Debrief (B, 75 min)
 
**Branch:** `ui`.
 
### Prompt 3B.1 — Sol Summary
 
> Read CLAUDE.md first, section 5.10, and `docs/WIREFRAMES.md` (Screen 6). Build `src/screens/SolSummary.jsx`: what the player did today (from `state.history` for the Sol that just ended), tonight's changes from `state.log` (storm, upkeep, penalty for that Sol), the meters, what arrives tomorrow from `state.pending`, and a "Start Sol N" button. The button calls `actions.startMorning()` (after Sol 3, when `state.phase === 'complete'`, it reads "See Mission Debrief" and the same call opens the Debrief). Do not dispatch or navigate yourself. The "arriving tomorrow" box becomes "Arrives after the mission" when something is still pending after Sol 3. The morning report card is shown on the Dashboard from `morningReport` (the `harvest` and `earthReply` entries) with a dismiss button that calls `actions.clearMorningReport()`.
 
**Output:** the example from the wireframe (Sol 1: Radiation B + Greenhouse C) shows O59 W47 P64 C75 S10 and "arriving tomorrow: Oxygen +5, Crew +5".
 
### Prompt 3B.2 — Debrief
 
> Read CLAUDE.md first and `docs/WIREFRAMES.md` (Screen 7). Build `src/screens/Debrief.jsx`: the headline from `outcome(state).label`; final meters with `statusLabel`; Science with its goal; the choices by Sol (from `state.history`); the storm size with the real record (class and date from `state.event`, badge text from `SPACE_WEATHER_LABEL`); `buildDebrief(state)` for "What went well", "What to improve" and the tip; "Arrives after the mission" if `state.pending` is not empty; two classroom questions; the honesty line ("Game numbers are simplified. The storm is based on a real record."); and buttons Play Again (`actions.playAgain()`), Sources and Restart (`actions.restart()`). If the mission failed show the calm failure message and no scary styling.
 
**Output:** the Debrief matches the wireframe's example for the worked game (Complete — With Challenges, tip: Power 28).
 
### Manual checks (B)
- [ ] Play to the end: the Sol Summary and Debrief numbers match the meters you saw.
- [ ] Force a failure (choose big power costs): the Debrief shows the calm failure message.
- [ ] Play Again gives a new storm and keeps the nickname.
- [ ] Compare with `WIREFRAMES.md` Screens 6 and 7.
### Push (B)
**PR P8 `ui` → `main`**, merge, tell A.
 
---
 
## PHASE 5 — Playtest, fix, deploy (both, 80 min)
 
1. Each person plays **5 full games** with different orders. Try to reach all 4 endings.
2. Log every bug (steps, screen, expected vs actual). Fix the worst with the Phase 4 prompt.
3. Merge all fixes to `main` (P9). Test the **live link** on two phones.
4. Tag the release: `git tag day1 && git push --tags`.
### Day 1 exit checklist
- [ ] Title → Callsign → Intro → 3 Sols → Debrief runs with no errors
- [ ] "Commander [nickname]" shows in Mission Control, Dashboard and Debrief
- [ ] All 15 options match the table in `CLAUDE.md`
- [ ] The storm size and the real flare date and class change between runs
- [ ] The Confirm pop-up warns before a mission-ending choice
- [ ] All 4 endings can be reached
- [ ] Every NASA drawer has a source link and a REAL/GAME badge
- [ ] The Sources screen lists all sources and the 6 flare records; nothing is called "live"
- [ ] All 6 flare links opened and matched by a person
- [ ] Live link works on a phone; `npm test` passes; `npm run build` passes
**If every box is ticked, you can submit now. Everything after this is a bonus.**
 
---
 
## PHASE 6 — Day 2: live data upgrades (A, 2.5 h)
 
**Branch:** `logic-day2`.
 
### 6.1 DONKI call (60 min)
**Manual first (15 min):** open 2–3 DONKI API addresses from NASA's current DONKI pages in a browser and note which one returns a flare list. Do not give Claude Code an address you have not tested.
 
> Read CLAUDE.md first. Create `src/game/donki.js` exporting `loadStorm(entry)`. It asks NASA's DONKI archive for the entry's date using this URL pattern: [paste the address you tested]. It waits at most 4 seconds, picks the strongest flare in the answer, and returns `{origin:'api', severity, classType, date, url}`. If the request fails, times out or returns nothing, it returns the saved record as `{origin:'stored', ...}`. Add tests with a fake `fetch` for each case. Never return an invented event. In `App.jsx` use `loadStorm` inside `startMission`, with the saved record as fallback. Badge text: `api` → "REAL NASA · fetched from DONKI archive · [date]"; `stored` → "REAL NASA · saved copy of a DONKI record · [date]". Never use the word "live".
 
**Creates:** `src/game/donki.js` and its test; small change in `App.jsx`.
**Output:** with internet the badge may say "fetched from DONKI archive"; offline it says "saved copy". The game never waits more than ~4 seconds.
**Manual check:** turn off Wi-Fi and start a game: it must still work with "saved copy".
 
### 6.2 RadLab ISS number (40 min, mostly manual)
Open NASA RadLab (OSDR), download one day of ISS dose data, average the dose-equivalent rate (μSv/hour), then mSv/day = average × 24 ÷ 1000. Give Claude Code only the number, the date range and the source:
 
> Read CLAUDE.md first. In `src/data/nasaContent.js` add a third bar to `RADIATION_BARS`: label "Inside the ISS", `mSvPerDay: [my number]`, source "NASA RadLab (OSDR), [date range]". Change nothing else.
 
If you cannot get it working in 40 minutes, skip it. The two bars are enough.
 
### 6.3 Re-check (20 min)
Open the SwRI release and confirm 0.67 and 1.8 mSv/day. Open every other source link once more.
 
### Push (A)
One PR per task into `main`.
 
---
 
## PHASE 7 — Day 2: polish (B, 2.5 h)
 
**Branch:** `ui-day2`. Do in order; stop any time.
 
1. Phone layout pass on every screen (40 min)
2. Intro slides 3 and 4 (20 min)
3. More NASA photos with credit lines, e.g. Title screen (the Intro Mars photo is already done in Phase 1B) (20 min)
4. Explorer Mode toggle (30 min)
5. Classroom questions polish (15 min)
6. Animations (15 min)
**Prompt pattern:**
> Read CLAUDE.md first. Task: [one item from the list]. Change only `src/screens/*`, `src/components/*` and `src/styles/*`. Do not touch `src/game/*` or `src/data/*`. Tell me what you changed.
 
**Animations with Framer Motion:** first ask Claude Code *"Do we need Framer Motion for this? If yes, tell me why and wait for my yes before installing."* It must ask for permission (see `CLAUDE.md`). Keep animations short and optional. Anything that slows the game down should be cut.
 
**Manual checks:** every screen at phone width; every button at least 48px; no text under 18px; the game still works with animations turned off.
**Push:** one PR per item into `main`.
 
---
 
## PHASE 8 — Day 2: QA, video, submission (both, 3 h)
 
| Task | Time |
|---|---|
| Play 10 full games on a laptop and a phone; fix bugs | 60 min |
| Read all text as a 9-year-old; shorten long sentences | 20 min |
| Check every NASA fact and link against `docs/NASA_DATA_VERIFIED.md` | 20 min |
| Final deploy; test the live link on 2 devices | 20 min |
| Record a 2–3 minute backup video; take 3 screenshots | 30 min |
| Write the submission text (Complete Game Plan, Part 6.4) | 20 min |
| Practise the demo twice (Complete Game Plan, Part 6.3) | 20 min |
 
**No new features in the last 90 minutes.**
 
---
 
## TEAM RULES
 
- **Start every prompt with "Read CLAUDE.md first."** One task per prompt.
- **If Claude Code drifts:** *"Re-read CLAUDE.md and `docs/WIREFRAMES.md`, then redo only [task]. Do not touch other files."*
- **If it changes a number or a NASA fact:** reject the change: *"Revert that. Do not change game numbers or NASA data."*
- **If it wants to install a package:** it must ask; say yes only if you need it.
- **Always** run the app and read the diff after each task.
- **Sync** 5 minutes every 2 hours: done, next, blocked.
## CUT LIST (cut in this order if late)
 
1. Intro slides 3–4, photos, animations
2. Explorer Mode
3. Print report, classroom questions
4. Radiation bar chart (keep the text)
5. Sol Summary detail (keep 3 lines)
6. The live DONKI call (the saved copy is enough)
**Never cut:** the Confirm preview warning, the real storm record, REAL/GAME badges, the NASA drawers with sources, the Sources screen, deploy.
 
## RISKS
 
| Risk | What to do |
|---|---|
| Claude Code breaks a rule in `CLAUDE.md` | Reject it. Ask it to re-read `CLAUDE.md` and name the section it broke. |
| A flare link or class does not match the page | Trust the page. Fix the file or replace the record with one you can open. |
| Claude Code rewrites a NASA fact and changes its meaning | Compare each drawer text with section B of the docs file. |
| A drawer says REAL for a game number | Check every badge. Game values are GAME. |
| Screens drift from the wireframes | Re-point Claude Code to the exact screen number in `docs/WIREFRAMES.md`. |
| Merge conflicts | Obey file ownership; merge small and often. |
| A rules bug is found late | Write a failing test first, then fix. |
| DONKI or RadLab fail on Day 2 | Keep the saved copy and the two bars, labelled honestly. |
| Running out of time | Use the cut list. Deploy anyway. |
 