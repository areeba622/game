const METER_LABEL = { O: 'Oxygen', W: 'Water', P: 'Power', C: 'Crew Health' };

function doneOnSol(state, cid, sol) {
  return state.history.some((entry) => entry.cid === cid && entry.sol === sol);
}

function neverDone(state, cid) {
  return !state.history.some((entry) => entry.cid === cid);
}

export function buildDebrief(state) {
  const good = [];
  const better = [];

  if (state.sheltered) {
    good.push('You protected the crew before the storm.');
  }

  const stormHit = state.log.some((entry) => entry.kind === 'storm');
  if (stormHit && !state.sheltered) {
    better.push('The storm hurt the crew. Shelter before the end of Sol 2.');
  }

  if (doneOnSol(state, 'L', 1)) {
    good.push('You fixed the oxygen problem early.');
  } else if (neverDone(state, 'L')) {
    better.push('The broken oxygen system wasted air every night.');
  }

  if (doneOnSol(state, 'M', 3)) {
    better.push('The reply came after the mission. Send messages early.');
  }

  if (doneOnSol(state, 'G', 3)) {
    better.push('Plants did not have time to grow.');
  }

  let tip = null;
  if (state.phase === 'failed') {
    tip = `The crew ran out of ${state.failReason}. Try again and plan sooner.`;
  } else {
    const meters = { O: state.O, W: state.W, P: state.P, C: state.C };
    const lowestKey = Object.keys(meters).reduce((a, b) => (meters[a] <= meters[b] ? a : b));
    if (meters[lowestKey] < 40) {
      tip = `Your lowest meter was ${METER_LABEL[lowestKey]} (${meters[lowestKey]}).`;
    }
  }

  return { good, better, tip };
}
