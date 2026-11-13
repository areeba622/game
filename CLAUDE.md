# CLAUDE.md — MARSBOUND

You are helping build **MARSBOUND**, a browser game. You have no prior knowledge of this project. Everything you need is in this file and in the `docs/` folder. Read this whole file before doing anything.

---

## 1. What we are building

MARSBOUND is a short educational game for children aged 7–12 (parents and classrooms can play too). The player is the commander of a Mars outpost. Over **3 Sols** (a Sol is one day on Mars) the player solves **5 challenges** about life support, radiation, power, food and communication delay. Resources (air, water, power, crew health) are limited, so every choice costs something. A **solar storm** hits at the end of Sol 2 unless the crew is sheltered. The storm's size comes from a **real NASA solar flare record**. At the end the player sees a **Mission Debrief** that explains why the mission went well or badly.

It is our entry for the **NASA Space Apps Challenge: "Build a Junior Astronaut Mission Trainer"**. NASA wants: a game or trainer that teaches real space-mission ideas to kids; limited resources and trade-offs (every choice has a cost); honest use of real NASA data (live or archived; archived or saved data must NOT be presented as live); clear explanations; kid-friendly language; a working web app with sources and credits.

**Deadline: 2 days.** Priority: a complete, working, deployed game first. Polish second.

**It is a simulation.** NASA has not landed people on Mars. Game numbers are simplified. Real NASA facts are labelled **REAL NASA**; invented game values are labelled **GAME NUMBERS**.

---

## 2. Tech stack and commands

- React (JSX) with Vite. No router (a `screen` value in state chooses the screen). `useReducer` for game state.
- Styling: plain CSS by default. Libraries are allowed where they clearly help (for example **Framer Motion** for animations), but **ask me for permission before installing any new package**, say what it is for, and install it only after I say yes. Keep the bundle small and do not add a library for something plain CSS or React already does well.
- Tests: `vitest`. Run with `npm test` (script: `vitest run`).
- Run: `npm run dev`. Build: `npm run build`. Deploy: Vercel or Netlify from the `main` branch.
- No backend, no database, no accounts. The game must work offline (except an optional Day 2 NASA fetch that falls back to saved data).

## 3. Team and working rules

Two people work on this repo, each with their own Claude Code session:

- **Person A: logic and data.** Owns `src/game/*`, `src/data/*`, `src/components/NasaDrawer.jsx`, `src/screens/Sources.jsx`, and the reducer in `src/App.jsx`.
- **Person B: screens and design.** Owns `src/screens/*` (except Sources), `src/components/*` (except NasaDrawer), `src/styles/*`, `src/assets/*`.

If a task would change files owned by the other person, **stop and tell me** before editing. Work on your own branch (`logic` for A, `ui` for B) and keep changes small. `main` must always run.

### Hard rules (never break these)
1. **Do not change any game number** in this file without asking me. They were balanced by simulating all 87,480 possible games.
2. **Never invent NASA data.** Do not write flare dates, classes, URLs, radiation values, quotes or source links from memory. Use only what is in `docs/NASA_DATA_VERIFIED.md` and `docs/spaceWeatherEvents.json`. If you need a fact that is not there, write `// TODO` and tell me.
3. **Never call archived or saved data "live".** Say "archive" or "saved copy".
4. **Keep game logic out of React.** All rules live in `src/game/` as plain functions with no React imports. Never mutate the old state; return a new object.
5. **One task at a time.** Do exactly what I ask. Do not add features, refactor unrelated code, or rewrite files I did not mention.
6. **If anything is unclear or this file contradicts what I ask, ask me before guessing.**
7. **Ask before installing any package** (npm install). Say what it is and why, and wait for my yes.
8. After finishing a task: say what you changed, run `npm test` if you touched `src/game/`, and tell me how to check it by hand.

---

## 4. Folder layout

```text
CLAUDE.md
docs/
  MARSBOUND_Complete_Game_Plan.md   wireframes (Part 4) and kid text (Part 7). Ignore Part 5 (it describes an engine we do NOT use).
  MARSBOUND_Team_Dev_Plan_v2.md     schedule and prompts
  NASA_DATA_VERIFIED.md             the only source of NASA facts and flare records
  spaceWeatherEvents.json           master copy of the 6 flare records
  PHASE3A_data_prompt.md            data prompt
src/
  game/        game.js  challenges.js  debrief.js  storm.js  (Day 2: donki.js)
  data/        nasaContent.js  spaceWeatherEvents.json
  screens/     Title  Intro  Dashboard  Challenge  SolSummary  Debrief  Sources
  components/  ResourceBar  ChallengeCard  OptionCard  NasaDrawer  ConfirmModal  ResultModal  StormForecast  MissionControl
  styles/      theme.css
  assets/      images + credits.txt
  App.jsx      reducer + current screen
```

---

## 5. The game rules (implement exactly)

### 5.1 Meters
| Meter | Key | Start |
|---|---|---|
| Oxygen | `O` | 75 |
| Water | `W` | 70 |
| Power | `P` | 80 |
| Crew Health | `C` | 75 |
| Science | `S` | 0 (no upper limit) |

Clamp `O, W, P, C` to **0–100** after every change. Status words (always show **word + colour + icon**, never colour alone):
70–100 **Healthy** · 40–69 **OK** · 20–39 **Low** · 1–19 **Critical** · 0 **Empty**.

### 5.2 Structure
- Sol 1: the player chooses any **2** challenges. Sol 2: any **2** more. Sol 3: the last **1**. The player picks the order. Each challenge can be done once.
- Each challenge has options **A, B, C**. When `doneThisSol` reaches the quota for the Sol (Sol 1: 2, Sol 2: 2, Sol 3: 1) the **night** runs.

### 5.3 Challenge ids
`L` Life Support · `R` Radiation Shelter · `W` Power Budget · `G` Greenhouse · `M` Earth Is Far Away

### 5.4 Option effects (copy exactly)
`+` gain, `−` cost. "Later" effects arrive at the **start of the next Sol**.

| Challenge | Option | Effects now | Later |
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

**Sheltered** counts only if Radiation A or B is chosen on **Sol 1 or Sol 2**. Choosing it on Sol 3 is too late. Radiation C does not shelter the crew.
If Greenhouse or Earth is done on Sol 3, the "later" effect **never arrives** (the mission ends first). Show a warning for this in the Confirm pop-up and mention it in the debrief.

### 5.5 The night (End of Sol), in this exact order
1. **Storm** (end of Sol 2 only): if `sheltered` is false, `C -= {severity 1: 10, 2: 30, 3: 55}`.
2. **Nightly upkeep** (every Sol, **including Sol 3**): `O -= 8`, `W -= 3`, `P -= 3`.
3. **Unfinished problems** (every Sol): if Life Support (`L`) is not done, `O -= 8` more. If Power Budget (`W`) is not done, `P -= 4` more.
4. **Failure check:** if any of `O, W, P, C` is 0, set `phase = 'failed'` and stop.
5. If `sol < 3`: apply all `pending` effects (harvest, Earth reply), clear `pending`, increase `sol`, reset `doneThisSol`. If `sol == 3`: set `phase = 'complete'`. Pending effects never arrive after Sol 3.

Also check for failure **right after every option is applied**, not only at night.

### 5.6 Final result (check in this order)
1. **Mission Failed:** any of `O, W, P, C` reached 0.
2. **Mission at Risk:** lowest of `O, W, P, C` is **19 or less**.
3. **Complete — With Challenges:** lowest is 20–39, **or** Science < 15.
4. **Mission Successful:** all four are **40 or more** and Science is **15 or more**.

There is **no power-emergency pop-up and no recovery**. If a meter reaches 0 the mission ends.

### 5.7 Storm size from a real flare class
Flare class starts with **A, B or C → severity 1 (mild)** · **M → 2 (medium)** · **X → 3 (severe)**.

### 5.8 State shape
```js
state = {
  sol: 1, O: 75, W: 70, P: 80, C: 75, S: 0,
  done: {},              // e.g. { R:'B', L:'C' }  challenge -> option
  doneThisSol: 0,
  sheltered: false,
  pending: [],           // effects arriving at the start of the next Sol
  severity: 1,           // 1 | 2 | 3, from the real flare class
  event: null,           // the chosen flare record from spaceWeatherEvents.json
  phase: 'active',       // 'active' | 'failed' | 'complete'
  failReason: null,
  log: []                // [{ sol, kind:'storm'|'upkeep'|'penalty'|'harvest'|'earthReply', text }]
}
```

### 5.9 Functions the screens call (the contract)
```js
// src/game/game.js
newGame(severity)                       // -> state
choose(state, challengeId, option)      // -> new state (apply effects, mark done, queue "later" effects, clamp, check failure)
solIsFinished(state)                    // -> boolean (quota reached)
endSol(state)                           // -> new state (runs 5.5)
previewChoice(state, challengeId, option)
  // copy state, apply option, and if it was the last challenge of the Sol also run endSol on the copy
  // -> { after:{O,W,P,C,S}, includesNight:boolean, failed:boolean, failReason:string|null }
outcome(state)                          // -> { key:'failed'|'atRisk'|'withChallenges'|'successful', label }
statusLabel(value)                      // -> { word, color, icon }
// src/game/debrief.js   buildDebrief(state) -> { good:[], better:[], tip }
// src/game/challenges.js CHALLENGES = { L:{ id, title, icon, intro, options:{ A:{title,text,effects,later,sheltered?}, B, C } }, ... }
// src/game/storm.js     pickStorm(events) -> one random record
// src/data/nasaContent.js  NASA_CONTENT[challengeId], SPACE_WEATHER_LABEL, RADIATION_BARS
```
`effects` and `later` are objects such as `{ O:20, W:-12 }`. Keep all option numbers in `challenges.js` only (data) and have `game.js` read them.
`previewChoice` must **never** change the real state.

### 5.10 Worked example (use as a test), severity 2
| Step | Choices | Expected state |
|---|---|---|
| Start | – | O75 W70 P80 C75 S0 |
| Sol 1: L-C, R-A, then end of Sol 1 | Life Support C, Radiation A | **O77 W58 P59 C78 S2** (Power Budget not done, so P −4 extra; no storm on Sol 1) |
| Sol 2: W-A, G-A, then end of Sol 2 and the harvest at the start of Sol 3 | Power A, Greenhouse A | **O83 W43 P36 C92 S10** |
| Sol 3: M-A, then end of Sol 3 | Earth A | **O75 W40 P28 C95 S10** → Complete — With Challenges (the Earth reply P+6 never arrives) |

Other tests to write: Radiation A on Sol 1 means the storm does not reduce Crew Health; Radiation never done with severity 3 means Crew Health drops by 55 at the end of Sol 2; Greenhouse A on Sol 1 gives Oxygen +10 and Crew +10 at the start of Sol 2; a fresh game has the start values; `previewChoice` does not mutate the real state; `previewChoice` reports `failed:true` when a meter would reach 0.

---

## 6. Confirm pop-up (important for fairness)
When a player picks an option, show a Confirm pop-up with **NOW → AFTER** for each meter using `previewChoice`. If the choice is the last of the Sol, `includesNight` is true and the column is titled **"AFTER TONIGHT"**. If `failed` is true, show a red warning: **"If you choose this, the mission ends."** The player may still confirm. Nothing changes until Confirm is pressed. For Greenhouse on Sol 3 also show: "Plants need time. This harvest comes after the mission ends." For Earth on Sol 3: "Earth's reply comes after the mission ends."

## 7. Debrief "why" lines (buildDebrief)
- Sheltered → good: "You protected the crew before the storm."
- Storm hit while not sheltered → better: "The storm hurt the crew. Shelter before the end of Sol 2."
- Life Support done on Sol 1 → good: "You fixed the oxygen problem early."
- Life Support never done → better: "The broken oxygen system wasted air every night."
- Earth message sent on Sol 3 → better: "The reply came after the mission. Send messages early."
- Greenhouse done on Sol 3 → better: "Plants did not have time to grow."
- Lowest meter below 40 → tip: "Your lowest meter was [name] ([value])."
- Failed mission: a calm message naming the empty resource, e.g. "The crew ran out of power. Try again and plan sooner."

---

## 8. Screens (9)
Title → Intro (4 slides; build 2 first) → Dashboard ⇄ Challenge → Confirm (pop-up) → Result (pop-up) → Sol Summary (after the quota) → Dashboard … → Debrief. **Sources & Data** is reachable from Title and Debrief.
Full wireframes: `docs/MARSBOUND_Complete_Game_Plan.md` Part 4. Kid text: Part 7.

**Look:** dark navy background, Mars-orange buttons, white text, rounded cards, text at least 18px, buttons at least 48px tall. Phone: meters in 2 columns, challenge cards in 1 column. Dashboard cards show warning chips: Life Support "costs 8 Oxygen each night if not done", Power Budget "costs 4 Power each night if not done", Radiation "storm at end of Sol 2".
**Kid language:** short sentences (about 12 words). Explain each science word once (Sol, millisievert, radiation, DONKI).

---

## 9. NASA data source of truth
- All NASA facts and flare records are in `docs/NASA_DATA_VERIFIED.md` and `docs/spaceWeatherEvents.json`. Use **only** those.
- Flare records: `src/data/spaceWeatherEvents.json` is an array of `{ id, severity, date, classType, url }`. Pick one at random per game with `pickStorm`.
- Every NASA item shown on screen gets a badge: **🟦 REAL NASA** (with source and date) or **🟧 GAME NUMBERS** (simulated).
- Storm badge text: **"REAL NASA · saved copy of a DONKI record · [date]"**. If a Day 2 API fetch works, use "fetched from DONKI archive". Never "live".
- Show the flare class and date wherever the storm is shown (Dashboard forecast card, Radiation result, Debrief).
- The storm is **based on** a real flare record. It is **not** a reading from Mars. The Sources screen must say so, and that damage values (−10 / −30 / −55 Crew Health) are game numbers, and that NASA has not landed people on Mars.
- The **ISS radiation bar** is a Day 2 task (NASA RadLab). Do not add a number for it.
- Credit images in plain text (e.g. "NASA/JPL-Caltech"). Do not use the NASA logo.
- Each NASA drawer ("How NASA handles this") shows: title, short text, lesson line, source link, REAL/GAME badge, and a note that game numbers are simplified.

---

## 10. Build order and scope

**Day 1 (a complete, playable, NASA-compliant game):** project + theme → `game.js` + tests → real flare data in code → App reducer → Title/Intro → Dashboard → Challenge → Confirm preview → Result + Sol Summary → Debrief → NASA drawers → Sources → deploy.
**Day 2:** DONKI API with saved-copy fallback → RadLab ISS number → bug fixing → phone layout → photos → Explorer Mode (shows exact numbers and units) → final deploy.
**Cut order if late:** intro slides 3–4 → Sol Summary detail → drawer charts → Explorer Mode → photos.
**Never cut:** Confirm preview warning, real storm record, REAL/GAME badges, NASA drawers with sources, Sources screen, deploy.

**Do NOT build:** sound or music, pause menu, accounts, backend, database, power-emergency pop-up, Mars Rover Photos API, maps, skill ranks, extra meters, extra random events, anything that needs a live API to work.

## 11. Definition of done (Day 1)
- A full mission plays Title → Debrief with no errors; any order works; a done challenge cannot be picked again.
- All 15 options match section 5.4; meters stay within 0–100; the night runs once per Sol, including Sol 3.
- The storm size and the real flare date and class change between runs.
- The Confirm pop-up warns before a mission-ending choice.
- All 4 endings can be reached.
- Every NASA drawer has a source link and a REAL/GAME badge; the Sources screen lists every source and the 6 flare records; nothing old is called "live".
- Works on a laptop and a phone; `npm test` passes; the public link works.

## 12. If you are unsure
Stop and ask. Say what is unclear and give your best guess as a question. Never fill a gap with invented game numbers or NASA facts.
