// Facts come only from docs/NASA_DATA_VERIFIED.md, section B. Do not invent, round or add values.

export const SPACE_WEATHER_LABEL = 'REAL NASA · saved copy of a DONKI record';

export const NASA_CONTENT = {
  L: {
    title: 'Turning Wastewater Into Drinking Water',
    text:
      "The ISS recycles water so the crew doesn't run out. A device called the Brine Processor Assembly squeezes extra water out of leftover wastewater. Together, the station's water system now reaches 98% water recovery.",
    lesson:
      "On a long trip to Mars, almost nothing can be wasted — even water gets used again and again.",
    sourceName: 'NASA — ISS Water Recovery Milestone',
    sourceUrl:
      'https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station',
    badge: 'REAL',
    gameNote: 'Game numbers in MARSBOUND are simplified and simulated.',
  },
  R: {
    title: 'Measuring Radiation on Mars',
    text:
      "NASA's Curiosity rover carries a tool called RAD that measures radiation, a kind of energy that can harm the body in large doses. From August 2012 to June 2013, RAD measured an average of 0.67 millisieverts (a unit for radiation dose) each day on the Martian surface, and about 1.8 millisieverts per day inside the spacecraft on the trip there. Mars has no global magnetic field and only a thin atmosphere, so it has much less protection from radiation than Earth.",
    lesson:
      "Mars doesn't shield astronauts the way Earth does, so a mission needs a shelter plan before a storm hits.",
    sourceName: "Hassler et al., Science (2013), via SwRI",
    sourceUrl:
      'https://www.swri.org/press-release/swri-scientists-publish-first-radiation-measurements-surface-mars',
    badge: 'REAL',
    gameNote: 'Game numbers in MARSBOUND are simplified and simulated.',
  },
  W: {
    title: 'A Power Plant for the Moon and Mars',
    text:
      'NASA and the Department of Energy are designing a fission power system, a way to make electricity by splitting atoms, built to produce at least 40 kilowatts of power. It will be demonstrated on the Moon first. It has not yet flown.',
    lesson:
      "Future Mars crews will need a strong, steady power source that doesn't depend on sunlight alone.",
    sourceName: 'NASA — Fission System to Power Exploration on the Moon and Beyond',
    sourceUrl:
      'https://www.nasa.gov/humans-in-space/fission-system-to-power-exploration-on-the-moons-surface-and-beyond/',
    badge: 'REAL',
    gameNote: 'Game numbers in MARSBOUND are simplified and simulated.',
  },
  G: {
    title: 'Growing Lettuce in Space',
    text:
      "NASA's Veggie is a small space garden on the ISS, about the size of a carry-on suitcase, usually holding six plants. Each plant grows in a 'pillow,' a pouch of clay-based growth material and fertilizer that holds water and nutrients near the roots. Its first lettuce crop gave the first on-orbit harvest of fresh produce in the summer of 2015, and in NASA's lettuce tests a harvest came after 33 days.",
    lesson:
      'Growing food in space takes planning — plants need water, power and time before they are ready.',
    sourceName: 'NASA — Growing Plants in Space',
    sourceUrl:
      'https://www.nasa.gov/exploration-research-and-technology/growing-plants-in-space/',
    badge: 'REAL',
    gameNote: 'Game numbers in MARSBOUND are simplified and simulated.',
  },
  M: {
    title: 'Waiting for a Message From Earth',
    text:
      "Mars is so far from Earth that a radio signal, an invisible wave that carries a message, takes a long time to travel between them. At their closest, a signal takes about 4 minutes one way; at their farthest, about 24 minutes. A quick back-and-forth conversation just isn't possible across that distance.",
    lesson:
      "Mars astronauts must make many decisions on their own, because Earth's help is always minutes away.",
    sourceName: 'NASA — Space Communications: 7 Things You Need to Know',
    sourceUrl:
      'https://www.nasa.gov/missions/tech-demonstration/space-communications-7-things-you-need-to-know',
    badge: 'REAL',
    gameNote: 'Game numbers in MARSBOUND are simplified and simulated.',
  },
};

export const RADIATION_BARS = [
  { label: 'Mars surface', mSvPerDay: 0.67 },
  { label: 'Trip to Mars (inside spacecraft)', mSvPerDay: 1.8 },
  // TODO (Day 2): ISS bar from NASA RadLab
];
