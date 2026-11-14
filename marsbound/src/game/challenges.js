// Challenge and option data. Numbers copied exactly from CLAUDE.md section 5.3.
// Icon, title, intro and option title/text copied exactly from docs/KID_TEXT.md.
// Do not change any effect numbers without asking.

export const CHALLENGES = {
  L: {
    id: 'L',
    title: 'Life Support',
    icon: '🫧',
    intro: 'The machine that makes oxygen is slow. The crew has some backup air, but not much. How will you keep everyone breathing?',
    options: {
      A: {
        title: 'Maximum generator output',
        text: 'The generator runs at full power. You get lots of air, but it uses water and power.',
        effects: { O: 20, W: -12, P: -15, C: 5 },
      },
      B: {
        title: 'Switch to backup oxygen',
        text: 'The crew uses stored air tanks. It saves water and power, but the tanks get lower.',
        effects: { O: -5, P: 3, C: 1 },
      },
      C: {
        title: 'Normal output + investigate',
        text: 'Normal air making while you look for the broken part. You learn something new.',
        effects: { O: 10, W: -7, P: -8, C: 3, S: 2 },
      },
    },
  },
  R: {
    id: 'R',
    title: 'Radiation Shelter',
    icon: '☢️',
    intro: 'A solar storm is coming at the end of Sol 2. Radiation can hurt the crew. Do you shelter, shield, or keep working?',
    options: {
      A: {
        title: 'Move crew to shielded area',
        text: 'Everyone goes into the safe room. It is quick and cheap. Outside science waits.',
        effects: { W: -2, P: -6 },
        sheltered: true,
      },
      B: {
        title: 'Surround the shelter with water',
        text: 'A thick wall of water protects the shelter. It uses lots of water, but some science can go on.',
        effects: { W: -14, P: -2, S: 6 },
        sheltered: true,
      },
      C: {
        title: 'Keep doing surface research',
        text: 'The team keeps working outside. Lots of science, but the crew is not protected.',
        effects: { W: -1, P: -4, S: 12 },
      },
    },
  },
  W: {
    id: 'W',
    title: 'Power Budget',
    icon: '⚡',
    intro: 'The habitat does not have enough power for everything. Heaters, air machines, radios and the science lab all want electricity. Who goes first?',
    options: {
      A: {
        title: 'Essential systems first',
        text: 'Air machines and heaters get power first. It is safe, but the science lab waits.',
        effects: { P: -6, O: 4, C: 4 },
      },
      B: {
        title: 'Science first',
        text: 'The science lab gets lots of power. Great science, but the battery drains fast.',
        effects: { P: -20, C: -3, S: 15 },
      },
      C: {
        title: 'Energy-saving mode',
        text: 'Switch off what you do not need. Power is saved, but air and crew get a little worse.',
        effects: { P: 12, O: -3, C: -3, S: 2 },
      },
    },
  },
  G: {
    id: 'G',
    title: 'Greenhouse',
    icon: '🌱',
    intro: 'Fresh plants can give the crew food and air. But plants need water, power and time. Will you plant now?',
    options: {
      A: {
        title: 'Expand the greenhouse',
        text: 'A big greenhouse! It uses lots of water and power now, and gives fresh air and food tomorrow.',
        effects: { W: -12, P: -14, S: 8 },
        later: { O: 10, C: 10 },
      },
      B: {
        title: 'Keep eating packed meals',
        text: 'Keep eating packed meals. It costs nothing, but the crew gets tired of the same food.',
        effects: { C: -4 },
      },
      C: {
        title: 'Start a small crop test',
        text: 'A small test garden. It costs less and gives less tomorrow.',
        effects: { W: -6, P: -7, S: 4 },
        later: { O: 5, C: 5 },
      },
    },
  },
  M: {
    id: 'M',
    title: 'Earth Is Far Away',
    icon: '📡',
    intro: 'A warning light came on. You sent a message to Earth, but the reply will take a long time. What will the crew do while they wait?',
    options: {
      A: {
        title: 'Safe backup mode',
        text: 'Put the habitat in safe mode and wait. It uses some power and keeps the crew safe.',
        effects: { P: -5, C: 3 },
        later: { P: 6 },
      },
      B: {
        title: 'Follow the onboard procedure',
        text: 'Follow your training and fix it yourselves. It costs more power but makes the crew safer.',
        effects: { P: -10, C: 8 },
        later: { C: 5 },
      },
      C: {
        title: 'Wait and keep doing science',
        text: 'Keep doing science and look at the warning later. You learn more, but it is a risk.',
        effects: { P: -2, C: -10, S: 8 },
        later: { P: -8, C: -5 },
      },
    },
  },
};
