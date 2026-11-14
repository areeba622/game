import { commanderName } from './commander.js';

// One Mission Control line: the first that applies, in the priority order of the
// text bank in docs/WIREFRAMES.md. Earth reply and Harvest lines go in the Morning report.
const RAN_OUT = { O: 'air', W: 'water', P: 'power', C: 'health' };

export function missionControlLine(state) {
  const commander = commanderName(state);
  const empty = ['O', 'W', 'P', 'C'].find((key) => state[key] === 0);

  if (state.phase === 'failed' || empty) {
    return `The crew ran out of ${RAN_OUT[empty] ?? 'supplies'}. Try again and plan sooner.`;
  }
  if (state.P <= 20) return 'Power is almost empty! If it reaches zero, the mission ends.';
  if (state.sol === 2 && !state.done.R) return `The storm is close, ${commander}. Shelter the crew now!`;
  if (state.C < 40) return 'The crew is not well. Protect them.';
  if (state.O < 40) return 'Oxygen is low. Think about fixing the oxygen system.';
  if (state.P < 40) return 'Power is low. Big jobs may drain the battery.';
  if (state.W < 40) return 'Water is low. Water shields and greenhouses use a lot.';
  if (state.sol > 1 && !state.done.L) return 'The oxygen system is still broken. It wastes extra air every Sol.';
  // Defaults. Sol 1 is the text-bank line. The Sol 2 and Sol 3 lines are not in the
  // text bank yet (TODO: add them to docs/WIREFRAMES.md) so the Sol 1 line is never shown late.
  if (state.sol === 2) {
    return state.sheltered
      ? `The crew is sheltered, ${commander}. Pick two more jobs for today.`
      : `${commander}, pick two more jobs. The storm comes tonight.`;
  }
  if (state.sol === 3) return `Last Sol, ${commander}! Pick the final job. The storm has passed.`;
  return `${commander}, pick two jobs for today. A storm is coming at the end of Sol 2.`;
}
