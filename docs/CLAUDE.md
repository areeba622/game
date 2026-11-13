# CLAUDE.md — MARSBOUND

You are helping build **MARSBOUND**, a browser game. You know nothing about this project yet. Everything you need is in this file and in `docs/`. **Read this whole file before doing anything.**

---

## 1. What we are building

MARSBOUND is a short educational game for children aged 7–12. The player is the Commander of a Mars outpost. Over **3 Sols** (a Sol is one Mars day) the player solves **5 challenges**: life support, radiation, power, food, and delay in talking to Earth. Resources (Oxygen, Water, Power, Crew Health) are limited, so every choice costs something. A **solar storm** hits at the end of Sol 2 unless the crew is sheltered. The storm's size comes from a **real NASA solar flare record**. At the end a **Mission Debrief** explains why the mission went well or badly.

It is our entry for the **NASA Space Apps Challenge "Build a Junior Astronaut Mission Trainer"**. NASA wants: real space-mission ideas for kids, limited resources and trade-offs, honest use of real NASA data (saved or archived data must NOT be called live), clear kid-friendly explanations, and a working web app with sources and credits.

**Deadline: 2 days.** A complete, working, deployed game comes first. Polish comes second.
**It is a simulation.** NASA has not landed people on Mars. Real NASA facts are labelled **REAL NASA**. Invented game values are labelled **GAME NUMBERS**.

## 2. Tech stack

- React (JSX) + Vite. No router: a `screen` value in state picks the screen. `useReducer` for game state.
- Plain CSS by default. A library (for example **Framer Motion**) is allowed only where it clearly helps. **Ask me before installing any package**, say what it is for, and wait for my yes.
- Tests: `vitest` (`npm test` = `vitest run`). Run: `npm run dev`. Build: `npm run build`. Deploy: Vercel or Netlify from `main`.
- No backend, database or accounts. The game must work offline (the optional Day 2 NASA fetch falls back to saved data).

## 3. Team and rules

Two people, each with their own Claude Code session:
- **Person A (logic and data):** `src/game/*`, `src/data/*`, `src/components/NasaDrawer.jsx`, `src/screens/Sources.jsx`, the reducer in `src/App.jsx`. Branch `logic`.
- **Person B (screens and design):** `src/screens/*` (except Sources), `src/components/*` (except NasaDrawer), `src/styles/*`, `src/assets/*`. Branch `ui`.

If a task would change the other person's files, **stop and tell me first**. Keep changes small. `main` must always run.

### Hard rules
1. **Never change a game number** without asking me. They were balanced by simulating all 87,480 possible games.
2. **Never invent NASA data** (flare dates, classes, links, radiation values, quotes, sources). Use only `docs/NASA_DATA_VERIFIED.md` and `docs/spaceWeatherEvents.json`. If a fact is missing, write `// TODO` and tell me.
3. **Never call saved or archived data "live".** Say "archive" or "saved copy".
4. **Game rules live in `src/game/` as plain functions with no React imports.** Never mutate the old state; return a new object.
5. **Do exactly what I ask.** No extra features, no refactors, no rewriting files I did not mention.
6. **If anything is unclear or this file disagrees with my request, ask before guessing.**
7. After each task: say what you changed, run `npm test` if you touched `src/game/`, and tell me how to check it by hand.

## 4. Folder layout

```text
CLAUDE.md
docs/
  WIREFRAMES.md                    layout of every screen and pop-up (follow this)
  MARSBOUND_Game_Overview.md       the game in simple words
  MARSBOUND_Team_Dev_Plan_v3.md    schedule and prompts
  MARSBOUND_Complete_Game_Plan.md  use ONLY Part 7 (kid text); its wireframes and engine parts are old
  NASA_DATA_VERIFIED.md            the only source of NASA facts
  spaceWeatherEvents.json          the 6 real flare records (master copy)
  PHASE3A_data_prompt.md           prompt that turns the NASA data into code
src/
  game/        game.js  challenges.js  debrief.js  storm.js  (Day 2: donki.js)
  data/        nasaContent.js  spaceWeatherEvents.json
  screens/     Title Callsign Intro Dashboard Challenge SolSummary Debrief Sources
  components/  ResourceBar ChallengeCard OptionCard NasaDrawer ConfirmModal ResultModal StormForecast MissionControl
  styles/      theme.css
  assets/      images + credits.txt
  App.jsx      reducer + current screen
```

---

## 5. Game rules (implement exactly)

### 5.1 Meters
| Meter | Key | Start |
|---|---|---|
| Oxygen | `O` | 75 |
| Water | `W` | 70 |
| Power | `P` | 80 |
| Crew Health | `C` | 75 |
| Science | `S` | 0 (no upper limit) |

Clamp `O, W, P, C` to **0–100** after every change. Show **word + colour + icon**, never colour alone: 70–100 **Healthy** · 40–69 **OK** · 20–39 **Low** · 1–19 **Critical** · 0 **Empty**.

### 5.2 Structure
Sol 1: choose any **2** challenges. Sol 2: any **2** more. Sol 3: the last **1**. The player picks the order. Each challenge is done once. Each has options **A, B, C**. When `doneThisSol` reaches the quota (2, 2, 1) the **night** runs.
Ids: `L` Life Support · `R` Radiation Shelter · `W` Power Budget · `G` Greenhouse · `M` Earth Is Far Away.

### 5.3 Option effects (copy exactly)
`+` gain, `−` cost. "Later" effects arrive at the **start of the next Sol**.

| Ch. | Opt | Effects now | Later |
|---|---|---|---|
| L | A | O+20, W−12, P−15, C+5 | – |
| L | B | O−5, P+3, C+1 | – |
| L | C | O+10, W−7, P−8, C+3, S+2 | – |
| R | A | W−2, P−6, **sheltered** | – |
| R | B | W−14, P−2, S+6, **sheltered** | – |
| R | C | W−1, P−4, S+12 | – |
| W | A | P−6, O+4, C+4 | – |
| W | B | P−20, C−3, S+15 | – |
| W | C | P+12, O−3, C−3, S+2 | – |
| G | A | W−12, P−14, S+8 | O+10, C+10 |
| G | B | C−4 | – |
| G | C | W−6, P−7, S+4 | O+5, C+5 |
| M | A | P−5, C+3 | P+6 |
| M | B | P−10, C+8 | C+5 |
| M | C | P−2, C−10, S+8 | P−8, C−5 |

- **Sheltered** counts only if Radiation A or B is chosen on **Sol 1 or Sol 2**. On Sol 3 it is too late. Radiation C never shelters.
- Greenhouse or Earth done on **Sol 3**: the "later" effect **never arrives** (the mission ends first). Warn in the Confirm pop-up and the Debrief.

### 5.4 The night and the morning (two separate functions)

**`endSol(state)` = the NIGHT.** Runs when the quota is reached. In this order:
1. **Storm** (end of Sol 2 only): if not `sheltered`, `C -= {severity 1: 10, 2: 30, 3: 55}`.
2. **Upkeep** (every Sol, **including Sol 3**): `O -= 8`, `W -= 3`, `P -= 3`.
3. **Unfinished problems** (every Sol): Life Support (`L`) not done → `O -= 8` more. Power Budget (`W`) not done → `P -= 4` more.
4. **Failure check:** any of `O, W, P, C` is 0 → `phase = 'failed'`, stop.
5. If `sol == 3` → `phase = 'complete'` (pending effects never arrive). If `sol < 3` → do nothing more; leave `pending` untouched so the Sol Summary can show "arriving tomorrow".

**`startNextSol(state)` = the MORNING.** Runs when the player presses "Start Sol N" (only if `phase === 'active'` and `sol < 3`):
1. Apply every effect in `pending`, add `harvest` / `earthReply` log entries, clear `pending`.
2. `sol += 1`, `doneThisSol = 0`.
3. Failure check again (Earth reply C can empty a meter).

**`choose`** also checks for failure right after every option. It ignores the call (returns the state unchanged) if the challenge is already done or `phase` is not `'active'`.

### 5.5 Final result (check in this order)
1. **Mission Failed:** any of `O, W, P, C` is 0.
2. **Mission at Risk:** lowest of `O, W, P, C` is **19 or less**.
3. **Complete — With Challenges:** lowest is 20–39, **or** Science < 15.
4. **Mission Successful:** all four ≥ **40** and Science ≥ **15**.

There is **no power-emergency pop-up and no recovery**.

### 5.6 Storm size from the real flare class
Class starting with **A, B or C → severity 1** (mild) · **M → 2** (medium) · **X → 3** (severe).

### 5.7 State shape
```js
state = {
  sol: 1, O: 75, W: 70, P: 80, C: 75, S: 0,
  done: {},              // { R:'B', L:'C' } challenge -> option
  history: [],           // [{ sol, cid, opt }] in order chosen; `choose` appends
  doneThisSol: 0,
  sheltered: false,
  pending: [],           // effects arriving at the start of the next Sol
  severity: 1,           // 1 | 2 | 3
  event: null,           // the flare record from spaceWeatherEvents.json
  nickname: 'Commander', // set by the START action, never by game.js
  phase: 'active',       // 'active' | 'failed' | 'complete'
  failReason: null,
  log: []                // [{ sol, kind:'storm'|'upkeep'|'penalty'|'harvest'|'earthReply', text }]
}
```

### 5.8 Functions the screens call (the contract; names must not change)
```js
// src/game/game.js
newGame(severity)                     // -> state
choose(state, cid, opt)               // -> new state (apply effects, mark done, append history, queue "later", clamp, check failure)
solIsFinished(state)                  // -> boolean
endSol(state)                         // -> new state (NIGHT)
startNextSol(state)                   // -> new state (MORNING)
previewChoice(state, cid, opt)        // -> { after:{O,W,P,C,S}, includesNight, arriving:[...], failed, failReason }
outcome(state)                        // -> { key:'failed'|'atRisk'|'withChallenges'|'successful', label }
statusLabel(value)                    // -> { word, color, icon }
// src/game/debrief.js    buildDebrief(state) -> { good:[], better:[], tip }
// src/game/challenges.js CHALLENGES = { L:{ id, title, icon, intro, options:{ A:{title,text,effects,later,sheltered?}, B, C } }, ... }
// src/game/storm.js      pickStorm(events) -> one random record
// src/data/nasaContent.js  NASA_CONTENT[challengeId], SPACE_WEATHER_LABEL, RADIATION_BARS
```
`effects` and `later` look like `{ O:20, W:-12 }`. Keep all option numbers only in `challenges.js`; `game.js` reads them.

**`previewChoice` never changes the real state.** It copies the state and applies the option. If that was the last job of the Sol it also runs `endSol` on the copy (`includesNight: true`). `after` does NOT include tomorrow's arrivals. `arriving` lists the pending effects that would arrive tomorrow (empty unless `includesNight`). `failed` is true if the option, the night, or tomorrow's arrival (run `startNextSol` on a further copy) would empty a meter.

### 5.9 Worked example (use as a test), severity 2
| Step | Calls | Expected state |
|---|---|---|
| Start | `newGame(2)` | O75 W70 P80 C75 S0, Sol 1 |
| Sol 1: Life Support C, Radiation A | `choose` ×2, `endSol` | **O77 W58 P59 C78 S2** (Power Budget not done: P −4 extra; no storm on Sol 1) |
| Morning | `startNextSol` | same numbers, Sol 2 |
| Sol 2: Power A, Greenhouse A | `choose` ×2, `endSol` | **O73 W43 P36 C82 S10** (sheltered; harvest still pending) |
| Morning | `startNextSol` | **O83 W43 P36 C92 S10** (harvest O+10, C+10), Sol 3 |
| Sol 3: Earth A | `choose`, `endSol` | **O75 W40 P28 C95 S10**, `phase` complete → Complete — With Challenges (Earth reply P+6 never arrives) |

More tests: Radiation A on Sol 1 → no storm damage; Radiation never done with severity 3 → C −55 on the night of Sol 2; Greenhouse A on Sol 1 → harvest still in `pending` after `endSol`, applied after `startNextSol`; fresh game has the start values; `history` records `{sol,cid,opt}`; `previewChoice` does not mutate the state; `previewChoice` reports `failed:true` for the option, the night, or tomorrow's arrival; Earth A on Sol 1 → the reply (P+6) is in `pending` after `endSol` and arrives after `startNextSol`; Earth on Sol 3 → the reply never arrives; Earth A + Greenhouse A on Sol 2 (after Life Support C + Radiation A on Sol 1) then Power A on Sol 3 → O69 W43 P33 C81 S10 after the Sol 2 night, O79 W43 P39 C91 S10 after the morning, final O75 W40 P30 C95 S10; Earth reply C fails the mission in `startNextSol` when Power ≤ 8; choosing a done challenge changes nothing.

### 5.10 App wiring (App.jsx ↔ screens)
- `useReducer` actions: `START {severity, event, nickname}` · `CHOOSE {cid, opt}` · `END_SOL` · `START_SOL`. They call `newGame`, `choose`, `endSol`, `startNextSol`.
- `useState` (not game state): `screen` = `'title'|'callsign'|'intro'|'dashboard'|'challenge'|'solSummary'|'debrief'|'sources'`, plus `selectedChallenge` (`'L'|'R'|'W'|'G'|'M'|null`) and `morningReport` (what arrived this morning, or null).
- Every screen gets props `{ state, dispatch, go }`. `go(screenName, payload)` changes screen; `go('challenge','R')` opens a challenge.
- `startMission(nickname)` in `App.jsx`: pick a record with `pickStorm(events)`, dispatch `START {severity: event.severity, event, nickname}`, `go('intro')`. The Callsign screen calls it (Skip passes `'Commander'`).
- After a choice: Confirm → dispatch `CHOOSE` → Result → **Continue**: if `phase !== 'active'` → debrief; else if `solIsFinished` → dispatch `END_SOL`, then debrief if `phase` is `'failed'` or `'complete'`, else solSummary; else dashboard.
- Sol Summary button: dispatch `START_SOL`, show the morning report, then debrief if `phase === 'failed'`, else dashboard. After Sol 3 the button reads "See Mission Debrief" and goes to debrief.
- Phase 0 placeholders (names and props must not change later): `NasaDrawer.jsx` (props `{challengeId, onClose}`), `Sources.jsx`, and `src/data/nasaContent.js` with `SPACE_WEATHER_LABEL = 'REAL NASA · saved copy of a DONKI record'`, `NASA_CONTENT = {}`, `RADIATION_BARS = []`.

---

## 6. Confirm pop-up
Show **NOW → AFTER** per meter from `previewChoice`. If `includesNight`, title the column **"AFTER TONIGHT"** and add "Arriving tomorrow: …" from `arriving`. If `failed`, show a red **"If you choose this, the mission ends."** (the player may still confirm). Greenhouse on Sol 3: "Plants need time. This harvest comes after the mission ends." Earth on Sol 3: "Earth's reply comes after the mission ends." Nothing changes until **Confirm**.

## 7. Debrief lines (`buildDebrief`, using `state.history` and `state.log`)
- Sheltered → good: "You protected the crew before the storm."
- Storm hit, not sheltered → better: "The storm hurt the crew. Shelter before the end of Sol 2."
- Life Support done on Sol 1 → good: "You fixed the oxygen problem early."
- Life Support never done → better: "The broken oxygen system wasted air every night."
- Earth done on Sol 3 → better: "The reply came after the mission. Send messages early."
- Greenhouse done on Sol 3 → better: "Plants did not have time to grow."
- Lowest meter below 40 → tip: "Your lowest meter was [name] ([value])."
- Failed → a calm line naming the empty resource, e.g. "The crew ran out of power. Try again and plan sooner."

## 8. Screens (8 screens + 3 pop-ups)
Title → **Callsign** → Intro → Dashboard ⇄ Challenge → Confirm → Result → Sol Summary → … → Debrief. **Sources** opens from Title and Debrief. Layouts and text: `docs/WIREFRAMES.md` (follow it). Kid text: Complete Game Plan Part 7.

**Look:** dark navy background, Mars-orange buttons, white text, rounded cards, text ≥ 18px, buttons ≥ 48px tall. Phone: meters in 2 columns, challenge cards in 1 column. Dashboard challenge cards show warning chips: Life Support "costs 8 Oxygen each night if not done", Power Budget "costs 4 Power each night if not done", Radiation "storm at end of Sol 2".
**Kid language:** short sentences (about 12 words). Explain each science word once (Sol, radiation, millisievert, DONKI).

### 8.1 Callsign (nickname)
- Ask "What should we call you, Commander?" with a text box, Continue and Skip. Optional chips: Nova, Comet, Orbit.
- 2–16 characters after trimming and collapsing spaces. Invalid → friendly message ("Pick a name with 2 to 16 letters"), do not continue. Skip uses `'Commander'`.
- Show "Use a nickname, not your real name." **Never ask for a real name, age, email or any personal data.**
- Memory only: `state.nickname` via `START`. **No localStorage, cookies or server.** Render as plain text (never `dangerouslySetInnerHTML`). Play Again keeps it; Restart returns to Callsign.
- **Display name:** write all text with `{commander}`, which is `"Commander " + nickname`, or just `"Commander"` when the nickname is `'Commander'` (never "Commander Commander"). Use it in Mission Control, Intro, Dashboard, Sol Summary and Debrief. `game.js` never reads the nickname.

## 9. NASA data and images
- Facts and flare records come **only** from `docs/NASA_DATA_VERIFIED.md` and `docs/spaceWeatherEvents.json`. `src/data/spaceWeatherEvents.json` is an array of `{ id, severity, date, classType, url }`; pick one per game with `pickStorm`.
- Every NASA item on screen gets a badge: **🟦 REAL NASA** (source and date) or **🟧 GAME NUMBERS**.
- Storm badge: **"REAL NASA · saved copy of a DONKI record · [date]"** (Day 2 if the fetch works: "fetched from DONKI archive"). Never "live". Show flare class and date wherever the storm appears (Dashboard, Radiation result, Debrief).
- The storm is **based on** a real flare. It is **not** a reading from Mars. The Sources screen must also say: −10/−30/−55 Crew Health are game numbers, and NASA has not landed people on Mars.
- The ISS radiation bar is Day 2 (NASA RadLab). Do not add a number for it.
- Each NASA drawer ("How NASA handles this") shows: title, short text, lesson, source link, REAL/GAME badge, and a "game numbers are simplified" note.
- **Mars photo:** Intro slide 1 may show one real NASA photo of Mars from `src/assets/` (a local file, never a hotlink), with the caption and credit I give you. Do not invent a rover name, date or credit. The caption must make clear it is a real photo of Mars, not our outpost. Credit lines go in `src/assets/credits.txt` and on the Sources screen. Never use the NASA logo.

## 10. Scope
**Day 1:** theme → game logic + tests → real flare data → App reducer → Title, Callsign, Intro → Dashboard → Challenge → Confirm → Result + Sol Summary → Debrief → NASA drawers → Sources → deploy.
**Day 2:** DONKI fetch with saved-copy fallback → RadLab ISS number → more photos → phone layout → Explorer Mode (exact numbers and units) → bug fixing → final deploy.
**Cut order if late:** intro slides 3–4 → Sol Summary detail → drawer charts → Explorer Mode → extra photos.
**Never cut:** Confirm warning, real storm record, REAL/GAME badges, NASA drawers with sources, Sources screen, deploy.
**Do NOT build:** sound or music, pause menu, accounts, backend, database, power-emergency pop-up, Mars Rover Photos API, maps, skill ranks, extra meters, extra random events, anything that needs a live API to work.

## 11. Done when (Day 1)
- A full mission plays Title → Callsign → Debrief with no errors, in any order; the nickname shows in Mission Control, Dashboard and Debrief; a done challenge cannot be picked again.
- All 15 options match 5.3; meters stay in 0–100; the night runs once per Sol, including Sol 3.
- The flare class, date and storm size change between runs; all 4 endings are reachable.
- The Confirm pop-up warns before a mission-ending choice.
- Every NASA drawer has a source link and a REAL/GAME badge; Sources lists every source and all 6 flare records; nothing is called "live".
- Works on laptop and phone; `npm test` and `npm run build` pass; the public link works.

## 12. If you are unsure
Stop and ask. Say what is unclear and offer your best guess as a question. Never fill a gap with invented game numbers or NASA facts.
