# MARSBOUND — NASA data record (checked 13 Nov 2026)

## A. Solar flare records (NASA DONKI, "Solar Flare" pages)

"Checked" column: **Opened** = I opened the DONKI page and read the values. **Search text** = I read the values in the page text returned by a search tool, but the page itself would not open for me (the site blocks automated fetches on some addresses). Open those two yourself.

| id | Size | Class | Start / Peak / End (UTC) | Source region | Activity ID | Checked | URL |
|---|---|---|---|---|---|---|---|
| evt-1a | 1 mild | C1.6 | 2021-09-26 11:20 / 11:24 / 11:28 | S28W19 (12871) | 2021-09-26T11:20:00-FLR-001 | Search text | https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/17832/1 |
| evt-1b | 1 mild | C1.2 | 2023-08-25 11:11 / 11:17 / 11:24 | N09W67 (13405) | 2023-08-25T11:11:00-FLR-001 | **Opened** | https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/26632/-1 |
| evt-2a | 2 medium | M5.9 | 2024-05-10 13:58 / 14:11 / 14:23 | S16W40 (13664) | 2024-05-10T13:58:00-FLR-001 | **Opened** | https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/30680/2 |
| evt-2b | 2 medium | M6.4 | 2025-09-28 08:34 / 08:43 / 08:49 | N03E59 (14232) | 2025-09-28T08:34:00-FLR-001 | **Opened** | https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/41453/-1 |
| evt-3a | 3 severe | X8.7 | 2024-05-14 16:46 / 16:51 / 17:02 | S19W90 (13664) | 2024-05-14T16:46:00-FLR-001 | **Opened** | https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/30849/-1 |
| evt-3b | 3 severe | X9.0 | 2024-10-03 12:08 / 12:18 / 12:27 | S15W05 (13842) | 2024-10-03T12:08:00-FLR-001 | Search text | https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/33693/4 |

Severity rule used: A/B/C = 1, M = 2, X = 3.
If a link does not open: NASA moved DONKI on 30 Sep 2026. Replace the host (`kauai.` or `webtools.`) with `ccmc.gsfc.nasa.gov` and keep the same path.
Extra confirmation that the X-class flares are real and notable: NASA says the 14 May 2024 flare was the largest of Solar Cycle 25 at X8.7 (NASA SVS, https://svs.gsfc.nasa.gov/14592), and the 3 Oct 2024 flare was X9.0 (NASA Science, https://science.nasa.gov/blogs/solar-cycle-25/2024/10/03/sun-releases-strong-solar-flare-6).

## B. Facts for the NASA drawers

| Challenge | Fact | Source |
|---|---|---|
| Radiation | Curiosity's RAD measured an average of 0.67 mSv/day on the Mars surface (Aug 2012 – Jun 2013) and about 1.8 mSv/day inside the spacecraft on the way to Mars. Mars has no global magnetic field and a thin atmosphere. | Hassler et al., Science, 2013, DOI 10.1126/science.1244797. Read in: https://www.sci.news/space/science-mars-radiation-measurements-surface-01629.html and https://phys.org/news/2013-12-scientists-publish-surface-mars.amp (SwRI press release: https://www.swri.org/press-release/swri-scientists-publish-first-radiation-measurements-surface-mars) |
| Earth is far away | Signal delay is about 4 minutes at Mars's closest and about 24 minutes at its farthest. | NASA: https://www.nasa.gov/missions/tech-demonstration/space-communications-7-things-you-need-to-know |
| Greenhouse | On 10 Aug 2015 ISS astronauts Kelly, Lindgren and Yui ate "Outredgeous" red romaine grown in Veggie. | collectSPACE: https://www.collectspace.com/news/news-081015c-astronauts-space-grown-lettuce.html |
| Life support | The ISS water system reached 98% water recovery using the Brine Processor Assembly. | NASA: https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station |
| Power | NASA and DOE are designing a fission power system of at least 40 kW, to be demonstrated on the Moon first. Not yet flown. | NASA: https://www.nasa.gov/humans-in-space/fission-system-to-power-exploration-on-the-moons-surface-and-beyond/ and https://ntrs.nasa.gov/citations/20240011694 |

## C. Still to confirm yourself (I could not)
- Open `evt-1a` and `evt-3b` and check class and date.
- Open the SwRI link and confirm 0.67 and 1.8 in the original release or the paper.
- ISS radiation bar: needs NASA RadLab data (Day 2). Do not add a number from memory.
