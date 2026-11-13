# Phase 3A prompt for Claude Code (filled in with real, sourced data)

Paste everything inside the quote block below into Claude Code (Person A).

> Read CLAUDE.md first. Create these files. **Use only the facts and flare records I give below. Do not invent, estimate, round or add anything.** If something is unclear, ask me.
>
> **1. `src/data/spaceWeatherEvents.json`** — if this file already exists and matches the table below, leave it unchanged; if anything differs, tell me instead of overwriting. It is an array of objects `{ id, severity, date, classType, url }`. Severity from the class letter: A/B/C = 1, M = 2, X = 3. Use exactly these 6 records (all from NASA DONKI, "Solar Flare" pages):
>
> | id | severity | date (peak, UTC) | classType | url |
> |---|---|---|---|---|
> | evt-1a | 1 | 2021-09-26 | C1.6 | https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/17832/1 |
> | evt-1b | 1 | 2023-08-25 | C1.2 | https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/26632/-1 |
> | evt-2a | 2 | 2024-05-10 | M5.9 | https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/30680/2 |
> | evt-2b | 2 | 2025-09-28 | M6.4 | https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/41453/-1 |
> | evt-3a | 3 | 2024-05-14 | X8.7 | https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/30849/-1 |
> | evt-3b | 3 | 2024-10-03 | X9.0 | https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/33693/4 |
>
> **2. `src/game/storm.js`** exporting `pickStorm(events)` that returns a random event.
>
> **3. `src/data/nasaContent.js`** — one entry per challenge (L, R, W, G, M) with: `title` (one line), `text` (2–3 short sentences for kids aged 7–12, explain each science word once), `lesson` (one line), `sourceName`, `sourceUrl`, and `badge` ('REAL' for facts from NASA, 'GAME' for simulated game numbers). Also export `SPACE_WEATHER_LABEL` = "REAL NASA · saved copy of a DONKI record". Use ONLY these confirmed facts:
>
> - **R (Radiation):** NASA's Curiosity rover carries an instrument called RAD that measured radiation on the surface of Mars. From August 2012 to June 2013 it measured an average of **0.67 millisieverts (mSv) per day** on the surface. On the journey to Mars, inside the spacecraft, it measured about **1.8 mSv per day**. Mars has no global magnetic field and a thin atmosphere, so it has much less protection from radiation than Earth. (A millisievert measures how much radiation the body takes in.) Source: Hassler et al., "Mars' Surface Radiation Environment Measured with the Mars Science Laboratory's Curiosity Rover", *Science*, 24 January 2014 (published online 9 December 2013), DOI 10.1126/science.1244797. Link: https://www.swri.org/press-release/swri-scientists-publish-first-radiation-measurements-surface-mars
> - **M (Earth is far away):** A radio signal from Mars takes about **4 to 24 minutes** one way to reach Earth. About 4 minutes when Mars is closest (about 35 million miles), about 24 minutes when it is farthest (about 250 million miles). So astronauts would wait up to 24 minutes for a message to arrive, then up to 24 more for the reply. Source: NASA, "Space Communications: 7 Things You Need to Know". Link: https://www.nasa.gov/missions/tech-demonstration/space-communications-7-things-you-need-to-know
> - **G (Greenhouse):** NASA's Veggie is a small garden on the International Space Station. It is about the size of a carry-on suitcase and usually holds six plants. Each plant grows in a "pillow" filled with clay-based growth material and fertilizer, and the pillows help spread water, nutrients and air around the roots. Veggie's first test crop, red romaine lettuce called "Outredgeous", gave the first harvest of fresh produce grown on the station, in the summer of 2015. In NASA's lettuce tests, a plant picked in one harvest was picked after 33 days. NASA says crews on long missions will need to grow some of their own food. Source: NASA, "Growing Plants in Space", NASA, "Third Lettuce Crop Begins Growing Aboard Station" and NASA Technical Reports Server 20190028955. Links: https://www.nasa.gov/exploration-research-and-technology/growing-plants-in-space/ and https://www.nasa.gov/missions/station/third-lettuce-crop-begins-growing-aboard-station/ and https://ntrs.nasa.gov/citations/20190028955
> - **L (Life Support):** The International Space Station has a system called ECLSS (Environmental Control and Life Support System). It provides oxygen to breathe, recycles water, and removes carbon dioxide. NASA reported in 2023 that the station's water recovery system reached **98% water recovery**, thanks to a device called the Brine Processor Assembly. Source: NASA, "NASA Achieves Water Recovery Milestone on International Space Station". Link: https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station
> - **W (Power):** NASA is working with the U.S. Department of Energy and industry on a fission surface power system that would provide at least **40 kilowatts** of power (enough to continuously run about 30 households for ten years). It would be demonstrated on the Moon first, and the design could later help power Mars missions. It is still under development and has not flown. Source: NASA, "Fission System to Power Exploration on the Moon's Surface and Beyond" and NASA Technical Reports Server 20240011694. Links: https://www.nasa.gov/humans-in-space/fission-system-to-power-exploration-on-the-moons-surface-and-beyond/ and https://ntrs.nasa.gov/citations/20240011694
>
> For the R entry also export `RADIATION_BARS`: `[{ label: 'Mars surface', mSvPerDay: 0.67 }, { label: 'Trip to Mars (inside spacecraft)', mSvPerDay: 1.8 }]`. Leave a clearly marked `// TODO (Day 2): ISS bar from NASA RadLab` placeholder. Do not add an ISS number.
>
> Every entry ends with a `gameNote`: "Game numbers in MARSBOUND are simplified and simulated." Keep all sentences short. Show me the files when done.

---

## Notes for you (not for Claude Code)

- **Flare records:** the six records match `docs/spaceWeatherEvents.json` and `docs/NASA_DATA_VERIFIED.md`. Four pages (evt-2a, evt-2b, evt-3a, and evt-1b) were opened and read; evt-1a and evt-3b were read only in search text. Before you submit, open all six links and check the class and date. The correct URL numbers are the ones in the table above (for example `41453/-1` and `30849/-1`). If a link does not open, replace an old host (`kauai.ccmc.gsfc.nasa.gov` or `webtools.ccmc.gsfc.nasa.gov`) with `ccmc.gsfc.nasa.gov` and keep the same path.
- **Dates:** each date is the day the flare peaked, in UTC (the 2024-05-14 X8.7 flare peaked at 16:51 UTC, which is 12:51 p.m. US Eastern Time, so some news pages say "12:51 p.m. ET").
- **Radiation numbers (0.67 and 1.8):** these are in the Science paper's published results. I read them in the SwRI press coverage (via copies on phys.org and sci.news), not in the paper itself. If you have time, open the SwRI link and confirm both numbers.
- **Veggie:** all three Greenhouse facts now come from NASA pages (nasa.gov and the NASA Technical Reports Server). The earlier collectSPACE source and the 10 Aug 2015 "first eaten" date were removed because no NASA page was found for them. The 33-day figure is from the NASA Technical Reports Server record (single harvest after 33 days). Open the three links and confirm each fact on its page before you submit.
- **The ISS radiation bar** is not included. It needs the RadLab data (Day 2). Do not let Claude Code invent it.
