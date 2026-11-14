// Kid-facing words for the challenges.
// Icons and titles: docs/KID_TEXT.md (wins over challenges.js for words and icons).
// Card one-liners: docs/WIREFRAMES.md Screen 4. Warning chips: CLAUDE.md section 8.
// Numbers never live here; they stay in src/game/challenges.js.

export const CHALLENGE_ORDER = ['L', 'R', 'W', 'G', 'M'];

export const CHALLENGE_TEXT = {
  L: { icon: '🫧', title: 'Life Support', short: 'Fix oxygen', warning: 'Costs 8 Oxygen each night if not done' },
  R: { icon: '☢️', title: 'Radiation Shelter', short: 'Protect crew', warning: 'Storm at end of Sol 2' },
  W: { icon: '⚡', title: 'Power Budget', short: 'Share power', warning: 'Costs 4 Power each night if not done' },
  G: { icon: '🌱', title: 'Greenhouse', short: 'Plants need 1 Sol to grow' },
  M: { icon: '📡', title: 'Earth Is Far Away', short: 'Reply takes 1 Sol' },
};

export const METERS = [
  { key: 'O', label: 'Oxygen', icon: '🫧' },
  { key: 'W', label: 'Water', icon: '💧' },
  { key: 'P', label: 'Power', icon: '⚡' },
  { key: 'C', label: 'Crew Health', icon: '🧑‍🚀' },
];

export const STORM_SIZE = { 1: 'MILD', 2: 'MEDIUM', 3: 'SEVERE' };
