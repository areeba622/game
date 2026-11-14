// Kid-facing words that are not in src/game/challenges.js.
// Challenge icons, titles, intros and option words come from CHALLENGES
// (copied from docs/KID_TEXT.md). Card one-liners: docs/WIREFRAMES.md Screen 4.
// Warning chips: CLAUDE.md section 8. Fixed lines: WIREFRAMES.md text bank.
// Numbers never live here; they stay in src/game/challenges.js.

export const CHALLENGE_ORDER = ['L', 'R', 'W', 'G', 'M'];

export const CARD_TEXT = {
  L: { short: 'Fix oxygen', warning: 'Costs 8 Oxygen each night if not done' },
  R: { short: 'Protect crew', warning: 'Storm at end of Sol 2' },
  W: { short: 'Share power', warning: 'Costs 4 Power each night if not done' },
  G: { short: 'Plants need 1 Sol to grow' },
  M: { short: 'Reply takes 1 Sol' },
};

export const METER_INFO = {
  O: { label: 'Oxygen', icon: '🫧' },
  W: { label: 'Water', icon: '💧' },
  P: { label: 'Power', icon: '⚡' },
  C: { label: 'Crew Health', icon: '🧑‍🚀' },
  S: { label: 'Science', icon: '🔬' },
};

export const METERS = ['O', 'W', 'P', 'C'].map((key) => ({ key, ...METER_INFO[key] }));

export const STORM_SIZE = { 1: 'MILD', 2: 'MEDIUM', 3: 'SEVERE' };

// Night numbers shown in the Confirm pop-up note. They only MIRROR CLAUDE.md 5.4
// (the real rules live in src/game/game.js). Never change them; ask first.
export const NIGHT_NOTE = {
  upkeep: '−8 O −3 W −3 P',
  lifeSupportMissing: '−8 O',
  powerBudgetMissing: '−4 P',
  stormDamage: { 1: 10, 2: 30, 3: 55 },
};

export const HARVEST_LINE = 'Your crops grew! Fresh plants gave the crew food and air.';

export const EARTH_REPLY_LINE = {
  A: 'Mission Control: Safe mode was a good choice. Power +6.',
  B: 'Mission Control: Your crew followed the right steps. Crew Health +5.',
  C: 'Mission Control: The problem got worse while you waited. Power −8, Crew Health −5.',
};

export const SCIENCE_GOAL = 15;

export const ARRIVING_LABEL = { G: 'Greenhouse harvest', M: "Earth's reply" };

// Classroom questions (docs/KID_TEXT.md). Two are shown on the Debrief.
export const CLASSROOM_QUESTIONS = [
  "Why can't astronauts wait for Earth to answer?",
  'When is it smart to keep working in a storm? When is it not?',
  'What did you give up to protect the crew?',
  'Why does a greenhouse need a plan on Sol 1?',
  'What would you do differently on a second try?',
];

// Pick 2 questions that fit what happened, then fill with general ones.
export function pickClassroomQuestions(state) {
  const did = (cid, sol) => state.history.some((h) => h.cid === cid && (sol === undefined || h.sol === sol));
  const picks = [];
  if (did('M', 3)) picks.push(0);
  if (!state.sheltered || did('R', 3)) picks.push(1);
  if (did('G', 3)) picks.push(3);
  if (state.sheltered) picks.push(2);
  picks.push(4, 2, 0);
  return [...new Set(picks)].slice(0, 2).map((i) => CLASSROOM_QUESTIONS[i]);
}
