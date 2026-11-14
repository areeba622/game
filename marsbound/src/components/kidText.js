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

export const HARVEST_LINE = 'Your crops grew! Fresh plants gave the crew food and air.';

export const EARTH_REPLY_LINE = {
  A: 'Mission Control: Safe mode was a good choice. Power +6.',
  B: 'Mission Control: Your crew followed the right steps. Crew Health +5.',
  C: 'Mission Control: The problem got worse while you waited. Power −8, Crew Health −5.',
};
