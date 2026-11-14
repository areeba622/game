// Challenge and option data. Numbers copied exactly from CLAUDE.md section 5.3.
// Do not change any effect numbers without asking.

export const CHALLENGES = {
  L: {
    id: 'L',
    title: 'Life Support',
    icon: '💨',
    intro: 'The oxygen system is acting up. Fix it before the air runs low.',
    options: {
      A: {
        title: 'Full Repair',
        text: 'Replace the broken part. Uses a lot of water and power.',
        effects: { O: 20, W: -12, P: -15, C: 5 },
      },
      B: {
        title: 'Quick Patch',
        text: 'A fast fix that costs a little oxygen but saves power.',
        effects: { O: -5, P: 3, C: 1 },
      },
      C: {
        title: 'Careful Fix',
        text: 'A slower repair that teaches the crew something new.',
        effects: { O: 10, W: -7, P: -8, C: 3, S: 2 },
      },
    },
  },
  R: {
    id: 'R',
    title: 'Radiation Shelter',
    icon: '☢️',
    intro: 'A solar storm is coming. Decide how to protect the crew.',
    options: {
      A: {
        title: 'Basic Shelter',
        text: 'Move the crew to the shelter room. Costs some water and power.',
        effects: { W: -2, P: -6 },
        sheltered: true,
      },
      B: {
        title: 'Reinforced Shelter',
        text: 'A stronger shelter that also teaches the crew about radiation.',
        effects: { W: -14, P: -2, S: 6 },
        sheltered: true,
      },
      C: {
        title: 'Study the Storm',
        text: 'Skip the shelter and study the storm instead. Risky.',
        effects: { W: -1, P: -4, S: 12 },
      },
    },
  },
  W: {
    id: 'W',
    title: 'Power Budget',
    icon: '🔋',
    intro: 'Power is running low. Choose how to manage it.',
    options: {
      A: {
        title: 'Balanced Plan',
        text: 'Share power evenly. Small gain to oxygen and crew health.',
        effects: { P: -6, O: 4, C: 4 },
      },
      B: {
        title: 'Research Push',
        text: 'Spend a lot of power to learn a lot. Hard on the crew.',
        effects: { P: -20, C: -3, S: 15 },
      },
      C: {
        title: 'Power Saving',
        text: 'Cut back on extras to save power. Costs oxygen and crew health.',
        effects: { P: 12, O: -3, C: -3, S: 2 },
      },
    },
  },
  G: {
    id: 'G',
    title: 'Greenhouse',
    icon: '🌱',
    intro: 'The greenhouse needs attention to grow food for the crew.',
    options: {
      A: {
        title: 'Full Planting',
        text: 'Plant as much as possible. The harvest arrives tomorrow.',
        effects: { W: -12, P: -14, S: 8 },
        later: { O: 10, C: 10 },
      },
      B: {
        title: 'Skip It',
        text: 'Leave the greenhouse alone for now. Crew health suffers a little.',
        effects: { C: -4 },
      },
      C: {
        title: 'Small Planting',
        text: 'Plant a smaller crop. The harvest arrives tomorrow.',
        effects: { W: -6, P: -7, S: 4 },
        later: { O: 5, C: 5 },
      },
    },
  },
  M: {
    id: 'M',
    title: 'Earth Is Far Away',
    icon: '📡',
    intro: 'A message to Earth takes a long time to answer. Decide what to send.',
    options: {
      A: {
        title: 'Status Update',
        text: 'Send a short update. The reply arrives tomorrow.',
        effects: { P: -5, C: 3 },
        later: { P: 6 },
      },
      B: {
        title: 'Ask for Advice',
        text: 'Ask Earth for help. The reply arrives tomorrow.',
        effects: { P: -10, C: 8 },
        later: { C: 5 },
      },
      C: {
        title: 'Urgent Call',
        text: 'Send an urgent message now. The reply arrives tomorrow.',
        effects: { P: -2, C: -10, S: 8 },
        later: { P: -8, C: -5 },
      },
    },
  },
};
