// The story introduction, as data. Edit the words here; nothing else needs to change.
// This is TEMPORARY sample copy. Keep sentences short (about 12 words) and explain each science word once.
//
// A "beat" is one screen of the story. Its `steps` run in order:
//   { say, t, badge? }   a character speaks (typewriter). `badge: 1` adds the REAL NASA chip.
//   { ask: [[reply, [steps...]], ...] }   the player picks a reply; the matching steps play next.
//   { widget }           an interactive card (see widgets/)
//   { scene }            switch the picture above the dialogue
//
// Placeholders in text:
//   {N}  the player's nickname (plain, "Nova")    {C}  "Commander Nova" (or just "Commander")
//   {FLARE}  the real flare record picked for this game, filled from state.event
//   {SIGNAL}  the NASA signal-delay sentence (verified in docs/NASA_DATA_VERIFIED.md, section B)
//
// Numbers in the text may only be ones that already appear in CLAUDE.md or WIREFRAMES.md
// (nightly upkeep, Science goal 15, jobs per Sol, 3 Sols, 5 challenges) or the NASA delay.
// Do not write storm damage numbers here: the Storm chapter works them out from the real rules.

export const SIGNAL =
  "Signal delay is about 4 minutes at Mars's closest and about 24 minutes at its farthest.";

const mc = (t, extra) => ({ say: 'mc', t, ...extra });

// Chapter names and the icon shown on the chapter banner.
export const CHAPTERS = [
  ['Landing', 'dish'],
  ['The Crew', 'C'],
  ['Command', 'star'],
  ['Survival', 'O'],
  ['Challenges', 'tool'],
  ['Three Sols', 'sun'],
  ['Solar Storm', 'cloud'],
  ['Decisions', 'list'],
  ['Accept', 'check'],
];

// Who can speak: [name, role]
export const WHO = {
  mc: ['Flight Director Rivera', 'Mission Control'],
  mira: ['Mira', 'Doctor'],
  kai: ['Kai', 'Engineer'],
  zuri: ['Zuri', 'Botanist'],
  leo: ['Leo', 'Geologist'],
  you: ['You', 'Commander'],
};

export const BEATS = [
  { ch: 0, scene: 'control', steps: [{ widget: 'answer' }] },
  {
    ch: 0,
    scene: 'control',
    steps: [
      mc('Mission Control to {N}. Do you read me?'),
      {
        ask: [
          ['Loud and clear, Mission Control!', [mc('Excellent! Your signal is strong.')]],
          ['Who is this?', [mc("I'm Flight Director Rivera, at Mission Control on Earth. The whole team is talking to you!")]],
          ['Ready for anything!', [mc('I love that spirit. You will need it.')]],
        ],
      },
      mc('Welcome, {N}! I have big news. Our astronauts have landed on Mars!'),
      { scene: 'mars' },
      mc("Look! That's the outpost right now. A smooth touchdown, safe and sound."),
      {
        ask: [
          ['Wow! They made it?!', [mc('They made it! Everyone is smiling inside their helmets.')]],
          ['Is everyone okay?', [mc('Everyone is okay. Tired and dusty, but very happy.')]],
        ],
      },
    ],
  },
  {
    ch: 1,
    scene: 'mars',
    steps: [
      mc('Let me introduce the astronauts. Tap each one to say hello.'),
      { widget: 'crew' },
      mc('Four brave astronauts, far from home. Mars is cold, dusty and very quiet.'),
      {
        ask: [
          [
            'How far away are they?',
            [mc('Very far. {SIGNAL}', { badge: 1 }), mc('So we cannot fix every problem from Earth.')],
          ],
          [
            'Can we just send help?',
            [mc('Not quickly. Mars is very far away.'), mc('So we cannot fix every problem from Earth.')],
          ],
        ],
      },
      mc('They need a leader on the spot.'),
    ],
  },
  {
    ch: 2,
    scene: 'mars',
    steps: [
      mc('That leader is you, {N}.'),
      { widget: 'stamp' },
      mc('From now on you are Commander of the Mars outpost. Tap each card to see what that means.'),
      { widget: 'duties' },
      { say: 'kai', t: "{C}, we're counting on you!" },
      {
        ask: [
          ["I won't let you down!", [{ say: 'kai', t: 'Hooray! Best Commander ever!' }]],
          ['I will think carefully.', [{ say: 'mira', t: 'Smart! Careful Commanders keep crews safe.' }]],
          ["Let's do this together!", [{ say: 'zuri', t: 'Teamwork! I love it.' }]],
        ],
      },
    ],
  },
  {
    ch: 3,
    scene: 'mars',
    steps: [
      mc('Your crew needs four things to stay alive. We call them resources. There is also Science. Tap each one.'),
      { widget: 'resources' },
      mc('If Oxygen, Water, Power or Crew Health ever hits zero, the mission ends.'),
      {
        ask: [
          [
            'What if one gets low?',
            [mc('You will see a word, a color and an icon: Healthy, OK, Low, Critical. Never just a color!')],
          ],
          ["I'll watch them closely!", [mc('That is what a good Commander does.')]],
        ],
      },
    ],
  },
  {
    ch: 4,
    scene: 'mars',
    steps: [
      mc('Things go wrong on Mars. We call them challenges. There are 5. Tap each to read the briefing.'),
      { widget: 'challenges' },
      mc('Every challenge has three options: A, B and C. Each one helps something and costs something.'),
      {
        ask: [
          ['Can I do everything?', [mc('No! You only get a few jobs each Sol. Choose wisely.')]],
          ['Which one matters most?', [mc('It depends on the day. A smart Commander checks the meters first.')]],
        ],
      },
    ],
  },
  {
    ch: 5,
    scene: 'mars',
    steps: [
      mc('Your mission lasts 3 Sols. A Sol is one day on Mars. Tap each Sol.'),
      { widget: 'sols' },
      mc('When a Sol ends, the night comes. The outpost uses air, water and power while everyone sleeps.'),
    ],
  },
  {
    ch: 6,
    scene: 'storm',
    steps: [
      mc('Now the tricky part. A solar storm is coming. It reaches Mars at the end of Sol 2.'),
      mc('We found a real NASA record of a solar flare: {FLARE}. Your storm is based on it.', { badge: 1 }),
      { widget: 'storm' },
      mc('The storm size changes every game. Shelter the crew before Sol 2 ends!'),
      {
        ask: [
          [
            'How do I shelter them?',
            [{ say: 'mira', t: 'Use the Radiation challenge. Move us to the shielded area, or build a water wall.' }],
          ],
          [
            'Can I ignore the storm?',
            [{ say: 'mira', t: 'You can, but our health will drop. Please do not!' }],
          ],
        ],
      },
    ],
  },
  {
    ch: 7,
    scene: 'mars',
    steps: [
      mc('Before you take command, let us practice one decision. Oxygen and Power are getting low. Pick a fix.'),
      { widget: 'practice' },
      mc('See the NOW and AFTER table? The real game shows it before every choice, and warns you if a choice would end the mission.'),
    ],
  },
  {
    ch: 8,
    scene: 'mars',
    steps: [mc('{N}, the crew is ready. Make your promises, then accept command.'), { widget: 'accept' }],
  },
];

// ---------- card text for the widgets ----------

export const CREW = [
  ['mira', 'Mira', 'Doctor', 'Hi {N}! I keep everyone healthy. Please protect us from radiation.'],
  ['kai', 'Kai', 'Engineer', 'I fix the machines. The oxygen system is making funny noises!'],
  ['zuri', 'Zuri', 'Botanist', 'I grow plants! Fresh food and air, but plants need one Sol to grow.'],
  ['leo', 'Leo', 'Geologist', 'I collect Mars science. Our goal is 15 Science points!'],
];

// [icon, title, text]
export const DUTIES = [
  ['C', 'Keep everyone alive', 'Watch Oxygen, Water, Power and Crew Health.'],
  ['list', 'Pick the jobs each Sol', 'You choose which challenges to solve.'],
  ['bulb', 'Think before you choose', 'Every choice helps one thing and costs another.'],
];

// [meter key, what it is, what happens to it]. Nightly numbers mirror CLAUDE.md 5.4.
export const RESOURCES = [
  ['O', 'The air everyone breathes.', 'Drops by 8 every night. Fix it with Life Support.'],
  ['W', 'For drinking, plants and shields.', 'Drops by 3 every night. Greenhouses use lots.'],
  ['P', 'Runs fans, heaters and machines.', 'Drops by 3 every night. Big jobs drain it.'],
  ['C', 'How well the astronauts feel.', 'Storms and risky jobs can hurt it.'],
  ['S', 'Points from experiments.', 'Never runs out. Reach 15 to meet the goal!'],
];

// [name, jobs, text, icon]. Jobs per Sol mirror CLAUDE.md 5.2.
export const SOLS = [
  ['Sol 1', 2, 'Calm day. Fix the basics and get ready.', 'sun'],
  ['Sol 2', 2, 'The storm hits at the end of this Sol!', 'cloud'],
  ['Sol 3', 1, 'Last day! Some rewards arrive after the mission ends.', 'moon'],
];

// The practice decision: [challenge id, option letter]. Titles and numbers come from CHALLENGES.
export const PRACTICE_OPTIONS = [
  ['L', 'A'],
  ['W', 'A'],
  ['W', 'C'],
];

// Mission Control's reaction after the practice choice. Words only, no numbers.
export const PRACTICE_FEEDBACK = {
  'L-A': 'Strong fix! Oxygen is much better. But Power dropped a lot. Every choice has a cost.',
  'W-A': 'A careful plan. Everything gets a little better and nothing breaks. Nice!',
  'W-C': 'Batteries are charging, but the air got thinner. Trade-offs!',
};

export const PLEDGES = [
  'Keep the crew alive',
  'Pick jobs each Sol',
  'Watch the meters',
  'Shelter the crew before the storm',
];

export const GAME_STORY_NOTE = 'GAME STORY: simulated mission. NASA has not landed people on Mars yet.';

// Photo caption exactly as in Prompt 1B.3b (same words the old Intro used).
export const PHOTO_ALT = 'Close-up of rocky Martian ground with pale, bright mineral patches.';
export const PHOTO_CAPTION =
  'Close-up of a rock on Mars, taken by the Perseverance rover. Not our outpost. NASA/JPL-Caltech/LANL/CNES/IRAP';

// Replace the {placeholders} in a line of text.
export function fillText(text, { nick, commander, flare }) {
  return text
    .replace(/\{N\}/g, nick)
    .replace(/\{C\}/g, commander)
    .replace(/\{FLARE\}/g, flare)
    .replace(/\{SIGNAL\}/g, SIGNAL);
}
