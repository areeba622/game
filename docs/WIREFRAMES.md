# MARSBOUND — Wireframes (v2, matches CLAUDE.md)

These are text wireframes for **8 screens** and 3 pop-ups (Confirm, Result, NASA drawer). They match the current rules: nickname screen, no power-emergency pop-up (Power 0 ends the mission), a Confirm preview that warns before a mission-ending choice, and honest NASA data labels.

**Notes on reading them**
- `[ Button ]` is a button. `{name}` is the player's nickname (default "Commander"). `[date]` and `[class]` come from the real flare record in `state.event`.
- Numbers in examples are real outputs of the game rules, not made up (see the worked example at the end).
- 🟦 = **REAL NASA** badge. 🟧 = **GAME NUMBERS** badge. Both always show the words too.
- Status always uses **word + colour + icon**: 🟢 Healthy (70–100) · 🟡 OK (40–69) · 🟠 Low (20–39) · 🔴 Critical (1–19) · ⚫ Empty (0).

---

## 0. Screen map

```text
Title ──Start──> Callsign ──Continue/Skip──> Intro (slides) ──> Dashboard ⇄ Challenge
  │                                                              │   ↑        │
  └─Sources──> Sources <──────────────────────────────┐          │   │     [Confirm pop-up]
                                                      │          │   │        │
                                                      │          │   │     [Result pop-up]
                                                      │          │   │        │
                                                      │          │   └── (Sol has more jobs) ─┘
                                                      │          │
                                                      │          └── (Sol quota reached) ──> Sol Summary ──Start Sol N──> Dashboard
                                                      │
                                   Debrief <── (after Sol 3, or any meter hits 0)
                                     │  ├─ Play Again ──> Intro (new random storm, same nickname)
                                     │  ├─ Sources ──────> Sources
                                     │  └─ Restart ──────> Callsign
```

Screens: Title, Callsign, Intro, Dashboard, Challenge, Sol Summary, Debrief, Sources. Pop-ups: **Confirm**, **Result**, **NASA drawer**.

---

## Screen 1 — Title

```text
┌──────────────────────────────────────────────┐
│                                              │
│       [ MARS PHOTO, dark overlay ]           │
│                                              │
│                 MARSBOUND                    │
│             THE NEXT FRONTIER                │
│     "Humanity's next home is waiting."       │
│                                              │
│            [  START MISSION  ]               │
│            [  SOURCES & DATA ]               │
│                                              │
│   Simulated mission · NASA data credited     │
└──────────────────────────────────────────────┘
```
- **Start Mission** → Callsign. **Sources & Data** → Sources.
- Photo credit line in small text ("NASA/JPL-Caltech" or the photo's actual credit).

## Screen 2 — Callsign (nickname)

```text
┌──────────────────────────────────────────────┐
│                                              │
│   What should we call you, Commander?        │
│                                              │
│   ┌────────────────────────────────────┐     │
│   │ Nova                               │     │
│   └────────────────────────────────────┘     │
│   Use a nickname, not your real name.        │
│                                              │
│   Try:  ( Nova )  ( Comet )  ( Orbit )       │
│                                              │
│   [  CONTINUE  ]          [ SKIP ]           │
│                                              │
│   ⚠ Pick a name with 2 to 16 letters.        │  ← only if invalid
└──────────────────────────────────────────────┘
```
- 2–16 characters after trimming; friendly error otherwise.
- **Skip** uses the default "Commander".
- Name is kept in memory only (`state.nickname`). Not saved anywhere.
- Tapping a chip fills the box.

## Screen 3 — Intro (4 slides, one at a time)

```text
┌──────────────────────────────────────────────┐
│  ● ○ ○ ○                                     │
│                                              │
│   [ MARS PHOTO / HABITAT ICON ]              │
│                                              │
│   1 of 4: "Landing successful!"              │
│   Welcome, Commander {name}.                 │
│   You are in charge of a Mars outpost.       │
│                                              │
│                     [ NEXT ]    [ SKIP ]     │
└──────────────────────────────────────────────┘
```

| Slide | Heading | Text |
|---|---|---|
| 1 | Landing successful! | Welcome, Commander {name}. You are in charge of a Mars outpost. |
| 2 | Your job | Solve 5 challenges in 3 Sols. (A Sol is one day on Mars.) |
| 3 | Every choice costs something | Air, water and power are shared. Fixing one thing can cost another. |
| 4 | A storm is coming | Mission Control found a real NASA record of a solar flare. Get ready! |

- Build slides 1–2 on Day 1, slides 3–4 on Day 2.
- **Next** advances; after slide 4 → Dashboard. **Skip** → Dashboard.
- The random storm is chosen when the player pressed Start (or at Callsign Continue), not here.

---

## Screen 4 — Dashboard (main screen)

```text
┌────────────────────────────────────────────────────────┐
│ MARSBOUND        SOL 1 of 3      Jobs today: 0/2  [Restart]│
│ Commander Nova                                         │
├────────────────────────────────────────────────────────┤
│ 🫧 OXYGEN       75  ███████░░░  🟢 Healthy             │
│ 💧 WATER        70  ███████░░░  🟢 Healthy             │
│ ⚡ POWER        80  ████████░░  🟢 Healthy             │
│ 🧑‍🚀 CREW HEALTH 75  ███████░░░  🟢 Healthy             │
│ 🔬 SCIENCE       0  goal: 15                           │
├────────────────────────────────────────────────────────┤
│ ☀ STORM FORECAST          🟦 REAL NASA · saved copy    │
│ Arrives at the END of SOL 2.     Size: MEDIUM          │
│ Based on a real M5.9 solar flare, 2024-05-10.          │
│ Crew status: ⚠ NOT SHELTERED yet                       │
├────────────────────────────────────────────────────────┤
│ CHOOSE 2 CHALLENGES TODAY                              │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│ │ 🫧 LIFE      │ │ ☢ RADIATION  │ │ ⚡ POWER     │     │
│ │   SUPPORT    │ │   SHELTER    │ │   BUDGET     │     │
│ │ Fix oxygen   │ │ Protect crew │ │ Share power  │     │
│ │ ⚠ −8 Oxygen  │ │ ⚠ Storm at   │ │ ⚠ −4 Power   │     │
│ │ each night   │ │ end of Sol 2 │ │ each night   │     │
│ │ if not done  │ │              │ │ if not done  │     │
│ │ [ SELECT ]   │ │ [ SELECT ]   │ │ [ SELECT ]   │     │
│ └──────────────┘ └──────────────┘ └──────────────┘     │
│ ┌──────────────┐ ┌──────────────┐                      │
│ │ 🌱 GREENHOUSE│ │ 📡 EARTH IS  │     ✓ = done         │
│ │ Plants need  │ │ FAR AWAY     │                      │
│ │ 1 Sol to grow│ │ Reply takes  │                      │
│ │ [ SELECT ]   │ │ 1 Sol        │                      │
│ │              │ │ [ SELECT ]   │                      │
│ └──────────────┘ └──────────────┘                      │
├────────────────────────────────────────────────────────┤
│ 📻 MISSION CONTROL: "Commander Nova, pick two jobs     │
│    for today. A storm is coming at the end of Sol 2."  │
└────────────────────────────────────────────────────────┘
```

**Behaviour**
- Done challenges show **✓ DONE** with the chosen option's letter and cannot be selected again.
- After the 2nd job on Sol 1 or Sol 2 (or the 1st job on Sol 3) the game goes to the Sol Summary (or the Debrief after Sol 3).
- Storm card states: `NOT SHELTERED yet` (⚠) → `SHELTERED ✓` after Radiation A or B on Sol 1–2 → after Sol 2's night: "The storm has passed." (and what it did, if anything).
- Storm card badge text: "REAL NASA · saved copy of a DONKI record · [date]". Day 2 may change it to "fetched from DONKI archive".
- **Explorer Mode** (Day 2 extra): a toggle that adds exact numbers and units to the bars and drawers.
- Warning chips on Life Support, Power and Radiation cards disappear once that challenge is done.
- Mission Control line changes with the situation (see the text table at the end).

**Phone layout**
```text
┌─────────────────────────┐
│ MARSBOUND  SOL 1/3      │
│ Commander Nova  0/2 done│
├─────────────────────────┤
│ 🫧 O 75 🟢   💧 W 70 🟢 │
│ ⚡ P 80 🟢   🧑‍🚀 C 75 🟢 │
│ 🔬 Science 0 (goal 15)  │
├─────────────────────────┤
│ ☀ STORM: MEDIUM, end of │
│ Sol 2 · 🟦 REAL NASA    │
│ M5.9 flare · 2024-05-10 │
│ ⚠ Not sheltered yet     │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │ 🫧 LIFE SUPPORT     │ │
│ │ ⚠ −8 O each night   │ │
│ │ [ SELECT ]          │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ ☢ RADIATION SHELTER │ │
│ │ [ SELECT ]          │ │
│ └─────────────────────┘ │
│        (3 more cards)   │
├─────────────────────────┤
│ 📻 Mission Control: …   │
└─────────────────────────┘
```
Meters in 2 columns, cards in 1 column, buttons at least 48px tall.

---

## Screen 5 — Challenge (situation, 3 options, NASA drawer)

```text
┌────────────────────────────────────────────────────────┐
│ ← Back           ☢ RADIATION SHELTER          SOL 1    │
├────────────────────────────────────────────────────────┤
│ [ small picture or icon ]                              │
│ Mission Control says a solar storm is coming.          │
│ Radiation can hurt the crew. What do you do?           │
│                                                        │
│ Now:  💧 70   ⚡ 80   🧑‍🚀 75                            │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ A. MOVE THE CREW TO THE SHIELDED AREA              │ │
│ │ Everyone goes into the safe room. Quick and cheap. │ │
│ │ 💧 −2   ⚡ −6        ☂ Crew is SHELTERED           │ │
│ │                                    [ CHOOSE A ]    │ │
│ └────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────┐ │
│ │ B. SURROUND THE SHELTER WITH WATER                 │ │
│ │ A thick water wall protects the crew.              │ │
│ │ 💧 −14  ⚡ −2  🔬 +6   ☂ Crew is SHELTERED         │ │
│ │                                    [ CHOOSE B ]    │ │
│ └────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────┐ │
│ │ C. KEEP DOING SURFACE RESEARCH                     │ │
│ │ Lots of science, but the crew is not protected.    │ │
│ │ 💧 −1  ⚡ −4  🔬 +12   ⚠ Crew is NOT sheltered     │ │
│ │                                    [ CHOOSE C ]    │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ [ 🛰 HOW NASA HANDLES THIS ▼ ]                         │
└────────────────────────────────────────────────────────┘
```

**Behaviour**
- Cost chips come from `effects`: gains in green with `+`, costs in orange with `−`, each with its meter icon.
- Options with a delayed effect show a "Tomorrow" chip, for example Greenhouse A: `Tomorrow: 🫧 +10 🧑‍🚀 +10`.
- Choosing an option opens the Confirm pop-up. **Back** returns to the Dashboard without changing anything.
- Radiation on **Sol 3**: show a red line under the title: "⚠ The storm already passed. Shelter will not help now."
- Challenges with later effects on Sol 3 (Greenhouse, Earth): show "⚠ This reward arrives after the mission ends."

**Per-challenge content** (titles and short text for each option are in `docs/MARSBOUND_Complete_Game_Plan.md`, Part 7; numbers are in CLAUDE.md section 5.4):

| Challenge | Screen title | Option chips (A / B / C) |
|---|---|---|
| L | LIFE SUPPORT | A: 🫧 +20 💧 −12 ⚡ −15 🧑‍🚀 +5 · B: 🫧 −5 ⚡ +3 🧑‍🚀 +1 · C: 🫧 +10 💧 −7 ⚡ −8 🧑‍🚀 +3 🔬 +2 |
| R | RADIATION SHELTER | A: 💧 −2 ⚡ −6 ☂ · B: 💧 −14 ⚡ −2 🔬 +6 ☂ · C: 💧 −1 ⚡ −4 🔬 +12 |
| W | POWER BUDGET | A: ⚡ −6 🫧 +4 🧑‍🚀 +4 · B: ⚡ −20 🧑‍🚀 −3 🔬 +15 · C: ⚡ +12 🫧 −3 🧑‍🚀 −3 🔬 +2 |
| G | GREENHOUSE | A: 💧 −12 ⚡ −14 🔬 +8, tomorrow 🫧 +10 🧑‍🚀 +10 · B: 🧑‍🚀 −4 · C: 💧 −6 ⚡ −7 🔬 +4, tomorrow 🫧 +5 🧑‍🚀 +5 |
| M | EARTH IS FAR AWAY | A: ⚡ −5 🧑‍🚀 +3, tomorrow ⚡ +6 · B: ⚡ −10 🧑‍🚀 +8, tomorrow 🧑‍🚀 +5 · C: ⚡ −2 🧑‍🚀 −10 🔬 +8, tomorrow ⚡ −8 🧑‍🚀 −5 |

### NASA drawer (opens from "How NASA handles this")
Opens under the button on a laptop and as a **full-screen sheet on a phone**.

```text
┌────────────────────────────────────────────────────────┐
│ 🛰 HOW NASA HANDLES THIS                      [ Close ✕ ]│
│ 🟦 REAL NASA · measured by the Curiosity rover         │
│                                                        │
│ CURIOSITY MEASURES RADIATION ON MARS                   │
│ A tool called RAD counts radiation on the ground.      │
│ Mars has no global magnetic field and a thin air       │
│ layer, so more radiation reaches the surface.          │
│                                                        │
│ Radiation per day (millisieverts, mSv):                │
│  Mars surface          ███░░░░░░░   0.67               │
│  Trip to Mars (inside  ████████░░   1.8                │
│  the spacecraft)                                       │
│  (ISS bar: Day 2, only after NASA RadLab data is added)│
│  (A millisievert measures how much radiation a body    │
│   takes in.)                                           │
│                                                        │
│ LESSON: Measure the danger before sending people.      │
│ Source: Hassler et al., Science, 2013                  │
│ [ Open source ]                                        │
│ 🟧 GAME NUMBERS: shelter costs in this game are        │
│    simplified and simulated.                           │
└────────────────────────────────────────────────────────┘
```
The other four drawers use the same layout (title, 2–3 kid-friendly sentences, lesson, source link, REAL/GAME badge, game note). Content for each comes only from `docs/NASA_DATA_VERIFIED.md` section B:

| Challenge | Drawer topic |
|---|---|
| L | ISS life support (ECLSS) and 98% water recovery |
| R | Curiosity RAD radiation (above) |
| W | NASA fission surface power project (at least 40 kW, still being developed) |
| G | Veggie lettuce eaten on the ISS, 10 Aug 2015 |
| M | Signal delay, about 4 to 24 minutes one way |

---

## Pop-up A — Confirm

```text
┌────────────────────────────────────────────────┐
│ YOU SELECTED:                                  │
│ B. Surround the shelter with water             │
│                                                │
│               NOW     →    AFTER               │
│ 🫧 Oxygen      75          75                  │
│ 💧 Water       70    →     56                  │
│ ⚡ Power       80    →     78                  │
│ 🧑‍🚀 Crew       75          75                  │
│ 🔬 Science      0    →      6                  │
│                                                │
│ ☂ The crew will be sheltered from the storm.   │
│                                                │
│     [  CONFIRM  ]        [ CHANGE CHOICE ]     │
└────────────────────────────────────────────────┘
```

**When this is the last job of the Sol**, the column is titled **"AFTER TONIGHT"** and includes the night's changes. Example, Sol 1: the player already did Greenhouse C (so NOW is O75 W64 P73 C75 S4) and now chooses Radiation B as the second job:

```text
│               NOW     →    AFTER TONIGHT       │
│ 🫧 Oxygen      75    →     59                  │
│ 💧 Water       64    →     47                  │
│ ⚡ Power       73    →     64                  │
│ 🧑‍🚀 Crew       75          75                  │
│ 🔬 Science      4    →     10                  │
│ Includes the night: upkeep −8 O −3 W −3 P, plus │
│ extra −8 O (Life Support not done) and −4 P     │
│ (Power Budget not done). Storm: not yet.        │
```
Arriving tomorrow: 🫧 +5  🧑‍🚀 +5 (the Greenhouse C harvest).
(Check: Radiation B gives W−14 P−2 S+6 → W50 P71 S10; the night then gives O75−8−8=59, W50−3=47, P71−3−4=64. Tomorrow's harvest is not included.)

**Warnings** (red, shown only when they apply; the player may still confirm):
```text
│ ⚠ CAREFUL! If you choose this, the mission ends.     │   ← previewChoice().failed
│   Power would reach 0.                               │
│ ⚠ Plants need time. This harvest comes after the     │   ← Greenhouse on Sol 3
│   mission ends.                                      │
│ ⚠ Earth's reply comes after the mission ends.        │   ← Earth on Sol 3
```
- Values come from `previewChoice(state, cid, opt)`: `after` for the table, `arriving` for the "Arriving tomorrow" line, `failed` for the red warning (it also warns if tomorrow's Earth reply would empty a meter). "After tonight" does not include tomorrow's arrivals. Nothing changes until **Confirm**; Confirm dispatches `CHOOSE`.

## Pop-up B — Result

```text
┌────────────────────────────────────────────────┐
│              DECISION COMPLETE                 │
│  You chose: B. Surround the shelter with water │
│                                                │
│  💧 −14    ⚡ −2    🔬 +6                       │
│                                                │
│  WHAT HAPPENED                                 │
│  The water wall will protect the crew.         │
│  It used a lot of water.                       │
│                                                │
│  [If Radiation]                                │
│  🌩 "This storm is based on a real NASA record: │
│  an M5.9 flare on 2024-05-10." 🟦 REAL NASA    │
│  [If Greenhouse]                               │
│  🌱 "Plants are growing. Harvest at the start  │
│  of the next Sol."                             │
│  [If Earth]                                    │
│  📡 "Message sent. A reply comes next Sol.      │
│  Real signals take about 4 to 24 minutes one   │
│  way." 🟦 REAL NASA                            │
│                                                │
│               [  CONTINUE  ]                   │
└────────────────────────────────────────────────┘
```
After **Continue**: `phase` not active → Debrief · else `solIsFinished` → dispatch `END_SOL` (the night), then Sol Summary (or Debrief if the night failed the mission or Sol 3 is over) · else back to the Dashboard.

---

## Screen 6 — Sol Summary

Example for Sol 1 after Radiation B and Greenhouse C (storm size medium; no storm on Sol 1):

```text
┌────────────────────────────────────────────────┐
│               SOL 1 COMPLETE                   │
│  Great work, Commander Nova.                   │
│                                                │
│  TODAY YOU DID                                 │
│   • Radiation: B. Surround with water          │
│   • Greenhouse: C. Small crop test             │
│                                                │
│  TONIGHT                                       │
│   Daily use:   🫧 −8   💧 −3   ⚡ −3            │
│   Problems left: 🫧 −8 (Life Support not done) │
│                  ⚡ −4 (Power Budget not done) │
│   ☀ Storm: not yet (it comes at the end of     │
│     Sol 2)                                     │
│                                                │
│  METERS NOW                                    │
│   🫧 59 🟡 OK   💧 47 🟡 OK                    │
│   ⚡ 64 🟡 OK   🧑‍🚀 75 🟢 Healthy              │
│   🔬 Science 10 (goal 15)                      │
│                                                │
│  ⏳ ARRIVING TOMORROW                          │
│   🌱 Harvest: 🫧 +5   🧑‍🚀 +5                   │
│                                                │
│              [  START SOL 2  ]                 │
└────────────────────────────────────────────────┘
```
- Built from `state.log` entries (`storm`, `upkeep`, `penalty`) for this Sol and from `state.pending`.
- On **end of Sol 2** the storm line shows one of: "☂ Your crew was sheltered. No harm." or "🌩 The storm hit! Crew Health −30." (value from severity).
- Pressing **Start Sol N** dispatches `START_SOL` (the morning: pending effects arrive, Sol number goes up). Then show a short "Morning report" card with what arrived (`harvest`, `earthReply` log entries), e.g. "🌱 Your crops grew! 🫧 +5 🧑‍🚀 +5. 📡 Mission Control replied: …", then go to the Dashboard.
- **After Sol 3** no "Start Sol 4": the button reads **See Mission Debrief**, and the "arriving tomorrow" box becomes "Arrives after the mission: [list]" when something is still pending.

---

## Screen 7 — Mission Debrief

```text
┌────────────────────────────────────────────────────────┐
│                  MISSION DEBRIEF                       │
│                 Commander Nova                         │
│                                                        │
│      ★ COMPLETE — WITH CHALLENGES ★                    │
│  (or MISSION SUCCESSFUL / MISSION AT RISK /            │
│   MISSION FAILED)                                      │
├────────────────────────────────────────────────────────┤
│ FINAL STATUS                                           │
│ 🫧 Oxygen 75 🟢 Healthy      💧 Water 40 🟡 OK         │
│ ⚡ Power 28 🟠 Low           🧑‍🚀 Crew 95 🟢 Healthy    │
│ 🔬 Science 10 (goal 15) ✗                              │
├────────────────────────────────────────────────────────┤
│ YOUR MISSION                                           │
│ Sol 1: Life Support (C) · Radiation (A)                │
│ Sol 2: Power Budget (A) · Greenhouse (A)               │
│ Sol 3: Earth (A)                                       │
│ Storm: MEDIUM · 🟦 real M5.9 flare, 2024-05-10         │
├────────────────────────────────────────────────────────┤
│ WHAT WENT WELL                                         │
│ ✓ You protected the crew before the storm.             │
│ ✓ You fixed the oxygen problem early.                  │
│ WHAT TO IMPROVE                                        │
│ • Earth's reply came after the mission. Send messages  │
│   early.                                               │
│ TIP: Your lowest meter was Power (28).                 │
├────────────────────────────────────────────────────────┤
│ 🛰 ARRIVES AFTER THE MISSION: Earth's reply (Power +6) │
├────────────────────────────────────────────────────────┤
│ THINK ABOUT IT (class or family)                       │
│ 1. Why can't astronauts wait for Earth's answer?       │
│ 2. When is it smart to keep working during a storm?    │
├────────────────────────────────────────────────────────┤
│ 🟧 Game numbers are simplified. 🟦 Storm: real record. │
│ [ PLAY AGAIN ]  [ SOURCES ]  [ RESTART ]               │
└────────────────────────────────────────────────────────┘
```
These numbers are the results of the worked example (Life Support C + Radiation A, Power A + Greenhouse A, Earth A; severity 2): final O75 W40 P28 C95 S10 → Complete — With Challenges.

**Failed variant** (calm, not scary):
```text
│        MISSION FAILED                          │
│   The crew ran out of power on Sol 3.          │
│   Try again and plan sooner.                   │
│   (Your final status and choices are below.)   │
```
- "Play again" starts a **new random storm** and keeps the nickname. **Restart** goes to the Callsign screen.
- Headline text comes from `outcome(state).label`; lines from `buildDebrief(state)`.
- Optional (Day 2): **Print report** button.

---

## Screen 8 — Sources & Data

```text
┌────────────────────────────────────────────────────────┐
│ ← Back                SOURCES & DATA                   │
├────────────────────────────────────────────────────────┤
│ 🟦 REAL NASA                                           │
│ SOLAR FLARE RECORDS (NASA DONKI, saved copies)         │
│  • C1.6 · 2021-09-26  [ link ]                         │
│  • C1.2 · 2023-08-25  [ link ]                         │
│  • M5.9 · 2024-05-10  [ link ]                         │
│  • M6.4 · 2025-09-28  [ link ]                         │
│  • X8.7 · 2024-05-14  [ link ]                         │
│  • X9.0 · 2024-10-03  [ link ]                         │
│  These are old records, not live data.                 │
│                                                        │
│ FACTS USED IN THE GAME                                 │
│  • Radiation on Mars and on the trip: Curiosity RAD,   │
│    Hassler et al., Science, 2013 [ link ]              │
│  • Signal delay (about 4–24 minutes): NASA [ link ]    │
│  • Veggie lettuce on the ISS, 10 Aug 2015 [ link ]     │
│  • ISS life support and 98% water recovery [ link ]    │
│  • Fission surface power project (in development)      │
│    [ link ]                                            │
│  (Day 2: NASA RadLab ISS radiation data [ link ])      │
│                                                        │
│ IMAGE CREDITS                                          │
│  (one plain-text line per image, e.g. "NASA/JPL-Caltech")│
├────────────────────────────────────────────────────────┤
│ 🟧 GAME NUMBERS                                        │
│ Resource values, costs and results are simplified and  │
│ simulated. NASA has not landed people on Mars yet.     │
│ The storm is based on a real flare record. It is not   │
│ a reading from Mars. Crew Health damage (−10, −30,     │
│ −55) is a game number.                                 │
│                                                        │
│ HOW WE USED NASA DATA                                  │
│ (short text from the submission: what data, why)       │
│                                    [ BACK ]            │
└────────────────────────────────────────────────────────┘
```
- The list is generated from `NASA_CONTENT` and `spaceWeatherEvents.json`, plus `src/assets/credits.txt`. Do not add a source that is not in those files.
- Reachable from Title, Debrief and (Day 2) the Dashboard footer.

---

## Text bank (Mission Control and fixed lines)

`{name}` = nickname.

| When | Line |
|---|---|
| Start of Sol 1 | "Commander {name}, pick two jobs for today. A storm is coming at the end of Sol 2." |
| Radiation not done, Sol 2 | "The storm is close, Commander {name}. Shelter the crew now!" |
| Oxygen < 40 | "Oxygen is low. Think about fixing the oxygen system." |
| Water < 40 | "Water is low. Water shields and greenhouses use a lot." |
| Power < 40 | "Power is low. Big jobs may drain the battery." |
| Power ≤ 20 | "Power is almost empty! If it reaches zero, the mission ends." |
| Crew Health < 40 | "The crew is not well. Protect them." |
| Life Support not done, after Sol 1 | "The oxygen system is still broken. It wastes extra air every Sol." |
| Earth reply A | "Mission Control: Safe mode was a good choice. Power +6." |
| Earth reply B | "Mission Control: Your crew followed the right steps. Crew Health +5." |
| Earth reply C | "Mission Control: The problem got worse while you waited. Power −8, Crew Health −5." |
| Harvest arrives | "Your crops grew! Fresh plants gave the crew food and air." |
| Failure | "The crew ran out of [air / water / power / health]. Try again and plan sooner." |

---

## Components used (for building)

| Component | Used on | Notes |
|---|---|---|
| `ResourceBar` | Dashboard, Challenge, Sol Summary, Debrief | label, icon, value, status word + colour + icon |
| `ChallengeCard` | Dashboard | title, one-line text, warning chip, done state |
| `StormForecast` | Dashboard, Result, Debrief | severity, class, date, badge, sheltered state |
| `MissionControl` | Dashboard | line from the text bank |
| `OptionCard` | Challenge | title, text, cost chips, shelter tag |
| `NasaDrawer` | Challenge | content from `NASA_CONTENT` |
| `ConfirmModal`, `ResultModal` | Challenge | `previewChoice` and result text |

## Visual rules (apply everywhere)
- Dark navy background, Mars-orange buttons, white text, rounded cards.
- Text at least 18px. Buttons at least 48px tall.
- Every status uses **word + colour + icon**.
- Short sentences (about 12 words). Explain every science word once.
- Badge every NASA item: 🟦 REAL NASA or 🟧 GAME NUMBERS. Never write "live" for saved or archived data.
- No sound. No NASA logo.

## Check on the examples
All example numbers on the Confirm, Sol Summary and Debrief screens follow the rules in CLAUDE.md:
- Sol 1 (Radiation B + Greenhouse C): O59 W47 P64 C75 S10 after the night, harvest next Sol O+5, C+5.
- Full mission (Life Support C + Radiation A; Power A + Greenhouse A; Earth A): O75 W40 P28 C95 S10, Complete — With Challenges.
