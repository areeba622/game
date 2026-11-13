# MARSBOUND: Game Overview (for the whole team)

*Plain English. Read this first. The exact rules live in `CLAUDE.md`. The screen layouts live in `docs/WIREFRAMES.md`. The build schedule lives in `docs/MARSBOUND_Team_Dev_Plan_v3.md`.*

---

## 1. What our game is about

**MARSBOUND** is a short browser game for children aged 7 to 12. Parents and classrooms can play it too.

You are the **Commander** of a small outpost on Mars. You have **3 Sols** (a Sol is one day on Mars). In that time you must keep your crew alive by solving **5 challenges** about air, radiation, power, food and talking to Earth.

You never have enough resources. Air, water and power are shared, so **every choice costs something**. A **solar storm** is coming at the end of Sol 2, and you must get ready for it.

**Why we are building it:** it is our entry for the NASA Space Apps challenge "Build a Junior Astronaut Mission Trainer". NASA wants a game that:
- teaches real space-mission ideas to kids
- has limited resources and trade-offs
- uses real NASA data honestly
- explains things clearly in kid-friendly language
- works as a web app

**The honest rule:** this is a **simulation**. NASA has not landed people on Mars. Game numbers are simplified.
- Real NASA facts are labelled **🟦 REAL NASA**.
- Invented game values are labelled **🟧 GAME NUMBERS**.
- Old saved data is never called "live".

---

## 2. The goal and the meters

You watch **four meters** (each 0 to 100) and one score:

| Meter | Starts at | What it means |
|---|---|---|
| 🫧 Oxygen | 75 | Air for the crew |
| 💧 Water | 70 | Drinking water and water for the plants |
| ⚡ Power | 80 | Electricity for the base |
| 🧑‍🚀 Crew Health | 75 | How well the crew is |
| 🔬 Science | 0 | Points for research. The goal is 15. |

Each meter shows a **word, a colour and an icon**, never colour alone:
- 70–100 **Healthy**
- 40–69 **OK**
- 20–39 **Low**
- 1–19 **Critical**
- 0 **Empty**

**If any of the four meters reaches 0, the mission ends.** There is no second chance and no emergency pop-up.

---

## 3. How the game works, from start to end

1. **Start.** The player opens the game and presses Start Mission.
2. **Nickname.** The game asks "What should we call you, Commander?" The player types a nickname, or skips and is called "Commander". The nickname lives only in memory and is never saved or sent anywhere.
3. **Storm picked.** The game picks one of 6 real NASA solar-flare records at random. Its flare class sets the storm size for this game.
4. **Intro.** A few short slides explain the job.
5. **Sol 1.** The player picks **2 of the 5 challenges** and chooses option A, B or C for each. Before each choice is final, a **Confirm pop-up** shows exactly what will happen.
6. **The first night.** When the 2 jobs are done, the night runs on its own: the base uses up some air, water and power, and any unfinished problems cost extra.
7. **Sol Summary.** The player sees what they did, what the night cost, and what will arrive tomorrow. They press Start Sol 2.
8. **The morning.** Anything that was "arriving tomorrow" (like a greenhouse harvest) arrives now.
9. **Sol 2.** The player picks 2 more challenges. At the end of Sol 2 the **solar storm hits** unless the crew is sheltered.
10. **Sol 3.** The player does the last challenge. Then the last night runs.
11. **Debrief.** The game shows how it ended and explains why. The player can play again with a new storm.

**Quotas:** Sol 1 has 2 jobs, Sol 2 has 2 jobs and Sol 3 has 1 job. That is 5 jobs, so every challenge is done once. The player picks the order. A finished challenge cannot be picked again.

---

## 4. The five challenges and their options

`+` is a gain and `−` is a cost. **Now** happens at once. **Tomorrow** arrives at the start of the next Sol.

### 🫧 Challenge 1: Life Support (fix the oxygen system)
*It teaches that astronauts need systems that make and recycle air.*

| Option | Now |
|---|---|
| **A. Maximum generator output** | Oxygen +20, Water −12, Power −15, Crew +5 |
| **B. Switch to backup oxygen** | Oxygen −5, Power +3, Crew +1 |
| **C. Normal output + investigate** | Oxygen +10, Water −7, Power −8, Crew +3, Science +2 |

**If you skip it:** you lose **8 extra Oxygen** every night.

### ☢ Challenge 2: Radiation Shelter (protect the crew from the storm)
*It teaches that radiation is dangerous and shielding always costs something.*

| Option | Now | Crew sheltered? |
|---|---|---|
| **A. Move crew to shielded area** | Water −2, Power −6 | **Yes** |
| **B. Surround shelter with water** | Water −14, Power −2, Science +6 | **Yes** |
| **C. Keep doing surface research** | Water −1, Power −4, Science +12 | **No** |

**The storm:** it hits at the end of Sol 2.
- If the crew is not sheltered, Crew Health drops by **10** (mild storm), **30** (medium) or **55** (severe).
- The crew is sheltered only if you pick A or B on **Sol 1 or Sol 2**. Sol 3 is too late.

### ⚡ Challenge 3: Power Budget (decide who gets electricity)
*It teaches that power is limited, so essential systems come first.*

| Option | Now |
|---|---|
| **A. Essential systems first** | Power −6, Oxygen +4, Crew +4 |
| **B. Science first** | Power −20, Crew −3, Science +15 |
| **C. Energy-saving mode** | Power +12, Oxygen −3, Crew −3, Science +2 |

**If you skip it:** you lose **4 extra Power** every night.

### 🌱 Challenge 4: Greenhouse (grow food and fresh air)
*It teaches that plants need water, power and time. Real NASA fact in the drawer: NASA's Veggie is a small space garden on the ISS that holds about six plants, and in NASA's lettuce tests one harvest came after 33 days.*

| Option | Now | Tomorrow |
|---|---|---|
| **A. Expand the greenhouse** | Water −12, Power −14, Science +8 | Oxygen +10, Crew +10 |
| **B. Keep eating packed meals** | Crew −4 | nothing |
| **C. Start a small crop test** | Water −6, Power −7, Science +4 | Oxygen +5, Crew +5 |

**On Sol 3:** the harvest never arrives, because the mission is over. The game warns the player about this.

### 📡 Challenge 5: Earth Is Far Away (a warning, but Earth cannot answer now)
*It teaches that messages take minutes to travel, so the crew must decide on its own.*

| Option | Now | Earth's reply tomorrow |
|---|---|---|
| **A. Safe backup mode** | Power −5, Crew +3 | Power +6 |
| **B. Follow the onboard procedure** | Power −10, Crew +8 | Crew +5 |
| **C. Wait and keep doing science** | Power −2, Crew −10, Science +8 | Power −8, Crew −5 |

**On Sol 1 or Sol 2:** the reply arrives the next morning, so Power or Crew changes then.
**On Sol 3:** the reply never arrives, because the mission is over. The lesson is "send messages early".

### What happens every night
The night runs once at the end of each Sol, including Sol 3. It follows this order:
1. **Storm** (end of Sol 2 only, if the crew is not sheltered).
2. **Daily upkeep:** Oxygen −8, Water −3, Power −3.
3. **Unfinished problems:** Life Support not done costs Oxygen −8 more. Power Budget not done costs Power −4 more.
4. **Failure check:** if any meter is 0, the mission ends.

### Worked example (medium storm)

| Step | What the player does | Meters after |
|---|---|---|
| Start | – | O75 W70 P80 C75 S0 |
| Sol 1 | Life Support C and Radiation A, then the night | O77 W58 P59 C78 S2 |
| Sol 2 | Power A and Greenhouse A, then the night | O73 W43 P36 C82 S10 |
| Morning of Sol 3 | The greenhouse harvest arrives | O83 W43 P36 C92 S10 |
| Sol 3 | Earth A, then the night | O75 W40 P28 C95 S10 |

**Result:** Complete With Challenges. Power is the lowest meter at 28, and Science is 10, which is under 15.

---

## 5. How the game ends

The game checks in this order:

| Ending | When |
|---|---|
| **Mission Failed** | Any of Oxygen, Water, Power or Crew Health reached 0 |
| **Mission at Risk** | The lowest meter is 19 or less |
| **Complete With Challenges** | The lowest meter is 20 to 39, or Science is under 15 |
| **Mission Successful** | All four meters are 40 or more **and** Science is 15 or more |

All four endings must be reachable. A failure message is calm, not scary: "The crew ran out of power on Sol 3. Try again and plan sooner."

---

## 6. What each screen shows

There are **8 screens and 3 pop-ups**. The flow is:
**Title → Callsign → Intro → Dashboard ⇄ Challenge → Confirm → Result → Sol Summary → … → Debrief.** Sources is reachable from Title and Debrief.

### Screen 1: Title
- The game name MARSBOUND and a short tagline.
- **Start Mission** (goes to Callsign) and **Sources & Data** (goes to Sources).

### Screen 2: Callsign (nickname)
- The question "What should we call you, Commander?" and a text box.
- Three tap-to-fill chips: Nova, Comet, Orbit.
- The line "Use a nickname, not your real name."
- The nickname must be 2 to 16 characters. **Continue** starts the game. **Skip** uses plain "Commander" (the game never shows "Commander Commander").
- The game never asks for a real name, age or email.
- The nickname lives only in memory. It is not saved, so a page reload clears it. **Play Again** keeps it; **Restart** asks for it again.

### Screen 3: Intro
- Four slides, one at a time, with dots, **Next** and **Skip**:
  1. "Landing successful! Welcome, Commander [name]." This slide shows a **real NASA photo of Mars**, with a caption and credit that say it is a real photo of Mars, not of our outpost.
  2. "Your job: solve 5 challenges in 3 Sols."
  3. "Every choice costs something."
  4. "A storm is coming. Mission Control found a real NASA record of a solar flare."
- Day 1 has slides 1 and 2. Slides 3 and 4 are Day 2.

### Screen 4: Dashboard (the main screen)
- **Header:** the Sol number, "Jobs today" progress, "Commander [name]" and a Restart button.
- **Meters:** four bars with number, word, colour and icon, plus the Science score with its goal of 15.
- **Storm forecast card:** the storm size, "arrives at the end of Sol 2", the real flare class and date, the badge "REAL NASA · saved copy of a DONKI record", and whether the crew is sheltered.
- **Five challenge cards.** Done ones show ✓ and the chosen letter and cannot be picked again. Warning chips:
  - Life Support: "costs 8 Oxygen each night if not done"
  - Power Budget: "costs 4 Power each night if not done"
  - Radiation: "storm at end of Sol 2"
- **A Mission Control message** that changes with the situation, for example "Oxygen is low. Think about fixing the oxygen system."
- On phones, the meters sit in 2 columns and the cards sit in 1 column.

### Screen 5: Challenge
- The title, a short situation text and the current meters.
- **Three option cards.** Each shows its title, a short text and cost chips (gains in green with +, costs in orange with −, with the meter icon). A "Tomorrow" chip appears for delayed effects.
- Radiation options say whether the crew is **sheltered** or **not sheltered**.
- On Sol 3, red notes warn when something is too late (Radiation) or will arrive after the mission (Greenhouse, Earth).
- **Back** returns to the Dashboard. **How NASA handles this** opens the NASA drawer.

### NASA drawer (opens from the Challenge screen)
- A short real fact for the challenge, a lesson line, a **source link** and a 🟦 REAL NASA badge.
- A note that game numbers are simplified (🟧 GAME NUMBERS).
- Topics: ISS life support and water recovery (Life Support), Curiosity rover radiation measurements (Radiation), NASA fission surface power (Power), NASA's Veggie space garden on the ISS (Greenhouse), signal delay of about 4 to 24 minutes (Earth).
- On a phone it opens as a full-screen sheet. The Radiation drawer also shows a small bar chart: Mars surface 0.67 mSv a day and the trip to Mars 1.8 mSv a day.

### Pop-up A: Confirm
- It shows "YOU SELECTED" plus a before and after table for each meter.
- If this was the last job of the Sol, the column reads **"AFTER TONIGHT"**. It includes the night, and a line shows what will arrive tomorrow.
- **Red warnings** appear when they apply:
  - "If you choose this, the mission ends."
  - "This harvest comes after the mission ends."
  - "Earth's reply comes after the mission ends."
- Two buttons: **Confirm** and **Change choice**. Nothing changes until Confirm.

### Pop-up B: Result
- "Decision complete" with what changed and a short "what happened" line.
- Real-NASA lines where they apply. For example, a Radiation result says "This storm is based on a real NASA record: an M5.9 flare on 2024-05-10."
- **Continue** goes to the Dashboard, the Sol Summary or the Debrief, depending on what happened.

### Screen 6: Sol Summary
- "Sol N complete. Great work, Commander [name]."
- **Today you did:** the jobs and the options chosen.
- **Tonight:** the daily use, extra penalties for unfinished problems, and the storm result (sheltered, hit, or not yet).
- **Meters now**, and **Arriving tomorrow** (the harvest or Earth's reply).
- The button **Start Sol N+1** runs the morning and shows a short "Morning report" card.
- After Sol 3 the button reads **See Mission Debrief**, and any late reward is shown as "Arrives after the mission".

### Screen 7: Mission Debrief
- The ending headline, the final meters with words and icons, and Science against its goal.
- Your choices by Sol, and the storm size with the real flare class and date.
- **What went well** and **What to improve**, for example "You protected the crew before the storm" or "Earth's reply came after the mission. Send messages early."
- A **tip** naming your lowest meter.
- Anything that arrives after the mission.
- Two classroom or family questions, and an honesty line: "Game numbers are simplified. The storm is based on a real record."
- Buttons: **Play Again** (new random storm, same nickname), **Sources** and **Restart** (back to the nickname screen).

### Screen 8: Sources & Data
- The 6 real flare records with class, date and link, with the note "old records, not live data".
- Every NASA fact used in the game, with its source link.
- Image credits in plain text.
- The 🟧 GAME NUMBERS box: values are simplified, NASA has not landed people on Mars, the storm is based on a real flare but is not a reading from Mars, and the −10, −30 and −55 Crew Health damage are game numbers.

---

## 7. Features

### Must have (Day 1: a complete, working, deployed game)
- Nickname screen, with "Commander [nickname]" shown in the game
- One real NASA photo of Mars on Intro slide 1, with a credit line
- Title, Intro (2 slides), Dashboard, Challenge, Confirm, Result, Sol Summary, Debrief and Sources screens
- 5 challenges with 3 options each, using the exact numbers above
- The night and morning rules, the storm, and all 4 endings
- The Confirm preview, including the "mission ends" warning
- A **real NASA solar-flare record** picked at random that sets the storm size, with its class and date shown
- NASA drawers with real facts, source links and REAL/GAME badges
- The "What went well / What to improve" Debrief
- A working phone layout, and a public link
- Kid-friendly language, with text at least 18px and buttons at least 48px tall
- A **neumorphism (soft UI)** look: dark navy base, raised cards and buttons, pressed meter tracks and text boxes, Mars-orange as the only accent. It must stay easy to read, and status always uses word, colour and icon.

### Should have (Day 2, if time allows)
- A live call to NASA's DONKI archive, with the saved copy as backup. The badge changes honestly to "fetched from DONKI archive".
- A radiation bar for the ISS from NASA RadLab data
- Intro slides 3 and 4
- More NASA photos with credit lines (for example on the Title screen)
- A phone-layout polish pass
- Explorer Mode (shows exact numbers and units)
- Small animations (Framer Motion, only after asking permission to install)
- A print report button and classroom questions polish
- A backup demo video and submission text

---

## 8. Out of scope (we will NOT build these)

- Sound or music
- A pause menu
- Accounts, logins or any saved progress
- A backend or a database
- A power-emergency pop-up or any recovery from a zero meter
- The Mars Rover Photos API
- Maps
- Skill ranks or scores that carry over between games
- Extra meters
- Extra random events
- Anything that needs a live API to work. The game must work offline, and the Day 2 NASA call must fall back to saved data.
- Real radiation or life-support maths. It is too hard to do honestly, so values are labelled as simulated.
- Asking for real names, ages, emails or other personal information
- Using the NASA logo
- Calling saved or old data "live"

---

## 9. How we build it (short)

- **Tech:** React with Vite. Game state in `useReducer`. Plain CSS by default. Extra libraries only after asking for permission. Tests with vitest. Deployed on Vercel or Netlify.
- **Rules live in plain functions** in `src/game/`, away from the screens, and they are tested.
- **Person A** does the logic and data (`src/game`, `src/data`, the NASA drawer and Sources screen).
- **Person B** does the screens and design (`src/screens`, `src/components`, `src/styles`).
- Each person works on their own branch (`logic` or `ui`) with their own Claude Code session. `main` must always run.
- **Never change a game number or a NASA fact** without checking the docs. The numbers were balanced by simulating all 87,480 possible games.

---

## 10. Files in the repo

| File | What it is for |
|---|---|
| `CLAUDE.md` (in the project root) | The rules file Claude Code reads first |
| `docs/WIREFRAMES.md` | The layout of every screen and pop-up |
| `docs/MARSBOUND_Team_Dev_Plan_v3.md` | The schedule, prompts, push points and manual checks |
| `docs/NASA_DATA_VERIFIED.md` | The only source of NASA facts |
| `docs/spaceWeatherEvents.json` | The 6 real solar-flare records |
| `docs/MARSBOUND_Complete_Game_Plan.md` | Use only Part 7, the kid text. Its old wireframes and engine parts are out of date. |
| `docs/PHASE3A_data_prompt.md` | The prompt that turns the NASA data into code |
| `docs/MARSBOUND_Game_Overview.md` | This file |
