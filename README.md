# MARSBOUND

A short browser game for children aged 7–12. It is our entry for the NASA Space Apps Challenge **"Build a Junior Astronaut Mission Trainer"**.

The player is the Commander of a Mars outpost. Over **3 Sols** (Mars days) they solve **5 challenges**: life support, radiation shelter, power, a greenhouse, and the delay in talking to Earth. Oxygen, Water, Power and Crew Health are limited, so every choice costs something. A **solar storm** hits at the end of Sol 2 unless the crew is sheltered, and its size comes from a **real NASA solar flare record**. A **Mission Debrief** at the end explains what went well and what to try next time.

> This is a simulation. NASA has not landed people on Mars.

## What it does

- Players choose the order of the challenges. Each challenge has 3 options with different costs and trade-offs.
- Before a choice takes effect, a Confirm pop-up shows each meter **now → after**. It also warns if the choice would end the mission.
- Effects can be delayed: greenhouse harvests and replies from Earth arrive the next morning.
- There are four endings: Mission Successful, Complete — With Challenges, Mission at Risk, Mission Failed.
- A "How NASA handles this" drawer for each challenge shows the real NASA approach, with a link to the source.
- A Sources screen lists every source, all 6 flare records and the image and font credits.
- No accounts, no backend and no personal data. The nickname stays in memory only. The game works offline.

## Tech stack

- **React 19** (JSX) with **Vite 8**. There is no router: a `screen` value in state picks the screen, and `useReducer` holds the game state.
- **Plain CSS** with a pixel-art theme. Scenes and icons are drawn on `<canvas>`. Fonts (Inter, Press Start 2P, VT323) are bundled, not loaded from the internet.
- **Vitest** for tests and **ESLint** for linting.
- Game rules live in `marsbound/src/game/` as plain functions with no React imports.

```bash
cd marsbound
npm install
npm run dev     # start locally
npm test        # run the tests
npm run build   # production build
```

## Where NASA data is used

We follow NASA's rules: label real data honestly, never call saved data "live", and keep invented numbers clearly separate.

Every NASA item on screen carries a badge: **REAL NASA** (with source and date) or **GAME NUMBERS** (simplified values we made up for balance).

| Where | NASA data | Source |
|---|---|---|
| **Solar storm** (Dashboard, Radiation result, Debrief) | One of 6 real solar flare records (C-, M- and X-class, 2021–2025) is picked each game. The flare class sets the storm size: A/B/C = mild, M = medium, X = severe. The class and date are shown on screen. | NASA DONKI (Space Weather Database Of Notifications, Knowledge, Information) |
| **DONKI check** | When online, the game asks NASA's DONKI archive to confirm the saved flare and shows extra details. The badge then reads "fetched from DONKI archive". If the request fails or the player is offline, the game uses the saved copy ("saved copy of a DONKI record"). This never changes the storm size or the game. | `ccmc.gsfc.nasa.gov/DONKI/WS/get/FLR` |
| **Life Support drawer** | The ISS water system recovers 98% of its water. | NASA, ISS water recovery milestone |
| **Radiation drawer** | Curiosity's RAD measured about 0.67 mSv/day on the Mars surface and about 1.8 mSv/day on the way to Mars. | Hassler et al., *Science* (2013) |
| **Power drawer** | NASA and DOE are designing a fission power system of at least 40 kW, to be tested on the Moon first. | NASA |
| **Greenhouse drawer** | NASA's Veggie garden on the ISS. First fresh-food harvest in orbit in 2015; a lettuce harvest took 33 days. | NASA, "Growing Plants in Space" |
| **Earth Is Far Away drawer** | A message takes about 4 to 24 minutes to travel between Earth and Mars. | NASA, "Space Communications: 7 Things You Need to Know" |
| **Intro** | A real photo of a rock on Mars taken by the Perseverance rover's SuperCam (Sol 2031), stored as a local file. | NASA/JPL-Caltech/LANL/CNES/IRAP |

**Game numbers:** meter values, option costs and storm damage (−10 / −30 / −55 Crew Health) are invented for the game, and the Sources screen says so. The storm is *based on* a real flare. It is not a reading from Mars.

Full source list: [`docs/NASA_DATA_VERIFIED.md`](docs/NASA_DATA_VERIFIED.md) and [`docs/spaceWeatherEvents.json`](docs/spaceWeatherEvents.json). Image and font credits: [`marsbound/src/assets/credits.txt`](marsbound/src/assets/credits.txt).
